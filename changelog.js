/* ---------------- Login changelog ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md). Pure data + a small self-contained overlay,
same shape as tutorial.js — no other file needs to know this exists
except the one call site that triggers it (enterGameAfterAuth(), auth.js)
and the one that lets a player reopen it on demand (renderAccountTab(),
auth.js).

CHANGELOG is newest-first; CHANGELOG_LATEST_ID is just its first entry's
own id. Only ever grows at the front — an entry's id, once shipped,
never changes, since state.lastSeenChangelogVersion (core.js/save.js)
is a saved player-specific number compared against it. */
const CHANGELOG = [
   { id: 7, date: 'September 28', title: 'Hexpert: Illusion & Deepened Spells', items: [
      "New Hexpert spell at the Arcane Sanctum: Illusion — split into flickering copies of yourself for a big dodge boost, same trick as a Card Shark's Smoke Screen.",
      "New at the Arcane Sanctum: pay Pop Tabs to deepen any spell you already know to Level 2, permanently boosting its own effect by 45%.",
      ]},
   { id: 6, date: 'September 27', title: 'Breaking Through', items: [
      'New quest at the Gnome Guild: "Breaking Through" — the Mole Wars arc\'s real capstone. Build a drilldozer out of three parts, gathered three completely different ways.',
      "New zone: the Crystal City, reached through a new tile in the Ember Warren once the drilldozer breaks through. Something down there isn't Mole-built.",
      "The Tinker's Workshop now sells a drive shaft, if you've got the Pop Tabs and Bounty Tokens for it.",
      ]},
   { id: 5, date: 'September 26', title: 'The Mole Wars Continue', items: [
      'Three new quests at the Gnome Guild: "Quenched," "What the Vault Was Guarding," and "The Warren Answers" — a harder arc that closes out the Mole Wars so far.',
      "Bosses can now freeze you, sapping your own damage for a few attacks — joining burn and poison as the third status effect.",
      'Two brand new gauntlets — scripted, multi-fight showdowns in the Ledger Vault and the Gearworks, the same style as the Palace Gate finale from Act One.',
      "The Warren-Mother, staged at the very end of it all, is the hardest single fight since the Gnome King himself.",
      ]},
   { id: 4, date: 'September 26', title: 'Act 2 Gets Harder', items: [
      "Every Mole Wars zone hits a lot harder now — Root Cellar/Bureau, the Mudflats, the Warren's Ear, and the Ember Warren all jump 50-60% on top of last patch's own bump. Tempering was still making these zones too easy; this is the correction.",
      "The Garrison, Rogues' Den, Arcane Sanctum, and the Palace are untouched — that's Act 1 finale content, not the Mole Wars.",
      ]},
   { id: 3, date: 'September 26', title: 'Tempering Gets Teeth', items: [
      "Every zone from the Sewers onward hits a little harder now — gear tempering gave every zone's own power ceiling real headroom, so the difficulty curve finally uses it.",
      'New quest at the Gnome Guild: "Chain of Custody" — follow the Ember Warren\'s own shipments back to a familiar face in the Bureau.',
      "Bosses can now inflict burn or poison — lingering damage that plays out over a few of your own attacks. Two new named bosses in the Ember Warren debut it.",
      ]},
   { id: 2, date: 'September 25', title: 'The Ember Warren', items: [
      'New quest at the Gnome Guild: "Loose Ends" — tie off the one lead the Warren\'s Ear left dangling.',
      'New zone beyond Mudroot Warren: the Ember Warren, with two districts — the Foundry and the Gearworks.',
      "Gear no longer stacks in your Pack or Sell tab. Two drops that share a name but roll different stats now always show up as two separate items.",
      "Fixed: the Guild building's own quest flag was silently skipping one of its quests — it now correctly flags every quest it offers.",
      ]},
   { id: 1, date: 'September 24', title: 'Gear Tempering', items: [
      "New: temper your equipped gear at the Tinker's Workshop, spending Bounty Tokens to permanently boost its stats, up to +5.",
      "Fixed: a dropped item's level requirement now tracks the zone it dropped in, not how lucky the rarity roll happened to get.",
      ]},
   ];
const CHANGELOG_LATEST_ID = CHANGELOG[0].id;

let changelogEntriesShown = [];

/* Called once from enterGameAfterAuth(loaded===true) (auth.js) — a
returning player whose save actually predates the newest entry(ies).
Never fires for a brand-new character (nothing to have missed yet) or
a guest (nothing persists for them to compare against) — see that
call site's own comment. A save from before this feature existed has
lastSeenChangelogVersion === null/undefined, which is treated as
"everything is new" so a long-time player gets one full catch-up
rather than silently skipping straight to caught-up. */
function checkChangelogOnLogin(){
   const lastSeen = state.lastSeenChangelogVersion;
   if(lastSeen === CHANGELOG_LATEST_ID) return;
   changelogEntriesShown = (lastSeen === null || lastSeen === undefined)
      ? CHANGELOG.slice()
      : CHANGELOG.filter(e => e.id > lastSeen);
   if(changelogEntriesShown.length === 0) return;
   openChangelog();
}

/* Reachable any time via the Account tab's own "🗞 What's New" button
(renderAccountTab(), auth.js), same "revisit on demand" affordance the
tutorial's "📖 How to Play" button already has — always shows the FULL
list on a manual reopen, not just whatever's unseen, since the player
explicitly asked to see it. */
function openChangelog(){
   closeAllDrawers();
   renderChangelog();
   const el = document.getElementById('changelog-screen');
   if(el) el.style.display = 'flex';
}

function closeChangelog(){
   const el = document.getElementById('changelog-screen');
   if(el) el.style.display = 'none';
   /* Only actually advances the saved marker the first time this closes
   after a real login-triggered open — reopening manually later (with
   the full list re-shown) harmlessly re-writes the same already-caught-up
   value, so no separate flag is needed to distinguish the two triggers. */
   if(state.lastSeenChangelogVersion !== CHANGELOG_LATEST_ID){
      state.lastSeenChangelogVersion = CHANGELOG_LATEST_ID;
      autosave();
   }
}

function renderChangelog(){
   const entries = changelogEntriesShown.length ? changelogEntriesShown : CHANGELOG;
   const body = document.getElementById('changelog-body');
   if(body){
      body.innerHTML = entries.map(e => `
      <div class="changelog-entry">
      <div class="changelog-entry-date">${e.date}</div>
      <div class="changelog-entry-title">${e.title}</div>
      <ul class="changelog-list">${e.items.map(line => `<li>${line}</li>`).join('')}</ul>
      </div>`).join('');
   }
}
