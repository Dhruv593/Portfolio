import React from 'react';
import { Award, GraduationCap } from 'lucide-react';
import { EducationItem } from '../../types';

interface EducationSectionProps {
  education?: EducationItem[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education = [] }) => {
  if (!education || education.length === 0) return null;

  const sortedEducation = [...education].sort((a, b) => {
    const getYearAndPresence = (periodStr: string) => {
      if (!periodStr) return { year: 0, isPresent: false };
      const normalized = periodStr.toLowerCase();
      const isPresent = normalized.includes('present') || normalized.includes('current');
      
      const years = periodStr.match(/\b(19|20)\d{2}\b/g);
      
      if (isPresent) {
        const startYear = years ? Math.max(...years.map(Number)) : new Date().getFullYear();
        return { year: startYear, isPresent: true };
      }
      
      if (years && years.length > 0) {
        const maxYear = Math.max(...years.map(Number));
        return { year: maxYear, isPresent: false };
      }
      
      return { year: 0, isPresent: false };
    };

    const infoA = getYearAndPresence(a.period);
    const infoB = getYearAndPresence(b.period);

    if (infoA.isPresent && !infoB.isPresent) return -1;
    if (!infoA.isPresent && infoB.isPresent) return 1;

    if (infoA.year !== infoB.year) {
      return infoB.year - infoA.year;
    }
    return 0;
  });

  return (
    <section id="education" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Academic Background
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Education & Qualifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedEducation.map((edu) => (
            <div key={edu.id} className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {edu.period}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#151c27]">{edu.degree}</h3>
                <p className="text-sm font-semibold text-[#0058be]">{edu.institution}</p>
              </div>

              {edu.description && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{edu.description}</p>
              )}

              {edu.gpaOrHonors && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  <Award className="w-3.5 h-3.5" />
                  <span>{edu.gpaOrHonors}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
