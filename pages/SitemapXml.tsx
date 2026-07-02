import React, { useEffect, useState } from 'react';
import { getDynamicArticles } from '../src/data/blog';
import { supabase } from '../lib/supabase';
import { Download, Copy, Check, Globe, RefreshCw } from 'lucide-react';

const SitemapXml: React.FC = () => {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const generateSitemap = async () => {
    setLoading(true);
    const baseUrl = window.location.origin;
    const now = new Date().toISOString().split('T')[0];

    // Static core routes
    const staticRoutes = [
      { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { url: `${baseUrl}/domains`, priority: '0.9', changefreq: 'hourly' },
      { url: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
      { url: `${baseUrl}/services`, priority: '0.8', changefreq: 'weekly' },
      { url: `${baseUrl}/pricing`, priority: '0.8', changefreq: 'monthly' },
      { url: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' }
    ];

    // Fetch live articles
    let articles: any[] = getDynamicArticles();
    try {
      const { data } = await supabase.from('blog_articles').select('slug, updated_at, published_at, status').eq('status', 'published');
      if (data && data.length > 0) {
        articles = data;
      }
    } catch (err) {}

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${route.url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    });

    articles.forEach((art: any) => {
      const date = (art.updated_at || art.published_at || new Date().toISOString()).split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/blog/${art.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    setXmlContent(xml);
    setLoading(false);
  };

  useEffect(() => {
    generateSitemap();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 pt-28 pb-20 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Dynamic XML Sitemap Engine</h1>
              <p className="text-xs text-slate-400">Real-time sitemap feed generated from live Supabase articles & routes.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={generateSitemap}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-300 hover:bg-slate-800"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied XML' : 'Copy XML'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
            >
              <Download size={14} />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <span>Content-Type: application/xml; charset=UTF-8</span>
            <span>URLs indexed: {(xmlContent.match(/<url>/g) || []).length}</span>
          </div>
          <pre className="max-h-[650px] overflow-x-auto rounded-2xl bg-slate-950 p-6 font-mono text-xs leading-6 text-emerald-400 border border-slate-800/80">
            {loading ? 'Generating real-time sitemap...' : xmlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SitemapXml;
