/* Casino (enterCasino/leaveCasino/Blackjack/claimCasinoWinnings) and
the class-capstone Trial (acceptClassQuest through levelUpClassSkill)
used to live in this file too — split out into casino.js/class-trial.js
respectively (both were fully self-contained, no calls into anything
below). What's left here is the Guild itself (Act 1 + Act 2), the
Bounty Board, and the Palace gauntlet. */

function enterGuild(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'guild';
   clearLog();
   /* Act 2: the guild hall itself moved to Gnometropolis the moment
   quest7Complete flipped true (enterGnomeGuild(), below) — this
   building becomes a dead end, same shape as every other hard-gated
   no-further-content screen in this codebase. Checked first, ahead of
   every quest6/quest7-flavored branch below, since quest7Complete
   already implies all of them are long since resolved anyway. */
   if(state.quest7Complete){
      log("The guild hall's mostly cleared out. A hand-lettered sign points toward Gnometropolis: \"Guild's moved — ask for the guildmaster there.\"");
      render();
      return;
   }
   if(state.quest6Complete){
      log("You step into the guild hall. The guildmaster raises a glass in your direction — Gnometropolis, toppled, more or less, thanks to you.");
   } else if(state.quest6Accepted){
      log(state.quest6RareDefeated
          ? "You step into the guild hall, the Gnome King's throne room still vivid in your memory."
          : "You step into the guild hall. The guildmaster asks if you've found the Gnome King yet.");
   } else if(state.quest5Complete){
      log("You step into the guild hall. The guildmaster's eyes light up at the mention of the Vault.");
   } else if(state.quest2Complete){
      log("You step into the guild hall. The guildmaster nods at you approvingly.");
   } else if(state.quest2Accepted){
      log(state.commanderDefeated
          ? "You step into the guild hall, commander's defeat fresh in your memory."
          : "You step into the guild hall. The guildmaster asks if you've found him yet.");
   } else if(state.questComplete){
      log("You step into the guild hall. The guildmaster looks up with sudden interest.");
   } else {
      log("You step into the guild hall. The guildmaster barely glances up.");
   }
   render();
}

function leaveGuild(){
   if(state.inCombat || state.location !== 'guild') return;
   state.location = 'town';
   clearLog();
   render();
}

function acceptQuest2(){
   if(state.location !== 'guild' || !state.questComplete || state.quest2Accepted || state.quest2Complete) return;
   state.quest2Accepted = true;
   clearLog();
   log("You accept the guild's quest: track down and defeat the gnome commander in the Overgrown Commons. He's rare — you'll have to keep adventuring and hope he shows himself.");
   render();
}

function reportCommanderKill(){
   if(state.location !== 'guild' || !state.quest2Accepted || state.quest2Complete || !state.commanderDefeated) return;
   state.quest2Complete = true;
   state.popTabs += 30;
   state.xp += 50;
   clearLog();
   log("You describe the fight in more detail than the guildmaster asked for. He hands over your reward regardless. (+30 Pop Tabs, +50 XP)");
   log("As you turn to leave, he adds: \"...and since you're clearly not afraid of gnomes, the sewers under the square are yours to deal with too, if you're feeling brave.\"");
   checkLevelUp();
   render();
   autosave();
}

/* ---------------- Quest 6: "The Gnome King's Throne" ---------------- */
/* Offered by the guildmaster once state.quest5Complete is true — same
"offered once a flag is true" shape as quest2/quest3/quest4/quest5.
Objective hunts the Vault (not Gnometropolis — that zone is the reward,
unlocked only once this quest is turned in) for the rare gnomeKingsCaptain
spawn (content.js), same mechanic as gnomeCommander/diggerBot. Retconned:
the target is the King's rear-guard captain, not the King himself — see
gnomeKingsCaptain's comment in content.js. Gnometropolis still unlocks on
turn-in exactly as before; only the flavor text changed, to set up quest 7
(the real gnomeKing, fled deeper into Gnometropolis). */
function acceptQuest6(){
   if(state.location !== 'guild' || !state.quest5Complete || state.quest6Accepted || state.quest6Complete) return;
   state.quest6Accepted = true;
   clearLog();
   log("You accept the guild's quest: track down and defeat the King's rear-guard captain, holding the line somewhere in the Sunless Vault. He's rare — you'll have to keep adventuring and hope he shows himself.");
   render();
}

