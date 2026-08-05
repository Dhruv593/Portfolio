import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { BlogPost, ProfileData } from '../../types';

interface BlogSectionProps {
  blogs?: BlogPost[];
  profile: ProfileData;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs = [], profile }) => {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const publishedBlogs = blogs.filter((b) => b.status === 'Published');

  if (publishedBlogs.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="pt-10 sm:pt-12 pb-20 sm:pb-24 bg-white border-y border-slate-200/80 px-6 sm:px-8 lg:px-10 scroll-mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
            Articles & Publications
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#151c27]">
            Engineering Blog & Thoughts
          </h2>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {blog.image ? (
                  <div className="relative h-44 overflow-hidden bg-slate-200">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full transition-transform duration-500"
                      style={{
                        objectPosition: blog.imagePosition || '50% 50%',
                        objectFit: blog.imageFit || 'cover',
                        transform: blog.imageScale && blog.imageScale > 1 ? `scale(${blog.imageScale})` : undefined,
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative h-28 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-center justify-between border-b border-slate-200/60">
                    <BookOpen className="w-8 h-8 text-[#0058be]" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{blog.date}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{blog.readTime || '5 min read'}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#151c27] group-hover:text-[#0058be] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 font-normal">
                    {blog.excerpt || blog.content.substring(0, 140)}...
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 space-y-4">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-600 text-[11px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs font-bold text-[#0058be]">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* DETAILED BLOG PAGE / READER OVERLAY */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in fade-in duration-200">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedBlog(null)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            <span className="text-xs font-bold text-slate-500 truncate max-w-xs sm:max-w-md">
              {selectedBlog.title}
            </span>

            <div className="w-20" />
          </header>

          <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#0058be]">
                <span className="bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedBlog.tags?.[0] || 'Engineering'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-semibold">{selectedBlog.date}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-semibold">{selectedBlog.readTime || '5 min read'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#151c27] tracking-tight leading-tight">
                {selectedBlog.title}
              </h1>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-[#0058be] text-white flex items-center justify-center font-bold text-sm">
                  {profile.name ? profile.name.charAt(0) : 'A'}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#151c27]">{profile.name || 'Author'}</p>
                  <p className="text-[11px] text-slate-500">{profile.title || 'Software Engineer'}</p>
                </div>
              </div>
            </div>

            {selectedBlog.excerpt && (
              <div className="p-6 bg-slate-50 border-l-4 border-[#0058be] rounded-r-2xl text-slate-700 text-sm sm:text-base font-medium leading-relaxed italic">
                "{selectedBlog.excerpt}"
              </div>
            )}

            {selectedBlog.image && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-[460px]">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full"
                  style={{
                    objectPosition: selectedBlog.imagePosition || '50% 50%',
                    objectFit: selectedBlog.imageFit || 'cover',
                    transform: selectedBlog.imageScale && selectedBlog.imageScale > 1 ? `scale(${selectedBlog.imageScale})` : undefined,
                  }}
                />
              </div>
            )}

            <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-6 font-normal">
              {selectedBlog.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('# ')) {
                  return <h2 key={idx} className="text-2xl font-bold text-[#151c27] pt-4">{trimmed.replace('# ', '')}</h2>;
                } else if (trimmed.startsWith('## ')) {
                  return <h3 key={idx} className="text-xl font-bold text-[#151c27] pt-3">{trimmed.replace('## ', '')}</h3>;
                } else if (trimmed.startsWith('```')) {
                  const codeText = trimmed.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
                  return (
                    <pre key={idx} className="p-5 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto shadow-inner">
                      <code>{codeText}</code>
                    </pre>
                  );
                }
                return <p key={idx}>{trimmed}</p>;
              })}
            </div>
          </main>
        </div>
      )}
    </section>
  );
};
