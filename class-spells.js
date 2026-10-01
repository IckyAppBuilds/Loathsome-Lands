/* ---------------- Class-exclusive spell trainers ---------------- */
/* Shared by every class trainer building — the Guild/Casino/Hoodoo
Doctor's (Act 1) and the Garrison/Rogues' Den/Arcane Sanctum (Act 2,
Gnometropolis) — each teaches only the spells[] entries (content.js)
whose classRequired matches its own class AND whose effective learn
location (learnLocation, or CLASS_SPELL_LOCATION's default — same
resolution learnSpell() uses, combat.js) is THIS building specifically,
so a class's Act 1 trainer never lists its Act 2 spell (or vice versa)
— any future classRequired spell shows up at the right trainer
automatically with no further wiring: just add it to spells[] and it
appears there, hidden everywhere else. Mirrors renderHoodooShop()'s row
markup (render-shop.js) so all class-spell listings look identical. */
function renderClassSpellList(containerId, classTitle){
   const el = document.getElementById(containerId);
   if(!el) return;
   const list = spells.filter(s => s.classRequired === classTitle
      && (s.learnLocation || CLASS_SPELL_LOCATION[classTitle]) === state.location);
   if(state.classTitle !== classTitle || list.length===0){
      el.style.display = 'none';
      el.innerHTML = '';
      return;
   }
   el.style.display = 'block';
   el.innerHTML = '<div class="shop-section-title">Class Spells to Learn</div>';
   list.forEach(spell=>{
      const known = state.spellsKnown.includes(spell.id);
      const div = document.createElement('div');
      div.className = 'shop-item';
      const iconSvg = spell.icon ? spell.icon() : '';
      const canAfford = state.popTabs >= spell.price;
      const btn = known
      ? `<button class="btn-secondary" disabled>Known</button>`
        : `<button class="btn-secondary" ${canAfford?'':'disabled'} onclick="learnSpell('${spell.id}')">Learn — ${spell.price} Pop Tabs</button>`;
      div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP to cast)</div>${btn}</div>`;
      el.appendChild(div);
   });
}

/* Per-class formatter for the class-skill upgrade block below — keyed the
same way BUILDING_EFFECT_INFO (render-shop.js) formats a Town Lot
building's per-level bonus, since state.classSkillLevel drives its bonus
the exact same "level-indexed array" way those do. Takes the LEVEL
itself now (not a single pre-looked-up value) since Meathead/Hexpert
each describe TWO numbers off the same level — their own flat bonus
(MEATHEAD_DAMAGE_BONUS/HEXPERT_SPELL_DMG_BONUS) plus their own combat-
variety proc (MEATHEAD_STAGGER_CHANCE/HEXPERT_ECHO_CHANCE, content.js —
see the comment above those for why Card Shark's double-attack was the
only one of the three that ever produced a visible moment in a fight
before this). */
const CLASS_SKILL_INFO = {
   'Meathead': lvl => `+${Math.round(MEATHEAD_DAMAGE_BONUS[lvl]*100)}% melee damage, ${Math.round(MEATHEAD_STAGGER_CHANCE[lvl]*100)}% chance to stagger (skip their counterattack)`,
   'Card Shark': lvl => `${Math.round(CARD_SHARK_DOUBLE_ATTACK_CHANCE[lvl]*100)}% chance to attack twice in one turn`,
   'Hexpert': lvl => `+${HEXPERT_SPELL_DMG_BONUS[lvl]} spell damage, ${Math.round(HEXPERT_ECHO_CHANCE[lvl]*100)}% chance to echo-cast for free`,
};

/* Shared by the same 3 screens as renderClassSpellList() above — the
purchase UI levelUpClassSkill() (guild.js) never had until now, so the
class-skill counter it levels was raisable in state but unreachable from
any button. Shows the current bonus, and — gated on BOTH state.level
(CLASS_SKILL_LEVEL_REQ, content.js) and Pop Tabs (classSkillCost()),
same as gear's own level requirement — the next tier's bonus and cost. */
function renderClassSkillUpgrade(containerId, classTitle){
   const el = document.getElementById(containerId);
   if(!el) return;
   if(state.classTitle !== classTitle){
      el.style.display = 'none';
      el.innerHTML = '';
      return;
   }
   el.style.display = 'block';
   const format = CLASS_SKILL_INFO[classTitle];
   const level = state.classSkillLevel;
   let html = '<div class="shop-section-title">Class Skill</div>';
   if(level > 0) html += `<div class="quest-desc">Currently: ${format(level)}.</div>`;
   if(level >= 3){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">Class Skill <span class="qty-badge">Lv.${level}/3</span></div><div class="desc">Fully trained.</div></div></div>`;
   } else {
      const levelReq = CLASS_SKILL_LEVEL_REQ[level];
      const cost = classSkillCost(level);
      const meetsLevel = state.level >= levelReq;
      const canAfford = state.popTabs >= cost;
      const ready = meetsLevel && canAfford;
      const reqText = meetsLevel ? '' : ` — Requires Lv.${levelReq}`;
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">Class Skill <span class="qty-badge">Lv.${level}/3</span></div><div class="desc">Next: ${format(level+1)}${reqText}</div><button class="btn-secondary ${ready?'btn-ready':''}" ${ready?'':'disabled'} onclick="levelUpClassSkill()">Train — ${cost} Pop Tabs</button></div></div>`;
   }
   el.innerHTML = html;
}

