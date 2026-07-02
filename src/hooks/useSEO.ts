import { useMemo } from 'react';
import { generateCanonical } from '../utils/generateCanonical';
import { DEFAULT_DESCRIPTION, formatTitle } from '../utils/generateMeta';

export const useSEO = (title?: string, description = DEFAULT_DESCRIPTION, path = '/') =>
  useMemo(() => ({
    title: formatTitle(title),
    description,
    canonical: generateCanonical(path),
  }), [title, description, path]);

