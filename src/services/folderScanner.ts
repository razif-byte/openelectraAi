import { AppCategory, AppItem } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function detectCategoryFromFileName(filename: string): AppCategory {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.apk') || lower.includes('android') || lower.includes('emulator')) {
    return 'apk-apps-games';
  }
  if (lower.endsWith('.iso') || lower.endsWith('.img') || lower.includes('windows11') || lower.includes('ubuntu') || lower.includes('batocera') || lower.includes('game-os')) {
    return 'os-games';
  }
  if (lower.includes('rufus') || lower.includes('ventoy') || lower.includes('etcher') || lower.includes('yumi') || lower.includes('bootable') || lower.includes('usb')) {
    return 'usb-bootable';
  }
  if (lower.includes('download') || lower.includes('torrent') || lower.includes('grabber') || lower.includes('rip') || lower.includes('aria2') || lower.includes('idm')) {
    return 'file-video-downloader';
  }
  if (lower.endsWith('.exe') || lower.endsWith('.msi')) {
    return 'windows-apps';
  }
  return 'windows-apps';
}

export function getThumbnailForCategory(category: AppCategory): string {
  switch (category) {
    case 'apk-apps-games':
      return 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80';
    case 'windows-apps':
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
    case 'os-games':
      return 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80';
    case 'usb-bootable':
      return 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80';
    case 'file-video-downloader':
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80';
    default:
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80';
  }
}

export function generateScreenshotsForFile(name: string, category: AppCategory) {
  const thumb = getThumbnailForCategory(category);
  return [
    { url: thumb, caption: `Antaramuka Utama - ${name}` },
    { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80', caption: 'Paparan Modul & Tetapan Sistem' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80', caption: 'Status Pengurusan & Pemantauan Prestasi' }
  ];
}

export function generateDefaultRequirements(category: AppCategory, sizeBytes: number) {
  const isLarge = sizeBytes > 1024 * 1024 * 1024; // > 1GB
  switch (category) {
    case 'apk-apps-games':
      return {
        os: 'Android 8.0 ke atas',
        ram: isLarge ? '4 GB RAM' : '2 GB RAM',
        storage: formatBytes(sizeBytes * 2),
        architecture: 'Universal (ARM64 / v7a)' as const
      };
    case 'os-games':
      return {
        os: 'PC / Mesin Maya (UEFI / Legacy BIOS)',
        ram: '4 GB RAM minimum (8 GB disyorkan)',
        storage: formatBytes(sizeBytes * 3),
        architecture: '64-bit' as const,
        processor: 'Pemproses 64-bit dwi-teras atau lebih laju'
      };
    case 'usb-bootable':
      return {
        os: 'Windows 8.1 / 10 / 11 / Linux',
        ram: '1 GB RAM',
        storage: '50 MB (Memerlukan USB 8GB+)',
        architecture: 'Universal' as const
      };
    case 'file-video-downloader':
      return {
        os: 'Windows 10 / 11 / Android',
        ram: '2 GB RAM',
        storage: '100 MB ruang pemacu',
        architecture: 'Universal' as const
      };
    case 'windows-apps':
    default:
      return {
        os: 'Windows 10 / Windows 11 (64-bit)',
        ram: '2 GB RAM (4 GB disyorkan)',
        storage: formatBytes(sizeBytes * 2),
        architecture: '64-bit' as const
      };
  }
}

/**
 * Scan using the modern browser File System Access API (showDirectoryPicker)
 */
export async function scanLocalDirectory(): Promise<{ directoryName: string; apps: AppItem[] }> {
  // @ts-expect-error - showDirectoryPicker is supported in modern Chromium browsers
  if (!window.showDirectoryPicker) {
    throw new Error('Pelayar anda tidak menyokong File System Access API. Sila gunakan pilihan muat naik folder atau imbasan pratetap.');
  }

  // @ts-expect-error - browser API
  const dirHandle = await window.showDirectoryPicker({
    mode: 'read'
  });

  const discoveredFiles: Array<{ name: string; size: number; lastModified: number; handle: any }> = [];

  async function readDirectory(handle: any, depth = 0) {
    if (depth > 3) return; // Prevent excessive deep nesting
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (['.apk', '.exe', '.iso', '.zip', '.msi', '.rar', '.7z', '.img', '.mp4'].includes(ext)) {
          discoveredFiles.push({
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            handle: entry
          });
        }
      } else if (entry.kind === 'directory') {
        await readDirectory(entry, depth + 1);
      }
    }
  }

  await readDirectory(dirHandle);

  const scannedApps: AppItem[] = discoveredFiles.map((file, idx) => {
    const category = detectCategoryFromFileName(file.name);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    return {
      id: `scanned-${Date.now()}-${idx}`,
      name: cleanName,
      version: 'v1.0 (Auto-Scan)',
      category,
      fileSize: formatBytes(file.size),
      fileSizeBytes: file.size,
      extension: ext,
      description: `Fail dikesan daripada imbasan folder peranti tempatan (${dirHandle.name}/${file.name}). Sedia untuk dipasang atau dimuat turun.`,
      thumbnail: getThumbnailForCategory(category),
      screenshots: generateScreenshotsForFile(cleanName, category),
      requirements: generateDefaultRequirements(category, file.size),
      downloadUrl: 'https://apps.nasadef.com.my/login',
      releaseDate: new Date(file.lastModified).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      developer: 'RazifApps@nasadef® (Local Library)',
      downloadsCount: Math.floor(Math.random() * 500) + 120,
      rating: 4.8,
      isVerified: true,
      isLocalScanned: true,
      sourcePath: `${dirHandle.name}/${file.name}`
    };
  });

  return {
    directoryName: dirHandle.name,
    apps: scannedApps
  };
}

