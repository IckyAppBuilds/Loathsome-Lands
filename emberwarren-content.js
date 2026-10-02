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
   { name:"a soot-caked forge-mole, sparks catching in its fur", ...MONSTER_STATS["a soot-caked forge-mole, sparks catching in its fur"], zone:"foundry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:100, boltMax:129, flavor:"flings a fistful of still-glowing slag" } ],
    art: artForgeMole, loot:{name:"a fistful of clinker-slag", desc:"Still warm. Still stuck to itself.", type:"junk", sell:17, icon:iconOreGrit},
    rareDrop:{name:"a coal seam that never quite burns out", desc:"You've been carrying an ember for three days now.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"forge-mole's quench-tempered tongs of the Badger", desc:"Still smells faintly of the last thing it grabbed.", type:"equip", slot:"weapon", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconRakeShank} },
   { name:"a bellows-mole, wheezing out gouts of forge-heat", ...MONSTER_STATS["a bellows-mole, wheezing out gouts of forge-heat"], zone:"foundry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"wheezes in a lungful of forge-heat and seals the wound" } ],
    art: artBellowsMole, loot:{name:"a dented iron pipe fitting", desc:"Was part of something load-bearing, probably.", type:"junk", sell:16, icon:iconPipeFitting},
    rareDrop:{name:"a lungful of air that's never once cooled", desc:"You breathe out and the room gets warmer.", type:"luck", hpValue:28, mpValue:14, icon:iconClover},
    gearDrop:{name:"bellows-mole's rivet-seamed hide plating of the Weasel", desc:"Built to take the heat nobody else in the room can.", type:"equip", slot:"chest", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconClockworkPlate} },
   { name:"a slag-hauler, dragging a cart twice its own size", ...MONSTER_STATS["a slag-hauler, dragging a cart twice its own size"], zone:"foundry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"drops the cart and charges unburdened" } ],
    art: artSlagHauler, loot:{name:"a chunk of still-glowing slag", desc:"Cooling, technically. Not fast enough to matter yet.", type:"junk", sell:18, icon:iconCapturedLight},
    rareDrop:{name:"the cart's own unbreakable axle", desc:"Outlasted three haulers and counting.", type:"junk", sell:49, icon:iconFigurine},
    gearDrop:{name:"hauler's cart-track leg braces of the Loon", desc:"Built for hauling twice your own weight, uphill, forever.", type:"equip", slot:"legs", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconShinGuard} },
   { name:"a cog-fitter, three thumbs and all of them precise", ...MONSTER_STATS["a cog-fitter, three thumbs and all of them precise"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:100, boltMax:129, flavor:"flings a loose cog with pinpoint, infuriating precision" } ],
    art: artCogFitter, loot:{name:"an unmatched brass cog", desc:"Fits nothing you own. Fits something, somewhere.", type:"junk", sell:17, icon:iconGear},
    rareDrop:{name:"the one gear that keeps the whole line running", desc:"Nobody's dared remove it to check what happens.", type:"junk", sell:48, icon:iconFigurine},
    gearDrop:{name:"cog-fitter's precision-ground faceguard of the Badger", desc:"Doesn't miss a spec. Doesn't miss a hit, either.", type:"equip", slot:"head", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a pressure-mole, hissing steam from somewhere it shouldn't", ...MONSTER_STATS["a pressure-mole, hissing steam from somewhere it shouldn't"], zone:"gearworks",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"vents a jet of steam over the wound, somehow helping" } ],
    art: artPressureMole, loot:{name:"a servo joint, still twitching", desc:"Not plugged into anything anymore. Hasn't noticed.", type:"junk", sell:17, icon:iconServoJoint},
    rareDrop:{name:"a full head of steam with nowhere left to go", desc:"You feel unreasonably ready for a fight.", type:"luck", hpValue:28, mpValue:14, icon:iconClover},
    gearDrop:{name:"pressure-mole's steam-sealed boot plating of the Weasel", desc:"Vents just enough to keep you moving.", type:"equip", slot:"boots", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconGripBoots} },
   { name:"a line-runner, built for squeezing between conveyor belts", ...MONSTER_STATS["a line-runner, built for squeezing between conveyor belts"], zone:"gearworks",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"ducks between two conveyor belts and comes out faster" } ],
    art: artLineRunner, loot:{name:"a pickaxe head, worn down to a nub", desc:"Traded in for something faster months ago.", type:"junk", sell:16, icon:iconPickaxeHead},
    rareDrop:{name:"the fastest lap time the line's ever clocked", desc:"Nobody's beaten it since. You might.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"line-runner's quick-swap coupling-flail of the Loon", desc:"Built to disconnect from anything, fast, on purpose.", type:"equip", slot:"weapon", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconDiceFlail} },
   /* Per a later explicit request, every zone's gearDrop set needs to
   cover all 5 slots for all 3 classes — 12 more regulars per district
   (Foundry/Gearworks), same mole-silhouette vocabulary every Ember
   Warren monster already uses, same class-gated treatment every zone
   past Gnometropolis already got. */
   { name:"a crucible-mole, carrying molten metal like it's nothing", ...MONSTER_STATS["a crucible-mole, carrying molten metal like it's nothing"], zone:"foundry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"tips the crucible just enough to catch the light, and charges" } ],
    art: artCrucibleMole, loot:{name:"a cooled splash of crucible metal", desc:"Took the shape of whatever it landed on.", type:"junk", sell:17, icon:iconCapturedLight},
    rareDrop:{name:"a splash of metal that never fully cooled", desc:"Still warm, days later. Unsettling, honestly.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"crucible-mole's heat-warped helm of the Badger", desc:"Slightly melted, permanently, in a way that somehow still fits.", type:"equip", slot:"head", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a hammer-mole, built like the anvil it works", ...MONSTER_STATS["a hammer-mole, built like the anvil it works"], zone:"foundry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"hammers the dent back out of its own hide, same as any metal" } ],
    art: artHammerMole, loot:{name:"a chipped forge hammerhead", desc:"Seen more honest work than most tools in the Warren.", type:"junk", sell:18, icon:iconPickaxeHead},
    rareDrop:{name:"a hammerhead that's never once chipped", desc:"Still perfectly true after years on the anvil.", type:"junk", sell:49, icon:iconFigurine},
    gearDrop:{name:"hammer-mole's anvil-braced chest-plate of the Badger", desc:"Took a hammer blow meant for the forge. Held fine.", type:"equip", slot:"chest", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a furnace-stoker mole, feeding flames that never go out", ...MONSTER_STATS["a furnace-stoker mole, feeding flames that never go out"], zone:"foundry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:130, flavor:"stokes the furnace one last time and the flare catches you too" } ],
    art: artFurnaceStokerMole, loot:{name:"a soot-blackened stoking rod", desc:"Warm straight through, handle and all.", type:"junk", sell:17, icon:iconPipeFitting},
    rareDrop:{name:"a stoking rod that's somehow stayed cool", desc:"Shouldn't be possible this close to the furnace. Is, anyway.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"furnace-stoker's own scorched greaves of the Badger", desc:"Singed black, same as everything else down here.", type:"equip", slot:"legs", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconScorchedGreaves} },
   { name:"a slag-walker mole, crossing cooling metal barefoot", ...MONSTER_STATS["a slag-walker mole, crossing cooling metal barefoot"], zone:"foundry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"crosses a strip of cooling slag without even slowing down" } ],
    art: artSlagWalkerMole, loot:{name:"a footprint pressed into cooling slag", desc:"Shouldn't have walked across this. Did it anyway.", type:"junk", sell:18, icon:iconOreGrit},
    rareDrop:{name:"a slag footprint that's still glowing, days later", desc:"Hasn't cooled down since it was made.", type:"junk", sell:49, icon:iconFigurine},
    gearDrop:{name:"slag-walker's own heat-proof boots of the Badger", desc:"Walked across molten slag in these. More than once.", type:"equip", slot:"boots", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a quench-mole, darting between fire and water", ...MONSTER_STATS["a quench-mole, darting between fire and water"], zone:"foundry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:100, boltMax:128, flavor:"darts from the quench-bath straight at you, still steaming" } ],
    art: artQuenchMole, loot:{name:"a quench-bath steam wisp, bottled", desc:"Still faintly hissing in the jar.", type:"junk", sell:16, icon:iconCapturedLight},
    rareDrop:{name:"a steam wisp that's genuinely, properly contained", desc:"Hasn't escaped the jar once. Impressive, for steam.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"quench-mole's own steam-slick cap of the Weasel", desc:"Still damp, no matter how long it's been out of the bath.", type:"equip", slot:"head", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a spark-dodger mole, never once catching fire", ...MONSTER_STATS["a spark-dodger mole, never once catching fire"], zone:"foundry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"dodges its own shower of sparks and patches up mid-step" } ],
    art: artSparkDodgerMole, loot:{name:"a singed-but-intact whisker", desc:"Close call. Very close. Still has all its fur.", type:"junk", sell:17, icon:iconGoldWhisker},
    rareDrop:{name:"a whisker that's never once been singed", desc:"Perfect record, this close to a working forge.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"spark-dodger's own scorch-free leggings of the Weasel", desc:"Not one burn mark, somehow, after years in the foundry.", type:"equip", slot:"legs", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconTrousers} },
   { name:"a cinder-runner mole, light across hot coals", ...MONSTER_STATS["a cinder-runner mole, light across hot coals"], zone:"foundry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"skips across a bed of hot coals without breaking stride" } ],
    art: artCinderRunnerMole, loot:{name:"a still-warm cinder", desc:"Picked it up without thinking. Regretting it slightly.", type:"junk", sell:16, icon:iconOreGrit},
    rareDrop:{name:"a cinder that burns cold, somehow", desc:"Should be hot. Isn't. Nobody's explained why.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"cinder-runner's own coal-walker boots of the Weasel", desc:"Crossed a bed of hot coals in these without a scorch mark.", type:"equip", slot:"boots", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconSpringBoots} },
   { name:"a forge-blade mole, tempering its own claws in the fire", ...MONSTER_STATS["a forge-blade mole, tempering its own claws in the fire"], zone:"foundry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:129, flavor:"the freshly tempered claws find their mark, clean and sharp" } ],
    art: artForgeBladeMole, loot:{name:"a freshly tempered claw-shaving", desc:"Still warm from the quench. Sharper than it looks.", type:"junk", sell:17, icon:iconPickaxeHead},
    rareDrop:{name:"a claw tempered to a genuinely dangerous edge", desc:"You're careful with this one. Very careful.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"forge-blade mole's own tempered edge of the Weasel", desc:"Quenched and tempered right there at the forge.", type:"equip", slot:"weapon", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a heat-reader mole, sensing the forge before it flares", ...MONSTER_STATS["a heat-reader mole, sensing the forge before it flares"], zone:"foundry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"reads the heat coming off its own wound and tends it just in time" } ],
    art: artHeatReaderMole, loot:{name:"a heat-warped reading gauge", desc:"Bent from reading temperatures it shouldn't have survived.", type:"junk", sell:16, icon:iconSentinelEye},
    rareDrop:{name:"a gauge that reads the forge perfectly, every time", desc:"Never once wrong about when it's about to flare.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"heat-reader's own warped circlet of the Loon", desc:"Slightly melted. Still reads the heat just fine.", type:"equip", slot:"head", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"an ember-warded mole, lined with half-forged charms", ...MONSTER_STATS["an ember-warded mole, lined with half-forged charms"], zone:"foundry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the half-forged charms along its hide finally finish cooling, and hold" } ],
    art: artEmberWardedMole, loot:{name:"a half-forged warding charm", desc:"Still glowing faintly. Not quite finished. Works anyway.", type:"junk", sell:17, icon:iconMendCharm},
    rareDrop:{name:"a warding charm forged all the way through", desc:"Finished properly, for once. You can feel the difference.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"ember-warded mole's own half-forged vestment of the Loon", desc:"Still cooling, slowly, charm by charm.", type:"equip", slot:"chest", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a silent-smith mole, working without a single clang", ...MONSTER_STATS["a silent-smith mole, working without a single clang"], zone:"foundry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"works the wound shut in complete silence, same as everything else it forges" } ],
    art: artSilentSmithMole, loot:{name:"a soundlessly forged nail", desc:"Should've rung on the anvil. Didn't make a sound.", type:"junk", sell:16, icon:iconRakeShank},
    rareDrop:{name:"a forged piece made in genuine, total silence", desc:"Not one clang, the whole process. Unnerving craftsmanship.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"silent-smith's own noiseless boots of the Loon", desc:"Forges in complete silence. Walks the same way.", type:"equip", slot:"boots", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a foundry-conjuror mole, channeling raw heat into something sharper", ...MONSTER_STATS["a foundry-conjuror mole, channeling raw heat into something sharper"], zone:"foundry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:130, flavor:"channels the furnace's own heat into something far sharper than fire" } ],
    art: artFoundryConjurorMole, loot:{name:"a heat-channeled conjuring rod fragment", desc:"Warped from channeling more heat than it was built for.", type:"junk", sell:17, icon:iconArcaneFocus},
    rareDrop:{name:"a conjuring rod channeling something genuinely dangerous", desc:"You wouldn't want to be on the other end of this one.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"foundry-conjuror's own heat-channeled wand of the Loon", desc:"Still radiates warmth, long after leaving the forge.", type:"equip", slot:"weapon", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* 12 more Gearworks regulars. */
   { name:"a gear-plated mole, armored in mismatched cogs", ...MONSTER_STATS["a gear-plated mole, armored in mismatched cogs"], zone:"gearworks",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"swaps a dented cog for a spare and keeps right on going" } ],
    art: artGearPlatedMole, loot:{name:"a mismatched spare cog", desc:"Doesn't fit anything. Kept it anyway.", type:"junk", sell:17, icon:iconGear},
    rareDrop:{name:"a cog that fits absolutely everything", desc:"Universal, somehow. Shouldn't be possible.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"gear-plated mole's own cog-armored vest of the Badger", desc:"Plated in cogs that don't match, and don't need to.", type:"equip", slot:"chest", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconClockworkPlate} },
   { name:"a flywheel mole, spinning up before every charge", ...MONSTER_STATS["a flywheel mole, spinning up before every charge"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:100, boltMax:128, flavor:"the flywheel hits full speed and the charge lands twice as hard" } ],
    art: artFlywheelMole, loot:{name:"a spun-loose flywheel bearing", desc:"Still spinning, slower now, on the ground beside you.", type:"junk", sell:16, icon:iconGear},
    rareDrop:{name:"a flywheel bearing that never slows down", desc:"Still spinning at full speed, no power source in sight.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"flywheel mole's own spun-up greaves of the Badger", desc:"Humming faintly, like they're still spinning up.", type:"equip", slot:"legs", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a piston-mole, driven forward by something hissing", ...MONSTER_STATS["a piston-mole, driven forward by something hissing"], zone:"gearworks",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the piston fires, hissing, and drives it forward twice as hard" } ],
    art: artPistonMole, loot:{name:"a hissing piston valve", desc:"Still venting pressure. Hasn't stopped in years.", type:"junk", sell:17, icon:iconServoJoint},
    rareDrop:{name:"a piston valve under genuinely dangerous pressure", desc:"You're not opening this one any further.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"piston-mole's own pressure-driven boots of the Badger", desc:"Hiss faintly with every step, same as the piston that drives them.", type:"equip", slot:"boots", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a cog-smith mole, swinging a wrench the size of its own body", ...MONSTER_STATS["a cog-smith mole, swinging a wrench the size of its own body"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:130, flavor:"the oversized wrench comes around with the full weight of the gearworks behind it" } ],
    art: artCogSmithMole, loot:{name:"an oversized spare wrench-head", desc:"Nearly as big as the mole swinging it. Somehow.", type:"junk", sell:18, icon:iconVizierScepter},
    rareDrop:{name:"a wrench-head that fits every bolt in the gearworks", desc:"Shouldn't be universal. Is, anyway.", type:"junk", sell:49, icon:iconFigurine},
    gearDrop:{name:"cog-smith's own oversized wrench of the Badger", desc:"Nearly as big as the mole that swings it.", type:"equip", slot:"weapon", bonus:{beef:9}, classRequired:'Meathead', tier:'common', icon:iconVizierScepter} },
   { name:"a sprocket-scout mole, counting teeth on every gear it passes", ...MONSTER_STATS["a sprocket-scout mole, counting teeth on every gear it passes"], zone:"gearworks",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"counts your own weaknesses the same way it counts gear teeth, precisely" } ],
    art: artSprocketScoutMole, loot:{name:"a counted-out sprocket tooth", desc:"Numbered. Catalogued. One of thousands.", type:"junk", sell:16, icon:iconGear},
    rareDrop:{name:"a sprocket tooth that's somehow uncounted", desc:"The scout seemed genuinely bothered by missing this one.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"sprocket-scout's own counted cap of the Weasel", desc:"Lined with tally marks for every sprocket it's ever seen.", type:"equip", slot:"head", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a belt-runner mole, keeping pace with the line itself", ...MONSTER_STATS["a belt-runner mole, keeping pace with the line itself"], zone:"gearworks",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"keeps pace with the belt long enough to patch itself mid-stride" } ],
    art: artBeltRunnerMole, loot:{name:"a worn conveyor belt scrap", desc:"Run across so many times it's nearly smooth.", type:"junk", sell:16, icon:iconPipeFitting},
    rareDrop:{name:"a belt scrap that's run faster than the line itself", desc:"Outpaced the machinery. Impressive, for a scrap of rubber.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"belt-runner's own line-paced vest of the Weasel", desc:"Keeps perfect time with whatever machinery is nearby.", type:"equip", slot:"chest", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a gear-slip mole, squeezing through machinery nothing else fits through", ...MONSTER_STATS["a gear-slip mole, squeezing through machinery nothing else fits through"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:100, boltMax:128, flavor:"slips through a gap in the machinery and swings on the way out" } ],
    art: artGearSlipMole, loot:{name:"a scrap of gap-worn casing", desc:"Worn smooth from squeezing through somewhere it shouldn't fit.", type:"junk", sell:16, icon:iconServoJoint},
    rareDrop:{name:"a casing scrap from a gap genuinely too narrow", desc:"Shouldn't have fit through there. Did anyway.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"gear-slip mole's own narrow-fit leggings of the Weasel", desc:"Tailored for machinery nothing else can clear.", type:"equip", slot:"legs", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconTrousers} },
   { name:"a ratchet mole, clicking tighter with every exchange", ...MONSTER_STATS["a ratchet mole, clicking tighter with every exchange"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:129, flavor:"clicks one notch tighter and the swing lands harder for it" } ],
    art: artRatchetMole, loot:{name:"a well-worn ratchet head", desc:"Clicks tighter every time it's used. Never loosens.", type:"junk", sell:17, icon:iconDiceFlail},
    rareDrop:{name:"a ratchet that's wound impossibly tight", desc:"One more click and something's going to give.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"ratchet mole's own tightening blade of the Weasel", desc:"Clicks faintly with every swing, one notch tighter each time.", type:"equip", slot:"weapon", bonus:{zip:9}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a clockwork-reader mole, hearing the gears before they turn", ...MONSTER_STATS["a clockwork-reader mole, hearing the gears before they turn"], zone:"gearworks",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"hears its own next move in the gears before it even makes it" } ],
    art: artClockworkReaderMole, loot:{name:"a clockwork gear, still faintly ticking", desc:"Keeps its own time. Hasn't agreed with any clock yet.", type:"junk", sell:16, icon:iconGear},
    rareDrop:{name:"a gear that ticks in perfect, genuine sync", desc:"Matches every other clock in the gearworks. Finally.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"clockwork-reader's own ticking circlet of the Loon", desc:"Still keeping time, long after the gear it came from stopped.", type:"equip", slot:"head", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"a gearworks-warded mole, humming in time with the machinery", ...MONSTER_STATS["a gearworks-warded mole, humming in time with the machinery"], zone:"gearworks",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the ward along its hide hums in perfect time with the machinery, and holds" } ],
    art: artGearworksWardedMole, loot:{name:"a machinery-synced warding charm", desc:"Ticks along with the gears. Doesn't miss a beat.", type:"junk", sell:17, icon:iconMendCharm},
    rareDrop:{name:"a warding charm perfectly synced to the whole line", desc:"Every gear in the gearworks seems to move in time with it.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"gearworks-warded mole's own ticking vestment of the Loon", desc:"Hums in perfect time with whatever machinery's nearby.", type:"equip", slot:"chest", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a tension-mole, wound tight enough to spring at any moment", ...MONSTER_STATS["a tension-mole, wound tight enough to spring at any moment"], zone:"gearworks",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:101, boltMax:129, flavor:"the tension finally releases, all at once, straight at you" } ],
    art: artTensionMole, loot:{name:"a coiled tension spring", desc:"Wound tight. Very tight. You set it down carefully.", type:"junk", sell:17, icon:iconServoJoint},
    rareDrop:{name:"a spring wound tighter than it should hold", desc:"Shouldn't still be coiled this tight. Is, somehow.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"tension-mole's own coiled leggings of the Loon", desc:"Wound tight enough you can feel them humming.", type:"equip", slot:"legs", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a silent-cog mole, the only quiet thing on the whole line", ...MONSTER_STATS["a silent-cog mole, the only quiet thing on the whole line"], zone:"gearworks",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"turns without a sound, same as everything else about it, and mends" } ],
    art: artSilentCogMole, loot:{name:"a soundlessly turning gear", desc:"Should grind against the others. Doesn't make a sound.", type:"junk", sell:16, icon:iconGear},
    rareDrop:{name:"a gear that runs the whole line in total silence", desc:"Not one click, the entire mechanism. Impressive engineering.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"silent-cog mole's own noiseless boots of the Loon", desc:"The only quiet thing anywhere on this line.", type:"equip", slot:"boots", bonus:{hoodoo:9}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
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
   name:"the line foreman, clipboard in one hand and a wrench in the other", ...MONSTER_STATS["the line foreman, clipboard in one hand and a wrench in the other"], rare:true, zone:"gearworks",
   skills:[ { type:'debuff', chance:0.22, debuffType:'burn', debuffTurns:3, dmgPerTurn:7, flavor:"shoves you into a live vent, sparks catching on your sleeve" } ],
   art: artGearworksForeman, loot:null
};
const bureauQuartermaster = {
   name:"the quartermaster, three ledgers behind and somehow ahead of you", ...MONSTER_STATS["the quartermaster, three ledgers behind and somehow ahead of you"], rare:true, zone:"bureau",
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
   name:"the quench-master, apron scorched black from decades at the trough", ...MONSTER_STATS["the quench-master, apron scorched black from decades at the trough"], rare:true, zone:"foundry",
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
   name:"a tunnel captain, dug in and dug in deep", ...MONSTER_STATS["a tunnel captain, dug in and dug in deep"], rare:true, zone:"gearworks",
   art: artTunnelCaptain, loot:null
};
const foundryMarshal = {
   name:"a foundry marshal, still glowing faintly from the last shift", ...MONSTER_STATS["a foundry marshal, still glowing faintly from the last shift"], rare:true, zone:"gearworks",
   skills:[ { type:'debuff', chance:0.24, debuffType:'burn', debuffTurns:3, dmgPerTurn:8, flavor:"brands you with a slag-iron still hot from the forge" } ],
   art: artFoundryMarshal, loot:null
};
const warrenMother = {
   name:"the warren-mother, matriarch of every tunnel you've ever walked through", ...MONSTER_STATS["the warren-mother, matriarch of every tunnel you've ever walked through"], rare:true, zone:"gearworks",
   skills:[
      { type:'buff', chance:0.15, buffMult:1.7, buffTurns:3, flavor:"calls every last tunnel to answer at once" },
      { type:'debuff', chance:0.20, debuffType:'freeze', debuffTurns:3, dmgReduction:0.4, flavor:"the ground itself locks around your legs, cold and absolute" },
      ],
   art: artWarrenMother, loot:null
};

/* Bestiary registry (NAMED_BOSSES, content.js) — this hub's own 6
quest-rare bosses defined above. */
NAMED_BOSSES.push(gearworksForeman, bureauQuartermaster, quenchMaster, tunnelCaptain, foundryMarshal, warrenMother);

/* This hub's own 2 zone-rares (ZONE_RARE_MONSTERS, content.js) — same
derivation as every other zone-rare. Gearworks already has 3
quest-rares (tunnelCaptain 50/foundryMarshal 58/warrenMother 90), so
looseCogIncarnate's own xp stays below the lowest of those. */
const emberForgedWretch = {
   name:"an ember-forged wretch, poured from the same mold as everything else here, wrong anyway", ...MONSTER_STATS["an ember-forged wretch, poured from the same mold as everything else here, wrong anyway"], rare:true, zone:"foundry",
   art: artEmberForgedWretch,
   loot:{name:"a slag casting nobody ordered", desc:"Fits no machine in the Foundry. Fits something, somewhere.", type:"junk", sell:42, icon:iconCapturedLight}
};
const looseCogIncarnate = {
   name:"a loose cog incarnate, somehow load-bearing anyway", ...MONSTER_STATS["a loose cog incarnate, somehow load-bearing anyway"], rare:true, zone:"gearworks",
   art: artLooseCogIncarnate,
   loot:{name:"the one gear that definitely shouldn't fit, but does", desc:"Nobody's dared remove it to check what happens.", type:"junk", sell:40, icon:iconGear}
};
Object.assign(ZONE_RARE_MONSTERS, { foundry: emberForgedWretch, gearworks: looseCogIncarnate });
NAMED_BOSSES.push(emberForgedWretch, looseCogIncarnate);

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