function reportGnomeKingKill(){
   if(state.location !== 'guild' || !state.quest6Accepted || state.quest6Complete || !state.quest6RareDefeated) return;
   state.quest6Complete = true;
   state.popTabs += 50;
   state.xp += 70;
   clearLog();
   log("You describe the fight in the throne room in more detail than the guildmaster expected. He's practically speechless. (+50 Pop Tabs, +70 XP)");
   log("\"Gnometropolis,\" he finally says. \"The whole hidden gnome capital, right under the Vault. It's yours to explore now, if you're brave enough.\" A beat, then his face falls — the throne was already empty. \"The King got away, behind the palace gate at the heart of the city. There's clearly more to this than a captain guarding an empty chair.\" Gnometropolis is now open — check the Map.");
   checkLevelUp();
   render();
   autosave();
}

/* ---------------- Quest 7: "The Palace Gate" (Act 1 finale) ---------------- */
/* Offered by the guildmaster once quest 6 is complete AND the player has
already claimed a class via the Adventurer's Trial (state.classTitle) —
the palace-gate approach is class-specific (PALACE_GATE_GEAR, content.js),
so there's no way to even describe the quest to someone who hasn't chosen
a path yet. Same "silently no-op on an unmet gate" convention as every
other quest here — a later UI task surfaces a hint explaining the
classTitle requirement specifically. */
function acceptQuest7(){
   if(state.location !== 'guild' || !state.quest6Complete || !state.classTitle || state.quest7Accepted || state.quest7Complete) return;
   state.quest7Accepted = true;
   clearLog();
   log("\"The King fled behind the palace gate at the heart of Gnometropolis — it isn't just going to open for anyone,\" the guildmaster says. \"But the way in is shaped by who you've become. Head into the district that matches your path and prove yourself to whoever's guarding it — the gear you'll need is theirs to lose, not anyone's to sell.\"");
   render();
}

/* Turn-in for quest 7 — gated on approachPalaceGate() (below) having
already set state.quest7RareDefeated via winCombat()'s wasRealGnomeKing
branch (combat.js), same "fight happens elsewhere, report happens at the
NPC" split as reportGnomeKingKill()/reportCommanderKill() above. This is
Act 1's finale, so the payout is the biggest one-time quest reward in the
game so far (quest6's +50 Pop Tabs/+70 XP was the previous ceiling). */
function reportGnomeKingDefeat(){
   if(state.location !== 'guild' || !state.quest7Accepted || !state.quest7RareDefeated || state.quest7Complete) return;
   state.quest7Complete = true;
   state.popTabs += 150;
   state.xp += 200;
   state.bountyTokens += 20;
   clearLog();
   log("You lay it out for the guildmaster, plainly: the King is dead, and Gnometropolis is yours in every way that matters now. He's got no jokes for this one. (+150 Pop Tabs, +200 XP, +20 Bounty Tokens)");
   log("\"That's Act One, done,\" he says, like he's still working out what that means. \"The capital's yours. What comes next... honestly, nobody's sure yet. But the door's open.\"");
   checkLevelUp();
   render();
   autosave();
}

/* ---------------- Act 2: the Guild relocates to Gnometropolis ---------------- */
/* New building at the Gnometropolis square (data-action="gnomeguild",
gnometropolis-art.js), only ever reachable once quest7Complete — same
"gate at the door, not on the button" shape every other building here
uses. Takes over quest-giving and the Bounty Board (isBountyZoneUnlocked()/
claimBounty(), above) from Gladstone Hollow's own Guild, which becomes
a dead end the moment this one opens (see enterGuild()'s own
quest7Complete branch). */
function enterGnomeGuild(){
   if(state.inCombat || state.location !== 'gnometropolis' || !state.quest7Complete) return;
   state.location = 'gnomeguild';
   clearLog();
   if(state.quest8Complete){
      log("You step into the guildmaster's new hall. Gnometropolis suits him better than he'll admit.");
   } else if(state.quest8Accepted){
      log("You step into the guildmaster's new hall. He's still getting the place in order.");
   } else {
      log("You step into the guildmaster's new hall — freshly claimed, still smells like scavenged gold and sawdust.");
   }
   render();
}
function leaveGnomeGuild(){
   if(state.inCombat || state.location !== 'gnomeguild') return;
   state.location = 'gnometropolis';
   clearLog();
   render();
}

