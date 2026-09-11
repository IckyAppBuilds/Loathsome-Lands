/* ---------------- Content ---------------- */
const monsters = [
  { name:"a disgruntled compost gnome", hp:9, atkMin:1, atkMax:2, xp:3, zone:"commons",
    art: artCompostGnome, loot:{name:"a fistful of righteous soil", desc:"Smells like victory and mulch.", type:"junk", sell:1, icon:iconSoil} },
  { name:"a feral lawn gnome, off its stake", hp:8, atkMin:1, atkMax:3, xp:4, zone:"commons",
    art: artGnomeFeral, loot:{name:"a bent rake tine", desc:"Still menacing, somehow.", type:"junk", key:"rakeTine", icon:iconRakeTine} },
  { name:"a fishing gnome with an empty bucket", hp:11, atkMin:1, atkMax:2, xp:4, zone:"commons",
    art: artGnomeFishing, loot:{name:"a suspiciously confident lure", desc:"Has never once caught anything.", type:"junk", sell:2, icon:iconLure} },
  { name:"a gnome cavalry unit, mounted on a garden snail", hp:13, atkMin:1, atkMax:3, xp:5, zone:"commons",
    art: artGnomeSnail, loot:{name:"a spiral shell fragment", desc:"Still faintly slimy.", type:"junk", sell:3, icon:iconShellFragment} },
  { name:"the self-appointed gnome sergeant", hp:17, atkMin:2, atkMax:4, xp:7, zone:"commons",
    art: artGnomeSergeant, loot:{name:"a tiny sergeant's whistle", desc:"Blowing it clears your head a little.", type:"mp", value:4, icon:iconWhistle} },
  { name:"a sewer rat with delusions of grandeur", hp:15, atkMin:2, atkMax:4, xp:6, zone:"sewers",
    art: artSewerRat, loot:{name:"a slightly damp rat tail", desc:"You're not sure why you kept this.", type:"junk", sell:2, icon:iconRatTail} },
  { name:"a rat wearing a bottlecap as a helmet", hp:18, atkMin:2, atkMax:5, xp:7, zone:"sewers",
    art: artRatHelmet, loot:{name:"a dented bottlecap helmet", desc:"Barely fits a rat. Definitely doesn't fit you.", type:"junk", sell:3, icon:iconBottlecapHelmet} },
  { name:"a positively enormous sewer rat", hp:24, atkMin:3, atkMax:6, xp:9, zone:"sewers",
    art: artGiantSewerRat, loot:{name:"a rat-gnawed pipe fitting", desc:"Chewed clean through solid metal. Concerning.", type:"junk", sell:4, icon:iconPipeFitting} },
  { name:"three rats in a trenchcoat, unconvincingly", hp:20, atkMin:3, atkMax:5, xp:8, zone:"sewers",
    art: artRatTrenchcoat, loot:{name:"a comically oversized coat button", desc:"None of the three rats will admit to owning this.", type:"junk", sell:3, icon:iconCoatButton} },
];

const gnomeCommander = {
  name:"the gnome commander", hp:45, atkMin:4, atkMax:8, xp:20, rare:true, zone:"commons",
  art: artGnomeCommander, loot:null
};
const COMMANDER_SPAWN_CHANCE = 0.02;

const rareDrops = [
  { name:"a suspiciously ornate gnome figurine", desc:"You could swear it's watching you.", type:"junk", sell:8, icon:iconFigurine },
  { name:"a four-leaf clover, clearly stolen from a gnome's hat", desc:"Feels lucky. Restores a bit of HP and MP.", type:"luck", hpValue:6, mpValue:3, icon:iconClover },
];
const RARE_DROP_CHANCE = 0.12;

const noncombatEvents = [
  "You find a suspiciously comfortable rock and sit on it for a while. Nothing happens, but it was nice.",
  "A squirrel appraises you, finds you wanting, and leaves.",
  "You step in something. You choose not to look down.",
  "An old sign points in three directions at once. You go the fourth way.",
  "You have a brief, meaningful staring contest with a garden gnome. It wins.",
  "You count fourteen gnome hats poking out of the hedges. You do not investigate further.",
  "A gnome-sized wheelbarrow rolls past, unattended. You let it go about its business."
];

const hazardEvents = [
  { text:"You trip over a root and land face-first in something unpleasant.", dmg:[1,3] },
  { text:"A branch swings back and smacks you with the fury of a thousand insulted trees.", dmg:[2,4] },
  { text:"You step on a gnome trap — really just a rake, but effectively deployed.", dmg:[2,4] },
];

const healItems = [
  { name:"a slightly bruised apple", desc:"Restores a modest amount of HP.", type:"hp", value:8, icon:iconApple },
  { name:"suspicious jerky", desc:"Restores HP. Ask no further questions.", type:"hp", value:12, icon:iconJerky },
];

/* ---------------- Equipment ---------------- */
/* Starter gear — equipped automatically at the start of the game so the
   Character page's 5 equip slots (head/chest/legs/boots/weapon) aren't
   just empty on day one. No stat bonuses; purely flavor. */
const starterGear = {
  weapon: { name:"a bent kitchen fork", desc:"Not built for combat. Works anyway, sort of.", type:"equip", slot:"weapon", bonus:{}, icon: iconFork },
  head:   { name:"a floppy adventuring cap", desc:"Keeps the sun out of your eyes, mostly.", type:"equip", slot:"head", bonus:{}, icon: iconCap },
  chest:  { name:"a slightly singed tunic", desc:"Smells like campfire. Always has.", type:"equip", slot:"chest", bonus:{}, icon: iconTunic },
  legs:   { name:"hand-me-down trousers, one size too big", desc:"Held up entirely by hope and a length of twine.", type:"equip", slot:"legs", bonus:{}, icon: iconTrousers },
  boots:  { name:"one good boot, one bad boot", desc:"You've stopped noticing the limp.", type:"equip", slot:"boots", bonus:{}, icon: iconMismatchedBoots },
};

