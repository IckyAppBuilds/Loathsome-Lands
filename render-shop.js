/* Section order + heading for renderInventory() below. Every item type in
content.js falls into exactly one of these buckets (see the type-string
audit in the surrounding history) — consumables first since they're what
you reach for mid-run, then Equipment, then Quest Items, then plain Loot. */
const INVENTORY_SECTIONS = [
  { types:['hp','mp','luck'], title:'Potions & Consumables' },
  { types:['equip'], title:'Equipment' },
  { types:['quest'], title:'Quest Items' },
  { types:['junk'], title:'Loot' },
  ];

function renderInventory(){
  const list = document.getElementById('inv-list');
  if(state.inventory.length===0){
    list.innerHTML = '<div class="inv-empty">Empty. Bring me things.</div>';
    return;
  }
  list.innerHTML = '';

const groups = new Map();
  state.inventory.forEach((item, idx)=>{
    if(!groups.has(item.name)){
      groups.set(item.name, { item, count:0, firstIdx:idx });
    }
    groups.get(item.name).count++;
  });

/* Display order is (fixed type bucket, then name) rather than raw
  state.inventory position. Array position isn't stable: using one
  potion out of a stack splices that exact slot out, and equipping a
  new item pushes the piece it replaces onto the end of the array — so
  grouping straight off array order used to make the whole list
  visually reshuffle every time you used or equipped something. Sorting
  by what the item IS instead of where it currently sits means a given
  item always lands in the same spot. firstIdx is still whatever index
  that stack currently occupies, for the Use/Equip button below — that
  part is unaffected, only the ordering of the groups is. */
const sorted = [...groups.values()].sort((a,b)=>a.item.name.localeCompare(b.item.name));

INVENTORY_SECTIONS.forEach(section=>{
  const entries = sorted.filter(g => section.types.includes(g.item.type));
  if(entries.length===0) return;
  const header = document.createElement('div');
  header.className = 'shop-section-title';
  header.textContent = section.title;
  list.appendChild(header);
  entries.forEach(({item, count, firstIdx})=>{
    const div = document.createElement('div');
    div.className='inv-item';
    let btn = '';
    if(item.type==='hp' || item.type==='mp' || item.type==='luck'){
      btn = `<button class="btn-secondary" onclick="useItem(${firstIdx})">Use</button>`;
    } else if(item.type==='equip'){
      /* getGearRequirements() (item-tiers.js) derives both checks from
      the item's own bonus — same requirement equipItem() (player-
      actions.js) itself enforces, so the button's disabled state never
      disagrees with what actually happens on click. */
      const req = getGearRequirements(item);
      const meetsReq = state.level >= req.levelReq && (!req.statKey || state.stats[req.statKey] >= req.statReq);
      btn = `<button class="btn-secondary" ${meetsReq?'':'disabled'} onclick="equipItem(${firstIdx})">Equip</button>`;
    }
    const iconSvg = item.icon ? item.icon() : '';
    const qtyBadge = count>1 ? `<span class="qty-badge">×${count}</span>` : '';
    const slotBadge = item.type==='equip' ? ` <span class="qty-badge">${SLOT_LABELS[item.slot]}</span>` : '';
    /* Quest-turn-in items (potion/vein ingredients, rake tines) all carry
    type:"quest" (see content.js) — flag them here so they read as
    distinct from ordinary junk/loot at a glance, per user feedback. */
                  const questBadge = item.type==='quest' ? ` <span class="quest-badge">Quest Item</span>` : '';
    const bonusText = item.type==='equip' && item.bonus && Object.keys(item.bonus).length
    ? ` (${Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`
      : consumableEffectText(item);
    const reqText = item.type==='equip' ? gearRequirementText(item) : '';
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${itemNameHtml(item)}${qtyBadge}${slotBadge}${questBadge}</div><div class="desc">${item.desc}${bonusText}${reqText}</div>${btn}</div>`;
    list.appendChild(div);
  });
});
}

/* Item rows for whatever just dropped off the monster winCombat() (combat.js)
just beat — collected onto state.victoryMonster.drops there, the same
item objects pushed to state.inventory, so this is never a re-derived
guess at what dropped. Same row markup as renderInventory()'s Equipment/
Loot rows (icon, tier-colored name, bonus/requirement text) minus the
Use/Equip button, since these are already sitting in the Pack — this is
just an at-a-glance preview on the combat screen itself, not a second
place to act on them. */
function victoryDropsHtml(drops){
  if(!drops || drops.length===0) return '';
  return drops.map(item=>{
    const iconSvg = item.icon ? item.icon() : '';
    const slotBadge = item.type==='equip' ? ` <span class="qty-badge">${SLOT_LABELS[item.slot]}</span>` : '';
    const bonusText = item.type==='equip' && item.bonus && Object.keys(item.bonus).length
      ? ` (${Object.entries(item.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`
      : consumableEffectText(item);
    const reqText = item.type==='equip' ? gearRequirementText(item) : '';
    return `<div class="inv-item"><div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${itemNameHtml(item)}${slotBadge}</div><div class="desc">${item.desc}${bonusText}${reqText}</div></div></div>`;
  }).join('');
}

/* Which pane of the Shop is showing: 'food' | 'gear' | 'sell'. UI-only —
not part of `state`, not saved — reset to 'food' on every enterShop()
(game.js) so the drawer doesn't reopen wherever it was left last time. */
let shopTab = 'food';

function setShopTab(tab){
  shopTab = tab;
  renderShop();
}

/* How long a shop row keeps flashing its "just bought" animation after a
purchase — checked against lastPurchase.at (economy.js) rather than
cleared by a timer, so it just stops matching once enough real time has
passed. Long enough to register as feedback, short enough that flipping
back to this tab later never replays it. */
const PURCHASE_FLASH_MS = 1200;

function renderShopItemRow(def){
  const div = document.createElement('div');
  const justBought = lastPurchase && lastPurchase.name===def.name
    && (def.type!=='equip' || lastPurchase.tier===def.tier)
    && (Date.now() - lastPurchase.at < PURCHASE_FLASH_MS);
  div.className = 'shop-item' + (justBought ? ' just-bought' : '');
  const iconSvg = def.icon ? def.icon() : '';
  const canAfford = state.popTabs >= def.price;
  const slotTag = def.slot ? ` <span class="qty-badge">${SLOT_LABELS[def.slot]}</span>` : '';
  /* How many of this exact shop listing are already sitting in the Pack
  — equip matches by name+tier (rollShopGearStats(), economy.js, keeps
  both fixed across a purchase, only secondary stats vary), everything
  else by name alone, same convention the Sell tab's grouping uses. */
  const ownedCount = state.inventory.filter(it => it.name===def.name && (def.type!=='equip' || it.tier===def.tier)).length;
  const ownedTag = ownedCount>0 ? ` <span class="qty-badge">Owned: ${ownedCount}</span>` : '';
  /* Tier 2/3 gear rolls its secondary stat(s) fresh at purchase
  (rollShopGearStats(), economy.js) rather than always granting the
  specific secondary stat(s) listed on this definition — so the listing
  shows the guaranteed primary stat plus how many stats get rolled,
  not a promise of exactly which ones. Tier 1 (a single stat) has
  nothing to roll, so it still shows its one stat plainly. */
  const statKeys = def.bonus ? Object.keys(def.bonus) : [];
  let bonusTag = consumableEffectText(def);
  if(statKeys.length === 1){
    bonusTag = ` (+${def.bonus[statKeys[0]]} ${STAT_LABELS[statKeys[0]]})`;
  } else if(statKeys.length > 1){
    const primaryStat = statKeys[0];
    const secondaryCount = statKeys.length - 1;
    bonusTag = def.type === 'equip'
    ? ` (+${def.bonus[primaryStat]} ${STAT_LABELS[primaryStat]}, plus ${secondaryCount} random stat${secondaryCount>1?'s':''})`
      : ` (${Object.entries(def.bonus).map(([k,v])=>`+${v} ${STAT_LABELS[k]}`).join(', ')})`;
  }
  /* Purchasing itself is only gated on Pop Tabs — an item can be bought
  ahead of meeting its own level/stat requirement (getGearRequirements(),
  item-tiers.js) and equipped later once you get there, same as any
  ARPG lets you loot/buy above-your-level gear. This is just an FYI so
  the player isn't surprised when equipItem() (player-actions.js) later
  refuses it. */
  const reqText = def.type==='equip' ? gearRequirementText(def) : '';
  div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${itemNameHtml(def)}${slotTag}${ownedTag}</div><div class="desc">${def.desc}${bonusTag}${reqText} (${def.price} Pop Tabs)</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="buyItemByName('${def.name.replace(/'/g,"\\'")}')">Buy — ${def.price} Pop Tabs</button></div>`;
  return div;
}

function renderShop(){
  const shopList = document.getElementById('shop-list');
  shopList.innerHTML = '';

const tabRow = document.createElement('div');
  tabRow.className = 'btn-row';
  [['food','Food'], ['gear','Gear'], ['sell','Sell']].forEach(([id, label])=>{
    const btn = document.createElement('button');
    btn.className = shopTab === id ? 'btn-primary' : 'btn-secondary';
    btn.textContent = label;
    btn.onclick = () => setShopTab(id);
    tabRow.appendChild(btn);
  });
  shopList.appendChild(tabRow);

const allItems = getAvailableShopItems();

if(shopTab === 'food' || shopTab === 'gear'){
  const items = allItems.filter(def => def.type === (shopTab === 'food' ? 'hp' : 'equip'));
  const section = document.createElement('div');
  if(items.length === 0){
    section.innerHTML = `<div class="shop-section-title">${shopTab === 'food' ? 'Food For Sale' : 'Gear For Sale'}</div><div class="shop-empty">Nothing here yet. Upgrading the Shop (Town Lot) brings in better stock.</div>`;
  } else {
    /* Each tier gets its own section instead of one flat list that just
    grows as more tiers unlock — tier order is fixed (common -> uncommon
    -> rare -> epic) rather than trusting array order, since shopBuyItems/
    shopGearItemsTier2/Tier3/Tier4 concatenate in unlock order, not tier
    order. Section header colored to match that tier's rarity color
    (item-tiers.js), same visual language as the items listed under it. */
    const TIER_ORDER = ['common', 'uncommon', 'rare', 'epic'];
    const TIER_LABEL = { common:'Tier 1', uncommon:'Tier 2', rare:'Tier 3', epic:'Tier 4' };
    TIER_ORDER.forEach(tier => {
      const tierItems = items.filter(def => (def.tier || 'common') === tier);
      if(tierItems.length === 0) return;
      const header = document.createElement('div');
      header.className = 'shop-section-title';
      header.style.color = ITEM_TIER_COLORS[tier];
      header.textContent = `${TIER_LABEL[tier]} ${shopTab === 'food' ? 'Food' : 'Gear'}`;
      section.appendChild(header);
      tierItems.forEach(def => section.appendChild(renderShopItemRow(def)));
    });
  }
  shopList.appendChild(section);
  return;
}

const sellSection = document.createElement('div');
  sellSection.innerHTML = '<div class="shop-section-title">Sell Your Junk</div>';
  /* Equip/consumable items are always sellable now — getItemSellValue()
  (item-tiers.js) derives a price from tier/bonus or tier/heal-value, so
  there's no stored `sell` field to gate on the way junk/quest items
  still have. */
  const sellable = state.inventory.filter(it => it.type==='equip' || it.type==='hp' || it.type==='mp' || it.type==='luck'
    || (it.sell && (it.type==='junk' || isQuestItemSellable(it))));

if(sellable.length===0){
  sellSection.innerHTML += '<div class="shop-empty">Nothing in your pack worth selling. Bring back some gnome junk.</div>';
} else {
  const groups = new Map();
  sellable.forEach(item=>{
    /* Equip items group by name+tier, not name alone — the same drop
    name can roll different tiers (rollGearDropTier(), combat.js), and
    those sell for different amounts, so lumping them together would
    show one wrong blended price. Junk/quest items never vary by tier,
    so they keep grouping by name only. */
    const key = item.type==='equip' ? `${item.name}::${item.tier}` : item.name;
    if(!groups.has(key)) groups.set(key, { item, count:0 });
    groups.get(key).count++;
  });
  /* Sort by name rather than trusting state.inventory's current order —
  same reasoning as renderInventory() above: that order shifts under
  this list's feet whenever items are used/equipped elsewhere, which
  made entries here reshuffle too even though nothing was sold. */
  [...groups.values()].sort((a,b)=>a.item.name.localeCompare(b.item.name)).forEach(({item, count})=>{
    const div = document.createElement('div');
    div.className = 'shop-item';
    const iconSvg = item.icon ? item.icon() : '';
    const unitSell = getItemSellValue(item);
    const total = unitSell * count;
    const tierArg = item.type==='equip' ? `, '${item.tier}'` : '';
    div.innerHTML = `<div class="icon-box">${iconSvg}</div><div style="flex:1;"><div class="name">${itemNameHtml(item)} <span class="qty-badge">×${count}</span></div><div class="desc">${item.desc} (${unitSell} Pop Tab${unitSell>1?'s':''} each)</div><button class="btn-secondary" onclick="sellItemByName('${item.name.replace(/'/g,"\\'")}'${tierArg})">Sell All — ${total} Pop Tabs</button></div>`;
    sellSection.appendChild(div);
  });
}
  shopList.appendChild(sellSection);
}

/* Repeatable content, rendered as its own section below the Guild's
quest-offer box (never replacing it) — see BOUNTY_TEMPLATES (content.js)
and rollNewBounty()/claimBounty() (game.js). Seeds a bounty on the
player's very first visit here, then just reflects whatever's active. */
function renderBountyBoard(){
  ensureActiveBounty();
  const el = document.getElementById('bounty-box');
  if(!el) return;
  if(!state.activeBounty){
    el.innerHTML = `
    <div class="block-title">Bounty Board</div>
    <div class="quest-desc">You've claimed ${BOUNTY_DAILY_CAP} bounties today — the board's empty until tomorrow.</div>
    <div class="quest-progress" style="color:var(--tan);">${state.bountiesCompleted} bounties completed lifetime. You have ${state.bountyTokens} Bounty Token${state.bountyTokens===1?'':'s'}.</div>
    `;
    return;
  }
  const bt = BOUNTY_TEMPLATES.find(b => b.id === state.activeBounty.templateId);
  if(!bt){ el.innerHTML = ''; return; }
  const progress = Math.min(bt.count, state.activeBounty.progress);
  const done = isBountyReady();
  const zoneLabel = ZONE_LABELS[bt.zone] || bt.zone;
  const timeLeft = formatBountyTimeLeft(BOUNTY_RESET_MS - (Date.now() - state.activeBounty.startedAt));
  el.innerHTML = `
  <div class="block-title">Bounty Board</div>
  <div class="quest-desc">Bounty: slay ${bt.count} × ${bt.monsterName} in ${zoneLabel}.</div>
  <div class="quest-progress">${progress}/${bt.count}${done ? ' — ready to claim!' : ''}</div>
  <div class="quest-progress" style="color:var(--tan);">${done ? "Claim it before it resets." : `Resets in ${timeLeft} if not completed.`}</div>
  <div class="quest-progress" style="color:var(--tan);">Reward: ${bt.reward.bountyTokens} Bounty Token${bt.reward.bountyTokens===1?'':'s'}. You have ${state.bountyTokens} Bounty Token${state.bountyTokens===1?'':'s'} (${state.bountiesCompleted} bounties completed). Tokens can be spent at a future gear exchange — nothing to redeem them for yet.</div>
  <div class="btn-row" style="margin:8px 0 0;">
  <button class="btn-primary" ${done ? '' : 'disabled'} onclick="claimBounty()">Claim Bounty</button>
  </div>
  `;
}

/* Passive Casino income ("the house's cut") — only shows once the Casino
is upgraded at least once (CASINO_WINNINGS_CAP[0]=0 means casinoWinningsCap()
itself reports nothing to show below that). regenCasinoWinnings() (economy.js)
is called here so the displayed amount is always current, same pattern as
renderBountyBoard()'s ensureActiveBounty() call above. */
function renderCasinoWinningsBox(){
  const el = document.getElementById('casino-winnings-box');
  if(!el) return;
  const cap = casinoWinningsCap();
  if(cap <= 0){ el.innerHTML = ''; return; }
  regenCasinoWinnings();
  const ready = state.casinoWinnings > 0;
  const full = state.casinoWinnings >= cap;
  el.innerHTML = `
  <div class="block-title">The House's Cut</div>
  <div class="quest-desc">Owning a piece of the Casino means a piece of the take, win or lose — it piles up whether you're here or not, up to a cap that grows the more you upgrade the place.</div>
  <div class="quest-progress">${state.casinoWinnings} / ${cap} Pop Tabs banked${full ? ' — full, collect it before more piles up for nothing' : ''}</div>
  <div class="btn-row" style="margin:8px 0 0;">
  <button class="btn-primary" ${ready ? '' : 'disabled'} onclick="claimCasinoWinnings()">Collect Winnings</button>
  </div>
  `;
}

function renderHoodooShop(){
  const el = document.getElementById('hoodoo-list');
  el.innerHTML = '<div class="shop-section-title">Spells to Learn</div>';
  /* classRequired spells (content.js) are hidden here — each class's own
  spell trainer lives at that class's own building instead (Hoodoo's own
  Hexpert-only section is rendered separately below via the shared
  class-spells.js helper, so this list stays "learnable by anyone"). */
  spells.filter(s => !s.questReward && !s.classRequired).forEach(spell=>{
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

  const resetPrice = STAT_RESET_BASE_PRICE * Math.pow(STAT_RESET_PRICE_MULT, state.statResetsBrewed);
  const resetCanAfford = state.popTabs >= resetPrice;
  const resetTitle = document.createElement('div');
  resetTitle.className = 'shop-section-title';
  resetTitle.textContent = 'Stat Reset';
  el.appendChild(resetTitle);
  const resetDiv = document.createElement('div');
  resetDiv.className = 'shop-item';
  resetDiv.innerHTML = `<div style="flex:1;"><div class="name">Unravelling Draught</div><div class="desc">Untangles every stat point you've ever sunk into Beef, Zip, Grit, or Hoodoo, so you can lay them down again — hopefully better this time. Gets pricier with practice.</div><button class="btn-secondary" ${resetCanAfford?'':'disabled'} onclick="brewStatResetPotion()">Brew — ${resetPrice} Pop Tabs</button></div>`;
  el.appendChild(resetDiv);

  renderClassSpellList('hoodoo-class-spell-list', 'Hexpert');
}

/* Per-building level-effect formatters for the Town Lot listing below.
Keyed the same as BUILDING_UPGRADES (content.js); each array entry's
`values` is a matching LEVEL-indexed constant from content.js (index 0
is the no-bonus baseline) and `format(v)` turns one entry into the
one-line text shown for "Currently"/"Next level". Percent-based effects
are fractions in content.js (e.g. 0.30), so format() multiplies by 100
and rounds rather than hardcoding a number here — 'shop' isn't a
fraction/flat-bonus array like the rest, so it's handled separately
below by buildingEffectDesc().

Most buildings only have one effect, but Casino has two independent
ones (CASINO_WIN_BONUS for active gambling odds, CASINO_WINNINGS_CAP
for the separate passive-income mechanic, content.js) — each key maps
to an ARRAY of these so buildingEffectDesc() below can print a
"Currently"/"Next level" pair per effect instead of only ever showing
the first (which was the actual bug: the passive-income unlock/raise
never showed up here at all, only the win-odds bump did). */
const BUILDING_EFFECT_INFO = {
   gaffer: [ { values: GAFFER_BISCUIT_MAX_BONUS, format: v => `+${v} max Biscuits` } ],
   hoodoo: [ { values: HOODOO_SPELL_DISCOUNT, format: v => `${Math.round(v*100)}% off spells` } ],
   inn: [ { values: INN_FREE_REST_CHANCE, format: v => `${Math.round(v*100)}% chance of a free rest` } ],
   tinker: [ { values: TINKER_SELL_BONUS, format: v => `+${Math.round(v*100)}% on junk sale prices` } ],
   guild: [ { values: GUILD_BOUNTY_BONUS, format: v => `+${Math.round(v*100)}% Bounty Token rewards` } ],
   casino: [
      { values: CASINO_WIN_BONUS, format: v => `+${Math.round(v*100)}% casino win odds` },
      { values: CASINO_WINNINGS_CAP, format: v => `passive Casino income, capped at ${v} Pop Tabs` },
   ],
   };

/* The Shop's tiers aren't a single cumulative number like the other 6
buildings — each level unlocks specific stock tiers (see the
SHOP_LEVEL_FOOD_TIER2/TIER3/GEAR_TIER2/TIER3/TIER4 comment in content.js),
so its "currently"/"next level" text lists unlock names instead of
formatting a value. Pulls the level numbers from those constants rather
than hardcoding 1/2/3 so this stays correct if the tiers are ever
reordered. Food and gear share a level (tier 2 of each at level 1, tier 3
at level 2), so a level can unlock more than one thing — add() appends
rather than overwrites when that happens. */
function shopTierUnlockNames(){
  const names = {};
  const add = (level, label) => { names[level] = names[level] ? `${names[level]}, ${label}` : label; };
  add(SHOP_LEVEL_GEAR_TIER2, 'Tier 2 gear stock');
  add(SHOP_LEVEL_FOOD_TIER2, 'Tier 2 food stock');
  add(SHOP_LEVEL_GEAR_TIER3, 'Tier 3 gear stock');
  add(SHOP_LEVEL_FOOD_TIER3, 'Tier 3 food stock');
  add(SHOP_LEVEL_GEAR_TIER4, 'Tier 4 gear stock');
  return names;
}

/* Builds the "Currently: ___." / "Next level: ___." lines shown under a
Town Lot building's name, using the actual content.js constants so the
text can't drift out of sync with the numbers driving the mechanic. */
function buildingEffectDesc(key, level){
  if(key === 'shop'){
    const names = shopTierUnlockNames();
    let lines = '';
    if(level > 0){
      const unlocked = [];
      for(let l=1; l<=level; l++){ if(names[l]) unlocked.push(names[l]); }
      if(unlocked.length) lines += `<div class="quest-desc">Currently: ${unlocked.join(', ')} unlocked.</div>`;
    }
    if(level < BUILDING_UPGRADE_MAX && names[level+1]){
      lines += `<div class="quest-desc">Next level: ${names[level+1]} unlocked.</div>`;
    }
    return lines;
  }
  const infos = BUILDING_EFFECT_INFO[key];
  if(!infos) return '';
  let lines = '';
  infos.forEach(info => {
    if(level > 0){
      lines += `<div class="quest-desc">Currently: ${info.format(info.values[level])}.</div>`;
    }
    if(level < BUILDING_UPGRADE_MAX){
      lines += `<div class="quest-desc">Next level: ${info.format(info.values[level+1])}.</div>`;
    }
  });
  return lines;
}

/* The Town Lot — the previously-empty town-square cell (translate(200,100)
in artTownSquare(), core.js). Unpurchased (state.lotTier===0) it's just a
buy prompt; once owned it shows cosmetic lot-tier upgrades plus a level
for each of the other 7 town buildings (state.buildingUpgrades, core.js —
see LOT_TIER_NAMES/LOT_TIER_COST/BUILDING_UPGRADES in content.js and
buyTownLot()/upgradeTownLot()/upgradeBuilding() in game.js). */
function renderTownLot(){
  const el = document.getElementById('townlot-list');
  if(state.lotTier === 0){
    const cost = LOT_TIER_COST[1];
    const canAfford = state.popTabs >= cost;
    el.innerHTML = `
    <div class="shop-section-title">Empty Lot</div>
    <div class="shop-item"><div style="flex:1;"><div class="name">Buy the Lot</div><div class="desc">Clear it out and claim it for the town. Owning it is what lets you start investing in the rest of Gladstone Hollow.</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="buyTownLot()">Buy — ${cost} Pop Tabs</button></div></div>
    `;
    return;
  }

let html = '<div class="shop-section-title">Your Town Lot</div>';
  if(state.lotTier < LOT_TIER_MAX){
    const next = state.lotTier + 1;
    const cost = LOT_TIER_COST[next];
    const canAfford = state.popTabs >= cost;
    html += `<div class="shop-item"><div style="flex:1;"><div class="name">${LOT_TIER_NAMES[state.lotTier]} <span class="qty-badge">→ ${LOT_TIER_NAMES[next]}</span></div><div class="desc">Upgrade the lot itself — cosmetic for now.</div><button class="btn-secondary" ${canAfford?'':'disabled'} onclick="upgradeTownLot()">Upgrade — ${cost} Pop Tabs</button></div></div>`;
  } else {
    html += `<div class="shop-empty">${LOT_TIER_NAMES[state.lotTier]} — fully built up.</div>`;
  }

html += '<div class="shop-section-title" style="margin-top:10px;">Upgrade Town Buildings</div>';
  html += '<div class="quest-desc" style="margin:0 0 8px;">Spend Pop Tabs to raise a building\'s level — a building can never out-level the lot itself, so upgrading the lot is what unlocks each building\'s next tier. Most buildings are cosmetic for now; the Shop\'s levels unlock better stock (see the Shop).</div>';
  BUILDING_UPGRADES.forEach(b=>{
    const level = state.buildingUpgrades[b.key] || 0;
    const effectDesc = buildingEffectDesc(b.key, level);
    if(level >= BUILDING_UPGRADE_MAX){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Fully upgraded.</div>${effectDesc}</div></div>`;
      return;
    }
    if(level >= state.lotTier){
      html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Requires the lot itself at ${LOT_TIER_NAMES[level+1]} first.</div>${effectDesc}<button class="btn-secondary" disabled>Locked</button></div></div>`;
      return;
    }
    const cost = buildingUpgradeCost(level);
    const canAfford = state.popTabs >= cost;
    html += `<div class="shop-item"><div style="flex:1;"><div class="name">${b.name} <span class="qty-badge">Lv.${level}</span></div><div class="desc">Raise to level ${level+1}.</div>${effectDesc}<button class="btn-secondary" ${canAfford?'':'disabled'} onclick="upgradeBuilding('${b.key}')">Upgrade — ${cost} Pop Tabs</button></div></div>`;
  });
  el.innerHTML = html;
}
