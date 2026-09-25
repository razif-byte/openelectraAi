import React from 'react';
import { ExternalLink, ShieldCheck, Heart, Github, Zap } from 'lucide-react';
import nasadefLogo from '../assets/images/nasadef_logo_1790318761101.jpg';

interface FooterProps {
  onOpenVipModal: () => void;
  onOpenReleaseNotes: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVipModal, onOpenReleaseNotes }) => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Watermarks */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 shadow-md shadow-blue-500/25 ring-1 ring-blue-500/20 shrink-0">
                <img
                  src={nasadefLogo}
                  alt="Nasadef Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Nasadef Download Page
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Pusat repositori perisian rasmi di bawah naungan jenama teknologi inovatif{' '}
              <a
                href="https://nasadef.com.my"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
              >
                RazifApps@nasadef®
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              . Menawarkan fail APK Android, perisian Windows, fail imej OS, alatan pencipta USB bootable, serta pemecut muat turun berkelajuan tinggi.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-semibold border border-blue-200 dark:border-blue-900">
                Watermark: RazifApps@nasadef®
              </span>
              <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-[11px] font-semibold border border-emerald-200 dark:border-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Pakej Bebas Virus & Disahkan
              </span>
            </div>
          </div>

          {/* Col 2: Saluran Pembayaran Rasmi */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span>Saluran Akaun Rasmi</span>
            </h4>
            <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-red-600 dark:text-red-400 block">CIMB Bank:</span>
                <code className="font-mono text-slate-900 dark:text-white font-bold">7016657934</code>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-blue-600 dark:text-blue-400 block">TNG DuitNow:</span>
                <code className="font-mono text-slate-900 dark:text-white font-bold">170997196374</code>
              </div>
            </div>
            <button
              onClick={onOpenVipModal}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold block pt-1"
            >
              Buka Kod QR DuitNow & Salin No. Akaun →
            </button>
          </div>

          {/* Col 3: Pautan Pantas */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Pautan & Perkhidmatan
            </h4>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://nasadef.com.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                >
                  <span>Laman Utama Rasmi (nasadef.com.my)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://apps.nasadef.com.my/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                >
                  <span>Portal Pengguna (apps.nasadef.com.my)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenReleaseNotes}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-left"
                >
                  Jana Release Notes Play Console
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Watermarks */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p className="flex items-center text-center sm:text-left">
            <span>Powered by <strong className="text-slate-900 dark:text-white">Nasadef Download Page</strong></span>
            <span className="mx-2">•</span>
            <span>Hak Cipta Terpelihara &copy; 2026</span>
          </p>

          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Watermark: <a href="https://nasadef.com.my" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">RazifApps@nasadef®</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
