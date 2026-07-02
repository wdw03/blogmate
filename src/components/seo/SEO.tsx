import React from 'react';
import { Helmet } from 'react-helmet-async';
import Schema from './Schema';
import { generateCanonical, getSiteUrl } from '../../utils/generateCanonical';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  formatTitle,
  SITE_NAME,
  toAbsoluteUrl,
} from '../../utils/generateMeta';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  canonical?: string;
  path?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  noIndex?: boolean;
  language?: string;
  alternateLanguages?: Array<{ language: string; href: string }>;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  path = '/',
  robots,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema,
  noIndex = false,
  language = 'en',
  alternateLanguages = [],
  publishedTime,
  modifiedTime,
  author,
}) => {
  const siteUrl = getSiteUrl();
  const finalTitle = formatTitle(title);
  const finalCanonical = canonical || generateCanonical(path);
  const finalImage = toAbsoluteUrl(ogImage, siteUrl);
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  const robotsContent = noIndex ? 'noindex, nofollow' : (robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  return (
    <>
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="theme-color" content="#020617" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <link rel="canonical" href={finalCanonical} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />
      {alternateLanguages.map((alternate) => (
        <link key={alternate.language} rel="alternate" hrefLang={alternate.language} href={alternate.href} />
      ))}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={`${language}_US`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={ogTitle || finalTitle} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || finalTitle} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || description} />
      <meta name="twitter:image" content={toAbsoluteUrl(twitterImage || ogImage, siteUrl)} />
      <meta name="twitter:image:alt" content={twitterTitle || ogTitle || finalTitle} />

      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/icon.svg" />
      </Helmet>
      <Schema data={schema} />
    </>
  );
};

export default SEO;

