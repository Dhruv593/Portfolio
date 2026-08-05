import React, { useState } from 'react';
import { ArrowLeft, Search, Github, ExternalLink, Info } from 'lucide-react';
import { Project } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

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

  const publishedProjects = projects.filter((p) => p.status === 'Published');

  const categories = ['All', ...Array.from(new Set(publishedProjects.map((p) => p.category || 'Full Stack')))];

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(projectSearchQuery.toLowerCase()));

    const matchesCategory =
      projectCategoryFilter === 'All' || (p.category || 'Full Stack') === projectCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in duration-200">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#151c27]">Complete Projects Showcase</h1>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredProjects.length} of {publishedProjects.length}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={projectSearchQuery}
              onChange={(e) => setProjectSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058be]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  projectCategoryFilter === cat
                    ? 'bg-[#0058be] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-slate-200/80 p-8 space-y-3">
              <p className="text-base font-bold text-slate-700">No matching projects found</p>
              <p className="text-xs text-slate-500">Try adjusting your search criteria or filter options.</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={normalizeImageUrl(project.image)}
                      alt={project.name}
                      className="w-full h-full transition-transform duration-500"
                      style={{
                        objectPosition: project.imagePosition || '50% 50%',
                        objectFit: project.imageFit || 'cover',
                        transform: project.imageScale && project.imageScale > 1 ? `scale(${project.imageScale})` : undefined,
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200/60">
                        {project.category || 'Full Stack'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-[#151c27] group-hover:text-[#0058be] transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-600 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100/80 text-[#0058be] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Project Details</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      ) : (
                        <span />
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-[#0058be] hover:text-[#2170e4] transition-colors"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
