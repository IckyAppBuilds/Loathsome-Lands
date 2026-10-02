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
lucky mid-game monster could already roll for free.

Per a later explicit request, every dungeon's treasureTable now covers
all 5 equip slots for all 3 classes (15 items total — a full SLOT_ORDER
row per class, core.js) instead of just 1 item per class, so a player
farming any one dungeon can eventually gear out an entire class
end-to-end from its own drops alone, not just a single slot. The
original 3 items (one per class) are unchanged; the other 12 just add
the remaining 4 slots per class, same stat-count/value treatment as
the original 3. */
const embercryptTreasure = [
   { name:"the Emberwright's own tongs, still faintly glowing", desc:"Picks things up that would otherwise take your fingers with them.", type:"equip", slot:"weapon", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"a cinder-quick cloak, never quite catching fire", desc:"Smells permanently like the inside of a kiln. You stop noticing after a while.", type:"equip", slot:"chest", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconCapturedLight },
   { name:"a forge-sealed circlet, warm even when nothing else is", desc:"Whatever it was tempered in, it still remembers.", type:"equip", slot:"head", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconVeinGemstone },
   { name:"an ember-warped visor, fogged with old heat", desc:"Never quite clears. You've learned to fight half-blind through it.", type:"equip", slot:"head", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"a slag-fused cuirass, still settling into its final shape", desc:"Was poured, not forged. Fits like it was poured onto you.", type:"equip", slot:"chest", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconScorchRobe },
   { name:"cinder-packed greaves, never fully cool", desc:"Warm enough to notice. Not warm enough to stop wearing them.", type:"equip", slot:"legs", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconScorchedGreaves },
   { name:"ash-soled boots, tracking embers behind you", desc:"Every step leaves a faint glow that fades before anyone sees it.", type:"equip", slot:"boots", bonus:{beef:11, zip:7, grit:7, hoodoo:7}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a heat-warped bandana, singed at the edges", desc:"Looks worse than it actually is. Holds up fine.", type:"equip", slot:"head", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"scorch-streaked leggings, quick despite the burns", desc:"Shouldn't move this well. Does anyway.", type:"equip", slot:"legs", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"ember-dusted boots, light on hot coals", desc:"You've stopped flinching at the heat through the soles.", type:"equip", slot:"boots", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a forge-tempered blade, never quite cooling", desc:"Quenched once. Never actually finished cooling.", type:"equip", slot:"weapon", bonus:{zip:11, grit:7, hoodoo:7, beef:7}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"an ash-threaded robe, humming faintly with old heat", desc:"The stitching glows, very faintly, in the dark.", type:"equip", slot:"chest", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"cinder-stitched leggings, warm to the touch", desc:"Somebody wove these around a live coal. On purpose, probably.", type:"equip", slot:"legs", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"ember-lit slippers, barely touching the ash", desc:"Leave no footprints. Leave a faint orange afterimage instead.", type:"equip", slot:"boots", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a forge-blessed wand, tip still glowing faint orange", desc:"Never fully goes out. You've stopped trying to put it out.", type:"equip", slot:"weapon", bonus:{hoodoo:11, beef:7, zip:7, grit:7}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
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
above explains — two-thirds of the primary, STAT_ROTATION order. Also
the same full 5-slot/3-class treasureTable expansion (15 items total,
see embercryptTreasure's own comment on this). */
const frostvaultTreasure = [
   { name:"the Stillglass Warden's own frozen gauntlet-blade", desc:"Doesn't melt. Hasn't, in longer than anyone's been asking.", type:"equip", slot:"weapon", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconGuardCleaver },
   { name:"frost-cut striders, impossibly sure-footed on ice", desc:"Never once slip. You've stopped testing it.", type:"equip", slot:"boots", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconGripBoots },
   { name:"a frost-sealed circlet, thoughts still legible through the ice", desc:"Whoever wore it last was mid-thought. Still is, technically.", type:"equip", slot:"head", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconStolenCrown },
   { name:"a frost-cracked helm, sealed shut with ice", desc:"Had to be thawed open once already. Froze shut again by morning.", type:"equip", slot:"head", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"glass-plated armor, holding its shape by habit", desc:"Should have shattered by now. Hasn't gotten around to it.", type:"equip", slot:"chest", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"ice-bound greaves, creaking with every step", desc:"The creak is just the ice settling. Probably.", type:"equip", slot:"legs", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"frost-packed boots, never fully thawing", desc:"Cold enough to notice through two pairs of socks. You've given up on three.", type:"equip", slot:"boots", bonus:{beef:12, zip:8, grit:8, hoodoo:8}, classRequired:'Meathead', tier:'epic', icon: iconScorchedGreaves },
   { name:"a rime-dusted cap, cold against the scalp", desc:"You've stopped noticing the cold. Everyone else notices it on you.", type:"equip", slot:"head", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"a glass-stitched vest, flexible despite the cold", desc:"Shouldn't bend this easily. Does anyway.", type:"equip", slot:"chest", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"frost-slick leggings, somehow never slipping", desc:"Everything else here is ice. These just aren't.", type:"equip", slot:"legs", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"an ice-forged blade, edge perpetually frosted", desc:"Never needs sharpening. The frost does the work.", type:"equip", slot:"weapon", bonus:{zip:12, grit:8, hoodoo:8, beef:8}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"a frost-sealed vestment, cold enough to sting", desc:"You've stopped flinching at the sting. Mostly.", type:"equip", slot:"chest", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"glass-threaded leggings, brittle-looking, never breaking", desc:"Every step looks like the one that finally cracks them. It isn't.", type:"equip", slot:"legs", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"frost-step slippers, silent on broken ice", desc:"Not one crunch, no matter how you walk.", type:"equip", slot:"boots", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a rime-tipped wand, frost curling off the end", desc:"Leaves a thin coat of frost on whatever it points at, including you.", type:"equip", slot:"weapon", bonus:{hoodoo:12, beef:8, zip:8, grit:8}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
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
   { name:"a storm-dented helm, ringing faintly in high wind", desc:"Picks up every gust like a struck bell.", type:"equip", slot:"head", bonus:{beef:13, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"a charge-scarred cuirass, humming under pressure", desc:"You can feel the next strike coming before it lands.", type:"equip", slot:"chest", bonus:{beef:13, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"wind-battered greaves, never quite still", desc:"Shift in a breeze that isn't there.", type:"equip", slot:"legs", bonus:{beef:13, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"storm-cracked boots, sparking faintly with each step", desc:"Leaves a trail of tiny static snaps behind you.", type:"equip", slot:"boots", bonus:{beef:13, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a wind-whipped hood, never sitting quite flat", desc:"Always looks like you just stepped out of a gale. You usually have.", type:"equip", slot:"head", bonus:{zip:13, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"a storm-stitched vest, crackling faintly at the seams", desc:"Static builds up if you stand still too long.", type:"equip", slot:"chest", bonus:{zip:13, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"charge-soled boots, quick between thunderclaps", desc:"You're already somewhere else by the time the thunder catches up.", type:"equip", slot:"boots", bonus:{zip:13, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a storm-forged blade, edge humming with static", desc:"Gives you a little shock every time you sheathe it.", type:"equip", slot:"weapon", bonus:{zip:13, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"a storm-touched circlet, hair standing on end beneath it", desc:"You've given up trying to flatten it back down.", type:"equip", slot:"head", bonus:{hoodoo:13, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconChampionCrown },
   { name:"wind-threaded leggings, never quite settling", desc:"Billow faintly even standing still indoors.", type:"equip", slot:"legs", bonus:{hoodoo:13, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"static-charged slippers, sparking at the heel", desc:"A small blue spark on every step. Nobody's explained why.", type:"equip", slot:"boots", bonus:{hoodoo:13, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a storm-caller's rod, tip crackling faint blue", desc:"Hums louder the closer a real storm actually is.", type:"equip", slot:"weapon", bonus:{hoodoo:13, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];

/* ---------------- The Prism Depths — Verdant Hollow (wave 2) ---------------- */
/* First of wave 2 (quest18, "Old Light, Older Debts," gates all three —
see dungeon.js's own DUNGEONS registry) — the Lucent's own discipline of
growth/binding: whatever Verdant Hollow was built to cultivate, it's
still cultivating, slower now and with nobody left to harvest it.
Continues the same ~+14%-per-step ZONE_DIFFICULTY ratio (11.2 ->
12.8 is +14.3%) and the gearDrop ladder's +1-per-dungeon climb
(stormreach +13 -> verdant hollow +14). Palette: forest green/moss-
olive over the same angular Lucent silhouette family every Act 3
creature shares. */
ZONE_DIFFICULTY.verdanthollow = 12.8;

const verdantHollowRegulars = [
   { name:"a bramble-bound sentinel, more vine than whatever it used to be", beef:13, zip:0, grit:38, hoodoo:0, xp:64, zone:"verdanthollow",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"pulls its own growth tight and holds" } ],
    art: artBrambleBoundSentinel, loot:null },
   { name:"a seed-caster, lobbing something that already took root", beef:13, zip:0, grit:39, hoodoo:0, xp:65, zone:"verdanthollow",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:56, flavor:"lets fly a pod that wasn't finished growing" } ],
    art: artSeedCaster, loot:null },
   { name:"a moss-grown caretaker, tending a garden that stopped needing one", beef:14, zip:0, grit:38, hoodoo:0, xp:66, zone:"verdanthollow",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:25, healMax:43, flavor:"folds back into its own green and knits shut" } ],
    art: artMossGrownCaretaker, loot:null },
   ];

/* Verdant Hollow's own boss — the first Act 3 use of the 'poison'
debuff (state.playerStatusEffect, combat.js) — a natural fit for
growth/binding that Embercrypt's burn and Frostvault's freeze hadn't
covered yet. */
const rootboundWarden = {
   name:"the Rootbound Warden, holding the Hollow the only way it still can — by not letting go", beef:17, zip:0, grit:55, hoodoo:0, xp:165, rare:true, zone:"verdanthollow",
   skills:[
      { type:'debuff', chance:0.22, debuffType:'poison', debuffTurns:3, dmgPerTurn:20, flavor:"wraps something old and patient around you" },
      { type:'heal', chance:0.18, healMin:25, healMax:42, flavor:"pulls itself back together, root by root" },
      ],
   art: artRootboundWarden, loot:null
};

const verdantHollowTreasure = [
   { name:"the Rootbound Warden's own grasping bough", desc:"Still rooted, somehow, in a hand instead of soil.", type:"equip", slot:"weapon", bonus:{beef:14, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconBannerLance },
   { name:"a bramble-woven circlet, thorns worn smooth from wear", desc:"Drew blood exactly once. Learned its lesson.", type:"equip", slot:"head", bonus:{zip:14, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconChampionCrown },
   { name:"a moss-grown vestment, cool and a little damp, always", desc:"Never quite dries. You've stopped minding.", type:"equip", slot:"chest", bonus:{hoodoo:14, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconVest },
   { name:"a bark-plated helm, still faintly growing", desc:"A size too small every spring. You've given up refitting it.", type:"equip", slot:"head", bonus:{beef:14, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"a root-woven cuirass, settling tighter every season", desc:"Fit loose when you found it. Doesn't anymore.", type:"equip", slot:"chest", bonus:{beef:14, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"vine-wrapped greaves, never quite done tightening", desc:"You've stopped trying to loosen them. They know better than you do.", type:"equip", slot:"legs", bonus:{beef:14, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"moss-soled boots, silent on the Hollow's own floor", desc:"Leave no print. Leave a faint green smell instead.", type:"equip", slot:"boots", bonus:{beef:14, zip:9, grit:9, hoodoo:9}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a leaf-stitched vest, shedding and regrowing on its own", desc:"Drops a leaf a week. Grows one back just as fast.", type:"equip", slot:"chest", bonus:{zip:14, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"bramble-threaded leggings, thorns worn smooth", desc:"Looked dangerous once. You've since worn every thorn down.", type:"equip", slot:"legs", bonus:{zip:14, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"root-grip boots, never once slipping on wet moss", desc:"Find purchase where there shouldn't be any.", type:"equip", slot:"boots", bonus:{zip:14, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a thorn-edged blade, still faintly sap-slick", desc:"Never quite dries off. Never quite needs to.", type:"equip", slot:"weapon", bonus:{zip:14, grit:9, hoodoo:9, beef:9}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"a seed-studded circlet, sprouting slower than you'd expect", desc:"One of the seeds finally cracked open last week. You're not sure into what.", type:"equip", slot:"head", bonus:{hoodoo:14, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconChampionCrown },
   { name:"moss-grown leggings, cool and a little damp, always", desc:"The same dampness the vestment has. You've stopped questioning it.", type:"equip", slot:"legs", bonus:{hoodoo:14, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"root-laced slippers, growing into the shape of your feet", desc:"Fit better every day you wear them. A little too well.", type:"equip", slot:"boots", bonus:{hoodoo:14, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a growth-bent wand, still slowly curving", desc:"Wasn't this crooked when you picked it up. Keeps changing shape.", type:"equip", slot:"weapon", bonus:{hoodoo:14, beef:9, zip:9, grit:9}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];

/* ---------------- The Prism Depths — Duskward (wave 2) ---------------- */
/* Second of wave 2 — the Lucent's own discipline of shadow/null-light,
"the clearest echo of the Dimming itself" (per the Act 3 plan). Continues
the same ratios (12.8 -> 14.6 is +14.1%; verdant hollow +14 -> duskward
+15). Palette: shadow-violet/pale lavender over the same angular Lucent
silhouette family. */
ZONE_DIFFICULTY.duskward = 14.6;

const duskwardRegulars = [
   { name:"a hollow-eyed watchman, standing guard over nothing that's still there", beef:14, zip:0, grit:41, hoodoo:0, xp:68, zone:"duskward",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"draws the dark in closer, like a coat" } ],
    art: artHollowEyedWatchman, loot:null },
   { name:"an unlit lanternbearer, carrying a light that went out a long time ago", beef:15, zip:0, grit:42, hoodoo:0, xp:69, zone:"duskward",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:48, boltMax:60, flavor:"the lantern flares once, wrong-colored and cold" } ],
    art: artUnlitLanternbearer, loot:null },
   { name:"a shade-stitched mender, patching itself with borrowed dark", beef:15, zip:0, grit:41, hoodoo:0, xp:70, zone:"duskward",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:27, healMax:46, flavor:"pulls a little more shadow over the tear" } ],
    art: artShadeStitchedMender, loot:null },
   ];

/* Duskward's own boss — a bolt-heavy kit, same "one signature mechanic,
no debuff" shape unansweredHerald (Stormreach) uses, reused deliberately
here too: Duskward is meant to read as raw ominous power rather than a
status effect, the most dangerous "preview" of the real Dimming. */
const lastCandle = {
   name:"the Last Candle, still burning down here for reasons nobody's left to remember", beef:18, zip:0, grit:58, hoodoo:0, xp:175, rare:true, zone:"duskward",
   skills:[
      { type:'bolt', chance:0.24, boltMin:52, boltMax:66, flavor:"goes out all at once, and something worse arrives in the dark" },
      { type:'buff', chance:0.18, buffMult:1.5, buffTurns:2, flavor:"gutters, then catches again, brighter than before" },
      ],
   art: artLastCandle, loot:null
};

const duskwardTreasure = [
   { name:"the Last Candle's own unlit wick, somehow still sharp", desc:"Doesn't give off light. Takes it, a little, from everything nearby.", type:"equip", slot:"weapon", bonus:{beef:15, zip:10, grit:10, hoodoo:10}, classRequired:'Meathead', tier:'epic', icon: iconVizierScepter },
   { name:"shade-stitched leggings, seamed with borrowed dark", desc:"The stitching keeps moving if you don't look at it directly.", type:"equip", slot:"legs", bonus:{zip:15, grit:10, hoodoo:10, beef:10}, classRequired:'Card Shark', tier:'epic', icon: iconCutpurseLeggings },
   { name:"an unlit lanternbearer's own boots, quiet on purpose", desc:"Every step lands exactly where the dark already was.", type:"equip", slot:"boots", bonus:{hoodoo:15, beef:10, zip:10, grit:10}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a shadow-dark helm, visor never quite visible", desc:"You can't actually see the eye slits. Somehow you can still see fine.", type:"equip", slot:"head", bonus:{beef:15, zip:10, grit:10, hoodoo:10}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"an unlit cuirass, darker than the room around it", desc:"Stands out by disappearing. Nobody's explained how that works.", type:"equip", slot:"chest", bonus:{beef:15, zip:10, grit:10, hoodoo:10}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"dusk-wrapped greaves, edges that won't quite resolve", desc:"Look fine head-on. Blur at the edges if you glance away.", type:"equip", slot:"legs", bonus:{beef:15, zip:10, grit:10, hoodoo:10}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"shade-soled boots, leaving no sound and less light", desc:"Even your own shadow seems unsure where you are.", type:"equip", slot:"boots", bonus:{beef:15, zip:10, grit:10, hoodoo:10}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a dark-woven hood, always a shade darker than expected", desc:"Looks black in any light. Looks blacker in the dark.", type:"equip", slot:"head", bonus:{zip:15, grit:10, hoodoo:10, beef:10}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"an unlit vest, somehow colder than the dark around it", desc:"You layer up underneath it anyway. Doesn't help much.", type:"equip", slot:"chest", bonus:{zip:15, grit:10, hoodoo:10, beef:10}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"shadow-step boots, quieter than the dark they move through", desc:"You've startled yourself more than once, not hearing your own steps.", type:"equip", slot:"boots", bonus:{zip:15, grit:10, hoodoo:10, beef:10}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a dusk-forged blade, edge that catches no light at all", desc:"You check it's still there by touch, not sight.", type:"equip", slot:"weapon", bonus:{zip:15, grit:10, hoodoo:10, beef:10}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"an unlit circlet, humming instead of glowing", desc:"Every other circlet you've found glows. This one just hums, low and steady.", type:"equip", slot:"head", bonus:{hoodoo:15, beef:10, zip:10, grit:10}, classRequired:'Hexpert', tier:'epic', icon: iconChampionCrown },
   { name:"a shade-threaded robe, cold the way absence is cold", desc:"Not cold like winter. Cold like something missing.", type:"equip", slot:"chest", bonus:{hoodoo:15, beef:10, zip:10, grit:10}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"dusk-wrapped leggings, darker below the knee for no reason", desc:"You've checked. There's no reason. They're just darker down there.", type:"equip", slot:"legs", bonus:{hoodoo:15, beef:10, zip:10, grit:10}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"an unlit wand, tip holding a dark instead of a light", desc:"Points at something and that something gets a little harder to see.", type:"equip", slot:"weapon", bonus:{hoodoo:15, beef:10, zip:10, grit:10}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];

/* ---------------- The Prism Depths — Ironloom (wave 2) ---------------- */
/* Third of wave 2 — the Lucent's own discipline of clockwork/constructs,
a deliberate callback to the Moles' own machine theme (the Lucent taught
them this, per the Act 3 plan). Continues the same ratios (14.6 -> 16.6
is +13.7%; duskward +15 -> ironloom +16). Palette: bronze/brass over the
same angular Lucent silhouette family. */
ZONE_DIFFICULTY.ironloom = 16.6;

const ironloomRegulars = [
   { name:"a coiled tensioner, wound past anything it was built to hold", beef:15, zip:0, grit:44, hoodoo:0, xp:72, zone:"ironloom",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"winds itself one notch tighter" } ],
    art: artCoiledTensioner, loot:null },
   { name:"a loom-spindle, still weaving something nobody's wearing", beef:16, zip:0, grit:45, hoodoo:0, xp:73, zone:"ironloom",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:51, boltMax:64, flavor:"snaps a thread straight at you, faster than thread should go" } ],
    art: artLoomSpindle, loot:null },
   { name:"a stitch-worker, mending gears with thread that shouldn't hold metal", beef:16, zip:0, grit:44, hoodoo:0, xp:74, zone:"ironloom",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:29, healMax:49, flavor:"binds the crack shut, thread over gear" } ],
    art: artStitchWorker, loot:null },
   ];

/* Ironloom's own boss — reuses Embercrypt's own 'burn' debuff
(overdriven clockwork venting built-up heat), an explicit callback per
the Act 3 plan's own note on this dungeon specifically tying it back to
the first wave's own mechanic. */
const warpLoomOverseer = {
   name:"the Warp-Loom Overseer, running a pattern it finished a long time ago", beef:19, zip:0, grit:61, hoodoo:0, xp:185, rare:true, zone:"ironloom",
   skills:[
      { type:'debuff', chance:0.22, debuffType:'burn', debuffTurns:3, dmgPerTurn:24, flavor:"overdrives something that was never built to run this hot" },
      { type:'buff', chance:0.18, buffMult:1.5, buffTurns:2, flavor:"throws every gear back in sync at once" },
      ],
   art: artWarpLoomOverseer, loot:null
};

const ironloomTreasure = [
   { name:"a warp-loom spindle, still threaded for a pattern nobody's finishing", desc:"Swings like it's still weaving something.", type:"equip", slot:"weapon", bonus:{beef:16, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconDrillRoster },
   { name:"clockwork-stitched plating, ticking faintly under the dents", desc:"You've stopped trying to find out what the ticking is counting down to.", type:"equip", slot:"chest", bonus:{zip:16, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconClockworkPlate },
   { name:"tensioner-wound greaves, wound one notch past comfortable", desc:"Every step releases a little of the tension back.", type:"equip", slot:"legs", bonus:{hoodoo:16, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconBurrowGreaves },
   { name:"a gear-plated helm, ticking faintly when you turn your head", desc:"Keeps its own time. Hasn't agreed with the real clock once.", type:"equip", slot:"head", bonus:{beef:16, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"a loom-forged cuirass, threaded tighter than it looks", desc:"Looks loose. Isn't. Never has been.", type:"equip", slot:"chest", bonus:{beef:16, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"cog-braced greaves, clicking into place with every stride", desc:"You've started walking in time with the clicking instead of the other way around.", type:"equip", slot:"legs", bonus:{beef:16, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconScorchedGreaves },
   { name:"spring-loaded boots, a half-step quicker than they should be", desc:"You arrive at the top of the stairs before you mean to.", type:"equip", slot:"boots", bonus:{beef:16, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a tensioner-wound cap, wound one notch tighter than comfortable", desc:"Headaches, the first week. You've stopped noticing since.", type:"equip", slot:"head", bonus:{zip:16, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"clockwork-threaded leggings, ticking in time with your own pulse", desc:"Matched your heartbeat on day one. Hasn't drifted since.", type:"equip", slot:"legs", bonus:{zip:16, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"gear-soled boots, clicking softly with each step", desc:"Quiet enough nobody notices. Loud enough you always do.", type:"equip", slot:"boots", bonus:{zip:16, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a spindle-edged blade, still faintly threaded", desc:"A loose thread trails off the tip. Never seems to run out.", type:"equip", slot:"weapon", bonus:{zip:16, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"a loom-woven circlet, humming with wound-up tension", desc:"Feels like it's about to spring loose. Never does.", type:"equip", slot:"head", bonus:{hoodoo:16, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconChampionCrown },
   { name:"a gear-stitched robe, ticking quietly under the fabric", desc:"You've learned not to lean against anything metal while wearing it.", type:"equip", slot:"chest", bonus:{hoodoo:16, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"tensioner-wound slippers, coiled tight at the heel", desc:"Every step has a little extra spring behind it.", type:"equip", slot:"boots", bonus:{hoodoo:16, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a cog-tipped wand, clicking faintly with every cast", desc:"Counts down to something, each time you use it. Never reaches zero.", type:"equip", slot:"weapon", bonus:{hoodoo:16, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];

/* ---------------- The Prism Depths — Echo Chapel (wave 3) ---------------- */
/* First of wave 3 (quest19, "The Last Two Rooms," gates both — see
dungeon.js's own DUNGEONS registry) — the Lucent's own discipline of
sound/memory, a callback to the Warren's Ear's own Choir. Continues the
same ratios (16.6 -> 18.9 is +13.9%; ironloom +16 -> echo chapel +17).
Palette: slate blue/pale sky over the same angular Lucent silhouette
family. */
ZONE_DIFFICULTY.echochapel = 18.9;

const echoChapelRegulars = [
   { name:"a resonance warden, holding one note longer than it should last", beef:16, zip:0, grit:47, hoodoo:0, xp:76, zone:"echochapel",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"leans into its own echo until it holds steady" } ],
    art: artResonanceWarden, loot:null },
   { name:"a chime-caster, ringing something that was never meant to be struck", beef:17, zip:0, grit:48, hoodoo:0, xp:77, zone:"echochapel",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:55, boltMax:68, flavor:"strikes true, and the whole chapel strikes back with it" } ],
    art: artChimeCaster, loot:null },
   { name:"a hum-keeper, stitching itself whole with its own held note", beef:17, zip:0, grit:47, hoodoo:0, xp:78, zone:"echochapel",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:32, healMax:52, flavor:"hums the crack shut, one long unbroken note" } ],
    art: artHumKeeper, loot:null },
   ];

/* Echo Chapel's own boss — bolt-heavy (a struck, resonant note) plus a
heal (the note stitching its own damage shut) — the first use of this
particular combination, distinct from every boss before it. */
const unbrokenChord = {
   name:"the Unbroken Chord, still holding a note that should have ended centuries ago", beef:20, zip:0, grit:64, hoodoo:0, xp:195, rare:true, zone:"echochapel",
   skills:[
      { type:'bolt', chance:0.24, boltMin:58, boltMax:72, flavor:"lets the note finally land, all at once" },
      { type:'heal', chance:0.18, healMin:28, healMax:46, flavor:"folds the damage back into the song and keeps singing" },
      ],
   art: artUnbrokenChord, loot:null
};

const echoChapelTreasure = [
   { name:"the Unbroken Chord's own struck chime, still ringing faintly", desc:"Hits like the note never actually stopped.", type:"equip", slot:"weapon", bonus:{beef:17, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconAceBlade },
   { name:"resonance-soled boots, landing a half-beat ahead of you", desc:"You've learned to let them lead.", type:"equip", slot:"boots", bonus:{zip:17, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconSpringBoots },
   { name:"a hum-keeper's own circlet, humming one note you can't place", desc:"You've caught yourself humming it back, more than once.", type:"equip", slot:"head", bonus:{hoodoo:17, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconGuardHelm },
   { name:"a chime-plated helm, ringing faintly when struck", desc:"Rings true even when nothing's actually hit it.", type:"equip", slot:"head", bonus:{beef:17, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconBottlecapHelmet },
   { name:"a resonant cuirass, humming with every heartbeat", desc:"Keeps a beat you didn't ask it to keep.", type:"equip", slot:"chest", bonus:{beef:17, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"note-braced greaves, keeping perfect, pointless time", desc:"Click in rhythm whether you're walking to anything or not.", type:"equip", slot:"legs", bonus:{beef:17, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"echo-soled boots, each step landing a half-beat late", desc:"You hear your own footsteps twice, every time.", type:"equip", slot:"boots", bonus:{beef:17, zip:11, grit:11, hoodoo:11}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a hum-threaded hood, carrying a note you can't quite place", desc:"Everyone who hears it hums along without meaning to.", type:"equip", slot:"head", bonus:{zip:17, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"a resonance-stitched vest, vibrating faintly at the seams", desc:"Hums louder near anything else that's humming.", type:"equip", slot:"chest", bonus:{zip:17, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"chime-threaded leggings, ringing softly with every stride", desc:"You've learned to walk a little lighter, just to keep it quiet.", type:"equip", slot:"legs", bonus:{zip:17, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"a struck-chord blade, still faintly ringing", desc:"Rings a note on every hit. Never the same note twice.", type:"equip", slot:"weapon", bonus:{zip:17, grit:11, hoodoo:11, beef:11}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"a hum-woven robe, holding one note longer than it should", desc:"The note's still going from the last time you wore it.", type:"equip", slot:"chest", bonus:{hoodoo:17, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"echo-threaded leggings, repeating your own last step", desc:"You hear yourself walk a half-second after you actually do.", type:"equip", slot:"legs", bonus:{hoodoo:17, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"resonance-soled slippers, landing a half-beat ahead of you", desc:"Same trick the boots pull. Quieter about it.", type:"equip", slot:"boots", bonus:{hoodoo:17, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSlippers },
   { name:"a chime-tipped wand, ringing faintly with every cast", desc:"The whole chapel seems to ring back a half-second later.", type:"equip", slot:"weapon", bonus:{hoodoo:17, beef:11, zip:11, grit:11}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];

/* ---------------- The Prism Depths — Sunken Archive (wave 3) ---------------- */
/* Last of the first 8 dungeons — the Lucent's own history, the direct
lead-in to the eventual finale (not built this pass — see the Act 3
plan). Continues the same ratios (18.9 -> 21.5 is +13.8%; echo chapel
+17 -> sunken archive +18). Palette: aged sepia/faded gold over the same
angular Lucent silhouette family. */
ZONE_DIFFICULTY.sunkenarchive = 21.5;

const sunkenArchiveRegulars = [
   { name:"a marginalia-wraith, scrawled in the gaps of something older than it", beef:17, zip:0, grit:50, hoodoo:0, xp:80, zone:"sunkenarchive",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"underlines itself twice, for emphasis" } ],
    art: artMarginaliaWraith, loot:null },
   { name:"an index-walker, citing a source that's about to cite you back", beef:18, zip:0, grit:51, hoodoo:0, xp:81, zone:"sunkenarchive",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:58, boltMax:72, flavor:"delivers the footnote directly, at speed" } ],
    art: artIndexWalker, loot:null },
   { name:"a page-binder, re-stitching a spine that's been read too many times", beef:18, zip:0, grit:50, hoodoo:0, xp:82, zone:"sunkenarchive",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:34, healMax:55, flavor:"rebinds itself along the crease" } ],
    art: artPageBinder, loot:null },
   ];

/* The Sunken Archive's own boss — reuses the 'poison' debuff
(Verdant Hollow's own first use), reflavored as a slow, patient
revelation rather than binding growth — the wave's closing note before
the quest chain's own next step (not this pass's own scope). */
const lastArchivist = {
   name:"the Last Archivist, still cataloguing a collection nobody's left to read", beef:21, zip:0, grit:67, hoodoo:0, xp:205, rare:true, zone:"sunkenarchive",
   skills:[
      { type:'debuff', chance:0.22, debuffType:'poison', debuffTurns:3, dmgPerTurn:28, flavor:"files something slow and patient directly under your skin" },
      { type:'buff', chance:0.18, buffMult:1.5, buffTurns:2, flavor:"cross-references itself against its own best entry" },
      ],
   art: artLastArchivist, loot:null
};

const sunkenArchiveTreasure = [
   { name:"the Last Archivist's own binding-blade, still sharp enough to cut a page clean", desc:"Files whatever it touches under \"closed.\"", type:"equip", slot:"weapon", bonus:{beef:18, zip:12, grit:12, hoodoo:12}, classRequired:'Meathead', tier:'epic', icon: iconSiegeBreaker },
   { name:"a marginalia-woven circlet, annotated in a hand that isn't yours", desc:"The notes update themselves. You've stopped reading them too closely.", type:"equip", slot:"head", bonus:{zip:18, grit:12, hoodoo:12, beef:12}, classRequired:'Card Shark', tier:'epic', icon: iconCap },
   { name:"an index-walker's own boots, always already where the next citation is", desc:"You arrive at conclusions slightly before you mean to.", type:"equip", slot:"boots", bonus:{hoodoo:18, beef:12, zip:12, grit:12}, classRequired:'Hexpert', tier:'epic', icon: iconBlessedBoots },
   { name:"a binding-plated helm, cataloguing every hit it takes", desc:"You could read the dents like a ledger, if you cared to.", type:"equip", slot:"head", bonus:{beef:18, zip:12, grit:12, hoodoo:12}, classRequired:'Meathead', tier:'epic', icon: iconGuardHelm },
   { name:"an archive-sealed cuirass, filed shut and staying that way", desc:"Opens for nobody. Including, as far as you can tell, you.", type:"equip", slot:"chest", bonus:{beef:18, zip:12, grit:12, hoodoo:12}, classRequired:'Meathead', tier:'epic', icon: iconPalaceForgedPlate },
   { name:"page-braced greaves, creaking like an old spine", desc:"Sound exactly like a book being opened, every single step.", type:"equip", slot:"legs", bonus:{beef:18, zip:12, grit:12, hoodoo:12}, classRequired:'Meathead', tier:'epic', icon: iconBurrowGreaves },
   { name:"index-soled boots, always already where the next step is", desc:"Find your footing before you've decided where to put it.", type:"equip", slot:"boots", bonus:{beef:18, zip:12, grit:12, hoodoo:12}, classRequired:'Meathead', tier:'epic', icon: iconGripBoots },
   { name:"a marginalia-stitched vest, annotated in someone else's hand", desc:"New notes appear in the margins. You've stopped asking by whom.", type:"equip", slot:"chest", bonus:{zip:18, grit:12, hoodoo:12, beef:12}, classRequired:'Card Shark', tier:'epic', icon: iconVest },
   { name:"footnote-threaded leggings, citing every step you take", desc:"Somewhere, something is keeping very detailed track of where you've been.", type:"equip", slot:"legs", bonus:{zip:18, grit:12, hoodoo:12, beef:12}, classRequired:'Card Shark', tier:'epic', icon: iconTrousers },
   { name:"citation-soled boots, arriving slightly before you do", desc:"Your own footprints are already there when you look down.", type:"equip", slot:"boots", bonus:{zip:18, grit:12, hoodoo:12, beef:12}, classRequired:'Card Shark', tier:'epic', icon: iconMismatchedBoots },
   { name:"a binding-edged blade, sharp enough to cut a page clean", desc:"The Last Archivist's own trick, smaller and a little less final.", type:"equip", slot:"weapon", bonus:{zip:18, grit:12, hoodoo:12, beef:12}, classRequired:'Card Shark', tier:'epic', icon: iconCardShank },
   { name:"an archivist's own circlet, humming with half-read thoughts", desc:"You catch fragments of sentences that were never finished.", type:"equip", slot:"head", bonus:{hoodoo:18, beef:12, zip:12, grit:12}, classRequired:'Hexpert', tier:'epic', icon: iconChampionCrown },
   { name:"a page-bound robe, rustling faintly with every movement", desc:"Sounds like turning pages even standing perfectly still.", type:"equip", slot:"chest", bonus:{hoodoo:18, beef:12, zip:12, grit:12}, classRequired:'Hexpert', tier:'epic', icon: iconScorchRobe },
   { name:"marginalia-threaded leggings, annotated somewhere you can't quite read", desc:"The notes are definitely there. You just can't make them out.", type:"equip", slot:"legs", bonus:{hoodoo:18, beef:12, zip:12, grit:12}, classRequired:'Hexpert', tier:'epic', icon: iconFeatherScale },
   { name:"a last-archivist's own wand, tip worn smooth from use", desc:"Centuries of cataloguing will do that to a thing.", type:"equip", slot:"weapon", bonus:{hoodoo:18, beef:12, zip:12, grit:12}, classRequired:'Hexpert', tier:'epic', icon: iconWandStick },
   ];
