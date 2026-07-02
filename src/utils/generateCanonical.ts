const DEFAULT_SITE_URL = 'https://blogmate.com';

export const getSiteUrl = () =>
  (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

export const normalizePath = (path = '/') => {
  const withoutQuery = path.split(/[?#]/)[0] || '/';
  const normalized = `/${withoutQuery}`.replace(/\/+/g, '/');
  return normalized === '/' ? normalized : normalized.replace(/\/$/, '');
};

export const generateCanonical = (path = '/') =>
  `${getSiteUrl()}${normalizePath(path)}`;

