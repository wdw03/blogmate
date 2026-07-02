import { generateCanonical } from './generateCanonical';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const generateBreadcrumb = (items: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: generateCanonical(item.path),
  })),
});

