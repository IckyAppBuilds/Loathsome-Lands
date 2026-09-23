/* ---------------- Rendering ---------------- */
function render(){
  document.getElementById('hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('hp-text').textContent = state.hp+' / '+state.maxHp + (state.shield>0 ? ` (+${state.shield} 🛡)` : '');
  document.getElementById('inv-count').textContent = state.inventory.length;
  updateMpDisplay();
  updateBiscuitDisplay();

document.getElementById('level-text').textContent = state.level;
  document.getElementById('xp-bar').style.width = (state.xp/state.xpToLevel*100)+'%';
  document.getElementById('xp-text').textContent = state.xp+'/'+state.xpToLevel;

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
  /* Any of the Gnometropolis square + its 3 districts + the palace gate —
  used where the Map's "you are here" tag/lock state shouldn't go dark
  just because the player stepped off the square into a district. */
  const inGnometropolisArea = isGnometropolis || isGarrison || isRoguesden || isSanctum || isPalace;
  const isCasino = state.location === 'casino';
  const isNoticeBoard = state.location === 'noticeboard';
  const inTownArea = isTownSquare || isGafferHouse || isShop || isHoodoo || isGuild || isTinker || isCasino || isTownLot || isNoticeBoard;

document.getElementById('poptab-text').textContent = state.popTabs;

const ZONE_TITLES = {
  gaffer: "Gaffer Thistlewick's Cottage", shop: 'The Shop', hoodoo: "The Hoodoo Doctor's Shack",
  guild: "The Adventurers' Guild", tinker: "Tinker's Workshop", casino: 'The Casino',
  noticeboard: 'The Notice Board', town: 'Gladstone Hollow', commons: 'The Overgrown Commons',
  sewers: 'Dank Sewers', quarry: 'The Clockwork Quarry', vault: 'The Sunless Vault',
  gnometropolis: 'Gnometropolis', garrison: 'The Garrison', roguesden: "The Rogues' Den",
  sanctum: 'The Arcane Sanctum', palace: 'The Palace Gate',
};
document.getElementById('zone-title').textContent = isTownLot ? LOT_TIER_NAMES[state.lotTier] : (ZONE_TITLES[state.location] || 'The Overgrown Commons');
  document.getElementById('ztag-town').style.display = inTownArea ? 'block' : 'none';
  document.getElementById('ztag-commons').style.display = isCommons ? 'block' : 'none';
  /* !state.inCombat matters here specifically for the Guild's own Trial
  fight (startClassTrialGuild(), guild.js) — it's the one forced boss
  fight that runs while state.location stays at a town building instead
  of an exploration zone, so without this guard the building's own
  quest text/bounty board/spell-trainer list would float on top of the
  combat screen the whole fight. Every other forced fight (gnomeCommander/
  diggerBot/gnomeKingsCaptain/gnomeKing/the district guardians) already
  runs in a zone, where none of these building-only blocks ever show in
  the first place — this is the one location that needed the same
  "combat is its own clean screen" treatment applied explicitly. */
  document.getElementById('bounty-box').style.display = (!state.inCombat && isGuild && state.questComplete) ? 'block' : 'none';
  if(!state.inCombat && isGuild && state.questComplete) renderBountyBoard();
  document.getElementById('town-row').style.display = (isTownSquare && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-row').style.display = (isShop && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-list').style.display = isShop ? 'block' : 'none';
  if(isShop) renderShop();

document.getElementById('hoodoo-row').style.display = (isHoodoo && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('hoodoo-list').style.display = (isHoodoo && !state.inCombat) ? 'block' : 'none';
  if(isHoodoo && !state.inCombat){
    renderHoodooShop();
    renderClassSkillUpgrade('hoodoo-classskill-block', 'Hexpert');
  } else {
    document.getElementById('hoodoo-class-spell-list').style.display = 'none';
    document.getElementById('hoodoo-classskill-block').style.display = 'none';
  }

document.getElementById('guild-spell-list').style.display = (isGuild && !state.inCombat) ? 'block' : 'none';
  if(isGuild && !state.inCombat){
    renderClassSpellList('guild-spell-list', 'Meathead');
    renderClassSkillUpgrade('guild-classskill-block', 'Meathead');
  } else {
    document.getElementById('guild-classskill-block').style.display = 'none';
  }

document.getElementById('townlot-row').style.display = (isTownLot && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('townlot-list').style.display = isTownLot ? 'block' : 'none';
  if(isTownLot) renderTownLot();

document.getElementById('casino-bet-row').style.display = (isCasino && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('casino-row').style.display = (isCasino && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('bet-5-btn').disabled = state.popTabs < 5;
  document.getElementById('bet-10-btn').disabled = state.popTabs < 10;
  document.getElementById('bet-25-btn').disabled = state.popTabs < 25;

document.getElementById('casino-winnings-box').style.display = (isCasino && !state.inCombat && casinoWinningsCap() > 0) ? 'block' : 'none';
  if(isCasino && !state.inCombat) renderCasinoWinningsBox();

document.getElementById('casino-spell-list').style.display = (isCasino && !state.inCombat) ? 'block' : 'none';
  if(isCasino && !state.inCombat){
    renderClassSpellList('casino-spell-list', 'Card Shark');
    renderClassSkillUpgrade('casino-classskill-block', 'Card Shark');
  } else {
    document.getElementById('casino-classskill-block').style.display = 'none';
  }

document.getElementById('noticeboard-row').style.display = (isNoticeBoard && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('noticeboard-hint').style.display = isNoticeBoard ? 'block' : 'none';
  document.getElementById('noticeboard-list').style.display = isNoticeBoard ? 'block' : 'none';
  if(isNoticeBoard) renderNoticeBoard();
  else {
    document.getElementById('noticeboard-post').style.display = 'none';
    document.getElementById('noticeboard-guest-hint').style.display = 'none';
  }

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

/* Biscuit cost of the trip to each priced Map card (ZONE_TRAVEL_COST,
content.js) — shown up front so the price is known before clicking, not
just after (travelTo()'s own log line, town.js, still shows it too).
Districts/palace have no card of their own here (only reachable from
inside the Gnometropolis square, see isGnometropolisArea(), town.js),
so there's nothing to show for them. */
Object.keys(ZONE_TRAVEL_COST).forEach(zone => {
  const el = document.getElementById(`zcost-${zone}`);
  if(!el) return;
  const cost = ZONE_TRAVEL_COST[zone];
  el.textContent = `Costs ${cost} Biscuit${cost===1?'':'s'} to travel here`;
});

const sewersUnlocked = state.quest2Complete;
  document.getElementById('zone-card-sewers').classList.toggle('locked', !sewersUnlocked);
  document.getElementById('ztag-sewers').textContent = sewersUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-sewers').style.display = sewersUnlocked ? (isSewers ? 'block' : 'none') : 'block';

const quarryUnlocked = state.quest4Complete;
  document.getElementById('zone-card-quarry').classList.toggle('locked', !quarryUnlocked);
  document.getElementById('ztag-quarry').textContent = quarryUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-quarry').style.display = quarryUnlocked ? (isQuarry ? 'block' : 'none') : 'block';

const vaultUnlocked = state.quest5Complete;
  document.getElementById('zone-card-vault').classList.toggle('locked', !vaultUnlocked);
  document.getElementById('ztag-vault').textContent = vaultUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-vault').style.display = vaultUnlocked ? (isVault ? 'block' : 'none') : 'block';

const gnometropolisUnlocked = state.quest6Complete;
  document.getElementById('zone-card-gnometropolis').classList.toggle('locked', !gnometropolisUnlocked);
  document.getElementById('ztag-gnometropolis').textContent = gnometropolisUnlocked ? 'You are here' : 'Locked';
  document.getElementById('ztag-gnometropolis').style.display = gnometropolisUnlocked ? (inGnometropolisArea ? 'block' : 'none') : 'block';

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

/* 'trials': accepted, but not all three trainers' tests are passed yet.
'ready': all three passed, waiting on claimClassPath(chosenStat) — see the
three claim-path-*-btn buttons below and their isGuild=='ready' branch. */
const classQuestState = state.classQuestComplete ? 'complete'
  : !state.classQuestAccepted ? ((state.quest2Complete && state.level>=10) ? 'offer' : 'locked')
  : (state.classTrialGuildPassed && state.classTrialCasinoPassed && state.classTrialHoodooPassed) ? 'ready'
  : 'trials';

/* The Adventurer's Trial gets its own dialog box at the Guild, separate
from quest-box (which stays reserved for quest2/quest6/quest7's own
text) — reaching level 10, the Trial's only real gate besides
quest2Complete, can easily land mid-quest6 or mid-quest7, and hiding
either dialog to show the other meant a player couldn't see (or act on)
a mainline quest that was still genuinely active. Its own accept/fight/claim buttons live in their own trial-row (below,
separate from guild-row's mainline-quest buttons) and already show
independently of quest6/7's state, so this box is purely the
informational half — the Guild keeps working normally underneath it no
matter what it's showing. */
document.getElementById('guild-trial-box').style.display = (isGuild && !state.inCombat && classQuestState!=='locked' && classQuestState!=='complete') ? 'block' : 'none';
  if(isGuild && !state.inCombat && classQuestState==='offer'){
    document.getElementById('trial-name').textContent = "Quest available: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "You've reached level 10. The guildmaster looks you over — really looks, this time. There's a Trial for adventurers who come this far, and it isn't the Guild's alone to give: the guildmaster, the Casino's croupier, and the Hoodoo Doctor each test something different before a name gets put to what you've become.";
    document.getElementById('trial-progress').textContent = 'Not yet accepted.';
  } else if(isGuild && !state.inCombat && classQuestState==='trials'){
    document.getElementById('trial-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "Three trainers, three fights, and no partial credit. Beat the Guild's Trial Champion, outlast the Casino's own card shark, and put down the Hoodoo Doctor's summoned spirit with a killing blow from a spell. Pass all three, then come back here to claim your path.";
    document.getElementById('trial-progress').textContent = `Guild: ${state.classTrialGuildPassed ? '✓ passed' : 'not yet'} — Casino: ${state.classTrialCasinoPassed ? '✓ passed' : 'not yet'} — Hoodoo: ${state.classTrialHoodooPassed ? '✓ passed' : 'not yet'}`;
  } else if(isGuild && !state.inCombat && classQuestState==='ready'){
    document.getElementById('trial-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('trial-desc').textContent = "All three trainers agree: you're ready. The guildmaster will name your path — choose it below.";
    document.getElementById('trial-progress').textContent = 'All three trials passed — claim your path.';
  }

/* Small one-line trial hints on the Casino/Hoodoo screens — same
purpose as guild-trial-box above, just a single-line nudge instead of
a full dialog since neither screen also needs to show its own separate
mainline-quest text alongside it. */
document.getElementById('casino-trial-hint').style.display = (isCasino && classQuestState==='trials') ? 'block' : 'none';
  if(isCasino && classQuestState==='trials'){
    document.getElementById('casino-trial-hint').textContent = state.classTrialCasinoPassed
      ? "You've already put the Casino's own card shark in their place — that trial is passed."
      : "The Croupier nods toward a card shark working the far table — impossible to pin down, by all accounts. Trial-takers prove their nerve by beating them outright.";
  }
  document.getElementById('casino-trial-row').style.display = (isCasino && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('start-trial-fight-casino-btn').style.display = (classQuestState==='trials' && !state.classTrialCasinoPassed) ? '' : 'none';

document.getElementById('hoodoo-trial-hint').style.display = (isHoodoo && classQuestState==='trials') ? 'block' : 'none';
  if(isHoodoo && classQuestState==='trials'){
    document.getElementById('hoodoo-trial-hint').textContent = state.classTrialHoodooPassed
      ? "You've already put the spirit from the pot back where it came from — the killing-blow trial is passed."
      : "The Hoodoo Doctor's summoned something out of the pot to test trial-takers — beat it, and finish it with a spell, not your fists.";
  }
  document.getElementById('hoodoo-trial-row').style.display = (isHoodoo && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('start-trial-fight-hoodoo-btn').style.display = (classQuestState==='trials' && !state.classTrialHoodooPassed) ? '' : 'none';

document.getElementById('gaffer-row').style.display = (isGafferHouse && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest-btn').style.display = questState==='offer' ? '' : 'none';
  document.getElementById('give-tines-btn').style.display = questState==='active' ? '' : 'none';
  document.getElementById('give-tines-btn').disabled = !canGive;
  document.getElementById('give-tines-btn').classList.toggle('btn-ready', canGive);
  document.getElementById('give-tines-btn').textContent = tinesHeld>0 ? `Give Rake Tines (${Math.min(tinesHeld,tinesStillNeeded)})` : 'Give Rake Tines';

document.getElementById('guild-row').style.display = (isGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest2-btn').style.display = quest2State==='offer' ? '' : 'none';
  document.getElementById('report-kill-btn').style.display = quest2State==='active' ? '' : 'none';
  document.getElementById('report-kill-btn').disabled = !canReport;
  document.getElementById('report-kill-btn').classList.toggle('btn-ready', canReport);
  document.getElementById('report-kill-btn').textContent = state.commanderDefeated ? 'Report the Kill' : 'Report the Kill (not yet)';

document.getElementById('accept-quest6-btn').style.display = quest6State==='offer' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').style.display = quest6State==='active' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').disabled = !canReportGnomeKing;
  document.getElementById('report-gnomeking-btn').classList.toggle('btn-ready', canReportGnomeKing);
  document.getElementById('report-gnomeking-btn').textContent = state.quest6RareDefeated ? 'Report the Gnome King' : 'Report the Gnome King (not yet)';

document.getElementById('accept-quest7-btn').style.display = quest7State==='offer' ? '' : 'none';
  document.getElementById('report-gnomeking-defeat-btn').style.display = quest7State==='ready' ? '' : 'none';
  document.getElementById('report-gnomeking-defeat-btn').classList.toggle('btn-ready', quest7State==='ready');

document.getElementById('accept-quest3-btn').style.display = quest3State==='offer' ? '' : 'none';
  document.getElementById('brew-potion-btn').style.display = quest3State==='active' ? '' : 'none';
  document.getElementById('brew-potion-btn').disabled = !canBrew;
  document.getElementById('brew-potion-btn').classList.toggle('btn-ready', canBrew);
  document.getElementById('brew-potion-btn').textContent = canBrew ? 'Brew the Potion' : `Brew the Potion (${ingredientsHeld}/${potionIngredients.length})`;

document.getElementById('trial-row').style.display = (isGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-classquest-btn').style.display = classQuestState==='offer' ? '' : 'none';
  document.getElementById('start-trial-fight-btn').style.display = (classQuestState==='trials' && !state.classTrialGuildPassed) ? '' : 'none';
  document.getElementById('claim-path-beef-btn').style.display = classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-zip-btn').style.display = classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-hoodoo-btn').style.display = classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-beef-btn').classList.toggle('btn-ready', classQuestState==='ready');
  document.getElementById('claim-path-zip-btn').classList.toggle('btn-ready', classQuestState==='ready');
  document.getElementById('claim-path-hoodoo-btn').classList.toggle('btn-ready', classQuestState==='ready');

document.getElementById('tinker-row').style.display = (isTinker && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest4-btn').style.display = quest4State==='offer' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').style.display = quest4State==='active' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').disabled = !canReportDigger;
  document.getElementById('report-diggerbot-btn').classList.toggle('btn-ready', canReportDigger);
  document.getElementById('report-diggerbot-btn').textContent = state.quest4RareDefeated ? 'Report the Digger-Bot' : 'Report the Digger-Bot (not yet)';
  document.getElementById('accept-quest5-btn').style.display = quest5State==='offer' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').style.display = quest5State==='active' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').disabled = !canTurnInVein;
  document.getElementById('turn-in-vein-btn').classList.toggle('btn-ready', canTurnInVein);
  document.getElementById('turn-in-vein-btn').textContent = canTurnInVein ? 'Turn In the Parts' : `Turn In the Parts (${veinHeld}/${veinNeeded})`;

/* quest-box only takes up space when a building actually has something
active or newly offered to say — a "locked, nothing yet" or "complete,
reward already claimed" building has nothing left worth a permanent box
on screen. Each building's own branch below only ever sets quest-name/
desc/progress for its offer/active(/ready) states now; anything else
falls through to leaving the box hidden. */
const guildQuestBoxNeeded = quest2State==='offer' || quest2State==='active'
  || quest6State==='offer' || quest6State==='active'
  || quest7State==='offer' || quest7State==='active' || quest7State==='ready';
document.getElementById('quest-box').style.display = (!state.inCombat && (
  (isGafferHouse && (questState==='offer' || questState==='active'))
  || (isGuild && guildQuestBoxNeeded)
  || (isHoodoo && (quest3State==='offer' || quest3State==='active'))
  || (isTinker && (quest4State==='offer' || quest4State==='active' || quest5State==='offer' || quest5State==='active'))
)) ? 'block' : 'none';

if(isGafferHouse){
  if(questState==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: A Proper Rake';
    document.getElementById('quest-desc').textContent = "Gaffer Thistlewick's rake was stolen and stripped apart by gnomes in the Overgrown Commons. He's looking for someone to bring back its tines.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(questState==='active'){
    document.getElementById('quest-name').textContent = 'Quest: A Proper Rake';
    document.getElementById('quest-desc').textContent = "Bring back the rake's tines from the gnomes in the Overgrown Commons, and Gaffer will put it back together.";
    document.getElementById('quest-progress').textContent = `Rake tines turned in: ${state.questTinesGiven}/${QUEST_TINES_NEEDED}`;
  }
} else if(isGuild){
  if(quest2State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: The Gnome Commander';
    document.getElementById('quest-desc').textContent = "Word has spread of a gnome commander rallying the Overgrown Commons. He's rare, dangerous, and worth putting down.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest2State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: The Gnome Commander';
    document.getElementById('quest-desc').textContent = "Hunt down and defeat the gnome commander in the Overgrown Commons. He's rare — keep adventuring until he shows himself.";
    document.getElementById('quest-progress').textContent = state.commanderDefeated ? 'Commander defeated — report back!' : 'Commander not yet encountered.';
  } else if(quest6State==='active'){
    document.getElementById('quest-name').textContent = "Quest: The Gnome King's Throne";
    document.getElementById('quest-desc').textContent = "Hunt down and defeat the Gnome King's captain, left to guard his retreat in the Sunless Vault. He's rare — keep adventuring until he shows himself.";
    document.getElementById('quest-progress').textContent = state.quest6RareDefeated ? "Captain defeated — report back!" : "Captain not yet encountered.";
  } else if(quest6State==='offer'){
    document.getElementById('quest-name').textContent = "Quest available: The Gnome King's Throne";
    document.getElementById('quest-desc').textContent = "Rumor has it the Gnome King's rear-guard captain is holding the line somewhere deep in the Sunless Vault, buying the King time to run. The guildmaster would very much like that arrangement ended.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest7State==='offer'){
    document.getElementById('quest-name').textContent = "Quest available: The Gnome King's Court";
    document.getElementById('quest-desc').textContent = `The King slipped deeper into Gnometropolis, behind a palace gate that isn't opening for just anyone. The guildmaster reckons the way in is shaped by who you've become as a ${state.classTitle} — find your district in Gnometropolis and prove it to whoever's guarding it.`;
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest7State==='active'){
    const quest7GearName = palaceGateGearItem ? palaceGateGearItem.name : 'the right gear';
    document.getElementById('quest-name').textContent = "Quest: The Gnome King's Court";
    document.getElementById('quest-desc').textContent = `Defeat your district's guardian in Gnometropolis to claim ${quest7GearName}, equip it, then use the palace gate to face the real Gnome King.`;
    document.getElementById('quest-progress').textContent = 'Not yet confronted the King.';
  } else if(quest7State==='ready'){
    document.getElementById('quest-name').textContent = "Quest: The Gnome King's Court";
    document.getElementById('quest-desc').textContent = "The King has fallen — report back to the guildmaster.";
    document.getElementById('quest-progress').textContent = 'Ready to report.';
  }
} else if(isHoodoo){
  if(quest3State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: A Proper Potion';
    document.getElementById('quest-desc').textContent = "The Hoodoo Doctor wants to brew something powerful, but needs fresh ingredients — a couple from the Overgrown Commons, a couple from the Dank Sewers.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest3State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: A Proper Potion';
    document.getElementById('quest-desc').textContent = "Gather the ingredients from monsters in the Overgrown Commons and the Dank Sewers, then bring them back to brew the potion.";
    document.getElementById('quest-progress').textContent = `Ingredients gathered: ${ingredientsHeld}/${potionIngredients.length}`;
  }
} else if(isTinker){
  if(quest4State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: What the Sewers Shed';
    document.getElementById('quest-desc').textContent = "Strange clockwork parts keep turning up in the Dank Sewers. The Tinker wants to know what's shedding them, and would like it stopped.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest4State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: What the Sewers Shed';
    document.getElementById('quest-desc').textContent = "Find and defeat whatever's loose in the Dank Sewers. It's rare — keep adventuring until it shows itself.";
    document.getElementById('quest-progress').textContent = state.quest4RareDefeated ? 'Digger-bot defeated — report back!' : 'Digger-bot not yet encountered.';
  } else if(quest5State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: The Vein';
    document.getElementById('quest-desc').textContent = "The Tinker wants intact parts — a couple from the Clockwork Quarry, a couple more from deeper in the Dank Sewers — to trace where the old vein of gnome-tech actually leads.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest5State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: The Vein';
    document.getElementById('quest-desc').textContent = "Gather parts from monsters in the Clockwork Quarry and the Dank Sewers, then bring them back to the Tinker.";
    document.getElementById('quest-progress').textContent = `Parts gathered: ${veinHeld}/${veinNeeded}`;
  }
}

document.getElementById('combat-row').style.display = (state.inCombat && combatSubView==='main') ? 'flex' : 'none';
  document.getElementById('spell-menu').style.display = (state.inCombat && combatSubView==='spells') ? 'block' : 'none';
  if(state.inCombat && combatSubView==='spells') renderSpellMenu();
  if(state.inCombat){
    /* Matches renderSpellMenu()'s own contents (render-character.js) —
    the Use menu now lists damage spells AND usable HP/MP/luck
    consumables, so the button should only disable when there's
    genuinely neither (a player who only knows Warding Charm but is
    carrying a potion still has a reason to open it). */
    const hasDamageSpell = spells.some(s => s.type==='damage' && state.spellsKnown.includes(s.id));
    const hasUsableItem = state.inventory.some(it => ['hp','mp','luck'].includes(it.type));
    document.getElementById('use-btn').disabled = !hasDamageSpell && !hasUsableItem;
  }
  document.getElementById('explore-row').style.display = ((isCommons || isSewers || isQuarry || isVault || isGarrison || isRoguesden || isSanctum) && !state.inCombat) ? 'flex' : 'none';
  /* The Palace has no Explore row (it's not an ADVENTURE_ZONES entry —
  one scripted fight, not somewhere to wander) and palace-gate-row only
  shows the Approach button while the fight is still pending, so
  without this there was NO way to leave the Palace screen at all
  once quest7RareDefeated flips true after beating the real gnomeKing
  (winCombat() leaves state.location at 'palace' to show the victory
  banner there) — the player was stuck. Always available at the
  Palace, win/lose/not-yet-fought alike, same as every other screen's
  own persistent nav button. */
  document.getElementById('palace-row').style.display = (isPalace && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('palace-gate-row').style.display = canApproachPalaceGate ? 'flex' : 'none';
  document.getElementById('monster-card').classList.toggle('active', state.inCombat);
  document.getElementById('scene-art').classList.toggle('boss-encounter', !!(state.inCombat && state.monster && state.monster.rare));

if(state.inCombat){
  document.getElementById('scene-art').innerHTML = state.monster.art();
  document.getElementById('victory-banner').style.display = 'none';
} else if(state.showVictory && state.victoryMonster){
  document.getElementById('scene-art').innerHTML = artDefeated(state.victoryMonster.art);
  document.getElementById('victory-banner').style.display = 'block';
  document.getElementById('victory-drops').innerHTML = victoryDropsHtml(state.victoryMonster.drops);
} else if(isGafferHouse){
  document.getElementById('scene-art').innerHTML = artVillager();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isShop){
  document.getElementById('scene-art').innerHTML = artShopkeeper();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isHoodoo){
  document.getElementById('scene-art').innerHTML = artHoodooDoctor();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isGuild){
  document.getElementById('scene-art').innerHTML = artGuildmaster();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isTinker){
  document.getElementById('scene-art').innerHTML = artTinker();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isCasino){
  document.getElementById('scene-art').innerHTML = artCroupier();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isNoticeBoard){
  document.getElementById('scene-art').innerHTML = artNoticeBoard();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isTownSquare){
  const gafferFlag = questState==='offer' ? 'offer' : (questState==='active' && tinesHeld>0 ? 'turnin' : null);
  const guildFlag = quest2State==='offer' ? 'offer'
    : (quest2State==='active' && state.commanderDefeated ? 'turnin'
       : (quest6State==='offer' ? 'offer'
          : (quest6State==='active' && state.quest6RareDefeated ? 'turnin' : null)));
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
  const hoodooFlag = quest3State==='offer' ? 'offer' : (quest3State==='active' && ingredientsHeld === potionIngredients.length ? 'turnin' : null);
  const tinkerFlag = (quest4State==='offer' || quest5State==='offer') ? 'offer' : ((quest4State==='active' && state.quest4RareDefeated) || (quest5State==='active' && veinHeld === veinNeeded) ? 'turnin' : null);
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
  each start-trial-fight-*-btn above already gates on — a class-trial
  fight is available and not yet passed at that one building. */
  const guildTrialReady = classQuestState==='trials' && !state.classTrialGuildPassed;
  const casinoTrialReady = classQuestState==='trials' && !state.classTrialCasinoPassed;
  const hoodooTrialReady = classQuestState==='trials' && !state.classTrialHoodooPassed;
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
} else if(isGnometropolis){
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
    palace: { flag: canApproachPalaceGate ? 'turnin' : null },
    camp: { flag: state.hp < state.maxHp ? 'offer' : null },
  };
  /* Same cooldown-overlay pattern as the Inn's innCooldownText above,
  just for restAtCamp()'s CAMP_COOLDOWN_MS (content.js) instead. */
  const campCooldownLeft = CAMP_COOLDOWN_MS - (Date.now() - state.lastCampRestAt);
  const campCooldownText = campCooldownLeft > 0 ? formatMs(campCooldownLeft) : null;
  document.getElementById('scene-art').innerHTML = artGnometropolisSquare(gnomeBuildingIndicators, campCooldownText);
  document.getElementById('victory-banner').style.display = 'none';
} else if(isGarrison){
  document.getElementById('scene-art').innerHTML = artZoneGarrison();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isRoguesden){
  document.getElementById('scene-art').innerHTML = artZoneRoguesden();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isSanctum){
  document.getElementById('scene-art').innerHTML = artZoneSanctum();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isPalace){
  document.getElementById('scene-art').innerHTML = artPalaceGate();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isCommons){
  document.getElementById('scene-art').innerHTML = artZoneCommons();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isSewers){
  document.getElementById('scene-art').innerHTML = artZoneSewers();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isQuarry){
  document.getElementById('scene-art').innerHTML = artZoneQuarry();
  document.getElementById('victory-banner').style.display = 'none';
} else if(isVault){
  document.getElementById('scene-art').innerHTML = artZoneVault();
  document.getElementById('victory-banner').style.display = 'none';
} else {
  document.getElementById('scene-art').innerHTML = artIdle();
  document.getElementById('victory-banner').style.display = 'none';
}

if(state.inCombat){
  document.getElementById('monster-name').textContent = capitalize(state.monster.name);
  document.getElementById('monster-hp-bar').style.width = (state.monster.hp/state.monster.maxHp*100)+'%';
  document.getElementById('monster-hp-text').textContent = state.monster.hp+'/'+state.monster.maxHp;
}

renderInventory();
  renderAccountTab();
  renderCharacterDrawer();
  renderQuestLogDrawer();
  autosave();
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
