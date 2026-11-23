-- DeutscheProbe on the Supabase free tier.
-- Run this once in the SQL editor after creating a project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  exam text not null check (exam in ('goethe', 'telc')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2')),
  goal text default '',
  exam_in_days integer default 30,
  onboarded boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.attempts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  track_id text not null,
  task_id text not null,
  skill text not null,
  mode text not null check (mode in ('practice', 'exam')),
  score numeric,
  max_score numeric not null,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;

create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

create policy "attempts own" on public.attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
