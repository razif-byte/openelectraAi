import React, { useState } from 'react';
import { 
  X, Download, ExternalLink, QrCode, ShieldCheck, HardDrive, Cpu, 
  Layers, Calendar, User, Star, ChevronLeft, ChevronRight, Sparkles, 
  CheckCircle2, AlertTriangle, FileText, Share2, Copy, Check, Edit3
} from 'lucide-react';
import { AppItem } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { askGeminiAppAdvisor } from '../services/geminiService';
import { detectUserDevice } from '../utils/deviceDetector';

interface AppDetailModalProps {
  app: AppItem | null;
  onClose: () => void;
  onOpenReleaseNotes: (appName: string, version: string) => void;
  isAdmin?: boolean;
  onOpenEditApp?: (app: AppItem) => void;
  onDownload?: (app: AppItem) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onOpenReleaseNotes,
  isAdmin,
  onOpenEditApp,
  onDownload
}) => {
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!app) return null;

  const deviceInfo = detectUserDevice();

  const handleAskAiCompatibility = async () => {
    setIsAskingAi(true);
    try {
      const advice = await askGeminiAppAdvisor(
        app.name,
        `${deviceInfo.os} (${deviceInfo.browser})`,
        `Adakah aplikasi ${app.name} bersaiz ${app.fileSize} sesuai untuk peranti saya? Apakah spesifikasi optimumnya?`
      );
      setAiAdvice(advice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAskingAi(false);
    }
  };

  const handleShareApp = async () => {
    const appUrl = `${window.location.origin}/?app=${encodeURIComponent(app.id)}`;
    const shareData = {
      title: `${app.name} (${app.version}) - RazifApps@nasadef®`,
      text: `Muat turun fail ${app.name} (${app.fileSize}) di portal rasmi RazifApps Nasadef:\n${app.description}`,
      url: appUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(appUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2200);
          } catch {}
        }
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(appUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {}
    }
  };

  const screenshots = app.screenshots && app.screenshots.length > 0 
    ? app.screenshots 
    : [{ url: app.thumbnail, caption: 'Tangkapan Skrin Utama' }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with watermark */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[11px] font-bold rounded-md">
              {app.extension.toUpperCase()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Dibangunkan oleh <a href="https://nasadef.com.my" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">RazifApps@nasadef®</a>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareApp}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-semibold ${
                copiedLink
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-750'
              }`}
              title="Kongsi Pautan Aplikasi ke Media Sosial (Web Share API)"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              <span>{copiedLink ? 'Pautan Dikongsi' : 'Kongsi'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Title & App Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={app.thumbnail}
              alt={app.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {app.name}
                </h3>
                <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                  {app.version}
                </span>
                {app.isVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Rasmi & Disahkan
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {app.description}
              </p>

              {/* Quick stats pills */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center">
                  <HardDrive className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  <strong>Saiz:</strong>&nbsp;{app.fileSize}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" />
                  <strong>{app.rating}</strong> ({app.downloadsCount.toLocaleString()} muat turun)
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {app.releaseDate}
                </span>
              </div>
            </div>
          </div>

          {/* Action Download Row */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (onDownload) {
                    onDownload(app);
                  } else {
                    const link = document.createElement('a');
                    link.href = app.downloadUrl;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.setAttribute('download', `${app.name}${app.extension}`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                className={`flex-1 sm:flex-initial px-6 py-3 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all ${
                  isAdmin 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 ring-2 ring-emerald-400/50' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                }`}
                title={isAdmin ? "Terus Muat Turun Fail (Akses Pentadbir - Lulus Serta Merta Tanpa Sekatan)" : `Muat Turun Fail (${app.fileSize})`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {isAdmin 
                    ? `Muat Turun Terus (Admin - Lulus Automatik)` 
                    : `Muat Turun Fail (${app.fileSize})`}
                </span>
              </button>

              <a
                href="https://apps.nasadef.com.my/login"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 transition-colors shrink-0"
                title="Log masuk untuk kelajuan tanpa had & muat turun berkelajuan tinggi"
              >
                <span>Akses Akaun Nasadef</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {isAdmin && onOpenEditApp && (
                <button
                  onClick={() => {
                    onOpenEditApp(app);
                    onClose();
                  }}
                  className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                  title="Ubah Pautan & Maklumat (Admin)"
                >
                  <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Ubah Pautan Fail</span>
                </button>
              )}

              <button
                onClick={handleShareApp}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm border ${
                  copiedLink
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title="Kongsi Pautan Aplikasi ke Media Sosial (Web Share API)"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-blue-600" />}
                <span>{copiedLink ? 'Pautan Dikongsi' : 'Kongsi (Share)'}</span>
              </button>

              <button
                onClick={() => setShowQr(!showQr)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>{showQr ? 'Tutup QR' : 'Imbas QR Telefon'}</span>
              </button>

              <button
                onClick={() => onOpenReleaseNotes(app.name, app.version)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Release Notes Play Console</span>
              </button>
            </div>
          </div>

          {/* QR Code expansion */}
          {showQr && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-200">
              <QRCodeDisplay
                value={`https://apps.nasadef.com.my/login?app=${app.id}&file=${encodeURIComponent(app.name)}`}
                size={140}
                label={`QR Muat Turun: ${app.name}`}
                sublabel="Imbas untuk buka pautan muat turun"
              />
              <div className="text-xs space-y-1.5 text-center sm:text-left">
                <h5 className="font-bold text-slate-900 dark:text-white">Pemasangan Mudah Alih Pantas</h5>
                <p className="text-slate-600 dark:text-slate-300">
                  Imbas QR ini menggunakan kamera telefon peranti anda. Fail akan terus disalurkan ke peranti anda tanpa perlu menyalin pautan secara manual.
                </p>
                <p className="text-slate-400 font-mono text-[11px]">
                  Pautan rasmi: https://apps.nasadef.com.my/login
                </p>
              </div>
            </div>
          )}

          {/* Screenshot Gallery Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Tangkapan Skrin Aplikasi ({screenshots.length})</span>
              </h4>
              <span className="text-xs text-slate-500">
                Gambar {activeScreenshotIdx + 1} daripada {screenshots.length}
              </span>
            </div>

            {/* Main Featured Screenshot */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:h-80 w-full group border border-slate-200 dark:border-slate-800 shadow-md">
              <img
                src={screenshots[activeScreenshotIdx].url}
                alt={screenshots[activeScreenshotIdx].caption}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <p className="text-xs sm:text-sm font-semibold text-white drop-shadow">
                  {screenshots[activeScreenshotIdx].caption}
                </p>
              </div>

              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveScreenshotIdx((prev) => (prev - 1 + screenshots.length) % screenshots.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveScreenshotIdx((prev) => (prev + 1) % screenshots.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/60 hover:bg-slate-900 text-white rounded-full backdrop-blur-sm transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails preview strip */}
            {screenshots.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {screenshots.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveScreenshotIdx(idx)}
                    className={`relative w-24 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeScreenshotIdx === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={s.url} alt={s.caption} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* System Requirements Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Keperluan Sistem (System Requirements)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sistem Operasi (OS)</span>
                <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                  {app.requirements.os}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Memori (RAM)</span>
                <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                  {app.requirements.ram}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ruang Storan Kosong</span>
                <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                  {app.requirements.storage}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Seni Bina (Architecture)</span>
                <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                  {app.requirements.architecture || 'Universal'}
                </span>
              </div>

              {app.requirements.processor && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pemproses (CPU)</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block">
                    {app.requirements.processor}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* AI Compatibility Advisor */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  Penganalisis Keserasian AI (Gemini Advisor)
                </h5>
              </div>
              <button
                onClick={handleAskAiCompatibility}
                disabled={isAskingAi}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1 disabled:opacity-50"
              >
                {isAskingAi ? 'Sedang Menganalisis...' : 'Periksa Keserasian Peranti Saya'}
              </button>
            </div>

            {aiAdvice ? (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-purple-100 dark:border-purple-900/40">
                {aiAdvice}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sistem akan membandingkan perkakasan peranti anda ({deviceInfo.os}) dengan keperluan aplikasi ini secara masa nyata menggunakan Gemini.
              </p>
            )}
          </div>

          {/* Detailed description */}
          {app.longDescription && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Huraian Lanjut & Ciri-Ciri Utama
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {app.longDescription}
              </p>
            </div>
          )}

          {/* SHA-256 Checksum */}
          {app.sha256 && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400">
              <span className="font-bold text-[10px] uppercase block mb-1 text-slate-500">SHA256 Checksum:</span>
              <span className="break-all">{app.sha256}</span>
            </div>
          )}
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
