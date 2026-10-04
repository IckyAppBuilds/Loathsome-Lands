# The Loathsome Lands — file map

A single-page browser RPG. No build step, no bundler, no modules — plain
HTML/CSS/`<script>` tags, all globals. 38 JS files load in a specific
order (see `index.html`'s `<script>` block, which documents this inline
too):

```
supabase (CDN)
-> core.js -> icons.js -> art.js -> gnometropolis-art.js -> mudroot-art.js
-> warrensear-art.js -> emberwarren-art.js -> monster-stats.js -> content.js
-> mudroot-content.js -> warrensear-content.js -> emberwarren-content.js
-> gauntlet.js -> crystalcity-content.js -> prismdepths-content.js -> dungeon.js
-> act2-shop.js -> item-tiers.js -> render.js
-> render-shop.js -> render-character.js -> class-spells.js -> dev-tools.js
-> auth.js -> save.js -> player-actions.js -> tutorial.js -> changelog.js
-> dailystreak.js -> hubs.js -> combat.js -> town.js -> casino.js -> hilo.js
-> class-trial.js -> guild.js -> gnometropolis.js -> economy.js
-> noticeboard.js -> boot.js
```

Act 2's own files slot in alongside their Act 1 counterpart rather than
all clustering at the end — `gnometropolis-art.js`/`mudroot-art.js`
load right after `art.js` (same icon/art-before-content.js constraint,
rule #1 below), `mudroot-content.js`/`act2-shop.js` right after
`content.js` (they read its `monsters`/`noncombatEvents`/`hazardEvents`
by reference and extend them — see mudroot-content.js's own top
comment), and `hubs.js` loads right before `combat.js`/`town.js`/
`guild.js`/`gnometropolis.js`, which are the only files that actually
call its `hubKeyForLocation()`/`isHubArea()`.

This project has already broken its own rule #1 twice in practice (a
monster/boss referencing an `art*()` function that didn't exist yet
aborted the whole game both times) — when adding a new named boss or
monster, double-check its `art:`/`icon:` function actually exists in
`art.js`/`icons.js` *before* wiring it into `content.js`, not after.

Only **two rules are actually load-bearing** (everything else here is
ordered for human readability, not correctness — almost every cross-file
call in this codebase happens inside a function body, which only runs
after every script has finished loading):

1. **`icons.js`/`art.js` before `content.js`** — `content.js`'s data
   tables read `icon*()`/`art*()` functions **by value** at parse time
   (e.g. `loot:{ icon:iconSoil }`). This exact class of bug broke the
   whole game once already this project — a top-level reference to an
   undefined function throws immediately, which aborts that script
   mid-file, which cascades into every later script that expected its
   globals to exist. Getting this wrong is the single easiest way to
   break the whole game.
2. **`boot.js` must be the very last `<script>` tag** — its final block
   runs immediately at parse time (`if(sb){ renderGate() } else {
   closeGate(); startFreshGame(); }`) and needs every other global to
   already exist.

## Standing convention: prefer a new file over growing an existing one

This 5-file -> 17-file split happened because a handful of files grew
past ~600-1100 lines each, and every task — even a one-line balance
tweak — meant reading or grepping through a large file mostly unrelated
to the change. **Keep it that way going forward.** When a new concern
shows up (a new data table, a new UI section, a new subsystem), default
to a new small file rather than appending to whichever existing file is
topically closest. If a file creeps back up past ~300-400 lines, that's
a signal to split it again. Adding a file means: create it, and add its
`<script>` tag to `index.html` in the right load-order spot (before
`content.js` if it defines icon/art assets `content.js` will reference
by value; before `boot.js` otherwise — everything else is unconstrained).

Read the section for whichever file you're touching — that's usually
enough to make a change without reading the other 16.

## index.html
DOM skeleton for every screen: pre-game gate, tutorial overlay, header
stat bars, the `#stage` area (shared by town square, every building
interior, and combat), all five drawers (Pack/Map/Character/Quests/
Account), the tab bar, and the `<script>` block (see load-order rules
above). Almost every interactive element is wired with an inline
`onclick="someFunction()"` straight into a function defined in one of
the JS files — there's no separate event-binding layer.

Touch this file when: adding a new screen/drawer/button element, wiring
a brand-new `onclick` handler name that doesn't exist yet, or adding a
new `<script>` tag for a new file.

## core.js — Supabase client, session vars, `state`, shared constants
- Supabase client (`sb`) plus a guard for when the CDN script fails to
  load (game still boots; only the Account drawer degrades).
- Session-only auth plumbing: `acctSession`, `acctUsername`, `authView`/
  `authBusy`, `gateOpen`, `lastOfflineBiscuitGain`. Not save data.
- `devMode` (set via `?dev=1` in the URL).
- `createDefaultState()` — a **factory**, not a bare literal, returning
  every piece of save-worthy player state: hp/mp, Biscuits/Pop
  Tabs/Bounty Tokens, level/xp, the four core stats (beef/zip/grit/
  hoodoo), equipment, inventory, `location`, all six main quest flags
  plus the class-capstone Trial (now 3 tiers — see guild.js), Town
  Lot/building-upgrade levels, the active bounty, `spellUpgradeLevel`
  (each known spell's own 0-5 upgrade level, bought at that class's own
  Act 2 district — permanent progression, so unlike `state.evasionActive`
  it IS part of `serializeState()`), and
  the rare-drops log. `const state = createDefaultState();` is the live global; calling
  the factory again (see `resetToNewGameDev()`, dev-tools.js) is how a
  full reset works without needing to reassign the `const` binding.
  This is the object `serializeState()`/`hydrateState()` (save.js)
  round-trip to Supabase.
- `STAT_LABELS`/`STAT_HINTS`/`SLOT_LABELS`/`SLOT_ORDER` constants, and
  `statBonus(value)` — the shared superlinear stat-scaling helper (each
  point is worth more than the last; used by combat.js/player-actions.js).
  `STAT_LABELS`/`STAT_HINTS` now include a 5th entry, `armor` — added so
  ANY `item.bonus` key (item-tiers.js/render-shop.js/render-character.js/
  economy.js all label a bonus generically via `STAT_LABELS[k]`) displays
  correctly, but armor is gear-only, never a spendable base stat. See
  `SPENDABLE_STAT_KEYS = ['beef','zip','grit','hoodoo']`, right below
  `STAT_LABELS` — `renderStatsBlock()` (render-character.js) and
  `spendStatPoint()`'s own guard (player-actions.js) iterate/check THIS
  list instead of `STAT_LABELS`, which is what actually keeps an "Armor
  +1" button from ever appearing. Armor flows through
  `getEffectiveStats()`'s already-generic equipment-merge loop
  (player-actions.js) with zero changes needed there — it never lives in
  `state.stats` at all, so `createDefaultState()` below, `dev-tools.js`'s
  stat reset, and `brewStatResetPotion()`'s respec (town.js) needed no
  changes either.

Touch this file when: adding a new save field, changing the Supabase
project URL/key, or changing stat-scaling math.

