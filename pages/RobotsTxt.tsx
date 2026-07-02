import React, { useState } from 'react';
import { Download, Copy, Check, ShieldCheck } from 'lucide-react';

const RobotsTxt: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;

  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /profile
Disallow: /login
Disallow: /signup

# Crawl-delay for polite scraping
Crawl-delay: 2

# XML Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-5 pt-28 pb-20 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Search Engine Crawler Rules (robots.txt)</h1>
              <p className="text-xs text-slate-400">Manage crawler directives, disallowed paths, and sitemap reference.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-slate-300 hover:bg-slate-800"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
            >
              <Download size={14} />
              <span>Download robots.txt</span>
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
          <div className="mb-4 text-xs text-slate-400">Content-Type: text/plain; charset=UTF-8</div>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-6 font-mono text-sm leading-7 text-amber-400 border border-slate-800/80">
            {robotsContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RobotsTxt;
