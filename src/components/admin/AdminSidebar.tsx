import React from 'react';
import { LayoutDashboard, FolderOpen, BookOpen, Briefcase, Brain, GraduationCap, User, Mail, X, ExternalLink } from 'lucide-react';

export type AdminTab = 'overview' | 'projects' | 'blogs' | 'experience' | 'skills' | 'education' | 'profile' | 'messages';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onPublishClick: () => void;
  onSwitchToPublic: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onPublishClick,
  onSwitchToPublic,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'blogs', label: 'Blog Posts', icon: BookOpen },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Brain },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'messages', label: 'Messages', icon: Mail },
  ] as const;

  const content = (
    <div className="h-full flex flex-col py-8 px-6 justify-between bg-white text-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#151c27] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0058be] text-white flex items-center justify-center text-sm font-bold shadow-xs">A</span>
              <span>Admin Console</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">
              System Management
            </p>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 text-[#0058be] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0058be]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-6 border-t border-slate-100">
        <button
          onClick={onSwitchToPublic}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 bg-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>View Live Portfolio</span>
        </button>

        <button
          onClick={() => {
            onPublishClick();
            setIsMobileOpen(false);
          }}
          className="w-full bg-[#0058be] hover:bg-[#2170e4] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Publish Live
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-slate-200">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
