/* ---------------- Content ---------------- */
/* Each regular monster below carries its own rareDrop — a low-odds bonus
item on top of its normal loot roll (see RARE_DROP_CHANCE and winCombat()
in game.js, which reads state.monster.rareDrop rather than picking from
any shared pool). This used to be one global rareDrops[] array that any
monster could drop from — replaced so a rare find is specific to what you
actually killed, not an unrelated trinket. Named rareDrop (not `rare`)
deliberately: `rare` is already a boolean flag elsewhere (gnomeCommander/
diggerBot below) meaning "this is a rare/special spawn" — a same-named
object field here would make every regular monster read as a rare spawn
too and misfire that log branch in startCombat(). gnomeCommander/
diggerBot don't carry a rareDrop of their own — they're already a
dedicated quest reward on top of a much bigger XP/Pop Tab payout. */
const monsters = [
   { name:"a disgruntled compost gnome", hp:9, atkMin:1, atkMax:2, xp:3, zone:"commons",
    art: artCompostGnome, loot:{name:"a fistful of righteous soil", desc:"Smells like victory and mulch.", type:"junk", sell:1, icon:iconSoil},
    rareDrop:{name:"a gnome-sized medal of composting excellence", desc:"Awarded by nobody. Cherished anyway.", type:"junk", sell:10, icon:iconFigurine} },
   { name:"a feral lawn gnome, off its stake", hp:8, atkMin:1, atkMax:3, xp:4, zone:"commons",
    art: artGnomeFeral, loot:{name:"a bent rake tine", desc:"Still menacing, somehow.", type:"quest", key:"rakeTine", sell:2, icon:iconRakeTine},
    rareDrop:{name:"a stake-shaped good luck charm", desc:"Whittled by whoever this gnome escaped from.", type:"luck", hpValue:8, mpValue:4, icon:iconClover} },
   { name:"a fishing gnome with an empty bucket", hp:11, atkMin:1, atkMax:2, xp:4, zone:"commons",
    art: artGnomeFishing, loot:{name:"a suspiciously confident lure", desc:"Has never once caught anything.", type:"junk", sell:2, icon:iconLure},
    rareDrop:{name:"an actually-lucky fishing lure", desc:"This one's clearly caught something, at some point.", type:"junk", sell:11, icon:iconFigurine} },
   { name:"a gnome cavalry unit, mounted on a garden snail", hp:13, atkMin:1, atkMax:3, xp:5, zone:"commons",
    art: artGnomeSnail, loot:{name:"a spiral shell fragment", desc:"Still faintly slimy.", type:"junk", sell:3, icon:iconShellFragment},
    rareDrop:{name:"a snail-slime polished pebble", desc:"Smooth as glass. Smells faintly of victory.", type:"luck", hpValue:8, mpValue:4, icon:iconClover} },
   { name:"the self-appointed gnome sergeant", hp:17, atkMin:2, atkMax:4, xp:7, zone:"commons",
    art: artGnomeSergeant, loot:{name:"a tiny sergeant's whistle", desc:"Blowing it clears your head a little.", type:"mp", value:4, icon:iconWhistle},
    rareDrop:{name:"the sergeant's secret stash of medals", desc:"Every one of them self-awarded.", type:"junk", sell:12, icon:iconFigurine} },
   { name:"a sewer rat with delusions of grandeur", hp:15, atkMin:2, atkMax:4, xp:6, zone:"sewers",
    art: artSewerRat, loot:{name:"a slightly damp rat tail", desc:"You're not sure why you kept this.", type:"junk", sell:2, icon:iconRatTail},
    rareDrop:{name:"a rat king's tiny crown", desc:"Delusions of grandeur, it turns out, were warranted.", type:"luck", hpValue:10, mpValue:5, icon:iconClover} },
   { name:"a rat wearing a bottlecap as a helmet", hp:18, atkMin:2, atkMax:5, xp:7, zone:"sewers",
    art: artRatHelmet, loot:{name:"a dented bottlecap helmet", desc:"Barely fits a rat. Definitely doesn't fit you.", type:"junk", sell:3, icon:iconBottlecapHelmet},
    rareDrop:{name:"a helmet dented in a suspiciously lucky pattern", desc:"Every dent lines up with a near-miss.", type:"junk", sell:15, icon:iconFigurine} },
   { name:"a positively enormous sewer rat", hp:24, atkMin:3, atkMax:6, xp:9, zone:"sewers",
    art: artGiantSewerRat, loot:{name:"a rat-gnawed pipe fitting", desc:"Chewed clean through solid metal. Concerning.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"a glowing sewer pearl", desc:"You don't ask how it got down here. Or how it glows.", type:"luck", hpValue:10, mpValue:5, icon:iconClover} },
   { name:"three rats in a trenchcoat, unconvincingly", hp:20, atkMin:3, atkMax:5, xp:8, zone:"sewers",
    art: artRatTrenchcoat, loot:{name:"a comically oversized coat button", desc:"None of the three rats will admit to owning this.", type:"junk", sell:3, icon:iconCoatButton},
    rareDrop:{name:"the trenchcoat's secret inside pocket, still full", desc:"Whatever they were hiding, it's yours now.", type:"junk", sell:16, icon:iconFigurine} },
   { name:"a wind-up quarry drone, badly wound", hp:20, atkMin:3, atkMax:6, xp:10, zone:"quarry",
    art: artQuarryDrone, loot:{name:"a stripped brass gear", desc:"Still spins if you flick it. Mostly for fun now.", type:"junk", sell:4, icon:iconGear},
    rareDrop:{name:"a drone's still-humming power core", desc:"Warm, faintly ticking, best not examined too closely.", type:"junk", sell:19, icon:iconFigurine} },
   { name:"a gnome surveyor squinting at an upside-down map", hp:18, atkMin:3, atkMax:5, xp:9, zone:"quarry",
    art: artGnomeSurveyor, loot:{name:"a crumpled survey map", desc:"Confidently wrong about where you are.", type:"junk", sell:3, icon:iconSurveyMap},
    rareDrop:{name:"a compass that always points to safety", desc:"Not north. Safety. Somehow more useful.", type:"luck", hpValue:12, mpValue:6, icon:iconClover} },
   { name:"a pickaxe golem, held together by spite", hp:26, atkMin:4, atkMax:7, xp:13, zone:"quarry",
    art: artPickaxeGolem, loot:{name:"a chipped pickaxe head", desc:"Has seen better decades.", type:"junk", sell:5, icon:iconPickaxeHead},
    rareDrop:{name:"a fist-sized nugget of pure stubbornness", desc:"Heavier than it should be. Refuses to be dropped.", type:"junk", sell:20, icon:iconFigurine} },
   { name:"a rock-crusted quarry rat, huge for some reason", hp:22, atkMin:3, atkMax:6, xp:11, zone:"quarry",
    art: artQuarryRat, loot:{name:"a fistful of ore-flecked grit", desc:"Somewhere between dirt and treasure. Mostly dirt.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"a rat-gnawed lucky pebble (not a rabbit's foot)", desc:"The rat was very clear on that point, somehow.", type:"luck", hpValue:12, mpValue:6, icon:iconClover} },
   { name:"a vault wisp, humming with old magic", hp:28, atkMin:4, atkMax:7, xp:15, zone:"vault",
    art: artVaultWisp, loot:{name:"a sliver of captured light", desc:"Warm to the touch. Slightly judgmental.", type:"junk", sell:6, icon:iconCapturedLight},
    rareDrop:{name:"a captured wisp of pure luck", desc:"It flickers approvingly whenever you make a good call.", type:"luck", hpValue:15, mpValue:8, icon:iconClover} },
   { name:"a stone sentinel, one eye still lit", hp:34, atkMin:5, atkMax:8, xp:18, zone:"vault",
    art: artStoneSentinel, loot:{name:"a fractured sentinel eye", desc:"Stopped watching. Eventually.", type:"junk", sell:7, icon:iconSentinelEye},
    rareDrop:{name:"the sentinel's other eye, still watching", desc:"You can feel it tracking you from the bottom of your pack.", type:"junk", sell:26, icon:iconFigurine} },
   { name:"a hoard-rat, absolutely covered in gold flecks", hp:26, atkMin:4, atkMax:7, xp:14, zone:"vault",art: artHoardRat, loot:{name:"a gold-dusted whisker", desc:"Rich by rat standards.", type:"junk", sell:6, icon:iconGoldWhisker},
    rareDrop:{name:"a fistful of the hoard-rat's actual hoard", desc:"It was surprisingly well-organized, for a rat.", type:"junk", sell:28, icon:iconFigurine} },
   { name:"an animated suit of ceremonial armor, empty inside", hp:36, atkMin:5, atkMax:9, xp:20, zone:"vault",
    art: artCeremonialArmor, loot:{name:"a dented ceremonial gauntlet", desc:"Once belonged to somebody important, probably.", type:"junk", sell:8, icon:iconCeremonialGauntlet},
    rareDrop:{name:"a ceremonial luck-charm, still humming with old magic", desc:"Whoever it was made for never got to keep it.", type:"luck", hpValue:15, mpValue:8, icon:iconClover} },
   { name:"a gnome vizier, draped in stolen finery", hp:34, atkMin:5, atkMax:9, xp:19, zone:"gnometropolis",
    art: artGnomeVizier, loot:{name:"a vizier's confiscated ledger", desc:"Every debt in Gnometropolis, written in tiny cramped handwriting.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a vizier's uncanny hunch, bottled", desc:"It practically whispers good advice.", type:"luck", hpValue:18, mpValue:9, icon:iconClover} },
   { name:"a heavily-armored gnome guard", hp:44, atkMin:6, atkMax:10, xp:23, zone:"gnometropolis",
    art: artGnomeGuard, loot:{name:"a dented guard-captain's shield-boss", desc:"Scratched from decades of very small, very serious duels.", type:"junk", sell:10, icon:iconShieldBoss},
    rareDrop:{name:"the guard-captain's ceremonial sash", desc:"Awarded for uninterrupted vigilance. Interrupted now.", type:"junk", sell:32, icon:iconFigurine} },
   { name:"a burrowing tunnel-worm, gnome-bred", hp:38, atkMin:6, atkMax:10, xp:21, zone:"gnometropolis",
    art: artBurrowWorm, loot:{name:"a chitinous burrow-shell fragment", desc:"Warm from the tunnel. You don't ask why.", type:"junk", sell:9, icon:iconBurrowShell},
    rareDrop:{name:"a burrow-worm's lucky cast-off tooth", desc:"Smooth, oddly warm, and very possibly why you're still standing.", type:"luck", hpValue:19, mpValue:9, icon:iconClover} },
   { name:"a rogue clockwork automaton, sparking wildly", hp:46, atkMin:7, atkMax:11, xp:26, zone:"gnometropolis",
    art: artFeralAutomaton, loot:{name:"a scorched servo joint", desc:"Still twitches, if you're not careful.", type:"junk", sell:11, icon:iconServoJoint},
    rareDrop:{name:"the automaton's still-warm power cell", desc:"Hums like it's not entirely done working yet.", type:"junk", sell:34, icon:iconFigurine} },
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

/* Rare hunt target for the Guild's quest 6, "The Gnome King's Throne" —
spawns in the Sunless Vault while state.quest6Accepted is true and the
quest isn't complete yet, same mechanic as gnomeCommander/diggerBot above
(see gnomeKingHunt in goAdventuring()). Tuned as the toughest rare boss
yet — highest HP, lowest spawn chance — since it's the capstone-adjacent
quest that unlocks Gnometropolis. No rareDrop of its own, same reasoning
as gnomeCommander/diggerBot: it's already a dedicated quest reward on top
of a much bigger XP/Pop Tab payout. */
const gnomeKing = {
   name:"the gnome king, throned in scavenged gold", hp:70, atkMin:7, atkMax:12, xp:35, rare:true, zone:"vault",
   art: artGnomeKing, loot:null
};
const GNOME_KING_SPAWN_CHANCE = 0.01;

/* Boss for the GUILD TIER of the level-10 class capstone, "The
Adventurer's Trial" (acceptClassQuest/claimClassPath in game.js). The
Trial is now three independent trainer tests — this is only the Guild's
(the Meathead test); the Casino's (Card Shark, CLASS_TRIAL_CASINO_STAKE
below) and the Hoodoo Doctor's (Hexpert, a killing blow with a damage
spell) use their own mechanics, not a boss fight. All three must pass
(state.classTrialGuildPassed/classTrialCasinoPassed/classTrialHoodooPassed,
core.js) before claimClassPath() lets the player choose. Unlike
gnomeCommander/diggerBot/gnomeKing above, this one is NOT a wild zone
spawn — it's fought directly at the Guild via a dedicated button once a
player hits level 10, so it carries no `zone` and needs no SPAWN_CHANCE
constant of its own (a separate task wires the Guild-side fight).
`rare:true` is still set so the existing winCombat() victory-detection
pattern (state.monster.rare && state.monster.name === X.name) works for
it unchanged — a separate task adds the actual check, gated on
state.classQuestAccepted/!state.classTrialGuildPassed, and sets
state.classTrialGuildPassed = true on the win. Tuned as the toughest
fight in the game — tougher than gnomeKing (hp:70/atk:7-12/xp:35).
loot:null for the same reason as the other three named bosses: the
reward here is trial progress, not an item drop. art points at a
not-yet-written artTrialChampion() (core.js, separate task) — referenced
by name now so that task knows what to add. */
const trialChampion = {
   name:"the Guild's Trial Examiner, unbeaten and unimpressed", hp:95, atkMin:9, atkMax:14, xp:50, rare:true,
   art: artTrialChampion, loot:null
};

/* Casino tier of the same Trial (see trialChampion comment above) — the
Card Shark test. No boss fight: gambleCasino() (game.js) checks this
threshold and, if the player wins a bet at or above it while the trial
is active and this tier isn't passed yet, sets
state.classTrialCasinoPassed = true. */
const CLASS_TRIAL_CASINO_STAKE = 50;

/* Per-zone difficulty multiplier — makes each successive area meaningfully
tougher than the last, on top of the already-different base hp/atk/xp
each monster entry above carries. Applied once, in startCombat()
(game.js), to hp/atkMin/atkMax/xp for whatever monster spawns (regular
pool or a forced rare like gnomeCommander/diggerBot) — the numbers above
stay each monster's zone-relative baseline, and retuning how much harder
an area feels is just one number here, not a pass through every entry.
Tuned per user feedback that later areas weren't feeling more
challenging than earlier ones. */
const ZONE_DIFFICULTY = { commons:1, sewers:1.15, quarry:1.55, vault:1.9, gnometropolis:2.3 };

/* Display names for each adventure zone, keyed by state.location/zone id —
used by the Bounty Board (render.js) to spell out where a bounty's
monster lives without hand-typing zone names in a second place. */
const ZONE_LABELS = { commons:'the Overgrown Commons', sewers:'the Dank Sewers', quarry:'the Clockwork Quarry', vault:'the Sunless Vault', gnometropolis:'Gnometropolis' };

/* Chance, per kill, that a monster's own rareDrop (defined per entry in
monsters[] above) drops alongside its normal loot roll. What drops is
now monster-specific — see the comment above monsters[]. */
const RARE_DROP_CHANCE = 0.12;

/* Flavor lines shown on a non-combat "explore" roll, keyed by zone so each
area has its own voice instead of one generic list reused everywhere —
see goAdventuring() in game.js, which indexes in with state.location
and falls back to the commons list for any zone that isn't listed
(there shouldn't be one). */
const noncombatEvents = {
   commons: [
      "You find a suspiciously comfortable rock and sit on it for a while. Nothing happens, but it was nice.",
      "A squirrel appraises you, finds you wanting, and leaves.",
      "You step in something. You choose not to look down.",
      "An old sign points in three directions at once. You go the fourth way.",
      "You have a brief, meaningful staring contest with a garden gnome. It wins.",
      "You count fourteen gnome hats poking out of the hedges. You do not investigate further.",
      "A gnome-sized wheelbarrow rolls past, unattended. You let it go about its business."
      ],
   sewers: [
      "Something skitters just out of torchlight. You decide not to find out what.",
      "A pipe groans overhead like it's considering giving up. It doesn't. This time.",
      "You find a tiny gnome-sized raft, abandoned and half-sunk. You salute it out of respect.",
      "Water drips in a rhythm that's almost, but not quite, a song you know.",
      "Someone has scratched 'the commander was here' into the brick. You don't ask.",
      "A cluster of rats watches you pass in total, unnerving silence."
      ],
   quarry: [
      "A stalled conveyor belt clicks twice and goes still again, like it's thinking about it.",
      "You find a gear too big to carry and too interesting not to admire for a minute.",
      "Dust sifts down from somewhere above. You decide not to look up either.",
      "An old chalk map on the wall marks an X. Something has already dug there.",
      "A rhythmic clanking echoes from deeper in, then stops the moment you notice it.",
      "You find a perfectly good pickaxe wedged into solid stone and leave it exactly where it is."
      ],
   vault: [
      "A wisp of pale light drifts past, studies you, and drifts on, unimpressed.",
      "The air hums faintly, like the whole room is holding one long note.",
      "You catch your reflection in polished stone a half-second too late.",
      "A row of empty pedestals stands in perfect, deliberate silence.",
      "Something at the edge of your vision resolves into nothing at all when you turn.",
      "Dust hangs motionless in a shaft of light that has no visible source."
      ],
   gnometropolis: [
      "A vizier's ledger lies open on a stump, mid-sentence, as if the writer simply vanished.",
      "Tiny clockwork lanterns line a street sized for someone half your height. You duck under every one of them.",
      "A burrow entrance breathes cold air. You choose not to lean into it.",
      "Something ticks patiently behind a wall that has no door.",
      "A gnome-sized throne sits empty in a side chamber, gathering dust and a worrying amount of respect.",
      "You pass a guardhouse standing suspiciously, perfectly at attention. Nobody's inside."
      ]
};

/* Same per-zone pattern as noncombatEvents above, but these cost HP. */
const hazardEvents = {
   commons: [
      { text:"You trip over a root and land face-first in something unpleasant.", dmg:[1,3] },
      { text:"A branch swings back and smacks you with the fury of a thousand insulted trees.", dmg:[2,4] },
      { text:"You step on a gnome trap — really just a rake, but effectively deployed.", dmg:[2,4] },
      ],
   sewers: [
      { text:"You slip on something you'd rather not identify and crack an elbow on the brick.", dmg:[2,4] },
      { text:"A jet of foul steam catches you square in the face.", dmg:[2,5] },
      { text:"A low pipe clips your head. You'll feel that one for a while.", dmg:[1,4] },
      ],
   quarry: [
      { text:"A chunk of rock comes loose overhead and clips your shoulder on the way down.", dmg:[3,5] },
      { text:"A stray gear kicks loose from a machine and catches you in the shin.", dmg:[2,5] },
      { text:"You misjudge a ledge and land badly on the quarry floor.", dmg:[3,6] },
      ],
   vault: [
      { text:"An old ward flickers awake just long enough to zap you.", dmg:[3,6] },
      { text:"A shelf of forgotten relics collapses, and you're standing under it.", dmg:[4,7] },
      { text:"Something cold passes through you and is gone before you can name it.", dmg:[3,6] },
      ],
   gnometropolis: [
      { text:"A section of tunnel gives way under your boot, and you drop harder than planned.", dmg:[4,7] },
      { text:"A clockwork trap clicks somewhere close, and something fast clips you before you can place it.", dmg:[4,8] },
      { text:"A burrow-worm's old tunnel collapses right as you cross it.", dmg:[3,7] },
      ]
};

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

/* Second gear tier, unlocked once state.quest6Complete is true (see
getAvailableShopItems() in game.js and renderShop() in render.js) — one
item per equipment slot, each granting +2 to a stat (double shopGearItems'
+1), priced a little steeper. Kept as its own array rather than folded
into shopGearItems/shopBuyItems so tier-1 pricing/availability is
untouched and the unlock gate lives in exactly one place.

Gear tier pricing is quadratic against a shared GEAR_BASE_UNIT (10, chosen
to sit right where shopGearItems' own tier-1 prices already cluster):
tier 2 averages ~4x GEAR_BASE_UNIT (~40), tier 3 (below) ~9x (~90). Each
tier's prices are scaled by a single constant factor off its pre-quadratic
numbers, so the relative spread between a tier's own items (cheapest vs
priciest) is unchanged — only the tier's overall level moved. */
const GEAR_BASE_UNIT = 10;
const shopGearItemsTier2 = [
   { name:"a scepter looted from the vizier's chambers", desc:"Still radiates a faint, smug authority.", type:"equip", slot:"weapon", bonus:{hoodoo:2}, price:40, icon: iconVizierScepter },
   { name:"a guard-captain's dented helm", desc:"Reinforced. Dented anyway.", type:"equip", slot:"head", bonus:{grit:2}, price:38, icon: iconGuardHelm },
   { name:"a clockwork-plated chestpiece", desc:"Ticks faintly whenever your heart rate spikes.", type:"equip", slot:"chest", bonus:{grit:2}, price:42, icon: iconClockworkPlate },
   { name:"burrow-worm hide greaves", desc:"Flexible enough to squeeze through a tunnel-worm's old digs.", type:"equip", slot:"legs", bonus:{zip:2}, price:36, icon: iconBurrowGreaves },
   { name:"spring-loaded gnome-tech boots", desc:"Every step has a little more bounce than it should.", type:"equip", slot:"boots", bonus:{zip:2}, price:44, icon: iconSpringBoots },
   ];

/* ---------------- Shop upgrade tiers ---------------- */
/* Upgrading the Shop building (Town Lot -> The Shop, state.buildingUpgrades.shop,
0..BUILDING_UPGRADE_MAX — see upgradeBuilding() in game.js) unlocks better,
pricier stock, on top of whatever's already available. Unlike the other 6
Town Lot buildings (still cosmetic-only, see the BUILDING_UPGRADES comment
below), the Shop's level is read directly by getAvailableShopItems()
(game.js). Nothing already unlocked is ever taken away — these tiers are
additive with shopBuyItems/shopGearItemsTier2, never a replacement for them.
Reusing suspicious jerky (healItems[1]) as the level-1 food unlock rather
than inventing a new item — it's been defined since the start but was never
actually reachable anywhere in the game until now. */
const SHOP_LEVEL_FOOD_TIER2 = 1;
const SHOP_LEVEL_FOOD_TIER3 = 2;
const SHOP_LEVEL_GEAR_TIER3 = 3;

/* Food tier pricing is quadratic against a shared FOOD_BASE_UNIT (5, the
apple's existing tier-1 price in shopBuyItems): tier 2 (jerky) ~4x that
(~20), tier 3 (biscuit tin) ~9x (~45). */
const FOOD_BASE_UNIT = 5;
const shopFoodItemsTier2 = [
   { name:"suspicious jerky", desc:"Restores HP. Ask no further questions.", type:"hp", value:12, price:20, icon:iconJerky },
   ];

const shopFoodItemsTier3 = [
   { name:"a tin of hoarded biscuit crumbs", desc:"Denser than a whole biscuit, somehow. Restores a large amount of HP.", type:"hp", value:22, price:45, icon:iconBiscuitTin },
   ];

/* Top gear tier — one item per slot like shopGearItemsTier2, each granting
+3 to a stat (triple shopGearItems' +1), priced steeper still. Flavored as
the Shop's own premium stock (bought, not looted), unlike Tier 2's
Gnometropolis-loot theming. Priced per the GEAR_BASE_UNIT quadratic scheme
above shopGearItemsTier2 — ~9x GEAR_BASE_UNIT, same per-tier scale factor
applied to every item so the tier's internal price spread is unchanged. */
const shopGearItemsTier3 = [
   { name:"an heirloom hoodoo rod, mostly legitimate", desc:"The provenance is fuzzy. The results aren't.", type:"equip", slot:"weapon", bonus:{hoodoo:3}, price:100, icon: iconHeirloomRod },
   { name:"a champion's dented crown, repurposed", desc:"Whoever wore it first isn't asking for it back.", type:"equip", slot:"head", bonus:{grit:3}, price:85, icon: iconChampionCrown },
   { name:"a reinforced adventurer's cuirass", desc:"Actually built for this. A first, around here.", type:"equip", slot:"chest", bonus:{grit:3}, price:95, icon: iconAdventurerCuirass },
   { name:"a tailored pair of quick-step trousers", desc:"Somehow both stylish and functional.", type:"equip", slot:"legs", bonus:{zip:3}, price:80, icon: iconQuickstepTrousers },
   { name:"boots blessed by a mildly competent hoodoo doctor", desc:"\"Mildly\" is doing some work in that sentence.", type:"equip", slot:"boots", bonus:{zip:3}, price:90, icon: iconBlessedBoots },
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
    item:{ name:"a knot of fat white grubs", desc:"Wriggling, pale, and apparently essential to the recipe.", type:"quest", key:"potionWorms", sell:2, icon:iconPotionWorms } },
   { monsterName:"a fishing gnome with an empty bucket",
    item:{ name:"a jar of pond tadpoles", desc:"The fishing gnome never caught anything. You, apparently, just did.", type:"quest", key:"potionTadpole", sell:2, icon:iconPotionTadpole } },
   { monsterName:"a sewer rat with delusions of grandeur",
    item:{ name:"a gob of glowing sewer sludge", desc:"It hums faintly. That's probably fine.", type:"quest", key:"potionSludge", sell:3, icon:iconPotionSludge } },
   { monsterName:"a rat wearing a bottlecap as a helmet",
    item:{ name:"a whisker plucked from a suspiciously large rat", desc:"It practically vibrates with potency.", type:"quest", key:"potionWhisker", sell:3, icon:iconPotionWhisker } },
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
    item:{ name:"a still-ticking gear core", desc:"Keeps perfect time for a reason nobody can explain.", type:"quest", key:"veinGearCore", sell:4, icon:iconVeinGearCore } },
   { monsterName:"a pickaxe golem, held together by spite",
    item:{ name:"a vein-streaked ore chunk", desc:"Heavier than it looks. Warmer too.", type:"quest", key:"veinOreChunk", sell:5, icon:iconVeinOreChunk } },
   { monsterName:"a positively enormous sewer rat",
    item:{ name:"a fist-sized raw gemstone", desc:"How a sewer rat came by this is a question best not asked.", type:"quest", key:"veinGemstone", sell:4, icon:iconVeinGemstone } },
   { monsterName:"three rats in a trenchcoat, unconvincingly",
    item:{ name:"a tangle of copper wiring", desc:"All three rats insist it was already like that.", type:"quest", key:"veinWiring", sell:4, icon:iconVeinWiring } },
   ];

/* Which state flag has to be true before a given quest item (by its `key`)
can be sold as junk — see isQuestItemSellable()/sellItemByName() in
game.js. Built from the item lists above instead of hand-typed so a
future quest item just needs to exist in one of these arrays (or get a
new entry here directly) rather than being forgotten in a third place. */
const QUEST_ITEM_COMPLETION_FLAG = {
   rakeTine: 'questComplete',
   ...Object.fromEntries(potionIngredients.map(p => [p.item.key, 'quest3Complete'])),
   ...Object.fromEntries(veinIngredients.map(v => [v.item.key, 'quest5Complete'])),
};

/* ---------------- Class titles (level-10 Guild capstone, "The Adventurer's Trial") ---------------- */
/* Awarded by claimClassPath() in game.js based on whichever stat the player
has invested the most points in (ties broken in this key order). Purely
a title + a small stat nudge — see claimClassPath() for the mechanic. */
const CLASS_TITLES = { beef:'Meathead', zip:'Card Shark', grit:'Bulwark', hoodoo:'Hexpert' };

/* Class-capstone combat skill — each renamed class (Meathead/Card Shark/
Hexpert; Bulwark/grit is unchanged and out of scope) unlocks its own
purchasable/levelable combat bonus once state.classTitle matches, bought
at a specific building: Meathead at the Guild, Card Shark at the Casino,
Hexpert at the Hoodoo Doctor's Shack (a separate mechanics task wires the
purchase UI/flow). A player only ever has one active class at a time, so
all three share ONE level counter, state.classSkillLevel (core.js), rather
than three separate counters. Same [0, tier1, tier2, tier3] convention as
the rest of this file (index = level, 0 = no bonus). */
const MEATHEAD_DAMAGE_BONUS = [0, 0.15, 0.30, 0.45]; /* fractional bonus to combat damage */
const CARD_SHARK_PAYOUT_BONUS = [0, 0.5, 1.0, 1.5]; /* added directly to the Casino's win payout multiplier (flat 2x in gambleCasino(), game.js) */
const HEXPERT_SPELL_DMG_BONUS = [0, 3, 6, 9]; /* flat bonus added to spell damage */
/* Cost to go from `level` to `level+1` for the shared class-skill counter
above — quadratic, same style as buildingUpgradeCost() below: 150/600/1350
Pop Tabs. One cost curve shared across all 3 classes' single skill level. */
function classSkillCost(level){ return 150 * (level+1) * (level+1); }

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

/* ---------------- Bounty Board (The Guild) ---------------- */
/* Repeatable content — one at a time, see state.activeBounty in core.js and
rollNewBounty()/claimBounty() in game.js. Each entry's monsterName must be
an EXACT name from monsters[] above; zone is carried alongside it (rather
than looked up from the monster) both for display and so winCombat() can
check the player actually killed it in the right zone, since names alone
aren't guaranteed unique across zones. Rewards scale with ZONE_DIFFICULTY —
a Commons bounty pays out less than a Gnometropolis one. */
/* Reward is paid in Bounty Tokens (state.bountyTokens), not Pop Tabs — a separate currency meant for a future gear exchange. See claimBounty() in game.js. */
const BOUNTY_TEMPLATES = [
   { id:'bounty_commons_compost', type:'kill', monsterName:"a disgruntled compost gnome", zone:'commons', count:6, reward:{bountyTokens:1} },
   { id:'bounty_commons_sergeant', type:'kill', monsterName:"the self-appointed gnome sergeant", zone:'commons', count:4, reward:{bountyTokens:1} },
   { id:'bounty_sewers_rat', type:'kill', monsterName:"a sewer rat with delusions of grandeur", zone:'sewers', count:6, reward:{bountyTokens:2} },
   { id:'bounty_sewers_giant', type:'kill', monsterName:"a positively enormous sewer rat", zone:'sewers', count:5, reward:{bountyTokens:2} },
   { id:'bounty_quarry_drone', type:'kill', monsterName:"a wind-up quarry drone, badly wound", zone:'quarry', count:5, reward:{bountyTokens:2} },
   { id:'bounty_vault_wisp', type:'kill', monsterName:"a vault wisp, humming with old magic", zone:'vault', count:5, reward:{bountyTokens:3} },
   { id:'bounty_gnometropolis_vizier', type:'kill', monsterName:"a gnome vizier, draped in stolen finery", zone:'gnometropolis', count:4, reward:{bountyTokens:3} },
   { id:'bounty_gnometropolis_automaton', type:'kill', monsterName:"a rogue clockwork automaton, sparking wildly", zone:'gnometropolis', count:4, reward:{bountyTokens:4} },
   ];

/* ---------------- Town Lot (Gladstone Hollow) ---------------- */
/* The one previously-empty cell in the town square (translate(200,100) in
artTownSquare(), core.js) — purchasable, then upgradeable through cosmetic
tiers, and once owned it's what unlocks spending Pop Tabs to raise a level
on each of the other 7 town buildings (state.buildingUpgrades, core.js).
See buyTownLot()/upgradeTownLot()/upgradeBuilding() in game.js. */
/* Index = state.lotTier. Index 0 is the unpurchased "Empty Lot" and has no
cost of its own — LOT_TIER_COST[1] is the purchase price. Tier art lives in
artTownSquare() (core.js); these names/costs are what the Town Lot screen
(renderTownLot(), render.js) shows the player. */
const LOT_TIER_NAMES = ['Empty Lot', 'Town Lot', 'Town Lot (Toolshed)', 'Town Hall'];
/* Quadratic: 150 * N * N for tier N (N = 1..3) — 150, 600, 1350. Keeps each
step a real Pop Tabs sink instead of a flat/linear climb. Left as a literal
array (rather than a formula call) since other code indexes this directly
by state.lotTier. */
const LOT_TIER_COST = [0, 150, 600, 1350];
const LOT_TIER_MAX = LOT_TIER_COST.length - 1;

/* The 7 other town buildings a purchased lot lets the player invest in.
`key` must match the building's data-action in artTownSquare() (core.js)
and the corresponding property under state.buildingUpgrades — except 'rest'
(the Inn), which is keyed 'inn' here for a readable label since 'rest' is
just the click action's verb, not a name. Levels are tracked for all 7, and
as of this pass all 7 have a real effect wired to their level — each
building's bonus lives in its own LEVEL-indexed array right below (index 0
is always the no-bonus baseline; 1..BUILDING_UPGRADE_MAX are the tiers), so
a future reader can find the mechanism without re-deriving it:
- 'shop'   — SHOP_LEVEL_FOOD_TIER2/SHOP_LEVEL_FOOD_TIER3/
             SHOP_LEVEL_GEAR_TIER3 above (unlock gates, not a per-level
             array) + getAvailableShopItems() in game.js.
- 'gaffer' — GAFFER_BISCUIT_MAX_BONUS, added to BISCUIT_MAX in game.js.
- 'hoodoo' — HOODOO_SPELL_DISCOUNT, applied to spell price in
             learnSpell() (game.js).
- 'inn'    — INN_FREE_REST_CHANCE, chance restAtInn() (game.js) skips
             consuming a Biscuit.
- 'tinker' — TINKER_SELL_BONUS, applied to junk sell prices in
             sellItemByName() (game.js).
- 'guild'  — GUILD_BOUNTY_BONUS, applied to Bounty Token rewards in
             claimBounty() (game.js).
- 'casino' — CASINO_WIN_BONUS, added to CASINO_WIN_CHANCE above when
             gambling.
None of these mechanics are wired up in game.js yet as of this data-layer
pass — that's the next task; this file only defines the numbers. */
const BUILDING_UPGRADES = [
   { key:'gaffer', name:"Gaffer's Cottage" },
   { key:'hoodoo', name:"Hoodoo Doctor's Shack" },
   { key:'inn', name:'The Inn' },
   { key:'tinker', name:"Tinker's Workshop" },
   { key:'shop', name:'The Shop' },
   { key:'guild', name:'The Guild' },
   { key:'casino', name:'The Casino' },
   ];
const BUILDING_UPGRADE_MAX = 3;
/* Cost to go from `level` to `level+1` — quadratic: 100 * (level+1)^2, i.e.
100/400/900 Pop Tabs per building. */
function buildingUpgradeCost(level){ return 100 * (level+1) * (level+1); }

/* Per-building level effects, one array per building keyed the same as
BUILDING_UPGRADES above, each indexed by state.buildingUpgrades[key]
(0..BUILDING_UPGRADE_MAX). Index 0 is always 0/no-op so a level-0 building
is a guaranteed no-bonus baseline; indices 1-3 are additive tiers — same
convention as the SHOP_LEVEL_* constants near the top of this file. Nothing
is ever removed as a building levels up, only added on top. */

/* Gaffer's Cottage — flat extra Biscuit (energy) capacity on top of
BISCUIT_MAX (game.js), so a maxed cottage lets the player stockpile more
energy between regen ticks before it caps out. */
const GAFFER_BISCUIT_MAX_BONUS = [0, 20, 40, 60];

/* Hoodoo Doctor's Shack — fractional discount off a spell's Pop Tabs price
in learnSpell() (game.js). 0.30 at max level = 30% off. */
const HOODOO_SPELL_DISCOUNT = [0, 0.10, 0.20, 0.30];

/* Stat-reset potion (respec), also sold by the Hoodoo Doctor — refunds all
spent stat points so the player can redistribute them. Unlike every other
priced item in this file, its price isn't tiered by building level: it
climbs steeply on every single purchase, ever, tracked by
state.statResetsBrewed (core.js/account.js). Price for the Nth potion
(0-indexed by state.statResetsBrewed) is
STAT_RESET_BASE_PRICE * STAT_RESET_PRICE_MULT^N — 150, 600, 2400, 9600,
38400, ... — intentionally exponential, not gentle, per design intent:
a respec should be a rare, deliberate, increasingly expensive choice, not
a routine one. The brew function that reads these lives in game.js (a
separate change); this is data/state plumbing only. */
const STAT_RESET_BASE_PRICE = 150;
const STAT_RESET_PRICE_MULT = 4;

/* Divisor for statBonus() (core.js), which turns a raw stat value into the
superlinearly-scaled number combat math actually reads: value + floor(value^2 /
STAT_SCALING_DIVISOR). At value 10 this adds +6 on top of the raw 10, at value
20 it adds +26, at value 30 it adds +60 — so late points (bought at a much
higher, quadratically-scaled Town Lot cost) are worth meaningfully more than
early ones, not just more of the same flat +1. */
const STAT_SCALING_DIVISOR = 15;

/* The Inn — chance restAtInn() (game.js) restores the player without
consuming a Biscuit. 1.0 at max level = rest is always free. */
const INN_FREE_REST_CHANCE = [0, 0.25, 0.5, 1.0];

/* Tinker's Workshop — fractional bonus added to junk sell prices in
sellItemByName() (game.js). 0.30 at max level = junk sells for 30% more. */
const TINKER_SELL_BONUS = [0, 0.10, 0.20, 0.30];

/* The Guild — fractional bonus added to Bounty Token rewards in
claimBounty() (game.js). 0.30 at max level = bounties pay out 30% more
Bounty Tokens. */
const GUILD_BOUNTY_BONUS = [0, 0.10, 0.20, 0.30];

/* The Casino — added directly to CASINO_WIN_CHANCE above when gambling, so
a maxed casino narrows (but per product intent never eliminates) the
house's edge. 0.10 at max level = 45% base win chance becomes 55%. */
const CASINO_WIN_BONUS = [0, 0.03, 0.06, 0.10];
