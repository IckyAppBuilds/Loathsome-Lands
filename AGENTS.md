# The Loathsome Lands — file map

A single-page browser RPG. No build step, no bundler, no modules — plain
HTML/CSS/`<script>` tags, all globals. 20 JS files load in a specific
order (see `index.html`'s `<script>` block, which documents this inline
too):

```
supabase (CDN)
-> core.js -> icons.js -> art.js -> content.js -> item-tiers.js
-> render.js -> render-shop.js -> render-character.js -> class-spells.js
-> dev-tools.js -> auth.js -> save.js -> player-actions.js -> tutorial.js
-> combat.js -> town.js -> guild.js -> gnometropolis.js -> economy.js
-> noticeboard.js -> boot.js
```

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
  Lot/building-upgrade levels, the active bounty, and the rare-drops
  log. `const state = createDefaultState();` is the live global; calling
  the factory again (see `resetToNewGameDev()`, dev-tools.js) is how a
  full reset works without needing to reassign the `const` binding.
  This is the object `serializeState()`/`hydrateState()` (save.js)
  round-trip to Supabase.
- `STAT_LABELS`/`STAT_HINTS`/`SLOT_LABELS`/`SLOT_ORDER` constants, and
  `statBonus(value)` — the shared superlinear stat-scaling helper (each
  point is worth more than the last; used by combat.js/player-actions.js).

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
portrait.

## content.js — game data tables
`monsters[]` (per-zone, each with its own optional `rareDrop` AND
`gearDrop` — a monster-themed equip drop, own Diablo-style "of the ___"
stat modifier per the comment above `monsters[]`, authored as the
tier-1/1-stat baseline; `RARE_DROP_CHANCE`/`GEAR_DROP_CHANCE` roll each
independently in `winCombat()`, and a dropped gearDrop then rolls a
tier via `GEAR_DROP_TIER_CHANCE`/`rollGearDropTier()` — see combat.js),
the named bosses — every one of them (`gnomeCommander`/`diggerBot`/
`gnomeKingsCaptain`/`gnomeKing`/the Adventurer's Trial's three themed
fights, `trialChampion`/`casinoChampion`/`hoodooChampion`/the three
Gnometropolis district guardians) carries its own `skills[]` and/or
`dodgeChance` giving it one signature mechanic (a rally buff, a self-
heal, an elemental bolt, evasion, or some combination — see the comment
above `gnomeCommander` for the full rundown and reasoning) dispatched
generically by combat.js's `monsterRetaliate()`/`useMonsterSkill()`,
no per-boss combat code needed — with their own spawn-chance
constants, `ZONE_DIFFICULTY`/`ZONE_LABELS`, `noncombatEvents`/
`hazardEvents`, `healItems`/`shopFoodItemsTier2`/`shopFoodItemsTier3`,
`starterGear`, `shopGearItems`/`shopGearItemsTier2`/`shopGearItemsTier3`
(1/2/3 stats respectively — each tier up adds one more +1 secondary
stat on top of the previous tier's own bonuses), `STAT_ROTATION` (which
secondary stat a tier-2/3 item/drop gets, cycled per primary stat),
`shopBuyItems`, `spells`, `potionIngredients`, `veinIngredients`,
`CLASS_TITLES` + each class's skill-bonus constants
(`MEATHEAD_DAMAGE_BONUS`/`CARD_SHARK_PAYOUT_BONUS`/`HEXPERT_SPELL_DMG_BONUS`
+ `classSkillCost()`), casino odds/flavor lines, `BOUNTY_TEMPLATES`, and
the Town Lot/building-upgrade cost
tables (`buildingUpgradeCost()`, `LOT_TIER_COST` — both quadratic) plus
each building's per-level effect constants (`GAFFER_BISCUIT_MAX_BONUS`
etc.) and `STAT_RESET_BASE_PRICE`/`STAT_RESET_PRICE_MULT`.

Touch this file when: adding or rebalancing a monster, item, spell, shop
listing, casino odds, or a cost/bonus curve. Rarely needs a matching
change elsewhere unless you're adding a new mechanic, not just new data.
Every equip/consumable item should carry an explicit `tier` field (see
item-tiers.js below) — 'poor'/'common'/'uncommon'/'rare'/'epic'; quest
items and ordinary junk loot don't need one, they're derived from `type`.

