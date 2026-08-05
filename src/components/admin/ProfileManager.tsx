import React, { useState } from 'react';
import { User, Mail, MapPin, Github, Linkedin, FileText, Save } from 'lucide-react';
import { ProfileData } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';
import { ImageAdjuster } from './ImageAdjuster';

interface ProfileManagerProps {
  profile: ProfileData;
  onUpdateProfile: (updated: Partial<ProfileData>) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<ProfileData>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof ProfileData, value: any) => {
    let processedValue = value;
    if (field === 'avatarUrl' && typeof value === 'string') {
      processedValue = normalizeImageUrl(value);
    }
    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      avatarUrl: normalizeImageUrl(formData.avatarUrl),
    };
    onUpdateProfile(cleanedData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Profile Settings
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Update your public persona, bio, avatar, and contact details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-3xs border border-slate-200/80 space-y-6">
        {/* Avatar & Interactive Adjuster */}
        <div className="pb-6 border-b border-slate-100">
          <ImageAdjuster
            imageUrl={formData.avatarUrl}
            onImageUrlChange={(url) => handleChange('avatarUrl', url)}
            position={formData.avatarPosition || '50% 50%'}
            onPositionChange={(pos) => handleChange('avatarPosition', pos)}
            fit={formData.avatarFit || 'cover'}
            onFitChange={(fit) => handleChange('avatarFit', fit)}
            scale={formData.avatarScale || 1}
            onScaleChange={(scale) => handleChange('avatarScale', scale)}
            aspectRatio="1:1"
            sectionName="Profile Avatar"
          />
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name / Brand Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Professional Headline *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
        </div>

        {/* Bios */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Bio Paragraph 1 (Main story)
            </label>
            <textarea
              rows={3}
              value={formData.bioParagraph1}
              onChange={(e) => handleChange('bioParagraph1', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Bio Paragraph 2 (Philosophy & Skills)
            </label>
            <textarea
              rows={3}
              value={formData.bioParagraph2}
              onChange={(e) => handleChange('bioParagraph2', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0058be]" /> Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0058be]" /> Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-600" /> GitHub URL
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange('github', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" /> Resume Document URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/resume.pdf"
              value={formData.resumeUrl || ''}
              onChange={(e) => handleChange('resumeUrl', e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all outline-hidden text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in">
              Profile updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
