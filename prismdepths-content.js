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
a new SVG" convention every other piece of loot in the game follows.

Per explicit correction, each also carries 3 secondary stats (STAT_
ROTATION order, content.js — same deterministic rotation rollGearDropTier()
uses, just hand-authored here since this is a fixed guaranteed drop, not
a random roll) at roughly two-thirds the primary value. Epic sits one
rung above the random gearDrop system's own ceiling — GEAR_DROP_TIER_
NAMES (content.js) tops out at 'rare' (3 stats total, armor-base 3,
GEAR_ARMOR_BY_TIER/item-tiers.js), and epic's own armor-base is 4 on
that same table — so shipping these as bare 1-stat items (armor aside)
left the endgame's own guaranteed epic reward with FEWER stats than a
lucky mid-game monster could already roll for free. */
const embercryptTreasure = [
   { name:"the Emberwright's own tongs, still faintly glowing", desc:"Picks things up that would otherwise take your fingers with them.", type:"equip", slot:"weapon", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"a cinder-quick cloak, never quite catching fire", desc:"Smells permanently like the inside of a kiln. You stop noticing after a while.", type:"equip", slot:"chest", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconCapturedLight },
   { name:"a forge-sealed circlet, warm even when nothing else is", desc:"Whatever it was tempered in, it still remembers.", type:"equip", slot:"head", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconVeinGemstone },
   ];

/* ---------------- The Prism Depths — Frostvault ---------------- */
/* Second of the 8 planned dungeons — the Lucent's own discipline of
preservation, not decoration: whatever Frostvault was built to keep
exactly as it was, it's still keeping. Continues Embercrypt's own
+14.7%-per-step ZONE_DIFFICULTY ratio (8.6 -> 9.8 is +14%) and the
gearDrop ladder's +1-per-dungeon climb (embercrypt +11 -> frostvault
+12). Palette: ice blue/white over the same angular Lucent silhouette
family every Act 3 creature shares. */
ZONE_DIFFICULTY.frostvault = 9.8;

const frostvaultRegulars = [
   { name:"a glass-still custodian, holding a pose it stopped finishing", beef:11, zip:0, grit:32, hoodoo:0, xp:56, zone:"frostvault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:20, healMax:35, flavor:"settles back into the exact shape it's supposed to be" } ],
    art: artGlassStillCustodian, loot:null },
   { name:"a rime-crusted drifter, dragging cold that isn't really air", beef:11, zip:0, grit:33, hoodoo:0, xp:57, zone:"frostvault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:37, boltMax:47, flavor:"drags that cold straight through you" } ],
    art: artRimeCrustedDrifter, loot:null },
   { name:"a frostbound archivist, filed under a temperature nothing should survive", beef:12, zip:0, grit:32, hoodoo:0, xp:58, zone:"frostvault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"cross-references its own cold against something colder" } ],
    art: artFrostboundArchivist, loot:null },
   ];

/* Frostvault's own boss — same "the Lucent taught the Moles this"
thread Embercrypt's own boss started, this time with the existing
freeze debuff instead of burn (a near-perfect fit for "preservation"
as a discipline — it doesn't hurt you, it just stops you). */
const stillglassWarden = {
   name:"the Stillglass Warden, holding the exact same shape since before anyone was counting", beef:15, zip:0, grit:49, hoodoo:0, xp:145, rare:true, zone:"frostvault",
   skills:[
      { type:'debuff', chance:0.22, debuffType:'freeze', debuffTurns:3, dmgReduction:0.4, flavor:"holds you still exactly as long as it's holding itself" },
      { type:'heal', chance:0.18, healMin:22, healMax:38, flavor:"reseals a crack along its own glass" },
      ],
   art: artStillglassWarden, loot:null
};

/* Same 3-secondary-stat treatment as embercryptTreasure's own comment
above explains — two-thirds of the primary, STAT_ROTATION order. */
const frostvaultTreasure = [
   { name:"the Stillglass Warden's own frozen gauntlet-blade", desc:"Doesn't melt. Hasn't, in longer than anyone's been asking.", type:"equip", slot:"weapon", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconGuardCleaver },
   { name:"frost-cut striders, impossibly sure-footed on ice", desc:"Never once slip. You've stopped testing it.", type:"equip", slot:"boots", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconGripBoots },
   { name:"a frost-sealed circlet, thoughts still legible through the ice", desc:"Whoever wore it last was mid-thought. Still is, technically.", type:"equip", slot:"head", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconStolenCrown },
   ];

/* ---------------- The Prism Depths — Stormreach ---------------- */
/* Third of the 8 planned dungeons — the Lucent's own discipline of
motion and signal: whatever Stormreach was built to carry, it's still
broadcasting. Continues the same ratios (9.8 -> 11.2 is +14.3%;
frostvault +12 -> stormreach +13). Palette: storm purple/yellow over
the same angular Lucent silhouette family. */
ZONE_DIFFICULTY.stormreach = 11.2;

const stormreachRegulars = [
   { name:"a charge-split sentry, arguing with its own echo", beef:12, zip:0, grit:35, hoodoo:0, xp:60, zone:"stormreach",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"and its echo agree on something, for once" } ],
    art: artChargeSplitSentry, loot:null },
   { name:"a windworn herald, three words into a message it'll never finish", beef:12, zip:0, grit:36, hoodoo:0, xp:61, zone:"stormreach",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:23, healMax:40, flavor:"patches itself on the same wind that's wearing it down" } ],
    art: artWindwornHerald, loot:null },
   { name:"a storm-tide walker, never landing on the ground it's clearly standing on", beef:13, zip:0, grit:35, hoodoo:0, xp:62, zone:"stormreach",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:41, boltMax:52, flavor:"brings the whole tide down in one strike" } ],
    art: artStormTideWalker, loot:null },
   ];

/* Stormreach's own boss — a bolt-heavy kit (lightning, the dungeon's
own theme) plus a rally buff, same "one signature mechanic" shape
every named boss in the game already uses, no debuff this time since
Embercrypt/Frostvault already covered burn/freeze between them. */
const unansweredHerald = {
   name:"the Unanswered Herald, still broadcasting something nobody built ears for", beef:16, zip:0, grit:52, hoodoo:0, xp:155, rare:true, zone:"stormreach",
   skills:[
      { type:'bolt', chance:0.24, boltMin:48, boltMax:62, flavor:"finally gets an answer, and it is not a kind one" },
      { type:'buff', chance:0.18, buffMult:1.5, buffTurns:2, flavor:"catches a gust that shouldn't exist down here" },
      ],
   art: artUnansweredHerald, loot:null
};

/* Same 3-secondary-stat treatment as embercryptTreasure's own comment
above explains — two-thirds of the primary, STAT_ROTATION order. */
const stormreachTreasure = [
   { name:"a storm-charged maul, still humming between swings", desc:"Doesn't need to be swung hard. It's already moving.", type:"equip", slot:"weapon", bonus:{beef:13, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconHeirloomCleaver },
   { name:"windworn leggings, never quite touching the ground", desc:"You've stopped checking whether you're actually walking.", type:"equip", slot:"legs", bonus:{zip:13, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconQuickstepTrousers },
   { name:"a storm-signal mantle, still relaying something", desc:"Whatever it's broadcasting, it isn't for you. You wear it anyway.", type:"equip", slot:"chest", bonus:{hoodoo:13, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconAdventurerCuirass },
   ];
