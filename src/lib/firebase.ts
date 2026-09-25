import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();
// Add Google Drive and Sheets scopes to the provider
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleAuthProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/spreadsheets');

// In-memory OAuth access token cache for Google Workspace APIs
let _workspaceAccessToken: string | null = null;

export function setWorkspaceAccessToken(token: string | null) {
  _workspaceAccessToken = token;
}

export function getWorkspaceAccessToken(): string | null {
  return _workspaceAccessToken;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    _workspaceAccessToken = null;
  }
});

export { app, signInWithPopup, signOut, onAuthStateChanged };
export type { User };
