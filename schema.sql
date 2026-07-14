-- Chavan-Podar Jumbo Kids, Vaijapur
-- Supabase Database Setup Schema (No Auth Mode)
-- Run this in the SQL Editor of your Supabase project (https://supabase.com)

-- 1. Create the enquiries table if it doesn't exist
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  parent_name text not null,
  mobile text not null,
  child_name text not null,
  program text not null,
  email text,
  message text,
  status text not null default 'pending', -- can be 'pending', 'called', 'visited', 'admitted', 'rejected'
  notes text default ''
);

-- 2. Disable Row Level Security (RLS) to allow public reads, inserts, updates, and deletes
alter table public.enquiries disable row level security;

-- 3. Create the students table for birthdays
create table if not exists public.students (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_name text not null,
  birth_date date not null,
  photo_url text, -- URL to the student's photo
  class_name text
);

-- 4. Disable Row Level Security (RLS) to allow public reads
alter table public.students disable row level security;
