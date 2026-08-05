import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  BookOpen, 
  Briefcase, 
  Brain, 
  GraduationCap, 
  User, 
  Mail, 
  Database, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Heart
} from 'lucide-react';
import { Project, BlogPost, ExperienceItem, EducationItem, SkillCategory, ProfileData, DashboardStats, MongoConfig } from '../../types';
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
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  profile,
  projects,
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
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [recentMessage, setRecentMessage] = useState<{ name: string; subject: string; date: string } | null>(null);

  useEffect(() => {
    const checkMessages = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (res.ok && data.success && data.messages) {
          const list = data.messages || [];
          const unread = list.filter((m: any) => !m.read).length;
          setUnreadCount(unread);
          if (list.length > 0) {
            setRecentMessage({
              name: list[0].name,
              subject: list[0].subject,
              date: new Date(list[0].createdAt).toLocaleDateString(),
            });
          }
        }
      } catch (e) {
        console.error('Error fetching unread messages count', e);
      }
    };
    checkMessages();
  }, []);

  const publishedProjectsCount = projects.filter((p) => p.status === 'Published').length;
  const draftProjectsCount = projects.filter((p) => p.status === 'Draft').length;

  const publishedBlogsCount = blogs.filter((b) => b.status === 'Published').length;
  const draftBlogsCount = blogs.filter((b) => b.status === 'Draft').length;

  return (
    <div className="space-y-8" id="admin-overview-dashboard">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          {profile.avatarUrl ? (
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-500/10 shadow-sm"
              style={{ objectPosition: profile.avatarPosition || '50% 50%' }}
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
              {profile.name ? profile.name.charAt(0) : 'A'}
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151c27] tracking-tight">
              Welcome back, {profile.name || 'Admin'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Here is an overview of your portfolio metrics and database system status.
            </p>
          </div>
        </div>

        {/* Live Site Shortcut */}
        <button
          onClick={() => setActiveTab('profile')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl shadow-2xs text-xs transition-colors cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-500" />
          <span>Edit Profile Settings</span>
        </button>
      </div>

      {/* 2. Visual Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Card */}
        <div 
          onClick={() => setActiveTab('projects')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-blue-50 text-[#0058be]">
              <FolderOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              {publishedProjectsCount} Published
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#151c27] group-hover:text-[#0058be] transition-colors">
              {projects.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Total Projects
            </p>
          </div>
        </div>

        {/* Blogs Card */}
        <div 
          onClick={() => setActiveTab('blogs')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              {blogs.length} Articles
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#151c27] group-hover:text-indigo-600 transition-colors">
              {blogs.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Total Blog Posts
            </p>
          </div>
        </div>

        {/* Experience & Education Card */}
        <div 
          onClick={() => setActiveTab('experience')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
              {experience.length + education.length} Entries
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#151c27] group-hover:text-amber-600 transition-colors">
              {experience.length} / {education.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Work / Edu Items
            </p>
          </div>
        </div>

        {/* Messages Card */}
        <div 
          onClick={() => setActiveTab('messages')}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
              <Mail className="w-6 h-6" />
            </div>
            {unreadCount > 0 ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md animate-pulse">
                {unreadCount} Unread
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                No Unread
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#151c27] group-hover:text-rose-600 transition-colors">
              {unreadCount}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Pending Inquiries
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Database Status & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Database Synchronization Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-[#0058be]" />
                <h3 className="text-base font-bold text-[#151c27]">Database System Connection</h3>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${mongoConfig.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your database to store real records instead of using standard local initial data. 
                Any modifications to projects, blogs, or contacts will synchronize immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="text-slate-500 font-semibold block">Database Status:</span>
                  <span className={`font-bold block ${mongoConfig.connected ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {mongoConfig.connected ? 'Active (Connected)' : 'Disconnected (Local Mode)'}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="text-slate-500 font-semibold block">Database Name:</span>
                  <span className="font-bold text-slate-800 block truncate">
                    {mongoConfig.dbName || 'portfolio_admin'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={onOpenMongoModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100/80 text-[#0058be] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Configure Connection</span>
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Configure Skills ({skills.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-6 space-y-4">
            <h3 className="text-base font-bold text-[#151c27] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0058be]" />
              <span>Admin Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={onAddNewProject}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#0058be]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-[#151c27]">New Project</span>
                    <span className="block text-[10px] text-slate-400">Add work to portfolio</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onAddBlog}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-[#151c27]">New Blog Article</span>
                    <span className="block text-[10px] text-slate-400">Write high-quality insights</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Summary Sidebar */}
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Sparkles className="w-4.5 h-4.5 text-blue-500" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Profile</h4>
            </div>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Full Name:</span>
                <span className="font-bold text-slate-800">{profile.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Main Title:</span>
                <span className="font-bold text-slate-800 text-right max-w-[150px] truncate" title={profile.title}>
                  {profile.title}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Contact Email:</span>
                <span className="font-bold text-[#0058be] truncate max-w-[150px]">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-bold text-slate-800">{profile.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Work Experience:</span>
                <span className="font-bold text-emerald-600">{profile.yearsExperience || experience.length} Years</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0058be] hover:bg-[#2170e4] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <span>Manage Profile Info</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Recent Contact Alert Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Mail className="w-4.5 h-4.5 text-rose-500" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Contact Inquiry</h4>
            </div>

            {recentMessage ? (
              <div className="space-y-3">
                <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="block font-bold text-[#151c27] truncate">
                    {recentMessage.name}
                  </span>
                  <span className="block font-semibold text-[#0058be] truncate">
                    Subject: {recentMessage.subject}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Received: {recentMessage.date}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200/60"
                >
                  <span>Go to Inbox</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-400">
                No contact messages yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
