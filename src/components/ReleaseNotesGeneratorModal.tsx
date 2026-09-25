import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, FileText, Globe, Smartphone, RefreshCw } from 'lucide-react';
import { generateAiReleaseNotes, ReleaseNotesOutput } from '../services/geminiService';
import { ReleaseNotesForm } from '../types';

interface ReleaseNotesGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAppName?: string;
  defaultVersion?: string;
}

export const ReleaseNotesGeneratorModal: React.FC<ReleaseNotesGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultAppName = 'Nasadef Mobile Hub Pro',
  defaultVersion = 'v2.4.2'
}) => {
  const [formData, setFormData] = useState<ReleaseNotesForm>({
    appName: defaultAppName,
    version: defaultVersion,
    feature1: 'Penambahbaikan kelajuan memuatkan halaman utama & enjin muat turun',
    feature2: 'Pembaikan masalah crash pada peranti Android 13+ & pengurusan memori latar',
    feature3: 'Antaramuka paparan baharu yang lebih kemas dengan Mod Gelap Pintar'
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<ReleaseNotesOutput | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateAiReleaseNotes(formData);
      setOutput(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Penjana Release Notes & Store Update (Bilingual)</h3>
              <p className="text-xs text-blue-100">
                Piawaian Google Play Console (&lt;500 Aksara) • Bahasa Melayu & English
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
          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Aplikasi
                </label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Versi Baharu
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="Contoh: v1.1.0"
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sebab Kemaskini / Ciri-Ciri Baharu yang Ditambah:
              </label>
              <input
                type="text"
                value={formData.feature1}
                onChange={(e) => setFormData({ ...formData, feature1: e.target.value })}
                placeholder="1. Penambahbaikan kelajuan..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={formData.feature2}
                onChange={(e) => setFormData({ ...formData, feature2: e.target.value })}
                placeholder="2. Pembaikan masalah crash pada peranti Android 13+..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={formData.feature3}
                onChange={(e) => setFormData({ ...formData, feature3: e.target.value })}
                placeholder="3. Antaramuka paparan baharu yang lebih kemas..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menjana Release Notes dengan AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Jana Release Notes & Deskripsi Play Console (Dwibahasa)</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Results */}
          {output && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Format Google Play Console Siap Disediakan</span>
                </h4>
                {output.generatedByAi && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Dijana Enjin AI Gemini</span>
                  </span>
                )}
              </div>

              {/* 1. Release Notes BM */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md">
                      Bahasa Melayu
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Release Notes (What's New)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-mono ${output.bmReleaseNotes.length <= 500 ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}`}>
                      {output.bmReleaseNotes.length} / 500 aksara
                    </span>
                    <button
                      onClick={() => copyText(output.bmReleaseNotes, 'bm_notes')}
                      className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      {copiedKey === 'bm_notes' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed border border-slate-100 dark:border-slate-800">
                  {output.bmReleaseNotes}
                </pre>
              </div>

              {/* 2. Release Notes EN */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-md">
                      English (Global)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Release Notes (What's New)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[11px] font-mono ${output.enReleaseNotes.length <= 500 ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-bold'}`}>
                      {output.enReleaseNotes.length} / 500 characters
                    </span>
                    <button
                      onClick={() => copyText(output.enReleaseNotes, 'en_notes')}
                      className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      {copiedKey === 'en_notes' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed border border-slate-100 dark:border-slate-800">
                  {output.enReleaseNotes}
                </pre>
              </div>

              {/* 3. Ringkasan Promo & Update Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Ringkasan Promo (BM)
                    </span>
                    <button
                      onClick={() => copyText(output.bmPromoSummary, 'bm_promo')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copiedKey === 'bm_promo' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {output.bmPromoSummary}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Promo / Short Summary (EN)
                    </span>
                    <button
                      onClick={() => copyText(output.enPromoSummary, 'en_promo')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copiedKey === 'en_promo' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {output.enPromoSummary}
                  </p>
                </div>
              </div>
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
