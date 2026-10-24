import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { Project } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100">
      <img
        src={normalizeImageUrl(project.image)}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full"
        style={{
          objectPosition: project.imagePosition || '50% 50%',
          objectFit: project.imageFit || 'cover',
          transform: project.imageScale && project.imageScale > 1 ? `scale(${project.imageScale})` : undefined,
        }}
      />
    </div>

    <div className="flex flex-1 flex-col p-5">
      <p className="mb-2 text-sm font-medium text-slate-600">{project.category || 'Full Stack'}</p>
      <h3 className="text-lg sm:text-xl font-semibold text-[#151c27] leading-snug">{project.name}</h3>
      <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700">{project.description}</p>

      {project.tags.length > 0 && (
        <p className="mt-3 text-sm text-slate-600">
          {project.tags.slice(0, 2).join(' · ')}{project.tags.length > 2 ? ` · +${project.tags.length - 2}` : ''}
        </p>
      )}

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => onSelect(project)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-semibold text-[#0058be] hover:text-[#004494] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be] cursor-pointer"
        >
          View project <ArrowUpRight className="h-4 w-4" />
        </button>

        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 hover:text-[#151c27]">
                <Github className="h-4 w-4" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 hover:text-[#151c27]">
                Live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </article>
);
