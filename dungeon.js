/* ---------------- Reusable repeatable dungeons (Act 3) ---------------- */
/* Closest existing precedent is gauntlet.js's GAUNTLETS — a named
sequence of guards + a finalBoss, dispatched one fight at a time — but
gauntlets are built for EXACTLY-ONCE completion (a doneFlag that, once
set, refuses every further approach). Dungeons need the same "sequence
of fights" shape made REPEATABLE: no doneFlag, a lifetime clear
counter instead (state.dungeonClears, core.js), and a finished run can
always be started again. This is deliberate — the Act 3 plan calls for
dungeons the player keeps re-running for loot long after "the
campaign" is over, not a one-time story beat.

New concern, new file. Loads after prismdepths-content.js (whose
monster/boss/treasure consts this file's DUNGEONS registry references
by value, same relationship gauntlet.js has to warrensear-content.js/
emberwarren-content.js) and after combat.js/render.js (whose
startCombat()/render() this file's functions call, though only inside
function bodies, so — same as gauntlet.js's own note — that ordering
is for readability, not correctness). */
/* Per explicit request, every dungeon needs at least 10 fights with
minibosses and trash mobs throughout, plus a rest stop partway through
— each dungeon's own `regulars` array (prismdepths-content.js) now
carries 10 entries (the original 3 trash + 7 more: 5 trash + 2
miniboss-tier, rare:true) ahead of its own 1-entry `bosses` array (the
true final boss), for 11 total stages. `restStage` is the stage INDEX
(0-based, same indexing dungeonMonsterAtStage() already uses) that
advanceDungeonRun() pauses BEFORE starting — i.e. the run halts right
after the stage-(restStage-1) kill, which lands roughly at the
midpoint of all 8 dungeons' own 11-stage run (index 6 — right after
the first miniboss and a short trailing trash fight, right before the
back half starts). See activeDungeonRun.resting/restInDungeon() below
for the actual pause/resume mechanics. */
const DUNGEONS = {
   embercrypt: {
      name: "Embercrypt",
      regulars: embercryptRegulars,
      bosses: [emberwright],
      treasureTable: embercryptTreasure,
      shardReward: 40,
      biscuitCost: 3,
      requiredFlag: 'quest17Complete', /* quest17, "What Light Remembers" (town.js) — the Prism Depths' own opener, reportQuest17() sets this */
      enterLine: "You step into Embercrypt. Whatever's still burning in here has been burning a very long time.",
      midRunLine: (left) => `Deeper into Embercrypt — ${left} fight${left===1?'':'s'} left before whatever's keeping it lit.`,
      clearLine: "Embercrypt falls dark behind you, all at once, like something finally let go of a breath.",
      restStage: 6,
      restLine: "You find a stretch of cooled stone, dark enough to actually rest on. The forge-heat can wait.",
   },
   frostvault: {
      name: "Frostvault",
      regulars: frostvaultRegulars,
      bosses: [stillglassWarden],
      treasureTable: frostvaultTreasure,
      shardReward: 44, /* +4 over Embercrypt's 40, same escalation the biscuitCost/difficulty ladder also climbs */
      biscuitCost: 3,
      requiredFlag: 'quest17Complete',
      enterLine: "You step into Frostvault. Everything in here is exactly where it was left — including, maybe, you.",
      midRunLine: (left) => `Deeper into Frostvault — ${left} fight${left===1?'':'s'} left before whatever's keeping it still.`,
      clearLine: "Frostvault doesn't darken behind you so much as settle — one more thing filed, finally, under finished.",
      restStage: 6,
      restLine: "You find a hollow out of the wind, just warm enough to actually rest in.",
   },
   stormreach: {
      name: "Stormreach",
      regulars: stormreachRegulars,
      bosses: [unansweredHerald],
      treasureTable: stormreachTreasure,
      shardReward: 48,
      biscuitCost: 4, /* one step up — Stormreach is the hardest of the first wave */
      requiredFlag: 'quest17Complete',
      enterLine: "You step into Stormreach. Something up here is still talking. It's been a very long time since anyone answered.",
      midRunLine: (left) => `Deeper into Stormreach — ${left} fight${left===1?'':'s'} left before whatever's still broadcasting.`,
      clearLine: "Stormreach goes quiet behind you, all at once — whatever that signal was, it's finally been heard.",
      restStage: 6,
      restLine: "You find a dead spot in the wind, just long enough to actually rest in.",
   },
   /* Wave 2 — gated on quest18Complete, not quest17Complete. quest18,
   "Old Light, Older Debts" (town.js), is only OFFERED once every wave 1
   dungeon has been cleared at least once (state.dungeonClears, core.js)
   — "gated by the other dungeons," per explicit request, not just a
   quest-accept click. */
   verdanthollow: {
      name: "Verdant Hollow",
      regulars: verdantHollowRegulars,
      bosses: [rootboundWarden],
      treasureTable: verdantHollowTreasure,
      shardReward: 52,
      biscuitCost: 4,
      requiredFlag: 'quest18Complete',
      enterLine: "You step into Verdant Hollow. Whatever this place used to grow, it's still growing — just slower, and without anyone to pick the harvest.",
      midRunLine: (left) => `Deeper into Verdant Hollow — ${left} fight${left===1?'':'s'} left before whatever's still tending it.`,
      clearLine: "Verdant Hollow settles back into its own slow green quiet, like it was only ever waiting for you to finish and leave.",
      restStage: 6,
      restLine: "You find a clearing the growth hasn't reclaimed yet, just long enough to actually rest in.",
   },
   duskward: {
      name: "Duskward",
      regulars: duskwardRegulars,
      bosses: [lastCandle],
      treasureTable: duskwardTreasure,
      shardReward: 56,
      biscuitCost: 4,
      requiredFlag: 'quest18Complete',
      enterLine: "You step into Duskward. The torches don't help much here — whatever's wrong with the light isn't a lighting problem.",
      midRunLine: (left) => `Deeper into Duskward — ${left} fight${left===1?'':'s'} left before whatever's keeping the dark company.`,
      clearLine: "Duskward doesn't get any brighter behind you. It just stops watching.",
      restStage: 6,
      restLine: "You find a spot the dark hasn't quite finished claiming, just long enough to actually rest in.",
   },
   ironloom: {
      name: "Ironloom",
      regulars: ironloomRegulars,
      bosses: [warpLoomOverseer],
      treasureTable: ironloomTreasure,
      shardReward: 60,
      biscuitCost: 5, /* one step up — Ironloom is the hardest of the second wave */
      requiredFlag: 'quest18Complete',
      enterLine: "You step into Ironloom. Something in here is still running, still weaving, still keeping perfect, pointless time.",
      midRunLine: (left) => `Deeper into Ironloom — ${left} fight${left===1?'':'s'} left before whatever's still keeping the pattern.`,
      clearLine: "Ironloom winds down behind you, gear by gear, into something almost like rest.",
      restStage: 6,
      restLine: "You find a stretch of stopped gears, quiet enough to actually rest against.",
   },
   /* Wave 3 — gated on quest19Complete. quest19, "The Last Two Rooms"
   (town.js), is only OFFERED once every wave 2 dungeon has been cleared
   at least once, same "gated by the other dungeons" rule wave 2's own
   quest18 uses. */
   echochapel: {
      name: "Echo Chapel",
      regulars: echoChapelRegulars,
      bosses: [unbrokenChord],
      treasureTable: echoChapelTreasure,
      shardReward: 64,
      biscuitCost: 5,
      requiredFlag: 'quest19Complete',
      enterLine: "You step into Echo Chapel. Every sound you make comes back changed — a little slower, a little sadder, like the room's correcting you.",
      midRunLine: (left) => `Deeper into Echo Chapel — ${left} fight${left===1?'':'s'} left before whatever's still holding the note.`,
      clearLine: "Echo Chapel finally lets the note end. The silence after is somehow the loudest part.",
      restStage: 6,
      restLine: "You find a dead patch of silence, just long enough to actually rest in.",
   },
   sunkenarchive: {
      name: "Sunken Archive",
      regulars: sunkenArchiveRegulars,
      bosses: [lastArchivist],
      treasureTable: sunkenArchiveTreasure,
      shardReward: 68,
      biscuitCost: 6, /* one step up — Sunken Archive is the hardest of the third wave */
      requiredFlag: 'quest19Complete',
      enterLine: "You step into the Sunken Archive. Everything in here was written down by something that expected to be read again.",
      midRunLine: (left) => `Deeper into the Sunken Archive — ${left} fight${left===1?'':'s'} left before whatever's still cataloguing you.`,
      clearLine: "The Sunken Archive goes quiet behind you — not empty, exactly. Just finished, for now, with what it had to say.",
      restStage: 6,
      restLine: "You find a reading alcove nobody's catalogued yet, just long enough to actually rest in.",
   },
};

