-- Faisal Mobile database setup for Supabase
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  price text not null,
  description text default '',
  image_url text default '',
  wa_text text default '',
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can view products" on public.products;
create policy "Public can view products" on public.products
for select using (true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products" on public.products
for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products" on public.products
for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products" on public.products
for delete to authenticated using (true);

-- Storage bucket for product photos
insert into storage.buckets (id, name, public)
values ('product-images','product-images',true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');
