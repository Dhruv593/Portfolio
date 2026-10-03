import React from 'react';
import { MapPin, Mail, Github, Linkedin, FileText } from 'lucide-react';
import { ProfileData } from '../../types';
import { ProfileAvatar } from '../ProfileAvatar';

interface AboutSectionProps {
  profile: ProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            About Me
          </h2>
        </div>

        {/* Profile and biography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile details */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-300 bg-slate-50 p-5 sm:p-8 space-y-5 shadow-sm text-[#151c27]">

            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                <ProfileAvatar
                  profile={profile}
                  className="w-full h-full"
                  fallbackClassName="w-full h-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-3xl"
                  loading="lazy"
                  style={{
                    objectPosition: profile.avatarPosition || '50% 50%',
                    objectFit: profile.avatarFit || 'cover',
                    transform: profile.avatarScale && profile.avatarScale > 1 ? `scale(${profile.avatarScale})` : undefined,
                  }}
                />
              </div>

              <div className="min-w-0 space-y-1 text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#151c27]">
                  {profile.name}
                </h3>
                <p className="text-sm font-medium text-slate-600">
                  {profile.title}
                </p>
                {profile.location && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 pt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact & Links */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {profile.email && (
                <div className="flex items-center gap-2.5 text-sm text-slate-700 min-w-0">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-medium break-all">{profile.email}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-1 pt-1">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Resume</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Narrative / Paragraphs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              <p className="font-medium text-[#151c27]">
                {profile.bioParagraph1 ||
                  "With extensive experience in digital product development, I bridge the gap between human-centered user interface design and resilient server infrastructure."}
              </p>

              <p className="text-slate-600 text-base leading-relaxed">
                {profile.bioParagraph2 ||
                  "I believe in building software systems that are accessible, maintainable, and highly performant. From micro-frontend design systems to distributed serverless APIs, my focus is delivering cohesive end-to-end user experiences."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
