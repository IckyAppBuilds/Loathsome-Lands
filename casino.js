/* ---------------- Casino ---------------- */
/* Split out of guild.js (originally "Casino, Guild, Bounty Board, class
Trial, Act 1 finale" all in one file) — fully self-contained, zero
calls into guild.js's own Guild/Bounty Board/Palace code, so it was the
cleanest of the file's several bundled concerns to pull out on its own.
Ordinary gambling (gambleCasino()) is entirely separate from the
Casino tier of the Adventurer's Trial (startClassTrialCasino(),
class-trial.js), which used to piggyback on this function via a
bet-threshold check before the Trial became its own themed boss fight. */
function enterCasino(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'casino';
   clearLog();
   log("You step into the Casino. The Croupier straightens a stack of chips and gives you a knowing look.");
   render();
}

function leaveCasino(){
   if(state.inCombat || state.location !== 'casino') return;
   state.location = 'town';
   clearLog();
   render();
}

function gambleCasino(amount){
   if(state.location !== 'casino' || state.popTabs < amount) return;
   state.popTabs -= amount;
   clearLog();
   if(Math.random() < CASINO_WIN_CHANCE + CASINO_WIN_BONUS[state.buildingUpgrades.casino || 0]){
      /* Flat 2x payout multiplier for everyone, Card Shark included — the
      class skill no longer touches gambling (it's a combat double-attack
      chance now, CARD_SHARK_DOUBLE_ATTACK_CHANCE/playerAttack(), content.js/
      combat.js), so there's nothing left to stack on top of this. */
      const winnings = Math.round(amount * 2);
      state.popTabs += winnings;
      log(`${casinoWinLines[Math.floor(Math.random()*casinoWinLines.length)]} (+${winnings} Pop Tabs)`);
   } else {
      log(`${casinoLoseLines[Math.floor(Math.random()*casinoLoseLines.length)]} (-${amount} Pop Tabs)`);
   }
   render();
}

/* Collects whatever's accrued in state.casinoWinnings (regenCasinoWinnings(),
economy.js — passive, real-time, capped by the Casino's own upgrade
level) and adds it to state.popTabs. Entirely separate from gambleCasino()
above; this is passive income for having upgraded the building at all,
not a payout from any specific bet. */
function claimCasinoWinnings(){
   if(state.location !== 'casino') return;
   regenCasinoWinnings();
   if(state.casinoWinnings <= 0) return;
   const amount = state.casinoWinnings;
   state.popTabs += amount;
   state.casinoWinnings = 0;
   clearLog();
   log(`You collect your cut of the house's take. (+${amount} Pop Tabs)`);
   render();
   autosave();
}
