-- ============================================================
-- Leave Request Management — schema, RLS policies, triggers
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- Tables
-- ------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('employee', 'manager')),
  created_at timestamptz not null default now()
);

create table if not exists leave_requests (
  id uuid primary key default uuid_generate_v4(),
  employee_id uuid not null references profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint end_after_start check (end_date >= start_date)
);

create index if not exists leave_requests_employee_id_idx on leave_requests (employee_id);
create index if not exists leave_requests_status_idx on leave_requests (status);

-- ------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- Expects `name` and `role` in the signup's user_metadata.
-- ------------------------------------------------------------

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'employee')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------

alter table profiles enable row level security;
alter table leave_requests enable row level security;

-- Helper: is the current user a manager?
create or replace function is_manager()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'manager'
  );
$$ language sql security definer stable;

-- profiles: everyone can read their own row; managers can read all
create policy "profiles_select_own_or_manager"
  on profiles for select
  using (auth.uid() = id or is_manager());

-- leave_requests: employees see only their own rows
create policy "leave_requests_select_own"
  on leave_requests for select
  using (auth.uid() = employee_id);

-- leave_requests: managers see all rows
create policy "leave_requests_select_manager"
  on leave_requests for select
  using (is_manager());

-- leave_requests: employees can insert their own requests
create policy "leave_requests_insert_own"
  on leave_requests for insert
  with check (auth.uid() = employee_id);

-- leave_requests: only managers can update status/comment
create policy "leave_requests_update_manager"
  on leave_requests for update
  using (is_manager())
  with check (is_manager());
