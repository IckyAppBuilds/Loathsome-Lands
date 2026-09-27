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
(+9 — one step past choir/ledgervault's own +8). */
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

/* Quest 12's own two-stage rare hunt, "Chain of Custody" — the first
Act 2 quest that sends the player BACKWARD into old territory instead
of always pushing further out: stage 1 (the line foreman) is here in
the Gearworks, but stage 2 (the quartermaster) surfaces back in the
Bureau, an already-explored Mudroot Warren district (guild.js/combat.js
for the actual sequencing). Both are also this game's first monsters
with a 'debuff' skill (state.playerStatusEffect, core.js) — the
foreman's burn ties to the Foundry/Gearworks' own forge-heat theme; the
quartermaster's poison is dressed as a "corroded filing spike," tying
it back to the Bureau's own paperwork theme rather than reusing the
same flavor. No loot/rareDrop of their own, same reasoning as every
other named quest-hunt boss — they're already a dedicated quest
reward. */
const GEARWORKS_FOREMAN_SPAWN_CHANCE = 0.05;
const BUREAU_QUARTERMASTER_SPAWN_CHANCE = 0.05;
const gearworksForeman = {
   name:"the line foreman, clipboard in one hand and a wrench in the other", hp:78, atkMin:10, atkMax:16, xp:55, rare:true, zone:"gearworks",
   skills:[ { type:'debuff', chance:0.22, debuffType:'burn', debuffTurns:3, dmgPerTurn:7, flavor:"shoves you into a live vent, sparks catching on your sleeve" } ],
   art: artGearworksForeman, loot:null
};
const bureauQuartermaster = {
   name:"the quartermaster, three ledgers behind and somehow ahead of you", hp:80, atkMin:10, atkMax:16, xp:55, rare:true, zone:"bureau",
   skills:[ { type:'debuff', chance:0.22, debuffType:'poison', debuffTurns:4, dmgPerTurn:5, flavor:"jabs you with a corroded filing spike, something on it clearly not ink" } ],
   art: artBureauQuartermaster, loot:null
};

/* Quest 13, "Quenched" — a single rare hunt, deliberately simpler in
STRUCTURE than quest12 (no second stage) but harder in every stat, and
this game's first 'freeze' debuff (state.playerStatusEffect, core.js) —
burn and poison already had a boss each; freeze didn't until now. Fits
the Foundry's own forge-heat theme from the opposite angle burn does:
rapid quenching seizes the joints instead of scorching them. */
const QUENCH_MASTER_SPAWN_CHANCE = 0.05;
const quenchMaster = {
   name:"the quench-master, apron scorched black from decades at the trough", hp:88, atkMin:11, atkMax:17, xp:62, rare:true, zone:"foundry",
   skills:[ { type:'debuff', chance:0.24, debuffType:'freeze', debuffTurns:3, dmgReduction:0.35, flavor:"plunges you into the quenching trough — your joints seize as the cold locks them up" } ],
   art: artQuenchMaster, loot:null
};

/* Quest 15's own gauntlet, "the Mole Council" — the arc's finale, same
scripted approach-in-order shape as quest14's Ledger Committee (both
via gauntlet.js's generalized approachGauntlet(), not a random hunt).
Two guards ahead of warrenMother, the single biggest silhouette and
stat block in the game (see artWarrenMother's own comment, art.js) —
her buff+freeze combo deliberately mirrors gnomeKing's own buff+bolt
finale design (Act 1), just with the newer debuff mechanic standing in
for the bolt. No loot/rareDrop on any of the three, same reasoning as
every other named quest-hunt boss. */
const tunnelCaptain = {
   name:"a tunnel captain, dug in and dug in deep", hp:90, atkMin:12, atkMax:18, xp:50, rare:true, zone:"gearworks",
   dodgeChance:0.25,
   art: artTunnelCaptain, loot:null
};
const foundryMarshal = {
   name:"a foundry marshal, still glowing faintly from the last shift", hp:100, atkMin:13, atkMax:19, xp:58, rare:true, zone:"gearworks",
   skills:[ { type:'debuff', chance:0.24, debuffType:'burn', debuffTurns:3, dmgPerTurn:8, flavor:"brands you with a slag-iron still hot from the forge" } ],
   art: artFoundryMarshal, loot:null
};
const warrenMother = {
   name:"the warren-mother, matriarch of every tunnel you've ever walked through", hp:130, atkMin:14, atkMax:21, xp:90, rare:true, zone:"gearworks",
   skills:[
      { type:'buff', chance:0.15, buffMult:1.7, buffTurns:3, flavor:"calls every last tunnel to answer at once" },
      { type:'debuff', chance:0.20, debuffType:'freeze', debuffTurns:3, dmgReduction:0.4, flavor:"the ground itself locks around your legs, cold and absolute" },
      ],
   art: artWarrenMother, loot:null
};

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
