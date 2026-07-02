create extension if not exists pgcrypto;

create or replace function public.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

create table if not exists public.seo_entries (
  id uuid primary key default gen_random_uuid(),
  path text not null unique check (path like '/%'),
  title text not null,
  description text not null,
  keywords text[] not null default '{}',
  canonical_url text,
  robots text not null default 'index, follow',
  og_title text,
  og_description text,
  og_image text,
  twitter_title text,
  twitter_description text,
  twitter_image text,
  schema_json jsonb not null default '[]'::jsonb,
  no_index boolean not null default false,
  language text not null default 'en',
  status text not null default 'published' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null,
  category text not null default 'Resources',
  tags text[] not null default '{}',
  author_name text not null,
  author_role text,
  author_avatar text,
  cover_image text,
  content_sections jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  references_json jsonb not null default '[]'::jsonb,
  read_time integer not null default 5 check (read_time > 0),
  views bigint not null default 0,
  likes bigint not null default 0,
  comments_count bigint not null default 0,
  featured boolean not null default false,
  trending boolean not null default false,
  editors_choice boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.seo_redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique check (from_path like '/%'),
  to_path text not null check (to_path like '/%' or to_path ~ '^https?://'),
  status_code integer not null default 301 check (status_code in (301, 302, 307, 308)),
  is_active boolean not null default true,
  hit_count bigint not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seo_entries_status_path_idx on public.seo_entries(status, path);
create index if not exists blog_articles_status_published_idx on public.blog_articles(status, published_at desc);
create index if not exists blog_articles_category_idx on public.blog_articles(category);
create index if not exists blog_articles_tags_idx on public.blog_articles using gin(tags);
create index if not exists seo_redirects_from_active_idx on public.seo_redirects(from_path, is_active);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists seo_entries_touch_updated_at on public.seo_entries;
create trigger seo_entries_touch_updated_at before update on public.seo_entries
for each row execute function public.touch_updated_at();
drop trigger if exists blog_articles_touch_updated_at on public.blog_articles;
create trigger blog_articles_touch_updated_at before update on public.blog_articles
for each row execute function public.touch_updated_at();
drop trigger if exists seo_redirects_touch_updated_at on public.seo_redirects;
create trigger seo_redirects_touch_updated_at before update on public.seo_redirects
for each row execute function public.touch_updated_at();

alter table public.seo_entries enable row level security;
alter table public.blog_articles enable row level security;
alter table public.seo_redirects enable row level security;

create policy "Public reads published SEO" on public.seo_entries
for select using (status = 'published' or public.is_content_admin());
create policy "Admins manage SEO" on public.seo_entries
for all using (public.is_content_admin()) with check (public.is_content_admin());

create policy "Public reads published articles" on public.blog_articles
for select using (status = 'published' or public.is_content_admin());
create policy "Admins manage articles" on public.blog_articles
for all using (public.is_content_admin()) with check (public.is_content_admin());

create policy "Public reads active redirects" on public.seo_redirects
for select using (is_active or public.is_content_admin());
create policy "Admins manage redirects" on public.seo_redirects
for all using (public.is_content_admin()) with check (public.is_content_admin());

grant execute on function public.is_content_admin() to anon, authenticated;
grant select on public.seo_entries, public.blog_articles, public.seo_redirects to anon, authenticated;
grant insert, update, delete on public.seo_entries, public.blog_articles, public.seo_redirects to authenticated;
grant all on public.seo_entries, public.blog_articles, public.seo_redirects to service_role;

insert into public.seo_entries (path, title, description, keywords, status)
values
  ('/', 'Domain Intelligence & SEO Knowledge', 'Research verified domains, compare SEO metrics, and learn practical search strategies with BlogMate.', array['domain intelligence','SEO marketplace'], 'published'),
  ('/domains', 'Verified Domain Marketplace', 'Compare verified guest-post and link-placement opportunities using transparent SEO metrics and pricing.', array['guest posts','link insertion','domain marketplace'], 'published'),
  ('/blog', 'SEO & Domain Knowledge Center', 'Expert guides, field-tested SEO tactics, domain research, templates, and practical tools from BlogMate.', array['SEO guides','domain investing','backlinks'], 'published'),
  ('/pricing', 'Pricing', 'Explore BlogMate marketplace and content service pricing.', array['SEO pricing','guest post pricing'], 'published'),
  ('/contact', 'Contact BlogMate', 'Contact the BlogMate team for marketplace, account, or SEO service support.', array['contact BlogMate'], 'published')
on conflict (path) do nothing;
