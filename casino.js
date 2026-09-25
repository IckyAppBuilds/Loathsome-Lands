/* ---------------- Casino ---------------- */
/* Split out of guild.js (originally "Casino, Guild, Bounty Board, class
Trial, Act 1 finale" all in one file) — fully self-contained, zero
calls into guild.js's own Guild/Bounty Board/Palace code, so it was the
cleanest of the file's several bundled concerns to pull out on its own.
Blackjack (below) is entirely separate from the Casino tier of the
Adventurer's Trial (startClassTrialCasino(), class-trial.js), which
used to piggyback on this file's own gambling function via a
bet-threshold check before the Trial became its own themed boss fight. */
function enterCasino(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'casino';
   clearLog();
   log("You step into the Casino. The Croupier straightens a stack of chips and gives you a knowing look.");
   render();
}

function leaveCasino(){
   /* Blocked while at the Blackjack table at all (state.blackjack truthy,
   any phase) — enterBlackjackTable()/leaveBlackjackTable() below are the
   only door in and out of that screen; leaveCasino() itself is Casino
   lobby -> town, a level up. render.js hides this button entirely
   whenever state.blackjack is set, this is defense-in-depth against a
   direct call. */
   if(state.inCombat || state.location !== 'casino' || state.blackjack) return;
   state.location = 'town';
   clearLog();
   render();
}

/* ---------------- Blackjack ---------------- */
/* Replaces the old flat coin-flip (gambleCasino(), Bet 5/10/25 for a
CASINO_WIN_CHANCE-ish shot at a flat 2x) per explicit direction — a real
card game instead of "straight betting." Deck/payout/flavor-line data
all live in content.js, same split every other content table in this
game already uses; this file is just the deal/hit/stand/resolve logic
plus its own render function (renderBlackjackTable() below), same
"domain file owns its own render function" shape auth.js/noticeboard.js/
tutorial.js already use rather than growing render-shop.js with a
fourth building's worth of markup-building.

state.blackjack is null in the Casino LOBBY (spell trainer/House's Cut/
Leave visible, no cards on screen) — enterBlackjackTable() below is the
only way in. Once set, it's { bet, playerHand, dealerHand, phase,
resultText }, and the whole screen swaps to just the table: no spell
trainer, no House's Cut, nothing but the cards and whichever action row
fits `phase` (render.js) — same "combat gets its own uncluttered screen"
shape state.inCombat already has, per explicit request to mirror it.
`phase` is 'betting' (sat down, no hand dealt yet — Deal buttons only),
'playerTurn' (hit-or-stand), or 'resolved' (hand's over, Deal buttons
return so the next hand can start without leaving the table). Deliberately
NOT part of serializeState() (save.js) — same reasoning as state.inCombat/
state.monster not being saved: a reload should never resume mid-hand or
mid-sitting-at-the-table. */
function enterBlackjackTable(){
   if(state.inCombat || state.location !== 'casino' || state.blackjack) return;
   state.blackjack = { bet:0, playerHand:[], dealerHand:[], phase:'betting', resultText:'' };
   clearLog();
   log("You take a seat at the Blackjack table. The Croupier waits for your bet.");
   render();
}
/* Only reachable from 'betting'/'resolved' (render.js hides the button
during 'playerTurn' — defense-in-depth here too) — you can always walk
away between hands, just not out from under a live bet. */
function leaveBlackjackTable(){
   if(state.inCombat || state.location !== 'casino' || !state.blackjack || state.blackjack.phase==='playerTurn') return;
   state.blackjack = null;
   clearLog();
   render();
}
function drawCard(){
   return {
      rank: CARD_RANKS[Math.floor(Math.random()*CARD_RANKS.length)],
      suit: CARD_SUITS[Math.floor(Math.random()*CARD_SUITS.length)],
   };
}
function cardValue(rank){
   if(rank==='A') return 11;
   if(rank==='J' || rank==='Q' || rank==='K') return 10;
   return parseInt(rank, 10);
}
/* Standard soft-total scoring: every Ace counts as 11 first, then each
one still counting as 11 drops to 1 (i.e. -10 off the running total)
for as long as the hand's still bust — so A+6+8 (25) correctly reads as
a hard 15, not a bust. */
function handTotal(hand){
   let total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0);
   let softAces = hand.filter(c => c.rank==='A').length;
   while(total > 21 && softAces > 0){ total -= 10; softAces--; }
   return total;
}
function isNaturalBlackjack(hand){
   return hand.length===2 && handTotal(hand)===21;
}
function randomLine(pool){ return pool[Math.floor(Math.random()*pool.length)]; }

function dealBlackjack(bet){
   if(state.location !== 'casino' || state.inCombat) return;
   /* Only from the table itself, and only between hands — 'betting' is
   the just-sat-down state, 'resolved' is right after a previous hand,
   both mean "no cards on the table right now." */
   if(!state.blackjack || state.blackjack.phase==='playerTurn') return;
   if(state.popTabs < bet) return;
   state.popTabs -= bet;
   state.blackjack = { bet, playerHand:[drawCard(), drawCard()], dealerHand:[drawCard(), drawCard()], phase:'playerTurn', resultText:'' };
   clearLog();
   /* A natural on either side ends the hand immediately — nothing left
   for the player to decide, same as real blackjack. */
   if(isNaturalBlackjack(state.blackjack.playerHand) || isNaturalBlackjack(state.blackjack.dealerHand)){
      resolveBlackjack();
      return;
   }
   log(`You put up ${bet} Pop Tabs and the Croupier deals the cards.`);
   render();
   autosave();
}

