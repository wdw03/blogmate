export const SITE_NAME = 'BlogMate';
export const DEFAULT_DESCRIPTION =
  'Research domains, compare verified SEO metrics, and learn practical search strategies in the BlogMate knowledge center.';
export const DEFAULT_IMAGE = '/og-cover.svg';

export const formatTitle = (title?: string) => {
  if (!title) return `${SITE_NAME} — Domain Intelligence & SEO Knowledge`;
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
};

export const toAbsoluteUrl = (value: string, siteUrl: string) => {
  try {
    return new URL(value, `${siteUrl}/`).toString();
  } catch {
    return `${siteUrl}${value.startsWith('/') ? value : `/${value}`}`;
  }
};

