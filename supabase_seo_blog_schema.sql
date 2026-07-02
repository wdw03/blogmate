-- ====================================================================
-- BLOGMATE: FULL DYNAMIC CMS & SEO SYSTEM DATABASE MIGRATION
-- ====================================================================

-- 1. Create seo_entries Table
CREATE TABLE IF NOT EXISTS public.seo_entries (
    id TEXT PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    title TEXT,
    description TEXT,
    keywords TEXT[],
    canonical_url TEXT,
    robots TEXT DEFAULT 'index, follow',
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    schema_json JSONB DEFAULT '[]'::JSONB,
    no_index BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by TEXT,
    updated_by TEXT
);

-- 2. Create blog_articles Table
CREATE TABLE IF NOT EXISTS public.blog_articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'SEO Tips',
    tags TEXT[] DEFAULT '{}',
    author_name TEXT,
    author_role TEXT,
    author_avatar TEXT,
    cover_image TEXT,
    content_sections JSONB DEFAULT '[]'::JSONB,
    faq JSONB DEFAULT '[]'::JSONB,
    references_json JSONB DEFAULT '[]'::JSONB,
    read_time INTEGER DEFAULT 5,
    featured BOOLEAN DEFAULT false,
    trending BOOLEAN DEFAULT false,
    editors_choice BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'published',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_by TEXT,
    updated_by TEXT
);

-- 3. Create seo_redirects Table
CREATE TABLE IF NOT EXISTS public.seo_redirects (
    id TEXT PRIMARY KEY,
    from_path TEXT UNIQUE NOT NULL,
    to_path TEXT NOT NULL,
    status_code INTEGER DEFAULT 301,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create article_comments Table
CREATE TABLE IF NOT EXISTS public.article_comments (
    id TEXT PRIMARY KEY,
    article_slug TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    avatar TEXT,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security) and allow access
ALTER TABLE public.seo_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public all access on seo_entries" ON public.seo_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public all access on blog_articles" ON public.blog_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public all access on seo_redirects" ON public.seo_redirects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow public all access on article_comments" ON public.article_comments FOR ALL USING (true) WITH CHECK (true);
