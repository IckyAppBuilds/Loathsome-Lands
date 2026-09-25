/* ---------------- Rendering ---------------- */
/* render() itself is now just a short dispatch to the functions below —
it used to be one ~770-line function body doing 5 separable jobs in
sequence (header sync, Map drawer sync, quest-state computation +
per-building quest-box text, combat button visibility, scene-art
dispatch). Split per AGENTS.md's own "functions are segregated" audit:
computeRenderContext() does all the PURE `state` reads (which screen is
showing, every quest's own state, and every derived "can I do X right
now" boolean) into one plain object, `ctx`, passed to each sync
function below rather than each one re-deriving its own slice of it or
closing over 50 shared locals. Every one of ctx's fields is a pure
function of `state` (no DOM reads), so computing all of them up front,
before any DOM write happens, is behavior-preserving — nothing here
reads a DOM value another one of these functions just wrote. */
function render(){
  syncHeaderAndStats();
  const ctx = computeRenderContext();
  syncZoneHeader(ctx);
  syncBuildingScreens(ctx);
  syncMapDrawer(ctx);
  syncCombatUI(ctx);
  renderSceneArt(ctx);
  syncCombatHud();

  renderInventory();
  renderAccountTab();
  renderCharacterDrawer();
  renderQuestLogDrawer();
  autosave();
}

