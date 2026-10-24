import React from 'react';
import { Award } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#151c27]">
            Education & Qualifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200">
          {sortedEducation.map((edu) => (
            <div key={edu.id} className="border-b border-slate-200 py-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">
                  {edu.period}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#151c27]">{edu.degree}</h3>
                <p className="text-sm font-medium text-[#0058be]">{edu.institution}</p>
              </div>

              {edu.description && (
                <p className="text-slate-600 text-base leading-relaxed">{edu.description}</p>
              )}

              {edu.gpaOrHonors && (
                <div className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
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
