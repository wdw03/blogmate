-- DomIntel payment operations registry
create extension if not exists pgcrypto;

create table if not exists public.payment_gateway_settings (
  id uuid primary key default gen_random_uuid(),
  gateway_key text not null unique check (gateway_key in ('PayPal','Razorpay','Binance','Net30','Wallet')),
  display_name text not null,
  description text,
  is_enabled boolean not null default true,
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.payment_gateway_settings (gateway_key, display_name, description, is_enabled, sort_order)
values
  ('PayPal', 'PayPal', 'Global PayPal settlement', true, 10),
  ('Razorpay', 'Razorpay', 'Cards, UPI and Netbanking', true, 20),
  ('Binance', 'USDT Crypto', 'Manual TRC-20/ERC-20 verification', true, 30),
  ('Net30', 'B2B Net-30', 'Institutional deferred settlement', true, 40),
  ('Wallet', 'Wallet Hub', 'Internal wallet balance', true, 50)
on conflict (gateway_key) do nothing;

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  gateway_key text not null,
  gateway_transaction_id text,
  status text not null default 'pending' check (status in ('pending','processing','completed','failed','refunded','cancelled')),
  amount numeric(14,2) not null default 0,
  currency text not null default 'USD',
  customer_name text,
  customer_email text,
  domains jsonb not null default '[]'::jsonb,
  gateway_payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_transactions_order_idx on public.payment_transactions(order_id);

-- One-time backfill for existing checkout orders. Gateway references remain null
-- when the legacy order did not preserve the provider transaction id.
insert into public.payment_transactions (
  order_id, user_id, gateway_key, gateway_transaction_id, status, amount,
  currency, customer_name, customer_email, domains, metadata, created_at, updated_at
)
select
  o.id,
  o.user_id,
  coalesce(o.payment_method, 'Unknown'),
  o.metadata->>'transaction_id',
  case when o.status in ('completed', 'live') then 'completed' else 'pending' end,
  coalesce(o.total_amount, o.total_price, 0),
  'USD',
  p.full_name,
  coalesce(p.email, o.metadata->>'user_email'),
  coalesce(o.items::jsonb, '[]'::jsonb),
  jsonb_build_object('source', 'legacy_order_backfill', 'order_status', o.status),
  coalesce(o.created_at, now()),
  now()
from public.orders o
left join public.profiles p on p.id = o.user_id
where not exists (
  select 1 from public.payment_transactions pt where pt.order_id = o.id
);
create index if not exists payment_transactions_user_idx on public.payment_transactions(user_id);
create index if not exists payment_transactions_gateway_idx on public.payment_transactions(gateway_key, created_at desc);
create unique index if not exists payment_transactions_gateway_ref_idx
  on public.payment_transactions(gateway_key, gateway_transaction_id)
  where gateway_transaction_id is not null;

alter table public.payment_gateway_settings enable row level security;
alter table public.payment_transactions enable row level security;

create or replace function public.is_payment_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

create policy "Anyone can read enabled gateway settings"
on public.payment_gateway_settings for select
using (is_enabled = true or public.is_payment_admin());

create policy "Admins manage gateway settings"
on public.payment_gateway_settings for all
using (public.is_payment_admin()) with check (public.is_payment_admin());

create policy "Users read own payment transactions"
on public.payment_transactions for select
using (user_id = auth.uid() or public.is_payment_admin());

create policy "Users create own payment transactions"
on public.payment_transactions for insert
with check (user_id = auth.uid());

create policy "Admins update payment transactions"
on public.payment_transactions for update
using (public.is_payment_admin()) with check (public.is_payment_admin());

grant execute on function public.is_payment_admin() to authenticated, anon;
grant select on public.payment_gateway_settings to anon, authenticated;
grant insert, update, delete on public.payment_gateway_settings to authenticated;
grant insert, select, update on public.payment_transactions to authenticated;
grant all on public.payment_gateway_settings, public.payment_transactions to service_role;
