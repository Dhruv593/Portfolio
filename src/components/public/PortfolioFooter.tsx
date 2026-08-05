import React from 'react';
import { ArrowUp } from 'lucide-react';
import { ProfileData } from '../../types';

interface PortfolioFooterProps {
  profile: ProfileData;
  onSwitchToAdmin: () => void;
}

export const PortfolioFooter: React.FC<PortfolioFooterProps> = ({ profile, onSwitchToAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} {profile.name || 'Portfolio'}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
