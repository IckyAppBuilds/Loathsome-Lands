/* ---------------- Core loop ---------------- */
const ADVENTURE_ZONES = ['commons', 'sewers', 'quarry', 'vault', 'gnometropolis'];
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

   /* Zip's sneak attack: only on the opening swing of a fresh fight (monster
   still at full HP, the simplest reliable "first turn" check without a
   separate combat-turn counter) — a chance to catch them off guard for a
   critical hit AND deny their retaliation this turn entirely, rather than
   just extra damage. Capped below dodge's 0.5 ceiling since landing this
   is worth more (crit + a free turn, not just damage mitigation). */
   const isOpeningAttack = state.monster.hp === state.monster.maxHp;
   const sneakAttackChance = isOpeningAttack ? Math.min(0.4, statBonus(eff.zip)*0.025) : 0;
   const sneakAttackLands = sneakAttackChance > 0 && Math.random() < sneakAttackChance;
   if(sneakAttackLands) dmg = Math.round(dmg * 2);

   state.monster.hp = Math.max(0, state.monster.hp-dmg);
   log(sneakAttackLands
       ? `You catch ${state.monster.name} completely off guard — a critical opening strike for ${dmg} damage!`
       : `You strike ${state.monster.name} for ${dmg} damage.`);

if(state.monster.hp<=0){
   winCombat();
   return;
}

if(!sneakAttackLands) monsterRetaliate();
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
