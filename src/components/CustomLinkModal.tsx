import React, { useState } from 'react';
import { X, Link2, Plus, Globe, Check } from 'lucide-react';
import { AppCategory, AppItem } from '../types';
import { detectCategoryFromFileName, generateDefaultRequirements, generateScreenshotsForFile, getThumbnailForCategory } from '../services/folderScanner';

interface CustomLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApp: (newApp: AppItem) => void;
}

export const CustomLinkModal: React.FC<CustomLinkModalProps> = ({ isOpen, onClose, onAddApp }) => {
  const [url, setUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [category, setCategory] = useState<AppCategory>('windows-apps');
  const [fileSize, setFileSize] = useState('85 MB');
  const [version, setVersion] = useState('v1.0.0');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    try {
      const parsed = new URL(val);
      const filename = parsed.pathname.split('/').pop() || '';
      if (filename) {
        const detectedCat = detectCategoryFromFileName(filename);
        setCategory(detectedCat);
        const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        if (!customName) {
          setCustomName(nameWithoutExt);
        }
      }
    } catch {
      // not full url yet
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const name = customName.trim() || 'Aplikasi Pautan Kustom';
    const ext = '.' + (url.split('.').pop()?.split('?')[0] || 'exe').toLowerCase();

    const newApp: AppItem = {
      id: `custom-link-${Date.now()}`,
      name,
      version: version.trim() || 'v1.0.0',
      category,
      fileSize: fileSize.trim() || '75 MB',
      fileSizeBytes: 75 * 1024 * 1024,
      extension: ext,
      description: description.trim() || `Aplikasi ditambah secara terus daripada pautan luar: ${url}`,
      thumbnail: getThumbnailForCategory(category),
      screenshots: generateScreenshotsForFile(name, category),
      requirements: generateDefaultRequirements(category, 75 * 1024 * 1024),
      downloadUrl: url.trim(),
      mirrorUrl: 'https://apps.nasadef.com.my/login',
      releaseDate: new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' }),
      developer: 'Pengguna / Pautan Luar Disahkan',
      downloadsCount: 1,
      rating: 5.0,
      isVerified: true
    };

    onAddApp(newApp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Link2 className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Tambah Pautan Muat Turun (Set Link)</h3>
              <p className="text-xs text-blue-100">Daftar fail atau aplikasi dari URL luar ke katalog</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              URL Muat Turun Fail / Pautan Repositori <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com/software/game-patch.apk"
              value={url}
              onChange={handleUrlChange}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Aplikasi / Fail
              </label>
              <input
                type="text"
                placeholder="Contoh: Modded Game Pack"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Versi
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Menu Utama
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="apk-apps-games">Apk Apps & Games</option>
                <option value="windows-apps">Windows Apps</option>
                <option value="os-games">OS & Games</option>
                <option value="usb-bootable">USB Bootable Creator Apps</option>
                <option value="file-video-downloader">File & Video Downloader Apps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Anggaran Saiz Fail
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="cth: 120 MB atau 4.5 GB"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan Ringkas Fail
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Huraian ringkas tentang ciri-ciri fail ini..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah ke Senarai Laman Web</span>
          </button>
        </form>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Watermark: <strong className="text-blue-600 dark:text-blue-400">RazifApps@nasadef®</strong></span>
          <a href="https://nasadef.com.my" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 underline font-medium">
            https://nasadef.com.my
          </a>
        </div>
      </div>
    </div>
  );
};
