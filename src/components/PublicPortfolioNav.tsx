import React, { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { ProfileData } from '../types';
import { isSectionVisible, portfolioSections } from '../utils/sectionVisibility';

interface PublicPortfolioNavProps {
  profile: ProfileData;
}

export const PublicPortfolioNav: React.FC<PublicPortfolioNavProps> = ({
  profile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleResumeClick = (e: React.MouseEvent) => {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer');
    } else {
      e.preventDefault();
      scrollTo('contact');
    }
  };

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full max-w-7xl mx-auto px-3 sm:px-6 transition-all">
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xs px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left Side: Person Name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-left cursor-pointer group shrink-0"
        >
          <span className="font-bold text-lg sm:text-xl text-[#151c27] tracking-tight group-hover:text-[#0058be] transition-colors">
            {profile.name}
          </span>
        </button>

        {/* Center: Centered Nav Tabs */}
        <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 font-medium text-sm text-[#424754]">
          {portfolioSections.filter(({ id }) => isSectionVisible(profile, id)).map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} className="hover:text-[#0058be] transition-colors cursor-pointer">
              {id === 'hero' ? 'Home' : label}
            </button>
          ))}
        </nav>

        {/* Right Side: Resume Button */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={handleResumeClick}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#2170e4] text-white hover:bg-[#0058be] transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </button>
        </div>

        {/* Mobile & Tablet Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-6 py-6 space-y-4 shadow-xl animate-slide-down">
          <nav className="flex flex-col space-y-3 font-semibold text-sm">
            {portfolioSections.filter(({ id }) => isSectionVisible(profile, id)).map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-left text-[#151c27] hover:text-[#0058be] py-1 cursor-pointer">
                {id === 'hero' ? 'Home' : label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleResumeClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-[#2170e4] text-white hover:bg-[#0058be] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
