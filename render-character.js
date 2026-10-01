/* In-combat spell+item menu (opened via the Use button) — 'damage'
spells, plus (new) any held HP/MP/luck consumable. Every other spell
type (heal/ward/shout/buff) is cast from the Character page instead
(renderCastableSpellsBlock(), class-spells.js — reachable mid-combat
too, just a different screen, not a different cost) even though
castSpell() (combat.js) now costs the same one turn for EVERY spell
type while `state.inCombat` is true, 'damage' included — per explicit
correction, these used to be genuinely free (no monsterRetaliate() at
all), which is exactly what let a player chain-cast something like
Stubborn Recovery for unlimited healing in a single turn. Casting one
from the Character page mid-fight still only costs that one turn, same
as casting it from this menu would if it were listed here — nothing
about WHERE a spell is cast changes what castSpell() itself enforces. */
/* A spell in state.spellsKnown whose own classRequired no longer matches
state.classTitle is permanently uncastable — castSpell() (combat.js)
refuses it outright — so every filter below also requires that match
(or no classRequired at all, e.g. Hex Bolt, learnable by any class).
This can't happen through a real class choice (claimClassPath() is a
one-time pick), but IS reachable through the dev tools' own class
override (dev-tools.js), which resets classTitle without touching
spellsKnown — "old skills" left behind from a class no longer active. */
function isSpellCurrentlyUsable(spell){
   return !spell.classRequired || spell.classRequired === state.classTitle;
}
function renderSpellMenu(){
  const list = document.getElementById('spell-list');
  list.innerHTML = '';
  const known = spells.filter(s => s.type==='damage' && state.spellsKnown.includes(s.id) && isSpellCurrentlyUsable(s));
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
  const buffSpells = spells.filter(s => s.type!=='damage' && state.spellsKnown.includes(s.id) && isSpellCurrentlyUsable(s));
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
      /* An evade spell (Smoke Screen/Illusion) shows "Active" while IT
      specifically is the one state.evasionActive names — same "tell
      the player there's nothing left to do here" signal the
      Known/Fully-trained buttons elsewhere use — recasting would just
      re-confirm the same flag, so there's no reason to invite it. */
      const btn = (spell.type==='evade' && state.evasionActive === spell.id)
      ? `<button class="btn-secondary" disabled>Active</button>`
        : `<button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button>`;
      /* Small "Lv.2" tag for a Hexpert's own Sanctum-upgraded spells
      (state.spellsUpgraded, upgradeSpell(), combat.js) — same qty-badge
      class this file already uses for the Pack's own ×N/+N inline
      markers, just reused here for a compact upgrade indicator. */
      const lvBadge = state.spellsUpgraded.includes(spell.id) ? ` <span class="qty-badge">Lv.2</span>` : '';
      div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}${lvBadge}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div>${btn}</div>`;
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
  renderBestiaryBlock();
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

/* Bestiary collection log — same shape as renderRareFindsBlock() just
above, but covering every monster in the game (monsters[] + NAMED_BOSSES,
content.js) rather than just rare drops, and unlocked on DEFEAT
(state.monstersSeen, winCombat()/core.js) rather than on finding an
item. Grouped by zone (Object.keys(ZONE_DIFFICULTY), content.js —
already exactly the right commons->...->crystalcity progression order,
no new ordering array needed) since 92 flat entries would otherwise be
an unreadable wall. A zone's own header always shows, so players know
a zone exists to explore; individual monster names inside stay "???"
until defeated, same spoiler-avoidance Rare Finds already uses. */
function renderBestiaryBlock(){
  const el = document.getElementById('bestiary-block');
  if(!el) return;
  const all = [...monsters, ...NAMED_BOSSES];
  const total = all.length;
  const foundCount = state.monstersSeen.length;
  const bonusNote = state.allMonstersBonusClaimed
  ? `<div class="stat-points-note" style="color:var(--green);">Every creature seen! Bonus claimed.</div>`
    : '';
  const zoneGroups = Object.keys(ZONE_DIFFICULTY).map(zone=>{
    const inZone = all.filter(m => m.zone === zone);
    if(inZone.length === 0) return '';
    const rows = inZone.map(m=>{
      const found = state.monstersSeen.includes(m.name);
      const art = found && m.art ? m.art() : '';
      const label = found ? capitalize(m.name) : '???';
      return `<div class="stat-row"><div class="icon-box">${art}</div><div style="flex:1;"><div class="stat-row-label">${label}</div></div></div>`;
    }).join('');
    return `<div class="quest-log-section-title">${ZONE_LABELS[zone]}</div>${rows}`;
  }).join('');
  el.innerHTML = `<div class="block-title">Bestiary: ${foundCount} / ${total}</div>${bonusNote}${zoneGroups}`;
}

function renderStatsBlock(){
  const el = document.getElementById('stats-block');
  const eff = getEffectiveStats();
  const pointsNote = state.statPoints>0
  ? `<div class="stat-points-note">${state.statPoints} stat point${state.statPoints>1?'s':''} to spend!</div>`
    : '';
  const rows = SPENDABLE_STAT_KEYS.map(key=>{
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
  /* Armor is gear-only (SPENDABLE_STAT_KEYS above deliberately excludes it
  — see its own comment, core.js) — its own read-only row, no base/bonus
  split (there's no state.stats.armor to split against) and never a spend
  button, just today's total from equipped gear. Only shown once it's
  actually nonzero, since a fresh character has no armor-granting gear
  yet and an always-"0" row would just be clutter until it means
  something. */
  const armorRow = eff.armor > 0 ? `<div class="stat-row">
  <div style="flex:1;">
  <div class="stat-row-label">${STAT_LABELS.armor}</div>
  <div class="stat-row-hint">${STAT_HINTS.armor}</div>
  </div>
  <div class="stat-row-value">${eff.armor}</div>
  </div>` : '';
  el.innerHTML = `<div class="block-title">Stats</div>${pointsNote}${rows}${armorRow}`;
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
    ? Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join('<br>')
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

/* The Tinker's Workshop's own version of the rows above — same shape
(icon/name/bonus), but this is where temperEquippedItem() (player-
actions.js) actually lives now, per explicit correction: tempering
only works while state.location==='tinker', so the button only ever
shows here, not on the Character page. Only equipped slots that
actually HAVE a stat to temper get a row at all — nothing to offer on
an empty slot or a flavor-only item (starterGear). If literally
nothing is temperable, a plain note shows instead of an empty block. */
function renderTinkerTemperBlock(){
  const el = document.getElementById('tinker-temper-block');
  if(!el) return;
  const temperableSlots = SLOT_ORDER.filter(slot => {
    const item = state.equipment[slot];
    return item && item.bonus && Object.keys(item.bonus).length > 0;
  });
  if(temperableSlots.length===0){
    el.innerHTML = `<div class="block-title">Temper Gear</div><div class="quest-desc">Nothing equipped worth tempering yet.</div>`;
    return;
  }
  const rows = temperableSlots.map(slot => {
    const item = state.equipment[slot];
    const iconSvg = item.icon ? item.icon() : '';
    const bonusText = Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join('<br>');
    const level = item.temperLevel || 0;
    const maxed = level >= TEMPER_MAX_LEVEL;
    let btn;
    if(maxed){
      btn = `<button class="btn-secondary" disabled>Fully Tempered (+${TEMPER_MAX_LEVEL})</button>`;
    } else {
      const cost = temperCost(level);
      const canAfford = state.bountyTokens >= cost;
      btn = `<button class="btn-secondary ${canAfford?'btn-ready':''}" ${canAfford?'':'disabled'} onclick="temperEquippedItem('${slot}')">Temper — ${cost} Bounty Token${cost===1?'':'s'}</button>`;
    }
    return `<div class="equip-row">
    <div class="icon-box">${iconSvg}</div>
    <div style="flex:1;">
    <div class="equip-slot-label">${SLOT_LABELS[slot]}</div>
    <div class="name">${itemNameHtml(item)}</div>
    <div class="desc">${bonusText}</div>
    ${btn}
    </div>
    </div>`;
  }).join('');
  el.innerHTML = `<div class="block-title">Temper Gear</div>${rows}`;
}

/* Quest 16's own "buy a part with currency" leg — the third of its 3
mixed collection methods (a guaranteed zone drop, a salvaged boss part,
and this one), per explicit request. Lives at the Tinker's Workshop
alongside gear tempering since both are "spend currency to get
something built," rather than adding a whole new building for one
purchase. Only shows up at all while the quest is actually active and
the part isn't already held — same "nothing to do here" collapse
renderTinkerTemperBlock() above uses. */
function renderDriveShaftBlock(){
  const el = document.getElementById('drive-shaft-block');
  if(!el) return;
  if(!state.quest16Accepted || state.quest16Complete){ el.innerHTML = ''; return; }
  if(state.inventory.some(it => it.key === 'driveShaft')){
    el.innerHTML = `<div class="block-title">Drilldozer Parts</div><div class="quest-desc">You've already got a drive shaft — one's all you need.</div>`;
    return;
  }
  const canAfford = state.popTabs >= DRIVE_SHAFT_COST_POPTABS && state.bountyTokens >= DRIVE_SHAFT_COST_BOUNTYTOKENS;
  el.innerHTML = `<div class="block-title">Drilldozer Parts</div>
  <div class="equip-row">
  <div style="flex:1;">
  <div class="name">${driveShaftItem.name}</div>
  <div class="desc">${driveShaftItem.desc}</div>
  <button class="btn-secondary ${canAfford?'btn-ready':''}" ${canAfford?'':'disabled'} onclick="buyDriveShaft()">Buy — ${DRIVE_SHAFT_COST_POPTABS} Pop Tabs, ${DRIVE_SHAFT_COST_BOUNTYTOKENS} Bounty Tokens</button>
  </div>
  </div>`;
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
    /* No daily claim cap anymore — same single remaining cause as
    renderBountyBoard()'s own copy (render-shop.js): no Act 2 zone
    unlocked yet. */
    activeEntries.push(`
    <div class="quest-log-entry">
    <div class="quest-name">Bounty Board (The Guild)</div>
    <div class="quest-desc">Nothing worth posting yet — check back once you've found somewhere new to hunt.</div>
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
  <div class="quest-progress">Reward claimed: 15 Pop Tabs, 25 XP, 20 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 50 XP, 25 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 20 Pop Tabs, 35 XP, 20 Biscuits, the Bottled Fury spell</div>
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
  <div class="quest-progress">Reward claimed: 30 Pop Tabs, 45 XP, 25 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 40 Pop Tabs, 60 XP, 30 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 50 Pop Tabs, 70 XP, 40 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 150 Pop Tabs, 200 XP, 75 Biscuits</div>
  </div>`);
} else if(state.quest7RareDefeated){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Gnome King's Court</div>
  <div class="quest-desc">The King has fallen behind the palace gate — report back to the guildmaster.</div>
  <div class="quest-progress">Ready to report.</div>
  </div>`);
} else if(state.quest7Accepted){
  const quest7GearItem = PALACE_GATE_GEAR.find(g => g.classRequired === state.classTitle);
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
  <div class="quest-progress">Reward claimed: 40 Pop Tabs, 30 XP, 20 Biscuits</div>
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
  <div class="quest-progress">Reward claimed: 90 Pop Tabs, 70 XP, 35 Biscuits</div>
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

if(state.quest10Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Whatever's Listening</div>
  <div class="quest-desc">You found a way to whatever's coordinating the outposts, and told the guildmaster what you learned.</div>
  <div class="quest-progress">Reward claimed: 140 Pop Tabs, 110 XP, 45 Biscuits</div>
  </div>`);
} else if(state.quest10Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Whatever's Listening</div>
  <div class="quest-desc">Whatever's coordinating those outposts isn't going to introduce itself. Find someone who'll talk, or find the paperwork that already has — either lead gets you there.</div>
  <div class="quest-progress">${state.quest10Path ? 'Ready to report back at the Guild.' : "Nobody's talked yet, and nothing's turned up in writing either."}</div>
  </div>`);
}

