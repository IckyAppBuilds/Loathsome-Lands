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
never-started, so a dev account can replay quest 1 through the Mole
Wars finale from scratch. Also strips any quest items already held —
they'd otherwise be stuck in the Pack, no longer tied to an active
quest and not yet sellable (selling a quest item requires its quest to
be complete — see isQuestItemSellable() in game.js). Leaves level/stats/
Pop Tabs/inventory-otherwise alone; pair with Reset Level for a fully
fresh run. Quest7-15 (all of Act 2, plus Act 1's own finale) were
missing from this reset entirely until now — a dev account "resetting
all quests" was actually only resetting quest1-6, silently leaving
Act 2's whole chain (and its rare-hunt/gauntlet-defeated flags) intact. */
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
      quest7Accepted: false, garrisonGuardianDefeated: false, roguesDenEnforcerDefeated: false, arcaneSanctumGuardianDefeated: false,
      quest7RareDefeated: false, quest7Complete: false,
      quest8Accepted: false, quest8Complete: false,
      quest9Accepted: false, quest9Complete: false, tunnelWardenDefeated: false, warrenScoutDefeated: false,
      quest10Accepted: false, quest10Complete: false, quest10Path: null, tunnelMoleInformantDefeated: false, seniorClerkDefeated: false,
      quest11Accepted: false, quest11Complete: false,
      quest12Accepted: false, quest12Complete: false, gearworksForemanDefeated: false, bureauQuartermasterDefeated: false,
      quest13Accepted: false, quest13Complete: false, quenchMasterDefeated: false,
      quest14Accepted: false, quest14Complete: false, vaultKeeperDefeated: false,
      quest15Accepted: false, quest15Complete: false, warrenMotherDefeated: false,
      quest16Accepted: false, quest16Complete: false, drillRigSalvaged: false,
      quest17Accepted: false, quest17Complete: false,
      quest18Accepted: false, quest18Complete: false, quest19Accepted: false, quest19Complete: false,
      classQuestAccepted: false, classQuestComplete: false, classTitle: null,
   });
   state.inventory = state.inventory.filter(it => it.type !== 'quest');
   state.location = 'town';
   resetAllGauntlets();
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

