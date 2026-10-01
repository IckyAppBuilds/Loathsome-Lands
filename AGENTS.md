# The Loathsome Lands — file map

A single-page browser RPG. No build step, no bundler, no modules — plain
HTML/CSS/`<script>` tags, all globals. 37 JS files load in a specific
order (see `index.html`'s `<script>` block, which documents this inline
too):

```
supabase (CDN)
-> core.js -> icons.js -> art.js -> gnometropolis-art.js -> mudroot-art.js
-> warrensear-art.js -> emberwarren-art.js -> content.js -> mudroot-content.js
-> warrensear-content.js -> emberwarren-content.js -> gauntlet.js
-> crystalcity-content.js -> act2-shop.js -> item-tiers.js -> render.js
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
  Lot/building-upgrade levels, the active bounty, `spellsUpgraded` (a
  Hexpert's Sanctum-bought "Level 2" spells — permanent progression, so
  unlike `state.evasionActive` it IS part of `serializeState()`), and
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

## content.js — game data tables
`monsters[]` (per-zone, each with its own optional `rareDrop` AND
`gearDrop` — a monster-themed equip drop, own Diablo-style "of the ___"
stat modifier per the comment above `monsters[]`, authored as the
tier-1/1-stat baseline; `RARE_DROP_CHANCE`/`GEAR_DROP_CHANCE` roll each
independently in `winCombat()`, and a dropped gearDrop then rolls a
tier via `GEAR_DROP_TIER_CHANCE`/`rollGearDropTier()` — see combat.js).

Every monster/boss across ALL FIVE monster-data files (this one,
mudroot-content.js, warrensear-content.js, emberwarren-content.js,
crystalcity-content.js — 77 objects total) is authored as a
`beef`/`zip`/`grit`/`hoodoo` stat block, mirroring the player's own 4
stats, REPLACING the old raw `hp`/`atkMin`/`atkMax`(/ad hoc
`dodgeChance`) fields entirely — `deriveMonsterCombatStats()`
(combat.js) turns these into the numbers `startCombat()` actually
spawns with, via `statBonus()` same as every player formula. `hoodoo`
is present in the data shape but has NO mechanical effect yet (a
monster's `skills[]` keep their own hand-authored heal/bolt/debuff
magnitude regardless of hoodoo — scaling those off it is an
intentionally out-of-scope follow-up). The migration itself was
formula-based (inverting each monster's OLD authored
hp/atkMin/atkMax/dodgeChance through the same derive formulas to
reproduce today's effective difficulty as closely as the math allows,
not hand-retuned) — `xp`/`rare`/`skills[]`/`loot`/`rareDrop`/`gearDrop`/
`art`/`zone`/`name` were untouched by it.

**`armor` is deliberately NOT part of a monster's authored data at
all** — no `armor:` field lives on any of the 77 objects. It's derived
purely from `grit` + whether the monster is `rare:true`, by
`deriveMonsterCombatStats()`, exactly like hp/atk/dodge already are:
`MONSTER_ARMOR_PER_GRIT` (regular trash) / `MONSTER_RARE_ARMOR_PER_GRIT`
(any rare monster — steeper, since a boss should feel tougher than a
wild encounter of similar raw grit) — two tunable constants,
content.js, control the WHOLE bestiary's armor curve at once. This
replaced an earlier version (shipped, then superseded the same session)
that hand-picked a literal `armor:N` on 9 "marquee" bosses and left
everyone else at 0 — moved to a pure derivation specifically so the
entire bestiary gets a real, consistent value with zero per-monster
authoring, rather than an ever-growing hand-picked exception list.

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

**Every regular (non-rare) monster now also carries exactly one
skills[] entry** (combat-variety pass — previously only named bosses
had any mechanical behavior beyond plain auto-attack; see the comment
above `TRASH_SKILL_CHANCE`, right before `const monsters = [`, for the
full reasoning). Reuses the exact same `monsterRetaliate()`/
`useMonsterSkill()` dispatcher — zero new combat.js code was needed.
Restricted to `heal`/`buff`/`bolt` only; `debuff` (burn/poison/freeze)
stays boss-exclusive, a "this is a real fight" signal. Every trash
skill shares one `chance` (`TRASH_SKILL_CHANCE = 0.12`, well below a
boss's own 0.15-0.25), and its heal/bolt magnitude is hand-computed
per monster from that monster's own zone-scaled atk/hp (not an
arbitrary number) — `TRASH_SKILL_CHANCE` has to be declared BEFORE
`const monsters = [` specifically because it's referenced inside that
array literal (evaluated immediately at parse time, unlike
`MONSTER_ARMOR_PER_GRIT`-style constants that live further down this
file and are only read inside function bodies called later — declaring
it after the array would throw a temporal-dead-zone ReferenceError the
moment the array tried to evaluate it, a real bug caught once while
building this). Flavor text is hand-written per monster to match the
game's existing comedic voice, not templated. `ZONE_DIFFICULTY`/`ZONE_LABELS`, `noncombatEvents`/
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
`MONSTER_ATK_SPREAD`/`MONSTER_ARMOR_PER_GRIT`/`MONSTER_RARE_ARMOR_PER_GRIT`
(the monster-stat-block derive formula's own tuning knobs — see
`deriveMonsterCombatStats()`, combat.js — the last two are the entire
tunable armor curve for the whole bestiary: a monster's armor is
`grit * one of these two`, never an authored field, `rare:true`
monsters using the steeper rate), `ZIP_DODGE_COEFFICIENT`/`ZIP_DODGE_CAP`
(renamed from `MONSTER_DODGE_COEFFICIENT`/`MONSTER_DODGE_CAP` once zip's
own formula — `zipDodgeAndAccuracy()`, combat.js — became shared by
BOTH the player and monsters, on BOTH offense and defense: the same
number is a combatant's own dodge chance AND, symmetrically, their
ACCURACY against whoever they're attacking's dodge — per explicit
request that zip "combat" the opponent's dodge chance in both
directions, not just raise your own. See that function's own comment
for the full 4-way breakdown) and `ARMOR_REDUCTION_
COEFFICIENT`/`ARMOR_REDUCTION_CAP` (armor's own mitigation-fraction
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
via the shared `state.evasionActive` flag, combat.js), `SPELL_UPGRADE_
MULTIPLIER`/`SPELL_UPGRADE_BASE_COST`/`SPELL_UPGRADE_COST_PER_MP`/
`spellUpgradeCost(spell)` (Hexpert's Arcane-Sanctum-only "Level 2"
spell upgrade, `state.spellsUpgraded`/`upgradeSpell()`, combat.js — a
flat +45% bump to each spell's own effect: damage/heal/ward magnitude,
buff duration in fights, or evade's dodge bonus specifically),
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
`rare:true`/`skills[]`/`beef`/`zip`/`grit`/`hoodoo` stat-block shape as
content.js's own named bosses (armor is never authored — see armor's
own comment above), spawned by
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
`emberWarrenMonsters` (the Foundry's 3 + the Gearworks' 3 regulars —
same shape as warrensear-content.js's own monsters, `.push()`ed onto
`monsters`/`BOUNTY_TEMPLATES` the same way; gearDrop bonus continues
the zone-difficulty ladder at +9, one step past Warren's Ear's +8).
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
`crystalCityMonsters` (3 regulars — `crystalSentinel`/`geodeCrawler`/
`echoWraith` — same `.push()`-onto-`monsters`/`BOUNTY_TEMPLATES` shape
as every other zone's own roster; gearDrop bonus +10, one step past the
Ember Warren's own +9). Deliberately a STUB, same as Mudroot Warren/the
Ember Warren before their own first quest — no rare hunt/boss of its
own yet. First zone with a genuinely new visual identity (angular
crystalline shapes, not the mole silhouette every Act 2 monster before
it used — see the comment above `artCrystalSentinel`, art.js) signaling
this is the first taste of whatever comes after the Mole Wars, not
another warren. Also extends `noncombatEvents`/`hazardEvents` with a
`crystalcity` entry. Loads after content.js/icons.js/art.js.

Touch this file when: adding/rebalancing a Crystal City monster, or
(eventually) its own first quest/rare hunt.

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
(`renderRareFindsBlock`/`renderStatsBlock`/`renderEquipmentBlock`), and
`renderQuestLogDrawer`. `renderStatsBlock()` iterates
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
that always silently refuses). `renderSpellUpgradeBlock(containerId)`
— Arcane-Sanctum-only, Hexpert-only "Deepen Your Spells" shop, listing
EVERY spell in `state.spellsKnown` (not filtered by `learnLocation`,
since the point is upgrading a spell no matter where it was learned)
with a Level 2 buy button (`upgradeSpell(id)`, combat.js,
`spellUpgradeCost()`, content.js) that becomes a disabled "Upgraded"
label once bought (`state.spellsUpgraded`).

Touch this file when: changing how a class spell trainer, the
class-skill upgrade block, or the spell-upgrade block is displayed.

## dev-tools.js — `isDevAccount()`-gated cheats
`DEV_USERNAMES`/`isDevAccount()`, `resetLevelDev`/`resetQuestsDev`
(reset every quest flag back to never-started — quest7 through quest15
were silently missing from this entirely until this session, despite
its own doc comment already claiming full coverage; fixed alongside
adding quest13-15, extended again for quest16, and now also calls
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
so the Pack stays in sync with whatever stage is jumped to). Never
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
`serializeState()`/`hydrateState()` (round-trips `state.spellsUpgraded`
alongside `state.spellsKnown`, same shape/hydrate-filter — dropping any
id that no longer matches a real `spells[]` entry), `saveGame`/`loadGame`/
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
(core.js/save.js, same "compare calendar days" convention as
`state.bountyDayKey`, guild.js) to grant at most once per real day, with
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
spawn chance), `startCombat` (derives a template's real hp/atkMin/
atkMax/dodgeChance/armor from its `beef`/`zip`/`grit` stat block via
`deriveMonsterCombatStats()` right before applying `ZONE_DIFFICULTY` —
dodgeChance/armor both pass through unscaled, same treatment
`dodgeChance` always got)/`deriveMonsterCombatStats(m)` (the
monster-stat-block formula shapes, mirroring the player's own
maxHp/dodge formulas — no "level" term, since monsters don't level;
`hoodoo` is deliberately unread here; armor is derived from `grit` +
`m.rare` — a `rare:true` monster uses a steeper per-grit rate than
regular trash, `MONSTER_ARMOR_PER_GRIT`/`MONSTER_RARE_ARMOR_PER_GRIT`,
content.js — armor is NEVER read off the template itself, it has no
authored armor field at all; `dodgeChance` itself is derived via
`zipDodgeAndAccuracy(m.zip)`, the same shared zip formula
`playerDodgeChance()` below uses for the player's own base
dodge)/`zipDodgeAndAccuracy(zip)` (zip's ONE formula, used for dodge
AND accuracy, on both sides — see `ZIP_DODGE_COEFFICIENT`/
`ZIP_DODGE_CAP`'s own comment, content.js)/`armorDamageReduction(armor)`
(shared by both damage functions
below — reuses `statBonus()`'s own curve, capped at
`ARMOR_REDUCTION_CAP`, content.js)/`applyDamageToPlayer`/
`applyDamageToMonster` (both mitigate via `armorDamageReduction()`
before anything else — shield absorption for the player, the dodge
roll for a monster already happened/happens first — floored at 1 UNLESS
the raw incoming damage was already `<=0`, in which case it stays 0
rather than manufacturing a hit out of nothing; both return the actual
post-armor amount, and every caller logs THAT, not its own
pre-mitigation local variable. `applyDamageToMonster` ALSO subtracts
the player's own `zipDodgeAndAccuracy()`-derived accuracy from the
monster's `dodgeChance` before rolling it — per explicit request, the
player's zip is accuracy as well as dodge, canceling out some of
whatever a zippy monster's own dodge chance is, floored at
0)/`monsterRetaliate`/`monsterAutoAttack`/
`tickMonsterBuff`/`useMonsterSkill` (dispatches a monster's own
`skills[]` entry by `type` — `'heal'`/`'buff'`/`'bolt'`/`'debuff'`, the
last of which sets `state.playerStatusEffect` instead of attacking that
turn)/`applyPlayerStatusEffectForTurn` (plays out one turn of a boss's
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
`openSpellMenu`/`closeSpellMenu`/`useItemInCombat`/`castSpell` (its
`'damage'` branch also rolls Hexpert's own class-skill proc —
`HEXPERT_ECHO_CHANCE`/`HEXPERT_ECHO_DAMAGE_MULT`, content.js — a chance
to immediately echo-cast the same spell again at half power, zero
extra MP, resolving before the turn's one `monsterRetaliate()` call,
same ordering Card Shark's bonus swing uses in `playerAttack()`. Its
`'evade'` branch sets `state.evasionActive` to the
CAST SPELL'S OWN ID, not a boolean — Card Shark's Smoke Screen and
Hexpert's Illusion, content.js, are two different spells sharing this
one flag, so it has to be an id to know which spell's flavor
text/Level-2-upgrade-bonus actually applies; `playerDodgeChance()`
reads it, `evasionFlavorNoun()` turns it into "the smoke"/"the
illusion" for log lines, `isSpellUpgraded(id)` checks
`state.spellsUpgraded`)/
`CLASS_SPELL_LOCATION`/`CLASS_SPELL_TRAINER`/`learnSpell` (a spell's
own `learnLocation` — content.js's `spells[]` — overrides
`CLASS_SPELL_LOCATION`'s default, letting the same class have spells
taught in two different buildings, its Act 1 trainer and its Act 2
one — Hexpert is the first class with TWO Act 2 spells, Arcane Lance
AND Illusion, both taught at the Sanctum)/`playerFlee`/`rollGearDropTier` (scales a monster's authored
tier-1 gearDrop up 0-2 tiers, `GEAR_DROP_TIER_CHANCE`)/`winCombat`
(rolls lootRoll/rareRoll/gearRoll independently on every kill — see
the comment above monsters[], content.js, for what each one is)/
`endCombat` (also clears `state.playerStatusEffect` — scoped to a
single fight, same as `state.evasionActive`)/`upgradeSpell(id)`
(Arcane Sanctum + Hexpert-only — permanently deepens one already-known
spell to "Level 2," `state.spellsUpgraded`/`spellUpgradeCost()`,
content.js, for `SPELL_UPGRADE_MULTIPLIER`)/`DEFEAT_WAKE_UP_LOCATION`
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
economy (`buyTownLot`/`upgradeTownLot`/`upgradeBuilding`). The
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
  a real explorable stub zone, not just an ending screen).
- **Bounty Board**: `isBountyZoneUnlocked`/`rollNewBounty`/
  `checkBountyDayReset`/`ensureActiveBounty`/`isBountyReady`/
  `formatBountyTimeLeft`/`claimBounty`/`updateBountyTimerDisplay`. Its
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
