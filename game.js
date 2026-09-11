/* ---------------- Core loop ---------------- */
const ADVENTURE_ZONES = ['commons', 'sewers', 'quarry', 'vault'];
function goAdventuring(){
  if(state.inCombat || !ADVENTURE_ZONES.includes(state.location)) return;
  regenBiscuits();
  if(!devMode && state.adventures<=0){
    clearLog();
    log(`You're out of Biscuits, and spite alone won't carry you any further. The next batch is still in the oven — check back in ${formatMs(msUntilNextBiscuit())}.`);
    render();
    return;
  }
  if(!devMode) state.adventures--;
  clearLog();
  state.showVictory = false;
  state.victoryMonster = null;

  const commanderHunt = state.location==='commons' && state.quest2Accepted && !state.quest2Complete && !state.commanderDefeated;
  if(commanderHunt && Math.random() < COMMANDER_SPAWN_CHANCE){
    startCombat(gnomeCommander);
    render();
    return;
  }

  const diggerBotHunt = state.location==='sewers' && state.quest4Accepted && !state.quest4Complete && !state.quest4RareDefeated;
  if(diggerBotHunt && Math.random() < DIGGERBOT_SPAWN_CHANCE){
    startCombat(diggerBot);
    render();
    return;
  }

  const roll = Math.random();
  if(roll < 0.5){
    startCombat();
  } else if(roll < 0.75){
    const evt = hazardEvents[Math.floor(Math.random()*hazardEvents.length)];
    const dmg = randInt(evt.dmg[0], evt.dmg[1]);
    state.hp = Math.max(0, state.hp-dmg);
    log(`${evt.text} (-${dmg} HP)`, 'damage');
    checkDefeat();
  } else {
    const line = noncombatEvents[Math.floor(Math.random()*noncombatEvents.length)];
    log(line);
  }
  render();
}

/* Which combat sub-panel is showing: 'main' (Attack/Cast/Flee) or 'spells'
   (the spellbook opened via Cast). Transient UI state, not saved — same
   convention as devMode. Reset to 'main' whenever combat starts/ends so a
   leftover open spellbook never bleeds into the next fight. */
let combatSubView = 'main';

function startCombat(forceTemplate){
  const pool = monsters.filter(m => m.zone === state.location);
  const template = forceTemplate || pool[Math.floor(Math.random()*pool.length)];
  state.monster = { ...template, maxHp: template.hp };
  state.inCombat = true;
  combatSubView = 'main';
  log(template.rare
    ? (template === gnomeCommander
        ? "The gnome commander himself marches out to meet you. This looks serious."
        : `${capitalize(state.monster.name)} lurches into view. This looks serious.`)
    : `A wild ${state.monster.name} shuffles into view!`);
}

/* Shared "monster gets a turn" resolution, used after every combat action
   (Attack, a damage/heal spell, or a ward spell with a reduced multiplier).
   Zip's dodge chance applies the same way regardless of what the player
   just did — casting a spell isn't stealthier than swinging a fork. */
function monsterRetaliate(dmgMultiplier){
  const eff = getEffectiveStats();
  const dodgeChance = Math.min(0.5, eff.zip*0.03);
  if(Math.random() < dodgeChance){
    log(`You dodge ${state.monster.name}'s counterattack completely.`);
    return;
  }
  let mdmg = randInt(state.monster.atkMin, state.monster.atkMax);
  if(dmgMultiplier !== undefined) mdmg = Math.max(0, Math.round(mdmg*dmgMultiplier));
  state.hp = Math.max(0, state.hp-mdmg);
  log(`${capitalize(state.monster.name)} retaliates for ${mdmg} damage.`, 'damage');
}

function playerAttack(){
  if(!state.inCombat) return;
  const eff = getEffectiveStats();
  const dmg = randInt(3,7) + (state.level-1) + eff.beef;
  state.monster.hp = Math.max(0, state.monster.hp-dmg);
  log(`You strike ${state.monster.name} for ${dmg} damage.`);

  if(state.monster.hp<=0){
    winCombat();
    return;
  }

  monsterRetaliate();
  checkDefeat();
  render();
}

