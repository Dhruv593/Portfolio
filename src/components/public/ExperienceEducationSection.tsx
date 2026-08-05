import React from 'react';
import { Award, GraduationCap, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { ExperienceItem, EducationItem } from '../../types';

interface ExperienceEducationSectionProps {
  experience: ExperienceItem[];
  education?: EducationItem[];
}

export const ExperienceEducationSection: React.FC<ExperienceEducationSectionProps> = ({
  experience,
  education = [],
}) => {
  return (
    <section id="experience" className="py-20 sm:py-24 bg-white border-y border-slate-200/80 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Experience Section */}
        <div className="space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
              Career Trajectory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
              Professional Work Experience
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              A history of engineering leadership, cloud backend design, and frontend development.
            </p>
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

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Highlights & Impact</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                        {exp.achievements.map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="space-y-10 pt-10 border-t border-slate-200/80">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                Academic Background
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
                Education & Qualifications
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu) => (
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

                  {edu.description && <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{edu.description}</p>}

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
        )}
      </div>
    </section>
  );
};
