/* ---------------- Rendering ---------------- */
function render(){
  document.getElementById('hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('hp-text').textContent = state.hp+' / '+state.maxHp + (state.shield>0 ? ` (+${state.shield} 🛡)` : '');
  document.getElementById('mp-bar').style.width = (state.mp/state.maxMp*100)+'%';
  document.getElementById('mp-text').textContent = state.mp+' / '+state.maxMp;
  document.getElementById('inv-count').textContent = state.inventory.length;
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
  const isGnometropolis = state.location === 'gnometropolis';
  const isCasino = state.location === 'casino';
  const inTownArea = isTownSquare || isGafferHouse || isShop || isHoodoo || isGuild || isTinker || isCasino || isTownLot;

document.getElementById('poptab-text').textContent = state.popTabs;

document.getElementById('zone-title').textContent = isGafferHouse ? "Gaffer Thistlewick's Cottage" : (isShop ? 'The Shop' : (isHoodoo ? 'The Hoodoo Doctor\'s Shack' : (isGuild ? 'The Adventurers\' Guild' : (isTinker ? "Tinker's Workshop" : (isTownLot ? LOT_TIER_NAMES[state.lotTier] : (isCasino ? 'The Casino' : (isTownSquare ? 'Gladstone Hollow' : (isSewers ? 'Dank Sewers' : (isQuarry ? 'The Clockwork Quarry' : (isVault ? 'The Sunless Vault' : (isGnometropolis ? 'Gnometropolis' : 'The Overgrown Commons')))))))))));
  document.getElementById('ztag-town').style.display = inTownArea ? 'block' : 'none';
  document.getElementById('ztag-commons').style.display = isCommons ? 'block' : 'none';
  document.getElementById('quest-box').style.display = (isGafferHouse || isGuild || isHoodoo || isTinker) ? 'block' : 'none';
  document.getElementById('bounty-box').style.display = (isGuild && state.questComplete) ? 'block' : 'none';
  if(isGuild && state.questComplete) renderBountyBoard();
  document.getElementById('town-row').style.display = (isTownSquare && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-row').style.display = (isShop && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('shop-list').style.display = isShop ? 'block' : 'none';
  if(isShop) renderShop();

document.getElementById('hoodoo-row').style.display = (isHoodoo && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('hoodoo-list').style.display = isHoodoo ? 'block' : 'none';
  if(isHoodoo) renderHoodooShop();

document.getElementById('townlot-row').style.display = (isTownLot && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('townlot-list').style.display = isTownLot ? 'block' : 'none';
  if(isTownLot) renderTownLot();

document.getElementById('casino-bet-row').style.display = (isCasino && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('casino-row').style.display = (isCasino && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('bet-5-btn').disabled = state.popTabs < 5;
  document.getElementById('bet-10-btn').disabled = state.popTabs < 10;
  document.getElementById('bet-25-btn').disabled = state.popTabs < 25;

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
  document.getElementById('ztag-gnometropolis').style.display = gnometropolisUnlocked ? (isGnometropolis ? 'block' : 'none') : 'block';

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

/* 'trials': accepted, but not all three trainers' tests are passed yet.
'ready': all three passed, waiting on claimClassPath(chosenStat) — see the
three claim-path-*-btn buttons below and their isGuild=='ready' branch. */
const classQuestState = state.classQuestComplete ? 'complete'
  : !state.classQuestAccepted ? ((state.quest2Complete && state.level>=10) ? 'offer' : 'locked')
  : (state.classTrialGuildPassed && state.classTrialCasinoPassed && state.classTrialHoodooPassed) ? 'ready'
  : 'trials';

/* Small one-line trial hints on the Casino/Hoodoo screens — the Guild's
own per-tier status line lives in the isGuild 'trials' branch below, this
is just a nudge on the other two trainers' screens while their tier is
still unpassed. */
document.getElementById('casino-trial-hint').style.display = (isCasino && classQuestState==='trials') ? 'block' : 'none';
  if(isCasino && classQuestState==='trials'){
    document.getElementById('casino-trial-hint').textContent = state.classTrialCasinoPassed
      ? "You've already proven your nerve at the tables — the Casino's trial is passed."
      : `Word around the tables is the Guild's trial-takers prove their nerve here — win a bet of at least ${CLASS_TRIAL_CASINO_STAKE} Pop Tabs.`;
  }
  document.getElementById('hoodoo-trial-hint').style.display = (isHoodoo && classQuestState==='trials') ? 'block' : 'none';
  if(isHoodoo && classQuestState==='trials'){
    document.getElementById('hoodoo-trial-hint').textContent = state.classTrialHoodooPassed
      ? "You've already proven your hoodoo over the pot — the killing-blow trial is passed."
      : "The Hoodoo Doctor's heard talk over the pot of trial-takers proving their hoodoo with a killing spell.";
  }

document.getElementById('gaffer-row').style.display = (isGafferHouse && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest-btn').style.display = questState==='offer' ? '' : 'none';
  document.getElementById('give-tines-btn').style.display = questState==='active' ? '' : 'none';
  document.getElementById('give-tines-btn').disabled = !canGive;
  document.getElementById('give-tines-btn').textContent = tinesHeld>0 ? `Give Rake Tines (${Math.min(tinesHeld,tinesStillNeeded)})` : 'Give Rake Tines';

document.getElementById('guild-row').style.display = (isGuild && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest2-btn').style.display = quest2State==='offer' ? '' : 'none';
  document.getElementById('report-kill-btn').style.display = quest2State==='active' ? '' : 'none';
  document.getElementById('report-kill-btn').disabled = !canReport;
  document.getElementById('report-kill-btn').textContent = state.commanderDefeated ? 'Report the Kill' : 'Report the Kill (not yet)';

document.getElementById('accept-quest6-btn').style.display = quest6State==='offer' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').style.display = quest6State==='active' ? '' : 'none';
  document.getElementById('report-gnomeking-btn').disabled = !canReportGnomeKing;
  document.getElementById('report-gnomeking-btn').textContent = state.quest6RareDefeated ? 'Report the Gnome King' : 'Report the Gnome King (not yet)';

document.getElementById('accept-quest3-btn').style.display = quest3State==='offer' ? '' : 'none';
  document.getElementById('brew-potion-btn').style.display = quest3State==='active' ? '' : 'none';
  document.getElementById('brew-potion-btn').disabled = !canBrew;
  document.getElementById('brew-potion-btn').textContent = canBrew ? 'Brew the Potion' : `Brew the Potion (${ingredientsHeld}/${potionIngredients.length})`;

document.getElementById('accept-classquest-btn').style.display = classQuestState==='offer' ? '' : 'none';
  document.getElementById('start-trial-fight-btn').style.display = (classQuestState==='trials' && !state.classTrialGuildPassed) ? '' : 'none';
  document.getElementById('claim-path-beef-btn').style.display = classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-zip-btn').style.display = classQuestState==='ready' ? '' : 'none';
  document.getElementById('claim-path-hoodoo-btn').style.display = classQuestState==='ready' ? '' : 'none';

document.getElementById('tinker-row').style.display = (isTinker && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('accept-quest4-btn').style.display = quest4State==='offer' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').style.display = quest4State==='active' ? '' : 'none';
  document.getElementById('report-diggerbot-btn').disabled = !canReportDigger;
  document.getElementById('report-diggerbot-btn').textContent = state.quest4RareDefeated ? 'Report the Digger-Bot' : 'Report the Digger-Bot (not yet)';
  document.getElementById('accept-quest5-btn').style.display = quest5State==='offer' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').style.display = quest5State==='active' ? '' : 'none';
  document.getElementById('turn-in-vein-btn').disabled = !canTurnInVein;
  document.getElementById('turn-in-vein-btn').textContent = canTurnInVein ? 'Turn In the Parts' : `Turn In the Parts (${veinHeld}/${veinNeeded})`;

if(isGafferHouse){
  if(questState==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: A Proper Rake';
    document.getElementById('quest-desc').textContent = "Gaffer Thistlewick's rake was stolen and stripped apart by gnomes in the Overgrown Commons. He's looking for someone to bring back its tines.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(questState==='active'){
    document.getElementById('quest-name').textContent = 'Quest: A Proper Rake';
    document.getElementById('quest-desc').textContent = "Bring back the rake's tines from the gnomes in the Overgrown Commons, and Gaffer will put it back together.";
    document.getElementById('quest-progress').textContent = `Rake tines turned in: ${state.questTinesGiven}/${QUEST_TINES_NEEDED}`;
  } else {
    document.getElementById('quest-name').textContent = 'Quest complete: A Proper Rake';
    document.getElementById('quest-desc').textContent = "Gaffer Thistlewick's rake stands whole again. He's out back, raking his lawn with the quiet satisfaction of a man at peace.";
    document.getElementById('quest-progress').textContent = 'Reward claimed.';
  }
} else if(isGuild){
  if(quest2State==='locked'){
    document.getElementById('quest-name').textContent = 'The Guild';
    document.getElementById('quest-desc').textContent = "The guildmaster looks you over. \"Prove yourself around town first — come back when you've done something useful.\"";
    document.getElementById('quest-progress').textContent = 'No quest available yet.';
  } else if(quest2State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: The Gnome Commander';
    document.getElementById('quest-desc').textContent = "Word has spread of a gnome commander rallying the Overgrown Commons. He's rare, dangerous, and worth putting down.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest2State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: The Gnome Commander';
    document.getElementById('quest-desc').textContent = "Hunt down and defeat the gnome commander in the Overgrown Commons. He's rare — keep adventuring until he shows himself.";
    document.getElementById('quest-progress').textContent = state.commanderDefeated ? 'Commander defeated — report back!' : 'Commander not yet encountered.';
  } else if(quest6State==='active'){
    document.getElementById('quest-name').textContent = "Quest: The Gnome King's Throne";
    document.getElementById('quest-desc').textContent = "Hunt down and defeat the Gnome King in the Sunless Vault. He's rare — keep adventuring until he shows himself.";
    document.getElementById('quest-progress').textContent = state.quest6RareDefeated ? 'Gnome King defeated — report back!' : 'Gnome King not yet encountered.';
  } else if(quest6State==='offer'){
    document.getElementById('quest-name').textContent = "Quest available: The Gnome King's Throne";
    document.getElementById('quest-desc').textContent = "Rumor has it the Gnome King himself holds court somewhere deep in the Sunless Vault. The guildmaster would very much like that arrangement ended.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(classQuestState==='locked'){
    if(state.quest6Complete){
      document.getElementById('quest-name').textContent = "Quest complete: The Gnome King's Throne";
      document.getElementById('quest-desc').textContent = "The Gnome King has been dethroned. Beneath the Vault lies Gnometropolis, the gnomes' hidden capital — yours to explore now.";
      document.getElementById('quest-progress').textContent = 'Reward claimed. Gnometropolis is now open — check the Map.';
    } else {
      document.getElementById('quest-name').textContent = 'Quest complete: The Gnome Commander';
      document.getElementById('quest-desc').textContent = "The gnome commander has been dealt with. The guildmaster seems genuinely impressed, which seems rare for him. He mentions the sewers under the square have been acting up too — worth a look, if you're not afraid of rats.";
      document.getElementById('quest-progress').textContent = 'Reward claimed. The Dank Sewers are now open — check the Map.';
    }
  } else if(classQuestState==='offer'){
    document.getElementById('quest-name').textContent = "Quest available: The Adventurer's Trial";
    document.getElementById('quest-desc').textContent = "You've reached level 10. The guildmaster looks you over — really looks, this time. There's a Trial for adventurers who come this far, and it isn't the Guild's alone to give: the guildmaster, the Casino's croupier, and the Hoodoo Doctor each test something different before a name gets put to what you've become.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(classQuestState==='trials'){
    document.getElementById('quest-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('quest-desc').textContent = "Three trainers, three tests, and no partial credit. Beat the Guild's Trial Champion in a fight, win a big enough bet at the Casino, and land a killing blow with a damage spell at the Hoodoo Doctor's. Pass all three, then come back here to claim your path.";
    document.getElementById('quest-progress').textContent = `Guild: ${state.classTrialGuildPassed ? '✓ passed' : 'not yet'} — Casino: ${state.classTrialCasinoPassed ? '✓ passed' : 'not yet'} — Hoodoo: ${state.classTrialHoodooPassed ? '✓ passed' : 'not yet'}`;
  } else if(classQuestState==='ready'){
    document.getElementById('quest-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('quest-desc').textContent = "All three trainers agree: you're ready. The guildmaster will name your path — choose it below.";
    document.getElementById('quest-progress').textContent = 'All three trials passed — claim your path.';
  } else {
    document.getElementById('quest-name').textContent = "Quest complete: The Adventurer's Trial";
    document.getElementById('quest-desc').textContent = `The guildmaster studied your training, your gear, the way you carry yourself, and named your path. You are recognized as a ${state.classTitle}.`;
    document.getElementById('quest-progress').textContent = 'Reward claimed.';
  }
} else if(isHoodoo){
  if(quest3State==='locked'){
    document.getElementById('quest-name').textContent = 'The Hoodoo Doctor';
    document.getElementById('quest-desc').textContent = "The Hoodoo Doctor eyes you over the pot. \"Nothing for you here yet, dear. Come back once you've dealt with that gnome business.\"";

  document.getElementById('quest-progress').textContent = 'No quest available yet.';
  } else if(quest3State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: A Proper Potion';
    document.getElementById('quest-desc').textContent = "The Hoodoo Doctor wants to brew something powerful, but needs fresh ingredients — a couple from the Overgrown Commons, a couple from the Dank Sewers.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest3State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: A Proper Potion';
    document.getElementById('quest-desc').textContent = "Gather the ingredients from monsters in the Overgrown Commons and the Dank Sewers, then bring them back to brew the potion.";
    document.getElementById('quest-progress').textContent = `Ingredients gathered: ${ingredientsHeld}/${potionIngredients.length}`;
  } else {
    document.getElementById('quest-name').textContent = 'Quest complete: A Proper Potion';
    document.getElementById('quest-desc').textContent = "The potion is brewed and bottled. The Hoodoo Doctor taught you how to unleash it yourself — Bottled Fury is yours to cast.";
    document.getElementById('quest-progress').textContent = 'Reward claimed.';
  }
} else if(isTinker){
  if(quest4State==='locked'){
    document.getElementById('quest-name').textContent = 'The Tinker';
    document.getElementById('quest-desc').textContent = "The Tinker barely looks up from their workbench. \"Not much for you here yet. Come back once you've sorted that gnome commander out.\"";
    document.getElementById('quest-progress').textContent = 'No quest available yet.';
  } else if(quest4State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: What the Sewers Shed';
    document.getElementById('quest-desc').textContent = "Strange clockwork parts keep turning up in the Dank Sewers. The Tinker wants to know what's shedding them, and would like it stopped.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest4State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: What the Sewers Shed';
    document.getElementById('quest-desc').textContent = "Find and defeat whatever's loose in the Dank Sewers. It's rare — keep adventuring until it shows itself.";
    document.getElementById('quest-progress').textContent = state.quest4RareDefeated ? 'Digger-bot defeated — report back!' : 'Digger-bot not yet encountered.';
  } else if(quest5State==='locked'){
    document.getElementById('quest-name').textContent = 'Quest complete: What the Sewers Shed';
    document.getElementById('quest-desc').textContent = "The digger-bot is scrap. The Tinker traced its wiring to a sealed service tunnel — the old Clockwork Quarry, now yours to explore.";
    document.getElementById('quest-progress').textContent = 'Reward claimed. The Clockwork Quarry is now open — check the Map.';
  } else if(quest5State==='offer'){
    document.getElementById('quest-name').textContent = 'Quest available: The Vein';
    document.getElementById('quest-desc').textContent = "The Tinker wants intact parts — a couple from the Clockwork Quarry, a couple more from deeper in the Dank Sewers — to trace where the old vein of gnome-tech actually leads.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(quest5State==='active'){
    document.getElementById('quest-name').textContent = 'Quest: The Vein';
    document.getElementById('quest-desc').textContent = "Gather parts from monsters in the Clockwork Quarry and the Dank Sewers, then bring them back to the Tinker.";
    document.getElementById('quest-progress').textContent = `Parts gathered: ${veinHeld}/${veinNeeded}`;
  } else {
    document.getElementById('quest-name').textContent = 'Quest complete: The Vein';
    document.getElementById('quest-desc').textContent = "The Tinker traced every part back to something sealed beneath the Quarry floor. The Sunless Vault is yours to check out.";
    document.getElementById('quest-progress').textContent = 'Reward claimed. The Sunless Vault is now open — check the Map.';
  }
}

document.getElementById('combat-row').style.display = (state.inCombat && combatSubView==='main') ? 'flex' : 'none';
  document.getElementById('spell-menu').style.display = (state.inCombat && combatSubView==='spells') ? 'block' : 'none';
  if(state.inCombat && combatSubView==='spells') renderSpellMenu();
  if(state.inCombat){
    document.getElementById('cast-btn').disabled = state.spellsKnown.length===0;
    document.getElementById('shout-btn').style.display = state.classTitle==='Meathead' ? '' : 'none';
  }
  document.getElementById('explore-row').style.display = ((isCommons || isSewers || isQuarry || isVault || isGnometropolis) && !state.inCombat) ? 'flex' : 'none';
  document.getElementById('monster-card').classList.toggle('active', state.inCombat);

if(state.inCombat){
  document.getElementById('scene-art').innerHTML = state.monster.art();
  document.getElementById('victory-banner').style.display = 'none';
} else if(state.showVictory && state.victoryMonster){
  document.getElementById('scene-art').innerHTML = artDefeated(state.victoryMonster.art);
  document.getElementById('victory-banner').style.display = 'block';
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
  document.getElementById('scene-art').innerHTML = artTownSquare(gafferFlag, guildFlag, hoodooFlag, tinkerFlag, state.lotTier, guildBountyReady);
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