/* Quest 8, "New Digs" — Act 2's own opener. Deliberately a formality,
not a fetch/hunt quest: no real gameplay objective sits behind it yet
(there's no Act 2 combat content to point it at until the Mole People
zones, Act 2 plan Part 2, actually exist), so this is a soft
reintroduction to the accept/report loop rather than a skipped step.
Still two clicks, not an instant accept-and-complete, to keep the same
rhythm every other quest in this file uses. */
function acceptQuest8(){
   if(state.location !== 'gnomeguild' || !state.quest7Complete || state.quest8Accepted || state.quest8Complete) return;
   state.quest8Accepted = true;
   clearLog();
   log("\"Make it official, then,\" the guildmaster says, sliding a ledger across a desk that's still missing a leg. \"Take charge here. I'll handle the paperwork — you handle whatever's next.\"");
   render();
}
function reportQuest8(){
   if(state.location !== 'gnomeguild' || !state.quest8Accepted || state.quest8Complete) return;
   state.quest8Complete = true;
   state.popTabs += 40;
   state.xp += 30;
   clearLog();
   log("You sign the ledger. Gnometropolis is officially, on paper, yours to run. (+40 Pop Tabs, +30 XP)");
   log("The guildmaster looks almost nervous. \"Something's been digging under the throne room since the King fell. Wasn't there before. Might want to look into that, when you get a chance.\"");
   checkLevelUp();
   render();
   autosave();
}

/* Quest 9, "What the Throne Room Opened" — Act 2's first multi-stage
quest, its two combat stages spanning two different Mudroot Warren
districts (see quest9State, render.js, and tunnelWardenHunt/
warrenScoutHunt, combat.js). Deliberately vague throughout, per the
user's own "no quest markers" instruction — no zone ever gets named
here, on purpose; travelTo() (town.js) unlocking `mudrootwarren` the
moment this is accepted is the ONLY thing that actually points anywhere,
and even that's just "a new place exists on the Map," not "go to X." */
function acceptQuest9(){
   if(state.location !== 'gnomeguild' || !state.quest8Complete || state.quest9Accepted || state.quest9Complete) return;
   state.quest9Accepted = true;
   clearLog();
   log("\"Don't go in loud,\" the guildmaster says, already regretting sending you. \"Just go find out what's down there. And watch yourself.\"");
   render();
   autosave();
}
function reportQuest9(){
   if(state.location !== 'gnomeguild' || !state.quest9Accepted || state.quest9Complete || !state.warrenScoutDefeated) return;
   state.quest9Complete = true;
   state.popTabs += 90;
   state.xp += 70;
   clearLog();
   log("You lay it all out for the guildmaster — what you found, what you fought, how far down it went. (+90 Pop Tabs, +70 XP)");
   log("The guildmaster doesn't look reassured. \"That's not a den. That's an outpost. Which means there's more of them, and something they're all listening to. We're not done here.\"");
   checkLevelUp();
   render();
   autosave();
}

