import React from 'react';
import { ArrowRight, Mail, ExternalLink, Github, Linkedin, FileText } from 'lucide-react';
import { ProfileData } from '../../types';
import { AiHeroGraph } from './AiHeroGraph';

interface HeroSectionProps {
  profile: ProfileData;
  onExploreClick: () => void;
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  onExploreClick,
  onContactClick,
}) => {
  return (
    <section id="hero" className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 px-6 sm:px-8 lg:px-10 max-w-6xl mx-auto overflow-hidden flex flex-col justify-center min-h-[calc(100vh-5rem)] scroll-mt-20">
      {/* Decorative Ambient Blue Glows (Background Mesh) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-tr from-[#2170e4]/10 via-[#0058be]/5 to-blue-200/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 -left-16 w-80 h-80 bg-[#2170e4]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-8 -right-16 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Background Micro Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none -z-10" />

      {/* Responsive Grid: ~60% Text (7 cols), ~40% AI Knowledge Graph (5 cols) on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 w-full relative z-10">
        
        {/* Left Column: Core Intro & CTAs (approx 60% on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

          {/* Hero Title & Greeting */}
          <div className="space-y-3.5">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#151c27] leading-[1.1]">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0058be] to-[#2170e4]">
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
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm sm:text-base group"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onContactClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 text-[#151c27] font-bold rounded-2xl shadow-2xs hover:border-slate-300 transition-all duration-200 cursor-pointer text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 text-[#0058be]" />
              <span>Get in Touch</span>
            </button>
          </div>

          {/* Quick Social & Resume Links */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-slate-500 text-xs sm:text-sm font-medium border-t border-slate-200/60 max-w-xl w-full">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Resume</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: AI Neural Network Graph (circular motion, slightly compact & centered) */}
        <div className="lg:col-span-5 w-full h-[260px] sm:h-[340px] lg:h-[380px] relative flex items-center justify-center">
          <AiHeroGraph className="w-full h-full max-w-md mx-auto" />
        </div>

      </div>
    </section>
  );
};

