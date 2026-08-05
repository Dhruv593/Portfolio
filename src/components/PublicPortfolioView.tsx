import React, { useState } from 'react';
import { Project, BlogPost, ExperienceItem, EducationItem, SkillCategory, ProfileData } from '../types';
import { HeroSection } from './public/HeroSection';
import { AboutSection } from './public/AboutSection';
import { ExperienceSection } from './public/ExperienceSection';
import { FeaturedProjectsSection } from './public/FeaturedProjectsSection';
import { SkillsSection } from './public/SkillsSection';
import { EducationSection } from './public/EducationSection';
import { ContactSection } from './public/ContactSection';
import { BlogSection } from './public/BlogSection';
import { PortfolioFooter } from './public/PortfolioFooter';
import { DedicatedProjectsPage } from './public/DedicatedProjectsPage';
import { ProjectDetailModal } from './public/ProjectDetailModal';

interface PublicPortfolioViewProps {
  projects: Project[];
  blogs?: BlogPost[];
  experience: ExperienceItem[];
  education?: EducationItem[];
  skills: SkillCategory[];
  profile: ProfileData;
  onSwitchToAdmin: () => void;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  projects,
  blogs = [],
  experience,
  education = [],
  skills,
  profile,
  onSwitchToAdmin,
}) => {
  const [isDedicatedProjectsPageOpen, setIsDedicatedProjectsPageOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f9f9ff] text-[#151c27] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Hero Section */}
      <HeroSection
        profile={profile}
        onExploreClick={() => handleScrollTo('projects')}
        onContactClick={() => handleScrollTo('contact')}
      />

      {/* 2. About Section */}
      <AboutSection profile={profile} />

      {/* 3. Experience Section */}
      <ExperienceSection experience={experience} />

      {/* 4. Projects Section */}
      <FeaturedProjectsSection
        projects={projects}
        onOpenDedicatedPage={() => setIsDedicatedProjectsPageOpen(true)}
        onSelectProject={(project) => setSelectedProjectForDetail(project)}
      />

      {/* 5. Skills Section */}
      <SkillsSection skills={skills} />

      {/* 6. Education Section */}
      <EducationSection education={education} />

      {/* Blog Section (Commented out for now as requested) */}
      <BlogSection blogs={blogs} profile={profile} />

      {/* 7. Contact Section */}
      <ContactSection profile={profile} />

      {/* Public Footer */}
      <PortfolioFooter profile={profile} onSwitchToAdmin={onSwitchToAdmin} />

      {/* Dedicated Projects Page Overlay */}
      {isDedicatedProjectsPageOpen && (
        <DedicatedProjectsPage
          projects={projects}
          onClose={() => setIsDedicatedProjectsPageOpen(false)}
          onSelectProject={(project) => setSelectedProjectForDetail(project)}
        />
      )}

      {/* Detailed Project View Modal */}
      {selectedProjectForDetail && (
        <ProjectDetailModal
          project={selectedProjectForDetail}
          onClose={() => setSelectedProjectForDetail(null)}
        />
      )}
    </div>
  );
};
