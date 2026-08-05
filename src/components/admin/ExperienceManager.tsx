import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar, Building2 } from 'lucide-react';
import { ExperienceItem } from '../../types';

interface ExperienceManagerProps {
  experience: ExperienceItem[];
  onAddExperience: (item: Partial<ExperienceItem>) => void;
  onUpdateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  onDeleteExperience: (id: string) => void;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({
  experience,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  const handleOpenAdd = () => {
    setEditingId(null);
    setRole('');
    setCompany('');
    setPeriod('2023 — Present');
    setLocation('San Francisco, CA');
    setDescription('');
    setIsCurrent(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingId(item.id);
    setRole(item.role);
    setCompany(item.company);
    setPeriod(item.period);
    setLocation(item.location || '');
    setDescription(item.description);
    setIsCurrent(Boolean(item.isCurrent));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateExperience(editingId, {
        role,
        company,
        period,
        location,
        description,
        isCurrent,
      });
    } else {
      onAddExperience({
        role,
        company,
        period,
        location,
        description,
        isCurrent,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Work Experience
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Manage your career progression, roles, and key achievements.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#0058be] hover:bg-[#2170e4] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base font-bold text-[#151c27]">{item.role}</h3>
                {item.isCurrent && (
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                    Present
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[#0058be]">
                  <Building2 className="w-3.5 h-3.5" />
                  {item.company}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.period}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0058be] hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Position"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteExperience(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Position"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-[#151c27]">
              {editingId ? 'Edit Work Position' : 'Add Work Position'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Role / Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Luminous Tech"
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Time Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="2021 — Present"
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description & Achievements
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key responsibilities, leadership, and technical impact..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0058be] hover:bg-[#2170e4] text-white shadow-xs transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
