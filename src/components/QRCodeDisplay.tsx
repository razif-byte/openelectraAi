import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  sublabel?: string;
  colorDark?: string;
  colorLight?: string;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  label,
  sublabel,
  colorDark = '#0f172a',
  colorLight = '#ffffff',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          color: {
            dark: colorDark,
            light: colorLight
          },
          errorCorrectionLevel: 'H'
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [value, size, colorDark, colorLight]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      <div className="relative p-2 bg-white rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="block rounded-lg max-w-full h-auto" />
      </div>

      {label && (
        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white text-center">
          {label}
        </p>
      )}

      {sublabel && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-0.5 line-clamp-1">
          {sublabel}
        </p>
      )}

      <button
        onClick={handleCopy}
        className="mt-2.5 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg transition-colors border border-blue-200 dark:border-blue-900/50"
      >
        {copied ? '✓ Disalin ke Papan Keratan' : 'Salin Pautan / Maklumat'}
      </button>
    </div>
  );
};