## icons.js — item icons
`iconWrap()` helper + every `icon*()` function — inline SVG for every
item icon. Pure: never reads `state`, never calls another file's
function. Must load before `content.js` (see rule #1 above).

Touch this file when: adding a new item/equipment icon.

## art.js — scene & character art
`sceneWrap()` helper + every `art*()` function — inline SVG for scene
art (the town square, its building states, every monster, and each
claimed class's Character-screen portrait). Pure, same load-order
constraint as icons.js.

Touch this file when: adding new monster/scene art or a new class
portrait. New Act 1 monster art goes here directly; Act 2's own
monster art (the Mudroot Warren roster) also lives here rather than
splitting across files — this project's own established precedent is
centralizing ALL monster art in art.js regardless of which zone/file
the monster's own data table lives in. Also holds `artZoneCrystalCity()`
(quest16) alongside Act 1's own 4 zone backdrops — the Crystal City is
a leaf zone with no paired hub-square art file of its own, so its one
backdrop lives here rather than in a whole new file for a single
function.

## gnometropolis-art.js — Act 2 town hub art
`artGnometropolisSquare(buildingIndicators, campCooldownText, lotTier)`
— the 3x3 Gnometropolis square (Garrison/Palace/Arcane Sanctum/Rogues'
Den/Camp/Guild/Shop/Town Lot tiles), plus the district backdrops shown
while exploring (`artZoneGarrison`/`artZoneRoguesden`/`artZoneSanctum`)
and the Palace gate's own static backdrop (`artPalaceGate`). Shares
`makeFlag()`/`makeBountyBadge()`/`makeTrialIcon()`/`plate()`/`biGet()`/
`decorLayers()` (art.js — extracted there specifically so this file
could reuse them) rather than re-authoring the same badge/plate SVG a
second time. Own file per the "new concern, new file" convention
(art.js was already 500+ lines when Gnometropolis became a full town
hub). Loads right after art.js — content.js's own data doesn't
reference these by value, but keeping every art-before-content.js file
grouped together avoids a subtler load-order footgun later.

Touch this file when: changing the Gnometropolis square's own building
layout/decoration, or its three district backdrops.

## mudroot-art.js — Act 2 Part 2 (Mudroot Warren) art
`artMudrootWarrenSquare(buildingIndicators, mudflatsRevealed,
warrensEarUnlocked, emberWarrenUnlocked)` — the 3x3 Mudroot Warren
square (Root Cellar/Mudflats/Bureau — all three real combat districts,
no rest tile in this hub at all; resting happens at Gnometropolis's
Camp instead). The Mudflats tile renders as a second real building
ONLY once `tunnelWardenDefeated` is true, otherwise as an inert
collapsed-tunnel filler (no data-action, no plate label) —
deliberately not a marker pointing at "a door that opens later," just
a tile that quietly becomes a different tile once quest9's own first
stage clears. The root-wrapped, chained-shut door tile works the same
way for quest10: once `warrensEarUnlocked` (`state.quest10Path` being
set) it becomes a real clickable tile into the Warren's Ear
(warrensear-art.js), one hub deeper. The rockpile filler tile at
`translate(0,200)` gets the SAME treatment for quest11: once
`emberWarrenUnlocked` (`state.quest11Complete`) it becomes a real
clickable tile into the Ember Warren (emberwarren-art.js), one hub
deeper still — the other four filler tiles are untouched. Also the
three district backdrops (`artZoneRootCellar`/`artZoneMudflats`/
`artZoneBureau`). Same shared-helper-reuse convention as
gnometropolis-art.js above.

Touch this file when: changing the Mudroot Warren square's own
layout/reveal logic, or its three district backdrops.

## warrensear-art.js — The Warren's Ear art (Act 2, quest10)
`artWarrensEarSquare(choirRevealed, ledgerVaultRevealed)` — a tighter
2-tile hub (no rest tile, no third district — nothing else here yet)
one step past Mudroot Warren. Both tiles are real combat districts but
each renders as an inert filler (no data-action, no plate label) until
its OWN rare hunt is cleared (`tunnelMoleInformant`/`seniorClerk`,
warrensear-content.js) — same reveal-not-marker mechanism Mudflats
already uses. Also the two district backdrops (`artZoneChoir`/
`artZoneLedgerVault`). Loads after art.js/mudroot-art.js.

Touch this file when: changing the Warren's Ear square's own
layout/reveal logic, or its two district backdrops.

## emberwarren-art.js — The Ember Warren art (Act 2, quest11/16)
`artEmberWarrenSquare(crystalBreachRevealed)` — originally a tight
2-tile hub shape like warrensear-art.js, one step past the Warren's Ear,
with BOTH original tiles (the Foundry/the Gearworks) real and clickable
from the moment the hub itself unlocks — no per-district reveal state
needed for either, since `quest11Complete` already gates reaching the
hub at all (travelTo(), town.js). Widened to a THIRD tile (200x100 ->
300x100 viewBox) for quest16's own capstone reveal — same reveal-not-
marker mechanism as every hub before it: inert crystalline filler until
`state.quest16Complete`, then a real `data-action="crystalcity"` door.
Also the district backdrops (`artZoneFoundry`/`artZoneGearworks`) — the
Crystal City's own backdrop lives in art.js instead, since it's a leaf
zone with no hub-square file of its own (see art.js's section). Loads
after art.js/mudroot-art.js/warrensear-art.js.

Touch this file when: changing the Ember Warren square's own layout,
or its two district backdrops.

## monster-stats.js — every monster/boss's core stats, in one place
`MONSTER_STATS`, a single object keyed by each monster's own exact
`name` string, mapping to `{ beef, zip, grit, hoodoo, xp }` — the
entire game's balance surface for the 355 monsters/bosses spread
across content.js/mudroot-content.js/warrensear-content.js/
emberwarren-content.js/crystalcity-content.js/prismdepths-content.js.
Each of those 6 files' own monster object literals spread their entry
here (`...MONSTER_STATS["<name>"]`) instead of hardcoding the 5 stat
fields — see content.js's own comment (right above this file's
mention) for the full history/verification of that refactor. Grouped
by source file, then by zone within it, purely for human navigation
when tuning — the object itself is flat, key order is irrelevant to
the lookup. Loads immediately after emberwarren-art.js, before
content.js (and every other monster-data file) — see index.html's own
load-order comment for why (referenced by value at parse time, same
requirement icons.js/art.js already have).

**Zip is a real archetype axis now, not a default-0 afterthought** —
per explicit correction, 138 of these 355 entries were converted to a
real "evasive" archetype (meaningful zip, grit pulled down by roughly
the same fraction as the resulting dodge chance, so it's not strictly
safer to fight, just swingier) after a live player noticed almost
nothing in the game actually used `zipDodgeAndAccuracy()`'s own
already-symmetric dodge formula (combat.js) despite it driving both
the player's AND a monster's dodge chance identically — see this
file's own top comment for the full before/after numbers, the keyword-
based selection rule, and the explicit "pick an archetype on purpose"
instruction for any new monster added from here on.

Touch this file when: rebalancing any monster or boss's beef/zip/
grit/hoodoo/xp. Don't touch it for anything else about a monster
(name, zone, skills, art, loot/rareDrop/gearDrop) — those still live
in that monster's own file.

## content.js — game data tables
`monsters[]` (per-zone, each with its own optional `rareDrop` AND
`gearDrop` — a monster-themed equip drop, own Diablo-style "of the ___"
stat modifier per the comment above `monsters[]`, authored as the
tier-1/1-stat baseline; `RARE_DROP_CHANCE`/`GEAR_DROP_CHANCE` roll each
independently in `winCombat()`, and a dropped gearDrop then rolls a
tier via `GEAR_DROP_TIER_CHANCE`/`rollGearDropTier()` — see combat.js).
Per explicit correction, `gearDrop` is class-FREE (no `classRequired`)
for every zone before Gnometropolis (Commons/Sewers/Quarry/Vault) —
`classRequired` gear starts at Garrison/Rogues' Den/the Arcane Sanctum
(Gnometropolis's own districts, tied to the class trial) and stays
gated from there through the rest of the game. Per a later explicit
request, each zone's own `monsters[]` entries (both pre-Gnometropolis
and the class-gated zones already did) were also expanded so every
zone's gearDrop set covers all 5 equip slots (all 3 classes too, where
classRequired applies) — see each zone's own "gap-filling pass"
comment, content.js, for the exact additions.

Every monster/boss across ALL SIX monster-data files (this one,
mudroot-content.js, warrensear-content.js, emberwarren-content.js,
crystalcity-content.js, prismdepths-content.js — 355 objects total) is
authored as a `beef`/`zip`/`grit`/`hoodoo` stat block (plus `xp`),
mirroring the player's own 4 stats, REPLACING the old raw
`hp`/`atkMin`/`atkMax`(/ad hoc `dodgeChance`) fields entirely —
`deriveMonsterCombatStats()` (combat.js) turns these into the numbers
`startCombat()` actually spawns with, via `statBonus()` same as every
player formula. `hoodoo` now has a real mechanical effect — see its own
"ethereal archetype" paragraph further down — though a monster's
`skills[]` still keep their own hand-authored heal/bolt/debuff
magnitude regardless of hoodoo; that part was never in scope.

**Per a later explicit request ("I want to tune their stats" / "have
the lookup table be part of the GitHub with the program referencing
it"), every one of those 355 `beef`/`zip`/`grit`/`hoodoo`/`xp` blocks
now lives in ONE place: `monster-stats.js`**, a single `MONSTER_STATS`
object keyed by each monster's own exact `name` string (confirmed
unique game-wide before this refactor — no two monsters anywhere share
a name, checked mechanically, not by inspection). Every monster
definition in all 6 files now reads `name:"<name>", ...MONSTER_STATS[
"<name>"], zone:"...", skills:[...], ...` instead of hardcoding the 5
stat fields inline — tuning any monster's difficulty is now editing
one number in `monster-stats.js`, not finding the one object literal
among 355 that happens to define it. This was a mechanical,
behavior-preserving transformation (a scripted regex rewrite, verified
by diffing every monster's own derived hp/atkMin/atkMax/xp before and
after against a live extraction — zero differences across all 355
entries) — nothing about zone, skills, art, loot/rareDrop/gearDrop,
or any other field moved. `monster-stats.js` loads FIRST, immediately
after the art files and before `content.js` (index.html) — same
"referenced by value at parse time" ordering requirement icons.js/
art.js already have, since every file's own monster array literal
evaluates immediately and needs `MONSTER_STATS` to already exist.

Touch `monster-stats.js` when: rebalancing ANY monster/boss's core
stats (this is the only file that needs editing for that). Touch the
6 content files themselves when: adding a brand-new monster (name,
zone, skills, art, loot — plus one new entry in `monster-stats.js` for
its stats), or changing anything about an EXISTING monster that isn't
beef/zip/grit/hoodoo/armor/xp.

**`armor` IS part of a monster's authored data now** — per explicit
request ("monsters should also have an armor stat"), every one of the
355 `MONSTER_STATS` entries (monster-stats.js) carries its own `armor`
field, read straight off by `deriveMonsterCombatStats()` exactly like
beef/zip/grit/hoodoo already are. This is the THIRD shape armor has
taken this project: first a hand-picked literal `armor:N` on 9
"marquee" bosses (0 everywhere else), then a pure derivation from
`grit` + `rare:true` through two tunable constants (`MONSTER_ARMOR_
PER_GRIT`/`MONSTER_RARE_ARMOR_PER_GRIT`, both now deleted — nothing
reads them anymore), now a real authored field again — but unlike the
first attempt, every one of the 355 monsters got seeded with exactly
what the derivation formula would have produced for its grit/rare at
the moment of the switch (a live extraction confirmed zero monsters'
derived hp/atk/armor changed), so this was a pure architecture change,
not a balance change. The payoff: a monster's armor can now be tuned
independently of its grit — a "heavily plated but fragile" archetype
(high armor, low grit/HP) is possible the same way zip's own "evasive"
archetype (high zip, low grit/HP) already is. See monster-stats.js's
own comment for the seeding math.

**That archetype is now authored too**, per an immediate follow-up
request — 89 of the 211 monsters NOT already made evasive were
converted: armor raised into a tier above ambient (never decreased),
grit cut by the resulting marginal mitigation gain, same "preserve
roughly how many turns it takes to kill this thing" principle the zip
pass already established, just measured in damage-avoided-per-hit
instead of hits-avoided-outright. A monster is never both evasive AND
armored — kept mutually exclusive so neither low-HP archetype is
strictly better than the other. Re-verified the same way: a live
extraction diffed every monster's new armor/grit against the computed
plan (zero mismatches) and the Prism Depths difficulty calibration was
re-checked across all 8 dungeons. See monster-stats.js's own comment
for the exact keyword/tier rules.

**`hoodoo` is a real "ethereal" archetype now too**, per explicit
request ("how do we handle hoodoo... ethereal things should be like
that as well as how we make hexpert viable"). `hoodooResistance()`
(combat.js, `HOODOO_RESIST_COEFFICIENT`/`HOODOO_RESIST_CAP`,
content.js) mitigates a fraction of damage dealt TO a monster with real
hoodoo, same capped `statBonus()` shape `armorDamageReduction()` uses —
but ONLY against non-magic damage (`applyDamageToMonster()`'s own
`isMagic` parameter gates it; a Hexpert's own spell damage ignores it
completely). That asymmetry IS the "make Hexpert viable" payoff: the
one class that invests in hoodoo gets a built-in edge against monsters
that invest in resisting everyone else, while Meathead/Card Shark just
face a real-but-survivable (capped at 0.4, lower than armor's own 0.6
specifically because class choice is permanent and this can't become a
hard wall for 2 of 3 classes) extra toughness check. 70 of the 122
monsters left after the evasive/armored passes claimed their own share
were converted: hoodoo raised into a tier (5-7 regular/dungeon-trash,
9-11 zone-boss/dungeon-miniboss; a 12-14 dungeon-boss tier went unused
since all 8 dungeon finals were already evasive or armored), grit left
UNTOUCHED (unlike the other two archetypes — the benefit here is
conditional on the attacker's own damage-type choice, not a universal
defense, so there's no universal difficulty increase to offset). A
monster is never ethereal AND evasive/armored — all three stay mutually
exclusive. Re-verified the same way: a live extraction diffed every
monster's new hoodoo against the computed plan (zero mismatches, beef/
zip/grit/armor/xp confirmed untouched) and the Prism Depths calibration
was re-checked, with particular attention to Meathead/Card Shark win
rates since they face the new resistance with no way to bypass it.

**Every monster `heal` skill scales off ITS OWN maxHp now, not a flat
hand-picked number** — per explicit request ("a boss with 2000+ health
healing for 30 means nothing"). `healMin`/`healMax` (a flat amount,
loosely re-tuned per zone by hand as content got added) drifted
further and further behind the game's own HP growth the deeper content
went — a live audit before this fix found trash-tier heals already at
a healthy 8-30% of their own HP, but late Prism Depths dungeon bosses
down at 0.6-1.7% of theirs (one as low as 44-62 flat HP against an
8312 HP pool). Replaced with `healPercentMin`/`healPercentMax`
(content.js, every `type:'heal'` skill in all 6 monster-data files) —
a fraction of `state.monster.maxHp`, read by `useMonsterSkill()`
(combat.js). Tiered by category the same way the zip/armor/hoodoo
archetype passes above are: 8-12% for regular/dungeon-trash (left
alone — the live audit found these already meaningful), 5-7% for
zone-boss/dungeon-miniboss, 6-9% for dungeon-boss — `chance` is
completely untouched, only the magnitude basis changed. `bolt` skills
are NOT part of this change — still a hand-computed flat amount, see
the comment above `TRASH_SKILL_CHANCE`'s own paragraph.

The boss/miniboss tiers went through one retuning pass before landing
here: a first attempt (10-14%/12-16%) was caught by the same Prism
Depths re-verification every stat pass above runs — several dungeon
finals with a self-heal (Stillglass Warden/frostvault, Rootbound
Warden/verdanthollow, Unbroken Chord/echochapel) went from a reliable
100% toolkit win rate straight to 0-7%, because a self-heal that
large, procced repeatedly over a long boss fight, can out-heal a
class's own real DPS rather than just being "a real chunk of health"
once per use. Halving it to 5-7%/6-9% restored every one of those
to ~100% while still landing 5-8x above the old flat numbers'
effective percentage. One known pre-existing rough edge survived even
at the retuned tier, at the TIME of this pass: Sunken Archive's Card
Shark matchup at its own recommended level (already the single
tightest matchup in the game before this pass, ~30% toolkit win rate
at n=40) dropped to 0% — stacking a modest, now-real self-heal on top
of a margin that was already razor-thin tipped it over. **This has
since been fixed as a side effect of an unrelated later pass** — see
`CLASS_ATTACK_STAT`'s own paragraph further down — once Card Shark's
basic Attack scaled off its own stat instead of Beef, the SAME matchup
jumped to ~93% (n=15); the margin was never actually unfixable, Card
Shark was just chronically underpowered there for a reason that had
nothing to do with heals.

Stubborn Recovery (Meathead's own late-game heal spell, `spells`
further down) got the SAME kind of fix for the SAME underlying reason,
just on the player side — see its own comment, content.js/combat.js,
for the full before/after (it went through an intermediate Beef-
scaled version first, which overcorrected into healing for more than
the caster's own max HP at high Beef, before landing on
`healPercentOfMaxHp`).

**The 4 "evasive" Prism Depths dungeon bosses got their grit raised**
(Emberwright/embercrypt, Unanswered Herald/stormreach, Last Candle/
duskward, Unbroken Chord/echochapel — see monster-stats.js's own
comment for the exact before/after numbers), per an explicit report
("I should not be one hitting a boss"). The methodology gap: every
earlier Prism Depths calibration this session tested "can you beat
dungeon N" using dungeon N's OWN treasure gear — a fair test for "is
this dungeon's gear worth farming," but the wrong one for "is the
FIGHT TO GET that gear itself fair," since you can't have earned it
yet. Re-tested with the gear a player would REALLY have — the
PREVIOUS dungeon's own treasure (or Act 2's own Tier4 shop gear for
Embercrypt, the first one) — and found the 4 evasive-archetype bosses
(a lower-grit zip:8 trade-off from an earlier pass, never checked
against this weaker baseline) died in 3-7 hits where their 4 armored
siblings at the same ladder position took 11-27. Grit raised so all 8
bosses now sit on one smoothly escalating hits-to-kill curve under
that same realistic-gear assumption, no boss easier than the one
before it. Explicitly did NOT touch zip/beef (the evasive archetype's
own dodge identity, and a related finding — these bosses can also
one/two-shot the PLAYER back under the same gear assumption, worse at
Embercrypt than anywhere else — were both scoped out by explicit
request; only the "player one-shots boss" direction was fixed here).

The named bosses — every one of them (`gnomeCommander`/`diggerBot`/
`gnomeKingsCaptain`/`gnomeKing`/the Adventurer's Trial's three themed
fights, `trialChampion`/`casinoChampion`/`hoodooChampion`/the three
Gnometropolis district guardians) carries its own `skills[]` and/or a
real `zip` (driving `deriveMonsterCombatStats()`'s own dodge formula,
replacing the old ad hoc `dodgeChance` field 6 of them used to author
directly) giving it one signature mechanic (a rally buff, a self-
heal, an elemental bolt, evasion, or some combination — see the comment
above `gnomeCommander` for the full rundown and reasoning) dispatched
generically by combat.js's `monsterRetaliate()`/`useMonsterSkill()`,
no per-boss combat code needed — with their own spawn-chance
constants.

**`NAMED_BOSSES`** (content.js, declared right after `arcaneSanctumGuardian`,
the last of its own 15) collects every one of those named rare/boss
consts into a single array for the first time — the Bestiary
(`renderBestiaryBlock()`, render-character.js) and its completion-bonus
math (`winCombat()`, combat.js) are the first things that need them
together; before this they only ever existed as standalone consts each
referenced by their own `*Hunt` check. mudroot-content.js/
warrensear-content.js/emberwarren-content.js/crystalcity-content.js
each append their own bosses/zone-rares with `NAMED_BOSSES.push(...)`
at the bottom of that file — same extension pattern as
`monsters.push(...)`/`BOUNTY_TEMPLATES.push(...)`. A new boss (or
zone-rare) just gets pushed here wherever it's defined.

**`ZONE_RARE_MONSTERS`/`ZONE_RARE_SPAWN_CHANCE`** — one always-
available, repeatable rare monster per real adventuring zone
(`ADVENTURE_ZONES`, combat.js — 15 zones; `palace` deliberately has
none, since it's gauntlet-only and was never a wild-exploration zone).
Unlike every `*Hunt` above (quest-gated, one-time, a hand-written
`if` block per boss in `goAdventuring()`), these are checked ONCE,
generically, via a single `ZONE_RARE_MONSTERS[state.location]` lookup
in `goAdventuring()` — placed after every quest-hunt check (so an
active quest hunt still takes priority) and before the normal
encounter roll. Each zone's own rare is defined in that zone's own
content file and added to `ZONE_RARE_MONSTERS` via
`Object.assign(ZONE_RARE_MONSTERS, {...})`, same convention
`noncombatEvents`/`hazardEvents` already use — and also pushed onto
`NAMED_BOSSES` so it's trackable in the Bestiary like any other named
monster. Stats are derived from that zone's own toughest REGULAR
monster (`monsters[]`) — beef/grit ~20% above that ceiling, xp
~1.5x it, capped below whatever quest-rare/boss already guards that
same zone — not invented per zone.

**Every regular (non-rare) monster now also carries exactly one
skills[] entry** (combat-variety pass — previously only named bosses
had any mechanical behavior beyond plain auto-attack; see the comment
above `TRASH_SKILL_CHANCE`, right before `const monsters = [`, for the
full reasoning). Reuses the exact same `monsterRetaliate()`/
`useMonsterSkill()` dispatcher — zero new combat.js code was needed.
Restricted to `heal`/`buff`/`bolt` only; `debuff` (burn/poison/freeze)
stays boss-exclusive, a "this is a real fight" signal. Every trash
skill shares one `chance` (`TRASH_SKILL_CHANCE = 0.12`, well below a
boss's own 0.15-0.25). A `bolt` skill's magnitude is still hand-
computed per monster from that monster's own zone-scaled atk (not an
arbitrary number); a `heal` skill's is NOT any more — see
`healPercentMin`/`healPercentMax`'s own paragraph further down for why
that changed. `TRASH_SKILL_CHANCE` has to be declared BEFORE
`const monsters = [` specifically because it's referenced inside that
array literal (evaluated immediately at parse time, unlike
`MONSTER_ARMOR_PER_GRIT`-style constants that live further down this
file and are only read inside function bodies called later — declaring
it after the array would throw a temporal-dead-zone ReferenceError the
moment the array tried to evaluate it, a real bug caught once while
building this). Flavor text is hand-written per monster to match the
game's existing comedic voice, not templated.

**`ZONE_DIFFICULTY`'s commons/sewers/quarry/vault/garrison/roguesden/
sanctum entries went through a third correction pass**, per the same
"I am doing wayyy too much damage" audit `CLASS_ATTACK_STAT` above
came from. Two earlier corrections (this constant's own comment,
content.js, has the full history) already caught the Mole Wars zones
being too easy for a tempered character — but explicitly, deliberately
left this bracket untouched both times. A live hits-to-kill audit
found exactly why that gap mattered: commons through sanctum sat at
0.55-0.75 hits to kill a regular monster (functionally one-shot) at
every level from 1 through 10, for every class, then jumped straight
to a healthy 1.0-1.4 the instant Root Cellar's own already-corrected
numbers kicked in at level 12 — same "old content never tracked a
later change" shape as every other fix in this file. A uniform x1.7 on
just those 7 zones (content.js's own comment has the exact math) lands
the whole bracket in that same ~1.0-1.3 band, preserves their existing
relative spacing exactly (one scalar on an already-monotonic sequence),
and stays under Root Cellar's own 4.29 so zone progression order is
untouched. `palace` is deliberately excluded and stays at the original
2.48 — every monster there is `rare:true` (the Palace Gauntlet, a
boss-rush with no regular trash), a different, already-tuned system
this fix has nothing to do with. One side effect that needed its own
fix: raising atk alongside hp meant 35 `bolt`-skill monsters in these
zones (all in this file — the other 6 monster-data files don't touch
these zones) had their own hand-authored `boltMin`/`boltMax` fall
behind the SAME way `heal` skills did before their own fix above; each
was scaled by the same x1.7 to stay "a bit more than a bite from its
own jaws," the rule their own convention has always followed. `ZONE_LABELS`, `noncombatEvents`/
`hazardEvents`, `healItems`/`shopFoodItemsTier2`/`shopFoodItemsTier3`,
`starterGear`, `shopGearItems`/`shopGearItemsTier2`/`shopGearItemsTier3`/
`shopGearItemsTier4` (1/2/3/4 stats respectively — each tier up adds one
more +1 secondary stat on top of the previous tier's own bonuses, all
gated by Shop level via `SHOP_LEVEL_GEAR_TIER2/3/4`, see
`getAvailableShopItems()` in economy.js), `STAT_ROTATION` (which
secondary stat a MONSTER GEARDROP's tier-2/3/4 roll gets,
`rollGearDropTier()`, combat.js — cycled per primary stat; still only
the original 4 stats, deliberately NOT extended to include `armor` —
its 3-slot rotation IS the "tier 4 = all 4 stats" guarantee, and a 5th
stat doesn't fit without restructuring the tier system itself. A SHOP
purchase's own secondary roll is a separate, simpler mechanism —
`rollShopGearStats()`, economy.js — back to its original 4-stat
candidate pool, beef/zip/grit/hoodoo only; armor briefly lived in this
pool too before "armor on every piece of gear" replaced that with a
guaranteed per-tier amount via `ensureGearArmor()` (item-tiers.js) on
every item regardless of source, making a RANDOM armor roll here
redundant), `MONSTER_HP_PER_GRIT`/`MONSTER_ATK_PER_BEEF`/
`MONSTER_ATK_SPREAD` (the monster-stat-block derive formula's own
tuning knobs — see `deriveMonsterCombatStats()`, combat.js; armor is
NOT derived here any more — `MONSTER_ARMOR_PER_GRIT`/`MONSTER_RARE_
ARMOR_PER_GRIT` were deleted once armor became a real authored field,
monster-stats.js's own comment has the full history), `ZIP_DODGE_
COEFFICIENT`/`ZIP_DODGE_CAP` (renamed from `MONSTER_DODGE_COEFFICIENT`/
`MONSTER_DODGE_CAP` once zip's own formula — `zipDodgeAndAccuracy()`,
combat.js — became shared by BOTH the player and monsters, on BOTH
offense and defense: the same number is a combatant's own dodge chance
AND, symmetrically, their ACCURACY against whoever they're attacking's
dodge — per explicit request that zip "combat" the opponent's dodge
chance in both directions, not just raise your own. See that
function's own comment for the full 4-way breakdown.

**`ZIP_DODGE_COEFFICIENT` dropped ~43x (0.03 -> 0.0007)**, per a live
report: a level-21 character with ZERO points spent on Zip (42 of it
purely incidental, from gear secondaries) was already at the hard 0.5
dodge cap — reachable by accident around zip 15, not by a real stat
choice, for every class. Since this same coefficient also drives every
MONSTER's own dodge/accuracy off a much smaller zip range (2-8), a
straight reduction would have gutted the "evasive" archetype right
along with the player fix (statBonus(8)*0.03=36% dodge would have
collapsed to ~0.7% at a coefficient small enough to fix the player
side alone) — fixed by remapping EVERY monster's own zip in lockstep
to reproduce its exact old dodge/accuracy percentage under the new
coefficient (monster-stats.js's own comment has the exact numbers), so
none of that archetype-balance work was lost. Reaching the 0.5 cap now
takes real investment (~zip 97, roughly a genuinely dedicated Card
Shark's late-game total) instead of incidental gear secondaries.

`ARMOR_REDUCTION_COEFFICIENT`/`ARMOR_REDUCTION_CAP` (armor's own mitigation-fraction
formula, shared by both the player and monsters — see
`armorDamageReduction()`, combat.js — reuses `statBonus()`'s own
superlinear curve, capped so it hard-flatlines instead of ever
approaching 100%), `shopBuyItems`, `spells` (each with a `type` —
`'damage'|'heal'|'ward'|'buff'|'shout'|'evade'` — and a `classRequired`/
`learnLocation` pair gating who can learn it and where; Hexpert is the
only class with two Act 2 spells, `arcanelance` (damage) and
`illusion` (evade, added alongside it by explicit request rather than
replacing it — Meathead/Card Shark still get exactly one Act 2 spell
each) — `illusion` shares Card Shark's `smokescreen` mechanic exactly,
via the shared `state.evasionActive` flag, combat.js.

`heal` (`stubbornrecovery`, NOT `mendcharm`/Hexpert's own early heal)
and `ward`/`shout` (`wardcharm`/`aceinthehole`/`shout`) all carry
`healPercentOfMaxHp`/`shieldPercentOfMaxHp` now — a FRACTION of
`state.maxHp`, not a stat-scaled amount, read generically by
`castSpell()`'s own `'heal'`/`'ward'`/`'shout'` branches (combat.js;
absent/0 for `mendcharm`, so it's untouched and still just reads
`healValue` flat). All three went through the SAME multi-step mistake
and fix: a flat/near-flat version was found "functionally decorative"
against a late-game hit/HP pool in the hundreds-to-thousands, so each
was changed to scale off the caster's own primary stat (Beef for
Shout, Hoodoo for Warding Charm, Zip for Ace in the Hole) — which then
got proven wrong by a live playtest with a real, heavily-invested
character: a single 3-MP Shout cast produced a shield worth 309% of
the CASTER'S OWN max HP, trivializing every fight regardless of how
the dungeon itself was tuned. Pegged to `maxHp` itself instead (which
Grit already drives via `recomputeMaxStats()`, player-actions.js) —
always a sane, bounded base fraction of the CURRENT HP pool. `shout`'s
own percentage is deliberately smaller than `ward`'s (0.12 vs 0.15,
content.js) preserving the original "Shout is the smaller,
supplementary one" intent. A THIRD pass then removed each spell's own
`...PerSkillLevel` field entirely — `state.classSkillLevel` used to add
a further free bonus directly on top of the base percent, flagged
directly ("Stubborn Recovery only costing 8 MP is essentially free as
you level"); growth is now exclusively the paid 5-level spell-upgrade
ladder below, which raises MP cost right alongside power instead of
letting it ride free on the shared class-skill counter. Ace in the
Hole exists at all because Card Shark was the only class with ZERO
heal/shield spell (just `loadeddice`'s buff and `smokescreen`'s evade,
neither of which mitigates a hit), a gap that predated the Prism
Depths ladder's own retune but only became a measured dungeon-clearing
failure once that retune landed against a realistic level/gear
baseline.

**The 5-level spell-upgrade ladder** (per explicit request: "instead
of skills scaling, let's have them be upgradable... 5 times, where
they do more but cost more MP") — `SPELL_UPGRADE_MAX_LEVEL`/
`POWER_PER_LEVEL` (+15%/level, +75% at max)/`MP_PER_LEVEL` (steeply
retuned per an immediate follow-up — "it should cost way more hoodoo,
max level should be well over 100mp" — from +20%/level [double at max,
a maxed Stubborn Recovery was still just 16 MP] to +300%/level, 16x
base cost at max [Stubborn Recovery's own 8 MP base reaches 128 at
max], its own comment, content.js, for the full reasoning)/`BASE_COST`/
`COST_PER_MP`, `spellUpgradeCost(spell,
targetLevel)` (content.js), `spellUpgradeLevel(id)`/
`spellUpgradeMultiplier(id)`/`spellEffectiveMpCost(spell)`/
`upgradeSpell(id)` (combat.js). Replaced a single flat Hexpert-only
"Level 2" tier entirely — now open to all 3 classes, one level at a
time, each at their own Act 2 district (`CLASS_UPGRADE_LOCATION`,
content.js — Garrison/Rogues' Den/Sanctum for Meathead/Card Shark/
Hexpert, generalizing the Sanctum's own old exclusive privilege) for
EVERY spell that class currently knows, not just the ones taught at
that specific building. `state.spellUpgradeLevel` (an object, id ->
0-5, core.js) replaced the old binary `state.spellsUpgraded` array; a
save from before this change migrates each previously-upgraded spell
to Level 1, not 5 or 0 (`hydrateState()`, save.js — that player paid
for one tier's worth of Pop Tabs, not five). Cost to buy the NEXT
level scales LINEARLY with the target level (not quadratic like
`classSkillCost()` below) — a player upgrades several spells over the
course of the game, not just one shared counter, so a quadratic-per-
spell curve would compound into an unreasonable total sink.
`spellEffectiveMpCost()` is read everywhere `spell.mpCost` used to be
read directly — the cast gate/deduction in `castSpell()`, every UI
listing (`renderClassSpellList()`/`renderCastableSpellsBlock()`,
class-spells.js; `renderSpellMenu()`, render-character.js; the Hoodoo
Doctor's own shop list, render-shop.js; the Recast button, render.js)
— so a spell's displayed/charged cost always reflects its real current
level, not its base value.
`potionIngredients`, `veinIngredients`,
`CLASS_TITLES` + each class's skill-bonus constants
(`MEATHEAD_DAMAGE_BONUS`/`CARD_SHARK_DOUBLE_ATTACK_CHANCE`/
`HEXPERT_SPELL_DMG_BONUS`, each now paired with a combat-variety proc
constant — `MEATHEAD_STAGGER_CHANCE`/(Card Shark's own skill already
WAS the proc)/`HEXPERT_ECHO_CHANCE`+`HEXPERT_ECHO_DAMAGE_MULT` — see the
comment above `MEATHEAD_STAGGER_CHANCE` for why; all 3 proc-chance
arrays share one 5%/10%/15%-per-level curve + `classSkillCost()`),
casino odds/flavor lines, `BOUNTY_TEMPLATES`, and
the Town Lot/building-upgrade cost
tables (`buildingUpgradeCost()`, `LOT_TIER_COST` — both quadratic) plus
each building's per-level effect constants (`GAFFER_BISCUIT_MAX_BONUS`
etc.) and `STAT_RESET_BASE_PRICE`/`STAT_RESET_PRICE_MULT`.

**Armor classes (Heavy/Medium/Light per class)**: any equip item
(weapon included) can carry `classRequired` — `'Meathead'`/`'Card
Shark'`/`'Hexpert'`, same field the `spells[]` list above already uses
for the same concept — read/enforced by `equipItem()` (player-
actions.js) and the shop filters (`filterByClass()`, economy.js).
Absent/undefined means universal (starterGear stays this way — no
stats, nothing to restrict). `CLASS_SIGNATURE_STAT` (next to
`CLASS_TITLES`) is that pairing read the other way round — a class-
tagged item's PRIMARY stat is always its class's own signature stat
(`beef`/Meathead, `zip`/Card Shark, `hoodoo`/Hexpert; grit/Bulwark has
no entry since Bulwark isn't a reachable class). `ARMOR_CLASS_WEIGHT`
(`Meathead:1.4`/`'Card Shark':1.0`/`Hexpert:0.7`) is the actual
Heavy>Medium>Light multiplier on an item's armor VALUE
(`ensureGearArmor()`, item-tiers.js); `ARMOR_WEIGHT_LABEL` is purely
cosmetic, for showing "Heavy"/"Medium"/"Light" next to an item's class
in the UI (`gearRequirementText()`, item-tiers.js).

The gate only fires on a NEW equip action — already-equipped/owned
mismatched gear from before this feature shipped is grandfathered in
on purpose, and the gate itself no-ops entirely while
`state.classTitle` is still null (pre-Trial, before ~level 10), so a
new character isn't locked out of every piece of gear before they've
even picked a class.

`shopGearItems`/Tier2/3/4's weapon rows already had one distinct item
per class (Beef/Hoodoo/Zip-primary) before this feature — those just
got tagged as-is. head/chest/legs/boots used to be ONE universal item
per slot; each is now THREE near-identical class variants (same desc/
icon, reusing the gearDrop "of the ___" animal-suffix naming below) so
a class can only buy the variant tagged for it — this is why the Act 1
shop's armor rows tripled in count. `act2GearItemsTier1-4` (act2-
shop.js) mirrors this exactly. Monster `gearDrop`s were NOT tripled —
each existing drop was just reassigned a class + matching primary stat,
distributed evenly per zone, since a loot pool spread across many
monsters/zones only needs a roughly even 3-way split, not 3x the drops
per monster. `PALACE_GATE_GEAR` already had this exact class/primary-
stat pairing from the start (just renamed from `class` to
`classRequired` for consistency) — nothing else about it changed.

Touch this file when: adding or rebalancing a monster, item, spell, shop
listing, casino odds, or a cost/bonus curve. Rarely needs a matching
change elsewhere unless you're adding a new mechanic, not just new data.
New class-tagged armor/weapon gear needs `classRequired` set to a real
class and its primary stat matching `CLASS_SIGNATURE_STAT[classRequired]`
— nothing enforces that pairing at runtime, it's a content convention.
Every equip/consumable item should carry an explicit `tier` field (see
item-tiers.js below) — 'poor'/'common'/'uncommon'/'rare'/'epic'; quest
items and ordinary junk loot don't need one, they're derived from `type`.
`ZONE_ORDER` is the Map's main chain (town->commons->sewers->quarry->
vault->gnometropolis->mudrootwarren->warrensear->emberwarren) that
`travelCostFor()` (town.js) prices trips by DISTANCE against — new
zones on the main chain (not a district) get added here, in order.

## mudroot-content.js — Act 2 Part 2 (Mudroot Warren) monster data
`mudrootMonsters` (Root Cellar's 3 + Mudflats' 3 + the Bureau's 3
"business mole" regulars — same loot/rareDrop/gearDrop/skills[] shape
as content.js's own `monsters[]` (each one also carries its own
`TRASH_SKILL_CHANCE`-gated heal/buff/bolt skill — see content.js's own
comment above that constant), `.push()`ed onto that same array at the
bottom of this file rather than duplicating combat.js's zone filter),
quest9's two rare hunt targets (`tunnelWarden`/`warrenScout` — same
`rare:true`/`skills[]`/`beef`/`zip`/`grit`/`hoodoo`/`armor` stat-block
shape as content.js's own named bosses, spawned by
`tunnelWardenHunt`/`warrenScoutHunt` in
`goAdventuring()`, combat.js) plus their own spawn-chance constants,
and extends content.js's `noncombatEvents`/`hazardEvents` with entries
for `rootcellar`/`mudflats`/`bureau` (`Object.assign()`, since those
are plain objects content.js already exported). Own file per the "new
concern, new file" convention rather than growing content.js (already
1200+ lines) further. Loads after content.js/mudroot-art.js/icons.js
(reads all three by reference/by value).

Touch this file when: adding/rebalancing a Mudroot Warren monster, or
extending quest9's own rare-hunt mechanics.

Also introduced `makeBountyTemplate(m)`, extracted from content.js's own
`BOUNTY_TEMPLATES` construction so a later-loading file (this one, and
now warrensear-content.js) can generate its own zones' bounty templates
the same way — `BOUNTY_TEMPLATES` itself is a one-time snapshot taken
at content.js parse time, before either of these files' own
`monsters.push()` ever runs, so without this a new zone's monsters
would silently never get a bounty template at all.

## warrensear-content.js — The Warren's Ear (Act 2, quest10) monster data
`warrensEarMonsters` (the Choir's 3 + the Ledger Vault's 3 regulars —
same shape as mudroot-content.js's own monsters, `.push()`ed onto
`monsters`/`BOUNTY_TEMPLATES` the same way), quest10's own two rare
hunt targets (`tunnelMoleInformant` in the Root Cellar,
`seniorClerk` in the Bureau — spawned by
`tunnelMoleInformantHunt`/`seniorClerkHunt` in `goAdventuring()`,
combat.js). Unlike quest9's `tunnelWarden`/`warrenScout` (a SEQUENCE —
each stage gates the next), these two run in PARALLEL: whichever is
defeated FIRST sets `state.quest10Path`, unlocking the Warren's Ear and
revealing that district immediately (the other stays available
afterward too, so the second district can still be revealed later as
an optional bonus). Also extends `noncombatEvents`/`hazardEvents` with
`choir`/`ledgervault` entries. Also quest14's own gauntlet, "the Ledger
Committee" — `committeeAuditor` (the one guard) and `vaultKeeper` (the
finalBoss), the Ledger Vault's first named encounter of any kind — see
GAUNTLETS's own `ledgerCommittee` entry, gauntlet.js, for the actual
scripted-approach mechanics (neither is pushed to `monsters[]`, so
neither can ever spawn as a random encounter). Loads after content.js/
mudroot-content.js/warrensear-art.js/icons.js.

