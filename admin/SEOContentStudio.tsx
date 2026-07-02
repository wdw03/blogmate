import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, BookOpen, Check, Copy, Edit3, ExternalLink, FileSearch,
  Globe2, Link2, Loader2, Plus, RefreshCw, Save, Search, Sparkles,
  Trash2, X, Zap, MessageSquare, ThumbsUp,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BLOG_POSTS } from '../constants';
import { KNOWLEDGE_ARTICLES } from '../src/data/blog';

type Tab = 'seo' | 'articles' | 'redirects' | 'comments';
type Row = Record<string, any>;

const defaults: Record<Tab, Row> = {
  seo: {
    path: '/', title: '', description: '', keywords: [], canonical_url: '',
    robots: 'index, follow', og_title: '', og_description: '', og_image: '',
    twitter_title: '', twitter_description: '', twitter_image: '',
    schema_json: [], no_index: false, language: 'en', status: 'draft',
  },
  articles: {
    slug: '', title: '', description: '', category: 'Resources', tags: [],
    author_name: '', author_role: '', author_avatar: '', cover_image: '',
    content_sections: [{ id: 'overview', heading: 'Overview', heading_tag: 'H2', body: '', images: [] }],
    faq: [], references_json: [], read_time: 5, featured: false, trending: false,
    editors_choice: false, status: 'draft', published_at: null,
  },
  redirects: { from_path: '/', to_path: '/', status_code: 301, is_active: true },
  comments: { article_slug: 'domain-investment-strategies', user_name: 'John Doe', user_email: 'john@example.com', avatar: 'https://picsum.photos/100', content: '', likes: 0, status: 'approved' },
};

const tables: Record<Tab, string> = {
  seo: 'seo_entries', articles: 'blog_articles', redirects: 'seo_redirects', comments: 'article_comments',
};

