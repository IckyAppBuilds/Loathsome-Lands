/* In-combat spell+item menu (opened via the Use button) — 'damage'
spells, plus (new) any held HP/MP/luck consumable. Every other spell
type (heal/ward/shout/buff) doesn't cost a turn anymore (castSpell(),
combat.js, no longer calls monsterRetaliate() for them) and is cast
from the Character page instead (renderCastableSpellsBlock(),
class-spells.js — reachable mid-combat too, so this isn't losing
access, just moving where non-damage spells live). A damage spell (or
now, using an item — useItemInCombat(), combat.js) is still a real
combat action that trades your turn for its effect, so both live here
alongside Attack/Flee, not on the free-action Character page. */
function renderSpellMenu(){
  const list = document.getElementById('spell-list');
  list.innerHTML = '';
  const known = spells.filter(s => s.type==='damage' && state.spellsKnown.includes(s.id));
  if(known.length===0){
    list.innerHTML = '<div class="shop-empty">You don\'t know any damage spells yet. The Hoodoo Doctor in town might teach you one.</div>';
  } else {
    known.forEach(spell=>{
      const div = document.createElement('div');
      div.className = 'shop-item';
      const iconSvg = spell.icon ? spell.icon() : '';
      const canCast = state.mp >= spell.mpCost;
      div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button></div>`;
      list.appendChild(div);
    });
  }

  /* Buffs & support (heal/ward/buff/shout — Mending Charm, Warding
  Charm, Shout, Adrenaline Rush, Loaded Dice, Arcane Focus, Stubborn
  Recovery, Smoke Screen, ...) — these never cost a turn (castSpell()
  only calls monsterRetaliate() for 'damage'), so they belong in the
  in-combat Use menu same as a damage spell or a consumable, not just
  on the Character page (renderCastableSpellsBlock(), class-spells.js).
  Without this, a player who only knew a ward/buff spell had no way to
  actually cast it mid-fight through the Use button at all. */
  const buffSpells = spells.filter(s => s.type!=='damage' && state.spellsKnown.includes(s.id));
  if(buffSpells.length > 0){
    const buffHeader = document.createElement('div');
    buffHeader.className = 'shop-section-title';
    buffHeader.textContent = 'Buffs & Support';
    list.appendChild(buffHeader);
    buffSpells.forEach(spell=>{
      const div = document.createElement('div');
      div.className = 'shop-item';
      const iconSvg = spell.icon ? spell.icon() : '';
      const canCast = state.mp >= spell.mpCost;
      div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button></div>`;
      list.appendChild(div);
    });
  }

  /* Consumables — same grouping groupInventoryByName() (render-shop.js)
  uses for the Pack drawer, so a stack of potions shows as one row with
  a ×count badge instead of one row per copy. Using one here costs the
  turn (useItemInCombat(), combat.js), which is the whole point of
  moving item use into this menu — see that function's own comment. */
  const itemGroups = groupInventoryByName().filter(g => ['hp','mp','luck'].includes(g.item.type));
  if(itemGroups.length > 0){
    const header = document.createElement('div');
    header.className = 'shop-section-title';
    header.textContent = 'Use an Item';
    list.appendChild(header);
    itemGroups.forEach(({item, count, firstIdx})=>{
      const div = document.createElement('div');
      div.className = 'shop-item';
      const iconSvg = item.icon ? item.icon() : '';
      const qtyBadge = count>1 ? ` <span class="qty-badge">×${count}</span>` : '';
      div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${item.name}${qtyBadge}</div><div class="desc">${item.desc}</div><button class="btn-secondary" onclick="useItemInCombat(${firstIdx})">Use</button></div>`;
      list.appendChild(div);
    });
  }
}

function renderCharacterDrawer(){
  const classPortraitArt = { 'Meathead':artMeathead, 'Card Shark':artCardShark, 'Hexpert':artHexpert }[state.classTitle] || artIdle;
  document.getElementById('char-portrait').innerHTML = classPortraitArt();
  document.getElementById('char-title').textContent = `Level ${state.level} ${state.classTitle || 'Adventurer'}`;

document.getElementById('char-hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('char-hp-value').textContent = state.hp+' / '+state.maxHp + (state.shield>0 ? ` (+${state.shield} 🛡)` : '');
  document.getElementById('char-mp-bar').style.width = (state.mp/state.maxMp*100)+'%';
  document.getElementById('char-mp-value').textContent = state.mp+' / '+state.maxMp;
  document.getElementById('char-xp-bar').style.width = (state.xp/state.xpToLevel*100)+'%';
  document.getElementById('char-xp-value').textContent = state.xp+' / '+state.xpToLevel;

document.getElementById('char-facts').innerHTML = `
<div><span class="fact-label">Biscuits:</span> ${devMode ? '∞ (dev mode)' : state.adventures + ' / ' + effectiveBiscuitMax()}</div>
<div><span class="fact-label">Pop Tabs:</span> ${state.popTabs}</div>
<div><span class="fact-label">Items carried:</span> ${state.inventory.length}</div>
`;

renderStatsBlock();
  renderCastableSpellsBlock();
  renderEquipmentBlock();
  renderRareFindsBlock();
}

/* Rare-drop collection log — see state.rareDropsSeen (core.js) and the
milestone bonus in winCombat() (game.js). N is computed fresh from
monsters[] rather than hardcoded so it never drifts as content is added.
Undiscovered rares show as "???" — no spoiling names of rares the player
hasn't found yet, that's the collection-game hook. */
function renderRareFindsBlock(){
  const el = document.getElementById('rarefinds-block');
  if(!el) return;
  const rareMonsters = monsters.filter(m => m.rareDrop);
  const totalRares = rareMonsters.length;
  const foundCount = state.rareDropsSeen.length;
  const bonusNote = state.allRaresBonusClaimed
  ? `<div class="stat-points-note" style="color:var(--green);">Every rare found! Bonus claimed.</div>`
    : '';
  const rows = rareMonsters.map(m=>{
    const found = state.rareDropsSeen.includes(m.rareDrop.name);
    /* m.rareDrop itself carries no explicit tier — winCombat() (combat.js)
    only stamps tier:'legendary' onto the looted copy, not the content.js
    definition — but every entry reachable here is definitionally a rare
    drop, so override it the same way for display. */
    const nameHtml = found ? itemNameHtml({...m.rareDrop, tier:'legendary'}) : '???';
    return `<div class="stat-row"><div style="flex:1;"><div class="stat-row-label">${nameHtml}</div></div></div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Rare Finds: ${foundCount} / ${totalRares}</div>${bonusNote}${rows}`;
}

function renderStatsBlock(){
  const el = document.getElementById('stats-block');
  const eff = getEffectiveStats();
  const pointsNote = state.statPoints>0
  ? `<div class="stat-points-note">${state.statPoints} stat point${state.statPoints>1?'s':''} to spend!</div>`
    : '';
  const rows = Object.keys(STAT_LABELS).map(key=>{
    const base = state.stats[key];
    const bonus = eff[key] - base;
    const bonusText = bonus>0 ? ` <span class="qty-badge">+${bonus}</span>` : '';
    const btn = state.statPoints>0
    ? `<button class="btn-secondary stat-plus-btn" onclick="spendStatPoint('${key}')">+1</button>`
      : '';
    return `<div class="stat-row">
    <div style="flex:1;">
    <div class="stat-row-label">${STAT_LABELS[key]}${bonusText}</div>
    <div class="stat-row-hint">${STAT_HINTS[key]}</div>
    </div>
    <div class="stat-row-value">${eff[key]}</div>
    ${btn}
    </div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Stats</div>${pointsNote}${rows}`;
}

function renderEquipmentBlock(){
  const el = document.getElementById('equip-block');
  const rows = SLOT_ORDER.map(slot=>{
    const item = state.equipment[slot];
    if(!item){
      return `<div class="equip-row">
      <div class="icon-box equip-empty-icon">—</div>
      <div style="flex:1;">
      <div class="equip-slot-label">${SLOT_LABELS[slot]}</div>
      <div class="equip-empty-text">Nothing equipped.</div>
      </div>
      </div>`;
    }
    const iconSvg = item.icon ? item.icon() : '';
    const bonusText = item.bonus && Object.keys(item.bonus).length
    ? Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')
      : 'No bonus — just flavor.';
    return `<div class="equip-row">
    <div class="icon-box">${iconSvg}</div>
    <div style="flex:1;">
    <div class="equip-slot-label">${SLOT_LABELS[slot]}</div>
    <div class="name">${itemNameHtml(item)}</div>
    <div class="desc">${bonusText}</div>
    <button class="btn-secondary" onclick="unequipItem('${slot}')">Unequip</button>
    </div>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Equipped</div>${rows}`;
}

function renderQuestLogDrawer(){
  const activeEl = document.getElementById('quest-log-active');
  const completedEl = document.getElementById('quest-log-completed');
  const activeEntries = [];
  const completedEntries = [];

/* The Bounty Board is repeatable, not a one-and-done quest, so it always
lives in activeEntries (never completedEntries) once unlocked (same gate
claimBounty() uses: state.questComplete). ensureActiveBounty() (guild.js)
re-rolls first if the current one expired since the last render — so
opening this drawer alone is enough to keep it fresh even if the player
never visits the Bounty Board itself. The countdown span gets a stable
id so updateBountyTimerDisplay() (guild.js) can tick it down live without
a full re-render every second. */
if(state.questComplete){
  ensureActiveBounty();
  if(!state.activeBounty){
    /* Same two-cause distinction as renderBountyBoard()'s own copy
    (render-shop.js) — daily cap hit, or no Act 2 zone unlocked yet. */
    const noZoneUnlocked = state.bountiesClaimedToday < BOUNTY_DAILY_CAP;
    activeEntries.push(`
    <div class="quest-log-entry">
    <div class="quest-name">Bounty Board (The Guild)</div>
    <div class="quest-desc">${noZoneUnlocked ? "Nothing worth posting yet — check back once you've found somewhere new to hunt." : `You've claimed ${BOUNTY_DAILY_CAP} bounties today — the board's empty until tomorrow.`}</div>
    </div>`);
  }
  const bt = state.activeBounty && BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
  if(bt){
    const progress = Math.min(bt.count, state.activeBounty.progress);
    const done = isBountyReady();
    const zoneLabel = ZONE_LABELS[bt.zone] || bt.zone;
    activeEntries.push(`
    <div class="quest-log-entry">
    <div class="quest-name">Bounty Board (The Guild)</div>
    <div class="quest-desc">Slay ${bt.count} × ${bt.monsterName} in ${zoneLabel}. Reward: ${bt.reward.bountyTokens} Bounty Token${bt.reward.bountyTokens===1?'':'s'}.</div>
    <div class="quest-progress">${progress}/${bt.count}${done ? ' — ready to claim at the Guild!' : ''}</div>
    <div class="quest-progress" style="color:var(--tan);">${done ? 'Claim it before it resets.' : `Resets in <span id="quest-bounty-timer">${formatBountyTimeLeft(BOUNTY_RESET_MS - (Date.now() - state.activeBounty.startedAt))}</span> if not completed.`}</div>
    </div>`);
  }
}

if(state.questComplete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Rake</div>
  <div class="quest-desc">You gathered the gnome-stolen rake tines and Gaffer Thistlewick put his rake back together.</div>
  <div class="quest-progress">Reward claimed: 15 Pop Tabs, 25 XP</div>
  </div>`);
} else if(state.questAccepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Rake</div>
  <div class="quest-desc">Bring back the rake's tines from the gnomes in the Overgrown Commons, and Gaffer will put it back together.</div>
  <div class="quest-progress">Rake tines turned in: ${state.questTinesGiven}/${QUEST_TINES_NEEDED}</div>
  </div>`);
}

if(state.quest2Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome Commander</div>
  <div class="quest-desc">You hunted down and defeated the rare gnome commander terrorizing the Overgrown Commons.</div>
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 50 XP</div>
  </div>`);
} else if(state.quest2Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome Commander</div>
  <div class="quest-desc">Hunt down and defeat the gnome commander in the Overgrown Commons. He's rare — keep adventuring until he shows himself.</div>
  <div class="quest-progress">${state.commanderDefeated ? 'Commander defeated — report back at the Guild!' : 'Commander not yet encountered.'}</div>
  </div>`);
}

if(state.quest3Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Potion</div>
  <div class="quest-desc">You gathered ingredients from the Overgrown Commons and the Dank Sewers so the Hoodoo Doctor could brew Bottled Fury.</div>
  <div class="quest-progress">Reward claimed: 20 Pop Tabs, 35 XP, the Bottled Fury spell</div>
  </div>`);
} else if(state.quest3Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">A Proper Potion</div>
  <div class="quest-desc">Gather ingredients from monsters in the Overgrown Commons and the Dank Sewers, then bring them to the Hoodoo Doctor to brew the potion.</div>
  <div class="quest-progress">Ingredients gathered: ${countPotionIngredientsHeld()}/${potionIngredients.length}</div>
  </div>`);
}

if(state.quest4Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Sewers Shed</div>
  <div class="quest-desc">You hunted down and defeated the runaway digger-bot loose in the Dank Sewers, and the Tinker opened up the Clockwork Quarry.</div>
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 45 XP</div>
  </div>`);
} else if(state.quest4Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Sewers Shed</div>
  <div class="quest-desc">Find and defeat whatever's shedding clockwork parts in the Dank Sewers. It's rare — keep adventuring until it shows itself.</div>
  <div class="quest-progress">${state.quest4RareDefeated ? 'Digger-bot defeated — report back at the Tinker\'s Workshop!' : 'Digger-bot not yet encountered.'}</div>
  </div>`);
}

if(state.quest5Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Vein</div>
  <div class="quest-desc">You gathered clockwork parts from the Clockwork Quarry and the Dank Sewers so the Tinker could trace the old vein of gnome-tech — straight to the Sunless Vault.</div>
  <div class="quest-progress">Reward claimed: 40 Pop Tabs, 60 XP</div>
  </div>`);
} else if(state.quest5Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Vein</div>
  <div class="quest-desc">Gather parts from monsters in the Clockwork Quarry and the Dank Sewers, then bring them to the Tinker.</div>
  <div class="quest-progress">Parts gathered: ${countVeinIngredientsHeld()}/${veinIngredients.length*VEIN_ITEM_COUNT_NEEDED}</div>
  </div>`);
}

if(state.quest6Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Throne</div>
  <div class="quest-desc">You hunted down and defeated the Gnome King's rear-guard captain, deep in the Sunless Vault, and uncovered Gnometropolis beneath it — though the King himself had already fled deeper in.</div>
  <div class="quest-progress">Reward claimed: 50 Pop Tabs, 70 XP</div>
  </div>`);
} else if(state.quest6Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Throne</div>
  <div class="quest-desc">Hunt down and defeat the Gnome King's captain, left to guard his retreat in the Sunless Vault. He's rare — keep adventuring until he shows himself.</div>
  <div class="quest-progress">${state.quest6RareDefeated ? 'Captain defeated — report back at the Guild!' : 'Captain not yet encountered.'}</div>
  </div>`);
}

/* Quest 7 ("The Gnome King's Court", Act 1 finale) — same quest7State
logic as render.js's isGuild display chain (see quest7State there),
reproduced here since the Quest Log's copy is its own separate string,
not shared markup. */
if(state.quest7Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Court</div>
  <div class="quest-desc">You forced the palace gate in Gnometropolis and struck down the real Gnome King. Act One is done — Gnometropolis is yours.</div>
  <div class="quest-progress">Reward claimed: 150 Pop Tabs, 200 XP, 20 Bounty Tokens</div>
  </div>`);
} else if(state.quest7RareDefeated){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Court</div>
  <div class="quest-desc">The King has fallen behind the palace gate — report back to the guildmaster.</div>
  <div class="quest-progress">Ready to report.</div>
  </div>`);
} else if(state.quest7Accepted){
  const quest7GearItem = PALACE_GATE_GEAR.find(g => g.class === state.classTitle);
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Court</div>
  <div class="quest-desc">Defeat your district's guardian in Gnometropolis to claim ${quest7GearItem ? quest7GearItem.name : 'the right gear'}, equip it, then approach the palace gate. Five guards stand between you and the throne room — clear them all, then face the real Gnome King.</div>
  <div class="quest-progress">Not yet confronted the King.</div>
  </div>`);
}

