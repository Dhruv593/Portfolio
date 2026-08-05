import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Globe, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPublic: () => void;
  projectsCount: number;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onSwitchToPublic,
  projectsCount,
}) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep(2);
            return 100;
          }
          return prev + 20;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 text-center space-y-5">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="w-14 h-14 bg-blue-50 text-[#0058be] rounded-2xl mx-auto flex items-center justify-center animate-bounce">
              <RefreshCw className="w-7 h-7 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-[#151c27]">
              Publishing Portfolio Changes...
            </h3>
            <p className="text-xs text-slate-500">
              Syncing {projectsCount} projects, work experience, and profile assets live to Cloud Run...
            </p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0058be] h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-[#151c27]">
              Portfolio is Live!
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All admin updates are deployed. Your public portfolio is updated with fresh project showcases and active database records.
            </p>
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onSwitchToPublic();
                }}
                className="w-full py-3 bg-[#0058be] hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                View Public Portfolio Page
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Continue Editing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
