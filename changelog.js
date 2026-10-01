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
   { id: 26, date: 'October 1', title: 'The Prism Depths Pays Out Properly', items: [
      "Fixed: every dungeon's guaranteed epic treasure was only carrying one stat — now each one rolls with three extra secondary stats too, so an epic drop actually outclasses a lucky rare find like it should.",
      ]},
   { id: 25, date: 'October 1', title: 'Dungeon Combat, Cleaned Up', items: [
      "Fixed: the Dungeon Board (and its Enter/Leave buttons) no longer stay stuck on screen once you're actually fighting inside a dungeon — it now looks like a normal fight, same as everywhere else.",
      "New: a progress bar now shows how far into the current dungeon run you are, stage by stage.",
      ]},
   { id: 24, date: 'October 1', title: 'One Spell or Item Per Turn', items: [
      "Fixed: casting a heal/ward/buff/shout spell mid-combat (Stubborn Recovery, Warding Charm, Shout, Adrenaline Rush, etc.) no longer skips the monster's turn — it now costs the same one turn an Attack or a damage spell already did, so the monster always gets to act.",
      "Outside combat, from the Character page, casting those same spells is unaffected and still completely free.",
      ]},
   { id: 23, date: 'October 1', title: 'Act 3 Begins: the Prism Depths', items: [
      "New: beneath the Crystal City lies the Prism Depths — the first of Act 3's repeatable themed dungeons. Clear one for guaranteed treasure and a new currency, Prism Shards, then run it again as many times as you like.",
      "Three dungeons open to start: Embercrypt, Frostvault, and Stormreach — each with its own trio of guardians, its own boss, and its own themed reward.",
      "This is the start of a much bigger endgame — more dungeons are coming.",
      ]},
   { id: 22, date: 'October 1', title: 'The Bounty Board Never Closes', items: [
      "The Bounty Board's daily claim cap is gone — work it as many times as you want in a single day, no more \"board's empty until tomorrow.\"",
      ]},
   { id: 21, date: 'September 30', title: 'The Bestiary', items: [
      "New: the Bestiary, a Character-page log of every creature you've ever defeated — 92 entries, every regular monster and every named boss. Undefeated ones just show as \"???\" so nothing gets spoiled early.",
      "Defeat every single one and the Guild wires over a congratulatory bonus.",
      "Every adventuring zone now also has its own rare, always-findable creature on top of whatever quest bosses already lurk there — including the Clockwork Quarry, the Choir, and the Crystal City, which never had one before.",
      ]},
   { id: 20, date: 'September 30', title: 'Every Class Gets a Moment', items: [
      "Meatheads can now land a staggering blow that skips the monster's own counterattack entirely — training your Class Skill raises the odds.",
      "Hexperts can now echo a damage spell for a free extra hit at half power, no added MP cost — same Class Skill training raises that too.",
      "Card Shark's own double-attack chance (and both of the above) got a clearer, more noticeable curve — 5%/10%/15% per Class Skill level instead of 1%/2%/3%.",
      ]},
   { id: 19, date: 'September 30', title: 'Every Monster Has a Trick', items: [
      "Every regular monster in the game can now pull off a move of its own mid-fight — a heal, a rallying second wind, or a bigger one-off hit — not just named bosses anymore.",
      "Nothing drastic: it's rarer and smaller than what a boss can do, just enough that the same old monster doesn't always play out the same old way.",
      ]},
   { id: 18, date: 'September 30', title: 'Weapons Are For Hitting Things', items: [
      "Weapons no longer carry an armor bonus — that was never the point of a weapon. Already-owned weapons with armor on them lose it automatically next time you log in; every other stat they carry is untouched.",
      ]},
   { id: 17, date: 'September 30', title: 'Armor Classes', items: [
      "Gear now belongs to a class: Meatheads wear Heavy gear, Card Sharks wear Medium, Hexperts wear Light — each protects a different amount, and you can only equip your own.",
      "Already got something on that doesn't match? It's grandfathered in — nothing gets stripped off, the restriction just applies to what you equip from here on.",
      "Armor's protective value now also climbs with an item's level requirement, same as every other stat already does — not just its rarity.",
      ]},
   { id: 16, date: 'September 30', title: 'Zip Cuts Both Ways', items: [
      "Zip is now accuracy too, not just dodge. Your own zip cancels out some of a slippery monster's dodge chance when you attack — and a fast monster's zip does the same to you.",
      ]},
   { id: 15, date: 'September 30', title: 'Know Before You Equip', items: [
      "The Pack now compares each item's stats against whatever you've got equipped in that slot — green for an upgrade, red for a downgrade, right on each stat line.",
      ]},
   { id: 14, date: 'September 30', title: 'See What You\'re Selling', items: [
      "The Sell tab now shows an item's full stats before you sell it, same as the Pack and your Equipment screen — no more selling gear blind.",
      ]},
   { id: 13, date: 'September 30', title: 'Every Piece of Gear Has Armor Now', items: [
      "Armor isn't a maybe on gear anymore — every single item you find, buy, or start with carries a guaranteed amount, scaled to its own rarity. Higher-tier gear carries more.",
      "Already-owned gear picks this up automatically the next time you log in.",
      ]},
   { id: 12, date: 'September 28', title: 'Armor, Everywhere', items: [
      "Armor isn't just for a handful of bosses anymore — every single monster in the game now carries some, scaled to how tough it already is. The toughest fights carry noticeably more of it than a wild encounter of similar strength.",
      ]},
   { id: 11, date: 'September 28', title: 'Armor Enters the Fray', items: [
      "New: Armor. A handful of tough bosses (the Gnome King, the warren-mother, and others) now carry real armor that blunts every hit — and gear can now roll it too, so you can start building some of your own.",
      "Every monster in the game now runs on the same kind of stats you do (Beef, Zip, Grit) instead of hidden numbers — a big step toward being able to tune fights more precisely going forward.",
      ]},
   { id: 10, date: 'September 28', title: 'A Reason to Come Back Tomorrow', items: [
      "New: a daily login bonus. Log in on consecutive days for an escalating Pop Tabs/Biscuits reward, topping out with a Bounty Tokens bonus every 7th day.",
      "Miss a single day and your streak survives — miss two in a row and it resets.",
      ]},
   { id: 9, date: 'September 28', title: 'Every Quest Feeds the Habit', items: [
      "Every quest turn-in now hands over some extra Biscuits, not just the first few — the reward climbs alongside each quest's own Pop Tabs and XP, all the way up to Breaking Through.",
      ]},
   { id: 8, date: 'September 28', title: 'A Fuller Pack, Early On', items: [
      "The first few quests — Gaffer Thistlewick's rake tines, hunting the gnome commander, and the Hoodoo Doctor's potion — now also hand over some extra Biscuits, on top of their usual Pop Tabs and XP.",
      ]},
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
   /* Pre-existing bug, fixed in passing: this never reset
   changelogEntriesShown, so if a login had only partially caught up
   (checkChangelogOnLogin() narrowed it to just the unseen entries), the
   NEXT manual "What's New" reopen (openChangelog()) would keep showing
   that same stale partial list forever instead of the full history its
   own doc comment promises — renderChangelog()'s fallback to the full
   CHANGELOG only ever triggers when this is empty. */
   changelogEntriesShown = [];
   /* If checkDailyStreakOnLogin() (dailystreak.js) also granted a reward
   this same login, it deferred showing its own popup until this one
   closed — do that now. A no-op if there's nothing pending. */
   maybeShowDailyStreakPopup();
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
