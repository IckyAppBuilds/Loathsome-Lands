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

const vaultCaptainHunt = state.location==='vault' && state.quest6Accepted && !state.quest6Complete && !state.quest6RareDefeated;
   if(vaultCaptainHunt && Math.random() < VAULT_CAPTAIN_SPAWN_CHANCE){
      startCombat(gnomeKingsCaptain);
      render();
      return;
   }

/* Non-combat share of the encounter roll: hazard was cut from 12% down
   to 5% per user feedback that unscripted damage events specifically
   were showing up too often — the freed-up 7 points went to combat
   (77%, up from 70%) per explicit instruction, not to flavor. Flavor
   stays at 18%. Both event lists are zone-keyed (see content.js) so
   each area reads distinctly instead of reusing one generic set
   everywhere. */
const roll = Math.random();
   if(roll < 0.77){
      startCombat();
   } else if(roll < 0.82){
      const pool = hazardEvents[state.location] || hazardEvents.commons;
      const evt = pool[Math.floor(Math.random()*pool.length)];
      const dmg = randInt(evt.dmg[0], evt.dmg[1]);
      const { absorbed, remaining } = applyDamageToPlayer(dmg);
      log(absorbed > 0
          ? `${evt.text} (-${dmg} HP — your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'})`
          : `${evt.text} (-${dmg} HP)`, 'damage');
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
          : template === gnomeKing
          ? "The gnome king rises from his throne of scavenged gold to meet you himself. Every fight before this was a warm-up."
          : `${capitalize(state.monster.name)} lurches into view. This looks serious.`)
       : `A wild ${state.monster.name} shuffles into view!`);
}

/* Shared "player takes damage" resolution — state.shield (granted by
Warding Charm or Shout, both cast via castSpell() below) absorbs first,
hp only takes what's left over. Every place the player loses HP to an
attack or hazard routes through this so a shield protects reliably
regardless of source. */
function applyDamageToPlayer(dmg){
   const absorbed = Math.min(state.shield, dmg);
   state.shield -= absorbed;
   const remaining = dmg - absorbed;
   state.hp = Math.max(0, state.hp - remaining);
   return { absorbed, remaining };
}

/* Shared "monster takes damage" resolution, mirroring applyDamageToPlayer()
above — a monster's own dodgeChance (content.js monster data, e.g. the
Casino Trial's casinoChampion) gets one roll here regardless of whether
the damage came from an Attack (playerAttack()) or a spell (castSpell()),
so any future evasive monster gets this for free from either source.
guaranteedHit skips the roll entirely for a landed sneak attack —
"catching them off guard" shouldn't then let them dodge the very swing
that caught them off guard. */
function applyDamageToMonster(dmg, guaranteedHit){
   if(!guaranteedHit && state.monster.dodgeChance && Math.random() < state.monster.dodgeChance){
      return { dodged: true, dealt: 0 };
   }
   state.monster.hp = Math.max(0, state.monster.hp - dmg);
   return { dodged: false, dealt: dmg };
}

/* Shared "monster gets a turn" resolution, used after every combat action
(Attack, a damage/heal spell, Warding Charm, or Shout). A monster can
carry an optional skills[] array (content.js, e.g. the Hoodoo Trial's
hoodooChampion) — each turn, its skills are tried in array order and the
first one whose roll hits takes the turn instead of the normal attack; a
'heal' skill is skipped while already at full HP rather than wasting its
roll. A monster with no skills[] (everything in the game before this)
always falls straight through to monsterAutoAttack(), unchanged. */
function monsterRetaliate(){
   if(state.monster.skills){
      for(const skill of state.monster.skills){
         if(skill.type==='heal' && state.monster.hp >= state.monster.maxHp) continue;
         if(Math.random() < skill.chance){
            useMonsterSkill(skill);
            return;
         }
      }
   }
   monsterAutoAttack();
}

