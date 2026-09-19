/* ---------------- Gnometropolis districts ---------------- */
/* New concern (Act 1 finale rework): Gnometropolis' three named districts
— The Garrison (Meathead), The Rogues' Den (Card Shark), The Arcane
Sanctum (Hexpert) — each guarded by one of the three garrisonGuardian/
roguesDenEnforcer/arcaneSanctumGuardian bosses (content.js), whose defeat
guarantees a drop of that class's PALACE_GATE_GEAR item (see
combat.js's winCombat()). Gets its own file per the project's "new
concern gets a new file" convention (AGENTS.md) rather than growing
guild.js or combat.js. Also the seed of Gnometropolis eventually becoming
a full town hub (a later, separate task) — these three district keys are
meant to plausibly become real building locations then.

One shared function handles all three districts rather than three near-
identical ones, since the only thing that differs between them is which
class/guardian they belong to. Same "gate on inCombat/location/quest
flags, silently no-op if the gate itself isn't met" shape as every other
quest action in this codebase — but a WRONG-district click (gate met,
class just doesn't match) gets a real log response instead of a silent
no-op, since all three buttons are always visible together (render.js)
and clicking the "wrong" one is an expected, common interaction, not a
should-never-happen edge case. */
const DISTRICT_GUARDIANS = {
   garrison:  { class:'Meathead',   guardian: garrisonGuardian,      label:'The Garrison' },
   roguesden: { class:'Card Shark', guardian: roguesDenEnforcer,     label:"The Rogues' Den" },
   sanctum:   { class:'Hexpert',    guardian: arcaneSanctumGuardian, label:'The Arcane Sanctum' },
};

function challengeDistrictGuardian(districtKey){
   if(state.location !== 'gnometropolis' || state.inCombat || !state.quest7Accepted || state.quest7Complete) return;
   const district = DISTRICT_GUARDIANS[districtKey];
   if(!district) return;
   if(state.classTitle !== district.class){
      clearLog();
      log(`${district.label} isn't your path — its guardian only cares about a challenge from a ${district.class}. Find the district that matches who you've become.`);
      render();
      return;
   }
   startCombat(district.guardian);
   render();
}
