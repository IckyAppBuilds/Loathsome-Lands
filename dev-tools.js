/* ---------------- Dev account & testing tools ---------------- */
/* Usernames in this list get the full dev-tools panel in the Account
drawer (direct-value setters, quest-stage jumper, reset buttons), for
testing content from any game state without having to grind there
legitimately. Not a security boundary — just a testing convenience
gated behind a specific account. Does NOT auto-enable devMode/unlimited
Biscuits on its own anymore (that used to happen on every sign-in —
removed since it left the account permanently stuck on infinite
Biscuits with no way to turn it off in-game); use the panel's Biscuits
setter, or ?dev=1 in the URL, if unlimited Biscuits are wanted for a
session. Compared case-insensitively since Supabase usernames aren't
normalized on registration. */
const DEV_USERNAMES = ['ickyadmin'];
function isDevAccount(){
   return !!acctUsername && DEV_USERNAMES.includes(acctUsername.toLowerCase());
}

/* Resets level/stats/HP/MP back to a fresh level 1, independent of quest
progress — lets a dev account re-test leveling, stat spending, and the
level-10 class quest gate without touching quest flags. Also clears the
class quest itself since it's gated on level>=10 and would otherwise be
left in a stale "already claimed" state after a level reset. */
function resetLevelDev(){
   if(!isDevAccount()) return;
   if(!confirm('Reset level, XP, stats and the class quest back to a fresh level 1? Quest progress is untouched.')) return;
   state.level = 1; state.xp = 0; state.xpToLevel = 40;
   state.stats = { beef:0, zip:0, grit:0, hoodoo:0 };
   state.statPoints = 0;
   state.baseMaxHp = 30; state.baseMaxMp = 10;
   state.classQuestAccepted = false; state.classQuestComplete = false; state.classTitle = null;
   recomputeMaxStats();
   state.hp = state.maxHp; state.mp = state.maxMp;
   clearLog();
   log('[Dev] Level, stats, and the class quest have been reset.');
   render();
   autosave();
}

/* The nuclear option, for testing the new-player experience without
logging into a separate account: wipes every field back to
createDefaultState()'s defaults (core.js) — level, stats, quests, Town
Lot/building upgrades, class, inventory/equipment, currencies, all of it
— then replays startFreshGame() (game.js) exactly as a real brand-new
character would get it (starter gear, one heal item, the arrival log
line, and the tutorial). Stays signed into the same dev account; only
the character's save data resets. */
function resetToNewGameDev(){
   if(!isDevAccount()) return;
   if(!confirm('Full reset — level, stats, quests, inventory, equipment, currencies, Town Lot, class, everything — back to a brand new character? This cannot be undone.')) return;
   Object.assign(state, createDefaultState());
   startFreshGame();
   log('[Dev] Full reset — starting over as a brand new character.');
   autosave();
}

/* Resets every quest flag (and the zone unlocks that ride on them) back to
never-started, so a dev account can replay quest 1 through the class
quest from scratch. Also strips any quest items already held — they'd
otherwise be stuck in the Pack, no longer tied to an active quest and
not yet sellable (selling a quest item requires its quest to be
complete — see isQuestItemSellable() in game.js). Leaves level/stats/
Pop Tabs/inventory-otherwise alone; pair with Reset Level for a fully
fresh run. */
function resetQuestsDev(){
   if(!isDevAccount()) return;
   if(!confirm('Reset all quest progress (including zone unlocks) back to never-started? Quest items in your Pack will be cleared. Level/stats are untouched.')) return;
   Object.assign(state, {
      questTinesGiven: 0, questAccepted: false, questComplete: false,
      quest2Accepted: false, commanderDefeated: false, quest2Complete: false,
      quest3Accepted: false, quest3Complete: false,
      quest4Accepted: false, quest4RareDefeated: false, quest4Complete: false,
      quest5Accepted: false, quest5Complete: false,
      quest6Accepted: false, quest6RareDefeated: false, quest6Complete: false,
      classQuestAccepted: false, classQuestComplete: false, classTitle: null,
   });
   state.inventory = state.inventory.filter(it => it.type !== 'quest');
   state.location = 'town';
   recomputeMaxStats();
   clearLog();
   log('[Dev] All quest progress and zone unlocks have been reset.');
   render();
   autosave();
}