/* A monster's default turn: try to hit the player, worn down by the
player's own Zip-based dodge chance same as always. Boosted by a prior
'buff' skill use (state.monster.buffTurnsLeft/buffMult, set in
useMonsterSkill() below) until it ticks back down to 0. */
function monsterAutoAttack(){
   const eff = getEffectiveStats();
   const dodgeChance = Math.min(0.5, statBonus(eff.zip)*0.03);
   if(Math.random() < dodgeChance){
      log(`You dodge ${state.monster.name}'s counterattack completely.`);
      tickMonsterBuff();
      return;
   }
   let mdmg = randInt(state.monster.atkMin, state.monster.atkMax);
   if(state.monster.buffTurnsLeft > 0) mdmg = Math.round(mdmg * (state.monster.buffMult || 1.5));
   const { absorbed, remaining } = applyDamageToPlayer(mdmg);
   log(absorbed > 0
       ? `${capitalize(state.monster.name)} retaliates for ${mdmg} damage — your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
       : `${capitalize(state.monster.name)} retaliates for ${mdmg} damage.`, 'damage');
   tickMonsterBuff();
}

/* Ticks state.monster.buffTurnsLeft down — called only from
monsterAutoAttack() above, where the buff is actually consumed, not from
every monster turn. A 'buff' skill use itself doesn't tick it (casting
the buff shouldn't burn one of its own duration units), and neither does
a 'heal'/'bolt' turn (an active buff sits dormant through those rather
than expiring on a turn it never got to apply to an attack) — so
buffTurns:3 reliably means "the next 3 times this monster actually
attacks", not "the next 3 turns of any kind". */
function tickMonsterBuff(){
   if(state.monster.buffTurnsLeft > 0) state.monster.buffTurnsLeft--;
}

/* Executes one monster skill (content.js's skills[] entries) instead of
the normal auto-attack for this turn. Generic by skill.type, so a future
monster with its own skills[] needs no new dispatch code here unless it
introduces an actual new type. */
function useMonsterSkill(skill){
   if(skill.type==='heal'){
      const healAmt = randInt(skill.healMin, skill.healMax);
      const before = state.monster.hp;
      state.monster.hp = Math.min(state.monster.maxHp, state.monster.hp + healAmt);
      log(`${capitalize(state.monster.name)} ${skill.flavor}. (+${state.monster.hp-before} HP)`);
   } else if(skill.type==='buff'){
      state.monster.buffTurnsLeft = skill.buffTurns;
      state.monster.buffMult = skill.buffMult;
      log(`${capitalize(state.monster.name)} ${skill.flavor}.`);
   } else if(skill.type==='bolt'){
      const eff = getEffectiveStats();
      const dodgeChance = Math.min(0.5, statBonus(eff.zip)*0.03);
      if(Math.random() < dodgeChance){
         log(`You dodge ${state.monster.name}'s ${skill.flavor} completely.`);
      } else {
         const dmg = randInt(skill.boltMin, skill.boltMax);
         const { absorbed, remaining } = applyDamageToPlayer(dmg);
         log(absorbed > 0
             ? `${capitalize(state.monster.name)} ${skill.flavor} for ${dmg} damage — your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
             : `${capitalize(state.monster.name)} ${skill.flavor} for ${dmg} damage.`, 'damage');
      }
   }
}

function playerAttack(){
   if(!state.inCombat) return;
   const eff = getEffectiveStats();
   /* Named in every log line below rather than a generic "You swing/
   strike" — state.equipment.weapon is always populated in real play
   (starterGear is auto-equipped at game start, and equipItem() only
   ever replaces the slot, never clears it), but the fallback keeps this
   safe against any future path that could leave it unset. */
   const weaponName = state.equipment.weapon ? state.equipment.weapon.name : 'your bare hands';

   /* A base 10% chance to simply whiff, worn down by Zip (a steadier hand,
   not just faster feet) — floored at 2% so no amount of Zip makes you
   fully immune to it. Checked before the sneak-attack roll below: a
   fumbled swing can't also land a crit. A miss still ends your turn as
   normal (the monster retaliates) — it only costs you the hit, not the
   whole turn. */
   const missChance = Math.max(0.02, 0.1 - statBonus(eff.zip)*0.004);
   if(Math.random() < missChance){
      log(`You swing ${weaponName} at ${state.monster.name} and miss completely.`);
      monsterRetaliate();
      checkDefeat();
      render();
      return;
   }

   let dmg = randInt(3,7) + (state.level-1) + statBonus(eff.beef);
   if(state.classTitle === 'Meathead') dmg = Math.round(dmg * (1 + MEATHEAD_DAMAGE_BONUS[state.classSkillLevel]));
   /* Adrenaline Rush buff (content.js's spells[], classRequired:'Meathead')
   — chains on top of the passive MEATHEAD_DAMAGE_BONUS line above rather
   than replacing it, so a buffed Meathead gets both bonuses at once. */
   if(state.classBuffFightsLeft > 0 && state.classTitle === 'Meathead') dmg = Math.round(dmg * 1.25);

   /* Zip's sneak attack: only on the opening swing of a fresh fight (monster
   still at full HP, the simplest reliable "first turn" check without a
   separate combat-turn counter) — a chance to catch them off guard for a
   critical hit AND deny their retaliation this turn entirely, rather than
   just extra damage. Capped below dodge's 0.5 ceiling since landing this
   is worth more (crit + a free turn, not just damage mitigation). */
   const isOpeningAttack = state.monster.hp === state.monster.maxHp;
   const sneakAttackChance = isOpeningAttack ? Math.min(0.4, statBonus(eff.zip)*0.025) : 0;
   /* Loaded Dice buff (content.js's spells[], classRequired:'Card Shark') —
   guarantees the opening sneak attack lands while buffed, instead of
   still rolling sneakAttackChance like normal. */
   const sneakAttackLands = (isOpeningAttack && state.classBuffFightsLeft>0 && state.classTitle==='Card Shark')
      || (sneakAttackChance > 0 && Math.random() < sneakAttackChance);
   if(sneakAttackLands) dmg = Math.round(dmg * 2);

   const { dodged } = applyDamageToMonster(dmg, sneakAttackLands);
   if(dodged){
      log(`${capitalize(state.monster.name)} slips out of the way — ${weaponName} finds nothing but air.`);
   } else {
      log(sneakAttackLands
          ? `You catch ${state.monster.name} completely off guard with ${weaponName} — a critical opening strike for ${dmg} damage!`
          : `You strike ${state.monster.name} with ${weaponName} for ${dmg} damage.`);
      if(state.monster.hp<=0){
         winCombat();
         return;
      }
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
   const spell = spells.find(s=>s.id===id);
   if(!spell) return;
   /* A buff spell has no monster to target, so it's the one type castable
   outside combat — everything below this still assumes state.monster
   exists (via monsterRetaliate()/checkDefeat()) for the other 3 types,
   which is why they still require an active fight. */
   if(spell.type!=='buff' && !state.inCombat) return;
   if(!state.spellsKnown.includes(id) || state.mp < spell.mpCost) return;
   /* Defense-in-depth: learnSpell() already refuses to teach a buff spell
   to the wrong class, but a crafted castSpell() call could still try to
   cast one it never learned via the normal flow — refuse with a message
   rather than silently no-oping. */
   if(spell.classRequired && state.classTitle !== spell.classRequired){
      log(`${spell.name} isn't for you — that's a ${spell.classRequired} spell.`);
      render();
      return;
   }

state.mp -= spell.mpCost;
   const eff = getEffectiveStats();
   combatSubView = 'main';

if(spell.type==='damage'){
   let dmg = randInt(spell.dmgMin, spell.dmgMax) + (state.level-1) + statBonus(eff.hoodoo);
   if(state.classTitle === 'Hexpert') dmg += HEXPERT_SPELL_DMG_BONUS[state.classSkillLevel];
   /* Arcane Focus buff (content.js's spells[], classRequired:'Hexpert') —
   applied AFTER the flat HEXPERT_SPELL_DMG_BONUS line above so the
   multiplier scales the whole total (base roll + passive bonus), not
   just the base roll — chosen to mirror how Adrenaline Rush stacks on
   top of MEATHEAD_DAMAGE_BONUS in playerAttack() rather than diverge. */
   if(state.classBuffFightsLeft > 0 && state.classTitle === 'Hexpert') dmg = Math.round(dmg * 1.5);
   const { dodged } = applyDamageToMonster(dmg, false);
   if(dodged){
      log(`You cast ${spell.name}, but ${state.monster.name} isn't where the bolt lands.`);
   } else {
      log(`You cast ${spell.name} — ${capitalize(state.monster.name)} takes ${dmg} damage.`);
      if(state.monster.hp<=0){
         /* Checked before winCombat() (so !state.classQuestComplete still reads
         pre-victory state) but logged after — winCombat() calls clearLog()
         internally, so a log() here would just get wiped by that. Tightened
         to require THIS boss specifically (hoodooChampion, content.js) —
         any old damage-spell kill used to count, which made the trial a
         one-click checkbox instead of a real fight. */
         const passesHoodooTrial = state.monster.name === hoodooChampion.name && state.classQuestAccepted && !state.classTrialHoodooPassed && !state.classQuestComplete;
         if(passesHoodooTrial) state.classTrialHoodooPassed = true;
         winCombat();
         if(passesHoodooTrial) log("A killing blow with a spell — the Hoodoo Doctor's test, passed.");
         return;
      }
   }
   monsterRetaliate();
} else if(spell.type==='heal'){
   const before = state.hp;
   state.hp = Math.min(state.maxHp, state.hp+spell.healValue);
   log(`You cast ${spell.name} and patch yourself up. (+${state.hp-before} HP)`);
   monsterRetaliate();
} else if(spell.type==='ward'){
   /* Grants a persistent shield (applyDamageToPlayer(), above) instead of
   just softening this one retaliation — Hoodoo-scaled, boosted further
   by classSkillLevel for a Hexpert (same lever that boosts their spell-
   damage bonus). Stacks on repeat casts; only spent when something
   actually hits. */
   const shieldAmount = 8 + statBonus(eff.hoodoo)*2 + (state.classTitle==='Hexpert' ? state.classSkillLevel*10 : 0);
   state.shield += shieldAmount;
   log(`You cast ${spell.name} — a shimmering barrier settles over you. (+${shieldAmount} Shield)`);
   monsterRetaliate();
} else if(spell.type==='buff'){
   state.classBuffFightsLeft = CLASS_BUFF_FIGHTS;
   log(`You cast ${spell.name} — the next ${CLASS_BUFF_FIGHTS} fights are yours.`);
   /* Only give a mid-fight buff cast the other types' free monster turn
   when there's actually a fight going — a buff cast outside combat has
   no monster to retaliate. */
   if(state.inCombat) monsterRetaliate();
} else if(spell.type==='shout'){
   /* Meathead-exclusive — same "grant a shield" mechanic as 'ward' above,
   but Beef-scaled instead of Hoodoo-scaled (this class rarely invests in
   Hoodoo) and boosted by classSkillLevel the same way MEATHEAD_DAMAGE_
   BONUS is, since one class-skill purchase strengthens both. Used to be
   a free, unlearnable dedicated button — folded into the normal spell
   system (learnSpell()/castSpell()) so it costs Pop Tabs to learn and MP
   to cast, same as every other class-exclusive ability. */
   const shieldAmount = 8 + statBonus(eff.beef)*2 + state.classSkillLevel*10;
   state.shield += shieldAmount;
   log(`You let out a bone-rattling shout, bracing for whatever's coming. (+${shieldAmount} Shield)`);
   monsterRetaliate();
}

if(state.inCombat){
   checkDefeat();
   render();
} else {
   /* Combat actions never autosave mid-fight (see the rest of this file),
   but a buff cast outside combat is itself the whole state change, so it
   has to persist itself rather than riding along with a later combat
   render(). */
   render();
   autosave();
}
}

