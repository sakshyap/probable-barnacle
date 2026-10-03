-- ============================================================================
-- Sakshi portfolio + student/course panel - Supabase schema
-- ============================================================================
-- Run this whole file in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).
--
-- Safe to run more than once: every statement is `if not exists`, every policy
-- is dropped before it is created, and the profile insert is `on conflict do
-- nothing`.
--
-- Design notes
-- ------------
-- * Every primary key is `text`, not `uuid`. The app has always used readable
--   slug ids ("school-website", "web-dev", "msg-1712..."), and keeping that
--   means zero id-formatting changes in the route layer.
-- * The server talks to the database with the `service_role` key, which
--   bypasses RLS. Row Level Security is still switched on as a second lock:
--   "anonymous reads published content and sends a message, a signed-in admin
--   does everything, nobody else does anything". See the RLS section below.
-- * `position` columns back the admin drag-and-drop reorder endpoints.
-- * The two blog systems that used to share the "posts" name are split into
--   `portfolio_posts` (public blog) and `admin_posts` (students panel blog).
-- * Legacy tables (students, courses, admin_posts) live in the same schema so
--   the old /admin panel keeps working on the same database.
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- Profile: exactly one row, always id = 'main'.
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id              text primary key default 'main',
  name            text        not null default '',
  title           text        not null default '',
  short_intro     text        not null default '',
  location        text        not null default '',
  email           text        not null default '',
  status          text        not null default '',
  bio_paragraph1  text        not null default '',
  bio_paragraph2  text        not null default '',
  -- [{ label, value, detail }]
  highlights      jsonb       not null default '[]'::jsonb,
  -- [{ number, label }]
  stats           jsonb       not null default '[]'::jsonb,
  avatar_url      text,
  updated_at      timestamptz not null default now(),
  constraint profile_singleton check (id = 'main')
);