/* ---------------- Dev tools: direct state setters ---------------- */
/* Companions to resetLevelDev()/resetQuestsDev() above — instead of wiping
back to a known-good baseline, these let a dev account punch in an exact
value (Biscuits, Pop Tabs, level, stats, items) or jump straight to a
named quest stage, so any character/quest state can be reached in one or
two clicks rather than by grinding or chaining resets. All gated behind
isDevAccount() same as the reset tools, and equally not a security
boundary. */

/* Replays checkLevelUp()'s *1.5-then-floor progression from the level-1
baseline (40) so a dev-set level gets the same xpToLevel a real climb to
that level would have produced. */
function xpToLevelForLevel(lvl){
   let x = 40;
   for(let i=1; i<lvl; i++) x = Math.floor(x*1.5);
   return x;
}

function readDevInt(id, min){
   const el = document.getElementById(id);
   const n = parseInt(el && el.value, 10);
   return Math.max(min, Number.isFinite(n) ? n : min);
}

function setLevelDev(){
   if(!isDevAccount()) return;
   const lvl = Math.min(999, readDevInt('dev-level-input', 1));
   state.level = lvl;
   state.xp = 0;
   state.xpToLevel = xpToLevelForLevel(lvl);
   state.baseMaxHp = 30 + (lvl-1)*6;
   state.baseMaxMp = 10 + (lvl-1)*2;
   recomputeMaxStats();
   state.hp = state.maxHp; state.mp = state.maxMp;
   clearLog();
   log(`[Dev] Level set to ${lvl}.`);
   render();
   autosave();
}

function setBiscuitsDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-biscuits-input', 0);
   state.adventures = val;
   clearLog();
   log(`[Dev] Biscuits set to ${val}.`);
   render();
   autosave();
}

function setPopTabsDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-poptabs-input', 0);
   state.popTabs = val;
   clearLog();
   log(`[Dev] Pop Tabs set to ${val}.`);
   render();
   autosave();
}

function setBountyTokensDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-bountytokens-input', 0);
   state.bountyTokens = val;
   clearLog();
   log(`[Dev] Bounty Tokens set to ${val}.`);
   render();
   autosave();
}

function setLotTierDev(){
   if(!isDevAccount()) return;
   const val = Math.max(0, Math.min(LOT_TIER_MAX, readDevInt('dev-lottier-input', 0)));
   state.lotTier = val;
   clearLog();
   log(`[Dev] Lot Tier set to ${val} (${LOT_TIER_NAMES[val]}).`);
   render();
   autosave();
}

function maxBuildingUpgradesDev(){
   if(!isDevAccount()) return;
   BUILDING_UPGRADES.forEach(b => { state.buildingUpgrades[b.key] = BUILDING_UPGRADE_MAX; });
   clearLog();
   log('[Dev] All building upgrade levels maxed.');
   render();
   autosave();
}

function setStatsDev(){
   if(!isDevAccount()) return;
   state.stats = {
      beef: readDevInt('dev-beef-input', 0),
      zip: readDevInt('dev-zip-input', 0),
      grit: readDevInt('dev-grit-input', 0),
      hoodoo: readDevInt('dev-hoodoo-input', 0),
   };
   state.statPoints = readDevInt('dev-statpoints-input', 0);
   recomputeMaxStats();
   clearLog();
   log('[Dev] Stats set directly.');
   render();
   autosave();
}

