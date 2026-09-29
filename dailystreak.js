/* ---------------- Daily login streak ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md) — pure data + a small self-contained overlay, same
shape as changelog.js/tutorial.js. Built per explicit direction to give
players a reason to open the game again tomorrow that isn't just "Biscuits
finished refilling" (the ONLY real-time pacing mechanic that existed
before this) — a login-streak reward with a one-day grace period, so
missing a single day doesn't reset it but missing two in a row does.

DAILY_STREAK_REWARDS is a 7-entry table, escalating across a week with a
bigger milestone on day 7 — state.dailyStreakCount (core.js) counts UP
indefinitely so a returning player can see "Day 12!", but the actual
reward tier cycles back through these same 7 entries every week via
((dailyStreakCount-1) % 7). */
const DAILY_STREAK_REWARDS = [
   { popTabs: 10, biscuits: 10 },
   { popTabs: 15, biscuits: 15 },
   { popTabs: 20, biscuits: 15 },
   { popTabs: 25, biscuits: 20 },
   { popTabs: 30, biscuits: 20 },
   { popTabs: 40, biscuits: 25 },
   { popTabs: 75, biscuits: 40, bountyTokens: 10 }, /* day 7 -- the weekly milestone */
   ];

/* Set by checkDailyStreakOnLogin() below once a reward has actually been
granted this login, and cleared once the popup showing it closes. Plain
transient module state, never saved — same convention as
changelogEntriesShown (changelog.js) or combatSubView (combat.js). Holding
it here (rather than showing the popup immediately) is what lets this
politely wait for the "What's New" changelog to close first if that
ALSO has something to show this same login — see maybeShowDailyStreakPopup()
below. */
let pendingDailyStreakReward = null;

/* Called once from enterGameAfterAuth() (auth.js), right alongside
checkChangelogOnLogin() — for BOTH a returning player's load AND a
brand-new character's first-ever session (a fresh character's very first
day should still count as "Day 1"), but never for a guest, since
enterGameAfterAuth() itself is never reached by playAsGuest() (it calls
startFreshGame() directly). Grants the reward and updates state
immediately regardless of whether the popup can be shown right away —
the popup is just a notification of something that already happened, not
a claim action. */
function checkDailyStreakOnLogin(){
   const todayKey = new Date().toDateString();
   if(state.lastLoginRewardDateKey === todayKey) return; /* already granted today -- e.g. logging out and back in */

   /* One-day grace: a gap of 1 (logged in the very next day) or 2
   (missed exactly one day) both continue the streak; a gap of 3+ (missed
   two or more days in a row) resets it. A gap can only be computed
   against a previous date, so a null lastLoginRewardDateKey (a brand-new
   character, or a save from before this field existed) always starts
   fresh at day 1 -- there's nothing to have a "gap" from yet. */
   const daysSinceLast = state.lastLoginRewardDateKey
      ? Math.round((new Date(todayKey) - new Date(state.lastLoginRewardDateKey)) / 86400000)
      : null;
   state.dailyStreakCount = (daysSinceLast !== null && daysSinceLast <= 2) ? state.dailyStreakCount + 1 : 1;
   state.lastLoginRewardDateKey = todayKey;

   const reward = DAILY_STREAK_REWARDS[(state.dailyStreakCount - 1) % DAILY_STREAK_REWARDS.length];
   state.popTabs += reward.popTabs;
   state.adventures += reward.biscuits; /* uncapped, same as every other currency reward -- see spellUpgradeCost()'s sibling comments elsewhere for why a reward claimed near a cap is allowed to push over it rather than being wasted */
   if(reward.bountyTokens) state.bountyTokens += reward.bountyTokens;

   pendingDailyStreakReward = { day: state.dailyStreakCount, reward };
   autosave();
}

/* Shows the popup immediately UNLESS the "What's New" changelog overlay
is currently up (checkChangelogOnLogin() may have just opened it this
same login) -- in that case this politely waits, and closeChangelog()
(changelog.js) calls this same function again once the player dismisses
it. Safe to call with nothing pending (checkChangelogOnLogin() never ran,
or the reward was already shown) -- it's just a no-op then. */
function maybeShowDailyStreakPopup(){
   if(!pendingDailyStreakReward) return;
   const changelogEl = document.getElementById('changelog-screen');
   if(changelogEl && changelogEl.style.display === 'flex') return; /* wait for it to close first */
   openDailyStreakPopup();
}

function openDailyStreakPopup(){
   renderDailyStreakPopup();
   const el = document.getElementById('daily-streak-screen');
   if(el) el.style.display = 'flex';
}

function closeDailyStreakPopup(){
   const el = document.getElementById('daily-streak-screen');
   if(el) el.style.display = 'none';
   pendingDailyStreakReward = null;
}

function renderDailyStreakPopup(){
   const body = document.getElementById('daily-streak-body');
   if(!body || !pendingDailyStreakReward) return;
   const { day, reward } = pendingDailyStreakReward;
   const isMilestone = day % DAILY_STREAK_REWARDS.length === 0;
   const parts = [`+${reward.popTabs} Pop Tabs`, `+${reward.biscuits} Biscuits`];
   if(reward.bountyTokens) parts.push(`+${reward.bountyTokens} Bounty Tokens`);
   body.innerHTML = `
   <div class="streak-day-badge">Day ${day}${day > 1 ? ' streak' : ''}</div>
   <div class="streak-reward-line">${parts.join(', ')}</div>
   ${isMilestone ? '<div class="streak-milestone-note">A full week! Keep it going.</div>' : ''}
   `;
}