/* Transient run state — mirrors gauntletProgress exactly (plain
object/variable, never saved, reset on travelTo()/checkDefeat() same
as every other mid-fight-only state: combatSubView, evasionActive,
playerStatusEffect, gauntletProgress). { id, stage, resting } — stage
0..(regulars.length-1) are the regular fights, stage===regulars.length
onward are the bosses array, in order. `resting` is true only in the
narrow window between the restStage-1 kill and the player clicking
Rest (restInDungeon() below) — state.inCombat is false during that
window (advanceDungeonRun() calls endCombat() instead of starting the
next fight), same "paused, not finished" shape dungeonRunContinues
already gives winCombat() (combat.js) to skip the normal victory
banner without actually ending the run. */
let activeDungeonRun = null;

function isDungeonUnlocked(id){
   const cfg = DUNGEONS[id];
   return !!cfg && !!state[cfg.requiredFlag];
}

/* "Has every one of these dungeons been cleared at least once" — the
actual gate behind quest18/quest19's own offer states (town.js), per
explicit request that each wave unlock by having cleared the dungeons
themselves, not just by clicking through a quest. Reads
state.dungeonClears (core.js) directly, same lifetime-counter field
grantDungeonTreasure() above bumps on every full clear. */
function allDungeonsCleared(ids){
   return ids.every(id => (state.dungeonClears[id] || 0) > 0);
}