/* ---------------- Spells ---------------- */
function openSpellMenu(){
  if(!state.inCombat || state.spellsKnown.length===0) return;
  combatSubView = 'spells';
  render();
}
function closeSpellMenu(){
  combatSubView = 'main';
  render();
}

function castSpell(id){
  if(!state.inCombat) return;
  const spell = spells.find(s=>s.id===id);
  if(!spell || !state.spellsKnown.includes(id) || state.mp < spell.mpCost) return;

  state.mp -= spell.mpCost;
  const eff = getEffectiveStats();
  combatSubView = 'main';

  if(spell.type==='damage'){
    const dmg = randInt(spell.dmgMin, spell.dmgMax) + (state.level-1) + eff.hoodoo;
    state.monster.hp = Math.max(0, state.monster.hp-dmg);
    log(`You cast ${spell.name} — ${capitalize(state.monster.name)} takes ${dmg} damage.`);
    if(state.monster.hp<=0){
      winCombat();
      return;
    }
    monsterRetaliate();
  } else if(spell.type==='heal'){
    const before = state.hp;
    state.hp = Math.min(state.maxHp, state.hp+spell.healValue);
    log(`You cast ${spell.name} and patch yourself up. (+${state.hp-before} HP)`);
    monsterRetaliate();
  } else if(spell.type==='ward'){
    log(`You cast ${spell.name}, bracing yourself for whatever's coming.`);
    monsterRetaliate(0.5);
  }

  checkDefeat();
  render();
}

function learnSpell(id){
  if(state.location !== 'hoodoo') return;
  const spell = spells.find(s=>s.id===id);
  if(!spell || state.spellsKnown.includes(id) || state.popTabs < spell.price) return;
  state.popTabs -= spell.price;
  state.spellsKnown.push(id);
  clearLog();
  log(`The Hoodoo Doctor teaches you ${spell.name}. (-${spell.price} Pop Tabs)`);
  render();
}

function playerFlee(){
  if(!state.inCombat) return;
  const eff = getEffectiveStats();
  const fleeChance = Math.min(0.9, 0.65 + eff.zip*0.02);
  if(Math.random() < fleeChance){
    log(`You flee from ${state.monster.name}, dignity mostly intact.`);
    endCombat();
  } else {
    const mdmg = randInt(state.monster.atkMin, state.monster.atkMax);
    state.hp = Math.max(0, state.hp-mdmg);
    log(`You fail to escape. ${capitalize(state.monster.name)} gets a free hit for ${mdmg}.`, 'damage');
    checkDefeat();
  }
  render();
}

function winCombat(){
  const defeatedName = state.monster.name;
  const xpGain = state.monster.xp;
  const wasCommander = !!state.monster.rare && state.monster.name === gnomeCommander.name;
  const wasDiggerBot = !!state.monster.rare && state.monster.name === diggerBot.name;
  /* Rake tines are a quest item (key:'rakeTine') and the feral lawn gnome's
     ONLY loot entry — so without this gate they'd drop via the generic 70%
     roll below even before the quest is accepted or after it's turned in,
     leaving the player holding unsellable junk with nowhere to use it.
     Quest items should only ever show up while their quest is actually
     active. */
  const isRakeTineLoot = state.monster.loot && state.monster.loot.key==='rakeTine';
  const isNeededQuestItem = isRakeTineLoot && state.questAccepted && !state.questComplete;
  const potionIngredient = potionIngredients.find(p => p.monsterName === state.monster.name);
  const needsPotionIngredient = potionIngredient && state.quest3Accepted && !state.quest3Complete
    && !state.inventory.some(it => it.key === potionIngredient.item.key);
  const veinIngredient = veinIngredients.find(v => v.monsterName === state.monster.name);
  const needsVeinIngredient = veinIngredient && state.quest5Accepted && !state.quest5Complete
    && !state.inventory.some(it => it.key === veinIngredient.item.key);
  const lootRoll = needsPotionIngredient
    ? potionIngredient.item
    : needsVeinIngredient
      ? veinIngredient.item
      : isRakeTineLoot
        ? (isNeededQuestItem ? state.monster.loot : null) /* never drops outside the quest window */
        : (state.monster.loot && Math.random()<0.7 ? state.monster.loot : null);
  const rareRoll = Math.random()<RARE_DROP_CHANCE ? rareDrops[Math.floor(Math.random()*rareDrops.length)] : null;

  state.victoryMonster = { art: state.monster.art, name: state.monster.name };
  state.showVictory = true;

  clearLog();
  if(wasCommander){
    state.commanderDefeated = true;
    log(`You defeat ${defeatedName}! The rest of his gnomes scatter into the hedges. (+${xpGain} XP)`);
  } else if(wasDiggerBot){
    state.quest4RareDefeated = true;
    log(`You defeat ${defeatedName}! It sparks once and goes still. (+${xpGain} XP)`);
  } else {
    log(`You defeat ${defeatedName}! (+${xpGain} XP)`);
  }
  state.xp += xpGain;
  if(lootRoll){
    state.inventory.push({...lootRoll});
    log(`You loot: ${lootRoll.name}.`);
  }
  if(rareRoll){
    state.inventory.push({...rareRoll});
    log(`Wait — something rare. You find: ${rareRoll.name}!`);
  }
  checkLevelUp();
  endCombat();
  render();
}

