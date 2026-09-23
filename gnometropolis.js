/* ---------------- Gnometropolis districts ---------------- */
/* Gnometropolis is the Act 2 town square — not yet in TOWN_HUBS (town.js)
since it has no Inn/Shop/Hoodoo Doctor/Tinker of its own yet, just three
explorable districts branching off it: The Garrison (Meathead),
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
same "no enter/leave screen, just do the thing" shape restAtInn() (town.js)
uses for Gladstone Hollow's Inn tile. HP-only, no cooldown — see
CAMP_REST_HP_PER_BISCUIT (content.js) for why this is deliberately a
worse deal than the Inn rather than a real substitute for one. */
function restAtCamp(){
   if(state.inCombat || state.location !== 'gnometropolis') return;
   regenBiscuits();
   const hpMissing = state.maxHp - state.hp;
   if(hpMissing <= 0){
      clearLog();
      log("You're already at full health — no need to rest.");
      render();
      return;
   }
   const biscuitsWanted = Math.ceil(hpMissing / CAMP_REST_HP_PER_BISCUIT);
   const biscuitsSpent = devMode ? biscuitsWanted : Math.min(biscuitsWanted, state.adventures);
   if(!devMode && biscuitsSpent <= 0){
      clearLog();
      log(`You're out of Biscuits to spend on rest. Next one's ready in ${formatMs(msUntilNextBiscuit())}.`);
      render();
      return;
   }
   const healed = Math.min(hpMissing, biscuitsSpent * CAMP_REST_HP_PER_BISCUIT);
   state.hp += healed;
   if(!devMode) state.adventures -= biscuitsSpent;
   clearLog();
   log(devMode
       ? `You warm yourself by the campfire and patch up ${healed} HP. (dev mode — no Biscuit cost)`
       : `You warm yourself by the campfire and patch up ${healed} HP. (-${biscuitsSpent} Biscuit${biscuitsSpent===1?'':'s'})`);
   render();
   autosave();
}
