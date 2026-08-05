import React from 'react';
import { X, ExternalLink, Github, Tag, Layers } from 'lucide-react';
import { Project } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-slate-200/90 relative flex flex-col justify-between">
        
        {/* Sticky Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider border border-blue-200/60">
              {project.category || 'Case Study'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Added {project.dateAdded}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title & Cover Image */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#151c27] tracking-tight">
              {project.name}
            </h2>

            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-sm">
              <img
                src={normalizeImageUrl(project.image)}
                alt={project.name}
                className="w-full h-full"
                style={{
                  objectPosition: project.imagePosition || '50% 50%',
                  objectFit: project.imageFit || 'cover',
                  transform: project.imageScale && project.imageScale > 1 ? `scale(${project.imageScale})` : undefined,
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700"
              >
                <Tag className="w-3 h-3 text-[#0058be]" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Overview / Short Description */}
          <div className="space-y-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/70">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#0058be]" />
              Project Overview
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              {project.description}
            </p>
          </div>

          {/* Extended Details / Case Study Specs (Only if populated) */}
          {project.longDescription && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#151c27]">
                Detailed Architecture & Features
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.longDescription}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Links */}
        <div className="bg-slate-50/90 border-t border-slate-200/80 px-6 py-4 rounded-b-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-black hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0058be] hover:bg-[#2170e4] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <span>Live Preview</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
