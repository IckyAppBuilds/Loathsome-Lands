/* ---------------- Town Notice Board (the Fountain) ---------------- */
/* Public, asynchronous player-to-player interaction — see
supabase/notices.sql for the table/RLS/rate-limit this depends on
(public.notices: read by everyone, insert-your-own-row-only, a 140-char
CHECK constraint, and a real server-side rate-limit trigger). Reading
works for anyone, including a guest with no account. Posting needs a
real Supabase session (acctSession, core.js) since a row's user_id must
satisfy auth.uid() = user_id under RLS — playAsGuest() (auth.js) never
sets one, so a guest is steered to register instead of hitting an RLS
rejection with a confusing error. */

let noticeBoardMessages = []; /* last fetch's results — not saved, always a fresh read on entering */
let noticeBoardLoading = false;
let noticeBoardError = null;

function enterNoticeBoard(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'noticeboard';
   clearLog();
   log("You step up to the old fountain. Someone's tacked a corkboard to the rim — half the town's business gets settled here.");
   loadNotices();
   render();
}
function leaveNoticeBoard(){
   if(state.inCombat || state.location !== 'noticeboard') return;
   state.location = 'town';
   clearLog();
   render();
}

/* How long a notice sticks around — anything older gets swept on the next
board visit (see the delete below). Matches the "Stale notices can be
deleted by anyone" RLS policy's own cutoff (supabase/notices.sql); keep
the two in sync if this ever changes, since the client can't delete a
notice the policy doesn't also consider stale. */
const NOTICE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

async function loadNotices(){
   if(!sb) return;
   noticeBoardLoading = true;
   noticeBoardError = null;
   renderNoticeBoard();
   /* Best-effort cleanup on every visit — replaces a previous pg_cron
   daily wipe (supabase/notices.sql) that needed its extension manually
   enabled in the Supabase dashboard and silently never ran otherwise.
   Result/error intentionally ignored: the RLS policy only allows this
   to touch rows already past the cutoff no matter who calls it, so
   there's nothing to check for and nothing unsafe about firing it from
   every client, guest or not — if it fails for some other reason (a
   network hiccup), the board still loads and just tries again next
   visit rather than blocking the read on it. */
   await sb.from('notices').delete().lt('created_at', new Date(Date.now() - NOTICE_MAX_AGE_MS).toISOString());
   const { data, error } = await sb.from('notices')
      .select('id, user_id, username, message, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
   noticeBoardLoading = false;
   if(error){ noticeBoardError = error.message; noticeBoardMessages = []; }
   else { noticeBoardMessages = data || []; }
   renderNoticeBoard();
}

/* Standard safe-escaping trick: round-trip the untrusted string through a
detached element's textContent, then read back the browser's own HTML-
entity-encoded innerHTML. Every other string this game renders is either
dev-authored flavor text or a value from a fixed, code-defined item/
monster table — notices are the first genuinely arbitrary, other-player-
supplied text in the whole codebase, so this is the one place that
actually needs it. */
function escapeHtml(str){
   const div = document.createElement('div');
   div.textContent = str;
   return div.innerHTML;
}

async function postNotice(){
   if(!sb || !acctSession) return;
   const input = document.getElementById('noticeboard-input');
   const statusEl = document.getElementById('noticeboard-status');
   if(!input) return;
   const message = input.value.trim();
   if(!message || message.length > 140) return;
   const postBtn = document.getElementById('noticeboard-post-btn');
   if(postBtn) postBtn.disabled = true;
   if(statusEl) statusEl.textContent = 'Posting...';
   const { data: { user } } = await sb.auth.getUser();
   const { error } = await sb.from('notices').insert({ user_id: user.id, username: acctUsername, message });
   if(postBtn) postBtn.disabled = false;
   if(error){
      /* enforce_notice_rate_limit() (supabase/notices.sql) raises this exact
      text on a too-soon repost — surfaced as a friendlier line rather than
      the raw Postgres error. */
      if(statusEl) statusEl.textContent = error.message.includes('Too many notices')
         ? "You've pinned something up recently — give it a few minutes before posting again."
         : `Couldn't post: ${error.message}`;
      return;
   }
   input.value = '';
   if(statusEl) statusEl.textContent = 'Pinned to the board!';
   loadNotices();
}

/* Deletes a notice the signed-in player posted themselves — the "Delete"
button renderNoticeBoard() below only ever shows on a notice whose
user_id matches acctSession's own id, but the real gate is the "Users
can delete their own notices" RLS policy (notices.sql): auth.uid() must
equal the row's user_id, so this can't be used on anyone else's notice
even via a crafted call. Optimistically drops it from the local list
immediately rather than waiting on a full loadNotices() round trip. */
async function deleteNotice(id){
   if(!sb || !acctSession) return;
   const { error } = await sb.from('notices').delete().eq('id', id);
   if(error){
      const statusEl = document.getElementById('noticeboard-status');
      if(statusEl) statusEl.textContent = `Couldn't delete: ${error.message}`;
      return;
   }
   noticeBoardMessages = noticeBoardMessages.filter(n => n.id !== id);
   renderNoticeBoard();
}

/* Short relative age ("just now"/"N min ago"/"N hr ago") for a notice's
created_at, shown next to the poster's name — matches the mental model
the board's own 24h cleanup (loadNotices()) already sets up ("how
stale is this"), rather than an absolute clock time that'd need the
reader to do that math themselves. */
function formatNoticeAge(createdAt){
   const ms = Date.now() - new Date(createdAt).getTime();
   const min = Math.floor(ms / 60000);
   if(min < 1) return 'just now';
   if(min < 60) return `${min} min ago`;
   const hr = Math.floor(min / 60);
   return `${hr} hr${hr===1?'':'s'} ago`;
}

function renderNoticeBoard(){
   const listEl = document.getElementById('noticeboard-list');
   if(!listEl) return;
   if(noticeBoardLoading){
      listEl.innerHTML = '<div class="quest-desc">Reading the corkboard...</div>';
   } else if(noticeBoardError){
      listEl.innerHTML = `<div class="quest-desc">Couldn't read the board: ${escapeHtml(noticeBoardError)}</div>`;
   } else if(noticeBoardMessages.length === 0){
      listEl.innerHTML = '<div class="quest-desc">Nothing pinned up yet. Be the first.</div>';
   } else {
      const myId = acctSession && acctSession.user ? acctSession.user.id : null;
      listEl.innerHTML = noticeBoardMessages.map(n => `
      <div class="quest-log-entry notice-entry">
      <div style="flex:1;">
      <div class="quest-name">${escapeHtml(n.username)}</div>
      <div class="quest-desc">${escapeHtml(n.message)}</div>
      <div class="quest-progress">${formatNoticeAge(n.created_at)}</div>
      </div>
      ${myId && n.user_id === myId ? `<button class="btn-secondary notice-delete-btn" onclick="deleteNotice(${n.id})">Delete</button>` : ''}
      </div>`).join('');
   }
   const postEl = document.getElementById('noticeboard-post');
   const guestHintEl = document.getElementById('noticeboard-guest-hint');
   if(postEl) postEl.style.display = acctSession ? 'block' : 'none';
   if(guestHintEl) guestHintEl.style.display = acctSession ? 'none' : 'block';
}

function updateNoticeBoardCharCount(){
   const input = document.getElementById('noticeboard-input');
   const counter = document.getElementById('noticeboard-charcount');
   if(!input || !counter) return;
   counter.textContent = `${input.value.length}/140`;
}