/* Total fight count for a dungeon — regulars then bosses, in order. */
function dungeonStageCount(id){
   const cfg = DUNGEONS[id];
   return cfg.regulars.length + cfg.bosses.length;
}

/* The monster template for a given stage index (0-based) of a dungeon. */
function dungeonMonsterAtStage(id, stage){
   const cfg = DUNGEONS[id];
   return stage < cfg.regulars.length ? cfg.regulars[stage] : cfg.bosses[stage - cfg.regulars.length];
}

/* Starts a brand-new run — refuses mid-combat, mid-another-run, if the
dungeon isn't unlocked yet, or without enough Biscuits (same resource
every other adventure spends — dungeons are still "going out and
fighting things," just in a themed sequence instead of a wild zone). */
function enterDungeon(id){
   if(state.inCombat || state.location !== 'prismdepths' || activeDungeonRun || !isDungeonUnlocked(id)) return;
   const cfg = DUNGEONS[id];
   if(!devMode && state.adventures < cfg.biscuitCost) return;
   if(!devMode) state.adventures -= cfg.biscuitCost; /* dev mode keeps Biscuits infinite everywhere else (updateBiscuitDisplay(), economy.js) — same guard goAdventuring() already uses */
   activeDungeonRun = { id, stage: 0 };
   clearLog();
   log(cfg.enterLine);
   startCombat(dungeonMonsterAtStage(id, 0));
   render();
}

