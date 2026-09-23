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
setInterval(updateCampCooldownDisplay, 1000);