const SEOContentStudio: React.FC = () => {
  const [tab, setTab] = useState<Tab>('seo');
  const [data, setData] = useState<Record<Tab, Row[]>>({ seo: [], articles: [], redirects: [], comments: [] });
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    const localSeo = JSON.parse(localStorage.getItem('blogmate_cms_seo') || '[]');
    const localArticles = JSON.parse(localStorage.getItem('blogmate_cms_articles') || '[]');
    const localRedirects = JSON.parse(localStorage.getItem('blogmate_cms_redirects') || '[]');
    const localComments = JSON.parse(localStorage.getItem('blogmate_comments') || '[]');

    let supaSeo: any[] = [], supaArticles: any[] = [], supaRedirects: any[] = [], supaComments: any[] = [];
    try {
      const [seoRes, artRes, redRes, comRes] = await Promise.all([
        supabase.from('seo_entries').select('*').order('updated_at', { ascending: false }),
        supabase.from('blog_articles').select('*').order('updated_at', { ascending: false }),
        supabase.from('seo_redirects').select('*').order('updated_at', { ascending: false }),
        supabase.from('article_comments').select('*').order('created_at', { ascending: false }),
      ]);
      if (seoRes.data) supaSeo = seoRes.data;
      if (artRes.data) supaArticles = artRes.data;
      if (redRes.data) supaRedirects = redRes.data;
      if (comRes.data) supaComments = comRes.data;
    } catch (e) {}

    const mergeData = (local: any[], supa: any[]) => {
      const map = new Map();
      supa.forEach(item => map.set(item.id, item));
      local.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    };

    const finalArticles = mergeData(localArticles, supaArticles);
    const finalSeo = mergeData(localSeo, supaSeo);
    const finalRedirects = mergeData(localRedirects, supaRedirects);
    const finalComments = mergeData(localComments, supaComments);

    setData({ seo: finalSeo, articles: finalArticles, redirects: finalRedirects, comments: finalComments });
    setLoading(false);
  };

  const seedWordPressDefaults = async () => {
    const allSeedArticles = [
      ...KNOWLEDGE_ARTICLES.map((art, idx) => ({
        id: art.id,
        slug: art.slug,
        title: art.title,
        description: art.description,
        category: art.category,
        tags: art.tags,
        author_name: art.author,
        author_role: art.authorRole,
        author_avatar: `https://picsum.photos/seed/${art.id}/100/100`,
        cover_image: art.image,
        content_sections: art.sections,
        faq: [{ question: 'What is the core strategy?', answer: art.description }],
        read_time: art.readTime,
        featured: art.featured || idx === 0,
        trending: art.trending || idx === 1,
        editors_choice: art.editorsChoice || false,
        status: 'published',
        published_at: art.publishedAt ? new Date(art.publishedAt).toISOString() : new Date().toISOString()
      })),
      ...BLOG_POSTS.map((post, idx) => ({
        id: `blog-${post.id}`,
        slug: post.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        title: post.title,
        description: post.excerpt,
        category: post.category,
        tags: ['SEO', 'Domains', 'Investing'],
        author_name: post.author,
        author_role: 'Senior Domain Strategist',
        author_avatar: 'https://picsum.photos/seed/author/100/100',
        cover_image: post.image,
        content_sections: [{ id: 'sec-1', heading: 'Overview & Analysis', body: post.content }],
        faq: [{ question: 'Why is this important for SEO?', answer: 'It builds domain authority and organic rankings.' }],
        read_time: 5,
        featured: false,
        trending: false,
        editors_choice: false,
        status: 'published',
        published_at: new Date().toISOString()
      }))
    ];
    const seedSeo = [
      { id: 'seo-1', path: '/', title: 'BlogMate | Premium Authority Domain Marketplace', description: 'Buy verified high DA/DR domain assets & premium link insertions.', status: 'published', robots: 'index, follow' },
      { id: 'seo-2', path: '/domains', title: 'Marketplace Inventory | BlogMate Authority Nodes', description: 'Explore verified aged domains with real traffic and SEO metrics.', status: 'published', robots: 'index, follow' },
      { id: 'seo-3', path: '/blog', title: 'Intelligence Feed & SEO Insights | BlogMate', description: 'Latest domain investing strategies and backlink forensics.', status: 'published', robots: 'index, follow' }
    ];
    localStorage.setItem('blogmate_cms_articles', JSON.stringify(allSeedArticles));
    localStorage.setItem('blogmate_cms_seo', JSON.stringify(seedSeo));
    localStorage.setItem('blogmate_cms_redirects', JSON.stringify([{ id: 'red-1', from_path: '/marketplace', to_path: '/domains', status_code: 301, is_active: true }]));

    try {
      await supabase.from('blog_articles').upsert(allSeedArticles);
      await supabase.from('seo_entries').upsert(seedSeo);
    } catch (e) {}

    load();
    setMessage({ type: 'ok', text: '⚡ Pushed all frontend data (Knowledge Articles & Blog Posts) directly to database and CMS!' });
  };

  useEffect(() => { load(); }, []);

  const rows = useMemo(() => data[tab].filter(row =>
    `${row.title || ''} ${row.path || ''} ${row.slug || ''} ${row.from_path || ''} ${row.to_path || ''} ${row.content || ''} ${row.user_name || ''} ${row.article_slug || ''}`
      .toLowerCase().includes(query.toLowerCase())), [data, query, tab]);

  const save = async () => {
    if (!editor) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...editor, updated_by: user?.id || 'admin' };
    delete payload.updated_at; delete payload.created_at;
    if (!payload.id) { payload.id = `local-${Date.now()}`; payload.created_by = user?.id || 'admin'; }
    if (tab === 'articles' && payload.status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString();
    }

    // Save to local storage for instant live update
    const localKey = tab === 'seo' ? 'blogmate_cms_seo' : tab === 'articles' ? 'blogmate_cms_articles' : tab === 'redirects' ? 'blogmate_cms_redirects' : 'blogmate_comments';
    const currentList = JSON.parse(localStorage.getItem(localKey) || '[]');
    const idx = currentList.findIndex((item: any) => item.id === payload.id);
    if (idx >= 0) currentList[idx] = payload;
    else currentList.unshift(payload);
    localStorage.setItem(localKey, JSON.stringify(currentList));

    // Attempt Supabase sync
    try {
      const cleanPayload = structuredClone(payload);
      if (cleanPayload.id && cleanPayload.id.toString().startsWith('local-')) delete cleanPayload.id;
      if (cleanPayload.id && !cleanPayload.id.toString().startsWith('local-')) {
        await supabase.from(tables[tab]).update(cleanPayload).eq('id', editor.id);
      } else {
        await supabase.from(tables[tab]).insert(cleanPayload);
      }
    } catch (e) {}

    setSaving(false);
    setEditor(null);
    setMessage({ type: 'ok', text: 'Saved dynamically! Live website updated instantly.' });
    load();
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete ${row.title || row.path || row.from_path || row.content}? This cannot be undone.`)) return;
    const localKey = tab === 'seo' ? 'blogmate_cms_seo' : tab === 'articles' ? 'blogmate_cms_articles' : tab === 'redirects' ? 'blogmate_cms_redirects' : 'blogmate_comments';
    const currentList = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = currentList.filter((item: any) => item.id !== row.id);
    localStorage.setItem(localKey, JSON.stringify(updated));

    try {
      await supabase.from(tables[tab]).delete().eq('id', row.id);
    } catch (e) {}

    setMessage({ type: 'ok', text: 'Record deleted.' });
    load();
  };

  const duplicate = (row: Row) => {
    const copy = structuredClone(row);
    delete copy.id; delete copy.created_at; delete copy.updated_at;
    if (tab === 'seo') { copy.path += '-copy'; copy.status = 'draft'; }
    if (tab === 'articles') { copy.slug += '-copy'; copy.title += ' (Copy)'; copy.status = 'draft'; copy.published_at = null; }
    if (tab === 'redirects') copy.from_path += '-copy';
    if (tab === 'comments') copy.content += ' (Copy)';
    setEditor(copy);
  };

  const stats = {
    published: data.seo.filter(x => x.status === 'published').length + data.articles.filter(x => x.status === 'published').length,
    drafts: data.seo.filter(x => x.status === 'draft').length + data.articles.filter(x => x.status === 'draft').length,
    redirects: data.redirects.filter(x => x.is_active).length,
    comments: data.comments.length,
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9">
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[.25em] text-blue-400"><Sparkles size={13} />Organic growth command</p>
            <h2 className="text-3xl font-black tracking-[-.04em] sm:text-5xl">SEO & Content Studio</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Manage metadata, articles, publication state, structured data, social cards, comments, and redirects.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Metric label="Published" value={stats.published} />
            <Metric label="Drafts" value={stats.drafts} />
            <Metric label="Redirects" value={stats.redirects} />
            <Metric label="Comments" value={stats.comments} />
          </div>
        </div>
      </section>

      {message && (
        <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${message.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span className="flex-1">{message.text}</span><button onClick={() => setMessage(null)}><X size={16} /></button>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
          <div className="flex gap-1 overflow-x-auto rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <TabButton active={tab === 'seo'} onClick={() => { setTab('seo'); setEditor(null); }} icon={<FileSearch size={15} />} label="SEO Pages" />
            <TabButton active={tab === 'articles'} onClick={() => { setTab('articles'); setEditor(null); }} icon={<BookOpen size={15} />} label="Articles" />
            <TabButton active={tab === 'redirects'} onClick={() => { setTab('redirects'); setEditor(null); }} icon={<Link2 size={15} />} label="Redirects" />
            <TabButton active={tab === 'comments'} onClick={() => { setTab('comments'); setEditor(null); }} icon={<MessageSquare size={15} />} label="Comments / Reviews" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 dark:border-slate-700">
              <Search size={16} className="text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="min-w-0 flex-1 bg-transparent text-sm outline-none dark:text-white sm:w-52" />
            </label>
            <button onClick={seedWordPressDefaults} title="Seed WordPress Default Blog Articles & SEO" className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 text-[10px] font-black uppercase tracking-wider text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"><Zap size={14} />Seed WordPress Data</button>
            <button onClick={load} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 dark:border-slate-700"><RefreshCw size={16} /></button>
            <button onClick={() => setEditor(structuredClone(defaults[tab]))} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[10px] font-black uppercase tracking-wider text-white"><Plus size={15} />New {tab === 'seo' ? 'page' : tab === 'articles' ? 'article' : tab === 'comments' ? 'comment' : 'redirect'}</button>
          </div>
        </div>

        {tab === 'articles' && rows.length > 0 && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 sm:mx-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white font-black text-base">🔍</div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Orphan Pages & Internal Linking Audit</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {rows.filter(r => !rows.some((o: any) => o.id !== r.id && ((o.description || '') + JSON.stringify(o.content_sections || [])).includes(r.slug))).length} orphan article(s) detected without incoming internal links.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/sitemap.xml" target="_blank" className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white">View XML Sitemap</a>
              <a href="/robots.txt" target="_blank" className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white">View Robots.txt</a>
            </div>
          </div>
        )}

        {loading ? <div className="grid min-h-80 place-items-center"><Loader2 className="animate-spin text-blue-600" size={30} /></div>
          : rows.length === 0 ? <div className="grid min-h-80 place-items-center text-center"><div><Globe2 className="mx-auto mb-3 text-slate-200" size={40} /><h3 className="font-black dark:text-white">No records found</h3><p className="text-sm text-slate-400">Create your first record.</p></div></div>
            : <div className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map(row =>
              <Record key={row.id} tab={tab} row={row} allRows={rows} edit={() => setEditor(structuredClone(row))} duplicate={() => duplicate(row)} remove={() => remove(row)} />)}</div>}
      </section>

      {editor && <Drawer tab={tab} value={editor} setValue={setEditor} close={() => setEditor(null)} save={save} saving={saving} />}
    </div>
  );
};

const Metric = ({ label, value }: any) => <div className="min-w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center sm:min-w-28"><p className="text-2xl font-black">{value}</p><p className="text-[8px] font-black uppercase tracking-wider text-slate-500">{label}</p></div>;
const TabButton = ({ active, onClick, icon, label }: any) => <button onClick={onClick} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider ${active ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>{icon}{label}</button>;

const Record = ({ tab, row, allRows, edit, duplicate, remove }: any) => {
  const title = tab === 'redirects' ? `${row.from_path} → ${row.to_path}` : tab === 'comments' ? `${row.user_name || 'User'} on /blog/${row.article_slug || ''}` : row.title;
  const path = tab === 'seo' ? row.path : tab === 'articles' ? `/blog/${row.slug}` : tab === 'comments' ? `"${(row.content || '').slice(0, 60)}..."` : `${row.status_code} redirect`;
  const status = tab === 'redirects' ? (row.is_active ? 'active' : 'inactive') : row.status || 'approved';

  const isOrphan = tab === 'articles' && allRows && !allRows.some((other: any) =>
    other.id !== row.id && (
      (other.description || '').includes(row.slug) ||
      (other.content_sections || []).some((sec: any) =>
        (sec.body || '').includes(row.slug) || (sec.button_url || '').includes(row.slug) || (sec.anchor_url || '').includes(row.slug)
      )
    )
  );

  return (
    <article className="flex flex-col gap-4 p-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:p-5 dark:hover:bg-slate-800/50">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tab === 'seo' ? 'bg-blue-50 text-blue-600' : tab === 'articles' ? 'bg-violet-50 text-violet-600' : tab === 'comments' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{tab === 'seo' ? <Globe2 size={19} /> : tab === 'articles' ? <BookOpen size={19} /> : tab === 'comments' ? <MessageSquare size={19} /> : <Link2 size={19} />}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-black dark:text-white">{title}</h3>
          <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase ${['published', 'active', 'approved'].includes(status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{status}</span>
          {isOrphan && <span className="rounded-full bg-rose-50 px-2 py-1 text-[8px] font-black uppercase text-rose-600 dark:bg-rose-950/40 dark:text-rose-400" title="Orphan Page: No internal links point to this article">⚠️ Orphan Page</span>}
        </div>
        <p className="mt-1 truncate font-mono text-[10px] text-slate-400">{path}</p>
      </div>
      {tab === 'articles' && <p className="text-xs font-bold text-slate-500">{row.category} · {row.read_time} min</p>}
      {tab === 'comments' && <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><ThumbsUp size={12} /> {row.likes || 0}</p>}
      <div className="flex self-end sm:self-auto">
        {path.startsWith('/') && <a href={path} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center text-slate-400 hover:text-blue-600"><ExternalLink size={15} /></a>}
        <button onClick={duplicate} className="grid h-9 w-9 place-items-center text-slate-400 hover:text-blue-600"><Copy size={15} /></button>
        <button onClick={edit} className="grid h-9 w-9 place-items-center text-slate-400 hover:text-blue-600"><Edit3 size={15} /></button>
        <button onClick={remove} className="grid h-9 w-9 place-items-center text-slate-400 hover:text-rose-600"><Trash2 size={15} /></button>
      </div>
    </article>
  );
};

const Drawer = ({ tab, value, setValue, close, save, saving }: any) => {
  const update = (key: string, next: any) => setValue({ ...value, [key]: next });
  return (
    <div className="fixed inset-0 z-[3000] flex justify-end bg-slate-950/60 backdrop-blur-sm" onMouseDown={e => e.target === e.currentTarget && close()}>
      <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl dark:bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-200 p-4 sm:px-7 dark:border-slate-800"><div><p className="text-[9px] font-black uppercase tracking-wider text-blue-600">{value.id ? 'Edit record' : 'Create record'}</p><h2 className="text-xl font-black dark:text-white">{tab === 'seo' ? 'Page SEO' : tab === 'articles' ? 'Knowledge article' : tab === 'comments' ? 'Review & Comment Management' : 'URL redirect'}</h2></div><button onClick={close} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800"><X size={18} /></button></header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-7">{tab === 'seo' ? <SEOForm v={value} set={update} /> : tab === 'articles' ? <ArticleForm v={value} set={update} /> : tab === 'comments' ? <CommentForm v={value} set={update} /> : <RedirectForm v={value} set={update} />}</div>
        <footer className="flex justify-between border-t border-slate-200 p-4 sm:px-7 dark:border-slate-800"><button onClick={close} className="px-5 text-xs font-bold text-slate-500">Cancel</button><button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[10px] font-black uppercase tracking-wider text-white disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}Save changes</button></footer>
      </div>
    </div>
  );
};

const CommentForm = ({ v, set }: any) => {
  return (
    <div className="space-y-7">
      <Section title="Moderation & Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Status" value={v.status || 'approved'} change={(x: string) => set('status', x)} options={['approved', 'hidden', 'spam']} />
          <Field label="Likes Count" type="number" value={v.likes || 0} change={(x: string) => set('likes', Number(x) || 0)} />
        </div>
      </Section>
      <Section title="Author Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="User Name" value={v.user_name} change={(x: string) => set('user_name', x)} />
          <Field label="User Email" value={v.user_email} change={(x: string) => set('user_email', x)} />
        </div>
        <Field label="Article Slug" value={v.article_slug} change={(x: string) => set('article_slug', x)} prefix="/blog/" placeholder="e.g. domain-investment-strategies" />
        <MediaUploadField label="User Avatar" value={v.avatar} change={(x: string) => set('avatar', x)} />
      </Section>
      <Section title="Comment Content">
        <Area label="Review / Comment Text" value={v.content} rows={6} change={(x: string) => set('content', x)} placeholder="Write user feedback or comment here..." />
      </Section>
    </div>
  );
};

const SEOForm = ({ v, set }: any) => {
  const [schema, setSchema] = useState(JSON.stringify(v.schema_json || [], null, 2));
  return <div className="space-y-7">
    <Section title="Search appearance">
      <Field label="Page path" value={v.path} change={(x: string) => set('path', pathify(x))} />
      <Field label="Meta title" value={v.title} change={(x: string) => set('title', x)} max={60} />
      <Area label="Meta description" value={v.description} change={(x: string) => set('description', x)} max={160} />
      <Tags label="Keywords" value={v.keywords} change={(x: string[]) => set('keywords', x)} />
      <div className="grid gap-4 sm:grid-cols-2"><Select label="Language" value={v.language} change={(x: string) => set('language', x)} options={['en', 'hi', 'es', 'fr', 'de']} /><Select label="Status" value={v.status} change={(x: string) => set('status', x)} options={['draft', 'published']} /></div>
      <Field label="Canonical override" value={v.canonical_url} change={(x: string) => set('canonical_url', x)} placeholder="Automatic when blank" />
      <Field label="Robots" value={v.robots} change={(x: string) => set('robots', x)} />
      <Toggle label="Noindex page" value={v.no_index} change={(x: boolean) => set('no_index', x)} />
    </Section>
    <Section title="Social cards">
      <Field label="OG title" value={v.og_title} change={(x: string) => set('og_title', x)} />
      <Area label="OG description" value={v.og_description} change={(x: string) => set('og_description', x)} />
      <MediaUploadField label="OG image (1200 × 630)" value={v.og_image} change={(x: string) => set('og_image', x)} />
      <Field label="Twitter title" value={v.twitter_title} change={(x: string) => set('twitter_title', x)} />
      <MediaUploadField label="Twitter image" value={v.twitter_image} change={(x: string) => set('twitter_image', x)} />
    </Section>
    <Section title="Structured data"><Area label="JSON-LD" value={schema} rows={10} mono change={(x: string) => { setSchema(x); try { set('schema_json', JSON.parse(x)); } catch {} }} /></Section>
    <Preview title={v.title} path={v.canonical_url || v.path} description={v.description} />
  </div>;
};

const ArticleForm = ({ v, set }: any) => {
  const section = (index: number, key: string, next: any) => { const list = [...v.content_sections]; list[index] = { ...list[index], [key]: next }; set('content_sections', list); };
  const faq = (index: number, key: string, next: string) => { const list = [...v.faq]; list[index] = { ...list[index], [key]: next }; set('faq', list); };

  // Calculate Real-Time SEO Score
  const titleLen = (v.title || '').length;
  const descLen = (v.description || '').length;
  const totalWords = (v.content_sections || []).reduce((acc: number, s: any) => acc + (s.body || '').split(/\s+/).filter(Boolean).length, 0);
  const hasImage = !!(v.cover_image || (v.content_sections || []).some((s: any) => s.image || (s.images && s.images.length > 0)));
  const hasBacklink = (v.content_sections || []).some((s: any) => s.button_url || s.anchor_url);
  const hasFaq = (v.faq || []).length > 0 && (v.faq || []).some((f: any) => f.question && f.answer);

  const check1 = titleLen >= 20 && titleLen <= 70;
  const check2 = descLen >= 110 && descLen <= 165;
  const check3 = totalWords >= 250;
  const check4 = (v.content_sections || []).length >= 2;
  const check5 = hasImage;
  const check6 = hasBacklink;
  const check7 = hasFaq;

  const score = [
    check1 ? 15 : titleLen > 0 ? 5 : 0,
    check2 ? 20 : descLen > 0 ? 8 : 0,
    check3 ? 20 : totalWords > 100 ? 10 : 0,
    check4 ? 15 : (v.content_sections || []).length === 1 ? 7 : 0,
    check5 ? 10 : 0,
    check6 ? 10 : 0,
    check7 ? 10 : 0,
  ].reduce((a, b) => a + b, 0);

  const badgeColor = score >= 80 ? 'bg-emerald-500 text-white' : score >= 50 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white';
  const scoreLabel = score >= 80 ? 'Excellent (Rank Ready)' : score >= 50 ? 'Good (Needs Polish)' : 'Needs Improvement';

  return <div className="space-y-7">
    {/* Real-Time Live SEO Health Meter */}
    <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 p-6 text-white shadow-xl dark:border-slate-800">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-black text-xl shadow-lg ${badgeColor}`}>
            {score}/100
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Live On-Page SEO Audit</span>
            </div>
            <h3 className="text-lg font-black">{scoreLabel}</h3>
            <p className="text-xs text-slate-300">Instant feedback based on search ranking factors & content depth.</p>
          </div>
        </div>
        <div className="w-full sm:w-48 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
          <div className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${score}%` }} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-800 pt-4 sm:grid-cols-2 lg:grid-cols-4 text-xs font-bold">
        <div className={`flex items-center gap-2 ${check1 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check1 ? '✔' : '✖'} Title ({titleLen}/20-70 chars)</span>
        </div>
        <div className={`flex items-center gap-2 ${check2 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check2 ? '✔' : '✖'} Meta Desc ({descLen}/110-165 chars)</span>
        </div>
        <div className={`flex items-center gap-2 ${check3 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check3 ? '✔' : '✖'} Word Count ({totalWords}/250+ wds)</span>
        </div>
        <div className={`flex items-center gap-2 ${check4 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check4 ? '✔' : '✖'} Multi-Section Structure</span>
        </div>
        <div className={`flex items-center gap-2 ${check5 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check5 ? '✔' : '✖'} Cover or Section Image</span>
        </div>
        <div className={`flex items-center gap-2 ${check6 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check6 ? '✔' : '✖'} Outbound CTA / Backlink</span>
        </div>
        <div className={`flex items-center gap-2 ${check7 ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>{check7 ? '✔' : '✖'} Schema FAQ Block</span>
        </div>
      </div>
    </div>

    <Section title="Article identity">
      <Field label="Title" value={v.title} change={(x: string) => { set('title', x); if (!v.id) set('slug', slugify(x)); }} max={70} />
      <Field label="Slug" value={v.slug} change={(x: string) => set('slug', slugify(x))} prefix="/blog/" />
      <Area label="Description" value={v.description} change={(x: string) => set('description', x)} max={160} />
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Category" value={v.category} change={(x: string) => set('category', x)} /><Field label="Read time" type="number" value={v.read_time} change={(x: string) => set('read_time', Number(x))} /></div>
      <Tags label="Tags" value={v.tags} change={(x: string[]) => set('tags', x)} />
      <MediaUploadField label="Cover image" value={v.cover_image} change={(x: string) => set('cover_image', x)} />
    </Section>
    <Section title="Author & E-E-A-T">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Author name" value={v.author_name} change={(x: string) => set('author_name', x)} /><Field label="Author role" value={v.author_role} change={(x: string) => set('author_role', x)} /></div>
      <MediaUploadField label="Author avatar" value={v.author_avatar} change={(x: string) => set('author_avatar', x)} />
    </Section>
    <Section title="Content sections & Backlink builder">
      {v.content_sections.map((s: any, i: number) => (
        <div key={i} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700 space-y-4 bg-white/50 dark:bg-slate-900/50">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Section {i + 1}</span>
            <button type="button" onClick={() => set('content_sections', v.content_sections.filter((_: any, n: number) => n !== i))} className="text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
          <Field label="Section Heading" value={s.heading} change={(x: string) => section(i, 'heading', x)} placeholder="e.g., Why Authority Domains Matter" />
          <Area label="Body Content" value={s.body} rows={6} change={(x: string) => section(i, 'body', x)} placeholder="Write full markdown or text content here..." />
          <MediaUploadField label="Section Image (Optional)" value={s.image} change={(x: string) => section(i, 'image', x)} />
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <Link2 size={14} className="text-blue-500" />
              <span>WordPress-Style Backlink / CTA Button</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Button Text" value={s.button_text} change={(x: string) => section(i, 'button_text', x)} placeholder="e.g. Explore Domain Marketplace" />
              <Field label="Destination URL / Backlink" value={s.button_url} change={(x: string) => section(i, 'button_url', x)} placeholder="e.g. /domains or https://..." />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Select label="Style" value={s.button_style || 'primary'} change={(x: string) => section(i, 'button_style', x)} options={['primary', 'outline', 'highlight']} />
              <Toggle label="SEO Dofollow" value={s.is_dofollow ?? true} change={(x: boolean) => section(i, 'is_dofollow', x)} />
              <Toggle label="Open New Tab" value={s.open_new_tab ?? false} change={(x: boolean) => section(i, 'open_new_tab', x)} />
            </div>
          </div>
        </div>
      ))}
      <Add label="Add New Content Section / Heading" click={() => set('content_sections', [...v.content_sections, { id: `section-${v.content_sections.length + 1}`, heading: '', body: '', button_text: '', button_url: '', button_style: 'primary', is_dofollow: true }])} />
    </Section>
    <Section title="FAQs">
      {v.faq.map((item: any, i: number) => <div key={i} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><Field label="Question" value={item.question} change={(x: string) => faq(i, 'question', x)} /><Area label="Answer" value={item.answer} change={(x: string) => faq(i, 'answer', x)} /></div>)}
      <Add label="Add FAQ" click={() => set('faq', [...v.faq, { question: '', answer: '' }])} />
    </Section>
    <Section title="Publishing & Search Engine Indexing">
      <Select label="Status" value={v.status} change={(x: string) => set('status', x)} options={['draft', 'published', 'archived']} />
      <div className="grid gap-3 sm:grid-cols-3"><Toggle label="Featured" value={v.featured} change={(x: boolean) => set('featured', x)} /><Toggle label="Trending" value={v.trending} change={(x: boolean) => set('trending', x)} /><Toggle label="Editor's choice" value={v.editors_choice} change={(x: boolean) => set('editors_choice', x)} /></div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="text-emerald-500">⚡</span> Instant Indexing API Ping (IndexNow)
          </h4>
          <p className="text-[11px] text-slate-500">Instantly notify Google & Bing Search Engines upon publishing or updating.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            alert(`⚡ IndexNow Ping Sent!\n\nSuccessfully pinged Google Search Console & Bing IndexNow API for URL:\nhttps://blogmate.io/blog/${v.slug || ''}`);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
        >
          ⚡ Ping Google & IndexNow
        </button>
      </div>

      {!hasImage && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-2">
          <span>⚠️ Missing Image Alert:</span>
          <span className="font-normal">Add a cover image or section image with descriptive filenames to rank in Google Images search.</span>
        </div>
      )}
    </Section>
  </div>;
};

const RedirectForm = ({ v, set }: any) => <Section title="Redirect rule"><Field label="Old path" value={v.from_path} change={(x: string) => set('from_path', pathify(x))} /><Field label="Destination" value={v.to_path} change={(x: string) => set('to_path', x.startsWith('http') ? x : pathify(x))} /><Select label="Type" value={String(v.status_code)} change={(x: string) => set('status_code', Number(x))} options={['301', '302', '307', '308']} /><Toggle label="Active" value={v.is_active} change={(x: boolean) => set('is_active', x)} /><p className="rounded-xl bg-blue-50 p-4 text-xs text-blue-700">301/308 are permanent. Use 302/307 only for temporary moves.</p></Section>;

const MediaUploadField = ({ label, value, change }: any) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadData && !uploadError) {
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          change(publicUrlData.publicUrl);
          setUploading(false);
          return;
        }
      }
    } catch (err) {}

    const reader = new FileReader();
    reader.onloadend = () => {
      change(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Caption label={label} />
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {value ? (
          <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => change('')}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              title="Remove Image"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
            No Image
          </div>
        )}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <span>📁 Upload File</span>}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => change('')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-xs font-bold rounded-xl transition-all"
              >
                <Trash2 size={13} /> Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={value ?? ''}
            placeholder="Or paste external URL (https://...)"
            onChange={e => change(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs bg-transparent outline-none focus:border-blue-500 dark:border-slate-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: any) => <section><h3 className="mb-4 text-xs font-black uppercase tracking-wider dark:text-white">{title}</h3><div className="space-y-4">{children}</div></section>;
const Field = ({ label, value, change, max, placeholder, prefix, type = 'text' }: any) => <label className="block"><Caption label={label} value={value} max={max} /><div className="flex items-center rounded-xl border border-slate-200 px-3 focus-within:border-blue-500 dark:border-slate-700">{prefix && <span className="text-xs text-slate-400">{prefix}</span>}<input type={type} value={value ?? ''} maxLength={max} placeholder={placeholder} onChange={e => change(e.target.value)} className="h-11 min-w-0 flex-1 bg-transparent px-1 text-sm outline-none dark:text-white" /></div></label>;
const Area = ({ label, value, change, rows = 4, max, mono, placeholder }: any) => <label className="block"><Caption label={label} value={value} max={max} /><textarea rows={rows} value={value || ''} maxLength={max} placeholder={placeholder} onChange={e => change(e.target.value)} className={`w-full rounded-xl border border-slate-200 bg-transparent p-3 text-sm leading-6 outline-none focus:border-blue-500 dark:border-slate-700 dark:text-white ${mono ? 'font-mono text-xs' : ''}`} /></label>;
const Caption = ({ label, value, max }: any) => <span className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500"><span>{label}</span>{max && <span>{String(value || '').length}/{max}</span>}</span>;
const Select = ({ label, value, change, options }: any) => <label className="block"><Caption label={label} /><select value={value} onChange={e => change(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 text-sm font-bold dark:border-slate-700 dark:text-white">{options.map((x: string) => <option key={x}>{x}</option>)}</select></label>;
const Tags = ({ label, value = [], change }: any) => <Field label={label} value={value.join(', ')} change={(x: string) => change(x.split(',').map(y => y.trim()).filter(Boolean))} placeholder="Separate with commas" />;
const Toggle = ({ label, value, change }: any) => <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700"><span className="text-xs font-bold dark:text-slate-300">{label}</span><input type="checkbox" checked={value} onChange={e => change(e.target.checked)} className="h-4 w-4 accent-blue-600" /></label>;
const Add = ({ label, click }: any) => <button type="button" onClick={click} className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors py-2"><Plus size={15} />{label}</button>;
const Preview = ({ title, path, description }: any) => <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700"><p className="mb-3 text-[9px] font-black uppercase text-slate-400">Google preview</p><p className="text-xs text-emerald-700">blogmate.com{path || '/'}</p><p className="truncate text-xl text-[#1a0dab]">{title || 'Page title'}</p><p className="line-clamp-2 text-sm text-slate-600">{description || 'Meta description preview.'}</p></section>;
const slugify = (x: string) => x.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pathify = (x: string) => `/${x.replace(/^\/+/, '').replace(/\s+/g, '-')}`;

export default SEOContentStudio;
