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

/* Ordinary gambling — entirely separate from the Casino tier of the
Adventurer's Trial now (see startClassTrialCasino() below), which used to
piggyback on this function via a bet-threshold check. */
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
   } else {
      log(`${casinoLoseLines[Math.floor(Math.random()*casinoLoseLines.length)]} (-${amount} Pop Tabs)`);
   }
   render();
}

/* Collects whatever's accrued in state.casinoWinnings (regenCasinoWinnings(),
economy.js — passive, real-time, capped by the Casino's own upgrade
level) and adds it to state.popTabs. Entirely separate from gambleCasino()
above; this is passive income for having upgraded the building at all,
not a payout from any specific bet. */
function claimCasinoWinnings(){
   if(state.location !== 'casino') return;
   regenCasinoWinnings();
   if(state.casinoWinnings <= 0) return;
   const amount = state.casinoWinnings;
   state.popTabs += amount;
   state.casinoWinnings = 0;
   clearLog();
   log(`You collect your cut of the house's take. (+${amount} Pop Tabs)`);
   render();
   autosave();
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
unlocked only once this quest is turned in) for the rare gnomeKingsCaptain
spawn (content.js), same mechanic as gnomeCommander/diggerBot. Retconned:
the target is the King's rear-guard captain, not the King himself — see
gnomeKingsCaptain's comment in content.js. Gnometropolis still unlocks on
turn-in exactly as before; only the flavor text changed, to set up quest 7
(the real gnomeKing, fled deeper into Gnometropolis). */
function acceptQuest6(){
   if(state.location !== 'guild' || !state.quest5Complete || state.quest6Accepted || state.quest6Complete) return;
   state.quest6Accepted = true;
   clearLog();
   log("You accept the guild's quest: track down and defeat the King's rear-guard captain, holding the line somewhere in the Sunless Vault. He's rare — you'll have to keep adventuring and hope he shows himself.");
   render();
}

function reportGnomeKingKill(){
   if(state.location !== 'guild' || !state.quest6Accepted || state.quest6Complete || !state.quest6RareDefeated) return;
   state.quest6Complete = true;
   state.popTabs += 50;
   state.xp += 70;
   clearLog();
   log("You describe the fight in the throne room in more detail than the guildmaster expected. He's practically speechless. (+50 Pop Tabs, +70 XP)");
   log("\"Gnometropolis,\" he finally says. \"The whole hidden gnome capital, right under the Vault. It's yours to explore now, if you're brave enough.\" A beat, then his face falls — the throne was already empty. \"The King got away, deeper in. There's clearly more to this than a captain guarding an empty chair.\" Gnometropolis is now open — check the Map.");
   checkLevelUp();
   render();
   autosave();
}

/* ---------------- Quest 7: "The Palace Gate" (Act 1 finale) ---------------- */
/* Offered by the guildmaster once quest 6 is complete AND the player has
already claimed a class via the Adventurer's Trial (state.classTitle) —
the palace-gate approach is class-specific (PALACE_GATE_GEAR, content.js),
so there's no way to even describe the quest to someone who hasn't chosen
a path yet. Same "silently no-op on an unmet gate" convention as every
other quest here — a later UI task surfaces a hint explaining the
classTitle requirement specifically. */
function acceptQuest7(){
   if(state.location !== 'guild' || !state.quest6Complete || !state.classTitle || state.quest7Accepted || state.quest7Complete) return;
   state.quest7Accepted = true;
   clearLog();
   log("\"The King fled into Gnometropolis proper — behind a palace gate that isn't just going to open for anyone,\" the guildmaster says. \"But the way in is shaped by who you've become. Find the district that matches your path and prove yourself to whoever's guarding it — the gear you'll need is theirs to lose, not anyone's to sell.\"");
   render();
}

/* Turn-in for quest 7 — gated on approachPalaceGate() (below) having
already set state.quest7RareDefeated via winCombat()'s wasRealGnomeKing
branch (combat.js), same "fight happens elsewhere, report happens at the
NPC" split as reportGnomeKingKill()/reportCommanderKill() above. This is
Act 1's finale, so the payout is the biggest one-time quest reward in the
game so far (quest6's +50 Pop Tabs/+70 XP was the previous ceiling). */
function reportGnomeKingDefeat(){
   if(state.location !== 'guild' || !state.quest7Accepted || !state.quest7RareDefeated || state.quest7Complete) return;
   state.quest7Complete = true;
   state.popTabs += 150;
   state.xp += 200;
   state.bountyTokens += 20;
   clearLog();
   log("You lay it out for the guildmaster, plainly: the King is dead, and Gnometropolis is yours in every way that matters now. He's got no jokes for this one. (+150 Pop Tabs, +200 XP, +20 Bounty Tokens)");
   log("\"That's Act One, done,\" he says, like he's still working out what that means. \"The capital's yours. What comes next... honestly, nobody's sure yet. But the door's open.\"");
   checkLevelUp();
   render();
   autosave();
}

