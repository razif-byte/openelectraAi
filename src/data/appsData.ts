import { AppItem, AudioTrack } from '../types';

export const INITIAL_APPS: AppItem[] = [
  // 1. Apk Apps & Games
  {
    id: 'apk-nasadef-mobile-hub',
    name: 'Nasadef Mobile Hub Pro',
    version: 'v2.4.2',
    category: 'apk-apps-games',
    fileSize: '42.8 MB',
    fileSizeBytes: 44879000,
    extension: '.apk',
    description: 'Pusat pengurusan aplikasi mudah alih Nasadef dengan pengurus muat turun bersepadu, pembersih cache, dan mod enjin permainan.',
    longDescription: 'Nasadef Mobile Hub Pro ialah aplikasi pengurusan peranti Android serba lengkap yang dibangunkan khas oleh RazifApps@nasadef®. Dilengkapi dengan penganalisis storan pantas, pengoptimum RAM permainan satu klik, pengurus kemas kini APK automatik, dan perlindungan privasi.',
    thumbnail: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=1000&auto=format&fit=crop&q=80', caption: 'Papan Pemuka Utama & Status Peranti' },
      { url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1000&auto=format&fit=crop&q=80', caption: 'Pengurus Muat Turun Kelajuan Tinggi' },
      { url: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1000&auto=format&fit=crop&q=80', caption: 'Tetapan Game Booster & Penjimatan Bateri' }
    ],
    requirements: {
      os: 'Android 8.0 (Oreo) ke atas',
      ram: '3 GB RAM minimum (4 GB disyorkan)',
      storage: '150 MB ruang storan kosong',
      architecture: 'Universal (ARM64 / v7a)',
      additional: 'Kebenaran memasang aplikasi dari sumber tidak dikenali (Unknown Sources) diperlukan.'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    mirrorUrl: 'https://apps.nasadef.com.my/files/apk/Nasadef_Mobile_Hub_v2.4.2.apk',
    releaseDate: '18 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 18450,
    rating: 4.9,
    sha256: 'a4b89f210d7e63b4f62e841295e8bb7201fd5a019483756281734910cfab9812',
    isVerified: true,
    isFeatured: true,
    whatsNew: {
      bm: '1. Penambahbaikan kelajuan muat turun enjin P2P.\n2. Sokongan Android 14 dan 15 terkini.\n3. Antaramuka baharu dengan mod gelap moden.',
      en: '1. Improved P2P download engine speed.\n2. Support for Android 14 and 15.\n3. Brand new UI with sleek dark mode.'
    }
  },
  {
    id: 'apk-retroarch-nasadef',
    name: 'RetroArch Plus Nasadef Core Pack',
    version: 'v1.18.0',
    category: 'apk-apps-games',
    fileSize: '198.5 MB',
    fileSizeBytes: 208142336,
    extension: '.apk',
    description: 'Emulator arked & konsol serba boleh pra-konfigurasi lengkap dengan shader scanline HD dan sokongan alat kawalan Bluetooth.',
    longDescription: 'Edisi khas RetroArch yang telah dioptimumkan untuk peranti mudah alih Asia Tenggara. Mengandungi lebih 30 teras emulator pilihan (PS1, PSP, GBA, SNES, Arcade MAME) siap dengan pemetaan alat kawalan skrin sentuh yang responsif dan sokongan cloud save.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80', caption: 'Pemilihan Konsol Klasik & Senarai ROM' },
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80', caption: 'Paparan Grafik Shader CRT & Penapis HD' },
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000&auto=format&fit=crop&q=80', caption: 'Konfigurasi Gamepad & Kawalan Skrin' }
    ],
    requirements: {
      os: 'Android 7.0 ke atas',
      ram: '2 GB RAM (4 GB untuk PS1/PSP)',
      storage: '500 MB untuk fail asas & teras',
      architecture: 'ARM64',
      processor: 'Snapdragon 660 / MediaTek Helio G80 ke atas'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '12 Ogos 2026',
    developer: 'Libretro & Modded by Nasadef',
    downloadsCount: 14200,
    rating: 4.8,
    isVerified: true,
    sha256: '9f81a74e502b6623bcde890f576e2c34a11978d5236b2890aef944710cbaf934'
  },
  {
    id: 'apk-game-booster-ultra',
    name: 'Game Booster Ultra FPS Max',
    version: 'v3.8.0',
    category: 'apk-apps-games',
    fileSize: '18.4 MB',
    fileSizeBytes: 19293798,
    extension: '.apk',
    description: 'Tingkatkan kadar bingkai (FPS) sehingga 120Hz, stabilkan ping internet, dan henti proses latar belakang tanpa sekatan.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80', caption: 'Pemantauan Suhu CPU & RAM Masa Nyata' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80', caption: 'Kunci Rangkaian Ping Rendah (Anti-Lag)' }
    ],
    requirements: {
      os: 'Android 6.0 ke atas',
      ram: '2 GB RAM',
      storage: '50 MB ruang storan',
      architecture: 'Universal'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '01 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 32600,
    rating: 4.9,
    isVerified: true
  },

  // 2. Windows Apps
  {
    id: 'win-nasadef-pc-suite',
    name: 'Nasadef PC Suite Pro',
    version: 'v3.1.5',
    category: 'windows-apps',
    fileSize: '88.4 MB',
    fileSizeBytes: 92694118,
    extension: '.exe',
    description: 'Suite penyelenggaraan Windows terbaik: pembersih registry selamat, pemantau suhu perkakasan, dan pengemas kini pemacu satu klik.',
    longDescription: 'Nasadef PC Suite Pro dibina khusus untuk pengguna Windows 10 & 11 bagi memastikan sistem beroperasi pada kelajuan maksimum. Dilengkapi dengan enjin nyahpasang mendalam (deep uninstaller), pemantauan perkhidmatan permulaan, pembersihan fail sisa, dan utiliti pembaikan sistem rasmi.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80', caption: 'Papan Utama Sistem Windows' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80', caption: 'Modul Pengoptimum Kelajuan & Pembersih Registry' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80', caption: 'Pengurus Pemacu & Maklumat Perkakasan' }
    ],
    requirements: {
      os: 'Windows 11 / Windows 10 (64-bit disyorkan)',
      ram: '4 GB RAM minimum (8 GB disyorkan)',
      storage: '250 MB ruang pemasangan',
      processor: 'Intel Core i3 / AMD Ryzen 3 atau setaraf',
      architecture: '64-bit'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '15 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 29800,
    rating: 4.95,
    isVerified: true,
    isFeatured: true,
    sha256: '5e7f10b2304859aef904712bbcd3460128e4695029e18b417c244589d8923a10'
  },
  {
    id: 'win-screenrecorder-4k',
    name: 'Nasadef ScreenRecorder 4K Ultra',
    version: 'v2.0.1',
    category: 'windows-apps',
    fileSize: '64.2 MB',
    fileSizeBytes: 67318579,
    extension: '.exe',
    description: 'Rakaman skrin desktop tanpa watermark dengan kadar sehingga 120FPS, rakaman audio sistem & mikrofon secara berasingan.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80', caption: 'Panel Rakaman Skrin & Tetapan Resolusi 4K' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80', caption: 'Penyunting Klip Pantas & Eksport MP4' }
    ],
    requirements: {
      os: 'Windows 10 / 11 64-bit',
      ram: '4 GB RAM (8 GB untuk resolusi 4K)',
      storage: '500 MB + ruang rakaman video',
      graphics: 'Kad grafik sokongan NVENC / AMD AMF / Intel QuickSync',
      architecture: '64-bit'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '05 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 16500,
    rating: 4.8,
    isVerified: true
  },
  {
    id: 'win-ultrazip-archive-master',
    name: 'UltraZip Archive Master Pro',
    version: 'v5.4.0',
    category: 'windows-apps',
    fileSize: '15.6 MB',
    fileSizeBytes: 16357785,
    extension: '.exe',
    description: 'Perisian pemampatan fail berkelajuan tinggi menyokong ZIP, RAR5, 7Z, ISO, TAR, GZ dengan enkripsi AES-256 keselamatan tinggi.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80', caption: 'Antaramuka Pengurusan Arkib' }
    ],
    requirements: {
      os: 'Windows 7 / 8 / 10 / 11',
      ram: '1 GB RAM',
      storage: '50 MB',
      architecture: 'Universal'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '28 Ogos 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 22100,
    rating: 4.9,
    isVerified: true
  },

  // 3. OS & Games
  {
    id: 'os-win11-ultralite',
    name: 'Windows 11 24H2 UltraLite Nasadef Edition',
    version: 'v24H2.4',
    category: 'os-games',
    fileSize: '3.42 GB',
    fileSizeBytes: 3672200000,
    extension: '.iso',
    description: 'Imej ISO Windows 11 rasmi yang dibersihkan daripada telemetry dan bloatware, bypass keperluan TPM 2.0 / Secure Boot, pantas untuk gaming!',
    longDescription: 'Windows 11 24H2 UltraLite Nasadef Edition direka khas untuk PC & Laptop berprestasi sederhana hingga tinggi. Semua bloatware dan telemetry Microsoft telah dinyahaktifkan secara selamat. Penggunaan RAM semasa idle hanya ~1.2 GB! Menyokong direct install pada pemacu SSD mahupun HDD lama tanpa halangan TPM.',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1000&auto=format&fit=crop&q=80', caption: 'Desktop Bersih Tanpa Iklan & Penggunaan Sumber Rendah' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80', caption: 'Ujian Skor Prestasi Permainan Tinggi' },
      { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80', caption: 'Pengurus Tetapan Privasi & Tweaks Lengkap' }
    ],
    requirements: {
      os: 'Komputer Berasaskan x64 (UEFI / Legacy BIOS)',
      ram: '2 GB RAM minimum (4 GB+ disyorkan)',
      storage: '20 GB ruang pemacu (SSD sangat disyorkan)',
      processor: '1 GHz dwi-teras atau lebih laju (Tanpa halangan TPM)',
      architecture: '64-bit'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '10 Sep 2026',
    developer: 'Nasadef OS Labs',
    downloadsCount: 45900,
    rating: 5.0,
    isVerified: true,
    isFeatured: true,
    sha256: '7238aefc20098df1b5399acfe002479f67a301ecf20e49bb47812903fa1694ce'
  },
  {
    id: 'os-ubuntu-gamers',
    name: 'Ubuntu Gamers Edition 24.04 LTS ISO',
    version: 'v24.04.1',
    category: 'os-games',
    fileSize: '4.15 GB',
    fileSizeBytes: 4456000000,
    extension: '.iso',
    description: 'Sistem operasi Linux siap pasang pemacu proprietari NVIDIA / AMD, Steam Proton terkini, Lutris, Wine-GE, dan sokongan moden Discord.',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1000&auto=format&fit=crop&q=80', caption: 'Antaramuka Desktop Linux Moden & Steam Big Picture' },
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80', caption: 'Pelancar Lutris & Pengoptimuman Kernel Rendah Latensi' }
    ],
    requirements: {
      os: 'PC / Laptop (64-bit UEFI)',
      ram: '4 GB RAM (8 GB+ untuk permainan berat)',
      storage: '25 GB ruang pemacu',
      architecture: '64-bit',
      graphics: 'NVIDIA GTX 960 / AMD Radeon RX 560 ke atas'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '22 Ogos 2026',
    developer: 'Nasadef OpenSource & Canonical',
    downloadsCount: 19800,
    rating: 4.85,
    isVerified: true
  },
  {
    id: 'os-batocera-arcade-pack',
    name: 'Batocera Retro Arcade System Image',
    version: 'v39-Nasadef',
    category: 'os-games',
    fileSize: '7.85 GB',
    fileSizeBytes: 8429000000,
    extension: '.img.gz',
    description: 'Imej sistem retro gaming sedia flash ke pemacu USB atau SD card. Plug-and-play lebih 5,000 judul arked klasik.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80', caption: 'Pilihan Antaramuka EmulationStation Tema Neon' }
    ],
    requirements: {
      os: 'USB Flash Drive 16 GB+ / MicroSD',
      ram: '2 GB RAM',
      storage: '16 GB minimum',
      architecture: 'Universal (x86_64 & Raspberry Pi 4/5)'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '15 Julai 2026',
    developer: 'Batocera Team & Nasadef Games',
    downloadsCount: 27400,
    rating: 4.9,
    isVerified: true
  },

  // 4. USB Bootable Creator Apps
  {
    id: 'usb-rufus-pro-nasadef',
    name: 'Rufus Pro Portable Nasadef Edition',
    version: 'v4.5.2180',
    category: 'usb-bootable',
    fileSize: '1.45 MB',
    fileSizeBytes: 1520435,
    extension: '.exe',
    description: 'Pencipta pemacu USB boleh but format ISO terpantas di dunia dengan sokongan automatik bypass akaun Microsoft dan TPM 2.0.',
    longDescription: 'Rufus Portable versi khas ini telah disesuaikan oleh RazifApps@nasadef® dengan pratetap optimum untuk pemasangan Windows 11, Windows 10, dan distro Linux. Menyokong partisi GPT (UEFI) dan MBR (Legacy BIOS) dengan kelajuan penulisan blok pemacu sepantas kilat.',
    thumbnail: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1000&auto=format&fit=crop&q=80', caption: 'Antaramuka Pemilihan ISO & Konfigurasi Partisi' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80', caption: 'Pilihan Khas Windows User Customization' }
    ],
    requirements: {
      os: 'Windows 8.1 / 10 / 11 (32-bit & 64-bit)',
      ram: '512 MB RAM',
      storage: '10 MB ruang cakera',
      architecture: 'Universal',
      additional: 'Pemacu USB 8 GB atau lebih besar disyorkan untuk imej ISO.'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '12 Sep 2026',
    developer: 'Pete Batard & Tuned by Nasadef',
    downloadsCount: 58200,
    rating: 5.0,
    isVerified: true,
    isFeatured: true,
    sha256: '18d9f45610bcde89201f84570192ea3899201fa89bca74e267198e3b1c60912f'
  },
  {
    id: 'usb-ventoy-master',
    name: 'Ventoy Multiboot Master Pro',
    version: 'v1.0.99',
    category: 'usb-bootable',
    fileSize: '16.8 MB',
    fileSizeBytes: 17616076,
    extension: '.zip',
    description: 'Satu pendrive USB untuk SEMUA sistem operasi! Cuma salin fail ISO terus ke pendrive tanpa perlu format semula setiap kali.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80', caption: 'Menu But Pelbagai OS Ventoy' }
    ],
    requirements: {
      os: 'Windows 7 / 8 / 10 / 11 atau Linux',
      ram: '1 GB RAM',
      storage: '50 MB',
      architecture: 'Universal'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '02 Sep 2026',
    developer: 'Ventoy Project & Nasadef',
    downloadsCount: 42100,
    rating: 4.95,
    isVerified: true
  },
  {
    id: 'usb-balena-etcher-nasadef',
    name: 'BalenaEtcher Flash Creator Nasadef',
    version: 'v1.19.0',
    category: 'usb-bootable',
    fileSize: '128.4 MB',
    fileSizeBytes: 134637158,
    extension: '.exe',
    description: 'Perisian flash kad SD & USB paling selamat dan mesra pemula. Pengesahan integriti penulisan automatik untuk elak pemacu rosak.',
    thumbnail: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=1000&auto=format&fit=crop&q=80', caption: '3 Langkah Mudah Flash Imej ISO' }
    ],
    requirements: {
      os: 'Windows 10 / 11 64-bit',
      ram: '2 GB RAM',
      storage: '200 MB',
      architecture: '64-bit'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '19 Ogos 2026',
    developer: 'Balena & Nasadef Tools',
    downloadsCount: 21300,
    rating: 4.8,
    isVerified: true
  },

  // 5. File & Video Downloader Apps
  {
    id: 'dl-nasadef-turbo-downloader',
    name: 'Nasadef Turbo Downloader Pro',
    version: 'v5.2.0',
    category: 'file-video-downloader',
    fileSize: '38.6 MB',
    fileSizeBytes: 40475033,
    extension: '.exe',
    description: 'Enjin muat turun berbilang bebenang (multi-threaded 32 sambungan serentak) dengan kelajuan sehingga 10x lebih pantas daripada pelayar web biasa.',
    longDescription: 'Nasadef Turbo Downloader Pro ialah perisian pemecut muat turun berkuasa tinggi. Dilengkapi dengan fungsi sambung semula pintar (smart resume), integrasi automatik dengan pelayar Chrome/Edge/Firefox, penangkapan pautan magnet torrent, dan sokongan proksi.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', caption: 'Graf Kelajuan Muat Turun Multi-Sambungan' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80', caption: 'Penjadual Waktu Muat Turun & Had Bandwidth' }
    ],
    requirements: {
      os: 'Windows 10 / 11 (Tersedia versi Android APK)',
      ram: '2 GB RAM',
      storage: '100 MB ruang aplikasi',
      architecture: 'Universal'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '20 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 68400,
    rating: 4.95,
    isVerified: true,
    isFeatured: true,
    sha256: '9204bcdef7812034981fae561820bc0192348af71260bc18290ef41092837bc1'
  },
  {
    id: 'dl-4k-video-grabber',
    name: '4K TubeGrabber Video Downloader',
    version: 'v4.1.2',
    category: 'file-video-downloader',
    fileSize: '52.3 MB',
    fileSizeBytes: 54840524,
    extension: '.exe',
    description: 'Muat turun video resolusi 4K, 8K, 1080p dan audio MP3 berkualiti tinggi 320kbps daripada ribuan laman web media dengan sari kata automatik.',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1000&auto=format&fit=crop&q=80', caption: 'Pemilihan Kualiti Video 4K & Format Audio' }
    ],
    requirements: {
      os: 'Windows 10 / 11 / macOS / Linux',
      ram: '4 GB RAM',
      storage: '150 MB',
      architecture: '64-bit'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '08 Sep 2026',
    developer: 'RazifApps@nasadef®',
    downloadsCount: 38900,
    rating: 4.9,
    isVerified: true
  },
  {
    id: 'dl-qbittorrent-enhanced',
    name: 'qBittorrent Enhanced Nasadef Edition',
    version: 'v4.6.5',
    category: 'file-video-downloader',
    fileSize: '31.2 MB',
    fileSizeBytes: 32715571,
    extension: '.exe',
    description: 'Klien torrent sumber terbuka tanpa iklan, pra-konfigurasi senarai penjejak (trackers) pantas untuk kelajuan seeder maksimum di Malaysia.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80', caption: 'Senarai Muat Turun & Penjejak Aktif' }
    ],
    requirements: {
      os: 'Windows 10 / 11',
      ram: '2 GB RAM',
      storage: '80 MB',
      architecture: 'Universal'
    },
    downloadUrl: 'https://apps.nasadef.com.my/login',
    releaseDate: '25 Ogos 2026',
    developer: 'qBittorrent Project & Modded by Nasadef',
    downloadsCount: 29500,
    rating: 4.85,
    isVerified: true
  }
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-nasihat-diri',
    title: 'Nasihat Diri (Ini Peringatan)',
    artist: 'tukang kata (YouTube Official)',
    youtubeUrl: 'https://youtu.be/FL02h4nRfvw?si=p8rsBqXJSrMqbEZ7',
    youtubeId: 'FL02h4nRfvw',
    driveLink: 'https://drive.google.com/file/d/1UPVL_pHXrZ3jVT5MAErXmn6El6rWJj7x/view?usp=sharing',
    streamUrl: '/audio/nasihat-diri.mp3',
    duration: '04:18',
    badge: 'Audio Asal YouTube & Drive',
    lyrics: 'Ini bukan sekadar kata, ini peringatan... Yang jauh itu waktu aku sia-siakan... Yang dekat adalah mati aku tak endahkan... Sebab hidup ni singkat, bukan selamanya!'
  },
  {
    id: 'track-raja',
    title: 'Jangan Lupa Siapa Raja / Lupa Diri (Dulu Datang Menumpang Teduh)',
    artist: 'RazifApps Official Soundtrack',
    driveLink: 'https://drive.google.com/file/d/1ercSFr987XBQr99pUmy296XAkiwpu-DH/view?usp=sharing',
    streamUrl: '/audio/lupa-diri.mp3',
    duration: '03:42',
    badge: 'Audio Asal Google Drive',
    lyrics: 'Dulu datang menumpang teduh... Jangan lupa siapa raja, jangan lupa siapa menjaga! Kalau tinggi jangan mendada, biar tahu asal berniaga!'
  },
  {
    id: 'track-keutamaan',
    title: 'Tak Diajak Aku Takkan Pergi (Keutamaan Diri)',
    artist: 'RazifApps Official',
    streamUrl: '/audio/keutamaan-diri.mp3',
    duration: '02:38',
    badge: 'Trek Pilihan',
    lyrics: 'Tak diajak, aku takkan pergi... Tak diundang, aku mengerti diri... Dipanggil di saat akhir, maaf aku undur diri... Aku bukan pilihan, aku keutamaan diri!'
  },
  {
    id: 'track-bawah',
    title: 'Dari Bawah (Real Talk & Hustle)',
    artist: 'RazifApps Official',
    streamUrl: '/audio/dari-bawah.mp3',
    duration: '02:36',
    badge: 'Hustle & Real Talk',
    lyrics: 'Aku mula dari bawah, tak ada siapa pandang... Siang malam aku hustle tak pernah nak stop... Dari bawah aku naik, bukan sekadar kata!'
  },
  {
    id: 'track-nikmat',
    title: 'Nikmat Tuhan Yang Didustakan (Siapa Yang Memberi)',
    artist: 'RazifApps Official',
    streamUrl: '/audio/nikmat-tuhan.mp3',
    duration: '05:10',
    badge: 'Muhasabah Diri',
    lyrics: 'Kau rasa semua ni hasil kau sendiri? Atau kau cuma lupa siapa yang memberi? Fabiayyi ala irobbikuma tukazziban... Maka yang mana satu di antara nikmat Tuhanmu yang kamu hendak dustakan?'
  },
  {
    id: 'track-tafakur',
    title: 'Tafakur (Zikir Itu Fikir)',
    artist: 'RazifApps Spiritual Soundtrack',
    streamUrl: '/audio/tafakur-zikir.mp3',
    duration: '06:38',
    badge: 'Renungan Ruhani',
    lyrics: 'Tafakkuru saatin khairun min ibadati alfi sanah... Sesungguhnya bertafakur sesaat lebih baik daripada beribadah seribu tahun. Mengertilah... sesungguhnya zikir itu fikir, dan fikir adalah jalan menuju hakikat ketuhanan.'
  },
  {
    id: 'track-cyber',
    title: 'Nasadef Cyber Odyssey',
    artist: 'RazifApps Audio Laboratory',
    streamUrl: '/audio/nasadef-cyber-odyssey.mp3',
    duration: '03:42',
    badge: 'Cyber Synth'
  },
  {
    id: 'track-ambient',
    title: 'Digital Horizon Ambient',
    artist: 'RazifApps Synth Studio',
    streamUrl: '/audio/digital-horizon.mp3',
    duration: '04:15',
    badge: 'Ethereal Ambient'
  },
  {
    id: 'track-chill',
    title: 'Tech Flow Chillout',
    artist: 'Nasadef Electronic Beats',
    streamUrl: '/audio/tech-flow.mp3',
    duration: '03:58',
    badge: 'Lo-Fi Chill'
  }
];

