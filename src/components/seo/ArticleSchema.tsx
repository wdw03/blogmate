import React from 'react';
import Schema from './Schema';
import { generateCanonical, getSiteUrl } from '../../utils/generateCanonical';
import { toAbsoluteUrl } from '../../utils/generateMeta';

interface ArticleSchemaProps {
  headline: string;
  description: string;
  path: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified: string;
}

const ArticleSchema: React.FC<ArticleSchemaProps> = (props) => (
  <Schema data={{
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    headline: props.headline,
    description: props.description,
    mainEntityOfPage: generateCanonical(props.path),
    image: { '@type': 'ImageObject', url: toAbsoluteUrl(props.image, getSiteUrl()) },
    datePublished: props.datePublished,
    dateModified: props.dateModified,
    author: { '@type': 'Person', name: props.author },
    publisher: { '@id': `${getSiteUrl()}/#organization` },
  }} />
);

export default ArticleSchema;

