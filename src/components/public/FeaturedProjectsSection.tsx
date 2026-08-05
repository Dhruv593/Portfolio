import React from 'react';
import { ArrowRight, Github, ExternalLink, Info } from 'lucide-react';
import { Project } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

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
  const publishedProjects = projects.filter((p) => p.status === 'Published');
  // Limit to exactly 3 projects on the hero/main view as requested
  const featuredProjects = publishedProjects.slice(0, 3);

  return (
    <section id="projects" className="pt-10 sm:pt-12 pb-20 sm:pb-24 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
              Featured Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
              Crafted Applications & Systems
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
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
                  <div className="absolute top-3 right-3 flex items-center gap-2">
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

                {/* Action Buttons: View Details & Links */}
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
          ))}
        </div>

        {publishedProjects.length > 3 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={onOpenDedicatedPage}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200/90 text-[#0058be] font-bold rounded-xl shadow-xs hover:border-blue-300 transition-all cursor-pointer text-sm sm:text-base group"
            >
              <span>More Projects ({publishedProjects.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
