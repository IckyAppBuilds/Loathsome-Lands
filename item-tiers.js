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
