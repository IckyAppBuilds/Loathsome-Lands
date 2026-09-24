/* ---------------- Mudroot Warren logic (Act 2 Part 2) ---------------- */
/* New concern, new file — mirrors gnometropolis.js's own role for its
one hub, just for Mudroot Warren instead. restAtBurrow() below is a
straight copy of restAtCamp()'s own shape (gnometropolis.js): same
flat-Biscuit-cost/full-restore/real-time-cooldown mechanics, just its
own BURROW_REST_BISCUIT_COST/BURROW_COOLDOWN_MS (content.js) and its
own lastBurrowRestAt/homeTown value, so resting at the Camp and resting
at the Burrow never share (or clobber) each other's cooldown. */
function restAtBurrow(){
   if(state.inCombat || state.location !== 'mudrootwarren') return;
   regenBiscuits();
   clearLog();
   const cooldownLeft = BURROW_COOLDOWN_MS - (Date.now() - state.lastBurrowRestAt);
   if(cooldownLeft > 0){
      log(`The burrow's still settling from your last rest. Back in ${formatMs(cooldownLeft)}.`);
      render();
      return;
   }
   if(!devMode && state.adventures < BURROW_REST_BISCUIT_COST){
      log(`You're a few Biscuits short of a proper rest. Next one's ready in ${formatMs(msUntilNextBiscuit())}.`);
      render();
      return;
   }
   if(!devMode) state.adventures -= BURROW_REST_BISCUIT_COST;
   state.hp = state.maxHp;
   state.mp = state.maxMp;
   state.showVictory = false;
   state.victoryMonster = null;
   state.lastBurrowRestAt = Date.now();
   state.homeTown = 'mudrootwarren';
   log(devMode
       ? "You curl up in the packed-earth burrow and rest up. You feel merely acceptable again. (dev mode — no Biscuit cost)"
       : `You curl up in the packed-earth burrow and rest up. You feel merely acceptable again. (-${BURROW_REST_BISCUIT_COST} Biscuits)`);
   render();
   autosave();
}

/* Ticks the Burrow's cooldown overlay text (#burrow-cooldown-text,
mudroot-art.js) live, same pattern as updateCampCooldownDisplay()
(gnometropolis.js). */
function updateBurrowCooldownDisplay(){
   const el = document.getElementById('burrow-cooldown-text');
   if(!el) return;
   const cooldownLeft = BURROW_COOLDOWN_MS - (Date.now() - state.lastBurrowRestAt);
   if(cooldownLeft <= 0){ render(); return; }
   el.textContent = formatMs(cooldownLeft);
}
setInterval(updateBurrowCooldownDisplay, 1000);
