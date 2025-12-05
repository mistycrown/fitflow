-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Exercises Table
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  category text not null,
  muscle_group text not null,
  type text default 'REPS',
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Templates Table
create table public.workout_templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  items jsonb not null, -- Stores the array of workout items
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Daily Workouts Table
create table public.daily_workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date_key text not null, -- Format: YYYY-MM-DD
  items jsonb default '[]'::jsonb, -- Stores the actual workout logs (sets, reps)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date_key) -- Ensure only one record per day per user
);

-- 4. Enable Row Level Security (RLS)
alter table public.exercises enable row level security;
alter table public.workout_templates enable row level security;
alter table public.daily_workouts enable row level security;

-- 5. Create Policies (Users can only see/edit their own data)

-- Exercises Policies
create policy "Users can view their own exercises" on public.exercises
  for select using (auth.uid() = user_id);

create policy "Users can insert their own exercises" on public.exercises
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own exercises" on public.exercises
  for update using (auth.uid() = user_id);

create policy "Users can delete their own exercises" on public.exercises
  for delete using (auth.uid() = user_id);

-- Templates Policies
create policy "Users can view their own templates" on public.workout_templates
  for select using (auth.uid() = user_id);

create policy "Users can insert their own templates" on public.workout_templates
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own templates" on public.workout_templates
  for update using (auth.uid() = user_id);

create policy "Users can delete their own templates" on public.workout_templates
  for delete using (auth.uid() = user_id);

-- Daily Workouts Policies
create policy "Users can view their own workouts" on public.daily_workouts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own workouts" on public.daily_workouts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own workouts" on public.daily_workouts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own workouts" on public.daily_workouts
  for delete using (auth.uid() = user_id);
