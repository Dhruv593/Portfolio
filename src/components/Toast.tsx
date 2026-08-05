import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-[#0058be] text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-800 text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-white shrink-0" />,
    info: <Info className="w-5 h-5 text-white shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl transition-all duration-300 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2">{toast.text}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
