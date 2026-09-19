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

async function loadNotices(){
   if(!sb) return;
   noticeBoardLoading = true;
   noticeBoardError = null;
   renderNoticeBoard();
   const { data, error } = await sb.from('notices')
      .select('username, message, created_at')
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
      listEl.innerHTML = noticeBoardMessages.map(n => `
      <div class="quest-log-entry">
      <div class="quest-name">${escapeHtml(n.username)}</div>
      <div class="quest-desc">${escapeHtml(n.message)}</div>
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
