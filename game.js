/* ---------------- Core loop ---------------- */
const ADVENTURE_ZONES = ['commons', 'sewers', 'quarry', 'vault', 'gnometropolis'];
/* Every location id that counts as a town square (as opposed to a shop
interior inside one, or an adventure zone reached from one). Right now
there's only Gladstone Hollow ('town'), but this is the list a future
second/third town gets added to — see state.homeTown below and
hydrateState() in account.js, which use this list to decide where a
returning player lands on login rather than hardcoding 'town'. */
const TOWN_HUBS = ['town'];
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

const gnomeKingHunt = state.location==='vault' && state.quest6Accepted && !state.quest6Complete && !state.quest6RareDefeated;
   if(gnomeKingHunt && Math.random() < GNOME_KING_SPAWN_CHANCE){
      startCombat(gnomeKing);
      render();
      return;
   }

/* Non-combat share of the encounter roll was cut from 50% (25% hazard +
   25% flavor) down to 30% (12% + 18%) per user feedback that these were
   showing up too often — combat now fills the rest. Both event lists are
   zone-keyed (see content.js) so each area reads distinctly instead of
   reusing one generic set everywhere. */
const roll = Math.random();
   if(roll < 0.70){
      startCombat();
   } else if(roll < 0.82){
      const pool = hazardEvents[state.location] || hazardEvents.commons;
      const evt = pool[Math.floor(Math.random()*pool.length)];
      const dmg = randInt(evt.dmg[0], evt.dmg[1]);
      state.hp = Math.max(0, state.hp-dmg);
      log(`${evt.text} (-${dmg} HP)`, 'damage');
      checkDefeat();
   } else {
      const pool = noncombatEvents[state.location] || noncombatEvents.commons;
      const line = pool[Math.floor(Math.random()*pool.length)];
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
   /* Scale the template's base hp/atk/xp by its zone's ZONE_DIFFICULTY
   multiplier (content.js) — this is what actually makes later areas
   tougher than earlier ones; the template itself is left untouched so
   the next spawn re-reads the same baseline. */
const mult = ZONE_DIFFICULTY[template.zone] || 1;
   const hp = Math.max(1, Math.round(template.hp * mult));
   const atkMin = Math.max(1, Math.round(template.atkMin * mult));
   const atkMax = Math.max(atkMin, Math.round(template.atkMax * mult));
   const xp = Math.max(1, Math.round(template.xp * mult));
   state.monster = { ...template, hp, maxHp: hp, atkMin, atkMax, xp };
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
   const dodgeChance = Math.min(0.5, statBonus(eff.zip)*0.03);
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
   let dmg = randInt(3,7) + (state.level-1) + statBonus(eff.beef);
   if(state.classTitle === 'Meathead') dmg = Math.round(dmg * (1 + MEATHEAD_DAMAGE_BONUS[state.classSkillLevel]));
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
   let dmg = randInt(spell.dmgMin, spell.dmgMax) + (state.level-1) + statBonus(eff.hoodoo);
   if(state.classTitle === 'Hexpert') dmg += HEXPERT_SPELL_DMG_BONUS[state.classSkillLevel];
   state.monster.hp = Math.max(0, state.monster.hp-dmg);
   log(`You cast ${spell.name} — ${capitalize(state.monster.name)} takes ${dmg} damage.`);
   if(state.monster.hp<=0){
      /* Checked before winCombat() (so !state.classQuestComplete still reads
      pre-victory state) but logged after — winCombat() calls clearLog()
      internally, so a log() here would just get wiped by that. */
      const passesHoodooTrial = state.classQuestAccepted && !state.classTrialHoodooPassed && !state.classQuestComplete;
      if(passesHoodooTrial) state.classTrialHoodooPassed = true;
      winCombat();
      if(passesHoodooTrial) log("A killing blow with a spell — the Hoodoo Doctor's test, passed.");
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
   if(!spell || state.spellsKnown.includes(id)) return;
   /* Computed once so the affordability gate and the deduction below can't
   drift apart (e.g. gate checks the discounted price but full price gets
   deducted, or vice versa). */
   const price = Math.round(spell.price * (1 - HOODOO_SPELL_DISCOUNT[state.buildingUpgrades.hoodoo || 0]));
   if(state.popTabs < price) return;
   state.popTabs -= price;
   state.spellsKnown.push(id);
   clearLog();
   log(`The Hoodoo Doctor teaches you ${spell.name}. (-${price} Pop Tabs)`);
   render();
}
function playerFlee(){
   if(!state.inCombat) return;
   const eff = getEffectiveStats();
   const fleeChance = Math.min(0.9, 0.65 + statBonus(eff.zip)*0.02);
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
   const wasGnomeKing = !!state.monster.rare && state.monster.name === gnomeKing.name;
   const wasTrialChampion = !!state.monster.rare && state.monster.name === trialChampion.name;
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
   /* Unlike needsPotionIngredient above (a one-copy-only check), this
   compares against VEIN_ITEM_COUNT_NEEDED — quest 5 needs multiple
   copies of each ingredient (see content.js), so the guaranteed drop
   keeps happening on matching kills until that many are held. */
const needsVeinIngredient = veinIngredient && state.quest5Accepted && !state.quest5Complete
   && state.inventory.filter(it => it.key === veinIngredient.item.key).length < VEIN_ITEM_COUNT_NEEDED;
   const lootRoll = needsPotionIngredient
   ? potionIngredient.item
      : needsVeinIngredient
   ? veinIngredient.item
      : isRakeTineLoot
   ? (isNeededQuestItem ? state.monster.loot : null) /* never drops outside the quest window */
      : (state.monster.loot && Math.random()<0.7 ? state.monster.loot : null);
   /* Rare drops are per-monster now (state.monster.rareDrop, set in
   monsters[] in content.js) rather than a random pick from one shared
   pool — gnomeCommander/diggerBot don't carry one, so this simply never
   fires for them. */
const rareRoll = state.monster.rareDrop && Math.random()<RARE_DROP_CHANCE ? state.monster.rareDrop : null;

state.victoryMonster = { art: state.monster.art, name: state.monster.name };
   state.showVictory = true;

clearLog();
   if(wasCommander){
      state.commanderDefeated = true;
      log(`You defeat ${defeatedName}! The rest of his gnomes scatter into the hedges. (+${xpGain} XP)`);
   } else if(wasDiggerBot){
      state.quest4RareDefeated = true;
      log(`You defeat ${defeatedName}! It sparks once and goes still. (+${xpGain} XP)`);
   } else if(wasGnomeKing){
      state.quest6RareDefeated = true;
      log(`You defeat ${defeatedName}! His scavenged crown rolls off into the dark. (+${xpGain} XP)`);
   } else if(wasTrialChampion){
      state.classTrialGuildPassed = true;
      log(`You defeat ${defeatedName}! The Guild's toughest test, passed. (+${xpGain} XP)`);
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
      /* Rare-drop collection log — record the first time this specific rare
      item is ever obtained (kept even if later sold/lost). Once every
      monster's rareDrop has been seen at least once, grant a one-time
      bonus (guarded by allRaresBonusClaimed so it can't be farmed by
      losing/re-finding items). totalRares is computed fresh from
      monsters[] rather than hardcoded so it never drifts as content is
      added — see also the Character drawer's Rare Finds block. */
   if(!state.rareDropsSeen.includes(rareRoll.name)){
      state.rareDropsSeen.push(rareRoll.name);
      const totalRares = monsters.filter(m => m.rareDrop).length;
      if(!state.allRaresBonusClaimed && state.rareDropsSeen.length >= totalRares){
         state.allRaresBonusClaimed = true;
         state.popTabs += 100;
         log(`You've found every rare drop in the Loathsome Lands! The Guild wires you a congratulatory bonus. (+100 Pop Tabs)`);
      }
   }
   }
   /* Bounty Board progress — checked against the CURRENT zone as well as the
   monster's name, since bounty monster names could theoretically collide
   across zones even though today's roster doesn't. */
if(state.activeBounty){
   const activeBountyTemplate = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(activeBountyTemplate && activeBountyTemplate.monsterName === defeatedName && activeBountyTemplate.zone === state.location){
      state.activeBounty.progress = Math.min(activeBountyTemplate.count, state.activeBounty.progress + 1);
   }
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
   if(Math.random() < CASINO_WIN_CHANCE + CASINO_WIN_BONUS[state.buildingUpgrades.casino || 0]){
      /* Flat 2x payout multiplier, same as before the Card Shark skill
      existed — the skill's bonus stacks on TOP of it rather than replacing
      it, so a level-0 Card Shark (or anyone else) still gets exactly 2x. */
      let payoutMult = 2;
      if(state.classTitle === 'Card Shark') payoutMult += CARD_SHARK_PAYOUT_BONUS[state.classSkillLevel];
      const winnings = Math.round(amount * payoutMult);
      state.popTabs += winnings;
      log(`${casinoWinLines[Math.floor(Math.random()*casinoWinLines.length)]} (+${winnings} Pop Tabs)`);
      if(state.classQuestAccepted && !state.classTrialCasinoPassed && !state.classQuestComplete && amount >= CLASS_TRIAL_CASINO_STAKE){
         state.classTrialCasinoPassed = true;
         log("A big enough bet, won — the Casino's test, passed.");
      }
   } else {
      log(`${casinoLoseLines[Math.floor(Math.random()*casinoLoseLines.length)]} (-${amount} Pop Tabs)`);
   }
   render();
}

function enterGuild(){
   if(state.inCombat || state.location !== 'town') return;
   state.location = 'guild';
   clearLog();
   if(state.quest6Complete){
      log("You step into the guild hall. The guildmaster raises a glass in your direction — Gnometropolis, toppled, more or less, thanks to you.");
   } else if(state.quest6Accepted){
      log(state.quest6RareDefeated
          ? "You step into the guild hall, the Gnome King's throne room still vivid in your memory."
          : "You step into the guild hall. The guildmaster asks if you've found the Gnome King yet.");
   } else if(state.quest5Complete){
      log("You step into the guild hall. The guildmaster's eyes light up at the mention of the Vault.");
   } else if(state.quest2Complete){
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

/* ---------------- Quest 6: "The Gnome King's Throne" ---------------- */
/* Offered by the guildmaster once state.quest5Complete is true — same
"offered once a flag is true" shape as quest2/quest3/quest4/quest5.
Objective hunts the Vault (not Gnometropolis — that zone is the reward,
unlocked only once this quest is turned in) for the rare gnomeKing
spawn (content.js), same mechanic as gnomeCommander/diggerBot. */
function acceptQuest6(){
   if(state.location !== 'guild' || !state.quest5Complete || state.quest6Accepted || state.quest6Complete) return;
   state.quest6Accepted = true;
   clearLog();
   log("You accept the guild's quest: track down and defeat the Gnome King holding court somewhere in the Sunless Vault. He's rare — you'll have to keep adventuring and hope he shows himself.");
   render();
}

function reportGnomeKingKill(){
   if(state.location !== 'guild' || !state.quest6Accepted || state.quest6Complete || !state.quest6RareDefeated) return;
   state.quest6Complete = true;
   state.popTabs += 50;
   state.xp += 70;
   clearLog();
   log("You describe the Gnome King's throne room in more detail than the guildmaster expected. He's practically speechless. (+50 Pop Tabs, +70 XP)");
   log("\"Gnometropolis,\" he finally says. \"The whole hidden gnome capital, right under the Vault. It's yours to explore now, if you're brave enough.\" Gnometropolis is now open — check the Map.");
   checkLevelUp();
   render();
   autosave();
}

/* ---------------- Bounty Board (The Guild) ---------------- */
/* Repeatable content, unlike the one-time quests above — one active bounty
at a time (state.activeBounty), auto-refreshed the moment the current one
is claimed so there's never any downtime waiting on a timer. See
BOUNTY_TEMPLATES (content.js) and the progress-tracking hook in
winCombat() above. */
/* Mirrors the exact same per-zone unlock flags the Map's zone cards use
   (render.js's sewersUnlocked/quarryUnlocked/vaultUnlocked/
   gnometropolisUnlocked, and ADVENTURE_ZONES above) — a bounty should
   never send the player to hunt in a zone they can't actually reach yet.
   Commons has no gate, same as everywhere else it's treated as the
   always-available baseline zone. */
function isBountyZoneUnlocked(zone){
   if(zone === 'commons') return true;
   if(zone === 'sewers') return state.quest2Complete;
   if(zone === 'quarry') return state.quest4Complete;
   if(zone === 'vault') return state.quest5Complete;
   if(zone === 'gnometropolis') return state.quest6Complete;
   return false;
}
function rollNewBounty(){
   const prevId = state.activeBounty ? state.activeBounty.templateId : null;
   /* Only ever roll from zones the player has actually unlocked. Commons
      bounties are always eligible, so this pool is never empty. */
   let pool = BOUNTY_TEMPLATES.filter(b => isBountyZoneUnlocked(b.zone));
   if(prevId){
      const filtered = pool.filter(b => b.id !== prevId);
      if(filtered.length > 0) pool = filtered;
   }
   const template = pool[Math.floor(Math.random()*pool.length)];
   state.activeBounty = { templateId: template.id, progress: 0 };
}
function claimBounty(){
   if(state.location !== 'guild' || !state.questComplete || !state.activeBounty) return;
   const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(!bt || state.activeBounty.progress < bt.count) return;
   const bountyPayout = Math.round(bt.reward.bountyTokens * (1 + GUILD_BOUNTY_BONUS[state.buildingUpgrades.guild || 0]));
   state.bountyTokens += bountyPayout;
   state.bountiesCompleted++;
   clearLog();
   log(`Bounty complete! You collect ${bountyPayout} Bounty Token${bountyPayout===1?'':'s'} for clearing out ${bt.count} × ${bt.monsterName}.`);
   rollNewBounty();
   render();
   autosave();
}

/* ---------------- Level-10 Guild capstone: "The Adventurer's Trial" ---------------- */
/* Offered by the guildmaster once quest 2 is complete and state.level>=10 —
see classQuestState in render(). No longer a single auto-picked-stat capstone:
once accepted, three independent trainers each administer their own test, and
only after all three pass does the player CHOOSE which class to become
(claimClassPath(chosenStat) below no longer computes a "dominant" stat itself).
The three tiers, and where each one lives:
- Guild/Meathead: startClassTrialGuild() below forces a fight against
  trialChampion (content.js); winCombat()'s wasTrialChampion branch sets
  state.classTrialGuildPassed = true on the win.
- Casino/Card Shark: gambleCasino() (this file) checks CLASS_TRIAL_CASINO_STAKE
  on a win and sets state.classTrialCasinoPassed = true.
- Hoodoo/Hexpert: castSpell()'s damage branch (this file) sets
  state.classTrialHoodooPassed = true on a killing blow with a damage spell.
claimClassPath(chosenStat) then gates on all three flags plus chosenStat being
one of 'beef'/'zip'/'hoodoo' (Bulwark/grit has no trial tier and isn't a valid
choice), and hands out a permanent title plus a small +2 bonus to chosenStat,
via CLASS_TITLES in content.js. */
function acceptClassQuest(){
   if(state.location !== 'guild' || !state.quest2Complete || state.level<10 || state.classQuestAccepted || state.classQuestComplete) return;
   state.classQuestAccepted = true;
   clearLog();
   log("The guildmaster looks you over — really looks, this time. \"You've come further than most. There's a Trial for adventurers who reach this far: the Guild puts a name to what you've become. Say the word when you're ready to hear it.\"");
   render();
}

/* Guild tier of the Trial — forces a fight against trialChampion (content.js)
rather than a wild zone spawn. startCombat() already accepts a forced
template as its one argument (see gnomeCommander/diggerBot/gnomeKing
call sites), so this just gates on the Trial being active and not yet
passed before handing it that template. */
function startClassTrialGuild(){
   if(state.location !== 'guild' || !state.classQuestAccepted || state.classTrialGuildPassed || state.classQuestComplete) return;
   startCombat(trialChampion);
}

function claimClassPath(chosenStat){
   if(state.location !== 'guild' || !state.classQuestAccepted || !state.classTrialGuildPassed || !state.classTrialCasinoPassed || !state.classTrialHoodooPassed || state.classQuestComplete || !['beef','zip','hoodoo'].includes(chosenStat)) return;
   state.stats[chosenStat] += 2;
   state.classTitle = CLASS_TITLES[chosenStat];
   recomputeMaxStats();
   state.classQuestComplete = true;

clearLog();
   log(`The guildmaster studies your training, your gear, the way you carry yourself. "${STAT_LABELS[chosenStat]}," he says finally. "That's your path." (+2 ${STAT_LABELS[chosenStat]})`);
   log(`You are recognized as a ${CLASS_TITLES[chosenStat]}. Check your Character page.`);
   render();
   autosave();
}

/* Levels the shared class-skill counter (state.classSkillLevel, core.js) that
backs whichever combat bonus the player's chosen class unlocks
(MEATHEAD_DAMAGE_BONUS/CARD_SHARK_PAYOUT_BONUS/HEXPERT_SPELL_DMG_BONUS,
content.js) — see those bonuses applied in playerAttack()/gambleCasino()/
castSpell() respectively. Purchasable only at the building matching the
player's class, same 0..3 index range as the bonus arrays (mirrors
BUILDING_UPGRADE_MAX's capping style), and only one copy of the counter
exists since a player only ever has one active class at a time. */
function levelUpClassSkill(){
   const atRightBuilding =
      (state.classTitle==='Meathead' && state.location==='guild') ||
      (state.classTitle==='Card Shark' && state.location==='casino') ||
      (state.classTitle==='Hexpert' && state.location==='hoodoo');
   if(!atRightBuilding || state.classSkillLevel>=3) return;
   const cost = classSkillCost(state.classSkillLevel);
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.classSkillLevel++;
   clearLog();
   log(`Your ${state.classTitle} training deepens. (-${cost} Pop Tabs, class skill level ${state.classSkillLevel})`);
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
   else if(action === 'townlot') enterTownLot();
});

/* Seed a brand-new run: starter gear (equipped) and a couple of starter
items, then the opening log line. Called for a guest, for a freshly
registered/logged-in account with no save yet, and (in degraded mode,
no Supabase) unconditionally at boot. Being the single choke point for
all three of those cases is also exactly why the tutorial overlay
(account.js) opens itself here, at the very end — it's shown once per
brand-new run and never for a returning player whose save was found
(that path is enterGameAfterAuth(true), which never calls this). */
function startFreshGame(){
   Object.keys(starterGear).forEach(slot => { state.equipment[slot] = {...starterGear[slot]}; });
   recomputeMaxStats();
   state.inventory.push({...healItems[0]});
   clearLog();
   log("You arrive in Gladstone Hollow. A cottage on the square has a rather urgent-looking flag over it.");
   if(devMode) log("Dev mode ON (via ?dev=1) — Biscuits won't run out.");
   render();
   openTutorial();
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