/* Quest 10, "Whatever's Listening" — Act 2's first quest with a real
downstream CONSEQUENCE rather than just longer flavor-text branching:
two rare hunts run in parallel (tunnelMoleInformantHunt/seniorClerkHunt,
combat.js), each in an EXISTING Mudroot Warren district, and whichever
the player finds FIRST sets state.quest10Path — which of the Warren's
Ear's two districts (the Choir/the Ledger Vault) is revealed
immediately, the other staying hidden until its own rare hunt is
separately cleared later. Same "no zone names, no markers" convention
quest9 established — the guildmaster's own text below never says which
path leads where, only that a choice happened. */
function acceptQuest10(){
   if(state.location !== 'gnomeguild' || !state.quest9Complete || state.quest10Accepted || state.quest10Complete) return;
   state.quest10Accepted = true;
   clearLog();
   log("\"Whatever's coordinating those outposts, it's not going to just tell you,\" the guildmaster says. \"Find someone who'll talk, or find the paperwork that already has. Either one gets you there — just get there.\"");
   render();
   autosave();
}
function reportQuest10(){
   if(state.location !== 'gnomeguild' || !state.quest10Accepted || state.quest10Complete || !state.quest10Path) return;
   state.quest10Complete = true;
   state.popTabs += 140;
   state.xp += 110;
   state.bountyTokens += 10;
   clearLog();
   log("You lay out what you found — and how you found it. (+140 Pop Tabs, +110 XP, +10 Bounty Tokens)");
   log(state.quest10Path === 'informant'
       ? "The guildmaster nods slowly. \"Someone talked. That's one way to do it — messier than paperwork, but it works.\" He doesn't ask what happened to the one who talked."
       : "The guildmaster flips through the ledger you brought back, longer than he needs to. \"Paper trail. Should've guessed. This place runs on more of it than anyone down there would admit.\"");
   log("\"Whatever's listening down there, it knows you're coming now. That's not nothing.\"");
   checkLevelUp();
   render();
   autosave();
}

/* How many of PALACE_GUARDS (content.js) are down in the CURRENT
uninterrupted gauntlet attempt — a plain transient variable, never
saved, same convention combatSubView (combat.js) uses for UI/session
state that shouldn't survive a reload. Reset to 0 by
resetPalaceGauntlet() below, called from travelTo() (town.js, leaving
the Palace for anywhere else) and checkDefeat() (combat.js, a defeat
that sends the player away from the Palace) — the only two ways
state.location ever changes away from 'palace'. Not resetting on a mere
page reload needs no special handling: hydrateState() (save.js) always
restores state.location to state.homeTown, which can never be 'palace',
so a reload already counts as "leaving" without this variable's help. */
let palaceGauntletProgress = 0;
function resetPalaceGauntlet(){ palaceGauntletProgress = 0; }

/* The palace gate itself — triggered from the Palace district
(state.location === 'palace', reached via travelTo('palace') from the
Gnometropolis town square once quest7 is accepted), not the Guild, even
though it lives in this file with the rest of quest 7. Requires the exact
PALACE_GATE_GEAR item matching state.classTitle to be equipped in its slot
before the gauntlet will even start — otherwise it's a guaranteed-refusal
no-op, same shape as every other hard-gated action in this codebase. That
gear is a guaranteed drop from the matching district guardian
(garrisonGuardian/roguesDenEnforcer/arcaneSanctumGuardian — a rare
encounter while exploring that district, see goAdventuring() in
combat.js), not a Bounty Token purchase — this check itself doesn't care
how it was obtained, only whether it's equipped.

Only checked once, when palaceGauntletProgress is still 0 — once the
gauntlet is under way, re-clicking to face the next guard (or the King
himself) never re-checks it. A player who unequips the gear mid-run is
an edge case not worth guarding against here. Each click advances
exactly one step: PALACE_GUARDS[palaceGauntletProgress] while there's
still a guard left, gnomeKing once all five are down —
winCombat()'s wasPalaceGuard branch (combat.js) is what actually
increments palaceGauntletProgress on a win. */
function approachPalaceGate(){
   if(state.inCombat !== false || state.location !== 'palace' || !state.quest7Accepted || state.quest7RareDefeated) return;
   if(palaceGauntletProgress === 0){
      const gearNeeded = PALACE_GATE_GEAR.find(g => g.class === state.classTitle);
      if(!gearNeeded || state.equipment[gearNeeded.slot]?.name !== gearNeeded.name){
         clearLog();
         log(gearNeeded
             ? `You can't just walk up to the palace gate like this. You need ${gearNeeded.name} equipped in your ${SLOT_LABELS[gearNeeded.slot] || gearNeeded.slot} slot first.`
             : "Something's wrong — there's no known approach for your class. (Report this.)");
         render();
         return;
      }
   }
   if(palaceGauntletProgress < PALACE_GUARDS.length){
      startCombat(PALACE_GUARDS[palaceGauntletProgress]);
   } else {
      startCombat(gnomeKing);
   }
   render();
}

