import React, { useState, useEffect } from 'react';
import { 
  X, Save, Trash2, Link2, HardDrive, FileText, CheckCircle, 
  AlertCircle, ShieldCheck, Tag, Cpu, Globe 
} from 'lucide-react';
import { AppItem, AppCategory } from '../types';

interface EditAppModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onClose: () => void;
  onSaveApp: (updatedApp: AppItem) => void;
  onDeleteApp: (appId: string) => void;
}

export const EditAppModal: React.FC<EditAppModalProps> = ({
  isOpen,
  app,
  onClose,
  onSaveApp,
  onDeleteApp
}) => {
  const [formData, setFormData] = useState<AppItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (app) {
      setFormData({ ...app });
      setConfirmDelete(false);
    }
  }, [app]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof AppItem, val: any) => {
    setFormData(prev => prev ? ({ ...prev, [field]: val }) : null);
  };

  const handleRequirementChange = (field: string, val: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          [field]: val
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveApp(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDeleteApp(formData.id);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Link2 className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Ubah Pautan & Butiran Aplikasi</h3>
              <p className="text-[11px] text-blue-100">
                Akses Pentadbir Eksklusif • Kemas kini URL muat turun & konfigurasi fail
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Download Link section (Key requirement) */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pautan Muat Turun Utama (Direct Download URL) <span className="text-rose-500">*</span>
              </label>
            </div>
            <input
              type="url"
              required
              value={formData.downloadUrl}
              onChange={(e) => handleChange('downloadUrl', e.target.value)}
              placeholder="https://drive.google.com/... atau https://server.nasadef.com.my/..."
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Pengguna akan terus memuat turun daripada URL ini apabila menekan butang Muat Turun atau mengimbas kod QR.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pautan Sandaran (Mirror / Portal URL)
              </label>
              <input
                type="text"
                value={formData.mirrorUrl || ''}
                onChange={(e) => handleChange('mirrorUrl', e.target.value)}
                placeholder="https://apps.nasadef.com.my/login"
                className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* App Name and Version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Aplikasi / Pakej
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Versi Fail
              </label>
              <input
                type="text"
                required
                value={formData.version}
                onChange={(e) => handleChange('version', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Category, Size & Extension */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Menu
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as AppCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                <option value="apk-apps-games">Apk Apps & Games</option>
                <option value="windows-apps">Windows Apps</option>
                <option value="os-games">OS & Games</option>
                <option value="usb-bootable">USB Bootable Creator Apps</option>
                <option value="file-video-downloader">File & Video Downloader Apps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Format / Sambungan Fail
              </label>
              <input
                type="text"
                value={formData.extension}
                onChange={(e) => handleChange('extension', e.target.value)}
                placeholder=".apk, .exe, .iso, .zip"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Saiz Fail (Teks)
              </label>
              <input
                type="text"
                value={formData.fileSize}
                onChange={(e) => handleChange('fileSize', e.target.value)}
                placeholder="cth: 85 MB atau 4.2 GB"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* System Requirements */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
              Keperluan Sistem (System Requirements)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400">OS</label>
                <input
                  type="text"
                  value={formData.requirements.os}
                  onChange={(e) => handleRequirementChange('os', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400">RAM</label>
                <input
                  type="text"
                  value={formData.requirements.ram}
                  onChange={(e) => handleRequirementChange('ram', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400">Storan</label>
                <input
                  type="text"
                  value={formData.requirements.storage}
                  onChange={(e) => handleRequirementChange('storage', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan Ringkas
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Actions & Delete */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                confirmDelete
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmDelete ? 'Sahkan Padam Fail Ini?' : 'Padam Aplikasi'}</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center space-x-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>

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
