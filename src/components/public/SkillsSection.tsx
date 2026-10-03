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
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Skills & Expertise
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 space-y-5 flex flex-col justify-between"
            >
              {/* Category Card Top */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(cat.category)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#151c27]">
                        {cat.category}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
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
