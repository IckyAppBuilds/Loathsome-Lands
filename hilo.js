/* ---------------- Rogues' Den: Hi-Lo ---------------- */
/* Own file, mirroring casino.js's own shape exactly (enter/leave the
table, play/guess/cash-out, its own render function) — new concern,
new file, per the project's usual convention. Reuses CARD_RANKS/
CARD_SUITS/drawCard()/cardChipHtml() (content.js/casino.js) rather than
a second deck; see the comment above HILO_STREAK_PAYOUT (content.js)
for the full ruleset.

state.hilo is null in the Rogues' Den's normal view (spell trainer/
class-skill block/"Return to Map"/a "Play Hi-Lo" entry button) —
enterHiLoTable() below is the only way in. Once set, it's { bet,
currentCard, streak, phase, resultText }, and the screen swaps to just
the table, same "own uncluttered screen" shape Blackjack's own
state.blackjack already established (render.js gates every bit of the
Rogues' Den's normal furniture on `!state.hilo`). `phase` is 'betting'
(sat down, no card in play), 'guessing' (a card's showing, waiting on
Higher/Lower/Cash Out), or 'resolved' (round's over — win, loss, or a
cash-out — Deal buttons return so another round can start without
leaving the table). Deliberately NOT part of serializeState() (save.js),
same reasoning as state.blackjack/state.inCombat: a reload should never
resume mid-round or mid-sitting-down. */
function enterHiLoTable(){
   if(state.inCombat || state.location !== 'roguesden' || !state.quest7Complete || state.hilo) return;
   state.hilo = { bet:0, currentCard:null, streak:0, phase:'betting', resultText:'' };
   clearLog();
   log("You take a seat at a back table. The Croupier flips a card face up and waits on your bet.");
   render();
}
/* Only reachable from 'betting'/'resolved' (render.js hides the button
during 'guessing' — defense-in-depth here too, same shape
leaveBlackjackTable() uses) — always free to walk away between rounds,
never out from under a live guess. */
function leaveHiLoTable(){
   if(state.inCombat || state.location !== 'roguesden' || !state.hilo || state.hilo.phase==='guessing') return;
   state.hilo = null;
   clearLog();
   render();
}

/* CARD_RANKS (content.js) is already written low-to-high (Ace first,
King last), so its own array index doubles as the rank scale Hi-Lo
compares against — no separate lookup table needed. */
function hiloRankIndex(card){ return CARD_RANKS.indexOf(card.rank); }
/* Redraws until the result ISN'T a tie with `rankIndex` — see the "why
ties just don't exist here" reasoning above HILO_STREAK_PAYOUT
(content.js). */
function hiloDrawDistinctFrom(rankIndex){
   let card;
   do { card = drawCard(); } while(hiloRankIndex(card) === rankIndex);
   return card;
}

function playHiLo(bet){
   if(state.location !== 'roguesden' || state.inCombat) return;
   /* Only from the table itself, and only between rounds -- 'betting' is
   the just-sat-down state, 'resolved' is right after a previous round. */
   if(!state.hilo || state.hilo.phase==='guessing') return;
   if(state.popTabs < bet) return;
   state.popTabs -= bet;
   state.hilo = { bet, currentCard: drawCard(), streak:0, phase:'guessing', resultText:'' };
   clearLog();
   log(`You put up ${bet} Pop Tabs. The Croupier flips the first card.`);
   render();
   autosave();
}
/* Same idea as dealBlackjackCustom() (casino.js) -- reads
#hilo-bet-input instead of a fixed preset. */
function playHiLoCustom(){
   const input = document.getElementById('hilo-bet-input');
   const bet = Math.max(1, Math.floor(Number(input.value) || 0));
   playHiLo(bet);
}

function hiloGuess(direction){
   if(!state.hilo || state.hilo.phase !== 'guessing') return;
   const hl = state.hilo;
   const currentIdx = hiloRankIndex(hl.currentCard);
   const nextCard = hiloDrawDistinctFrom(currentIdx);
   const correct = direction==='higher' ? hiloRankIndex(nextCard) > currentIdx : hiloRankIndex(nextCard) < currentIdx;
   clearLog();
   if(correct){
      hl.streak++;
      hl.currentCard = nextCard;
      const potential = Math.round(hl.bet * hl.streak * HILO_STREAK_PAYOUT);
      log(`Correct — the card was ${nextCard.rank}${nextCard.suit}. Streak: ${hl.streak}. Cash out now for ${hl.bet + potential} Pop Tabs total, or press your luck.`);
   } else {
      hl.currentCard = nextCard; /* reveal the card that actually beat them */
      hl.phase = 'resolved';
      hl.resultText = `${randomLine(hiloLoseLines)} The card was ${nextCard.rank}${nextCard.suit}. (-${hl.bet} Pop Tabs)`;
      log(hl.resultText);
   }
   render();
   autosave();
}

/* Only reachable with streak>=1 (render.js disables the button below
that) -- there's nothing banked yet on the very first card, same reason
dealBlackjack() has nothing to resolve before a hand even starts. */
function hiloCashOut(){
   if(!state.hilo || state.hilo.phase!=='guessing' || state.hilo.streak<1) return;
   const hl = state.hilo;
   const winnings = Math.round(hl.bet * hl.streak * HILO_STREAK_PAYOUT);
   const total = hl.bet + winnings;
   state.popTabs += total;
   hl.phase = 'resolved';
   clearLog();
   hl.resultText = `${randomLine(hiloCashOutLines)} Your ${hl.bet} bet back plus ${winnings} winnings — +${total} Pop Tabs total.`;
   log(hl.resultText);
   render();
   autosave();
}

/* Renders the live table (#hilo-table, index.html). Hidden while
state.hilo is null (render.js), i.e. in the Rogues' Den's normal view
rather than at the table at all. */
function renderHiLoTable(){
   const el = document.getElementById('hilo-table');
   if(!el || !state.hilo) return;
   const hl = state.hilo;
   if(hl.phase==='betting'){
      el.innerHTML = `<div class="block-title">Hi-Lo</div><div class="quest-desc">Place a bet to flip the first card.</div>`;
      return;
   }
   const potential = hl.streak>0 ? Math.round(hl.bet * hl.streak * HILO_STREAK_PAYOUT) : 0;
   const streakLine = hl.streak>0
      ? ` — Streak: ${hl.streak} (cash out for ${hl.bet + potential} Pop Tabs total)`
      : '';
   el.innerHTML = `
   <div class="block-title">Hi-Lo — ${hl.bet} Pop Tabs on the table</div>
   <div class="quest-desc">Current card: ${cardChipHtml(hl.currentCard)}${streakLine}</div>
   ${hl.phase==='resolved' ? `<div class="quest-progress">${hl.resultText}</div>` : '<div class="quest-desc">Will the next card be higher or lower?</div>'}
   `;
}
