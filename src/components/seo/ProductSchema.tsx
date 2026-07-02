import React from 'react';
import Schema from './Schema';
import { generateCanonical } from '../../utils/generateCanonical';

interface ProductSchemaProps {
  name: string;
  description: string;
  path: string;
  price?: number;
  category?: string;
  rating?: number;
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ name, description, path, price, category, rating }) => (
  <Schema data={{
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    category,
    url: generateCanonical(path),
    offers: price == null ? undefined : {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price,
      availability: 'https://schema.org/InStock',
      url: generateCanonical(path),
    },
    aggregateRating: rating ? {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: 1,
    } : undefined,
  }} />
);

export default ProductSchema;
