-- Run this script in the Supabase SQL Editor for the Catlas project.
create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school text not null,
  faculty text not null,
  department text not null,
  level text not null,
  email text not null,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_signups_email_unique
  on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

revoke all on table public.waitlist_signups from public;
revoke all on table public.waitlist_signups from anon;
revoke all on table public.waitlist_signups from authenticated;

grant select, insert on table public.waitlist_signups to service_role;

-- Student accounts use Supabase Auth. Profiles contain only campus details;
-- passwords and verified email addresses remain in auth.users.
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists schools_name_unique
  on public.schools (lower(name));

create table if not exists public.faculties (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id),
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, school_id)
);

create unique index if not exists faculties_school_name_unique
  on public.faculties (school_id, lower(name));

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools (id),
  faculty_id uuid not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, school_id, faculty_id),
  foreign key (faculty_id, school_id)
    references public.faculties (id, school_id)
);

create unique index if not exists departments_faculty_name_unique
  on public.departments (faculty_id, lower(name));

-- Seed the demo school and pilot faculties from README.md.
insert into public.schools (name)
values ('Federal University of Oye, Ikole Campus')
on conflict (lower(name)) do nothing;

insert into public.faculties (school_id, name)
select school.id, faculty.name
from public.schools as school
cross join (
  values
    ('Faculty of Engineering'),
    ('Faculty of CIESA')
) as faculty(name)
where lower(school.name) = lower(
  'Federal University of Oye, Ikole Campus'
)
on conflict (school_id, lower(name)) do nothing;

insert into public.departments (school_id, faculty_id, name)
select school.id, faculty.id, department.name
from public.schools as school
join public.faculties as faculty
  on faculty.school_id = school.id
cross join (
  values
    ('Faculty of Engineering', 'Mechanical Engineering'),
    ('Faculty of Engineering', 'Material Engineering'),
    ('Faculty of CIESA', 'Mechatronics Engineering'),
    ('Faculty of CIESA', 'Computer Engineering')
) as department(faculty_name, name)
where lower(school.name) = lower(
  'Federal University of Oye, Ikole Campus'
)
  and lower(faculty.name) = lower(department.faculty_name)
on conflict (faculty_id, lower(name)) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  school_id uuid not null references public.schools (id),
  faculty_id uuid not null,
  department_id uuid not null,
  role text not null default 'student'
    check (role in (
      'student',
      'class_governor',
      'committee',
      'hod',
      'dean',
      'vc',
      'founder'
    )),
  surname text not null,
  first_name text not null,
  phone text not null,
  level smallint not null check (
    level between 100 and 800 and level % 100 = 0
  ),
  jamb_reg_no text,
  matric_no text,
  avatar_url text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (faculty_id, school_id)
    references public.faculties (id, school_id),
  foreign key (department_id, school_id, faculty_id)
    references public.departments (id, school_id, faculty_id)
);

create unique index if not exists profiles_jamb_number_unique
  on public.profiles (school_id, lower(jamb_reg_no))
  where jamb_reg_no is not null;

create unique index if not exists profiles_matric_number_unique
  on public.profiles (school_id, lower(matric_no))
  where matric_no is not null;

create or replace function public.create_student_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_school_id uuid :=
    (new.raw_user_meta_data ->> 'school_id')::uuid;
  selected_faculty_id uuid :=
    (new.raw_user_meta_data ->> 'faculty_id')::uuid;
  selected_department_id uuid :=
    (new.raw_user_meta_data ->> 'department_id')::uuid;
begin
  if not exists (
    select 1
    from public.schools as school
    join public.faculties as faculty
      on faculty.school_id = school.id
    join public.departments as department
      on department.faculty_id = faculty.id
      and department.school_id = school.id
    where school.id = selected_school_id
      and faculty.id = selected_faculty_id
      and department.id = selected_department_id
      and school.is_active
      and faculty.is_active
      and department.is_active
  ) then
    raise exception 'The selected campus details are unavailable';
  end if;

  insert into public.profiles (
    id,
    school_id,
    faculty_id,
    department_id,
    role,
    surname,
    first_name,
    phone,
    level,
    jamb_reg_no,
    consented_at
  )
  values (
    new.id,
    selected_school_id,
    selected_faculty_id,
    selected_department_id,
    'student',
    trim(new.raw_user_meta_data ->> 'surname'),
    trim(new.raw_user_meta_data ->> 'first_name'),
    trim(new.raw_user_meta_data ->> 'phone'),
    (new.raw_user_meta_data ->> 'level')::smallint,
    nullif(trim(new.raw_user_meta_data ->> 'jamb_reg_no'), ''),
    now()
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_student_profile();

alter table public.schools enable row level security;
alter table public.faculties enable row level security;
alter table public.departments enable row level security;
alter table public.profiles enable row level security;

drop policy if exists "Active schools are visible" on public.schools;
create policy "Active schools are visible"
  on public.schools for select to anon, authenticated
  using (is_active);

drop policy if exists "Active faculties are visible" on public.faculties;
create policy "Active faculties are visible"
  on public.faculties for select to anon, authenticated
  using (is_active);

drop policy if exists "Active departments are visible" on public.departments;
create policy "Active departments are visible"
  on public.departments for select to anon, authenticated
  using (is_active);

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Users can update their own student profile" on public.profiles;
create policy "Users can update their own student profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) and role = 'student')
  with check (id = (select auth.uid()) and role = 'student');

revoke all on public.schools from public, anon, authenticated;
revoke all on public.faculties from public, anon, authenticated;
revoke all on public.departments from public, anon, authenticated;
revoke all on public.profiles from public, anon, authenticated;

grant select on public.schools to anon, authenticated;
grant select on public.faculties to anon, authenticated;
grant select on public.departments to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (surname, first_name, phone)
  on public.profiles to authenticated;

grant all on public.schools to service_role;
grant all on public.faculties to service_role;
grant all on public.departments to service_role;
grant all on public.profiles to service_role;
