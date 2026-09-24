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
dedicated quest reward on top of a much bigger XP/Pop Tab payout.

Each regular monster also carries a gearDrop — a piece of equipment
(GEAR_DROP_CHANCE, winCombat()) themed to that specific monster, same
"specific to what you killed" reasoning as rareDrop. As authored here
it's the tier-1/1-stat baseline (tier:'common'); a successful gearRoll
then rolls a real tier via rollGearDropTier() (combat.js, weighted
toward tier 1 — see GEAR_DROP_TIER_CHANCE), scaling the bonus/stat
count up the same way shopGearItemsTier2/3 do. No item anywhere in the
game (shop, monster drop, or PALACE_GATE_GEAR below) carries its own
stored level/stat requirement — getGearRequirements() (item-tiers.js)
derives both straight from an item's own `bonus` object wherever it's
needed (equipItem(), player-actions.js; shop/Pack listings), so a
requirement can never drift out of alignment with what the item
actually grants. Its bonus's own base VALUE (before any tier roll)
scales with the zone it's found in, one step per zone in ZONE_LEVEL_
RECOMMENDATION's own order rather than the old paired-tier scheme
(Commons +1, Sewers +2, Quarry +3, Vault +4, Garrison/Rogues' Den/
Arcane Sanctum +5 — see roguesDenEnforcer's own gearDrop below, bumped
to match) — per explicit correction, so gear drops keep getting
strictly better as the recommended level climbs, zone by zone, instead
of two zones in a row (e.g. Sewers right after Commons) handing over
the exact same drop. Mudroot Warren continues the same ladder one step
further (see mudroot-content.js's own comment). Slot/stat follows the same convention
the Shop already uses (weapon: beef or hoodoo; head/chest: grit;
legs/boots: zip), and every name ends in a short Diablo-style
"of the ___" modifier naming which stat it boosts — one animal per
stat, reused across every drop that carries that stat: of the Badger
(beef), of the Weasel (zip), of the Tortoise
(grit), of the Loon (hoodoo). */
const monsters = [
   { name:"a disgruntled compost gnome", hp:9, atkMin:1, atkMax:2, xp:3, zone:"commons",
    art: artCompostGnome, loot:{name:"fistful of righteous soil", desc:"Smells like victory and mulch.", type:"junk", sell:1, icon:iconSoil},
    rareDrop:{name:"gnome-sized medal of composting excellence", desc:"Awarded by nobody. Cherished anyway.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"compost-crusted trowel of the Badger", desc:"Sharpened on rocks, mostly by accident.", type:"equip", slot:"weapon", bonus:{beef:1}, tier:'common', icon:iconRakeShank} },
   { name:"a feral lawn gnome, off its stake", hp:8, atkMin:1, atkMax:3, xp:4, zone:"commons",
    art: artGnomeFeral, loot:{name:"bent rake tine", desc:"Still menacing, somehow.", type:"quest", key:"rakeTine", sell:2, icon:iconRakeTine},
    rareDrop:{name:"stake-shaped good luck charm", desc:"Whittled by whoever this gnome escaped from.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"stake-notched shin guard of the Weasel", desc:"Salvaged off the stake it was chained to.", type:"equip", slot:"legs", bonus:{zip:1}, tier:'common', icon:iconShinGuard} },
   { name:"a fishing gnome with an empty bucket", hp:11, atkMin:1, atkMax:2, xp:4, zone:"commons",
    art: artGnomeFishing, loot:{name:"suspiciously confident lure", desc:"Has never once caught anything.", type:"junk", sell:2, icon:iconLure},
    rareDrop:{name:"actually-lucky fishing lure", desc:"This one's clearly caught something, at some point.", type:"junk", sell:11, icon:iconFigurine},
    gearDrop:{name:"waterlogged fishing hat of the Tortoise", desc:"Smells like pond. You get used to it.", type:"equip", slot:"head", bonus:{grit:1}, tier:'common', icon:iconPotLid} },
   { name:"a gnome cavalry unit, mounted on a garden snail", hp:13, atkMin:1, atkMax:3, xp:5, zone:"commons",
    art: artGnomeSnail, loot:{name:"spiral shell fragment", desc:"Still faintly slimy.", type:"junk", sell:3, icon:iconShellFragment},
    rareDrop:{name:"snail-slime polished pebble", desc:"Smooth as glass. Smells faintly of victory.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"snail-shell breastplate of the Tortoise", desc:"Surprisingly load-bearing, for a shell.", type:"equip", slot:"chest", bonus:{grit:1}, tier:'common', icon:iconVest} },
   { name:"the self-appointed gnome sergeant", hp:17, atkMin:2, atkMax:4, xp:7, zone:"commons",
    art: artGnomeSergeant, loot:{name:"tiny sergeant's whistle", desc:"Blowing it clears your head a little.", type:"mp", value:4, icon:iconWhistle},
    rareDrop:{name:"the sergeant's secret stash of medals", desc:"Every one of them self-awarded.", type:"junk", sell:12, icon:iconFigurine},
    gearDrop:{name:"sergeant's spit-shined boots of the Weasel", desc:"Standard issue. Aggressively polished.", type:"equip", slot:"boots", bonus:{zip:1}, tier:'common', icon:iconSpringBoots} },
   { name:"a sewer rat with delusions of grandeur", hp:15, atkMin:2, atkMax:4, xp:6, zone:"sewers",
    art: artSewerRat, loot:{name:"slightly damp rat tail", desc:"You're not sure why you kept this.", type:"junk", sell:2, icon:iconRatTail},
    rareDrop:{name:"rat king's tiny crown", desc:"Delusions of grandeur, it turns out, were warranted.", type:"luck", hpValue:10, mpValue:5, icon:iconClover},
    gearDrop:{name:"rat-gnawed divining rod of the Loon", desc:"Points at whatever it feels like, confidently.", type:"equip", slot:"weapon", bonus:{hoodoo:2}, tier:'common', icon:iconWandStick} },
   { name:"a rat wearing a bottlecap as a helmet", hp:18, atkMin:2, atkMax:5, xp:7, zone:"sewers",
    art: artRatHelmet, loot:{name:"dented bottlecap helmet", desc:"Barely fits a rat. Definitely doesn't fit you.", type:"junk", sell:3, icon:iconBottlecapHelmet},
    rareDrop:{name:"helmet dented in a suspiciously lucky pattern", desc:"Every dent lines up with a near-miss.", type:"junk", sell:15, icon:iconFigurine},
    gearDrop:{name:"bottlecap-studded skullcap of the Tortoise", desc:"Rat-sized, once. Stretched since.", type:"equip", slot:"head", bonus:{grit:2}, tier:'common', icon:iconPotLid} },
   { name:"a positively enormous sewer rat", hp:24, atkMin:3, atkMax:6, xp:9, zone:"sewers",
    art: artGiantSewerRat, loot:{name:"rat-gnawed pipe fitting", desc:"Chewed clean through solid metal. Concerning.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"glowing sewer pearl", desc:"You don't ask how it got down here. Or how it glows.", type:"luck", hpValue:10, mpValue:5, icon:iconClover},
    gearDrop:{name:"rat-hide vest of the Tortoise", desc:"Roomier than you'd expect. Best not to think why.", type:"equip", slot:"chest", bonus:{grit:2}, tier:'common', icon:iconVest} },
   { name:"three rats in a trenchcoat, unconvincingly", hp:20, atkMin:3, atkMax:5, xp:8, zone:"sewers",
    art: artRatTrenchcoat, loot:{name:"comically oversized coat button", desc:"None of the three rats will admit to owning this.", type:"junk", sell:3, icon:iconCoatButton},
    rareDrop:{name:"the trenchcoat's secret inside pocket, still full", desc:"Whatever they were hiding, it's yours now.", type:"junk", sell:16, icon:iconFigurine},
    gearDrop:{name:"trenchcoat's spare trouser leg of the Weasel", desc:"The other two rats never noticed it was missing.", type:"equip", slot:"legs", bonus:{zip:2}, tier:'common', icon:iconQuickstepTrousers} },
   { name:"a wind-up quarry drone, badly wound", hp:20, atkMin:3, atkMax:6, xp:10, zone:"quarry",
    art: artQuarryDrone, loot:{name:"stripped brass gear", desc:"Still spins if you flick it. Mostly for fun now.", type:"junk", sell:4, icon:iconGear},
    rareDrop:{name:"drone's still-humming power core", desc:"Warm, faintly ticking, best not examined too closely.", type:"junk", sell:19, icon:iconFigurine},
    gearDrop:{name:"drone's stripped control wand of the Loon", desc:"Still beeps if you squeeze it just right.", type:"equip", slot:"weapon", bonus:{hoodoo:3}, tier:'common', icon:iconVizierScepter} },
   { name:"a gnome surveyor squinting at an upside-down map", hp:18, atkMin:3, atkMax:5, xp:9, zone:"quarry",
    art: artGnomeSurveyor, loot:{name:"crumpled survey map", desc:"Confidently wrong about where you are.", type:"junk", sell:3, icon:iconSurveyMap},
    rareDrop:{name:"compass that always points to safety", desc:"Not north. Safety. Somehow more useful.", type:"luck", hpValue:12, mpValue:6, icon:iconClover},
    gearDrop:{name:"surveyor's dented hard-hat of the Tortoise", desc:"Confidently the wrong size. Sturdy anyway.", type:"equip", slot:"head", bonus:{grit:3}, tier:'common', icon:iconGuardHelm} },
   { name:"a pickaxe golem, held together by spite", hp:26, atkMin:4, atkMax:7, xp:13, zone:"quarry",
    art: artPickaxeGolem, loot:{name:"chipped pickaxe head", desc:"Has seen better decades.", type:"junk", sell:5, icon:iconPickaxeHead},
    rareDrop:{name:"fist-sized nugget of pure stubbornness", desc:"Heavier than it should be. Refuses to be dropped.", type:"junk", sell:20, icon:iconFigurine},
    gearDrop:{name:"golem's chipped chest-plating of the Tortoise", desc:"Held together by spite, same as the rest of it.", type:"equip", slot:"chest", bonus:{grit:3}, tier:'common', icon:iconClockworkPlate} },
   { name:"a rock-crusted quarry rat, huge for some reason", hp:22, atkMin:3, atkMax:6, xp:11, zone:"quarry",
    art: artQuarryRat, loot:{name:"fistful of ore-flecked grit", desc:"Somewhere between dirt and treasure. Mostly dirt.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"rat-gnawed lucky pebble (not a rabbit's foot)", desc:"The rat was very clear on that point, somehow.", type:"luck", hpValue:12, mpValue:6, icon:iconClover},
    gearDrop:{name:"ore-crusted quarry boots of the Weasel", desc:"Better footing than they have any right to give.", type:"equip", slot:"boots", bonus:{zip:3}, tier:'common', icon:iconGripBoots} },
   { name:"a vault wisp, humming with old magic", hp:28, atkMin:4, atkMax:7, xp:15, zone:"vault",
    art: artVaultWisp, loot:{name:"sliver of captured light", desc:"Warm to the touch. Slightly judgmental.", type:"junk", sell:6, icon:iconCapturedLight},
    rareDrop:{name:"captured wisp of pure luck", desc:"It flickers approvingly whenever you make a good call.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"wisp-charred conducting rod of the Loon", desc:"Still warm. Hums when you're not paying attention.", type:"equip", slot:"weapon", bonus:{hoodoo:4}, tier:'common', icon:iconHeirloomRod} },
   { name:"a stone sentinel, one eye still lit", hp:34, atkMin:5, atkMax:8, xp:18, zone:"vault",
    art: artStoneSentinel, loot:{name:"fractured sentinel eye", desc:"Stopped watching. Eventually.", type:"junk", sell:7, icon:iconSentinelEye},
    rareDrop:{name:"the sentinel's other eye, still watching", desc:"You can feel it tracking you from the bottom of your pack.", type:"junk", sell:26, icon:iconFigurine},
    gearDrop:{name:"sentinel's cracked faceplate of the Tortoise", desc:"One eye socket. Still watching, faithfully.", type:"equip", slot:"head", bonus:{grit:4}, tier:'common', icon:iconChampionCrown} },
   { name:"a hoard-rat, absolutely covered in gold flecks", hp:26, atkMin:4, atkMax:7, xp:14, zone:"vault",art: artHoardRat, loot:{name:"gold-dusted whisker", desc:"Rich by rat standards.", type:"junk", sell:6, icon:iconGoldWhisker},
    rareDrop:{name:"fistful of the hoard-rat's actual hoard", desc:"It was surprisingly well-organized, for a rat.", type:"junk", sell:28, icon:iconFigurine},
    gearDrop:{name:"gold-flecked greaves of the Weasel", desc:"Surprisingly light, for how much they're worth.", type:"equip", slot:"legs", bonus:{zip:4}, tier:'common', icon:iconBurrowGreaves} },
   { name:"an animated suit of ceremonial armor, empty inside", hp:36, atkMin:5, atkMax:9, xp:20, zone:"vault",
    art: artCeremonialArmor, loot:{name:"dented ceremonial gauntlet", desc:"Once belonged to somebody important, probably.", type:"junk", sell:8, icon:iconCeremonialGauntlet},
    rareDrop:{name:"ceremonial luck-charm, still humming with old magic", desc:"Whoever it was made for never got to keep it.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"scrap of animated ceremonial mail of the Tortoise", desc:"Keeps twitching like it's still wearing someone.", type:"equip", slot:"chest", bonus:{grit:4}, tier:'common', icon:iconAdventurerCuirass} },
   { name:"a gnome vizier, draped in stolen finery", hp:34, atkMin:5, atkMax:9, xp:19, zone:"sanctum",
    art: artGnomeVizier, loot:{name:"vizier's confiscated ledger", desc:"Every debt in Gnometropolis, written in tiny cramped handwriting.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"vizier's uncanny hunch, bottled", desc:"It practically whispers good advice.", type:"luck", hpValue:18, mpValue:9, icon:iconClover},
    gearDrop:{name:"vizier's confiscated cane-wand of the Loon", desc:"Equal parts walking stick and unlicensed magic.", type:"equip", slot:"weapon", bonus:{hoodoo:5}, tier:'common', icon:iconWandStick} },
   { name:"a heavily-armored gnome guard", hp:44, atkMin:6, atkMax:10, xp:23, zone:"garrison",
    art: artGnomeGuard, loot:{name:"dented guard-captain's shield-boss", desc:"Scratched from decades of very small, very serious duels.", type:"junk", sell:10, icon:iconShieldBoss},
    rareDrop:{name:"the guard-captain's ceremonial sash", desc:"Awarded for uninterrupted vigilance. Interrupted now.", type:"junk", sell:32, icon:iconFigurine},
    gearDrop:{name:"guard's dented vambrace-plating of the Tortoise", desc:"Decades of very small, very serious duels.", type:"equip", slot:"chest", bonus:{grit:5}, tier:'common', icon:iconClockworkPlate} },
   { name:"a burrowing tunnel-worm, gnome-bred", hp:38, atkMin:6, atkMax:10, xp:21, zone:"roguesden",
    art: artBurrowWorm, loot:{name:"chitinous burrow-shell fragment", desc:"Warm from the tunnel. You don't ask why.", type:"junk", sell:9, icon:iconBurrowShell},
    rareDrop:{name:"burrow-worm's lucky cast-off tooth", desc:"Smooth, oddly warm, and very possibly why you're still standing.", type:"luck", hpValue:19, mpValue:9, icon:iconClover},
    gearDrop:{name:"worm-chewed tunneling boots of the Weasel", desc:"Already broken in. Not by you.", type:"equip", slot:"boots", bonus:{zip:5}, tier:'common', icon:iconBlessedBoots} },
   { name:"a rogue clockwork automaton, sparking wildly", hp:46, atkMin:7, atkMax:11, xp:26, zone:"roguesden",
    art: artFeralAutomaton, loot:{name:"scorched servo joint", desc:"Still twitches, if you're not careful.", type:"junk", sell:11, icon:iconServoJoint},
    rareDrop:{name:"the automaton's still-warm power cell", desc:"Hums like it's not entirely done working yet.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"automaton's salvaged headplate of the Tortoise", desc:"Still sparks a little when it rains.", type:"equip", slot:"head", bonus:{grit:5}, tier:'common', icon:iconGuardHelm} },
   /* Rounds the Garrison/Rogues' Den/Arcane Sanctum rosters out to 3
   regular monsters apiece (they launched with just 1/2/1) so each
   district has its own proper set instead of feeling like a rare-hunt
   waiting room. Same hp/atk/xp band as the 4 above (34-46/5-11/19-26),
   gearDrop slot picked to cover a different slot than each district's
   existing monster (weapon/boots for Garrison alongside its chest;
   chest/boots for Sanctum alongside its weapon; legs for Rogues' Den
   alongside its boots/head) so a full clear of a district doesn't just
   hand back 3 copies of the same slot. */
   { name:"a gnome drill sergeant, all bark and boot-camp", hp:40, atkMin:5, atkMax:9, xp:22, zone:"garrison",
    art: artGnomeDrillSergeant, loot:{name:"sergeant's dog-eared drill roster", desc:"Every recruit's name, and a demerit next to most of them.", type:"junk", sell:9, icon:iconDrillRoster},
    rareDrop:{name:"the sergeant's secret medal stash, garrison edition", desc:"Every one of them self-awarded. Some things never change.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"sergeant's barked-order banner-lance of the Badger", desc:"Doubles as a pointer for yelling at recruits.", type:"equip", slot:"weapon", bonus:{beef:5}, tier:'common', icon:iconBannerLance} },
   { name:"a gnome siege-crew, operating a catapult built for one", hp:48, atkMin:7, atkMax:11, xp:25, zone:"garrison",
    art: artGnomeSiegeCrew, loot:{name:"splintered catapult peg", desc:"Load-bearing, allegedly.", type:"junk", sell:11, icon:iconCatapultPeg},
    rareDrop:{name:"the siege-crew's lucky firing pin", desc:"Pulled from a shot that somehow landed exactly right.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"siege-crew's scorched greaves of the Weasel", desc:"Singed. Still faster than running barefoot.", type:"equip", slot:"boots", bonus:{zip:5}, tier:'common', icon:iconScorchedGreaves} },
   { name:"an apprentice hex-weaver, sparks flying every wrong direction", hp:36, atkMin:5, atkMax:9, xp:20, zone:"sanctum",
    art: artHexWeaver, loot:{name:"singed spellbook page", desc:"The diagram is half-right. That's the problem.", type:"junk", sell:9, icon:iconSpellbookPage},
    rareDrop:{name:"hex-weaver's stabilized spark, bottled", desc:"Finally behaving itself, for once.", type:"luck", hpValue:19, mpValue:10, icon:iconClover},
    gearDrop:{name:"apprentice's scorch-marked robe-plating of the Tortoise", desc:"Fire-proofed the hard way, one mistake at a time.", type:"equip", slot:"chest", bonus:{grit:5}, tier:'common', icon:iconScorchRobe} },
   { name:"a gnome familiar, three sizes too ambitious", hp:32, atkMin:5, atkMax:8, xp:19, zone:"sanctum",
    art: artGnomeFamiliar, loot:{name:"familiar's shed feather-scale", desc:"Not quite a feather. Not quite a scale either.", type:"junk", sell:8, icon:iconFeatherScale},
    rareDrop:{name:"the familiar's uncanny premonition, bottled", desc:"It saw this coming. It always does.", type:"luck", hpValue:19, mpValue:9, icon:iconClover},
    gearDrop:{name:"familiar-warded slippers of the Weasel", desc:"Land softer than they have any right to.", type:"equip", slot:"boots", bonus:{zip:5}, tier:'common', icon:iconWardedSlippers} },
   { name:"a masked gnome pickpocket, light-fingered and lighter-footed", hp:42, atkMin:6, atkMax:10, xp:24, zone:"roguesden",
    art: artGnomePickpocket, loot:{name:"pilfered coin purse, mostly empty", desc:"Somebody's definitely going to notice this is missing.", type:"junk", sell:10, icon:iconCoinPurse},
    rareDrop:{name:"the pickpocket's lucky lifted button", desc:"Not sure whose coat this came off of. Not asking.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"pickpocket's cutpurse leggings of the Weasel", desc:"Built for running, mostly away.", type:"equip", slot:"legs", bonus:{zip:5}, tier:'common', icon:iconCutpurseLeggings} },
   ];

/* Every named boss below (gnomeCommander through arcaneSanctumGuardian)
carries a skills[] entry giving it one signature mechanic on top of its
plain auto-attack — same generic dispatcher trialChampion/casinoChampion/
hoodooChampion already use (monsterRetaliate(), combat.js), so no new
combat code was needed, just data. Picked to fit each one's own flavor:
a commander rallies, a captain guarding a retreat digs in and heals, a
rogue enforcer is hard to pin down, etc. */
const gnomeCommander = {
   name:"the gnome commander", hp:45, atkMin:4, atkMax:8, xp:20, rare:true, zone:"commons",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"rallies the gnomes for one more push" } ],
   art: artGnomeCommander, loot:null
};
const COMMANDER_SPAWN_CHANCE = 0.05;

/* Rare hunt target for the Tinker's quest, "Gears in the Dark" — spawns in
the Dank Sewers while state.quest4Accepted is true and the quest isn't
complete yet, same mechanic as gnomeCommander above (see
diggerBotHunt in goAdventuring()). Tuned tougher (higher HP) than
gnomeCommander to keep it a step up in difficulty even though all
three named hunts now share the same DIGGERBOT_SPAWN_CHANCE. */
const diggerBot = {
   name:"a runaway digger-bot, venting steam", hp:55, atkMin:4, atkMax:8, xp:22, rare:true, zone:"sewers",
   skills:[ { type:'bolt', chance:0.22, boltMin:7, boltMax:12, flavor:"vents a scalding jet of built-up steam" } ],
   art: artDiggerBot, loot:null
};
const DIGGERBOT_SPAWN_CHANCE = 0.05;

/* Rare hunt target for the Guild's quest 6, "The Gnome King's Throne" —
spawns in the Sunless Vault while state.quest6Accepted is true and the
quest isn't complete yet, same mechanic as gnomeCommander/diggerBot above
(see gnomeKingHunt in goAdventuring()). Retconned: this was originally
written as the gnome king himself, but he's been moved out of the Vault
entirely (see the real gnomeKing below) — this is now his guard-captain,
left behind to cover the King's retreat while quest 6 still unlocks
Gnometropolis. Stats deliberately left untouched from the original
gnomeKing entry (hp:70/atk:7-12/xp:35) since quest 6 itself doesn't need
to get any harder, only its target's identity/flavor changed. Tuned as
the toughest rare boss of the three wild-spawn hunts (gnomeCommander/
diggerBot/this one), even though all three now share the same
VAULT_CAPTAIN_SPAWN_CHANCE. No rareDrop of its own, same reasoning
as gnomeCommander/diggerBot: it's already a dedicated quest reward on top
of a much bigger XP/Pop Tab payout. art points at a not-yet-written
artGnomeKingsCaptain() (art.js, separate task) — referenced by name now
so that task knows what to add. */
const gnomeKingsCaptain = {
   name:"the gnome king's captain, left to guard the retreat", hp:70, atkMin:7, atkMax:12, xp:35, rare:true, zone:"vault",
   skills:[ { type:'heal', chance:0.20, healMin:10, healMax:16, flavor:"digs in and patches his wounds, buying the King more time" } ],
   art: artGnomeKingsCaptain, loot:null
};
const VAULT_CAPTAIN_SPAWN_CHANCE = 0.05;

/* THE REAL Gnome King — Act 1's true finale boss, and a retcon in his own
right: he was never the one fought in the Sunless Vault (that was always
his captain, gnomeKingsCaptain above, covering his retreat). He's holed
up in Gnometropolis itself now, behind the palace gate, and is reached
only through quest 7 (guild.js), via one of three class-specific
gear-gated approaches — Meathead brute force, Card Shark disguise, or
Hexpert magic — resolved by approachPalaceGate() (guild.js).
Buffed to exceed trialChampion (the Guild's own class-trial boss,
hp:95/atk:11-17/xp:50) since he's meant to be the true Act 1 finale, not
a mid-quest rare hunt. rare:true/loot:null/art unchanged from before
(his art already exists and needs no touching).

`zone:"palace"` (was briefly `zone:"gnometropolis"`, and briefly missing
entirely before that) — a past pass removed it reasoning "he's no longer
a wild zone spawn, so he needs no zone" (true for whether he's in the
random encounter pool, monsters[] never included him either way — but
startCombat()'s ZONE_DIFFICULTY scaling (combat.js) keys off this SAME
field, and that part of the reasoning didn't hold: every other
Gnometropolis monster gets scaled by fighting there, but he didn't, so
his "buffed" 105 raw hp was actually LOWER, post-scaling, than
gnomeKingsCaptain's own 70-base Vault fight (133 real hp — that one
correctly kept its zone:"vault"). The result: by the level a player
realistically reaches the palace gate, the "hardest fight in the game"
was costing under 10% HP and ending in 3 turns — confirmed by
simulation, this is what made it feel too easy. `zone` moved from
`"gnometropolis"` to `"palace"` now that Gnometropolis is a town hub
with its own state.location ('gnometropolis') distinct from where this
fight actually happens (approachPalaceGate() only runs from
state.location==='palace', guild.js) — ZONE_DIFFICULTY.palace carries
the same 2.3 the old shared gnometropolis entry did, so this is a pure
rename, not a balance change. Same fix (zone restored, now to their own
district) applied to garrisonGuardian/roguesDenEnforcer/
arcaneSanctumGuardian below, which had the identical gap. */
/* The palace gauntlet — five unique named guards, fought in a fixed
order before the King himself, one approachPalaceGate() (guild.js) click
at a time. `palaceGauntletProgress` (guild.js, a plain transient
variable like combatSubView — never saved) tracks how many are down;
leaving the Palace for any reason (travelTo() away from it, town.js, or
a defeat via checkDefeat(), combat.js) resets it to 0 via
resetPalaceGauntlet() — this is meant to be cleared in one committed
run, not chipped away at across separate visits. All five share
`zone:"palace"` for the same ZONE_DIFFICULTY 2.3x scaling gnomeKing
himself gets (see his own comment above for why that field matters),
and `loot:null` like every other named story boss (gnomeCommander/
diggerBot/gnomeKingsCaptain/the Trial champions) — no farmable drops,
this is a one-shot narrative gauntlet, not a repeatable hunt.

Deliberately tuned WEAKER, hp-for-hp, than a standalone rare like
garrisonGuardian (hp:65) or gnomeKingsCaptain (hp:70) — a player fights
all five back-to-back with no auto-heal between them (same "damage
carries over between fights" rule every zone already uses), so treat
these five as one long fight against the King in disguise, not five
separate boss fights stacked on top of each other. Escalates gently
(hp 45->80, atk 6-10->9-14) so the run has a real arc without front-
loading all the risk into guard one. Each gets one signature mechanic,
same skills[] dispatcher every other named boss uses (monsterRetaliate(),
combat.js) — a plain warm-up, a healer, a self-buffer, a double-threat
buffer/bolter, and a hard-to-hit evasive finisher, in that order, so the
gauntlet's own difficulty curve mirrors gnomeKing's own buff+bolt kit
by the time you reach him. */
const palaceGuard1 = {
   name:"the outer gate sentinel, first line of a crumbling watch", hp:45, atkMin:6, atkMax:10, xp:25, rare:true, zone:"palace",
   art: artPalaceGuard1, loot:null
};
const palaceGuard2 = {
   name:"the inner ward-keeper, humming with old wards", hp:55, atkMin:7, atkMax:11, xp:30, rare:true, zone:"palace",
   skills:[ { type:'heal', chance:0.20, healMin:8, healMax:14, flavor:"leans on an old ward and stitches herself back together" } ],
   art: artPalaceGuard2, loot:null
};
const palaceGuard3 = {
   name:"the throne room usher, unnervingly polite", hp:65, atkMin:8, atkMax:12, xp:35, rare:true, zone:"palace",
   skills:[ { type:'buff', chance:0.20, buffMult:1.5, buffTurns:2, flavor:"straightens his collar and gets, somehow, more intense" } ],
   art: artPalaceGuard3, loot:null
};
const palaceGuard4 = {
   name:"the King's champion, undefeated and insufferable about it", hp:80, atkMin:9, atkMax:14, xp:45, rare:true, zone:"palace",
   skills:[
      { type:'buff', chance:0.18, buffMult:1.6, buffTurns:2, flavor:"warms up with a few showboating practice swings" },
      { type:'bolt', chance:0.15, boltMin:10, boltMax:16, flavor:"hurls a trophy javelin clean across the throne room" },
   ],
   art: artPalaceGuard4, loot:null
};
const palaceGuard5 = {
   name:"the King's own shadow, never quite where you last saw it", hp:70, atkMin:10, atkMax:15, xp:50, rare:true, zone:"palace",
   dodgeChance:0.30,
   art: artPalaceGuard5, loot:null
};
const PALACE_GUARDS = [palaceGuard1, palaceGuard2, palaceGuard3, palaceGuard4, palaceGuard5];

/* hp trimmed from the original 120 to 105 to compensate for adding two
skills at once (below) — the Act 1 finale should still clearly be the
hardest fight in the game on the strength of its mechanics, not by
stacking a skills[] kit on top of already being the highest raw hp/atk.
No sustain (unlike hoodooChampion) — he's meant to be rushed down before
his own buff+bolt combo snowballs, not out-attritioned. */
const gnomeKing = {
   name:"the gnome king, throned in scavenged gold", hp:100, atkMin:11, atkMax:17, xp:70, rare:true, zone:"palace",
   skills:[
      { type:'buff', chance:0.15, buffMult:1.7, buffTurns:3, flavor:"rallies the last of his gnomes for one final push" },
      { type:'bolt', chance:0.20, boltMin:14, boltMax:20, flavor:"hurls a scavenged treasure-shard, crackling with stolen magic" },
   ],
   art: artGnomeKing, loot:null
};

/* The Adventurer's Trial (acceptClassQuest/claimClassPath, guild.js) is
three independent trainer tests, one per prospective class, all fought as
a themed boss encounter at that class's own building via a dedicated
button (startClassTrialGuild/startClassTrialCasino/startClassTrialHoodoo,
guild.js) once a player hits level 10 — not a wild zone spawn, so none of
the three carries a `zone` or a SPAWN_CHANCE constant. All three must
pass (state.classTrialGuildPassed/classTrialCasinoPassed/
classTrialHoodooPassed, core.js) before claimClassPath() lets the player
choose. `rare:true` on all three lets the existing winCombat()
victory-detection pattern (state.monster.rare && state.monster.name ===
X.name) work for them unchanged. loot:null on all three for the same
reason as gnomeCommander/diggerBot/etc.: the reward here is trial
progress, not an item drop. None of the three requires the player to
have already put stat points into that class's own stat — a fight works
with whatever build the player's actually playing, same as any other
combat encounter in the game. Each one leans on a distinct mechanical
gimmick instead, deliberately: */

/* Guild tier (Meathead test) — the straightforward slugfest. Hits harder
than anything else in the game up to Act 1's real finale (gnomeKing,
hp:100/atk:11-17 template, scaled up further by ZONE_DIFFICULTY.
gnometropolis since he fights there and this one doesn't fight in any
zone at all) — no other trick, just raw power, matching the class
fantasy. */
const trialChampion = {
   name:"the Guild's Trial Examiner, unbeaten and unimpressed", hp:95, atkMin:11, atkMax:17, xp:50, rare:true,
   art: artTrialChampion, loot:null
};

/* Casino tier (Card Shark test) — replaces an earlier bet-threshold check
(CLASS_TRIAL_CASINO_STAKE, since removed) that required betting more Pop
Tabs than any Bet button in the UI actually offers, making it impossible
to pass. A themed fight against a rival card shark instead: lower HP than
trialChampion, but dodgeChance (applyDamageToMonster(), combat.js) means
roughly 3 in 10 attacks — Attack or a damage spell — whiff outright
regardless of the player's own stats. The challenge is grinding through
an evasive target, not out-damaging a tankier one. Also opens the fight
with its own Loaded Dice (spells[], classRequired:'Card Shark') —
buffTurnsLeft/buffMult baked directly into the template so its very
first attack (monsterAutoAttack(), combat.js) lands as a guaranteed
double-damage opening hit, same flavor as the player's own version
guaranteeing a crit on the opening sneak attack. */
const casinoChampion = {
   name:"the Casino's own card shark, impossible to pin down", hp:65, atkMin:8, atkMax:12, xp:50, rare:true,
   dodgeChance:0.30, buffTurnsLeft:1, buffMult:2, art: artCasinoChampion, loot:null
};

/* Hoodoo tier (Hexpert test) — a themed fight against a summoned spirit
carrying the game's first skills[] (combat.js's useMonsterSkill(): heal/
buff/bolt, tried in order each of its turns before falling back to a
normal attack). Weak melee on its own (atkMin/atkMax below), but sustain
(heal) and burst (bolt/a buffed attack) make it a real war of attrition
rather than a tankier trialChampion. classTrialHoodooPassed itself is
still only set in castSpell()'s damage branch (combat.js) when the
killing blow on THIS specific boss comes from a cast spell — winning the
fight with a plain Attack doesn't count, preserving the "prove your
hoodoo" flavor without requiring Hoodoo stat investment (any class can
buy Hex Bolt for 15 Pop Tabs and finish the job with it). */
const hoodooChampion = {
   name:"a spirit summoned from the bottom of the pot", hp:80, atkMin:7, atkMax:11, xp:50, rare:true,
   skills:[
      { type:'heal', chance:0.18, healMin:12, healMax:20, flavor:"mutters over its own embers and knits its wounds shut" },
      { type:'buff', chance:0.12, buffMult:1.6, buffTurns:3, flavor:"traces a sigil in the air, crackling with borrowed power" },
      { type:'bolt', chance:0.25, boltMin:11, boltMax:17, flavor:"flings a crackling hex" }
   ],
   art: artHoodooChampion, loot:null
};

/* Per-zone difficulty multiplier — makes each successive area meaningfully
tougher than the last, on top of the already-different base hp/atk/xp
each monster entry above carries. Applied once, in startCombat()
(game.js), to hp/atkMin/atkMax/xp for whatever monster spawns (regular
pool or a forced rare like gnomeCommander/diggerBot) — the numbers above
stay each monster's zone-relative baseline, and retuning how much harder
an area feels is just one number here, not a pass through every entry.
Tuned per user feedback that later areas weren't feeling more
challenging than earlier ones. */
/* gnometropolis's flat 2.3 became one entry per district (garrison/
roguesden/sanctum) plus palace once Gnometropolis stopped being a single
adventure zone and became its own town hub with 3 explorable districts
+ the palace (gnometropolis.js, town.js's travelTo()) — all four keep
the same 2.3 value the old shared zone used, since a player only ever
needs to clear ONE district (their own class's) rather than all three,
so there's no reason to differentiate difficulty between them. */
/* rootcellar/mudflats/bureau (Act 2 Part 2's first Mole People area) sit
one step past Gnometropolis's own districts — Mudflats a further step
past Root Cellar, since those two are meant to be fought in that order
(see tunnelWardenHunt/warrenScoutHunt, combat.js). Bureau is a parallel
third district, not part of that sequence — same tier as Root Cellar,
available the moment quest9Accepted like Root Cellar is, its own
monsters just business moles instead of tunnel moles. choir/ledgervault
(The Warren's Ear, quest10 — warrensear-content.js) sit one step past
those three: a second adventure hub, deeper in the same warren system,
reached through Mudroot Warren's own sealed root-door once quest10Path
is set. Same parallel-districts shape as rootcellar/bureau — Choir and
the Ledger Vault are alternate CHOICES (quest10's own branching), not a
sequence, so they share one tier. */
const ZONE_DIFFICULTY = { commons:1, sewers:1.15, quarry:1.55, vault:1.9, garrison:2.3, roguesden:2.3, sanctum:2.3, palace:2.3, rootcellar:2.6, bureau:2.6, mudflats:2.9, choir:3.2, ledgervault:3.2 };

/* Display names for each adventure zone, keyed by state.location/zone id —
used by the Bounty Board (render.js) to spell out where a bounty's
monster lives without hand-typing zone names in a second place. */
const ZONE_LABELS = { commons:'the Overgrown Commons', sewers:'the Dank Sewers', quarry:'the Clockwork Quarry', vault:'the Sunless Vault', garrison:'The Garrison', roguesden:"The Rogues' Den", sanctum:'The Arcane Sanctum', palace:'the Palace', rootcellar:'the Root Cellar', mudflats:'the Mudflats', bureau:'the Bureau', choir:'the Choir', ledgervault:'the Ledger Vault' };

/* The Map's main chain, Gladstone Hollow through to Mudroot Warren, in
travel order — travelCostFor() (town.js) prices a trip by the DISTANCE
between the player's current position in this chain and the
destination's, not a flat per-destination price: one step over costs 1
Biscuit, two steps costs 2, and so on, no matter which end of the chain
you're actually starting from (so Gnometropolis -> Mudroot Warren costs
the same 1 Biscuit as Commons -> Sewers, both being one step apart).
Districts (garrison/roguesden/sanctum/palace/rootcellar/mudflats/bureau)
aren't listed — they aren't Map destinations of their own, and collapse
to their own hub's position here (see chainIndex(),
town.js) since standing in one counts as standing at that hub for
distance purposes. 'town' itself is a special case travelCostFor()
always prices at 0 regardless of distance — the trip home is always
free (see forceHomeIfBroke()'s own comment, town.js), same as any move
within a hub's own area (square<->district) already was. */
const ZONE_ORDER = ['town', 'commons', 'sewers', 'quarry', 'vault', 'gnometropolis', 'mudrootwarren', 'warrensear'];

/* Shown on each zone's card in the Map drawer (render.js) as a "Recommended
level" guideline — deliberately advisory, not a hard gate like zone
unlocks (state.quest2/4/5/6Complete) or gear's own levelReq
(getGearRequirements(), item-tiers.js) already are. `min` is the floor:
below it the zone is a real step up in difficulty (ZONE_DIFFICULTY above
scales the actual combat numbers; this is just the player-facing
guidance). `max` (undefined for gnometropolis, the open-ended finale
zone) is roughly where a player naturally moves on to the next one.

These are simulated, not guessed: a full autoplay through the main
quest chain (10 runs, always attacking/fleeing/turning in the next
available quest step, real combat RNG, only the Inn's real-world-time
cooldown bypassed) measured the player's actual level at the moment
each zone's unlock quest completed:
- Sewers (quest2/gnomeCommander): unlocked at level 4-6 across all runs.
- Quarry (quest4/diggerBot): 6-8.
- Vault (quest5/vein parts): 7-9 — right on Quarry's heels, since
  quest4->quest5 chain back-to-back with no real gap.
- Gnometropolis (quest6/gnomeKingsCaptain): a first pass of this sim that
  skipped straight from Vault's unlock to soloing gnomeKingsCaptain
  (hp70/atk7-12 template, x1.9 from ZONE_DIFFICULTY in real combat) found
  the player fleeing 20-60 encounters in a row at level 7-9 and only
  winning once incidentally overleveled to 16-17 through pure Vault
  grinding — a "dead grind" gap far worse than any other transition.
  That's not a real pacing problem, though: it's the sim not taking the
  level-10 Guild capstone ("The Adventurer's Trial", guild.js) before
  going after the captain. Re-run with that detour included — reach
  level 10, pass the three class trials, claim a class, then return to
  the captain with class-boosted stats — gnomeKingsCaptain becomes a
  clean 1-4-encounter fight and Gnometropolis unlocks at level 10-12
  every run. The captain's own stats are correctly tuned for "level 10
  with a class," not for a Vault-fresh level 7-9 player — vault's `max`
  and gnometropolis's `min` below reflect that intended detour.

Mudroot Warren's original `min:16`/Warren's Ear's `min:20` were guessed
by extrapolating the ZONE_DIFFICULTY step (not simulated like the Act 1
numbers above) and turned out badly overtuned once actually checked —
real playtesting reached Mudroot Warren comfortably at level 12, using
health items mid-fight same as any other zone, nowhere near the
guessed level-16 floor. Re-derived from 300-trial-per-level win-rate
probes (a fresh Meathead, one level's worth of stat points sunk into
Beef, real startCombat()/playerAttack()/checkDefeat() combat code, 3
healing items on hand) against each zone's own regular-monster pool:
Mudroot Warren clears ~79-98% of fights by level 12 (bare gear vs. a
few +3-ish stat items respectively) and >90% by 14; Warren's Ear — one
full ZONE_DIFFICULTY step higher, and gated behind Mudroot Warren's own
quest9 to begin with — needs level 16 with that same modest gear to
reach the same >90% comfort zone. `min` below reflects each zone's own
"comfortable" floor rather than the old guesswork. */
const ZONE_LEVEL_RECOMMENDATION = {
   commons: { min:1, max:4 },
   sewers: { min:4, max:7 },
   quarry: { min:6, max:9 },
   vault: { min:7, max:10 },
   gnometropolis: { min:10 },
   mudrootwarren: { min:12, max:16 },
   warrensear: { min:16 },
};

/* Chance, per kill, that a monster's own rareDrop (defined per entry in
monsters[] above) drops alongside its normal loot roll. What drops is
now monster-specific — see the comment above monsters[]. */
const RARE_DROP_CHANCE = 0.12;

/* Chance, per kill, that a monster's own gearDrop (see the comment above
monsters[]) drops — rolled independently of both the normal loot roll
and RARE_DROP_CHANCE above, so a single kill could in principle hand
over all three. Set higher than RARE_DROP_CHANCE since gear drops are a
steady equip-upgrade path, not a collectible chase. */
const GEAR_DROP_CHANCE = 0.15;

/* Once a gearDrop actually drops, which tier it lands as — same 3-tier,
1/2/3-stat ladder shopGearItems/Tier2/Tier3 use, weighted toward the
lower tiers so a tier-3 upgrade off a wild kill stays a genuine rare
event (0.15 * 0.07 = ~1% of kills). Every monster's own gearDrop entry
(monsters[] above) IS the tier-1 baseline as authored — rollGearDropTier()
(combat.js) scales it up to tier 2/3 on the fly rather than needing 3
hand-written variants per monster: each step up adds +1 to the primary
stat and one more secondary stat (STAT_ROTATION below), the same
progression shopGearItemsTier2/3 use. Index 0 = tier 1. */
const GEAR_DROP_TIER_CHANCE = [0.70, 0.23, 0.07];
const GEAR_DROP_TIER_NAMES = ['common', 'uncommon', 'rare'];

/* Which stat a tier-2/3 gear drop adds on top of its tier-1 primary stat
— cycles through the other 3 stats in a fixed order starting right after
the primary, so every drop gets a deterministic secondary/tertiary stat
instead of needing one hand-picked per monster (see rollGearDropTier(),
combat.js). */
const STAT_ROTATION = {
   beef:   ['zip', 'grit', 'hoodoo'],
   zip:    ['grit', 'hoodoo', 'beef'],
   grit:   ['hoodoo', 'beef', 'zip'],
   hoodoo: ['beef', 'zip', 'grit'],
};

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

/* Every purchasable food item's value is kept at exactly 1.6x its own Pop
Tab price (the apple's own ratio: 8/5) — so buying and eating one is
never a net loss of "healing per Pop Tab spent" compared to any other
tier, and the item is always worth strictly more HP than it cost. Applies
here (healItems[1], the canonical jerky definition also fed into
allItemDefs(), save.js) and at shopFoodItemsTier2/Tier3 below, which
duplicate healItems[0]/[1]'s fields for the actual shop listing. */
const healItems = [
   { name:"slightly bruised apple", desc:"Restores a modest amount of HP.", type:"hp", value:8, tier:'common', icon:iconApple },
   { name:"suspicious jerky", desc:"Restores HP. Ask no further questions.", type:"hp", value:32, tier:'uncommon', icon:iconJerky },
   ];

/* ---------------- Equipment ---------------- */
/* Starter gear — equipped automatically at the start of the game so the
Character page's 5 equip slots (head/chest/legs/boots/weapon) aren't
just empty on day one. No stat bonuses; purely flavor. */
const starterGear = {
   weapon: { name:"bent kitchen fork", desc:"Not built for combat. Works anyway, sort of.", type:"equip", slot:"weapon", bonus:{}, sell:1, tier:'poor', icon: iconFork },
   head:   { name:"floppy adventuring cap", desc:"Keeps the sun out of your eyes, mostly.", type:"equip", slot:"head", bonus:{}, sell:1, tier:'poor', icon: iconCap },
   chest:  { name:"slightly singed tunic", desc:"Smells like campfire. Always has.", type:"equip", slot:"chest", bonus:{}, sell:1, tier:'poor', icon: iconTunic },
   legs:   { name:"hand-me-down trousers, one size too big", desc:"Held up entirely by hope and a length of twine.", type:"equip", slot:"legs", bonus:{}, sell:1, tier:'poor', icon: iconTrousers },
   boots:  { name:"one good boot, one bad boot", desc:"You've stopped noticing the limp.", type:"equip", slot:"boots", bonus:{}, sell:1, tier:'poor', icon: iconMismatchedBoots },
};

/* Shop-buyable upgrades, one or two per slot, each granting +1 to a stat —
tier 1 of 3: exactly 1 stat per item. shopGearItemsTier2/Tier3 below each
add one more stat on top (2 and 3 respectively), so stat COUNT climbs
with tier the same way price/bonus magnitude already does. */
const shopGearItems = [
   { name:"rake tine repurposed as a shank", desc:"Sharper than it has any right to be.", type:"equip", slot:"weapon", bonus:{beef:1}, price:12, tier:'common', icon: iconRakeShank },
   { name:"wand-shaped stick, allegedly magic", desc:"The gnome who sold it swore up and down.", type:"equip", slot:"weapon", bonus:{hoodoo:1}, price:12, tier:'common', icon: iconWandStick },
   /* Card Shark's own weapon line — Zip-primary, same price/tier as the
   Beef/Hoodoo weapons above it. Weapon slot gets a third entry at every
   tier from here on (see shopGearItemsTier2/3/4 below), rounding out
   all three classes' own weapon type instead of just Meathead/Hexpert's. */
   { name:"a deck shanked into a makeshift blade", desc:"Every card's an ace, if you throw it right.", type:"equip", slot:"weapon", bonus:{zip:1}, price:12, tier:'common', icon: iconCardShank },
   { name:"dented pot-lid helmet", desc:"Rings like a bell if you get hit. You get used to it.", type:"equip", slot:"head", bonus:{grit:1}, price:10, tier:'common', icon: iconPotLid },
   { name:"patched burlap vest", desc:"Itchy. Surprisingly sturdy.", type:"equip", slot:"chest", bonus:{grit:1}, price:12, tier:'common', icon: iconVest },
   { name:"shin guards whittled from a fence post", desc:"Splintery, but they hold.", type:"equip", slot:"legs", bonus:{zip:1}, price:10, tier:'common', icon: iconShinGuard },
   { name:"boots with suspiciously good grip", desc:"You don't ask where they came from.", type:"equip", slot:"boots", bonus:{zip:1}, price:10, tier:'common', icon: iconGripBoots },
   ];

const shopBuyItems = [
   { name:"slightly bruised apple", desc:"Restores a modest amount of HP.", type:"hp", value:8, price:5, tier:'common', icon:iconApple },
   ...shopGearItems,
   ];

/* Second gear tier, unlocked at Shop level 1 (SHOP_LEVEL_GEAR_TIER2 below;
see getAvailableShopItems() in economy.js and renderShop() in
render-shop.js) — one item per equipment slot, each granting +2 to a stat
(double shopGearItems' +1), priced a little steeper. Kept as its own array
rather than folded into shopGearItems/shopBuyItems so tier-1
pricing/availability is untouched and the unlock gate lives in exactly
one place.

Gear tier pricing is quadratic against a shared GEAR_BASE_UNIT (10, chosen
to sit right where shopGearItems' own tier-1 prices already cluster):
tier 2 averages ~4x GEAR_BASE_UNIT (~40), tier 3 (below) ~9x (~90). Each
tier's prices are scaled by a single constant factor off its pre-quadratic
numbers, so the relative spread between a tier's own items (cheapest vs
priciest) is unchanged — only the tier's overall level moved.

Equipping any of these (here or in Tier2/3 below) also needs a minimum
level AND a minimum base stat in whichever stat the item's own primary
bonus boosts — neither is stored on the item itself; both are derived
straight from its `bonus` object by getGearRequirements() (item-tiers.js)
and enforced in equipItem() (player-actions.js), so a requirement always
scales with what the item actually grants rather than needing separate
hand-tuned numbers kept in sync by hand. Pop Tabs alone can't buy past
your own level or stats — you can afford an item before you can wear it. */
const GEAR_BASE_UNIT = 10;
/* Tier 2 gives each item a second, smaller stat on top of its primary
one — tier 1 has 1 stat, tier 2 has 2, tier 3 (below) has 3, each
secondary stat worth +1 regardless of the primary's own value. Picked
per item to fit its own flavor rather than a mechanical rotation.
Weapon slot gets three entries, same as shopGearItems' tier-1 weapons —
Beef-, Hoodoo-, and Zip-primary — so a melee, spellcasting, or Card
Shark build each have their own weapon at every tier, not just tier 1. */
const shopGearItemsTier2 = [
   { name:"scepter looted from the vizier's chambers", desc:"Still radiates a faint, smug authority.", type:"equip", slot:"weapon", bonus:{hoodoo:2, grit:1}, price:40, tier:'uncommon', icon: iconVizierScepter },
   { name:"guard-captain's confiscated cleaver", desc:"Standard issue, before it wasn't standard issue anymore.", type:"equip", slot:"weapon", bonus:{beef:2, zip:1}, price:38, tier:'uncommon', icon: iconGuardCleaver },
   { name:"loaded dice on a length of chain", desc:"Comes up snake eyes for whoever's on the other end.", type:"equip", slot:"weapon", bonus:{zip:2, hoodoo:1}, price:40, tier:'uncommon', icon: iconDiceFlail },
   { name:"guard-captain's dented helm", desc:"Reinforced. Dented anyway.", type:"equip", slot:"head", bonus:{grit:2, beef:1}, price:38, tier:'uncommon', icon: iconGuardHelm },
   { name:"clockwork-plated chestpiece", desc:"Ticks faintly whenever your heart rate spikes.", type:"equip", slot:"chest", bonus:{grit:2, hoodoo:1}, price:42, tier:'uncommon', icon: iconClockworkPlate },
   { name:"burrow-worm hide greaves", desc:"Flexible enough to squeeze through a tunnel-worm's old digs.", type:"equip", slot:"legs", bonus:{zip:2, grit:1}, price:36, tier:'uncommon', icon: iconBurrowGreaves },
   { name:"spring-loaded gnome-tech boots", desc:"Every step has a little more bounce than it should.", type:"equip", slot:"boots", bonus:{zip:2, beef:1}, price:44, tier:'uncommon', icon: iconSpringBoots },
   ];

/* ---------------- Shop upgrade tiers ---------------- */
/* Upgrading the Shop building (Town Lot -> The Shop, state.buildingUpgrades.shop,
0..BUILDING_UPGRADE_MAX — see upgradeBuilding() in game.js) unlocks better,
pricier stock, on top of whatever's already available. Unlike the other 6
Town Lot buildings (still cosmetic-only, see the BUILDING_UPGRADES comment
below), the Shop's level is read directly by getAvailableShopItems()
(economy.js). Nothing already unlocked is ever taken away — these tiers are
additive with shopBuyItems, never a replacement for them. Reusing
suspicious jerky (healItems[1]) as the level-1 food unlock rather than
inventing a new item — it's been defined since the start but was never
actually reachable anywhere in the game until now.

Each Shop level unlocks one new food tier AND one new gear tier together
(a level buys into both at once, rather than gear and food climbing on
separate schedules) — gear tier N unlocks at the same level food tier N
does, one level ahead of gear's own tier number (tier 2 at level 1, tier 3
at level 2, tier 4 at level 3) since tier 1 gear is always available from
the start, same as tier 1 food. */
const SHOP_LEVEL_FOOD_TIER2 = 1;
const SHOP_LEVEL_FOOD_TIER3 = 2;
const SHOP_LEVEL_GEAR_TIER2 = 1;
const SHOP_LEVEL_GEAR_TIER3 = 2;
const SHOP_LEVEL_GEAR_TIER4 = 3;

/* Food tier pricing is quadratic against a shared FOOD_BASE_UNIT (5, the
apple's existing tier-1 price in shopBuyItems): tier 2 (jerky) ~4x that
(~20), tier 3 (biscuit tin) ~9x (~45). */
const FOOD_BASE_UNIT = 5;
const shopFoodItemsTier2 = [
   { name:"suspicious jerky", desc:"Restores HP. Ask no further questions.", type:"hp", value:32, price:20, tier:'uncommon', icon:iconJerky },
   ];

const shopFoodItemsTier3 = [
   { name:"tin of hoarded biscuit crumbs", desc:"Denser than a whole biscuit, somehow. Restores a large amount of HP.", type:"hp", value:72, price:45, tier:'rare', icon:iconBiscuitTin },
   ];

/* Top gear tier — one item per slot like shopGearItemsTier2, each granting
+3 to a stat (triple shopGearItems' +1), priced steeper still. Flavored as
the Shop's own premium stock (bought, not looted), unlike Tier 2's
Gnometropolis-loot theming. Priced per the GEAR_BASE_UNIT quadratic scheme
above shopGearItemsTier2 — ~9x GEAR_BASE_UNIT, same per-tier scale factor
applied to every item so the tier's internal price spread is unchanged. */
/* Tier 3 adds a third stat on top of tier 2's two — same +1-per-secondary
convention, just one more of them. Same three-weapons pattern as tier
1/2 — Beef-, Hoodoo-, and Zip-primary. */
const shopGearItemsTier3 = [
   { name:"heirloom hoodoo rod, mostly legitimate", desc:"The provenance is fuzzy. The results aren't.", type:"equip", slot:"weapon", bonus:{hoodoo:3, grit:1, zip:1}, price:100, tier:'rare', icon: iconHeirloomRod },
   { name:"heirloom war-cleaver, mostly legitimate", desc:"Family heirloom. Allegedly.", type:"equip", slot:"weapon", bonus:{beef:3, zip:1, grit:1}, price:95, tier:'rare', icon: iconHeirloomCleaver },
   { name:"an ace-tipped blade, palmed from the deck", desc:"Nobody notices a card missing until it's too late.", type:"equip", slot:"weapon", bonus:{zip:3, hoodoo:1, beef:1}, price:95, tier:'rare', icon: iconAceBlade },
   { name:"champion's dented crown, repurposed", desc:"Whoever wore it first isn't asking for it back.", type:"equip", slot:"head", bonus:{grit:3, hoodoo:1, beef:1}, price:85, tier:'rare', icon: iconChampionCrown },
   { name:"reinforced adventurer's cuirass", desc:"Actually built for this. A first, around here.", type:"equip", slot:"chest", bonus:{grit:3, beef:1, zip:1}, price:95, tier:'rare', icon: iconAdventurerCuirass },
   { name:"tailored pair of quick-step trousers", desc:"Somehow both stylish and functional.", type:"equip", slot:"legs", bonus:{zip:3, grit:1, hoodoo:1}, price:80, tier:'rare', icon: iconQuickstepTrousers },
   { name:"boots blessed by a mildly competent hoodoo doctor", desc:"\"Mildly\" is doing some work in that sentence.", type:"equip", slot:"boots", bonus:{zip:3, hoodoo:1, beef:1}, price:90, tier:'rare', icon: iconBlessedBoots },
   ];

/* Fourth and top gear tier, unlocked at Shop level 3 (SHOP_LEVEL_GEAR_TIER4
above) — one item per slot like every tier before it, each granting +4 to
a stat (up from tier 3's +3) plus, for the first time, ALL THREE other
stats at +1 each rather than a partial pick — there are only 4 stats
total, and primary+3 secondaries uses all of them, so there's no "which
stat to leave off" choice left to make the way tier 1-3 had. Priced per
the same GEAR_BASE_UNIT quadratic scheme as tier 2/3 (4^2 * GEAR_BASE_UNIT
= 160), scaled off tier 3's own prices by that tier's 16/9 factor so the
internal spread across slots carries forward unchanged. Palace-themed
(stolen/repurposed royal trappings) rather than Gnometropolis-loot or
premium-boutique like tiers 2/3 — this is the Shop's own top-shelf stock,
sourced from wherever the Shop gets away with sourcing it. Same
three-weapons pattern as every tier before it — Beef-, Hoodoo-, and
Zip-primary — though at this tier all three necessarily touch all 4
stats (primary+3 secondaries, and there are only 4 stats total), same as
every other slot here; only which stat is primary still tells them apart. */
const shopGearItemsTier4 = [
   { name:"scepter reforged from the throne room's own gold", desc:"Melted down and reshaped before the guards even noticed it was gone.", type:"equip", slot:"weapon", bonus:{hoodoo:4, beef:1, zip:1, grit:1}, price:180, tier:'epic', icon: iconThroneScepter },
   { name:"headsman's axe, liberated from the throne room", desc:"The guards really should've kept a closer eye on the ceremonial weapons rack.", type:"equip", slot:"weapon", bonus:{beef:4, zip:1, grit:1, hoodoo:1}, price:175, tier:'epic', icon: iconThroneAxe },
   { name:"a royal flush, fanned into a killing blow", desc:"The house doesn't usually lose this hand.", type:"equip", slot:"weapon", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, price:170, tier:'epic', icon: iconRoyalFlushBlade },
   { name:"crown stripped from the throne itself", desc:"Too big. You've stuffed it with rags to make it fit.", type:"equip", slot:"head", bonus:{grit:4, hoodoo:1, beef:1, zip:1}, price:150, tier:'epic', icon: iconStolenCrown },
   { name:"plate forged in the palace's own furnace", desc:"Still warm, if you believe the gnome who sold it to you.", type:"equip", slot:"chest", bonus:{grit:4, hoodoo:1, beef:1, zip:1}, price:170, tier:'epic', icon: iconPalaceForgedPlate },
   { name:"greaves stitched from a guard captain's dress uniform", desc:"Ceremonial. Somehow still holds up in a real fight.", type:"equip", slot:"legs", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, price:140, tier:'epic', icon: iconDressGreaves },
   { name:"boots off the palace steward's own feet", desc:"He wasn't using them anymore. Long story.", type:"equip", slot:"boots", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, price:160, tier:'epic', icon: iconStewardBoots },
   ];

/* ---------------- Spells (Hoodoo magic) ---------------- */
/* Taught by the Hoodoo Doctor in town (a new building, data-action="hoodoo")
for Pop Tabs, one at a time — `state.spellsKnown` holds the list of
learned spell ids (just strings, so no icon-function serialization
gotcha to worry about — see allItemDefs()/hydrateState() for how that
bites *items*; spells sidestep it entirely).

`type` drives castSpell()'s branch:
- 'damage' — magic damage using Hoodoo instead of Beef (playerAttack's
formula, swapped stat). The only type that costs a turn: it's the one
case where castSpell() still calls monsterRetaliate(), matching a
physical Attack. Combat-only — no monster to target from the Character
page, see castSpell()'s top-line gate.
- 'heal'   — restores state.hp by `healValue`.
- 'ward'   — grants a flat, persistent shield (state.shield).
- 'buff'   — no immediate combat effect. Sets state.classBuffFightsLeft
= CLASS_BUFF_FIGHTS (castSpell(), combat.js), which powers up that
class's existing mechanic (Meathead melee damage/Card Shark sneak
attack/Hexpert spell damage) for the next few fights.
- 'shout'  — Meathead-exclusive; see its own entry below.
'heal'/'ward'/'buff'/'shout' never cost a turn (no monsterRetaliate()
call) and are castable both mid-combat and from the Character page
(renderCastableSpellsBlock(), class-spells.js) — a deliberate choice:
only a damage spell trades your turn for an effect, everything else is
free utility you can use as often as your MP allows.

`classRequired` restricts BOTH where a spell can be learned
(learnSpell(), combat.js — a class's own building, not the Hoodoo
Doctor's, e.g. Meathead only at the Guild) and who can learn/cast it
(must match state.classTitle). Hex Bolt and Bottled Fury are the only
two spells left learnable by anyone at the Hoodoo Doctor — Mending
Charm and Warding Charm are Hexpert-exclusive now, same shape as the
4 fully class-exclusive spells below (still taught at 'hoodoo', so no
change to CLASS_SPELL_LOCATION needed, just who's allowed to learn
them there).

`learnLocation`, where present, overrides CLASS_SPELL_LOCATION's default
building for that class — used by the 3 Act 2 spells below (stubbornrecovery/
smokescreen/arcanelance) so they're taught at each class's new Gnometropolis
building (garrison/roguesden/sanctum) instead of that class's original
Act 1 trainer, without changing where the ORIGINAL 6 spells above are
still taught. renderClassSpellList() (class-spells.js) filters on this
same effective location too, so a building's list only ever shows spells
actually learnable there, never a spell that would silently refuse when
clicked from the wrong building. Each of the 3 fills in the one spell
TYPE its class didn't already have — Meathead had no heal, Card Shark
had no ward, Hexpert had no class-exclusive damage spell (Hex Bolt is
everyone's) — rather than doubling up on a type/mechanic each class
already owns.

'shout' (Meathead's, below) is its own type — same "grant a shield"
shape as 'ward' above, but small and mostly flat rather than
stat-scaled: Beef is already this class's damage stat (playerAttack()'s
own formula), so scaling the shield off it too, the way 'ward' scales
off Hoodoo, double-dipped the exact same investment and made the
shield absurdly large at high Beef. Used to be a free, always-available
dedicated combat button with no MP cost; folded into the normal
learnSpell()/castSpell() system so it costs Pop Tabs to learn and MP to
cast like every other class-exclusive ability. Priced/costed to match
Warding Charm (the spell it's mechanically closest to), not the pricier
buff-spell tier. */
const spells = [
   { id:'hexbolt', name:'Hex Bolt', desc:'A jagged little curse that stings more than it should.', type:'damage', mpCost:3, price:15, dmgMin:4, dmgMax:9, icon: iconHexBolt },
   { id:'mendcharm', name:'Mending Charm', desc:'Patches you up with muttered nonsense and surprising effectiveness.', type:'heal', healValue:10, mpCost:4, price:15, classRequired:'Hexpert', icon: iconMendCharm },
   { id:'wardcharm', name:'Warding Charm', desc:"Throws up a shimmering barrier that soaks up damage before it reaches you. Stacks if you're already shielded.", type:'ward', mpCost:3, price:12, classRequired:'Hexpert', icon: iconWardCharm },
   { id:'bottledfury', name:'Bottled Fury', desc:'Everything the potion ingredients were trying to tell you, unleashed at once.', type:'damage', mpCost:6, dmgMin:9, dmgMax:16, questReward:true, icon: iconBottledFury },
   { id:'shout', name:'Shout', desc:"A bone-rattling battle cry that braces for impact instead of attacking — throws up a small shield.", type:'shout', mpCost:3, price:12, classRequired:'Meathead', icon: iconShout },
   { id:'adrenalinerush', name:'Adrenaline Rush', desc:"Floods your muscles with borrowed strength — hits harder than usual for your next few fights, not just this one.", type:'buff', mpCost:10, price:250, classRequired:'Meathead', icon: iconAdrenalineRush },
   { id:'loadeddice', name:'Loaded Dice', desc:"Tips the odds your way for a while — your opening strike is guaranteed to catch the next few fights' targets off guard.", type:'buff', mpCost:10, price:250, classRequired:'Card Shark', icon: iconLoadedDice },
   { id:'arcanefocus', name:'Arcane Focus', desc:"Sharpens your Hoodoo to a fine point for a while — your spells bite harder for the next few fights.", type:'buff', mpCost:10, price:250, classRequired:'Hexpert', icon: iconArcaneFocus },
   /* Act 2's own trainers (Garrison/Rogues' Den/Arcane Sanctum,
   Gnometropolis) — see the comment above spells[] for why these three
   and not another copy of an existing type. */
   { id:'stubbornrecovery', name:'Stubborn Recovery', desc:"You refuse to go down like that. Grit your teeth, shake it off, and keep going.", type:'heal', healValue:35, mpCost:8, price:300, classRequired:'Meathead', learnLocation:'garrison', icon: iconStubbornRecovery },
   { id:'smokescreen', name:'Smoke Screen', desc:"Kick up a cloud of grit and vanish into it just long enough for whatever's coming to second-guess itself.", type:'ward', mpCost:6, price:300, classRequired:'Card Shark', learnLocation:'roguesden', icon: iconSmokeScreen },
   { id:'arcanelance', name:'Arcane Lance', desc:"No flourish, no misdirection — just a thin, precise lance of raw arcane force.", type:'damage', dmgMin:14, dmgMax:22, mpCost:8, price:350, classRequired:'Hexpert', learnLocation:'sanctum', icon: iconArcaneLance },
   ];
/* How many upcoming fights a class buff spell's effect lasts, set into
state.classBuffFightsLeft on cast and ticked down once per completed
fight (endCombat(), combat.js — the one place winCombat()/playerFlee()/
checkDefeat() all funnel through, so the decrement happens exactly once
per encounter regardless of how it ended). */
const CLASS_BUFF_FIGHTS = 3;

/* ---------------- Potion ingredients (Hoodoo Doctor's quest, "A Proper Potion") ---------------- */
/* Each entry ties one specific monster to one specific ingredient item.
While state.quest3Accepted is true and state.quest3Complete is false,
defeating that monster force-drops the ingredient (overriding its normal
loot) as long as the player doesn't already hold it — see winCombat().
Two ingredients come from the Commons, two from the Dank Sewers. */
const potionIngredients = [
   { monsterName:"a disgruntled compost gnome",
    item:{ name:"knot of fat white grubs", desc:"Wriggling, pale, and apparently essential to the recipe.", type:"quest", key:"potionWorms", sell:2, icon:iconPotionWorms } },
   { monsterName:"a fishing gnome with an empty bucket",
    item:{ name:"jar of pond tadpoles", desc:"The fishing gnome never caught anything. You, apparently, just did.", type:"quest", key:"potionTadpole", sell:2, icon:iconPotionTadpole } },
   { monsterName:"a sewer rat with delusions of grandeur",
    item:{ name:"gob of glowing sewer sludge", desc:"It hums faintly. That's probably fine.", type:"quest", key:"potionSludge", sell:3, icon:iconPotionSludge } },
   { monsterName:"a rat wearing a bottlecap as a helmet",
    item:{ name:"whisker plucked from a suspiciously large rat", desc:"It practically vibrates with potency.", type:"quest", key:"potionWhisker", sell:3, icon:iconPotionWhisker } },
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
    item:{ name:"still-ticking gear core", desc:"Keeps perfect time for a reason nobody can explain.", type:"quest", key:"veinGearCore", sell:4, icon:iconVeinGearCore } },
   { monsterName:"a pickaxe golem, held together by spite",
    item:{ name:"vein-streaked ore chunk", desc:"Heavier than it looks. Warmer too.", type:"quest", key:"veinOreChunk", sell:5, icon:iconVeinOreChunk } },
   { monsterName:"a positively enormous sewer rat",
    item:{ name:"fist-sized raw gemstone", desc:"How a sewer rat came by this is a question best not asked.", type:"quest", key:"veinGemstone", sell:4, icon:iconVeinGemstone } },
   { monsterName:"three rats in a trenchcoat, unconvincingly",
    item:{ name:"tangle of copper wiring", desc:"All three rats insist it was already like that.", type:"quest", key:"veinWiring", sell:4, icon:iconVeinWiring } },
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
/* Chance per Attack (playerAttack(), combat.js) to land a second full
swing in the same turn — a flat 1% per level, deliberately modest since
it's a chance at ENTIRELY FREE extra damage every turn of every fight,
not a one-time payout multiplier like the old Casino-payout version of
this skill. Was CARD_SHARK_PAYOUT_BONUS (a Casino win-payout bonus) —
replaced because a Card Shark's capstone skill only mattering at the
Casino, not in combat, felt off next to Meathead/Hexpert's both being
combat bonuses. */
const CARD_SHARK_DOUBLE_ATTACK_CHANCE = [0, 0.01, 0.02, 0.03];
const HEXPERT_SPELL_DMG_BONUS = [0, 3, 6, 9]; /* flat bonus added to spell damage */
/* Cost to go from `level` to `level+1` for the shared class-skill counter
above — quadratic, same style as buildingUpgradeCost() below: 150/600/1350
Pop Tabs. One cost curve shared across all 3 classes' single skill level. */
function classSkillCost(level){ return 150 * (level+1) * (level+1); }
/* Player level required to go from `level` to `level+1` — index the same
way classSkillCost() is (current classSkillLevel, not the target). A
class can't even be chosen before level 10 (the Adventurer's Trial,
guild.js), so the first tier unlocks right alongside it rather than
gating it further; the next two climb with the same escalating feel as
the Pop Tabs cost, so a maxed-out skill is a real late-game milestone,
not something affordable the moment you pick a class. */
const CLASS_SKILL_LEVEL_REQ = [10, 15, 20];

/* Gear-gated approaches into Gnometropolis' palace for quest 7 — the real
gnomeKing (above) is holed up behind the palace gate, and each class
reaches him through a different one of these three items, checked by
approachPalaceGate() (guild.js). Same equip-item shape as
shopGearItemsTier3 above ({name, desc, type:'equip', slot, bonus, icon})
plus one extra lookup field: `class` (matches state.classTitle). Each is
in a different equip slot on purpose — weapon/chest/head — so wearing
one is a real trade-off against that slot's normal best-in-slot piece,
not a free add-on. Bonuses are deliberately small (+2, half of
shopGearItemsTier3's +3) since these exist to be functionally required
for quest 7, not to be the best gear in the game.

Retconned: these were originally bought with Bounty Tokens at a matching
town building (`price`/`building` fields, one purchase function per
building). That's gone now — each item is instead a GUARANTEED drop from
defeating its class's Gnometropolis district guardian (garrisonGuardian/
roguesDenEnforcer/arcaneSanctumGuardian below, a rare encounter while
exploring that district — see the *Hunt blocks in goAdventuring(),
combat.js), which is why `price`/`building` no longer exist here.
icon fields point at iconSiegeBreaker/iconGuardUniform/iconWardedSeal
(icons.js). */
const PALACE_GATE_GEAR = [
   { name:"warlord's siege-breaker", desc:"Not subtle. Doesn't need to be.", type:"equip", slot:"weapon", bonus:{beef:2}, class:'Meathead', tier:'epic', icon: iconSiegeBreaker },
   { name:"stolen palace-guard's uniform", desc:"Fits well enough, if nobody looks twice.", type:"equip", slot:"chest", bonus:{zip:2}, class:'Card Shark', tier:'epic', icon: iconGuardUniform },
   { name:"warded seal, still humming", desc:"Warm to the touch. Getting warmer.", type:"equip", slot:"head", bonus:{hoodoo:2}, class:'Hexpert', tier:'epic', icon: iconWardedSeal },
   ];

/* The three Gnometropolis district guardians — each one a rare encounter
while exploring its own district (garrison/roguesden/sanctum,
state.location, reached via travelTo() from the Gnometropolis town
square, gnometropolis.js/town.js), same "explore, then a % chance per
adventure to spawn the rare boss instead" pattern gnomeCommander/
diggerBot/gnomeKingsCaptain already use — see the *Hunt blocks in
goAdventuring() (combat.js) and the matching *_SPAWN_CHANCE constants
below. Any class can explore any district (regular monsters, regular
loot), but a district's own guardian only ever spawns for the matching
class (state.classTitle check baked into that district's Hunt
condition) — a Card Shark wandering the Garrison just never meets its
watch-captain. Defeating one sets a matching state.&lt;district&gt;
GuardianDefeated flag (winCombat(), combat.js) so it can't be re-farmed
and unlocks approaching the Palace gate. This turns PALACE_GATE_GEAR
(above) from a Bounty Token purchase into a guaranteed combat drop.

Each carries `zone:"&lt;its own district&gt;"` so startCombat()'s
ZONE_DIFFICULTY scaling (combat.js) applies, same as every regular
monster in that district. A past pass (before Gnometropolis became a
town hub) omitted `zone` entirely reasoning "not a wild spawn, so no
zone needed" — true for pool membership, false for the difficulty
multiplier, which left them quietly undertuned; see gnomeKing's own
comment above for the fuller story of that bug. Tuned as a step up from
the Sunless Vault's rare hunts (gnomeKingsCaptain, hp:70/atk:7-12/xp:35,
also zone-scaled) but short of the real gnomeKing (Act 1's true finale,
hp:100/atk:11-17/xp:70): these guard the gate, they aren't the finale
itself. `loot` references the exact PALACE_GATE_GEAR entry for the
matching class directly — this only works because it's written after
the array literal above has already executed; `const` doesn't allow a
true forward reference. winCombat() (combat.js) checks each of these
three by name and forces state.monster.loot through as a guaranteed
drop, same tier of guarantee as a quest-item. art points at
artGarrisonGuardian/artRoguesDenEnforcer/artArcaneSanctumGuardian
(art.js). */
const GARRISON_GUARDIAN_SPAWN_CHANCE = 0.05;
const ROGUESDEN_ENFORCER_SPAWN_CHANCE = 0.05;
const ARCANE_SANCTUM_GUARDIAN_SPAWN_CHANCE = 0.05;
const garrisonGuardian = {
   name:"the Garrison's watch-captain, built like a slammed door", hp:65, atkMin:7, atkMax:11, xp:45, rare:true, zone:"garrison",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"braces like a slammed door and hits back twice as hard" } ],
   art: artGarrisonGuardian, loot: PALACE_GATE_GEAR.find(g => g.class === 'Meathead')
};
/* Evasive rather than tanky/bursty like its two counterparts above —
same dodgeChance mechanic casinoChampion uses (applyDamageToMonster(),
combat.js), fitting a Rogues' Den enforcer who's "already taking side
bets on you" i.e. never where you'd expect. Only one of the three
guardians to also carry a gearDrop, on top of its guaranteed `loot` —
winCombat()'s gearRoll (combat.js) is entirely independent of the
guaranteed-drop machinery `isDistrictGuardianKill` gates, so this is
just a normal chance-based bonus, same as any regular monster's. Zip-
primary, matching the Card Shark's own weapon line
(shopGearItems/Tier2/3/4 above) — the enforcer's version of the same
idea rather than a copy of any specific shop tier. Bonus value (+5)
matches its own zone's regular monsters (garrison/roguesden/sanctum
above) — it had drifted to +1, a leftover from before the per-zone
gearDrop scaling existed, fixed alongside that same correction. */
const roguesDenEnforcer = {
   name:"the Rogues' Den enforcer, already taking side bets on you", hp:65, atkMin:7, atkMax:11, xp:45, rare:true, zone:"roguesden",
   dodgeChance:0.25,
   art: artRoguesDenEnforcer, loot: PALACE_GATE_GEAR.find(g => g.class === 'Card Shark'),
   gearDrop:{name:"the enforcer's own marked deck, edges filed sharp", desc:"Every card's a threat, if you know how to throw it.", type:"equip", slot:"weapon", bonus:{zip:5}, tier:'common', icon: iconCheatersDeck}
};
const arcaneSanctumGuardian = {
   name:"the Arcane Sanctum's warden, muttering an unfinished spell", hp:65, atkMin:7, atkMax:11, xp:45, rare:true, zone:"sanctum",
   skills:[ { type:'bolt', chance:0.25, boltMin:12, boltMax:18, flavor:"finally finishes the spell, unleashing a burst of raw arcane energy" } ],
   art: artArcaneSanctumGuardian, loot: PALACE_GATE_GEAR.find(g => g.class === 'Hexpert')
};

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
rollNewBounty()/claimBounty() in game.js. Reward is paid in Bounty Tokens
(state.bountyTokens), not Pop Tabs — a separate currency meant for a
future gear exchange. */
/* How long a bounty stays active before ensureActiveBounty() (guild.js)
auto-rerolls it, progress and all, even if it was never claimed — keeps
the board from going stale on a bounty the player isn't pursuing. */
const BOUNTY_RESET_MS = 12 * 60 * 60 * 1000;
/* Calendar-day cap on CLAIMS (not attempts) — checkBountyDayReset()
(guild.js) tracks the boundary via state.bountyDayKey (a toDateString(),
so it resets at local midnight, not on a rolling 24h window like
BOUNTY_RESET_MS above). Once hit, ensureActiveBounty() stops offering a
new bounty until the day rolls over. */
const BOUNTY_DAILY_CAP = 2;
/* One bounty per REGULAR monster in monsters[] above — every zone's whole
roster is eligible, not a hand-picked couple of targets — with `count`
set by how often that monster actually shows up, not a flat number.
startCombat() picks uniformly from monsters[] filtered to the current
zone, so a monster's odds per fight are 1/(that zone's monster count):
a zone with more distinct monsters means each one is individually rarer
to run into, so its bounty asks for fewer kills; a zone with fewer types
asks for more — aiming for roughly the same expected number of fights to
clear any bounty, regardless of zone. Clamped to a sane range either way.
Reward still scales with ZONE_DIFFICULTY like everything else here — a
Commons bounty pays less than a Gnometropolis one — independent of that
monster's own individual count. */
const BOUNTY_BASE_ENCOUNTERS = 24;
const BOUNTY_MIN_COUNT = 3;
const BOUNTY_MAX_COUNT = 8;
/* Extracted to a named function (rather than an inline .map() callback)
so mudroot-content.js can generate its own zones' bounty templates the
exact same way, after pushing its own monsters onto the shared
`monsters` array — BOUNTY_TEMPLATES itself is computed once, at
content.js parse time, which is BEFORE mudroot-content.js's own
monsters.push() runs (content.js loads first); without this, Root
Cellar/Mudflats/Bureau would silently never get a bounty template at
all, since this snapshot would already be taken. zoneRoster reads the
GLOBAL `monsters` array (not a passed-in list) specifically so it
still sees every monster actually in that zone regardless of which
file's push added them. */
function makeBountyTemplate(m){
   const zoneRoster = monsters.filter(z => z.zone === m.zone);
   const count = Math.min(BOUNTY_MAX_COUNT, Math.max(BOUNTY_MIN_COUNT,
      Math.round(BOUNTY_BASE_ENCOUNTERS / zoneRoster.length)));
   const bountyTokens = Math.max(1, Math.round((ZONE_DIFFICULTY[m.zone] || 1) * 1.5));
   return {
      id: `bounty_${m.zone}_${zoneRoster.indexOf(m)}`,
      type: 'kill', monsterName: m.name, zone: m.zone, count,
      reward: { bountyTokens },
      };
}
const BOUNTY_TEMPLATES = monsters.map(makeBountyTemplate);

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
             gambling, PLUS a second, independent effect,
             CASINO_WINNINGS_CAP (see its own comment further below) —
             raising the passive-income cap and unlocking it in the
             first place at level 1.
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
/* How many Biscuits a non-free rest costs — was a flat 1, bumped to 2 so
resting is a genuine choice against adventuring, not a rounding error. */
const INN_REST_BISCUIT_COST = 2;
/* Real-time cooldown between rests, independent of the Biscuit economy —
stops one-click infinite resting even with unlimited Biscuits (devMode)
or a maxed-out free-rest chance. See restAtInn()/state.lastInnRestAt. */
const INN_COOLDOWN_MS = 60 * 1000;

/* The Camp (Gnometropolis' town square, gnometropolis.js's restAtCamp())
— same shape as the Inn above (flat Biscuit cost, real-time cooldown,
full HP+MP restore), just no INN_FREE_REST_CHANCE-style upgrade tier
since the Camp isn't part of the Town Lot's buildingUpgrades system.
Resting here (not just visiting the square) is what sets
state.homeTown to 'gnometropolis' — see restAtCamp() itself. */
const CAMP_REST_BISCUIT_COST = 2;
const CAMP_COOLDOWN_MS = 60 * 1000;

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

/* Passive Casino income ("the house's cut", state.casinoWinnings) — 0 at
level 0 means it's inert until the Casino is actually upgraded at least
once, matching "once you upgrade the casino, you get a portion of the
winnings" (separate from CASINO_WIN_BONUS above, which only affects
active gambling odds). Indexed by buildingUpgrades.casino, same as
every other per-level array here.

Unlike the Biscuit economy above (a flat rate, BISCUIT_REGEN_MS, against
a cap that only grows via a separate building upgrade), the Casino's
rate scales WITH its own cap, so every level fills from empty to its own
(bigger) ceiling in roughly the same span of time instead of a bigger
cap just taking proportionally longer. CASINO_WINNINGS_BASE_RATE_MS
pins level 1's own rate at 1 Pop Tab per 3 minutes; CASINO_WINNINGS_FULL_MS
is derived from that (level 1's cap * its rate) rather than a standalone
number, so it can't drift out of sync — level 1 = 3 min/Pop Tab exactly,
level 2 = 1.5 min/Pop Tab, level 3 = ~51s/Pop Tab, all reaching their own
cap in the same ~5 hours. See regenCasinoWinnings() (economy.js), which
derives each level's actual "ms per Pop Tab" from this at regen time. */
const CASINO_WINNINGS_CAP = [0, 100, 200, 350];
const CASINO_WINNINGS_BASE_RATE_MS = 3 * 60 * 1000; /* 1 Pop Tab per 3 min at level 1 */
const CASINO_WINNINGS_FULL_MS = CASINO_WINNINGS_CAP[1] * CASINO_WINNINGS_BASE_RATE_MS;

/* ---------------- Town Lot (Gnometropolis) ---------------- */
/* Act 2's own version of the Town Lot above — same buy-then-upgrade
shape (buyGnomeTownLot()/upgradeGnomeBuilding(), gnometropolis.js), but
deliberately kept as a fully separate state slot (state.gnomeLotTier/
state.gnomeBuildingUpgrades, core.js) rather than reusing
state.lotTier/state.buildingUpgrades with a hub-keyed lookup — the Act
2 plan flagged that as the "properly generalized" version of this
system, but doing it for real means touching every existing Gladstone
Town Lot reference (a real risk to an already-shipped, well-tested
Act 1 feature) for the sake of a SECOND town, when the win only shows
up at a third. Revisit if/when a third town actually needs this.

Only 3 buildings get a slot here — the Camp, the new Guild, and the new
Shop — not the three districts (garrison/roguesden/sanctum) or the
Palace, since those aren't services yet (still ADVENTURE_ZONES
exploration / a one-time boss gate, not buildings you'd "upgrade" the
way a shop or inn levels up). Add them once the Act 2 plan's deferred
class-area conversion actually happens.

Like Gladstone's own BUILDING_UPGRADES when it first shipped, none of
these three levels do anything mechanical yet — this is the same
"data layer first, wire the effects later" pass Act 1's own Town Lot
went through (see that section's own comment above). buildingEffectDesc()
(render-shop.js) already no-ops gracefully for a key with no
BUILDING_EFFECT_INFO entry, so shipping the cosmetic shell now and
wiring real bonuses later needs no further plumbing changes. */
const GNOME_LOT_TIER_NAMES = ['Empty Vault', 'Reclaimed Vault', 'Reclaimed Vault (Reinforced)', 'The Regent\'s Hall'];
const GNOME_LOT_TIER_COST = [0, 300, 1200, 2700];
const GNOME_LOT_TIER_MAX = GNOME_LOT_TIER_COST.length - 1;
const GNOME_BUILDING_UPGRADES = [
   { key:'camp', name:'The Camp' },
   { key:'gnomeguild', name:'The Guild' },
   { key:'gnomeshop', name:'The Shop' },
   ];
const GNOME_BUILDING_UPGRADE_MAX = 3;
/* Same quadratic shape as buildingUpgradeCost() above, scaled up to
match the Gnometropolis Town Lot's own steeper price curve: 300/1200/2700. */
function gnomeBuildingUpgradeCost(level){ return 300 * (level+1) * (level+1); }