/* Shop-buyable upgrades, one or two per slot, each granting +1 to a stat. */
const shopGearItems = [
  { name:"a rake tine repurposed as a shank", desc:"Sharper than it has any right to be.", type:"equip", slot:"weapon", bonus:{beef:1}, price:12, icon: iconRakeShank },
  { name:"a wand-shaped stick, allegedly magic", desc:"The gnome who sold it swore up and down.", type:"equip", slot:"weapon", bonus:{hoodoo:1}, price:12, icon: iconWandStick },
  { name:"a dented pot-lid helmet", desc:"Rings like a bell if you get hit. You get used to it.", type:"equip", slot:"head", bonus:{grit:1}, price:10, icon: iconPotLid },
  { name:"a patched burlap vest", desc:"Itchy. Surprisingly sturdy.", type:"equip", slot:"chest", bonus:{grit:1}, price:12, icon: iconVest },
  { name:"shin guards whittled from a fence post", desc:"Splintery, but they hold.", type:"equip", slot:"legs", bonus:{zip:1}, price:10, icon: iconShinGuard },
  { name:"boots with suspiciously good grip", desc:"You don't ask where they came from.", type:"equip", slot:"boots", bonus:{zip:1}, price:10, icon: iconGripBoots },
];

const shopBuyItems = [
  { name:"a slightly bruised apple", desc:"Restores a modest amount of HP.", type:"hp", value:8, price:5, icon:iconApple },
  ...shopGearItems,
];

/* ---------------- Spells (Hoodoo magic) ---------------- */
/* Taught by the Hoodoo Doctor in town (a new building, data-action="hoodoo")
   for Pop Tabs, one at a time — `state.spellsKnown` holds the list of
   learned spell ids (just strings, so no icon-function serialization
   gotcha to worry about — see allItemDefs()/hydrateState() for how that
   bites *items*; spells sidestep it entirely).

   `type` drives castSpell()'s branch:
   - 'damage' — magic damage using Hoodoo instead of Beef (playerAttack's
     formula, swapped stat), same monster-retaliation flow as a melee Attack.
   - 'heal'   — restores state.hp by `healValue`, then the monster still
     gets its turn (casting isn't a free action).
   - 'ward'   — no offense; halves the monster's retaliation damage this
     turn via monsterRetaliate(0.5). The "defensive" option in the trio. */
const spells = [
  { id:'hexbolt', name:'Hex Bolt', desc:'A jagged little curse that stings more than it should.', type:'damage', mpCost:3, price:15, dmgMin:4, dmgMax:9, icon: iconHexBolt },
  { id:'mendcharm', name:'Mending Charm', desc:'Patches you up with muttered nonsense and surprising effectiveness.', type:'heal', healValue:10, mpCost:4, price:15, icon: iconMendCharm },
  { id:'wardcharm', name:'Warding Charm', desc:"Throws up a shimmer that takes the edge off whatever's coming next.", type:'ward', mpCost:3, price:12, icon: iconWardCharm },
  { id:'bottledfury', name:'Bottled Fury', desc:'Everything the potion ingredients were trying to tell you, unleashed at once.', type:'damage', mpCost:6, dmgMin:9, dmgMax:16, questReward:true, icon: iconBottledFury },
];

/* ---------------- Potion ingredients (Hoodoo Doctor's quest, "A Proper Potion") ---------------- */
/* Each entry ties one specific monster to one specific ingredient item.
   While state.quest3Accepted is true and state.quest3Complete is false,
   defeating that monster force-drops the ingredient (overriding its normal
   loot) as long as the player doesn't already hold it — see winCombat().
   Two ingredients come from the Commons, two from the Dank Sewers. */
const potionIngredients = [
  { monsterName:"a disgruntled compost gnome",
    item:{ name:"a knot of fat white grubs", desc:"Wriggling, pale, and apparently essential to the recipe.", type:"quest", key:"potionWorms", icon:iconPotionWorms } },
  { monsterName:"a fishing gnome with an empty bucket",
    item:{ name:"a jar of pond tadpoles", desc:"The fishing gnome never caught anything. You, apparently, just did.", type:"quest", key:"potionTadpole", icon:iconPotionTadpole } },
  { monsterName:"a sewer rat with delusions of grandeur",
    item:{ name:"a gob of glowing sewer sludge", desc:"It hums faintly. That's probably fine.", type:"quest", key:"potionSludge", icon:iconPotionSludge } },
  { monsterName:"a rat wearing a bottlecap as a helmet",
    item:{ name:"a whisker plucked from a suspiciously large rat", desc:"It practically vibrates with potency.", type:"quest", key:"potionWhisker", icon:iconPotionWhisker } },
];

/* ---------------- Casino ---------------- */
const CASINO_WIN_CHANCE = 0.45; /* the house always wins, on average */
const casinoWinLines = [
  "The wheel clatters to a stop on gold. You win!",
  "Against all odds — and the Croupier's raised eyebrow — you win!",
  "The dice tumble your way, somehow. You win!",
];
const casinoLoseLines = [
  "The wheel clatters to a stop on absolutely nothing. You lose your stake.",
  "The Croupier doesn't even try to hide the smirk. You lose your stake.",
  "The dice betray you completely. You lose your stake.",
];
