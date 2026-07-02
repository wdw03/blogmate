import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xnloveaollypxurdschq.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XahWpgpMtZC7p336jQP1Nw_OA-LfF1P';

const supabase = createClient(supabaseUrl, supabaseKey);

const KNOWLEDGE_ARTICLES = [
  {
    id: "domain-investment-strategies",
    slug: "domain-investment-strategies",
    title: "Domain Investment Strategies for 2026",
    description: "Learn actionable strategies for acquiring, holding, and monetizing digital real estate.",
    category: "Investment",
    tags: ["Domains", "Strategy", "Investment", "2026"],
    author: "Elena Rostova",
    authorRole: "Principal Domain Broker",
    readTime: 7,
    featured: true,
    trending: true,
    sections: [
      {
        id: "market-shift",
        heading: "The Shift Toward Niche Authority Nodes",
        heading_tag: "H2",
        body: "Modern domain investing is less about speculative dot-com squatting and more about acquiring aged authority domains with established backlink profiles. Search engines prioritize topical E-E-A-T, making aged domain nodes prime digital assets."
      },
      {
        id: "valuation-metrics",
        heading: "Key Valuation Metrics",
        heading_tag: "H3",
        body: "When evaluating a domain in 2026, look closely at Referring Domains (RD), historical anchor text distribution, trademark cleanliness, and age. A domain with clean authority metrics can jumpstart organic traffic by months or years."
      }
    ]
  },
  {
    id: "seo-backlink-forensics",
    heading: "SEO Backlink Forensics Guide",
    slug: "seo-backlink-forensics",
    title: "How to Audit High-DR Domains Before Buying",
    description: "Step-by-step framework to uncover toxic links, PBN spam, and artificial authority inflations.",
    category: "SEO Forensics",
    tags: ["SEO", "Backlinks", "Audit", "Due Diligence"],
    author: "Marcus Vance",
    authorRole: "Head of SEO Intelligence",
    readTime: 10,
    featured: false,
    trending: true,
    sections: [
      {
        id: "spotting-pbn",
        heading: "Spotting Sophisticated PBN Networks",
        heading_tag: "H2",
        body: "Private Blog Networks (PBNs) have evolved. Look for IP clustering, synchronized registration dates, and artificial anchor text velocity."
      }
    ]
  }
];

const seedArticles = KNOWLEDGE_ARTICLES.map((art, idx) => ({
  id: art.id,
  slug: art.slug,
  title: art.title,
  description: art.description,
  category: art.category,
  tags: art.tags,
  author_name: art.author,
  author_role: art.authorRole,
  author_avatar: `https://picsum.photos/seed/${art.id}/100/100`,
  cover_image: `https://picsum.photos/seed/${art.id}-cover/800/450`,
  content_sections: art.sections,
  faq: [{ question: 'What is the core strategy?', answer: art.description }],
  read_time: art.readTime,
  featured: art.featured || idx === 0,
  trending: art.trending || idx === 1,
  editors_choice: false,
  status: 'published',
  published_at: new Date().toISOString()
}));

const seedSeo = [
  { id: 'seo-1', path: '/', title: 'BlogMate | Premium Authority Domain Marketplace', description: 'Buy verified high DA/DR domain assets & premium link insertions.', status: 'published', robots: 'index, follow' },
  { id: 'seo-2', path: '/domains', title: 'Marketplace Inventory | BlogMate Authority Nodes', description: 'Explore verified aged domains with real traffic and SEO metrics.', status: 'published', robots: 'index, follow' },
  { id: 'seo-3', path: '/blog', title: 'Intelligence Feed & SEO Insights | BlogMate', description: 'Latest domain investing strategies and backlink forensics.', status: 'published', robots: 'index, follow' }
];

const seedRedirects = [
  { id: 'red-1', from_path: '/marketplace', to_path: '/domains', status_code: 301, is_active: true }
];

const seedComments = [
  { id: 'com-1', article_slug: 'domain-investment-strategies', user_name: 'John Doe', user_email: 'john@example.com', avatar: 'https://picsum.photos/100', content: 'This domain valuation guide is spot on! Looking forward to applying these metrics.', likes: 5, status: 'approved' },
  { id: 'com-2', article_slug: 'seo-backlink-forensics', user_name: 'Sarah Jenkins', user_email: 'sarah@example.com', avatar: 'https://picsum.photos/101', content: 'Great insights on spotting modern PBN networks.', likes: 3, status: 'approved' }
];

async function runPush() {
  console.log('⚡ Pushing dynamic records to Supabase Database...');
  
  const { error: artErr } = await supabase.from('blog_articles').upsert(seedArticles);
  if (artErr) console.error('Articles Error:', artErr.message);
  else console.log('✅ Pushed blog_articles successfully!');

  const { error: seoErr } = await supabase.from('seo_entries').upsert(seedSeo);
  if (seoErr) console.error('SEO Error:', seoErr.message);
  else console.log('✅ Pushed seo_entries successfully!');

  const { error: redErr } = await supabase.from('seo_redirects').upsert(seedRedirects);
  if (redErr) console.error('Redirects Error:', redErr.message);
  else console.log('✅ Pushed seo_redirects successfully!');

  const { error: comErr } = await supabase.from('article_comments').upsert(seedComments);
  if (comErr) console.error('Comments Error:', comErr.message);
  else console.log('✅ Pushed article_comments successfully!');

  console.log('🎉 Done! All data dynamically pushed.');
}

runPush();