/* Called once per dungeon-run kill, from winCombat() (combat.js) — same
hook point matchGauntletKill()'s own result is consumed at. Advances
the run's own stage counter and either starts the next fight (returns
false — the run continues) or grants the treasure and clears
activeDungeonRun (returns true — the run just finished). winCombat()
uses the return value to decide whether to skip its own normal
victory-banner/endCombat() flow (mid-run) or let it play out as usual
(the run's final kill) — see its own comment for why. */
function advanceDungeonRun(){
   const { id } = activeDungeonRun;
   const cfg = DUNGEONS[id];
   activeDungeonRun.stage++;
   if(activeDungeonRun.stage < dungeonStageCount(id)){
      /* Rest stop — pause here instead of auto-chaining into the next
      fight. endCombat() (combat.js) does the same cleanup a normal
      fight-end would (classBuffFightsLeft ticks down once, evasionActive/
      playerStatusEffect clear) without nulling activeDungeonRun itself,
      so the run genuinely just pauses rather than ending. winCombat()'s
      own dungeonRunContinues check (computed before this function runs)
      is still true here — there ARE more stages left — so it skips its
      OWN endCombat() call and just returns, same as the normal mid-run
      case; this is the only place besides that final skip where a
      dungeon kill doesn't immediately chain into startCombat(). */
      if(cfg.restStage != null && activeDungeonRun.stage === cfg.restStage){
         activeDungeonRun.resting = true;
         endCombat();
         log(cfg.restLine);
         return false;
      }
      startCombat(dungeonMonsterAtStage(id, activeDungeonRun.stage));
      return false;
   }
   grantDungeonTreasure(id);
   activeDungeonRun = null;
   return true;
}

/* Resumes a run paused at its own rest stop (restStage, above) — a
full HP/MP restore (the whole point of a rest stop existing at all),
then starts the next fight exactly like any other stage transition.
Refuses outside that narrow window so a stray call (e.g. a second
click) can't double-heal or desync the stage counter. */
function restInDungeon(){
   if(!activeDungeonRun || !activeDungeonRun.resting) return;
   const { id, stage } = activeDungeonRun;
   state.hp = state.maxHp;
   state.mp = state.maxMp;
   activeDungeonRun.resting = false;
   log("Fully rested. Back into it.");
   startCombat(dungeonMonsterAtStage(id, stage));
   render();
}

/* One guaranteed item off that dungeon's own treasureTable (picked
uniformly — no "better luck next time," every clear pays out), plus
its own Prism Shards reward and a lifetime clear-count bump
(state.dungeonClears, core.js — never a doneFlag, this can fire every
single time). ensureGearArmor() (item-tiers.js) derives the item's
armor the exact same way any other piece of gear gets it; no new
armor code needed. Appends to state.victoryMonster.drops (already an
array by the time this runs — winCombat() sets it right before this
point in its own flow) so the normal victory banner shows it exactly
like any other drop. */
function grantDungeonTreasure(id){
   const cfg = DUNGEONS[id];
   const item = ensureGearArmor({ ...cfg.treasureTable[Math.floor(Math.random()*cfg.treasureTable.length)] });
   state.inventory.push(item);
   if(state.victoryMonster) state.victoryMonster.drops.push(item);
   state.prismShards += cfg.shardReward;
   state.dungeonClears[id] = (state.dungeonClears[id] || 0) + 1;
   log(`${cfg.name} yields its treasure: ${item.name}! (+${cfg.shardReward} Prism Shards)`);
}

/* Abandons the current run with no treasure and no refund — same
"progress lost, nothing refunded" rule leaving a gauntlet zone or a
defeat already enforces for gauntletProgress. Called from the same two
spots resetGauntlet() already is (travelTo()/checkDefeat()) so a
dungeon run can never be left dangling across an unrelated screen. */
function abandonDungeonRun(){
   activeDungeonRun = null;
}