/* Quest 8 ("New Digs", Act 2's opener) and quest 9 ("What the Throne
Room Opened", Act 2's first multi-stage quest) — same completed/active
convention as every quest above, reproduced here since the Quest Log's
copy is its own separate string, not shared markup (same reasoning as
quest7's own comment above). Quest 9's progress line stays deliberately
vague/marker-free (no zone names), matching its own text everywhere
else it's shown (render.js's isGnomeGuild quest-box). */
if(state.quest8Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">New Digs</div>
  <div class="quest-desc">You signed the ledger and made it official — Gnometropolis is yours to run.</div>
  <div class="quest-progress">Reward claimed: 40 Pop Tabs, 30 XP</div>
  </div>`);
} else if(state.quest8Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">New Digs</div>
  <div class="quest-desc">Sign the ledger at the new Guild in Gnometropolis and make it official.</div>
  <div class="quest-progress">Ready to sign.</div>
  </div>`);
}

if(state.quest9Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Throne Room Opened</div>
  <div class="quest-desc">You found what was living under the throne room, fought your way past it, and reported back. It wasn't alone down there.</div>
  <div class="quest-progress">Reward claimed: 90 Pop Tabs, 70 XP</div>
  </div>`);
} else if(state.quest9Accepted){
  const quest9ProgressLog = state.warrenScoutDefeated ? 'Ready to report back at the Guild.'
    : state.tunnelWardenDefeated ? "You've gone further than anyone in living memory. Something further in noticed."
    : "It hasn't shown itself yet.";
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Throne Room Opened</div>
  <div class="quest-desc">Something's been living under the throne room a very long time, and it isn't happy about the light. Go find out what — and watch yourself down there.</div>
  <div class="quest-progress">${quest9ProgressLog}</div>
  </div>`);
}

