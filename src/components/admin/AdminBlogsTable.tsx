import React, { useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  Clock,
  Tag,
  CheckCircle,
  Clock3,
} from 'lucide-react';
import { BlogPost } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface AdminBlogsTableProps {
  blogs: BlogPost[];
  onAddBlog: () => void;
  onEditBlog: (blog: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  onToggleStatus: (blog: BlogPost) => void;
}

export const AdminBlogsTable: React.FC<AdminBlogsTableProps> = ({
  blogs,
  onAddBlog,
  onEditBlog,
  onDeleteBlog,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#151c27]">
            Blog Articles
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            Manage your articles, thoughts, and technical publications.
          </p>
        </div>

        <button
          onClick={onAddBlog}
          className="px-5 py-2.5 bg-[#0058be] hover:bg-[#2170e4] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or tag..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 outline-hidden placeholder:text-slate-400 transition-all font-medium"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl text-[11px] font-bold self-start sm:self-auto border border-slate-200/60 shadow-3xs">
          {(['All', 'Published', 'Draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-[#0058be] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Article Title</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Read Time</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-xs text-slate-500">No blog articles found</p>
                    <p className="text-[10px] text-slate-400 mt-1">Try tweaking your search or create a new article.</p>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Article Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {blog.image && (
                          <img
                            src={normalizeImageUrl(blog.image)}
                            alt={blog.title}
                            className="w-12 h-9 rounded-lg object-cover border border-slate-150 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-[#151c27] line-clamp-1 hover:text-[#0058be] cursor-pointer" onClick={() => onEditBlog(blog)}>
                            {blog.title}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                            {blog.excerpt || 'No description preview available.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(blog)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          blog.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {blog.status === 'Published' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock3 className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{blog.status}</span>
                      </button>
                    </td>

                    {/* Read Time */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 font-medium text-[10px]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {blog.readTime || '5 min read'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[10px] font-medium">
                      {blog.dateAdded}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditBlog(blog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0058be] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteBlog(blog.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Article"
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
      </div>
    </div>
  );
};