/**
 * Simulated scan from preset directory
 */
export function scanPresetDirectory(presetPath: string): AppItem[] {
  const timestamp = Date.now();
  if (presetPath.includes('USBDrive')) {
    return [
      {
        id: `usb-scan-${timestamp}-1`,
        name: 'Windows 11 All-In-One Multiboot Edition',
        version: 'v23H2-Multi',
        category: 'os-games',
        fileSize: '5.4 GB',
        fileSizeBytes: 5798205850,
        extension: '.iso',
        description: 'Imej sistem dikesan di pemacu USB sedia pasang untuk semua versi Windows 11 Home & Pro.',
        thumbnail: getThumbnailForCategory('os-games'),
        screenshots: generateScreenshotsForFile('Windows 11 AIO', 'os-games'),
        requirements: generateDefaultRequirements('os-games', 5798205850),
        downloadUrl: 'https://apps.nasadef.com.my/login',
        releaseDate: '14 Sep 2026',
        developer: 'Nasadef Flash Lab',
        downloadsCount: 1420,
        rating: 4.9,
        isVerified: true,
        isLocalScanned: true,
        sourcePath: `${presetPath}/Win11_AIO_Multi.iso`
      },
      {
        id: `usb-scan-${timestamp}-2`,
        name: 'Hiren BootCD PE x64 Emergency Rescue',
        version: 'v1.0.8',
        category: 'usb-bootable',
        fileSize: '2.8 GB',
        fileSizeBytes: 3006477107,
        extension: '.iso',
        description: 'Sistem pemulihan kecemasan komputer berasaskan Windows 11 PE lengkap dengan alat diagnosis cakera dan anti-malware.',
        thumbnail: getThumbnailForCategory('usb-bootable'),
        screenshots: generateScreenshotsForFile('Hiren BootCD', 'usb-bootable'),
        requirements: generateDefaultRequirements('usb-bootable', 3006477107),
        downloadUrl: 'https://apps.nasadef.com.my/login',
        releaseDate: '01 Ogos 2026',
        developer: 'HBCD Community & Nasadef',
        downloadsCount: 3890,
        rating: 4.95,
        isVerified: true,
        isLocalScanned: true,
        sourcePath: `${presetPath}/HBCD_PE_x64.iso`
      }
    ];
  }

  if (presetPath.includes('Android') || presetPath.includes('storage')) {
    return [
      {
        id: `apk-scan-${timestamp}-1`,
        name: 'Nasadef SuperTube Vanced Mod',
        version: 'v19.16.39',
        category: 'apk-apps-games',
        fileSize: '58.4 MB',
        fileSizeBytes: 61236838,
        extension: '.apk',
        description: 'Pemain video bebas iklan dengan sokongan mainan latar belakang (background play) dan mod gambar-dalam-gambar (PiP).',
        thumbnail: getThumbnailForCategory('apk-apps-games'),
        screenshots: generateScreenshotsForFile('Nasadef SuperTube', 'apk-apps-games'),
        requirements: generateDefaultRequirements('apk-apps-games', 61236838),
        downloadUrl: 'https://apps.nasadef.com.my/login',
        releaseDate: '19 Sep 2026',
        developer: 'RazifApps@nasadef®',
        downloadsCount: 19800,
        rating: 5.0,
        isVerified: true,
        isLocalScanned: true,
        sourcePath: `${presetPath}/SuperTube_Vanced_v19.apk`
      },
      {
        id: `apk-scan-${timestamp}-2`,
        name: 'PPSSPP Gold PlayStation Portable Emulator',
        version: 'v1.17.1',
        category: 'apk-apps-games',
        fileSize: '36.8 MB',
        fileSizeBytes: 38587597,
        extension: '.apk',
        description: 'Emulator PSP kelajuan tinggi sokongan resolusi penuh sehingga 4K dengan sokongan tekstur HD.',
        thumbnail: getThumbnailForCategory('apk-apps-games'),
        screenshots: generateScreenshotsForFile('PPSSPP Gold', 'apk-apps-games'),
        requirements: generateDefaultRequirements('apk-apps-games', 38587597),
        downloadUrl: 'https://apps.nasadef.com.my/login',
        releaseDate: '10 Ogos 2026',
        developer: 'Henrik Rydgård & Nasadef Games',
        downloadsCount: 24700,
        rating: 4.9,
        isVerified: true,
        isLocalScanned: true,
        sourcePath: `${presetPath}/PPSSPP_Gold_v1.17.apk`
      }
    ];
  }

  // Windows / default preset
  return [
    {
      id: `win-scan-${timestamp}-1`,
      name: 'Nasadef Driver Updater Offline Pack',
      version: 'v6.3.0',
      category: 'windows-apps',
      fileSize: '1.24 GB',
      fileSizeBytes: 1331439862,
      extension: '.exe',
      description: 'Pek pemacu peranti offline untuk kad rangkaian LAN, WiFi, Bluetooth dan chipset bagi Windows 10 & 11.',
      thumbnail: getThumbnailForCategory('windows-apps'),
      screenshots: generateScreenshotsForFile('Driver Updater Offline', 'windows-apps'),
      requirements: generateDefaultRequirements('windows-apps', 1331439862),
      downloadUrl: 'https://apps.nasadef.com.my/login',
      releaseDate: '11 Sep 2026',
      developer: 'RazifApps@nasadef®',
      downloadsCount: 8940,
      rating: 4.88,
      isVerified: true,
      isLocalScanned: true,
      sourcePath: `${presetPath}/Nasadef_Driver_Pack.exe`
    }
  ];
}
