/* ---------------- Monster stat lookup table ---------------- */
/* Single source of truth for every monster/boss's own core combat
stats (beef/zip/grit/hoodoo/armor/xp) -- tune a fight by editing a
number here, not by hunting through content.js/mudroot-content.js/
warrensear-content.js/emberwarren-content.js/crystalcity-content.js/
prismdepths-content.js for the one object literal that happens to
define it.

Keyed by each monster's own exact `name` string -- already unique and
stable across the whole game (confirmed mechanically before this file
existed: no two monsters anywhere share a name). Every monster
definition in those 6 files spreads its own entry here
(`...MONSTER_STATS["<name>"]`) right where beef/zip/grit/hoodoo/armor/
xp used to be hardcoded inline (armor joined the other 5 in a later
pass -- see its own comment further down); everything else about a
monster (zone, skills, art, loot/rareDrop/gearDrop) still lives exactly
where it always has -- this file changes WHAT backs these numbers, not
the rest of the monster's own shape.

Grouped below by source file, then by zone within it, in the same
order those monsters are actually defined -- purely for navigation
when tuning; MONSTER_STATS itself is just one flat object, order
doesn't matter to the lookup.

Loads FIRST, before every one of those 6 content files (index.html) --
each one's own monsters[]-building array literal evaluates
IMMEDIATELY at parse time and references this object by value, the
same "must exist before its first use" ordering every art.js/icons.js
function already has to satisfy.

**Zip is a real archetype axis, not a default-0 afterthought.** Per
explicit correction: before this pass, 349/355 monsters had zip:0 --
the dodge mechanic (zipDodgeAndAccuracy(), combat.js -- fully
symmetric, the exact same formula and ZIP_DODGE_CAP/ZIP_DODGE_
COEFFICIENT drive both the player's own dodge AND a monster's)
existed and worked, but almost nothing in the game actually used it,
so players dodged monsters constantly while monsters essentially
never dodged back. 138 monsters were converted to a real "evasive"
archetype here: zip raised (3-8, chosen from the same range the game's
own pre-existing evasive bosses already used -- roguesDenEnforcer's
zip:6, casinoChampion's zip:7 -- not invented numbers), grit lowered by
roughly the SAME fraction as the resulting dodge chance (preserves
expected turns-to-kill: a monster that dodges 24% of hits also loses
24% of its old HP, so it's not simply safer to fight, just differently
risky -- more swingy, since a streak of whiffs now plays very
differently than a streak of hits, which is exactly the "lower HP, high
zip, just as challenging" archetype a real player asked for after
noticing monsters never dodged). Conversion picked by: an explicit
evasive-flavored name (quick/slick/dart/dodge/slip/runner/dancer/etc)
always converts; an explicit heavy/immovable-flavored name
(warden/sentinel/archivist/colossus/lumbering/etc) never does; anything
else converts roughly 1-in-3 within its own zone, so most zones/
dungeons end up with a real MIX of tank/striker/evasive instead of one
archetype everywhere. The 6 monsters that already had deliberately-
authored nonzero zip from an earlier pass were left completely
untouched. Verified behavior-preserving everywhere else (a live
extraction diffed beef/grit/hoodoo/xp/hp/atk for all 355 monsters
before and after -- zero unintended differences) and re-verified the
Prism Depths difficulty calibration specifically (bare-Attack still
loses essentially every time, a properly-geared-and-spelled run still
clears reliably with real risk) since 4 of the 8 dungeons' own final
bosses became evasive here.

**Per an immediate follow-up correction: zip should never actually be
0, not even for the tank/striker archetypes left untouched above.**
The player always carries SOME incidental zip -- secondary stats on
gear add up even for a class that never spends a stat point on it --
and `effectiveDodgeChance = max(0, playerZipDodge - monsterZipDodge)`
means a monster sitting at a literal 0 provides ZERO counter-pressure
against that, so even a "pure tank" was getting dodged for free. Every
one of the 211 monsters this pass's own archetype assignment left at
zip:0 got a small floor instead -- 2 for regular trash/dungeon-trash,
3 for zone-bosses/dungeon-minibosses, 4 for dungeon-bosses (6-15%
dodge, nowhere near the real "evasive" archetype's 3-8/9-36% range, so
evasive monsters still read as meaningfully more dodgy than the
baseline). Grit was NOT reduced for these -- the floor is cheap enough
(a handful of percentage points) that it doesn't need a tradeoff the
way the real evasive conversion above does.

**When adding a new monster: zip is never 0.** Pick an archetype on
purpose -- tank/striker (beef/grit-heavy, zip at the small 2-4 floor
above) or evasive (meaningful zip, grit pulled down to compensate, per
the ranges above) -- the same way beef/grit already get a deliberate
value instead of a placeholder.

**Armor is a real authored field now too** -- per explicit request
("monsters should also have an armor stat"). It used to be purely
derived from grit + rare:true (two flat per-grit-rate constants,
MONSTER_ARMOR_PER_GRIT/MONSTER_RARE_ARMOR_PER_GRIT, content.js -- both
now deleted, nothing reads them anymore); deriveMonsterCombatStats()
(combat.js) just reads m.armor straight off the template now, same as
every other stat here. Every one of the 355 monsters below was seeded
with EXACTLY what that old formula would have produced for its own
(post-zip-rebalance) grit/rare at the moment of the switch -- grit*0.15
for regular trash, grit*0.25 for anything rare (zone-boss/dungeon-
miniboss/dungeon-boss), rounded -- so this pass changed the
ARCHITECTURE, not a single monster's actual armor value (verified: a
live extraction diffed every monster's derived hp/atk/armor before and
after -- zero differences). Going forward, armor can be tuned
independently of grit -- a "heavily plated but fragile" archetype
(high armor, low grit/HP) is now possible the same way zip's own
"evasive" archetype (high zip, low grit/HP) already is above.

**That archetype IS now authored, per immediate follow-up request**
("Yes do this"): 89 of the 211 non-evasive monsters were converted to
a real "armored" archetype -- armor raised into a tier well above
ambient (7-9 for regular trash/dungeon-trash, 10-12 for zone-bosses/
dungeon-minibosses, 13-15 for dungeon-bosses, NEVER decreased if a
monster's own armor already exceeded its tier), grit cut by the same
fraction as the resulting EXTRA mitigation this adds (armorDamage
Reduction()'s own marginal gain, combat.js -- same "the tradeoff
should roughly preserve how many turns it takes to kill this thing"
principle the zip archetype's grit cut already uses, just measured in
damage-per-hit avoided instead of hits-avoided-outright). Selection:
an explicit armored-flavored name (plated/shelled/forged/riveted/
scaled/crusted/husk/bottlecap/etc) always converts; an explicit
ethereal/incorporeal name (wisp/spirit/shadow/echo/ghost/familiar)
never does; anything else in the non-evasive pool converts roughly
1-in-3, same density the zip pass used, so the tank/striker/evasive/
armored mix stays balanced rather than the armored archetype eating
everything that was left. A monster is never BOTH evasive and armored
-- the two low-HP archetypes stay mutually exclusive so neither
becomes a strictly-better pick; a monster that's already both tanky
AND rare (several dungeon finals) gets its armor nudged up only as far
as its own tier, often not moving at all since its grit-derived armor
already cleared that bar. Verified the same way every pass here has
been: a live extraction diffed every monster's new armor/grit against
the computed plan (zero mismatches) and the Prism Depths difficulty
calibration was re-checked across all 8 dungeons (bare-Attack still
loses reliably, geared-and-spelled play still clears with real risk).

**hoodoo is a real monster-side "ethereal" archetype now too**, per
explicit request ("how do we handle hoodoo... ethereal things should
be like that as well as how we make hexpert viable"). Until this pass
a monster's hoodoo had zero mechanical effect; hoodooResistance()
(combat.js, HOODOO_RESIST_COEFFICIENT/CAP, content.js) now mitigates a
fraction of damage dealt to that monster, same capped statBonus() curve
armor uses but ONLY against non-magic hits (applyDamageToMonster()'s
`isMagic` gate) — a Hexpert's own spells punch straight through at full
force, which is the actual "make Hexpert viable" payoff: the class that
spends points on hoodoo gets a genuine built-in edge against monsters
that spend points resisting everyone else. 70 of the 122 monsters left
after the evasive/armored passes claimed their own share were converted
to "ethereal" here (mutually exclusive with both of those, same as they
already are with each other) — hoodoo raised to 5-7 for regular/
dungeon-trash, 9-11 for zone-bosses/dungeon-minibosses (a reserved
12-14/capped-at-0.4 tier for dungeon-bosses went unused: all 8 were
already split 4-evasive/4-armored by the prior two passes, so none were
still eligible). Selection: an explicit ethereal-flavored name (wisp/
spirit/shadow/echo/ghost/familiar/summon/hex/rune/divin/mystic/arcane/
spell/curse/charm/conjur/oracle/seer/scry/ritual/enchant/sorcer/witch/
wizard/vizier/phantom/wraith/etc) always converts; an explicit mundane/
brute name (brute/muscle/warden/sentinel/plated/forged/guard/colossus/
etc) never does; anything else in the remaining pool converts roughly
1-in-3, the same density every archetype pass here uses. Unlike the
evasive/armored passes, grit is NOT cut for this one — the benefit is
conditional on the ATTACKER's own choice of damage type (see
HOODOO_RESIST_CAP's own comment, content.js, for why there's no
universal difficulty increase to offset here). Verified the same way:
a live extraction diffed every monster's new hoodoo against the
computed plan (zero mismatches, and beef/zip/grit/armor/xp confirmed
completely untouched by this pass) and the Prism Depths calibration was
re-checked, with particular attention to Meathead/Card Shark win rates
specifically since they're the two classes that face the new
resistance without any way to bypass it.

**The 4 "evasive" Prism Depths dungeon bosses had their own grit
raised** (Emberwright/embercrypt 29->53, Unanswered Herald/stormreach
33->69, Last Candle/duskward 37->76, Unbroken Chord/echochapel 41->83)
— per an explicit, concrete report ("I should not be one hitting a
boss"). A clean audit (real combat, retaliation neutralized so a
boss's own separately-tuned attack output couldn't contaminate the
read, averaged over 20 trials per class/dungeon) measured how many
hits each dungeon's own final boss actually takes assuming the gear a
player would REALISTICALLY have at that point — the PREVIOUS dungeon's
own treasure, not this one's (you can't have earned gear from a
dungeon you haven't cleared yet; every earlier calibration pass this
session tested "beat this dungeon" with THIS dungeon's own gear, which
is a different, easier question). That audit found exactly why the
report was accurate: the 4 evasive bosses (a lower-grit, zip:8
archetype from an earlier pass — see this file's own "evasive
archetype" section above, which never anticipated being checked
against a WEAKER, not-yet-upgraded gear baseline) died in 3.25-7.3
hits, while their 4 "armored" siblings at the same position in the
ladder took 10.8-27.2 — Embercrypt specifically was the worst case,
close enough to a real one/two-hit kill to match the report literally.
Retuned each one's grit so hits-to-kill (same previous-dungeon-gear
assumption) lands on a smoothly ESCALATING curve across the whole
8-boss ladder (~9-11 at Embercrypt up to ~27 at Sunken Archive, no
boss below the next-lowest one any more) — per the same report's
"dungeons need to scale harder." zip/beef/armor/xp are untouched: the
evasive archetype's own dodge-chance identity and the attack-output
side of this finding (bosses can ALSO one/two-shot the player back,
worst again at Embercrypt — 274% of a realistic level-20 character's
own maxHp) were explicitly scoped OUT by request; only the "player
one-shots boss" direction was in scope for this pass. Verified: the
same previous-dungeon-gear audit now shows a clean escalating curve
with no boss below ~9 hits; re-ran the Prism Depths calibration with
each boss's OWN current-tier gear (the "after you've actually earned
it" case) across all 3 classes — still 100% toolkit win rate
everywhere, confirming the raise didn't tip any of the 4 into
unbeatable.

**Every monster's own `zip` was remapped to a much larger number**,
per a live report: a level-21 character with ZERO points spent on Zip
(42 of it purely incidental, from gear secondaries) was already at the
hard 0.5 dodge cap — reachable by accident at ~zip 15, not by a real
stat choice. `ZIP_DODGE_COEFFICIENT` (content.js) dropped ~43x (0.03
-> 0.0007) to fix that for the player side — but that coefficient
drives a MONSTER's own dodge/accuracy off the exact same formula, and
every monster's zip here was still small (2-8, the "evasive" archetype
above included), so a straight reduction would have gutted it right
alongside the player fix (statBonus(8)*0.03=36% dodge would have
collapsed to ~0.7%). Every zip value below was remapped to reproduce
its EXACT old dodge/accuracy percentage under the new coefficient
instead (2->30, 3->38, 4->50, 5->56, 6->65, 7->74, 8->81) — a live
extraction confirmed zero monsters' actual dodge/accuracy changed by
more than rounding, so none of the zip-archetype/floor-correction
balance work earlier in this file was lost, only re-expressed in the
larger zip range the new coefficient now requires. beef/grit/hoodoo/
armor/xp are completely untouched by this pass. */
const MONSTER_STATS = {
   /* ============ content.js ============ */
   // ---- Commons ----
   "a disgruntled compost gnome": { beef:1, zip:38, grit:5, hoodoo:0, armor:1, xp:3 },
   "a feral lawn gnome, off its stake": { beef:2, zip:30, grit:5, hoodoo:0, armor:8, xp:4 },
   "a fishing gnome with an empty bucket": { beef:1, zip:30, grit:7, hoodoo:7, armor:1, xp:4 },
   "a gnome cavalry unit, mounted on a garden snail": { beef:2, zip:38, grit:7, hoodoo:0, armor:1, xp:5 },
   "the self-appointed gnome sergeant": { beef:3, zip:30, grit:10, hoodoo:0, armor:2, xp:7 },
   "a gnome beekeeper, trailing an unbothered swarm": { beef:2, zip:30, grit:5, hoodoo:0, armor:9, xp:4 },
   "a gnome scarecrow, somehow still standing guard": { beef:2, zip:38, grit:6, hoodoo:0, armor:1, xp:4 },
   "a gnome plumber, wrench first into every problem": { beef:2, zip:30, grit:6, hoodoo:0, armor:1, xp:4 },
   "a gnome herald, announcing nothing to no one": { beef:1, zip:30, grit:6, hoodoo:7, armor:1, xp:3 },
   "a gnome tailor, pins still in both sleeves": { beef:1, zip:38, grit:6, hoodoo:0, armor:1, xp:4 },
   "a gnome duelist, challenging shrubs to honor combat": { beef:2, zip:30, grit:6, hoodoo:0, armor:8, xp:5 },
   "a gnome librarian, overdue fines decades deep": { beef:1, zip:30, grit:6, hoodoo:0, armor:1, xp:3 },
   "a gnome weathervane-keeper, pointing the wrong way on principle": { beef:1, zip:38, grit:6, hoodoo:0, armor:1, xp:4 },
   "a gnome mushroom-forager, convinced every one is edible": { beef:2, zip:30, grit:8, hoodoo:0, armor:1, xp:5 },
   "a gnome fortune-teller, reading tea leaves upside down": { beef:1, zip:30, grit:4, hoodoo:0, armor:9, xp:4 },
   // ---- Sewers ----
   "a sewer rat with delusions of grandeur": { beef:3, zip:38, grit:8, hoodoo:0, armor:1, xp:6 },
   "a rat wearing a bottlecap as a helmet": { beef:3, zip:30, grit:9, hoodoo:0, armor:8, xp:7 },
   "a positively enormous sewer rat": { beef:4, zip:30, grit:13, hoodoo:7, armor:2, xp:9 },
   "three rats in a trenchcoat, unconvincingly": { beef:3, zip:38, grit:10, hoodoo:0, armor:2, xp:8 },
   "a sewer brawler rat, squaring up for no reason": { beef:4, zip:30, grit:12, hoodoo:0, armor:2, xp:8 },
   "a drainpipe crawler, bowlegged from the pipes": { beef:4, zip:30, grit:8, hoodoo:0, armor:9, xp:8 },
   "a muck-strider rat, surprisingly sure-footed in sludge": { beef:3, zip:38, grit:9, hoodoo:0, armor:1, xp:7 },
   "a rust-fanged rat, gnawing on a pipe like a weapon": { beef:4, zip:30, grit:12, hoodoo:0, armor:2, xp:9 },
   "a shadow-slick rat, darting between grates": { beef:3, zip:56, grit:7, hoodoo:0, armor:1, xp:7 },
   "a quick-paws rat, light on its feet in the muck": { beef:3, zip:38, grit:9, hoodoo:0, armor:1, xp:7 },
   "a grate-runner rat, never missing a foothold": { beef:4, zip:50, grit:10, hoodoo:0, armor:2, xp:9 },
   "a scrap-blade rat, armed with a shard of tin": { beef:3, zip:30, grit:9, hoodoo:7, armor:1, xp:7 },
   "a sewer soothsayer rat, muttering prophecy into the drains": { beef:3, zip:38, grit:8, hoodoo:0, armor:1, xp:7 },
   "a glow-moss rat, faintly luminous in the dark": { beef:4, zip:30, grit:9, hoodoo:0, armor:8, xp:8 },
   "a silt-stepper rat, leaving no print in the muck": { beef:3, zip:56, grit:8, hoodoo:0, armor:1, xp:7 },
   // ---- Quarry ----
   "a wind-up quarry drone, badly wound": { beef:4, zip:38, grit:10, hoodoo:0, armor:2, xp:10 },
   "a gnome surveyor squinting at an upside-down map": { beef:3, zip:30, grit:9, hoodoo:0, armor:8, xp:9 },
   "a pickaxe golem, held together by spite": { beef:4, zip:30, grit:14, hoodoo:7, armor:2, xp:13 },
   "a rock-crusted quarry rat, huge for some reason": { beef:4, zip:38, grit:11, hoodoo:0, armor:2, xp:11 },
   "a quarry foreman gnome, barking orders nobody follows": { beef:4, zip:30, grit:13, hoodoo:0, armor:2, xp:11 },
   "a stone-hauler gnome, built like the rocks it carries": { beef:4, zip:30, grit:11, hoodoo:0, armor:9, xp:12 },
   "a scaffold-climber gnome, fearless about heights": { beef:3, zip:38, grit:11, hoodoo:0, armor:2, xp:10 },
   "a blast-charge gnome, handling dynamite with alarming confidence": { beef:3, zip:30, grit:11, hoodoo:0, armor:2, xp:10 },
   "a tunnel-runner gnome, quick through narrow shafts": { beef:3, zip:56, grit:9, hoodoo:0, armor:1, xp:10 },
   "a rockslide-dodger gnome, light on crumbling ground": { beef:3, zip:38, grit:11, hoodoo:0, armor:2, xp:11 },
   "a chisel-wielding gnome, striking with surprising precision": { beef:4, zip:30, grit:13, hoodoo:6, armor:2, xp:11 },
   "a quarry surveyor's apprentice gnome, reading maps upside down too": { beef:3, zip:30, grit:8, hoodoo:0, armor:9, xp:10 },
   "a crystal-diviner gnome, led by a twitching rod": { beef:3, zip:38, grit:11, hoodoo:0, armor:2, xp:11 },
   "a tremor-sensing gnome, feeling the rock before it falls": { beef:3, zip:30, grit:11, hoodoo:0, armor:2, xp:10 },
   "a dowsing-rod gnome, pointing at veins nobody else sees": { beef:4, zip:30, grit:13, hoodoo:0, armor:2, xp:12 },
   // ---- Vault ----
   "a vault wisp, humming with old magic": { beef:4, zip:38, grit:13, hoodoo:0, armor:2, xp:15 },
   "a stone sentinel, one eye still lit": { beef:5, zip:30, grit:13, hoodoo:0, armor:8, xp:18 },
   "a hoard-rat, absolutely covered in gold flecks": { beef:4, zip:30, grit:14, hoodoo:7, armor:2, xp:14 },
   "an animated suit of ceremonial armor, empty inside": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:20 },
   "a gnome treasure-diver, head-first into every chest": { beef:4, zip:30, grit:15, hoodoo:0, armor:2, xp:16 },
   "a gnome appraiser, squinting hard at everything": { beef:4, zip:30, grit:11, hoodoo:0, armor:9, xp:15 },
   "a gnome coin-counter, buried under its own hoard": { beef:4, zip:38, grit:14, hoodoo:0, armor:2, xp:16 },
   "a gnome ward-keeper, humming old protective charms": { beef:4, zip:30, grit:16, hoodoo:6, armor:2, xp:17 },
   "a gnome trap-dodger, light-footed through the vault": { beef:3, zip:56, grit:11, hoodoo:0, armor:2, xp:14 },
   "a gnome rune-reader, tracing symbols on the floor": { beef:4, zip:38, grit:14, hoodoo:0, armor:2, xp:16 },
   "a gnome lock-picker, three steps ahead of every trap": { beef:3, zip:30, grit:13, hoodoo:6, armor:2, xp:14 },
   "a gnome vault-runner, racing the closing door": { beef:4, zip:56, grit:11, hoodoo:0, armor:2, xp:15 },
   "a gnome relic-wielder, swinging something it doesn't understand": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:18 },
   "a gnome echo-chaser, following sounds that aren't there": { beef:4, zip:30, grit:15, hoodoo:6, armor:2, xp:16 },
   "a gnome curse-breaker, muttering counter-charms": { beef:4, zip:30, grit:16, hoodoo:7, armor:2, xp:17 },
   // ---- Arcane Sanctum ----
   "a gnome vizier, draped in stolen finery": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:19 },
   // ---- Garrison ----
   "a heavily-armored gnome guard": { beef:6, zip:50, grit:16, hoodoo:0, armor:2, xp:23 },
   // ---- Rogues' Den ----
   "a burrowing tunnel-worm, gnome-bred": { beef:6, zip:56, grit:15, hoodoo:0, armor:2, xp:21 },
   "a rogue clockwork automaton, sparking wildly": { beef:6, zip:30, grit:17, hoodoo:0, armor:7, xp:26 },
   // ---- Garrison ----
   "a gnome drill sergeant, all bark and boot-camp": { beef:5, zip:30, grit:15, hoodoo:0, armor:8, xp:22 },
   "a gnome siege-crew, operating a catapult built for one": { beef:6, zip:30, grit:20, hoodoo:7, armor:3, xp:25 },
   // ---- Arcane Sanctum ----
   "an apprentice hex-weaver, sparks flying every wrong direction": { beef:5, zip:30, grit:15, hoodoo:0, armor:7, xp:20 },
   "a gnome familiar, three sizes too ambitious": { beef:5, zip:30, grit:16, hoodoo:6, armor:2, xp:19 },
   // ---- Rogues' Den ----
   "a masked gnome pickpocket, light-fingered and lighter-footed": { beef:6, zip:30, grit:19, hoodoo:7, armor:3, xp:24 },
   // ---- Garrison ----
   "a gnome quartermaster, counting rations nobody will eat": { beef:5, zip:38, grit:16, hoodoo:0, armor:2, xp:22 },
   "a gnome recruit, fresh out of basic training": { beef:5, zip:30, grit:17, hoodoo:0, armor:3, xp:21 },
   "a gnome drillfield runner, somehow always last to formation": { beef:6, zip:56, grit:16, hoodoo:0, armor:2, xp:24 },
   "a gnome scout-sergeant, watching from somewhere you can't see": { beef:5, zip:38, grit:16, hoodoo:0, armor:2, xp:22 },
   "a gnome supply-raider, light-fingered even in uniform": { beef:5, zip:30, grit:14, hoodoo:0, armor:8, xp:21 },
   "a gnome perimeter-runner, circling the garrison walls": { beef:6, zip:56, grit:16, hoodoo:0, armor:2, xp:24 },
   "a gnome blade-sergeant, drilled past the point of hesitation": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:25 },
   "a gnome war-chaplain, muttering battlefield blessings": { beef:5, zip:30, grit:18, hoodoo:0, armor:3, xp:22 },
   "a gnome signal-caster, relaying orders through hoodoo static": { beef:5, zip:30, grit:17, hoodoo:7, armor:3, xp:21 },
   "a gnome rune-marked scout, tracing wards into the dirt": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:24 },
   "a gnome ward-walker, patrolling a line only it can see": { beef:5, zip:30, grit:15, hoodoo:0, armor:8, xp:22 },
   "a gnome battle-conjurer, channeling something ugly": { beef:6, zip:30, grit:20, hoodoo:7, armor:3, xp:25 },
   // ---- Rogues' Den ----
   "a gnome card-shill, running a game that's always rigged": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:21 },
   "a gnome fence, moving goods nobody asks about": { beef:5, zip:30, grit:18, hoodoo:0, armor:3, xp:22 },
   "a gnome enforcer's apprentice, learning the trade the hard way": { beef:5, zip:30, grit:13, hoodoo:0, armor:9, xp:21 },
   "a gnome getaway-driver, revving an engine with nowhere to go": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:24 },
   "a gnome knife-juggler, three blades in and not stopping": { beef:6, zip:30, grit:19, hoodoo:0, armor:3, xp:24 },
   "a gnome shadow-broker, dealing in favors nobody can trace": { beef:5, zip:30, grit:17, hoodoo:7, armor:3, xp:21 },
   "a gnome séance-caller, half-scamming and half-sincere": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:21 },
   "a gnome hex-dealer, selling curses by the dozen": { beef:6, zip:30, grit:16, hoodoo:0, armor:8, xp:24 },
   "a gnome back-alley fortune-reader, reading palms for coin": { beef:5, zip:30, grit:17, hoodoo:0, armor:3, xp:21 },
   // ---- Arcane Sanctum ----
   "a gnome battle-mage, overcompensating with raw force": { beef:5, zip:38, grit:15, hoodoo:0, armor:2, xp:21 },
   "a gnome spell-smith, forging hexes instead of swords": { beef:5, zip:30, grit:18, hoodoo:6, armor:3, xp:22 },
   "a gnome arcane sentry, standing watch over nothing in particular": { beef:5, zip:30, grit:13, hoodoo:0, armor:9, xp:21 },
   "a gnome runeblade adept, swinging a sword that hums": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:25 },
   "a gnome scrying apprentice, watching you through a cracked mirror": { beef:5, zip:30, grit:17, hoodoo:6, armor:3, xp:21 },
   "a gnome glyph-cutter, carving wards faster than you can read them": { beef:5, zip:30, grit:18, hoodoo:7, armor:3, xp:22 },
   "a gnome conjure-thief, stealing spells it hasn't earned": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:24 },
   "a gnome trick-caster, every spell a sleight of hand": { beef:6, zip:30, grit:16, hoodoo:0, armor:8, xp:24 },
   "a gnome oracle-in-training, guessing right more than it should": { beef:5, zip:30, grit:16, hoodoo:7, armor:2, xp:20 },
   "a gnome ley-tapper, siphoning power it doesn't fully control": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:25 },
   // ---- Rogues' Den ----
   "a gnome enforcer's cane-man, swinging something heavier than it looks": { beef:6, zip:50, grit:16, hoodoo:0, armor:2, xp:24 },
   "a gnome lookout, perched where nobody thinks to check": { beef:5, zip:30, grit:17, hoodoo:0, armor:3, xp:21 },
   "a gnome fate-cheater, rigging odds that were never fair anyway": { beef:6, zip:30, grit:16, hoodoo:0, armor:7, xp:24 },
   // ---- Arcane Sanctum ----
   "a gnome spell-runner, delivering hexes door to door": { beef:5, zip:50, grit:15, hoodoo:0, armor:2, xp:22 },
   "a gnome circle-warden, guarding a summoning ring nobody's used in years": { beef:5, zip:30, grit:17, hoodoo:7, armor:3, xp:21 },
   // ---- Commons ----
   "the gnome commander": { beef:5, zip:56, grit:16, hoodoo:0, armor:4, xp:20 },
   // ---- Sewers ----
   "a runaway digger-bot, venting steam": { beef:5, zip:65, grit:17, hoodoo:0, armor:4, xp:22 },
   // ---- Vault ----
   "the gnome king's captain, left to guard the retreat": { beef:7, zip:74, grit:18, hoodoo:0, armor:5, xp:35 },
   // ---- Palace ----
   "the outer gate sentinel, first line of a crumbling watch": { beef:6, zip:38, grit:16, hoodoo:0, armor:10, xp:25 },
   "the inner ward-keeper, humming with old wards": { beef:6, zip:38, grit:22, hoodoo:10, armor:6, xp:30 },
   "the throne room usher, unnervingly polite": { beef:7, zip:38, grit:25, hoodoo:0, armor:6, xp:35 },
   "the King's champion, undefeated and insufferable about it": { beef:8, zip:56, grit:23, hoodoo:0, armor:6, xp:45 },
   "the King's own shadow, never quite where you last saw it": { beef:8, zip:74, grit:26, hoodoo:0, armor:7, xp:50 },
   "the gnome king, throned in scavenged gold": { beef:9, zip:38, grit:26, hoodoo:0, armor:12, xp:70 },
   // ---- Class Trial champions (Guild/Casino/Hoodoo Doctor -- no zone, fought in-building) ----
   "the Guild's Trial Examiner, unbeaten and unimpressed": { beef:9, zip:56, grit:25, hoodoo:0, armor:6, xp:50 },
   "the Casino's own card shark, impossible to pin down": { beef:7, zip:74, grit:25, hoodoo:0, armor:6, xp:50 },
   "a spirit summoned from the bottom of the pot": { beef:6, zip:38, grit:28, hoodoo:11, armor:7, xp:50 },
   // ---- Garrison ----
   "the Garrison's watch-captain, built like a slammed door": { beef:6, zip:56, grit:21, hoodoo:0, armor:5, xp:45 },
   // ---- Rogues' Den ----
   "the Rogues' Den enforcer, already taking side bets on you": { beef:6, zip:65, grit:25, hoodoo:0, armor:6, xp:45 },
   // ---- Arcane Sanctum ----
   "the Arcane Sanctum's warden, muttering an unfinished spell": { beef:6, zip:38, grit:19, hoodoo:0, armor:12, xp:45 },
   // ---- Commons ----
   "a mossback strider, somehow taller every time you look away": { beef:4, zip:38, grit:9, hoodoo:0, armor:10, xp:11 },
   // ---- Sewers ----
   "the sewer sovereign, crowned in bottlecaps nobody remembers losing": { beef:5, zip:38, grit:12, hoodoo:0, armor:11, xp:14 },
   // ---- Quarry ----
   "a quarry wraith, worn into the rock face itself": { beef:5, zip:74, grit:12, hoodoo:0, armor:3, xp:20 },
   // ---- Vault ----
   "a vault-born echo, wearing a face it borrowed from a mirror": { beef:6, zip:38, grit:20, hoodoo:9, armor:5, xp:30 },
   // ---- Garrison ----
   "the garrison's unlisted recruit, nobody's sure who signed off on it": { beef:7, zip:38, grit:19, hoodoo:0, armor:11, xp:38 },
   // ---- Rogues' Den ----
   "a shade-fingered cutpurse, light-footed even by Rogues' Den standards": { beef:7, zip:38, grit:18, hoodoo:0, armor:12, xp:39 },
   // ---- Arcane Sanctum ----
   "a half-cast familiar, stuck between the spell and the shape it was meant to take": { beef:6, zip:38, grit:20, hoodoo:9, armor:5, xp:30 },
   /* ============ mudroot-content.js ============ */
   // ---- Root Cellar ----
   "a blind tunnel-mole, all claws": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:25 },
   "a root-gnawing grub, fat and glistening": { beef:5, zip:30, grit:15, hoodoo:0, armor:8, xp:23 },
   "a mole-sapper, packing a satchel of loose dirt": { beef:6, zip:30, grit:20, hoodoo:7, armor:3, xp:27 },
   // ---- Mudflats ----
   "a mudflat leech, bloated and patient": { beef:7, zip:38, grit:19, hoodoo:0, armor:3, xp:30 },
   "a mole scout, painted in warpaint mud": { beef:7, zip:30, grit:18, hoodoo:0, armor:8, xp:32 },
   "a burrow-hound, all teeth and no eyes": { beef:7, zip:30, grit:23, hoodoo:7, armor:3, xp:34 },
   // ---- Bureau ----
   "a mole clerk, drowning in triplicate paperwork": { beef:6, zip:38, grit:16, hoodoo:0, armor:2, xp:24 },
   "a mole auditor, sniffing out every discrepancy": { beef:6, zip:30, grit:16, hoodoo:0, armor:8, xp:26 },
   "a mole notary, stamping everything twice out of spite": { beef:6, zip:30, grit:20, hoodoo:7, armor:3, xp:28 },
   // ---- Root Cellar ----
   "a root-cellar brawler mole, built like a fallen beam": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:27 },
   "a tunnel-brace mole, propping up a ceiling with its own back": { beef:5, zip:30, grit:19, hoodoo:0, armor:3, xp:24 },
   "a root-kicker mole, clearing tunnels the hard way": { beef:6, zip:30, grit:16, hoodoo:0, armor:9, xp:27 },
   "a packed-earth mole, walking like the ground owes it something": { beef:6, zip:38, grit:19, hoodoo:0, armor:3, xp:28 },
   "a quick-claw mole, first through every gap": { beef:6, zip:50, grit:16, hoodoo:0, armor:2, xp:26 },
   "a narrow-shaft mole, built for tunnels nothing else fits through": { beef:5, zip:30, grit:18, hoodoo:0, armor:3, xp:23 },
   "a loose-soil mole, never once losing its footing": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:27 },
   "a root-blade mole, honing claws on stone": { beef:6, zip:30, grit:19, hoodoo:6, armor:3, xp:26 },
   "a deep-listening mole, hearing the cellar breathe": { beef:5, zip:30, grit:14, hoodoo:0, armor:9, xp:23 },
   "a root-warded mole, lined with half-grown charms": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:27 },
   "a silent-digger mole, tunneling without a sound": { beef:5, zip:30, grit:18, hoodoo:0, armor:3, xp:23 },
   "a cellar-conjuror mole, channeling something through the dirt": { beef:6, zip:30, grit:19, hoodoo:7, armor:3, xp:26 },
   // ---- Mudflats ----
   "a mudflat brawler mole, caked shoulder to snout": { beef:7, zip:38, grit:21, hoodoo:0, armor:3, xp:33 },
   "a silt-packed mole, heavier than it looks": { beef:6, zip:30, grit:22, hoodoo:0, armor:3, xp:31 },
   "a bog-strider mole, somehow never sinking": { beef:7, zip:30, grit:18, hoodoo:0, armor:9, xp:33 },
   "a tide-club mole, swinging something waterlogged and heavy": { beef:7, zip:38, grit:22, hoodoo:0, armor:3, xp:34 },
   "a reed-masked mole, blending into the tall grass": { beef:6, zip:30, grit:22, hoodoo:0, armor:3, xp:31 },
   "a silt-slick mole, impossible to get a grip on": { beef:6, zip:56, grit:18, hoodoo:0, armor:3, xp:31 },
   "a tide-runner mole, racing the water in": { beef:7, zip:38, grit:21, hoodoo:0, armor:3, xp:33 },
   "a mudskipper mole, light across the wet ground": { beef:6, zip:50, grit:19, hoodoo:0, armor:3, xp:31 },
   "a bog-warded mole, humming with something old and damp": { beef:6, zip:30, grit:22, hoodoo:7, armor:3, xp:31 },
   "a reed-charm mole, tangled in half-grown wards": { beef:6, zip:38, grit:20, hoodoo:0, armor:3, xp:31 },
   "a silt-step mole, leaving no print in the mud": { beef:6, zip:30, grit:17, hoodoo:0, armor:8, xp:30 },
   "a tide-conjuror mole, pulling something up from the silt": { beef:7, zip:30, grit:23, hoodoo:7, armor:3, xp:33 },
   // ---- Bureau ----
   "a mole enforcer, built to collect on overdue paperwork": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:25 },
   "a mole bailiff, repossessing things nobody agreed to give up": { beef:5, zip:30, grit:18, hoodoo:0, armor:3, xp:23 },
   "a mole collections-runner, always one step ahead of the deadline": { beef:6, zip:56, grit:16, hoodoo:0, armor:2, xp:25 },
   "a mole repo-agent, swinging a stamped eviction notice like a club": { beef:6, zip:38, grit:18, hoodoo:0, armor:3, xp:26 },
   "a mole filing-clerk, padded with carbon copies": { beef:5, zip:30, grit:15, hoodoo:0, armor:8, xp:23 },
   "a mole courier, sprinting forms between departments": { beef:6, zip:30, grit:19, hoodoo:0, armor:3, xp:25 },
   "a mole shortcut-taker, knows every hallway that isn't on the map": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:25 },
   "a mole letter-opener specialist, surprisingly dangerous with it": { beef:6, zip:30, grit:20, hoodoo:6, armor:3, xp:26 },
   "a mole records-keeper, filed under a name nobody can read": { beef:5, zip:30, grit:13, hoodoo:0, armor:9, xp:22 },
   "a mole compliance officer, humming with quiet disapproval": { beef:6, zip:38, grit:17, hoodoo:0, armor:3, xp:25 },
   "a mole appeals-processor, denying requests before they're made": { beef:6, zip:30, grit:19, hoodoo:0, armor:3, xp:25 },
   "a mole night-auditor, the only one still at the desk at this hour": { beef:5, zip:30, grit:17, hoodoo:0, armor:3, xp:22 },
   // ---- Root Cellar ----
   "the tunnel warden, wide as the passage itself": { beef:8, zip:38, grit:23, hoodoo:0, armor:11, xp:50 },
   // ---- Mudflats ----
   "the warren scout, already circling": { beef:8, zip:65, grit:30, hoodoo:0, armor:8, xp:55 },
   // ---- Root Cellar ----
   "a root-warden, grown into the tunnel wall over seasons nobody tracked": { beef:7, zip:38, grit:24, hoodoo:0, armor:6, xp:41 },
   // ---- Bureau ----
   "the unregistered auditor, carrying a badge for a department that doesn't exist": { beef:7, zip:65, grit:18, hoodoo:0, armor:5, xp:42 },
   // ---- Mudflats ----
   "a silt-walker, three steps ahead and never once visibly moving": { beef:8, zip:38, grit:22, hoodoo:0, armor:12, xp:48 },
   /* ============ warrensear-content.js ============ */
   // ---- Choir ----
   "a mole cantor, humming the wrong note on purpose": { beef:8, zip:38, grit:22, hoodoo:0, armor:3, xp:38 },
   "an echo-mole, never quite where the sound says it is": { beef:7, zip:50, grit:20, hoodoo:0, armor:3, xp:36 },
   "a listening-post sentry, all ears and no eyes": { beef:8, zip:30, grit:21, hoodoo:0, armor:9, xp:40 },
   // ---- Ledger Vault ----
   "an archivist-mole, buried under three ledgers at once": { beef:8, zip:30, grit:22, hoodoo:0, armor:7, xp:39 },
   "a vault clerk, stamping things that don't need stamping": { beef:7, zip:30, grit:23, hoodoo:6, armor:3, xp:37 },
   "an auditor-in-chief, radiating quiet disapproval": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:41 },
   // ---- Choir ----
   "a mole chorister, singing lead whether asked or not": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:40 },
   "a mole bell-ringer, hauling a bell twice its size": { beef:7, zip:30, grit:24, hoodoo:6, armor:4, xp:37 },
   "a mole step-caller, keeping the whole choir in time": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:40 },
   "a mole conductor, swinging a baton like it means business": { beef:8, zip:38, grit:24, hoodoo:0, armor:4, xp:41 },
   "a mole descant-singer, hitting notes nobody asked for": { beef:7, zip:30, grit:19, hoodoo:0, armor:8, xp:36 },
   "a mole harmony-weaver, blending in just enough to vanish": { beef:7, zip:30, grit:23, hoodoo:0, armor:3, xp:36 },
   "a mole quick-step dancer, part of the act somehow": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:40 },
   "a mole tap-dancer, keeping rhythm nobody else can hear": { beef:7, zip:50, grit:20, hoodoo:0, armor:3, xp:37 },
   "a mole resonance-warden, vibrating in sympathy with the hall": { beef:7, zip:30, grit:24, hoodoo:7, armor:4, xp:37 },
   "a mole pitch-tuner, adjusting something only it can hear": { beef:7, zip:38, grit:21, hoodoo:0, armor:3, xp:36 },
   "a mole silent-chorister, mouthing words with no sound": { beef:7, zip:30, grit:19, hoodoo:0, armor:8, xp:36 },
   "a mole hymn-caster, channeling a note into something sharper": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:40 },
   // ---- Ledger Vault ----
   "a mole vault-guard, standing watch over numbers nobody reads": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:40 },
   "a mole strongbox-bearer, hauling a ledger-chest built like armor": { beef:7, zip:30, grit:21, hoodoo:0, armor:8, xp:37 },
   "a mole vault-runner, racing a closing time nobody set": { beef:8, zip:56, grit:21, hoodoo:0, armor:3, xp:40 },
   "a mole seal-breaker, swinging a wax-stamped mallet": { beef:8, zip:38, grit:24, hoodoo:0, armor:4, xp:41 },
   "a mole cipher-clerk, reading numbers nobody else can parse": { beef:7, zip:30, grit:23, hoodoo:0, armor:3, xp:36 },
   "a mole safecracker, listening for a click that isn't coming": { beef:7, zip:30, grit:23, hoodoo:7, armor:3, xp:36 },
   "a mole ledger-runner, filing things faster than they're written": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:40 },
   "a mole stamp-duelist, wielding two stamps at once": { beef:8, zip:30, grit:22, hoodoo:0, armor:8, xp:40 },
   "a mole number-seer, reading a ledger that hasn't been written yet": { beef:7, zip:30, grit:23, hoodoo:7, armor:3, xp:36 },
   "a mole vault-warden, humming with old locked magic": { beef:7, zip:30, grit:24, hoodoo:0, armor:4, xp:37 },
   "a mole account-tracer, following a debt through the walls": { beef:8, zip:30, grit:22, hoodoo:0, armor:8, xp:40 },
   "a mole silent-auditor, never once making a sound": { beef:7, zip:30, grit:23, hoodoo:7, armor:3, xp:36 },
   // ---- Root Cellar ----
   "a nervous tunnel-mole informant": { beef:7, zip:56, grit:26, hoodoo:0, armor:7, xp:48 },
   // ---- Bureau ----
   "a senior clerk, guarding a very particular ledger": { beef:7, zip:38, grit:21, hoodoo:0, armor:11, xp:48 },
   // ---- Ledger Vault ----
   "a committee auditor, cross-referencing you against three different ledgers": { beef:9, zip:74, grit:20, hoodoo:0, armor:5, xp:45 },
   "the vault keeper, the only door in the Warren's Ear that was never meant to open": { beef:9, zip:38, grit:29, hoodoo:0, armor:10, xp:68 },
   // ---- Choir ----
   "the unsung chorister, humming a note the Choir itself has never learned": { beef:10, zip:65, grit:23, hoodoo:0, armor:6, xp:55 },
   // ---- Ledger Vault ----
   "a misfiled auditor, cross-referenced into something that shouldn't check out": { beef:10, zip:38, grit:30, hoodoo:11, armor:8, xp:38 },
   /* ============ emberwarren-content.js ============ */
   // ---- Foundry ----
   "a soot-caked forge-mole, sparks catching in its fur": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:41 },
   "a bellows-mole, wheezing out gouts of forge-heat": { beef:8, zip:30, grit:21, hoodoo:0, armor:8, xp:39 },
   "a slag-hauler, dragging a cart twice its own size": { beef:8, zip:30, grit:26, hoodoo:7, armor:4, xp:43 },
   // ---- Gearworks ----
   "a cog-fitter, three thumbs and all of them precise": { beef:8, zip:38, grit:22, hoodoo:0, armor:3, xp:40 },
   "a pressure-mole, hissing steam from somewhere it shouldn't": { beef:8, zip:30, grit:22, hoodoo:0, armor:8, xp:42 },
   "a line-runner, built for squeezing between conveyor belts": { beef:8, zip:56, grit:19, hoodoo:0, armor:3, xp:38 },
   // ---- Foundry ----
   "a crucible-mole, carrying molten metal like it's nothing": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:41 },
   "a hammer-mole, built like the anvil it works": { beef:8, zip:30, grit:26, hoodoo:0, armor:4, xp:43 },
   "a furnace-stoker mole, feeding flames that never go out": { beef:8, zip:30, grit:21, hoodoo:0, armor:9, xp:41 },
   "a slag-walker mole, crossing cooling metal barefoot": { beef:8, zip:38, grit:24, hoodoo:0, armor:4, xp:43 },
   "a quench-mole, darting between fire and water": { beef:8, zip:50, grit:20, hoodoo:0, armor:3, xp:40 },
   "a spark-dodger mole, never once catching fire": { beef:8, zip:56, grit:21, hoodoo:0, armor:3, xp:41 },
   "a cinder-runner mole, light across hot coals": { beef:8, zip:38, grit:22, hoodoo:0, armor:3, xp:40 },
   "a forge-blade mole, tempering its own claws in the fire": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:41 },
   "a heat-reader mole, sensing the forge before it flares": { beef:8, zip:30, grit:24, hoodoo:7, armor:4, xp:40 },
   "an ember-warded mole, lined with half-forged charms": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:41 },
   "a silent-smith mole, working without a single clang": { beef:8, zip:30, grit:21, hoodoo:0, armor:8, xp:40 },
   "a foundry-conjuror mole, channeling raw heat into something sharper": { beef:8, zip:30, grit:25, hoodoo:7, armor:4, xp:41 },
   // ---- Gearworks ----
   "a gear-plated mole, armored in mismatched cogs": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:41 },
   "a flywheel mole, spinning up before every charge": { beef:8, zip:30, grit:24, hoodoo:6, armor:4, xp:40 },
   "a piston-mole, driven forward by something hissing": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:41 },
   "a cog-smith mole, swinging a wrench the size of its own body": { beef:8, zip:38, grit:24, hoodoo:0, armor:4, xp:43 },
   "a sprocket-scout mole, counting teeth on every gear it passes": { beef:8, zip:30, grit:21, hoodoo:0, armor:8, xp:40 },
   "a belt-runner mole, keeping pace with the line itself": { beef:8, zip:56, grit:20, hoodoo:0, armor:3, xp:40 },
   "a gear-slip mole, squeezing through machinery nothing else fits through": { beef:8, zip:38, grit:22, hoodoo:0, armor:3, xp:40 },
   "a ratchet mole, clicking tighter with every exchange": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:41 },
   "a clockwork-reader mole, hearing the gears before they turn": { beef:8, zip:30, grit:24, hoodoo:7, armor:4, xp:40 },
   "a gearworks-warded mole, humming in time with the machinery": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:41 },
   "a tension-mole, wound tight enough to spring at any moment": { beef:8, zip:30, grit:22, hoodoo:0, armor:8, xp:41 },
   "a silent-cog mole, the only quiet thing on the whole line": { beef:8, zip:30, grit:24, hoodoo:0, armor:4, xp:40 },
   "the line foreman, clipboard in one hand and a wrench in the other": { beef:8, zip:56, grit:23, hoodoo:0, armor:6, xp:55 },
   // ---- Bureau ----
   "the quartermaster, three ledgers behind and somehow ahead of you": { beef:8, zip:38, grit:28, hoodoo:10, armor:7, xp:55 },
   // ---- Foundry ----
   "the quench-master, apron scorched black from decades at the trough": { beef:9, zip:74, grit:21, hoodoo:0, armor:5, xp:62 },
   // ---- Gearworks ----
   "a tunnel captain, dug in and dug in deep": { beef:9, zip:65, grit:30, hoodoo:0, armor:8, xp:50 },
   "a foundry marshal, still glowing faintly from the last shift": { beef:10, zip:38, grit:28, hoodoo:0, armor:11, xp:58 },
   "the warren-mother, matriarch of every tunnel you've ever walked through": { beef:10, zip:74, grit:26, hoodoo:0, armor:7, xp:90 },
   // ---- Foundry ----
   "an ember-forged wretch, poured from the same mold as everything else here, wrong anyway": { beef:10, zip:38, grit:29, hoodoo:0, armor:10, xp:55 },
   // ---- Gearworks ----
   "a loose cog incarnate, somehow load-bearing anyway": { beef:10, zip:38, grit:30, hoodoo:10, armor:8, xp:45 },
   /* ============ crystalcity-content.js ============ */
   // ---- Crystal City ----
   "a crystal sentinel, refracting every strike before it lands": { beef:8, zip:30, grit:23, hoodoo:0, armor:7, xp:44 },
   "a geode crawler, seams cracking with inner light": { beef:8, zip:30, grit:25, hoodoo:6, armor:4, xp:42 },
   "an echo wraith, bent from light that took a wrong turn": { beef:9, zip:30, grit:27, hoodoo:7, armor:4, xp:46 },
   "a lattice golem, its skull a fused cluster of quartz": { beef:8, zip:38, grit:24, hoodoo:0, armor:4, xp:44 },
   "a shard-treader, crunching glass that was never glass": { beef:8, zip:30, grit:23, hoodoo:0, armor:8, xp:46 },
   "a glass-footed wanderer, leaving cuts in the floor": { beef:8, zip:30, grit:25, hoodoo:0, armor:4, xp:43 },
   "a prism-fisted brawler, light bending around its knuckles": { beef:9, zip:38, grit:24, hoodoo:0, armor:4, xp:45 },
   "a facet-dancer, catching every angle of light at once": { beef:8, zip:50, grit:21, hoodoo:0, armor:3, xp:43 },
   "a refracted duelist, striking from an angle that isn't there": { beef:9, zip:30, grit:26, hoodoo:7, armor:4, xp:45 },
   "a glint-step wraith, never landing where the light says it will": { beef:8, zip:38, grit:22, hoodoo:0, armor:3, xp:42 },
   "a splinter-blade wisp, each cut arriving slightly early": { beef:8, zip:30, grit:25, hoodoo:6, armor:4, xp:43 },
   "a lucent oracle, reading fractures nobody else can see": { beef:8, zip:30, grit:24, hoodoo:7, armor:4, xp:42 },
   "a glow-warded remnant, sealed in light that never dims": { beef:8, zip:38, grit:23, hoodoo:0, armor:3, xp:43 },
   "a bent-light stalker, walking a path that doubles back on itself": { beef:9, zip:30, grit:26, hoodoo:6, armor:4, xp:45 },
   "a silent facet, the quietest thing the Lucent ever built": { beef:8, zip:30, grit:20, hoodoo:0, armor:9, xp:42 },
   "a drifting facet, light bending the wrong way just to reach it": { beef:11, zip:74, grit:22, hoodoo:0, armor:6, xp:65 },
   /* ============ prismdepths-content.js ============ */
   // ---- Embercrypt ----
   "a slag-bound husk, poured wrong and left to cool that way": { beef:10, zip:30, grit:28, hoodoo:0, armor:7, xp:52 },
   "an ash-veiled watcher, embers where its eyes should be": { beef:10, zip:30, grit:31, hoodoo:6, armor:5, xp:53 },
   "a cinder hound, three steps ahead of its own smoke": { beef:11, zip:30, grit:29, hoodoo:0, armor:4, xp:54 },
   "an ash-bound crawler, smoke pooling where its feet should be": { beef:10, zip:38, grit:28, hoodoo:0, armor:4, xp:55 },
   "the Slag Colossus, built from everything the forge ever rejected": { beef:12, zip:38, grit:36, hoodoo:0, armor:11, xp:90 },
   "a cinder-wrapped tender, still stoking a fire that isn't there": { beef:11, zip:30, grit:25, hoodoo:0, armor:9, xp:56 },
   "a kiln-sealed warden, fused shut around its own heat": { beef:11, zip:30, grit:31, hoodoo:0, armor:5, xp:57 },
   "an ember-threaded stalker, trailing sparks it never quite sheds": { beef:11, zip:50, grit:26, hoodoo:0, armor:4, xp:57 },
   "the Cinder Magistrate, still presiding over a court of ash": { beef:13, zip:38, grit:40, hoodoo:11, armor:10, xp:100 },
   "a forge-locked sentry, guarding a door that stopped mattering": { beef:11, zip:30, grit:31, hoodoo:0, armor:5, xp:58 },
   "the Emberwright, still tending a forge that isn't there anymore": { beef:14, zip:81, grit:53, hoodoo:0, armor:7, xp:135 },
   // ---- Frostvault ----
   "a glass-still custodian, holding a pose it stopped finishing": { beef:11, zip:30, grit:27, hoodoo:0, armor:9, xp:56 },
   "a rime-crusted drifter, dragging cold that isn't really air": { beef:11, zip:30, grit:30, hoodoo:0, armor:7, xp:57 },
   "a frostbound archivist, filed under a temperature nothing should survive": { beef:12, zip:30, grit:32, hoodoo:6, armor:5, xp:58 },
   "a rime-locked sentinel, frozen mid-step and still moving anyway": { beef:11, zip:30, grit:28, hoodoo:0, armor:9, xp:59 },
   "the Glacial Custodian, keeping watch over a collection nobody's claiming": { beef:13, zip:38, grit:40, hoodoo:0, armor:10, xp:95 },
   "a frost-veiled tender, patching cracks before they finish forming": { beef:12, zip:30, grit:32, hoodoo:0, armor:5, xp:60 },
   "an ice-bound archivist, cataloguing cold it hasn't finished cataloguing": { beef:12, zip:30, grit:33, hoodoo:0, armor:5, xp:61 },
   "a glass-splinter stalker, shedding edges that don't melt": { beef:12, zip:38, grit:29, hoodoo:0, armor:4, xp:61 },
   "the Rime Chancellor, presiding over a hall that stopped thawing": { beef:14, zip:38, grit:42, hoodoo:10, armor:11, xp:105 },
   "a frostlocked sentry, holding a post that froze shut around it": { beef:12, zip:30, grit:28, hoodoo:0, armor:9, xp:62 },
   "the Stillglass Warden, holding the exact same shape since before anyone was counting": { beef:15, zip:50, grit:46, hoodoo:0, armor:13, xp:145 },
   // ---- Stormreach ----
   "a charge-split sentry, arguing with its own echo": { beef:12, zip:50, grit:30, hoodoo:0, armor:5, xp:60 },
   "a windworn herald, three words into a message it'll never finish": { beef:12, zip:30, grit:30, hoodoo:0, armor:9, xp:61 },
   "a storm-tide walker, never landing on the ground it's clearly standing on": { beef:13, zip:38, grit:32, hoodoo:0, armor:5, xp:62 },
   "a charge-split outrider, arguing with an echo one beat ahead": { beef:13, zip:50, grit:31, hoodoo:0, armor:5, xp:63 },
   "the Gale Marshal, still rallying a storm front nobody's left to brief": { beef:14, zip:81, grit:28, hoodoo:0, armor:7, xp:100 },
   "a windworn relay, patching a message it'll never finish sending": { beef:13, zip:30, grit:35, hoodoo:5, armor:5, xp:64 },
   "a storm-tide keeper, mending the tide-line it's still holding": { beef:13, zip:30, grit:36, hoodoo:0, armor:5, xp:65 },
   "a charge-split outlier, arguing with two echoes now instead of one": { beef:13, zip:56, grit:29, hoodoo:0, armor:4, xp:65 },
   "the Static Archivist, filing every charge that's ever passed through here": { beef:15, zip:38, grit:46, hoodoo:0, armor:12, xp:110 },
   "a storm-bound sentry, bracing against wind that never actually stops": { beef:13, zip:30, grit:32, hoodoo:0, armor:8, xp:66 },
   "the Unanswered Herald, still broadcasting something nobody built ears for": { beef:16, zip:81, grit:69, hoodoo:0, armor:8, xp:155 },
   // ---- Verdant Hollow ----
   "a bramble-bound sentinel, more vine than whatever it used to be": { beef:13, zip:30, grit:36, hoodoo:0, armor:7, xp:64 },
   "a seed-caster, lobbing something that already took root": { beef:13, zip:30, grit:39, hoodoo:6, armor:6, xp:65 },
   "a moss-grown caretaker, tending a garden that stopped needing one": { beef:14, zip:30, grit:38, hoodoo:0, armor:6, xp:66 },
   "a vine-choked outrider, dragging roots that haven't stopped growing": { beef:14, zip:38, grit:35, hoodoo:0, armor:5, xp:67 },
   "the Bramble Sovereign, still ruling a garden that outgrew its own gardener": { beef:15, zip:74, grit:33, hoodoo:0, armor:8, xp:105 },
   "a seed-tender, mending the Hollow's own slow green wounds": { beef:14, zip:30, grit:33, hoodoo:0, armor:9, xp:68 },
   "a moss-bound keeper, folding its own growth back into shape": { beef:14, zip:30, grit:39, hoodoo:0, armor:6, xp:69 },
   "a thornvine lancer, loosing growth that hasn't finished sharpening": { beef:14, zip:50, grit:32, hoodoo:0, armor:5, xp:69 },
   "the Hollow Cultivator, tending rows that stopped needing tending": { beef:16, zip:38, grit:49, hoodoo:0, armor:12, xp:115 },
   "a bramble-locked sentry, holding a line the vines took over years ago": { beef:14, zip:30, grit:39, hoodoo:5, armor:6, xp:70 },
   "the Rootbound Warden, holding the Hollow the only way it still can — by not letting go": { beef:17, zip:50, grit:55, hoodoo:0, armor:14, xp:165 },
   // ---- Duskward ----
   "a hollow-eyed watchman, standing guard over nothing that's still there": { beef:14, zip:56, grit:34, hoodoo:0, armor:5, xp:68 },
   "an unlit lanternbearer, carrying a light that went out a long time ago": { beef:15, zip:30, grit:40, hoodoo:0, armor:7, xp:69 },
   "a shade-stitched mender, patching itself with borrowed dark": { beef:15, zip:30, grit:41, hoodoo:6, armor:6, xp:70 },
   "a dusk-split sentry, standing watch over a door that's always closing": { beef:15, zip:56, grit:34, hoodoo:0, armor:5, xp:71 },
   "the Shade Regent, still holding court in a hall nobody's left to enter": { beef:16, zip:65, grit:38, hoodoo:0, armor:10, xp:110 },
   "an unlit tender, patching a dark that keeps patching itself first": { beef:15, zip:30, grit:41, hoodoo:0, armor:6, xp:72 },
   "a shadow-stitched keeper, mending seams that keep unraveling anyway": { beef:15, zip:30, grit:42, hoodoo:7, armor:6, xp:73 },
   "a hollow-eyed lancer, loosing a dark that arrives before it's thrown": { beef:15, zip:38, grit:37, hoodoo:0, armor:6, xp:73 },
   "the Dusk Chancellor, presiding over a hall that gave up on light": { beef:17, zip:38, grit:52, hoodoo:0, armor:13, xp:120 },
   "an unlit sentry, holding a post the dark swallowed years ago": { beef:15, zip:30, grit:42, hoodoo:7, armor:6, xp:74 },
   "the Last Candle, still burning down here for reasons nobody's left to remember": { beef:18, zip:81, grit:76, hoodoo:0, armor:9, xp:175 },
   // ---- Ironloom ----
   "a coiled tensioner, wound past anything it was built to hold": { beef:15, zip:50, grit:37, hoodoo:0, armor:6, xp:72 },
   "a loom-spindle, still weaving something nobody's wearing": { beef:16, zip:30, grit:41, hoodoo:0, armor:9, xp:73 },
   "a stitch-worker, mending gears with thread that shouldn't hold metal": { beef:16, zip:30, grit:44, hoodoo:5, armor:7, xp:74 },
   "a gear-split outrider, throwing cogs that haven't finished spinning": { beef:16, zip:50, grit:38, hoodoo:0, armor:6, xp:75 },
   "the Loom Chancellor, still weighing a pattern nobody's left to approve": { beef:17, zip:38, grit:53, hoodoo:0, armor:13, xp:115 },
   "a thread-tender, binding its own frayed edge with spare wire": { beef:16, zip:30, grit:44, hoodoo:0, armor:7, xp:76 },
   "a spindle-keeper, re-threading a seam that keeps slipping loose": { beef:16, zip:50, grit:38, hoodoo:0, armor:6, xp:77 },
   "a tension-lancer, loosing a coil wound tighter than it should hold": { beef:16, zip:56, grit:36, hoodoo:0, armor:5, xp:77 },
   "the Gear Magistrate, presiding over a pattern that finished itself centuries ago": { beef:18, zip:38, grit:55, hoodoo:9, armor:14, xp:125 },
   "a loom-locked sentry, holding a post the gears sealed shut around it": { beef:16, zip:30, grit:43, hoodoo:0, armor:8, xp:78 },
   "the Warp-Loom Overseer, running a pattern it finished a long time ago": { beef:19, zip:50, grit:61, hoodoo:0, armor:15, xp:185 },
   // ---- Echo Chapel ----
   "a resonance warden, holding one note longer than it should last": { beef:16, zip:30, grit:47, hoodoo:0, armor:7, xp:76 },
   "a chime-caster, ringing something that was never meant to be struck": { beef:17, zip:30, grit:48, hoodoo:6, armor:7, xp:77 },
   "a hum-keeper, stitching itself whole with its own held note": { beef:17, zip:30, grit:47, hoodoo:0, armor:7, xp:78 },
   "a resonance outrider, carrying a note one beat ahead of itself": { beef:17, zip:38, grit:44, hoodoo:0, armor:7, xp:79 },
   "the Chord Marshal, still conducting a choir nobody's left to sing in": { beef:18, zip:74, grit:39, hoodoo:0, armor:10, xp:120 },
   "a hum-tender, patching its own voice before the crack finishes ringing": { beef:17, zip:30, grit:43, hoodoo:0, armor:9, xp:80 },
   "a chime-keeper, re-striking a note that keeps slipping flat": { beef:17, zip:38, grit:44, hoodoo:0, armor:7, xp:81 },
   "an echo-lancer, loosing a sound that lands before it's struck": { beef:17, zip:50, grit:40, hoodoo:0, armor:6, xp:81 },
   "the Resonance Archivist, cataloguing every note the chapel's ever held": { beef:19, zip:38, grit:58, hoodoo:0, armor:15, xp:130 },
   "a resonance sentry, holding a post the echo sealed shut around it": { beef:17, zip:30, grit:48, hoodoo:5, armor:7, xp:82 },
   "the Unbroken Chord, still holding a note that should have ended centuries ago": { beef:20, zip:81, grit:83, hoodoo:0, armor:10, xp:195 },
   // ---- Sunken Archive ----
   "a marginalia-wraith, scrawled in the gaps of something older than it": { beef:17, zip:56, grit:41, hoodoo:0, armor:6, xp:80 },
   "an index-walker, citing a source that's about to cite you back": { beef:18, zip:30, grit:51, hoodoo:0, armor:8, xp:81 },
   "a page-binder, re-stitching a spine that's been read too many times": { beef:18, zip:30, grit:50, hoodoo:6, armor:8, xp:82 },
   "a footnote-outrider, citing a source one line ahead of itself": { beef:18, zip:56, grit:42, hoodoo:0, armor:6, xp:83 },
   "the Archive Warden, still guarding a collection nobody's left to steal": { beef:19, zip:38, grit:59, hoodoo:0, armor:15, xp:125 },
   "a binding-tender, re-stitching its own spine before the tear finishes": { beef:18, zip:30, grit:50, hoodoo:0, armor:8, xp:84 },
   "a citation-keeper, re-filing a reference that keeps slipping loose": { beef:18, zip:56, grit:42, hoodoo:0, armor:6, xp:85 },
   "an index-lancer, delivering a footnote that arrives before the citation": { beef:18, zip:38, grit:46, hoodoo:0, armor:7, xp:85 },
   "the Last Cataloguer, still filing every page the Archive's ever held": { beef:20, zip:38, grit:61, hoodoo:10, armor:15, xp:135 },
   "an archive sentry, holding a post the dust sealed shut around it": { beef:18, zip:30, grit:49, hoodoo:0, armor:9, xp:86 },
   "the Last Archivist, still cataloguing a collection nobody's left to read": { beef:21, zip:50, grit:67, hoodoo:0, armor:17, xp:205 },
};
