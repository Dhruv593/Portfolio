import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
            Career Trajectory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Professional Experience
          </h2>
        </div>

        <div className="relative border-l-2 border-slate-200/90 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-10">
          {experience.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full border-4 border-white bg-[#0058be] group-hover:scale-125 transition-transform shadow-xs" />

              <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 hover:border-blue-200 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#151c27]">{exp.role}</h3>
                    <p className="text-sm font-semibold text-[#0058be]">{exp.company}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.period}</span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
