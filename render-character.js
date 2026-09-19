function renderSpellMenu(){
  const list = document.getElementById('spell-list');
  const known = spells.filter(s => state.spellsKnown.includes(s.id));
  if(known.length===0){
    list.innerHTML = '<div class="shop-empty">You don\'t know any spells yet. The Hoodoo Doctor in town might teach you a few.</div>';
    return;
  }
  list.innerHTML = '';
  known.forEach(spell=>{
    const div = document.createElement('div');
    div.className = 'shop-item';
    const iconSvg = spell.icon ? spell.icon() : '';
    const canCast = state.mp >= spell.mpCost;
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button></div>`;
    list.appendChild(div);
  });
}

function renderCharacterDrawer(){
  const classPortraitArt = { 'Meathead':artMeathead, 'Card Shark':artCardShark, 'Hexpert':artHexpert }[state.classTitle] || artIdle;
  document.getElementById('char-portrait').innerHTML = classPortraitArt();
  document.getElementById('char-title').textContent = `Level ${state.level} ${state.classTitle || 'Adventurer'}`;

document.getElementById('char-hp-bar').style.width = (state.hp/state.maxHp*100)+'%';
  document.getElementById('char-hp-value').textContent = state.hp+' / '+state.maxHp;
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
    return `<div class="stat-row"><div style="flex:1;"><div class="stat-row-label">${found ? m.rareDrop.name : '???'}</div></div></div>`;
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
    <div class="name">${item.name}</div>
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
  <div class="quest-desc">You hunted down and defeated the Gnome King himself, deep in the Sunless Vault, and uncovered Gnometropolis beneath it.</div>
  <div class="quest-progress">Reward claimed: 50 Pop Tabs, 70 XP</div>
  </div>`);
} else if(state.quest6Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Throne</div>
  <div class="quest-desc">Hunt down and defeat the Gnome King in the Sunless Vault. He's rare — keep adventuring until he shows himself.</div>
  <div class="quest-progress">${state.quest6RareDefeated ? 'Gnome King defeated — report back at the Guild!' : 'Gnome King not yet encountered.'}</div>
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
  <div class="quest-desc">${allClassTrialsPassedLog ? "All three trainers agree on this much: you're ready. Return to the guildmaster to claim your path." : "Three trainers, three tests, and no partial credit: beat the Guild's Trial Champion, win a big enough bet at the Casino, and land a killing blow with a damage spell at the Hoodoo Doctor's."}</div>
  <div class="quest-progress">${allClassTrialsPassedLog ? 'Ready — claim your path at the Guild.' : `Guild: ${state.classTrialGuildPassed ? '✓' : 'not yet'} — Casino: ${state.classTrialCasinoPassed ? '✓' : 'not yet'} — Hoodoo: ${state.classTrialHoodooPassed ? '✓' : 'not yet'}`}</div>
  </div>`);
}

activeEl.innerHTML = activeEntries.length ? activeEntries.join('') : '<div class="quest-log-empty">No active quests. Explore Gladstone Hollow to find one.</div>';
  completedEl.innerHTML = completedEntries.length ? completedEntries.join('') : '<div class="quest-log-empty">No completed quests yet.</div>';
}
