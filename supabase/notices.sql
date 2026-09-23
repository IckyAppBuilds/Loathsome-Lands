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

-- Deliberately no update policy for the authenticated/anon roles — players
-- can't edit a posted notice. Moderation of a LIVE notice is still just
-- deleting the row directly in the Supabase table editor (service_role,
-- bypasses RLS) rather than an in-game moderation UI.
--
-- Deleting a STALE notice (24h+ old) is allowed for anyone, signed in or
-- not — loadNotices() (noticeboard.js) fires this delete every time a
-- player opens the board, which is what actually keeps the board tidy
-- (see the removed pg_cron job below for why the old approach didn't).
-- The `using` clause is the entire safety net: it only ever matches rows
-- already past the cutoff, so this can't be used to delete someone else's
-- live notice no matter who calls it.
create policy "Stale notices can be deleted by anyone"
   on public.notices for delete
   using (created_at < now() - interval '24 hours');

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

-- A previous version of this file scheduled a daily pg_cron wipe here
-- instead. Dropped: pg_cron needs its extension manually toggled on in
-- the Supabase dashboard (Database -> Extensions) before `cron.schedule`
-- does anything, so on a project where that toggle was never flipped the
-- job silently never ran — "auto remove" quietly stopped working with no
-- error anywhere. Replaced with the DELETE policy above, which
-- loadNotices() (noticeboard.js) exercises every time a player opens the
-- board — no extension, no schedule, nothing that can silently not-run.
--
-- If you already ran the old version of this file on a live project, the
-- job is still scheduled there (re-running this file doesn't remove it)
-- — clean it up once with:
--   select cron.unschedule('wipe-notice-board-daily');
