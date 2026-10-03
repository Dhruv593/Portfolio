import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Briefcase, Database, FolderOpen, Mail, Plus, User } from 'lucide-react';
import { BlogPost, DashboardStats, EducationItem, ExperienceItem, MongoConfig, PortfolioSectionId, ProfileData, Project, SkillCategory } from '../../types';
import { isSectionVisible, portfolioSections } from '../../utils/sectionVisibility';
import { AdminTab } from './AdminSidebar';

interface AdminOverviewProps {
  profile: ProfileData;
  projects: Project[];
  blogs: BlogPost[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  stats: DashboardStats;
  mongoConfig: MongoConfig;
  setActiveTab: (tab: AdminTab) => void;
  onAddNewProject: () => void;
  onAddBlog: () => void;
  onOpenMongoModal: () => void;
  onUpdateSectionVisibility: (section: PortfolioSectionId) => void;
  visibilitySaving: boolean;
  isAdminAuthenticated: boolean;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  profile,
  blogs,
  experience,
  education,
  skills,
  stats,
  mongoConfig,
  setActiveTab,
  onAddNewProject,
  onAddBlog,
  onOpenMongoModal,
  onUpdateSectionVisibility,
  visibilitySaving,
  isAdminAuthenticated,
}) => {
  const [messages, setMessages] = useState<{ unread: number; recent: { name: string; subject: string } | null } | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    let cancelled = false;
    fetch('/api/contact')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => {
        if (cancelled || !result.success || !Array.isArray(result.messages)) return;
        setMessages({
          unread: result.messages.filter((message: { read?: boolean }) => !message.read).length,
          recent: result.messages[0] ? { name: result.messages[0].name, subject: result.messages[0].subject } : null,
        });
      })
      .catch(() => { if (!cancelled) setMessages(null); });
    return () => { cancelled = true; };
  }, [isAdminAuthenticated]);

  const visibleCount = portfolioSections.filter(({ id }) => isSectionVisible(profile, id)).length;
  const metrics = [
    { label: 'Published projects', value: stats.publishedCount, detail: `${stats.draftCount} drafts`, tab: 'projects' as AdminTab, icon: FolderOpen },
    { label: 'Published articles', value: blogs.filter((blog) => blog.status === 'Published').length, detail: `${blogs.filter((blog) => blog.status === 'Draft').length} drafts`, tab: 'blogs' as AdminTab, icon: BookOpen },
    { label: 'Experience entries', value: experience.length, detail: `${education.length} education · ${skills.length} skill groups`, tab: 'experience' as AdminTab, icon: Briefcase },
    { label: 'Unread messages', value: messages?.unread ?? '—', detail: messages ? (messages.unread ? 'Needs review' : 'Inbox is clear') : 'Unavailable right now', tab: 'messages' as AdminTab, icon: Mail },
  ];

  return (
    <div className="space-y-6" id="admin-overview-dashboard">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Portfolio management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Overview</h1>
          <p className="mt-2 text-sm text-slate-600">Review published content, messages, and what appears on your site.</p>
        </div>
        <button onClick={onAddNewProject} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0058be] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#004a9f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be]">
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      {!mongoConfig.connected && (
        <div role="status" className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-950">MongoDB is disconnected</p>
            <p className="text-sm text-amber-900">Changes are using local data until the database reconnects.</p>
          </div>
          <button onClick={onOpenMongoModal} className="min-h-11 self-start rounded-lg border border-amber-300 px-3 text-sm font-semibold text-amber-950 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 sm:self-auto">Check connection</button>
        </div>
      )}

      <section aria-label="Portfolio summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, tab, icon: Icon }) => (
          <button key={label} onClick={() => setActiveTab(tab)} className="group min-w-0 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be]">
            <span className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600"><span>{label}</span><Icon className="h-4 w-4 shrink-0 text-slate-500" /></span>
            <span className="mt-3 block text-3xl font-semibold tabular-nums text-slate-900">{value}</span>
            <span className="mt-1 block text-xs text-slate-600">{detail}</span>
          </button>
        ))}
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <section aria-labelledby="visibility-heading" className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 id="visibility-heading" className="text-lg font-semibold text-slate-900">Website sections</h2>
              <p className="mt-1 text-sm text-slate-600">Choose what visitors can see. Each switch saves immediately.</p>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{visibleCount} of {portfolioSections.length} visible</span>
          </div>
          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {portfolioSections.map(({ id, label }) => {
              const visible = isSectionVisible(profile, id);
              return (
                <div key={id} className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 py-2.5">
                  <span className="min-w-0 text-sm font-medium text-slate-800">{label}</span>
                  <button type="button" role="switch" aria-label={`Show ${label} section`} aria-checked={visible} onClick={() => onUpdateSectionVisibility(id)} disabled={visibilitySaving} className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be] disabled:opacity-50">
                    <span className={`relative h-6 w-11 rounded-full transition-colors ${visible ? 'bg-[#0058be]' : 'bg-slate-300'}`}>
                      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${visible ? 'translate-x-5' : ''}`} />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-5">
          <section aria-labelledby="actions-heading" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 id="actions-heading" className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-3 divide-y divide-slate-100">
              <button onClick={onAddBlog} className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-medium text-slate-700 hover:text-[#0058be] focus-visible:outline-2 focus-visible:outline-[#0058be]"><span>Add article</span><ArrowRight className="h-4 w-4 shrink-0" /></button>
              <button onClick={() => setActiveTab('profile')} className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-medium text-slate-700 hover:text-[#0058be] focus-visible:outline-2 focus-visible:outline-[#0058be]"><span>Edit public profile</span><ArrowRight className="h-4 w-4 shrink-0" /></button>
              <button onClick={() => setActiveTab('skills')} className="flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-medium text-slate-700 hover:text-[#0058be] focus-visible:outline-2 focus-visible:outline-[#0058be]"><span>Manage skills</span><ArrowRight className="h-4 w-4 shrink-0" /></button>
            </div>
          </section>

          <section aria-labelledby="status-heading" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 id="status-heading" className="text-lg font-semibold text-slate-900">System & inbox</h2>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-slate-600"><Database className="h-4 w-4" /> Database</span><span className={`font-medium ${mongoConfig.connected ? 'text-emerald-700' : 'text-amber-800'}`}>{mongoConfig.connected ? 'Connected' : 'Disconnected'}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-slate-600"><User className="h-4 w-4" /> Profile</span><span className="max-w-40 truncate font-medium text-slate-800" title={profile.name}>{profile.name}</span></div>
              <div className="border-t border-slate-100 pt-3">
                <p className="font-medium text-slate-800">{messages?.recent ? messages.recent.subject : messages ? 'No messages yet' : 'Inbox unavailable'}</p>
                {messages?.recent && <p className="mt-0.5 truncate text-slate-600">Latest inquiry from {messages.recent.name}</p>}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                <button onClick={() => setActiveTab('messages')} className="min-h-11 text-left font-semibold text-[#0058be] hover:underline focus-visible:outline-2 focus-visible:outline-[#0058be]">Open inbox</button>
                <button onClick={onOpenMongoModal} className="min-h-11 text-left font-semibold text-slate-700 hover:underline focus-visible:outline-2 focus-visible:outline-[#0058be]">Database settings</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
