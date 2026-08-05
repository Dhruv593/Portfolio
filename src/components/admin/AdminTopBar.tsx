import React from 'react';
import { Search, Bell, Settings, Menu, Database, Eye, LogOut, Lock } from 'lucide-react';
import { MongoConfig, ProfileData } from '../../types';

interface AdminTopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mongoConfig: MongoConfig;
  onOpenMongoModal: () => void;
  onOpenSettingsModal: () => void;
  onToggleMobileSidebar: () => void;
  onSwitchToPublic: () => void;
  onLogout: () => void;
  profile: ProfileData;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  searchQuery,
  setSearchQuery,
  mongoConfig,
  onOpenMongoModal,
  onOpenSettingsModal,
  onToggleMobileSidebar,
  onSwitchToPublic,
  onLogout,
  profile,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-black text-[#151c27] tracking-tight">
          Admin Console
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center relative flex-1 max-w-md mx-4">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 font-medium transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* MongoDB Status Indicator Button */}
        <button
          onClick={onOpenMongoModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            mongoConfig.connected
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
          }`}
          title={mongoConfig.connected ? 'MongoDB Cluster Connected' : 'Click to connect MongoDB'}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {mongoConfig.connected ? 'MongoDB Connected' : 'Connect MongoDB'}
          </span>
          <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
        </button>

        {/* View Portfolio Button for small screens */}
        <button
          onClick={onSwitchToPublic}
          className="flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2170e4] text-white hover:bg-blue-700 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </button>

        <button
          onClick={onOpenSettingsModal}
          className="p-2 text-slate-500 hover:text-[#0058be] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={() => alert('Notifications: All system services running normally. 24 active projects.')}
          className="p-2 text-slate-500 hover:text-[#0058be] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* User Profile Avatar & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Lock Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden xl:inline">Lock Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
