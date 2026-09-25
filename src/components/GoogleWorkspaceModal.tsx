import React, { useState, useEffect } from 'react';
import { 
  X, FileSpreadsheet, HardDrive, MousePointerClick, StickyNote, 
  ExternalLink, Download, Plus, CheckCircle, RefreshCw, Search, 
  Share2, Shield, Sparkles 
} from 'lucide-react';
import { AppItem, AdminActivityLog } from '../types';
import { 
  openGooglePicker, 
  listGoogleDriveFiles, 
  exportCatalogToGoogleSheets, 
  getLocalWorkspaceNotes, 
  saveLocalWorkspaceNotes, 
  syncNoteToGoogleDrive,
  GoogleDriveFile, 
  WorkspaceNote 
} from '../services/googleWorkspaceService';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppItem[];
  activityLogs: AdminActivityLog[];
  onImportAppFromDrive: (newApp: AppItem) => void;
  isAdmin: boolean;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  apps,
  activityLogs,
  onImportAppFromDrive,
  isAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'picker' | 'drive' | 'sheets' | 'keep'>('picker');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [driveSearch, setDriveSearch] = useState('');

  // Sheets state
  const [exportedSheetUrl, setExportedSheetUrl] = useState<string | null>(null);

  // Keep Notes state
  const [notes, setNotes] = useState<WorkspaceNote[]>(() => getLocalWorkspaceNotes());
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('Admin, Nota');

  useEffect(() => {
    if (isOpen && activeTab === 'drive') {
      loadDriveFiles();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setStatusMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setStatusMessage(null);
  };

  const handleOpenPicker = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await openGooglePicker((file) => {
        const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '.apk';
        const newApp: AppItem = {
          id: `drive-${file.id}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          version: 'v1.0.0 (Drive)',
          category: 'apk-apps-games',
          fileSize: file.size || '50.0 MB',
          fileSizeBytes: 50 * 1024 * 1024,
          extension: ext,
          description: `Fail diimport terus daripada Google Drive: ${file.name}`,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          screenshots: [],
          requirements: {
            os: 'Android 8.0+ / Windows 10+',
            ram: '2 GB',
            storage: '100 MB',
          },
          downloadUrl: file.webContentLink || file.webViewLink || '#',
          mirrorUrl: file.webViewLink,
          releaseDate: new Date().toLocaleDateString('ms-MY'),
          developer: 'RazifApps@nasadef® via Google Drive',
          downloadsCount: 0,
          rating: 5.0,
          isVerified: true,
          isFeatured: true,
        };

        onImportAppFromDrive(newApp);
        showSuccess(`✓ Berjaya menambah fail "${file.name}" dari Google Drive ke katalog!`);
      });
    } catch (err: any) {
      showError(err.message || 'Gagal membuka Google Picker.');
    } finally {
      setLoading(false);
    }
  };

  const loadDriveFiles = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const q = driveSearch 
        ? `name contains '${driveSearch}' and trashed = false`
        : "trashed = false";
      const files = await listGoogleDriveFiles(q);
      setDriveFiles(files);
    } catch (err: any) {
      showError(err.message || 'Gagal membaca fail Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSheets = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { spreadsheetUrl } = await exportCatalogToGoogleSheets(apps, activityLogs);
      setExportedSheetUrl(spreadsheetUrl);
      showSuccess('✓ Katalog & log pentadbir berjaya dieksport ke Google Sheets!');
    } catch (err: any) {
      showError(err.message || 'Gagal mengeksport ke Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      showError('Sila isi tajuk dan kandungan nota.');
      return;
    }

    const note: WorkspaceNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tags: newNoteTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [note, ...notes];
    setNotes(updated);
    saveLocalWorkspaceNotes(updated);
    setNewNoteTitle('');
    setNewNoteContent('');
    showSuccess('✓ Nota baharu berjaya disimpan.');
  };

  const handleSyncNoteToDrive = async (note: WorkspaceNote) => {
    setLoading(true);
    try {
      const fileId = await syncNoteToGoogleDrive(note);
      const updated = notes.map(n => n.id === note.id ? { ...n, driveFileId: fileId } : n);
      setNotes(updated);
      saveLocalWorkspaceNotes(updated);
      showSuccess(`✓ Nota "${note.title}" berjaya disegerakkan ke Google Drive & Keep!`);
    } catch (err: any) {
      showError(err.message || 'Gagal menyegerakkan nota ke Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-xl font-black flex items-center space-x-2">
                <span>Google Workspace Integrasi</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-yellow-400 text-slate-950 rounded-full">
                  Rasmi
                </span>
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Google Picker, Google Drive, Google Sheets & Keep Notes untuk RazifApps@nasadef®
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-2 bg-slate-50 dark:bg-slate-950">
          <button
            onClick={() => setActiveTab('picker')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'picker'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
            <span>Google Picker</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'drive'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Google Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'sheets'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('keep')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'keep'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <StickyNote className="w-4 h-4" />
            <span>Google Keep / Nota</span>
          </button>
        </div>

        {/* Status / Alert Banner */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center space-x-2 text-xs text-rose-800 dark:text-rose-300">
            <X className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GOOGLE PICKER */}
          {activeTab === 'picker' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-900 rounded-3xl border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-black text-slate-900 dark:text-white text-base">
                    Pilih Fail APK & Dokumen Terus Menggunakan Google Picker
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                    Buka antaramuka dialog rasmi Google Picker untuk memilih fail pemasangan perisian, fail APK, atau ISO terus dari akaun Google Drive anda.
                  </p>
                </div>
                <button
                  onClick={handleOpenPicker}
                  disabled={loading}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition-all shrink-0"
                >
                  <MousePointerClick className="w-4 h-4" />
                  <span>{loading ? 'Membuka Picker...' : 'Buka Google Picker'}</span>
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Kelebihan Menggunakan Google Picker:</span>
                </h5>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li>Pautan muat turun rasmi dan selamat dengan integriti akaun Google Drive.</li>
                  <li>Sokongan pelbagai jenis fail: APK, ZIP, EXE, ISO, dan DMG.</li>
                  <li>Fail yang dipilih akan ditambah serta-merta ke katalog aplikasi RazifApps@nasadef®.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={driveSearch}
                    onChange={(e) => setDriveSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadDriveFiles()}
                    placeholder="Cari fail dalam Google Drive..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={loadDriveFiles}
                  disabled={loading}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Muat Semula</span>
                </button>
              </div>

              {driveFiles.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  <HardDrive className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    {loading ? 'Sedang memuat turun senarai fail...' : 'Tiada fail dijumpai dalam Google Drive atau belum dimuatkan.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <HardDrive className="w-4 h-4 text-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {file.mimeType} {file.size ? `• ${file.size}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg"
                            title="Buka dalam Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            const newApp: AppItem = {
                              id: `drive-${file.id}`,
                              name: file.name.replace(/\.[^/.]+$/, ''),
                              version: 'v1.0.0 (Drive)',
                              category: 'apk-apps-games',
                              fileSize: file.size || '30.0 MB',
                              fileSizeBytes: 30 * 1024 * 1024,
                              extension: file.name.includes('.') ? `.${file.name.split('.').pop()}` : '.apk',
                              description: `Fail Google Drive: ${file.name}`,
                              thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                              screenshots: [],
                              requirements: { os: 'Semua OS', ram: '2 GB', storage: '50 MB' },
                              downloadUrl: file.webContentLink || file.webViewLink || '#',
                              releaseDate: new Date().toLocaleDateString('ms-MY'),
                              developer: 'RazifApps@nasadef® via Drive',
                              downloadsCount: 0,
                              rating: 5.0,
                              isVerified: true,
                            };
                            onImportAppFromDrive(newApp);
                            showSuccess(`✓ Fail "${file.name}" berjaya ditambah ke katalog!`);
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg"
                        >
                          + Tambah Katalog
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-3xl space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base">
                      Eksport Katalog & Rekod Muat Turun ke Google Sheets
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Cipta helaian kerja Google Sheets baharu secara automatik yang menyenaraikan semua perisian (ID, nama, versi, kategori, pautan fail) dan rekod aktiviti pentadbir terkini.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleExportSheets}
                    disabled={loading}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center space-x-2 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{loading ? 'Sedang Mengeksport...' : 'Jana Google Sheet Baharu'}</span>
                  </button>

                  {exportedSheetUrl && (
                    <a
                      href={exportedSheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center space-x-2 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Buka Google Sheet</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Jumlah Aplikasi dalam Helaian</h5>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{apps.length}</p>
                  <p className="text-[11px] text-slate-400">Termasuk APK, Windows, OS & USB Bootable</p>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Jumlah Log Pentadbir</h5>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activityLogs.length}</p>
                  <p className="text-[11px] text-slate-400">Aktiviti pendaftaran pautan & kemaskini</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE KEEP / NOTES */}
          {activeTab === 'keep' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tambah Nota / Release Note Baharu (Google Keep Sync)</span>
                </h5>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Tajuk Nota..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={3}
                  placeholder="Kandungan nota, changelog atau panduan..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    placeholder="Tag (asingkan dengan koma)"
                    className="w-1/2 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Simpan Nota
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  Senarai Nota & Memo Tersimpan ({notes.length})
                </h5>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 hover:border-blue-400 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <h6 className="font-bold text-sm text-slate-900 dark:text-white">
                        {note.title}
                      </h6>
                      <button
                        onClick={() => handleSyncNoteToDrive(note)}
                        disabled={loading}
                        className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                        title="Segerakkan nota ke Google Drive / Keep"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{note.driveFileId ? 'Disegerakkan' : 'Segerak ke Drive'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Projek Google Cloud: <strong>groovy-prism-86tp2</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
