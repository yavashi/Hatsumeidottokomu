-- ====================================================================
-- 発明ドットコム (Hatsumeidottokomu) 本番PostgreSQL/Supabaseスキーマ
-- ====================================================================

-- 1. 発明家・ユーザー拡張テーブル
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text not null,
  avatar_url text,
  is_inventor boolean default false,
  bio text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 発明品テーブル
create table if not exists public.inventions (
  id text primary key,
  inventor_id text not null,
  title text not null,
  catchphrase text not null,
  summary text not null,
  description text not null,
  primary_image_url text not null,
  additional_images text[] default array[]::text[],
  has_patent boolean default false,
  patent_number text,
  is_commercialized boolean default false,
  hope_price integer,
  category text not null,
  tags text[] default array[]::text[],
  materials text[] default array[]::text[],
  processes text[] default array[]::text[],
  page_views integer default 0,
  likes_count integer default 0,
  wants_count integer default 0,
  status text default 'published',
  ai_sections jsonb,
  shop_item jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 「商品化されたら欲しい！」応援投票テーブル
create table if not exists public.want_votes (
  id uuid default gen_random_uuid() primary key,
  invention_id text references public.inventions(id) on delete cascade not null,
  user_id text not null,
  expected_price_range text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ネットショップ直販注文テーブル（エスクロー管理）
create table if not exists public.shop_orders (
  id text primary key,
  product_id text not null,
  title text not null,
  amount integer not null,
  shipping_fee integer not null,
  buyer_name text not null,
  buyer_address text not null,
  buyer_message text,
  payment_method text not null,
  status text default 'paid_escrow_holding', -- paid_escrow_holding, shipped, completed
  tracking_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. 専門家相談スレッドテーブル（NDA保護・1:1業務相談限定）
create table if not exists public.expert_consultations (
  id uuid default gen_random_uuid() primary key,
  expert_id text not null,
  inventor_id text not null,
  invention_title text not null,
  inquiry_text text not null,
  has_nda_agreed boolean default true,
  status text default 'pending', -- pending, in_progress, closed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. メールマガジン登録者テーブル
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ====================================================================
-- 行レベルセキュリティ (Row Level Security: RLS)
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.inventions enable row level security;
alter table public.want_votes enable row level security;
alter table public.shop_orders enable row level security;
alter table public.expert_consultations enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- 公開閲覧ポリシー
create policy "Inventions are viewable by everyone" on public.inventions for select using (true);
create policy "Want votes are viewable by everyone" on public.want_votes for select using (true);

-- 専門家相談は当事者のみ参照可能（NDA遵守）
create policy "Consultations viewable only by participants" on public.expert_consultations
  for select using (auth.uid()::text = inventor_id or auth.uid()::text = expert_id);