## item-tiers.js — item rarity colors + gear requirements
`ITEM_TIER_COLORS` (the Diablo/WoW-style poor->legendary ramp, plus a
'quest' tier, all reusing styles.css's existing custom properties),
`getItemTier(item)`, and `itemNameHtml(item)` — wraps an item's name in
its tier color, used everywhere an item's name renders via innerHTML
(the Pack, Shop listings including Sell, equipped gear, Rare Finds).
Never used in log() messages (those are textContent, not innerHTML).

Also `getGearRequirements(item)` and `gearRequirementText(item)` — an
equip item's level/stat requirement is never stored on the item itself,
it's derived here from the item's own `bonus` object every time it's
needed (equipItem(), player-actions.js; the Pack/Shop listings), so a
requirement can never drift out of sync with what the item actually
grants. levelReq = 2x total stat points across the whole bonus; statReq
= 2x the primary (first-keyed) stat's own value, checked against raw
`state.stats`, never `getEffectiveStats()`.

Pure throughout: every function here only reads its `item` argument,
never `state` — comparing a requirement against the player's actual
level/stats is left to each caller (equipItem(); the Pack/Shop
listings' own disabled-button checks).

Touch this file when: changing a rarity color, adding a new tier, or
changing how level/stat requirements scale off an item's bonus.

## render.js — core screen sync
`render()` (bars, which location view is shown, quest banners, drawer
counts), `log()`/`clearLog()`, the counting helpers shared with the
game.js-successor files (`countRakeTines`/`countPotionIngredientsHeld`/
`countVeinIngredientsHeld`), and `capitalize()`.

Touch this file when: a cross-screen sync rule changes (not a single
screen's own layout — see render-shop.js/render-character.js for those).

## render-shop.js — spend/earn-Pop-Tabs screens
`renderInventory`, the Shop cluster (`shopTab`/`setShopTab`/
`renderShopItemRow`/`renderShop`), `renderBountyBoard`,
`renderCasinoWinningsBox` (the Casino's passive-income box), `renderHoodooShop`
(spell list + the stat-reset "Unravelling Draught" section),
`BUILDING_EFFECT_INFO`/`shopTierUnlockNames()`/`buildingEffectDesc()`,
and `renderTownLot`.

Touch this file when: the Pack, Shop, Bounty Board, Hoodoo Doctor's, or
Town Lot screen's layout or wording needs to change.

## render-character.js — progression screens
`renderSpellMenu`, `renderCharacterDrawer` + its sub-blocks
(`renderRareFindsBlock`/`renderStatsBlock`/`renderEquipmentBlock`), and
`renderQuestLogDrawer`.

Touch this file when: the Character drawer or Quest Log's layout or
wording needs to change.

*(render.js/render-shop.js/render-character.js collectively: read-only
against `state`/content.js data, they never mutate game state.)*

## dev-tools.js — `isDevAccount()`-gated cheats
`DEV_USERNAMES`/`isDevAccount()`, `resetLevelDev`/`resetQuestsDev`/
`resetToNewGameDev` (the "Full Reset (New Game)" button — wipes to
`createDefaultState()` then replays `startFreshGame()`), the direct
state setters (Biscuits/Pop Tabs/level/stats/items/etc.), and
`QUEST_DEV_STAGES`/`setQuestStageDev`. Never touched by normal gameplay
work — the cleanest single-concern file in the project.

Touch this file when: adding a dev/cheat tool, and hook it into
`renderAccountTab()` (auth.js).

## auth.js — sign-in/out, the gate, the Account drawer body
`authSetView`/`renderAuthUI`/`renderAuthForms`/`acctMsg`/`showGate`/
`closeGate`/`renderGate`/`playAsGuest`/`enterGameAfterAuth`,
`doRegister`/`doLogin`/`doForgotPassword`/`doLogout`, and
`renderAccountTab()` (calls into dev-tools.js).

Touch this file when: changing the login/register/guest flow, or the
Account drawer's non-dev-tool content.

## save.js — the state<->save round-trip
`allItemDefs`/`itemByName`/`serializeItem`/`hydrateItem`,
`serializeState()`/`hydrateState()`, `saveGame`/`loadGame`/
`manualSaveGame`/`manualLoadGame`/`autosave()` (debounced).

Touch this file when: changing what gets saved/loaded — and remember
the non-negotiable rule: a new `state` field needs a matching line in
BOTH `serializeState()` and `hydrateState()` in the same change, or it
silently resets on the next reload.

## player-actions.js — drawers, equip/use-item, stat points
`DRAWER_IDS`/`toggleDrawer`/`openDrawer`/`closeAllDrawers`, `useItem`/
`equipItem` (refuses below the item's own level/stat requirement —
`getGearRequirements()`, item-tiers.js — with a log message rather than
a silent no-op)/`unequipItem`, `getEffectiveStats`/`recomputeMaxStats`/
`spendStatPoint`.

Touch this file when: changing equip/use-item/stat-point logic.

## tutorial.js — onboarding overlay
`TUTORIAL_STEPS`, `openTutorial`/`closeTutorial`/`tutorialSkip`/
`tutorialBack`/`tutorialNext`/`renderTutorial`. Edited in total isolation
from everything else.

## combat.js — exploration + combat
`ADVENTURE_ZONES`/`goAdventuring()`, `startCombat`/`applyDamageToMonster`/
`monsterRetaliate`/`monsterAutoAttack`/`useMonsterSkill`/`playerAttack`/
`openSpellMenu`/`closeSpellMenu`/`castSpell`/`learnSpell`/`playerFlee`/
`winCombat` (rolls lootRoll/rareRoll/gearRoll independently on every
kill — see the comment above monsters[], content.js, for what each
one is; a successful gearRoll is then scaled to a random tier by
`rollGearDropTier()`)/`endCombat`/`checkDefeat`/`checkLevelUp`.

Touch this file when: changing combat math or encounter rolls.

## town.js — per-building nav/quests + Town Lot economy
`TOWN_HUBS`, `travelTo`/`restAtInn`, enter/leave pairs and quest
accept/report for the Gaffer House, Shop, Hoodoo Doctor's (incl.
`brewPotion`/`brewStatResetPotion`), and Tinker's Workshop, plus
`giveRakeTines`/`turnInVein`, and the Town Lot economy
(`buyTownLot`/`upgradeTownLot`/`upgradeBuilding`).

Touch this file when: changing a quest's logic (except quest2/quest6/
the class Trial — see guild.js), travel/unlock rules, or a building's
upgrade gating.

## guild.js — Casino, Guild, Bounty Board, class Trial, Act 1 finale
Casino (`enterCasino`/`leaveCasino`/`gambleCasino` for ordinary wagering,
`claimCasinoWinnings` for the separate passive-income mechanic —
`regenCasinoWinnings()`/`casinoWinningsCap()` live in economy.js), Guild
(`enterGuild`/`leaveGuild`, `acceptQuest2`/`reportCommanderKill`,
`acceptQuest6`/`reportGnomeKingKill`), the Bounty Board
(`isBountyZoneUnlocked`/`rollNewBounty`/`claimBounty`), the entire
class-capstone Trial system: `acceptClassQuest`/`startClassTrialGuild`/
`startClassTrialCasino`/`startClassTrialHoodoo`/`claimClassPath(chosenStat)`/
`levelUpClassSkill`, and quest 7's Guild-side half:
`acceptQuest7`/`reportGnomeKingDefeat`/`approachPalaceGate` (the
Gnometropolis-side half — the district guardian fights — lives in
gnometropolis.js instead). The Trial is 3 independent themed boss fights
(trialChampion/casinoChampion/hoodooChampion, content.js — see the
comment above trialChampion there for why each uses a different combat
gimmick) — see `classTrialGuildPassed`/`classTrialCasinoPassed`/
`classTrialHoodooPassed`, core.js — that must ALL pass before
`claimClassPath` lets the player choose Meathead/Card Shark/Hexpert.

Quest 6 ("The Gnome King's Throne") is now a retcon setup for quest 7:
you fight `gnomeKingsCaptain` in the Vault, not the real King — he's
already fled to Gnometropolis by the time you get there. The real
`gnomeKing` (content.js, buffed past `trialChampion`) is only reachable
via `approachPalaceGate()` once a class-specific `PALACE_GATE_GEAR` item
is actually equipped, which is earned by defeating that class's district
guardian (see gnometropolis.js) — not bought.

Touch this file when: changing Casino/Guild/bounty logic, the class
Trial/skill system, or quest 6/7's Guild-side accept/report flow.

## gnometropolis.js — Act 1 finale, district side
`challengeDistrictGuardian(districtKey)` — the three Gnometropolis
districts gating quest 7's gear (The Garrison/Meathead, The Rogues'
Den/Card Shark, The Arcane Sanctum/Hexpert). Only the district matching
`state.classTitle` actually starts a fight; the other two respond with
an explanation rather than a silent no-op. The guardians themselves
(`garrisonGuardian`/`roguesDenEnforcer`/`arcaneSanctumGuardian`) and
their guaranteed-loot handling live in content.js/combat.js — this file
is just the player-facing trigger + the "is this your path" gate.

Touch this file when: changing which district maps to which class, or
adding a new district.

## economy.js — shop sell/buy + Biscuit regen + Casino passive income
`isQuestItemSellable`/`sellItemByName`/`getAvailableShopItems`/
`buyItemByName` (rolls tier-2/3 gear's secondary stat(s) fresh via
`rollShopGearStats()` on every purchase — the primary stat/value is
fixed by the definition, only which OTHER stat(s) it gets is random),
`randInt`, the Biscuit (energy) economy
(`BISCUIT_MAX`/`effectiveBiscuitMax()`/`BISCUIT_REGEN_MS`/
`regenBiscuits`/`msUntilNextBiscuit`/`formatMs`/`updateBiscuitDisplay`
+ its `setInterval`), and the Casino's passive income
(`casinoWinningsCap()`/`regenCasinoWinnings()` — same elapsed-real-time-
to-a-cap shape as Biscuits, but the cap is 0/inert until
`buildingUpgrades.casino` is upgraded at least once, and the regen rate
is derived from the cap so every level fills in the same ~1 day
(`CASINO_WINNINGS_CAP`/`CASINO_WINNINGS_FULL_MS`, content.js) rather than
a fixed per-Pop-Tab interval; claimed via `claimCasinoWinnings()`,
guild.js).

Touch this file when: changing shop pricing logic, the Biscuit-regen
economy, or the Casino's passive-income accrual/cap.

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
- Rebalance/add a monster, item, spell, shop listing, or a cost/bonus
  curve -> **content.js** only.
- Add a new save field -> **core.js** (`createDefaultState()`) +
  **save.js** (`serializeState`/`hydrateState`) together.
- Add a new icon -> **icons.js**. Add new monster/scene/portrait art ->
  **art.js**.
- Change how the Pack/Shop/Bounty Board/Hoodoo/Town Lot screen looks or
  reads -> **render-shop.js**. Character/Quest Log screens ->
  **render-character.js**. Cross-screen sync -> **render.js**.
  (+ **index.html** if any of these need new DOM elements.)
- Change combat math or encounter rolls -> **combat.js**.
- Change a per-building quest's logic or travel/unlock rules ->
  **town.js** (or **guild.js** for quest2/quest6/the class Trial).
- Change Casino/Guild/bounty/class-Trial/Casino-passive-income logic ->
  **guild.js** (the regen math itself is in economy.js).
- Change shop sell/buy pricing, Biscuit regen, or the Casino's
  passive-income accrual/cap -> **economy.js**.
- Change an item's rarity color, or add a new tier -> **item-tiers.js**.
- Change what a brand-new character starts with -> **boot.js**
  (`startFreshGame()`).
- Change equip/use-item/stat-point logic -> **player-actions.js**.
- Change the login/register/guest flow or Account drawer ->
  **auth.js**.
- Add a dev/cheat tool -> **dev-tools.js** (+ its hook in
  `renderAccountTab()`, auth.js).
- Change the tutorial -> **tutorial.js**.
- + the `onclick=`/new DOM element in **index.html** if it's a
  brand-new button/screen.

## Refactor history
The original 5 files (`core.js`/`content.js`/`render.js`/`account.js`/
`game.js`, 600-1150+ lines each) were split into the 17 above in one
session once every task was spending significant effort just reading
through large, multi-concern files to find the right section. The split
was verified as a pure mechanical move (no logic changes) via
`node --check` on every file plus a live-browser smoke test (boot,
guest login, combat, shop, Town Lot upgrades, a full
`serializeState()`/`hydrateState()` round-trip, the full-reset dev tool,
and the class Trial) with zero console/page errors before merging.
