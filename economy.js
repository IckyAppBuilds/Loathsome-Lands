/* Quest items (potion/vein ingredients, the rake tine) are unsellable while
their quest is still open — but once the quest is complete there's no
further use for them, so let them be junked like anything else.
QUEST_ITEM_COMPLETION_FLAG (content.js) maps each quest item's `key` to
the state flag that has to be true first. */
function isQuestItemSellable(item){
   if(!item || item.type !== 'quest') return false;
   const flag = QUEST_ITEM_COMPLETION_FLAG[item.key];
   return !!flag && !!state[flag];
}

function sellItemByName(name){
   if(state.location !== 'shop') return;
   const idxList = [];
   state.inventory.forEach((it,i)=>{
      if(it.name===name && it.sell && ((it.type==='junk' || it.type==='equip') || isQuestItemSellable(it))) idxList.push(i);
   });
   if(idxList.length===0) return;
   const sellPrice = state.inventory[idxList[0]].sell;
   const count = idxList.length;
   /* Tinker bonus applied to the total, then rounded once, so per-unit
   rounding can't shave off Pop Tabs across a multi-item sale. */
   const earned = Math.round(sellPrice * count * (1 + TINKER_SELL_BONUS[state.buildingUpgrades.tinker || 0]));
   for(let n=idxList.length-1; n>=0; n--){ state.inventory.splice(idxList[n],1); }
   state.popTabs += earned;
   clearLog();
   log(`You sell ${count} × ${name} for ${earned} Pop Tabs.`);
   render();
}

/* Tier-2 gear (shopGearItemsTier2, content.js) is folded in on top of the
always-available shopBuyItems once state.quest6Complete is true, rather
than being spliced into shopBuyItems itself — that keeps tier-1
pricing/availability untouched and the unlock gate in exactly one place.
Before the unlock, tier-2 gear is simply absent from the Shop rather than
shown-but-disabled.

Separately, upgrading the Shop building (state.buildingUpgrades.shop, via
the Town Lot) unlocks its own additive tiers of food and gear at each
level — see SHOP_LEVEL_FOOD_TIER2/SHOP_LEVEL_FOOD_TIER3/
SHOP_LEVEL_GEAR_TIER3 (content.js). This is gated purely on the Shop's
level, independent of quest6Complete — the two unlock paths stack rather
than one replacing the other, and nothing already unlocked is ever
removed as new tiers are added. */
function getAvailableShopItems(){
   const shopLevel = state.buildingUpgrades.shop || 0;
   let items = [...shopBuyItems];
   if(state.quest6Complete) items = items.concat(shopGearItemsTier2);
   if(shopLevel >= SHOP_LEVEL_FOOD_TIER2) items = items.concat(shopFoodItemsTier2);
   if(shopLevel >= SHOP_LEVEL_FOOD_TIER3) items = items.concat(shopFoodItemsTier3);
   if(shopLevel >= SHOP_LEVEL_GEAR_TIER3) items = items.concat(shopGearItemsTier3);
   return items;
}

function buyItemByName(name){
   if(state.location !== 'shop') return;
   const def = getAvailableShopItems().find(i=>i.name===name);
   if(!def || state.popTabs < def.price) return;
   state.popTabs -= def.price;
   state.inventory.push({...def});
   clearLog();
   log(`You buy ${def.name} for ${def.price} Pop Tabs.`);
   render();
}

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

/* ---------------- Biscuit regeneration ---------------- */
const BISCUIT_MAX = 200;
const BISCUIT_REGEN_MS = 3 * 60 * 1000; /* one new Biscuit every 3 minutes */

/* The player's live cap — BISCUIT_MAX plus whatever the Gaffer's Cottage
adds. Everything that treats BISCUIT_MAX as the actual ceiling on
state.adventures should call this instead, so a single lookup covers every
call site rather than re-deriving the bonus at each one. */
function effectiveBiscuitMax(){
   return BISCUIT_MAX + GAFFER_BISCUIT_MAX_BONUS[state.buildingUpgrades.gaffer || 0];
}

function regenBiscuits(){
   if(state.adventures >= effectiveBiscuitMax()){
      state.lastRegenAt = Date.now();
      return;
   }
   const elapsed = Date.now() - state.lastRegenAt;
   const gained = Math.floor(elapsed / BISCUIT_REGEN_MS);
   if(gained > 0){
      state.adventures = Math.min(effectiveBiscuitMax(), state.adventures + gained);
      state.lastRegenAt += gained * BISCUIT_REGEN_MS;
   }
}

function msUntilNextBiscuit(){
   if(state.adventures >= effectiveBiscuitMax()) return 0;
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
      state.adventures = effectiveBiscuitMax();
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
   if(state.adventures >= effectiveBiscuitMax()){
      bar.style.width = '100%';
   } else {
      const progress = 1 - (msUntilNextBiscuit() / BISCUIT_REGEN_MS);
      bar.style.width = (progress*100)+'%';
   }
}
setInterval(updateBiscuitDisplay, 1000);
