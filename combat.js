/* ---------------- Core loop ---------------- */
/* 'gnometropolis' itself isn't here anymore -- it's the Act 2 town hub
now (TOWN_HUBS, town.js), not a directly-explorable zone. Its three
districts (reached from that town square via travelTo(), gnometropolis.js)
took its place as the actual adventuring locations; 'palace' is
deliberately excluded -- it's a single scripted fight (approachPalaceGate(),
guild.js), not somewhere to wander and roll random encounters. */
const ADVENTURE_ZONES = ['commons', 'sewers', 'quarry', 'vault', 'garrison', 'roguesden', 'sanctum', 'rootcellar', 'mudflats', 'bureau', 'choir', 'ledgervault', 'foundry', 'gearworks', 'crystalcity'];

/* Garrison/Rogues' Den/Arcane Sanctum's exploration role is temporary —
before quest7Complete they're real adventure zones (each district's
own class-gated guardian hunt, garrisonHunt/roguesdenHunt/sanctumHunt
below, is quest7's own actual objective), but once quest7Complete
they've fully converted into pure class-trainer buildings (Stubborn
Recovery/Smoke Screen/Arcane Lance, content.js's spells[], taught via
renderClassSpellList(), render.js) — same building, no more random
encounters, matching the Act 2 plan's own "Sequencing note" (now that
Mudroot Warren exists to take over the exploration role these three
used to fill). Checked in goAdventuring() below AND in render.js's own
explore-row visibility, so a player can't trigger one without seeing
the other. */
const CLASS_AREA_ZONES = ['garrison', 'roguesden', 'sanctum'];
function goAdventuring(){
   if(state.inCombat || !ADVENTURE_ZONES.includes(state.location)) return;
   if(state.quest7Complete && CLASS_AREA_ZONES.includes(state.location)) return;
   regenBiscuits();
   /* Every zone now costs Biscuits just to travel to (travelCostFor(),
   town.js) — hitting 0 while already out here would otherwise leave the
   player stuck with no way to adventure AND no way to afford the trip
   home. forceHomeIfBroke() (town.js) sends them back to state.homeTown
   for free instead, replacing the old "check back later" block that
   just left them standing in place. */
   if(forceHomeIfBroke()) return;
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

/* Gnometropolis' three district-guardian hunts — same shape as the three
above, plus a state.classTitle match each of those doesn't need: these
bosses are class-gated (each drops that class's own PALACE_GATE_GEAR),
so any class can explore any district, but only the matching class's
hunt condition ever comes true — a Card Shark wandering the Garrison
just fights regular monsters there, forever, same as everyone else who
walked into the wrong door. */
const garrisonHunt = state.location==='garrison' && state.classTitle==='Meathead' && state.quest7Accepted && !state.quest7Complete && !state.garrisonGuardianDefeated;
   if(garrisonHunt && Math.random() < GARRISON_GUARDIAN_SPAWN_CHANCE){
      startCombat(garrisonGuardian);
      render();
      return;
   }

const roguesdenHunt = state.location==='roguesden' && state.classTitle==='Card Shark' && state.quest7Accepted && !state.quest7Complete && !state.roguesDenEnforcerDefeated;
   if(roguesdenHunt && Math.random() < ROGUESDEN_ENFORCER_SPAWN_CHANCE){
      startCombat(roguesDenEnforcer);
      render();
      return;
   }

const sanctumHunt = state.location==='sanctum' && state.classTitle==='Hexpert' && state.quest7Accepted && !state.quest7Complete && !state.arcaneSanctumGuardianDefeated;
   if(sanctumHunt && Math.random() < ARCANE_SANCTUM_GUARDIAN_SPAWN_CHANCE){
      startCombat(arcaneSanctumGuardian);
      render();
      return;
   }

/* Quest 9's two-stage rare hunt, spanning two different Mudroot Warren
districts — the multi-zone shape the user asked for, not a single-zone
rare hunt like every Act 1 quest. warrenScoutHunt can never actually
fire before tunnelWardenDefeated flips true, since state.location can't
even BE 'mudflats' until then (travelTo(), town.js, plus the tile
itself not being clickable — artMudrootWarrenSquare(), mudroot-art.js)
— the !state.tunnelWardenDefeated exclusion below is defense-in-depth,
not the real gate. */
const tunnelWardenHunt = state.location==='rootcellar' && state.quest9Accepted && !state.quest9Complete && !state.tunnelWardenDefeated;
   if(tunnelWardenHunt && Math.random() < TUNNEL_WARDEN_SPAWN_CHANCE){
      startCombat(tunnelWarden);
      render();
      return;
   }

const warrenScoutHunt = state.location==='mudflats' && state.quest9Accepted && !state.quest9Complete && state.tunnelWardenDefeated && !state.warrenScoutDefeated;
   if(warrenScoutHunt && Math.random() < WARREN_SCOUT_SPAWN_CHANCE){
      startCombat(warrenScout);
      render();
      return;
   }

/* Quest 10's two rare hunt targets — a CHOICE, not a sequence: both are
active in parallel the whole time quest10Accepted is true, each in an
EXISTING Mudroot Warren district (Root Cellar/the Bureau) rather than a
new zone. Deliberately NOT gated on !state.quest10Complete — reaching
the Warren's Ear via one path doesn't stop the OTHER rare hunt from
still being findable later, so a player can go back and reveal the
second district too, purely as an optional bonus (see
warrensear-content.js's own comment). Whichever is found FIRST sets
state.quest10Path (winCombat() below). */
const tunnelMoleInformantHunt = state.location==='rootcellar' && state.quest10Accepted && !state.tunnelMoleInformantDefeated;
   if(tunnelMoleInformantHunt && Math.random() < TUNNEL_MOLE_INFORMANT_SPAWN_CHANCE){
      startCombat(tunnelMoleInformant);
      render();
      return;
   }

const seniorClerkHunt = state.location==='bureau' && state.quest10Accepted && !state.seniorClerkDefeated;
   if(seniorClerkHunt && Math.random() < SENIOR_CLERK_SPAWN_CHANCE){
      startCombat(seniorClerk);
      render();
      return;
   }

/* Quest 12's own two-stage rare hunt, "Chain of Custody" — same
sequential shape as quest9's tunnelWarden->warrenScout above (stage 2
can't fire until stage 1's own flag is set), but stage 2 relocates back
to the Bureau, a zone the player already explored back in quest9/10,
instead of pushing into somewhere new — the "spans back into an older
zone" twist. bureauQuartermasterHunt sits below seniorClerkHunt above
on purpose: both can be live in the Bureau at once (quest10's own hunt
never stops spawning once quest10Accepted, per its own comment), so
this checks its own gate independently rather than assuming it's the
only thing that can spawn there. */
const gearworksForemanHunt = state.location==='gearworks' && state.quest12Accepted && !state.gearworksForemanDefeated;
   if(gearworksForemanHunt && Math.random() < GEARWORKS_FOREMAN_SPAWN_CHANCE){
      startCombat(gearworksForeman);
      render();
      return;
   }

const bureauQuartermasterHunt = state.location==='bureau' && state.quest12Accepted && state.gearworksForemanDefeated && !state.bureauQuartermasterDefeated;
   if(bureauQuartermasterHunt && Math.random() < BUREAU_QUARTERMASTER_SPAWN_CHANCE){
      startCombat(bureauQuartermaster);
      render();
      return;
   }

/* Quest 13, "Quenched" — a single rare hunt, same shape as
gearworksForemanHunt above, just one stage. Introduces this game's
first 'freeze' debuff (quenchMaster's own skills[], emberwarren-
content.js). */
const quenchMasterHunt = state.location==='foundry' && state.quest13Accepted && !state.quenchMasterDefeated;
   if(quenchMasterHunt && Math.random() < QUENCH_MASTER_SPAWN_CHANCE){
      startCombat(quenchMaster);
      render();
      return;
   }

/* Quest 16's own "salvage" part — the SAME tunnelWarden template
(quest9's first boss, mudroot-content.js), not a new monster, closing
the loop on Act 2's very first named fight for its own finale. Gated on
tunnelWardenDefeated already being true (he's already been beaten once
for real; this is a deliberate re-fight) — winCombat()'s own
wasTunnelWarden branch tells the two apart by checking which was true
BEFORE this kill, not by a separate spawn flag. */
const tunnelWardenSalvageHunt = state.location==='rootcellar' && state.quest16Accepted && state.tunnelWardenDefeated && !state.drillRigSalvaged;
   if(tunnelWardenSalvageHunt && Math.random() < TUNNEL_WARDEN_SPAWN_CHANCE){
      startCombat(tunnelWarden);
      render();
      return;
   }

/* One generic check for every zone's own always-available zone-rare
(ZONE_RARE_MONSTERS, content.js) — unlike every *Hunt above, these
aren't quest-gated or one-time, so a single lookup covers all 15
zones instead of needing 15 near-identical copies of the blocks above.
Checked AFTER every quest-hunt (so an active quest hunt still takes
priority this adventure) and BEFORE the normal encounter roll below. */
const zoneRare = ZONE_RARE_MONSTERS[state.location];
   if(zoneRare && Math.random() < ZONE_RARE_SPAWN_CHANCE){
      startCombat(zoneRare);
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
      const { dmg: mitigatedDmg, absorbed, remaining } = applyDamageToPlayer(dmg);
      const armorClause = mitigatedDmg < dmg ? ` — armor blunts it to ${mitigatedDmg}` : '';
      const shieldClause = absorbed > 0
         ? `${armorClause ? ',' : ' —'} your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}`
         : '';
      log(`${evt.text} (-${dmg} HP${armorClause}${shieldClause})`, 'damage');
      checkDefeat();
   } else {
      const pool = noncombatEvents[state.location] || noncombatEvents.commons;
      const line = pool[Math.floor(Math.random()*pool.length)];
      log(line);
   }
   render();
}

