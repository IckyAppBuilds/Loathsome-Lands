/* ---------------- Drawers (Inventory / Map / Character / Quests / Account) ---------------- */
const DRAWER_IDS = { inv:'inv-drawer', map:'map-drawer', character:'character-drawer', quests:'quest-log-drawer', account:'account-drawer' };

/* Which half of the Map drawer is showing: 'act1' | 'act2'. UI-only,
same convention as shopTab (render-shop.js) — not part of `state`, not
saved. Defaulted fresh every time the drawer actually OPENS (below, in
toggleDrawer()) rather than staying fixed at 'act1' forever — a player
currently standing anywhere in Gnometropolis or Mudroot Warren's own
area (hubKeyForLocation(), hubs.js) almost certainly wants the Act 2
tab, not Act 1's now-irrelevant Gladstone Hollow zones. Manually
clicking the other tab still works as normal for the rest of that
same "drawer open" session — this only resets the STARTING tab each
time it's freshly opened, same as shopTab resetting via enterShop(). */
let mapTab = 'act1';
function setMapTab(tab){
   mapTab = tab;
   render();
}

function toggleDrawer(which){
   const targetId = DRAWER_IDS[which];
   const wasOpen = document.getElementById(targetId).classList.contains('open');
   closeAllDrawers();
   if(!wasOpen){
      openDrawer(targetId);
      if(which==='character') renderCharacterDrawer();
      if(which==='quests') renderQuestLogDrawer();
      if(which==='account') renderAccountTab();
      if(which==='map'){
         const inAct2Area = ['gnometropolis', 'mudrootwarren'].includes(hubKeyForLocation(state.location));
         mapTab = inAct2Area ? 'act2' : 'act1';
         render();
      }
   }
}
function openDrawer(id){
   document.getElementById(id).classList.add('open');
   document.getElementById('backdrop').classList.add('show');
}
function closeAllDrawers(){
   Object.values(DRAWER_IDS).forEach(id => document.getElementById(id).classList.remove('open'));
   document.getElementById('backdrop').classList.remove('show');
}

/* Shared by useItem() (out of combat, below) and useItemInCombat()
(combat.js) — just the HP/MP/luck effect itself, no turn/render/splice
handling, since the two callers need different rules around that (see
useItem()'s own comment). */
function applyConsumableEffect(item){
   if(item.type==='hp'){
      state.hp = Math.min(state.maxHp, state.hp+item.value);
      log(`You eat ${item.name}. Solid choice. (+${item.value} HP)`);
   } else if(item.type==='mp'){
      state.mp = Math.min(state.maxMp, state.mp+item.value);
      log(`You puzzle through ${item.name}. (+${item.value} MP)`);
   } else if(item.type==='luck'){
      state.hp = Math.min(state.maxHp, state.hp+item.hpValue);
      state.mp = Math.min(state.maxMp, state.mp+item.mpValue);
      log(`You tuck ${item.name} behind your ear for luck. (+${item.hpValue} HP, +${item.mpValue} MP)`);
   }
}

/* Out-of-combat only now — mid-fight, a consumable has to go through
useItemInCombat() (combat.js, opened via the same Use menu spells
use) instead, which costs a turn same as Attack/Use. Without that
split, the Pack drawer let a player chain-eat as many potions as they
owned in a single turn for free; blocking it here and routing combat
use through the turn-costing path is what actually enforces "once per
turn." Outside combat there's still no cooldown at all — free to use
as many as you like between fights. */
function useItem(idx){
   if(state.inCombat) return;
   const item = state.inventory[idx];
   applyConsumableEffect(item);
   state.inventory.splice(idx,1);
   render();
}

/* ---------------- Equipment & stats ---------------- */
/* Effective stats = base stats (raised by spending level-up points) plus
whatever bonuses are on currently-equipped gear. Nothing here mutates
state.stats itself — equipment bonuses are only ever additive on top. */
function getEffectiveStats(){
   const eff = { beef: state.stats.beef, zip: state.stats.zip, grit: state.stats.grit, hoodoo: state.stats.hoodoo };
   Object.values(state.equipment).forEach(item=>{
      if(item && item.bonus){
         Object.keys(item.bonus).forEach(k=>{ eff[k] = (eff[k]||0) + item.bonus[k]; });
      }
   });
   return eff;
}

