import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { EducationItem } from '../../types';

interface EducationManagerProps {
  education: EducationItem[];
  onAddEducation: (item: Partial<EducationItem>) => void;
  onUpdateEducation: (id: string, item: Partial<EducationItem>) => void;
  onDeleteEducation: (id: string) => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({
  education,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [gpaOrHonors, setGpaOrHonors] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setDegree('');
    setInstitution('');
    setPeriod('2018 — 2022');
    setLocation('Berkeley, CA');
    setDescription('');
    setGpaOrHonors('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingId(item.id);
    setDegree(item.degree);
    setInstitution(item.institution);
    setPeriod(item.period);
    setLocation(item.location || '');
    setDescription(item.description || '');
    setGpaOrHonors(item.gpaOrHonors || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateEducation(editingId, {
        degree,
        institution,
        period,
        location,
        description,
        gpaOrHonors,
      });
    } else {
      onAddEducation({
        degree,
        institution,
        period,
        location,
        description,
        gpaOrHonors,
      });
    }
    setIsModalOpen(false);
  };

  const sortedEducation = [...education].sort((a, b) => {
    const getYearAndPresence = (periodStr: string) => {
      if (!periodStr) return { year: 0, isPresent: false };
      const normalized = periodStr.toLowerCase();
      const isPresent = normalized.includes('present') || normalized.includes('current');
      
      const years = periodStr.match(/\b(19|20)\d{2}\b/g);
      
      if (isPresent) {
        const startYear = years ? Math.max(...years.map(Number)) : new Date().getFullYear();
        return { year: startYear, isPresent: true };
      }
      
      if (years && years.length > 0) {
        const maxYear = Math.max(...years.map(Number));
        return { year: maxYear, isPresent: false };
      }
      
      return { year: 0, isPresent: false };
    };

    const infoA = getYearAndPresence(a.period);
    const infoB = getYearAndPresence(b.period);

    if (infoA.isPresent && !infoB.isPresent) return -1;
    if (!infoA.isPresent && infoB.isPresent) return 1;

    if (infoA.year !== infoB.year) {
      return infoB.year - infoA.year;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Education & Academic Background
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Manage your degrees, certifications, and academic qualifications.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#0058be] hover:bg-[#2170e4] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {sortedEducation.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base font-bold text-[#151c27]">{item.degree}</h3>
                {item.gpaOrHonors && (
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    {item.gpaOrHonors}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1 text-[#0058be]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {item.institution}
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

              {item.description && (
                <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0058be] hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteEducation(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500 space-y-3 shadow-3xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No education records added yet.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#0058be] hover:bg-[#2170e4] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Add First Record
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-[#151c27]">
              {editingId ? 'Edit Education' : 'Add Education Record'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Degree / Program
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.S. in Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Institution
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UC Berkeley"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Time Period
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2018 — 2022"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Berkeley, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Honors / GPA (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Magna Cum Laude"
                    value={gpaOrHonors}
                    onChange={(e) => setGpaOrHonors(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description / Achievements
                </label>
                <textarea
                  rows={3}
                  placeholder="Key coursework, thesis topics, leadership, or awards..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  {editingId ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