insert into public.profile (id) values ('main') on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Social links. Keyed by platform, matching the original shape.
-- ---------------------------------------------------------------------------
create table if not exists public.socials (
  platform    text primary key,
  url         text        not null default '',
  icon_name   text        not null default 'Mail',
  label       text        not null default '',
  position    integer     not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Navigation links.
-- ---------------------------------------------------------------------------
create table if not exists public.nav_items (
  id          text primary key,
  label       text        not null default '',
  href        text        not null default '#',
  position    integer     not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Skill categories. `items` stays jsonb because it is a nested list of
-- { name, iconName, description, badge, tags[], level } objects that is always
-- read and written as a single unit.
-- ---------------------------------------------------------------------------
create table if not exists public.skill_categories (
  id             text primary key,
  title          text        not null default '',
  subtitle       text        not null default '',
  icon           text        not null default 'Sparkles',
  accent_color   text        not null default 'purple',
  items          jsonb       not null default '[]'::jsonb,
  position       integer     not null default 0,
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Portfolio projects.
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id                  text primary key,
  title               text        not null default '',
  badge               text        not null default '',
  tagline             text        not null default '',
  description         text        not null default '',
  long_description    text        not null default '',
  tech_stack          text[]      not null default '{}',
  features            text[]      not null default '{}',
  category            text        not null default 'Website Development',
  github_url          text        not null default '',
  live_url            text        not null default '',
  thumbnail_gradient  text        not null default 'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
  preview_type        text        not null default 'school',
  image_url           text        not null default '',
  position            integer     not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Public portfolio blog.
-- ---------------------------------------------------------------------------
create table if not exists public.portfolio_posts (
  id          text primary key,
  title       text        not null default '',
  author      text        not null default '',
  category    text        not null default 'Announcements',
  excerpt     text        not null default '',
  content     text        not null default '',
  image_url   text        not null default '',
  status      text        not null default 'Draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,
  constraint portfolio_posts_status check (status in ('Draft', 'Published'))
);

create index if not exists portfolio_posts_status_idx
  on public.portfolio_posts (status);

-- ---------------------------------------------------------------------------
-- Contact form submissions.
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id          text primary key,
  name        text        not null default '',
  email       text        not null default '',
  subject     text        not null default '',
  message     text        not null default '',
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists messages_read_idx on public.messages (read);

-- ---------------------------------------------------------------------------
-- Students panel tables.
-- ---------------------------------------------------------------------------
create table if not exists public.students (
  id              text primary key,
  name            text        not null default '',
  email           text        not null default '',
  enrolled_course text        not null default '',
  created_at      timestamptz not null default now()
);

create table if not exists public.courses (
  id          text primary key,
  title       text        not null default '',
  seats       integer     not null default 0,
  active      boolean     not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.admin_posts (
  id          text primary key,
  title       text        not null default '',
  author      text        not null default '',
  category    text        not null default 'Announcements',
  excerpt     text        not null default '',
  content     text        not null default '',
  image_url   text        not null default '',
  status      text        not null default 'Draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,
  constraint admin_posts_status check (status in ('Draft', 'Published'))
);

-- ---------------------------------------------------------------------------
-- Reordering indexes.
-- ---------------------------------------------------------------------------
create index if not exists socials_position_idx      on public.socials (position);
create index if not exists nav_items_position_idx    on public.nav_items (position);
create index if not exists skill_categories_pos_idx  on public.skill_categories (position);
create index if not exists projects_position_idx     on public.projects (position);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
-- The Express server holds the service_role key, so every request it makes
-- skips these policies. They are the second lock on the door: if the anon key
-- or a leaked user token ever reaches a browser, the rules below still hold.
--
--   anonymous visitor  ->  read published content, submit a contact message
--   signed-in admin    ->  read everything, create / edit / delete anything
--   nobody else        ->  nothing
--
-- The admin panels call these endpoints through the server, so both roles are
-- also enforced a second time by middleware/portfolio-auth.js.
-- ===========================================================================

alter table public.profile          enable row level security;
alter table public.socials          enable row level security;
alter table public.nav_items        enable row level security;
alter table public.skill_categories enable row level security;
alter table public.projects         enable row level security;
alter table public.portfolio_posts  enable row level security;
alter table public.messages         enable row level security;
alter table public.students         enable row level security;
alter table public.courses          enable row level security;
alter table public.admin_posts      enable row level security;

-- ---------------------------------------------------------------------------
-- Public reads.
--
-- Only the blog carries a draft state, so `portfolio_posts` is the one table
-- whose public policy filters on `status`. Everything else (profile, socials,
-- nav_items, skill_categories, projects) is content the admin has already
-- chosen to publish, so "public" simply means "readable".
-- ---------------------------------------------------------------------------

drop policy if exists "profile is public"          on public.profile;
create policy "profile is public" on public.profile
  for select using (true);

drop policy if exists "socials are public"          on public.socials;
create policy "socials are public" on public.socials
  for select using (true);

drop policy if exists "nav items are public"        on public.nav_items;
create policy "nav items are public" on public.nav_items
  for select using (true);

drop policy if exists "skill categories are public" on public.skill_categories;
create policy "skill categories are public" on public.skill_categories
  for select using (true);

drop policy if exists "projects are public"         on public.projects;
create policy "projects are public" on public.projects
  for select using (true);

-- Only published posts are public; drafts stay admin-only.
drop policy if exists "published posts are public"  on public.portfolio_posts;
create policy "published posts are public" on public.portfolio_posts
  for select using (status = 'Published');

-- ---------------------------------------------------------------------------
-- Contact form: anyone may submit, nobody may read or delete.
-- ---------------------------------------------------------------------------

drop policy if exists "anyone can send a message"   on public.messages;
create policy "anyone can send a message" on public.messages
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- Writes: signed-in Supabase users only.
--
-- `to authenticated()` means a request carrying a valid Supabase access token
-- for a confirmed user - which is exactly what middleware/supabase-session.js
-- hands out after a successful login. The project has a single operator, so
-- every confirmed user is an admin; see README.md ("Restricting who can sign
-- in") if you ever need a tighter allowlist.
--
-- `messages` intentionally gets insert for anonymous visitors too, so the
-- contact form keeps working, and nothing more.
-- ---------------------------------------------------------------------------

do $$
declare
  target text;
begin
  foreach target in array array[
    'profile', 'socials', 'nav_items', 'skill_categories', 'projects',
    'portfolio_posts', 'messages', 'students', 'courses', 'admin_posts'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', 'admins manage ' || target, target);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      'admins manage ' || target,
      target
    );
  end loop;
end
$$;

commit;

-- ===========================================================================
-- Done. Next, from the project folder:
--
--   1. npm install
--   2. paste the three keys into .env
--   3. npm run migrate -- --dry-run   # see what would be imported
--      npm run migrate                # move data/*.json into Supabase
--   4. npm run seed -- --email you@example.com --password "yourpassword"
--   5. npm start                     then check http://localhost:3000/api/health
-- ===========================================================================