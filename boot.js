/* ---------------- Boot ---------------- */
/* IMPORTANT — LOAD ORDER: this file must be the LAST <script> tag in
index.html, after every other script (including the other game.js-split
files: combat.js/town.js/guild.js/economy.js, plus core.js/content.js/
render.js/account.js and whatever they depend on). The block at the very
bottom of this file runs immediately at parse time — it's the actual
game-start trigger — so everything it calls (renderGate()/closeGate()/
startFreshGame(), and everything those in turn touch) must already be
defined by the time this file is parsed. Whoever wires up index.html for
this split MUST put this file last. */

/* ---------------- Town scene click handling (delegated, works on dynamically-inserted SVG) ---------------- */
document.getElementById('scene-art').addEventListener('click', function(e){
   const el = e.target.closest('[data-action]');
   if(!el) return;
   const action = el.getAttribute('data-action');
   if(action === 'gaffer') enterGafferHouse();
   else if(action === 'rest') restAtInn();
   else if(action === 'shop') enterShop();
   else if(action === 'hoodoo') enterHoodoo();
   else if(action === 'guild') enterGuild();
   else if(action === 'casino') enterCasino();
   else if(action === 'tinker') enterTinker();
   else if(action === 'townlot') enterTownLot();
   else if(action === 'fountain') enterNoticeBoard();
   else if(action === 'garrison') travelTo('garrison');
   else if(action === 'roguesden') travelTo('roguesden');
   else if(action === 'sanctum') travelTo('sanctum');
   else if(action === 'palace') travelTo('palace');
   else if(action === 'camp') restAtCamp();
   else if(action === 'gnomeguild') enterGnomeGuild();
});

/* Seed a brand-new run: starter gear (equipped) and a couple of starter
items, then the opening log line. Called for a guest, for a freshly
registered/logged-in account with no save yet, and (in degraded mode,
no Supabase) unconditionally at boot. Being the single choke point for
all three of those cases is also exactly why the tutorial overlay
(account.js) opens itself here, at the very end — it's shown once per
brand-new run and never for a returning player whose save was found
(that path is enterGameAfterAuth(true), which never calls this). */
function startFreshGame(){
   Object.keys(starterGear).forEach(slot => { state.equipment[slot] = {...starterGear[slot]}; });
   recomputeMaxStats();
   state.inventory.push({...healItems[0]});
   clearLog();
   log("You arrive in Gladstone Hollow. A cottage on the square has a rather urgent-looking flag over it.");
   if(devMode) log("Dev mode ON (via ?dev=1) — Biscuits won't run out.");
   render();
   openTutorial();
}

if(sb){
   /* Show the gate immediately with a login/register form (no need to wait
   on the network) — if a persisted session turns up via the
   INITIAL_SESSION event above, it'll auto-continue past this. */
renderGate();
} else {
   /* No login service available this session — there's nothing to gate on,
   so skip straight to play. */
closeGate();
   startFreshGame();
}