/* Deduped, name-sorted list of every item definition in the game, for the
"Give Item" dropdown. allItemDefs() has genuine duplicates (e.g. "a
slightly bruised apple" is both a free monster-adjacent heal item and a
shop purchase) — dedupe by name so it isn't listed twice. Called fresh
each time rather than cached since it's cheap and content.js's arrays
never change at runtime. */
function devItemList(){
   const seen = new Set();
   const out = [];
   allItemDefs().forEach(def=>{
      if(seen.has(def.name)) return;
      seen.add(def.name);
      out.push(def);
   });
   out.sort((a,b) => a.name.localeCompare(b.name));
   return out;
}

function giveItemDev(){
   if(!isDevAccount()) return;
   const list = devItemList();
   const def = list[readDevInt('dev-item-select', 0)];
   if(!def) return;
   const qty = Math.min(99, readDevInt('dev-item-qty', 1));
   for(let i=0; i<qty; i++) state.inventory.push({ ...def });
   clearLog();
   log(`[Dev] Added ${qty} × ${def.name} to your Pack.`);
   render();
   autosave();
}

function clearInventoryDev(){
   if(!isDevAccount()) return;
   if(!confirm('Clear your entire Pack (equipped gear is untouched)? This cannot be undone.')) return;
   state.inventory = [];
   clearLog();
   log('[Dev] Pack cleared.');
   render();
   autosave();
}

