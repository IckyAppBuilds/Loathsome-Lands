/* ---------------- Item rarity tiers ---------------- */
/* A Diablo/WoW-style colored-name system for items — poor (gray) through
legendary (gold), plus a "quest" tier for quest-turn-in items (a
different signal than power level, so it gets its own color rather than
slotting into the poor->legendary ramp). Reuses the existing CSS custom
properties (styles.css) rather than inventing new colors.

Most items carry an explicit `tier` field set right on their definition
(content.js's starterGear, every shopGearItems tier, PALACE_GATE_GEAR,
healItems, and every shopFoodItems tier — equip/consumable tier varies
per array, so there's no single rule to derive it from). Two categories
are deliberately left
untagged and derived instead, since ALL items of that type are
uniformly one tier:
- type:'quest' (rake tine, potion/vein ingredients) -> always 'quest'.
- type:'junk' (ordinary monster loot) -> always 'poor', UNLESS an
  explicit tier overrides it — a rare drop can itself be typed 'junk'
  or 'luck' (content.js's rareDrop entries), but winCombat() (combat.js)
  stamps tier:'legendary' onto it at the moment it's looted, and
  getItemTier() below always prefers an explicit tier over the
  type-based fallback. */
const ITEM_TIER_COLORS = {
   poor: 'var(--grey-dark)',
   common: 'var(--black)',
   uncommon: 'var(--green)',
   rare: 'var(--blue)',
   epic: 'var(--magenta)',
   legendary: 'var(--yellow)',
   quest: 'var(--tan)',
};

function getItemTier(item){
   if(!item) return 'common';
   if(item.tier) return item.tier;
   if(item.type === 'quest') return 'quest';
   if(item.type === 'junk') return 'poor';
   return 'common';
}

/* Wraps an item's name in its tier color — used everywhere an item's
name is rendered via innerHTML against known, data-driven content (the
Pack, Shop listings, equipped gear, the Rare Finds log). Never used
against log()'s text messages, which stay plain text (log() sets
textContent, not innerHTML, so a color span there would just show up as
literal tags rather than being XSS-relevant, but it'd look broken). */
function itemNameHtml(item){
   return `<span style="color:${ITEM_TIER_COLORS[getItemTier(item)]};">${item.name}</span>`;
}

/* An equip item's level requirement is never stored on the item itself —
it's derived here, straight from its own `bonus` object, every time it's
needed (equipItem(), player-actions.js; the Pack and Shop listings,
render-shop.js/render-character.js). This is deliberate: a requirement
derived this way can never drift out of alignment with what the item
actually grants, the way a hand-authored parallel field could once bonus
values get rebalanced later.

levelReq = 2x the item's total stat points (every bonus value summed) —
a plain +1 tier-1 item needs level 2, a 3-stat (+3/+1/+1) tier-3 item
needs level 10. An item with no bonus (starterGear) or no stats at all
needs nothing.

Stat requirements (statReq/statKey) were dropped: level alone was already
gating gear sensibly, and a separate base-stat floor mostly just blocked
players from wearing an upgrade they'd found before grinding out unrelated
stat points — statKey/statReq are kept in the returned shape (always
0/null) so callers that still check them (equipItem(), gearRequirementText
below) no-op without needing their own changes. */
function getGearRequirements(item){
   const statKeys = (item && item.bonus) ? Object.keys(item.bonus) : [];
   if(statKeys.length === 0) return { levelReq: 1, statReq: 0, statKey: null };
   const totalPower = statKeys.reduce((sum, k) => sum + item.bonus[k], 0);
   return {
      levelReq: Math.max(1, totalPower * 2),
      statReq: 0,
      statKey: null,
   };
}

/* Short " — Requires Lv.X, Y base Stat" suffix for an equip item's desc
line (Pack/Shop listings) — blank for starterGear/anything else with
nothing worth requiring (levelReq<=1 and no statReq). */
function gearRequirementText(item){
   const req = getGearRequirements(item);
   if(req.levelReq <= 1 && req.statReq <= 0) return '';
   const statPart = req.statKey ? `, ${req.statReq} base ${STAT_LABELS[req.statKey]}` : '';
   return ` — Requires Lv.${req.levelReq}${statPart}`;
}