function endCombat(){
  state.inCombat = false;
  state.monster = null;
  combatSubView = 'main';
}

function checkDefeat(){
  if(state.hp<=0){
    clearLog();
    log(devMode
      ? "Everything goes dark. You wake up outside the Inn, patched up but humbled. (dev mode — no Biscuit penalty)"
      : "Everything goes dark. You wake up outside the Inn, patched up but humbled. (-2 Biscuits for the walk of shame)", 'damage');
    state.hp = Math.floor(state.maxHp*0.5);
    if(!devMode) state.adventures = Math.max(0, state.adventures-2);
    state.location = 'town';
    state.showVictory = false;
    state.victoryMonster = null;
    endCombat();
    autosave();
  }
}

function checkLevelUp(){
  if(state.xp>=state.xpToLevel){
    state.xp -= state.xpToLevel;
    state.xpToLevel = Math.floor(state.xpToLevel*1.5);
    state.level++;
    state.baseMaxHp += 6;
    state.baseMaxMp += 2;
    state.statPoints++;
    recomputeMaxStats();
    state.hp = state.maxHp;
    state.mp = state.maxMp;
    log(`You feel sturdier. You are now level ${state.level}! (+1 stat point to spend — check your Character page)`);
    autosave();
  }
}

function restAtInn(){
  if(state.inCombat || state.location !== 'town') return;
  regenBiscuits();
  clearLog();
  if(!devMode && state.adventures<=0){
    log(`The innkeeper eyes your empty pockets. "No Biscuits, no bed." Next one's ready in ${formatMs(msUntilNextBiscuit())}.`);
    render();
    return;
  }
  if(!devMode) state.adventures--;
  state.hp = state.maxHp;
  state.mp = state.maxMp;
  state.showVictory = false;
  state.victoryMonster = null;
  log("You duck into the Inn and rest up. You feel merely acceptable again. (-1 Biscuit)");
  render();
}

function travelTo(dest){
  if(state.inCombat) return;
  if(dest === state.location){ closeAllDrawers(); return; }
  if(dest === 'sewers' && !state.quest2Complete) return;
  if(dest === 'quarry' && !state.quest4Complete) return;
  if(dest === 'vault' && !state.quest5Complete) return;
  if(dest === 'town'){
    const wasGaffer = state.location === 'gaffer';
    state.location = 'town';
    state.showVictory = false;
    state.victoryMonster = null;
    clearLog();
    log(wasGaffer ? "You step back out into Gladstone Hollow." : "You head back into Gladstone Hollow, dirt-streaked and modestly victorious.");
  } else if(dest === 'commons'){
    state.location = 'commons';
    state.showVictory = false;
    state.victoryMonster = null;
    clearLog();
    log("You leave Gladstone Hollow behind and head into the Overgrown Commons.");
  } else if(dest === 'sewers'){
    state.location = 'sewers';
    state.showVictory = false;
    state.victoryMonster = null;
    clearLog();
    log("You climb down into the Dank Sewers. The air is thick, the walls are slick, and something skitters just out of sight.");
  } else if(dest === 'quarry'){
    state.location = 'quarry';
    state.showVictory = false;
    state.victoryMonster = null;
    clearLog();
    log("You follow the old service tunnel down into the Clockwork Quarry. Something in the dark is still ticking.");
  } else if(dest === 'vault'){
    state.location = 'vault';
    state.showVictory = false;
    state.victoryMonster = null;
    clearLog();
    log("You pry open the sealed door at the bottom of the Quarry and step into the Sunless Vault. It's colder than it should be.");
  }
  closeAllDrawers();
  render();
}