/* state.playerStatusEffect (core.js) had no dev-panel support at all —
the only way to see burn/poison/freeze in action was to actually get
hit by one of the handful of bosses that inflict it (gearworksForeman/
bureauQuartermaster/quenchMaster/foundryMarshal/warrenMother). Applies
it directly, same shape useMonsterSkill()'s own 'debuff' branch
(combat.js) builds, using representative numbers for each type rather
than requiring a specific boss's own exact values. Mid-fight or not —
it plays out on your next turn-costing action either way, same as a
real one would. */
const DEV_STATUS_EFFECTS = {
   burn: { type:'burn', turnsLeft:3, dmgPerTurn:7 },
   poison: { type:'poison', turnsLeft:4, dmgPerTurn:5 },
   freeze: { type:'freeze', turnsLeft:3, dmgReduction:0.35 },
};
function applyStatusEffectDev(){
   if(!isDevAccount()) return;
   const key = document.getElementById('dev-status-select').value;
   if(key === 'none'){ state.playerStatusEffect = null; }
   else { state.playerStatusEffect = { ...DEV_STATUS_EFFECTS[key] }; }
   clearLog();
   log(key === 'none' ? '[Dev] Status effect cleared.' : `[Dev] Applied ${key} (${JSON.stringify(state.playerStatusEffect)}).`);
   render();
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

   /* Act 2 (quest8-quest15) were entirely missing from this list until
   now — every one of them was reachable only by actually playing
   through Mudroot Warren/the Warren's Ear/the Ember Warren, with no dev
   shortcut at all. Same "each stage sets every flag that stage implies"
   rule as quest1-7 above. */
   { id:'quest8', label:'Gnome Guild: New Digs', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest8Accepted:false, quest8Complete:false }); } },
      { label:'Accepted (ready to turn in — no combat objective)', apply(){ Object.assign(state, { quest8Accepted:true, quest8Complete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { quest8Accepted:true, quest8Complete:true }); } },
      ], detect(){ if(state.quest8Complete) return 2; if(state.quest8Accepted) return 1; return 0; } },

   { id:'quest9', label:'Gnome Guild: What the Throne Room Opened', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest9Accepted:false, tunnelWardenDefeated:false, warrenScoutDefeated:false, quest9Complete:false }); } },
      { label:'Accepted (stage 1 — tunnel warden not yet found)', apply(){ Object.assign(state, { quest9Accepted:true, tunnelWardenDefeated:false, warrenScoutDefeated:false, quest9Complete:false }); } },
      { label:'Stage 2 (tunnel warden defeated, hunting the scout)', apply(){ Object.assign(state, { quest9Accepted:true, tunnelWardenDefeated:true, warrenScoutDefeated:false, quest9Complete:false }); } },
      { label:'Both defeated (ready to turn in)', apply(){ Object.assign(state, { quest9Accepted:true, tunnelWardenDefeated:true, warrenScoutDefeated:true, quest9Complete:false }); } },
      { label:'Complete (unlocks Mudroot Warren exploration)', apply(){ Object.assign(state, { quest9Accepted:true, tunnelWardenDefeated:true, warrenScoutDefeated:true, quest9Complete:true }); } },
      ], detect(){
         if(state.quest9Complete) return 4;
         if(state.tunnelWardenDefeated && state.warrenScoutDefeated) return 3;
         if(state.tunnelWardenDefeated) return 2;
         if(state.quest9Accepted) return 1;
         return 0;
      } },

   { id:'quest10', label:"Gnome Guild: Whatever's Listening", stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest10Accepted:false, quest10Path:null, tunnelMoleInformantDefeated:false, seniorClerkDefeated:false, quest10Complete:false }); } },
      { label:'Accepted (neither rare hunt found yet)', apply(){ Object.assign(state, { quest10Accepted:true, quest10Path:null, tunnelMoleInformantDefeated:false, seniorClerkDefeated:false, quest10Complete:false }); } },
      { label:'Path: informant found (Choir revealed, ready to turn in)', apply(){ Object.assign(state, { quest10Accepted:true, quest10Path:'informant', tunnelMoleInformantDefeated:true, seniorClerkDefeated:false, quest10Complete:false }); } },
      { label:'Path: ledger found (Ledger Vault revealed, ready to turn in)', apply(){ Object.assign(state, { quest10Accepted:true, quest10Path:'ledger', tunnelMoleInformantDefeated:false, seniorClerkDefeated:true, quest10Complete:false }); } },
      { label:'Complete', apply(){ if(!state.quest10Path) state.quest10Path = 'informant'; if(!state.tunnelMoleInformantDefeated && !state.seniorClerkDefeated) state.tunnelMoleInformantDefeated = true; Object.assign(state, { quest10Accepted:true, quest10Complete:true }); } },
      ], detect(){
         if(state.quest10Complete) return 4;
         if(state.quest10Path === 'ledger') return 3;
         if(state.quest10Path === 'informant') return 2;
         if(state.quest10Accepted) return 1;
         return 0;
      } },

   { id:'quest11', label:'Gnome Guild: Loose Ends', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest11Accepted:false, quest11Complete:false }); } },
      { label:'Accepted (0/2 hunts accounted for)', apply(){ Object.assign(state, { quest11Accepted:true, tunnelMoleInformantDefeated:false, seniorClerkDefeated:false, quest11Complete:false }); } },
      { label:'Accepted (1/2 — informant defeated, clerk still out)', apply(){ Object.assign(state, { quest11Accepted:true, tunnelMoleInformantDefeated:true, seniorClerkDefeated:false, quest11Complete:false }); } },
      { label:'Both accounted for (ready to turn in)', apply(){ Object.assign(state, { quest11Accepted:true, tunnelMoleInformantDefeated:true, seniorClerkDefeated:true, quest11Complete:false }); } },
      { label:'Complete (unlocks the Ember Warren)', apply(){ Object.assign(state, { quest11Accepted:true, tunnelMoleInformantDefeated:true, seniorClerkDefeated:true, quest11Complete:true }); } },
      ], detect(){
         if(state.quest11Complete) return 4;
         if(state.tunnelMoleInformantDefeated && state.seniorClerkDefeated) return 3;
         if(state.quest11Accepted) return 1;
         return 0;
      } },

   { id:'quest12', label:'Gnome Guild: Chain of Custody', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest12Accepted:false, gearworksForemanDefeated:false, bureauQuartermasterDefeated:false, quest12Complete:false }); } },
      { label:'Accepted (stage 1 — foreman not yet found)', apply(){ Object.assign(state, { quest12Accepted:true, gearworksForemanDefeated:false, bureauQuartermasterDefeated:false, quest12Complete:false }); } },
      { label:'Stage 2 (foreman defeated, hunting the quartermaster)', apply(){ Object.assign(state, { quest12Accepted:true, gearworksForemanDefeated:true, bureauQuartermasterDefeated:false, quest12Complete:false }); } },
      { label:'Both defeated (ready to turn in)', apply(){ Object.assign(state, { quest12Accepted:true, gearworksForemanDefeated:true, bureauQuartermasterDefeated:true, quest12Complete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { quest12Accepted:true, gearworksForemanDefeated:true, bureauQuartermasterDefeated:true, quest12Complete:true }); } },
      ], detect(){
         if(state.quest12Complete) return 4;
         if(state.bureauQuartermasterDefeated) return 3;
         if(state.gearworksForemanDefeated) return 2;
         if(state.quest12Accepted) return 1;
         return 0;
      } },

   { id:'quest13', label:'Gnome Guild: Quenched', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest13Accepted:false, quenchMasterDefeated:false, quest13Complete:false }); } },
      { label:'Accepted (quench-master not yet found)', apply(){ Object.assign(state, { quest13Accepted:true, quenchMasterDefeated:false, quest13Complete:false }); } },
      { label:'Quench-master defeated (ready to turn in)', apply(){ Object.assign(state, { quest13Accepted:true, quenchMasterDefeated:true, quest13Complete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { quest13Accepted:true, quenchMasterDefeated:true, quest13Complete:true }); } },
      ], detect(){ if(state.quest13Complete) return 3; if(state.quenchMasterDefeated) return 2; if(state.quest13Accepted) return 1; return 0; } },

   { id:'quest14', label:'Gnome Guild: What the Vault Was Guarding', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest14Accepted:false, vaultKeeperDefeated:false, quest14Complete:false }); } },
      { label:'Accepted (Ledger Committee gauntlet not yet cleared)', apply(){ Object.assign(state, { quest14Accepted:true, vaultKeeperDefeated:false, quest14Complete:false }); } },
      { label:'Vault keeper defeated (ready to turn in)', apply(){ Object.assign(state, { quest14Accepted:true, vaultKeeperDefeated:true, quest14Complete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { quest14Accepted:true, vaultKeeperDefeated:true, quest14Complete:true }); } },
      ], detect(){ if(state.quest14Complete) return 3; if(state.vaultKeeperDefeated) return 2; if(state.quest14Accepted) return 1; return 0; } },

   { id:'quest15', label:'Gnome Guild: The Warren Answers (Mole Wars finale)', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest15Accepted:false, warrenMotherDefeated:false, quest15Complete:false }); } },
      { label:'Accepted (Mole Council gauntlet not yet cleared)', apply(){ Object.assign(state, { quest15Accepted:true, warrenMotherDefeated:false, quest15Complete:false }); } },
      { label:'Warren-mother defeated (ready to turn in)', apply(){ Object.assign(state, { quest15Accepted:true, warrenMotherDefeated:true, quest15Complete:false }); } },
      { label:'Complete (Mole Wars arc finished)', apply(){ Object.assign(state, { quest15Accepted:true, warrenMotherDefeated:true, quest15Complete:true }); } },
      ], detect(){ if(state.quest15Complete) return 3; if(state.warrenMotherDefeated) return 2; if(state.quest15Accepted) return 1; return 0; } },

   /* Quest 16's own 3 parts are gathered 3 different ways (a guaranteed
   drop, a salvaged boss re-fight, a straight purchase) — its dev
   stages push/strip the actual inventory items directly, same "each
   stage sets every flag/item it implies" rule as every other stage
   here, so jumping straight to "ready to turn in" doesn't leave the
   Pack out of sync with what the quest thinks is held. */
   { id:'quest16', label:'Gnome Guild: Breaking Through (Act 2 capstone)', stages: [
      { label:'Not started', apply(){
         Object.assign(state, { quest16Accepted:false, drillRigSalvaged:false, quest16Complete:false });
         state.inventory = state.inventory.filter(it => !['drillPlating','drillRig','driveShaft'].includes(it.key));
      } },
      { label:'Accepted (0/3 parts)', apply(){
         Object.assign(state, { quest16Accepted:true, drillRigSalvaged:false, quest16Complete:false });
         state.inventory = state.inventory.filter(it => !['drillPlating','drillRig','driveShaft'].includes(it.key));
      } },
      { label:'All 3 parts held (ready to turn in)', apply(){
         Object.assign(state, { quest16Accepted:true, drillRigSalvaged:true, quest16Complete:false });
         state.inventory = state.inventory.filter(it => !['drillPlating','drillRig','driveShaft'].includes(it.key));
         for(let n=0; n<DRILLDOZER_PLATING_NEEDED; n++) state.inventory.push({ ...drilldozerIngredients[0].item });
         state.inventory.push({ ...drillRigItem }, { ...driveShaftItem });
      } },
      { label:'Complete (Crystal City open)', apply(){
         Object.assign(state, { quest16Accepted:true, drillRigSalvaged:true, quest16Complete:true });
         state.inventory = state.inventory.filter(it => !['drillPlating','drillRig','driveShaft'].includes(it.key));
      } },
      ], detect(){
         if(state.quest16Complete) return 3;
         if(state.quest16Accepted && heldAllDrilldozerParts()) return 2;
         if(state.quest16Accepted) return 1;
         return 0;
      } },

   /* Quest 17, "What Light Remembers" — same 3-stage "formality" shape
   quest8's own dev stages use (no fetch objective, accepted===ready to
   report). Gates the Prism Depths (DUNGEONS.*.requiredFlag, dungeon.js)
   now, so jumping straight to "Complete" here is the fast path to
   actually reaching the dungeons in dev mode. */
   { id:'quest17', label:'Crystal City: What Light Remembers (Act 3 opener)', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest17Accepted:false, quest17Complete:false }); } },
      { label:'Accepted (ready to turn in)', apply(){ Object.assign(state, { quest17Accepted:true, quest17Complete:false }); } },
      { label:'Complete (Prism Depths open)', apply(){ Object.assign(state, { quest17Accepted:true, quest17Complete:true }); } },
      ], detect(){ if(state.quest17Complete) return 2; if(state.quest17Accepted) return 1; return 0; } },

   /* Quest 18/19 — same formality shape as quest17 above, but their own
   'offer' state is gated on the PRIOR wave's dungeons actually being
   cleared (allDungeonsCleared(), dungeon.js), not just the prior
   quest's own completion. The 'Accepted'/'Complete' stages here stamp
   state.dungeonClears for that prior wave directly so jumping to either
   stage is actually reachable in dev mode without grinding 3 real
   dungeon clears first — same "each stage sets every flag it implies"
   rule quest16's own stages use for its 3 gathered items. */
   { id:'quest18', label:'Crystal City: Old Light, Older Debts (Prism Depths wave 2)', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest18Accepted:false, quest18Complete:false }); } },
      { label:'Accepted (ready to turn in)', apply(){
         Object.assign(state, { quest17Complete:true, quest18Accepted:true, quest18Complete:false });
         state.dungeonClears.embercrypt = state.dungeonClears.embercrypt || 1;
         state.dungeonClears.frostvault = state.dungeonClears.frostvault || 1;
         state.dungeonClears.stormreach = state.dungeonClears.stormreach || 1;
      } },
      { label:'Complete (Verdant Hollow/Duskward/Ironloom open)', apply(){
         Object.assign(state, { quest17Complete:true, quest18Accepted:true, quest18Complete:true });
         state.dungeonClears.embercrypt = state.dungeonClears.embercrypt || 1;
         state.dungeonClears.frostvault = state.dungeonClears.frostvault || 1;
         state.dungeonClears.stormreach = state.dungeonClears.stormreach || 1;
      } },
      ], detect(){ if(state.quest18Complete) return 2; if(state.quest18Accepted) return 1; return 0; } },
   { id:'quest19', label:'Crystal City: The Last Two Rooms (Prism Depths wave 3)', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest19Accepted:false, quest19Complete:false }); } },
      { label:'Accepted (ready to turn in)', apply(){
         Object.assign(state, { quest18Complete:true, quest19Accepted:true, quest19Complete:false });
         state.dungeonClears.verdanthollow = state.dungeonClears.verdanthollow || 1;
         state.dungeonClears.duskward = state.dungeonClears.duskward || 1;
         state.dungeonClears.ironloom = state.dungeonClears.ironloom || 1;
      } },
      { label:'Complete (Echo Chapel/Sunken Archive open)', apply(){
         Object.assign(state, { quest18Complete:true, quest19Accepted:true, quest19Complete:true });
         state.dungeonClears.verdanthollow = state.dungeonClears.verdanthollow || 1;
         state.dungeonClears.duskward = state.dungeonClears.duskward || 1;
         state.dungeonClears.ironloom = state.dungeonClears.ironloom || 1;
      } },
      ], detect(){ if(state.quest19Complete) return 2; if(state.quest19Accepted) return 1; return 0; } },

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
