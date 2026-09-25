import React, { useState } from 'react';
import { X, FolderSearch, HardDrive, RefreshCw, CheckCircle, FolderOpen, AlertCircle, FileCode, Check } from 'lucide-react';
import { scanLocalDirectory, scanPresetDirectory } from '../services/folderScanner';
import { PRESET_SCAN_DIRECTORIES } from '../data/appsData';
import { AppItem } from '../types';

interface FolderScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanCompleted: (newApps: AppItem[], sourceName: string) => void;
}

export const FolderScanModal: React.FC<FolderScanModalProps> = ({
  isOpen,
  onClose,
  onScanCompleted
}) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_SCAN_DIRECTORIES[0].path);
  const [customPath, setCustomPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [discoveredApps, setDiscoveredApps] = useState<AppItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNativeDirectoryScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanStatus('Membuka dialog pemilihan folder peranti...');
    try {
      const result = await scanLocalDirectory();
      setScanStatus(`Imbasan selesai: ${result.apps.length} fail perisian (.apk, .exe, .iso, .zip) ditemui dalam "${result.directoryName}".`);
      setDiscoveredApps(result.apps);
    } catch (err: any) {
      console.warn('Native folder scan cancelled or error:', err);
      if (err.name !== 'AbortError') {
        setErrorMessage(err.message || 'Gagal mengimbas folder. Sila gunakan pilihan folder pratetap di bawah.');
      }
      setScanStatus(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePresetScan = () => {
    setIsScanning(true);
    setErrorMessage(null);
    const target = customPath.trim() || selectedPreset;
    setScanStatus(`Sedang mengimbas direktori "${target}"...`);

    setTimeout(() => {
      const items = scanPresetDirectory(target);
      setDiscoveredApps(items);
      setScanStatus(`Imbasan berjaya! ${items.length} pakej perisian dikesan dalam direktori "${target}".`);
      setIsScanning(false);
    }, 1000);
  };

  const handleApplyToCatalog = () => {
    if (discoveredApps.length > 0) {
      onScanCompleted(discoveredApps, customPath || selectedPreset);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <FolderSearch className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Pilihan Imbasan Folder (Folder Scan Option)</h3>
              <p className="text-xs text-blue-100">
                Auto senaraikan fail & kemas kini katalog website daripada folder pilihan
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

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Method 1: Local Browser File System Access */}
          <div className="p-5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                  Disyorkan • File System API
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                  Pilih Folder Dari Peranti Tempatan Anda
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Pilih mana-mana folder pada komputer/telefon anda. Sistem akan mengimbas fail berformat <code>.apk, .exe, .iso, .zip</code> dan menyenaraikannya secara automatik.
                </p>
              </div>
            </div>

            <button
              onClick={handleNativeDirectoryScan}
              disabled={isScanning}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang Mengimbas Fail...</span>
                </>
              ) : (
                <>
                  <FolderOpen className="w-4 h-4" />
                  <span>Pilih Folder & Mulakan Imbasan</span>
                </>
              )}
            </button>
          </div>

          {/* Method 2: Preset Repositories */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Atau Pilih Daripada Folder Yang Telah Ditetapkan (Preset)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SCAN_DIRECTORIES.map((preset) => (
                <div
                  key={preset.path}
                  onClick={() => {
                    setSelectedPreset(preset.path);
                    setCustomPath('');
                  }}
                  className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                    selectedPreset === preset.path && !customPath
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:border-blue-500 font-semibold text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold truncate">{preset.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{preset.path}</p>
                </div>
              ))}
            </div>

            {/* Custom Path Input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Atau taip laluan folder tersuai (Custom Path):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  placeholder="Contoh: E:\Nasadef_Archive atau /home/user/apps"
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handlePresetScan}
                  disabled={isScanning}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  Imbas Laluan Ini
                </button>
              </div>
            </div>
          </div>

          {/* Status / Errors */}
          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl flex items-center space-x-2 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {scanStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{scanStatus}</span>
            </div>
          )}

          {/* Discovered Apps Preview */}
          {discoveredApps.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Fail Ditemui ({discoveredApps.length})
                </h5>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Sedia Untuk Disenaraikan
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {discoveredApps.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.extension.toUpperCase()} • {item.fileSize} • Kategori: {item.category}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-semibold shrink-0">
                      Disahkan
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApplyToCatalog}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Kemas Kini Katalog Laman Web Sekarang (+{discoveredApps.length} Fail)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
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
