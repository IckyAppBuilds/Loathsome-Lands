/* ---------------- The Crystal City content (Act 2 capstone, quest16) ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md). Deliberately a STUB — one leaf zone, no
sub-districts, no rare hunt/boss of its own yet, per explicit
instruction: this is the first taste of whatever comes after the Mole
Wars, not a fully-built new act. Same "launches bare" precedent as
Mudroot Warren/the Ember Warren before their own first quest added a
named boss. Loads after content.js/icons.js/art.js (whose art*()/
icon*() functions this file references by value at parse time). */
const crystalCityMonsters = [
   { name:"a crystal sentinel, refracting every strike before it lands", beef:8, zip:0, grit:26, hoodoo:0, xp:44, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:114, boltMax:147, flavor:"refracts the last hit it took and fires it straight back" } ],
    art: artCrystalSentinel, loot:{name:"a shard of prismatic crystal", desc:"Splits the torchlight into every color at once.", type:"junk", sell:19, icon:iconCapturedLight},
    rareDrop:{name:"a refracted echo of the blow that should have landed", desc:"You're choosing not to think about that too hard, again.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"sentinel's refracting carapace-plate of the Badger", desc:"Bends light around the wearer. Bends blows around them too, mostly.", type:"equip", slot:"chest", bonus:{beef:10}, classRequired:'Meathead', tier:'common', icon:iconClockworkPlate} },
   { name:"a geode crawler, seams cracking with inner light", beef:8, zip:0, grit:25, hoodoo:0, xp:42, zone:"crystalcity",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:40, healMax:74, flavor:"seams glow brighter as the crack knits shut" } ],
    art: artGeodeCrawler, loot:{name:"a chunk of raw geode, still warm", desc:"Warm from something that isn't friction.", type:"junk", sell:18, icon:iconVeinGemstone},
    rareDrop:{name:"a geode that never stops glowing", desc:"You've stopped asking what's feeding it.", type:"luck", hpValue:30, mpValue:15, icon:iconClover},
    gearDrop:{name:"crawler's cracked-seam greaves of the Weasel", desc:"Light leaks out of every joint. Somehow doesn't slow you down.", type:"equip", slot:"legs", bonus:{zip:10}, classRequired:'Card Shark', tier:'common', icon:iconShinGuard} },
   { name:"an echo wraith, bent from light that took a wrong turn", beef:9, zip:0, grit:27, hoodoo:0, xp:46, zone:"crystalcity",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"bends slightly out of sync with itself, and hits twice as hard for it" } ],
    art: artEchoWraith, loot:{name:"a sliver of bent light, somehow still cold", desc:"Doesn't warm up no matter how long you hold it.", type:"junk", sell:20, icon:iconCapturedLight},
    rareDrop:{name:"an echo that arrived from somewhere that hasn't happened yet", desc:"You've decided not to ask it any questions.", type:"junk", sell:54, icon:iconFigurine},
    gearDrop:{name:"wraith-bent focus rod of the Loon", desc:"Casts the spell, then casts it again, slightly earlier.", type:"equip", slot:"weapon", bonus:{hoodoo:10}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* Per the "every zone/dungeon drops gear for every slot, every
   class" pass: 12 more regulars, same angular Lucent-crystal silhouette
   vocabulary as the 3 above, same class-gated treatment as every
   Gnometropolis-onward zone, same +10 bonus (Crystal City's own rung
   on the ladder). */
   { name:"a lattice golem, its skull a fused cluster of quartz", beef:8, zip:0, grit:26, hoodoo:0, xp:44, zone:"crystalcity",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the quartz lattice along its skull catches the light and locks rigid" } ],
    art: artLatticeGolem, loot:{name:"a fused quartz knuckle", desc:"Looks hand-shaped. Wasn't made by a hand.", type:"junk", sell:19, icon:iconVeinGemstone},
    rareDrop:{name:"a knuckle of quartz that's never once chipped", desc:"Should have cracked by now. Hasn't.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"lattice golem's fused quartz helm of the Badger", desc:"Feels like wearing a geode. Is, more or less.", type:"equip", slot:"head", bonus:{beef:10}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a shard-treader, crunching glass that was never glass", beef:8, zip:0, grit:27, hoodoo:0, xp:46, zone:"crystalcity",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:36, healMax:67, flavor:"grinds a fresh shard into the wound and it knits over, glassy" } ],
    art: artShardTreader, loot:{name:"a shard that crunches like glass but isn't", desc:"You've stopped trying to figure out what it actually is.", type:"junk", sell:20, icon:iconCapturedLight},
    rareDrop:{name:"a shard that's never once crunched underfoot", desc:"Walked on constantly. Never once broken.", type:"junk", sell:54, icon:iconFigurine},
    gearDrop:{name:"shard-treader's crunch-proof greaves of the Badger", desc:"Walked across a floor of broken light in these. Still intact.", type:"equip", slot:"legs", bonus:{beef:10}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a glass-footed wanderer, leaving cuts in the floor", beef:8, zip:0, grit:25, hoodoo:0, xp:43, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:115, boltMax:148, flavor:"a glass-sharp footstep comes down squarely on the mark" } ],
    art: artGlassFootedWanderer, loot:{name:"a sliver cut from the floor itself", desc:"The floor's missing a piece now. This is it.", type:"junk", sell:19, icon:iconCapturedLight},
    rareDrop:{name:"a sliver that cuts clean through anything it's set against", desc:"You're handling this one very carefully.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"glass-footed wanderer's own cutting boots of the Badger", desc:"Leave a thin cut in the floor with every step.", type:"equip", slot:"boots", bonus:{beef:10}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a prism-fisted brawler, light bending around its knuckles", beef:9, zip:0, grit:26, hoodoo:0, xp:45, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:138, boltMax:171, flavor:"the light bent around its fists finally snaps forward, all at once" } ],
    art: artPrismFistedBrawler, loot:{name:"a knuckle-shaped bend of refracted light", desc:"Held its shape for a solid minute before fading.", type:"junk", sell:20, icon:iconCapturedLight},
    rareDrop:{name:"a bend of light holding a fist's shape indefinitely", desc:"Hasn't faded. Hasn't moved either. Unsettling.", type:"junk", sell:55, icon:iconFigurine},
    gearDrop:{name:"prism-fisted brawler's own bent-light knuckles of the Badger", desc:"Light still bends around them, even off the brawler.", type:"equip", slot:"weapon", bonus:{beef:10}, classRequired:'Meathead', tier:'common', icon:iconVizierScepter} },
   { name:"a facet-dancer, catching every angle of light at once", beef:8, zip:0, grit:25, hoodoo:0, xp:43, zone:"crystalcity",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"catches every angle of light at once and strikes from all of them" } ],
    art: artFacetDancer, loot:{name:"a facet caught mid-spin, somehow", desc:"Keeps turning even set flat on a table.", type:"junk", sell:19, icon:iconVeinGemstone},
    rareDrop:{name:"a facet that's genuinely caught every angle there is", desc:"Nothing left for it to catch. It still keeps trying.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"facet-dancer's own many-angled cap of the Weasel", desc:"Catches the light from every direction, same as the dancer did.", type:"equip", slot:"head", bonus:{zip:10}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a refracted duelist, striking from an angle that isn't there", beef:9, zip:0, grit:26, hoodoo:0, xp:45, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:139, boltMax:172, flavor:"strikes from an angle that technically isn't there, and it still lands" } ],
    art: artRefractedDuelist, loot:{name:"a strike that landed from an angle that isn't there", desc:"You felt it. You still can't explain where it came from.", type:"junk", sell:20, icon:iconCapturedLight},
    rareDrop:{name:"an angle of attack that genuinely shouldn't exist", desc:"Geometrically impossible. Happened anyway.", type:"junk", sell:55, icon:iconFigurine},
    gearDrop:{name:"refracted duelist's own bent-angle vest of the Weasel", desc:"Seams run at angles that shouldn't line up. Somehow they do.", type:"equip", slot:"chest", bonus:{zip:10}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a glint-step wraith, never landing where the light says it will", beef:8, zip:0, grit:24, hoodoo:0, xp:42, zone:"crystalcity",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:35, healMax:65, flavor:"steps out of where the light says it should be, and mends mid-step" } ],
    art: artGlintStepWraith, loot:{name:"a glint that stepped somewhere the light didn't predict", desc:"You tracked where it should be. It wasn't there.", type:"junk", sell:18, icon:iconCapturedLight},
    rareDrop:{name:"a glint that's never once landed where expected", desc:"Still hasn't. You've given up predicting it.", type:"junk", sell:51, icon:iconFigurine},
    gearDrop:{name:"glint-step wraith's own untrackable boots of the Weasel", desc:"Never quite land where the light says they should.", type:"equip", slot:"boots", bonus:{zip:10}, classRequired:'Card Shark', tier:'common', icon:iconSpringBoots} },
   { name:"a splinter-blade wisp, each cut arriving slightly early", beef:8, zip:0, grit:25, hoodoo:0, xp:43, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:116, boltMax:149, flavor:"the cut arrives slightly before the swing does, and lands anyway" } ],
    art: artSplinterBladeWisp, loot:{name:"a splinter that cut you before it moved", desc:"The timing on this one doesn't add up. You've stopped asking.", type:"junk", sell:19, icon:iconCapturedLight},
    rareDrop:{name:"a splinter whose cut arrives before the swing, every time", desc:"The Lucent apparently built blades that argue with causality.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"splinter-blade wisp's own early-cut sliver of the Weasel", desc:"Cuts arrive slightly before the swing. Every single time.", type:"equip", slot:"weapon", bonus:{zip:10}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a lucent oracle, reading fractures nobody else can see", beef:8, zip:0, grit:24, hoodoo:0, xp:42, zone:"crystalcity",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:37, healMax:68, flavor:"reads the fracture in its own hide and seals it before it spreads" } ],
    art: artLucentOracle, loot:{name:"a fracture map only the oracle could read", desc:"Means nothing to you. Meant everything to it.", type:"junk", sell:18, icon:iconVeinGemstone},
    rareDrop:{name:"a fracture map that predicts its own next crack", desc:"Updates itself. You're not sure how.", type:"junk", sell:51, icon:iconFigurine},
    gearDrop:{name:"lucent oracle's own fracture-reading circlet of the Loon", desc:"Shows you the cracks before they happen. Mostly yours.", type:"equip", slot:"head", bonus:{hoodoo:10}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"a glow-warded remnant, sealed in light that never dims", beef:8, zip:0, grit:25, hoodoo:0, xp:43, zone:"crystalcity",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the seal of undimming light around it flares brighter, and holds" } ],
    art: artGlowWardedRemnant, loot:{name:"a seal of light that's never once dimmed", desc:"Been burning the same brightness since before anyone can remember.", type:"junk", sell:19, icon:iconMendCharm},
    rareDrop:{name:"a seal of light burning exactly as bright as it ever has", desc:"Not one flicker, the whole time you've watched it.", type:"junk", sell:52, icon:iconFigurine},
    gearDrop:{name:"glow-warded remnant's own undimming vestment of the Loon", desc:"Sealed in light that's never once gone out.", type:"equip", slot:"chest", bonus:{hoodoo:10}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a bent-light stalker, walking a path that doubles back on itself", beef:9, zip:0, grit:26, hoodoo:0, xp:45, zone:"crystalcity",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:140, boltMax:173, flavor:"the path doubles back on itself and the strike arrives from behind" } ],
    art: artBentLightStalker, loot:{name:"a path of light that loops back on itself", desc:"Traced it with your finger. Ended up where you started.", type:"junk", sell:20, icon:iconCapturedLight},
    rareDrop:{name:"a loop of light with genuinely no beginning or end", desc:"You've stopped trying to find the seam.", type:"junk", sell:55, icon:iconFigurine},
    gearDrop:{name:"bent-light stalker's own looping leggings of the Loon", desc:"Trace a path that somehow always leads back to where you started.", type:"equip", slot:"legs", bonus:{hoodoo:10}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a silent facet, the quietest thing the Lucent ever built", beef:8, zip:0, grit:24, hoodoo:0, xp:42, zone:"crystalcity",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:35, healMax:64, flavor:"mends itself without a single sound, same as everything else about it" } ],
    art: artSilentFacet, loot:{name:"a facet that's never once made a sound", desc:"Not a chime, not a crack. Total silence.", type:"junk", sell:18, icon:iconVeinGemstone},
    rareDrop:{name:"a facet that absorbs sound instead of light", desc:"The quietest thing you've ever held, and you've held some quiet things.", type:"junk", sell:51, icon:iconFigurine},
    gearDrop:{name:"silent facet's own noiseless slippers of the Loon", desc:"The quietest thing the Lucent ever built. Still true, on your feet.", type:"equip", slot:"boots", bonus:{hoodoo:10}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   ];

monsters.push(...crystalCityMonsters);
BOUNTY_TEMPLATES.push(...crystalCityMonsters.map(makeBountyTemplate));

/* This zone's own single zone-rare (ZONE_RARE_MONSTERS, content.js) —
same ~20%-above-regular-trash-ceiling derivation as every other
zone-rare. Crystal City has no quest-rare/boss of its own yet (still a
stub zone), so no xp cap is needed here. */
const driftingFacet = {
   name:"a drifting facet, light bending the wrong way just to reach it", beef:11, zip:0, grit:32, hoodoo:0, xp:65, rare:true, zone:"crystalcity",
   art: artDriftingFacet,
   loot:{name:"a facet that keeps catching light that isn't there", desc:"Glints on cue, every time, for no visible reason.", type:"junk", sell:46, icon:iconVeinGemstone}
};
Object.assign(ZONE_RARE_MONSTERS, { crystalcity: driftingFacet });
NAMED_BOSSES.push(driftingFacet);

Object.assign(noncombatEvents, {
   crystalcity: [
      "Light moves through the walls here like it's still deciding where to land.",
      "Something ahead catches the torchlight and throws back a color that doesn't have a name yet.",
      "The floor hums, faintly, in a key you can't place.",
      "You catch your own reflection a half-step behind where you actually are.",
      "A shard underfoot chimes, once, and the whole passage seems to listen for the echo.",
      "Whatever built this place clearly wasn't building it for anyone your size."
      ]
});
Object.assign(hazardEvents, {
   crystalcity: [
      { text:"A shard of light lands somewhere it definitely shouldn't be able to, and it's your foot.", dmg:[5,9] },
      { text:"The floor refracts a step that wasn't yours, and you trip over it anyway.", dmg:[4,9] },
      { text:"Something bright clips you from an angle the light shouldn't bend at.", dmg:[5,9] },
      ]
});