function enterGafferHouse(){
  if(state.inCombat || state.location !== 'town') return;
  state.location = 'gaffer';
  clearLog();
  if(state.questComplete){
    log("You step inside. Gaffer Thistlewick is out back, happily raking away.");
  } else if(state.questAccepted){
    log("You step inside. Gaffer Thistlewick glances up from his half-finished rake.");
  } else {
    log("You step inside. Gaffer Thistlewick looks up hopefully — he's got a favor to ask.");
  }
  render();
}

function acceptQuest(){
  if(state.location !== 'gaffer' || state.questAccepted || state.questComplete) return;
  state.questAccepted = true;
  clearLog();
  log("You accept Gaffer Thistlewick's quest: gather 3 rake tines from the gnomes in the Overgrown Commons.");
  render();
}

function leaveGafferHouse(){
  if(state.inCombat || state.location !== 'gaffer') return;
  state.location = 'town';
  clearLog();
  render();
}

function enterShop(){
  if(state.inCombat || state.location !== 'town') return;
  state.location = 'shop';
  clearLog();
  log("You step into the shop. The shopkeeper eyes your pack with professional interest.");
  render();
}

function leaveShop(){
  if(state.inCombat || state.location !== 'shop') return;
  state.location = 'town';
  clearLog();
  render();
}

function enterHoodoo(){
  if(state.inCombat || state.location !== 'town') return;
  state.location = 'hoodoo';
  clearLog();
  if(state.quest3Complete){
    log("You duck under a curtain of dangling charms. The Hoodoo Doctor gives the bottled fury on her shelf a proud little glance.");
  } else if(state.quest3Accepted){
    log(`You duck under a curtain of dangling charms. The Hoodoo Doctor checks your hands for ingredients. (${countPotionIngredientsHeld()}/${potionIngredients.length} gathered)`);
  } else if(state.quest2Complete){
    log("You duck under a curtain of dangling charms. The Hoodoo Doctor looks up from a bubbling pot with a knowing grin — she's got a job for you.");
  } else {
    log("You duck under a curtain of dangling charms. The Hoodoo Doctor looks up from a bubbling pot and grins.");
  }
  render();
}

function leaveHoodoo(){
  if(state.inCombat || state.location !== 'hoodoo') return;
  state.location = 'town';
  clearLog();
  render();
}

function enterTinker(){
  if(state.inCombat || state.location !== 'town') return;
  state.location = 'tinker';
  clearLog();
  if(state.quest5Complete){
    log("You duck into the workshop. The Tinker is elbow-deep in something that used to be a clock, and waves without looking up.");
  } else if(state.quest5Accepted){
    log(`You duck into the workshop. The Tinker glances at your hands. (${countVeinIngredientsHeld()}/${veinIngredients.length} gathered)`);
  } else if(state.quest4Complete){
    log("You duck into the workshop. The Tinker's goggles are pushed up on their forehead, and they look thrilled to see you.");
  } else if(state.quest4Accepted){
    log(state.quest4RareDefeated
      ? "You duck into the workshop, the digger-bot's fight still fresh in your memory."
      : "You duck into the workshop. Gears and half-finished contraptions cover every surface.");
  } else {
    log("You duck into the workshop. Gears and half-finished contraptions cover every surface. Someone clears their throat behind a pile of scrap.");
  }
  render();
}

function leaveTinker(){
  if(state.inCombat || state.location !== 'tinker') return;
  state.location = 'town';
  clearLog();
  render();
}

function acceptQuest4(){
  if(state.location !== 'tinker' || !state.quest2Complete || state.quest4Accepted || state.quest4Complete) return;
  state.quest4Accepted = true;
  clearLog();
  log("The Tinker accepts your quest: strange clockwork parts keep turning up in the Dank Sewers. Find whatever's shedding them and put a stop to it. It won't be easy to find — you'll have to keep adventuring down there.");
  render();
}