/* ---------------- Bounty Board (The Guild) ---------------- */
/* Repeatable content, unlike the one-time quests above — one active bounty
at a time (state.activeBounty), auto-refreshed the moment the current one
is claimed so there's never any downtime waiting on a timer. See
BOUNTY_TEMPLATES (content.js) and the progress-tracking hook in
winCombat() above. */
/* Mirrors the exact same per-zone unlock flags the Map's zone cards use
   (render.js's sewersUnlocked/quarryUnlocked/vaultUnlocked/
   gnometropolisUnlocked, and ADVENTURE_ZONES above) — a bounty should
   never send the player to hunt in a zone they can't actually reach yet.
   Commons has no gate, same as everywhere else it's treated as the
   always-available baseline zone. Gnometropolis itself (the town square)
   is never a bounty zone — only its 3 explorable districts are, gated the
   same way the districts themselves are (state.quest7Accepted). */
/* Act 2: once the guild relocates (quest7Complete), the board stops
offering Act 1 zones entirely — Commons/Sewers/Quarry/Vault drop out
of the pool, same as the guild hall itself becoming a dead end
(enterGuild(), above). Garrison/Rogues' Den/Arcane Sanctum served as
an interim pool for a while (the only non-Act-1 combat content that
existed yet), but they stopped being real bounty targets the moment
they converted into pure class-trainer buildings (CLASS_AREA_ZONES,
combat.js) — a bounty asking for kills there would've been
unfulfillable. Root Cellar/the Bureau are available as soon as
quest9Accepted (mirrors travelTo()'s own gate, town.js); Mudflats
needs tunnelWardenDefeated on top of that, same defense-in-depth gate
travelTo('mudflats') itself already enforces, since the tile isn't
even reachable before then. */
function isBountyZoneUnlocked(zone){
   if(state.quest7Complete){
      if(zone === 'rootcellar' || zone === 'bureau') return state.quest9Accepted;
      if(zone === 'mudflats') return state.quest9Accepted && state.tunnelWardenDefeated;
      return false;
   }
   if(zone === 'commons') return true;
   if(zone === 'sewers') return state.quest2Complete;
   if(zone === 'quarry') return state.quest4Complete;
   if(zone === 'vault') return state.quest5Complete;
   if(zone === 'garrison' || zone === 'roguesden' || zone === 'sanctum') return state.quest7Accepted;
   return false;
}
function rollNewBounty(){
   const prevId = state.activeBounty ? state.activeBounty.templateId : null;
   /* Only ever roll from zones the player has actually unlocked. Pre-Act-2
   this pool is never empty (Commons has no gate at all), but post-
   quest7Complete it legitimately CAN be — quest8Complete (reaching the
   new Guild) doesn't by itself unlock any Act 2 zone; that only happens
   once quest9Accepted. Leave state.activeBounty null in that window
   rather than crashing on an empty pool, same "nothing to offer right
   now" shape the daily-cap case (ensureActiveBounty() below) already
   uses. */
   let pool = BOUNTY_TEMPLATES.filter(b => isBountyZoneUnlocked(b.zone));
   if(prevId){
      const filtered = pool.filter(b => b.id !== prevId);
      if(filtered.length > 0) pool = filtered;
   }
   if(pool.length === 0){ state.activeBounty = null; return; }
   const template = pool[Math.floor(Math.random()*pool.length)];
   state.activeBounty = { templateId: template.id, progress: 0, startedAt: Date.now() };
}
/* Resets state.bountiesClaimedToday the first time this is called after
local midnight (toDateString() changes), so BOUNTY_DAILY_CAP (content.js)
is a per-calendar-day cap, not a rolling 24h window like BOUNTY_RESET_MS. */
function checkBountyDayReset(){
   const todayKey = new Date().toDateString();
   if(state.bountyDayKey !== todayKey){
      state.bountyDayKey = todayKey;
      state.bountiesClaimedToday = 0;
   }
}
/* Call before reading state.activeBounty anywhere (Bounty Board, Quest
Log, the town-square glow indicator) — rolls a fresh one if there isn't
one yet, or if the current one has been active for BOUNTY_RESET_MS
(content.js) without being claimed. Progress on an expired bounty is
lost, same as the zone-mismatch reroll below. Once BOUNTY_DAILY_CAP
claims have happened today, no new bounty is offered at all — leaves
state.activeBounty null until tomorrow's reset. */
function ensureActiveBounty(){
   checkBountyDayReset();
   if(state.bountiesClaimedToday >= BOUNTY_DAILY_CAP){ state.activeBounty = null; return; }
   if(!state.activeBounty){ rollNewBounty(); return; }
   const currentTemplate = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(!currentTemplate || !isBountyZoneUnlocked(currentTemplate.zone)){ rollNewBounty(); return; }
   if(Date.now() - state.activeBounty.startedAt >= BOUNTY_RESET_MS) rollNewBounty();
}
/* Shared by claimBounty()'s gate and the town-square glow indicator
(render.js) so "ready to claim" can never drift between the two. */
function isBountyReady(){
   if(!state.activeBounty) return false;
   const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   return !!bt && state.activeBounty.progress >= bt.count;
}
/* "11h 42m" style, for a bounty's multi-hour reset window — formatMs()
(economy.js) is tuned for the Biscuit regen's minutes-scale countdown and
reads awkwardly stretched out to hours. */
function formatBountyTimeLeft(ms){
   const totalMin = Math.max(0, Math.ceil(ms/60000));
   const h = Math.floor(totalMin/60), m = totalMin % 60;
   return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function claimBounty(){
   if((state.location !== 'guild' && state.location !== 'gnomeguild') || !state.questComplete || !state.activeBounty) return;
   checkBountyDayReset();
   if(state.bountiesClaimedToday >= BOUNTY_DAILY_CAP) return;
   const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(!bt || !isBountyReady()) return;
   const bountyPayout = Math.round(bt.reward.bountyTokens * (1 + GUILD_BOUNTY_BONUS[state.buildingUpgrades.guild || 0]));
   state.bountyTokens += bountyPayout;
   state.bountiesCompleted++;
   state.bountiesClaimedToday++;
   clearLog();
   log(`Bounty complete! You collect ${bountyPayout} Bounty Token${bountyPayout===1?'':'s'} for clearing out ${bt.count} × ${bt.monsterName}.`);
   if(state.bountiesClaimedToday < BOUNTY_DAILY_CAP){
      rollNewBounty();
   } else {
      state.activeBounty = null;
      log(`That's ${BOUNTY_DAILY_CAP} bounties claimed today — the board's empty until tomorrow.`);
   }
   render();
   autosave();
}

/* Ticks the Quest Log's bounty countdown (#quest-bounty-timer, render-
character.js) live, same pattern as economy.js's Biscuit-display
interval. Guarded on the element actually existing — it's only in the
DOM while the Quest Log drawer is both open AND showing an unclaimed
bounty, so this is a harmless no-op the rest of the time. Also catches
an expiry (or the daily cap resetting overnight) even if the player
just sits on the drawer without taking any action that would otherwise
trigger a render(). */
function updateBountyTimerDisplay(){
   const el = document.getElementById('quest-bounty-timer');
   if(!el) return;
   const before = state.activeBounty;
   ensureActiveBounty();
   if(state.activeBounty !== before){ renderQuestLogDrawer(); return; }
   if(!state.activeBounty) return;
   el.textContent = formatBountyTimeLeft(BOUNTY_RESET_MS - (Date.now() - state.activeBounty.startedAt));
}
setInterval(updateBountyTimerDisplay, 1000);
