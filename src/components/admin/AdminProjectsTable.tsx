import React from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { DashboardStats, Project } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface AdminProjectsTableProps {
  projects: Project[];
  totalProjectsCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  stats: DashboardStats;
  onAddNewProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleStatus: (project: Project) => void;
  onSetPosition: (project: Project, position: number) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  reordering: boolean;
  error: string;
  onRetry: () => void;
}

export const AdminProjectsTable: React.FC<AdminProjectsTableProps> = ({
  projects, totalProjectsCount, currentPage, totalPages, setCurrentPage, stats,
  onAddNewProject, onEditProject, onDeleteProject, onToggleStatus, onSetPosition,
  statusFilter, setStatusFilter, searchQuery, setSearchQuery, loading, reordering, error, onRetry,
}) => {
  const filtered = Boolean(searchQuery || statusFilter !== 'All');
  const clearFilters = () => {
    setSearchQuery(''); setStatusFilter('All'); setCurrentPage(1);
  };

  const actions = (project: Project) => <div className="flex flex-wrap items-center gap-1 text-sm">
    <button type="button" onClick={() => onEditProject(project)} className="min-h-11 rounded-lg px-3 font-medium text-[#0058be] hover:bg-blue-50">Edit</button>
    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-slate-700 hover:bg-slate-100">Visit</a>}
    <button type="button" onClick={() => onDeleteProject(project.id)} className="min-h-11 rounded-lg px-3 font-medium text-red-700 hover:bg-red-50">Delete</button>
  </div>;

  const statusButton = (project: Project) => <button type="button" onClick={() => onToggleStatus(project)} aria-label={`Change ${project.name} from ${project.status} to ${project.status === 'Published' ? 'Draft' : 'Published'}`} className={`min-h-11 rounded-lg px-3 text-sm font-medium ${project.status === 'Published' ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{project.status}</button>;

  const positionControl = (project: Project, index: number) => {
    const position = (currentPage - 1) * 10 + index + 1;
    const unavailable = filtered || reordering;
    return <div className="inline-flex items-center gap-1" role="group" aria-label={`Order ${project.name}`}>
      <button type="button" onClick={() => onSetPosition(project, position - 1)} disabled={unavailable || position === 1} aria-label={`Move ${project.name} up`} title={filtered ? 'Clear filters to change project order' : 'Move up'} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] disabled:cursor-not-allowed disabled:opacity-35"><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
      <span className="min-w-7 text-center text-sm font-medium tabular-nums text-slate-600" aria-label={`Position ${position}`}>{position}</span>
      <button type="button" onClick={() => onSetPosition(project, position + 1)} disabled={unavailable || position >= totalProjectsCount} aria-label={`Move ${project.name} down`} title={filtered ? 'Clear filters to change project order' : 'Move down'} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#0058be] disabled:cursor-not-allowed disabled:opacity-35"><ArrowDown className="h-4 w-4" aria-hidden="true" /></button>
    </div>;
  };

  return <div className="min-w-0 space-y-5">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-semibold tracking-tight text-slate-900">Projects</h1><p className="mt-1 text-sm text-slate-600">{stats.publishedCount} published · {stats.draftCount} drafts</p></div>
      <button type="button" onClick={onAddNewProject} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0058be] px-4 text-sm font-semibold text-white hover:bg-[#004a9f]"><Plus className="h-4 w-4" /> Add project</button>
    </header>
    <p className="text-sm text-slate-600">Use the arrows to arrange projects. The first three published projects appear on the homepage.</p>
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative min-w-0 flex-1"><span className="sr-only">Search projects</span><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" /><input type="search" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} placeholder="Search projects" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 focus:outline-2 focus:outline-[#0058be]" /></label>
      <label className="flex items-center gap-2 text-sm text-slate-700"><span>Status</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }} className="min-h-11 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm sm:flex-none"><option value="All">All</option><option value="Published">Published</option><option value="Draft">Draft</option></select></label>
      {filtered && <button type="button" onClick={clearFilters} className="min-h-11 rounded-lg px-3 text-sm font-medium text-[#0058be] hover:bg-blue-50">Clear filters</button>}
    </div>
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"><span>Projects could not load: {error}</span><button type="button" onClick={onRetry} className="min-h-11 rounded-lg px-3 font-semibold hover:bg-red-100">Try again</button></div>}
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {loading ? <p role="status" className="p-8 text-center text-sm text-slate-600">Loading projects…</p> : error ? <p className="p-8 text-center text-sm text-slate-600">Project list unavailable. Try again above.</p> : projects.length === 0 ? <div className="p-8 text-center"><p className="text-base font-semibold text-slate-900">{filtered ? 'No matching projects' : 'No projects yet'}</p><p className="mt-1 text-sm text-slate-600">{filtered ? 'Try another search or clear the filters.' : 'Add a project to show your work.'}</p><button type="button" onClick={filtered ? clearFilters : onAddNewProject} className="mt-3 min-h-11 rounded-lg px-4 text-sm font-semibold text-[#0058be] hover:bg-blue-50">{filtered ? 'Clear filters' : 'Add project'}</button></div> : <>
        <div className="divide-y divide-slate-100 md:hidden">{projects.map((project, index) => <article key={project.id} className="space-y-3 p-4"><div className="flex items-start gap-3">{project.image && <img src={normalizeImageUrl(project.image)} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />}<div className="min-w-0 flex-1"><h2 className="break-words text-base font-semibold text-slate-900">{project.name}</h2><p className="text-sm text-slate-600">{project.category}</p></div></div><div className="flex flex-wrap items-center gap-3"><span className="text-sm text-slate-600">Position</span>{positionControl(project, index)}{statusButton(project)}</div>{actions(project)}</article>)}</div>
        <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 font-semibold">Position</th><th className="px-4 py-3 font-semibold">Project</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{projects.map((project, index) => <tr key={project.id}><td className="px-4 py-3">{positionControl(project, index)}</td><td className="px-4 py-3"><div className="flex items-center gap-3">{project.image && <img src={normalizeImageUrl(project.image)} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />}<div className="min-w-0"><p className="break-words font-semibold text-slate-900">{project.name}</p><p className="text-slate-600">{project.category}</p></div></div></td><td className="px-4 py-3">{statusButton(project)}</td><td className="px-4 py-3">{actions(project)}</td></tr>)}</tbody></table></div>
      </>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600"><span>{totalProjectsCount} {totalProjectsCount === 1 ? 'project' : 'projects'} · Page {currentPage} of {totalPages}</span><div className="flex gap-2"><button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button><button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-slate-300 px-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button></div></div>
    </div>
  </div>;
};