function reportDiggerBotKill(){
  if(state.location !== 'tinker' || !state.quest4Accepted || state.quest4Complete || !state.quest4RareDefeated) return;
  state.quest4Complete = true;
  state.popTabs += 30;
  state.xp += 45;
  clearLog();
  log("You describe the sparking, thrashing mess you fought in the sewers. The Tinker's eyes go wide with delight rather than concern. (+30 Pop Tabs, +45 XP)");
  log("\"That's one of mine,\" they admit. \"Well — was. Come look at this.\" They trace its wiring back to a sealed service tunnel you'd never have noticed. \"The old Clockwork Quarry. Go on, it's yours to poke around in now.\"");
  checkLevelUp();
  render();
  autosave();
}

function acceptQuest5(){
  if(state.location !== 'tinker' || !state.quest4Complete || state.quest5Accepted || state.quest5Complete) return;
  state.quest5Accepted = true;
  clearLog();
  log("The Tinker accepts your quest: bring back a couple of intact parts from the Clockwork Quarry, and a couple more from deeper in the Sewers, so they can trace where the vein of old gnome-tech actually leads.");
  render();
}

function turnInVein(){
  if(state.location !== 'tinker' || !state.quest5Accepted || state.quest5Complete) return;
  if(countVeinIngredientsHeld() < veinIngredients.length) return;

  veinIngredients.forEach(v=>{
    const idx = state.inventory.findIndex(it => it.key === v.item.key);
    if(idx !== -1) state.inventory.splice(idx,1);
  });

  state.quest5Complete = true;
  state.popTabs += 40;
  state.xp += 60;

  clearLog();
  log("The Tinker spreads every piece out on the workbench and goes very quiet for a long moment. (+40 Pop Tabs, +60 XP)");
  log("\"They all trace back to the same place,\" they finally say, pointing at a hand-drawn map. \"Something sealed under the Quarry floor. I'd want someone capable checking it out. That's you, I suppose.\" The Sunless Vault is now open — check the Map.");
  checkLevelUp();
  render();
  autosave();
}

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
  if(Math.random() < CASINO_WIN_CHANCE){
    const winnings = amount * 2;
    state.popTabs += winnings;
    log(`${casinoWinLines[Math.floor(Math.random()*casinoWinLines.length)]} (+${winnings} Pop Tabs)`);
  } else {
    log(`${casinoLoseLines[Math.floor(Math.random()*casinoLoseLines.length)]} (-${amount} Pop Tabs)`);
  }
  render();
}

function enterGuild(){
  if(state.inCombat || state.location !== 'town') return;
  state.location = 'guild';
  clearLog();
  if(state.quest2Complete){
    log("You step into the guild hall. The guildmaster nods at you approvingly.");
  } else if(state.quest2Accepted){
    log(state.commanderDefeated
      ? "You step into the guild hall, commander's defeat fresh in your memory."
      : "You step into the guild hall. The guildmaster asks if you've found him yet.");
  } else if(state.questComplete){
    log("You step into the guild hall. The guildmaster looks up with sudden interest.");
  } else {
    log("You step into the guild hall. The guildmaster barely glances up.");
  }
  render();
}

function leaveGuild(){
  if(state.inCombat || state.location !== 'guild') return;
  state.location = 'town';
  clearLog();
  render();
}

function acceptQuest2(){
  if(state.location !== 'guild' || !state.questComplete || state.quest2Accepted || state.quest2Complete) return;
  state.quest2Accepted = true;
  clearLog();
  log("You accept the guild's quest: track down and defeat the gnome commander in the Overgrown Commons. He's rare — you'll have to keep adventuring and hope he shows himself.");
  render();
}

function reportCommanderKill(){
  if(state.location !== 'guild' || !state.quest2Accepted || state.quest2Complete || !state.commanderDefeated) return;
  state.quest2Complete = true;
  state.popTabs += 30;
  state.xp += 50;
  clearLog();
  log("You describe the fight in more detail than the guildmaster asked for. He hands over your reward regardless. (+30 Pop Tabs, +50 XP)");
  log("As you turn to leave, he adds: \"...and since you're clearly not afraid of gnomes, the sewers under the square are yours to deal with too, if you're feeling brave.\"");
  checkLevelUp();
  render();
  autosave();
}

