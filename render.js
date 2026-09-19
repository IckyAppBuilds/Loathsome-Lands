/* ---------------- Rendering ---------------- */
function render(){
  document.getElementById('hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('hp-text').textContent = state.hp+' / '+state.maxHp;
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

const classQuestState = state.classQuestComplete ? 'complete' : (state.classQuestAccepted ? 'active' : ((state.quest2Complete && state.level>=10) ? 'offer' : 'locked'));

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
  document.getElementById('claim-path-btn').style.display = classQuestState==='active' ? '' : 'none';

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
    document.getElementById('quest-desc').textContent = "You've reached level 10. The guildmaster looks you over — really looks, this time. There's a Trial for adventurers who come this far: the Guild puts a name to what you've become.";
    document.getElementById('quest-progress').textContent = 'Not yet accepted.';
  } else if(classQuestState==='active'){
    document.getElementById('quest-name').textContent = "Quest: The Adventurer's Trial";
    document.getElementById('quest-desc').textContent = "The guildmaster is ready to name your path. Say the word when you're ready to hear it.";
    document.getElementById('quest-progress').textContent = 'Ready — claim your path.';
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
  document.getElementById('scene-art').innerHTML = artTownSquare(gafferFlag, guildFlag, hoodooFlag, tinkerFlag, state.lotTier);
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

/* Section order + heading for renderInventory() below. Every item type in
content.js falls into exactly one of these buckets (see the type-string
audit in the surrounding history) — consumables first since they're what
you reach for mid-run, then Equipment, then Quest Items, then plain Loot. */
const INVENTORY_SECTIONS = [
  { types:['hp','mp','luck'], title:'Potions & Consumables' },
  { types:['equip'], title:'Equipment' },
  { types:['quest'], title:'Quest Items' },
  { types:['junk'], title:'Loot' },
  ];

function renderInventory(){
  const list = document.getElementById('inv-list');
  if(state.inventory.length===0){
    list.innerHTML = '<div class="inv-empty">Empty. Bring me things.</div>';
    return;
  }
  list.innerHTML = '';

const groups = new Map();
  state.inventory.forEach((item, idx)=>{
    if(!groups.has(item.name)){
      groups.set(item.name, { item, count:0, firstIdx:idx });
    }
    groups.get(item.name).count++;
  });

/* Display order is (fixed type bucket, then name) rather than raw
  state.inventory position. Array position isn't stable: using one
  potion out of a stack splices that exact slot out, and equipping a
  new item pushes the piece it replaces onto the end of the array — so
  grouping straight off array order used to make the whole list
  visually reshuffle every time you used or equipped something. Sorting
  by what the item IS instead of where it currently sits means a given
  item always lands in the same spot. firstIdx is still whatever index
  that stack currently occupies, for the Use/Equip button below — that
  part is unaffected, only the ordering of the groups is. */
const sorted = [...groups.values()].sort((a,b)=>a.item.name.localeCompare(b.item.name));

INVENTORY_SECTIONS.forEach(section=>{
  const entries = sorted.filter(g => section.types.includes(g.item.type));
  if(entries.length===0) return;
  const header = document.createElement('div');
  header.className = 'shop-section-title';
  header.textContent = section.title;
  list.appendChild(header);
  entries.forEach(({item, count, firstIdx})=>{
    const div = document.createElement('div');
    div.className='inv-item';
    let btn = '';
    if(item.type==='hp' || item.type==='mp' || item.type==='luck'){
      btn = `<button class="btn-secondary" onclick="useItem(${firstIdx})">Use</button>`;
    } else if(item.type==='equip'){
      btn = `<button class="btn-secondary" onclick="equipItem(${firstIdx})">Equip</button>`;
    }
    const iconSvg = item.icon ? item.icon() : '';
    const qtyBadge = count>1 ? `<span class="qty-badge">×${count}</span>` : '';
    const slotBadge = item.type==='equip' ? ` <span class="qty-badge">${SLOT_LABELS[item.slot]}</span>` : '';
    /* Quest-turn-in items (potion/vein ingredients, rake tines) all carry
    type:"quest" (see content.js) — flag them here so they read as
    distinct from ordinary junk/loot at a glance, per user feedback. */
                  const questBadge = item.type==='quest' ? ` <span class="quest-badge">Quest Item</span>` : '';
    const bonusText = item.type==='equip' && item.bonus && Object.keys(item.bonus).length
    ? ` (${Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`
      : '';
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${item.name}${qtyBadge}${slotBadge}${questBadge}</div><div class="desc">${item.desc}${bonusText}</div>${btn}</div>`;
    list.appendChild(div);
  });
});
}

/* Which pane of the Shop is showing: 'food' | 'gear' | 'sell'. UI-only —
not part of `state`, not saved — reset to 'food' on every enterShop()
(game.js) so the drawer doesn't reopen wherever it was left last time. */
let shopTab = 'food';

function setShopTab(tab){
  shopTab = tab;
  renderShop();
}

function renderShopItemRow(def){
  const div = document.createElement('div');
  div.className = 'shop-item';
  const iconSvg = def.icon ? def.icon() : '';
  const canAfford = state.popTabs >= def.price;
  const slotTag = def.slot ? ` <span class="qty-badge">${SLOT_LABELS[def.slot]}</span>` : '';
  const bonusTag = def.bonus && Object.keys(def.bonus).length
  ? ` (${Object.entries(def.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`
    : '';
  div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${def.name}${slotTag}</div><div class="desc">${def.desc}${bonusTag} (${def.price} Pop Tabs)</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="buyItemByName('${def.name.replace(/'/g,"\\'")}')">Buy — ${def.price} Pop Tabs</button></div>`;
  return div;
}

function renderShop(){
  const shopList = document.getElementById('shop-list');
  shopList.innerHTML = '';

const tabRow = document.createElement('div');
  tabRow.className = 'btn-row';
  [['food','Food'], ['gear','Gear'], ['sell','Sell']].forEach(([id, label])=>{
    const btn = document.createElement('button');
    btn.className = shopTab === id ? 'btn-primary' : 'btn-secondary';
    btn.textContent = label;
    btn.onclick = () => setShopTab(id);
    tabRow.appendChild(btn);
  });
  shopList.appendChild(tabRow);

const allItems = getAvailableShopItems();

if(shopTab === 'food' || shopTab === 'gear'){
  const items = allItems.filter(def => def.type === (shopTab === 'food' ? 'hp' : 'equip'));
  const section = document.createElement('div');
  section.innerHTML = `<div class="shop-section-title">${shopTab === 'food' ? 'Food For Sale' : 'Gear For Sale'}</div>`;
  if(items.length === 0){
    section.innerHTML += '<div class="shop-empty">Nothing here yet. Upgrading the Shop (Town Lot) brings in better stock.</div>';
  } else {
    items.forEach(def => section.appendChild(renderShopItemRow(def)));
  }
  shopList.appendChild(section);
  return;
}

const sellSection = document.createElement('div');
  sellSection.innerHTML = '<div class="shop-section-title">Sell Your Junk</div>';
  const sellable = state.inventory.filter(it => it.sell && ((it.type==='junk' || it.type==='equip') || isQuestItemSellable(it)));

if(sellable.length===0){
  sellSection.innerHTML += '<div class="shop-empty">Nothing in your pack worth selling. Bring back some gnome junk.</div>';
} else {
  const groups = new Map();
  sellable.forEach(item=>{
    if(!groups.has(item.name)) groups.set(item.name, { item, count:0 });
    groups.get(item.name).count++;
  });
  /* Sort by name rather than trusting state.inventory's current order —
  same reasoning as renderInventory() above: that order shifts under
  this list's feet whenever items are used/equipped elsewhere, which
  made entries here reshuffle too even though nothing was sold. */
  [...groups.values()].sort((a,b)=>a.item.name.localeCompare(b.item.name)).forEach(({item, count})=>{
    const div = document.createElement('div');
    div.className = 'shop-item';
    const iconSvg = item.icon ? item.icon() : '';
    const total = item.sell * count;
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${item.name} <span class="qty-badge">×${count}</span></div><div class="desc">${item.desc} (${item.sell} Pop Tab${item.sell>1?'s':''} each)</div><button class="btn-secondary" onclick="sellItemByName('${item.name.replace(/'/g,"\\'")}')">Sell All — ${total} Pop Tabs</button></div>`;
    sellSection.appendChild(div);
  });
}
  shopList.appendChild(sellSection);
}

/* Repeatable content, rendered as its own section below the Guild's
quest-offer box (never replacing it) — see BOUNTY_TEMPLATES (content.js)
and rollNewBounty()/claimBounty() (game.js). Seeds a bounty on the
player's very first visit here, then just reflects whatever's active. */
function renderBountyBoard(){
  if(!state.activeBounty) rollNewBounty();
  /* Re-roll if the active bounty's zone somehow isn't unlocked — normally
     can't happen (rollNewBounty() only picks from unlocked zones, and
     zones never re-lock), but covers a save that picked up a bounty
     before zone-gating existed. */
  const currentTemplate = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
  if(!currentTemplate || !isBountyZoneUnlocked(currentTemplate.zone)) rollNewBounty();
  const el = document.getElementById('bounty-box');
  if(!el) return;
  const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
  if(!bt){ el.innerHTML = ''; return; }
  const progress = Math.min(bt.count, state.activeBounty.progress);
  const done = progress >= bt.count;
  const zoneLabel = ZONE_LABELS[bt.zone] || bt.zone;
  el.innerHTML = `
  <div class="block-title">Bounty Board</div>
  <div class="quest-desc">Bounty: slay ${bt.count} × ${bt.monsterName} in ${zoneLabel}.</div>
  <div class="quest-progress">${progress}/${bt.count}${done ? ' — ready to claim!' : ''}</div>
  <div class="quest-progress" style="color:var(--tan);">Reward: ${bt.reward.bountyTokens} Bounty Token${bt.reward.bountyTokens===1?'':'s'}. You have ${state.bountyTokens} Bounty Token${state.bountyTokens===1?'':'s'} (${state.bountiesCompleted} bounties completed). Tokens can be spent at a future gear exchange — nothing to redeem them for yet.</div>
  <div class="btn-row" style="margin:8px 0 0;">
  <button class="btn-primary" ${done ? '' : 'disabled'} onclick="claimBounty()">Claim Bounty</button>
  </div>
  `;
}

function renderHoodooShop(){
  const el = document.getElementById('hoodoo-list');
  el.innerHTML = '<div class="shop-section-title">Spells to Learn</div>';
  spells.filter(s => !s.questReward).forEach(spell=>{
    const known = state.spellsKnown.includes(spell.id);
    const div = document.createElement('div');
    div.className = 'shop-item';
    const iconSvg = spell.icon ? spell.icon() : '';
    const canAfford = state.popTabs >= spell.price;
    const btn = known
    ? `<button class="btn-secondary" disabled>Known</button>`
      : `<button class="btn-secondary" ${canAfford?'':'disabled'} onclick="learnSpell('${spell.id}')">Learn — ${spell.price} Pop Tabs</button>`;
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP to cast)</div>${btn}</div>`;
    el.appendChild(div);
  });

  const resetPrice = STAT_RESET_BASE_PRICE * Math.pow(STAT_RESET_PRICE_MULT, state.statResetsBrewed);
  const resetCanAfford = state.popTabs >= resetPrice;
  const resetTitle = document.createElement('div');
  resetTitle.className = 'shop-section-title';
  resetTitle.textContent = 'Stat Reset';
  el.appendChild(resetTitle);
  const resetDiv = document.createElement('div');
  resetDiv.className = 'shop-item';
  // TODO(creative-director): placeholder flavor text, functional description only.
  resetDiv.innerHTML = `<div style="flex:1;"><div class="name">Stat Reset Potion</div><div class="desc">Refunds every stat point you've ever spent on Beef/Zip/Grit/Hoodoo so you can redistribute them. Gets pricier each time you brew one.</div><button class="btn-secondary" ${resetCanAfford?'':'disabled'} onclick="brewStatResetPotion()">Brew — ${resetPrice} Pop Tabs</button></div>`;
  el.appendChild(resetDiv);
}

/* Per-building level-effect formatters for the Town Lot listing below.
Keyed the same as BUILDING_UPGRADES (content.js); each entry's `values`
is the matching LEVEL-indexed constant from content.js (index 0 is the
no-bonus baseline) and `format(v)` turns one entry into the one-line
text shown for "Currently"/"Next level". Percent-based effects are
fractions in content.js (e.g. 0.30), so format() multiplies by 100 and
rounds rather than hardcoding a number here — 'shop' isn't a fraction/
flat-bonus array like the rest, so it's handled separately below by
buildingEffectDesc(). */
const BUILDING_EFFECT_INFO = {
   gaffer: { values: GAFFER_BISCUIT_MAX_BONUS, format: v => `+${v} max Biscuits` },
   hoodoo: { values: HOODOO_SPELL_DISCOUNT, format: v => `${Math.round(v*100)}% off spells` },
   inn: { values: INN_FREE_REST_CHANCE, format: v => `${Math.round(v*100)}% chance of a free rest` },
   tinker: { values: TINKER_SELL_BONUS, format: v => `+${Math.round(v*100)}% on junk sale prices` },
   guild: { values: GUILD_BOUNTY_BONUS, format: v => `+${Math.round(v*100)}% Bounty Token rewards` },
   casino: { values: CASINO_WIN_BONUS, format: v => `+${Math.round(v*100)}% casino win odds` },
   };

/* The Shop's tiers aren't a single cumulative number like the other 6
buildings — each level unlocks a specific stock tier (see the
SHOP_LEVEL_FOOD_TIER2/TIER3/GEAR_TIER3 comment in content.js), so its
"currently"/"next level" text lists unlock names instead of formatting
a value. Pulls the level numbers from those constants rather than
hardcoding 1/2/3 so this stays correct if the tiers are ever reordered. */
function shopTierUnlockNames(){
  const names = {};
  names[SHOP_LEVEL_FOOD_TIER2] = 'Tier 2 food stock';
  names[SHOP_LEVEL_FOOD_TIER3] = 'Tier 3 food stock';
  names[SHOP_LEVEL_GEAR_TIER3] = 'Tier 3 gear stock';
  return names;
}

/* Builds the "Currently: ___." / "Next level: ___." lines shown under a
Town Lot building's name, using the actual content.js constants so the
text can't drift out of sync with the numbers driving the mechanic. */
function buildingEffectDesc(key, level){
  if(key === 'shop'){
    const names = shopTierUnlockNames();
    let lines = '';
    if(level > 0){
      const unlocked = [];
      for(let l=1; l<=level; l++){ if(names[l]) unlocked.push(names[l]); }
      if(unlocked.length) lines += `<div class="quest-desc">Currently: ${unlocked.join(', ')} unlocked.</div>`;
    }
    if(level < BUILDING_UPGRADE_MAX && names[level+1]){
      lines += `<div class="quest-desc">Next level: ${names[level+1]} unlocked.</div>`;
    }
    return lines;
  }
  const info = BUILDING_EFFECT_INFO[key];
  if(!info) return '';
  let lines = '';
  if(level > 0){
    lines += `<div class="quest-desc">Currently: ${info.format(info.values[level])}.</div>`;
  }
  if(level < BUILDING_UPGRADE_MAX){
    lines += `<div class="quest-desc">Next level: ${info.format(info.values[level+1])}.</div>`;
  }
  return lines;
}

/* The Town Lot — the previously-empty town-square cell (translate(200,100)
in artTownSquare(), core.js). Unpurchased (state.lotTier===0) it's just a
buy prompt; once owned it shows cosmetic lot-tier upgrades plus a level
for each of the other 7 town buildings (state.buildingUpgrades, core.js —
see LOT_TIER_NAMES/LOT_TIER_COST/BUILDING_UPGRADES in content.js and
buyTownLot()/upgradeTownLot()/upgradeBuilding() in game.js). */
function renderTownLot(){
  const el = document.getElementById('townlot-list');
  if(state.lotTier === 0){
    const cost = LOT_TIER_COST[1];
    const canAfford = state.popTabs >= cost;
    el.innerHTML = `
    <div class="shop-section-title">Empty Lot</div>
    <div class="shop-item"><div style="flex:1;"><div class="name">Buy the Lot</div><div class="desc">Clear it out and claim it for the town. Owning it is what lets you start investing in the rest of Gladstone Hollow.</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="buyTownLot()">Buy — ${cost} Pop Tabs</button></div></div>
    `;
    return;
  }

let html = '<div class="shop-section-title">Your Town Lot</div>';
  if(state.lotTier < LOT_TIER_MAX){
    const next = state.lotTier + 1;
    const cost = LOT_TIER_COST[next];
    const canAfford = state.popTabs >= cost;
    html += `<div class="shop-item"><div style="flex:1;"><div class="name">${LOT_TIER_NAMES[state.lotTier]} <span class="qty-badge">→ ${LOT_TIER_NAMES[next]}</span></div><div class="desc">Upgrade the lot itself — cosmetic for now.</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="upgradeTownLot()">Upgrade — ${cost} Pop Tabs</button></div></div>`;
  } else {
    html += `<div class="shop-empty">${LOT_TIER_NAMES[state.lotTier]} — fully built up.</div>`;
  }

html += '<div class="shop-section-title" style="margin-top:10px;">Upgrade Town Buildings</div>';
  html += '<div class="quest-desc" style="margin:0 0 8px;">Spend Pop Tabs to raise a building\'s level — a building can never out-level the lot itself, so upgrading the lot is what unlocks each building\'s next tier. Most buildings are cosmetic for now; the Shop\'s levels unlock better stock (see the Shop).</div>';
  BUILDING_UPGRADES.forEach(b=>{
    const level = state.buildingUpgrades[b.key] || 0;
    const effectDesc = buildingEffectDesc(b.key, level);
    if(level >= BUILDING_UPGRADE_MAX){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Fully upgraded.</div>${effectDesc}</div></div>`;
      return;
    }
    if(level >= state.lotTier){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Requires the lot itself at ${LOT_TIER_NAMES[level+1]} first.</div>${effectDesc}<button class="btn-secondary" disabled>Locked</button></div></div>`;
      return;
    }
    const cost = buildingUpgradeCost(level);
    const canAfford = state.popTabs >= cost;
    html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Raise to level ${level+1}.</div>${effectDesc}<button class="btn-secondary" ${canAfford?'':'disabled'} onclick="upgradeBuilding('${b.key}')">Upgrade — ${cost} Pop Tabs</button></div></div>`;
  });
  el.innerHTML = html;
}

function renderSpellMenu(){
  const list = document.getElementById('spell-list');
  const known = spells.filter(s => state.spellsKnown.includes(s.id));
  if(known.length===0){
    list.innerHTML = '<div class="shop-empty">You don\'t know any spells yet. The Hoodoo Doctor in town might teach you a few.</div>';
    return;
  }
  list.innerHTML = '';
  known.forEach(spell=>{
    const div = document.createElement('div');
    div.className = 'shop-item';
    const iconSvg = spell.icon ? spell.icon() : '';
    const canCast = state.mp >= spell.mpCost;
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button></div>`;
    list.appendChild(div);
  });
}

function renderCharacterDrawer(){
  document.getElementById('char-portrait').innerHTML = artIdle();
  document.getElementById('char-title').textContent = `Level ${state.level} ${state.classTitle || 'Adventurer'}`;

document.getElementById('char-hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('char-hp-value').textContent = state.hp+' / '+state.maxHp;
  document.getElementById('char-mp-bar').style.width = (state.mp/state.maxMp*100)+'%';
  document.getElementById('char-mp-value').textContent = state.mp+' / '+state.maxMp;
  document.getElementById('char-xp-bar').style.width = (state.xp/state.xpToLevel*100)+'%';
  document.getElementById('char-xp-value').textContent = state.xp+' / '+state.xpToLevel;

document.getElementById('char-facts').innerHTML = `
<div><span class="fact-label">Biscuits:</span> ${devMode ? '∞ (dev mode)' : state.adventures + ' / ' + effectiveBiscuitMax()}</div>
<div><span class="fact-label">Pop Tabs:</span> ${state.popTabs}</div>
<div><span class="fact-label">Items carried:</span> ${state.inventory.length}</div>
`;

renderStatsBlock();
  renderEquipmentBlock();
  renderRareFindsBlock();
}

/* Rare-drop collection log — see state.rareDropsSeen (core.js) and the
milestone bonus in winCombat() (game.js). N is computed fresh from
monsters[] rather than hardcoded so it never drifts as content is added.
Undiscovered rares show as "???" — no spoiling names of rares the player
hasn't found yet, that's the collection-game hook. */
function renderRareFindsBlock(){
  const el = document.getElementById('rarefinds-block');
  if(!el) return;
  const rareMonsters = monsters.filter(m => m.rareDrop);
  const totalRares = rareMonsters.length;
  const foundCount = state.rareDropsSeen.length;
  const bonusNote = state.allRaresBonusClaimed
  ? `<div class="stat-points-note" style="color:var(--green);">Every rare found! Bonus claimed.</div>`
    : '';
  const rows = rareMonsters.map(m=>{
    const found = state.rareDropsSeen.includes(m.rareDrop.name);
    return `<div class="stat-row"><div style="flex:1;"><div class="stat-row-label">${found ? m.rareDrop.name : '???'}</div></div></div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Rare Finds: ${foundCount} / ${totalRares}</div>${bonusNote}${rows}`;
}

function renderStatsBlock(){
  const el = document.getElementById('stats-block');
  const eff = getEffectiveStats();
  const pointsNote = state.statPoints>0
  ? `<div class="stat-points-note">${state.statPoints} stat point${state.statPoints>1?'s':''} to spend!</div>`
    : '';
  const rows = Object.keys(STAT_LABELS).map(key=>{
    const base = state.stats[key];
    const bonus = eff[key] - base;
    const bonusText = bonus>0 ? ` <span class="qty-badge">+${bonus}</span>` : '';
    const btn = state.statPoints>0
    ? `<button class="btn-secondary stat-plus-btn" onclick="spendStatPoint('${key}')">+1</button>`
      : '';
    return `<div class="stat-row">
    <div style="flex:1;">
    <div class="stat-row-label">${STAT_LABELS[key]}${bonusText}</div>
    <div class="stat-row-hint">${STAT_HINTS[key]}</div>
    </div>
    <div class="stat-row-value">${eff[key]}</div>
    ${btn}
    </div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Stats</div>${pointsNote}${rows}`;
}

function renderEquipmentBlock(){
  const el = document.getElementById('equip-block');
  const rows = SLOT_ORDER.map(slot=>{
    const item = state.equipment[slot];
    if(!item){
      return `<div class="equip-row">
      <div class="icon-box equip-empty-icon">—</div>
      <div style="flex:1;">
      <div class="equip-slot-label">${SLOT_LABELS[slot]}</div>
      <div class="equip-empty-text">Nothing equipped.</div>
      </div>
      </div>`;
    }
    const iconSvg = item.icon ? item.icon() : '';
    const bonusText = item.bonus && Object.keys(item.bonus).length
    ? Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')
      : 'No bonus — just flavor.';
    return `<div class="equip-row">
    <div class="icon-box">${iconSvg}</div>
    <div style="flex:1;">
    <div class="equip-slot-label">${SLOT_LABELS[slot]}</div>
    <div class="name">${item.name}</div>
    <div class="desc">${bonusText}</div>
    <button class="btn-secondary" onclick="unequipItem('${slot}')">Unequip</button>
    </div>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Equipped</div>${rows}`;
}

function renderQuestLogDrawer(){
  const activeEl = document.getElementById('quest-log-active');
  const completedEl = document.getElementById('quest-log-completed');
  const activeEntries = [];
  const completedEntries = [];

if(state.questComplete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Rake</div>
  <div class="quest-desc">You gathered the gnome-stolen rake tines and Gaffer Thistlewick put his rake back together.</div>
  <div class="quest-progress">Reward claimed: 15 Pop Tabs, 25 XP</div>
  </div>`);
} else if(state.questAccepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Rake</div>
  <div class="quest-desc">Bring back the rake's tines from the gnomes in the Overgrown Commons, and Gaffer will put it back together.</div>
  <div class="quest-progress">Rake tines turned in: ${state.questTinesGiven}/${QUEST_TINES_NEEDED}</div>
  </div>`);
}

if(state.quest2Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome Commander</div>
  <div class="quest-desc">You hunted down and defeated the rare gnome commander terrorizing the Overgrown Commons.</div>
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 50 XP</div>
  </div>`);
} else if(state.quest2Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome Commander</div>
  <div class="quest-desc">Hunt down and defeat the gnome commander in the Overgrown Commons. He's rare — keep adventuring until he shows himself.</div>
  <div class="quest-progress">${state.commanderDefeated ? 'Commander defeated — report back at the Guild!' : 'Commander not yet encountered.'}</div>
  </div>`);
}

if(state.quest3Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Potion</div>
  <div class="quest-desc">You gathered ingredients from the Overgrown Commons and the Dank Sewers so the Hoodoo Doctor could brew Bottled Fury.</div>
  <div class="quest-progress">Reward claimed: 20 Pop Tabs, 35 XP, the Bottled Fury spell</div>
  </div>`);
} else if(state.quest3Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Potion</div>
  <div class="quest-desc">Gather ingredients from monsters in the Overgrown Commons and the Dank Sewers, then bring them to the Hoodoo Doctor to brew the potion.</div>
  <div class="quest-progress">Ingredients gathered: ${countPotionIngredientsHeld()}/${potionIngredients.length}</div>
  </div>`);
}

if(state.quest4Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Sewers Shed</div>
  <div class="quest-desc">You hunted down and defeated the runaway digger-bot loose in the Dank Sewers, and the Tinker opened up the Clockwork Quarry.</div>
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 45 XP</div>
  </div>`);
} else if(state.quest4Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Sewers Shed</div>
  <div class="quest-desc">Find and defeat whatever's shedding clockwork parts in the Dank Sewers. It's rare — keep adventuring until it shows itself.</div>
  <div class="quest-progress">${state.quest4RareDefeated ? 'Digger-bot defeated — report back at the Tinker\'s Workshop!' : 'Digger-bot not yet encountered.'}</div>
  </div>`);
}

if(state.quest5Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Vein</div>
  <div class="quest-desc">You gathered clockwork parts from the Clockwork Quarry and the Dank Sewers so the Tinker could trace the old vein of gnome-tech — straight to the Sunless Vault.</div>
  <div class="quest-progress">Reward claimed: 40 Pop Tabs, 60 XP</div>
  </div>`);
} else if(state.quest5Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Vein</div>
  <div class="quest-desc">Gather parts from monsters in the Clockwork Quarry and the Dank Sewers, then bring them to the Tinker.</div>
  <div class="quest-progress">Parts gathered: ${countVeinIngredientsHeld()}/${veinIngredients.length*VEIN_ITEM_COUNT_NEEDED}</div>
  </div>`);
}

if(state.quest6Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Throne</div>
  <div class="quest-desc">You hunted down and defeated the Gnome King himself, deep in the Sunless Vault, and uncovered Gnometropolis beneath it.</div>
  <div class="quest-progress">Reward claimed: 50 Pop Tabs, 70 XP</div>
  </div>`);
} else if(state.quest6Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Throne</div>
  <div class="quest-desc">Hunt down and defeat the Gnome King in the Sunless Vault. He's rare — keep adventuring until he shows himself.</div>
  <div class="quest-progress">${state.quest6RareDefeated ? 'Gnome King defeated — report back at the Guild!' : 'Gnome King not yet encountered.'}</div>
  </div>`);
}

if(state.classQuestComplete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Adventurer's Trial</div>
  <div class="quest-desc">The guildmaster studied your training, your gear, the way you carry yourself, and named your path.</div>
  <div class="quest-progress">Reward claimed: recognized as a ${state.classTitle}</div>
  </div>`);
} else if(state.classQuestAccepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Adventurer's Trial</div>
  <div class="quest-desc">The guildmaster is ready to name your path. Say the word when you're ready to hear it.</div>
  <div class="quest-progress">Ready — claim your path at the Guild.</div>
  </div>`);
}

activeEl.innerHTML = activeEntries.length ? activeEntries.join('') : '<div class="quest-log-empty">No active quests. Explore Gladstone Hollow to find one.</div>';
  completedEl.innerHTML = completedEntries.length ? completedEntries.join('') : '<div class="quest-log-empty">No completed quests yet.</div>';
}