if(state.quest11Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Loose Ends</div>
  <div class="quest-desc">Both of them, accounted for — not just whichever talked first.</div>
  <div class="quest-progress">Reward claimed: 170 Pop Tabs, 130 XP, 50 Biscuits</div>
  </div>`);
} else if(state.quest11Accepted){
  const bothAccountedFor = state.tunnelMoleInformantDefeated && state.seniorClerkDefeated;
  const remainingDistrict = quest11RemainingDistrict();
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Loose Ends</div>
  <div class="quest-desc">One of them got away clean. The guildmaster wants both accounted for, not just whichever talked first. ${bothAccountedFor ? '' : `Head back to ${remainingDistrict}, in Mudroot Warren, and finish it.`}</div>
  <div class="quest-progress">${bothAccountedFor ? 'Ready to report back at the Guild.' : (state.tunnelMoleInformantDefeated || state.seniorClerkDefeated ? `1/2 accounted for — ${remainingDistrict} still needs clearing.` : `0/2 accounted for — ${remainingDistrict} still needs clearing.`)}</div>
  </div>`);
}

if(state.quest12Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Chain of Custody</div>
  <div class="quest-desc">The whole chain, start to finish — the Ember Warren's shipments, and who was quietly receiving them.</div>
  <div class="quest-progress">Reward claimed: 190 Pop Tabs, 150 XP, 55 Biscuits</div>
  </div>`);
} else if(state.quest12Accepted){
  const stage2 = state.gearworksForemanDefeated;
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Chain of Custody</div>
  <div class="quest-desc">${stage2 ? 'The trail leads back to the Bureau, in Mudroot Warren — someone there has been receiving every shipment.' : "Someone in the Ember Warren is clearly running the books on this. Find them — start in the Gearworks."}</div>
  <div class="quest-progress">${state.bureauQuartermasterDefeated ? 'Ready to report back at the Guild.' : (stage2 ? 'Head back to the Bureau and find the quartermaster.' : "The foreman hasn't turned up yet.")}</div>
  </div>`);
}

