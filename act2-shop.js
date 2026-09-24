/* ---------------- Act 2 Shop (Gnometropolis) ---------------- */
/* Own file per the "new concern, new file" convention (AGENTS.md) —
Gladstone's shopGearItems/Tier2/3/4 (content.js) are already sizeable,
and this is a structurally separate ladder, not a growth of that one.

Per the Act 2 plan's resolved decision: the new Shop's own "Tier 1"
restarts the tier LABEL at 1 while its actual bonus value (+8 to a
primary stat) is double Gladstone's own Tier 4 (+4) — this whole ladder
continues climbing from there (+8 -> +10 -> +12 -> +16) rather than
mirroring Act 1's +1/+2/+3/+4 spacing. Secondary stats stay flat +1
each, same as every Act 1 tier — rollShopGearStats() (economy.js),
which rerolls a purchase's secondary stat(s) at buy time, hardcodes
that +1 regardless of tier, so there was no reason to invent a
different secondary convention here.

tier:'legendary' on every item here (not 'epic', Act 1 Tier 4's own
color) — these are meant to visually read as the best gear in the game
(ITEM_TIER_COLORS, item-tiers.js already reserves gold/legendary for
exactly that), not just "one more epic." act2Tier (1-4) is a SEPARATE
field purely for this shop's own tier-grouping UI (renderGnomeShop(),
render-shop.js) — kept apart from `tier` so the color system and this
shop's own section headers never fight over the same field.

Icons deliberately reuse Act 1's own Tier 4 palace-relic set
(iconThroneAxe/iconThroneScepter/iconRoyalFlushBlade/iconStolenCrown/
iconPalaceForgedPlate/iconDressGreaves/iconStewardBoots) across all
four tiers here rather than getting a fresh set — the in-fiction read
is deliberate: you already conquered the palace, so of course the same
relics keep turning up, just better ones each time. Same weapon-type/
slot per row across all 4 tiers (beef/hoodoo/zip weapons, then head/
chest/legs/boots) for a stable, learnable shape as the player climbs
the ladder. */
const act2GearItemsTier1 = [
   { name:"the fallen King's own war-pick", desc:"Still gaudy with gold leaf.", type:"equip", slot:"weapon", bonus:{beef:8}, price:300, tier:'legendary', act2Tier:1, icon: iconThroneAxe },
   { name:"a looted arcane focus, still humming with stolen magic", desc:"Nobody's claimed it back yet.", type:"equip", slot:"weapon", bonus:{hoodoo:8}, price:300, tier:'legendary', act2Tier:1, icon: iconThroneScepter },
   { name:"a card-table blade, plated in someone else's winnings", desc:"The house's cut, repurposed.", type:"equip", slot:"weapon", bonus:{zip:8}, price:300, tier:'legendary', act2Tier:1, icon: iconRoyalFlushBlade },
   { name:"a conqueror's helm, scavenged gold hammered over old dents", desc:"The dents were already there.", type:"equip", slot:"head", bonus:{grit:8}, price:300, tier:'legendary', act2Tier:1, icon: iconStolenCrown },
   { name:"plate stripped from the throne room's own honor guard", desc:"They weren't using it anymore.", type:"equip", slot:"chest", bonus:{grit:8}, price:300, tier:'legendary', act2Tier:1, icon: iconPalaceForgedPlate },
   { name:"greaves looted from the palace armory, still polished", desc:"Someone kept these in good shape.", type:"equip", slot:"legs", bonus:{zip:8}, price:300, tier:'legendary', act2Tier:1, icon: iconDressGreaves },
   { name:"the steward's own boots, resoled and reclaimed", desc:"Better fit than they had any right to be.", type:"equip", slot:"boots", bonus:{zip:8}, price:300, tier:'legendary', act2Tier:1, icon: iconStewardBoots },
   ];

const act2GearItemsTier2 = [
   { name:"scepter reclaimed from the throne room, twice stolen now", desc:"Once from him. Now from whoever had it after.", type:"equip", slot:"weapon", bonus:{hoodoo:10, grit:1}, price:700, tier:'legendary', act2Tier:2, icon: iconThroneScepter },
   { name:"the champion's own cleaver, freshly re-sharpened", desc:"He's not around to mind.", type:"equip", slot:"weapon", bonus:{beef:10, zip:1}, price:700, tier:'legendary', act2Tier:2, icon: iconThroneAxe },
   { name:"a loaded blade fresh off the gambling floor", desc:"The house always finds a way to lose these eventually.", type:"equip", slot:"weapon", bonus:{zip:10, hoodoo:1}, price:700, tier:'legendary', act2Tier:2, icon: iconRoyalFlushBlade },
   { name:"the conqueror's crown, melted down and reforged to fit", desc:"Fits better this time.", type:"equip", slot:"head", bonus:{grit:10, beef:1}, price:700, tier:'legendary', act2Tier:2, icon: iconStolenCrown },
   { name:"ceremonial plate, still warm from the palace forge", desc:"They never let it cool between owners.", type:"equip", slot:"chest", bonus:{grit:10, hoodoo:1}, price:700, tier:'legendary', act2Tier:2, icon: iconPalaceForgedPlate },
   { name:"dress greaves, looted twice over", desc:"Ceremonial the first time. Just useful now.", type:"equip", slot:"legs", bonus:{zip:10, grit:1}, price:700, tier:'legendary', act2Tier:2, icon: iconDressGreaves },
   { name:"the steward's spare boots, somehow finer than the first pair", desc:"He had more than one pair. Of course he did.", type:"equip", slot:"boots", bonus:{zip:10, beef:1}, price:700, tier:'legendary', act2Tier:2, icon: iconStewardBoots },
   ];

