/* ---------------- Gnometropolis districts ---------------- */
/* Gnometropolis is the Act 2 town square — no Shop/Hoodoo Doctor/Tinker
of its own yet, just the Camp (restAtCamp() below) plus three explorable
districts branching off it: The Garrison (Meathead),
The Rogues' Den (Card Shark), The Arcane Sanctum (Hexpert), plus the
Palace itself (no district, one scripted fight — see approachPalaceGate(),
guild.js). Each district is an ordinary ADVENTURE_ZONES entry (combat.js)
reached via travelTo() (town.js) — random encounters happen while
exploring, same as Commons/Sewers/Quarry/Vault. A district's own guardian
(garrisonGuardian/roguesDenEnforcer/arcaneSanctumGuardian, content.js) is
a RARE encounter within that district, gated on class match, not a
direct-challenge button — see the *Hunt blocks in goAdventuring()
(combat.js). Defeating a guardian sets its own *GuardianDefeated flag
(core.js) and guarantees a drop of that class's PALACE_GATE_GEAR item
(content.js's winCombat()).

This file just holds DISTRICT_GUARDIANS, the single source of truth for
which class/guardian/label belongs to which district key — read by
render.js instead of keeping its own duplicate mapping. Gets its own file
per the project's "new concern gets a new file" convention (AGENTS.md)
rather than living inline in guild.js or combat.js. */
const DISTRICT_GUARDIANS = {
   garrison:  { class:'Meathead',   guardian: garrisonGuardian,      label:'The Garrison' },
   roguesden: { class:'Card Shark', guardian: roguesDenEnforcer,     label:"The Rogues' Den" },
   sanctum:   { class:'Hexpert',    guardian: arcaneSanctumGuardian, label:'The Arcane Sanctum' },
};

/* The Camp — a direct action triggered from the town square's own tile
(data-action="camp", artGnometropolisSquare() in gnometropolis-art.js),
same "no enter/leave screen, just do the thing" shape restAtInn()
(town.js) uses for Gladstone Hollow's Inn tile, and now the same
mechanics too: flat CAMP_REST_BISCUIT_COST, full HP+MP restore, a
real-time CAMP_COOLDOWN_MS cooldown (content.js) — just no
INN_FREE_REST_CHANCE-style upgrade tier, since the Camp isn't part of
the Town Lot's buildingUpgrades. The one real difference: a successful
rest here claims Gnometropolis as state.homeTown (unlike just walking
into the square, see travelTo()'s tail, town.js) — resting is the
deliberate "I live here now" act, not mere presence. */
function restAtCamp(){
   if(state.inCombat || state.location !== 'gnometropolis') return;
   regenBiscuits();
   clearLog();
   const cooldownLeft = CAMP_COOLDOWN_MS - (Date.now() - state.lastCampRestAt);
   if(cooldownLeft > 0){
      log(`The campfire's still dying down from your last rest. Back in ${formatMs(cooldownLeft)}.`);
      render();
      return;
   }
   if(!devMode && state.adventures < CAMP_REST_BISCUIT_COST){
      log(`You're a few Biscuits short of a proper rest. Next one's ready in ${formatMs(msUntilNextBiscuit())}.`);
      render();
      return;
   }
   if(!devMode) state.adventures -= CAMP_REST_BISCUIT_COST;
   state.hp = state.maxHp;
   state.mp = state.maxMp;
   state.showVictory = false;
   state.victoryMonster = null;
   state.lastCampRestAt = Date.now();
   state.homeTown = 'gnometropolis';
   log(devMode
       ? "You warm yourself by the campfire and rest up. You feel merely acceptable again. (dev mode — no Biscuit cost)"
       : `You warm yourself by the campfire and rest up. You feel merely acceptable again. (-${CAMP_REST_BISCUIT_COST} Biscuits)`);
   render();
   autosave();
}

