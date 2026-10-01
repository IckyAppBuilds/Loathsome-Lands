/* ---------------- The Prism Depths (Act 3) — Embercrypt ---------------- */
/* New concern, new file per the project's "new concern, new file"
convention (AGENTS.md). Act 3's content is NOT another linear
`ZONE_ORDER` zone — see dungeon.js's own top comment for the full
reasoning. This file holds just the monster/boss/treasure DATA for
Embercrypt, the first of (eventually) 8 themed dungeons; dungeon.js
holds the generic run engine that reads it (same split gauntlet.js/
its boss-data files already use — gauntlet.js holds GAUNTLETS +
approachGauntlet(), the actual boss objects it references live in
warrensear-content.js/emberwarren-content.js).

Loads after content.js (reads STAT_SCALING_DIVISOR-driven helpers by
value) and icons.js/art.js (reads icon*()/art*() functions by value).
Must load BEFORE dungeon.js, which references these consts directly
building its DUNGEONS registry.

Visual identity: every Act 3 creature is "Lucent-made" — the same
angular/faceted silhouette family Crystal City's own monsters
introduced (art.js's artCrystalSentinel etc.), not the gnome (Act 1)
or mole (Act 2) silhouettes. Each dungeon just varies the color
palette for its own theme; Embercrypt's is ember red/orange. */

/* Embercrypt's own ZONE_DIFFICULTY entry (content.js) — continues the
same late-game ~+13-15%-per-step ratio the last few Act 2 steps
settled into (foundry/gearworks 6.61 -> crystalcity 7.5 is +13.5%;
7.5 -> 8.6 here is +14.7%). Monster stats below are designed the same
way every other zone's are: beef/grit modestly above Crystal City's
own regulars (beef8-9/grit25-27), continuing the escalation, derived
through the same deriveMonsterCombatStats()/ZONE_DIFFICULTY pipeline
startCombat() already applies to ANY monster template regardless of
how it was spawned — dungeon.js's enterDungeon()/advanceDungeonRun()
call the exact same startCombat(forceTemplate) every gauntlet/rare-hunt
already uses, so no new combat-stat code was needed for this at all. */
ZONE_DIFFICULTY.embercrypt = 8.6;

const embercryptRegulars = [
   { name:"a slag-bound husk, poured wrong and left to cool that way", beef:10, zip:0, grit:30, hoodoo:0, xp:52, zone:"embercrypt",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"cracks open along its own seams and burns brighter" } ],
    art: artSlagBoundHusk, loot:null },
   { name:"an ash-veiled watcher, embers where its eyes should be", beef:10, zip:0, grit:31, hoodoo:0, xp:53, zone:"embercrypt",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:34, boltMax:44, flavor:"opens both ember-eyes at once and does not blink" } ],
    art: artAshVeiledWatcher, loot:null },
   { name:"a cinder hound, three steps ahead of its own smoke", beef:11, zip:0, grit:29, hoodoo:0, xp:54, zone:"embercrypt",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:18, healMax:32, flavor:"rolls through its own embers and comes up unburnt" } ],
    art: artCinderHound, loot:null },
   ];

/* Embercrypt's own boss — the Lucent's forge-keeper, still burning long
after whatever it was keeping is gone. First Act 3 monster to use the
existing burn debuff (state.playerStatusEffect, combat.js) — same
mechanic the Ember Warren's own bosses already established, reused
rather than reinvented, matching the "the Lucent taught the Moles this"
thread the Act 3 plan calls for. */
const emberwright = {
   name:"the Emberwright, still tending a forge that isn't there anymore", beef:14, zip:0, grit:46, hoodoo:0, xp:135, rare:true, zone:"embercrypt",
   skills:[
      { type:'debuff', chance:0.22, debuffType:'burn', debuffTurns:3, dmgPerTurn:16, flavor:"presses a hand still shaped like tongs against you" },
      { type:'buff', chance:0.18, buffMult:1.5, buffTurns:2, flavor:"remembers, for one swing, exactly how this is done" },
      ],
   art: artEmberwright, loot:null
};

/* Embercrypt's guaranteed treasure — one of these 3 picked at random
on every full clear (grantDungeonTreasure(), dungeon.js), continuing
the gearDrop ladder's own +1-per-zone climb one step past Crystal
City's own +10 ceiling (item-tiers.js/content.js). One per class, each
tagged with that class's own signature stat as primary
(CLASS_SIGNATURE_STAT, content.js) and tier:'epic' — armor derives
automatically via ensureGearArmor() (item-tiers.js), no new armor code
needed. Reuses existing icons, same "nothing here is unique enough for
a new SVG" convention every other piece of loot in the game follows. */
const embercryptTreasure = [
   { name:"the Emberwright's own tongs, still faintly glowing", desc:"Picks things up that would otherwise take your fingers with them.", type:"equip", slot:"weapon", bonus:{beef:11}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"a cinder-quick cloak, never quite catching fire", desc:"Smells permanently like the inside of a kiln. You stop noticing after a while.", type:"equip", slot:"chest", bonus:{zip:11}, classRequired:'Card Shark', tier:'epic', icon: iconCapturedLight },
   { name:"a forge-sealed circlet, warm even when nothing else is", desc:"Whatever it was tempered in, it still remembers.", type:"equip", slot:"head", bonus:{hoodoo:11}, classRequired:'Hexpert', tier:'epic', icon: iconVeinGemstone },
   ];
