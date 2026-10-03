import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, FileText, ChevronDown } from 'lucide-react';
import { ProfileData } from '../types';
import { isSectionVisible, portfolioSections } from '../utils/sectionVisibility';

interface PublicPortfolioNavProps {
  profile: ProfileData;
}

export const PublicPortfolioNav: React.FC<PublicPortfolioNavProps> = ({
  profile,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const visibleSections = portfolioSections.filter(({ id }) => isSectionVisible(profile, id));
  const primaryIds = new Set(['hero', 'about', 'projects', 'contact']);
  const primarySections = visibleSections.filter(({ id }) => primaryIds.has(id));
  const moreSections = visibleSections.filter(({ id }) => !primaryIds.has(id));

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMoreOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMoreOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [isMoreOpen]);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsMoreOpen(false);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    setTimeout(() => {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior });
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
          onClick={() => scrollTo('hero')}
          className="text-left cursor-pointer group shrink-0"
        >
          <span className="font-bold text-lg sm:text-xl text-[#151c27] tracking-tight group-hover:text-[#0058be] transition-colors">
            {profile.name}
          </span>
        </button>

        {/* Center: Centered Nav Tabs */}
        <nav aria-label="Portfolio navigation" className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 font-medium text-sm text-slate-700">
          {primarySections.map(({ id, label }) => (
            <button key={id} onClick={() => scrollTo(id)} className="min-h-11 rounded-lg px-2 hover:bg-slate-100 hover:text-[#0058be] transition-colors cursor-pointer">
              {id === 'hero' ? 'Home' : label}
            </button>
          ))}
          {moreSections.length > 0 && (
            <div ref={moreMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                aria-expanded={isMoreOpen}
                aria-controls="more-portfolio-menu"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 hover:bg-slate-100 hover:text-[#0058be] cursor-pointer"
              >
                More <ChevronDown className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMoreOpen && (
                <div id="more-portfolio-menu" className="absolute left-0 top-full mt-2 min-w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {moreSections.map(({ id, label }) => (
                    <button key={id} type="button" onClick={() => scrollTo(id)} className="block min-h-11 w-full rounded-lg px-3 text-left hover:bg-slate-100 hover:text-[#0058be] cursor-pointer">
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Side: Resume Button */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            onClick={handleResumeClick}
            className="min-h-11 px-4 rounded-xl text-sm font-semibold bg-[#0058be] text-white hover:bg-[#004494] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </button>
        </div>

        {/* Mobile & Tablet Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] lg:hidden"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-portfolio-menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Menu Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-portfolio-menu" className="absolute top-full left-3 right-3 mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-xl sm:left-6 sm:right-6 lg:hidden">
          <nav aria-label="Mobile portfolio navigation" className="flex flex-col space-y-1 font-medium text-base">
            {primarySections.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="min-h-11 rounded-lg px-2 text-left text-[#151c27] hover:bg-slate-100 hover:text-[#0058be] focus-visible:outline-2 focus-visible:outline-[#0058be]">
                {id === 'hero' ? 'Home' : label}
              </button>
            ))}
            {moreSections.length > 0 && (
              <div className="mt-2 border-t border-slate-200 pt-3">
                <p className="px-2 pb-1 text-sm font-medium text-slate-500">More sections</p>
                {moreSections.map(({ id, label }) => (
                  <button key={id} onClick={() => scrollTo(id)} className="block min-h-11 w-full rounded-lg px-2 text-left text-[#151c27] hover:bg-slate-100 hover:text-[#0058be] focus-visible:outline-2 focus-visible:outline-[#0058be]">
                    {label}
                  </button>
                ))}
              </div>
            )}
          </nav>
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={handleResumeClick}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-800 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be]"
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
