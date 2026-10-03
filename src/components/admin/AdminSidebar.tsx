import React, { useEffect, useRef } from 'react';
import { BookOpen, Brain, Briefcase, ExternalLink, FolderOpen, GraduationCap, LayoutDashboard, Mail, User, X } from 'lucide-react';

export type AdminTab = 'overview' | 'projects' | 'blogs' | 'experience' | 'skills' | 'education' | 'profile' | 'messages';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onSwitchToPublic: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const groups = [
  { label: 'Workspace', items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'messages', label: 'Messages', icon: Mail }] },
  { label: 'Content', items: [{ id: 'projects', label: 'Projects', icon: FolderOpen }, { id: 'blogs', label: 'Articles', icon: BookOpen }] },
  { label: 'About you', items: [{ id: 'experience', label: 'Experience', icon: Briefcase }, { id: 'education', label: 'Education', icon: GraduationCap }, { id: 'skills', label: 'Skills', icon: Brain }, { id: 'profile', label: 'Profile', icon: User }] },
] as const;

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onSwitchToPublic, isMobileOpen, setIsMobileOpen }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobileOpen) return;
    const returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const controls: HTMLElement[] = Array.from(drawerRef.current.querySelectorAll('button:not([disabled]), a[href]')) as HTMLElement[];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusTo?.focus();
    };
  }, [isMobileOpen, setIsMobileOpen]);

  const content = (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0058be] text-base font-semibold text-white">P</span>
          <div className="leading-tight"><p className="text-sm font-semibold text-slate-900">Portfolio</p><p className="text-xs text-slate-500">Admin workspace</p></div>
        </div>
        <button type="button" onClick={() => setIsMobileOpen(false)} aria-label="Close navigation" className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] lg:hidden"><X className="h-5 w-5" /></button>
      </div>

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-xs font-semibold text-slate-500">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button key={item.id} type="button" aria-current={active ? 'page' : undefined} onClick={() => { setActiveTab(item.id); setIsMobileOpen(false); }} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#0058be] ${active ? 'bg-blue-50 text-[#0058be]' : 'text-slate-700 hover:bg-slate-100'}`}>
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#0058be]' : 'text-slate-500'}`} /><span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button type="button" onClick={onSwitchToPublic} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#0058be]"><ExternalLink className="h-4 w-4" /> View website</button>
      </div>
    </div>
  );

  return <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-slate-200 bg-white lg:block">{content}</aside>
    {isMobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close navigation" onClick={() => setIsMobileOpen(false)} className="absolute inset-0 w-full bg-slate-950/50" />
      <div ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Admin navigation" className="relative h-full w-64 max-w-[85vw] outline-none">{content}</div>
    </div>}
  </>;
};
