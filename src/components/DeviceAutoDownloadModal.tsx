import React, { useState } from 'react';
import { X, Smartphone, Monitor, Download, QrCode, CheckCircle, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { detectUserDevice } from '../utils/deviceDetector';
import { AppItem } from '../types';

interface DeviceAutoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeApp?: AppItem | null;
}

export const DeviceAutoDownloadModal: React.FC<DeviceAutoDownloadModalProps> = ({
  isOpen,
  onClose,
  activeApp
}) => {
  const deviceInfo = detectUserDevice();
  const [selectedPlatform, setSelectedPlatform] = useState<'auto' | 'android' | 'windows' | 'all'>('auto');

  if (!isOpen) return null;

  const appToDownload = activeApp || {
    id: 'nasadef-suite',
    name: 'Nasadef Universal Client Hub',
    version: 'v2.4.2',
    fileSize: '42.8 MB',
    extension: deviceInfo.os === 'Android' ? '.apk' : '.exe',
    downloadUrl: 'https://apps.nasadef.com.my/login'
  };

  const getPlatformDownloadUrl = () => {
    const baseUrl = 'https://apps.nasadef.com.my';
    if (selectedPlatform === 'android' || (selectedPlatform === 'auto' && deviceInfo.os === 'Android')) {
      return `${baseUrl}/files/apk/Nasadef_Mobile_Hub_v2.4.2.apk`;
    }
    if (selectedPlatform === 'windows' || (selectedPlatform === 'auto' && deviceInfo.os === 'Windows')) {
      return `${baseUrl}/files/win/Nasadef_PC_Suite_v3.1.exe`;
    }
    return `${baseUrl}/login`;
  };

  const currentDownloadUrl = getPlatformDownloadUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <QrCode className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Auto Download & Pasang Melalui QR</h3>
              <p className="text-xs text-blue-100">Disesuaikan khas mengikut spesifikasi peranti anda</p>
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
          {/* Detected Device Banner */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                {deviceInfo.isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Peranti Anda Dikesan
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {deviceInfo.os} ({deviceInfo.browser})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Format disyorkan: <span className="font-semibold text-blue-600 dark:text-blue-400">{deviceInfo.recommendedFormat}</span>
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Serasi Sepenuhnya
            </span>
          </div>

          {/* QR Code & Direct Scan */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <QRCodeDisplay
              value={currentDownloadUrl}
              size={180}
              label={appToDownload.name}
              sublabel={`Versi: ${appToDownload.version} • ${appToDownload.fileSize}`}
              className="shrink-0"
            />

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Imbas dengan Kamera Telefon
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Hala kamera telefon atau aplikasi pengimbas QR anda ke kod ini untuk terus memuat turun dan memasang pakej pemasangan secara automatik ke peranti anda.
              </p>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center text-slate-700 dark:text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
                  <span>Diperiksa Bebas Virus & Malware</span>
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Pautan: </span>
                  <code className="ml-1 text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                    {currentDownloadUrl}
                  </code>
                </div>
              </div>

              {/* Direct Download & Login link */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={currentDownloadUrl}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 text-center flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Muat Turun Terus Pada Peranti Ini</span>
                </a>
                <a
                  href="https://apps.nasadef.com.my/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs rounded-xl text-center flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Log Masuk Nasadef</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Switch Format Option */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Ingin muat turun untuk sistem operasi lain?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedPlatform('auto')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                  selectedPlatform === 'auto'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Auto (Ikut Peranti)
              </button>
              <button
                onClick={() => setSelectedPlatform('android')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                  selectedPlatform === 'android'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Android (.APK)
              </button>
              <button
                onClick={() => setSelectedPlatform('windows')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                  selectedPlatform === 'windows'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Windows (.EXE / .ISO)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Hak Cipta: <strong className="text-blue-600 dark:text-blue-400">RazifApps@nasadef®</strong></span>
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