/* Hexpert's own Level 2 spell-upgrade shop, Arcane Sanctum-exclusive
per explicit request — lists EVERY spell the player currently knows
(state.spellsKnown), not just the ones actually taught here, since the
point is deepening spells learned anywhere (Hex Bolt/Bottled Fury/
Mending Charm/Warding Charm at Hoodoo, Arcane Focus/Arcane Lance/
Illusion at Hoodoo/here). A Hexpert can only ever know Hexpert-eligible
spells to begin with (learnSpell()'s own classRequired gate, combat.js),
so no extra type filter is needed beyond "known". One flat tier per
spell (state.spellsUpgraded, core.js) — once bought, that row just
shows "Upgraded", same shape the Class Skill block above uses once
fully trained. */
function renderSpellUpgradeBlock(containerId){
   const el = document.getElementById(containerId);
   if(!el) return;
   if(state.classTitle !== 'Hexpert' || state.spellsKnown.length===0){
      el.style.display = 'none';
      el.innerHTML = '';
      return;
   }
   el.style.display = 'block';
   const known = state.spellsKnown.map(id => spells.find(s=>s.id===id)).filter(Boolean);
   const rows = known.map(spell=>{
      const iconSvg = spell.icon ? spell.icon() : '';
      const upgraded = state.spellsUpgraded.includes(spell.id);
      const btn = upgraded
      ? `<button class="btn-secondary" disabled>Upgraded</button>`
        : (()=>{
           const cost = spellUpgradeCost(spell);
           const canAfford = state.popTabs >= cost;
           return `<button class="btn-secondary ${canAfford?'btn-ready':''}" ${canAfford?'':'disabled'} onclick="upgradeSpell('${spell.id}')">Level 2 — ${cost} Pop Tabs</button>`;
        })();
      return `<div class="shop-item"><div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}${upgraded?' <span class="qty-badge">Lv.2</span>':''}</div><div class="desc">${spell.desc}</div>${btn}</div></div>`;
   }).join('');
   el.innerHTML = `<div class="block-title">Deepen Your Spells</div>${rows}`;
}

/* Character drawer block for casting any KNOWN non-damage spell —
'damage' spells need a monster to target and still only show in the
in-combat Use menu (renderSpellMenu(), render-character.js); every
other type (heal/ward/buff/shout) never costs a turn (castSpell(),
combat.js, only calls monsterRetaliate() for 'damage') so it's fully
usable from here, mid-fight or not. Not filtered to class-exclusive
spells only, unlike renderClassSpellList() above — Mending Charm/
Warding Charm are Hexpert-exclusive now too (content.js), but a
class-less player could still know Hex Bolt... no, that's 'damage', so
in practice everyone who reaches this block already has a class, but
the filter itself is just "non-damage AND known," not "class-exclusive
AND known," so it stays correct if a future non-class-exclusive
non-damage spell is ever added.

'evade' (Smoke Screen/Illusion) is excluded here too, same reasoning as
'damage' — it needs a CURRENT fight to apply to (state.evasionActive
means nothing outside combat), so it only ever shows in the in-combat
Use menu's own "Buffs & Support" section, never here. */
function renderCastableSpellsBlock(){
   const el = document.getElementById('castable-spells-block');
   if(!el) return;
   /* isSpellCurrentlyUsable() (render-character.js) also excludes a known
   spell whose classRequired no longer matches state.classTitle — see
   its own comment for how that happens (the dev tools' class override,
   not real play) and why it'd otherwise show a Cast button that always
   silently refuses. */
   const castable = spells.filter(s => s.type!=='damage' && s.type!=='evade' && state.spellsKnown.includes(s.id) && isSpellCurrentlyUsable(s));
   if(castable.length===0){
      el.style.display = 'none';
      el.innerHTML = '';
      return;
   }
   el.style.display = 'block';
   const statusLine = state.classBuffFightsLeft > 0
   ? `<div class="stat-points-note" style="color:var(--green);">Buff active — ${state.classBuffFightsLeft} fight${state.classBuffFightsLeft===1?'':'s'} left.</div>`
     : '';
   const rows = castable.map(spell=>{
      const iconSvg = spell.icon ? spell.icon() : '';
      const canCast = state.mp >= spell.mpCost;
      /* Same "Lv.2" tag as renderSpellMenu()'s own Buffs & Support rows
      (render-character.js) for a Hexpert's Sanctum-upgraded spells. */
      const lvBadge = state.spellsUpgraded.includes(spell.id) ? ` <span class="qty-badge">Lv.2</span>` : '';
      return `<div class="shop-item"><div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}${lvBadge}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">Cast — ${spell.mpCost} MP</button></div></div>`;
   }).join('');
   el.innerHTML = `<div class="block-title">Spells</div>${statusLine}${rows}`;
}