/* Grit/Hoodoo (base + equipment) push max HP/MP above the level-derived
floor. Call this after anything that changes stats or equipment. */
function recomputeMaxStats(){
   const eff = getEffectiveStats();
   state.maxHp = state.baseMaxHp + statBonus(eff.grit)*3;
   state.maxMp = state.baseMaxMp + statBonus(eff.hoodoo)*2;
   state.hp = Math.min(state.hp, state.maxHp);
   state.mp = Math.min(state.mp, state.maxMp);
}

function spendStatPoint(stat){
   if(state.statPoints<=0 || !STAT_LABELS[stat]) return;
   state.stats[stat]++;
   state.statPoints--;
   recomputeMaxStats();
   clearLog();
   log(`You put your training to use. ${STAT_LABELS[stat]} increases!`);
   render();
}

function equipItem(idx){
   const item = state.inventory[idx];
   if(!item || item.type!=='equip') return;
   /* Both requirements are derived from the item's own bonus, never
   stored on it — see getGearRequirements() (item-tiers.js). statReq is
   checked against state.stats directly (raw allocated points), not
   getEffectiveStats() — gear you already have on shouldn't be able to
   bootstrap you into a requirement you haven't actually earned. */
   const req = getGearRequirements(item);
   if(state.level < req.levelReq){
      clearLog();
      log(`${item.name} requires level ${req.levelReq}. You're not there yet.`);
      render();
      return;
   }
   if(req.statKey && state.stats[req.statKey] < req.statReq){
      clearLog();
      log(`${item.name} requires ${req.statReq} base ${STAT_LABELS[req.statKey]}. Equipment bonuses don't count toward that.`);
      render();
      return;
   }
   const slot = item.slot;
   const prev = state.equipment[slot];
   state.equipment[slot] = item;
   state.inventory.splice(idx,1);
   if(prev) state.inventory.push(prev);
   recomputeMaxStats();
   clearLog();
   log(`You equip ${item.name}.`);
   render();
}

function unequipItem(slot){
   const item = state.equipment[slot];
   if(!item) return;
   state.equipment[slot] = null;
   state.inventory.push(item);
   recomputeMaxStats();
   clearLog();
   log(`You unequip ${item.name}.`);
   render();
}

/* Bounty Tokens' first real sink — see TEMPER_BASE_COST's own comment
(content.js) for the full reasoning. Equipped-only, deliberately: the
Pack's own inventory display groups stacked items purely by name
(groupInventoryByName(), render-shop.js), so two same-named drops with
different rolled stats can already share one visual stack — tempering
one specific copy there would make that ambiguity a real correctness
problem instead of just a cosmetic one. state.equipment[slot] is always
exactly one item, never grouped, so that's the only place this is
offered (renderEquipmentBlock(), render-character.js). */
function temperEquippedItem(slot){
   const item = state.equipment[slot];
   if(!item || item.type!=='equip' || !item.bonus || Object.keys(item.bonus).length===0) return;
   const level = item.temperLevel || 0;
   const cost = temperCost(level);
   if(state.bountyTokens < cost) return;
   /* Snapshot the PRE-temper primary value as a permanent level-requirement
   anchor the first time this item is ever tempered — same reasoning
   rollGearDropTier() already snapshots a zone drop's own unrolled value
   (levelReqBase, combat.js/item-tiers.js). Tempering is meant to make
   gear you already own and are already wearing stronger, not to
   retroactively lock you out of it. */
   if(item.levelReqBase === undefined){
      item.levelReqBase = item.bonus[Object.keys(item.bonus)[0]];
   }
   state.bountyTokens -= cost;
   item.temperLevel = level + 1;
   /* Multiplies the CURRENT value, not the original — each temper
   compounds on top of whatever the last one left behind (TEMPER_STAT_
   MULTIPLIER's own comment, content.js), rounded UP so even a bare +1
   stat still climbs every time (ceil(1*1.5) = 2). */
   Object.keys(item.bonus).forEach(stat => { item.bonus[stat] = Math.ceil(item.bonus[stat] * (1 + TEMPER_STAT_MULTIPLIER)); });
   recomputeMaxStats();
   clearLog();
   log(`You temper ${item.name}, now +${item.temperLevel} — every stat it grants rises ${Math.round(TEMPER_STAT_MULTIPLIER*100)}%. (-${cost} Bounty Tokens)`);
   render();
   autosave();
}
