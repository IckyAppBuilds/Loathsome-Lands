/* ---------------- Reusable multi-boss gauntlets ---------------- */
/* Generalizes the Act 1 Palace Gate's own one-off approach
(approachPalaceGate()/palaceGauntletProgress/PALACE_GUARDS — guild.js/
content.js, both left completely untouched by this file) into something
a SECOND and THIRD gauntlet can reuse by just adding an entry below,
instead of hand-copying that whole pattern again — per explicit request
for "more of those." New concern, new file per the project's own
convention. Loads after warrensear-content.js/emberwarren-content.js
(whose boss objects this file's own GAUNTLETS registry references BY
VALUE at parse time) and after combat.js/render.js (whose
startCombat()/render() this file's functions call, though only inside
function bodies, so that ordering is for readability, not correctness).

Each entry:
- `zone` — where the approach button/action becomes available.
- `guards` — an ordered array of monster templates, fought one at a
  time, in order, each a real step toward the one at the end.
- `finalBoss` — fought once every guard is down.
- `requiredFlag` — a state.* boolean that must already be true before
  the FIRST click does anything (mirrors approachPalaceGate()'s own
  quest7Accepted check).
- `doneFlag` — the state.* boolean the final boss's own kill sets (see
  winCombat()'s gauntlet-detection block, combat.js); once true,
  approachGauntlet() refuses, same as Palace's own quest7RareDefeated
  check refusing a re-run.
- `startLabel`/`progressLabel(guardsLeft)`/`finalLabel` — button text,
  mirroring the palace-gate-btn's own progress-tracking text
  (render.js) but generalized to any gauntlet id.
- `guardDefeatLine(guardsLeft)`/`finalVictoryLine` — the log lines
  winCombat() prints on each step, mirroring wasPalaceGuard's own
  guards-left flavor and wasRealGnomeKing's own finale flavor. */
const GAUNTLETS = {
   ledgerCommittee: {
      zone: 'ledgervault',
      guards: [committeeAuditor],
      finalBoss: vaultKeeper,
      requiredFlag: 'quest14Accepted',
      doneFlag: 'vaultKeeperDefeated',
      startLabel: 'Approach the Committee',
      progressLabel: (guardsLeft) => `Face the Next Auditor (${guardsLeft} left)`,
      finalLabel: 'Confront the Vault Keeper',
      guardDefeatLine: (guardsLeft) => guardsLeft > 0
         ? `${guardsLeft} more auditor${guardsLeft===1?'':'s'} between you and whatever's actually behind that door.`
         : "Nothing left between you and whatever's actually behind that door.",
      finalVictoryLine: "The door doesn't creak open so much as simply stop being a door. Whatever the Ledger Vault was really guarding, it's yours to see now.",
   },
   moleCouncil: {
      zone: 'gearworks',
      guards: [tunnelCaptain, foundryMarshal],
      finalBoss: warrenMother,
      requiredFlag: 'quest15Accepted',
      doneFlag: 'warrenMotherDefeated',
      startLabel: 'Approach the Mole Council',
      progressLabel: (guardsLeft) => `Face the Next Captain (${guardsLeft} left)`,
      finalLabel: 'Confront the Warren-Mother',
      guardDefeatLine: (guardsLeft) => guardsLeft > 0
         ? `${guardsLeft} more stand between you and whoever's actually been running this war.`
         : "Nothing left between you and whoever's actually been running this war.",
      finalVictoryLine: "The warren-mother falls, and for the first time since Mudroot Warren cracked open, the tunnels around you go completely, permanently quiet.",
   },
};

/* Mirrors palaceGauntletProgress exactly — a plain object of transient
per-gauntlet counters, never saved, same convention combatSubView
(combat.js) uses for UI/session state that shouldn't survive a reload.
Reset by resetGauntlet()/resetAllGauntlets() below, called from the
same two places resetPalaceGauntlet() already is — travelTo() (town.js,
leaving a gauntlet zone for anywhere else) and checkDefeat() (combat.js,
a defeat that sends the player away). Not resetting on a mere page
reload needs no special handling, same reasoning as Palace's own. */
let gauntletProgress = {};
function resetGauntlet(id){ gauntletProgress[id] = 0; }
function resetAllGauntlets(){ Object.keys(GAUNTLETS).forEach(resetGauntlet); }

/* Each click advances exactly one step — a guard while any are left,
the final boss once they're all down. winCombat()'s own gauntlet-
detection block (combat.js) is what actually increments
gauntletProgress[id] on a guard's kill and sets doneFlag on the final
boss's. */
function approachGauntlet(id){
   const cfg = GAUNTLETS[id];
   if(!cfg) return;
   if(state.inCombat || state.location !== cfg.zone || !state[cfg.requiredFlag] || state[cfg.doneFlag]) return;
   const progress = gauntletProgress[id] || 0;
   startCombat(progress < cfg.guards.length ? cfg.guards[progress] : cfg.finalBoss);
   render();
}

/* Read by render.js's own gauntlet button-text sync, same role
palaceGauntletProgress/PALACE_GUARDS.length play for palace-gate-btn's
text there. */
function gauntletButtonText(id){
   const cfg = GAUNTLETS[id];
   if(!cfg) return '';
   const progress = gauntletProgress[id] || 0;
   if(progress === 0) return cfg.startLabel;
   if(progress < cfg.guards.length) return cfg.progressLabel(cfg.guards.length - progress);
   return cfg.finalLabel;
}

/* Which gauntlet (by id) `monsterName` belongs to, and whether it's
that gauntlet's finalBoss rather than one of its guards — checked once
per kill by winCombat() (combat.js) instead of that file needing a
hand-written wasX const per boss per gauntlet, the way every OTHER
named boss in the game still works. Returns null when the kill wasn't
part of any gauntlet at all (every other boss keeps using its own wasX
const, untouched). */
function matchGauntletKill(monsterName){
   for(const id in GAUNTLETS){
      const cfg = GAUNTLETS[id];
      if(cfg.finalBoss.name === monsterName) return { id, isFinalBoss: true };
      if(cfg.guards.some(g => g.name === monsterName)) return { id, isFinalBoss: false };
   }
   return null;
}
