import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderSearch, Plus, LayoutGrid, List, Sparkles, Filter, 
  ArrowUpDown, CheckCircle, ShieldCheck, Download, Zap, RefreshCw, 
  Search, ExternalLink, HardDrive, Cpu, Smartphone, Monitor
} from 'lucide-react';
import { AppItem, AppCategory, AuthUser } from './types';
import { INITIAL_APPS, CATEGORIES_CONFIG } from './data/appsData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AppCard } from './components/AppCard';
import { AppDetailModal } from './components/AppDetailModal';
import { FolderScanModal } from './components/FolderScanModal';
import { CustomLinkModal } from './components/CustomLinkModal';
import { PaymentModal } from './components/PaymentModal';
import { DeviceAutoDownloadModal } from './components/DeviceAutoDownloadModal';
import { ReleaseNotesGeneratorModal } from './components/ReleaseNotesGeneratorModal';
import { MusicPlayerModal } from './components/MusicPlayerModal';
import { LoginModal } from './components/LoginModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { EditAppModal } from './components/EditAppModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { Footer } from './components/Footer';
import { detectUserDevice } from './utils/deviceDetector';
import { getCurrentAuthUser, logout as authLogout, addActivityLog, getActivityLogs } from './services/authService';
import confetti from 'canvas-confetti';

