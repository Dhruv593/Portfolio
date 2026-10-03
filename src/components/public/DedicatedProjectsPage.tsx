import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';

interface DedicatedProjectsPageProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const DedicatedProjectsPage: React.FC<DedicatedProjectsPageProps> = ({
  projects,
  onClose,
  onSelectProject,
}) => {
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const publishedProjects = projects.filter((project) => project.status === 'Published');
  const categories = ['All', ...Array.from(new Set(publishedProjects.map((project) => project.category || 'Full Stack')))];

  const filteredProjects = publishedProjects.filter((project) => {
    const search = projectSearchQuery.toLowerCase();
    const matchesSearch = project.name.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search) ||
      project.tags.some((tag) => tag.toLowerCase().includes(search));
    const matchesCategory = projectCategoryFilter === 'All' ||
      (project.category || 'Full Stack') === projectCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </button>
        <h1 className="hidden text-lg font-semibold text-[#151c27] sm:block">Complete Projects Showcase</h1>
        <span className="text-sm text-slate-500">{filteredProjects.length} projects</span>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#151c27] sm:hidden">Projects</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              aria-label="Search projects"
              placeholder="Search projects or technologies..."
              value={projectSearchQuery}
              onChange={(event) => setProjectSearchQuery(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-base text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setProjectCategoryFilter(category)}
                aria-pressed={projectCategoryFilter === category}
                className={`min-h-11 rounded-xl px-4 text-sm font-medium transition-colors cursor-pointer ${
                  projectCategoryFilter === category
                    ? 'bg-[#0058be] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-6 py-14 text-center">
            <p className="text-base font-semibold text-slate-800">No matching projects found</p>
            <p className="mt-1 text-sm text-slate-600">Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
