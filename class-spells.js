/* ---------------- Class-exclusive spell trainers ---------------- */
/* Shared by the Guild ('Meathead'), Casino ('Card Shark'), and Hoodoo
Doctor's ('Hexpert') screens — each trainer teaches only the spells[]
entries (content.js) whose classRequired matches its own class, and any
future classRequired spell shows up here automatically with no further
wiring: just add it to spells[] and it appears at the right trainer,
hidden from the other two classes. Mirrors renderHoodooShop()'s row
markup (render-shop.js) so all class-spell listings look identical. */
function renderClassSpellList(containerId, classTitle){
   const el = document.getElementById(containerId);
   if(!el) return;
   const list = spells.filter(s => s.classRequired === classTitle);
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
the exact same "level-indexed array, format(v) turns one entry into a
one-line string" way those do. */
const CLASS_SKILL_INFO = {
   'Meathead': v => `+${Math.round(v*100)}% melee damage`,
   'Card Shark': v => `+${Math.round(v*100)}% casino payouts`,
   'Hexpert': v => `+${v} spell damage`,
};
const CLASS_SKILL_VALUES = {
   'Meathead': MEATHEAD_DAMAGE_BONUS,
   'Card Shark': CARD_SHARK_PAYOUT_BONUS,
   'Hexpert': HEXPERT_SPELL_DMG_BONUS,
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
   const values = CLASS_SKILL_VALUES[classTitle];
   const level = state.classSkillLevel;
   let html = '<div class="shop-section-title">Class Skill</div>';
   if(level > 0) html += `<div class="quest-desc">Currently: ${format(values[level])}.</div>`;
   if(level >= 3){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">Class Skill <span class="qty-badge">Lv.${level}/3</span></div><div class="desc">Fully trained.</div></div></div>`;
   } else {
      const levelReq = CLASS_SKILL_LEVEL_REQ[level];
      const cost = classSkillCost(level);
      const meetsLevel = state.level >= levelReq;
      const canAfford = state.popTabs >= cost;
      const ready = meetsLevel && canAfford;
      const reqText = meetsLevel ? '' : ` — Requires Lv.${levelReq}`;
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">Class Skill <span class="qty-badge">Lv.${level}/3</span></div><div class="desc">Next: ${format(values[level+1])}${reqText}</div><button class="btn-secondary ${ready?'btn-ready':''}" ${ready?'':'disabled'} onclick="levelUpClassSkill()">Train — ${cost} Pop Tabs</button></div></div>`;
   }
   el.innerHTML = html;
}

/* Character drawer block for casting a known class buff spell outside
combat (castSpell() itself already allows type:'buff' casts outside a
fight — see combat.js). Filtered to state.classTitle same as the
trainers above, so it's empty/hidden for a class-less or off-class
player. Recasting while already active is allowed (just refreshes
classBuffFightsLeft back to CLASS_BUFF_FIGHTS) rather than blocked. */
function renderClassBuffBlock(){
   const el = document.getElementById('classbuff-block');
   if(!el) return;
   const buffSpells = state.classTitle ? spells.filter(s => s.type==='buff' && s.classRequired===state.classTitle) : [];
   if(buffSpells.length===0){
      el.style.display = 'none';
      el.innerHTML = '';
      return;
   }
   el.style.display = 'block';
   const statusLine = state.classBuffFightsLeft > 0
   ? `<div class="stat-points-note" style="color:var(--green);">Buff active — ${state.classBuffFightsLeft} fight${state.classBuffFightsLeft===1?'':'s'} left.</div>`
     : '';
   const rows = buffSpells.map(spell=>{
      const known = state.spellsKnown.includes(spell.id);
      const iconSvg = spell.icon ? spell.icon() : '';
      const canCast = known && state.mp >= spell.mpCost;
      const btnLabel = known ? `Cast — ${spell.mpCost} MP` : 'Not learned yet';
      return `<div class="shop-item"><div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${spell.name}</div><div class="desc">${spell.desc} (${spell.mpCost} MP)</div><button class="btn-secondary" ${canCast?'':'disabled'} onclick="castSpell('${spell.id}')">${btnLabel}</button></div></div>`;
   }).join('');
   el.innerHTML = `<div class="block-title">Class Spell</div>${statusLine}${rows}`;
}