function blackjackHit(){
   if(!state.blackjack || state.blackjack.phase !== 'playerTurn') return;
   state.blackjack.playerHand.push(drawCard());
   clearLog();
   const total = handTotal(state.blackjack.playerHand);
   if(total > 21){
      state.blackjack.phase = 'resolved';
      state.blackjack.resultText = `${randomLine(blackjackBustLines)} (-${state.blackjack.bet} Pop Tabs)`;
      log(state.blackjack.resultText);
   } else {
      log(`You draw a card — ${total}.`);
   }
   render();
   autosave();
}

function blackjackStand(){
   if(!state.blackjack || state.blackjack.phase !== 'playerTurn') return;
   /* Dealer plays out in full, synchronously, right here — no separate
   visible "dealer's turn" phase (would just be an extra render tick with
   nothing for the player to do), same instant-resolution shape a rare
   monster's own kill-vs-not-kill check already resolves in one go. */
   while(handTotal(state.blackjack.dealerHand) < BLACKJACK_DEALER_STAND){
      state.blackjack.dealerHand.push(drawCard());
   }
   resolveBlackjack();
}

/* The one place every hand ends, win/lose/push/bust alike (except a
mid-hand player bust, handled inline in blackjackHit() above since
there's nothing left to compare once you're over 21) — mirrors
winCombat()'s role as combat's own single resolution funnel. */
function resolveBlackjack(){
   const bj = state.blackjack;
   const playerTotal = handTotal(bj.playerHand);
   const dealerTotal = handTotal(bj.dealerHand);
   const playerBJ = isNaturalBlackjack(bj.playerHand);
   const dealerBJ = isNaturalBlackjack(bj.dealerHand);
   const bonus = CASINO_WIN_BONUS[state.buildingUpgrades.casino || 0];
   bj.phase = 'resolved';
   clearLog();

   function win(multiplier, line){
      const winnings = Math.round(bj.bet * multiplier * (1+bonus));
      state.popTabs += bj.bet + winnings;
      bj.resultText = `${line} (+${winnings} Pop Tabs)`;
   }
   function push(line){
      state.popTabs += bj.bet;
      bj.resultText = `${line} Your bet's returned.`;
   }
   function lose(line){
      bj.resultText = `${line} (-${bj.bet} Pop Tabs)`;
   }

   if(playerBJ && dealerBJ) push(randomLine(blackjackPushLines));
   else if(playerBJ) win(BLACKJACK_NATURAL_PAYOUT, randomLine(blackjackNaturalLines));
   else if(dealerBJ) lose(randomLine(blackjackDealerBJLines));
   else if(dealerTotal > 21) win(BLACKJACK_WIN_PAYOUT, randomLine(blackjackDealerBustLines));
   else if(playerTotal > dealerTotal) win(BLACKJACK_WIN_PAYOUT, randomLine(blackjackWinLines));
   else if(playerTotal === dealerTotal) push(randomLine(blackjackPushLines));
   else lose(randomLine(blackjackLoseLines));

   log(bj.resultText);
   render();
   autosave();
}

/* One card as a small bordered chip, red for Hearts/Diamonds — classic
card coloring, purely cosmetic (nothing reads suit for scoring). */
function cardChipHtml(card){
   const red = (card.suit==='♥' || card.suit==='♦') ? ' red' : '';
   return `<span class="card-chip${red}">${card.rank}${card.suit}</span>`;
}
/* Renders the live table (#blackjack-table, index.html) — dealer's
second card stays face-down (a plain "?" chip, real total withheld)
until the hand resolves, same "don't show what a real player couldn't
see yet" reasoning a monster's own hidden stats never get exposed either.
Hidden while state.blackjack is null (render.js), i.e. in the Casino
lobby rather than at the table at all. */
function renderBlackjackTable(){
   const el = document.getElementById('blackjack-table');
   if(!el || !state.blackjack) return;
   const bj = state.blackjack;
   if(bj.phase==='betting'){
      el.innerHTML = `<div class="block-title">Blackjack</div><div class="quest-desc">The Croupier waits for your bet.</div>`;
      return;
   }
   const dealerHidden = bj.phase==='playerTurn';
   const dealerCardsHtml = dealerHidden
      ? cardChipHtml(bj.dealerHand[0]) + ' <span class="card-chip">?</span>'
      : bj.dealerHand.map(cardChipHtml).join(' ');
   const dealerTotalText = dealerHidden ? '?' : handTotal(bj.dealerHand);
   el.innerHTML = `
   <div class="block-title">Blackjack — ${bj.bet} Pop Tabs on the table</div>
   <div class="quest-desc">Dealer: ${dealerCardsHtml} — Total: ${dealerTotalText}</div>
   <div class="quest-desc">You: ${bj.playerHand.map(cardChipHtml).join(' ')} — Total: ${handTotal(bj.playerHand)}</div>
   ${bj.phase==='resolved' ? `<div class="quest-progress">${bj.resultText}</div>` : ''}
   `;
}

/* Collects whatever's accrued in state.casinoWinnings (regenCasinoWinnings(),
economy.js — passive, real-time, capped by the Casino's own upgrade
level) and adds it to state.popTabs. Entirely separate from Blackjack
above; this is passive income for having upgraded the building at all,
not a payout from any specific hand. */
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
