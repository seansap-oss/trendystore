-- FreshBasket — Supabase PostgreSQL schema
-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Departments / categories
create table if not exists departments (
  id text primary key,
  slug text unique not null,
  name text not null,
  icon text,
  sort_order int not null,
  is_active boolean default true,
  created_at timestamptz default now()
);
create table if not exists categories (
  id text primary key,
  department_id text references departments(id),
  slug text not null,
  name text not null,
  sort_order int not null,
  is_active boolean default true
);
create table if not exists subcategories (
  id text primary key,
  category_id text references categories(id),
  department_id text references departments(id),
  slug text not null,
  name text not null,
  sort_order int not null,
  is_active boolean default true
);

create table if not exists brands (
  id text primary key,
  slug text unique not null,
  name text not null,
  is_private_label boolean default false
);

create table if not exists products (
  id text primary key,
  sku text unique not null,
  barcode text,
  slug text unique not null,
  name text not null,
  brand_id text references brands(id),
  department_id text references departments(id),
  category_id text references categories(id),
  subcategory_id text references subcategories(id),
  description text,
  package_size text,
  unit_price numeric(10,2),
  retail_price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  tax_rate numeric(4,3) default 0.10,
  variable_weight boolean default false,
  estimated_weight numeric(6,3),
  min_weight numeric(6,3),
  max_weight numeric(6,3),
  price_per_kg numeric(10,2),
  in_stock boolean default true,
  is_special boolean default false,
  special_price numeric(10,2),
  is_new boolean default false,
  is_featured boolean default false,
  health_star_rating numeric(2,1),
  average_rating numeric(2,1),
  review_count int default 0,
  images jsonb default '[]',
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_products_search on products using gin ((name || ' ' || description) gin_trgm_ops);
create index if not exists idx_products_department on products(department_id);
create index if not exists idx_products_category on products(category_id);

create table if not exists stores (
  id text primary key,
  code text unique not null,
  name text not null,
  address text not null,
  suburb text not null,
  postcode text not null,
  state text not null,
  country text default 'Australia',
  latitude double precision,
  longitude double precision,
  phone text,
  timezone text,
  services jsonb default '[]',
  delivery_enabled boolean default true,
  pickup_enabled boolean default true,
  is_active boolean default true
);

create table if not exists store_inventory (
  store_id text references stores(id),
  product_id text references products(id),
  quantity_available int default 0,
  quantity_reserved int default 0,
  status text default 'In Stock',
  updated_at timestamptz default now(),
  primary key (store_id, product_id)
);

create table if not exists carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  guest_token text,
  created_at timestamptz default now()
);
create table if not exists cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid references carts(id) on delete cascade,
  product_id text references products(id),
  quantity int not null,
  note text,
  substitution_preference text default 'allow'
);

create table if not exists orders (
  id text primary key,
  order_number text unique not null,
  user_id uuid references auth.users(id),
  status text not null,
  fulfilment text not null,
  store_id text references stores(id),
  delivery_address text,
  subtotal numeric(10,2),
  delivery_fee numeric(10,2),
  total numeric(10,2),
  payment_status text,
  created_at timestamptz default now()
);
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id text references orders(id) on delete cascade,
  product_id text,
  sku text,
  name text,
  quantity int,
  unit_price numeric(10,2),
  final_total numeric(10,2),
  estimated_weight numeric(6,3),
  actual_weight numeric(6,3)
);

-- RLS (simplified)
alter table products enable row level security;
create policy "public read active products" on products for select using (true);
alter table stores enable row level security;
create policy "public read stores" on stores for select using (is_active = true);