/* Named, discrete stages for each quest chain — jumping to one sets every
flag (and any held quest items) that stage implies, so the state stays
internally consistent rather than letting individual flags drift out of
sync with each other or with the Pack. detect() looks at the live state
to figure out which stage is "current", purely so the dropdown opens on
the right option; it isn't used by apply(). */
const QUEST_DEV_STAGES = [
   { id:'quest1', label:"Gaffer's Rake Tines", stages: [
      { label:'Not started', apply(){ Object.assign(state, { questAccepted:false, questTinesGiven:0, questComplete:false }); } },
      { label:'Accepted (0/3 tines)', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:0, questComplete:false }); } },
      { label:'Accepted (3/3 tines, ready to turn in)', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:QUEST_TINES_NEEDED, questComplete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:QUEST_TINES_NEEDED, questComplete:true }); } },
      ], detect(){ if(state.questComplete) return 3; if(state.questAccepted && state.questTinesGiven>=QUEST_TINES_NEEDED) return 2; if(state.questAccepted) return 1; return 0; } },

   { id:'quest2', label:'Guild: The Gnome Commander', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest2Accepted:false, commanderDefeated:false, quest2Complete:false }); } },
      { label:'Accepted (commander not yet found)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:false, quest2Complete:false }); } },
      { label:'Commander defeated (ready to turn in)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:true, quest2Complete:false }); } },
      { label:'Complete (unlocks Dank Sewers)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:true, quest2Complete:true }); } },
      ], detect(){ if(state.quest2Complete) return 3; if(state.quest2Accepted && state.commanderDefeated) return 2; if(state.quest2Accepted) return 1; return 0; } },

   { id:'quest3', label:'Hoodoo Doctor: A Proper Potion', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest3Accepted:false, quest3Complete:false }); state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); } },
      { label:'Accepted (0/4 ingredients)', apply(){ Object.assign(state, { quest3Accepted:true, quest3Complete:false }); state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); } },
      { label:'Accepted (4/4 ingredients, ready to turn in)', apply(){ state.quest3Accepted = true; state.quest3Complete = false; potionIngredients.forEach(p => { if(!state.inventory.some(it => it.key===p.item.key)) state.inventory.push({ ...p.item }); }); } },
      { label:'Complete (learns Bottled Fury)', apply(){ state.quest3Accepted = true; state.quest3Complete = true; state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); if(!state.spellsKnown.includes('bottledfury')) state.spellsKnown.push('bottledfury'); } },
      ], detect(){ if(state.quest3Complete) return 3; if(state.quest3Accepted && countPotionIngredientsHeld()>=potionIngredients.length) return 2; if(state.quest3Accepted) return 1; return 0; } },

   { id:'quest4', label:'Tinker: Gears in the Dark', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest4Accepted:false, quest4RareDefeated:false, quest4Complete:false }); } },
      { label:'Accepted (digger-bot not yet found)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:false, quest4Complete:false }); } },
      { label:'Digger-bot defeated (ready to turn in)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:true, quest4Complete:false }); } },
      { label:'Complete (unlocks Clockwork Quarry)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:true, quest4Complete:true }); } },
      ], detect(){ if(state.quest4Complete) return 3; if(state.quest4Accepted && state.quest4RareDefeated) return 2; if(state.quest4Accepted) return 1; return 0; } },

   { id:'quest5', label:'Tinker: The Last Vein', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest5Accepted:false, quest5Complete:false }); state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      { label:'Accepted (0 gathered)', apply(){ Object.assign(state, { quest5Accepted:true, quest5Complete:false }); state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      { label:'Accepted (all gathered, ready to turn in)', apply(){ state.quest5Accepted = true; state.quest5Complete = false; veinIngredients.forEach(v => { const held = state.inventory.filter(it => it.key===v.item.key).length; for(let n=held; n<VEIN_ITEM_COUNT_NEEDED; n++) state.inventory.push({ ...v.item }); }); } },
      { label:'Complete (unlocks Sunless Vault)', apply(){ state.quest5Accepted = true; state.quest5Complete = true; state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      ], detect(){ if(state.quest5Complete) return 3; if(state.quest5Accepted && countVeinIngredientsHeld()>=veinIngredients.length*VEIN_ITEM_COUNT_NEEDED) return 2; if(state.quest5Accepted) return 1; return 0; } },

   { id:'quest6', label:"Guild: The Gnome King's Throne", stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest6Accepted:false, quest6RareDefeated:false, quest6Complete:false }); } },
      { label:'Accepted (Gnome King not yet found)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:false, quest6Complete:false }); } },
      { label:'Gnome King defeated (ready to turn in)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:true, quest6Complete:false }); } },
      { label:'Complete (unlocks Gnometropolis)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:true, quest6Complete:true }); } },
      ], detect(){ if(state.quest6Complete) return 3; if(state.quest6Accepted && state.quest6RareDefeated) return 2; if(state.quest6Accepted) return 1; return 0; } },

   /* Requires a claimed classTitle in real play (acceptQuest7(), guild.js)
   — this dev jump bypasses that gate like every other stage here does,
   so it's usable even before the 'classquest' stage below is set. Three
   district guardians (garrisonGuardianDefeated/roguesDenEnforcerDefeated/
   arcaneSanctumGuardianDefeated, core.js) gate the real Gnome King fight
   (quest7RareDefeated) the same way quest4/quest5/quest6's single rare
   spawn gates their own turn-in, just three of them instead of one. */
   { id:'quest7', label:"Guild: The Gnome King's Court (Act 1 finale)", stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest7Accepted:false, garrisonGuardianDefeated:false, roguesDenEnforcerDefeated:false, arcaneSanctumGuardianDefeated:false, quest7RareDefeated:false, quest7Complete:false }); } },
      { label:'Accepted (no district guardians defeated yet)', apply(){ Object.assign(state, { quest7Accepted:true, garrisonGuardianDefeated:false, roguesDenEnforcerDefeated:false, arcaneSanctumGuardianDefeated:false, quest7RareDefeated:false, quest7Complete:false }); } },
      { label:'All 3 district guardians defeated (palace gear in hand)', apply(){ Object.assign(state, { quest7Accepted:true, garrisonGuardianDefeated:true, roguesDenEnforcerDefeated:true, arcaneSanctumGuardianDefeated:true, quest7RareDefeated:false, quest7Complete:false }); } },
      { label:'Gnome King defeated (ready to turn in)', apply(){ Object.assign(state, { quest7Accepted:true, garrisonGuardianDefeated:true, roguesDenEnforcerDefeated:true, arcaneSanctumGuardianDefeated:true, quest7RareDefeated:true, quest7Complete:false }); } },
      { label:'Complete (Act One done)', apply(){ Object.assign(state, { quest7Accepted:true, garrisonGuardianDefeated:true, roguesDenEnforcerDefeated:true, arcaneSanctumGuardianDefeated:true, quest7RareDefeated:true, quest7Complete:true }); } },
      ], detect(){
         if(state.quest7Complete) return 4;
         if(state.quest7RareDefeated) return 3;
         if(state.quest7Accepted && state.garrisonGuardianDefeated && state.roguesDenEnforcerDefeated && state.arcaneSanctumGuardianDefeated) return 2;
         if(state.quest7Accepted) return 1;
         return 0;
      } },

   { id:'classquest', label:"Guild: The Adventurer's Trial (class)", stages: [
      { label:'Not accepted', apply(){ Object.assign(state, { classQuestAccepted:false, classQuestComplete:false, classTitle:null,
         classTrialGuildPassed:false, classTrialCasinoPassed:false, classTrialHoodooPassed:false }); } },
      { label:'Accepted (no trainers passed yet)', apply(){ Object.assign(state, { classQuestAccepted:true, classQuestComplete:false, classTitle:null,
         classTrialGuildPassed:false, classTrialCasinoPassed:false, classTrialHoodooPassed:false }); } },
      { label:'Guild trial passed (Trial Champion beaten)', apply(){ Object.assign(state, { classQuestAccepted:true, classQuestComplete:false,
         classTrialGuildPassed:true, classTrialCasinoPassed:false, classTrialHoodooPassed:false }); } },
      { label:'All 3 trainers passed (ready to choose)', apply(){ Object.assign(state, { classQuestAccepted:true, classQuestComplete:false,
         classTrialGuildPassed:true, classTrialCasinoPassed:true, classTrialHoodooPassed:true }); } },
      { label:'Complete as Meathead', apply(){
         Object.assign(state, { classQuestAccepted:true, classTrialGuildPassed:true, classTrialCasinoPassed:true, classTrialHoodooPassed:true });
         if(!state.classQuestComplete) state.stats.beef += 2;
         state.classTitle = CLASS_TITLES.beef;
         state.classQuestComplete = true;
      } },
      { label:'Complete as Card Shark', apply(){
         Object.assign(state, { classQuestAccepted:true, classTrialGuildPassed:true, classTrialCasinoPassed:true, classTrialHoodooPassed:true });
         if(!state.classQuestComplete) state.stats.zip += 2;
         state.classTitle = CLASS_TITLES.zip;
         state.classQuestComplete = true;
      } },
      { label:'Complete as Hexpert', apply(){
         Object.assign(state, { classQuestAccepted:true, classTrialGuildPassed:true, classTrialCasinoPassed:true, classTrialHoodooPassed:true });
         if(!state.classQuestComplete) state.stats.hoodoo += 2;
         state.classTitle = CLASS_TITLES.hoodoo;
         state.classQuestComplete = true;
      } },
      ], detect(){
         if(state.classQuestComplete) return 4;
         if(state.classTrialGuildPassed && state.classTrialCasinoPassed && state.classTrialHoodooPassed) return 3;
         if(state.classTrialGuildPassed) return 2;
         if(state.classQuestAccepted) return 1;
         return 0;
      } },
   ];

function setQuestStageDev(id){
   if(!isDevAccount()) return;
   const cfg = QUEST_DEV_STAGES.find(q => q.id === id);
   if(!cfg) return;
   const idx = readDevInt(`dev-quest-${id}`, 0);
   const stage = cfg.stages[idx];
   if(!stage) return;
   stage.apply();
   recomputeMaxStats();
   clearLog();
   log(`[Dev] ${cfg.label} → ${stage.label}`);
   render();
   autosave();
}
