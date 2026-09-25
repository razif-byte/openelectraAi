import React, { useState } from 'react';
import { 
  X, ShieldCheck, Users, FolderSearch, Link2, Plus, 
  Trash2, Edit3, Search, UserPlus, LogOut, CheckCircle, 
  AlertCircle, HardDrive, FileText, Globe, Clock, ShieldAlert,
  Smartphone, Monitor, Cpu, Sparkles, Key
} from 'lucide-react';
import { AppItem, AuthUser, AdminUser, AdminActivityLog } from '../types';
import { 
  getAdminUsers, registerNewAdmin, removeAdmin, 
  getActivityLogs, addActivityLog 
} from '../services/authService';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  apps: AppItem[];
  onOpenEditApp: (app: AppItem) => void;
  onOpenFolderScan: () => void;
  onOpenCustomLink: () => void;
  onDeleteApp: (appId: string) => void;
  onLogout: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  apps,
  onOpenEditApp,
  onOpenFolderScan,
  onOpenCustomLink,
  onDeleteApp,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'folders' | 'admins' | 'logs'>('apps');
  const [appSearch, setAppSearch] = useState('');
  
  // Admin user registration form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin');
  const [adminList, setAdminList] = useState<AdminUser[]>(() => getAdminUsers());
  const [adminMessage, setAdminMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // App folder configuration
  const [customFolderRoot, setCustomFolderRoot] = useState('D:\\Nasadef_Repository\\Software_Package');
  const [folderSaveSuccess, setFolderSaveSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const logs = getActivityLogs();

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMessage(null);
    if (!newAdminEmail.trim()) {
      setAdminMessage({ type: 'error', text: 'Sila masukkan alamat emel Google yang sah.' });
      return;
    }

    const res = registerNewAdmin(
      { email: newAdminEmail.trim(), name: newAdminName.trim(), role: newAdminRole },
      currentUser.email
    );

    if (res.success) {
      setAdminList(getAdminUsers());
      setNewAdminEmail('');
      setNewAdminName('');
      setAdminMessage({ type: 'success', text: `Berjaya mendaftarkan pentadbir baharu: ${res.admin?.email}` });
    } else {
      setAdminMessage({ type: 'error', text: res.error || 'Gagal mendaftar pentadbir.' });
    }
  };

  const handleRemoveAdminUser = (adminId: string, email: string) => {
    if (confirm(`Adakah anda pasti ingin memadamkan pentadbir "${email}" daripada senarai berdaftar?`)) {
      const res = removeAdmin(adminId, currentUser.email);
      if (res.success) {
        setAdminList(getAdminUsers());
        setAdminMessage({ type: 'success', text: `Pentadbir ${email} berjaya dipadam.` });
      } else {
        setAdminMessage({ type: 'error', text: res.error || 'Gagal memadam pentadbir.' });
      }
    }
  };

  const handleSaveDefaultFolder = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('nasadef_default_app_folder', customFolderRoot);
    addActivityLog(currentUser.email, 'KEMASKINI_FOLDER_ROOT', `Menetapkan laluan repositori perisian ke: ${customFolderRoot}`);
    setFolderSaveSuccess(true);
    setTimeout(() => setFolderSaveSuccess(false), 3000);
  };

  const filteredApps = apps.filter(a => {
    const q = appSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.downloadUrl.toLowerCase().includes(q) ||
      a.version.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Admin Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-lg text-white">Nasadef Admin Panel</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                  {currentUser.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN AKTIF'}
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Log masuk sebagai: <strong className="text-white font-mono">{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-rose-600/80 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-colors flex items-center space-x-1.5 border border-white/10"
              title="Log Keluar dari sesi pentadbir"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Keluar</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto space-x-2">
          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
              activeTab === 'apps'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Urus Aplikasi & Pautan ({apps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('folders')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
              activeTab === 'folders'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <FolderSearch className="w-4 h-4" />
            <span>Pengurusan Folder & Imbasan</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
              activeTab === 'admins'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Senarai & Daftar Admin ({adminList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-b-2 shrink-0 ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Log Aktiviti ({logs.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: Apps & Links Management */}
          {activeTab === 'apps' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    placeholder="Cari aplikasi mengikut nama, pautan URL atau kategori..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onOpenCustomLink();
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Daftar Pautan Baru (Set Link)</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenFolderScan();
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
                  >
                    <FolderSearch className="w-3.5 h-3.5 text-blue-600" />
                    <span>Imbas Folder</span>
                  </button>
                </div>
              </div>

              {/* Apps list table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Aplikasi / Fail</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3">Versi & Saiz</th>
                        <th className="p-3">Pautan Muat Turun (Download Link)</th>
                        <th className="p-3 text-right">Tindakan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={app.thumbnail}
                                alt={app.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">
                                  {app.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {app.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                              {app.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-700 dark:text-slate-300">
                              {app.version}
                            </div>
                            <span className="text-[10px] text-slate-400">{app.fileSize}</span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="flex items-center space-x-1.5 truncate">
                              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate">
                                {app.downloadUrl}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => {
                                  onOpenEditApp(app);
                                  onClose();
                                }}
                                className="p-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg transition-colors font-bold text-xs flex items-center space-x-1"
                                title="Ubah Pautan & Butiran"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Ubah Link</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Adakah anda pasti ingin memadam "${app.name}" dari website?`)) {
                                    onDeleteApp(app.id);
                                  }
                                }}
                                className="p-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Padam Fail dari Katalog"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Folders & Auto Scan Management */}
          {activeTab === 'folders' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Konfigurasi Laluan Folder Repositori (Set App Folder)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Tetapkan lokasi folder pada cakera keras / pelayan anda di mana fail .apk, .exe, .iso atau arkib disimpan. Sistem akan mengimbas folder ini untuk pemprosesan auto-listing.
                </p>

                <form onSubmit={handleSaveDefaultFolder} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customFolderRoot}
                    onChange={(e) => setCustomFolderRoot(e.target.value)}
                    placeholder="Contoh: D:\Nasadef_Repository\Software atau /home/nasadef/downloads"
                    className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Simpan Tetapan Folder
                  </button>
                </form>

                {folderSaveSuccess && (
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Laluan repositori berjaya dikemas kini!</span>
                  </div>
                )}
              </div>

              {/* Direct Folder Scan Launcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center space-x-2">
                    <FolderSearch className="w-5 h-5 text-indigo-600" />
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      File System API Scanner (Peranti Tempatan)
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Buka tetingkap folder peranti anda terus daripada pelayar web dan import fail secara masa nyata.
                  </p>
                  <button
                    onClick={() => {
                      onOpenFolderScan();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <FolderSearch className="w-4 h-4" />
                    <span>Lancarkan Pengimbas Folder Sekarang</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-emerald-600" />
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Daftar Pautan Fail Terus (Set Link)
                    </h5>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tambah pautan muat turun Google Drive, pelayan tempatan atau repositori luar secara terus ke dalam laman web.
                  </p>
                  <button
                    onClick={() => {
                      onOpenCustomLink();
                      onClose();
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Daftar Pautan Muat Turun Baru</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Admin Users Management (Core Requirement) */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              {/* Registration Form */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Daftar Pengguna Pentadbir Baharu (Register New Admin User)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Hanya pengguna dengan emel Google Account yang didaftarkan di sini sahaja yang dibenarkan mengubah pautan atau mengimbas folder.
                </p>

                <form onSubmit={handleRegisterAdmin} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Alamat Google Account Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="contoh@gmail.com"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Pentadbir / Deskripsi
                      </label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Contoh: Ahmad Razif"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Peranan (Role)
                      </label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                      >
                        <option value="admin">Admin (Ubah Link & Fail)</option>
                        <option value="super_admin">Super Admin (Kuasa Penuh)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Didahului oleh: <strong className="font-mono">{currentUser.email}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Daftarkan Pentadbir</span>
                    </button>
                  </div>
                </form>

                {adminMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    adminMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                  }`}>
                    {adminMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{adminMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Current Registered Admin List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Senarai Pentadbir Berdaftar Rasmi (Admin Whitelist)
                  </h4>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    {adminList.length} Pengguna Dibenarkan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {adminList.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img
                          src={admin.avatarUrl}
                          alt={admin.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                              {admin.name}
                            </h5>
                            <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[9px] font-extrabold rounded">
                              {admin.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono truncate">
                            {admin.email}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Didaftar: {admin.addedAt} • Oleh {admin.addedBy || 'Sistem'}
                          </p>
                        </div>
                      </div>

                      {admin.email.toLowerCase() !== 'laptoprazif@gmail.com' && (
                        <button
                          onClick={() => handleRemoveAdminUser(admin.id, admin.email)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0 ml-2"
                          title="Hapus Pentadbir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Audit Logs */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Rekod & Jejak Audit Pentadbir (Audit Trail)
                </h4>
                <span className="text-xs text-slate-400">
                  {logs.length} Rekod Keselamatan
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                          [{log.action}]
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {log.adminEmail}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {log.details}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Watermark */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
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
