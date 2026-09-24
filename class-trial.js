/* ---------------- Level-10 capstone: "The Adventurer's Trial" ---------------- */
/* Split out of guild.js (originally "Casino, Guild, Bounty Board, class
Trial, Act 1 finale" all in one file) — fully self-contained, zero
calls into guild.js's own Guild/Bounty Board/Palace code, so it was the
second of the file's several bundled concerns to pull out on its own.

Offered by the guildmaster once quest 2 is complete and state.level>=10 —
see classQuestState in render(). No longer a single auto-picked-stat capstone:
once accepted, three independent trainers each administer their own test, and
only after all three pass does the player CHOOSE which class to become
(claimClassPath(chosenStat) below no longer computes a "dominant" stat itself).
The three tiers are now all themed boss fights (see content.js's comment
above trialChampion/casinoChampion/hoodooChampion for why each one uses a
different mechanical gimmick instead of just being three copies of the
same fight), and where each one lives:
- Guild/Meathead: startClassTrialGuild() below forces a fight against
  trialChampion (content.js); winCombat()'s wasTrialChampion branch sets
  state.classTrialGuildPassed = true on the win.
- Casino/Card Shark: startClassTrialCasino() below forces a fight against
  casinoChampion; winCombat()'s wasCasinoChampion branch sets
  state.classTrialCasinoPassed = true on the win.
- Hoodoo/Hexpert: startClassTrialHoodoo() below forces a fight against
  hoodooChampion; castSpell()'s damage branch (combat.js) sets
  state.classTrialHoodooPassed = true specifically when the killing blow
  on THAT boss comes from a cast spell, not just from winning the fight.
claimClassPath(chosenStat) then gates on all three flags plus chosenStat being
one of 'beef'/'zip'/'hoodoo' (Bulwark/grit has no trial tier and isn't a valid
choice), and hands out a permanent title plus a small +2 bonus to chosenStat,
via CLASS_TITLES in content.js. */
function acceptClassQuest(){
   if(state.location !== 'guild' || !state.quest2Complete || state.level<10 || state.classQuestAccepted || state.classQuestComplete) return;
   state.classQuestAccepted = true;
   clearLog();
   log("The guildmaster looks you over — really looks, this time. \"You've come further than most. There's a Trial for adventurers who reach this far — not from me alone. The Guild, the Casino, and the Hoodoo Doctor each want their own proof before anyone puts a name to what you've become.\"");
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
   render();
}

/* Casino tier — forces a fight against casinoChampion (content.js). Same
shape as startClassTrialGuild() above; replaces an earlier bet-threshold
check in gambleCasino() (casino.js) that required a bet bigger than any
Bet button the UI actually offers. */
function startClassTrialCasino(){
   if(state.location !== 'casino' || !state.classQuestAccepted || state.classTrialCasinoPassed || state.classQuestComplete) return;
   startCombat(casinoChampion);
   render();
}

/* Hoodoo tier — forces a fight against hoodooChampion (content.js). Same
shape as startClassTrialGuild() above; state.classTrialHoodooPassed itself
is only set in castSpell()'s damage branch (combat.js) when the killing
blow on this specific boss comes from a cast spell. */
function startClassTrialHoodoo(){
   if(state.location !== 'hoodoo' || !state.classQuestAccepted || state.classTrialHoodooPassed || state.classQuestComplete) return;
   startCombat(hoodooChampion);
   render();
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
(MEATHEAD_DAMAGE_BONUS/CARD_SHARK_DOUBLE_ATTACK_CHANCE/HEXPERT_SPELL_DMG_BONUS,
content.js) — see those bonuses applied in playerAttack() (both Meathead's
and Card Shark's) and castSpell() (Hexpert's) respectively. Purchasable
only at the building matching the
player's class, same 0..3 index range as the bonus arrays (mirrors
BUILDING_UPGRADE_MAX's capping style), and only one copy of the counter
exists since a player only ever has one active class at a time. Gated on
BOTH state.level (CLASS_SKILL_LEVEL_REQ, content.js) and Pop Tabs
(classSkillCost()) — same "afford it, but you might not be able to use
it yet" shape gear's own level requirement uses, so training can't be
rushed just by grinding Pop Tabs. */
function levelUpClassSkill(){
   const atRightBuilding =
      (state.classTitle==='Meathead' && state.location==='guild') ||
      (state.classTitle==='Card Shark' && state.location==='casino') ||
      (state.classTitle==='Hexpert' && state.location==='hoodoo');
   if(!atRightBuilding || state.classSkillLevel>=3) return;
   const levelReq = CLASS_SKILL_LEVEL_REQ[state.classSkillLevel];
   if(state.level < levelReq) return;
   const cost = classSkillCost(state.classSkillLevel);
   if(state.popTabs < cost) return;
   state.popTabs -= cost;
   state.classSkillLevel++;
   clearLog();
   log(`Your ${state.classTitle} training deepens. (-${cost} Pop Tabs, class skill level ${state.classSkillLevel})`);
   render();
   autosave();
}
