/* ---------------- Mudroot Warren content (Act 2 Part 2) ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md) — rather than growing content.js (already 1200+
lines) or duplicating its monsters[] array's own shape. Loads after
content.js (so PALACE_GATE_GEAR-style patterns would be available if
ever needed) and after icons.js/mudroot-art.js (whose functions this
file references by value at parse time, same load-order reason
content.js itself loads after icons.js/art.js).

Root Cellar's 3 regulars + Mudflats' 3 regulars follow the exact same
loot/rareDrop/gearDrop shape as every monster in content.js's own
monsters[] (see the comment above that array) — reusing existing icons
throughout rather than adding new ones, same "specific to what you
killed" reasoning, just via icons that already exist and fit
(iconFigurine/iconClover for every rareDrop is the established
convention; gearDrop/loot icons below reuse whichever existing icon
best matches the item's own flavor — nothing here is unique enough to
need a brand-new SVG). gearDrop bonus values continue content.js's own
per-zone ladder (see the comment above its monsters[] array) one step
past Gnometropolis's own districts (+5): Root Cellar and the Bureau
are parallel, same-tier districts, so both sit at +6; Mudflats is
fought AFTER Root Cellar within this same hub (tunnelWardenHunt gates
it, combat.js), so it gets one more step, +7. */
const mudrootMonsters = [
   { name:"a blind tunnel-mole, all claws", ...MONSTER_STATS["a blind tunnel-mole, all claws"], zone:"rootcellar",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:56, flavor:"rakes with every claw at once, aiming by sound alone" } ],
    art: artTunnelMole, loot:{name:"fistful of freshly-turned root-dirt", desc:"Rich, dark, and recently disturbed.", type:"junk", sell:10, icon:iconSoil},
    rareDrop:{name:"the mole's own lucky digging claw", desc:"Worn smooth from decades of tunneling toward something.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"claw-notched digging spike of the Badger", desc:"Balanced for digging. Repurposed for hitting things.", type:"equip", slot:"weapon", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconRakeShank} },
   { name:"a root-gnawing grub, fat and glistening", ...MONSTER_STATS["a root-gnawing grub, fat and glistening"], zone:"rootcellar",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:13, healMax:25, flavor:"gnaws open a fresh root and sucks the sap down" } ],
    art: artRootGrub, loot:{name:"glistening chewed root-fiber", desc:"Still faintly warm. You don't ask why.", type:"junk", sell:9, icon:iconOreGrit},
    rareDrop:{name:"grub's own hoarded good-luck pebble", desc:"Grubs, it turns out, believe in luck too.", type:"luck", hpValue:21, mpValue:11, icon:iconClover},
    gearDrop:{name:"grub-slick carapace plating of the Weasel", desc:"Slick, load-bearing, and faintly unpleasant to touch.", type:"equip", slot:"chest", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a mole-sapper, packing a satchel of loose dirt", ...MONSTER_STATS["a mole-sapper, packing a satchel of loose dirt"], zone:"rootcellar",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"packs the satchel tighter and braces for the blast" } ],
    art: artMoleSapper, loot:{name:"satchel of finely sifted collapse-dirt", desc:"Packed for exactly one purpose: bringing down a ceiling.", type:"junk", sell:11, icon:iconPipeFitting},
    rareDrop:{name:"the sapper's unused good-luck charm", desc:"Never needed it, evidently. You do now.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"sapper's dirt-packed leg wraps of the Loon", desc:"Built for a fast retreat after the ceiling comes down.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconShinGuard} },
   { name:"a mudflat leech, bloated and patient", ...MONSTER_STATS["a mudflat leech, bloated and patient"], zone:"mudflats",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:66, boltMax:85, flavor:"lashes out with its whole bloated length" } ],
    art: artMudflatLeech, loot:{name:"bloated, still-twitching leech segment", desc:"You cut it off. It's still moving.", type:"junk", sell:12, icon:iconRatTail},
    rareDrop:{name:"leech's hoarded silt-pearl", desc:"Patient enough to swallow one, apparently.", type:"luck", hpValue:23, mpValue:12, icon:iconClover},
    gearDrop:{name:"leech-slick wading boots of the Badger", desc:"Somehow keeps the mud out. Somehow.", type:"equip", slot:"boots", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a mole scout, painted in warpaint mud", ...MONSTER_STATS["a mole scout, painted in warpaint mud"], zone:"mudflats",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:21, healMax:40, flavor:"smears on fresh warpaint mud, somehow restorative" } ],
    art: artMoleScout, loot:{name:"scout's smeared warpaint mud", desc:"Still wet. Still watching, somehow, from wherever it went.", type:"junk", sell:13, icon:iconSurveyMap},
    rareDrop:{name:"scout's own uncanny sense of direction, bottled", desc:"It never once got lost down here. Neither will you, for a while.", type:"luck", hpValue:23, mpValue:12, icon:iconClover},
    gearDrop:{name:"scout's mud-caked warpaint wand of the Weasel", desc:"Doubles as a weapon. Mostly a paintbrush, though.", type:"equip", slot:"weapon", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconWandStick} },
   { name:"a burrow-hound, all teeth and no eyes", ...MONSTER_STATS["a burrow-hound, all teeth and no eyes"], zone:"mudflats",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"snaps its jaws and surges forward, teeth first" } ],
    art: artBurrowHound, loot:{name:"burrow-hound's cast-off tooth", desc:"Doesn't need eyes when it's got teeth like this.", type:"junk", sell:14, icon:iconBurrowShell},
    rareDrop:{name:"the hound's own keen, sightless instinct", desc:"You start noticing things a beat before they happen.", type:"junk", sell:40, icon:iconFigurine},
    gearDrop:{name:"hound-tooth skullguard of the Loon", desc:"Bite marks included, free of charge.", type:"equip", slot:"head", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconGuardHelm} },
   /* The Bureau's business moles — a third, parallel district (same
   ZONE_DIFFICULTY tier as Root Cellar, not part of the tunnelWarden/
   warrenScout sequence), run entirely on paperwork instead of claws. */
   { name:"a mole clerk, drowning in triplicate paperwork", ...MONSTER_STATS["a mole clerk, drowning in triplicate paperwork"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:56, flavor:"hurls an entire stack of triplicate forms" } ],
    art: artMoleClerk, loot:{name:"hopelessly tangled reel of red tape", desc:"Somehow still spooling. Nobody knows where it ends.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"a form that approves its own approval", desc:"Bureaucratically flawless. Deeply unsettling.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"paperwork-padded trouser cuffs of the Badger", desc:"Filed correctly, for once, and surprisingly comfortable.", type:"equip", slot:"legs", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a mole auditor, sniffing out every discrepancy", ...MONSTER_STATS["a mole auditor, sniffing out every discrepancy"], zone:"bureau",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:15, healMax:28, flavor:"finds a discrepancy in its own injuries and corrects it" } ],
    art: artMoleAuditor, loot:{name:"auditor's marked-up ledger page", desc:"Every number circled twice, in a different color both times.", type:"junk", sell:11, icon:iconDrillRoster},
    rareDrop:{name:"the auditor's own clean bill of health, forged", desc:"Passed inspection. Somehow. You're not asking how.", type:"luck", hpValue:22, mpValue:11, icon:iconClover},
    gearDrop:{name:"auditor's spectacles-and-helm of the Weasel", desc:"Sees every discrepancy. Stops most head trauma.", type:"equip", slot:"head", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconGuardHelm} },
   { name:"a mole notary, stamping everything twice out of spite", ...MONSTER_STATS["a mole notary, stamping everything twice out of spite"], zone:"bureau",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"stamps itself twice, out of spite, and feels tougher for it" } ],
    art: artMoleNotary, loot:{name:"notary's over-inked rubber stamp", desc:"Stamps everything. Has opinions about all of it.", type:"junk", sell:12, icon:iconCoinPurse},
    rareDrop:{name:"the notary's own personal seal of approval", desc:"Rarely given. Never explained.", type:"luck", hpValue:22, mpValue:11, icon:iconClover},
    gearDrop:{name:"notary's oversized rubber stamp-mace of the Loon", desc:"Notarized. Also a mace.", type:"equip", slot:"weapon", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconRakeShank} },
   /* Per a later explicit request, every zone's gearDrop set needs to
   cover all 5 slots for all 3 classes — 12 more regulars per district
   (Root Cellar/Mudflats/Bureau), same mole-silhouette vocabulary every
   Mudroot Warren monster already uses, same class-gated treatment
   Garrison/Rogues' Den/the Arcane Sanctum established (content.js). */
   { name:"a root-cellar brawler mole, built like a fallen beam", ...MONSTER_STATS["a root-cellar brawler mole, built like a fallen beam"], zone:"rootcellar",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"braces against a support beam and shoves off it, hard" } ],
    art: artRootCellarBrawler, loot:{name:"a splintered support beam chunk", desc:"Load-bearing, until it very much wasn't.", type:"junk", sell:11, icon:iconPipeFitting},
    rareDrop:{name:"a beam fragment that's somehow still load-bearing", desc:"The cellar's still standing. Barely.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"brawler-mole's beam-dented helm of the Badger", desc:"Took a ceiling collapse directly and kept its shape.", type:"equip", slot:"head", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a tunnel-brace mole, propping up a ceiling with its own back", ...MONSTER_STATS["a tunnel-brace mole, propping up a ceiling with its own back"], zone:"rootcellar",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:13, healMax:24, flavor:"shifts the brace onto a stronger shoulder and keeps holding" } ],
    art: artTunnelBraceMole, loot:{name:"a strained wooden brace", desc:"Holding up more than it was built for.", type:"junk", sell:10, icon:iconPipeFitting},
    rareDrop:{name:"a brace that's barely holding anything at all", desc:"Turns out it wasn't load-bearing. You check the ceiling nervously.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"brace-mole's reinforced chest-wrap of the Badger", desc:"Took the weight of a ceiling. Didn't complain.", type:"equip", slot:"chest", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a root-kicker mole, clearing tunnels the hard way", ...MONSTER_STATS["a root-kicker mole, clearing tunnels the hard way"], zone:"rootcellar",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:55, flavor:"kicks through a root wall and keeps the momentum going" } ],
    art: artRootKickerMole, loot:{name:"a splintered root chunk", desc:"Kicked clean through. Impressive, honestly.", type:"junk", sell:11, icon:iconOreGrit},
    rareDrop:{name:"a root chunk that's genuinely load-bearing", desc:"Shouldn't have kicked that one. Too late now.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"root-kicker's splintered greaves of the Badger", desc:"Scuffed from kicking through more roots than doors.", type:"equip", slot:"legs", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a packed-earth mole, walking like the ground owes it something", ...MONSTER_STATS["a packed-earth mole, walking like the ground owes it something"], zone:"rootcellar",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"stamps the packed earth flat and plants itself harder" } ],
    art: artPackedEarthMole, loot:{name:"a stamped-flat clod of earth", desc:"Packed down so hard it's nearly stone.", type:"junk", sell:11, icon:iconOreGrit},
    rareDrop:{name:"a clod of earth packed impossibly dense", desc:"Heavier than it should be, by a lot.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"packed-earth mole's own stamping boots of the Badger", desc:"Soles packed solid from decades of stomping.", type:"equip", slot:"boots", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a quick-claw mole, first through every gap", ...MONSTER_STATS["a quick-claw mole, first through every gap"], zone:"rootcellar",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:54, flavor:"is already through the gap and swinging before you see it move" } ],
    art: artQuickClawMole, loot:{name:"a nicked claw-tip", desc:"Moving too fast to notice the chip.", type:"junk", sell:10, icon:iconBurrowShell},
    rareDrop:{name:"a claw-tip sharpened to something dangerous", desc:"Didn't chip this one. Kept it razor-fine instead.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"quick-claw mole's own low-profile cap of the Weasel", desc:"Scuffed from squeezing through tight gaps at speed.", type:"equip", slot:"head", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a narrow-shaft mole, built for tunnels nothing else fits through", ...MONSTER_STATS["a narrow-shaft mole, built for tunnels nothing else fits through"], zone:"rootcellar",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:12, healMax:23, flavor:"squeezes into a narrow side-shaft and comes back out steadier" } ],
    art: artNarrowShaftMole, loot:{name:"a scrap of shaft-lining bark", desc:"Worn smooth from a very tight squeeze.", type:"junk", sell:9, icon:iconSoil},
    rareDrop:{name:"a shaft-lining scrap from somewhere genuinely deep", desc:"This shaft goes further than any map admits.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"narrow-shaft mole's own tight-fit leggings of the Weasel", desc:"Tailored for tunnels nothing else can clear.", type:"equip", slot:"legs", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconTrousers} },
   { name:"a loose-soil mole, never once losing its footing", ...MONSTER_STATS["a loose-soil mole, never once losing its footing"], zone:"rootcellar",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"finds solid footing in soil that shouldn't have any" } ],
    art: artLooseSoilMole, loot:{name:"a handful of suspiciously loose soil", desc:"Shouldn't be stable. The mole stood on it fine.", type:"junk", sell:11, icon:iconSoil},
    rareDrop:{name:"soil that's somehow completely solid underfoot", desc:"Packed tighter than anything else down here.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"loose-soil mole's own sure-step boots of the Weasel", desc:"Never once slip, no matter how loose the ground.", type:"equip", slot:"boots", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconSpringBoots} },
   { name:"a root-blade mole, honing claws on stone", ...MONSTER_STATS["a root-blade mole, honing claws on stone"], zone:"rootcellar",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:45, boltMax:56, flavor:"the freshly honed claws find their mark clean" } ],
    art: artRootBladeMole, loot:{name:"a stone-honed claw shaving", desc:"Sharpened against bedrock. Effective, apparently.", type:"junk", sell:10, icon:iconPickaxeHead},
    rareDrop:{name:"a claw honed to a genuinely dangerous edge", desc:"You're careful picking this one up.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"root-blade mole's own honed digging-claw of the Weasel", desc:"Sharpened on stone until it holds a real edge.", type:"equip", slot:"weapon", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a deep-listening mole, hearing the cellar breathe", ...MONSTER_STATS["a deep-listening mole, hearing the cellar breathe"], zone:"rootcellar",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:12, healMax:23, flavor:"listens to the cellar's own slow breathing and settles into it" } ],
    art: artDeepListeningMole, loot:{name:"a cellar-stone, still faintly humming", desc:"You can almost hear something in it, if you listen long enough.", type:"junk", sell:9, icon:iconVeinGemstone},
    rareDrop:{name:"a stone that hums something almost like words", desc:"You've stopped trying to make them out. Mostly.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"deep-listening mole's own attuned skullcap of the Loon", desc:"Picks up sounds from rooms that shouldn't be audible.", type:"equip", slot:"head", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconPotLid} },
   { name:"a root-warded mole, lined with half-grown charms", ...MONSTER_STATS["a root-warded mole, lined with half-grown charms"], zone:"rootcellar",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the half-grown wards along its hide finally take root properly" } ],
    art: artRootWardedMole, loot:{name:"a sprouting warding charm", desc:"Still growing. Still working, somehow.", type:"junk", sell:11, icon:iconMendCharm},
    rareDrop:{name:"a warding charm fully grown in", desc:"Whatever it's warding off, it's working now.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"root-warded mole's own sprouting vest of the Loon", desc:"Lined with charms that are still, slowly, taking root.", type:"equip", slot:"chest", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a silent-digger mole, tunneling without a sound", ...MONSTER_STATS["a silent-digger mole, tunneling without a sound"], zone:"rootcellar",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:12, healMax:22, flavor:"digs itself quietly back together, no sound at all" } ],
    art: artSilentDiggerMole, loot:{name:"a suspiciously quiet pile of dirt", desc:"Should've made noise falling. Didn't.", type:"junk", sell:9, icon:iconSoil},
    rareDrop:{name:"a dirt pile that fell completely without sound", desc:"You didn't hear a thing. Still unnerving.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"silent-digger mole's own noiseless boots of the Loon", desc:"Dig, walk, run — not a sound, any of it.", type:"equip", slot:"boots", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a cellar-conjuror mole, channeling something through the dirt", ...MONSTER_STATS["a cellar-conjuror mole, channeling something through the dirt"], zone:"rootcellar",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:55, flavor:"channels something straight up through the packed dirt floor" } ],
    art: artCellarConjurorMole, loot:{name:"a dirt-caked conjuring focus", desc:"Works better buried than held, somehow.", type:"junk", sell:10, icon:iconVeinGemstone},
    rareDrop:{name:"a conjuring focus that channels something real", desc:"You felt the floor move. You're not standing on it anymore.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"cellar-conjuror's own earth-channeling rod of the Loon", desc:"Still vibrating faintly, even sheathed.", type:"equip", slot:"weapon", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* 12 more Mudflats regulars. */
   { name:"a mudflat brawler mole, caked shoulder to snout", ...MONSTER_STATS["a mudflat brawler mole, caked shoulder to snout"], zone:"mudflats",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the mud caking its shoulders hardens mid-fight, somehow" } ],
    art: artMudflatBrawler, loot:{name:"a thick clump of hardened mud", desc:"Baked nearly solid by something that isn't the sun.", type:"junk", sell:13, icon:iconOreGrit},
    rareDrop:{name:"a mud clump hard enough to be armor", desc:"Could probably wear this. The mole basically does.", type:"junk", sell:39, icon:iconFigurine},
    gearDrop:{name:"mudflat brawler's caked headwrap of the Badger", desc:"Hardened mud, shaped roughly like a helmet by now.", type:"equip", slot:"head", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a silt-packed mole, heavier than it looks", ...MONSTER_STATS["a silt-packed mole, heavier than it looks"], zone:"mudflats",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:16, healMax:30, flavor:"packs on another layer of silt and feels sturdier for it" } ],
    art: artSiltPackedMole, loot:{name:"a dense clod of packed silt", desc:"Heavier than something this size has any right to be.", type:"junk", sell:12, icon:iconOreGrit},
    rareDrop:{name:"a silt clod that's shockingly, impossibly dense", desc:"Weighs about as much as the mole itself.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"silt-packed mole's own weighted vest of the Badger", desc:"Heavier than it looks. Noticeably so.", type:"equip", slot:"chest", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconVest} },
   { name:"a bog-strider mole, somehow never sinking", ...MONSTER_STATS["a bog-strider mole, somehow never sinking"], zone:"mudflats",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:66, boltMax:82, flavor:"strides straight across the bog surface and swings on the way" } ],
    art: artBogStriderMole, loot:{name:"a bog-slick footprint, somehow dry", desc:"Shouldn't be possible. Is, anyway.", type:"junk", sell:13, icon:iconOreGrit},
    rareDrop:{name:"a footprint that proves it never once sank", desc:"Perfectly dry, right in the middle of the deepest bog.", type:"junk", sell:39, icon:iconFigurine},
    gearDrop:{name:"bog-strider's own dry-step greaves of the Badger", desc:"Stay bone dry no matter how deep the bog gets.", type:"equip", slot:"legs", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a tide-club mole, swinging something waterlogged and heavy", ...MONSTER_STATS["a tide-club mole, swinging something waterlogged and heavy"], zone:"mudflats",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:67, boltMax:84, flavor:"the waterlogged club comes down heavier than it looks" } ],
    art: artTideClubMole, loot:{name:"a waterlogged club fragment", desc:"Heavier wet than it ever was dry.", type:"junk", sell:13, icon:iconPipeFitting},
    rareDrop:{name:"a club that's somehow bone dry and still heavy", desc:"Doesn't make sense. Hits hard anyway.", type:"junk", sell:40, icon:iconFigurine},
    gearDrop:{name:"tide-club mole's own waterlogged mace of the Badger", desc:"Never dries out. Hits harder for it.", type:"equip", slot:"weapon", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconCatapultPeg} },
   { name:"a reed-masked mole, blending into the tall grass", ...MONSTER_STATS["a reed-masked mole, blending into the tall grass"], zone:"mudflats",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"was already in the reeds, waiting, and you never saw it" } ],
    art: artReedMaskedMole, loot:{name:"a woven reed mask fragment", desc:"Disturbingly effective camouflage, for reeds.", type:"junk", sell:12, icon:iconLure},
    rareDrop:{name:"a reed mask you genuinely couldn't spot", desc:"Didn't see this one coming at all.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"reed-masked mole's own woven cap of the Weasel", desc:"Blends into tall grass disturbingly well.", type:"equip", slot:"head", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a silt-slick mole, impossible to get a grip on", ...MONSTER_STATS["a silt-slick mole, impossible to get a grip on"], zone:"mudflats",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:16, healMax:30, flavor:"slips free of its own wound, coated in silt, and reseals it" } ],
    art: artSiltSlickMole, loot:{name:"a slick smear of silt", desc:"Impossible to hold onto. Fitting.", type:"junk", sell:12, icon:iconOreGrit},
    rareDrop:{name:"a smear of silt that's oddly, perfectly textured", desc:"Shouldn't matter. Somehow does.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"silt-slick mole's own slippery vest of the Weasel", desc:"Nearly impossible to grab hold of.", type:"equip", slot:"chest", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a tide-runner mole, racing the water in", ...MONSTER_STATS["a tide-runner mole, racing the water in"], zone:"mudflats",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:66, boltMax:83, flavor:"races the incoming tide and swings the moment it catches up" } ],
    art: artTideRunnerMole, loot:{name:"a tide-smoothed pebble", desc:"Worn round by water that's always moving.", type:"junk", sell:13, icon:iconOreGrit},
    rareDrop:{name:"a pebble worn by a tide that's never once been late", desc:"Perfectly timed, every single time.", type:"junk", sell:39, icon:iconFigurine},
    gearDrop:{name:"tide-runner's own quickstep leggings of the Weasel", desc:"Scuffed from racing tides that always catch up eventually.", type:"equip", slot:"legs", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a mudskipper mole, light across the wet ground", ...MONSTER_STATS["a mudskipper mole, light across the wet ground"], zone:"mudflats",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"skips once across the wet flat and comes down twice as fast" } ],
    art: artMudskipperMole, loot:{name:"a skipped mud-ripple pattern", desc:"Shaped by something moving faster than it should.", type:"junk", sell:12, icon:iconOreGrit},
    rareDrop:{name:"a ripple pattern from something genuinely quick", desc:"Barely touched the ground at all, by the look of it.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"mudskipper's own light-step boots of the Weasel", desc:"Barely dent the mud, even at a full sprint.", type:"equip", slot:"boots", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconMismatchedBoots} },
   { name:"a bog-warded mole, humming with something old and damp", ...MONSTER_STATS["a bog-warded mole, humming with something old and damp"], zone:"mudflats",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:16, healMax:29, flavor:"the old damp ward along its spine flares and knits the wound" } ],
    art: artBogWardedMole, loot:{name:"a damp, humming warding stone", desc:"Old. Wet. Still working, somehow.", type:"junk", sell:12, icon:iconCapturedLight},
    rareDrop:{name:"a warding stone that's dried out and still works", desc:"Shouldn't still work dry. Does anyway.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"bog-warded mole's own damp vestment of the Loon", desc:"Never fully dries. Never stops humming either.", type:"equip", slot:"chest", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a reed-charm mole, tangled in half-grown wards", ...MONSTER_STATS["a reed-charm mole, tangled in half-grown wards"], zone:"mudflats",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the tangled reed-charms finally knot into something useful" } ],
    art: artReedCharmMole, loot:{name:"a tangled reed charm", desc:"Half-grown, half-woven. Working anyway.", type:"junk", sell:12, icon:iconMendCharm},
    rareDrop:{name:"a reed charm that's fully, properly grown in", desc:"No tangles this time. Clean work.", type:"junk", sell:38, icon:iconFigurine},
    gearDrop:{name:"reed-charm mole's own tangled leggings of the Loon", desc:"Woven through with half-grown warding reeds.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a silt-step mole, leaving no print in the mud", ...MONSTER_STATS["a silt-step mole, leaving no print in the mud"], zone:"mudflats",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:15, healMax:28, flavor:"settles into the silt and the wound closes right along with it" } ],
    art: artSiltStepMole, loot:{name:"undisturbed mudflat silt", desc:"Should have a print. Doesn't.", type:"junk", sell:11, icon:iconOreGrit},
    rareDrop:{name:"silt that remembers a perfect trail, just once", desc:"Shows exactly where it went. Rare, for this place.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"silt-step mole's own silent boots of the Loon", desc:"Leave the mudflat exactly as they found it.", type:"equip", slot:"boots", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a tide-conjuror mole, pulling something up from the silt", ...MONSTER_STATS["a tide-conjuror mole, pulling something up from the silt"], zone:"mudflats",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:66, boltMax:83, flavor:"pulls something straight up out of the silt and hurls it" } ],
    art: artTideConjurorMole, loot:{name:"a silt-coated conjuring stone", desc:"Pulled up from somewhere deep and damp.", type:"junk", sell:13, icon:iconVeinGemstone},
    rareDrop:{name:"a conjuring stone that's pulling up something real", desc:"You felt that from the silt itself. Unsettling.", type:"junk", sell:39, icon:iconFigurine},
    gearDrop:{name:"tide-conjuror's own silt-pulled rod of the Loon", desc:"Still dripping, even sheathed, even on dry ground.", type:"equip", slot:"weapon", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* 12 more Bureau regulars. */
   { name:"a mole enforcer, built to collect on overdue paperwork", ...MONSTER_STATS["a mole enforcer, built to collect on overdue paperwork"], zone:"bureau",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"reads the overdue notice aloud, one more time, louder" } ],
    art: artMoleEnforcer, loot:{name:"a stamped overdue notice", desc:"Three months late. The enforcer remembers exactly which three.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"an overdue notice that's finally, actually settled", desc:"Paid in full. The enforcer looks almost disappointed.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"enforcer-mole's own repossessed helm of the Badger", desc:"Collected from somebody who really should've paid on time.", type:"equip", slot:"head", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a mole bailiff, repossessing things nobody agreed to give up", ...MONSTER_STATS["a mole bailiff, repossessing things nobody agreed to give up"], zone:"bureau",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:13, healMax:25, flavor:"repossesses its own injury, files it closed, and moves on" } ],
    art: artMoleBailiff, loot:{name:"a repossession receipt, triplicate", desc:"Signed, stamped, and almost certainly contested later.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a repossession nobody's bothering to contest", desc:"Airtight paperwork, for once.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"bailiff-mole's own repossessed chest-wrap of the Badger", desc:"Taken from someone who definitely should've read the fine print.", type:"equip", slot:"chest", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a mole collections-runner, always one step ahead of the deadline", ...MONSTER_STATS["a mole collections-runner, always one step ahead of the deadline"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:55, flavor:"beats the deadline by half a second and swings on the way past" } ],
    art: artMoleCollectionsRunner, loot:{name:"a deadline notice, just barely met", desc:"Filed with seconds to spare. Every single time.", type:"junk", sell:10, icon:iconDrillRoster},
    rareDrop:{name:"a deadline met with time to actually spare", desc:"First time ever. The runner seems personally offended.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"collections-runner's own deadline boots of the Badger", desc:"Scuffed from sprinting the same route, every single day.", type:"equip", slot:"boots", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a mole repo-agent, swinging a stamped eviction notice like a club", ...MONSTER_STATS["a mole repo-agent, swinging a stamped eviction notice like a club"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:45, boltMax:56, flavor:"the eviction notice turns out to double as a decent club" } ],
    art: artMoleRepoAgent, loot:{name:"a folded eviction notice", desc:"Final notice. Several final notices, actually.", type:"junk", sell:11, icon:iconVizierLedger},
    rareDrop:{name:"an eviction notice that's somehow, genuinely fair", desc:"Reads almost reasonable. Suspicious.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"repo-agent's own folded-notice club of the Badger", desc:"Surprisingly solid, for several sheets of paper.", type:"equip", slot:"weapon", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconCatapultPeg} },
   { name:"a mole filing-clerk, padded with carbon copies", ...MONSTER_STATS["a mole filing-clerk, padded with carbon copies"], zone:"bureau",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:13, healMax:24, flavor:"files a copy of its own injury away and feels better about it" } ],
    art: artMoleFilingClerk, loot:{name:"a loose carbon copy sheet", desc:"Smudged. Identical to six others somewhere in this building.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a carbon copy with something genuinely important on it", desc:"Worth filing somewhere safer than this.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"filing-clerk's own padded vest of the Weasel", desc:"Lined with carbon copies nobody will ever read.", type:"equip", slot:"chest", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a mole courier, sprinting forms between departments", ...MONSTER_STATS["a mole courier, sprinting forms between departments"], zone:"bureau",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"sprints a form across the room and somehow arrives already swinging" } ],
    art: artMoleCourier, loot:{name:"a wrinkled interdepartmental form", desc:"Running late. Running fast to fix that.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"a form that actually arrives on time", desc:"The courier looks shocked. You're a little shocked too.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"mole courier's own sprinting leggings of the Weasel", desc:"Worn smooth from running the same halls, daily.", type:"equip", slot:"legs", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconTrousers} },
   { name:"a mole shortcut-taker, knows every hallway that isn't on the map", ...MONSTER_STATS["a mole shortcut-taker, knows every hallway that isn't on the map"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:55, flavor:"cuts through a hallway that isn't on any map and arrives swinging" } ],
    art: artMoleShortcutTaker, loot:{name:"a map with a hallway crossed out", desc:"Crossed out because it shouldn't exist. It does.", type:"junk", sell:10, icon:iconSurveyMap},
    rareDrop:{name:"a map of a hallway that genuinely leads somewhere", desc:"Finally, a shortcut worth remembering.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"shortcut-taker's own quick-step boots of the Weasel", desc:"Know every hallway that isn't on any official map.", type:"equip", slot:"boots", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconSpringBoots} },
   { name:"a mole letter-opener specialist, surprisingly dangerous with it", ...MONSTER_STATS["a mole letter-opener specialist, surprisingly dangerous with it"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:45, boltMax:56, flavor:"the letter-opener turns out to be alarmingly well-maintained" } ],
    art: artMoleLetterOpener, loot:{name:"a well-maintained letter-opener", desc:"Sharper than office supplies have any right to be.", type:"junk", sell:11, icon:iconRakeShank},
    rareDrop:{name:"a letter-opener with a genuinely dangerous edge", desc:"This one's seen more than letters, clearly.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"letter-opener specialist's own blade of the Weasel", desc:"Still technically office supplies. Technically.", type:"equip", slot:"weapon", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a mole records-keeper, filed under a name nobody can read", ...MONSTER_STATS["a mole records-keeper, filed under a name nobody can read"], zone:"bureau",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:12, healMax:23, flavor:"consults its own file, finds a note it left itself, and heals up" } ],
    art: artMoleRecordsKeeper, loot:{name:"a file folder, illegibly labeled", desc:"Filed under something. You genuinely cannot read it.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a file that's actually, legibly labeled", desc:"First readable label in this whole archive.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"records-keeper's own illegible circlet of the Loon", desc:"The label on the inside band hasn't been read in years.", type:"equip", slot:"head", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"a mole compliance officer, humming with quiet disapproval", ...MONSTER_STATS["a mole compliance officer, humming with quiet disapproval"], zone:"bureau",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"hums its disapproval louder, somehow drawing strength from it" } ],
    art: artMoleComplianceOfficer, loot:{name:"a quietly disapproving memo", desc:"Doesn't say much. Says it very pointedly.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"a memo of genuine, rare approval", desc:"The compliance officer actually liked something, for once.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"compliance officer's own humming vestment of the Loon", desc:"Disapproves audibly, even at rest.", type:"equip", slot:"chest", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a mole appeals-processor, denying requests before they're made", ...MONSTER_STATS["a mole appeals-processor, denying requests before they're made"], zone:"bureau",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:44, boltMax:55, flavor:"denies the appeal you haven't filed yet and swings anyway" } ],
    art: artMoleAppealsProcessor, loot:{name:"a pre-denied appeal form", desc:"Denied before it was even submitted. Efficient, at least.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"an appeal that's actually, surprisingly approved", desc:"First approval on record. Frame it.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"appeals-processor's own denial-stamped leggings of the Loon", desc:"Stamped \"DENIED\" so many times it's basically decorative now.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a mole night-auditor, the only one still at the desk at this hour", ...MONSTER_STATS["a mole night-auditor, the only one still at the desk at this hour"], zone:"bureau",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:12, healMax:23, flavor:"pulls an all-nighter on its own wound and somehow finishes the job" } ],
    art: artMoleNightAuditor, loot:{name:"a coffee-stained night ledger", desc:"Numbers get worse to read as the hours go on.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a night ledger that's perfectly, suspiciously balanced", desc:"Every number checks out. At 3am. Unsettling.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"night-auditor's own bleary-eyed boots of the Loon", desc:"Still at the desk long after everyone else has gone home.", type:"equip", slot:"boots", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   ];

/* Quest 9's two rare hunt targets — same mechanic as gnomeCommander/
diggerBot/gnomeKingsCaptain (content.js): spawn only while quest9 is
active and their own defeated flag isn't set yet, no rareDrop/loot of
their own since they're already a dedicated quest reward (see
tunnelWardenHunt/warrenScoutHunt in goAdventuring(), combat.js, and the
winCombat() branches setting tunnelWardenDefeated/warrenScoutDefeated).
tunnelWarden is fought first (Root Cellar) and gates Mudflats' own
reveal; warrenScout is fought second (Mudflats) and gates the quest's
own report step. Tuned as a step up from arcaneSanctumGuardian/
roguesDenEnforcer/garrisonGuardian (hp:65/atk:7-11/xp:45) matching this
area's own ZONE_DIFFICULTY step up. */
const TUNNEL_WARDEN_SPAWN_CHANCE = 0.05;
const WARREN_SCOUT_SPAWN_CHANCE = 0.05;
const tunnelWarden = {
   name:"the tunnel warden, wide as the passage itself", ...MONSTER_STATS["the tunnel warden, wide as the passage itself"], rare:true, zone:"rootcellar",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"plants itself like the tunnel grew it there" } ],
   art: artTunnelWarden, loot:null
};
const warrenScout = {
   name:"the warren scout, already circling", ...MONSTER_STATS["the warren scout, already circling"], rare:true, zone:"mudflats",
   art: artWarrenScout, loot:null
};

/* Bestiary registry (NAMED_BOSSES, content.js) — this hub's own 2
quest-rare bosses defined above. */
NAMED_BOSSES.push(tunnelWarden, warrenScout);

/* This hub's own 3 zone-rares (ZONE_RARE_MONSTERS, content.js) — same
"~20% above the zone's own regular trash ceiling, capped below
whatever quest-rare already guards that zone" derivation content.js's
own Act 1 zone-rares use. Always-available/repeatable, unlike
tunnelWarden/warrenScout above. */
const rootWarden = {
   name:"a root-warden, grown into the tunnel wall over seasons nobody tracked", ...MONSTER_STATS["a root-warden, grown into the tunnel wall over seasons nobody tracked"], rare:true, zone:"rootcellar",
   art: artRootWarden,
   loot:{name:"a bark-like root-warden scale, still faintly warm", desc:"Peeled off something that was holding very still.", type:"junk", sell:30, icon:iconBurrowShell}
};
const unregisteredAuditor = {
   name:"the unregistered auditor, carrying a badge for a department that doesn't exist", ...MONSTER_STATS["the unregistered auditor, carrying a badge for a department that doesn't exist"], rare:true, zone:"bureau",
   art: artUnregisteredAuditor,
   loot:{name:"a badge for a department you've never heard of", desc:"Laminated. Official-looking. Means nothing, probably.", type:"junk", sell:30, icon:iconVizierLedger}
};
const siltWalker = {
   name:"a silt-walker, three steps ahead and never once visibly moving", ...MONSTER_STATS["a silt-walker, three steps ahead and never once visibly moving"], rare:true, zone:"mudflats",
   art: artSiltWalker,
   loot:{name:"a silt-walker's own footprint, perfectly cast in dried clay", desc:"Already hardened by the time you noticed it.", type:"junk", sell:35, icon:iconSurveyMap}
};
Object.assign(ZONE_RARE_MONSTERS, { rootcellar: rootWarden, bureau: unregisteredAuditor, mudflats: siltWalker });
NAMED_BOSSES.push(rootWarden, unregisteredAuditor, siltWalker);

/* Folds these two districts into the pool startCombat() actually draws
from (monsters.filter(m => m.zone===state.location), combat.js) — a
plain array mutation, not a reassignment, so it stays a genuine `const`
concatenation rather than needing combat.js's own filter touched. */
monsters.push(...mudrootMonsters);

/* Same reasoning, for the Bounty Board's own pool — BOUNTY_TEMPLATES
(content.js) is a one-time snapshot taken at content.js's own parse
time, BEFORE this file's monsters.push() above ever runs, so without
this, Root Cellar/Mudflats/Bureau would never get a bounty template at
all. makeBountyTemplate() (content.js) is the exact same function
content.js used to build its own entries — reused here rather than
reimplemented, so the two can never drift out of sync. */
BOUNTY_TEMPLATES.push(...mudrootMonsters.map(makeBountyTemplate));

/* Extends content.js's own noncombatEvents/hazardEvents (both plain
objects, safe to add keys to after the fact) so Root Cellar/Mudflats get
their own flavor instead of silently falling back to the Commons pool
the way garrison/roguesden/sanctum already do — a pre-existing gap in
those three, not something this file needs to fix, but not a gap worth
repeating for a brand-new area. */
Object.assign(noncombatEvents, {
   rootcellar: [
      "A root the width of your arm pulses once, like it noticed you, and goes still again.",
      "Something has stacked the loose stones into a careful, deliberate little tower. You leave it standing.",
      "A draft moves through the cellar that has no business having a draft at all.",
      "You find a claw mark gouged into support timber, at exactly your height.",
      "The dark ahead holds its breath. So do you, for a second.",
      "A rootlet brushes your ankle and withdraws, unhurried, like it was just checking."
      ],
   mudflats: [
      "Something surfaces at the edge of the mud, watches, and sinks back down without a ripple.",
      "You find a set of tracks that circle back on themselves, over and over, going nowhere.",
      "The mud here has been packed flat and deliberate, like a path someone maintains.",
      "A reed bends against the wind that isn't blowing.",
      "You catch a low sound that could be wind through a tunnel, or could be something breathing.",
      "Something out past the reeds is keeping exact pace with you. It doesn't come closer."
      ],
   bureau: [
      "A form slides under the door toward you, entirely unprompted, and waits.",
      "Somewhere deeper in, a stamp comes down. Then another. Then a third, for good measure.",
      "You find an entire filing cabinet devoted to complaints about the filing cabinets.",
      "A little bell on the counter rings itself. No one comes.",
      "The line for something ahead of you has not moved in what feels like a very long time.",
      "A memo taped to the wall thanks you, by name, for your patience. You never gave any."
      ]
});
Object.assign(hazardEvents, {
   rootcellar: [
      { text:"A root gives way under your boot and you go down hard on the packed dirt.", dmg:[4,7] },
      { text:"A support beam shifts overhead and drops a faceful of loose soil right on you.", dmg:[4,8] },
      { text:"Something unseen clips your leg in the dark before you can place it.", dmg:[3,7] },
      ],
   mudflats: [
      { text:"You sink to the knee in mud that grabs back, and wrench something pulling free.", dmg:[4,8] },
      { text:"A hidden root snags your ankle and you go down face-first in the muck.", dmg:[5,8] },
      { text:"Something under the surface brushes past and leaves a stinging welt.", dmg:[4,7] },
      ],
   bureau: [
      { text:"A falling stack of forms takes you square in the shoulder. It weighs more than it should.", dmg:[4,7] },
      { text:"A filing cabinet drawer swings shut on your hand with real institutional force.", dmg:[3,7] },
      { text:"You get thoroughly, physically stamped by something that should not have a stamp.", dmg:[4,8] },
      ]
});
