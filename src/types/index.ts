export type AppCategory = 
  | 'apk-apps-games'
  | 'windows-apps'
  | 'os-games'
  | 'usb-bootable'
  | 'file-video-downloader';

export interface SystemRequirement {
  os: string;
  ram: string;
  storage: string;
  processor?: string;
  architecture?: string;
  graphics?: string;
  additional?: string;
}

export interface AppScreenshot {
  url: string;
  caption: string;
}

export interface AppItem {
  id: string;
  name: string;
  version: string;
  category: AppCategory;
  fileSize: string; // e.g. "45.8 MB" or "4.7 GB"
  fileSizeBytes: number;
  extension: string; // e.g. ".apk", ".exe", ".iso", ".zip"
  description: string;
  longDescription?: string;
  thumbnail: string;
  screenshots: AppScreenshot[];
  requirements: SystemRequirement;
  downloadUrl: string;
  mirrorUrl?: string;
  releaseDate: string;
  developer: string;
  downloadsCount: number;
  rating: number;
  sha256?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  isLocalScanned?: boolean;
  sourcePath?: string;
  whatsNew?: {
    bm: string;
    en: string;
  };
}

export interface DeviceInfo {
  os: 'Android' | 'Windows' | 'macOS' | 'iOS' | 'Linux' | 'Unknown';
  browser: string;
  isMobile: boolean;
  recommendedFormat: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  youtubeUrl?: string;
  youtubeId?: string;
  driveLink?: string;
  streamUrl: string;
  duration?: string;
  lyrics?: string;
  badge?: string;
}

export interface ReleaseNotesForm {
  appName: string;
  version: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'super_admin' | 'admin';
  addedAt: string;
  addedBy?: string;
  isActive: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
  role: 'super_admin' | 'admin' | 'user';
  loginMethod: 'google' | 'password';
}

export interface AdminActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}
