import React, { useState } from 'react';
import { X, CheckCircle, Copy, ShieldCheck, Zap, DownloadCloud, HeartHandshake, Upload } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVipActivated: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onVipActivated }) => {
  const [selectedMethod, setSelectedMethod] = useState<'cimb' | 'tng'>('cimb');
  const [selectedPlan, setSelectedPlan] = useState<'supporter' | 'lifetime'>('lifetime');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [slipUploaded, setSlipUploaded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleActivateVip = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      localStorage.setItem('nasadef_vip_status', 'active');
      onVipActivated();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Akses VIP & Langganan Kelajuan Tinggi</h3>
              <p className="text-xs text-blue-100">
                Sokong pembangunan ekosistem <a href="https://nasadef.com.my" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-white">RazifApps@nasadef®</a>
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
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">VIP Berjaya Diaktifkan!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Terima kasih atas sokongan padu anda kepada <span className="font-semibold text-blue-600 dark:text-blue-400">RazifApps@nasadef®</span>. Jalur lebar muat turun tanpa had dan semua fail premium kini sedia diakses.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
                >
                  Mula Muat Turun Kelajuan VIP
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Plan Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setSelectedPlan('supporter')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    selectedPlan === 'supporter'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                        Pakej Bulanan
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-1">VIP Supporter</h4>
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">RM 10</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Akses mirror server kelajuan tinggi & keutamaan kemas kini 30 hari.
                  </p>
                </div>

                <div 
                  onClick={() => setSelectedPlan('lifetime')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                    selectedPlan === 'lifetime'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm">
                    Paling Popular
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                        Seumur Hidup (Lifetime)
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white mt-1">VIP Ultra Lifetime</h4>
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">RM 30</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Akses seumur hidup ke fail ISO khas, APK modded, dan sokongan VIP terus.
                  </p>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Pilih Saluran Pembayaran Rasmi
                </label>
                <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    onClick={() => setSelectedMethod('cimb')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      selectedMethod === 'cimb'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>CIMB Bank & DuitNow</span>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('tng')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      selectedMethod === 'tng'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Touch 'n Go (TNG) DuitNow</span>
                  </button>
                </div>
              </div>

              {/* Account Details & DuitNow QR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-3">
                  {selectedMethod === 'cimb' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">CIMB</span>
                        <h5 className="font-bold text-slate-900 dark:text-white">CIMB Bank Berhad</h5>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Nombor Akaun:</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            7016657934
                          </code>
                          <button
                            onClick={() => copyToClipboard('7016657934', 'cimb')}
                            className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 dark:border-blue-900"
                            title="Salin Nombor Akaun"
                          >
                            {copiedAccount === 'cimb' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nama Penerima: <strong className="text-slate-800 dark:text-slate-200">RazifApps / Nasadef</strong>
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">TNG</span>
                        <h5 className="font-bold text-slate-900 dark:text-white">Touch 'n Go DuitNow</h5>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Nombor Akaun / ID DuitNow:</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            170997196374
                          </code>
                          <button
                            onClick={() => copyToClipboard('170997196374', 'tng')}
                            className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 dark:border-blue-900"
                            title="Salin Nombor DuitNow"
                          >
                            {copiedAccount === 'tng' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Penerima: <strong className="text-slate-800 dark:text-slate-200">RazifApps@nasadef®</strong>
                      </p>
                    </>
                  )}

                  <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Saluran DuitNow rasmi dan selamat.</span>
                  </div>
                </div>

                {/* Live DuitNow QR */}
                <div className="flex flex-col items-center">
                  <QRCodeDisplay
                    value={
                      selectedMethod === 'cimb'
                        ? 'duitnow://payment?acc=7016657934&bank=CIMB&name=RazifApps'
                        : 'duitnow://payment?acc=170997196374&target=TNG&name=RazifApps'
                    }
                    size={160}
                    label={selectedMethod === 'cimb' ? 'DuitNow QR CIMB' : 'DuitNow QR Touch \'n Go'}
                    sublabel={selectedMethod === 'cimb' ? 'Akaun: 7016657934' : 'Akaun: 170997196374'}
                  />
                </div>
              </div>

              {/* Upload Slip / Verify */}
              <form onSubmit={handleActivateVip} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Muat Naik Resit / Masukkan Rujukan Transaksi (Pilihan)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: CIMB-892189 / TNG-Ref-9921"
                      className="flex-1 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <label className="cursor-pointer px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{slipUploaded ? '✓ Resit Dipilih' : 'Pilih Fail'}</span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={() => setSlipUploaded(true)}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isActivating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isActivating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-yellow-300" />
                      <span>Sahkan Pembayaran & Aktifkan VIP Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer Watermark */}
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
