import firebaseConfig from '../../firebase-applet-config.json';
import { getWorkspaceAccessToken, auth, googleAuthProvider, signInWithPopup, setWorkspaceAccessToken } from '../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { AppItem, AdminActivityLog } from '../types';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  driveFileId?: string;
}

// Ensure user is signed in with Google and has active access token
export async function ensureGoogleWorkspaceAuth(): Promise<string> {
  const currentToken = getWorkspaceAccessToken();
  if (currentToken) return currentToken;

  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result) as any;
    const token = credential?.accessToken;
    if (token) {
      setWorkspaceAccessToken(token);
      return token;
    }
  } catch (err: any) {
    console.error('Google Sign-In for Workspace failed:', err);
    throw new Error('Sila log masuk dengan Google untuk mengakses perkhidmatan Google Workspace.');
  }

  throw new Error('Gagal mendapatkan token OAuth Google.');
}

// 1. Google Drive Integration
export async function listGoogleDriveFiles(query: string = "trashed = false"): Promise<GoogleDriveFile[]> {
  const token = await ensureGoogleWorkspaceAuth();
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,webViewLink,webContentLink,iconLink)&pageSize=25`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memuat turun senarai fail Google Drive.');
  }

  const data = await res.json();
  return data.files || [];
}

// 2. Google Picker Integration
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export function loadGooglePickerApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.picker) {
      resolve();
      return;
    }

    if (window.gapi) {
      window.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Gagal memuatkan Google Picker SDK.')),
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('picker', {
        callback: () => resolve(),
        onerror: () => reject(new Error('Gagal memuatkan Google Picker SDK.')),
      });
    };
    script.onerror = () => reject(new Error('Gagal memuatkan skrip Google API.'));
    document.body.appendChild(script);
  });
}

export async function openGooglePicker(onPicked: (file: GoogleDriveFile) => void): Promise<void> {
  const token = await ensureGoogleWorkspaceAuth();
  await loadGooglePickerApi();

  if (!window.google?.picker) {
    throw new Error('Google Picker tidak tersedia pada pelayar anda.');
  }

  const apiKey = firebaseConfig.apiKey;
  const appId = firebaseConfig.appId;

  const docsView = new window.google.picker.DocsView()
    .setIncludeFolders(true)
    .setSelectFolderEnabled(false);

  const picker = new window.google.picker.PickerBuilder()
    .addView(docsView)
    .setOAuthToken(token)
    .setDeveloperKey(apiKey)
    .setAppId(appId)
    .setTitle('Pilih Fail APK, Installer atau Dokumen dari Google Drive')
    .setCallback((data: any) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const doc = data.docs[0];
        onPicked({
          id: doc.id,
          name: doc.name,
          mimeType: doc.mimeType,
          size: doc.sizeBytes ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : undefined,
          webViewLink: doc.url,
          webContentLink: `https://drive.google.com/uc?export=download&id=${doc.id}`,
        });
      }
    })
    .build();

  picker.setVisible(true);
}

// 3. Google Sheets Integration - Export Apps & Download History
export async function exportCatalogToGoogleSheets(
  apps: AppItem[],
  logs?: AdminActivityLog[]
): Promise<{ spreadsheetUrl: string; spreadsheetId: string }> {
  const token = await ensureGoogleWorkspaceAuth();

  // Create a new Spreadsheet
  const title = `RazifApps@nasadef Katalog & Rekod Muat Turun (${new Date().toLocaleDateString('ms-MY')})`;
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Katalog Perisian',
            gridProperties: { rowCount: apps.length + 10, columnCount: 8 },
          },
        },
        {
          properties: {
            title: 'Aktiviti Pentadbir',
            gridProperties: { rowCount: 100, columnCount: 5 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mencipta Google Sheet.');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Prepare App Catalog Data
  const appRows = [
    ['ID', 'Nama Perisian', 'Versi', 'Kategori', 'Saiz Fail', 'Jumlah Muat Turun', 'Penilaian', 'Pautan Muat Turun'],
    ...apps.map(a => [
      a.id,
      a.name,
      a.version,
      a.category,
      a.fileSize,
      a.downloadsCount,
      a.rating,
      a.downloadUrl,
    ]),
  ];

  // Append data to Katalog Perisian
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Katalog Perisian'!A1:H${appRows.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `'Katalog Perisian'!A1:H${appRows.length}`,
      majorDimension: 'ROWS',
      values: appRows,
    }),
  });

  // Prepare Admin Activity Logs Data if provided
  if (logs && logs.length > 0) {
    const logRows = [
      ['ID Log', 'Emel Pentadbir', 'Tindakan', 'Butiran Tindakan', 'Masa'],
      ...logs.map(l => [
        l.id,
        l.adminEmail,
        l.action,
        l.details,
        l.timestamp,
      ]),
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Aktiviti Pentadbir'!A1:E${logRows.length}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `'Aktiviti Pentadbir'!A1:E${logRows.length}`,
        majorDimension: 'ROWS',
        values: logRows,
      }),
    });
  }

  return { spreadsheetUrl, spreadsheetId };
}

// 4. Google Keep & Notes Integration
const NOTES_STORAGE_KEY = 'nasadef_google_workspace_notes';

export const INITIAL_WORKSPACE_NOTES: WorkspaceNote[] = [
  {
    id: 'note-1',
    title: 'Nota Rasmi: Saluran Muat Turun RazifApps@nasadef®',
    content: 'Semua fail pemasangan APK, ISO Windows, dan utiliti USB Bootable telah disemak keselamatan SHA-256 dan bebas malware. Pentadbir yang log masuk mempunyai akses muat turun terus tanpa sekatan.',
    tags: ['Admin', 'Dasar Rasmi'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: true,
  },
  {
    id: 'note-2',
    title: 'Panduan Kemaskini APK dan Google Play Console',
    content: 'Untuk setiap versi baru, gunakan Release Notes Generator AI bagi menjana What\'s New dalam Bahasa Melayu dan Bahasa Inggeris di bawah 500 aksara sebelum penerbitan.',
    tags: ['Google Play', 'Release Notes'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
  },
];

export function getLocalWorkspaceNotes(): WorkspaceNote[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to get notes from storage', e);
  }
  return INITIAL_WORKSPACE_NOTES;
}

export function saveLocalWorkspaceNotes(notes: WorkspaceNote[]) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to storage', e);
  }
}

// Sync note to Google Drive as a Keep-compatible text file
export async function syncNoteToGoogleDrive(note: WorkspaceNote): Promise<string> {
  const token = await ensureGoogleWorkspaceAuth();
  
  const fileContent = `# ${note.title}\n\nTags: ${note.tags.join(', ')}\nTarikh: ${note.createdAt}\n\n${note.content}\n\n---\nRazifApps@nasadef® Keep Notes Sync`;
  
  const metadata = {
    name: `[Nasadef Note] ${note.title}.txt`,
    mimeType: 'text/plain',
    description: 'Catatan Aplikasi & Nota Disegerakkan RazifApps@nasadef',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([fileContent], { type: 'text/plain' }));

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menyegerakkan nota ke Google Drive.');
  }

  const result = await res.json();
  return result.id;
}
