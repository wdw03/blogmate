import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Bookmark, CalendarDays, Clock3, Eye, Heart, MessageCircle,
  Search, SlidersHorizontal, Sparkles, UserRound,
} from 'lucide-react';
import SEO from '../src/components/seo/SEO';
import { organizationSchema, websiteSchema, webPageSchema } from '../src/utils/generateSchema';
import { BLOG_CATEGORIES, KNOWLEDGE_ARTICLES, KnowledgeArticle, getDynamicArticles } from '../src/data/blog';

const ArticleCard: React.FC<{ article: KnowledgeArticle; large?: boolean }> = ({ article, large }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: .98 }}
    className={`group overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-lg shadow-slate-200/40 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none ${large ? 'lg:grid lg:grid-cols-2' : ''}`}
  >
    <a href={`/blog/${article.slug}`} className={`relative block overflow-hidden ${large ? 'min-h-72' : 'aspect-[16/10]'}`}>
      <img
        src={article.image}
        alt={`${article.title} cover`}
        title={article.title}
        width="1200"
        height="675"
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
      <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700 backdrop-blur">
        {article.category}
      </span>
    </a>
    <div className={`flex flex-col ${large ? 'p-8 lg:p-10' : 'p-6'}`}>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5"><CalendarDays size={13} />{new Date(article.updatedAt).toLocaleDateString()}</span>
        <span className="flex items-center gap-1.5"><Clock3 size={13} />{article.readTime} min</span>
        <span className="flex items-center gap-1.5"><Eye size={13} />{article.views.toLocaleString()}</span>
      </div>
      <h2 className={`${large ? 'text-3xl' : 'text-xl'} mb-3 font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-blue-600 dark:text-white`}>
        <a href={`/blog/${article.slug}`}>{article.title}</a>
      </h2>
      <p className="mb-6 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{article.description}</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {article.tags.map(tag => <span key={tag} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">#{tag}</span>)}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
        <span className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300"><UserRound size={15} />{article.author}</span>
        <div className="flex gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-[11px]"><Heart size={14} />{article.likes}</span>
          <span className="flex items-center gap-1 text-[11px]"><MessageCircle size={14} />{article.comments}</span>
          <button aria-label={`Bookmark ${article.title}`}><Bookmark size={15} /></button>
        </div>
      </div>
    </div>
  </motion.article>
);

const Blog: React.FC<{ initialCategory?: string; initialTag?: string }> = ({ initialCategory, initialTag }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory || 'All');
  const [sort, setSort] = useState<'newest' | 'popular' | 'shortest'>('newest');

  const articles = useMemo(() => {
    const needle = (initialTag || query).toLowerCase();
    const all = getDynamicArticles();
    return all
      .filter(article => category === 'All' || article.category.toLowerCase() === category.toLowerCase())
      .filter(article => !needle || `${article.title} ${article.description} ${article.tags.join(' ')}`.toLowerCase().includes(needle))
      .sort((a, b) => sort === 'popular' ? b.views - a.views : sort === 'shortest' ? a.readTime - b.readTime : b.updatedAt.localeCompare(a.updatedAt));
  }, [category, initialTag, query, sort]);

  const featured = getDynamicArticles().find(article => article.featured) || getDynamicArticles()[0];
  const pageTitle = initialTag ? `${initialTag} Articles` : initialCategory ? `${initialCategory} Articles` : 'SEO & Domain Knowledge Center';
  const path = initialTag ? `/tag/${initialTag.toLowerCase()}` : initialCategory ? `/category/${initialCategory.toLowerCase()}` : '/blog';

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-28 dark:bg-slate-950">
      <SEO
        title={pageTitle}
        description="Expert guides, field-tested SEO tactics, domain research, templates, case studies, and practical tools from BlogMate."
        path={path}
        keywords={['SEO guides', 'domain investing', 'backlinks', 'AI SEO', 'digital marketing']}
        schema={[organizationSchema, websiteSchema, webPageSchema(pageTitle, path, 'BlogMate research and practical guides for SEO and domain professionals.')]}
      />
      <section className="relative overflow-hidden border-b border-slate-200/80 px-5 pb-16 pt-10 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,.16),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(20,184,166,.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles size={13} /> BlogMate Intelligence
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            The knowledge center for better digital decisions.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            Original research, practical playbooks, and honest analysis for search teams, publishers, and domain investors.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5">
        {!initialCategory && !initialTag && (
          <section className="py-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Featured article</h2>
              <a href="/blog/react-seo-guide" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">Editor’s choice <ArrowRight size={15} /></a>
            </div>
            <ArticleCard article={featured} large />
          </section>
        )}

        <section className="sticky top-16 z-30 mb-10 rounded-3xl border border-white/80 bg-white/85 p-3 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-none">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-slate-100 px-4 dark:bg-slate-800">
              <Search size={18} className="text-slate-400" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search guides, topics, and tags…" className="h-12 w-full bg-transparent text-sm font-medium outline-none dark:text-white" />
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 dark:bg-slate-800">
              <SlidersHorizontal size={16} className="text-slate-400" />
              <select value={sort} onChange={event => setSort(event.target.value as typeof sort)} className="h-12 bg-transparent text-xs font-bold outline-none dark:text-white">
                <option value="newest">Newest</option><option value="popular">Most read</option><option value="shortest">Quick reads</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {BLOG_CATEGORIES.map(item => (
              <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-wider transition ${category === item ? 'bg-slate-950 text-white dark:bg-blue-600' : 'bg-slate-100 text-slate-500 hover:text-blue-600 dark:bg-slate-800'}`}>{item}</button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-blue-600">Latest research</p><h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{category === 'All' ? 'Explore the library' : category}</h2></div>
            <span className="text-xs font-bold text-slate-400">{articles.length} articles</span>
          </div>
          {articles.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><AnimatePresence>{articles.map(article => <ArticleCard key={article.id} article={article} />)}</AnimatePresence></div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-slate-300 p-16 text-center dark:border-slate-700"><Search className="mx-auto mb-4 text-slate-300" size={32} /><h3 className="font-black dark:text-white">No matching research yet</h3><button onClick={() => { setQuery(''); setCategory('All'); }} className="mt-3 text-sm font-bold text-blue-600">Clear filters</button></div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Blog;
