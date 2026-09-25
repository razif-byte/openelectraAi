import React from 'react';
import { 
  Search, Moon, Sun, QrCode, Menu, ExternalLink, Zap, 
  Sparkles, ShieldCheck, Download, Smartphone, Monitor, UserCheck,
  Shield, LogIn, LogOut, ChevronDown
} from 'lucide-react';
import { detectUserDevice } from '../utils/deviceDetector';
import { AuthUser } from '../types';
import nasadefLogo from '../assets/images/nasadef_logo_1790318761101.jpg';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDeviceQr: () => void;
  onOpenVipModal: () => void;
  onOpenReleaseNotes: () => void;
  onToggleMobileMenu: () => void;
  authUser: AuthUser | null;
  onOpenLogin: () => void;
  onOpenAdminPanel: () => void;
  onLogout: () => void;
  onOpenWorkspace?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenDeviceQr,
  onOpenVipModal,
  onOpenReleaseNotes,
  onToggleMobileMenu,
  authUser,
  onOpenLogin,
  onOpenAdminPanel,
  onLogout,
  onOpenWorkspace
}) => {
  const deviceInfo = detectUserDevice();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="relative group shrink-0">
              <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 shadow-md shadow-blue-500/25 ring-1 ring-blue-500/30 flex items-center justify-center bg-slate-900">
                <img
                  src={nasadefLogo}
                  alt="Nasadef Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-none">
                  Nasadef Download Page
                </h1>
                <a
                  href="https://nasadef.com.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
                  title="Lawati Laman Rasmi Nasadef"
                >
                  <span>RazifApps@nasadef®</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-1" />
                </a>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Portal Muat Turun Aplikasi, OS & Pemasang Sistem
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari APK, Windows Apps, ISO, USB Tools, Downloader..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 rounded-2xl transition-all text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Release Notes Tool */}
          <button
            onClick={onOpenReleaseNotes}
            className="hidden xl:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 dark:border-purple-900/60"
            title="Penjana Release Notes Play Console"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Release Notes Play Console</span>
          </button>

          {/* Auto Download QR for Device */}
          <button
            onClick={onOpenDeviceQr}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-900"
            title={`Auto Download mengikut peranti dikesan: ${deviceInfo.os}`}
          >
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Imbas QR Peranti ({deviceInfo.os})</span>
          </button>

          {/* VIP Subscription / Donation */}
          <button
            onClick={onOpenVipModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-yellow-800 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-xl transition-colors border border-yellow-200 dark:border-yellow-900/60"
            title="Langganan VIP DuitNow (CIMB & TNG)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>VIP / DuitNow</span>
          </button>

          {/* Google Workspace Hub */}
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-900"
              title="Google Workspace Hub (Picker, Drive, Sheets, Keep)"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Workspace</span>
            </button>
          )}

          {/* Dark UI Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isDarkMode ? 'Tukar ke Mod Cerah (Light Mode)' : 'Tukar ke Mod Gelap (Dark Mode)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Admin Panel / Admin Login trigger */}
          {authUser?.isAdmin ? (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={onOpenAdminPanel}
                className="px-3 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all border border-blue-400/30"
                title={`Admin Panel (${authUser.email})`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="px-1.5 py-0.2 bg-white/20 text-white text-[9px] font-extrabold rounded-md">
                  {authUser.role === 'super_admin' ? 'SUPER' : 'ADMIN'}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Log Keluar Pentadbir"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all border border-slate-700/60"
              title="Log Masuk Pentadbir (Admin Access)"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          )}

          {/* Authentication Link pointing to apps.nasadef.com.my/login */}
          <a
            href="https://apps.nasadef.com.my/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-900 flex items-center space-x-1.5 transition-all"
            title="Log Masuk Pengguna Nasadef"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Portal Nasadef</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Mobile Search input bar */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 md:hidden bg-slate-50 dark:bg-slate-900/90">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari APK, Windows Apps, ISO, USB Tools..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
};