if(state.quest13Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Quenched</div>
  <div class="quest-desc">Whatever was running hot in the Foundry, it's been found and put down.</div>
  <div class="quest-progress">Reward claimed: 220 Pop Tabs, 175 XP, 60 Biscuits</div>
  </div>`);
} else if(state.quest13Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Quenched</div>
  <div class="quest-desc">Something in the Foundry is running hotter than the rest of it. Find out what.</div>
  <div class="quest-progress">${state.quenchMasterDefeated ? 'Ready to report back at the Guild.' : "Not yet found."}</div>
  </div>`);
}

if(state.quest14Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Vault Was Guarding</div>
  <div class="quest-desc">The one door in the Ledger Vault that was never meant to open — opened.</div>
  <div class="quest-progress">Reward claimed: 250 Pop Tabs, 200 XP, 65 Biscuits</div>
  </div>`);
} else if(state.quest14Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">What the Vault Was Guarding</div>
  <div class="quest-desc">Head to the Ledger Vault and approach the committee directly — this one won't come looking for you.</div>
  <div class="quest-progress">${state.vaultKeeperDefeated ? 'Ready to report back at the Guild.' : 'Not yet cleared.'}</div>
  </div>`);
}

if(state.quest15Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Warren Answers</div>
  <div class="quest-desc">The Mole Wars, however anyone ends up telling it, end here.</div>
  <div class="quest-progress">Reward claimed: 320 Pop Tabs, 260 XP, 90 Biscuits</div>
  </div>`);
} else if(state.quest15Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">The Warren Answers</div>
  <div class="quest-desc">Head to the Gearworks and approach the council directly. This is the one that ends it.</div>
  <div class="quest-progress">${state.warrenMotherDefeated ? 'Ready to report back at the Guild.' : 'Not yet cleared.'}</div>
  </div>`);
}

if(state.quest16Complete){
  completedEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Breaking Through</div>
  <div class="quest-desc">The drilldozer broke through the last wall of the Ember Warren — and found crystal on the other side, not rock.</div>
  <div class="quest-progress">Reward claimed: 400 Pop Tabs, 320 XP, 100 Biscuits</div>
  </div>`);
} else if(state.quest16Accepted){
  activeEntries.push(`
  <div class="quest-log-entry">
  <div class="quest-name">Breaking Through</div>
  <div class="quest-desc">Three parts, three different ways: drill-plating off a slag-hauler in the Foundry, the tunnel warden's own rig (find him again, in the Root Cellar), and a drive shaft from the Tinker's Workshop.</div>
  <div class="quest-progress">${heldAllDrilldozerParts() ? 'Ready to report back at the Guild.' : `Plating: ${countDrilldozerPlatingHeld()}/${DRILLDOZER_PLATING_NEEDED} — Rig: ${state.inventory.some(it=>it.key==='drillRig')?'✓':'not yet'} — Drive shaft: ${state.inventory.some(it=>it.key==='driveShaft')?'✓':'not yet'}`}</div>
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
