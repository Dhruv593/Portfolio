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
    <div className="min-w-0 space-y-6">
      {/* Top Header & Search Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Articles
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage published articles and drafts.
          </p>
        </div>

        <button
          onClick={onAddBlog}
          className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0058be] px-4 text-sm font-semibold text-white hover:bg-[#004a9f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0058be]"
        >
          <Plus className="w-4 h-4" />
          <span>Add article</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex min-w-0 flex-col items-stretch justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            aria-label="Search articles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or tag..."
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#0058be] focus:bg-white focus:outline-2 focus:outline-[#0058be]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex self-start rounded-lg border border-slate-200 bg-slate-100 p-1 text-sm font-medium sm:self-auto">
          {(['All', 'Published', 'Draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`min-h-10 rounded-md px-3 transition-colors ${
                statusFilter === st
                  ? 'bg-white font-semibold text-[#0058be] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
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
