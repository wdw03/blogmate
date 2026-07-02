export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  image: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  featured?: boolean;
  trending?: boolean;
  editorsChoice?: boolean;
  sections: Array<{ id: string; heading: string; body: string }>;
}

const commonSections = (subject: string) => [
  {
    id: 'overview',
    heading: `What matters most in ${subject}`,
    body: `Strong decisions start with reliable evidence. This guide separates useful signals from vanity metrics and shows how to turn research into a repeatable workflow.`,
  },
  {
    id: 'framework',
    heading: 'A practical evaluation framework',
    body: 'Start with intent, validate the underlying data, compare multiple sources, and document assumptions. Prioritize durable value over short-term movement and review the result after implementation.',
  },
  {
    id: 'best-practices',
    heading: 'Best practices and common mistakes',
    body: 'Avoid isolated metrics, undocumented changes, and conclusions drawn from tiny samples. Use clear ownership, measurable outcomes, and a review cadence that keeps the strategy current.',
  },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'react-seo-guide',
    slug: 'react-seo-guide',
    title: 'React SEO: The Production Guide for Modern SPAs',
    description: 'A practical technical SEO framework for React applications, including metadata, structured data, rendering, performance, and measurement.',
    category: 'SEO Tips',
    tags: ['React', 'Technical SEO', 'Schema'],
    author: 'Sarah Chen',
    authorRole: 'Technical SEO Lead',
    image: 'https://picsum.photos/seed/react-seo/1200/675',
    publishedAt: '2026-05-12',
    updatedAt: '2026-06-28',
    readTime: 11,
    views: 18420,
    likes: 842,
    comments: 36,
    featured: true,
    trending: true,
    editorsChoice: true,
    sections: commonSections('React SEO'),
  },
  {
    id: 'domain-investing-guide',
    slug: 'domain-investing-guide',
    title: 'Domain Investing: An Evidence-First Buying Guide',
    description: 'Learn how to evaluate domain quality, demand, history, risk, and resale potential before committing capital.',
    category: 'Domain Investing',
    tags: ['Domains', 'Buying Guide', 'Due Diligence'],
    author: 'Marcus Wright',
    authorRole: 'Domain Research Director',
    image: 'https://picsum.photos/seed/domain-investing/1200/675',
    publishedAt: '2026-04-18',
    updatedAt: '2026-06-25',
    readTime: 14,
    views: 15310,
    likes: 691,
    comments: 52,
    featured: true,
    editorsChoice: true,
    sections: commonSections('domain investing'),
  },
  {
    id: 'high-da-backlinks',
    slug: 'high-da-backlinks',
    title: 'High-Authority Backlinks Without the Vanity Metrics',
    description: 'A risk-aware playbook for assessing relevance, traffic quality, editorial standards, and link value.',
    category: 'Backlinks',
    tags: ['Backlinks', 'Authority', 'Outreach'],
    author: 'Elena Rostova',
    authorRole: 'Off-Page Strategy Editor',
    image: 'https://picsum.photos/seed/backlinks-guide/1200/675',
    publishedAt: '2026-05-30',
    updatedAt: '2026-06-30',
    readTime: 9,
    views: 12780,
    likes: 504,
    comments: 28,
    trending: true,
    sections: commonSections('backlink evaluation'),
  },
  {
    id: 'ai-search-content',
    slug: 'ai-search-content',
    title: 'Creating Useful Content for AI Search Experiences',
    description: 'Build source-worthy content with information gain, clear entities, expert review, and structured answers.',
    category: 'AI SEO',
    tags: ['AI SEO', 'Content', 'E-E-A-T'],
    author: 'Alex Rivera',
    authorRole: 'Editorial Strategy Lead',
    image: 'https://picsum.photos/seed/ai-search/1200/675',
    publishedAt: '2026-06-10',
    updatedAt: '2026-07-01',
    readTime: 8,
    views: 10880,
    likes: 477,
    comments: 19,
    trending: true,
    sections: commonSections('AI search content'),
  },
  {
    id: 'expired-domain-audit',
    slug: 'expired-domain-audit',
    title: 'The 20-Minute Expired Domain Audit',
    description: 'A repeatable checklist for history, links, topical alignment, indexation signals, and trademark risk.',
    category: 'Tutorials',
    tags: ['Expired Domains', 'Audit', 'Checklist'],
    author: 'David Vance',
    authorRole: 'Marketplace Analyst',
    image: 'https://picsum.photos/seed/expired-audit/1200/675',
    publishedAt: '2026-03-22',
    updatedAt: '2026-06-20',
    readTime: 7,
    views: 8940,
    likes: 386,
    comments: 17,
    sections: commonSections('expired domain auditing'),
  },
  {
    id: 'seo-reporting-template',
    slug: 'seo-reporting-template',
    title: 'A Decision-Ready SEO Reporting Template',
    description: 'Replace noisy dashboards with a concise report that connects visibility, business outcomes, and next actions.',
    category: 'Templates',
    tags: ['Reporting', 'Template', 'Analytics'],
    author: 'Sarah Chen',
    authorRole: 'Technical SEO Lead',
    image: 'https://picsum.photos/seed/seo-reporting/1200/675',
    publishedAt: '2026-02-14',
    updatedAt: '2026-06-14',
    readTime: 6,
    views: 7420,
    likes: 298,
    comments: 12,
    sections: commonSections('SEO reporting'),
  },
];

export const BLOG_CATEGORIES = [
  'All', 'SEO Tips', 'Domain Investing', 'Backlinks', 'AI SEO', 'Buying Guides',
  'Case Studies', 'Digital Marketing', 'News', 'Tutorials', 'Best Practices',
  'Glossary', 'Resources', 'Free Tools', 'Templates', 'Whitepapers',
];

export const getDynamicArticles = (): KnowledgeArticle[] => {
  try {
    const local = JSON.parse(localStorage.getItem('blogmate_cms_articles') || '[]');
    if (Array.isArray(local) && local.length > 0) {
      const formatted: KnowledgeArticle[] = local
        .filter((x: any) => x.status === 'published')
        .map((x: any) => ({
          id: x.id || x.slug,
          slug: x.slug || x.id,
          title: x.title || 'Untitled Article',
          description: x.description || '',
          category: x.category || 'SEO Tips',
          tags: Array.isArray(x.tags) ? x.tags : ['SEO'],
          author: x.author_name || 'Admin',
          authorRole: x.author_role || 'Strategist',
          image: x.cover_image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
          publishedAt: x.published_at ? x.published_at.slice(0, 10) : '2026-07-02',
          updatedAt: '2026-07-02',
          readTime: x.read_time || 5,
          views: 1250,
          likes: 92,
          comments: 8,
          featured: x.featured,
          trending: x.trending,
          editorsChoice: x.editors_choice,
          sections: Array.isArray(x.content_sections) && x.content_sections.length > 0
            ? x.content_sections
            : [{ id: 'sec-1', heading: 'Overview', body: x.description || '' }]
        }));
      if (formatted.length > 0) return formatted;
    }
  } catch (e) {}
  return KNOWLEDGE_ARTICLES;
};

export const findArticle = (slug: string) =>
  getDynamicArticles().find((article) => article.slug === slug || article.id === slug);

