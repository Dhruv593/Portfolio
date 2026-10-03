import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-9 sm:space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Professional Experience
          </h2>
        </div>

        <div className="relative space-y-5 sm:space-y-8 sm:border-l sm:border-slate-200 sm:ml-8 sm:pl-10">
          {experience.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div className="hidden sm:block absolute -left-[47px] top-2 w-3 h-3 rounded-full bg-[#0058be] ring-4 ring-white" />

              <div className="bg-white rounded-2xl px-0 py-5 sm:p-6 border-b sm:border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#151c27]">{exp.role}</h3>
                    <p className="text-sm font-semibold text-[#0058be]">{exp.company}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.period}</span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-600 text-base leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
