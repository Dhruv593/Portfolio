import React from 'react';
import { MapPin, Mail, Github, Linkedin, FileText } from 'lucide-react';
import { ProfileData } from '../../types';

interface AboutSectionProps {
  profile: ProfileData;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
            Background & Bio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            About Me
          </h2>
        </div>

        {/* About Main Content Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Avatar & Quick Info Blue Card (Matching Contact Card Style) */}
          <div className="lg:col-span-5 bg-[#0058be] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
              {profile.avatarUrl ? (
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/30 shadow-md shrink-0">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full"
                    style={{
                      objectPosition: profile.avatarPosition || '50% 50%',
                      objectFit: profile.avatarFit || 'cover',
                      transform: profile.avatarScale && profile.avatarScale > 1 ? `scale(${profile.avatarScale})` : undefined,
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center font-bold text-3xl shrink-0">
                  {profile.name ? profile.name.charAt(0) : 'A'}
                </div>
              )}

              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {profile.name}
                </h3>
                <p className="text-sm font-semibold text-blue-100">
                  {profile.title}
                </p>
                {profile.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-blue-200 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-200" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact & Links */}
            <div className="space-y-3 pt-4 border-t border-white/20 relative z-10">
              {profile.email && (
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <Mail className="w-4 h-4 text-blue-200 shrink-0" />
                  <span className="font-semibold text-white">{profile.email}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors"
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
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed text-justify">
              <p className="font-medium text-[#151c27] text-justify">
                {profile.bioParagraph1 ||
                  "With extensive experience in digital product development, I bridge the gap between human-centered user interface design and resilient server infrastructure."}
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify">
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