export default function App() {
  const [apps, setApps] = useState<AppItem[]>(() => {
    const saved = localStorage.getItem('nasadef_catalog_apps');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse cached apps', e);
      }
    }
    return INITIAL_APPS;
  });

  // Authentication & Admin State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getCurrentAuthUser());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState<string | undefined>(undefined);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'downloads' | 'name' | 'size' | 'rating' | 'date'>('downloads');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nasadef_theme') === 'dark';
  });

  // Modals state
  const [selectedAppDetail, setSelectedAppDetail] = useState<AppItem | null>(null);
  const [isFolderScanOpen, setIsFolderScanOpen] = useState(false);
  const [isCustomLinkOpen, setIsCustomLinkOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDeviceQrOpen, setIsDeviceQrOpen] = useState(false);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);
  const [releaseNotesParams, setReleaseNotesParams] = useState({ appName: 'Nasadef Mobile Hub Pro', version: 'v2.4.2' });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [vipActive, setVipActive] = useState<boolean>(() => {
    return localStorage.getItem('nasadef_vip_status') === 'active';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deviceInfo = detectUserDevice();

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nasadef_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nasadef_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist custom apps
  const saveAppsToStorage = (updatedList: AppItem[]) => {
    setApps(updatedList);
    try {
      localStorage.setItem('nasadef_catalog_apps', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Storage full or error', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Immediate download execution:
  // "jika user admin login, terus jalankan download fail bila button download di klik, tidak perlukan sebarang pengesahan atau kelulusan."
  const handleTriggerDownload = (app: AppItem) => {
    // 1. Update download counter
    const updated = apps.map(a => a.id === app.id ? { ...a, downloadsCount: a.downloadsCount + 1 } : a);
    saveAppsToStorage(updated);
    if (selectedAppDetail && selectedAppDetail.id === app.id) {
      setSelectedAppDetail({ ...selectedAppDetail, downloadsCount: selectedAppDetail.downloadsCount + 1 });
    }

    // 2. Admin immediate execution:
    if (authUser?.isAdmin) {
      addActivityLog(
        authUser.email,
        'MUAT_TURUN_ADMIN_TERUS',
        `Muat turun terus fail tanpa sebarang pengesahan/kelulusan: ${app.name} (${app.downloadUrl})`
      );
      showToast(`⚡ Memulakan muat turun "${app.name}" (${app.fileSize}) serta-merta untuk Pentadbir...`);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } else {
      showToast(`Memulakan muat turun "${app.name}"...`);
    }

    // 3. Immediately trigger file download in browser
    const link = document.createElement('a');
    link.href = app.downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', `${app.name}${app.extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Admin authentication handlers
  const handleOpenLogin = (promptMsg?: string) => {
    setLoginPromptMessage(promptMsg);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    showToast(`✓ Log masuk berjaya sebagai Pentadbir (${user.email})!`);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
  };

  const handleLogout = () => {
    authLogout();
    setAuthUser(null);
    showToast('Log keluar pentadbir berjaya.');
  };

  const handleOpenEditApp = (app: AppItem) => {
    if (!authUser?.isAdmin) {
      handleOpenLogin('Hanya pentadbir berdaftar (laptoprazif@gmail.com, niknaza@gmail.com, nikshafik86@gmail.com, razifmake@gmail.com) sahaja yang dibenarkan mengubah pautan atau fail.');
      return;
    }
    setEditingApp(app);
  };

  const handleSaveEditedApp = (updatedApp: AppItem) => {
    const updated = apps.map(a => a.id === updatedApp.id ? updatedApp : a);
    saveAppsToStorage(updated);
    if (selectedAppDetail && selectedAppDetail.id === updatedApp.id) {
      setSelectedAppDetail(updatedApp);
    }
    addActivityLog(
      authUser?.email || 'admin',
      'UBAH_PAUTAN_FAIL',
      `Mengubah pautan muat turun & butiran fail: ${updatedApp.name} (URL: ${updatedApp.downloadUrl})`
    );
    showToast(`✓ Pautan & butiran fail "${updatedApp.name}" berjaya dikemas kini!`);
  };

  const handleDeleteApp = (appId: string) => {
    if (!authUser?.isAdmin) {
      handleOpenLogin('Kebenaran ditolak: Hanya admin berdaftar boleh memadam fail.');
      return;
    }
    const target = apps.find(a => a.id === appId);
    const updated = apps.filter(a => a.id !== appId);
    saveAppsToStorage(updated);
    if (selectedAppDetail && selectedAppDetail.id === appId) {
      setSelectedAppDetail(null);
    }
    addActivityLog(
      authUser?.email || 'admin',
      'PADAM_FAIL',
      `Memadamkan fail: ${target?.name || appId}`
    );
    showToast(`Fail berjaya dipadam daripada senarai.`);
  };

  // Add scanned apps (Admin-protected)
  const handleScanCompleted = (newScannedApps: AppItem[], sourceName: string) => {
    if (!authUser?.isAdmin) {
      handleOpenLogin('Hanya pentadbir berdaftar sahaja yang dibenarkan mengimbas dan mengemas kini senarai fail.');
      return;
    }
    const existingIds = new Set(apps.map(a => a.id));
    const toAdd = newScannedApps.filter(a => !existingIds.has(a.id));
    const updated = [...toAdd, ...apps];
    saveAppsToStorage(updated);
    addActivityLog(
      authUser.email,
      'IMBASAN_FOLDER',
      `Menambah ${toAdd.length} fail daripada imbasan "${sourceName}"`
    );
    showToast(`✓ Berjaya menambah ${toAdd.length} fail daripada imbasan "${sourceName}"`);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  // Add custom link app (Admin-protected)
  const handleAddCustomApp = (newApp: AppItem) => {
    if (!authUser?.isAdmin) {
      handleOpenLogin('Hanya pentadbir berdaftar sahaja yang dibenarkan mendaftarkan pautan fail baru.');
      return;
    }
    const updated = [newApp, ...apps];
    saveAppsToStorage(updated);
    addActivityLog(
      authUser.email,
      'TAMBAH_PAUTAN_FAIL',
      `Mendaftar pautan fail baharu: ${newApp.name} (${newApp.downloadUrl})`
    );
    showToast(`✓ Berjaya mendaftar fail "${newApp.name}" ke dalam katalog!`);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  // Reset to default catalog
  const handleResetCatalog = () => {
    saveAppsToStorage(INITIAL_APPS);
    showToast('Katalog ditetapkan semula ke fail pratetap rasmi.');
  };

  // Filtered & Sorted Apps
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = currentCategory === 'all' || app.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.extension.toLowerCase().includes(q) ||
        app.requirements.os.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'downloads') {
        comparison = a.downloadsCount - b.downloadsCount;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        comparison = a.fileSizeBytes - b.fileSizeBytes;
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'date') {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [apps, currentCategory, searchQuery, sortBy, sortOrder]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: apps.length };
    CATEGORIES_CONFIG.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = apps.filter(a => a.category === cat.id).length;
      }
    });
    return counts;
  }, [apps]);

  const currentCategoryConfig = CATEGORIES_CONFIG.find(c => c.id === currentCategory) || CATEGORIES_CONFIG[0];

  const handleOpenReleaseNotes = (appName?: string, version?: string) => {
    if (appName) {
      setReleaseNotesParams({ appName, version: version || 'v1.0.0' });
    }
    setIsReleaseNotesOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenDeviceQr={() => setIsDeviceQrOpen(true)}
        onOpenVipModal={() => setIsPaymentOpen(true)}
        onOpenReleaseNotes={() => handleOpenReleaseNotes()}
        onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        authUser={authUser}
        onOpenLogin={() => handleOpenLogin()}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onLogout={handleLogout}
        onOpenWorkspace={() => setIsWorkspaceModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Category Sidebar Navigation */}
        <Sidebar
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          categoryCounts={categoryCounts}
          onOpenFolderScan={() => setIsFolderScanOpen(true)}
          onOpenCustomLink={() => setIsCustomLinkOpen(true)}
          onOpenVipModal={() => setIsPaymentOpen(true)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isAdmin={!!authUser?.isAdmin}
          onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          onOpenLogin={handleOpenLogin}
          onOpenWorkspace={() => setIsWorkspaceModalOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white p-6 sm:p-8 shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Portal Muat Turun Aplikasi Rasmi RazifApps@nasadef®</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Muat Turun Fail APK, Windows, OS & USB Bootable Terpantas.
              </h2>

              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Koleksi perisian sedia dipasang, disahkan bebas malware, dengan pengimbas folder peranti automatik dan integrasi keselamatan akaun rasmi.
              </p>

              {/* Quick Action Pills */}
              <div className="pt-3 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsDeviceQrOpen(true)}
                  className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Auto Download Untuk {deviceInfo.os}</span>
                </button>

                <button
                  onClick={() => setIsFolderScanOpen(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-colors flex items-center space-x-1.5 border border-white/20"
                >
                  <FolderSearch className="w-4 h-4" />
                  <span>Imbas Folder Tempatan</span>
                </button>

                <a
                  href="https://apps.nasadef.com.my/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Akses Akaun Nasadef</span>
                </a>
              </div>
            </div>

            {/* Background design elements */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
              <Download className="w-72 h-72 text-white" />
            </div>
          </div>

          {/* Catalog Toolbar & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                  {currentCategoryConfig.label}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full">
                  {filteredApps.length} item
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentCategoryConfig.description}
              </p>
            </div>

            {/* Sorting & View Toggle */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center space-x-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="downloads">Paling Popular (Muat Turun)</option>
                  <option value="size">Saiz Fail</option>
                  <option value="name">Nama (A - Z)</option>
                  <option value="rating">Penilaian Tertinggi</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors"
                  title={sortOrder === 'asc' ? 'Urutan Menaik' : 'Urutan Menurun'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Paparan Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Paparan Senarai"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Search Notification */}
          {searchQuery && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
              <span>
                Hasil carian untuk: <strong>"{searchQuery}"</strong> ({filteredApps.length} item dijumpai)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold underline hover:text-blue-900"
              >
                Padam Carian
              </button>
            </div>
          )}

          {/* Apps Cards View */}
          {filteredApps.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                Tiada perisian dijumpai
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Cuba cari dengan kata kunci lain atau gunakan fungsi Folder Scan untuk mengimport perisian dari peranti anda.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Set Semula Carian
                </button>
                <button
                  onClick={() => setIsFolderScanOpen(true)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Imbas Folder Tempatan
                </button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'space-y-3'
            }>
              {filteredApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  viewMode={viewMode}
                  onSelect={setSelectedAppDetail}
                  onOpenQr={(a) => {
                    setSelectedAppDetail(a);
                  }}
                  isAdmin={!!authUser?.isAdmin}
                  onEditApp={handleOpenEditApp}
                  onDownload={handleTriggerDownload}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AppDetailModal
        app={selectedAppDetail}
        onClose={() => setSelectedAppDetail(null)}
        onOpenReleaseNotes={(appName, version) => handleOpenReleaseNotes(appName, version)}
        isAdmin={!!authUser?.isAdmin}
        onOpenEditApp={handleOpenEditApp}
        onDownload={handleTriggerDownload}
      />

      <GoogleWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        apps={apps}
        activityLogs={getActivityLogs()}
        onImportAppFromDrive={(newApp) => {
          const updated = [newApp, ...apps];
          saveAppsToStorage(updated);
          showToast(`✓ Fail "${newApp.name}" berjaya ditambah ke katalog!`);
        }}
        isAdmin={!!authUser?.isAdmin}
      />

      <FolderScanModal
        isOpen={isFolderScanOpen}
        onClose={() => setIsFolderScanOpen(false)}
        onScanCompleted={handleScanCompleted}
      />

      <CustomLinkModal
        isOpen={isCustomLinkOpen}
        onClose={() => setIsCustomLinkOpen(false)}
        onAddApp={handleAddCustomApp}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onVipActivated={() => {
          setVipActive(true);
          showToast('✓ Akses VIP Berjaya Diaktifkan!');
        }}
      />

      <DeviceAutoDownloadModal
        isOpen={isDeviceQrOpen}
        onClose={() => setIsDeviceQrOpen(false)}
      />

      <ReleaseNotesGeneratorModal
        isOpen={isReleaseNotesOpen}
        onClose={() => setIsReleaseNotesOpen(false)}
        defaultAppName={releaseNotesParams.appName}
        defaultVersion={releaseNotesParams.version}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginPromptMessage(undefined);
        }}
        onLoginSuccess={handleLoginSuccess}
        requiredActionMessage={loginPromptMessage}
      />

      {/* Full Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={authUser}
        apps={apps}
        onOpenEditApp={handleOpenEditApp}
        onOpenFolderScan={() => setIsFolderScanOpen(true)}
        onOpenCustomLink={() => setIsCustomLinkOpen(true)}
        onDeleteApp={handleDeleteApp}
        onLogout={handleLogout}
      />

      {/* App & Link Editor Modal */}
      <EditAppModal
        isOpen={!!editingApp}
        app={editingApp}
        onClose={() => setEditingApp(null)}
        onSaveApp={handleSaveEditedApp}
        onDeleteApp={handleDeleteApp}
      />

      {/* Persistent Background Music Controller with consent ask */}
      <MusicPlayerModal />

      {/* Global Footer */}
      <Footer
        onOpenVipModal={() => setIsPaymentOpen(true)}
        onOpenReleaseNotes={() => handleOpenReleaseNotes()}
      />
    </div>
  );
}