/* Job 1: header stat bars (HP/MP/Pack count/Biscuits/level/XP) — reads
`state` directly, no ctx needed. */
function syncHeaderAndStats(){
  document.getElementById('hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('hp-text').textContent = state.hp+' / '+state.maxHp + (state.shield>0 ? ` (+${state.shield} 🛡)` : '');
  document.getElementById('inv-count').textContent = state.inventory.length;
  updateMpDisplay();
  updateBiscuitDisplay();

  document.getElementById('level-text').textContent = state.level;
  document.getElementById('xp-bar').style.width = (state.xp/state.xpToLevel*100)+'%';
  document.getElementById('xp-text').textContent = state.xp+'/'+state.xpToLevel;
}

const ZONE_TITLES = {
  gaffer: "Gaffer Thistlewick's Cottage", shop: 'The Shop', hoodoo: "The Hoodoo Doctor's Shack",
  guild: "The Adventurers' Guild", tinker: "Tinker's Workshop", casino: 'The Casino',
  noticeboard: 'The Notice Board', town: 'Gladstone Hollow', commons: 'The Overgrown Commons',
  sewers: 'Dank Sewers', quarry: 'The Clockwork Quarry', vault: 'The Sunless Vault',
  gnometropolis: 'Gnometropolis', garrison: 'The Garrison', roguesden: "The Rogues' Den",
  sanctum: 'The Arcane Sanctum', palace: 'The Palace Gate', gnomeguild: 'The Guild',
  gnomeshop: 'The Shop', gnometownlot: 'The Vault',
  mudrootwarren: 'Mudroot Warren', rootcellar: 'The Root Cellar', mudflats: 'The Mudflats',
  bureau: 'The Bureau',
  warrensear: "The Warren's Ear", choir: 'The Choir', ledgervault: 'The Ledger Vault',
};

/* All PURE `state` reads used by two or more of the sync functions
below — every location flag (isX), every quest's own state string, and
every derived "can I act right now" boolean. Kept as one object rather
than 50 separate function params so a function that needs a new field
later doesn't require touching every OTHER function's signature too —
a missing field here throws loudly (`ctx.foo is undefined`) rather
than silently misbehaving, so this stays easy to verify. */
function computeRenderContext(){
  const isTownSquare = state.location === 'town';
  const isGafferHouse = state.location === 'gaffer';
  const isShop = state.location === 'shop';
  const isHoodoo = state.location === 'hoodoo';
  const isGuild = state.location === 'guild';
  const isTinker = state.location === 'tinker';
  const isTownLot = state.location === 'townlot';
  const isCommons = state.location === 'commons';
  const isSewers = state.location === 'sewers';
  const isQuarry = state.location === 'quarry';
  const isVault = state.location === 'vault';
  const isGnometropolis = state.location === 'gnometropolis'; /* the Gnometropolis TOWN SQUARE specifically, not the area as a whole — see inGnometropolisArea below for that */
  const isGarrison = state.location === 'garrison';
  const isRoguesden = state.location === 'roguesden';
  const isSanctum = state.location === 'sanctum';
  const isPalace = state.location === 'palace';
  const isGnomeGuild = state.location === 'gnomeguild'; /* Act 2: the Guild's new home, reachable once quest7Complete — enterGnomeGuild(), guild.js */
  const isGnomeShop = state.location === 'gnomeshop'; /* Act 2: the new Shop, same quest7Complete gate — enterGnomeShop(), gnometropolis.js */
  const isGnomeTownLot = state.location === 'gnometownlot'; /* Act 2: Gnometropolis's own Town Lot, same quest7Complete gate — enterGnomeTownLot(), gnometropolis.js */
  /* Any of the Gnometropolis square + its 3 districts + the palace gate
  + the new Guild/Shop/Town Lot — used where the Map's "you are here"
  tag/lock state shouldn't go dark just because the player stepped off
  the square. */
  const inGnometropolisArea = isGnometropolis || isGarrison || isRoguesden || isSanctum || isPalace || isGnomeGuild || isGnomeShop || isGnomeTownLot;
  const isMudrootWarren = state.location === 'mudrootwarren'; /* Act 2 Part 2: the Mole People hub square — enters via travelTo(), town.js */
  const isRootCellar = state.location === 'rootcellar';
  const isMudflats = state.location === 'mudflats';
  const isBureau = state.location === 'bureau'; /* business moles — Mudroot Warren's third combat district, same shape as Root Cellar */
  /* Mirrors inGnometropolisArea above — the Mudroot Warren square + its
  three districts. All three are real combat zones (per the user's own
  "multiple combat zones, not a combat zone and a recovery zone"
  instruction) — there's no rest tile here at all; resting happens at
  Gnometropolis's Camp instead, one Biscuit away (travelCostFor(),
  town.js). */
  const inMudrootWarrenArea = isMudrootWarren || isRootCellar || isMudflats || isBureau;
  const isWarrensEar = state.location === 'warrensear'; /* Act 2, quest10 — a second adventure hub, one step past Mudroot Warren, reached through its sealed root-door once quest10Path is set */
  const isChoir = state.location === 'choir';
  const isLedgerVault = state.location === 'ledgervault';
  /* Mirrors inMudrootWarrenArea above — no rest tile here either, same
  "adventure hub" shape (TOWN_HUB_KEYS, hubs.js — this one isn't a town
  hub, so travel to/from it is never free). */
  const inWarrensEarArea = isWarrensEar || isChoir || isLedgerVault;
  const isCasino = state.location === 'casino';
  const isNoticeBoard = state.location === 'noticeboard';
  const inTownArea = isTownSquare || isGafferHouse || isShop || isHoodoo || isGuild || isTinker || isCasino || isTownLot || isNoticeBoard;

  const questState = state.questComplete ? 'complete' : (state.questAccepted ? 'active' : 'offer');
  const tinesHeld = countRakeTines();
  const tinesStillNeeded = QUEST_TINES_NEEDED - state.questTinesGiven;
  const canGive = isGafferHouse && questState==='active' && tinesHeld > 0;

  const quest2State = state.quest2Complete ? 'complete' : (state.quest2Accepted ? 'active' : (state.questComplete ? 'offer' : 'locked'));
  const canReport = isGuild && quest2State==='active' && state.commanderDefeated;

  const quest3State = state.quest3Complete ? 'complete' : (state.quest3Accepted ? 'active' : (state.quest2Complete ? 'offer' : 'locked'));
  const ingredientsHeld = countPotionIngredientsHeld();
  const canBrew = isHoodoo && quest3State==='active' && ingredientsHeld === potionIngredients.length;

  const quest4State = state.quest4Complete ? 'complete' : (state.quest4Accepted ? 'active' : (state.quest2Complete ? 'offer' : 'locked'));
  const canReportDigger = isTinker && quest4State==='active' && state.quest4RareDefeated;

  const quest5State = state.quest5Complete ? 'complete' : (state.quest5Accepted ? 'active' : (state.quest4Complete ? 'offer' : 'locked'));
  const veinHeld = countVeinIngredientsHeld();
  const veinNeeded = veinIngredients.length * VEIN_ITEM_COUNT_NEEDED;
  const canTurnInVein = isTinker && quest5State==='active' && veinHeld === veinNeeded;

  const quest6State = state.quest6Complete ? 'complete' : (state.quest6Accepted ? 'active' : (state.quest5Complete ? 'offer' : 'locked'));
  const canReportGnomeKing = isGuild && quest6State==='active' && state.quest6RareDefeated;

  /* Quest 7 ("The Palace Gate", Act 1 finale) can only ever be relevant
  after a class is claimed — the palace approach is class-specific
  (PALACE_GATE_GEAR, content.js) — so its states extend past
  classQuestState's own 'complete'. See guild.js's acceptQuest7()/
  reportGnomeKingDefeat()/approachPalaceGate() for the mechanics this
  mirrors. */
  const quest7State = state.quest7Complete ? 'complete'
    : state.quest7RareDefeated ? 'ready'
    : state.quest7Accepted ? 'active'
    : (state.quest6Complete && state.classTitle) ? 'offer'
    : 'locked';
  const palaceGateGearItem = PALACE_GATE_GEAR.find(g => g.class === state.classTitle);
  const canApproachPalaceGate = isPalace && !state.inCombat && state.quest7Accepted && !state.quest7RareDefeated;

  /* Quest 8, "New Digs" — Act 2's opener, offered/turned in at the new
  Gnometropolis Guild (enterGnomeGuild(), guild.js) once quest7Complete. */
  const quest8State = state.quest8Complete ? 'complete' : (state.quest8Accepted ? 'active' : (state.quest7Complete ? 'offer' : 'locked'));

  /* Quest 9, Act 2's first multi-stage quest — offered once quest8Complete,
  its two combat stages span two different Mudroot Warren districts
  (Root Cellar then Mudflats, see tunnelWardenHunt/warrenScoutHunt in
  goAdventuring(), combat.js) with no explicit zone name ever spelled out
  in its own text below (deliberate — "no quest markers", per the user's
  own instruction). 'stage1'/'stage2' are separate states (not folded
  into a single 'active') purely so the quest-box text below can change
  once tunnelWardenDefeated flips, without needing a second flag to know
  which vague paragraph to show. */
  const quest9State = state.quest9Complete ? 'complete'
    : state.warrenScoutDefeated ? 'ready'
    : state.tunnelWardenDefeated ? 'stage2'
    : state.quest9Accepted ? 'stage1'
    : (state.quest8Complete ? 'offer' : 'locked');

  /* Quest 10, "Whatever's Listening" — Act 2's first quest with a real
  downstream consequence: two rare hunts run in PARALLEL (not staged
  like quest9's own two), each in an existing Mudroot Warren district,
  and whichever gets found first sets state.quest10Path — 'active'
  covers the whole "accepted, no path chosen yet" window regardless of
  which hunt (if either) is still pending, since the quest-box text
  below stays identical either way (deliberately vague — no hint at
  which path leads where). 'ready' is reached the instant EITHER path
  is chosen. */
  const quest10State = state.quest10Complete ? 'complete'
    : state.quest10Path ? 'ready'
    : state.quest10Accepted ? 'active'
    : (state.quest9Complete ? 'offer' : 'locked');

  /* 'trials': accepted, but not all three trainers' tests are passed yet.
  'ready': all three passed, waiting on claimClassPath(chosenStat) — see the
  three claim-path-*-btn buttons and their isGuild=='ready' branch. */
  const classQuestState = state.classQuestComplete ? 'complete'
    : !state.classQuestAccepted ? ((state.quest2Complete && state.level>=10) ? 'offer' : 'locked')
    : (state.classTrialGuildPassed && state.classTrialCasinoPassed && state.classTrialHoodooPassed) ? 'ready'
    : 'trials';

  return {
    isTownSquare, isGafferHouse, isShop, isHoodoo, isGuild, isTinker, isTownLot,
    isCommons, isSewers, isQuarry, isVault, isGnometropolis, isGarrison, isRoguesden,
    isSanctum, isPalace, isGnomeGuild, isGnomeShop, isGnomeTownLot, inGnometropolisArea,
    isMudrootWarren, isRootCellar, isMudflats, isBureau, inMudrootWarrenArea,
    isWarrensEar, isChoir, isLedgerVault, inWarrensEarArea,
    isCasino, isNoticeBoard, inTownArea,
    questState, tinesHeld, tinesStillNeeded, canGive,
    quest2State, canReport,
    quest3State, ingredientsHeld, canBrew,
    quest4State, canReportDigger,
    quest5State, veinHeld, veinNeeded, canTurnInVein,
    quest6State, canReportGnomeKing,
    quest7State, palaceGateGearItem, canApproachPalaceGate,
    quest10State,
    quest8State, quest9State, classQuestState,
  };
}

/* Job 1b (still header-ish, but needs ctx): Pop Tabs counter, the
zone-title text, and the two persistent ztag chips that never live
inside a per-building block below. */
function syncZoneHeader(ctx){
  document.getElementById('poptab-text').textContent = formatMoney(state.popTabs);
  document.getElementById('zone-title').textContent = ctx.isTownLot ? LOT_TIER_NAMES[state.lotTier] : (ctx.isGnomeTownLot ? GNOME_LOT_TIER_NAMES[state.gnomeLotTier] : (ZONE_TITLES[state.location] || 'The Overgrown Commons'));
  document.getElementById('ztag-town').style.display = ctx.inTownArea ? 'block' : 'none';
  document.getElementById('ztag-commons').style.display = ctx.isCommons ? 'block' : 'none';
}

/* Job 2 (by far the largest): which building's own row/list/spell-
trainer is showing, plus every quest-box's own text. This is the one
job AGENTS.md's own audit didn't further subdivide — its pieces (one
`if(isX){...}` block per building) are individually small and already
clearly separated by building, just sequential in one function rather
than each building getting its own top-level function. */
function syncBuildingScreens(ctx){
  /* !state.inCombat matters here specifically for the Guild's own Trial
  fight (startClassTrialGuild(), class-trial.js) — it's the one forced boss
  fight that runs while state.location stays at a town building instead
  of an exploration zone, so without this guard the building's own
  quest text/bounty board/spell-trainer list would float on top of the
  combat screen the whole fight. Every other forced fight (gnomeCommander/
  diggerBot/gnomeKingsCaptain/gnomeKing/the district guardians) already
  runs in a zone, where none of these building-only blocks ever show in
  the first place — this is the one location that needed the same
  "combat is its own clean screen" treatment applied explicitly. */
  /* Act 2: the Bounty Board moved to the new Gnometropolis Guild
  (isGnomeGuild) once quest7Complete — Gladstone's own Guild
  (isGuild) stops offering it from that point on (enterGuild()'s own
  dead-end branch, guild.js, already stops giving quests there too). */
  const showBountyBox = !state.inCombat && state.questComplete && ((ctx.isGuild && !state.quest7Complete) || ctx.isGnomeGuild);
  document.getElementById('bounty-box').style.display = showBountyBox ? 'block' : 'none';
  if(showBountyBox) renderBountyBoard();
  document.getElementById('town-row').style.display = (ctx.isTownSquare && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-row').style.display = (ctx.isShop && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-list').style.display = ctx.isShop ? 'block' : 'none';
  if(ctx.isShop) renderShop();

  document.getElementById('gnomeshop-row').style.display = (ctx.isGnomeShop && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('gnomeshop-list').style.display = ctx.isGnomeShop ? 'block' : 'none';
  if(ctx.isGnomeShop) renderGnomeShop();

  document.getElementById('hoodoo-row').style.display = (ctx.isHoodoo && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('hoodoo-list').style.display = (ctx.isHoodoo && !state.inCombat) ? 'block' : 'none';
  if(ctx.isHoodoo && !state.inCombat){
    renderHoodooShop();
    renderClassSkillUpgrade('hoodoo-classskill-block', 'Hexpert');
  } else {
    document.getElementById('hoodoo-class-spell-list').style.display = 'none';
    document.getElementById('hoodoo-classskill-block').style.display = 'none';
  }

  document.getElementById('guild-spell-list').style.display = (ctx.isGuild && !state.inCombat) ? 'block' : 'none';
  if(ctx.isGuild && !state.inCombat){
    renderClassSpellList('guild-spell-list', 'Meathead');
    renderClassSkillUpgrade('guild-classskill-block', 'Meathead');
  } else {
    document.getElementById('guild-classskill-block').style.display = 'none';
  }

  document.getElementById('townlot-row').style.display = (ctx.isTownLot && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('townlot-list').style.display = ctx.isTownLot ? 'block' : 'none';
  if(ctx.isTownLot) renderTownLot();

  document.getElementById('gnometownlot-row').style.display = (ctx.isGnomeTownLot && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('gnometownlot-list').style.display = ctx.isGnomeTownLot ? 'block' : 'none';
  if(ctx.isGnomeTownLot) renderGnomeTownLot();

  /* Blackjack (casino.js) — its own screen, no Casino-lobby clutter,
  mirroring how state.inCombat already gets its own uncluttered screen
  (no shop lists/quest panels either) — per explicit request. atTable
  is true in EVERY blackjack phase (betting/playerTurn/resolved); the
  lobby-only stuff below (House's Cut/Card Shark trainer/Trial fight/
  casino-row's Play Blackjack+Leave) all gate on `!atTable`, full stop.
  Within the table itself, casino-bet-row (Deal + Leave Table) shows
  outside 'playerTurn', blackjack-hand-row (Hit/Stand) shows only
  during it — you don't see a Deal button until you've actually sat
  down, and you can't step away mid-hand either way. */
  const atTable = !!state.blackjack;
  const blackjackLive = atTable && state.blackjack.phase==='playerTurn';
  document.getElementById('casino-bet-row').style.display = (ctx.isCasino && !state.inCombat && atTable && !blackjackLive) ? 'flex' : 'none';
  document.getElementById('casino-custom-bet-row').style.display = (ctx.isCasino && !state.inCombat && atTable && !blackjackLive) ? 'flex' : 'none';
  document.getElementById('blackjack-hand-row').style.display = (ctx.isCasino && !state.inCombat && blackjackLive) ? 'flex' : 'none';
  document.getElementById('casino-row').style.display = (ctx.isCasino && !state.inCombat && !atTable) ? 'flex' : 'none';
  document.getElementById('bet-5-btn').disabled = state.popTabs < 5;
  document.getElementById('bet-10-btn').disabled = state.popTabs < 10;
  document.getElementById('bet-25-btn').disabled = state.popTabs < 25;

  document.getElementById('blackjack-table').style.display = (ctx.isCasino && atTable) ? 'block' : 'none';
  if(ctx.isCasino && atTable) renderBlackjackTable();

  document.getElementById('casino-winnings-box').style.display = (ctx.isCasino && !state.inCombat && !atTable && casinoWinningsCap() > 0) ? 'block' : 'none';
  if(ctx.isCasino && !state.inCombat && !atTable) renderCasinoWinningsBox();

  document.getElementById('casino-spell-list').style.display = (ctx.isCasino && !state.inCombat && !atTable) ? 'block' : 'none';
  if(ctx.isCasino && !state.inCombat && !atTable){
    renderClassSpellList('casino-spell-list', 'Card Shark');
    renderClassSkillUpgrade('casino-classskill-block', 'Card Shark');
  } else {
    document.getElementById('casino-classskill-block').style.display = 'none';
  }

  /* Act 2's own class trainers — Garrison/Rogues' Den/Arcane Sanctum, each
  now teaching that class's Act 2 spell (learnLocation, content.js)
  alongside the existing class-skill upgrade, same as every Act 1 trainer
  above. Gated on state.quest7Complete same as CLASS_AREA_ZONES (combat.js)
  gates goAdventuring() away from these three — before quest7Complete
  they're still real adventure zones (quest7's own objective is fighting
  each district's class-gated guardian here), and showing the trainer
  UI early would let a player start banking class spells/skill levels
  off gear that isn't even the intended reward for finishing that fight
  yet. The trainer only appears once these fully convert. */
  document.getElementById('garrison-spell-list').style.display = (ctx.isGarrison && !state.inCombat && state.quest7Complete) ? 'block' : 'none';
  if(ctx.isGarrison && !state.inCombat && state.quest7Complete){
    renderClassSpellList('garrison-spell-list', 'Meathead');
    renderClassSkillUpgrade('garrison-classskill-block', 'Meathead');
  } else {
    document.getElementById('garrison-classskill-block').style.display = 'none';
  }

  /* Hi-Lo (hilo.js) — same "own uncluttered screen" shape Blackjack
  (casino.js) already established: the instant state.hilo is set (any
  phase), the Rogues' Den's own trainer/class-skill block AND its own
  "Play Hi-Lo" entry button all hide, leaving just the table and
  whichever action row fits `phase`. atHiLoTable covers every phase;
  hiloGuessing is the mid-round-only subset (Higher/Lower/Cash Out). */
  const atHiLoTable = !!state.hilo;
  const hiloGuessing = atHiLoTable && state.hilo.phase==='guessing';
  document.getElementById('roguesden-spell-list').style.display = (ctx.isRoguesden && !state.inCombat && state.quest7Complete && !atHiLoTable) ? 'block' : 'none';
  if(ctx.isRoguesden && !state.inCombat && state.quest7Complete && !atHiLoTable){
    renderClassSpellList('roguesden-spell-list', 'Card Shark');
    renderClassSkillUpgrade('roguesden-classskill-block', 'Card Shark');
  } else {
    document.getElementById('roguesden-classskill-block').style.display = 'none';
  }
  document.getElementById('roguesden-hilo-entry-row').style.display = (ctx.isRoguesden && !state.inCombat && state.quest7Complete && !atHiLoTable) ? 'flex' : 'none';
  document.getElementById('hilo-table').style.display = (ctx.isRoguesden && atHiLoTable) ? 'block' : 'none';
  if(ctx.isRoguesden && atHiLoTable) renderHiLoTable();
  document.getElementById('hilo-bet-row').style.display = (ctx.isRoguesden && !state.inCombat && atHiLoTable && !hiloGuessing) ? 'flex' : 'none';
  document.getElementById('hilo-custom-bet-row').style.display = (ctx.isRoguesden && !state.inCombat && atHiLoTable && !hiloGuessing) ? 'flex' : 'none';
  document.getElementById('hilo-guess-row').style.display = (ctx.isRoguesden && !state.inCombat && hiloGuessing) ? 'flex' : 'none';
  document.getElementById('hilo-cashout-btn').disabled = !hiloGuessing || state.hilo.streak < 1;
  document.getElementById('hilo-bet-5-btn').disabled = state.popTabs < 5;
  document.getElementById('hilo-bet-10-btn').disabled = state.popTabs < 10;
  document.getElementById('hilo-bet-25-btn').disabled = state.popTabs < 25;

  document.getElementById('sanctum-spell-list').style.display = (ctx.isSanctum && !state.inCombat && state.quest7Complete) ? 'block' : 'none';
  if(ctx.isSanctum && !state.inCombat && state.quest7Complete){
    renderClassSpellList('sanctum-spell-list', 'Hexpert');
    renderClassSkillUpgrade('sanctum-classskill-block', 'Hexpert');
  } else {
    document.getElementById('sanctum-classskill-block').style.display = 'none';
  }

  document.getElementById('noticeboard-row').style.display = (ctx.isNoticeBoard && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('noticeboard-hint').style.display = ctx.isNoticeBoard ? 'block' : 'none';
  document.getElementById('noticeboard-list').style.display = ctx.isNoticeBoard ? 'block' : 'none';
  if(ctx.isNoticeBoard) renderNoticeBoard();
  else {
    document.getElementById('noticeboard-post').style.display = 'none';
    document.getElementById('noticeboard-guest-hint').style.display = 'none';
  }

  /* The Adventurer's Trial gets its own dialog box at the Guild, separate
  from quest-box (which stays reserved for quest2/quest6/quest7's own
  text) — reaching level 10, the Trial's only real gate besides
  quest2Complete, can easily land mid-quest6 or mid-quest7, and hiding
  either dialog to show the other meant a player couldn't see (or act on)
  a mainline quest that was still genuinely active. Its own accept/fight/claim buttons live in their own trial-row (syncCombatUI(),
  separate from guild-row's mainline-quest buttons) and already show
  independently of quest6/7's state, so this box is purely the
  informational half — the Guild keeps working normally underneath it no
  matter what it's showing. */
  document.getElementById('guild-trial-box').style.display = (ctx.isGuild && !state.inCombat && ctx.classQuestState!=='locked' && ctx.classQuestState!=='complete') ? 'block' : 'none';
  if(ctx.isGuild && !state.inCombat && ctx.classQuestState==='offer'){
    document.getElementById('trial-name').textContent = "Quest available: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "You've reached level 10. The guildmaster looks you over — really looks, this time. There's a Trial for adventurers who come this far, and it isn't the Guild's alone to give: the guildmaster, the Casino's croupier, and the Hoodoo Doctor each test something different before a name gets put to what you've become.";
    document.getElementById('trial-progress').textContent = 'Not yet accepted.';
  } else if(ctx.isGuild && !state.inCombat && ctx.classQuestState==='trials'){
    document.getElementById('trial-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "Three trainers, three fights, and no partial credit. Beat the Guild's Trial Champion, outlast the Casino's own card shark, and put down the Hoodoo Doctor's summoned spirit with a killing blow from a spell. Pass all three, then come back here to claim your path.";
    document.getElementById('trial-progress').textContent = `Guild: ${state.classTrialGuildPassed ? '✓ passed' : 'not yet'} — Casino: ${state.classTrialCasinoPassed ? '✓ passed' : 'not yet'} — Hoodoo: ${state.classTrialHoodooPassed ? '✓ passed' : 'not yet'}`;
  } else if(ctx.isGuild && !state.inCombat && ctx.classQuestState==='ready'){
    document.getElementById('trial-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "All three trainers agree: you're ready. The guildmaster will name your path — choose it below.";
    document.getElementById('trial-progress').textContent = 'All three trials passed — claim your path.';
  }

  /* Small one-line trial hints on the Casino/Hoodoo screens — same
  purpose as guild-trial-box above, just a single-line nudge instead of
  a full dialog since neither screen also needs to show its own separate
  mainline-quest text alongside it. */
  document.getElementById('casino-trial-hint').style.display = (ctx.isCasino && !atTable && ctx.classQuestState==='trials') ? 'block' : 'none';
  if(ctx.isCasino && !atTable && ctx.classQuestState==='trials'){
    document.getElementById('casino-trial-hint').textContent = state.classTrialCasinoPassed
      ? "You've already put the Casino's own card shark in their place — that trial is passed."
      : "The Croupier nods toward a card shark working the far table — impossible to pin down, by all accounts. Trial-takers prove their nerve by beating them outright.";
  }
  document.getElementById('casino-trial-row').style.display = (ctx.isCasino && !state.inCombat && !atTable) ? 'flex' : 'none';
  document.getElementById('start-trial-fight-casino-btn').style.display = (ctx.classQuestState==='trials' && !state.classTrialCasinoPassed) ? '' : 'none';

  document.getElementById('hoodoo-trial-hint').style.display = (ctx.isHoodoo && ctx.classQuestState==='trials') ? 'block' : 'none';
  if(ctx.isHoodoo && ctx.classQuestState==='trials'){
    document.getElementById('hoodoo-trial-hint').textContent = state.classTrialHoodooPassed
      ? "You've already put the spirit from the pot back where it came from — the killing-blow trial is passed."
      : "The Hoodoo Doctor's summoned something out of the pot to test trial-takers — beat it, and finish it with a spell, not your fists.";
  }
  document.getElementById('hoodoo-trial-row').style.display = (ctx.isHoodoo && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('start-trial-fight-hoodoo-btn').style.display = (ctx.classQuestState==='trials' && !state.classTrialHoodooPassed) ? '' : 'none';

  document.getElementById('gaffer-row').style.display = (ctx.isGafferHouse && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest-btn').style.display = ctx.questState==='offer' ? '' : 'none';
  document.getElementById('give-tines-btn').style.display = ctx.questState==='active' ? '' : 'none';
  document.getElementById('give-tines-btn').disabled = !ctx.canGive;
  document.getElementById('give-tines-btn').classList.toggle('btn-ready', ctx.canGive);
  document.getElementById('give-tines-btn').textContent = ctx.tinesHeld>0 ? `Give Rake Tines (${Math.min(ctx.tinesHeld,ctx.tinesStillNeeded)})` : 'Give Rake Tines';

  document.getElementById('guild-row').style.display = (ctx.isGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest2-btn').style.display = ctx.quest2State==='offer' ? '' : 'none';
  document.getElementById('report-kill-btn').style.display = ctx.quest2State==='active' ? '' : 'none';
  document.getElementById('report-kill-btn').disabled = !ctx.canReport;
  document.getElementById('report-kill-btn').classList.toggle('btn-ready', ctx.canReport);
  document.getElementById('report-kill-btn').textContent = state.commanderDefeated ? 'Report the Kill' : 'Report the Kill (not yet)';

  document.getElementById('accept-quest6-btn').style.display = ctx.quest6State==='offer' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').style.display = ctx.quest6State==='active' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').disabled = !ctx.canReportGnomeKing;
  document.getElementById('report-gnomeking-btn').classList.toggle('btn-ready', ctx.canReportGnomeKing);
  document.getElementById('report-gnomeking-btn').textContent = state.quest6RareDefeated ? 'Report the Gnome King' : 'Report the Gnome King (not yet)';

  document.getElementById('accept-quest7-btn').style.display = ctx.quest7State==='offer' ? '' : 'none';
  document.getElementById('report-gnomeking-defeat-btn').style.display = ctx.quest7State==='ready' ? '' : 'none';
  document.getElementById('report-gnomeking-defeat-btn').classList.toggle('btn-ready', ctx.quest7State==='ready');

  document.getElementById('gnomeguild-row').style.display = (ctx.isGnomeGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest8-btn').style.display = ctx.quest8State==='offer' ? '' : 'none';
  document.getElementById('report-quest8-btn').style.display = ctx.quest8State==='active' ? '' : 'none';
  document.getElementById('report-quest8-btn').classList.toggle('btn-ready', ctx.quest8State==='active');
  document.getElementById('accept-quest9-btn').style.display = ctx.quest9State==='offer' ? '' : 'none';
  document.getElementById('report-quest9-btn').style.display = ctx.quest9State==='ready' ? '' : 'none';
  document.getElementById('report-quest9-btn').classList.toggle('btn-ready', ctx.quest9State==='ready');
  document.getElementById('accept-quest10-btn').style.display = ctx.quest10State==='offer' ? '' : 'none';
  document.getElementById('report-quest10-btn').style.display = ctx.quest10State==='ready' ? '' : 'none';
  document.getElementById('report-quest10-btn').classList.toggle('btn-ready', ctx.quest10State==='ready');

  document.getElementById('accept-quest3-btn').style.display = ctx.quest3State==='offer' ? '' : 'none';
  document.getElementById('brew-potion-btn').style.display = ctx.quest3State==='active' ? '' : 'none';
  document.getElementById('brew-potion-btn').disabled = !ctx.canBrew;
  document.getElementById('brew-potion-btn').classList.toggle('btn-ready', ctx.canBrew);
  document.getElementById('brew-potion-btn').textContent = ctx.canBrew ? 'Brew the Potion' : `Brew the Potion (${ctx.ingredientsHeld}/${potionIngredients.length})`;

  document.getElementById('trial-row').style.display = (ctx.isGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-classquest-btn').style.display = ctx.classQuestState==='offer' ? '' : 'none';
  document.getElementById('start-trial-fight-btn').style.display = (ctx.classQuestState==='trials' && !state.classTrialGuildPassed) ? '' : 'none';
  document.getElementById('claim-path-beef-btn').style.display = ctx.classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-zip-btn').style.display = ctx.classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-hoodoo-btn').style.display = ctx.classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-beef-btn').classList.toggle('btn-ready', ctx.classQuestState==='ready');
  document.getElementById('claim-path-zip-btn').classList.toggle('btn-ready', ctx.classQuestState==='ready');
  document.getElementById('claim-path-hoodoo-btn').classList.toggle('btn-ready', ctx.classQuestState==='ready');

  document.getElementById('tinker-row').style.display = (ctx.isTinker && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest4-btn').style.display = ctx.quest4State==='offer' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').style.display = ctx.quest4State==='active' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').disabled = !ctx.canReportDigger;
  document.getElementById('report-diggerbot-btn').classList.toggle('btn-ready', ctx.canReportDigger);
  document.getElementById('report-diggerbot-btn').textContent = state.quest4RareDefeated ? 'Report the Digger-Bot' : 'Report the Digger-Bot (not yet)';
  document.getElementById('accept-quest5-btn').style.display = ctx.quest5State==='offer' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').style.display = ctx.quest5State==='active' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').disabled = !ctx.canTurnInVein;
  document.getElementById('turn-in-vein-btn').classList.toggle('btn-ready', ctx.canTurnInVein);
  document.getElementById('turn-in-vein-btn').textContent = ctx.canTurnInVein ? 'Turn In the Parts' : `Turn In the Parts (${ctx.veinHeld}/${ctx.veinNeeded})`;

  /* quest-box only takes up space when a building actually has something
  active or newly offered to say — a "locked, nothing yet" or "complete,
  reward already claimed" building has nothing left worth a permanent box
  on screen. Each building's own branch below only ever sets quest-name/
  desc/progress for its offer/active(/ready) states now; anything else
  falls through to leaving the box hidden. */
  const guildQuestBoxNeeded = ctx.quest2State==='offer' || ctx.quest2State==='active'
    || ctx.quest6State==='offer' || ctx.quest6State==='active'
    || ctx.quest7State==='offer' || ctx.quest7State==='active' || ctx.quest7State==='ready';
  document.getElementById('quest-box').style.display = (!state.inCombat && (
    (ctx.isGafferHouse && (ctx.questState==='offer' || ctx.questState==='active'))
    || (ctx.isGuild && guildQuestBoxNeeded)
    || (ctx.isGnomeGuild && (ctx.quest8State==='offer' || ctx.quest8State==='active'
        || ctx.quest9State==='offer' || ctx.quest9State==='stage1' || ctx.quest9State==='stage2' || ctx.quest9State==='ready'
        || ctx.quest10State==='offer' || ctx.quest10State==='active' || ctx.quest10State==='ready'))
    || (ctx.isHoodoo && (ctx.quest3State==='offer' || ctx.quest3State==='active'))
    || (ctx.isTinker && (ctx.quest4State==='offer' || ctx.quest4State==='active' || ctx.quest5State==='offer' || ctx.quest5State==='active'))
  )) ? 'block' : 'none';

  if(ctx.isGafferHouse){
    if(ctx.questState==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: A Proper Rake';
      document.getElementById('quest-desc').textContent = "Gaffer Thistlewick's rake was stolen and stripped apart by gnomes in the Overgrown Commons. He's looking for someone to bring back its tines.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.questState==='active'){
      document.getElementById('quest-name').textContent = 'Quest: A Proper Rake';
      document.getElementById('quest-desc').textContent = "Bring back the rake's tines from the gnomes in the Overgrown Commons, and Gaffer will put it back together.";
      document.getElementById('quest-progress').textContent = `Rake tines turned in: ${state.questTinesGiven}/${QUEST_TINES_NEEDED}`;
    }
  } else if(ctx.isGuild){
    if(ctx.quest2State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: The Gnome Commander';
      document.getElementById('quest-desc').textContent = "Word has spread of a gnome commander rallying the Overgrown Commons. He's rare, dangerous, and worth putting down.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest2State==='active'){
      document.getElementById('quest-name').textContent = 'Quest: The Gnome Commander';
      document.getElementById('quest-desc').textContent = "Hunt down and defeat the gnome commander in the Overgrown Commons. He's rare — keep adventuring until he shows himself.";
      document.getElementById('quest-progress').textContent = state.commanderDefeated ? 'Commander defeated — report back!' : 'Commander not yet encountered.';
    } else if(ctx.quest6State==='active'){
      document.getElementById('quest-name').textContent = "Quest: The Gnome King's Throne";
      document.getElementById('quest-desc').textContent = "Hunt down and defeat the Gnome King's captain, left to guard his retreat in the Sunless Vault. He's rare — keep adventuring until he shows himself.";
      document.getElementById('quest-progress').textContent = state.quest6RareDefeated ? "Captain defeated — report back!" : "Captain not yet encountered.";
    } else if(ctx.quest6State==='offer'){
      document.getElementById('quest-name').textContent = "Quest available: The Gnome King's Throne";
      document.getElementById('quest-desc').textContent = "Rumor has it the Gnome King's rear-guard captain is holding the line somewhere deep in the Sunless Vault, buying the King time to run. The guildmaster would very much like that arrangement ended.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest7State==='offer'){
      document.getElementById('quest-name').textContent = "Quest available: The Gnome King's Court";
      document.getElementById('quest-desc').textContent = `The King slipped deeper into Gnometropolis, behind a palace gate that isn't opening for just anyone. The guildmaster reckons the way in is shaped by who you've become as a ${state.classTitle} — find your district in Gnometropolis and prove it to whoever's guarding it.`;
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest7State==='active'){
      const quest7GearName = ctx.palaceGateGearItem ? ctx.palaceGateGearItem.name : 'the right gear';
      document.getElementById('quest-name').textContent = "Quest: The Gnome King's Court";
      document.getElementById('quest-desc').textContent = `Defeat your district's guardian in Gnometropolis to claim ${quest7GearName}, equip it, then approach the palace gate. Five guards stand between you and the throne room — clear them all, then face the real Gnome King.`;
      document.getElementById('quest-progress').textContent = 'Not yet confronted the King.';
    } else if(ctx.quest7State==='ready'){
      document.getElementById('quest-name').textContent = "Quest: The Gnome King's Court";
      document.getElementById('quest-desc').textContent = "The King has fallen — report back to the guildmaster.";
      document.getElementById('quest-progress').textContent = 'Ready to report.';
    }
  } else if(ctx.isGnomeGuild){
    if(ctx.quest8State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: New Digs';
      document.getElementById('quest-desc').textContent = "The guildmaster's set up shop in Gnometropolis. Make it official — sign on and take charge here.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest8State==='active'){
      document.getElementById('quest-name').textContent = 'Quest: New Digs';
      document.getElementById('quest-desc').textContent = "Sign the ledger and make it official.";
      document.getElementById('quest-progress').textContent = 'Ready to sign.';
    } else if(ctx.quest9State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: What the Throne Room Opened';
      document.getElementById('quest-desc').textContent = "The guildmaster's found something in paperwork older than the palace itself — a sealed passage, cracked open by the fight with the Gnome King. Something's been living down there a very long time, and it isn't happy about the light. Go find out what — and watch yourself down there.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest9State==='stage1'){
      document.getElementById('quest-name').textContent = 'Quest: What the Throne Room Opened';
      document.getElementById('quest-desc').textContent = "Whatever's down there isn't going to introduce itself. Keep going.";
      document.getElementById('quest-progress').textContent = "It hasn't shown itself yet.";
    } else if(ctx.quest9State==='stage2'){
      document.getElementById('quest-name').textContent = 'Quest: What the Throne Room Opened';
      document.getElementById('quest-desc').textContent = "You've gone further than anyone in living memory — and further than whatever you just fought expected. There's more ahead. Don't stop now.";
      document.getElementById('quest-progress').textContent = 'Something further in noticed you coming.';
    } else if(ctx.quest9State==='ready'){
      document.getElementById('quest-name').textContent = 'Quest: What the Throne Room Opened';
      document.getElementById('quest-desc').textContent = "You've seen enough to know this isn't an empty hole in the ground. Head back and tell the guildmaster what you found.";
      document.getElementById('quest-progress').textContent = 'Ready to report.';
    } else if(ctx.quest10State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: Whatever\'s Listening';
      document.getElementById('quest-desc').textContent = "Whatever's coordinating those outposts isn't going to introduce itself either. Find someone who'll talk, or find the paperwork that already has.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest10State==='active'){
      document.getElementById('quest-name').textContent = "Quest: Whatever's Listening";
      document.getElementById('quest-desc').textContent = "Keep looking. Either lead gets you there — you just have to actually find one of them.";
      document.getElementById('quest-progress').textContent = "Nobody's talked yet, and nothing's turned up in writing either.";
    } else if(ctx.quest10State==='ready'){
      document.getElementById('quest-name').textContent = "Quest: Whatever's Listening";
      document.getElementById('quest-desc').textContent = "You found a way in. Head back and tell the guildmaster what you learned.";
      document.getElementById('quest-progress').textContent = 'Ready to report.';
    }
  } else if(ctx.isHoodoo){
    if(ctx.quest3State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: A Proper Potion';
      document.getElementById('quest-desc').textContent = "The Hoodoo Doctor wants to brew something powerful, but needs fresh ingredients — a couple from the Overgrown Commons, a couple from the Dank Sewers.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest3State==='active'){
      document.getElementById('quest-name').textContent = 'Quest: A Proper Potion';
      document.getElementById('quest-desc').textContent = "Gather the ingredients from monsters in the Overgrown Commons and the Dank Sewers, then bring them back to brew the potion.";
      document.getElementById('quest-progress').textContent = `Ingredients gathered: ${ctx.ingredientsHeld}/${potionIngredients.length}`;
    }
  } else if(ctx.isTinker){
    if(ctx.quest4State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: What the Sewers Shed';
      document.getElementById('quest-desc').textContent = "Strange clockwork parts keep turning up in the Dank Sewers. The Tinker wants to know what's shedding them, and would like it stopped.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest4State==='active'){
      document.getElementById('quest-name').textContent = 'Quest: What the Sewers Shed';
      document.getElementById('quest-desc').textContent = "Find and defeat whatever's loose in the Dank Sewers. It's rare — keep adventuring until it shows itself.";
      document.getElementById('quest-progress').textContent = state.quest4RareDefeated ? 'Digger-bot defeated — report back!' : 'Digger-bot not yet encountered.';
    } else if(ctx.quest5State==='offer'){
      document.getElementById('quest-name').textContent = 'Quest available: The Vein';
      document.getElementById('quest-desc').textContent = "The Tinker wants intact parts — a couple from the Clockwork Quarry, a couple more from deeper in the Dank Sewers — to trace where the old vein of gnome-tech actually leads.";
      document.getElementById('quest-progress').textContent = 'Not yet accepted.';
    } else if(ctx.quest5State==='active'){
      document.getElementById('quest-name').textContent = 'Quest: The Vein';
      document.getElementById('quest-desc').textContent = "Gather parts from monsters in the Clockwork Quarry and the Dank Sewers, then bring them back to the Tinker.";
      document.getElementById('quest-progress').textContent = `Parts gathered: ${ctx.veinHeld}/${ctx.veinNeeded}`;
    }
  }
}

/* Job 3: the Map drawer's own sync — the advisory "Recommended: Level
X-Y" tag on every zone card, each priced card's Biscuit-cost text, each
zone card's lock state, and the Act1/Act2 tab toggle. */
function syncMapDrawer(ctx){
  /* Recommended-level guideline on every adventure zone's Map card
  (ZONE_LEVEL_RECOMMENDATION, content.js) — purely advisory, doesn't gate
  anything (that's still state.questXComplete/travelTo()'s own checks),
  just tells the player roughly which levels this zone is meant for.
  `min` is a floor (below it, colored red — same "pay attention" language
  .ztag's "Locked" text already uses); `max`, where the zone has one,
  rounds it out into a real range rather than just an open-ended "+". */
  Object.keys(ZONE_LEVEL_RECOMMENDATION).forEach(zone => {
    const el = document.getElementById(`zlevel-${zone}`);
    if(!el) return;
    const rec = ZONE_LEVEL_RECOMMENDATION[zone];
    el.textContent = `Recommended: Level ${rec.min}${rec.max ? `-${rec.max}` : '+'}`;
    el.style.color = state.level >= rec.min ? 'var(--tan)' : 'var(--red)';
  });

  /* Biscuit cost of the trip to each priced Map card — reads travelCostFor()
  (town.js), which prices every one of these by DISTANCE from wherever the
  character actually CURRENTLY resides on the Map's main chain (ZONE_ORDER,
  content.js), not a flat per-destination price: one step over costs 1
  Biscuit no matter which two zones that step is between (Gnometropolis ->
  Mudroot Warren costs the same as Commons -> Sewers), and standing
  anywhere already inside a hub's own area (its square, any of its
  districts, or any of its plain buildings — HUB_TOWNS, hubs.js) makes
  re-entering that hub free. 'town' has no card of its own here — heading
  home is always free, so there's nothing to price. Districts/palace also
  have no card of their own (only reachable from inside the Gnometropolis/
  Mudroot Warren square), so there's nothing to show for them either. */
  ZONE_ORDER.filter(zone => zone !== 'town').forEach(zone => {
    const el = document.getElementById(`zcost-${zone}`);
    if(!el) return;
    const cost = travelCostFor(zone);
    el.textContent = cost <= 0 ? "You're already in the area — free to enter" : `Costs ${cost} Biscuit${cost===1?'':'s'} to travel here`;
  });

  const sewersUnlocked = state.quest2Complete;
  document.getElementById('zone-card-sewers').classList.toggle('locked', !sewersUnlocked);
  document.getElementById('ztag-sewers').textContent = sewersUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-sewers').style.display = sewersUnlocked ? (ctx.isSewers ? 'block' : 'none') : 'block';

  const quarryUnlocked = state.quest4Complete;
  document.getElementById('zone-card-quarry').classList.toggle('locked', !quarryUnlocked);
  document.getElementById('ztag-quarry').textContent = quarryUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-quarry').style.display = quarryUnlocked ? (ctx.isQuarry ? 'block' : 'none') : 'block';

  const vaultUnlocked = state.quest5Complete;
  document.getElementById('zone-card-vault').classList.toggle('locked', !vaultUnlocked);
  document.getElementById('ztag-vault').textContent = vaultUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-vault').style.display = vaultUnlocked ? (ctx.isVault ? 'block' : 'none') : 'block';

  const gnometropolisUnlocked = state.quest6Complete;
  document.getElementById('zone-card-gnometropolis').classList.toggle('locked', !gnometropolisUnlocked);
  document.getElementById('ztag-gnometropolis').textContent = gnometropolisUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-gnometropolis').style.display = gnometropolisUnlocked ? (ctx.inGnometropolisArea ? 'block' : 'none') : 'block';

  const mudrootwarrenUnlocked = state.quest9Accepted;
  document.getElementById('zone-card-mudrootwarren').classList.toggle('locked', !mudrootwarrenUnlocked);
  document.getElementById('ztag-mudrootwarren').textContent = mudrootwarrenUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-mudrootwarren').style.display = mudrootwarrenUnlocked ? (ctx.inMudrootWarrenArea ? 'block' : 'none') : 'block';

  const warrensearUnlocked = !!state.quest10Path;
  document.getElementById('zone-card-warrensear').classList.toggle('locked', !warrensearUnlocked);
  document.getElementById('ztag-warrensear').textContent = warrensearUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-warrensear').style.display = warrensearUnlocked ? (ctx.inWarrensEarArea ? 'block' : 'none') : 'block';

  /* Map drawer's Act 1/Act 2 tab split (mapTab, player-actions.js) — pure
  UI state, mirrors shopTab's own active/inactive button-class toggle. */
  document.getElementById('map-tab-act1-btn').classList.toggle('btn-primary', mapTab==='act1');
  document.getElementById('map-tab-act1-btn').classList.toggle('btn-secondary', mapTab!=='act1');
  document.getElementById('map-tab-act2-btn').classList.toggle('btn-primary', mapTab==='act2');
  document.getElementById('map-tab-act2-btn').classList.toggle('btn-secondary', mapTab!=='act2');
  document.getElementById('map-act1-cards').style.display = mapTab==='act1' ? '' : 'none';
  document.getElementById('map-act2-cards').style.display = mapTab==='act2' ? '' : 'none';
}

/* Job 4: combat-adjacent button visibility — the Attack/Use/Flee row,
the Use menu, explore-row/class-area-row, and the Palace's own row. */
function syncCombatUI(ctx){
  document.getElementById('combat-row').style.display = (state.inCombat && combatSubView==='main') ? 'flex' : 'none';
  document.getElementById('spell-menu').style.display = (state.inCombat && combatSubView==='spells') ? 'block' : 'none';
  if(state.inCombat && combatSubView==='spells') renderSpellMenu();
  if(state.inCombat){
    /* Matches renderSpellMenu()'s own contents (render-character.js) —
    the Use menu lists damage spells, non-damage "Buffs & Support"
    spells (ward/heal/buff/shout — Warding Charm, Smoke Screen, etc.),
    AND usable HP/MP/luck consumables, so the button should only
    disable when there's genuinely none of the three. */
    const hasDamageSpell = spells.some(s => s.type==='damage' && state.spellsKnown.includes(s.id));
    const hasBuffSpell = spells.some(s => s.type!=='damage' && state.spellsKnown.includes(s.id));
    const hasUsableItem = state.inventory.some(it => ['hp','mp','luck'].includes(it.type));
    document.getElementById('use-btn').disabled = !hasDamageSpell && !hasBuffSpell && !hasUsableItem;
  }
  /* Garrison/Rogues' Den/Arcane Sanctum only get the Adventure! loop
  (CLASS_AREA_ZONES, combat.js) before quest7Complete — once converted,
  class-area-row below takes over as their only navigation, since
  explore-row (with its own "Return to Map" button baked in) is the
  ONLY thing that gave any of these screens a way back to the Map. */
  const inUnconvertedClassArea = (ctx.isGarrison || ctx.isRoguesden || ctx.isSanctum) && !state.quest7Complete;
  /* Excludes Rogues' Den while sitting at its own Hi-Lo table (hilo.js)
  — same "own uncluttered screen" reasoning as everywhere else Hi-Lo
  hides the building's normal furniture; "Return to Map" isn't part of
  that screen either, hilo-bet-row's own "Leave Table" is. */
  const inConvertedClassArea = (ctx.isGarrison || ctx.isRoguesden || ctx.isSanctum) && state.quest7Complete && !(ctx.isRoguesden && state.hilo);
  document.getElementById('explore-row').style.display = ((ctx.isCommons || ctx.isSewers || ctx.isQuarry || ctx.isVault || ctx.isRootCellar || ctx.isMudflats || ctx.isBureau || ctx.isChoir || ctx.isLedgerVault || inUnconvertedClassArea) && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('class-area-row').style.display = (inConvertedClassArea && !state.inCombat) ? 'flex' : 'none';
  /* The Palace has no Explore row (it's not an ADVENTURE_ZONES entry —
  one scripted fight, not somewhere to wander) and palace-gate-row only
  shows the Approach button while the fight is still pending, so
  without this there was NO way to leave the Palace screen at all
  once quest7RareDefeated flips true after beating the real gnomeKing
  (winCombat() leaves state.location at 'palace' to show the victory
  banner there) — the player was stuck. Always available at the
  Palace, win/lose/not-yet-fought alike, same as every other screen's
  own persistent nav button. */
  document.getElementById('palace-row').style.display = (ctx.isPalace && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('palace-gate-row').style.display = ctx.canApproachPalaceGate ? 'flex' : 'none';
  /* Button text tracks palaceGauntletProgress (guild.js) through the
  5-guard gauntlet — same button, re-clicked to advance one step at a
  time, so it needs to say which step comes next. */
  if(ctx.canApproachPalaceGate){
    document.getElementById('palace-gate-btn').textContent = palaceGauntletProgress === 0
      ? 'Approach the Palace Gate'
      : palaceGauntletProgress < PALACE_GUARDS.length
        ? `Face the Next Guard (${palaceGauntletProgress+1}/${PALACE_GUARDS.length})`
        : 'Confront the Gnome King';
  }
  document.getElementById('monster-card').classList.toggle('active', state.inCombat);
  document.getElementById('scene-art').classList.toggle('boss-encounter', !!(state.inCombat && state.monster && state.monster.rare));
}

/* Job 5: which scene-art SVG is showing — one big dispatch chain, one
branch per possible location/combat state. */
function renderSceneArt(ctx){
  if(state.inCombat){
    document.getElementById('scene-art').innerHTML = state.monster.art();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(state.showVictory && state.victoryMonster){
    document.getElementById('scene-art').innerHTML = artDefeated(state.victoryMonster.art);
    document.getElementById('victory-banner').style.display = 'block';
    document.getElementById('victory-drops').innerHTML = victoryDropsHtml(state.victoryMonster.drops);
  } else if(ctx.isGafferHouse){
    document.getElementById('scene-art').innerHTML = artVillager();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isShop){
    document.getElementById('scene-art').innerHTML = artShopkeeper();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isHoodoo){
    document.getElementById('scene-art').innerHTML = artHoodooDoctor();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isGuild){
    document.getElementById('scene-art').innerHTML = artGuildmaster();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isTinker){
    document.getElementById('scene-art').innerHTML = artTinker();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isCasino){
    document.getElementById('scene-art').innerHTML = artCroupier();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isNoticeBoard){
    document.getElementById('scene-art').innerHTML = artNoticeBoard();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isTownSquare){
    const gafferFlag = ctx.questState==='offer' ? 'offer' : (ctx.questState==='active' && ctx.tinesHeld>0 ? 'turnin' : null);
    const guildFlag = ctx.quest2State==='offer' ? 'offer'
      : (ctx.quest2State==='active' && state.commanderDefeated ? 'turnin'
         : (ctx.quest6State==='offer' ? 'offer'
            : (ctx.quest6State==='active' && state.quest6RareDefeated ? 'turnin' : null)));
    /* NOTE: the "ready to turn in" branches below must use the raw
    underlying conditions (ingredientsHeld/state.quest4RareDefeated/
    veinHeld), NOT canBrew/canReportDigger/canTurnInVein — those three
    are gated by isHoodoo/isTinker (true only while standing inside
    that building), which is always false here since this flag is
    computed for the town-square scene. Using the gated versions was a
    real bug: it made the green "turn it in" flag on the Hoodoo
    Doctor's Shack and the Tinker's Workshop permanently unreachable
    from the town square (only the red "quest offered" flag ever
    showed). Don't reintroduce the gated variables here. */
    const hoodooFlag = ctx.quest3State==='offer' ? 'offer' : (ctx.quest3State==='active' && ctx.ingredientsHeld === potionIngredients.length ? 'turnin' : null);
    const tinkerFlag = (ctx.quest4State==='offer' || ctx.quest5State==='offer') ? 'offer' : ((ctx.quest4State==='active' && state.quest4RareDefeated) || (ctx.quest5State==='active' && ctx.veinHeld === ctx.veinNeeded) ? 'turnin' : null);
    /* Not gated on ensureActiveBounty() here -- that's only called where a
    bounty is actually read/displayed (Bounty Board, Quest Log). Reading
    state.activeBounty directly for this glow is fine: isBountyReady()
    already returns false for a null/expired-but-not-yet-rerolled bounty,
    and the indicator only needs to reflect known-ready progress, not
    force a reroll just by walking past the square. */
    const guildBountyReady = isBountyReady();
    /* null (no overlay) once the cooldown has actually elapsed — same
    "read state directly, don't force anything" reasoning as guildBountyReady
    above. updateInnCooldownDisplay() (town.js) ticks the text live and
    re-renders once this crosses zero, so the overlay disappears without
    needing a click. */
    const innCooldownLeft = INN_COOLDOWN_MS - (Date.now() - state.lastInnRestAt);
    const innCooldownText = innCooldownLeft > 0 ? formatMs(innCooldownLeft) : null;
    /* Same "trial accepted, this specific tier not yet passed" condition
    each start-trial-fight-*-btn already gates on — a class-trial
    fight is available and not yet passed at that one building. */
    const guildTrialReady = ctx.classQuestState==='trials' && !state.classTrialGuildPassed;
    const casinoTrialReady = ctx.classQuestState==='trials' && !state.classTrialCasinoPassed;
    const hoodooTrialReady = ctx.classQuestState==='trials' && !state.classTrialHoodooPassed;
    /* One {flag, bounty, trial} slot per building tile (artTownSquare(),
    art.js) — every building gets an entry here (even ones with nothing to
    show yet) so a future indicator on the Inn/Shop/Fountain/Town Lot is
    just adding a key to its object, not changing artTownSquare's
    signature again. */
    const buildingIndicators = {
      gaffer: { flag: gafferFlag },
      hoodoo: { flag: hoodooFlag, trial: hoodooTrialReady },
      rest: {},
      tinker: { flag: tinkerFlag },
      townlot: {},
      shop: {},
      guild: { flag: guildFlag, bounty: guildBountyReady, trial: guildTrialReady },
      fountain: {},
      casino: { trial: casinoTrialReady },
    };
    document.getElementById('scene-art').innerHTML = artTownSquare(buildingIndicators, state.lotTier, innCooldownText, state.buildingUpgrades);
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isGnometropolis){
    /* One {flag} slot per real building tile (artGnometropolisSquare(),
    gnometropolis-art.js), same buildingIndicators shape as the town
    square above. flag:'offer' marks the district matching the player's
    own class while its guardian is still alive (the rare-encounter hunt
    is live — see the *Hunt blocks in goAdventuring(), combat.js); the
    Palace tile flags 'turnin' once all the gear's in hand and the gate
    fight is ready to start; the Camp flags 'offer' whenever the player
    isn't at full HP, nudging toward restAtCamp() (gnometropolis.js). */
    const gnomeBuildingIndicators = {
      garrison: { flag: (state.classTitle==='Meathead' && state.quest7Accepted && !state.quest7Complete && !state.garrisonGuardianDefeated) ? 'offer' : null },
      roguesden: { flag: (state.classTitle==='Card Shark' && state.quest7Accepted && !state.quest7Complete && !state.roguesDenEnforcerDefeated) ? 'offer' : null },
      sanctum: { flag: (state.classTitle==='Hexpert' && state.quest7Accepted && !state.quest7Complete && !state.arcaneSanctumGuardianDefeated) ? 'offer' : null },
      palace: { flag: ctx.canApproachPalaceGate ? 'turnin' : null },
      camp: { flag: state.hp < state.maxHp ? 'offer' : null },
      /* Combined with quest9's own offer/ready states — this tile is
      "something to do at the Guild," not a marker for where quest9's
      combat stages actually are (those show no flag anywhere). */
      gnomeguild: { flag: (ctx.quest8State==='offer' || ctx.quest9State==='offer' || ctx.quest10State==='offer') ? 'offer' : ((ctx.quest8State==='active' || ctx.quest9State==='ready' || ctx.quest10State==='ready') ? 'turnin' : null) },
      gnomeshop: {},
      gnometownlot: {},
    };
    /* Same cooldown-overlay pattern as the Inn's innCooldownText above,
    just for restAtCamp()'s CAMP_COOLDOWN_MS (content.js) instead. */
    const campCooldownLeft = CAMP_COOLDOWN_MS - (Date.now() - state.lastCampRestAt);
    const campCooldownText = campCooldownLeft > 0 ? formatMs(campCooldownLeft) : null;
    document.getElementById('scene-art').innerHTML = artGnometropolisSquare(gnomeBuildingIndicators, campCooldownText, state.gnomeLotTier, state.quest7Complete);
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isMudrootWarren){
    /* Mirrors gnomeBuildingIndicators above. No flag on any of the three —
    a flag here would be exactly the kind of quest marker the user asked
    not to have; the district's own tile art (artMudrootWarrenSquare(),
    mudroot-art.js) is the only thing that changes once tunnelWardenDefeated,
    and even that's a reveal, not a pointer. All three districts are real
    combat zones (Root Cellar/Mudflats/Bureau) — there's no rest tile in
    this hub at all, per the user's own "multiple combat zones, not a
    combat zone and a recovery zone" instruction. */
    const mudrootBuildingIndicators = {
      rootcellar: {},
      mudflats: {},
      bureau: {},
    };
    document.getElementById('scene-art').innerHTML = artMudrootWarrenSquare(mudrootBuildingIndicators, state.tunnelWardenDefeated, !!state.quest10Path);
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isRootCellar){
    document.getElementById('scene-art').innerHTML = artZoneRootCellar();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isMudflats){
    document.getElementById('scene-art').innerHTML = artZoneMudflats();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isBureau){
    document.getElementById('scene-art').innerHTML = artZoneBureau();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isWarrensEar){
    /* Same "no flag, reveal not a pointer" treatment as Mudroot Warren
    above — quest10Path being set is what unlocked this hub at all, so
    there's nothing left to flag here; which of the two districts is
    real is entirely down to tunnelMoleInformantDefeated/
    seniorClerkDefeated (artWarrensEarSquare(), warrensear-art.js). */
    document.getElementById('scene-art').innerHTML = artWarrensEarSquare(state.tunnelMoleInformantDefeated, state.seniorClerkDefeated);
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isChoir){
    document.getElementById('scene-art').innerHTML = artZoneChoir();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isLedgerVault){
    document.getElementById('scene-art').innerHTML = artZoneLedgerVault();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isGnomeGuild){
    /* Reuses artGuildmaster() (art.js) — same guildmaster, new office,
    no new art needed for a building that's otherwise plain quest-box/
    bounty-box UI like Gladstone's own Guild. */
    document.getElementById('scene-art').innerHTML = artGuildmaster();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isGnomeShop){
    /* Reuses artShopkeeper() (art.js) — same shopkeeper archetype, no new
    art needed for what's otherwise plain shop-list UI (renderGnomeShop(),
    render-shop.js). */
    document.getElementById('scene-art').innerHTML = artShopkeeper();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isGarrison){
    document.getElementById('scene-art').innerHTML = artZoneGarrison();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isRoguesden){
    document.getElementById('scene-art').innerHTML = artZoneRoguesden();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isSanctum){
    document.getElementById('scene-art').innerHTML = artZoneSanctum();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isPalace){
    document.getElementById('scene-art').innerHTML = artPalaceGate();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isCommons){
    document.getElementById('scene-art').innerHTML = artZoneCommons();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isSewers){
    document.getElementById('scene-art').innerHTML = artZoneSewers();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isQuarry){
    document.getElementById('scene-art').innerHTML = artZoneQuarry();
    document.getElementById('victory-banner').style.display = 'none';
  } else if(ctx.isVault){
    document.getElementById('scene-art').innerHTML = artZoneVault();
    document.getElementById('victory-banner').style.display = 'none';
  } else {
    document.getElementById('scene-art').innerHTML = artIdle();
    document.getElementById('victory-banner').style.display = 'none';
  }
}

/* Job 6: the combat HUD (monster name/HP bar/HP text) — reads
state.monster directly, no ctx needed. */
function syncCombatHud(){
  if(state.inCombat){
    document.getElementById('monster-name').textContent = capitalize(state.monster.name);
    document.getElementById('monster-hp-bar').style.width = (state.monster.hp/state.monster.maxHp*100)+'%';
    document.getElementById('monster-hp-text').textContent = state.monster.hp+'/'+state.monster.maxHp;
  }
}

function countRakeTines(){
  return state.inventory.filter(it => it.key === 'rakeTine').length;
}

function countPotionIngredientsHeld(){
  return potionIngredients.filter(p => state.inventory.some(it => it.key === p.item.key)).length;
}

/* Sums held copies of each vein ingredient, capped per-type at
VEIN_ITEM_COUNT_NEEDED (holding extra copies of one type — which
shouldn't normally happen since winCombat() stops force-dropping once
the cap is reached — doesn't let it count toward a different type's
requirement). */
function countVeinIngredientsHeld(){
  return veinIngredients.reduce((sum, v) =>
    sum + Math.min(VEIN_ITEM_COUNT_NEEDED, state.inventory.filter(it => it.key === v.item.key).length), 0);
}

function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

function log(text, cls){
  const div = document.createElement('div');
  div.className = 'entry '+(cls||'');
  div.textContent = text;
  const logEl = document.getElementById('log');
  logEl.insertBefore(div, logEl.firstChild);
}

function clearLog(){
  document.getElementById('log').innerHTML = '';
}
