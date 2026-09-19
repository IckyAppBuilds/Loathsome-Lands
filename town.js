/* Every location id that counts as a town square (as opposed to a shop
interior inside one, or an adventure zone reached from one). Right now
there's only Gladstone Hollow ('town'), but this is the list a future
second/third town gets added to — see state.homeTown below and
hydrateState() in account.js, which use this list to decide where a
returning player lands on login rather than hardcoding 'town'. */
const TOWN_HUBS = ['town'];

function restAtInn(){
   if(state.inCombat || state.location !== 'town') return;
   regenBiscuits();
   clearLog();
   if(!devMode && state.adventures<=0){
      log(`The innkeeper eyes your empty pockets. "No Biscuits, no bed." Next one's ready in ${formatMs(msUntilNextBiscuit())}.`);
      render();
      return;
   }
   /* Roll before the decrement (not after) so a hit skips the decrement
   entirely rather than refunding it. */
   let freeRest = false;
   if(!devMode){
      freeRest = Math.random() < INN_FREE_REST_CHANCE[state.buildingUpgrades.inn || 0];
      if(!freeRest) state.adventures--;
   }
   state.hp = state.maxHp;
   state.mp = state.maxMp;
   state.showVictory = false;
   state.victoryMonster = null;
   if(freeRest){
      log("You duck into the Inn and rest up. You feel merely acceptable again. (free rest — the innkeeper couldn't be bothered to charge you)");
   } else {
      log("You duck into the Inn and rest up. You feel merely acceptable again. (-1 Biscuit)");
   }
   render();
}
function travelTo(dest){
   if(state.inCombat) return;
   if(dest === state.location){ closeAllDrawers(); return; }
   if(dest === 'sewers' && !state.quest2Complete) return;
   if(dest === 'quarry' && !state.quest4Complete) return;
   if(dest === 'vault' && !state.quest5Complete) return;
   if(dest === 'gnometropolis' && !state.quest6Complete) return;
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
   } else if(dest === 'gnometropolis'){
      state.location = 'gnometropolis';
      state.showVictory = false;
      state.victoryMonster = null;
      clearLog();
      log("You slip through the passage the Gnome King left undefended and descend into Gnometropolis — the gnomes' hidden capital, alive with clockwork and quiet menace.");
   }
   /* Track the last town square the player actually stood in, separately
   from state.location — shop interiors and adventure zones pass through
   here too, but only a TOWN_HUBS arrival should update it. This is what
   login snaps back to (see hydrateState() in account.js), so a future
   second town doesn't need any new login logic, just an entry here and
   an addition to TOWN_HUBS. */
if(TOWN_HUBS.includes(state.location)) state.homeTown = state.location;
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
   shopTab = 'food'; /* always open on the Food tab — see render.js */
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
      log(`You duck into the workshop. The Tinker glances at your hands. (${countVeinIngredientsHeld()}/${veinIngredients.length*VEIN_ITEM_COUNT_NEEDED} gathered)`);
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

/* ---------------- Town Lot ---------------- */
/* The previously-empty town-square cell — see LOT_TIER_NAMES/LOT_TIER_COST/
BUILDING_UPGRADES (content.js), state.lotTier/state.buildingUpgrades
(core.js), and the Town Lot screen (renderTownLot(), render.js). Follows
the same enterX()/leaveX() convention as every other building above. */
function enterTownLot(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'townlot';
   clearLog();
   if(state.lotTier === 0){
      log("An overgrown lot sits empty between the Inn and the Casino. It wouldn't take much to clear it out and put it to use.");
   } else {
      log("You step onto your lot. There's always something more to build.");
   }
   render();
}

function leaveTownLot(){
   if(state.inCombat || state.location !== 'townlot') return;
   state.location = 'town';
   clearLog();
   render();
}

function buyTownLot(){
   if(state.location !== 'townlot' || state.lotTier !== 0) return;
   const cost = LOT_TIER_COST[1];
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.lotTier = 1;
   clearLog();
   log(`You buy the empty lot for ${cost} Pop Tabs and start clearing it out.`);
   render();
   autosave();
}

function upgradeTownLot(){
   if(state.location !== 'townlot' || state.lotTier < 1 || state.lotTier >= LOT_TIER_MAX) return;
   const next = state.lotTier + 1;
   const cost = LOT_TIER_COST[next];
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.lotTier = next;
   clearLog();
   log(`You upgrade the lot to ${LOT_TIER_NAMES[next]} for ${cost} Pop Tabs.`);
   render();
   autosave();
}

/* Raises state.buildingUpgrades[key] by one level, gated on owning the lot
(lotTier>=1) — the mechanism the lot's purchase is meant to unlock. Also
gated so a building can never be leveled past the lot itself: raising a
building to level L requires state.lotTier >= L, so upgrading the lot is
what unlocks each building's next level, one lot tier at a time (lot tier
and BUILDING_UPGRADE_MAX both top out at 3, so a maxed lot permits every
building to fully max out too). See the comment above BUILDING_UPGRADES
(content.js) for why most buildings still have no gameplay effect beyond
the level number itself. */
function upgradeBuilding(key){
   if(state.location !== 'townlot' || state.lotTier < 1) return;
   const info = BUILDING_UPGRADES.find(b => b.key === key);
   if(!info) return;
   const level = state.buildingUpgrades[key] || 0;
   if(level >= BUILDING_UPGRADE_MAX) return;
   if(level >= state.lotTier) return; /* the lot itself must reach the next tier first */
   const cost = buildingUpgradeCost(level);
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.buildingUpgrades[key] = level + 1;
   clearLog();
   log(`You invest ${cost} Pop Tabs into ${info.name}, raising it to level ${level+1}.`);
   render();
   autosave();
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
   if(countVeinIngredientsHeld() < veinIngredients.length * VEIN_ITEM_COUNT_NEEDED) return;

veinIngredients.forEach(v=>{
   for(let n=0; n<VEIN_ITEM_COUNT_NEEDED; n++){
      const idx = state.inventory.findIndex(it => it.key === v.item.key);
      if(idx !== -1) state.inventory.splice(idx,1);
   }
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

/* Stat-reset (respec) potion — also brewed by the Hoodoo Doctor, but unlike
brewPotion() above it's not quest-gated: it's a repeatable purchase whose price
climbs exponentially every time (STAT_RESET_BASE_PRICE/_PRICE_MULT, content.js),
tracked by state.statResetsBrewed. Refunds every point ever put into the four
core stats so the player can redistribute them, then re-derives max HP/MP since
grit/hoodoo changed. No UI wired to this yet — callable via
onclick="brewStatResetPotion()" once a Hoodoo screen button exists. */
function brewStatResetPotion(){
   if(state.location !== 'hoodoo') return;
   const price = STAT_RESET_BASE_PRICE * Math.pow(STAT_RESET_PRICE_MULT, state.statResetsBrewed);
   if(state.popTabs < price) return;

   state.popTabs -= price;
   const refunded = state.stats.beef + state.stats.zip + state.stats.grit + state.stats.hoodoo;
   state.statPoints += refunded;
   state.stats.beef = state.stats.zip = state.stats.grit = state.stats.hoodoo = 0;
   state.statResetsBrewed++;
   recomputeMaxStats();

   clearLog();
   log(`The Hoodoo Doctor brews you something bitter, no questions asked. Your training unravels — ${refunded} stat points are yours to spend again. (-${price} Pop Tabs)`);
   render();
   autosave();
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
