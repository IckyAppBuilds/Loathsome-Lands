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

/* Tier 2/3 shop gear (shopGearItemsTier2/3, content.js) keeps its
authored primary stat/value, but rolls which OTHER stat(s) it actually
gets fresh on every purchase — same "guaranteed primary, randomized
secondary" shape as rollGearDropTier() (combat.js) uses for monster
drops, minus the tier roll itself (a shop purchase's tier is already
fixed by which tier's price you paid). Tier 1 (a single stat) and
non-equip items pass through unchanged — there's nothing to roll. */
function rollShopGearStats(def){
   if(def.type !== 'equip' || !def.bonus) return { ...def };
   const statKeys = Object.keys(def.bonus);
   if(statKeys.length <= 1) return { ...def };
   const primaryStat = statKeys[0];
   const primaryValue = def.bonus[primaryStat];
   const secondaryCount = statKeys.length - 1;
   const candidates = ['beef','zip','grit','hoodoo'].filter(s => s !== primaryStat);
   const shuffled = candidates.map(s => ({ s, r: Math.random() })).sort((a,b) => a.r - b.r).map(x => x.s);
   const bonus = { [primaryStat]: primaryValue };
   shuffled.slice(0, secondaryCount).forEach(s => { bonus[s] = 1; });
   return { ...def, bonus };
}

function buyItemByName(name){
   if(state.location !== 'shop') return;
   const def = getAvailableShopItems().find(i=>i.name===name);
   if(!def || state.popTabs < def.price) return;
   state.popTabs -= def.price;
   const item = rollShopGearStats(def);
   state.inventory.push(item);
   clearLog();
   const bonusText = item.type==='equip' && item.bonus && Object.keys(item.bonus).length
   ? ` (${Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`
     : '';
   log(`You buy ${item.name} for ${def.price} Pop Tabs.${bonusText}`);
   render();
}

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

/* ---------------- Biscuit regeneration ---------------- */
const BISCUIT_MAX = 100;
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

/* ---------------- Passive Casino income ("the house's cut") ---------------- */
/* Same shape as regenBiscuits() above, deliberately — elapsed-real-time
accrual up to a cap, keyed off a stored timestamp. Two differences: the
cap is 0 (inert) until the Casino is upgraded at least once, and the
"ms per Pop Tab" rate is derived from the current cap rather than fixed,
so every level fills from 0 to ITS OWN (bigger) cap in the same
CASINO_WINNINGS_FULL_MS (~1 day) instead of higher levels taking
longer. */
function casinoWinningsCap(){
   return CASINO_WINNINGS_CAP[state.buildingUpgrades.casino || 0];
}

function regenCasinoWinnings(){
   const cap = casinoWinningsCap();
   if(cap <= 0 || state.casinoWinnings >= cap){
      state.lastCasinoRegenAt = Date.now();
      return;
   }
   const msPerPopTab = CASINO_WINNINGS_FULL_MS / cap;
   const elapsed = Date.now() - state.lastCasinoRegenAt;
   const gained = Math.floor(elapsed / msPerPopTab);
   if(gained > 0){
      state.casinoWinnings = Math.min(cap, state.casinoWinnings + gained);
      state.lastCasinoRegenAt += gained * msPerPopTab;
   }
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
