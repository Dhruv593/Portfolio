import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { BlogPost, DashboardStats, MongoConfig, PortfolioSectionId, ProfileData } from '../../types';
import { isSectionVisible, portfolioSections } from '../../utils/sectionVisibility';
import { AdminTab } from './AdminSidebar';
import { apiClient } from '../../api/apiClient';

interface AdminOverviewProps {
  profile: ProfileData;
  blogs: BlogPost[];
  stats: DashboardStats;
  mongoConfig: MongoConfig;
  setActiveTab: (tab: AdminTab) => void;
  onAddNewProject: () => void;
  onOpenMongoModal: () => void;
  onUpdateSectionVisibility: (section: PortfolioSectionId) => void;
  visibilitySaving: boolean;
  isAdminAuthenticated: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  profile, blogs, stats, mongoConfig, setActiveTab, onAddNewProject,
  onOpenMongoModal, onUpdateSectionVisibility, visibilitySaving, isAdminAuthenticated,
}) => {
  const [unreadMessages, setUnreadMessages] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    let cancelled = false;
    apiClient.get<{ messages: { read?: boolean }[] }>('/contact')
      .then((result) => {
        if (!cancelled && Array.isArray(result.messages)) {
          setUnreadMessages(result.messages.filter((message: { read?: boolean }) => !message.read).length);
        }
      })
      .catch(() => { if (!cancelled) setUnreadMessages(null); });
    return () => { cancelled = true; };
  }, [isAdminAuthenticated]);

  const summary = [
    { label: 'Published projects', value: stats.publishedCount, tab: 'projects' as AdminTab },
    { label: 'Published articles', value: blogs.filter((blog) => blog.status === 'Published').length, tab: 'blogs' as AdminTab },
    { label: 'Unread messages', value: unreadMessages ?? '—', tab: 'messages' as AdminTab },
  ];

  return <div className="mx-auto max-w-5xl space-y-7">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1><p className="mt-1 text-sm text-slate-600">Manage your portfolio content and visible sections.</p></div>
      <button type="button" onClick={onAddNewProject} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0058be] px-4 text-sm font-semibold text-white hover:bg-[#004a9f]"><Plus className="h-4 w-4" /> Add project</button>
    </header>

    {!mongoConfig.connected && <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><span>MongoDB is disconnected. Check the connection before editing projects.</span><button type="button" onClick={onOpenMongoModal} className="min-h-11 rounded-lg px-3 font-semibold hover:bg-amber-100">Check connection</button></div>}

    <section aria-label="Portfolio summary" className="grid gap-3 sm:grid-cols-3">
      {summary.map(({ label, value, tab }) => <button key={label} type="button" onClick={() => setActiveTab(tab)} className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#0058be]"><span className="block text-sm text-slate-600">{label}</span><span className="mt-2 block text-2xl font-semibold tabular-nums text-slate-900">{value}</span></button>)}
    </section>

    <section aria-labelledby="section-visibility-heading" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="border-b border-slate-100 pb-4"><h2 id="section-visibility-heading" className="text-lg font-semibold text-slate-900">Website sections</h2><p className="mt-1 text-sm text-slate-600">Changes to these switches save automatically.</p></div>
      <div className="grid gap-x-8 sm:grid-cols-2">{portfolioSections.map(({ id, label }) => {
        const visible = isSectionVisible(profile, id);
        return <div key={id} className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5"><span className="text-sm font-medium text-slate-800">{label}</span><button type="button" role="switch" aria-label={`Show ${label} section`} aria-checked={visible} onClick={() => onUpdateSectionVisibility(id)} disabled={visibilitySaving} className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-[#0058be] disabled:opacity-50"><span className={`relative h-6 w-11 rounded-full ${visible ? 'bg-[#0058be]' : 'bg-slate-300'}`}><span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${visible ? 'translate-x-5' : ''}`} /></span></button></div>;
      })}</div>
    </section>
  </div>;
};
