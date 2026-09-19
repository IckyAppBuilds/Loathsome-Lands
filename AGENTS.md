# The Loathsome Lands — file map

A single-page browser RPG. No build step, no bundler, no modules — plain
HTML/CSS/`<script>` tags, all globals. Script load order in `index.html`
matters because later files depend on globals the earlier ones define:

```
supabase (CDN) -> core.js -> content.js -> render.js -> account.js -> game.js
```

Read this before opening a file — it's usually enough to know which one
file to change without reading the other four.

## index.html
DOM skeleton for every screen: pre-game gate, tutorial overlay, header
stat bars, the `#stage` area (shared by town square, every building
interior, and combat), all five drawers (Pack/Map/Character/Quests/
Account), and the tab bar. Almost every interactive element is wired with
an inline `onclick="someFunction()"` straight into a function defined in
one of the JS files — there's no separate event-binding layer.

Touch this file when: adding a new screen/drawer/button element, or
wiring a brand-new `onclick` handler name that doesn't exist yet.

## core.js — shared state & visual assets
- Supabase client (`sb`) plus a guard for when the CDN script fails to
  load (game still boots; only the Account drawer degrades).
- Session-only auth plumbing: `acctSession`, `acctUsername`, `authView`/
  `authBusy`, `gateOpen`, `lastOfflineBiscuitGain`. Not save data.
- `devMode` (set via `?dev=1` in the URL).
- The single global `state` object — every piece of save-worthy player
  state: hp/mp, Biscuits/Pop Tabs/Bounty Tokens, level/xp, the four core
  stats (beef/zip/grit/hoodoo), equipment, inventory, `location`, all six
  main quest flags plus the class quest, Town Lot/building upgrade
  levels, the active bounty, and the rare-drops log. This is the object
  `serializeState()`/`hydrateState()` in account.js round-trip to Supabase.
- `STAT_LABELS`/`STAT_HINTS`/`SLOT_LABELS`/`SLOT_ORDER` constants.
- ~90 `icon*()` functions — inline SVG for every item icon.
- ~40 `art*()` functions — inline SVG for scene art (the town square, its
  building states, and every monster).

Touch this file when: adding a new save field, a new item/equipment icon,
new monster or scene art, or changing the Supabase project URL/key.

## content.js — game data tables
`monsters[]` (per-zone, each with its own optional `rareDrop`), the three
unique spawns (`gnomeCommander`, `diggerBot`, `gnomeKing`) with their own
spawn-chance constants, `ZONE_DIFFICULTY`/`ZONE_LABELS`,
`noncombatEvents`/`hazardEvents` (exploration flavor), `healItems`,
`starterGear`, `shopGearItems` (+ tier 2), `shopBuyItems`, `spells`,
`potionIngredients`, `veinIngredients`, quest-completion flags, class
titles, casino odds/flavor lines, `BOUNTY_TEMPLATES`, and the Town
Lot/building-upgrade cost tables.

Touch this file when: adding or rebalancing a monster, item, spell, shop
listing, casino odds, or town-lot/building cost. Rarely needs a matching
change elsewhere unless you're adding a new mechanic, not just new data.

## render.js — DOM output only
`render()` is the main screen sync (bars, which location view is shown,
quest banners, drawer counts), plus per-drawer renderers:
`renderInventory`, `renderShop`, `renderBountyBoard`, `renderHoodooShop`,
`renderTownLot`, `renderSpellMenu`, `renderCharacterDrawer` (and its
sub-blocks `renderRareFindsBlock`/`renderStatsBlock`/
`renderEquipmentBlock`), `renderQuestLogDrawer`. Also the message log
(`log()`/`clearLog()`) and a few counting helpers shared with game.js
(`countRakeTines`, `countPotionIngredientsHeld`, `countVeinIngredientsHeld`).

This file only reads `state`/content.js data and writes to the DOM — it
never mutates game state. Touch it when a screen's layout or wording
needs to change but the underlying rule doesn't.

## account.js — identity, persistence, and a grab-bag of state-mutating UI actions
Despite the name this is the widest-scope file in the project:
- **Auth/gate**: `authSetView`/`renderAuthUI`/`renderAuthForms`/
  `acctMsg`/`showGate`/`closeGate`/`renderGate`/`playAsGuest`/
  `enterGameAfterAuth` — the login/register/guest flow, shown both
  full-screen pre-game and inside the Account drawer.
- **Dev/cheat tools**, gated by `isDevAccount()` (see `DEV_USERNAMES`):
  `resetLevelDev`, `resetQuestsDev`, `setLevelDev`, `setBiscuitsDev`,
  `setPopTabsDev`, `setBountyTokensDev`, `setLotTierDev`,
  `maxBuildingUpgradesDev`, `setStatsDev`, `giveItemDev`/`devItemList`,
  `clearInventoryDev`, `setQuestStageDev` (+ `QUEST_DEV_STAGES`) — all
  only reachable from the Account drawer for the designated dev account.