/* The palace gate itself — triggered from Gnometropolis (state.location),
not the Guild, even though it lives in this file with the rest of quest 7.
Requires the exact PALACE_GATE_GEAR item matching state.classTitle to be
equipped in its slot before the real gnomeKing (content.js) will fight —
otherwise it's a guaranteed-refusal no-op, same shape as every other
hard-gated action in this codebase. Since that gear is now a guaranteed
drop from the matching Gnometropolis district guardian (gnometropolis.js's
challengeDistrictGuardian(), not a Bounty Token purchase — see that file
and combat.js's winCombat()), this check itself needed no change: it only
ever cared whether the item is equipped, never how it was obtained. */
function approachPalaceGate(){
   if(state.inCombat !== false || state.location !== 'gnometropolis' || !state.quest7Accepted || state.quest7RareDefeated) return;
   const gearNeeded = PALACE_GATE_GEAR.find(g => g.class === state.classTitle);
   if(!gearNeeded || state.equipment[gearNeeded.slot]?.name !== gearNeeded.name){
      clearLog();
      log(gearNeeded
          ? `You can't just walk up to the palace gate like this. You need ${gearNeeded.name} equipped in your ${SLOT_LABELS[gearNeeded.slot] || gearNeeded.slot} slot first.`
          : "Something's wrong — there's no known approach for your class. (Report this.)");
      render();
      return;
   }
   startCombat(gnomeKing);
   render();
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
   state.activeBounty = { templateId: template.id, progress: 0, startedAt: Date.now() };
}
/* Resets state.bountiesClaimedToday the first time this is called after
local midnight (toDateString() changes), so BOUNTY_DAILY_CAP (content.js)
is a per-calendar-day cap, not a rolling 24h window like BOUNTY_RESET_MS. */
function checkBountyDayReset(){
   const todayKey = new Date().toDateString();
   if(state.bountyDayKey !== todayKey){
      state.bountyDayKey = todayKey;
      state.bountiesClaimedToday = 0;
   }
}
/* Call before reading state.activeBounty anywhere (Bounty Board, Quest
Log, the town-square glow indicator) — rolls a fresh one if there isn't
one yet, or if the current one has been active for BOUNTY_RESET_MS
(content.js) without being claimed. Progress on an expired bounty is
lost, same as the zone-mismatch reroll below. Once BOUNTY_DAILY_CAP
claims have happened today, no new bounty is offered at all — leaves
state.activeBounty null until tomorrow's reset. */
function ensureActiveBounty(){
   checkBountyDayReset();
   if(state.bountiesClaimedToday >= BOUNTY_DAILY_CAP){ state.activeBounty = null; return; }
   if(!state.activeBounty){ rollNewBounty(); return; }
   const currentTemplate = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(!currentTemplate || !isBountyZoneUnlocked(currentTemplate.zone)){ rollNewBounty(); return; }
   if(Date.now() - state.activeBounty.startedAt >= BOUNTY_RESET_MS) rollNewBounty();
}
/* Shared by claimBounty()'s gate and the town-square glow indicator
(render.js) so "ready to claim" can never drift between the two. */
function isBountyReady(){
   if(!state.activeBounty) return false;
   const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   return !!bt && state.activeBounty.progress >= bt.count;
}
/* "11h 42m" style, for a bounty's multi-hour reset window — formatMs()
(economy.js) is tuned for the Biscuit regen's minutes-scale countdown and
reads awkwardly stretched out to hours. */
function formatBountyTimeLeft(ms){
   const totalMin = Math.max(0, Math.ceil(ms/60000));
   const h = Math.floor(totalMin/60), m = totalMin % 60;
   return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function claimBounty(){
   if(state.location !== 'guild' || !state.questComplete || !state.activeBounty) return;
   checkBountyDayReset();
   if(state.bountiesClaimedToday >= BOUNTY_DAILY_CAP) return;
   const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
   if(!bt || !isBountyReady()) return;
   const bountyPayout = Math.round(bt.reward.bountyTokens * (1 + GUILD_BOUNTY_BONUS[state.buildingUpgrades.guild || 0]));
   state.bountyTokens += bountyPayout;
   state.bountiesCompleted++;
   state.bountiesClaimedToday++;
   clearLog();
   log(`Bounty complete! You collect ${bountyPayout} Bounty Token${bountyPayout===1?'':'s'} for clearing out ${bt.count} × ${bt.monsterName}.`);
   if(state.bountiesClaimedToday < BOUNTY_DAILY_CAP){
      rollNewBounty();
   } else {
      state.activeBounty = null;
      log(`That's ${BOUNTY_DAILY_CAP} bounties claimed today — the board's empty until tomorrow.`);
   }
   render();
   autosave();
}

/* ---------------- Level-10 Guild capstone: "The Adventurer's Trial" ---------------- */
/* Offered by the guildmaster once quest 2 is complete and state.level>=10 —
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
check in gambleCasino() that required a bet bigger than any Bet button
the UI actually offers. */
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
(MEATHEAD_DAMAGE_BONUS/CARD_SHARK_PAYOUT_BONUS/HEXPERT_SPELL_DMG_BONUS,
content.js) — see those bonuses applied in playerAttack()/gambleCasino()/
castSpell() respectively. Purchasable only at the building matching the
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

/* Ticks the Quest Log's bounty countdown (#quest-bounty-timer, render-
character.js) live, same pattern as economy.js's Biscuit-display
interval. Guarded on the element actually existing — it's only in the
DOM while the Quest Log drawer is both open AND showing an unclaimed
bounty, so this is a harmless no-op the rest of the time. Also catches
an expiry (or the daily cap resetting overnight) even if the player
just sits on the drawer without taking any action that would otherwise
trigger a render(). */
function updateBountyTimerDisplay(){
   const el = document.getElementById('quest-bounty-timer');
   if(!el) return;
   const before = state.activeBounty;
   ensureActiveBounty();
   if(state.activeBounty !== before){ renderQuestLogDrawer(); return; }
   if(!state.activeBounty) return;
   el.textContent = formatBountyTimeLeft(BOUNTY_RESET_MS - (Date.now() - state.activeBounty.startedAt));
}
setInterval(updateBountyTimerDisplay, 1000);
