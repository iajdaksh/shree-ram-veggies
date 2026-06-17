-- ============================================
-- SHREE RAM VEGGIES — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  whatsapp_number text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 2. PRODUCTS
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text default '',
  price numeric not null,
  unit text not null default '1 kg',
  category text not null default 'vegetables',
  image_url text,
  stock integer default 100,
  is_available boolean default true,
  is_featured boolean default false,
  badge text,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Anyone can view available products" on public.products for select using (is_available = true);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 3. ADDRESSES
create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text default 'Home',
  address_line1 text not null,
  address_line2 text,
  city text not null default 'Muzaffarnagar',
  state text not null default 'Uttar Pradesh',
  pincode text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);
alter table public.addresses enable row level security;
create policy "Users can manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- 4. ORDERS
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  delivery_fee numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pending'
    check (status in ('pending','confirmed','out_for_delivery','delivered','cancelled')),
  delivery_type text not null default 'home_delivery'
    check (delivery_type in ('home_delivery','pickup')),
  address_id uuid references public.addresses(id) on delete set null,
  payment_method text default 'cod',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 5. NOTIFICATIONS (for admin panel)
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  title text not null,
  message text,
  order_id uuid references public.orders(id) on delete cascade,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.notifications enable row level security;
create policy "Admins can manage notifications" on public.notifications for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 6. SEED PRODUCTS
insert into public.products (name, description, price, unit, category, is_available, is_featured, badge) values
  ('Fresh Potato', 'Fresh daily sourced potatoes.', 30, '1 kg', 'vegetables', true, true, 'bestseller'),
  ('Red Onion', 'Crisp and fresh red onions from local farms.', 40, '1 kg', 'vegetables', true, false, null),
  ('Tomato', 'Juicy red tomatoes sourced directly from the mandi.', 50, '1 kg', 'vegetables', true, true, 'fresh'),
  ('Green Chilli', 'Spicy fresh green chillies.', 20, '250g', 'vegetables', true, false, null),
  ('Cauliflower', 'Fresh, compact, and clean cauliflower.', 45, '1 pc', 'vegetables', true, false, null),
  ('Carrot', 'Sweet and crunchy fresh carrots.', 35, '500g', 'vegetables', true, false, null),
  ('Fresh Apple (Shimla)', 'Sweet and crunchy fresh apples.', 150, '1 kg', 'fruits', true, true, 'premium'),
  ('Banana (Robusta)', 'Fresh, perfectly ripe bananas.', 60, '1 Dozen', 'fruits', true, true, 'popular'),
  ('Pomegranate', 'Ruby red, sweet and juicy pomegranates.', 180, '1 kg', 'fruits', true, false, null),
  ('Papaya', 'Sweet and ripe papaya.', 50, '1 pc', 'fruits', true, false, null);

-- 7. AUTO-UPDATE updated_at on orders
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();

-- 8. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
