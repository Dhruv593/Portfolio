import React, { useState } from 'react';
import { Plus, Trash2, Tag, Edit2 } from 'lucide-react';
import { SkillCategory } from '../../types';

interface SkillsManagerProps {
  skills: SkillCategory[];
  onAddSkillCategory: (cat: Partial<SkillCategory>) => void;
  onUpdateSkillCategory: (id: string, cat: Partial<SkillCategory>) => void;
  onDeleteSkillCategory: (id: string) => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onAddSkillCategory,
  onUpdateSkillCategory,
  onDeleteSkillCategory,
}) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  const handleAddSkillTag = (catId: string) => {
    const text = (newSkillInput[catId] || '').trim();
    if (!text) return;
    const cat = skills.find((s) => s.id === catId);
    if (!cat) return;

    if (!cat.skills.includes(text)) {
      onUpdateSkillCategory(catId, {
        skills: [...cat.skills, text],
      });
    }
    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const handleRemoveSkillTag = (catId: string, skillName: string) => {
    const cat = skills.find((s) => s.id === catId);
    if (!cat) return;
    onUpdateSkillCategory(catId, {
      skills: cat.skills.filter((s) => s !== skillName),
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddSkillCategory({
      category: newCatName.trim(),
      iconName: 'code',
      skills: [],
    });
    setNewCatName('');
    setIsAddingCat(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Skills & Capabilities
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Categorize and display your technical and design proficiencies.
          </p>
        </div>
        <button
          onClick={() => setIsAddingCat(true)}
          className="bg-[#0058be] hover:bg-[#2170e4] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {isAddingCat && (
        <form
          onSubmit={handleCreateCategory}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex items-center gap-3 animate-slide-down"
        >
          <input
            type="text"
            required
            autoFocus
            placeholder="Category Name (e.g. Cloud Infrastructure)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCat(false)}
            className="px-3.5 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#151c27] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0058be]" />
                  {cat.category}
                </h3>
                <button
                  onClick={() => onDeleteSkillCategory(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-all"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold uppercase tracking-wider group hover:bg-slate-200 transition-colors"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillTag(cat.id, skill)}
                      className="text-slate-400 group-hover:text-red-500 hover:scale-110 cursor-pointer transition-all text-xs"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Add Tag Input */}
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add skill tag..."
                value={newSkillInput[cat.id] || ''}
                onChange={(e) =>
                  setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkillTag(cat.id);
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddSkillTag(cat.id)}
                className="px-4 py-2 bg-[#0058be] hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
