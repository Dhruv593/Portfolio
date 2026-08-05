import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Plus, Check } from 'lucide-react';
import { Project, ProjectStatus } from '../../../types';
import { normalizeImageUrl } from '../../../utils/imageUtils';
import { ImageAdjuster } from '../ImageAdjuster';
import { portfolioApi } from '../../../api/portfolioApi';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => void;
  initialProject?: Project | null;
  existingProjects?: Project[];
  categories?: string[];
  onAddCategory?: (category: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProject,
  existingProjects = [],
  categories: propCategories = [],
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [dbCategories, setDbCategories] = useState<string[]>([]);
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
  const [featured, setFeatured] = useState(false);

  // Load categories directly from backend DB API when modal opens
  useEffect(() => {
    if (isOpen) {
      portfolioApi
        .getCategories()
        .then((res) => {
          const list = res.categories || res.data?.categories || [];
          if (list.length > 0) {
            setDbCategories(list);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Derive unique combined categories list (from DB API, props, and existing projects)
  const existingCategoriesFromProjects = existingProjects
    .map((p) => p.category)
    .filter((c): c is string => Boolean(c && c.trim()));

  const allCategories = Array.from(
    new Set([...dbCategories, ...propCategories, ...existingCategoriesFromProjects])
  );

  useEffect(() => {
    setIsAddingNewCategory(false);
    setCustomCategory('');

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
      setFeatured(Boolean(initialProject.featured));
    } else {
      setName('');
      setCategory(allCategories[0] || 'General');
      setStatus('Published');
      setImage('https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80');
      setImagePosition('50% 50%');
      setImageFit('cover');
      setImageScale(1);
      setDescription('');
      setLongDescription('');
      setGithubUrl('');
      setLiveUrl('');
      setTagsInput('REACT, TAILWIND, TYPESCRIPT');
      setFeatured(false);
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const handleAddCustomCategory = async () => {
    const trimmed = customCategory.trim();
    if (trimmed) {
      // Save directly to backend DB
      try {
        const res = await portfolioApi.createCategory(trimmed);
        const updatedList = res.categories || res.data?.categories || [];
        if (updatedList.length > 0) {
          setDbCategories(updatedList);
        } else {
          setDbCategories((prev) => Array.from(new Set([...prev, trimmed])));
        }
      } catch {
        setDbCategories((prev) => Array.from(new Set([...prev, trimmed])));
      }

      if (onAddCategory) {
        onAddCategory(trimmed);
      }
      setCategory(trimmed);
      setIsAddingNewCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isAddingNewCategory ? customCategory.trim() || 'General' : category || 'General';

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    onSave({
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
      featured,
    });
    onClose();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-[#151c27]">
            {initialProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          {/* Status & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#2170e4] rounded-sm focus:ring-blue-500"
                />
                Feature this project on homepage
              </label>
            </div>
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

            {/* Preset Thumbnails */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-semibold">Presets:</span>
              {sampleImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImage(img)}
                  className="w-8 h-8 rounded-lg overflow-hidden border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
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

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2170e4] text-white hover:bg-[#0058be] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
