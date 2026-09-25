import { DeviceInfo } from '../types';

export function detectUserDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      os: 'Unknown',
      browser: 'Unknown',
      isMobile: false,
      recommendedFormat: '.exe / .apk'
    };
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const ua = userAgent.toLowerCase();

  let os: DeviceInfo['os'] = 'Unknown';
  let isMobile = false;
  let recommendedFormat = '.exe';

  if (/android/i.test(ua)) {
    os = 'Android';
    isMobile = true;
    recommendedFormat = '.apk (Pakej Android)';
  } else if (/ipad|iphone|ipod/.test(ua) && !(window as any).MSStream) {
    os = 'iOS';
    isMobile = true;
    recommendedFormat = 'PWA Web App / Mobile';
  } else if (/windows/i.test(ua)) {
    os = 'Windows';
    isMobile = false;
    recommendedFormat = '.exe / .msi (Pemasang Windows)';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
    isMobile = false;
    recommendedFormat = '.dmg / Web App';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
    isMobile = false;
    recommendedFormat = '.iso / .AppImage';
  }

  // Detect browser
  let browser = 'Browser Moden';
  if (ua.includes('chrome')) browser = 'Google Chrome';
  else if (ua.includes('firefox')) browser = 'Mozilla Firefox';
  else if (ua.includes('edg')) browser = 'Microsoft Edge';
  else if (ua.includes('safari')) browser = 'Apple Safari';

  return {
    os,
    browser,
    isMobile,
    recommendedFormat
  };
}