/* Which town building teaches a given class's buff spell — same
class->building mapping as levelUpClassSkill()'s atRightBuilding check
(guild.js), mirrored here rather than invented separately. The 4 original
spells (no classRequired) have no entry here and fall back to 'hoodoo'
below, unchanged from before this spell type existed. */
const CLASS_SPELL_LOCATION = { 'Meathead':'guild', 'Card Shark':'casino', 'Hexpert':'hoodoo' };
/* Flavor for the "who taught you this" log line — keyed the same way. */
const CLASS_SPELL_TRAINER = { 'Meathead':'The Guild', 'Card Shark':'The Casino', 'Hexpert':'The Hoodoo Doctor' };

function learnSpell(id){
   const spell = spells.find(s=>s.id===id);
   if(!spell || state.spellsKnown.includes(id)) return;
   const requiredLocation = spell.classRequired ? CLASS_SPELL_LOCATION[spell.classRequired] : 'hoodoo';
   if(state.location !== requiredLocation) return;
   /* A class buff spell can only be learned by its own class — someone
   could otherwise reach this via a crafted call even though the UI only
   ever shows it to the matching class. Refuse with a message rather than
   a silent no-op, same reasoning as castSpell()'s own class check. */
   if(spell.classRequired && state.classTitle !== spell.classRequired){
      log(`${spell.name} isn't for you — that's a ${spell.classRequired} spell.`);
      render();
      return;
   }
   /* Computed once so the affordability gate and the deduction below can't
   drift apart (e.g. gate checks the discounted price but full price gets
   deducted, or vice versa). */
   const price = Math.round(spell.price * (1 - HOODOO_SPELL_DISCOUNT[state.buildingUpgrades.hoodoo || 0]));
   if(state.popTabs < price) return;
   state.popTabs -= price;
   state.spellsKnown.push(id);
   clearLog();
   log(`${CLASS_SPELL_TRAINER[spell.classRequired] || 'The Hoodoo Doctor'} teaches you ${spell.name}. (-${price} Pop Tabs)`);
   render();
}
function playerFlee(){
   if(!state.inCombat) return;
   const eff = getEffectiveStats();
   const fleeChance = Math.min(0.9, 0.65 + statBonus(eff.zip)*0.02);
   if(Math.random() < fleeChance){
      /* Same reasoning as winCombat()'s wasBuildingTrialFight branch below —
      all three Trial fights are anchored to a town building instead of an
      exploration zone, so send the player back to town on a successful
      flee too rather than leaving them sitting back inside that building
      mid-Trial. */
      const wasBuildingTrialFight = !!state.monster.rare && (state.monster.name === trialChampion.name || state.monster.name === casinoChampion.name || state.monster.name === hoodooChampion.name);
      log(`You flee from ${state.monster.name}, dignity mostly intact.`);
      endCombat();
      if(wasBuildingTrialFight) state.location = 'town';
   } else {
      const mdmg = randInt(state.monster.atkMin, state.monster.atkMax);
      const { absorbed, remaining } = applyDamageToPlayer(mdmg);
      log(absorbed > 0
          ? `You fail to escape. ${capitalize(state.monster.name)} gets a free hit for ${mdmg} — your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
          : `You fail to escape. ${capitalize(state.monster.name)} gets a free hit for ${mdmg}.`, 'damage');
      checkDefeat();
   }
   render();
}

/* Scales a monster's authored gearDrop (content.js — always the tier-1
baseline, 1 stat) up to a randomly-rolled tier per GEAR_DROP_TIER_CHANCE
(content.js), weighted toward the lower tiers. Tier 2/3 each add +1 to
the primary stat and one more secondary stat at +1 (STAT_ROTATION,
content.js) — the same 1/2/3-stat, +1-per-step progression
shopGearItemsTier2/3 use, so a monster-dropped item at a given tier
reads the same way a shop item at that tier would. Name/desc/slot/icon
are untouched — only `bonus` and `tier` change with the roll. */
function rollGearDropTier(baseDrop){
   const roll = Math.random();
   let cumulative = 0;
   let tierIndex = 0;
   for(let i=0;i<GEAR_DROP_TIER_CHANCE.length;i++){
      cumulative += GEAR_DROP_TIER_CHANCE[i];
      if(roll < cumulative){ tierIndex = i; break; }
      tierIndex = i;
   }
   const primaryStat = Object.keys(baseDrop.bonus)[0];
   const primaryValue = baseDrop.bonus[primaryStat];
   const bonus = { [primaryStat]: primaryValue + tierIndex };
   const secondaryStats = STAT_ROTATION[primaryStat].slice(0, tierIndex);
   secondaryStats.forEach(stat => { bonus[stat] = 1; });
   return { ...baseDrop, bonus, tier: GEAR_DROP_TIER_NAMES[tierIndex] };
}

function winCombat(){
   const defeatedName = state.monster.name;
   const xpGain = state.monster.xp;
   const wasCommander = !!state.monster.rare && state.monster.name === gnomeCommander.name;
   const wasDiggerBot = !!state.monster.rare && state.monster.name === diggerBot.name;
   const wasVaultCaptain = !!state.monster.rare && state.monster.name === gnomeKingsCaptain.name;
   const wasRealGnomeKing = !!state.monster.rare && state.monster.name === gnomeKing.name;
   const wasTrialChampion = !!state.monster.rare && state.monster.name === trialChampion.name;
   const wasCasinoChampion = !!state.monster.rare && state.monster.name === casinoChampion.name;
   const wasHoodooChampion = !!state.monster.rare && state.monster.name === hoodooChampion.name;
   const wasGarrisonGuardian = !!state.monster.rare && state.monster.name === garrisonGuardian.name;
   const wasRoguesDenEnforcer = !!state.monster.rare && state.monster.name === roguesDenEnforcer.name;
   const wasArcaneSanctumGuardian = !!state.monster.rare && state.monster.name === arcaneSanctumGuardian.name;
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
   /* The three Gnometropolis district guardians (content.js) always carry
   their class's PALACE_GATE_GEAR item as state.monster.loot (see that
   file's comment) — this is what turns it into a guaranteed drop instead
   of the generic 70% roll below, same guarantee tier as a quest item. */
   const isDistrictGuardianKill = wasGarrisonGuardian || wasRoguesDenEnforcer || wasArcaneSanctumGuardian;
   const lootRoll = needsPotionIngredient
   ? potionIngredient.item
      : needsVeinIngredient
   ? veinIngredient.item
      : isRakeTineLoot
   ? (isNeededQuestItem ? state.monster.loot : null) /* never drops outside the quest window */
      : isDistrictGuardianKill
   ? state.monster.loot
      : (state.monster.loot && Math.random()<0.7 ? state.monster.loot : null);
   /* Rare drops are per-monster now (state.monster.rareDrop, set in
   monsters[] in content.js) rather than a random pick from one shared
   pool — gnomeCommander/diggerBot don't carry one, so this simply never
   fires for them. */
const rareRoll = state.monster.rareDrop && Math.random()<RARE_DROP_CHANCE ? state.monster.rareDrop : null;
   /* Gear drops (state.monster.gearDrop, content.js) are rolled entirely
   independently of both lootRoll and rareRoll above — a single kill can
   in principle hand over all three. gnomeCommander/diggerBot/the Trial
   champions/district guardians don't carry one, so this never fires for
   them. */
const gearRoll = state.monster.gearDrop && Math.random()<GEAR_DROP_CHANCE ? state.monster.gearDrop : null;

/* All three Trial fights (Guild/Casino/Hoodoo) run while state.location
stays at that building (it never changes, same as every other forced
fight) — but every other forced fight happens in an exploration zone,
where goAdventuring()/travelTo() always clears the victory banner as the
very first thing on the player's next action, and checkDefeat() sends a
loss straight back to town. No building ever needed to play either role
before, so skip the banner AND send a win back to town too (same landing
spot a loss already uses) rather than trying to make each building's own
screen behave like an exploration zone after the fact. */
const wasBuildingTrialFight = wasTrialChampion || wasCasinoChampion || wasHoodooChampion;
if(wasBuildingTrialFight){
   state.showVictory = false;
   state.victoryMonster = null;
   state.location = 'town';
} else {
   state.victoryMonster = { art: state.monster.art, name: state.monster.name };
   state.showVictory = true;
}

clearLog();
   if(wasCommander){
      state.commanderDefeated = true;
      log(`You defeat ${defeatedName}! The rest of his gnomes scatter into the hedges. (+${xpGain} XP)`);
   } else if(wasDiggerBot){
      state.quest4RareDefeated = true;
      log(`You defeat ${defeatedName}! It sparks once and goes still. (+${xpGain} XP)`);
   } else if(wasVaultCaptain){
      state.quest6RareDefeated = true;
      log(`You defeat ${defeatedName}! The captain falls, and the throne behind him sits empty. (+${xpGain} XP)`);
   } else if(wasRealGnomeKing){
      state.quest7RareDefeated = true;
      log(`You defeat ${defeatedName}! The self-declared king of Gnometropolis falls at last, his scavenged crown rolling into the dark. (+${xpGain} XP)`);
   } else if(wasTrialChampion){
      state.classTrialGuildPassed = true;
      log(`You defeat ${defeatedName}! The Guild's toughest test, passed. (+${xpGain} XP)`);
   } else if(wasCasinoChampion){
      state.classTrialCasinoPassed = true;
      log(`You defeat ${defeatedName}! The house doesn't usually lose that hand — the Casino's test, passed. (+${xpGain} XP)`);
   } else if(wasHoodooChampion){
      log(`You defeat ${defeatedName}! ${state.classTrialHoodooPassed ? "A killing blow with a spell — the Hoodoo Doctor's test, passed." : "It dissolves back into the pot, gone for now."} (+${xpGain} XP)`);
   } else if(wasGarrisonGuardian){
      log(`You defeat ${defeatedName}! The Garrison falls silent behind you. (+${xpGain} XP)`);
   } else if(wasRoguesDenEnforcer){
      log(`You defeat ${defeatedName}! Nobody in the Rogues' Den saw where you went. (+${xpGain} XP)`);
   } else if(wasArcaneSanctumGuardian){
      log(`You defeat ${defeatedName}! The Sanctum's wards flicker and go dark. (+${xpGain} XP)`);
   } else {
      log(`You defeat ${defeatedName}! (+${xpGain} XP)`);
   }
   state.xp += xpGain;
   /* Everything actually pushed to state.inventory below also collects
   here, so the victory banner (render.js) can show each drop exactly as
   the Pack would — same item objects, not a re-derived guess. Left
   empty (and never read) for the wasBuildingTrialFight case above,
   since none of those bosses carry loot/rareDrop/gearDrop anyway. */
   const drops = [];
   if(lootRoll){
      const lootedItem = {...lootRoll};
      state.inventory.push(lootedItem);
      drops.push(lootedItem);
      log(`You loot: ${lootRoll.name}.`);
   }
   if(rareRoll){
      /* tier:'legendary' stamped on here rather than on every individual
      rareDrop definition (content.js) — a rare drop's own `type` varies
      ('junk' or 'luck', whichever fits its flavor), but every rare drop
      is uniformly the game's top item tier regardless. getItemTier()
      (item-tiers.js) always prefers this explicit tier over its
      type-based fallback. */
      const rareItem = {...rareRoll, tier:'legendary'};
      state.inventory.push(rareItem);
      drops.push(rareItem);
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
   if(gearRoll){
      const gearItem = rollGearDropTier(gearRoll);
      state.inventory.push(gearItem);
      drops.push(gearItem);
      log(gearItem.tier === 'common'
          ? `It drops something wearable: ${gearItem.name}.`
          : `It drops something wearable — and a nice one: ${gearItem.name}!`);
   }
   if(state.victoryMonster) state.victoryMonster.drops = drops;
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
   /* Class buff spells (content.js's spells[]) tick down once per completed
   fight, not per turn — winCombat()/playerFlee() (a successful escape)/
   checkDefeat() (a defeat) are the only 3 real fight-ending paths, and
   they all funnel through this one function, so decrementing here fires
   exactly once per encounter regardless of how it ended. A mid-fight
   action that doesn't end the fight (a normal attack, a non-lethal spell)
   never reaches endCombat() at all, so it can't double-decrement. */
   if(state.classBuffFightsLeft > 0) state.classBuffFightsLeft--;
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
