import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Project, ProjectStatus } from '../../../types';
import { normalizeImageUrl } from '../../../utils/imageUtils';
import { ImageAdjuster } from '../ImageAdjuster';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => Promise<void>;
  initialProject?: Project | null;
  existingProjects?: Project[];
  categories?: string[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
  existingProjects = [],
  categories: propCategories = [],
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Published');
  const [image, setImage] = useState('');
  const [imagePosition, setImagePosition] = useState('50% 50%');
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [imageScale, setImageScale] = useState(1);
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Existing categories plus categories already used by projects.
  const existingCategoriesFromProjects = existingProjects
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c && c.trim()));

  const allCategories = Array.from(
    new Set(['General', ...propCategories, ...existingCategoriesFromProjects, category].filter(Boolean))
  );

  useEffect(() => {
    setIsAddingNewCategory(false);
    setCustomCategory('');
    setSaveError('');

    if (initialProject) {
      setName(initialProject.name || '');
      const initCat = initialProject.category || (allCategories[0] || '');
      setCategory(initCat);
      setStatus(initialProject.status || 'Published');
      setImage(initialProject.image || '');
      setImagePosition(initialProject.imagePosition || '50% 50%');
      setImageFit(initialProject.imageFit || 'cover');
      setImageScale(initialProject.imageScale || 1);
      setDescription(initialProject.description || '');
      setLongDescription(initialProject.longDescription || '');
      setGithubUrl(initialProject.githubUrl || '');
      setLiveUrl(initialProject.liveUrl || '');
      setTagsInput(initialProject.tags ? initialProject.tags.join(', ') : '');
    } else {
      setName('');
      setCategory(allCategories[0] || 'General');
      setStatus('Published');
      setImage('');
      setImagePosition('50% 50%');
      setImageFit('cover');
      setImageScale(1);
      setDescription('');
      setLongDescription('');
      setGithubUrl('');
      setLiveUrl('');
      setTagsInput('');
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleAddCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (trimmed) {
      setCategory(trimmed);
      setIsAddingNewCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isAddingNewCategory ? customCategory.trim() || 'General' : category || 'General';

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    setSaveError('');
    setIsSaving(true);
    try {
      await onSave({
      id: initialProject?.id,
      name: name || 'Untitled Project',
      category: finalCategory,
      status,
      image: normalizeImageUrl(image),
      imagePosition,
      imageFit,
      imageScale,
      description,
      longDescription,
      githubUrl,
      liveUrl,
      tags: tagsArr,
      });
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save the project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 sm:p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="project-editor-title" className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90vh]">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 id="project-editor-title" className="text-xl font-semibold text-[#151c27]">
            {initialProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close project editor"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., E-commerce Experience"
                className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Category *
                </label>
                {!isAddingNewCategory ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(true);
                      setCustomCategory('');
                    }}
                    className="text-xs text-[#0058be] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Category</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      if (!category && allCategories.length > 0) {
                        setCategory(allCategories[0]);
                      }
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline cursor-pointer"
                  >
                    Select existing category
                  </button>
                )}
              </div>

              {!isAddingNewCategory ? (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setIsAddingNewCategory(true);
                        setCustomCategory('');
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden cursor-pointer text-[#151c27] font-medium"
                  >
                    <option value="" disabled>Select a category...</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__ADD_NEW__" className="font-bold text-[#0058be]">
                      + Add New Category...
                    </option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      setCategory(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCategory();
                      }
                    }}
                    placeholder="Enter new category name..."
                    className="flex-1 px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden text-[#151c27]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    disabled={!customCategory.trim()}
                    className="px-3 py-2.5 bg-[#2170e4] hover:bg-[#0058be] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden cursor-pointer"
              >
                <option value="Published">Published (Live on portfolio)</option>
                <option value="Draft">Draft (Saved privately)</option>
              </select>
          </div>

          {/* Interactive Image Adjuster & Framing Control */}
          <div className="space-y-2">
            <ImageAdjuster
              imageUrl={image}
              onImageUrlChange={setImage}
              position={imagePosition}
              onPositionChange={setImagePosition}
              fit={imageFit}
              onFitChange={setImageFit}
              scale={imageScale}
              onScaleChange={setImageScale}
              aspectRatio="16:9"
              sectionName="Project Card"
            />

          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Summary *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for cards and list items..."
              className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
            />
          </div>

          <details className="rounded-xl border border-slate-200 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">More details and links</summary>
            <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Architecture & Specs (For Detailed Project View)
            </label>
            <textarea
              rows={4}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Provide extended project details, engineering architecture, core features, or case study notes..."
              className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="MOBILE APP, UI/UX, REACT, TAILWIND"
              className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
            />
          </div>

          {/* GitHub & Live Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Live Demo URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full px-3.5 py-2.5 bg-[#f0f3ff] border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2170e4] outline-hidden"
              />
            </div>
          </div>
            </div>
          </details>

          {/* Modal Actions */}
          {saveError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">Could not save project: {saveError}</p>}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2170e4] text-white hover:bg-[#0058be] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isSaving ? 'Saving…' : 'Save project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
