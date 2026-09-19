/* ---------------- In-game tutorial ---------------- */
/* Shown automatically the moment a brand-new run actually starts —
startFreshGame() (game.js) calls openTutorial() at the very end of
itself, and that function is the single choke point for guest play
(playAsGuest()), a freshly registered/logged-in account with no save
yet (enterGameAfterAuth(false)), and degraded no-Supabase boot. An
account that logs in to an *existing* save never touches
startFreshGame(), so returning players aren't re-shown this. Also
reachable any time via the "📖 How to Play" button renderAccountTab()
adds to every state of the Account drawer (signed in, guest, or even
when accounts are unavailable) — reopening always restarts at step 1,
there's no "resume where you left off" for the tutorial itself. */
const TUTORIAL_STEPS = [
   { title: 'Welcome to Gladstone Hollow', body: [
      "You've wandered into a small town with a gnome problem, a suspicious sewer, and a rake that needs avenging.",
      'This quick tour covers the basics — takes about a minute.',
      'You can reopen it anytime from the Account tab (📖 How to Play).',
      ]},
   { title: 'Biscuits & Pop Tabs', body: [
      'Biscuits are your energy — adventuring or resting at the Inn costs 1. They regenerate slowly over time, even while you’re away.',
      'Pop Tabs are your money — earned by selling loot and finishing quests, spent on gear, apples, and spells.',
      ]},
   { title: 'Around Town', body: [
      'Gladstone Hollow is a 3×3 grid of buildings — tap one to walk in.',
      'Quest-givers show a flag overhead: a red ! means a quest is offered, a green ? means it’s ready to turn in.',
      'The Shop, the Hoodoo Doctor’s Shack, the Inn, and the Casino are always open, no quest required.',
      ]},
   { title: 'Adventuring & Combat', body: [
      'Open the Map tab to travel to the Overgrown Commons (and zones you’ll unlock later), then tap Adventure!',
      'Fights are turn-based: Attack, Cast a spell once you’ve learned one, or Flee.',
      'Nobody’s perfect — your own swings can miss, and Zip lets you dodge or flee more often. A shield (🛡, shown next to your HP) soaks up damage before your HP does, if you’ve got one.',
      'Defeated monsters sometimes drop loot — sell the junk at the Shop, and hang onto anything quest-related.',
      ]},
   { title: 'Quests & Leveling Up', body: [
      'Check the Quest Log tab anytime to see what’s active and what’s done.',
      'Leveling up grants a stat point — spend it in the Character tab on Beef, Zip, Grit, or Hoodoo.',
      'Equip gear from your Pack to boost those stats further.',
      ]},
   { title: 'Saving Your Progress', body: [
      'Playing as a guest? Nothing saves — great for trying the game, but progress resets if you close the tab.',
      'Register a free account from the Account tab and your progress saves automatically as you play.',
      'You can come back to this tutorial anytime — look for 📖 How to Play in the Account tab.',
      ]},
   ];

let tutorialStep = 0;

function openTutorial(){
   closeAllDrawers();
   tutorialStep = 0;
   renderTutorial();
   const el = document.getElementById('tutorial-screen');
   if(el) el.style.display = 'flex';
}

function closeTutorial(){
   const el = document.getElementById('tutorial-screen');
   if(el) el.style.display = 'none';
}

function tutorialSkip(){ closeTutorial(); }

function tutorialBack(){
   if(tutorialStep <= 0) return;
   tutorialStep--;
   renderTutorial();
}

function tutorialNext(){
   if(tutorialStep >= TUTORIAL_STEPS.length - 1){ closeTutorial(); return; }
   tutorialStep++;
   renderTutorial();
}

function renderTutorial(){
   const step = TUTORIAL_STEPS[tutorialStep];
   const body = document.getElementById('tutorial-body');
   if(body){
      body.innerHTML = `
      <div class="tutorial-step-title">${step.title}</div>
      <ul class="tutorial-list">${step.body.map(line => `<li>${line}</li>`).join('')}</ul>
      `;
   }
   const dots = document.getElementById('tutorial-dots');
   if(dots){
      dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
         `<span class="tutorial-dot ${i === tutorialStep ? 'active' : ''}"></span>`
                                          ).join('');
   }
   const backBtn = document.getElementById('tutorial-back-btn');
   if(backBtn) backBtn.disabled = tutorialStep === 0;
   const nextBtn = document.getElementById('tutorial-next-btn');
   if(nextBtn) nextBtn.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Got it!' : 'Next';
}
