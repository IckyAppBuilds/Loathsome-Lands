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
