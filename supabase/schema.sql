-- =============================================
-- GIRO AUDIO - Supabase Database Schema
-- Execute this in the Supabase SQL Editor
-- =============================================

-- 1. Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  city text,
  state text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  sound_type text check (sound_type in ('Trio Goiano', 'Nordeste', 'Treme Lata', 'Outro')),
  vehicle_type text check (vehicle_type in ('SUV', 'Sedan', 'Hatch', 'Picape', 'Esportivo', 'Outro')),
  vehicle_model text,
  vehicle_year int,
  rms_power numeric(10,2),
  images text[] default '{}',
  likes_count int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Project likes table
create table public.project_likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, project_id)
);

-- 4. Listings (Marketplace) table
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(12,2),
  category text,
  condition text check (condition in ('Novo', 'Usado', 'Recondicionado')),
  images text[] default '{}',
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_likes enable row level security;
alter table public.listings enable row level security;

-- Profiles: anyone can read, users can update own profile
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Projects: anyone can read, authenticated users can create/update/delete own
create policy "Projects are viewable by everyone"
  on public.projects for select using (true);

create policy "Authenticated users can create projects"
  on public.projects for insert with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete using (auth.uid() = user_id);

-- Project likes: anyone can read, authenticated users can insert/delete own
create policy "Likes are viewable by everyone"
  on public.project_likes for select using (true);

create policy "Authenticated users can like projects"
  on public.project_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike projects"
  on public.project_likes for delete using (auth.uid() = user_id);

-- Listings: anyone can read active, authenticated users can manage own
create policy "Active listings are viewable by everyone"
  on public.listings for select using (is_active = true or auth.uid() = user_id);

create policy "Authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.listings for update using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- =============================================
-- Auto-create profile on signup (trigger)
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- Updated_at triggers
-- =============================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();

create trigger listings_updated_at
  before update on public.listings
  for each row execute procedure public.update_updated_at();

-- =============================================
-- Likes count trigger (auto-update on like/unlike)
-- =============================================

create or replace function public.update_likes_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.projects set likes_count = likes_count + 1 where id = new.project_id;
  elsif tg_op = 'DELETE' then
    update public.projects set likes_count = likes_count - 1 where id = old.project_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_project_like_change
  after insert or delete on public.project_likes
  for each row execute procedure public.update_likes_count();

-- =============================================
-- Admin role column on profiles
-- =============================================

alter table public.profiles add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- Username change cooldown (7 days)
alter table public.profiles add column if not exists last_username_change timestamptz default now();

-- Contact info for listings
alter table public.listings add column if not exists contact_info text;

create policy "Users can read own role"
  on public.profiles for select using (auth.uid() = id or role = 'admin');

-- =============================================
-- Storage Bucket for Project Images
-- =============================================

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true);

create policy "Project images are publicly accessible"
  on storage.objects for select using (bucket_id = 'project-images');

create policy "Authenticated users can upload project images"
  on storage.objects for insert with check (bucket_id = 'project-images' and auth.role() = 'authenticated');

create policy "Users can delete own project images"
  on storage.objects for delete using (bucket_id = 'project-images' and auth.uid()::text = (storage.foldername(name))[1]);