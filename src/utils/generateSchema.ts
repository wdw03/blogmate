import { generateCanonical, getSiteUrl } from './generateCanonical';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${getSiteUrl()}/#organization`,
  name: 'BlogMate',
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/icon.svg`,
  sameAs: [],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${getSiteUrl()}/#website`,
  name: 'BlogMate',
  url: getSiteUrl(),
  publisher: { '@id': `${getSiteUrl()}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${getSiteUrl()}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const webPageSchema = (name: string, path: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: generateCanonical(path),
  isPartOf: { '@id': `${getSiteUrl()}/#website` },
});

