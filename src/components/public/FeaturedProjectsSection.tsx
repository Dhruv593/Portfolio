import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';

interface FeaturedProjectsSectionProps {
  projects: Project[];
  onOpenDedicatedPage: () => void;
  onSelectProject: (project: Project) => void;
}

export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects,
  onOpenDedicatedPage,
  onSelectProject,
}) => {
  const publishedProjects = projects.filter((project) => project.status === 'Published');
  const featuredProjects = publishedProjects.slice(0, 3);

  return (
    <section id="projects" className="px-6 pt-12 pb-20 sm:px-8 sm:py-20 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-9 sm:space-y-12">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
          Crafted Applications & Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
          ))}
        </div>

        {publishedProjects.length > 3 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOpenDedicatedPage}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-5 text-sm sm:text-base font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be] cursor-pointer"
            >
              More Projects ({publishedProjects.length})
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
