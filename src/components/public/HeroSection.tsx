import React from 'react';
import { ArrowRight, Mail, ExternalLink, Github, Linkedin, FileText } from 'lucide-react';
import { ProfileData } from '../../types';
import { AiHeroGraph } from './AiHeroGraph';

interface HeroSectionProps {
  profile: ProfileData;
  onExploreClick: () => void;
  onContactClick: () => void;
  showExplore: boolean;
  showContact: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  onExploreClick,
  onContactClick,
  showExplore,
  showContact,
}) => {
  return (
    <section id="hero" className="relative pt-16 sm:pt-20 pb-12 sm:pb-20 px-6 sm:px-8 lg:px-10 max-w-6xl mx-auto overflow-hidden flex flex-col justify-center min-h-[calc(100svh-5rem)] scroll-mt-20">
      {/* Responsive introduction and graph layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-12 w-full relative z-10">
        
        {/* Introduction and actions */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

          {/* Hero Title & Greeting */}
          <div className="space-y-3.5">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#151c27] leading-[1.1]">
              Hi, I'm{' '}
              <span className="text-[#0058be]">
                {profile.name || 'Portfolio Admin'}
              </span>
            </h1>

            {profile.title && (
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
                {profile.title}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 w-full sm:w-auto">
            {showExplore && <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2.5 px-7 py-3 bg-[#0058be] hover:bg-[#2170e4] text-white font-semibold rounded-xl transition-colors cursor-pointer text-base group"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>}

            {showContact && <button
              onClick={onContactClick}
              className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-[#151c27] font-semibold rounded-xl transition-colors cursor-pointer text-base"
            >
              <Mail className="w-4 h-4 text-[#0058be]" />
              <span>Get in Touch</span>
            </button>}
          </div>

          {/* Quick Social & Resume Links */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-1 text-slate-600 text-sm font-medium border-t border-slate-200 max-w-xl w-full">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-slate-700" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resume</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: AI Neural Network Graph (circular motion, slightly compact & centered) */}
        <div className="lg:col-span-5 w-full h-[180px] sm:h-[240px] lg:h-[280px] relative flex items-center justify-center opacity-45">
          <AiHeroGraph className="w-full h-full max-w-md mx-auto" />
        </div>

      </div>
    </section>
  );
};

