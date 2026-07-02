import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bookmark, CheckCircle2, Clock3, Copy, Facebook,
  Linkedin, Minus, Plus, Printer, Share2, Twitter, UserRound, Heart,
  MessageSquare, ThumbsUp, Send, Link as LinkIcon,
} from 'lucide-react';
import SEO from '../src/components/seo/SEO';
import ArticleSchema from '../src/components/seo/ArticleSchema';
import BreadcrumbSchema from '../src/components/seo/BreadcrumbSchema';
import FAQSchema from '../src/components/seo/FAQSchema';
import { findArticle, KNOWLEDGE_ARTICLES, getDynamicArticles } from '../src/data/blog';
import { generateCanonical } from '../src/utils/generateCanonical';
import { supabase } from '../lib/supabase';

const FAQS = [
  { question: 'How often should this process be reviewed?', answer: 'Review important inputs quarterly and after any major platform, market, or algorithm change.' },
  { question: 'Which metric should I prioritize?', answer: 'No single metric is decisive. Use a balanced set of relevance, quality, risk, and business-outcome signals.' },
];

import { supabase } from '../lib/supabase';
import { syncDynamicArticlesFromSupabase } from '../src/data/blog';

const BlogDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const [article, setArticle] = useState<any>(() => findArticle(slug));
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Article Likes
  const [likes, setLikes] = useState<number>(() => {
    const stored = localStorage.getItem(`blogmate_likes_${slug}`);
    return stored ? Number(stored) : article?.likes || 0;
  });
  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    return localStorage.getItem(`blogmate_liked_${slug}`) === 'true';
  });

  // Comments System
  const [comments, setComments] = useState<any[]>(() => {
    const allStored = JSON.parse(localStorage.getItem('blogmate_comments') || '[]');
    return allStored.filter((c: any) => c.article_slug === slug && c.status !== 'hidden');
  });

  useEffect(() => {
    syncDynamicArticlesFromSupabase().then(() => {
      const found = findArticle(slug);
      if (found) setArticle(found);
    });
    // Fetch live comments from Supabase
    supabase.from('article_comments').select('*').eq('article_slug', slug).then(({ data }) => {
      if (data && data.length > 0) {
        setComments(data.filter(c => c.status !== 'hidden'));
      }
    });
  }, [slug]);

  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const handleLikeArticle = () => {
    if (hasLiked) {
      const nextLikes = likes - 1;
      setLikes(nextLikes);
      setHasLiked(false);
      localStorage.setItem(`blogmate_likes_${slug}`, String(nextLikes));
      localStorage.removeItem(`blogmate_liked_${slug}`);
    } else {
      const nextLikes = likes + 1;
      setLikes(nextLikes);
      setHasLiked(true);
      localStorage.setItem(`blogmate_likes_${slug}`, String(nextLikes));
      localStorage.setItem(`blogmate_liked_${slug}`, 'true');
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c);
    setComments(updated);
    const allStored = JSON.parse(localStorage.getItem('blogmate_comments') || '[]');
    const newAll = allStored.map((c: any) => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c);
    localStorage.setItem('blogmate_comments', JSON.stringify(newAll));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;
    setSubmittingComment(true);

    const newComment = {
      id: `com-${Date.now()}`,
      article_slug: slug,
      user_name: commentName.trim(),
      user_email: commentEmail.trim(),
      avatar: `https://picsum.photos/seed/${encodeURIComponent(commentName.trim())}/100/100`,
      content: commentText.trim(),
      likes: 0,
      status: 'approved',
      created_at: new Date().toISOString()
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);

    const allStored = JSON.parse(localStorage.getItem('blogmate_comments') || '[]');
    localStorage.setItem('blogmate_comments', JSON.stringify([newComment, ...allStored]));

    try {
      await supabase.from('article_comments').insert([newComment]);
    } catch (err) {}

    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setSubmittingComment(false);
  };

  const related = useMemo(() => article
    ? getDynamicArticles().filter(item => item.id !== article.id).sort((a, b) =>
      Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 3)
    : [], [article]);

  if (!article) return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center dark:bg-slate-950">
      <SEO title="Article not found" path={`/blog/${slug}`} noIndex />
      <h1 className="text-4xl font-black dark:text-white">This article wandered off.</h1>
      <a href="/blog" className="mt-6 font-bold text-blue-600">Return to the knowledge center</a>
    </main>
  );

  const path = `/blog/${article.slug}`;
  const shareUrl = generateCanonical(path);
  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-white pb-24 pt-24 dark:bg-slate-950">
      <SEO title={article.title} description={article.description} path={path} keywords={article.tags} ogType="article" ogImage={article.image} publishedTime={article.publishedAt} modifiedTime={article.updatedAt} author={article.author} />
      <ArticleSchema headline={article.title} description={article.description} path={path} image={article.image} author={article.author} datePublished={article.publishedAt} dateModified={article.updatedAt} />
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Knowledge Center', path: '/blog' }, { name: article.title, path }]} />
      <FAQSchema items={FAQS} />

      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-slate-200 dark:bg-slate-800">
        <div className="h-full bg-blue-600 transition-all duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <a href="/blog" className="mb-10 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-blue-400">
          <ArrowLeft size={14} /> Knowledge center
        </a>

        <header className="mx-auto max-w-4xl border-b border-slate-200 pb-12 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>{article.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-slate-500"><Clock3 size={13} /> {article.readTime} min read</span>
            <span>·</span>
            <button
              onClick={handleLikeArticle}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                hasLiked
                  ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 hover:border-red-400 hover:text-red-500'
              }`}
            >
              <Heart size={14} className={hasLiked ? 'fill-red-600 text-red-600 animate-bounce' : ''} />
              <span>{likes} Likes</span>
            </button>
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">{article.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">{article.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-8 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 font-black text-white">{article.author.split(' ').map(x => x[0]).join('')}</div>
              <div>
                <p className="font-black text-slate-950 dark:text-white">{article.author}</p>
                <p className="text-xs text-slate-500">{article.authorRole} · Updated {new Date(article.updatedAt || article.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleLikeArticle} className={`flex h-10 items-center gap-2 px-4 rounded-xl border font-bold text-xs ${hasLiked ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/30' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}>
                <Heart size={15} className={hasLiked ? 'fill-red-600' : ''} /> {likes}
              </button>
              <a href="#comments" className="flex h-10 items-center gap-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 hover:border-blue-500">
                <MessageSquare size={15} /> {comments.length}
              </a>
              <button onClick={copyLink} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                <Copy size={14} /> {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="mx-auto mt-12 max-w-5xl px-5">
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <img src={article.image} alt={article.title} width="1200" height="630" className="aspect-[16/9] w-full object-cover" />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-12 px-5 lg:grid-cols-[280px_minmax(0,1fr)_240px]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <nav aria-label="Table of contents" className="space-y-3 rounded-3xl border border-slate-200 p-6 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section outline</p>
              {article.sections.map((section: any, index: number) => (
                <a key={section.id} href={`#${section.id}`} className="block text-sm font-bold text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-white">
                  0{index + 1}. {section.heading}
                </a>
              ))}
              <a href="#faq" className="block text-xs font-bold text-slate-500 hover:text-blue-600">Frequently asked questions</a>
              <a href="#comments" className="block text-xs font-bold text-slate-500 hover:text-blue-600">Discussion ({comments.length})</a>
            </nav>
          </div>
        </aside>

        <article className="min-w-0" style={{ fontSize }}>
          <p className="mb-10 text-[1.15em] leading-[1.8] text-slate-700 first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-black first-letter:text-blue-600 dark:text-slate-300">
            This guide is built for practitioners who need a clear, defensible way to make decisions—not another pile of disconnected tips. Use it as a starting point, then adapt the framework to your own evidence and constraints.
          </p>

          {article.sections.map((section: any, index: number) => {
            const HeadingTag = (section.heading_tag || 'h2').toLowerCase() as any;
            const sectionImages = section.images && section.images.length ? section.images : (section.image ? [section.image] : []);

            return (
              <section id={section.id} key={section.id} className="scroll-mt-28 border-t border-slate-100 py-9 dark:border-slate-800">
                <p className="mb-3 text-[.55em] font-black uppercase tracking-[.2em] text-blue-600">0{index + 1} / Field note</p>
                
                {HeadingTag === 'h1' ? (
                  <h1 className="mb-5 text-[1.85em] font-black tracking-tight text-slate-950 dark:text-white">{section.heading}</h1>
                ) : HeadingTag === 'h3' ? (
                  <h3 className="mb-5 text-[1.45em] font-black tracking-tight text-slate-950 dark:text-white">{section.heading}</h3>
                ) : (
                  <h2 className="mb-5 text-[1.65em] font-black tracking-tight text-slate-950 dark:text-white">{section.heading}</h2>
                )}

                {sectionImages.length > 0 && (
                  <div className={`my-6 grid gap-4 ${sectionImages.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {sectionImages.map((imgUrl: string, imgIdx: number) => (
                      <div key={imgIdx} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-96">
                        <img src={imgUrl} alt={`${section.heading} ${imgIdx + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      </div>
                    ))}
                  </div>
                )}

                <p className="leading-[1.85] text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{section.body}</p>

                {section.anchor_text && section.anchor_url && (
                  <div className="my-5 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-center gap-3">
                    <LinkIcon size={18} className="text-blue-600 shrink-0" />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Recommended Reference: </span>
                    <a href={section.anchor_url} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-blue-600 hover:underline">
                      {section.anchor_text}
                    </a>
                  </div>
                )}

                {section.button_text && section.button_url && (
                  <div className="mt-6">
                    <a
                      href={section.button_url}
                      target={section.open_new_tab ? "_blank" : undefined}
                      rel={section.is_dofollow ? "dofollow" : "nofollow"}
                      className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
                        section.button_style === 'outline'
                          ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400'
                          : section.button_style === 'highlight'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      }`}
                    >
                      <span>{section.button_text}</span>
                      <ArrowRight size={15} />
                    </a>
                  </div>
                )}

                {index === 1 && (
                  <>
                    <h3 className="mb-3 mt-8 text-[1.15em] font-black text-slate-900 dark:text-white">The working checklist</h3>
                    <ul className="space-y-3">
                      {['Define the decision and success criteria', 'Validate data with more than one source', 'Record risks, assumptions, and ownership', 'Measure the outcome and revisit the decision'].map(item => <li key={item} className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={18} />{item}</li>)}
                    </ul>
                    <div className="my-9 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900"><tr><th className="p-4">Signal</th><th className="p-4">Question</th><th className="p-4">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800"><tr><td className="p-4 font-bold">Relevance</td><td className="p-4">Does it match intent?</td><td className="p-4">Verify topical fit</td></tr><tr><td className="p-4 font-bold">Quality</td><td className="p-4">Is the source credible?</td><td className="p-4">Cross-check evidence</td></tr><tr><td className="p-4 font-bold">Risk</td><td className="p-4">What can fail?</td><td className="p-4">Set guardrails</td></tr></tbody>
                      </table>
                    </div>
                  </>
                )}
              </section>
            );
          })}

          <section id="faq" className="scroll-mt-28 border-t border-slate-100 py-9 dark:border-slate-800">
            <h2 className="mb-6 text-[1.65em] font-black text-slate-950 dark:text-white">Frequently asked questions</h2>
            <div className="space-y-3">{FAQS.map(item => <details key={item.question} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><summary className="cursor-pointer font-bold text-slate-900 dark:text-white">{item.question}</summary><p className="mt-3 text-[.9em] leading-7 text-slate-600 dark:text-slate-400">{item.answer}</p></details>)}</div>
          </section>

          <section className="rounded-[2rem] bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-[.55em] font-black uppercase tracking-[.2em] text-blue-400">Conclusion</p>
            <h2 className="mt-3 text-[1.6em] font-black">Turn the framework into a repeatable habit.</h2>
            <p className="mt-4 leading-7 text-slate-300">Start small, document what changes, and improve the process with real outcomes. The marketplace can help you compare verified opportunities when you are ready.</p>
            <a href="/domains" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-wider">Explore verified domains <ArrowRight size={15} /></a>
          </section>

          {/* Interactive Comments & Reviews Section */}
          <section id="comments" className="scroll-mt-28 mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Discussion & Community Reviews</h2>
                <p className="text-sm text-slate-500 mt-1">Join SEO experts and domain investors debating this strategy.</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-black text-xs dark:bg-blue-950/50 dark:text-blue-400">
                {comments.length} Comments
              </span>
            </div>

            {/* Write Comment Box */}
            <form onSubmit={handleSubmitComment} className="rounded-3xl border border-slate-200 p-6 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 space-y-4 mb-10">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600" /> Leave a Comment
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email / Role (Optional)"
                  value={commentEmail}
                  onChange={e => setCommentEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>
              <textarea
                rows={4}
                required
                placeholder="Share your thoughts, backlink tips, or feedback on this guide..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-black text-xs uppercase tracking-wider text-white transition-all shadow-md shadow-blue-500/20"
                >
                  <Send size={14} />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(com => (
                <div key={com.id} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={com.avatar} alt={com.user_name} className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <h4 className="font-black text-sm text-slate-950 dark:text-white flex items-center gap-2">
                          {com.user_name}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold dark:bg-emerald-950/40 dark:text-emerald-400">Verified Reader</span>
                        </h4>
                        <p className="text-xs text-slate-400">{new Date(com.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLikeComment(com.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp size={14} />
                      <span>{com.likes || 0}</span>
                    </button>
                  </div>
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300 pl-14 whitespace-pre-wrap">{com.content}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Reading tools</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setFontSize(size => Math.min(22, size + 1))} className="grid h-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900" aria-label="Increase font size"><Plus size={16} /></button>
                <button onClick={() => setFontSize(size => Math.max(16, size - 1))} className="grid h-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900" aria-label="Decrease font size"><Minus size={16} /></button>
                <button onClick={() => window.print()} className="grid h-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900" aria-label="Print article"><Printer size={16} /></button>
                <button onClick={() => setBookmarked(value => !value)} className={`grid h-10 place-items-center rounded-xl ${bookmarked ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900'}`} aria-label="Bookmark article"><Bookmark size={16} /></button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
              <button onClick={copyLink} className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-blue-600"><Copy size={14} />{copied ? 'Copied' : 'Copy link'}</button>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <a aria-label="Share on X" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} className="grid h-9 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900"><Twitter size={14} /></a>
                <a aria-label="Share on LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} className="grid h-9 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900"><Linkedin size={14} /></a>
                <button aria-label="Share article" onClick={() => navigator.share?.({ title: article.title, url: shareUrl })} className="grid h-9 place-items-center rounded-xl bg-slate-100 dark:bg-slate-900"><Share2 size={14} /></button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mx-auto mt-20 max-w-7xl border-t border-slate-200 px-5 pt-14 dark:border-slate-800">
        <h2 className="mb-7 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Recommended reading</h2>
        <div className="grid gap-5 md:grid-cols-3">{related.map(item => <a key={item.id} href={`/blog/${item.slug}`} className="group rounded-3xl border border-slate-200 p-5 dark:border-slate-800"><img src={item.image} alt="" width="400" height="225" loading="lazy" className="mb-5 aspect-video w-full rounded-2xl object-cover" /><p className="text-[10px] font-black uppercase tracking-wider text-blue-600">{item.category}</p><h3 className="mt-2 font-black leading-snug text-slate-950 group-hover:text-blue-600 dark:text-white">{item.title}</h3></a>)}</div>
      </section>
    </main>
  );
};

export default BlogDetail;
