import React, { useState } from 'react';
import { Download, ExternalLink, QrCode, ShieldCheck, HardDrive, Star, ArrowUpRight, Edit3, Share2, Check } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  viewMode: 'grid' | 'list';
  onSelect: (app: AppItem) => void;
  onOpenQr: (app: AppItem) => void;
  isAdmin?: boolean;
  onEditApp?: (app: AppItem) => void;
  onDownload?: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  viewMode,
  onSelect,
  onOpenQr,
  isAdmin,
  onEditApp,
  onDownload
}) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const appUrl = `${window.location.origin}/?app=${encodeURIComponent(app.id)}`;
    const shareData = {
      title: `${app.name} (${app.version}) - RazifApps@nasadef®`,
      text: `Muat turun ${app.name} (${app.fileSize}) di RazifApps Nasadef:\n${app.description}`,
      url: appUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2200);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(appUrl);
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2200);
          } catch {}
        }
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(appUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2200);
      } catch {}
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(app);
    } else {
      window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(app)}
        className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-4 min-w-0">
          <img
            src={app.thumbnail}
            alt={app.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-inner shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {app.name}
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-md">
                {app.version}
              </span>
              {app.isVerified && (
                <span title="Disahkan Rasmi">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {app.description}
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {app.fileSize}
              </span>
              <span>•</span>
              <span className="flex items-center text-amber-500">
                <Star className="w-3 h-3 fill-amber-500 mr-1" />
                {app.rating}
              </span>
              <span>•</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                RazifApps@nasadef®
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
          {isAdmin && onEditApp && (
            <button
              onClick={() => onEditApp(app)}
              className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 rounded-xl transition-colors border border-amber-200 dark:border-amber-900 flex items-center space-x-1 text-xs font-bold"
              title="Ubah Pautan & Maklumat (Admin)"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Link</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className={`p-2 rounded-xl transition-all border flex items-center space-x-1.5 text-xs font-semibold ${
              isShared
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-slate-200 dark:border-slate-800'
            }`}
            title={isShared ? "Pautan Disalin / Dikongsi!" : "Kongsi Pautan Aplikasi (Web Share)"}
          >
            {isShared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isShared ? 'Dikongsi' : 'Share'}</span>
          </button>

          <button
            onClick={() => onOpenQr(app)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
            title="Imbas Kod QR"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 transition-all ${
              isAdmin 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 ring-2 ring-emerald-400/50' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25'
            }`}
            title={isAdmin ? "Terus Muat Turun (Akses Admin Diluluskan - Tiada Pengesahan Diperlukan)" : "Muat Turun Fail"}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Muat Turun (Lulus)' : 'Muat Turun'}</span>
          </button>

          <a
            href="https://apps.nasadef.com.my/login"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl transition-colors"
            title="Akses Log Masuk Nasadef"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Grid Mode (Default modern card)
  return (
    <div 
      onClick={() => onSelect(app)}
      className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail banner */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={app.thumbnail}
            alt={app.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
              {app.extension}
            </span>
            {app.isFeatured && (
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full shadow-md">
                Pilihan Utama
              </span>
            )}
          </div>

          {/* Bottom banner info */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center font-semibold text-slate-200">
              <HardDrive className="w-3.5 h-3.5 mr-1 text-blue-400" />
              {app.fileSize}
            </span>
            <span className="flex items-center text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 mr-1" />
              {app.rating}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {app.name}
            </h4>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
              {app.version}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {app.description}
          </p>

          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">
              Keperluan: <strong className="text-slate-700 dark:text-slate-300 font-medium">{app.requirements.ram}</strong>
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium shrink-0 ml-1">
              RazifApps®
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div 
        className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md text-center flex items-center justify-center space-x-1.5 transition-all ${
            isAdmin 
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 ring-2 ring-emerald-400/40' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
          }`}
          title={isAdmin ? "Terus Muat Turun (Akses Admin Diluluskan - Tiada Pengesahan Diperlukan)" : "Muat Turun Fail"}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isAdmin ? 'Muat Turun (Diluluskan)' : 'Muat Turun'}</span>
        </button>

        {isAdmin && onEditApp && (
          <button
            onClick={() => onEditApp(app)}
            className="p-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-xl transition-colors border border-amber-200 dark:border-amber-900"
            title="Ubah Pautan & Konfigurasi Fail (Admin)"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleShare}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            isShared
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-400'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
          title={isShared ? "Pautan Berjaya Dikongsi / Disalin!" : "Kongsi Aplikasi (Web Share)"}
        >
          {isShared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onOpenQr(app)}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
          title="Kod QR Auto-Install"
        >
          <QrCode className="w-4 h-4" />
        </button>

        <a
          href="https://apps.nasadef.com.my/login"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
          title="Akses Rasmi https://apps.nasadef.com.my/login"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