Touch this file when: adding/rebalancing a Warren's Ear monster, or
extending quest10's own branching-path mechanics or quest14's gauntlet.

## emberwarren-content.js — The Ember Warren (Act 2, quest11/12/13/15) monster data
`emberWarrenMonsters` (the Foundry's 15 + the Gearworks' 15 regulars —
same shape as warrensear-content.js's own monsters, `.push()`ed onto
`monsters`/`BOUNTY_TEMPLATES` the same way; gearDrop bonus continues
the zone-difficulty ladder at +9, one step past Warren's Ear's +8). Per
the "every zone's gear covers all 5 slots x all 3 classes" pass, each
district's gearDrop set is a full 15-item (5 slot x 3 class) matrix —
no gaps, same as every other Gnometropolis-onward zone.
Also quest12's own two-stage rare hunt, "Chain of Custody" —
`gearworksForeman` (Gearworks, stage 1, inflicts `'burn'`) and
`bureauQuartermaster` (Bureau, stage 2 — a district from an OLDER hub,
not a new one) — this game's first monsters with a `'debuff'` skill
(see `state.playerStatusEffect`'s own comment, combat.js). No loot/
rareDrop of their own, same as every other named quest-hunt boss.
Also quest13's single rare hunt, "Quenched" — `quenchMaster` (Foundry) —
this game's first `'freeze'` debuff. Also quest15's own finale gauntlet,
"the Mole Council" — `tunnelCaptain`/`foundryMarshal` (the two guards)
and `warrenMother` (the finalBoss, biggest stat block/silhouette in the
game — see GAUNTLETS's own `moleCouncil` entry, gauntlet.js); her own
buff+freeze combo mirrors gnomeKing's buff+bolt finale design (Act 1).
Also extends `noncombatEvents`/`hazardEvents` with `foundry`/
`gearworks` entries. Loads after content.js/mudroot-content.js/
warrensear-content.js/emberwarren-art.js/icons.js.

Touch this file when: adding/rebalancing an Ember Warren monster, or
quest12/quest13/quest15's own bosses.

## gauntlet.js — reusable multi-boss gauntlets
`GAUNTLETS` (`ledgerCommittee` — quest14, Ledger Vault; `moleCouncil` —
quest15, Gearworks) — generalizes the Act 1 Palace Gate's own one-off
approach (`approachPalaceGate()`/`palaceGauntletProgress`/
`PALACE_GUARDS`, guild.js/content.js, both left completely untouched)
so a SECOND and THIRD gauntlet can each be "add one entry here" instead
of hand-copying that whole pattern again. `gauntletProgress` (a plain
object of transient per-gauntlet counters, never saved, same convention
as `combatSubView`)/`resetGauntlet`/`resetAllGauntlets` (called from
the same two places `resetPalaceGauntlet()` already is — `travelTo()`,
town.js, and `checkDefeat()`, combat.js)/`approachGauntlet(id)`
(starts the next guard, or the finalBoss once they're all down)/
`gauntletButtonText(id)` (read by render.js's own button-text sync)/
`matchGauntletKill(monsterName)` (read by `winCombat()`'s own
gauntlet-detection block, combat.js, instead of that file needing a new
hand-written `wasX` const per boss per gauntlet). Loads after
warrensear-content.js/emberwarren-content.js (whose boss objects this
file's own `GAUNTLETS` registry references BY VALUE at parse time).

Touch this file when: adding a new multi-boss gauntlet, or changing how
an existing one's guards/finalBoss/approach/reset mechanics work.

## crystalcity-content.js — The Crystal City (Act 2 capstone, quest16) monster data
`crystalCityMonsters` (15 regulars — the original 3 (`crystalSentinel`/
`geodeCrawler`/`echoWraith`) plus 12 more added in the "every zone/
dungeon drops gear for every slot, every class" pass — same
`.push()`-onto-`monsters`/`BOUNTY_TEMPLATES` shape as every other
zone's own roster; gearDrop bonus +10, one step past the Ember Warren's
own +9, and now a full 5-slot x 3-class matrix, same as every
Gnometropolis-onward zone). Still a STUB apart from that, same as
Mudroot Warren/the Ember Warren before their own first quest — no rare
hunt/boss of its own yet. First zone with a genuinely new visual
identity (angular crystalline shapes, not the mole silhouette every
Act 2 monster before it used — see the comment above
`artCrystalSentinel`, art.js) signaling
this is the first taste of whatever comes after the Mole Wars, not
another warren. Also extends `noncombatEvents`/`hazardEvents` with a
`crystalcity` entry. Loads after content.js/icons.js/art.js.

Touch this file when: adding/rebalancing a Crystal City monster, or
(eventually) its own first quest/rare hunt.

## prismdepths-content.js — Act 3 (the Prism Depths) dungeon data
Monster/boss/treasure DATA only for Act 3's repeatable dungeons — the
generic run engine that reads it lives in dungeon.js right after this
file (same split gauntlet.js/its boss-data files already use). Act 3
is NOT another `ZONE_ORDER` zone chain — see dungeon.js's own top
comment for why. Holds all 8 of the planned first-wave-through-third-
wave dungeons now (the Hollow Vault finale is a deliberately separate,
later pass — see `~/.claude/plans/shimmering-hopping-parrot.md`'s Act
3 plan): **wave 1** (quest17, "What Light Remembers") —
**Embercrypt** (fire/forging), **Frostvault** (ice/preservation),
**Stormreach** (lightning/signal); **wave 2** (quest18, "Old Light,
Older Debts," town.js — offered only once ALL of wave 1 is cleared at
least once, `allDungeonsCleared()`, dungeon.js) — **Verdant Hollow**
(growth/binding), **Duskward** (shadow/null-light, "the clearest echo
of the Dimming itself" per the plan), **Ironloom** (clockwork/
constructs, a deliberate callback to the Moles' own machine theme);
**wave 3** (quest19, "The Last Two Rooms," same "gated by the actual
dungeons" rule) — **Echo Chapel** (sound/memory, a callback to the
Warren's Ear's own Choir), **Sunken Archive** (knowledge/the Lucent's
own history, the direct lead-in to the not-yet-built finale). Every
dungeon shares the exact same shape: `<name>Regulars` (10 — per a
later explicit request that every dungeon run at least 10 fights with
minibosses and trash mobs throughout: the original 3 trash + 5 more
trash + 2 miniboss-tier entries, `rare:true` but NOT pushed into
`NAMED_BOSSES`/`monsters[]` — same "stronger than trash, not the
dungeon's own named final boss" role a zone-rare plays relative to a
real boss. Minibosses only ever carry `buff`/`heal` skills, never
`bolt` — their threat comes from their own higher beef/grit, sidestepping
the "a bolt must hit harder than a normal swing" magnitude check regular
`monsters[]` entries are held to elsewhere (moot here anyway, since
dungeon monsters were never part of that check — see `TRASH_SKILL_
CHANCE`'s own comment, content.js, for why regular trash NEVER gets a
`debuff` skill; minibosses follow that same restriction too, reserving
`debuff` for the dungeon's own true final boss alone), its own
`rare:true` boss, and `<name>Treasure` (15 class-tagged items, one
picked at random per clear — a full `SLOT_ORDER` row, core.js, for
EACH of the 3 classes, per a later explicit request that a player be
able to gear out an entire class end-to-end from one dungeon's own
drops alone, not just a single slot. Each carries 4 total stats,
primary + 3 secondaries at roughly two-thirds the primary value in
STAT_ROTATION order, content.js — per the earlier explicit correction,
an 'epic' guaranteed drop needs to beat a 'rare' random gearDrop roll's
own 3-stat ceiling, not ship with just the bare primary stat). Each
dungeon sets its own
`ZONE_DIFFICULTY.<name>` entry (content.js) at parse time — a plain
mutation of an already-initialized object, NOT a `const` declared
before its own use (that ordering mistake already happened once this
session — see `TRASH_SKILL_CHANCE`'s own comment, content.js).

**RETUNED once already** — per a real player's own direct report
(level 19, no issue clearing Embercrypt, its own gear several levels
out of reach), the original ladder (a flat continuation of Crystal
City's own ~14%-per-step ratio: 8.6 -> 9.8 -> 11.2 -> 12.8 -> 14.6 ->
16.6 -> 18.9 -> 21.5) was verified LIVE (Playwright, forced RNG, a
realistic "walked in with Act 2's own best shop gear, no dungeon loot
yet, no spells/potions used" loadout) to let a bare-Attack Meathead
clear comfortably at every single dungeon's own intended level — the
opposite of what a dungeon is supposed to demand. Current ladder: 15.5
-> 16.8 -> 18.2 -> 19.7 -> 21.3 -> 23.0 -> 24.9 -> 26.9, each value
independently verified the same way across at least one melee class
and Hexpert: a bare/no-resources run loses essentially every time at
that dungeon's own `ZONE_LEVEL_RECOMMENDATION` min (content.js — now
20/22/24/26/28/30/32/34, pulled down 2 levels per dungeon from the old
raw-gearDrop-derived 22-36 to match where a character's level actually
lands by the time they reach the Prism Depths, not an abstract
"+1-gearDrop-per-dungeon" continuation), while a properly-geared-and-
spelled run (that dungeon's own treasure + every known spell +
potions) clears with real but survivable risk (roughly 20-85% HP
remaining, never a guaranteed stomp either direction). Monster beef/
grit stats themselves are UNCHANGED from their original authoring —
only the multiplier and the level anchors moved. The ladder is no
longer a clean fixed-percent-per-step sequence (a uniform multiplier
would have either left the early dungeons just as trivial or pushed
the already-tight late dungeons, Ironloom/Sunken Archive, back past
their own ceiling for the weaker-sustain classes — see Card Shark's
own `aceinthehole` spell, content.js, for the other half of that
fix) — each value is independently calibrated, not derived from a
formula, and should be re-verified the same way (not just bumped by a
flat ratio) if touched again.

Treasure primary-stat values still climb the gearDrop ladder's own
+1-per-dungeon, +11 through +18, UNCHANGED — only each item's own
`levelReqBase` (120 items, 15 per dungeon — see `getGearRequirements()`'s
own comment, item-tiers.js, for what this field overrides) moved,
from the raw `primaryStat` down to `primaryStat - 1`, so the gear's
EQUIP level requirement (`primaryStat*2`, or now `levelReqBase*2`)
lines up with the same 2-level-lower `ZONE_LEVEL_RECOMMENDATION` floor
above instead of sitting 2 levels past it. Every Act 3 creature shares
one "Lucent-made"
angular/faceted visual family (same vocabulary Crystal City's own
monsters introduced, art.js), never the gnome/mole silhouettes — each
dungeon just varies the palette for its own theme (ember red/orange,
ice blue/white, storm purple/yellow, forest green/moss-olive, shadow-
violet/pale lavender, bronze/brass, slate blue/pale sky, aged sepia/
faded gold) — the underlying shape geometry (the original 3 trash
templates + a "layered boss body" for the true final boss, plus — from
the 10-fight-minimum pass — 5 more trash variant shapes and 2
miniboss-tier variant shapes, a scaled-down echo of the boss shape,
smaller/lighter than the real thing) is byte-for-byte IDENTICAL across
every dungeon's own art functions, only the fill colors change, so a
9th dungeon's art is a fast, mostly-mechanical addition. Dungeon
monsters carry `loot:null` always —
treasure comes from the dungeon's own guaranteed end-of-run payout, not
per-kill drops. Each boss reuses an existing mechanic (burn/freeze/
poison debuff, or a bolt-heavy kit, in varied combinations with
heal/buff) rather than inventing new ones, matching the "the Lucent
taught the Moles this" thread the Act 3 plan calls for — Ironloom's own
burn is an explicit, deliberate callback to Embercrypt's. Loads after
content.js/icons.js/art.js, before dungeon.js.

Touch this file when: adding/rebalancing one of these 8 dungeons, or
(a later, separate pass) adding the Hollow Vault finale.

## dungeon.js — Act 3's reusable REPEATABLE dungeon engine
Generalizes gauntlet.js's own "named sequence of guards + a finalBoss"
shape for dungeons that must stay repeatable FOREVER instead of
completing once — no `doneFlag`; `state.dungeonClears[id]` (core.js) is
a lifetime counter instead, bumped on every full clear, never a gate.
`DUNGEONS` (all 8 of the first 3 waves now — `embercrypt`/
`frostvault`/`stormreach` (wave 1), `verdanthollow`/`duskward`/
`ironloom` (wave 2), `echochapel`/`sunkenarchive` (wave 3)) —
`regulars`/`bosses` arrays,
`treasureTable`, `shardReward`, `biscuitCost`, `requiredFlag`, and 3
flavor-line functions (`enterLine`/`midRunLine(left)`/`clearLine`).
`allDungeonsCleared(ids)` — `ids.every(id => state.dungeonClears[id] >
0)` — is the actual gate behind quest18/quest19's own 'offer' state
(render.js/town.js): each later wave unlocks by having cleared the
PRIOR wave's dungeons themselves, not merely by completing the quest
before it, per explicit request.
`activeDungeonRun` (`{id, stage, resting}`) is transient — never saved,
same convention `gauntletProgress`/`combatSubView`/`evasionActive`
already use — reset by `abandonDungeonRun()`, called from the same two
spots `resetGauntlet()` already is (`travelTo()`/`checkDefeat()`, keyed
on leaving the `'prismdepths'` screen rather than a per-dungeon zone,
since every dungeon is entered from that one screen).

**Rest stop** (per the "10+ fights with a rest stop partway through"
request): each `DUNGEONS` entry's own `restStage` (a 0-based stage
index, same indexing `dungeonMonsterAtStage()` uses) and `restLine`
flavor string. `advanceDungeonRun()` pauses INSTEAD OF auto-chaining
into the next fight once `activeDungeonRun.stage === cfg.restStage` —
sets `resting: true`, calls `endCombat()` (same per-fight cleanup a
normal fight-end gets: `classBuffFightsLeft` ticks down once,
`evasionActive`/`playerStatusEffect` clear) WITHOUT nulling
`activeDungeonRun` itself, so the run genuinely pauses rather than
ending. `winCombat()`'s own `dungeonRunContinues` check is still true
at that point (there ARE more stages left), so it skips its own
`endCombat()`/victory-banner and just returns, same as any other
mid-run kill — this is the only other place a dungeon kill doesn't
immediately chain into `startCombat()`. `restInDungeon()` (player-
triggered, the Rest button — `recast-btn`'s sibling but its own
`dungeon-rest-box`/`restInDungeon()` pair, index.html/render.js) fully
restores HP/MP, clears `resting`, and starts the next stage's fight —
refuses outside that narrow window so a stray/double call can't
double-heal or desync the stage counter. `syncCombatUI()`/`render.js`
hides the Dungeon Board/Leave row and shows `dungeon-rest-box` instead
whenever `activeDungeonRun.resting` is true, the same single-screen-
takeover shape the Board itself already has over the normal Prism
Depths screen.

`enterDungeon(id)` starts stage 0 (refuses mid-combat/mid-run/off the
`'prismdepths'` screen/not enough Biscuits — `devMode`-guarded the same
way `goAdventuring()` already is). `advanceDungeonRun()` — called from
`winCombat()` (combat.js) on every dungeon-run kill — either starts the
next stage's fight (`startCombat()`, same function every other forced
fight already uses) or calls `grantDungeonTreasure(id)` and clears
`activeDungeonRun`. A multi-stage run auto-chains straight through
every regular+boss fight with NO button click between stages —
deliberately different from gauntlets' own "click again when ready"
UX, since a dungeon run is meant to play as one continuous push — with
exactly ONE deliberate exception, the rest stop above, which DOES need
a click (`restInDungeon()`) precisely because its whole point is
giving the player a moment to actually stop. Only the run's FINAL kill
shows the normal victory banner (see the "wasDungeonMonster &&
dungeonRunContinues" branch, combat.js, right next to
`wasBuildingTrialFight`'s own banner-skip logic).

Wave 1's `requiredFlag` is `'quest17Complete'` — quest17, "What Light
Remembers" (`acceptQuest17()`/`reportQuest17()`, town.js), Act 3's own
opener, offered at the Crystal City itself once `quest16Complete`.
Deliberately a formality, same shape as quest8's own "New Digs" (no
fetch objective, accept/report in one visit — the real content is the
dungeons themselves). Per explicit correction: this used to be
`'quest16Complete'` directly, so the Prism Depths existed only as a
bare, un-announced "Descend into the Prism Depths" button a player
would have to notice on their own — reportQuest17() is now what
actually reveals that button (`#prism-depths-entry-row`, render.js)
and unlocks `isDungeonUnlocked()`. Wave 2's `requiredFlag` is
`'quest18Complete'`, wave 3's is `'quest19Complete'` — quest18/quest19
(`acceptQuest18/19`/`reportQuest18/19`, town.js), each also offered at
the Crystal City, each gated on `allDungeonsCleared()` (above) for the
PRIOR wave rather than just that wave's own quest flag, per explicit
request ("gated by the other dungeons").

UI: the Dungeon Board (`renderDungeonBoard()`, render.js;
`#dungeon-board`, index.html) filters to `isDungeonUnlocked(id)` only —
necessary now that waves have different `requiredFlag`s sharing one
board: without the filter, every dungeon (wave 2/3 names included)
would list the moment ANY dungeon unlocks, each with a dead Enter
button that would just silently refuse. Lives on the `'prismdepths'`
screen, entered from a button on the Crystal City screen itself
(`enterPrismDepths()`/`leavePrismDepths()`, town.js) rather than being
its own `ZONE_ORDER` destination — same "a screen inside a zone"
relationship the Guild/Shop/Town Lot have to Gladstone Hollow.
`#dungeon-board`/`#prism-depths-row`/`#prism-depths-entry-row` all also
gate on `&& !state.inCombat` (`syncBuildingScreens()`, render.js, same
rule `explore-row`/`class-area-row`/`palace-row` already follow) — a
dungeon run is still just combat happening on the `'prismdepths'`
screen, so the Board/Leave button have to disappear for it the same
way they would for any other zone's own action row, instead of sitting
there stacked on top of the normal Attack/Use/Flee combat screen.
`#dungeon-progress-row` (`syncCombatHud()`, render.js, right next to
the monster HP bar it shares `#monster-card` with) is the mirror
image — only ever shown while `state.inCombat && activeDungeonRun`,
reading `activeDungeonRun.stage`/`dungeonStageCount(id)` as a
completed-stages/total percentage, same "how much is actually behind
you" reading the XP bar already uses.

Loads after prismdepths-content.js (reads its consts by value building
`DUNGEONS`) and before combat.js/render.js (whose functions this file
calls only inside function bodies, so — same note gauntlet.js's own
header makes — that ordering is for readability, not correctness).

Touch this file when: adding a new dungeon (just a new `DUNGEONS`
entry + its own content-file data, no engine changes needed, same
"registry generic, UI wiring per-screen" pattern gauntlets already
established), adding a new wave's own unlock quest, or changing how a
run advances/pays out.

## act2-shop.js — Act 2 Shop (Gnometropolis) gear + food ladder
`act2GearItemsTier1/2/3/4` and `act2FoodItemsTier1/2` — a structurally
separate ladder from content.js's own `shopGearItems`/`shopFoodItems`
tiers, restarting the tier LABEL at 1 (and the rarity COLOR at
`common`/black — NOT `legendary`/gold, which stays reserved for a rare
monster drop specifically, see the comment above these arrays) while
the actual bonus values/prices are well past Act 1's own Tier 4.
`getAvailableGnomeShopItems()` gates Tier 2/3/4 behind the Shop's own
Town Lot building level (`state.gnomeBuildingUpgrades.gnomeshop`,
`ACT2_SHOP_LEVEL_GEAR_TIER2/3/4`/`ACT2_SHOP_LEVEL_FOOD_TIER2`) — same
role `SHOP_LEVEL_GEAR_TIER2/3/4` (content.js) plays for Gladstone's own
Shop, just a separate progression track. Read by `renderGnomeShop()`
(render-shop.js) and `buyGnomeShopItemByName()` (economy.js).
`getAvailableGnomeShopItems()` runs its result through `filterByClass()`
(economy.js) same as Act 1's shop — every armor/weapon row here carries
`classRequired` (see content.js's own armor-classes paragraph above),
head/chest/legs/boots each tripled into one variant per class same as
Act 1's own tiers.

Touch this file when: adding/rebalancing an Act 2 Shop gear or food
item, or changing its own unlock-level gating.

## item-tiers.js — item rarity colors + gear requirements
`ITEM_TIER_COLORS` (the Diablo/WoW-style poor->legendary ramp, plus a
'quest' tier, all reusing styles.css's existing custom properties),
`getItemTier(item)`, and `itemNameHtml(item)` — wraps an item's name in
its tier color, used everywhere an item's name renders via innerHTML
(the Pack, Shop listings including Sell, equipped gear, Rare Finds).
Never used in log() messages (those are textContent, not innerHTML).
Also appends a `+N` for `item.temperLevel` when tempered
(`temperEquippedItem()`, player-actions.js) — every one of those same
call sites picks it up automatically.

Also `getGearRequirements(item)` and `gearRequirementText(item)` — an
equip item's level requirement is never stored on the item itself,
it's derived here every time it's needed (equipItem(), player-
actions.js; the Pack/Shop listings), so a requirement can never drift
out of sync with what the item actually grants. levelReq = 2x
`item.levelReqBase` when present, else 2x the item's own primary
(first-keyed) stat value. `levelReqBase` is a snapshot of a value the
item had BEFORE some later change could otherwise inflate the
requirement — set by `rollGearDropTier()` (combat.js, the zone's own
unrolled tier-1 value, so a lucky rarity roll's stat bump doesn't also
raise the gate) or by `temperEquippedItem()` (player-actions.js, the
pre-temper value, so tempering doesn't either). statReq/statKey are
kept in the returned shape but are always 0/null now — dropped as a
requirement entirely, callers that still check them just no-op.
Fully generic over whatever key `Object.keys(item.bonus)[0]` happens to
be — confirmed to need zero changes when `armor` (core.js) was added as
a 5th possible bonus stat, since it never special-cases the 4 original
stat names by string.

Also `GEAR_ARMOR_BY_TIER` and `ensureGearArmor(item)` — per explicit
request ("armor should be on every piece of gear"), EVERY equip item
guarantees an armor value, rather than being authored per-item or left
to chance as a possible random secondary stat (an earlier, since-
replaced version of this rolled armor as one of `rollShopGearStats()`'s
candidates, economy.js). `ensureGearArmor()` is called at every point
a gear item actually enters/re-enters the player's possession —
`rollShopGearStats()` (economy.js), `rollGearDropTier()` and
`winCombat()`'s guaranteed-loot push (combat.js), `startFreshGame()`'s
starter kit (boot.js), and `hydrateItem()` (save.js, so an OLDER save's
gear backfills armor retroactively too). Critically, it only ever sets
`bonus.armor` when that key is **missing** — never overwrites an
existing value — because `temperEquippedItem()` (player-actions.js)
multiplies every key already in `item.bonus` generically, armor
included; an unconditional overwrite would silently reset a tempered
item's boosted armor back to its un-tempered floor on every single
save/load round trip (a real bug, caught by test-temper-gear.js's own
round-trip check before this shipped). Appends armor AFTER an item's
existing bonus keys when it IS adding it, so `getGearRequirements()`
above never mistakes it for the primary stat.

**The armor VALUE itself** (armor-classes feature) is no longer flat
per rarity tier — `GEAR_ARMOR_BY_TIER` is now just the small BASE
component. `ensureGearArmor()` calls `getGearRequirements(item)`
*before* adding armor to `bonus` (so it still reads the real primary
stat), then does `tierBase + floor(levelReq * ARMOR_PER_LEVELREQ)` —
the dominant factor, same climbing curve every other stat already gets
off level requirement/zone depth — then multiplies by
`ARMOR_CLASS_WEIGHT[item.classRequired]` (content.js — Heavy/Medium/
Light per class, 1x for universal/un-classed items like starterGear).
`ARMOR_PER_LEVELREQ` is a small tunable constant right next to
`GEAR_ARMOR_BY_TIER`, same "one easy-to-retune knob" philosophy.

`gearRequirementText(item)` also now appends a class clause when
`item.classRequired` is set (`", Meathead (Heavy) only"`, reading
`ARMOR_WEIGHT_LABEL`, content.js) — surfaces exactly what `equipItem()`
(player-actions.js) actually gates on, so the Pack/Shop text never
promises something the Equip button doesn't enforce.

**Weapons never get armor at all**, per explicit correction — offense,
not protection. `ensureGearArmor()` short-circuits on `item.slot ===
'weapon'` before doing any of the above, and ALSO strips `bonus.armor`
off a weapon that already has one (the one retroactive cleanup an
older save's weapon needs, since every other equip item's armor is
additive-only/never-overwritten — see the "only sets when missing"
paragraph above — a weapon needed the opposite: always remove, since
nothing after this point should ever put it back). `hydrateItem()`
(save.js) runs this on every load, so an existing save's weapons clean
themselves up automatically; nothing in content.js/act2-shop.js ever
authored a literal `armor:N` on a weapon to begin with (it was always
derived), so no data file needed a matching change. The shop preview's
"guaranteed +N Armor" note (`renderShopItemRow()`, render-shop.js) is
skipped entirely for `slot==='weapon'` rows for the same reason.

Pure throughout: every function here only reads its `item` argument,
never `state` — comparing a requirement against the player's actual
level is left to each caller (equipItem(); the Pack/Shop listings' own
disabled-button checks).

Touch this file when: changing a rarity color, adding a new tier, or
changing how level requirements scale off an item's bonus.

## render.js — core screen sync
`render()` is now a short dispatch — it used to be one ~770-line
function doing 5 distinguishable jobs in sequence; split (see Refactor
history) into `computeRenderContext()` (PURE — every location flag,
every quest's own state string, every derived "can I act right now"
boolean, returned as one plain `ctx` object rather than 50 separate
shared locals) plus one function per job, each taking `ctx`:
`syncHeaderAndStats()` (no ctx needed — HP/MP/Pack/Biscuit/level/XP
bars), `syncZoneHeader(ctx)` (Pop Tabs counter, zone-title, the two
persistent ztag chips), `syncBuildingScreens(ctx)` (by far the largest
— which building's row/list/spell-trainer shows, the Trial dialog, and
every quest-box's own text; not further subdivided since its pieces
are already small and separated one-`if`-per-building),
`syncMapDrawer(ctx)` (zone-card locks, `zlevel`/`zcost` advisory text
against `ZONE_LEVEL_RECOMMENDATION`/`travelCostFor()`, the Act1/Act2
tab toggle), `syncCombatUI(ctx)` (combat-row/explore-row/
class-area-row/palace-row button visibility), `renderSceneArt(ctx)`
(the `isX ? artY() : ...` scene-art dispatch chain covering every
location in the game), and `syncCombatHud()` (no ctx needed — monster
name/HP bar/HP text). Also `log()`/`clearLog()`, the counting helpers
shared with other files (`countRakeTines`/`countPotionIngredientsHeld`/
`countVeinIngredientsHeld`), and `capitalize()`.

Touch this file when: a cross-screen sync rule changes (not a single
screen's own layout — see render-shop.js/render-character.js for
those). Adding a new location needs a matching flag in
`computeRenderContext()`'s return object AND a branch in whichever of
the sync functions above actually needs it — most new locations only
touch `syncBuildingScreens()`/`syncMapDrawer()`/`renderSceneArt()`.

## render-shop.js — spend/earn-Pop-Tabs screens
`renderInventory` (per explicit request, each Pack equip item's own
stat lines also diff against whatever's currently equipped in the SAME
slot — green `(+N)`/red `(-N)` per stat, comparing a missing stat on
the equipped piece against 0 rather than skipping it, and showing no
diff at all for a stat that ties exactly or when nothing's equipped in
that slot yet, since the plain number already is the full story then),
the Shop cluster (`shopTab`/`setShopTab`/
`renderShopItemRow`/`renderShop`), `renderBountyBoard`,
`renderCasinoWinningsBox` (the Casino's passive-income box), `renderHoodooShop`
(spell list + the stat-reset "Unravelling Draught" section),
`BUILDING_EFFECT_INFO`/`shopTierUnlockNames()`/`buildingEffectDesc()`,
and `renderTownLot`.

`renderInventory`'s Equip-button `meetsReq` check also now mirrors
`equipItem()`'s armor-classes gate (player-actions.js) —
`!item.classRequired || !state.classTitle || item.classRequired ===
state.classTitle` — so the button's disabled state never disagrees
with what a click actually does. `renderShopItemRow`/`renderShop` need
no equivalent change: the catalog handed to them is already pre-
filtered by class (`filterByClass()`, economy.js), so an off-class item
never appears as a row to begin with.

Touch this file when: the Pack, Shop, Bounty Board, Hoodoo Doctor's, or
Town Lot screen's layout or wording needs to change.

## render-character.js — progression screens
`renderSpellMenu`, `renderCharacterDrawer` + its sub-blocks
(`renderRareFindsBlock`/`renderBestiaryBlock`/`renderStatsBlock`/
`renderEquipmentBlock`), and `renderQuestLogDrawer`.
`renderBestiaryBlock()` — same "???"-until-unlocked collection-log
shape as `renderRareFindsBlock()` right above it, covering every
monster in the game (`monsters[]` + `NAMED_BOSSES`, content.js — 92
total) rather than just rare drops, grouped by zone
(`Object.keys(ZONE_DIFFICULTY)` order, `ZONE_LABELS` headers) since a
flat 92-entry list would be unreadable. Unlocked on DEFEAT
(`state.monstersSeen`, set in `winCombat()`, combat.js) specifically,
not merely encountering a monster — a zone header always shows even
with nothing found there yet. `renderStatsBlock()` iterates
`SPENDABLE_STAT_KEYS` (core.js), not `STAT_LABELS`, for the 4
spend-a-point rows — armor gets its own separate read-only row instead
(no base/bonus split, no button), shown only once `getEffectiveStats().armor`
is actually nonzero.

Touch this file when: the Character drawer or Quest Log's layout or
wording needs to change.

*(render.js/render-shop.js/render-character.js collectively: read-only
against `state`/content.js data, they never mutate game state.)*

## class-spells.js — class-exclusive spell trainers + castable spells
`renderClassSpellList(containerId, classTitle)` — shared by every class
trainer building, Act 1's (Guild/Casino/Hoodoo Doctor) and Act 2's
(Garrison/Rogues' Den/Arcane Sanctum) alike; filters `spells[]`
(content.js) by BOTH `classRequired` AND effective learn location
(`spell.learnLocation` override, or `CLASS_SPELL_LOCATION`'s default —
combat.js) so a class's Act 1 trainer never lists its Act 2 spell or
vice versa. `renderClassSkillUpgrade(containerId, classTitle)` — the
Train-a-tier UI for `state.classSkillLevel`. `CLASS_SKILL_INFO`'s 3
formatter functions each take the LEVEL itself (not a pre-looked-up
value) since Meathead/Hexpert each describe TWO numbers off the same
level now — their existing flat bonus plus a combat-variety proc
chance (`MEATHEAD_STAGGER_CHANCE`/`HEXPERT_ECHO_CHANCE`, content.js —
see the comment above those for the "only Card Shark's skill ever
produced a visible moment in a fight" reasoning). `renderCastableSpellsBlock()`
— the Character page's own list of every known non-damage spell (this
is a SEPARATE surface from the in-combat Use menu's own "Buffs &
Support" section, `renderSpellMenu()`, render-character.js — both call
the same `castSpell()`, and both also call `isSpellCurrentlyUsable()`,
render-character.js, so a known spell whose `classRequired` no longer
matches `state.classTitle` — reachable via the dev tools' class
override, not real play — is hidden instead of showing a Cast button
that always silently refuses). `renderSpellUpgradeBlock(containerId,
classTitle)` — the "Deepen Your Spells" shop, now open to all 3
classes at their own Act 2 district (same `classTitle` parameter
pattern `renderClassSpellList()`/`renderClassSkillUpgrade()` above
use), listing EVERY spell in `state.spellsKnown` (not filtered by
`learnLocation`, since the point is upgrading a spell no matter where
it was learned) with a buy button for the NEXT level
(`upgradeSpell(id)`, combat.js, `spellUpgradeCost(spell, level+1)`,
content.js) that becomes a disabled "Fully upgraded" label once Level
`SPELL_UPGRADE_MAX_LEVEL` is reached (`spellUpgradeLevel(id)`,
combat.js).

Touch this file when: changing how a class spell trainer, the
class-skill upgrade block, or the spell-upgrade block is displayed.

## dev-tools.js — `isDevAccount()`-gated cheats
`DEV_USERNAMES`/`isDevAccount()`, `resetLevelDev`/`resetQuestsDev`
(reset every quest flag back to never-started — quest7 through quest15
were silently missing from this entirely until this session, despite
its own doc comment already claiming full coverage; fixed alongside
adding quest13-15, extended again for quest16 and then quest17/18/19, and now also calls
`resetAllGauntlets()`, gauntlet.js)/`resetToNewGameDev` (the "Full
Reset (New Game)" button — wipes to `createDefaultState()` then
replays `startFreshGame()`), the direct state setters (Biscuits/Pop
Tabs/level/stats/items/etc.), `applyStatusEffectDev`/
`DEV_STATUS_EFFECTS` (apply burn/poison/freeze directly —
`state.playerStatusEffect`, core.js — without needing to actually get
hit by one of the handful of bosses that inflict it), and
`QUEST_DEV_STAGES`/`setQuestStageDev` (quest8 through quest16 were also
entirely missing until this session — every Act 2 quest was reachable
only by actually playing through it, with zero dev shortcut; quest16's
own stages push/strip its 3 gathered-3-different-ways items directly
so the Pack stays in sync with whatever stage is jumped to; quest17/18/19's
own 3 stages each are the simple no-fetch "formality" shape, same as
quest8's — quest18/19's own 'Accepted'/'Complete' stages also stamp
`state.dungeonClears` for the prior wave directly, since their real
unlock condition (`allDungeonsCleared()`, dungeon.js) needs those
clears to be reachable without grinding real dungeon runs first in
dev mode). Never
touched by normal gameplay work otherwise — the cleanest single-concern
file in the project.

Touch this file when: adding a dev/cheat tool, and hook it into
`renderAccountTab()` (auth.js). Adding a new quest should also mean
adding its own `QUEST_DEV_STAGES` entry AND extending `resetQuestsDev()`
here — both are easy to forget, and both silently rot the moment a new
quest ships without them.

## auth.js — sign-in/out, the gate, the Account drawer body
`authSetView`/`renderAuthUI`/`renderAuthForms`/`acctMsg`/`showGate`/
`closeGate`/`renderGate`/`playAsGuest`/`enterGameAfterAuth` (calls
`checkChangelogOnLogin()`, changelog.js, in its `loaded===true` branch
only, but calls `checkDailyStreakOnLogin()`/`maybeShowDailyStreakPopup()`
(dailystreak.js) in BOTH branches — a brand-new character's first
session still starts the login streak at Day 1, unlike the changelog,
which has nothing to catch up on yet. Neither ever reaches a guest,
since `playAsGuest()` calls `startFreshGame()` directly rather than
through this function),
`doRegister`/`doLogin`/`doForgotPassword`/`doLogout`, and
`renderAccountTab()` (calls into dev-tools.js; also renders the "🗞
What's New" button, `openChangelog()`, changelog.js).

Touch this file when: changing the login/register/guest flow, or the
Account drawer's non-dev-tool content.

## save.js — the state<->save round-trip
`allItemDefs`/`itemByName`/`serializeItem`/`hydrateItem`,
`serializeState()`/`hydrateState()` (round-trips `state.spellUpgradeLevel`
alongside `state.spellsKnown` — dropping any id that no longer matches a
real `spells[]` entry, same as `spellsKnown`'s own filter.
`hydrateState()` ALSO migrates a save from before the 5-level ladder
existed: an old-shape `spellsUpgraded` array gets each id mapped to
Level 1 in the new object, not Level 5 or 0 — see its own comment for
why), `saveGame`/`loadGame`/
`manualSaveGame`/`manualLoadGame`/`autosave()` (debounced).

Touch this file when: changing what gets saved/loaded — and remember
the non-negotiable rule: a new `state` field needs a matching line in
BOTH `serializeState()` and `hydrateState()` in the same change, or it
silently resets on the next reload.

## player-actions.js — drawers, equip/use-item, stat points
`DRAWER_IDS`/`toggleDrawer`/`openDrawer`/`closeAllDrawers`, `useItem`/
`equipItem` (refuses below the item's own level/stat requirement —
`getGearRequirements()`, item-tiers.js — or when `item.classRequired`
doesn't match `state.classTitle` (armor-classes feature — a no-op
whenever `state.classTitle` is still null, pre-Trial, so a new
character isn't locked out of everything before picking a class; only
ever blocks a NEW equip, never touches already-equipped mismatched
gear, which is grandfathered in on purpose) — with a log message
rather than a silent no-op)/`unequipItem`, `getEffectiveStats`/`recomputeMaxStats`/
`spendStatPoint` (guards on `SPENDABLE_STAT_KEYS.includes(stat)`, core.js
— not `STAT_LABELS[stat]`, so `armor` can never be spent as a stat
point even though it's labeled for display purposes elsewhere),
`temperEquippedItem(slot)` — Bounty Tokens' first
real sink (per explicit direction; `TEMPER_BASE_COST`/
`TEMPER_STAT_MULTIPLIER`/`TEMPER_MAX_LEVEL`/`temperCost(level)`,
content.js), permanently multiplying every stat an equipped item
grants by `TEMPER_STAT_MULTIPLIER` (+50%, compounding on the
already-tempered value each time, rounded UP so even a bare +1 stat
keeps climbing), capped at `TEMPER_MAX_LEVEL` (+5) per item. Only
usable while `state.location==='tinker'` (per explicit correction — a
tinkerer's workbench, not a Character-page menu); its UI
(`renderTinkerTemperBlock()`) lives in render-character.js rather than
town.js, alongside `renderEquipmentBlock()`'s own near-identical item
rows. `item.temperLevel` lives on the item instance itself (not a
separate `state` field), so it round-trips through save.js's
already-generic `serializeItem`/`hydrateItem` for free — no
save-format change, nothing to lose. Snapshots `item.levelReqBase`
(same field `rollGearDropTier()`, combat.js, uses) the first time an
item is ever tempered, so repeated tempering never raises its level
requirement. Equipped-only by choice, not necessity — gear no longer
groups/stacks in the Pack at all (`groupInventoryByName()`,
render-shop.js), so a Pack item would be just as safe to temper; the
Tinker's Workshop's own workflow just never needed that yet.

Also `buyDriveShaft()` — quest16's own "buy a part with currency" leg,
alongside tempering at the Tinker's Workshop for the same "this is
where things get built" reasoning, rather than a dedicated new
building for one purchase. Its UI (`renderDriveShaftBlock()`) lives in
render-character.js next to `renderTinkerTemperBlock()`.

Touch this file when: changing equip/use-item/stat-point/temper logic.

## tutorial.js — onboarding overlay
`TUTORIAL_STEPS`, `openTutorial`/`closeTutorial`/`tutorialSkip`/
`tutorialBack`/`tutorialNext`/`renderTutorial`. Edited in total isolation
from everything else.

## changelog.js — login changelog overlay
`CHANGELOG` (newest-first array of `{id, date, title, items}`) and
`CHANGELOG_LATEST_ID` (its first entry's own id) — pure data, same
"new concern, new file" convention as tutorial.js, whose overlay
mechanics (`#tutorial-screen`'s open/close/render shape) this mirrors
exactly for its own `#changelog-screen`. `checkChangelogOnLogin()` is
the one real piece of logic: compares `state.lastSeenChangelogVersion`
(core.js/save.js) against `CHANGELOG_LATEST_ID` and opens the overlay
with only the unseen entries if any exist — called once from
`enterGameAfterAuth(loaded===true)` (auth.js), never for a brand-new
character or a guest (see that call site's own comment for why: there's
nothing either of them could have missed). `openChangelog()`/
`closeChangelog()`/`renderChangelog()` — `closeChangelog()` is what
actually advances the saved marker (and autosaves); a manual reopen via
the Account tab's "🗞 What's New" button (`renderAccountTab()`, auth.js)
always shows the FULL list regardless of what's already been seen,
mirroring `openTutorial()`'s own "always restarts at step 1" behavior.
`null` (a save from before this field existed, or a genuinely new
character) is treated as "show everything once," not "already caught
up" — see `state.lastSeenChangelogVersion`'s own comment, core.js.
`closeChangelog()` also resets `changelogEntriesShown = []` (a real bug
fix, found while adding dailystreak.js below — without this, a partial
login-triggered catch-up left a stale subset behind that a LATER manual
"What's New" reopen would keep re-showing forever instead of the full
history its own doc comment above promises) and, since the two overlays
would otherwise render stacked on top of each other, calls
`maybeShowDailyStreakPopup()` (dailystreak.js) to reveal that popup if
one was deferred waiting for this one to close.

Touch this file when: writing a new changelog entry after a
player-facing change ships, or changing the overlay's own mechanics.

## dailystreak.js — daily login streak
`DAILY_STREAK_REWARDS` — a 7-entry table (Pop Tabs + Biscuits, day 7
also throwing in Bounty Tokens as a weekly milestone) — pure data, same
"new concern, new file" convention as changelog.js/tutorial.js, whose
overlay shape (`#changelog-screen`'s open/close/render pattern) this
mirrors for its own `#daily-streak-screen`. Built per explicit direction
to give players a reason to come back tomorrow that isn't just "Biscuits
finished refilling" — the only other real-time pacing mechanic in the
whole game. `checkDailyStreakOnLogin()` is the one real piece of logic:
compares today's `toDateString()` against `state.lastLoginRewardDateKey`
(core.js/save.js, a "compare calendar days, not exact timestamps"
convention) to grant at most once per real day, with
a ONE-DAY GRACE — missing exactly one day still continues
`state.dailyStreakCount`, missing two or more resets it to 1 — per
explicit direction over a stricter "any missed day resets it" model.
`state.dailyStreakCount` climbs indefinitely (so "Day 12!" can be shown)
even though the actual reward tier cycles back through
`DAILY_STREAK_REWARDS`' own 7 entries every week via a modulo. Called
from BOTH branches of `enterGameAfterAuth()` (auth.js) — see that
function's own comment for why, unlike the changelog, this also fires
for a brand-new character's first-ever session.
`pendingDailyStreakReward`/`maybeShowDailyStreakPopup()`/
`openDailyStreakPopup()`/`closeDailyStreakPopup()`/
`renderDailyStreakPopup()` — the reward is granted immediately regardless
of whether its popup can show right away; `maybeShowDailyStreakPopup()`
defers to let the "What's New" changelog overlay show first if
`checkChangelogOnLogin()` (changelog.js) also just opened it this same
login, since both are full-screen overlays that would otherwise stack —
`closeChangelog()`'s own call to this same function is what reveals the
deferred popup once the player dismisses that one.

Touch this file when: changing the daily login streak's own reward
table, grace-period rule, or overlay mechanics.

## hubs.js — town hub registry
`HUB_TOWNS` — one entry per persistent hub (`town`/`gnometropolis`/
`mudrootwarren`), keyed by its own `state.location` value, mapped to
every OTHER location reached only from inside that hub's square: both
its explorable districts AND its plain building interiors (so opening
the Map from inside, say, the Shop still correctly resolves to
Gladstone Hollow's own position for travel-cost purposes, not some
unrelated place with no position on the chain at all — see
`chainIndex()`, town.js). `TOWN_HUB_KEYS` — which of those are proper
TOWN hubs (a real home base with a Shop/Guild/rest option) as opposed
to an "adventure hub" like `mudrootwarren` (hub-shaped for district/
free-roam purposes, but no Shop/Guild/rest tile of its own) — read by
`travelCostFor()`'s (town.js) free-hub-to-hub-travel rule, which only
applies town-hub-to-town-hub. `hubKeyForLocation(loc)`/`isHubArea(loc)`.

Touch this file when: adding a new hub town, or changing which
locations belong to which hub.

## combat.js — exploration + combat
`ADVENTURE_ZONES` (`CLASS_AREA_ZONES` — garrison/roguesden/sanctum —
drop out of it entirely once `state.quest7Complete`, converting into
pure class-trainer buildings; see gnometropolis.js)/`goAdventuring()`
(one `*Hunt` const per rare-hunt quest target — `commanderHunt`/
`diggerBotHunt`/`vaultCaptainHunt`/`garrisonHunt`/`roguesdenHunt`/
`sanctumHunt`/`tunnelWardenHunt`/`warrenScoutHunt`/
`tunnelMoleInformantHunt`/`seniorClerkHunt`/`gearworksForemanHunt`/
`bureauQuartermasterHunt` — each a simple "quest accepted, not
complete, not already found" boolean checked against a per-target
spawn chance; checked AFTER all of these and before the normal
encounter roll: one generic `ZONE_RARE_MONSTERS[state.location]`
lookup, `ZONE_RARE_SPAWN_CHANCE` — content.js's own always-available,
repeatable per-zone rare, not quest-gated, so it's one shared check
instead of 15 more copies of the `*Hunt` shape), `startCombat` (derives a template's real hp/atkMin/
atkMax/dodgeChance/armor from its `beef`/`zip`/`grit` stat block via
`deriveMonsterCombatStats()` right before applying `ZONE_DIFFICULTY` —
dodgeChance/armor both pass through unscaled, same treatment
`dodgeChance` always got; `hoodoo` passes through on the `{...template}`
spread untouched by any of this, read later directly off `state.monster`
by `hoodooResistance()`)/`deriveMonsterCombatStats(m)` (the
monster-stat-block formula shapes, mirroring the player's own
maxHp/dodge formulas — no "level" term, since monsters don't level;
`armor` is read straight off the template now, a real authored field in
`monster-stats.js`, no longer derived from `grit`; `dodgeChance` itself
is derived via `zipDodgeAndAccuracy(m.zip)`, the same shared zip formula
`playerDodgeChance()` below uses for the player's own base
dodge)/`zipDodgeAndAccuracy(zip)` (zip's ONE formula, used for dodge
AND accuracy, on both sides — see `ZIP_DODGE_COEFFICIENT`/
`ZIP_DODGE_CAP`'s own comment, content.js)/`armorDamageReduction(armor)`
(shared by both damage functions
below — reuses `statBonus()`'s own curve, capped at
`ARMOR_REDUCTION_CAP`, content.js)/`hoodooResistance(hoodoo)` (same
capped `statBonus()` shape, lower cap — `HOODOO_RESIST_CAP`, content.js
— only ever read for a MONSTER's own hoodoo, only applied against
non-magic damage, see its own comment)/`applyDamageToPlayer`/
`applyDamageToMonster` (both mitigate via `armorDamageReduction()`
before anything else — shield absorption for the player, the dodge
roll for a monster already happened/happens first — floored at 1 UNLESS
the raw incoming damage was already `<=0`, in which case it stays 0
rather than manufacturing a hit out of nothing; `applyDamageToMonster`
ALSO takes `hoodooResistance()` into account, but only when its own
`isMagic` argument is false — a spell ignores it entirely; both return
the actual post-mitigation amount, and every caller logs THAT, not its own
pre-mitigation local variable. `applyDamageToMonster` ALSO subtracts
the player's own `zipDodgeAndAccuracy()`-derived accuracy from the
monster's `dodgeChance` before rolling it — per explicit request, the
player's zip is accuracy as well as dodge, canceling out some of
whatever a zippy monster's own dodge chance is, floored at
0)/`monsterRetaliate`/`monsterAutoAttack`/
`tickMonsterBuff`/`useMonsterSkill` (dispatches a monster's own
`skills[]` entry by `type` — `'heal'`/`'buff'`/`'bolt'`/`'debuff'`, the
last of which sets `state.playerStatusEffect` instead of attacking that
turn)/`CLASS_ATTACK_STAT` (which stat drives `playerAttack()`'s own base
damage roll, per class — `{'Meathead':'beef', 'Card Shark':'zip',
'Hexpert':'hoodoo'}`, falling back to `'beef'` for no class, matching
the ORIGINAL unconditional behavior this replaced. Per a live audit
("I am doing wayyy too much damage"): `playerAttack()` had always used
`eff.beef` no matter the class, a leftover from before Card Shark/
Hexpert existed. Meathead's fine because Beef IS its own primary stat
— but Card Shark's basic Attack was scaling off a stat it barely
invests in (Zip only ever drove dodge/sneak-attack/double-attack,
never damage), leaving it needing ~13 hits to kill a Crystal City
monster where Meathead needed ~1 at the same level/gear. Read in BOTH
of `playerAttack()`'s own damage rolls — the primary swing and Card
Shark's own bonus second swing further down, which used to
independently hardcode `eff.beef` a second time)/
`applyPlayerStatusEffectForTurn` (plays out one turn of a boss's
`'debuff'` — burn/poison deal their own damage to the player
immediately, freeze instead hands back a `dmgMult` for the caller to
apply to whatever it's about to deal that turn; called at the start of
every player action that costs a turn — `playerAttack`/a damage
spell/`useItemInCombat` — so it ticks down on "a set number of
attacks" regardless of hit/miss/item use)/`playerAttack` (also rolls
Meathead's class-skill proc here — `MEATHEAD_STAGGER_CHANCE`,
content.js — a flat per-level chance, on a LANDED non-dodged hit, to
deny the monster's own retaliation this turn; reuses the exact
`if(!sneakAttackLands...)` mechanism the opening sneak attack already
uses to do that, just as a second independent condition, not a new
system; Card Shark's own double-attack proc,
`CARD_SHARK_DOUBLE_ATTACK_CHANCE`, lives right after it in the same
function, unchanged in shape — both share this file's "the only class
skill with a visible effect" origin story, now joined by Hexpert's
Arcane Echo in `castSpell()`'s `'damage'` branch below)/
`openSpellMenu`/`closeSpellMenu`/`useItemInCombat`/`castSpell` (every
spell type costs the one turn while `state.inCombat` — a shared
`applyPlayerStatusEffectForTurn()` tick up top plus one shared
`monsterRetaliate()` call at the bottom, after the type-specific
`if/else if` chain, skipped only by the `'damage'` branch's own early
`return` on a kill. Per explicit correction — heal/ward/buff/shout used
to be free actions with no retaliation at all, which let a player
chain-cast something like Stubborn Recovery for unlimited healing in a
single turn; outside combat, cast from the Character page, there's no
turn to cost at all, so this is skipped entirely and it's still a
genuinely free action there. Its
`'damage'` branch also rolls Hexpert's own class-skill proc —
`HEXPERT_ECHO_CHANCE`/`HEXPERT_ECHO_DAMAGE_MULT`, content.js — a chance
to immediately echo-cast the same spell again at half power, zero
extra MP, resolving before the turn's one `monsterRetaliate()` call,
same ordering Card Shark's bonus swing uses in `playerAttack()`. Its
`'evade'` branch sets `state.evasionActive` to the
CAST SPELL'S OWN ID, not a boolean — Card Shark's Smoke Screen and
Hexpert's Illusion, content.js, are two different spells sharing this
one flag, so it has to be an id to know which spell's flavor text/
upgrade-level bonus actually applies; `playerDodgeChance()`
reads it, `evasionFlavorNoun()` turns it into "the smoke"/"the
illusion" for log lines, `spellUpgradeMultiplier(id)` checks
`state.spellUpgradeLevel[id]`)/`recastLastSpell` (the Hexpert-exclusive Recast
button, `recast-btn`/index.html — per explicit request, lets a Hexpert
repeat `state.lastSpellCast` (core.js — whichever spell id `castSpell()`
most recently set, recorded AFTER all its own guards pass) without
reopening the Use menu every turn; just re-calls `castSpell(state.
lastSpellCast)`, so it inherits every one of that function's guards for
free rather than duplicating them. `recast-btn`'s own visibility/label/
disabled state is computed in `syncCombatUI()` (render.js) — hidden
unless `state.classTitle==='Hexpert'` AND something's actually
remembered, disabled (not hidden) once MP drops below that spell's own
`mpCost` so the button doesn't flicker in and out turn to turn)/
`CLASS_SPELL_LOCATION`/`CLASS_SPELL_TRAINER`/`learnSpell` (a spell's
own `learnLocation` — content.js's `spells[]` — overrides
`CLASS_SPELL_LOCATION`'s default, letting the same class have spells
taught in two different buildings, its Act 1 trainer and its Act 2
one — Hexpert is the first class with TWO Act 2 spells, Arcane Lance
AND Illusion, both taught at the Sanctum)/`playerFlee`/`rollGearDropTier` (scales a monster's authored
tier-1 gearDrop up 0-2 tiers, `GEAR_DROP_TIER_CHANCE`)/`winCombat`
(rolls lootRoll/rareRoll/gearRoll independently on every kill — see
the comment above monsters[], content.js, for what each one is; also
records the Bestiary discovery — `state.monstersSeen`, matched by the
defeated monster's own name against `NAMED_BOSSES`/`monsters[]` — and
its one-time full-completion bonus, mirroring `rareDropsSeen`'s own
shape; the completion-bonus check/log specifically happens AFTER this
function's own `clearLog()` call, not at the top where the discovery
itself is recorded, for the same "a log() before clearLog() just gets
wiped" reason the rareDropsSeen bonus log already has to)/
`endCombat` (also clears `state.playerStatusEffect` — scoped to a
single fight, same as `state.evasionActive`)/`upgradeSpell(id)`
(bought one level at a time, up to `SPELL_UPGRADE_MAX_LEVEL`, at that
class's own Act 2 district — `CLASS_UPGRADE_LOCATION`/
`spellUpgradeCost(spell, targetLevel)`, content.js — for an already-known
spell; writes `state.spellUpgradeLevel[id]`)/`DEFEAT_WAKE_UP_LOCATION`
(keyed by `state.homeTown` — the place name AND rest-building a
defeat's own wake-up line mentions, kept in sync with wherever
`checkDefeat()` actually teleports the player)/`checkDefeat`/
`checkLevelUp`.

`state.playerStatusEffect` itself (`null`, or `{type:'burn'|'poison'|
'freeze', turnsLeft, dmgPerTurn, dmgReduction}`) lives on `state`
(core.js) but is deliberately NOT part of `serializeState()`/
`hydrateState()` (save.js) — same reasoning as `state.evasionActive`
not being saved either: it only ever matters mid-fight, and a reload
never resumes mid-fight. Only one slot — a fresh `'debuff'` skill use
always overwrites, never stacks.

Touch this file when: changing combat math, encounter rolls, a spell's
learn/cast mechanics, or a boss's own debuff (burn/freeze/poison).

## town.js — per-building nav/quests + Town Lot economy
`ZONE_ORDER`-based travel (`chainIndex(loc)` — where a location sits on
the Map's main chain, districts/buildings collapsing to their own
hub's position; `travelCostFor(dest)` — priced by DISTANCE from the
player's CURRENT position, except three flat-free cases: heading to
'town' is always free regardless of origin, town-hub-to-town-hub travel
is free (`TOWN_HUB_KEYS`, hubs.js — does NOT extend to the
`mudrootwarren` adventure hub, which is always distance-priced even
hub-to-hub), and entering/leaving one of a hub's own districts is
free), `isTravelHub`/`forceHomeIfBroke`/`travelTo`/`restAtInn`,
enter/leave pairs and quest accept/report for the Gaffer House, Shop,
Hoodoo Doctor's (incl. `brewPotion`/`brewStatResetPotion`), and
Tinker's Workshop, plus `giveRakeTines`/`turnInVein`, and the Town Lot
economy (`buyTownLot`/`upgradeTownLot`/`upgradeBuilding`). Also
quest17/18/19 (`acceptQuest17/18/19`/`reportQuest17/18/19`) and
`enterPrismDepths`/`leavePrismDepths` — the Crystal City doesn't get
its own file (still
a stub leaf zone, crystalcity-content.js holds only its monster data),
so everything quest/door-related for it lives here, same as every
other `travelTo()`-reached location. The
Tinker's Workshop is also where gear tempering happens now
(`temperEquippedItem()`, player-actions.js — gated on
`state.location==='tinker'`), even though `enterTinker`/`leaveTinker`
themselves don't need to know anything about it.
`travelTo` also refuses outright while `state.blackjack.phase` is
`'playerTurn'` or `state.hilo.phase` is `'guessing'` (casino.js/hilo.js)
— the Map drawer is reachable from the tab bar regardless of the
current screen's own action-bar, so without this a player could walk
away from a live bet through the Map instead of Attack/Use/Flee-style
combat actions, which `state.inCombat` already blocks the same way.
Successfully leaving 'casino'/'roguesden' any other way (merely seated
between hands) also clears `state.blackjack`/`state.hilo` so a later
trip back doesn't resume sitting at the table.

Touch this file when: changing a quest's logic (except quest2/quest6/
the class Trial — see guild.js), travel/unlock/cost rules, or a
building's upgrade gating.

## casino.js — Casino: Blackjack
`enterCasino`/`leaveCasino` (the lobby — House's Cut/Card Shark
trainer/Trial fight/a "Play Blackjack" button), `enterBlackjackTable`/
`leaveBlackjackTable` (sitting down/getting up — the ONLY door into
Blackjack's own screen, which per explicit request mirrors
`state.inCombat`'s own "no other clutter" screen: the lobby's spell
trainer/House's Cut/Trial button all hide the instant `state.blackjack`
is set, in every phase, not just mid-hand), Blackjack itself
(`dealBlackjack(bet)`/`blackjackHit`/`blackjackStand`/`resolveBlackjack`
— the one funnel every hand ends through, win/lose/push/dealer-natural
alike — plus its own `renderBlackjackTable()`, this file's render
function same as auth.js/class-spells.js/noticeboard.js/tutorial.js
each own theirs), `claimCasinoWinnings` (the separate passive-income
claim — `regenCasinoWinnings()`/`casinoWinningsCap()` live in
economy.js). Replaced the old flat coin-flip (`gambleCasino`, Bet
5/10/25 for a CASINO_WIN_CHANCE-ish shot at 2x) per explicit
direction — a real card game instead of straight betting.
`state.blackjack` is null in the lobby, set the moment the player sits
down and cleared on standing up; while set it's `{ bet, playerHand,
dealerHand, phase, resultText }`, `phase` climbing
betting -> playerTurn -> resolved (Deal buttons return between hands
without leaving the table) — not saved (save.js), same reasoning as
`state.inCombat`/`state.monster`. Deck/payout/flavor-line constants
(`CARD_RANKS`/`CARD_SUITS`/`BLACKJACK_WIN_PAYOUT`/
`BLACKJACK_NATURAL_PAYOUT`/`BLACKJACK_DEALER_STAND`/the
`blackjack*Lines` arrays) live in content.js, same split every other
content table uses. `CASINO_WIN_BONUS` (content.js) is now a payout
multiplier on a win, not a win-CHANCE bonus — Blackjack's own rules
supply the house's edge. `dealBlackjack(bet)`'s 3 preset amounts (Bet
5/10/25) sit alongside `dealBlackjackCustom()`, which reads
`#blackjack-bet-input` (index.html, a `.wager-row`, styles.css) instead
— per explicit request, so a player isn't capped at the 3 presets.
Split out of guild.js — this concern was fully self-contained there
(zero calls into Guild/Bounty Board/Trial code), so it was the
cleanest extraction once guild.js's own bundled-systems problem got
addressed. Loads right before class-trial.js/guild.js; no particular
load-order requirement beyond that (nothing here is read by value at
parse time), kept adjacent purely for readability.

Touch this file when: changing Casino betting odds/payout logic.

## hilo.js — Rogues' Den: Hi-Lo
The second, simpler casino minigame — per explicit direction ("what
other casino game is easy to develop"), lives at the Rogues' Den
(Card Shark's Act 2 building) rather than the Casino. `enterHiLoTable`/
`leaveHiLoTable` (sitting down/getting up — same "own uncluttered
screen" shape `enterBlackjackTable`/`leaveBlackjackTable` use: the
Rogues' Den's own spell trainer/class-skill block/"Return to Map"/
"Play Hi-Lo" button all hide the instant `state.hilo` is set), Hi-Lo
itself (`playHiLo(bet)`/`playHiLoCustom()` (reads `#hilo-bet-input`,
same `.wager-row` shape as Blackjack's own custom bet)/`hiloGuess`
('higher'/'lower')/`hiloCashOut`), plus its own `renderHiLoTable()`.
Reuses `CARD_RANKS`/`CARD_SUITS`/`drawCard()`/`cardChipHtml()`
(content.js/casino.js) rather than a second deck — `hiloRankIndex()`
just reads a card's own index into `CARD_RANKS` as its rank (that
array is already written Ace-low-to-King-high). `state.hilo` is null
in the Rogues' Den's normal view, otherwise `{ bet, currentCard,
streak, phase, resultText }`, `phase` climbing
betting -> guessing -> resolved — not saved (save.js), same reasoning
as `state.blackjack`/`state.inCombat`. `HILO_STREAK_PAYOUT`/the
`hilo*Lines` arrays live in content.js, same split as Blackjack's own
constants; see the comment above `HILO_STREAK_PAYOUT` for the full
ruleset (streak-based, cash-out-or-press-your-luck, ties silently
redraw rather than counting as a result). No `CASINO_WIN_BONUS`-style
building-upgrade bonus — that constant is Casino-building-scoped, and
there's no equivalent Rogues' Den upgrade to hang a second one off of.

Touch this file when: changing Hi-Lo's odds/payout logic.

## class-trial.js — Level-10 capstone: "The Adventurer's Trial"
`acceptClassQuest`/`startClassTrialGuild`/`startClassTrialCasino`/
`startClassTrialHoodoo`/`claimClassPath(chosenStat)`/
`levelUpClassSkill`. Split out of guild.js for the same reason as
casino.js — fully self-contained there. Three independent trainers
(Guild/Meathead, Casino/Card Shark, Hoodoo/Hexpert) each administer
their own themed boss fight (`trialChampion`/`casinoChampion`/
`hoodooChampion`, content.js — see the comment above `trialChampion`
there for why each uses a different combat gimmick); only after all
three pass (`classTrialGuildPassed`/`classTrialCasinoPassed`/
`classTrialHoodooPassed`, core.js) does `claimClassPath` let the player
choose Meathead/Card Shark/Hexpert and hand out a permanent title plus
a small +2 stat bonus (`CLASS_TITLES`, content.js).

Touch this file when: changing the class-Trial/skill-upgrade system.

## guild.js — Guild (Act 1 + Act 2), Bounty Board, Palace gauntlet
Casino and the class-capstone Trial used to live in this file too (see
casino.js/class-trial.js above) — both were fully self-contained, so
they were split out, leaving this file as its own single coherent
concern: the Guild building itself plus the Bounty Board plus the
Palace gauntlet, which only ever gets approached via quest 7's own
flow.
- **Guild (Act 1)**: `enterGuild`/`leaveGuild`, quest2
  (`acceptQuest2`/`reportCommanderKill`), quest6
  (`acceptQuest6`/`reportGnomeKingKill`), quest7's Guild-side half
  (`acceptQuest7`/`reportGnomeKingDefeat`/`approachPalaceGate` — the
  Gnometropolis-side half, the district guardian fights, lives in
  gnometropolis.js instead), `resetPalaceGauntlet`.
- **Guild (Act 2, Gnometropolis)**: `enterGnomeGuild`/`leaveGnomeGuild`,
  quest8 "New Digs" (`acceptQuest8`/`reportQuest8` — a formality quest,
  no combat objective), quest9 "What the Throne Room Opened"
  (`acceptQuest9`/`reportQuest9` — Act 2's first MULTI-stage quest,
  spanning Root Cellar then Mudflats, deliberately marker-free text
  throughout; see `quest9State`, render.js, and
  `tunnelWardenHunt`/`warrenScoutHunt`, combat.js, for the actual
  encounters), and quest10 "Whatever's Listening"
  (`acceptQuest10`/`reportQuest10` — Act 2's first quest with a real
  downstream CONSEQUENCE: two rare hunts run in PARALLEL rather than in
  sequence, and whichever is found first sets `state.quest10Path`,
  which decides which of the Warren's Ear's two districts opens first
  — see `quest10State`, render.js, and
  `tunnelMoleInformantHunt`/`seniorClerkHunt`, combat.js), and quest11
  "Loose Ends" (`acceptQuest11`/`reportQuest11` — closes the one thing
  quest10 left open on purpose: whichever of the two rare hunts wasn't
  found first. Requires BOTH `tunnelMoleInformantDefeated` AND
  `seniorClerkDefeated` to report, regardless of which one set
  `quest10Path` — no new rare hunt of its own, both already keep
  spawning after quest10Complete. `quest11RemainingDistrict()`
  (render.js) names whichever of Root Cellar/the Bureau still needs
  clearing, in the Guild's own quest box AND the Quest Log entry —
  deliberately more concrete than quest9/quest10's own zone-name-free
  dialogue, since a progress readout is UI, not narrative flavor; the
  guildmaster's own spoken lines (guild.js) stay just as vague as
  before. Completing it unlocks the Ember
  Warren via Mudroot Warren's own rockpile tile, mudroot-art.js), and
  quest12 "Chain of Custody" (`acceptQuest12`/`reportQuest12` — a
  sequential two-stage hunt like quest9's own, but the twist is where
  stage 2 happens: not a new zone, but back in the Bureau, a district
  the player already cleared for quest9/10. Stage 1
  (`gearworksForemanHunt`, combat.js) gates stage 2
  (`bureauQuartermasterHunt`) exactly like `tunnelWardenHunt` gates
  `warrenScoutHunt`. Also this game's first quest built specifically to
  introduce the boss-debuff mechanic — see `state.playerStatusEffect`'s
  own comment, combat.js — the foreman inflicts burn, the quartermaster
  poison, each with its own flavor tying back to its own district's
  theme rather than reusing text), quest13 "Quenched"
  (`acceptQuest13`/`reportQuest13` — simpler in STRUCTURE than quest12
  (one rare hunt, no second stage) but harder in every stat; introduces
  this game's first `'freeze'` debuff via `quenchMaster`, Foundry),
  quest14 "What the Vault Was Guarding" (`acceptQuest14`/`reportQuest14`
  — the arc's first GAUNTLET, per explicit request for "more of those"
  — a scripted approach at the Ledger Vault, `approachGauntlet
  ('ledgerCommittee')`, gauntlet.js, not a random hunt), and quest15
  "The Warren Answers" (`acceptQuest15`/`reportQuest15` — the Mole Wars
  arc's own finale, a second and bigger gauntlet
  (`approachGauntlet('moleCouncil')`) staged at the Gearworks, culminating
  in `warrenMother` — the hardest single fight since `gnomeKing`, Act
  1's own finale), and quest16 "Breaking Through"
  (`acceptQuest16`/`reportQuest16` — the Mole Wars arc's TRUE capstone,
  one step past quest15. Its 3 parts are gathered three DIFFERENT ways
  by explicit request: a guaranteed zone drop
  (`drilldozerIngredients`, content.js), a salvaged re-fight of
  quest9's own first boss (`tunnelWardenSalvageHunt`, combat.js —
  `state.drillRigSalvaged`, separate from `tunnelWardenDefeated`,
  distinguishes the salvage kill from the original), and a straight
  currency purchase (`buyDriveShaft()`, player-actions.js, at the
  Tinker's Workshop). `heldAllDrilldozerParts()`/
  `countDrilldozerPlatingHeld()` (render.js) check holdings; reporting
  reveals the Crystal Breach tile in the Ember Warren's own square —
  a real explorable stub zone, not just an ending screen), and quest17
  "What Light Remembers" (`acceptQuest17`/`reportQuest17`, town.js —
  Act 3's own opener, offered at the Crystal City itself once
  quest16Complete. Deliberately a formality, same shape as quest8's own
  "New Digs": no fetch objective, accept/report in one visit, since the
  real content is the Prism Depths dungeons themselves — DUNGEONS.*.
  requiredFlag, dungeon.js, gates on quest17Complete now rather than
  quest16Complete directly, per explicit correction, so the dungeons
  are actually announced by a quest instead of existing only as a bare
  button on the Crystal City screen), quest18 "Old Light, Older Debts"
  (`acceptQuest18`/`reportQuest18`, town.js — offered at the Crystal
  City once ALL of wave 1's dungeons are cleared at least once,
  `allDungeonsCleared()`, dungeon.js, not merely once quest17Complete;
  the gnome-hoodoo-lineage reveal beat the Act 3 plan calls for —
  gnome hoodoo turns out to descend from the Lucent's own fading
  influence. Unlocks wave 2 — Verdant Hollow/Duskward/Ironloom), and
  quest19 "The Last Two Rooms" (`acceptQuest19`/`reportQuest19`,
  town.js — same "gated by the dungeons themselves" rule, offered once
  all of wave 2 is cleared. Unlocks wave 3 — Echo Chapel/Sunken
  Archive, the last of the first 8 dungeons; the true finale, the
  Hollow Vault/quest20/the Dimming, is a deliberately separate, later
  pass, not built with these).
- **Bounty Board**: `isBountyZoneUnlocked`/`rollNewBounty`/
  `ensureActiveBounty`/`isBountyReady`/`formatBountyTimeLeft`/
  `claimBounty`/`updateBountyTimerDisplay`. No daily claim cap — per
  explicit request, the board can be worked all day long;
  `claimBounty()` just rolls a fresh bounty immediately on every claim,
  the same way it always did below whatever the old cap used to be.
  `bountiesCompleted` (core.js) is a lifetime counter, unrelated to any
  per-day limit. Its
  own zone pool has moved twice now — Act 1 zones, then Garrison/
  Rogues' Den/Arcane Sanctum as an interim pool, now Mudroot Warren's
  own districts (`rootcellar`/`mudflats`/`bureau`), the Warren's Ear's
  own districts (`choir`/`ledgervault`, each gated on its own rare
  hunt — the exact same gate `travelTo()` itself uses, town.js), and
  the Ember Warren's own (`foundry`/`gearworks`, gated on
  `quest11Complete`), and the Crystal City (`crystalcity`, gated on
  `quest16Complete` — wired in from the START this time, learning from
  the gap below) once quest7Complete —
  `isBountyZoneUnlocked()` is the single place that pool is defined.
  Choir/ledgervault/foundry/gearworks were all missing from this
  function entirely until this session — every kill in any of those
  zones was quietly unbountyable no matter how far a save had
  progressed, the same category of gap as quest7's own missing
  Guild-flag case (see the Refactor history below).

Quest 6 ("The Gnome King's Throne") is a retcon setup for quest 7: you
fight `gnomeKingsCaptain` in the Vault, not the real King — he's
already fled to Gnometropolis by the time you get there. The real
`gnomeKing` (content.js, buffed past `trialChampion`) is only reachable
via `approachPalaceGate()` once a class-specific `PALACE_GATE_GEAR` item
is actually equipped, which is earned by defeating that class's district
guardian (see gnometropolis.js) — not bought.

Touch this file when: changing Guild(1 or 2)/bounty/Palace-gauntlet
logic, or quest 6/7/8/9's own accept/report flow.

## gnometropolis.js — Gnometropolis (Act 2 hub) building logic
`DISTRICT_GUARDIANS` — the single source of truth mapping each
district key to its class/guardian/label (garrison/Meathead,
roguesden/Card Shark, sanctum/Hexpert — read by render.js instead of
keeping its own duplicate mapping). `restAtCamp`/
`updateCampCooldownDisplay` — the Camp's flat-Biscuit-cost/full-
restore/real-time-cooldown rest tile (same shape as Gladstone's Inn);
a successful rest here is what sets `state.homeTown` to
'gnometropolis'. `enterGnomeShop`/`leaveGnomeShop` (the Act 2 Shop —
`renderGnomeShop()`, render-shop.js, does the actual listing;
`act2-shop.js`/`economy.js` do the data/purchase logic).
`enterGnomeTownLot`/`leaveGnomeTownLot`/`buyGnomeTownLot`/
`upgradeGnomeTownLot`/`upgradeGnomeBuilding` — Gnometropolis's own Town
Lot economy, same shape as town.js's Gladstone-side
`buyTownLot`/`upgradeTownLot`/`upgradeBuilding` but keyed to
`state.gnomeLotTier`/`state.gnomeBuildingUpgrades` instead.

Note: this file's role has shifted since it was first split out (it
used to be the quest7 district-guardian trigger specifically — that
logic is now in combat.js's `garrisonHunt`/`roguesdenHunt`/
`sanctumHunt`, goAdventuring()). It's now "Gnometropolis's own building
logic," the Act 2 mirror of what town.js is for Gladstone Hollow.

Touch this file when: changing the Camp, the Act 2 Shop's enter/leave,
Gnometropolis's own Town Lot economy, or `DISTRICT_GUARDIANS`' own
class/label mapping.

## economy.js — shop sell/buy + Biscuit/MP regen + Casino passive income
`isQuestItemSellable`/`sellItemByName` (works from EITHER Shop —
`state.location==='shop'` or `'gnomeshop'` — selling never touches
either shop's own catalog, only the Pack; junk/consumable/quest items
only — see `sellEquipItemByIndex` below for equip)/
`sellEquipItemByIndex(idx)` — gear's own sell path, selling exactly the
one item at that array index rather than matching by name+tier the way
`sellItemByName` does, since per explicit correction gear is never
grouped/stacked anywhere (two same-named, same-tier drops can still
carry different rolled secondary stats or `temperLevel` —
`groupInventoryByName()`, render-shop.js, and `buildSellSection()`'s
own equip rows both key off array index for exactly this reason) —
`filterByClass(items)` (armor-classes feature — keeps an item if
`!item.classRequired || !state.classTitle || item.classRequired ===
state.classTitle`, same permissive pre-Trial fallback as `equipItem()`'s
own gate, player-actions.js; called by both `getAvailableShopItems`
below AND `getAvailableGnomeShopItems()`, act2-shop.js)/
`getAvailableShopItems`/
`rollShopGearStats` (rerolls tier-2/3+ gear's secondary stat(s) fresh
on every purchase — the primary stat/value is fixed by the definition,
only which OTHER stat(s) it gets is random; shared by both shops, back
to its original 4-stat candidate pool (`['beef','zip','grit','hoodoo']`)
now that armor is a guaranteed per-tier amount on every item regardless
(`ensureGearArmor()`, item-tiers.js) rather than a possible random roll
— every return path of this function passes through that same call)/
`buyItemByName`/`buyGnomeShopItemByName` (the Act 2 Shop's own
purchase function — reads `getAvailableGnomeShopItems()`, act2-shop.js,
and gates on `state.location==='gnomeshop'` instead), `randInt`, the
Biscuit (energy) economy (`BISCUIT_MAX`/`effectiveBiscuitMax()`/
`BISCUIT_REGEN_MS`/`regenBiscuits`/`msUntilNextBiscuit`/`formatMs`/
`formatMoney` — display-only Pop Tabs abbreviation, `1234` ->
`"1.2K"`, used just for the HUD counter, never for a real
balance check/spend — `updateBiscuitDisplay` + its `setInterval`), MP
regen (`MP_BASE_REGEN_MS`/`MP_REGEN_SPEED_CAP`/
`MP_REGEN_SPEED_PER_HOODOO`/`mpRegenSpeedBonus`/`mpRegenMs`/`regenMp`/
`updateMpDisplay`), and the Casino's passive income
(`casinoWinningsCap()`/`regenCasinoWinnings()` — same elapsed-real-
time-to-a-cap shape as Biscuits, but the cap is 0/inert until
`buildingUpgrades.casino` is upgraded at least once, and — unlike
Biscuits' flat rate — the regen rate is derived from the CURRENT
level's own cap (`CASINO_WINNINGS_FULL_MS`/`CASINO_WINNINGS_CAP`,
content.js) so every level fills from empty in roughly the same ~5
hours instead of a bigger cap just taking proportionally longer;
claimed via `claimCasinoWinnings()`, guild.js).

Touch this file when: changing shop sell/buy logic for either Shop,
the Biscuit/MP-regen economy, or the Casino's passive-income
accrual/cap.

## noticeboard.js — the Notice Board
`enterNoticeBoard`/`leaveNoticeBoard`, `NOTICE_MAX_AGE_MS` (notices
self-clear after 24h — nothing pinned is permanent), `escapeHtml`
(sanitizes player-submitted notice text before it's ever rendered via
innerHTML — this is the one place in the game that renders untrusted
player-authored text, so this is a real XSS guard, not decoration),
`formatNoticeAge`, `renderNoticeBoard`, `updateNoticeBoardCharCount`.
Small, fully self-contained feature — doesn't call into or get called
by any other file's logic beyond `enterX`/`leaveX`'s usual
`state.location` gate.

Touch this file when: changing the Notice Board's own posting/display
logic.

## boot.js — MUST STAY LAST (see rule #2 above)
Scene-art click delegation, `startFreshGame()` (resets `state` for a
brand-new character — starter gear, one heal item, arrival log line,
opens the tutorial), and the boot trigger itself
(`if(sb){renderGate()}else{closeGate();startFreshGame();}`).

Touch this file when: changing what a brand-new character starts with,
or the boot sequence itself. If you add a new file that needs something
from another file at its own top level, it still goes before boot.js —
nothing should ever need to load after it.

## styles.css
Single stylesheet, CSS custom properties near the top (`--red`, `--blue`,
`--tan`, etc.) driving header bars, stage/scene-art sizing, shop/drawer/
tabbar layout, and button variants (`btn-primary`/`btn-attack`/
`btn-cast`/`btn-flee`/`btn-secondary`). No preprocessor — add a new rule
near the section it belongs to.

## Quick lookup — "I want to change X"
- Rebalance/add an Act 1 monster, item, spell, shop listing, or a
  cost/bonus curve -> **content.js**. Act 2's own (Mudroot Warren
  monsters -> **mudroot-content.js**; the Warren's Ear's ->
  **warrensear-content.js**; the Ember Warren's ->
  **emberwarren-content.js**; Gnometropolis Shop gear/food ->
  **act2-shop.js**).
- Add a new save field -> **core.js** (`createDefaultState()`) +
  **save.js** (`serializeState`/`hydrateState`) together.
- Add a new icon -> **icons.js**. Add new monster/scene/portrait art ->
  **art.js** (Act 1 AND Act 2 monster art both live here — see art.js's
  own section). Change the Gnometropolis or Mudroot Warren square's own
  building layout/backdrops -> **gnometropolis-art.js**/**mudroot-art.js**.
- Change how the Pack/Shop/Bounty Board/Hoodoo/Town Lot screen looks or
  reads -> **render-shop.js**. Character/Quest Log screens ->
  **render-character.js**. Class spell trainer listings ->
  **class-spells.js**. Cross-screen sync -> **render.js**.
  (+ **index.html** if any of these need new DOM elements.)
- Change combat math, encounter rolls, or a spell's learn/cast
  mechanics -> **combat.js**.
- Change a per-building quest's logic or Gladstone-side travel/unlock
  rules -> **town.js** (or **guild.js** for quest2/6/8-15/the class
  Trial). Change a Gnometropolis building's own logic (Camp, Act 2
  Shop enter/leave, Gnometropolis's own Town Lot) -> **gnometropolis.js**.
- Add or change a multi-boss gauntlet (guards fought in order, then a
  finalBoss) -> **gauntlet.js**'s own `GAUNTLETS` registry — the Act 1
  Palace Gate (guild.js/content.js) is a separate, older, untouched
  implementation of the same idea; don't hand-copy it for a new one.
- Add a new quest -> remember its own **QUEST_DEV_STAGES** entry AND
  **resetQuestsDev()** line in **dev-tools.js** — both are easy to
  forget and both silently rot (see that file's own section).
- Change which locations belong to which hub, or hub-to-hub travel
  cost rules -> **hubs.js** (the actual pricing formula is in
  town.js's `travelCostFor()`, which reads hubs.js's own registry).
- Change Guild(1 or 2)/bounty/Palace-gauntlet logic -> **guild.js**.
  Casino/Blackjack -> **casino.js**. Rogues' Den/Hi-Lo -> **hilo.js**.
  The class Trial/skill-upgrade system -> **class-trial.js**. Casino/
  Biscuit passive-income regen math itself -> **economy.js**.
- Change shop sell/buy pricing (either Shop), Biscuit/MP regen, or the
  Casino's passive-income accrual/cap -> **economy.js**.
- Change an item's rarity color, or add a new tier -> **item-tiers.js**.
- Change what a brand-new character starts with -> **boot.js**
  (`startFreshGame()`).
- Change equip/use-item/stat-point logic -> **player-actions.js**
  (this is also where `mapTab`/`setMapTab()` — the Map drawer's own
  Act1/Act2 tab state — lives).
- Change the login/register/guest flow or Account drawer ->
  **auth.js**.
- Add a dev/cheat tool -> **dev-tools.js** (+ its hook in
  `renderAccountTab()`, auth.js).
- Change the tutorial -> **tutorial.js**. Change the Notice Board ->
  **noticeboard.js**. Change the "What's New" changelog ->
  **changelog.js**. Change the daily login streak's reward table or
  grace-period rule -> **dailystreak.js**.
- + the `onclick=`/new DOM element in **index.html** if it's a
  brand-new button/screen.

## Refactor history
The original 5 files (`core.js`/`content.js`/`render.js`/`account.js`/
`game.js`, 600-1150+ lines each) were split into 17 in one session once
every task was spending significant effort just reading through large,
multi-concern files to find the right section. The split was verified
as a pure mechanical move (no logic changes) via `node --check` on
every file plus a live-browser smoke test (boot, guest login, combat,
shop, Town Lot upgrades, a full `serializeState()`/`hydrateState()`
round-trip, the full-reset dev tool, and the class Trial) with zero
console/page errors before merging.

Act 2 (Gnometropolis-as-hub, Mudroot Warren) added 9 more files on top
of that 17 following the same "new concern, new file" convention —
`hubs.js`, `gnometropolis-art.js`, `mudroot-art.js`,
`mudroot-content.js`, `act2-shop.js`, `class-spells.js`, and
`noticeboard.js` were themselves left undocumented here for a while
(fixed in the pass that added this paragraph — see each file's own
`## ` section above). That same pass split `guild.js` — which had
grown to bundle 4-5 separable systems sharing only the "quest-giving
building" shape — into `casino.js` (Casino) + `class-trial.js` (the
class Trial/skill system) + a smaller `guild.js` (Guild Act 1 + Act 2
+ Bounty Board + Palace gauntlet), each fully self-contained so the
split was a pure mechanical move (verified via `node --check` on every
file plus a live-browser smoke test of Casino betting/passive income,
the class Trial, and Guild quest2/6/7/8/9's own accept/report flow —
zero console/page errors).

**render.js's own `render()` was split the same session**, once flagged:
its one ~770-line body doing 5 distinguishable jobs became
`computeRenderContext()` (pure) + one sync function per job, each
taking the resulting `ctx` object — see render.js's own section for
the full breakdown. Verified via `node --check` plus a live-browser
smoke test that walks `render()` through every location in the game
(town buildings, all 4 Act 1 zones, the full Gnometropolis + Mudroot
Warren clusters, in-combat, and the victory-banner path) with zero
console/page errors, on top of every feature-specific Playwright suite
from earlier in the session re-run against the split version.
