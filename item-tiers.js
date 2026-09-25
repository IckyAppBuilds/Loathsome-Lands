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
literal tags rather than being XSS-relevant, but it'd look broken).

Also appends a `+N` for however many times this exact item has been
tempered (temperEquippedItem(), player-actions.js — item.temperLevel
lives on the item instance itself, not a separate name string), so
every one of these same call sites picks the suffix up for free
without needing its own change. */
function itemNameHtml(item){
   const temperSuffix = item.temperLevel > 0 ? ` +${item.temperLevel}` : '';
   return `<span style="color:${ITEM_TIER_COLORS[getItemTier(item)]};">${item.name}${temperSuffix}</span>`;
}

/* An equip item's level requirement is never stored on the item itself —
it's derived here, straight from its own `bonus` object, every time it's
needed (equipItem(), player-actions.js; the Pack and Shop listings,
render-shop.js/render-character.js). This is deliberate: a requirement
derived this way can never drift out of alignment with what the item
actually grants, the way a hand-authored parallel field could once bonus
values get rebalanced later.

levelReq = 2x the item's PRIMARY stat only (the first key in `bonus` —
every item everywhere is authored primary-stat-first, same convention
rollShopGearStats/rollGearDropTier, economy.js/combat.js, already rely
on) — a plain +1 tier-1 item needs level 2, a tier-3 item whose primary
is +3 needs level 6, regardless of what its secondary stats rolled.

Deliberately NOT a sum across every stat anymore: once secondary stats
started rolling their own randomized value instead of a flat +1
(rollSecondaryStatValue(), economy.js), a sum-based requirement would
make the SAME nominal tier of item demand wildly different levels from
one roll to the next — a tier-4 item's three secondaries could each
roll as high as the primary itself, nearly quadrupling the total and
its level requirement along with it. The primary stat is the one
constant every roll of a given tier shares, so it's the one requirement
should track.

`item.levelReqBase` (rollGearDropTier(), combat.js), where present,
overrides even the primary stat for this calculation — per explicit
correction, a monster-dropped item's level requirement should track
which ZONE it came from, not which rarity tier the drop happened to
roll. rollGearDropTier() bumps the primary stat itself by +1/+2 for a
better roll (that's the whole reward for rarity), which would otherwise
push the SAME zone's drop from, say, level 12 (common) to level 16
(lucky rare) purely off luck — a player farming exactly the zone the
game recommends could get "rewarded" with gear they can't equip yet.
levelReqBase is the zone's own unrolled tier-1 value, so every rarity
of a given zone's drop demands the same level; only Shop gear (whose
primary is fixed by which tier you paid for, never randomized) has no
such field and falls through to the plain primaryValue*2 below. This is
also exactly why the gearDrop bonus values in content.js/
mudroot-content.js/warrensear-content.js climb 1-2-3-4-5-6-7-8 in zone
order in the first place: at this 2x multiplier that ladder lines up
almost exactly with ZONE_LEVEL_RECOMMENDATION's own min for that zone
(e.g. rootcellar/bureau's gearDrop of 6 needs level 12, Mudroot
Warren's own floor, at every rarity).

Stat requirements (statReq/statKey) were dropped: level alone was already
gating gear sensibly, and a separate base-stat floor mostly just blocked
players from wearing an upgrade they'd found before grinding out unrelated
stat points — statKey/statReq are kept in the returned shape (always
0/null) so callers that still check them (equipItem(), gearRequirementText
below) no-op without needing their own changes. */
function getGearRequirements(item){
   const statKeys = (item && item.bonus) ? Object.keys(item.bonus) : [];
   if(statKeys.length === 0) return { levelReq: 1, statReq: 0, statKey: null };
   const primaryValue = (item && item.levelReqBase !== undefined) ? item.levelReqBase : item.bonus[statKeys[0]];
   return {
      levelReq: Math.max(1, primaryValue * 2),
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

/* Short "(+N HP)"/"(+N MP)"/"(+N HP, +N MP)" suffix for an hp/mp/luck
consumable's desc line (Pack/Shop/victory-banner listings) — the actual
numbers useItem() (player-actions.js) applies, so the description
always matches what using it really does rather than leaving it to a
vague flavor line like "restores a modest amount." Blank for anything
else (equip/junk/quest have their own suffixes or none). */
function consumableEffectText(item){
   if(!item) return '';
   if(item.type === 'hp') return ` (+${item.value} HP)`;
   if(item.type === 'mp') return ` (+${item.value} MP)`;
   if(item.type === 'luck') return ` (+${item.hpValue} HP, +${item.mpValue} MP)`;
   return '';
}

/* Shared rarity premium for BOTH getGearSellValue() and
getConsumableSellValue() below — a rare/legendary item sells for more
than a common one of equal "power," gear stat total or consumable
heal value alike. */
const ITEM_SELL_TIER_MULTIPLIER = { poor:1, common:1, uncommon:1.3, rare:1.6, epic:2, legendary:2.5 };

/* An equip item's sell price, same "derive it fresh, never store it"
shape as getGearRequirements() above — scales with the item's total
stat power (so a level-appropriate/higher item sells for more) times a
rarity premium on top of that (so two items of equal power but
different tier don't sell identically — a rare should feel worth more
than a common even at the same stat total, e.g. PALACE_GATE_GEAR's
deliberately-low-power epic gear). Floored at 1 so starterGear (no
bonus at all) still sells for a token amount, matching its old flat
sell:1. */
const GEAR_SELL_PER_POWER = 4;
function getGearSellValue(item){
   const statKeys = (item && item.bonus) ? Object.keys(item.bonus) : [];
   const totalPower = statKeys.reduce((sum, k) => sum + item.bonus[k], 0);
   const mult = ITEM_SELL_TIER_MULTIPLIER[getItemTier(item)] || 1;
   return Math.max(1, Math.round(totalPower * GEAR_SELL_PER_POWER * mult));
}

/* Same shape again for hp/mp/luck consumables (healItems/shopFoodItems'
tiers, content.js, plus the "luck" rareDrops that restore both) — none
of these carry a `sell` field either. "Power" is the HP/MP restored
(luck items sum both, since they heal both at once); healItems/
shopFoodItems' buy price already runs a flat ~0.625 Pop Tabs per point
of value regardless of tier, so 0.25 per point here lands common-tier
consumables around a ~40% sell-back of their buy price, same ballpark
resale ratio as everything else, before the rarity premium above lifts
higher tiers further (uncapped drops like the luck rareDrops have no
buy price to compare against, so that premium is the only signal that
a rarer find is worth more). */
const CONSUMABLE_SELL_PER_VALUE = 0.25;
function getConsumableSellValue(item){
   const power = item.type === 'luck' ? (item.hpValue||0) + (item.mpValue||0) : (item.value||0);
   const mult = ITEM_SELL_TIER_MULTIPLIER[getItemTier(item)] || 1;
   return Math.max(1, Math.round(power * CONSUMABLE_SELL_PER_VALUE * mult));
}

/* One dispatcher for "what does this item sell for," used everywhere a
sale needs a price (sellItemByName(), economy.js; the Sell tab,
render-shop.js) instead of each caller re-deriving which formula
applies. Junk/quest items keep their hand-authored flat `sell` field
(content.js) — those were never a formula, no reason to make them one. */
function getItemSellValue(item){
   if(!item) return 0;
   if(item.type === 'equip') return getGearSellValue(item);
   if(item.type === 'hp' || item.type === 'mp' || item.type === 'luck') return getConsumableSellValue(item);
   return item.sell || 0;
}
