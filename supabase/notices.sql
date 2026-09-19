-- Town Notice Board — run this once in the Supabase SQL editor
-- (Project -> SQL Editor -> New query -> paste -> Run).
--
-- One new table, public read / own-row-only insert, a length cap enforced
-- server-side (not just client-side), and a real per-user rate-limit
-- trigger — a client-side-only cooldown is trivially bypassed by hitting
-- the Supabase REST API directly with the anon key, so the limit has to
-- live here to actually mean anything.

create table if not exists public.notices (
   id bigint generated always as identity primary key,
   user_id uuid not null references auth.users(id) on delete cascade,
   username text not null,
   message text not null check (char_length(message) between 1 and 140),
   created_at timestamptz not null default now()
);

-- Board reads are always "most recent N" — index the sort column so that
-- stays fast as the table grows. The rate-limit trigger below also filters
-- by (user_id, created_at), so it benefits from this composite index too.
create index if not exists notices_created_at_idx on public.notices (created_at desc);
create index if not exists notices_user_id_created_at_idx on public.notices (user_id, created_at desc);

alter table public.notices enable row level security;

-- Anyone can read the board, including a guest with no account — reading
-- has no abuse surface and the game's "browse before you commit" guest
-- mode should still show it.
create policy "Notices are viewable by everyone"
   on public.notices for select
   using (true);

-- Only a signed-in user can post, and only as themselves — this is the
-- standard Supabase RLS pattern for "insert your own row."
create policy "Users can insert their own notices"
   on public.notices for insert
   with check (auth.uid() = user_id);

-- Deliberately no update/delete policy for the authenticated/anon roles —
-- players can't edit or remove a posted notice. Moderation for now is
-- just deleting a row directly in the Supabase table editor (that runs as
-- service_role, which bypasses RLS entirely) rather than building an
-- in-game moderation UI before this actually needs one.

-- Real per-user rate limit: raises and aborts the insert if this user
-- already has a notice newer than 10 minutes. Runs server-side as a
-- trigger so it can't be bypassed by calling the REST API directly.
create or replace function public.enforce_notice_rate_limit()
returns trigger as $$
begin
   if exists (
      select 1 from public.notices
      where user_id = new.user_id
         and created_at > now() - interval '10 minutes'
   ) then
      raise exception 'Too many notices — wait a bit before posting again.';
   end if;
   return new;
end;
$$ language plpgsql security definer;

drop trigger if exists notices_rate_limit on public.notices;
create trigger notices_rate_limit
   before insert on public.notices
   for each row execute function public.enforce_notice_rate_limit();

-- Daily wipe, 4am server (database) time -- "a janitor comes and cleans
-- it." pg_cron schedules run against the database's own TimeZone setting,
-- which is UTC by default on Supabase and not something most projects
-- change, so in practice this is 4am UTC. Requires the pg_cron extension
-- (Database -> Extensions -> enable "pg_cron" in the dashboard, or the
-- `create extension` line below if your role has permission to run it
-- directly -- on hosted Supabase this usually needs the dashboard toggle
-- instead, since pg_cron enablement is one of the few things not always
-- exposed to the SQL editor's default role).
create extension if not exists pg_cron;

select cron.schedule(
   'wipe-notice-board-daily',
   '0 4 * * *',
   $$ delete from public.notices; $$
);
