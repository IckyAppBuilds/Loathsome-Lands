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
  { name:"a wind-up quarry drone, badly wound", hp:20, atkMin:3, atkMax:6, xp:10, zone:"quarry",
    art: artQuarryDrone, loot:{name:"a stripped brass gear", desc:"Still spins if you flick it. Mostly for fun now.", type:"junk", sell:4, icon:iconGear} },
  { name:"a gnome surveyor squinting at an upside-down map", hp:18, atkMin:3, atkMax:5, xp:9, zone:"quarry",
    art: artGnomeSurveyor, loot:{name:"a crumpled survey map", desc:"Confidently wrong about where you are.", type:"junk", sell:3, icon:iconSurveyMap} },
  { name:"a pickaxe golem, held together by spite", hp:26, atkMin:4, atkMax:7, xp:13, zone:"quarry",
    art: artPickaxeGolem, loot:{name:"a chipped pickaxe head", desc:"Has seen better decades.", type:"junk", sell:5, icon:iconPickaxeHead} },
  { name:"a rock-crusted quarry rat, huge for some reason", hp:22, atkMin:3, atkMax:6, xp:11, zone:"quarry",
    art: artQuarryRat, loot:{name:"a fistful of ore-flecked grit", desc:"Somewhere between dirt and treasure. Mostly dirt.", type:"junk", sell:4, icon:iconOreGrit} },
  { name:"a vault wisp, humming with old magic", hp:28, atkMin:4, atkMax:7, xp:15, zone:"vault",
    art: artVaultWisp, loot:{name:"a sliver of captured light", desc:"Warm to the touch. Slightly judgmental.", type:"junk", sell:6, icon:iconCapturedLight} },
  { name:"a stone sentinel, one eye still lit", hp:34, atkMin:5, atkMax:8, xp:18, zone:"vault",
    art: artStoneSentinel, loot:{name:"a fractured sentinel eye", desc:"Stopped watching. Eventually.", type:"junk", sell:7, icon:iconSentinelEye} },
  { name:"a hoard-rat, absolutely covered in gold flecks", hp:26, atkMin:4, atkMax:7, xp:14, zone:"vault",
    art: artHoardRat, loot:{name:"a gold-dusted whisker", desc:"Rich by rat standards.", type:"junk", sell:6, icon:iconGoldWhisker} },
  { name:"an animated suit of ceremonial armor, empty inside", hp:36, atkMin:5, atkMax:9, xp:20, zone:"vault",
    art: artCeremonialArmor, loot:{name:"a dented ceremonial gauntlet", desc:"Once belonged to somebody important, probably.", type:"junk", sell:8, icon:iconCeremonialGauntlet} },
];

const gnomeCommander = {
  name:"the gnome commander", hp:45, atkMin:4, atkMax:8, xp:20, rare:true, zone:"commons",
  art: artGnomeCommander, loot:null
};
const COMMANDER_SPAWN_CHANCE = 0.02;

/* Rare hunt target for the Tinker's quest, "Gears in the Dark" — spawns in
   the Dank Sewers while state.quest4Accepted is true and the quest isn't
   complete yet, same mechanic as gnomeCommander above (see
   diggerBotHunt in goAdventuring()). Tuned tougher than a first pass
   (spawn chance lower, HP higher than gnomeCommander) per user feedback
   that quest 4 was completing too fast — see DIGGERBOT_SPAWN_CHANCE. */
const diggerBot = {
  name:"a runaway digger-bot, venting steam", hp:55, atkMin:4, atkMax:8, xp:22, rare:true, zone:"sewers",
  art: artDiggerBot, loot:null
};
const DIGGERBOT_SPAWN_CHANCE = 0.012;

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
  weapon: { name:"a bent kitchen fork", desc:"Not built for combat. Works anyway, sort of.", type:"equip", slot:"weapon", bonus:{}, sell:1, icon: iconFork },
  head:   { name:"a floppy adventuring cap", desc:"Keeps the sun out of your eyes, mostly.", type:"equip", slot:"head", bonus:{}, sell:1, icon: iconCap },
  chest:  { name:"a slightly singed tunic", desc:"Smells like campfire. Always has.", type:"equip", slot:"chest", bonus:{}, sell:1, icon: iconTunic },
  legs:   { name:"hand-me-down trousers, one size too big", desc:"Held up entirely by hope and a length of twine.", type:"equip", slot:"legs", bonus:{}, sell:1, icon: iconTrousers },
  boots:  { name:"one good boot, one bad boot", desc:"You've stopped noticing the limp.", type:"equip", slot:"boots", bonus:{}, sell:1, icon: iconMismatchedBoots },
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

/* ---------------- Vein ingredients (the Tinker's quest, "The Last Vein") ---------------- */
/* Same pattern as potionIngredients above — while state.quest5Accepted is
   true and the quest isn't complete, defeating the matching monster
   force-drops the ingredient instead of its normal loot (see winCombat()).
   Two ingredients come from the Clockwork Quarry, two from monsters in the
   Dank Sewers that quest 3 doesn't already use (the enormous sewer rat and
   the trio in a trenchcoat), so the two gather quests never compete over
   the same kill.

   VEIN_ITEM_COUNT_NEEDED copies of EACH ingredient are required (not just
   one) — raised from 1 to 2 per user feedback that quest 5 was completing
   too fast. winCombat()'s needsVeinIngredient check, countVeinIngredients-
   Held(), and turnInVein() (all in game.js/render.js) all read this
   constant rather than hardcoding "1", so bumping it here is the only
   change needed to retune the whole quest's length. */
const VEIN_ITEM_COUNT_NEEDED = 2;
const veinIngredients = [
  { monsterName:"a wind-up quarry drone, badly wound",
    item:{ name:"a still-ticking gear core", desc:"Keeps perfect time for a reason nobody can explain.", type:"quest", key:"veinGearCore", icon:iconVeinGearCore } },
  { monsterName:"a pickaxe golem, held together by spite",
    item:{ name:"a vein-streaked ore chunk", desc:"Heavier than it looks. Warmer too.", type:"quest", key:"veinOreChunk", icon:iconVeinOreChunk } },
  { monsterName:"a positively enormous sewer rat",
    item:{ name:"a fist-sized raw gemstone", desc:"How a sewer rat came by this is a question best not asked.", type:"quest", key:"veinGemstone", icon:iconVeinGemstone } },
  { monsterName:"three rats in a trenchcoat, unconvincingly",
    item:{ name:"a tangle of copper wiring", desc:"All three rats insist it was already like that.", type:"quest", key:"veinWiring", icon:iconVeinWiring } },
];

/* ---------------- Class titles (level-10 Guild capstone, "The Adventurer's Trial") ---------------- */
/* Awarded by claimClassPath() in game.js based on whichever stat the player
   has invested the most points in (ties broken in this key order). Purely
   a title + a small stat nudge — see claimClassPath() for the mechanic. */
const CLASS_TITLES = { beef:'Brawler', zip:'Rogue', grit:'Bulwark', hoodoo:'Hoodoo Adept' };

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