export const CATEGORIES_CONFIG = [
  {
    id: 'all',
    label: 'Semua Kategori',
    icon: 'Layers',
    description: 'Lihat semua aplikasi, sistem operasi dan alat utiliti.'
  },
  {
    id: 'apk-apps-games',
    label: 'Apk Apps & Games',
    icon: 'Smartphone',
    description: 'Aplikasi Android, permainan mudah alih, emulator dan alat pengoptimuman.'
  },
  {
    id: 'windows-apps',
    label: 'Windows Apps',
    icon: 'Monitor',
    description: 'Perisian PC Windows, utiliti sistem, perakam skrin dan aplikasi produktiviti.'
  },
  {
    id: 'os-games',
    label: 'OS & Games',
    icon: 'Cpu',
    description: 'Imej sistem operasi Windows kustom, Linux Gaming, dan pakej arked retro.'
  },
  {
    id: 'usb-bootable',
    label: 'USB Bootable Creator Apps',
    icon: 'HardDrive',
    description: 'Alat membina pemacu USB pendrive boleh but seperti Rufus, Ventoy & Etcher.'
  },
  {
    id: 'file-video-downloader',
    label: 'File & Video Downloader Apps',
    icon: 'DownloadCloud',
    description: 'Pemecut muat turun pelbagai sambungan, video grabber 4K dan klien torrent.'
  }
];

export const PRESET_SCAN_DIRECTORIES = [
  { path: 'C:\\Nasadef\\Downloads\\Repository', label: 'Folder Utama Windows (C:\\Nasadef\\Downloads)', os: 'Windows' },
  { path: '/storage/emulated/0/Download/NasadefApps', label: 'Folder Muat Turun Android (/sdcard/Download)', os: 'Android' },
  { path: '/media/nasadef/USBDrive/BootableISOs', label: 'Pemacu USB Bootable (/media/USBDrive)', os: 'USB/OS' },
  { path: 'D:\\Software\\Archive_2026', label: 'Arkib Perisian Cakera D (D:\\Software)', os: 'PC' }
];