/* Which combat sub-panel is showing: 'main' (Attack/Use/Flee) or 'spells'
(the spell+item menu opened via Use). Transient UI state, not saved — same
convention as devMode. Reset to 'main' whenever combat starts/ends so a
leftover open spellbook never bleeds into the next fight. */
let combatSubView = 'main';

/* Turns a monster template's beef/zip/grit/hoodoo (content.js — replaced
the old raw hp/atkMin/atkMax/dodgeChance fields entirely) into the numbers
startCombat() below actually spawns with, via statBonus() (core.js) same
as every player-side formula. No "level" term — unlike the player, a
monster's own stats don't grow over time, so its combat numbers are pure
functions of grit/beef/zip. hoodoo is deliberately unused here (see its
own comment, content.js) — a monster's skills[] keep their own
hand-authored magnitude regardless of hoodoo.

armor is derived here too (from grit + m.rare), NOT read off an authored
field — a monster object never carries its own armor: N literal at all.
Rare monsters use a steeper per-grit rate (MONSTER_RARE_ARMOR_PER_GRIT)
than regular trash (MONSTER_ARMOR_PER_GRIT), same "a boss should feel
different from a wild encounter of similar toughness" reasoning
dodgeChance/skills[] already apply via other means — see the constants'
own comment, content.js, for why this replaced an earlier hand-picked-
per-boss version. */
/* Zip's one formula, shared by both dodge AND accuracy, on both sides —
see ZIP_DODGE_COEFFICIENT/ZIP_DODGE_CAP's own comment (content.js) for
why this single function covers all four uses: the player's own dodge
(playerDodgeChance() below, called with the player's zip), a monster's
own dodge (deriveMonsterCombatStats() below, called with the monster's
zip), the player's accuracy against a monster's dodge
(applyDamageToMonster() below, called with the player's zip), and a
monster's accuracy against the player's dodge (playerDodgeChance()
below again, called with the ATTACKING monster's zip this time) —
same number, same meaning, whichever side rolls it. */
function zipDodgeAndAccuracy(zip){
   return Math.min(ZIP_DODGE_CAP, statBonus(zip || 0) * ZIP_DODGE_COEFFICIENT);
}

function deriveMonsterCombatStats(m){
   const hp = Math.max(1, Math.round(statBonus(m.grit || 0) * MONSTER_HP_PER_GRIT));
   const atkCenter = statBonus(m.beef || 0) * MONSTER_ATK_PER_BEEF;
   const atkMin = Math.max(1, Math.round(atkCenter * (1 - MONSTER_ATK_SPREAD)));
   const atkMax = Math.max(atkMin, Math.round(atkCenter * (1 + MONSTER_ATK_SPREAD)));
   const dodgeChance = zipDodgeAndAccuracy(m.zip);
   const armor = Math.round((m.grit || 0) * (m.rare ? MONSTER_RARE_ARMOR_PER_GRIT : MONSTER_ARMOR_PER_GRIT));
   return { hp, atkMin, atkMax, dodgeChance, armor };
}

/* Shared by applyDamageToPlayer()/applyDamageToMonster() below — armor's
own damage-mitigation fraction (0..ARMOR_REDUCTION_CAP, content.js), reusing
statBonus()'s own superlinear curve so armor "feels like" every other stat
at low-to-moderate values, but hard-capped so a hit can never be reduced
to nothing (see armor's own comment, content.js, for why this still reads
as "diminishing returns" in practice despite statBonus() itself being an
increasing-returns curve). */
function armorDamageReduction(armor){
   return Math.min(ARMOR_REDUCTION_CAP, statBonus(armor || 0) * ARMOR_REDUCTION_COEFFICIENT);
}

