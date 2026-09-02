-- India Master Catalogue — SaaS (Master + Tenant isolation)
create extension if not exists "uuid-ossp";

create table if not exists master_products (
  id text primary key,
  gtin text unique,
  barcode text,
  sku_reference text unique not null,
  brand_id text,
  brand_name text not null,
  product_name text not null,
  slug text unique not null,
  description text,
  pack_size text,
  pack_unit text,
  country_of_origin text default 'India',
  hsn_code text,
  gst_category text,
  department_id text,
  category_id text,
  subcategory_id text,
  vegetarian_status text,
  image_url text,
  reference_mrp numeric(10,2) not null,
  mrp_verified_at timestamptz,
  mrp_source text,
  status text default 'active',
  source text,
  quality_score int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_master_gtin on master_products(gtin);
create index if not exists idx_master_barcode on master_products(barcode);
create index if not exists idx_master_name_trgm on master_products using gin (product_name gin_trgm_ops);
create index if not exists idx_master_brand on master_products(brand_name);
create index if not exists idx_master_category on master_products(category_id);

create table if not exists product_mrp_history (
  id uuid primary key default uuid_generate_v4(),
  product_id text references master_products(id) on delete cascade,
  mrp numeric(10,2) not null,
  effective_from timestamptz not null,
  effective_until timestamptz,
  source text,
  verified_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists tenant_products (
  id text primary key,
  tenant_id text not null,
  master_product_id text references master_products(id),
  enabled boolean default true,
  custom_name text,
  custom_description text,
  custom_image text,
  category_override text,
  selling_price numeric(10,2),
  compare_at_price numeric(10,2),
  special_price numeric(10,2),
  special_start timestamptz,
  special_end timestamptz,
  is_custom boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tenant_id, master_product_id)
);
create index if not exists idx_tenant_products_tenant on tenant_products(tenant_id);
create index if not exists idx_tenant_products_enabled on tenant_products(tenant_id, enabled);
create index if not exists idx_tenant_products_master on tenant_products(master_product_id);

create table if not exists tenant_inventory (
  tenant_id text not null,
  store_id text not null,
  master_product_id text references master_products(id),
  quantity_available int default 0,
  quantity_reserved int default 0,
  low_stock_threshold int default 5,
  in_stock boolean default true,
  updated_at timestamptz default now(),
  primary key (tenant_id, store_id, master_product_id)
);
create index if not exists idx_tenant_inventory_tenant_store on tenant_inventory(tenant_id, store_id);

create table if not exists product_aliases (
  id uuid primary key default uuid_generate_v4(),
  term text not null,
  aliases text[] not null
);

create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id text references master_products(id) on delete cascade,
  url text not null,
  image_type text default 'primary',
  source text,
  rights_status text,
  is_primary boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

create table if not exists catalogue_sources (
  id text primary key,
  name text not null,
  type text not null,
  url text,
  last_import timestamptz
);

create table if not exists source_products (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  external_id text not null,
  external_category text,
  external_product_name text,
  external_price numeric(10,2),
  external_mrp numeric(10,2),
  external_image_url text,
  raw_payload jsonb,
  import_batch text,
  imported_at timestamptz default now()
);

-- RLS: master is shared READ, tenant is isolated
alter table master_products enable row level security;
create policy "master read all" on master_products for select using (true);

alter table tenant_products enable row level security;
create policy "tenant isolated" on tenant_products for all using (tenant_id = current_setting('app.tenant_id', true));
-- In app, set app.tenant_id per request (Supabase RLS via JWT claim)

alter table tenant_inventory enable row level security;
create policy "tenant inventory isolated" on tenant_inventory for all using (tenant_id = current_setting('app.tenant_id', true));
