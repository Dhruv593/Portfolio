import React from 'react';
import { Database, ExternalLink, Lock, Menu, Settings } from 'lucide-react';
import { MongoConfig, ProfileData } from '../../types';
import { ProfileAvatar } from '../ProfileAvatar';
import { AdminTab } from './AdminSidebar';

interface AdminTopBarProps {
  activeTab: AdminTab;
  mongoConfig: MongoConfig;
  onOpenMongoModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleMobileSidebar: () => void;
  onSwitchToPublic: () => void;
  onLogout: () => void;
  profile: ProfileData;
}

const tabTitles: Record<AdminTab, string> = {
  overview: 'Overview', projects: 'Projects', blogs: 'Articles', experience: 'Experience',
  skills: 'Skills', education: 'Education', profile: 'Profile', messages: 'Messages',
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ activeTab, mongoConfig, onOpenMongoModal, onOpenSettingsModal, onToggleMobileSidebar, onSwitchToPublic, onLogout, profile }) => (
  <header className="sticky top-0 z-30 flex min-h-16 w-full min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-2">
      <button type="button" onClick={onToggleMobileSidebar} aria-label="Open navigation" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] lg:hidden"><Menu className="h-5 w-5" /></button>
      <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">{tabTitles[activeTab]}</span>
    </div>

    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <button type="button" onClick={onOpenMongoModal} title={mongoConfig.connected ? 'MongoDB connected' : 'MongoDB disconnected'} aria-label={`Database ${mongoConfig.connected ? 'connected' : 'disconnected'}. Open connection settings`} className={`flex min-h-11 items-center gap-2 rounded-lg px-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#0058be] ${mongoConfig.connected ? 'text-emerald-800 hover:bg-emerald-50' : 'text-amber-800 hover:bg-amber-50'}`}>
        <Database className="h-4 w-4" /><span className="hidden md:inline">{mongoConfig.connected ? 'Connected' : 'Disconnected'}</span>
      </button>
      <button type="button" onClick={onSwitchToPublic} className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] sm:flex"><ExternalLink className="h-4 w-4" /> View site</button>
      <button type="button" onClick={onOpenSettingsModal} aria-label="Database settings" title="Database settings" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be]"><Settings className="h-4 w-4" /></button>
      <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
      <ProfileAvatar profile={profile} className="hidden h-8 w-8 rounded-full object-cover sm:block" fallbackClassName="hidden h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white sm:flex" />
      <button type="button" onClick={onLogout} title="Lock admin" aria-label="Lock admin" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be]"><Lock className="h-4 w-4" /></button>
    </div>
  </header>
);
