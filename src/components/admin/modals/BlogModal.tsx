import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Tag, Clock, User, Eye, Edit3, Plus, Check } from 'lucide-react';
import { BlogPost, BlogStatus } from '../../../types';
import { normalizeImageUrl } from '../../../utils/imageUtils';
import { ImageAdjuster } from '../ImageAdjuster';
import { portfolioApi } from '../../../api/portfolioApi';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blogData: Partial<BlogPost>) => void;
  blogToEdit?: BlogPost | null;
  existingBlogs?: BlogPost[];
  blogCategories?: string[];
  onAddCategory?: (category: string) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  blogToEdit,
  existingBlogs = [],
  blogCategories: propBlogCategories = [],
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [dbBlogCategories, setDbBlogCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<BlogStatus>('Published');
  const [readTime, setReadTime] = useState('5 min read');
  const [image, setImage] = useState('');
  const [imagePosition, setImagePosition] = useState('50% 50%');
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill'>('cover');
  const [imageScale, setImageScale] = useState(1);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [author, setAuthor] = useState('Portfolio Author');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  // Fetch blog categories directly from backend DB API when modal opens
  useEffect(() => {
    if (isOpen) {
      portfolioApi
        .getBlogCategories()
        .then((res) => {
          const list = res.categories || res.data?.categories || [];
          if (list.length > 0) {
            setDbBlogCategories(list);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Derive unique combined categories list
  const existingCategoriesFromBlogs = existingBlogs
    .map((b) => b.category)
    .filter((c): c is string => Boolean(c && c.trim()));

  const allCategories = Array.from(
    new Set([...dbBlogCategories, ...propBlogCategories, ...existingCategoriesFromBlogs])
  );

  useEffect(() => {
    setIsAddingNewCategory(false);
    setCustomCategory('');

    if (blogToEdit) {
      setTitle(blogToEdit.title || '');
      setSlug(blogToEdit.slug || '');
      const initCat = blogToEdit.category || (allCategories[0] || 'Engineering Architecture');
      setCategory(initCat);
      setStatus(blogToEdit.status || 'Published');
      setReadTime(blogToEdit.readTime || '5 min read');
      setImage(blogToEdit.image || '');
      setImagePosition(blogToEdit.imagePosition || '50% 50%');
      setImageFit(blogToEdit.imageFit || 'cover');
      setImageScale(blogToEdit.imageScale || 1);
      setExcerpt(blogToEdit.excerpt || '');
      setContent(blogToEdit.content || '');
      setTagsInput(blogToEdit.tags ? blogToEdit.tags.join(', ') : '');
      setAuthor(blogToEdit.author || 'Portfolio Author');
    } else {
      setTitle('');
      setSlug('');
      setCategory(allCategories[0] || 'Engineering Architecture');
      setStatus('Published');
      setReadTime('5 min read');
      setImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
      setImagePosition('50% 50%');
      setImageFit('cover');
      setImageScale(1);
      setExcerpt('');
      setContent('');
      setTagsInput('React, TypeScript, Engineering');
      setAuthor('Portfolio Author');
    }
  }, [blogToEdit, isOpen]);

  // Auto-generate slug when title changes if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!blogToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  if (!isOpen) return null;

  const handleAddCustomCategory = async () => {
    const trimmed = customCategory.trim();
    if (trimmed) {
      // Save directly to backend DB
      try {
        const res = await portfolioApi.createBlogCategory(trimmed);
        const updatedList = res.categories || res.data?.categories || [];
        if (updatedList.length > 0) {
          setDbBlogCategories(updatedList);
        } else {
          setDbBlogCategories((prev) => Array.from(new Set([...prev, trimmed])));
        }
      } catch {
        setDbBlogCategories((prev) => Array.from(new Set([...prev, trimmed])));
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
    if (!title.trim()) return;

    const finalCategory = isAddingNewCategory ? customCategory.trim() || 'General' : category || 'General';

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: finalCategory,
      status,
      readTime: readTime.trim() || '5 min read',
      image: normalizeImageUrl(image.trim()) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      imagePosition,
      imageFit,
      imageScale,
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tagsArray,
      author: author.trim() || 'Portfolio Author',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#151c27]">
              {blogToEdit ? 'Edit Blog Article' : 'Create New Article'}
            </h2>
            <p className="text-xs text-[#424754]">
              {blogToEdit ? 'Update existing post details and content' : 'Publish a new thoughts, design, or engineering post'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Editor vs Preview Mode toggle */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-white text-[#0058be] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#0058be] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'editor' ? (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Architecting Scalable React Apps"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold text-[#151c27]"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="architecting-scalable-react-apps"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-mono text-slate-700 bg-slate-50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider">
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
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-medium text-slate-700 bg-white cursor-pointer"
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
                      className="flex-1 px-3.5 py-2 bg-[#f0f3ff] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0058be] outline-hidden text-[#151c27]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      disabled={!customCategory.trim()}
                      className="px-3 py-2 bg-[#0058be] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider">
                  Publish Status
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="blogStatus"
                      value="Published"
                      checked={status === 'Published'}
                      onChange={() => setStatus('Published')}
                      className="text-[#0058be] focus:ring-blue-500"
                    />
                    <span>Published</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="blogStatus"
                      value="Draft"
                      checked={status === 'Draft'}
                      onChange={() => setStatus('Draft')}
                      className="text-[#0058be] focus:ring-blue-500"
                    />
                    <span>Draft</span>
                  </label>
                </div>
              </div>

              {/* Read Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0058be]" />
                  Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min read"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-medium text-slate-700"
                />
              </div>

              {/* Image URL & Interactive Adjuster */}
              <div className="md:col-span-2">
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
                  sectionName="Blog Article Cover"
                />
              </div>

              {/* Author & Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0058be]" />
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Dhruv Lad"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0058be]" />
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Architecture"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-medium text-slate-700"
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider">
                  Article Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence overview shown on blog cards..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-normal text-slate-700"
                />
              </div>

              {/* Content Body */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider flex items-center justify-between">
                  <span>Full Article Content (Markdown or Formatted Text)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Supports markdown headings, code blocks & blockquotes</span>
                </label>
                <textarea
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write article markdown content here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0058be] transition-all font-mono leading-relaxed text-slate-800 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{blogToEdit ? 'Save Article' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Preview Mode */
          <div className="p-8 overflow-y-auto flex-1 space-y-6 max-w-3xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0058be] uppercase tracking-wider">
                <span>{category}</span>
                <span>•</span>
                <span className="text-slate-500">{readTime}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#151c27]">{title || 'Untitled Article'}</h1>
              <p className="text-sm text-[#424754] font-medium leading-relaxed italic">{excerpt}</p>
            </div>

            {image && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-80">
                <img src={image} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {content || 'No content written yet.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
