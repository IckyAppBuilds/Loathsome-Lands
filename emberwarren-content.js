/* ---------------- The Ember Warren content (Act 2, quest11) ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md) — mirrors warrensear-content.js's own role, one
hub deeper still. Loads after content.js/warrensear-content.js/icons.js/
emberwarren-art.js (whose functions this file references by value at
parse time or extends by reference).

The Foundry's 3 regulars + the Gearworks' 3 regulars follow the exact
same loot/rareDrop/gearDrop shape as every monster in content.js's own
monsters[] — reusing existing icons throughout, same established
convention. gearDrop bonus values continue the same per-zone ladder
(+9 — one step past choir/ledgervault's own +8). Deliberately no rare
hunt/boss monster here yet — same as Mudroot Warren itself launching
bare before quest9/quest10 later added tunnelWarden/warrenScout and
tunnelMoleInformant/seniorClerk; this zone gets one only once a future
quest actually needs it. */
const emberWarrenMonsters = [
   { name:"a soot-caked forge-mole, sparks catching in its fur", hp:66, atkMin:9, atkMax:15, xp:41, zone:"foundry",
    art: artForgeMole, loot:{name:"a fistful of clinker-slag", desc:"Still warm. Still stuck to itself.", type:"junk", sell:17, icon:iconOreGrit},
    rareDrop:{name:"a coal seam that never quite burns out", desc:"You've been carrying an ember for three days now.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"forge-mole's quench-tempered tongs of the Badger", desc:"Still smells faintly of the last thing it grabbed.", type:"equip", slot:"weapon", bonus:{beef:9}, tier:'common', icon:iconRakeShank} },
   { name:"a bellows-mole, wheezing out gouts of forge-heat", hp:62, atkMin:9, atkMax:14, xp:39, zone:"foundry",
    art: artBellowsMole, loot:{name:"a dented iron pipe fitting", desc:"Was part of something load-bearing, probably.", type:"junk", sell:16, icon:iconPipeFitting},
    rareDrop:{name:"a lungful of air that's never once cooled", desc:"You breathe out and the room gets warmer.", type:"luck", hpValue:28, mpValue:14, icon:iconClover},
    gearDrop:{name:"bellows-mole's rivet-seamed hide plating of the Tortoise", desc:"Built to take the heat nobody else in the room can.", type:"equip", slot:"chest", bonus:{grit:9}, tier:'common', icon:iconClockworkPlate} },
   { name:"a slag-hauler, dragging a cart twice its own size", hp:70, atkMin:10, atkMax:16, xp:43, zone:"foundry",
    art: artSlagHauler, loot:{name:"a chunk of still-glowing slag", desc:"Cooling, technically. Not fast enough to matter yet.", type:"junk", sell:18, icon:iconCapturedLight},
    rareDrop:{name:"the cart's own unbreakable axle", desc:"Outlasted three haulers and counting.", type:"junk", sell:49, icon:iconFigurine},
    gearDrop:{name:"hauler's cart-track leg braces of the Weasel", desc:"Built for hauling twice your own weight, uphill, forever.", type:"equip", slot:"legs", bonus:{zip:9}, tier:'common', icon:iconShinGuard} },
   { name:"a cog-fitter, three thumbs and all of them precise", hp:64, atkMin:9, atkMax:15, xp:40, zone:"gearworks",
    art: artCogFitter, loot:{name:"an unmatched brass cog", desc:"Fits nothing you own. Fits something, somewhere.", type:"junk", sell:17, icon:iconGear},
    rareDrop:{name:"the one gear that keeps the whole line running", desc:"Nobody's dared remove it to check what happens.", type:"junk", sell:48, icon:iconFigurine},
    gearDrop:{name:"cog-fitter's precision-ground faceguard of the Tortoise", desc:"Doesn't miss a spec. Doesn't miss a hit, either.", type:"equip", slot:"head", bonus:{grit:9}, tier:'common', icon:iconGuardHelm} },
   { name:"a pressure-mole, hissing steam from somewhere it shouldn't", hp:68, atkMin:10, atkMax:15, xp:42, zone:"gearworks",
    art: artPressureMole, loot:{name:"a servo joint, still twitching", desc:"Not plugged into anything anymore. Hasn't noticed.", type:"junk", sell:17, icon:iconServoJoint},
    rareDrop:{name:"a full head of steam with nowhere left to go", desc:"You feel unreasonably ready for a fight.", type:"luck", hpValue:28, mpValue:14, icon:iconClover},
    gearDrop:{name:"pressure-mole's steam-sealed boot plating of the Weasel", desc:"Vents just enough to keep you moving.", type:"equip", slot:"boots", bonus:{zip:9}, tier:'common', icon:iconGripBoots} },
   { name:"a line-runner, built for squeezing between conveyor belts", hp:60, atkMin:9, atkMax:14, xp:38, zone:"gearworks",
    art: artLineRunner, loot:{name:"a pickaxe head, worn down to a nub", desc:"Traded in for something faster months ago.", type:"junk", sell:16, icon:iconPickaxeHead},
    rareDrop:{name:"the fastest lap time the line's ever clocked", desc:"Nobody's beaten it since. You might.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"line-runner's quick-swap coupling-flail of the Weasel", desc:"Built to disconnect from anything, fast, on purpose.", type:"equip", slot:"weapon", bonus:{zip:9}, tier:'common', icon:iconDiceFlail} },
   ];

monsters.push(...emberWarrenMonsters);
BOUNTY_TEMPLATES.push(...emberWarrenMonsters.map(makeBountyTemplate));

/* Same reasoning as mudroot-content.js/warrensear-content.js's own
extension of these two objects — the Foundry/the Gearworks get their
own flavor instead of falling back to the Commons pool. */
Object.assign(noncombatEvents, {
   foundry: [
      "Heat rolls off a wall that shouldn't be a wall this far from the forge.",
      "Something ahead is being hammered into shape, twelve steady beats a minute.",
      "A chute dumps a fresh load of ore somewhere close, then goes quiet.",
      "The air tastes like hot metal for a few steps and then doesn't.",
      "A bellows wheezes once, long and slow, like it's the only one working the night shift.",
      "You pass a rack of tools, every single one still warm to the touch."
      ],
   gearworks: [
      "A belt somewhere keeps moving long after whatever it was carrying is gone.",
      "Something ticks past you at exactly regular intervals, and never explains why.",
      "A gear the size of a wagon wheel turns once, alone, in a room with no other machinery.",
      "You hear a valve vent somewhere below, then silence, then it happens again.",
      "A row of levers sits mid-throw, like whoever pulled them left in a hurry.",
      "Steam curls out from between two plates that fit together a little too well."
      ]
});
Object.assign(hazardEvents, {
   foundry: [
      { text:"A blast of forge-heat rolls over you before you can back away from it.", dmg:[5,9] },
      { text:"Something red-hot skitters loose from a passing cart and catches your leg.", dmg:[5,9] },
      { text:"A grate gives out underfoot, dumping you an ugly half-step onto hot stone.", dmg:[4,9] },
      ],
   gearworks: [
      { text:"A pressure line lets go right beside you, hot and loud.", dmg:[5,9] },
      { text:"A gear tooth catches your sleeve before you can pull free of it.", dmg:[4,8] },
      { text:"Something swings past on a chain at exactly head height.", dmg:[5,9] },
      ]
});