/* ---------------- Level-10 Guild capstone: "The Adventurer's Trial" ---------------- */
/* Offered by the guildmaster once quest 2 is complete and state.level>=10 —
   see classQuestState in render(). Deliberately simple: accept, then claim
   (no separate objective) — reaching level 10 across the earlier quests and
   zones is the actual gate. claimClassPath() looks at whichever stat has
   the most points sunk into it (ties broken in STAT_LABELS key order —
   beef, zip, grit, hoodoo) and hands out a permanent title plus a small
   +2 bonus to that stat, via CLASS_TITLES in content.js. */
function acceptClassQuest(){
  if(state.location !== 'guild' || !state.quest2Complete || state.level<10 || state.classQuestAccepted || state.classQuestComplete) return;
  state.classQuestAccepted = true;
  clearLog();
  log("The guildmaster looks you over — really looks, this time. \"You've come further than most. There's a Trial for adventurers who reach this far: the Guild puts a name to what you've become. Say the word when you're ready to hear it.\"");
  render();
}

function claimClassPath(){
  if(state.location !== 'guild' || !state.classQuestAccepted || state.classQuestComplete) return;
  const dominant = Object.keys(STAT_LABELS).reduce((best, key) =>
    state.stats[key] > state.stats[best] ? key : best, Object.keys(STAT_LABELS)[0]);
  state.stats[dominant] += 2;
  state.classTitle = CLASS_TITLES[dominant];
  recomputeMaxStats();
  state.classQuestComplete = true;

  clearLog();
  log(`The guildmaster studies your training, your gear, the way you carry yourself. "${STAT_LABELS[dominant]}," he says finally. "That's your path." (+2 ${STAT_LABELS[dominant]})`);
  log(`You are recognized as a ${CLASS_TITLES[dominant]}. Check your Character page.`);
  render();
  autosave();
}

function acceptQuest3(){
  if(state.location !== 'hoodoo' || !state.quest2Complete || state.quest3Accepted || state.quest3Complete) return;
  state.quest3Accepted = true;
  clearLog();
  log("You accept the Hoodoo Doctor's quest: bring back a couple of ingredients from the Overgrown Commons, and a couple from the Dank Sewers, so she can brew something powerful.");
  render();
}

function brewPotion(){
  if(state.location !== 'hoodoo' || !state.quest3Accepted || state.quest3Complete) return;
  if(countPotionIngredientsHeld() < potionIngredients.length) return;

  potionIngredients.forEach(p=>{
    const idx = state.inventory.findIndex(it => it.key === p.item.key);
    if(idx !== -1) state.inventory.splice(idx,1);
  });

  state.quest3Complete = true;
  state.popTabs += 20;
  state.xp += 35;
  if(!state.spellsKnown.includes('bottledfury')) state.spellsKnown.push('bottledfury');

  clearLog();
  log("The Hoodoo Doctor tips every ingredient into the pot at once. It hisses, glows, and settles into a single humming bottle. (+20 Pop Tabs, +35 XP)");
  log("\"There,\" she says, pressing it into your hands. \"Bottled Fury. You'll know when to use it.\" You've learned the spell.");
  checkLevelUp();
  render();
  autosave();
}

function sellItemByName(name){
  if(state.location !== 'shop') return;
  const idxList = [];
  state.inventory.forEach((it,i)=>{ if(it.name===name && (it.type==='junk' || it.type==='equip') && it.sell) idxList.push(i); });
  if(idxList.length===0) return;
  const sellPrice = state.inventory[idxList[0]].sell;
  const count = idxList.length;
  const earned = sellPrice * count;
  for(let n=idxList.length-1; n>=0; n--){ state.inventory.splice(idxList[n],1); }
  state.popTabs += earned;
  clearLog();
  log(`You sell ${count} × ${name} for ${earned} Pop Tabs.`);
  render();
}

