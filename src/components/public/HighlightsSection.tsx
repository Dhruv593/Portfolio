import React from 'react';
import { Layers, Zap, Users, Cpu } from 'lucide-react';
import { Project, ExperienceItem } from '../../types';

interface HighlightsSectionProps {
  projects: Project[];
  experience: ExperienceItem[];
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ projects, experience }) => {
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'Published').length;
  const totalYearsExperience = experience.length > 0 ? `${experience.length}+ Years` : '3+ Years';

  return (
    <section id="highlights" className="py-12 bg-white border-y border-slate-200/80 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col items-center justify-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0058be] flex items-center justify-center mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#151c27]">{totalProjects}</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">Portfolio Projects</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col items-center justify-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#151c27]">{publishedProjects}</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">Live Deployments</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col items-center justify-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Cpu className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#151c27]">{totalYearsExperience}</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">Work Experience</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-100 flex flex-col items-center justify-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#151c27]">100%</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">Client Satisfaction</p>
        </div>
      </div>
    </section>
  );
};
