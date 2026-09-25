import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, Mail, AlertTriangle, CheckCircle, 
  ArrowRight, Key, Sparkles, UserCheck, ShieldAlert, LogIn
} from 'lucide-react';
import { getAdminUsers, loginWithGoogleEmail, loginWithCredentials } from '../services/authService';
import { AuthUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  requiredActionMessage?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  requiredActionMessage
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'password'>('google');
  const [googleEmail, setGoogleEmail] = useState('');
  const [passwordEmail, setPasswordEmail] = useState('laptoprazif@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const registeredAdmins = getAdminUsers();

  const handleGoogleQuickLogin = (email: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const res = loginWithGoogleEmail(email);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Log masuk gagal.');
      }
    }, 400);
  };

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setErrorMessage('Sila masukkan alamat emel Google.');
      return;
    }
    handleGoogleQuickLogin(googleEmail.trim());
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const res = loginWithCredentials(passwordEmail, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Kata laluan atau emel tidak sah.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Log Masuk Pentadbir (Admin Access)</h3>
              <p className="text-[11px] text-blue-100">
                Kebenaran khas pengurusan pautan & fail perisian
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Action requirement prompt */}
          {requiredActionMessage && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong className="block font-bold">Tindakan Memerlukan Akses Pentadbir:</strong>
                <span>{requiredActionMessage}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('google');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'google'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {/* Google G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Account (Disyorkan)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('password');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'password'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Emel & Kata Laluan</span>
            </button>
          </div>

          {/* Error / Warning Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed">
                <strong className="block font-bold">Akses Tidak Dibenarkan:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* TAB 1: Google Account Login */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Log masuk pantas menggunakan akaun Google pentadbir yang telah didaftarkan dalam senarai putih (Admin Whitelist).
                </p>
              </div>

              {/* Quick 1-click accounts for verified admins */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Pilih Akaun Google Pentadbir Berdaftar:
                </span>

                <div className="grid grid-cols-1 gap-2">
                  {registeredAdmins.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => handleGoogleQuickLogin(admin.email)}
                      disabled={isLoading}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 flex items-center justify-between text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <img
                          src={admin.avatarUrl}
                          alt={admin.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                        />
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                              {admin.name}
                            </span>
                            <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] font-extrabold rounded">
                              {admin.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate block">
                            {admin.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                        <span>Masuk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or enter any other Google email */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Atau taip alamat Google Account lain:
                </span>
                <form onSubmit={handleCustomGoogleLogin} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="contoh@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 shrink-0 flex items-center space-x-1"
                  >
                    <span>Sahkan & Masuk</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: Password Login */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emel Pentadbir Berdaftar
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={passwordEmail}
                    onChange={(e) => setPasswordEmail(e.target.value)}
                    placeholder="laptoprazif@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Laluan Pentadbir (Admin Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Petunjuk: Masukkan kata laluan anda atau gunakan log masuk pantas Google di tab sebelah.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Sedang Mengesahkan...' : 'Log Masuk ke Admin Panel'}</span>
              </button>
            </form>
          )}

          {/* Security notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Nota Keselamatan Sistem (Strict RBAC):
            </span>
            <p>
              Hanya 4 emel yang tersenarai secara rasmi atau pentadbir baharu yang didaftarkan oleh Super Admin sahaja boleh mengakses tetapan pautan muat turun, imbasan folder, dan fail aplikasi.
            </p>
          </div>
        </div>

        {/* Footer with Watermark */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Watermark: <strong className="text-blue-600 dark:text-blue-400">RazifApps@nasadef®</strong></span>
          <a
            href="https://nasadef.com.my"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 underline font-medium"
          >
            https://nasadef.com.my
          </a>
        </div>
      </div>
    </div>
  );
};