- **`renderAccountTab()`**: the Account drawer body.
- **Save/load**: `allItemDefs`/`itemByName`/`serializeItem`/
  `hydrateItem`, `serializeState()`/`hydrateState()` (the full
  state<->save round-trip), `autosave()` (debounced).
- **Drawer plumbing**: `DRAWER_IDS`, `toggleDrawer`/`openDrawer`/
  `closeAllDrawers`.
- **Inventory/equipment actions** that mutate state: `useItem`,
  `equipItem`, `unequipItem`, `getEffectiveStats`/`recomputeMaxStats`,
  `spendStatPoint`.
- **Tutorial**: `TUTORIAL_STEPS`, `openTutorial`/`closeTutorial`/
  `tutorialSkip`/`tutorialBack`/`tutorialNext`/`renderTutorial`.

Touch this file when: changing what gets saved/loaded, adding a dev
cheat, changing the login/guest flow, or changing equip/use-item/
stat-point logic.

## game.js — core gameplay loop
- **Exploration**: `ADVENTURE_ZONES`/`TOWN_HUBS`, `goAdventuring()`.
- **Combat**: `startCombat`/`monsterRetaliate`/`playerAttack`/
  `openSpellMenu`/`closeSpellMenu`/`castSpell`/`learnSpell`/
  `playerFlee`/`winCombat`/`endCombat`/`checkDefeat`/`checkLevelUp`.
- **Town navigation & per-building quest flows**: `travelTo`,
  `restAtInn`, enter/leave pairs for the Gaffer House, Shop, Hoodoo,
  Tinker, Town Lot, Casino, and Guild — plus every quest's own
  accept/report function (`acceptQuest`…`acceptQuest6`,
  `reportCommanderKill`, `reportDiggerBotKill`, `reportGnomeKingKill`,
  `turnInVein`, `acceptClassQuest`/`claimClassPath`, `giveRakeTines`).
- **Town Lot economy**: `buyTownLot`/`upgradeTownLot`/`upgradeBuilding`.
- **Casino**: `enterCasino`/`leaveCasino`/`gambleCasino`.
- **Shop economy**: `sellItemByName`/`buyItemByName`/
  `getAvailableShopItems`/`isQuestItemSellable`.
- **Bounty board**: `isBountyZoneUnlocked`/`rollNewBounty`/`claimBounty`.
- **Potion brewing**: `brewPotion`.
- **Biscuits (energy) economy**: `BISCUIT_MAX`/`BISCUIT_REGEN_MS`,
  `regenBiscuits`/`msUntilNextBiscuit`/`formatMs`/`updateBiscuitDisplay`.
- `startFreshGame()`: resets `state` for a brand-new character.

Touch this file when: changing combat math, a quest's logic, travel/
unlock rules, or the Biscuit-regen economy.

## styles.css
Single stylesheet, CSS custom properties near the top (`--red`, `--blue`,
`--tan`, etc.) driving header bars, stage/scene-art sizing, shop/drawer/
tabbar layout, and button variants (`btn-primary`/`btn-attack`/
`btn-cast`/`btn-flee`/`btn-secondary`). No preprocessor — add a new rule
near the section it belongs to.

## Quick lookup — "I want to change X"
- Rebalance/add a monster, item, spell, or shop listing -> **content.js** only.
- Add a new save field -> **core.js** (`state` object) + **account.js**
  (`serializeState`/`hydrateState`) together.
- Change how a screen looks/reads -> **render.js** (+ **index.html** if it
  needs new DOM elements).
- Change what a button does -> **game.js** (or **account.js** for equip/
  use-item/tutorial/auth actions), + the `onclick=` in **index.html** if
  it's a brand-new button.
- Add a new icon/scene art asset -> **core.js**.
- Add a dev/cheat tool -> **account.js** (`isDevAccount`-gated functions +
  its hook in `renderAccountTab()`).
- Change combat math, quest logic, or travel/economy rules -> **game.js**.

## Integrity check (2026-09-18)
- All 7 tracked files staged from the desktop match their on-disk byte
  sizes exactly — no truncation in transfer.
- `account.js`, `content.js`, `core.js`, `game.js`, `render.js` all pass
  `node --check` (syntactically valid).
- `index.html`: 6 opening/6 closing `<script>` tags, `<html>`/`</html>`
  present.
- `styles.css`: braces balanced (175 open / 175 close).
- Git: `HEAD` -> `refs/heads/main` -> `8f9e90f...`, matching
  `origin/main` after a clean fast-forward pull from
  `https://github.com/IckyAppBuilds/Loathsome-Lands`. No stuck
  merge/rebase state found.