/* Ticks the Camp's cooldown overlay text (#camp-cooldown-text,
gnometropolis-art.js) live, same pattern as town.js's
updateInnCooldownDisplay(). Guarded on the element existing — it's only
in the DOM while standing in the Gnometropolis square with the
cooldown actually active. */
function updateCampCooldownDisplay(){
   const el = document.getElementById('camp-cooldown-text');
   if(!el) return;
   const cooldownLeft = CAMP_COOLDOWN_MS - (Date.now() - state.lastCampRestAt);
   if(cooldownLeft <= 0){ render(); return; }
   el.textContent = formatMs(cooldownLeft);
}

/* The Act 2 Shop — new building tile in the square, only open once
quest7Complete (same gate the new Guild uses, guild.js). Reuses the
enter/leave pair shape every other building in the game follows.
renderGnomeShop() (render-shop.js) does the actual listing. */
function enterGnomeShop(){
   if(state.inCombat || state.location !== 'gnometropolis' || !state.quest7Complete) return;
   state.location = 'gnomeshop';
   gnomeShopTab = 'food'; /* always open on the Food tab — see render-shop.js */
   clearLog();
   log("You step into a converted vault, now stacked with plundered gear no one's left to claim.");
   render();
}
function leaveGnomeShop(){
   if(state.inCombat || state.location !== 'gnomeshop') return;
   state.location = 'gnometropolis';
   clearLog();
   render();
}

/* ---------------- Gnometropolis's own Town Lot ---------------- */
/* Mirrors buyTownLot()/upgradeTownLot()/upgradeBuilding() (town.js)
exactly, reading/writing state.gnomeLotTier/state.gnomeBuildingUpgrades
and GNOME_LOT_TIER_COST/GNOME_BUILDING_UPGRADES/gnomeBuildingUpgradeCost()
(content.js) instead of their Gladstone equivalents — see that
content.js section's own comment for why this is a separate parallel
system rather than one generalized, hub-keyed one. Same gate as the
Guild/Shop above: only reachable once quest7Complete. */
function enterGnomeTownLot(){
   if(state.inCombat || state.location !== 'gnometropolis' || !state.quest7Complete) return;
   state.location = 'gnometownlot';
   clearLog();
   log(state.gnomeLotTier === 0
       ? "A shuttered stall sits empty at the edge of the square. Could be something, if you cleared it out."
       : "You step into your reclaimed vault. There's always something more to build.");
   render();
}
function leaveGnomeTownLot(){
   if(state.inCombat || state.location !== 'gnometownlot') return;
   state.location = 'gnometropolis';
   clearLog();
   render();
}
function buyGnomeTownLot(){
   if(state.location !== 'gnometownlot' || state.gnomeLotTier !== 0) return;
   const cost = GNOME_LOT_TIER_COST[1];
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.gnomeLotTier = 1;
   clearLog();
   log(`You buy the shuttered stall for ${cost} Pop Tabs and start clearing it out.`);
   render();
   autosave();
}
function upgradeGnomeTownLot(){
   if(state.location !== 'gnometownlot' || state.gnomeLotTier < 1 || state.gnomeLotTier >= GNOME_LOT_TIER_MAX) return;
   const next = state.gnomeLotTier + 1;
   const cost = GNOME_LOT_TIER_COST[next];
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.gnomeLotTier = next;
   clearLog();
   log(`You upgrade the vault to ${GNOME_LOT_TIER_NAMES[next]} for ${cost} Pop Tabs.`);
   render();
   autosave();
}
function upgradeGnomeBuilding(key){
   if(state.location !== 'gnometownlot' || state.gnomeLotTier < 1) return;
   const info = GNOME_BUILDING_UPGRADES.find(b => b.key === key);
   if(!info) return;
   const level = state.gnomeBuildingUpgrades[key] || 0;
   if(level >= GNOME_BUILDING_UPGRADE_MAX) return;
   if(level >= state.gnomeLotTier) return;
   const cost = gnomeBuildingUpgradeCost(level);
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.gnomeBuildingUpgrades[key] = level + 1;
   clearLog();
   log(`You invest ${cost} Pop Tabs into ${info.name}, raising it to level ${level+1}.`);
   render();
   autosave();
}
setInterval(updateCampCooldownDisplay, 1000);