function startCombat(forceTemplate){
   const pool = monsters.filter(m => m.zone === state.location);
   const template = forceTemplate || pool[Math.floor(Math.random()*pool.length)];
   /* Scale the template's derived hp/atk/xp by its zone's ZONE_DIFFICULTY
   multiplier (content.js) — this is what actually makes later areas
   tougher than earlier ones; the template itself is left untouched so
   the next spawn re-reads the same baseline. Derive from stats BEFORE
   applying mult, same order the old raw-number version always used (mult
   applied to the final hp/atk, never to some earlier pre-formula value). */
const mult = ZONE_DIFFICULTY[template.zone] || 1;
   const derived = deriveMonsterCombatStats(template);
   const hp = Math.max(1, Math.round(derived.hp * mult));
   const atkMin = Math.max(1, Math.round(derived.atkMin * mult));
   const atkMax = Math.max(atkMin, Math.round(derived.atkMax * mult));
   const xp = Math.max(1, Math.round(template.xp * mult));
   /* dodgeChance/armor stay unscaled by mult — same treatment the old
   dodgeChance field always got (it passed through the old {...template}
   spread untouched; only hp/atk/xp were ever multiplied). */
   state.monster = { ...template, hp, maxHp: hp, atkMin, atkMax, xp, dodgeChance: derived.dodgeChance, armor: derived.armor };
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

/* Shared "player takes damage" resolution — armor (getEffectiveStats().armor,
gear-only, see core.js's SPENDABLE_STAT_KEYS comment) mitigates the RAW hit
first via armorDamageReduction() above, floored at 1 so it can never fully
negate a REAL hit (rawDmg<=0 stays exactly 0 rather than being floored up to
1 — the floor exists to stop armor from erasing an attack, not to invent
damage out of a monster that dealt none to begin with, e.g. a scripted
atkMin:0 test stand-in); state.shield (granted by Warding Charm or Shout,
both cast via castSpell() below) then absorbs what's left of THAT reduced
amount, hp only takes whatever's left after both. Applying armor before
shield means armor also stretches a shield's effective duration rather than
just overlapping it. Every place the player loses HP to an attack, a boss
debuff's own damage-over-time (applyPlayerStatusEffectForTurn() below), or a
hazard routes through this so armor/a shield protects reliably regardless
of source. Returns the actual post-armor `dmg` too, so a caller's own log
line can report what really landed rather than the pre-mitigation raw hit. */
function applyDamageToPlayer(rawDmg){
   const eff = getEffectiveStats();
   const dmg = rawDmg <= 0 ? 0 : Math.max(1, Math.round(rawDmg * (1 - armorDamageReduction(eff.armor))));
   const absorbed = Math.min(state.shield, dmg);
   state.shield -= absorbed;
   const remaining = dmg - absorbed;
   state.hp = Math.max(0, state.hp - remaining);
   return { dmg, absorbed, remaining };
}

/* Shared "monster takes damage" resolution, mirroring applyDamageToPlayer()
above — a monster's own dodgeChance (content.js monster data, e.g. the
Casino Trial's casinoChampion) gets one roll here regardless of whether
the damage came from an Attack (playerAttack()) or a spell (castSpell()),
so any future evasive monster gets this for free from either source.
guaranteedHit skips the roll entirely for a landed sneak attack —
"catching them off guard" shouldn't then let them dodge the very swing
that caught them off guard.

Per explicit request, the player's own zip works as ACCURACY here too,
not just as their own dodge/miss-chance elsewhere — it cancels out some
of whatever dodgeChance the monster is rolling with, via the same
zipDodgeAndAccuracy() formula (combat.js) evaluated on the PLAYER's zip
instead of the monster's. A player with high zip meaningfully counters
even a highly evasive monster; floored at 0 so a big accuracy edge can
only ever zero out dodge, never go negative/"extra guaranteed" beyond
that. */
function applyDamageToMonster(rawDmg, guaranteedHit){
   const playerAccuracy = zipDodgeAndAccuracy(getEffectiveStats().zip);
   const effectiveDodgeChance = Math.max(0, (state.monster.dodgeChance || 0) - playerAccuracy);
   if(!guaranteedHit && effectiveDodgeChance && Math.random() < effectiveDodgeChance){
      return { dodged: true, dealt: 0 };
   }
   /* Armor (state.monster.armor — new stat block field, content.js/
   startCombat() above) mitigates the raw hit the same way the player's own
   armor does, floored at 1 so it can never fully negate a REAL swing —
   same rawDmg<=0 exception as applyDamageToPlayer()'s own comment above,
   so a genuinely 0-damage hit (a scripted atkMin:0 test stand-in; no real
   monster can roll this, since deriveMonsterCombatStats() already floors
   atkMin at 1) stays 0 rather than manufacturing a hit out of nothing.
   Every caller (playerAttack()'s primary swing and Card Shark's second
   swing, castSpell()'s 'damage' branch) needs to log the RETURNED `dealt`
   amount, not its own local pre-mitigation damage variable, or the log
   text and the monster's actual HP change would disagree. */
   const dealt = rawDmg <= 0 ? 0 : Math.max(1, Math.round(rawDmg * (1 - armorDamageReduction(state.monster.armor))));
   state.monster.hp = Math.max(0, state.monster.hp - dealt);
   return { dodged: false, dealt };
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

/* Shared by monsterAutoAttack() and useMonsterSkill()'s 'bolt' branch
below — the normal Zip-based roll, plus EVASION_DODGE_BONUS
(content.js) on top while state.evasionActive holds either evade
spell's own id (castSpell()'s 'evade' branch below), capped at
EVASION_DODGE_CAP instead of the normal 0.5 ceiling so Smoke Screen/
Illusion actually deliver the "dramatic" boost they're meant to.
Whichever spell is active gets its own Level 2 check here
(state.spellsUpgraded, core.js) — the bonus itself is what a Hexpert's
Sanctum-bought Illusion upgrade actually scales, since 'evade' has no
other single number to bump the way damage/heal/ward do. */
/* Per explicit request, zip is accuracy as well as dodge — whichever
monster is currently attacking cancels out some of the player's own
base zip-dodge with ITS OWN zip, same zipDodgeAndAccuracy() formula
(combat.js) evaluated on the monster's zip this time, floored at 0 so
a high-accuracy monster can zero out dodge but never push it negative.
Read directly off state.monster rather than taking a parameter — every
caller of this function is already mid-combat, so state.monster is
always the one attacking. Deliberately only reduces the BASE zip-dodge,
not the evasion-spell bonus added below — Smoke Screen/Illusion is a
magic trick, not footwork, so a monster's plain accuracy doesn't cut
into it the same way. */
function playerDodgeChance(){
   const eff = getEffectiveStats();
   const attackerAccuracy = state.monster ? zipDodgeAndAccuracy(state.monster.zip) : 0;
   const base = Math.max(0, zipDodgeAndAccuracy(eff.zip) - attackerAccuracy);
   if(!state.evasionActive) return base;
   const bonus = state.spellsUpgraded.includes(state.evasionActive) ? EVASION_DODGE_BONUS * SPELL_UPGRADE_MULTIPLIER : EVASION_DODGE_BONUS;
   return Math.min(EVASION_DODGE_CAP, base + bonus);
}
/* "the smoke"/"the illusion" — the one word that differs between Smoke
Screen's and Illusion's own dodge-flavor log lines below, keyed off
state.evasionActive's own id rather than duplicating each full
sentence per spell. */
function evasionFlavorNoun(){
   return state.evasionActive === 'illusion' ? 'the illusion' : 'the smoke';
}
/* Shared by every branch in castSpell() below that scales its own
effect off SPELL_UPGRADE_MULTIPLIER (content.js) — Hexpert's Level 2
Arcane Sanctum upgrade, per spell id. */
function isSpellUpgraded(id){
   return state.spellsUpgraded.includes(id);
}

/* A monster's default turn: try to hit the player, worn down by the
player's own Zip-based dodge chance same as always. Boosted by a prior
'buff' skill use (state.monster.buffTurnsLeft/buffMult, set in
useMonsterSkill() below) until it ticks back down to 0. */
function monsterAutoAttack(){
   if(Math.random() < playerDodgeChance()){
      log(state.evasionActive
          ? `Still hidden in ${evasionFlavorNoun()}, you dodge ${state.monster.name}'s counterattack completely.`
          : `You dodge ${state.monster.name}'s counterattack completely.`);
      tickMonsterBuff();
      return;
   }
   let mdmg = randInt(state.monster.atkMin, state.monster.atkMax);
   if(state.monster.buffTurnsLeft > 0) mdmg = Math.round(mdmg * (state.monster.buffMult || 1.5));
   const { dmg, absorbed, remaining } = applyDamageToPlayer(mdmg);
   /* Composed rather than nested ternaries so all 4 combinations (neither/
   armor only/shield only/both mitigating) read cleanly — armor blunts the
   RAW mdmg first, then a shield absorbs whatever's left of that. */
   const armorClause = dmg < mdmg ? ` Armor blunts it to ${dmg}.` : '';
   const shieldClause = absorbed > 0
      ? ` Your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
      : '';
   log(`${capitalize(state.monster.name)} retaliates for ${mdmg} damage.${armorClause}${shieldClause}`, 'damage');
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

/* Plays out one turn of state.playerStatusEffect (a boss's own 'debuff'
skill, useMonsterSkill() above) — called once at the very start of
EVERY player turn that costs a turn (playerAttack()/a damage spell/an
item use, mirroring exactly which actions provoke monsterRetaliate()),
so a debuff ticks down on "a set number of attacks" regardless of
whether that attack then hits, misses, or gets spent on an item
instead. Burn/poison deal their own damage to the player immediately
(same shield-absorption path as a monster's own retaliation,
applyDamageToPlayer()); freeze instead hands back a damage multiplier
for the CALLER to apply to whatever it's about to deal out this turn —
it doesn't hurt on its own, it just saps the swing. Only one effect
slot (state.playerStatusEffect itself, not this function) means a
fresh debuff always overwrites rather than stacking. Returns
{defeated} so a burn/poison tick that drops HP to 0 stops the caller
from still landing an attack that same turn — same "already lost, no
bonus swing" rule checkDefeat() enforces everywhere else. */
function applyPlayerStatusEffectForTurn(){
   const fx = state.playerStatusEffect;
   if(!fx) return { defeated: false, dmgMult: 1 };
   let dmgMult = 1;
   if(fx.type === 'freeze'){
      dmgMult = 1 - fx.dmgReduction;
      log(`The cold still in your limbs saps the swing (${fx.turnsLeft} attack${fx.turnsLeft===1?'':'s'} left).`);
   } else {
      const { dmg, absorbed, remaining } = applyDamageToPlayer(fx.dmgPerTurn);
      const label = fx.type === 'burn' ? 'burn' : 'poison';
      const armorClause = dmg < fx.dmgPerTurn ? ` Armor blunts it to ${dmg}.` : '';
      const shieldClause = absorbed > 0
         ? ` Your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
         : '';
      log(`The ${label} still in you deals ${fx.dmgPerTurn} damage.${armorClause}${shieldClause} (${fx.turnsLeft} attack${fx.turnsLeft===1?'':'s'} left).`, 'damage');
   }
   fx.turnsLeft--;
   if(fx.turnsLeft <= 0) state.playerStatusEffect = null;
   return { defeated: state.hp <= 0, dmgMult };
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
   } else if(skill.type==='debuff'){
      /* Inflicts a lingering status on the PLAYER instead of a normal
      attack this turn — see state.playerStatusEffect's own comment
      (core.js) and applyPlayerStatusEffectForTurn() below for how it
      actually plays out. Overwrites whatever was already active, same
      no-stacking simplicity as the 'buff' branch above. */
      state.playerStatusEffect = { type: skill.debuffType, turnsLeft: skill.debuffTurns, dmgPerTurn: skill.dmgPerTurn, dmgReduction: skill.dmgReduction };
      log(`${capitalize(state.monster.name)} ${skill.flavor}.`);
   } else if(skill.type==='bolt'){
      if(Math.random() < playerDodgeChance()){
         log(state.evasionActive
             ? `Still hidden in ${evasionFlavorNoun()}, you dodge ${state.monster.name}'s ${skill.flavor} completely.`
             : `You dodge ${state.monster.name}'s ${skill.flavor} completely.`);
      } else {
         const dmg = randInt(skill.boltMin, skill.boltMax);
         const { dmg: mitigatedDmg, absorbed, remaining } = applyDamageToPlayer(dmg);
         const armorClause = mitigatedDmg < dmg ? ` Armor blunts it to ${mitigatedDmg}.` : '';
         const shieldClause = absorbed > 0
            ? ` Your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
            : '';
         log(`${capitalize(state.monster.name)} ${skill.flavor} for ${dmg} damage.${armorClause}${shieldClause}`, 'damage');
      }
   }
}

function playerAttack(){
   if(!state.inCombat) return;
   /* The active evade spell (castSpell()'s 'evade' branch) breaks the
   instant you swing back — cleared before anything else below so this
   same attack's own retaliation roll (monsterRetaliate(), further
   down) resolves at normal odds, not the boosted ones. */
   if(state.evasionActive){
      log(state.evasionActive === 'illusion'
          ? "Swinging back gives away which copy is real — the illusion collapses."
          : "Swinging back gives away your position — the smoke clears.");
      state.evasionActive = null;
   }
   /* A lingering boss debuff (state.playerStatusEffect) ticks on THIS
   turn regardless of what happens next — before the miss roll, so a
   burn/poison tick still lands on a turn that then whiffs, and before
   the damage roll below, so freeze's own dmgMult actually applies to
   it. A tick that drops HP to 0 ends the turn right here, same
   "already lost, no bonus swing" rule as every other defeat path. */
   const statusFx = applyPlayerStatusEffectForTurn();
   if(statusFx.defeated){ checkDefeat(); render(); return; }
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
   /* Freeze's own dmgMult (applyPlayerStatusEffectForTurn() above) saps
   this base roll before any class bonus multiplies it further, same
   ordering as every other per-turn modifier here. */
   dmg = Math.round(dmg * statusFx.dmgMult);
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

   const { dodged, dealt } = applyDamageToMonster(dmg, sneakAttackLands);
   if(dodged){
      log(`${capitalize(state.monster.name)} slips out of the way — ${weaponName} finds nothing but air.`);
   } else {
      log(sneakAttackLands
          ? `You catch ${state.monster.name} completely off guard with ${weaponName} — a critical opening strike for ${dealt} damage!`
          : `You strike ${state.monster.name} with ${weaponName} for ${dealt} damage.`);
      if(state.monster.hp<=0){
         winCombat();
         return;
      }
   }

   /* Meathead's class skill: a flat per-level chance
   (MEATHEAD_STAGGER_CHANCE, content.js) for a LANDED hit to stagger the
   monster hard enough that it skips its own retaliation this turn —
   reuses the exact mechanism the opening-swing sneak attack already
   uses to deny retaliation (see the `if(!sneakAttackLands...` line
   below), just as a second, independent, class-exclusive condition on
   the same check rather than a new system. Gated on `!dodged` since
   staggering requires actually connecting — a dodge can't stagger
   anything. */
   const staggerLands = state.classTitle === 'Meathead' && !dodged
      && Math.random() < MEATHEAD_STAGGER_CHANCE[state.classSkillLevel];
   if(staggerLands) log(`The blow staggers ${state.monster.name} — it won't be swinging back this turn.`);

   /* Card Shark's class skill: a flat per-level chance
   (CARD_SHARK_DOUBLE_ATTACK_CHANCE, content.js) to get a second full
   swing in the same turn — rolled once per Attack, independent of
   whether the first swing above hit/missed/dodged. The second swing
   skips the missChance/sneak-attack rolls above (it's a bonus swing on
   top of the turn that already happened, not a second independent
   turn) but still rolls the monster's own dodge via
   applyDamageToMonster(). Only ONE monster retaliation happens for the
   whole turn either way — see the `if(!sneakAttackLands && !staggerLands)`
   line below, gating on the FIRST swing's sneak-attack/stagger rolls
   only, same "landing it denies retaliation" rule as before. */
   if(state.classTitle === 'Card Shark' && Math.random() < CARD_SHARK_DOUBLE_ATTACK_CHANCE[state.classSkillLevel]){
      const dmg2 = Math.round((randInt(3,7) + (state.level-1) + statBonus(eff.beef)) * statusFx.dmgMult);
      const { dodged: dodged2, dealt: dealt2 } = applyDamageToMonster(dmg2, false);
      if(dodged2){
         log(`Quick as a card trick, you come back around for a second swing with ${weaponName} — ${state.monster.name} slips out of the way again.`);
      } else {
         log(`Quick as a card trick, you swing ${weaponName} again for ${dealt2} damage.`);
         if(state.monster.hp<=0){
            winCombat();
            return;
         }
      }
   }

if(!sneakAttackLands && !staggerLands) monsterRetaliate();
   checkDefeat();
   render();
}

/* ---------------- Spells ---------------- */
/* No longer gated on state.spellsKnown.length — this menu also lists
usable HP/MP/luck consumables now (renderSpellMenu(), render-character.js),
so a spell-less player carrying potions still has a reason to open it.
use-btn's own disabled state (render.js) covers "nothing to do here
at all" instead. */
function openSpellMenu(){
   if(!state.inCombat) return;
   combatSubView = 'spells';
   render();
}
function closeSpellMenu(){
   combatSubView = 'main';
   render();
}

/* The in-combat half of item use — mirrors castSpell()'s damage-spell
branch: costs the turn (one monsterRetaliate() call), same "once per
turn" rule Attack/Use already enforce. useItem() (player-actions.js)
is the free, no-turn-cost version for outside combat; this is the only
way to use a consumable mid-fight, which is what actually stops a
player from chain-eating a whole stack of potions in one turn. */
function useItemInCombat(idx){
   if(!state.inCombat) return;
   const item = state.inventory[idx];
   if(!item || !['hp','mp','luck'].includes(item.type)) return;
   applyConsumableEffect(item);
   state.inventory.splice(idx,1);
   combatSubView = 'main';
   /* Ticked AFTER the item's own effect, unlike playerAttack()/castSpell()
   ticking BEFORE theirs — an item use is usually a reaction to being in
   trouble, so a burn/poison tick shouldn't cancel out the very potion
   drunk to survive it. Item use never deals monster damage, so
   dmgMult is irrelevant here — only {defeated} matters. */
   const itemStatusFx = applyPlayerStatusEffectForTurn();
   if(itemStatusFx.defeated){ checkDefeat(); render(); return; }
   monsterRetaliate();
   checkDefeat();
   render();
}

function castSpell(id){
   const spell = spells.find(s=>s.id===id);
   if(!spell) return;
   /* Only 'damage' spells need a monster to target — every other type
   (heal/ward/shout/buff) is castable from the Character page too
   (renderCastableSpellsBlock(), class-spells.js), not just mid-combat.
   That's also why only 'damage' calls monsterRetaliate() below: a
   damage spell is a combat action that costs you your turn the same
   way a physical Attack does, but heal/ward/shout/buff are meant to be
   free actions — cast one mid-fight and the monster doesn't get a
   bonus swing out of it, same as if you'd cast it from the Character
   page between fights. */
   /* 'evade' (Smoke Screen) needs a fight to apply to, same reasoning as
   'damage' needing a monster to target — see the comment above. */
   if((spell.type==='damage' || spell.type==='evade') && !state.inCombat) return;
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
   /* Same "your own aggression breaks the cloud" rule playerAttack() enforces
   — a damage spell costs a turn and provokes retaliation just like a
   physical Attack, so it closes the evade window exactly the same way
   (see EVASION_DODGE_BONUS's own comment, content.js). */
   if(state.evasionActive){
      log(state.evasionActive === 'illusion'
          ? "Swinging back gives away which copy is real — the illusion collapses."
          : "Swinging back gives away your position — the smoke clears.");
      state.evasionActive = null;
   }
   /* Same per-turn debuff tick as playerAttack() — a damage spell costs
   a turn exactly like a physical Attack, so it ticks state.playerStatus
   Effect the same way (and a burn/poison tick that drops HP to 0 ends
   the turn here too, before the spell itself resolves). */
   const spellStatusFx = applyPlayerStatusEffectForTurn();
   if(spellStatusFx.defeated){ checkDefeat(); render(); return; }
   let dmg = Math.round((randInt(spell.dmgMin, spell.dmgMax) + (state.level-1) + statBonus(eff.hoodoo)) * spellStatusFx.dmgMult);
   if(state.classTitle === 'Hexpert') dmg += HEXPERT_SPELL_DMG_BONUS[state.classSkillLevel];
   /* This spell's own Level 2 upgrade (SPELL_UPGRADE_MULTIPLIER,
   content.js) — applied here, after the flat class bonus but before
   the Arcane Focus multiplier below, so it scales the base roll +
   passive bonus together, same ordering reasoning as that multiplier's
   own comment just below. */
   if(isSpellUpgraded(spell.id)) dmg = Math.round(dmg * SPELL_UPGRADE_MULTIPLIER);
   /* Arcane Focus buff (content.js's spells[], classRequired:'Hexpert') —
   applied AFTER the flat HEXPERT_SPELL_DMG_BONUS line above so the
   multiplier scales the whole total (base roll + passive bonus), not
   just the base roll — chosen to mirror how Adrenaline Rush stacks on
   top of MEATHEAD_DAMAGE_BONUS in playerAttack() rather than diverge. */
   if(state.classBuffFightsLeft > 0 && state.classTitle === 'Hexpert') dmg = Math.round(dmg * 1.5);
   const { dodged, dealt } = applyDamageToMonster(dmg, false);
   if(dodged){
      log(`You cast ${spell.name}, but ${state.monster.name} isn't where the bolt lands.`);
   } else {
      log(`You cast ${spell.name} — ${capitalize(state.monster.name)} takes ${dealt} damage.`);
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
   /* Hexpert's class skill: a flat per-level chance (HEXPERT_ECHO_CHANCE,
   content.js) to immediately echo-cast this same spell again at half
   power (HEXPERT_ECHO_DAMAGE_MULT), zero extra MP cost — rolled once per
   cast regardless of whether the main cast above hit or was dodged
   (reaching this line at all already means the monster survived that
   one), same "independent of the first swing's own outcome" shape as
   Card Shark's double-attack in playerAttack(). Still rolls its own
   dodge via applyDamageToMonster() and can still finish the monster off;
   only ONE monsterRetaliate() happens for the whole turn either way —
   this resolves before that single call below, same ordering Card
   Shark's bonus swing uses relative to its own retaliation line. */
   if(state.classTitle === 'Hexpert' && Math.random() < HEXPERT_ECHO_CHANCE[state.classSkillLevel]){
      const echoDmg = Math.round(dmg * HEXPERT_ECHO_DAMAGE_MULT);
      const { dodged: dodged2, dealt: dealt2 } = applyDamageToMonster(echoDmg, false);
      if(dodged2){
         log(`${spell.name} echoes a half-beat late — ${state.monster.name} slips out of the way this time.`);
      } else {
         log(`${spell.name} echoes a half-beat late, for ${dealt2} more damage.`);
         if(state.monster.hp<=0){
            winCombat();
            return;
         }
      }
   }
   monsterRetaliate();
} else if(spell.type==='heal'){
   /* SPELL_UPGRADE_MULTIPLIER (content.js) applies to whichever single
   number IS that spell's own effect — for 'heal' that's healValue
   itself. Same isSpellUpgraded() check reused across every branch
   below rather than re-deriving state.spellsUpgraded.includes(spell.id)
   each time. */
   const healAmt = Math.round(spell.healValue * (isSpellUpgraded(spell.id) ? SPELL_UPGRADE_MULTIPLIER : 1));
   const before = state.hp;
   state.hp = Math.min(state.maxHp, state.hp+healAmt);
   log(`You cast ${spell.name} and patch yourself up. (+${state.hp-before} HP)`);
} else if(spell.type==='ward'){
   /* Grants a persistent shield (applyDamageToPlayer(), above) instead of
   just softening this one retaliation — Hoodoo-scaled, boosted further
   by classSkillLevel for a Hexpert (same lever that boosts their spell-
   damage bonus). Stacks on repeat casts; only spent when something
   actually hits. */
   let shieldAmount = 8 + statBonus(eff.hoodoo)*2 + (state.classTitle==='Hexpert' ? state.classSkillLevel*10 : 0);
   if(isSpellUpgraded(spell.id)) shieldAmount = Math.round(shieldAmount * SPELL_UPGRADE_MULTIPLIER);
   state.shield += shieldAmount;
   log(`You cast ${spell.name} — a shimmering barrier settles over you. (+${shieldAmount} Shield)`);
} else if(spell.type==='buff'){
   /* 'buff' has no single magnitude to scale the way heal/ward/damage
   do (its own effect — e.g. Arcane Focus's spell-damage multiplier —
   is hardcoded where THAT effect actually applies, not here), so its
   own Level 2 upgrade instead extends how long it lasts. */
   const buffFights = isSpellUpgraded(spell.id) ? Math.ceil(CLASS_BUFF_FIGHTS * SPELL_UPGRADE_MULTIPLIER) : CLASS_BUFF_FIGHTS;
   state.classBuffFightsLeft = buffFights;
   log(`You cast ${spell.name} — the next ${buffFights} fights are yours.`);
} else if(spell.type==='shout'){
   /* Meathead-exclusive — a small, mostly-flat shield, NOT scaled off
   statBonus(beef) the way 'ward' scales off Hoodoo. Beef is this class's
   primary combat stat already (playerAttack()'s own damage formula), so
   scaling the shield off it too double-dipped the exact same investment
   into a second, unrelated payoff — at high Beef the shield ballooned
   into effective invincibility instead of the small "braces for impact"
   utility it's meant to be. classSkillLevel still grows it a little,
   same lever that grows MEATHEAD_DAMAGE_BONUS, just capped small. */
   const shieldAmount = 5 + state.classSkillLevel*3;
   state.shield += shieldAmount;
   log(`You let out a bone-rattling shout, bracing for whatever's coming. (+${shieldAmount} Shield)`);
} else if(spell.type==='evade'){
   /* Smoke Screen/Illusion — see EVASION_DODGE_BONUS's own comment
   (content.js) for the full reasoning. Stores the spell's own id
   rather than a plain flag (state.evasionActive's own comment, core.js)
   — that's what lets playerDodgeChance() apply the RIGHT spell's Level
   2 upgrade, and evasionFlavorNoun() pick the right flavor word. No
   fights-left counter like 'buff' above: this doesn't persist past the
   current fight at all, so there's nothing to count down — endCombat()
   clears it unconditionally the moment this encounter ends, and
   playerAttack()/the 'damage' branch above clear it early if the
   player swings back first. Re-casting while already active just
   re-confirms it (harmless). */
   state.evasionActive = spell.id;
   log(spell.id==='illusion'
       ? `You cast ${spell.name} — a dozen flickering copies of yourself scatter outward. Don't swing back if you want them to hold.`
       : `You cast ${spell.name} — kick up a cloud of grit and vanish into it. Don't swing back if you want to stay hidden.`);
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

/* Which town building teaches a given class's Act 1 buff spell — same
class->building mapping as levelUpClassSkill()'s atRightBuilding check
(guild.js), mirrored here rather than invented separately. The 4 original
spells (no classRequired) have no entry here and fall back to 'hoodoo'
below, unchanged from before this spell type existed. A spell's own
`learnLocation` (content.js's spells[] — the 3 Act 2 spells) overrides
this default, so the same class can have spells taught in two different
buildings (its Act 1 trainer here, its Act 2 trainer in Gnometropolis)
without this map needing to become a list. */
const CLASS_SPELL_LOCATION = { 'Meathead':'guild', 'Card Shark':'casino', 'Hexpert':'hoodoo' };
/* Flavor for the "who taught you this" log line — keyed by the actual
resolved location (not classRequired) so the Act 2 trainers get their
own line instead of misreporting "The Guild" while standing in the
Garrison. */
const CLASS_SPELL_TRAINER = { guild:'The Guild', casino:'The Casino', hoodoo:'The Hoodoo Doctor', garrison:'The Garrison', roguesden:"The Rogues' Den", sanctum:'The Arcane Sanctum' };

function learnSpell(id){
   const spell = spells.find(s=>s.id===id);
   if(!spell || state.spellsKnown.includes(id)) return;
   const requiredLocation = spell.learnLocation || (spell.classRequired ? CLASS_SPELL_LOCATION[spell.classRequired] : 'hoodoo');
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
   log(`${CLASS_SPELL_TRAINER[requiredLocation] || 'The Hoodoo Doctor'} teaches you ${spell.name}. (-${price} Pop Tabs)`);
   render();
}

/* Hexpert's own Level 2 spell upgrade, Arcane Sanctum-exclusive per
explicit request — covers EVERY spell a Hexpert knows, not just the
ones actually taught at the Sanctum (Hex Bolt/Bottled Fury/Mending
Charm/Warding Charm were all learned elsewhere; a Hexpert's own
Arcane Focus/Arcane Lance/Illusion were learned at Hoodoo/here).
spellUpgradeCost()/SPELL_UPGRADE_MULTIPLIER (content.js) — one flat
tier, applied per spell type in castSpell()'s own branches above. */
function upgradeSpell(id){
   if(state.location !== 'sanctum' || state.classTitle !== 'Hexpert') return;
   const spell = spells.find(s=>s.id===id);
   if(!spell || !state.spellsKnown.includes(id) || state.spellsUpgraded.includes(id)) return;
   const cost = spellUpgradeCost(spell);
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.spellsUpgraded.push(id);
   clearLog();
   log(`${spell.name} deepens — its own effect grows by ${Math.round((SPELL_UPGRADE_MULTIPLIER-1)*100)}%. (-${cost} Pop Tabs)`);
   render();
   autosave();
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
      const { dmg, absorbed, remaining } = applyDamageToPlayer(mdmg);
      const armorClause = dmg < mdmg ? ` Armor blunts it to ${dmg}.` : '';
      const shieldClause = absorbed > 0
         ? ` Your shield absorbs ${absorbed}${remaining>0 ? `, ${remaining} gets through` : ' entirely'}.`
         : '';
      log(`You fail to escape. ${capitalize(state.monster.name)} gets a free hit for ${mdmg}.${armorClause}${shieldClause}`, 'damage');
      checkDefeat();
   }
   render();
}

/* Scales a monster's authored gearDrop (content.js — always the tier-1
baseline, 1 stat) up to a randomly-rolled tier per GEAR_DROP_TIER_CHANCE
(content.js), weighted toward the lower tiers. Tier 2/3 each add +1 to
the primary stat and one more secondary stat (STAT_ROTATION,
content.js), rolled via rollSecondaryStatValue (economy.js) — half the
(post-tier-bump) primary value up to the full value, same scaling
rollShopGearStats uses — so a monster-dropped item at a given tier
reads the same way a shop item at that tier would. Name/desc/slot/icon
are untouched — only `bonus`/`tier`/`levelReqBase` change with the roll.

levelReqBase carries the zone's own UNROLLED baseline value through to
getGearRequirements() (item-tiers.js) — per explicit correction, a
drop's level requirement should track which ZONE it came from, not
which rarity tier the roll happened to land on. Without this, the same
Root Cellar kill could demand level 12 (a common drop) or level 16 (a
lucky rare one) purely off the tier roll, even though the rare drop is
still, by definition, Root Cellar gear — a player farming exactly the
zone the game recommends could get "rewarded" with an item they can't
equip yet. Rarity still means more power (the +1/+2 tier bump, extra
secondary stats) — it just no longer means a higher gate too. */
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
   const levelReqBase = baseDrop.bonus[primaryStat];
   const primaryValue = levelReqBase + tierIndex;
   const bonus = { [primaryStat]: primaryValue };
   const secondaryStats = STAT_ROTATION[primaryStat].slice(0, tierIndex);
   secondaryStats.forEach(stat => { bonus[stat] = rollSecondaryStatValue(primaryValue); });
   return ensureGearArmor({ ...baseDrop, bonus, tier: GEAR_DROP_TIER_NAMES[tierIndex], levelReqBase });
}

function winCombat(){
   const defeatedName = state.monster.name;
   const xpGain = state.monster.xp;
   /* Bestiary discovery — see state.monstersSeen's own comment
   (core.js). Unlocked on DEFEAT specifically, per explicit correction
   (not merely encountering it, startCombat()) — fleeing or losing
   doesn't count. NAMED_BOSSES (content.js) covers every rare/boss/
   zone-rare monster; monsters[] covers every regular one. Just the
   silent recording here — the completion-bonus check/log moves below,
   after this function's own clearLog(), for the same reason the
   rareDropsSeen bonus log does (a log() call made before that point
   would just get wiped by it). */
   const isNewMonsterDiscovery = !state.monstersSeen.includes(defeatedName);
   if(isNewMonsterDiscovery) state.monstersSeen.push(defeatedName);
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
   const wasTunnelWarden = !!state.monster.rare && state.monster.name === tunnelWarden.name;
   const wasWarrenScout = !!state.monster.rare && state.monster.name === warrenScout.name;
   const wasTunnelMoleInformant = !!state.monster.rare && state.monster.name === tunnelMoleInformant.name;
   const wasSeniorClerk = !!state.monster.rare && state.monster.name === seniorClerk.name;
   const wasGearworksForeman = !!state.monster.rare && state.monster.name === gearworksForeman.name;
   const wasBureauQuartermaster = !!state.monster.rare && state.monster.name === bureauQuartermaster.name;
   const wasQuenchMaster = !!state.monster.rare && state.monster.name === quenchMaster.name;
   /* Any of gauntlet.js's own GAUNTLETS entries (the Ledger Committee/
   the Mole Council) — {id, isFinalBoss} for a guard OR that gauntlet's
   own finalBoss, null for every other monster in the game. Generalizes
   what the Palace Gauntlet's own hand-written wasPalaceGuard/
   wasRealGnomeKing pair does below, so a THIRD gauntlet never needs its
   own matching pair of consts here — just a new GAUNTLETS entry. */
   const gauntletMatch = !!state.monster.rare ? matchGauntletKill(state.monster.name) : null;
   /* Which of the 5 palace gauntlet guards (PALACE_GUARDS, content.js)
   this was, if any — -1 when it wasn't one of them. Used below to both
   log a distinct "guards left" message and advance
   palaceGauntletProgress (guild.js) exactly once per guard kill. */
   const palaceGuardIndex = !!state.monster.rare ? PALACE_GUARDS.findIndex(g => g.name === state.monster.name) : -1;
   const wasPalaceGuard = palaceGuardIndex !== -1;
   /* Captured BEFORE the wasTunnelWarden branch below mutates
   state.tunnelWardenDefeated — true on ANY re-fight of him (used for
   picking the "again" flavor line below, regardless of whether the
   salvage part was already claimed on an even earlier re-fight). */
   const wasTunnelWardenRekill = !!state.monster.rare && state.monster.name === tunnelWarden.name && state.tunnelWardenDefeated;
   /* Stricter than the rekill check above — only true on the ONE
   re-fight that should actually grant the salvage part. Without the
   !drillRigSalvaged guard here, fighting him a third time (after
   already salvaging the part once) would silently hand over a
   duplicate drillRig every time. */
   const wasTunnelWardenSalvage = wasTunnelWardenRekill && !state.drillRigSalvaged;
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
   /* Quest 16's own guaranteed-drop part — same multi-copy shape as
   needsVeinIngredient above, just a single-entry array (only one
   monster, the slag-hauler, drops it) since the other two parts are
   collected entirely differently (a salvage re-hunt, a straight
   purchase — see drilldozerIngredients' own comment, content.js). */
   const drilldozerIngredient = drilldozerIngredients.find(d => d.monsterName === state.monster.name);
   const needsDrilldozerIngredient = drilldozerIngredient && state.quest16Accepted && !state.quest16Complete
   && state.inventory.filter(it => it.key === drilldozerIngredient.item.key).length < DRILLDOZER_PLATING_NEEDED;
   /* The three Gnometropolis district guardians (content.js) always carry
   their class's PALACE_GATE_GEAR item as state.monster.loot (see that
   file's comment) — this is what turns it into a guaranteed drop instead
   of the generic 70% roll below, same guarantee tier as a quest item. */
   const isDistrictGuardianKill = wasGarrisonGuardian || wasRoguesDenEnforcer || wasArcaneSanctumGuardian;
   const lootRoll = needsPotionIngredient
   ? potionIngredient.item
      : needsVeinIngredient
   ? veinIngredient.item
      : needsDrilldozerIngredient
   ? drilldozerIngredient.item
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
   if(isNewMonsterDiscovery && !state.allMonstersBonusClaimed){
      const totalMonsters = monsters.length + NAMED_BOSSES.length;
      if(state.monstersSeen.length >= totalMonsters){
         state.allMonstersBonusClaimed = true;
         state.popTabs += 100;
         log(`You've laid eyes on every creature in the Loathsome Lands! The Guild wires you a congratulatory bonus. (+100 Pop Tabs)`);
      }
   }
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
      state.garrisonGuardianDefeated = true;
      log(`You defeat ${defeatedName}! The Garrison falls silent behind you. (+${xpGain} XP)`);
   } else if(wasRoguesDenEnforcer){
      state.roguesDenEnforcerDefeated = true;
      log(`You defeat ${defeatedName}! Nobody in the Rogues' Den saw where you went. (+${xpGain} XP)`);
   } else if(wasArcaneSanctumGuardian){
      state.arcaneSanctumGuardianDefeated = true;
      log(`You defeat ${defeatedName}! The Sanctum's wards flicker and go dark. (+${xpGain} XP)`);
   } else if(wasTunnelWarden){
      state.tunnelWardenDefeated = true;
      if(wasTunnelWardenSalvage) state.drillRigSalvaged = true;
      log(wasTunnelWardenRekill
          ? `You defeat ${defeatedName} again! His old rig is still down here, exactly where you left him. (+${xpGain} XP)`
          : `You defeat ${defeatedName}! Something further in goes very quiet, like it just noticed you're still coming. (+${xpGain} XP)`);
   } else if(wasWarrenScout){
      state.warrenScoutDefeated = true;
      log(`You defeat ${defeatedName}! Whatever it was watching for, it isn't reporting back now. (+${xpGain} XP)`);
   } else if(wasTunnelMoleInformant){
      state.tunnelMoleInformantDefeated = true;
      /* Whichever of the two quest10 rare hunts is defeated FIRST sets
      the path — checked so the second one, whenever it happens, never
      overwrites it. Deliberately vague: no zone name, no hint at what
      the path actually unlocks. */
      if(!state.quest10Path) state.quest10Path = 'informant';
      log(`You defeat ${defeatedName}! Whatever it was so nervous about, it talked before the end. (+${xpGain} XP)`);
   } else if(wasSeniorClerk){
      state.seniorClerkDefeated = true;
      if(!state.quest10Path) state.quest10Path = 'ledger';
      log(`You defeat ${defeatedName}! The ledger it was guarding is yours now, for whatever that's worth. (+${xpGain} XP)`);
   } else if(wasGearworksForeman){
      state.gearworksForemanDefeated = true;
      log(`You defeat ${defeatedName}! The clipboard hits the floor, one line still unfinished: a destination. (+${xpGain} XP)`);
   } else if(wasBureauQuartermaster){
      state.bureauQuartermasterDefeated = true;
      log(`You defeat ${defeatedName}! Every shipment, every stamp, all of it finally accounted for. (+${xpGain} XP)`);
   } else if(wasQuenchMaster){
      state.quenchMasterDefeated = true;
      log(`You defeat ${defeatedName}! The trough goes still, steam curling off the surface one last time. (+${xpGain} XP)`);
   } else if(gauntletMatch && !gauntletMatch.isFinalBoss){
      /* Advances that ONE gauntlet's own counter — gauntlet.js's
      approachGauntlet() reads this same object to decide whether the
      next click faces the next guard or the final boss. */
      gauntletProgress[gauntletMatch.id] = (gauntletProgress[gauntletMatch.id] || 0) + 1;
      const cfg = GAUNTLETS[gauntletMatch.id];
      const guardsLeft = cfg.guards.length - gauntletProgress[gauntletMatch.id];
      log(`You defeat ${defeatedName}! ${cfg.guardDefeatLine(guardsLeft)} (+${xpGain} XP)`);
   } else if(gauntletMatch && gauntletMatch.isFinalBoss){
      const cfg = GAUNTLETS[gauntletMatch.id];
      state[cfg.doneFlag] = true;
      log(`You defeat ${defeatedName}! ${cfg.finalVictoryLine} (+${xpGain} XP)`);
   } else if(wasPalaceGuard){
      /* Advances the gauntlet exactly once per guard kill — guild.js's
      approachPalaceGate() reads this same variable to decide whether the
      next click faces PALACE_GUARDS[palaceGauntletProgress] or, once
      it reaches PALACE_GUARDS.length, the King himself. */
      palaceGauntletProgress++;
      const guardsLeft = PALACE_GUARDS.length - palaceGauntletProgress;
      log(guardsLeft > 0
          ? `You defeat ${defeatedName}! ${guardsLeft} guard${guardsLeft===1?'':'s'} between you and the throne. (+${xpGain} XP)`
          : `You defeat ${defeatedName}! The throne room stands empty ahead — nothing left between you and the King. (+${xpGain} XP)`);
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
   /* wasTunnelWardenSalvage's own drop -- tunnelWarden.loot is null (he's
   a pure quest-hunt boss, no normal loot table), so this can't just
   ride the generic lootRoll mechanism above; granted directly here,
   same "collect it in drops[] too" pattern every other drop below
   follows so the victory banner shows it correctly. */
   if(wasTunnelWardenSalvage){
      const rigItem = {...drillRigItem};
      state.inventory.push(rigItem);
      drops.push(rigItem);
      log(`You pry loose: ${drillRigItem.name}.`);
   }
   if(lootRoll){
      /* ensureGearArmor() (item-tiers.js) is what guarantees the 3
      PALACE_GATE_GEAR pieces (the only equip items that ever flow
      through this guaranteed-loot path) carry armor too — a no-op for
      every other lootRoll source (junk/quest items), since it only
      touches type:'equip'. */
      const lootedItem = ensureGearArmor({...lootRoll});
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
   /* Smoke Screen/Illusion (state.evasionActive, castSpell()'s 'evade'
   branch) is scoped to a single fight, unlike the multi-fight
   classBuffFightsLeft above — this same funnel point guarantees it
   never survives into the next encounter regardless of how this one
   ended. */
   state.evasionActive = null;
   /* state.playerStatusEffect (a boss's own 'debuff' skill) is scoped to
   a single fight same as evasionActive right above — a burn caught
   in one fight shouldn't still be ticking in the next, unrelated one. */
   state.playerStatusEffect = null;
}

/* Where a defeat's own wake-up line (checkDefeat() below) says the
player lands, and which building it points them at to rest — keyed by
state.homeTown, same set of values TOWN_HUBS (hubs.js) allows. Every
key here needs a matching HP/MP recovery building for the line to make
sense; 'mudrootwarren' isn't currently reachable as a real homeTown
value (nothing sets it — the Bureau replaced the only rest tile that
hub ever had), but it's included anyway so this stays correct if that
ever changes rather than silently falling back to the Gladstone Hollow
line for a home in a completely different part of the map. */
const DEFEAT_WAKE_UP_LOCATION = {
   town: { place:'Gladstone Hollow', restBuilding:'the Inn' },
   gnometropolis: { place:'Gnometropolis', restBuilding:'the Camp' },
   mudrootwarren: { place:'Mudroot Warren', restBuilding:'the Camp back in Gnometropolis' },
};

function checkDefeat(){
   if(state.hp<=0){
      clearLog();
      /* The wake-up line used to always say "back in town... rest at
      the Inn" no matter what — wrong the moment state.homeTown (below)
      is actually 'gnometropolis' (there's no Inn there, only the
      Camp). Keyed the same way DEFEAT_WAKE_UP_LOCATION resolves
      homeTown to an actual place/rest-building pair, so the text
      always matches where the teleport below is really sending them. */
      const wakeUp = DEFEAT_WAKE_UP_LOCATION[state.homeTown] || DEFEAT_WAKE_UP_LOCATION.town;
      log(devMode
          ? `Everything goes dark. You wake up back in ${wakeUp.place}, every inch of you aching — you should really rest at ${wakeUp.restBuilding}. (dev mode — no Biscuit penalty)`
          : `Everything goes dark. You wake up back in ${wakeUp.place}, every inch of you aching — you should really rest at ${wakeUp.restBuilding}. (-2 Biscuits for the walk of shame)`, 'damage');
      state.hp = Math.max(1, Math.floor(state.maxHp*0.1));
      if(!devMode) state.adventures = Math.max(0, state.adventures-2);
      /* A defeat inside the Palace gauntlet counts as "leaving the
      Palace" same as any other exit — resetPalaceGauntlet() (guild.js)
      before state.location changes below, while it's still 'palace'. */
      if(state.location === 'palace') resetPalaceGauntlet();
      /* Same reasoning, generalized — a defeat inside either of
      gauntlet.js's own gauntlets resets ITS OWN counter, not the other
      one's, while state.location is still whichever zone it happened
      in. resetGauntlet() no-ops harmlessly if location doesn't match
      any GAUNTLETS zone. */
      Object.keys(GAUNTLETS).forEach(id => { if(state.location === GAUNTLETS[id].zone) resetGauntlet(id); });
      /* Whichever town square the player actually calls home (TOWN_HUBS,
      town.js — 'town'/Gladstone Hollow by default, 'gnometropolis' once
      that's been reached), not always Gladstone Hollow — a defeat inside
      a Gnometropolis district should land you back in Gnometropolis, not
      teleport you across the whole map. */
      state.location = state.homeTown;
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
