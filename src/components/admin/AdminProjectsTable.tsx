import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { Project, DashboardStats, ExperienceItem } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface AdminProjectsTableProps {
  projects: Project[];
  totalProjectsCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  stats: DashboardStats;
  experience: ExperienceItem[];
  onAddNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleStatus: (project: Project) => void;
  onViewAllExperience: () => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const AdminProjectsTable: React.FC<AdminProjectsTableProps> = ({
  projects,
  totalProjectsCount,
  currentPage,
  totalPages,
  setCurrentPage,
  stats,
  experience,
  onAddNewProject,
  onEditProject,
  onDeleteProject,
  onToggleStatus,
  onViewAllExperience,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Projects Catalog
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Curate and oversee your portfolio work samples and case studies.
          </p>
        </div>
        <button
          onClick={onAddNewProject}
          className="bg-[#0058be] hover:bg-[#2170e4] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Projects
          </p>
          <p className="text-2xl font-black text-[#0058be] mt-2">
            {stats.totalProjects}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Live Viewers
          </p>
          <p className="text-2xl font-black text-[#0058be] mt-2">
            {stats.liveViewers}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-3xs border border-slate-200/80 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Recent Activity
          </p>
          <p className="text-2xl font-black text-[#0058be] mt-2">
            {stats.recentActivity}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar for Table */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs">
        <div className="flex items-center gap-3 relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, category, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-bold py-2.5 px-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-hidden cursor-pointer transition-all"
          >
            <option value="All">All Projects</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects Table View */}
      <div className="bg-white rounded-2xl shadow-3xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-4 font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-4 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-xs font-medium text-slate-400">
                    No projects found matching your search criteria.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-150">
                          <img
                            src={normalizeImageUrl(project.image)}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#151c27] group-hover:text-[#0058be] transition-colors">
                            {project.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {project.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleStatus(project)}
                        className="cursor-pointer"
                        title="Click to toggle Published/Draft"
                      >
                        {project.status === 'Published' ? (
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:bg-emerald-100 transition-colors">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Published
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 hover:bg-slate-200 transition-colors">
                            <Clock className="w-3 h-3 text-slate-500" />
                            Draft
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {project.dateAdded}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 px-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-[#0058be] rounded-lg transition-colors cursor-pointer"
                            title="Preview live"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => onEditProject(project)}
                          className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProject(project.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500 font-semibold">
            Showing {projects.length === 0 ? 0 : (currentPage - 1) * 10 + 1}-
            {Math.min(currentPage * 10, totalProjectsCount)} of {totalProjectsCount} projects
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3.5 py-1.5 bg-[#0058be] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Asymmetric Bottom Grid: Experience Timeline + Portfolio Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Timeline Preview */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#151c27]">
                Experience Timeline
              </h3>
              <button
                onClick={onViewAllExperience}
                className="text-[#0058be] text-sm font-semibold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {experience.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="relative">
                  <div
                    className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                      idx === 0 ? 'bg-[#0058be]' : 'bg-slate-300'
                    }`}
                  />
                  <p className="font-semibold text-sm text-[#151c27]">
                    {item.role}
                  </p>
                  <p className="text-xs text-[#424754] font-medium">
                    {item.company} • {item.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Analytics Card */}
        <div className="bg-[#2170e4] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Portfolio Analytics</h3>
            <p className="text-sm opacity-90 mb-6 max-w-md font-normal">
              Your projects have seen a 15% increase in engagement this week. Great work!
            </p>
            <div className="flex items-end gap-2.5 h-24 pt-2">
              <div className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-t-xs h-[40%]" title="Mon" />
              <div className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-t-xs h-[60%]" title="Tue" />
              <div className="flex-1 bg-white/40 hover:bg-white/50 transition-colors rounded-t-xs h-[80%]" title="Wed" />
              <div className="flex-1 bg-white/60 hover:bg-white/70 transition-colors rounded-t-xs h-[50%]" title="Thu" />
              <div className="flex-1 bg-white/90 hover:bg-white transition-colors rounded-t-xs h-[100%]" title="Fri" />
              <div className="flex-1 bg-white/40 hover:bg-white/50 transition-colors rounded-t-xs h-[70%]" title="Sat" />
              <div className="flex-1 bg-white/20 hover:bg-white/30 transition-colors rounded-t-xs h-[40%]" title="Sun" />
            </div>
          </div>
          {/* Ambient Glow */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