function buyItemByName(name){
  if(state.location !== 'shop') return;
  const def = shopBuyItems.find(i=>i.name===name);
  if(!def || state.popTabs < def.price) return;
  state.popTabs -= def.price;
  state.inventory.push({...def});
  clearLog();
  log(`You buy ${def.name} for ${def.price} Pop Tabs.`);
  render();
}

function giveRakeTines(){
  if(state.location !== 'gaffer' || !state.questAccepted || state.questComplete) return;
  const tineIdx = [];
  state.inventory.forEach((it, i)=>{ if(it.key==='rakeTine') tineIdx.push(i); });
  if(tineIdx.length===0) return;

  const stillNeeded = QUEST_TINES_NEEDED - state.questTinesGiven;
  const giveCount = Math.min(tineIdx.length, stillNeeded);
  for(let n=0; n<giveCount; n++){
    const idx = tineIdx[tineIdx.length-1-n];
    state.inventory.splice(idx,1);
  }
  state.questTinesGiven += giveCount;

  clearLog();
  log(`You hand over ${giveCount} rake tine${giveCount>1?'s':''}. Gaffer Thistlewick counts them twice, then a third time for luck.`);

  if(state.questTinesGiven >= QUEST_TINES_NEEDED){
    state.questComplete = true;
    state.popTabs += 15;
    state.xp += 25;
    log("The rake is whole again! Gaffer Thistlewick hands you 15 Pop Tabs and thanks you properly. (+15 Pop Tabs, +25 XP)");
    checkLevelUp();
    autosave();
  }
  render();
}

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

/* ---------------- Biscuit regeneration ---------------- */
const BISCUIT_MAX = 200;
const BISCUIT_REGEN_MS = 60 * 1000; /* one new Biscuit every minute */

function regenBiscuits(){
  if(state.adventures >= BISCUIT_MAX){
    state.lastRegenAt = Date.now();
    return;
  }
  const elapsed = Date.now() - state.lastRegenAt;
  const gained = Math.floor(elapsed / BISCUIT_REGEN_MS);
  if(gained > 0){
    state.adventures = Math.min(BISCUIT_MAX, state.adventures + gained);
    state.lastRegenAt += gained * BISCUIT_REGEN_MS;
  }
}

function msUntilNextBiscuit(){
  if(state.adventures >= BISCUIT_MAX) return 0;
  return Math.max(0, BISCUIT_REGEN_MS - (Date.now() - state.lastRegenAt));
}

function formatMs(ms){
  const totalSec = Math.ceil(ms/1000);
  const m = Math.floor(totalSec/60);
  const s = totalSec % 60;
  return m+':'+String(s).padStart(2,'0');
}

function updateBiscuitDisplay(){
  document.getElementById('biscuit-stat').classList.toggle('dev-active', devMode);
  if(devMode){
    state.adventures = BISCUIT_MAX;
    state.lastRegenAt = Date.now();
    document.getElementById('adv-text').textContent = '∞';
    document.getElementById('adv-btn').disabled = state.inCombat;
    document.getElementById('biscuit-bar').style.width = '100%';
    return;
  }
  regenBiscuits();
  document.getElementById('adv-text').textContent = state.adventures;
  document.getElementById('adv-btn').disabled = state.inCombat;
  const bar = document.getElementById('biscuit-bar');
  if(state.adventures >= BISCUIT_MAX){
    bar.style.width = '100%';
  } else {
    const progress = 1 - (msUntilNextBiscuit() / BISCUIT_REGEN_MS);
    bar.style.width = (progress*100)+'%';
  }
}
setInterval(updateBiscuitDisplay, 1000);

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
});

/* Seed a brand-new run: starter gear (equipped) and a couple of starter
   items, then the opening log line. Called for a guest, for a freshly
   registered/logged-in account with no save yet, and (in degraded mode,
   no Supabase) unconditionally at boot. */
function startFreshGame(){
  Object.keys(starterGear).forEach(slot => { state.equipment[slot] = {...starterGear[slot]}; });
  recomputeMaxStats();
  state.inventory.push({...healItems[0]});
  clearLog();
  log("You arrive in Gladstone Hollow. A cottage on the square has a rather urgent-looking flag over it.");
  if(devMode) log("Dev mode ON (via ?dev=1) — Biscuits won't run out.");
  render();
}

/* ---------------- Boot ---------------- */
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
