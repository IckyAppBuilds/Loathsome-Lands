async function manualSaveGame(){
   acctMsg('acct', 'Saving...', false);
   try{
      await saveGame();
      acctMsg('acct', 'Saved!', false);
   }catch(e){
      acctMsg('acct', 'Save failed: ' + e.message, true);
   }
}

async function manualLoadGame(){
   acctMsg('acct', 'Loading...', false);
   try{
      const loaded = await loadGame();
      acctMsg('acct', loaded
              ? (lastOfflineBiscuitGain > 0 ? `Loaded! (+${lastOfflineBiscuitGain} Biscuit${lastOfflineBiscuitGain===1?'':'s'} earned while away)` : 'Loaded!')
              : 'No save found yet.', !loaded);
      render();
   }catch(e){
      acctMsg('acct', 'Load failed: ' + e.message, true);
   }
}

/* ---------------- Save / load (serialize/hydrate around the icon-function gotcha) ---------------- */
function allItemDefs(){
   const monsterLoot = monsters.map(m => m.loot).filter(Boolean);
   const commanderLoot = gnomeCommander.loot ? [gnomeCommander.loot] : [];
   /* Rare drops are per-monster (state.monster.rareDrop, content.js) rather
   than one shared rareDrops[] array — collect every monster's own rare
   item here so hydrateItem() can still look each one up by name after a
   save/reload, same as monsterLoot above. */
const monsterRareDrops = monsters.map(m => m.rareDrop).filter(Boolean);
   const potionIngredientItems = potionIngredients.map(p => p.item);
   /* veinIngredients (quest 5's gather items, content.js) were missing here
   — hydrateItem() below would silently drop them from inventory on
   save/reload since itemByName() couldn't find their def. Fixed as part
   of tagging quest items in the inventory UI. */
const veinIngredientItems = veinIngredients.map(v => v.item);
   /* shopGearItemsTier2 (content.js, unlocked once state.quest6Complete is
   true) isn't part of shopBuyItems — listed separately here, always
   (regardless of the current unlock state), so a held tier-2 piece still
   hydrates correctly after a reload. The new Gnometropolis monsters'
   loot/rareDrop items need no extra line of their own: they're already
   part of monsters[], so monsterLoot/monsterRareDrops above pick them up
   automatically. Same reasoning applies to the Shop-upgrade tiers
   (shopFoodItemsTier2/shopFoodItemsTier3/shopGearItemsTier3, content.js) —
   listed here unconditionally so a held piece still hydrates even if the
   Shop is later downgraded somehow, or a save is loaded on a fresh
   playthrough that hasn't reached that Shop level yet. */
return [...healItems, ...shopBuyItems, ...shopGearItemsTier2, ...shopFoodItemsTier2,
        ...shopFoodItemsTier3, ...shopGearItemsTier3, ...monsterLoot, ...commanderLoot,
        ...monsterRareDrops, ...Object.values(starterGear), ...potionIngredientItems,
        ...veinIngredientItems];
}
function itemByName(name){
   return allItemDefs().find(d => d.name === name) || null;
}
function serializeItem(item){ return item ? item.name : null; }
function hydrateItem(name){
   if(!name) return null;
   const def = itemByName(name);
   if(!def){ console.warn(`Save referenced unknown item "${name}" — dropped.`); return null; }
   return { ...def };
}

function serializeState(){
   /* quest4/quest5/class-quest fields (added after this list was first
   written) were missing here — saveGame() would silently drop that
   progress on every autosave, so reloading mid-Tinker-quest or after
   claiming a class title would revert it. Fixed alongside the similar
   allItemDefs() gap above. */
const { hp, maxHp, shield, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs, bountyTokens,
       lastRegenAt, level, xp, xpToLevel, stats, statPoints, location, homeTown,
       spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
       commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
       quest4Accepted, quest4RareDefeated, quest4Complete,
       quest5Accepted, quest5Complete,
       quest6Accepted, quest6RareDefeated, quest6Complete,
       classQuestAccepted, classQuestComplete, classTitle,
       classTrialGuildPassed, classTrialCasinoPassed, classTrialHoodooPassed, classSkillLevel,
       activeBounty, bountiesCompleted, bountiesClaimedToday, bountyDayKey, rareDropsSeen, allRaresBonusClaimed,
       lotTier, buildingUpgrades, statResetsBrewed } = state;
   return {
      hp, maxHp, shield, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs, bountyTokens,
      lastRegenAt, level, xp, xpToLevel, stats, statPoints, location, homeTown,
      spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
      commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
      quest4Accepted, quest4RareDefeated, quest4Complete,
      quest5Accepted, quest5Complete,
      quest6Accepted, quest6RareDefeated, quest6Complete,
      classQuestAccepted, classQuestComplete, classTitle,
      classTrialGuildPassed, classTrialCasinoPassed, classTrialHoodooPassed, classSkillLevel,
      activeBounty, bountiesCompleted, bountiesClaimedToday, bountyDayKey, rareDropsSeen, allRaresBonusClaimed,
      lotTier, buildingUpgrades, statResetsBrewed,
      equipment: Object.fromEntries(
         SLOT_ORDER.map(slot => [slot, serializeItem(state.equipment[slot])])
         ),
      inventory: state.inventory.map(serializeItem),
   };
}

