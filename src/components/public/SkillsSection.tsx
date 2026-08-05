import React from 'react';
import {
  Code2,
  Palette,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { SkillCategory } from '../../types';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [] }) => {
  // Helper to pick a distinct icon for each skill category
  const getCategoryIcon = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) {
      return <Palette className="w-5 h-5 text-[#0058be]" />;
    }
    if (lower.includes('dev') || lower.includes('code') || lower.includes('engineering')) {
      return <Code2 className="w-5 h-5 text-[#0058be]" />;
    }
    if (lower.includes('strategy') || lower.includes('ops') || lower.includes('management')) {
      return <Layers className="w-5 h-5 text-[#0058be]" />;
    }
    return <Cpu className="w-5 h-5 text-[#0058be]" />;
  };

  return (
    <section id="skills" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-[#f8fafc] border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
            Technical Arsenal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Skills & Expertise
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Category Card Top */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#151c27]">
                        {cat.category}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {cat.skills.length} core technologies
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skill Badges / Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {cat.skills.map((skillName) => (
                    <div
                      key={skillName}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-blue-50/80 hover:border-blue-200 hover:text-[#0058be] transition-colors group cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span>{skillName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