if(state.classQuestComplete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Adventurer's Trial</div>
  <div class="quest-desc">The guildmaster studied your training, your gear, the way you carry yourself, and named your path.</div>
  <div class="quest-progress">Reward claimed: recognized as a ${state.classTitle}</div>
  </div>`);
} else if(state.classQuestAccepted){
  const allClassTrialsPassedLog = state.classTrialGuildPassed && state.classTrialCasinoPassed && state.classTrialHoodooPassed;
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Adventurer's Trial</div>
  <div class="quest-desc">${allClassTrialsPassedLog ? "All three trainers agree on this much: you're ready. Return to the guildmaster to claim your path." : "Three trainers, three fights, and no partial credit: beat the Guild's Trial Champion, outlast the Casino's own card shark, and land a killing blow with a damage spell at the Hoodoo Doctor's."}</div>
  <div class="quest-progress">${allClassTrialsPassedLog ? 'Ready — claim your path at the Guild.' : `Guild: ${state.classTrialGuildPassed ? '✓' : 'not yet'} — Casino: ${state.classTrialCasinoPassed ? '✓' : 'not yet'} — Hoodoo: ${state.classTrialHoodooPassed ? '✓' : 'not yet'}`}</div>
  </div>`);
}

activeEl.innerHTML = activeEntries.length ? activeEntries.join('') : '<div class="quest-log-empty">No active quests. Explore Gladstone Hollow to find one.</div>';
  completedEl.innerHTML = completedEntries.length ? completedEntries.join('') : '<div class="quest-log-empty">No completed quests yet.</div>';
}