function hydrateState(saved){
   Object.assign(state, saved);
   state.spellsKnown = Array.isArray(saved.spellsKnown) ? saved.spellsKnown.filter(id => spells.some(s=>s.id===id)) : [];
   state.equipment = {};
   SLOT_ORDER.forEach(slot => { state.equipment[slot] = hydrateItem(saved.equipment && saved.equipment[slot]); });
   state.inventory = (saved.inventory || []).map(hydrateItem).filter(Boolean);
   state.inCombat = false; state.monster = null;
   state.showVictory = false; state.victoryMonster = null;
   combatSubView = 'main';
   /* Never resume inside a shop interior, an adventure zone, or mid-combat —
   always land back in a town square. Older saves (or a corrupted/unknown
   value) have no valid homeTown, so fall back to Gladstone Hollow ('town').
   Once a second town exists (added to TOWN_HUBS in game.js), this already
   sends a returning player back to whichever town they were actually in,
   not always the original one. */
state.homeTown = TOWN_HUBS.includes(saved.homeTown) ? saved.homeTown : 'town';
   state.location = state.homeTown;
   /* Bounty board + rare-drop collection log — added after this function was
   first written, so give older saves that predate these fields sane
   fallbacks rather than leaving them undefined. */
state.activeBounty = saved.activeBounty || null;
   state.bountiesCompleted = typeof saved.bountiesCompleted === 'number' ? saved.bountiesCompleted : 0;
   state.bountiesClaimedToday = typeof saved.bountiesClaimedToday === 'number' ? saved.bountiesClaimedToday : 0;
   state.bountyDayKey = typeof saved.bountyDayKey === 'string' ? saved.bountyDayKey : null;
   state.bountyTokens = typeof saved.bountyTokens === 'number' ? saved.bountyTokens : 0;
   state.rareDropsSeen = Array.isArray(saved.rareDropsSeen) ? saved.rareDropsSeen : [];
   state.allRaresBonusClaimed = !!saved.allRaresBonusClaimed;
   /* Town Lot — added after this function was first written, same reasoning
   as the bounty board/rare-drop fallbacks just above: give older saves that
   predate these fields sane defaults rather than leaving them undefined. */
   state.lotTier = (typeof saved.lotTier === 'number' && saved.lotTier >= 0) ? saved.lotTier : 0;
   state.buildingUpgrades = (saved.buildingUpgrades && typeof saved.buildingUpgrades === 'object') ? saved.buildingUpgrades : {};
   /* Stat-reset potion purchase counter — added after this function was
   first written, same fallback reasoning as lotTier/buildingUpgrades. */
   state.statResetsBrewed = typeof saved.statResetsBrewed === 'number' ? saved.statResetsBrewed : 0;
   recomputeMaxStats();
}

async function saveGame(){
   if(!sb) throw new Error('Accounts are unavailable — the login service failed to load.');
   const { data: { user } } = await sb.auth.getUser();
   if(!user) throw new Error('Not signed in.');
   const { error } = await sb.from('saves').upsert({ user_id: user.id, state: serializeState() });
   if(error) throw error;
}
async function loadGame(){
   if(!sb) return false;
   const { data: { user } } = await sb.auth.getUser();
   if(!user) return false;
   const { data, error } = await sb.from('saves').select('state').eq('user_id', user.id).maybeSingle();
   if(error) throw error;
   if(data && data.state){
      hydrateState(data.state);
      /* Biscuits regenerate off real elapsed time (see regenBiscuits() near
      the bottom of this file), keyed off the lastRegenAt we just hydrated
      from the save — so time spent away already counts. Fast-forward it
      here (rather than waiting for the next 1s display tick) so the gain
      is ready immediately for the "while you were away" message below. */
   const before = state.adventures;
      regenBiscuits();
      lastOfflineBiscuitGain = state.adventures - before;
      render();
      return true;
   }
   return false;
}

/* Autosave after every state-changing action — called from the bottom of
render(), so anything that updates the screen also (debounced) persists
the game. Debounced by AUTOSAVE_DEBOUNCE_MS rather than firing on every
single render(): a burst of actions (mashing Attack, spending several
stat points) collapses into one save shortly after things settle down,
instead of one Supabase write per click. Fire-and-forget — a failed
autosave logs to the console rather than interrupting play. The manual
Save button in the Account drawer still works too, for a "save right
now, don't wait" option, but nothing requires clicking it anymore. */
const AUTOSAVE_DEBOUNCE_MS = 1200;
let autosaveTimer = null;
function autosave(){
   if(!acctSession) return;
   if(autosaveTimer) clearTimeout(autosaveTimer);
   autosaveTimer = setTimeout(() => {
      autosaveTimer = null;
      saveGame().catch(e => console.warn('Autosave failed:', e.message));
   }, AUTOSAVE_DEBOUNCE_MS);
}
