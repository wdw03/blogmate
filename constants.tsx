
import React from 'react';
import { Shield, BarChart3, Globe, Search, Zap, CheckCircle2, FileSearch, Link } from 'lucide-react';
import { BlogPost, ServiceCardProps } from './types';

export const SERVICES: ServiceCardProps[] = [
  {
    title: 'Domain Intelligence',
    description: 'Deep dive into historical ownership, DNS changes, and risk assessments.',
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    link: '/services/intel'
  },
  {
    title: 'SEO Analysis',
    description: 'Comprehensive backlink profiles, domain authority, and trust flow metrics.',
    icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
    link: '/services/seo'
  },
  {
    title: 'Link Insertion',
    description: 'Secure sponsored posts and natural link placements on high-authority domains.',
    icon: <Link className="w-6 h-6 text-indigo-600" />,
    link: '/services/links'
  },
  {
    title: 'Website Audit',
    description: 'Technical SEO audits and content performance evaluations for digital assets.',
    icon: <FileSearch className="w-6 h-6 text-amber-600" />,
    link: '/services/audit'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Domain Investing in 2025',
    category: 'Buying Guide',
    excerpt: 'Discover why high-value TLDs are outperforming traditional assets in the digital economy.',
    image: 'https://picsum.photos/seed/domain1/800/600',
    author: 'Sarah Chen',
    date: 'Oct 12, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Satius est vitae procul a vitiis. Duo Reges: constructio interrete. Quid enim est a Chrysippo praetermissum in Stoicis?'
  },
  {
    id: '2',
    title: 'How to Detect "Toxic" Backlinks Before Buying',
    category: 'SEO',
    excerpt: 'Protect your investment by learning how to spot manipulated metrics and PBN history.',
    image: 'https://picsum.photos/seed/seo1/800/600',
    author: 'Marcus Wright',
    date: 'Oct 15, 2024',
    content: 'Nam quibus rebus efficiuntur voluptates, eae non sunt in potestate sapientis. Neque enim civitas in seditione beata esse potest nec in discordia dominorum.'
  },
  {
    id: '3',
    title: 'Securing Your Digital Portfolio: A Checklist',
    category: 'Security',
    excerpt: 'Essential steps to prevent unauthorized domain transfers and DNS hijacking.',
    image: 'https://picsum.photos/seed/security1/800/600',
    author: 'Alex Rivera',
    date: 'Oct 18, 2024',
    content: 'In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Ad eas enim res, quae quondam erant revera istae, nunc tantum.'
  },
  {
    id: '4',
    title: 'Maximizing ROI with Expired Domain Acquisitions',
    category: 'Monetization',
    excerpt: 'Unlock the hidden equity in aged domains with existing authority and natural backlink profiles.',
    image: 'https://picsum.photos/seed/domaingrowth/800/600',
    author: 'David Vance',
    date: 'Oct 21, 2024',
    content: 'Expired domains present a unique opportunity to bootstrap digital growth. By acquiring established authority nodes, businesses bypass the sandbox phase.'
  },
  {
    id: '5',
    title: 'AI Content vs. Human Authorship: What Google Wants',
    category: 'Content Strategy',
    excerpt: 'An empirical forensic breakdown of recent search core updates and algorithmic content evaluations.',
    image: 'https://picsum.photos/seed/aicontent/800/600',
    author: 'Elena Rostova',
    date: 'Oct 25, 2024',
    content: 'Search engines have evolved to value information gain and expert topical authority above raw content volume. Here is how our Elite Content Hub adapts.'
  },
  {
    id: '6',
    title: 'Niche Link Routing & Casino Outreach Protocols',
    category: 'Grey Niche',
    excerpt: 'Navigating compliance and building high-authority backlink networks in regulated sectors.',
    image: 'https://picsum.photos/seed/greyniche/800/600',
    author: 'Victor Sterling',
    date: 'Oct 28, 2024',
    content: 'Regulated verticals require specialized vetting protocols. Our node protocol ensures strict SSL synchronization and peer-reviewed anchor placement.'
  }
];

export const USP = [
  { label: 'Real accurate metrics', icon: <Search className="w-5 h-5 text-blue-500" /> },
  { label: 'Automated collection', icon: <Zap className="w-5 h-5 text-amber-500" /> },
  { label: 'Secure payments', icon: <Shield className="w-5 h-5 text-emerald-500" /> },
  { label: 'Verified domains', icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" /> }
];
