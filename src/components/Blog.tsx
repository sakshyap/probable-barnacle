import { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Search,
  Sparkles,
  ExternalLink,
  Eye,
  X,
  Tag,
  Share2,
} from 'lucide-react';
import { BlogPost, ThemeConfig } from '../types';

interface BlogProps {
  theme?: ThemeConfig;
}

export default function Blog({ theme }: BlogProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalPost, setActiveModalPost] = useState<BlogPost | null>(null);

  // Fetch blog posts managed by the portfolio admin panel
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const res = await fetch('/api/portfolio/blog');
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data)) {
            // The public endpoint already filters drafts out.
            setPosts(data.data);
          }
        }
      } catch (err) {
        console.warn('Could not load blog posts from /api/portfolio/blog', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // Filter posts
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 relative overflow-hidden bg-[#07090e]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Articles & Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Blog & AI Insights
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Insights, tutorials, and reflections managed directly via our Admin Portal and served live to readers.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
          {/* Categories Pill list */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 ring-1 ring-white/20'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Admin Quick Link */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0e1424]/90 border border-white/[0.1] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-all"
              />
            </div>
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              title="Manage and create posts in Admin Dashboard"
            >
              <span>Admin</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Blog Post Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 h-80 animate-pulse bg-white/[0.02]" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/[0.06] p-8 max-w-lg mx-auto">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
            <p className="text-sm text-slate-400 mb-4">
              {searchQuery
                ? `No posts matching "${searchQuery}". Try a different keyword.`
                : 'Check back soon for new articles published from the admin panel.'}
            </p>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
            >
              Write First Post in Admin
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const formattedDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              return (
                <article
                  key={post.id}
                  className="glass-panel group rounded-2xl border border-white/[0.08] hover:border-violet-500/40 bg-gradient-to-b from-[#0f172a]/90 to-[#070b14]/90 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-600/15"
                >
                  {/* Thumbnail Banner */}
                  {post.imageUrl ? (
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={post.imageUrl}
                        alt={`${post.title} - ${post.category} article thumbnail`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/20" />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-950/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-tr from-violet-950/60 via-slate-900 to-cyan-950/40 p-4 flex items-start justify-between border-b border-white/[0.05]">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-950/80 text-violet-300 border border-violet-500/30">
                        {post.category}
                      </span>
                      <Sparkles className="w-4 h-4 text-violet-400 opacity-60" />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-slate-300">{post.author}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-violet-400" />
                          <span>{formattedDate}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setActiveModalPost(post)}
                        className="text-lg font-bold text-white mb-2.5 group-hover:text-violet-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Footer read button */}
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveModalPost(post)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/btn cursor-pointer"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveModalPost(post)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                        title="View modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activeModalPost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModalPost(null)}
        >
          <div
            className="glass-panel-elevated bg-[#0c1220] border border-white/[0.15] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {activeModalPost.category}
                </span>
                <span className="text-xs text-slate-400">
                  {activeModalPost.createdAt
                    ? new Date(activeModalPost.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalPost(null)}
                className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {activeModalPost.title}
              </h2>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200 font-semibold">{activeModalPost.author}</span>
              </div>

              {activeModalPost.imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-72 w-full">
                  <img
                    src={activeModalPost.imageUrl}
                    alt={`${activeModalPost.title} - ${activeModalPost.category} article image`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {activeModalPost.excerpt && (
                <p className="text-sm sm:text-base text-slate-300 italic border-l-2 border-violet-500 pl-4 py-1 bg-violet-950/20 rounded-r-lg">
                  {activeModalPost.excerpt}
                </p>
              )}

              <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {activeModalPost.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] flex items-center justify-between bg-slate-900/60">
              <span className="text-xs text-slate-400">Managed via Admin Portal</span>
              <button
                type="button"
                onClick={() => setActiveModalPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