const act2GearItemsTier3 = [
   { name:"an heirloom rod, plundered from whoever it was heirloom to", desc:"Provenance is somebody else's problem now.", type:"equip", slot:"weapon", bonus:{hoodoo:12, grit:1, zip:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconThroneScepter },
   { name:"a war-cleaver with three owners' names scratched off the hilt", desc:"There's room for a fourth.", type:"equip", slot:"weapon", bonus:{beef:12, zip:1, grit:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconThroneAxe },
   { name:"an ace palmed from a dead man's hand", desc:"He wasn't going to need it.", type:"equip", slot:"weapon", bonus:{zip:12, hoodoo:1, beef:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconRoyalFlushBlade },
   { name:"a crown that's stopped fitting anyone but you", desc:"It tried a few other heads first.", type:"equip", slot:"head", bonus:{grit:12, hoodoo:1, beef:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconStolenCrown },
   { name:"a cuirass forged for a king who never got to wear it", desc:"His loss, technically speaking.", type:"equip", slot:"chest", bonus:{grit:12, beef:1, zip:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconPalaceForgedPlate },
   { name:"trousers tailored in a palace that isn't there anymore", desc:"The tailor's doing fine. The palace, less so.", type:"equip", slot:"legs", bonus:{zip:12, grit:1, hoodoo:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconDressGreaves },
   { name:"boots blessed by whoever's left of the palace clergy", desc:"They insisted. You didn't argue.", type:"equip", slot:"boots", bonus:{zip:12, hoodoo:1, beef:1}, price:1400, tier:'legendary', act2Tier:3, icon: iconStewardBoots },
   ];

/* Top tier — every item touches all 4 stats (primary+16, the other 3 at
+1 each), same "there's nothing left to leave off" shape Act 1's own
Tier 4 uses once a tier's stat count reaches the total number of stats
that exist. */
const act2GearItemsTier4 = [
   { name:"the scepter of a throne that no longer exists", desc:"Outlasted the thing it was made for.", type:"equip", slot:"weapon", bonus:{hoodoo:16, beef:1, zip:1, grit:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconThroneScepter },
   { name:"the headsman's axe, its debt finally called in", desc:"It was always going to end up here.", type:"equip", slot:"weapon", bonus:{beef:16, zip:1, grit:1, hoodoo:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconThroneAxe },
   { name:"a royal flush that emptied the whole house", desc:"Every table, every hand, same result.", type:"equip", slot:"weapon", bonus:{zip:16, grit:1, hoodoo:1, beef:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconRoyalFlushBlade },
   { name:"the crown itself, still slightly too big", desc:"You've stopped noticing.", type:"equip", slot:"head", bonus:{grit:16, hoodoo:1, beef:1, zip:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconStolenCrown },
   { name:"the palace's own furnace-forged plate, unclaimed until now", desc:"It was always going to be yours, eventually.", type:"equip", slot:"chest", bonus:{grit:16, beef:1, zip:1, hoodoo:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconPalaceForgedPlate },
   { name:"greaves stitched from a dress uniform nobody's left to wear", desc:"Ceremonial, once. Just yours, now.", type:"equip", slot:"legs", bonus:{zip:16, grit:1, hoodoo:1, beef:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconDressGreaves },
   { name:"the steward's boots, and everything that came with them", desc:"He left in a hurry. Didn't take much.", type:"equip", slot:"boots", bonus:{zip:16, grit:1, hoodoo:1, beef:1}, price:2500, tier:'legendary', act2Tier:4, icon: iconStewardBoots },
   ];

/* All 4 tiers are available the moment the Shop opens (quest7Complete)
— no buildingUpgrades-style level-gating like Gladstone's own Shop
uses, since Gnometropolis has no Town Lot of its own yet to drive that
gate off. Revisit once it does. */
function getAvailableGnomeShopItems(){
   return [...act2GearItemsTier1, ...act2GearItemsTier2, ...act2GearItemsTier3, ...act2GearItemsTier4];
}
