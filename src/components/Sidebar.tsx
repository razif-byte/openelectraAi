import React from 'react';
import { 
  Layers, Smartphone, Monitor, Cpu, HardDrive, DownloadCloud, 
  FolderSearch, Plus, Sparkles, ExternalLink, ShieldCheck, Zap,
  ShieldAlert, Lock, Shield
} from 'lucide-react';
import { AppCategory } from '../types';
import nasadefLogo from '../assets/images/nasadef_logo_1790318761101.jpg';

interface SidebarProps {
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
  onOpenFolderScan: () => void;
  onOpenCustomLink: () => void;
  onOpenVipModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  onOpenLogin: (reason?: string) => void;
  onOpenWorkspace?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  categoryCounts,
  onOpenFolderScan,
  onOpenCustomLink,
  onOpenVipModal,
  isOpenMobile,
  onCloseMobile,
  isAdmin,
  onOpenAdminPanel,
  onOpenLogin,
  onOpenWorkspace
}) => {
  const menuItems = [
    { id: 'all', label: 'Semua Kategori', icon: Layers },
    { id: 'apk-apps-games', label: 'Apk Apps & Games', icon: Smartphone },
    { id: 'windows-apps', label: 'Windows Apps', icon: Monitor },
    { id: 'os-games', label: 'OS & Games', icon: Cpu },
    { id: 'usb-bootable', label: 'USB Bootable Creator Apps', icon: HardDrive },
    { id: 'file-video-downloader', label: 'File & Video Downloader Apps', icon: DownloadCloud }
  ];

  const handleProtectedFolderScan = () => {
    onCloseMobile();
    if (isAdmin) {
      onOpenFolderScan();
    } else {
      onOpenLogin('Hanya pentadbir berdaftar (laptoprazif@gmail.com, niknaza@gmail.com, nikshafik86@gmail.com, razifmake@gmail.com) sahaja yang dapat mengimbas folder aplikasi.');
    }
  };

  const handleProtectedCustomLink = () => {
    onCloseMobile();
    if (isAdmin) {
      onOpenCustomLink();
    } else {
      onOpenLogin('Hanya pentadbir berdaftar sahaja yang dibenarkan menambah atau mengubah pautan fail aplikasi.');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] 
        w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        flex flex-col justify-between p-4 sm:p-5 transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top category navigation */}
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Logo / Branding for mobile */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 shadow-md shadow-blue-500/30 ring-1 ring-blue-500/20 shrink-0">
                <img
                  src={nasadefLogo}
                  alt="Nasadef Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                Nasadef Download
              </span>
            </div>
            <button 
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
              Menu Utama (Kategori)
            </span>

            <nav className="mt-2 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentCategory === item.id;
                const count = categoryCounts[item.id] || 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectCategory(item.id);
                      onCloseMobile();
                    }}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <span className={`
                      text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }
                    `}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions / Folder Scan Option (Protected for Admins) */}
          <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Kawalan Repositori
              </span>
              {!isAdmin && (
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Admin Sahaja</span>
                </span>
              )}
            </div>

            <button
              onClick={handleProtectedFolderScan}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <FolderSearch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Imbas Folder (Folder Scan)</span>
              </div>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />}
            </button>

            <button
              onClick={handleProtectedCustomLink}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Tambah Pautan Fail (Set Link)</span>
              </div>
              {!isAdmin && <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />}
            </button>

            {onOpenWorkspace && (
              <button
                onClick={() => {
                  onCloseMobile();
                  onOpenWorkspace();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-900/60 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Google Workspace Hub</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-200/60 dark:bg-blue-800/60 rounded">
                  Picker/Drive/Sheets
                </span>
              </button>
            )}

            {/* Admin Panel Quick Access in Sidebar */}
            {isAdmin ? (
              <button
                onClick={() => {
                  onCloseMobile();
                  onOpenAdminPanel();
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-md shadow-blue-500/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                <span>Buka Panel Pentadbir</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onCloseMobile();
                  onOpenLogin('Sila log masuk dengan Google Account pentadbir berdaftar untuk mengurus aplikasi & fail.');
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Log Masuk Admin Panel</span>
              </button>
            )}
          </div>

          {/* VIP Support Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold">Kelajuan VIP Tanpa Had</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Dapatkan akses jalur lebar pantas & DuitNow QR rasmi.
            </p>
            <button
              onClick={() => {
                onOpenVipModal();
                onCloseMobile();
              }}
              className="w-full py-1.5 bg-white text-blue-700 font-bold text-xs rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
            >
              Langgan / Aktifkan VIP
            </button>
          </div>
        </div>

        {/* Bottom Sidebar Watermark & Info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Watermark:</span>
            <a 
              href="https://nasadef.com.my" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              RazifApps@nasadef®
              <ExternalLink className="w-2.5 h-2.5 ml-1" />
            </a>
          </div>
          <div className="text-[10px] text-slate-400 text-center">
            Portal Rasmi https://nasadef.com.my
          </div>
        </div>
      </aside>
    </>
  );
};
