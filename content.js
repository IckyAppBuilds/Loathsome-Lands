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
(grit), of the Loon (hoodoo). This is a STAT label only, unrelated to
player class — it reads the same on a class-free item as a
class-gated one.

Per explicit correction, every gearDrop before Gnometropolis
(Commons/Sewers/Quarry/Vault) is class-FREE — no `classRequired` at
all, same as `starterGear` above — since a player can easily still be
classless this early (the Adventurer's Trial only opens at
`quest2Complete && level>=10`, well inside this zone range). Garrison/
Rogues' Den/the Arcane Sanctum (Gnometropolis's own districts, tied to
the class trial itself) are where `classRequired` gear actually
starts; everything from there through the rest of the game stays
class-gated as before. Also per a later explicit request, every one of
these 4 zones' gearDrop sets now covers all 5 equip slots (not just
whichever few the original handful of regulars happened to land on) —
each zone got a batch of new regulars purely to round that out, same
"specific flavor item per monster" shape as the originals, just
without a class tag.

Every regular (non-rare) monster below also carries exactly one
skills[] entry now (heal/buff/bolt only — `debuff`/burn/poison/freeze
stays reserved for named bosses, a "this is a real fight" signal).
TRASH_SKILL_CHANCE is the one shared chance every trash skill uses —
declared here, ahead of this array, since it's referenced inside the
array literal itself (evaluated immediately at parse time, unlike the
MONSTER_HP_PER_GRIT-style constants further down this file, which
only get read inside function bodies called later — a `const`
declared after this point would still throw a temporal-dead-zone
ReferenceError the moment this array tried to evaluate it). Each
skill's own heal/bolt magnitude is hand-computed per monster from that
same monster's own derived atkMin/atkMax/hp (deriveMonsterCombatStats(),
combat.js, scaled by its zone's ZONE_DIFFICULTY) — bolt ~1.3x its
normal swing, heal 8-15% of its own max hp, buff a flat 1.3x for 2
turns (toned down from a boss's own 1.5-1.7x) — not an arbitrary
per-monster number. */
const TRASH_SKILL_CHANCE = 0.12;
const monsters = [
   { name:"a disgruntled compost gnome", ...MONSTER_STATS["a disgruntled compost gnome"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"digs a fresh handful of compost into the wound, muttering about nutrients" } ],
    art: artCompostGnome, loot:{name:"fistful of righteous soil", desc:"Smells like victory and mulch.", type:"junk", sell:1, icon:iconSoil},
    rareDrop:{name:"gnome-sized medal of composting excellence", desc:"Awarded by nobody. Cherished anyway.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"compost-crusted trowel of the Badger", desc:"Sharpened on rocks, mostly by accident.", type:"equip", slot:"weapon", bonus:{beef:1}, tier:'common', icon:iconRakeShank} },
   { name:"a feral lawn gnome, off its stake", ...MONSTER_STATS["a feral lawn gnome, off its stake"], zone:"commons",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"yanks free of an invisible stake and charges harder" } ],
    art: artGnomeFeral, loot:{name:"bent rake tine", desc:"Still menacing, somehow.", type:"quest", key:"rakeTine", sell:2, icon:iconRakeTine},
    rareDrop:{name:"stake-shaped good luck charm", desc:"Whittled by whoever this gnome escaped from.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"stake-notched shin guard of the Weasel", desc:"Salvaged off the stake it was chained to.", type:"equip", slot:"legs", bonus:{zip:1}, tier:'common', icon:iconShinGuard} },
   { name:"a fishing gnome with an empty bucket", ...MONSTER_STATS["a fishing gnome with an empty bucket"], zone:"commons",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:2, boltMax:2, flavor:"hurls the empty bucket, lure and all" } ],
    art: artGnomeFishing, loot:{name:"suspiciously confident lure", desc:"Has never once caught anything.", type:"junk", sell:2, icon:iconLure},
    rareDrop:{name:"actually-lucky fishing lure", desc:"This one's clearly caught something, at some point.", type:"junk", sell:11, icon:iconFigurine},
    gearDrop:{name:"waterlogged fishing hat of the Loon", desc:"Smells like pond. You get used to it.", type:"equip", slot:"head", bonus:{hoodoo:1}, tier:'common', icon:iconPotLid} },
   { name:"a gnome cavalry unit, mounted on a garden snail", ...MONSTER_STATS["a gnome cavalry unit, mounted on a garden snail"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"the snail pauses just long enough for a breather" } ],
    art: artGnomeSnail, loot:{name:"spiral shell fragment", desc:"Still faintly slimy.", type:"junk", sell:3, icon:iconShellFragment},
    rareDrop:{name:"snail-slime polished pebble", desc:"Smooth as glass. Smells faintly of victory.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"snail-shell breastplate of the Badger", desc:"Surprisingly load-bearing, for a shell.", type:"equip", slot:"chest", bonus:{beef:1}, tier:'common', icon:iconVest} },
   { name:"the self-appointed gnome sergeant", ...MONSTER_STATS["the self-appointed gnome sergeant"], zone:"commons",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"barks an order at absolutely no one and feels better for it" } ],
    art: artGnomeSergeant, loot:{name:"tiny sergeant's whistle", desc:"Blowing it clears your head a little.", type:"mp", value:4, icon:iconWhistle},
    rareDrop:{name:"the sergeant's secret stash of medals", desc:"Every one of them self-awarded.", type:"junk", sell:12, icon:iconFigurine},
    gearDrop:{name:"sergeant's spit-shined boots of the Weasel", desc:"Standard issue. Aggressively polished.", type:"equip", slot:"boots", bonus:{zip:1}, tier:'common', icon:iconSpringBoots} },
   /* Per a later explicit request, every zone's gearDrop set needs to
   cover all 5 equip slots, not just whichever few a handful of
   regulars happened to land on. These 10 round out Commons' own
   roster. Per further explicit correction: everything before
   Gnometropolis (Commons/Sewers/Quarry/Vault) is class-FREE gear —
   no classRequired at all, same as starterGear — since a player can
   easily still be classless this early. Garrison/Rogues' Den/the
   Arcane Sanctum (Gnometropolis's own districts, tied to the class
   trial) are where classRequired gear actually starts. */
   { name:"a gnome beekeeper, trailing an unbothered swarm", ...MONSTER_STATS["a gnome beekeeper, trailing an unbothered swarm"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"the swarm patches the gap in the veil before it even notices" } ],
    art: artGnomeBeekeeper, loot:{name:"dented beekeeper's veil", desc:"Smells like smoke and quiet confidence.", type:"junk", sell:3, icon:iconPotLid},
    rareDrop:{name:"a jar of suspiciously potent honey", desc:"One spoonful and you feel ready for anything.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"beekeeper's veil-dented hood of the Badger", desc:"Still smells faintly of smoke.", type:"equip", slot:"head", bonus:{beef:1}, tier:'common', icon:iconPotLid} },
   { name:"a gnome scarecrow, somehow still standing guard", ...MONSTER_STATS["a gnome scarecrow, somehow still standing guard"], zone:"commons",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"straightens a sagging post and squares back up" } ],
    art: artGnomeScarecrow, loot:{name:"fistful of straw stuffing", desc:"Somehow still holding its shape.", type:"junk", sell:2, icon:iconSoil},
    rareDrop:{name:"the scarecrow's own lucky button eye", desc:"Watched over this field longer than anyone's been counting.", type:"junk", sell:11, icon:iconFigurine},
    gearDrop:{name:"scarecrow's stuffed trouser-leg of the Badger", desc:"Straw-packed. Surprisingly sturdy.", type:"equip", slot:"legs", bonus:{beef:1}, tier:'common', icon:iconTrousers} },
   { name:"a gnome plumber, wrench first into every problem", ...MONSTER_STATS["a gnome plumber, wrench first into every problem"], zone:"commons",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:4, boltMax:5, flavor:"swings the wrench like every problem is a stuck pipe" } ],
    art: artGnomePlumber, loot:{name:"bent plumbing wrench", desc:"Fixed exactly one thing, once, by accident.", type:"junk", sell:2, icon:iconPipeFitting},
    rareDrop:{name:"a wrench that fixes everything on the first try", desc:"The plumber never figured out why. Neither will you.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"plumber's grease-stained boots of the Badger", desc:"Never quite dry. Never quite need to be.", type:"equip", slot:"boots", bonus:{beef:1}, tier:'common', icon:iconSpringBoots} },
   { name:"a gnome herald, announcing nothing to no one", ...MONSTER_STATS["a gnome herald, announcing nothing to no one"], zone:"commons",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"announces its own charge, loudly, to itself" } ],
    art: artGnomeHerald, loot:{name:"crumpled proclamation scroll", desc:"Announces something. Illegible which.", type:"junk", sell:2, icon:iconSurveyMap},
    rareDrop:{name:"a proclamation that's actually worth reading", desc:"Whoever wrote this one meant it.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"herald's crumpled hat of the Weasel", desc:"Been announced at by this hat more than once.", type:"equip", slot:"head", bonus:{zip:1}, tier:'common', icon:iconCap} },
   { name:"a gnome tailor, pins still in both sleeves", ...MONSTER_STATS["a gnome tailor, pins still in both sleeves"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"stitches the tear shut with whatever thread's closest" } ],
    art: artGnomeTailor, loot:{name:"pin-cushion, mostly pins", desc:"You'll find out the hard way if you squeeze it.", type:"junk", sell:3, icon:iconCoatButton},
    rareDrop:{name:"a perfectly tailored good luck charm", desc:"Fits exactly right. Unsettlingly right.", type:"luck", hpValue:8, mpValue:4, icon:iconClover},
    gearDrop:{name:"tailor's pin-cushion vest of the Weasel", desc:"Mind the pins. There are always more pins.", type:"equip", slot:"chest", bonus:{zip:1}, tier:'common', icon:iconVest} },
   { name:"a gnome duelist, challenging shrubs to honor combat", ...MONSTER_STATS["a gnome duelist, challenging shrubs to honor combat"], zone:"commons",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:4, boltMax:6, flavor:"lunges at you the same way it lunges at hedges" } ],
    art: artGnomeDuelist, loot:{name:"bent dueling foil", desc:"Undefeated, against shrubbery.", type:"junk", sell:3, icon:iconRakeTine},
    rareDrop:{name:"the duelist's own undefeated streak, framed", desc:"Every win was against a bush. Still counts, apparently.", type:"junk", sell:12, icon:iconFigurine},
    gearDrop:{name:"duelist's bent foil of the Weasel", desc:"Still carries the dents from a particularly stubborn hedge.", type:"equip", slot:"weapon", bonus:{zip:1}, tier:'common', icon:iconCardShank} },
   { name:"a gnome librarian, overdue fines decades deep", ...MONSTER_STATS["a gnome librarian, overdue fines decades deep"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"consults a footnote and feels inexplicably better" } ],
    art: artGnomeLibrarian, loot:{name:"overdue library card", desc:"The fines alone could fund a small army.", type:"junk", sell:2, icon:iconVizierLedger},
    rareDrop:{name:"a book that's actually worth the fine", desc:"Finally, one worth the wait.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"librarian's dog-eared cardigan of the Loon", desc:"Smells like old paper and quiet judgment.", type:"equip", slot:"chest", bonus:{hoodoo:1}, tier:'common', icon:iconScorchRobe} },
   { name:"a gnome weathervane-keeper, pointing the wrong way on principle", ...MONSTER_STATS["a gnome weathervane-keeper, pointing the wrong way on principle"], zone:"commons",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"turns itself to face a wind only it can feel" } ],
    art: artGnomeWeathervaneKeeper, loot:{name:"rust-stuck weathervane arrow", desc:"Points confidently in exactly the wrong direction.", type:"junk", sell:3, icon:iconGear},
    rareDrop:{name:"a weathervane that's actually right, for once", desc:"Pointed true north. Everyone's still suspicious of it.", type:"junk", sell:11, icon:iconFigurine},
    gearDrop:{name:"weathervane-keeper's drafty trousers of the Loon", desc:"Lets in the wind from every direction at once.", type:"equip", slot:"legs", bonus:{hoodoo:1}, tier:'common', icon:iconTrousers} },
   { name:"a gnome mushroom-forager, convinced every one is edible", ...MONSTER_STATS["a gnome mushroom-forager, convinced every one is edible"], zone:"commons",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:4, boltMax:6, flavor:"flings a handful of foraged mushrooms, edible or not" } ],
    art: artGnomeForager, loot:{name:"foraged mushroom, probably fine", desc:"Probably. You're not eating it to find out.", type:"junk", sell:3, icon:iconSoil},
    rareDrop:{name:"a genuinely rare mushroom, glowing faintly", desc:"Finally, one the forager actually identified correctly.", type:"luck", hpValue:9, mpValue:5, icon:iconClover},
    gearDrop:{name:"forager's mismatched boots of the Loon", desc:"Picked up one mushroom stain per outing, give or take.", type:"equip", slot:"boots", bonus:{hoodoo:1}, tier:'common', icon:iconMismatchedBoots} },
   { name:"a gnome fortune-teller, reading tea leaves upside down", ...MONSTER_STATS["a gnome fortune-teller, reading tea leaves upside down"], zone:"commons",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"reads a fortune that's suspiciously, specifically helpful" } ],
    art: artGnomeFortuneTeller, loot:{name:"soggy tea leaves", desc:"Definitely spell something. Probably not anything good.", type:"junk", sell:2, icon:iconLure},
    rareDrop:{name:"a fortune that actually comes true", desc:"Said you'd find something valuable today. Rude, but accurate.", type:"junk", sell:10, icon:iconFigurine},
    gearDrop:{name:"fortune-teller's crooked wand of the Loon", desc:"Points at whatever the fortune said it would.", type:"equip", slot:"weapon", bonus:{hoodoo:1}, tier:'common', icon:iconWandStick} },
   { name:"a sewer rat with delusions of grandeur", ...MONSTER_STATS["a sewer rat with delusions of grandeur"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:6, boltMax:7, flavor:"flings a gnawed pipe fitting with surprising venom" } ],
    art: artSewerRat, loot:{name:"slightly damp rat tail", desc:"You're not sure why you kept this.", type:"junk", sell:2, icon:iconRatTail},
    rareDrop:{name:"rat king's tiny crown", desc:"Delusions of grandeur, it turns out, were warranted.", type:"luck", hpValue:10, mpValue:5, icon:iconClover},
    gearDrop:{name:"rat-gnawed divining rod of the Loon", desc:"Points at whatever it feels like, confidently.", type:"equip", slot:"weapon", bonus:{hoodoo:2}, tier:'common', icon:iconWandStick} },
   { name:"a rat wearing a bottlecap as a helmet", ...MONSTER_STATS["a rat wearing a bottlecap as a helmet"], zone:"sewers",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"straightens the dented bottlecap and soldiers on" } ],
    art: artRatHelmet, loot:{name:"dented bottlecap helmet", desc:"Barely fits a rat. Definitely doesn't fit you.", type:"junk", sell:3, icon:iconBottlecapHelmet},
    rareDrop:{name:"helmet dented in a suspiciously lucky pattern", desc:"Every dent lines up with a near-miss.", type:"junk", sell:15, icon:iconFigurine},
    gearDrop:{name:"bottlecap-studded skullcap of the Badger", desc:"Rat-sized, once. Stretched since.", type:"equip", slot:"head", bonus:{beef:2}, tier:'common', icon:iconPotLid} },
   { name:"a positively enormous sewer rat", ...MONSTER_STATS["a positively enormous sewer rat"], zone:"sewers",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"puffs up to twice its already considerable size" } ],
    art: artGiantSewerRat, loot:{name:"rat-gnawed pipe fitting", desc:"Chewed clean through solid metal. Concerning.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"glowing sewer pearl", desc:"You don't ask how it got down here. Or how it glows.", type:"luck", hpValue:10, mpValue:5, icon:iconClover},
    gearDrop:{name:"rat-hide vest of the Weasel", desc:"Roomier than you'd expect. Best not to think why.", type:"equip", slot:"chest", bonus:{zip:2}, tier:'common', icon:iconVest} },
   { name:"three rats in a trenchcoat, unconvincingly", ...MONSTER_STATS["three rats in a trenchcoat, unconvincingly"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:6, boltMax:7, flavor:"the bottom rat throws a wild haymaker that somehow connects" } ],
    art: artRatTrenchcoat, loot:{name:"comically oversized coat button", desc:"None of the three rats will admit to owning this.", type:"junk", sell:3, icon:iconCoatButton},
    rareDrop:{name:"the trenchcoat's secret inside pocket, still full", desc:"Whatever they were hiding, it's yours now.", type:"junk", sell:16, icon:iconFigurine},
    gearDrop:{name:"trenchcoat's spare trouser leg of the Loon", desc:"The other two rats never noticed it was missing.", type:"equip", slot:"legs", bonus:{hoodoo:2}, tier:'common', icon:iconQuickstepTrousers} },
   /* Same gap-filling, class-free pass as Commons' own comment above
   explains — 11 more Sewers regulars. */
   { name:"a sewer brawler rat, squaring up for no reason", ...MONSTER_STATS["a sewer brawler rat, squaring up for no reason"], zone:"sewers",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"squares up at its own reflection in the muck" } ],
    art: artSewerBrawlerRat, loot:{name:"chewed-up boxing wrap", desc:"Wrapped around nothing in particular.", type:"junk", sell:3, icon:iconRatTail},
    rareDrop:{name:"the brawler's undefeated reflection", desc:"Still hasn't lost a fight against itself.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"brawler-rat's quilted vest of the Badger", desc:"Padded against hits that mostly never land.", type:"equip", slot:"chest", bonus:{beef:2}, tier:'common', icon:iconVest} },
   { name:"a drainpipe crawler, bowlegged from the pipes", ...MONSTER_STATS["a drainpipe crawler, bowlegged from the pipes"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:6, boltMax:8, flavor:"kicks off a pipe wall for extra momentum" } ],
    art: artDrainpipeCrawler, loot:{name:"flattened pipe segment", desc:"Shaped exactly like whatever it last crawled through.", type:"junk", sell:3, icon:iconPipeFitting},
    rareDrop:{name:"a pipe segment that's somehow still warm", desc:"Warm pipes in a sewer. You decide not to investigate.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"crawler's bowlegged greaves of the Badger", desc:"Shaped by years of squeezing through tight pipe.", type:"equip", slot:"legs", bonus:{beef:2}, tier:'common', icon:iconBurrowGreaves} },
   { name:"a muck-strider rat, surprisingly sure-footed in sludge", ...MONSTER_STATS["a muck-strider rat, surprisingly sure-footed in sludge"], zone:"sewers",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"wades into its own muck and comes out steadier" } ],
    art: artMuckStriderRat, loot:{name:"sludge-caked whisker", desc:"Keeps its balance even caked in the stuff.", type:"junk", sell:3, icon:iconOreGrit},
    rareDrop:{name:"a sludge-proof good luck charm", desc:"Still works, even covered in muck.", type:"luck", hpValue:10, mpValue:5, icon:iconClover},
    gearDrop:{name:"muck-strider's suction boots of the Badger", desc:"Never once slip, no matter how deep the sludge.", type:"equip", slot:"boots", bonus:{beef:2}, tier:'common', icon:iconGripBoots} },
   { name:"a rust-fanged rat, gnawing on a pipe like a weapon", ...MONSTER_STATS["a rust-fanged rat, gnawing on a pipe like a weapon"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:7, boltMax:8, flavor:"swings the gnawed pipe like it's always been a weapon" } ],
    art: artRustFangedRat, loot:{name:"rust-flecked fang", desc:"Chewed through more metal than teeth should allow.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"a fang sharp enough to actually be useful", desc:"You could do something with this. You're not sure what yet.", type:"junk", sell:15, icon:iconFigurine},
    gearDrop:{name:"rust-fanged rat's own gnawed pipe of the Badger", desc:"Still has tooth marks all down the shaft.", type:"equip", slot:"weapon", bonus:{beef:2}, tier:'common', icon:iconPipeFitting} },
   { name:"a shadow-slick rat, darting between grates", ...MONSTER_STATS["a shadow-slick rat, darting between grates"], zone:"sewers",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"slips through a grate and comes out the other side quicker" } ],
    art: artShadowSlickRat, loot:{name:"grate-scraped fur tuft", desc:"Left behind squeezing through somewhere it shouldn't fit.", type:"junk", sell:3, icon:iconRatTail},
    rareDrop:{name:"a grate key that opens more than one grate", desc:"Shouldn't work on all of them. Does anyway.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"shadow-slick rat's own slick cap of the Weasel", desc:"Still damp. Still somehow fits through anything.", type:"equip", slot:"head", bonus:{zip:2}, tier:'common', icon:iconCap} },
   { name:"a quick-paws rat, light on its feet in the muck", ...MONSTER_STATS["a quick-paws rat, light on its feet in the muck"], zone:"sewers",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"dances back out of range and catches its breath" } ],
    art: artQuickPawsRat, loot:{name:"a suspiciously clean paw-print", desc:"Not one speck of muck on it. Impressive, honestly.", type:"junk", sell:3, icon:iconOreGrit},
    rareDrop:{name:"a pair of genuinely quick paw-prints, framed", desc:"The fastest thing in the sewers, by its own account.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"quick-paws rat's own light leggings of the Weasel", desc:"Barely touch the muck at all.", type:"equip", slot:"legs", bonus:{zip:2}, tier:'common', icon:iconTrousers} },
   { name:"a grate-runner rat, never missing a foothold", ...MONSTER_STATS["a grate-runner rat, never missing a foothold"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:7, boltMax:8, flavor:"leaps off a grate for extra height on the swing" } ],
    art: artGrateRunnerRat, loot:{name:"a worn-smooth grate bar", desc:"Polished to a shine by a hundred quick footsteps.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"a grate that's somehow always unlocked for it", desc:"Never explained how. Never asked twice.", type:"junk", sell:15, icon:iconFigurine},
    gearDrop:{name:"grate-runner's own sure-grip boots of the Weasel", desc:"Never once miss a foothold, grate or no grate.", type:"equip", slot:"boots", bonus:{zip:2}, tier:'common', icon:iconMismatchedBoots} },
   { name:"a scrap-blade rat, armed with a shard of tin", ...MONSTER_STATS["a scrap-blade rat, armed with a shard of tin"], zone:"sewers",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"presses the flat of the tin shard against the wound, oddly gently" } ],
    art: artScrapBladeRat, loot:{name:"a bent tin shard", desc:"Sharp enough to be concerning, dull enough to be fine.", type:"junk", sell:3, icon:iconPipeFitting},
    rareDrop:{name:"a tin shard with a genuine edge", desc:"Actually sharp, for once. The rat seemed surprised too.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"scrap-blade rat's own tin shiv of the Weasel", desc:"Bent twice, still holds an edge.", type:"equip", slot:"weapon", bonus:{zip:2}, tier:'common', icon:iconCardShank} },
   { name:"a sewer soothsayer rat, muttering prophecy into the drains", ...MONSTER_STATS["a sewer soothsayer rat, muttering prophecy into the drains"], zone:"sewers",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"mutters something into the drain that sounds a lot like encouragement" } ],
    art: artSewerSoothsayerRat, loot:{name:"a muttered, half-heard prophecy", desc:"Something about pipes. Possibly about you.", type:"junk", sell:3, icon:iconLure},
    rareDrop:{name:"a prophecy that actually comes true", desc:"Said exactly what would happen next. Unsettling, but useful.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"soothsayer rat's own drain-whisper hood of the Loon", desc:"Still echoes faintly if you hold it to your ear.", type:"equip", slot:"head", bonus:{hoodoo:2}, tier:'common', icon:iconPotLid} },
   { name:"a glow-moss rat, faintly luminous in the dark", ...MONSTER_STATS["a glow-moss rat, faintly luminous in the dark"], zone:"sewers",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:6, boltMax:8, flavor:"flares a faint, sickly green for just a second" } ],
    art: artGlowMossRat, loot:{name:"a scrap of glowing moss", desc:"Keeps glowing for a few hours after you pick it off.", type:"junk", sell:4, icon:iconCapturedLight},
    rareDrop:{name:"a chunk of moss that never stops glowing", desc:"Been glowing since you picked it up. Hasn't dimmed once.", type:"junk", sell:15, icon:iconFigurine},
    gearDrop:{name:"glow-moss rat's own luminous vest of the Loon", desc:"Gives off just enough light to read by, barely.", type:"equip", slot:"chest", bonus:{hoodoo:2}, tier:'common', icon:iconScorchRobe} },
   { name:"a silt-stepper rat, leaving no print in the muck", ...MONSTER_STATS["a silt-stepper rat, leaving no print in the muck"], zone:"sewers",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"settles into the silt and it closes seamlessly around the wound" } ],
    art: artSiltStepperRat, loot:{name:"undisturbed silt, somehow", desc:"Should have a print in it. Doesn't.", type:"junk", sell:3, icon:iconOreGrit},
    rareDrop:{name:"a patch of silt that remembers every step", desc:"Shows a perfect trail, just this once.", type:"junk", sell:14, icon:iconFigurine},
    gearDrop:{name:"silt-stepper rat's own silent boots of the Loon", desc:"Leave the silt exactly as they found it.", type:"equip", slot:"boots", bonus:{hoodoo:2}, tier:'common', icon:iconWardedSlippers} },
   { name:"a wind-up quarry drone, badly wound", ...MONSTER_STATS["a wind-up quarry drone, badly wound"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"rewinds its own spring with a pained creak" } ],
    art: artQuarryDrone, loot:{name:"stripped brass gear", desc:"Still spins if you flick it. Mostly for fun now.", type:"junk", sell:4, icon:iconGear},
    rareDrop:{name:"drone's still-humming power core", desc:"Warm, faintly ticking, best not examined too closely.", type:"junk", sell:19, icon:iconFigurine},
    gearDrop:{name:"drone's stripped control wand of the Badger", desc:"Still beeps if you squeeze it just right.", type:"equip", slot:"weapon", bonus:{beef:3}, tier:'common', icon:iconVizierScepter} },
   { name:"a gnome surveyor squinting at an upside-down map", ...MONSTER_STATS["a gnome surveyor squinting at an upside-down map"], zone:"quarry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"consults the upside-down map and charges the wrong, more aggressive way" } ],
    art: artGnomeSurveyor, loot:{name:"crumpled survey map", desc:"Confidently wrong about where you are.", type:"junk", sell:3, icon:iconSurveyMap},
    rareDrop:{name:"compass that always points to safety", desc:"Not north. Safety. Somehow more useful.", type:"luck", hpValue:12, mpValue:6, icon:iconClover},
    gearDrop:{name:"surveyor's dented hard-hat of the Weasel", desc:"Confidently the wrong size. Sturdy anyway.", type:"equip", slot:"head", bonus:{zip:3}, tier:'common', icon:iconGuardHelm} },
   { name:"a pickaxe golem, held together by spite", ...MONSTER_STATS["a pickaxe golem, held together by spite"], zone:"quarry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:11, boltMax:13, flavor:"swings its pickaxe in a wide, reckless arc" } ],
    art: artPickaxeGolem, loot:{name:"chipped pickaxe head", desc:"Has seen better decades.", type:"junk", sell:5, icon:iconPickaxeHead},
    rareDrop:{name:"fist-sized nugget of pure stubbornness", desc:"Heavier than it should be. Refuses to be dropped.", type:"junk", sell:20, icon:iconFigurine},
    gearDrop:{name:"golem's chipped chest-plating of the Loon", desc:"Held together by spite, same as the rest of it.", type:"equip", slot:"chest", bonus:{hoodoo:3}, tier:'common', icon:iconClockworkPlate} },
   { name:"a rock-crusted quarry rat, huge for some reason", ...MONSTER_STATS["a rock-crusted quarry rat, huge for some reason"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"licks a wound closed, entirely unbothered" } ],
    art: artQuarryRat, loot:{name:"fistful of ore-flecked grit", desc:"Somewhere between dirt and treasure. Mostly dirt.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"rat-gnawed lucky pebble (not a rabbit's foot)", desc:"The rat was very clear on that point, somehow.", type:"luck", hpValue:12, mpValue:6, icon:iconClover},
    gearDrop:{name:"ore-crusted quarry boots of the Badger", desc:"Better footing than they have any right to give.", type:"equip", slot:"boots", bonus:{beef:3}, tier:'common', icon:iconGripBoots} },
   /* Same gap-filling, class-free pass as Commons' own comment above
   explains — 11 more Quarry regulars. */
   { name:"a quarry foreman gnome, barking orders nobody follows", ...MONSTER_STATS["a quarry foreman gnome, barking orders nobody follows"], zone:"quarry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"barks an order at the rock face, which obeys about as well as you do" } ],
    art: artQuarryForeman, loot:{name:"a dog-eared work order", desc:"Illegible, urgent-looking, probably important.", type:"junk", sell:4, icon:iconSurveyMap},
    rareDrop:{name:"a work order that's actually finished", desc:"Every box checked. Nobody believes it.", type:"junk", sell:18, icon:iconFigurine},
    gearDrop:{name:"foreman's dented hard-hat of the Tortoise", desc:"Been shouted under more than it's ever been dropped on.", type:"equip", slot:"head", bonus:{grit:3}, tier:'common', icon:iconGuardHelm} },
   { name:"a stone-hauler gnome, built like the rocks it carries", ...MONSTER_STATS["a stone-hauler gnome, built like the rocks it carries"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"sets the boulder down and rolls its shoulders back into place" } ],
    art: artStoneHaulerGnome, loot:{name:"a fist-sized hauling stone", desc:"Could probably bench press this. Could not.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"a stone that's suspiciously easy to lift", desc:"Should weigh a ton. Feels like a pebble.", type:"junk", sell:18, icon:iconFigurine},
    gearDrop:{name:"stone-hauler's braced chest-wrap of the Tortoise", desc:"Held together by sheer stubbornness and rope.", type:"equip", slot:"chest", bonus:{grit:3}, tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a scaffold-climber gnome, fearless about heights", ...MONSTER_STATS["a scaffold-climber gnome, fearless about heights"], zone:"quarry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:8, boltMax:10, flavor:"drops straight off the scaffold onto you" } ],
    art: artScaffoldClimberGnome, loot:{name:"a loose scaffold bolt", desc:"Probably shouldn't have been loose.", type:"junk", sell:4, icon:iconPipeFitting},
    rareDrop:{name:"a bolt that was somehow load-bearing the whole time", desc:"The scaffold's still standing, against all odds.", type:"junk", sell:17, icon:iconFigurine},
    gearDrop:{name:"climber's rope-wrapped greaves of the Badger", desc:"Scuffed from a hundred scaffold landings.", type:"equip", slot:"legs", bonus:{beef:3}, tier:'common', icon:iconBurrowGreaves} },
   { name:"a blast-charge gnome, handling dynamite with alarming confidence", ...MONSTER_STATS["a blast-charge gnome, handling dynamite with alarming confidence"], zone:"quarry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:8, boltMax:11, flavor:"lights a fuse that's definitely too short" } ],
    art: artBlastChargeGnome, loot:{name:"an unlit stick of mining charge", desc:"You carry this very, very carefully.", type:"junk", sell:5, icon:iconPipeFitting},
    rareDrop:{name:"a charge that somehow never actually goes off", desc:"Still ticking, metaphorically. You're not opening it.", type:"junk", sell:19, icon:iconFigurine},
    gearDrop:{name:"blast-gnome's scorch-flecked vest of the Weasel", desc:"Survived more close calls than it should have.", type:"equip", slot:"chest", bonus:{zip:3}, tier:'common', icon:iconVest} },
   { name:"a tunnel-runner gnome, quick through narrow shafts", ...MONSTER_STATS["a tunnel-runner gnome, quick through narrow shafts"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"ducks into a side-shaft and comes back out steadier" } ],
    art: artTunnelRunnerGnome, loot:{name:"a scrap of shaft-marking chalk", desc:"Marks a trail only the runner could follow.", type:"junk", sell:4, icon:iconSurveyMap},
    rareDrop:{name:"a chalk mark leading somewhere actually useful", desc:"For once, the trail goes somewhere worth going.", type:"junk", sell:17, icon:iconFigurine},
    gearDrop:{name:"runner's narrow-fit leggings of the Weasel", desc:"Tailored tight enough to clear the narrowest shaft.", type:"equip", slot:"legs", bonus:{zip:3}, tier:'common', icon:iconTrousers} },
   { name:"a rockslide-dodger gnome, light on crumbling ground", ...MONSTER_STATS["a rockslide-dodger gnome, light on crumbling ground"], zone:"quarry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"skips sideways off a crumbling ledge like it's nothing" } ],
    art: artRockslideDodgerGnome, loot:{name:"a pebble that was almost a boulder", desc:"Relatively speaking, you got lucky too.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"a pebble worn perfectly smooth by near-misses", desc:"This has dodged a lot of rockslides.", type:"luck", hpValue:12, mpValue:6, icon:iconClover},
    gearDrop:{name:"dodger's quick-step boots of the Weasel", desc:"Never once caught under a falling rock.", type:"equip", slot:"boots", bonus:{zip:3}, tier:'common', icon:iconSpringBoots} },
   { name:"a chisel-wielding gnome, striking with surprising precision", ...MONSTER_STATS["a chisel-wielding gnome, striking with surprising precision"], zone:"quarry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:9, boltMax:11, flavor:"strikes with the precision of decades of stonework" } ],
    art: artChiselGnome, loot:{name:"a worn stone chisel", desc:"Sharpened down to half its original size.", type:"junk", sell:4, icon:iconPickaxeHead},
    rareDrop:{name:"a chisel that cuts stone like butter", desc:"Whatever it's made of, it isn't regular steel.", type:"junk", sell:18, icon:iconFigurine},
    gearDrop:{name:"chisel-gnome's own striking tool of the Weasel", desc:"Worn down to a fine, deadly point.", type:"equip", slot:"weapon", bonus:{zip:3}, tier:'common', icon:iconCardShank} },
   { name:"a quarry surveyor's apprentice gnome, reading maps upside down too", ...MONSTER_STATS["a quarry surveyor's apprentice gnome, reading maps upside down too"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"consults the upside-down map for medical advice, somehow correctly" } ],
    art: artQuarrySurveyorApprentice, loot:{name:"a half-finished survey sketch", desc:"The proportions are all wrong. Confidently so.", type:"junk", sell:4, icon:iconSurveyMap},
    rareDrop:{name:"a survey sketch that's actually accurate", desc:"The apprentice got one right. Frame it.", type:"junk", sell:17, icon:iconFigurine},
    gearDrop:{name:"apprentice's own crooked cap of the Tortoise", desc:"Worn sideways. On purpose, probably.", type:"equip", slot:"head", bonus:{grit:3}, tier:'common', icon:iconCap} },
   { name:"a crystal-diviner gnome, led by a twitching rod", ...MONSTER_STATS["a crystal-diviner gnome, led by a twitching rod"], zone:"quarry",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the rod twitches hard and it lunges after it" } ],
    art: artCrystalDivinerGnome, loot:{name:"a bent divining rod", desc:"Points reliably at the nearest rock. Every rock.", type:"junk", sell:4, icon:iconVeinGemstone},
    rareDrop:{name:"a divining rod that actually finds something", desc:"Pointed at a real vein, for once.", type:"junk", sell:18, icon:iconFigurine},
    gearDrop:{name:"diviner's twitch-worn leggings of the Tortoise", desc:"Scuffed from being yanked sideways, constantly.", type:"equip", slot:"legs", bonus:{grit:3}, tier:'common', icon:iconFeatherScale} },
   { name:"a tremor-sensing gnome, feeling the rock before it falls", ...MONSTER_STATS["a tremor-sensing gnome, feeling the rock before it falls"], zone:"quarry",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"feels the tremor coming and braces before it lands" } ],
    art: artTremorSensingGnome, loot:{name:"a faintly vibrating pebble", desc:"Still humming from the last tremor.", type:"junk", sell:4, icon:iconOreGrit},
    rareDrop:{name:"a pebble that predicts the next tremor exactly", desc:"Would be more useful if anyone believed it.", type:"junk", sell:17, icon:iconFigurine},
    gearDrop:{name:"tremor-sensor's own grounded boots of the Tortoise", desc:"Feel every shake before it happens.", type:"equip", slot:"boots", bonus:{grit:3}, tier:'common', icon:iconWardedSlippers} },
   { name:"a dowsing-rod gnome, pointing at veins nobody else sees", ...MONSTER_STATS["a dowsing-rod gnome, pointing at veins nobody else sees"], zone:"quarry",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:9, boltMax:12, flavor:"the rod snaps forward and drags its whole arm with it" } ],
    art: artDowsingRodGnome, loot:{name:"a snapped-off dowsing rod tip", desc:"Pointed at something, once. Nobody's sure what.", type:"junk", sell:5, icon:iconVeinGemstone},
    rareDrop:{name:"a dowsing rod that found a real vein", desc:"Pointed true, for once in its career.", type:"junk", sell:19, icon:iconFigurine},
    gearDrop:{name:"dowsing gnome's own forked rod of the Loon", desc:"Still twitches faintly near anything valuable.", type:"equip", slot:"weapon", bonus:{hoodoo:3}, tier:'common', icon:iconWandStick} },
   { name:"a vault wisp, humming with old magic", ...MONSTER_STATS["a vault wisp, humming with old magic"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"flares brighter, humming with gathered old magic" } ],
    art: artVaultWisp, loot:{name:"sliver of captured light", desc:"Warm to the touch. Slightly judgmental.", type:"junk", sell:6, icon:iconCapturedLight},
    rareDrop:{name:"captured wisp of pure luck", desc:"It flickers approvingly whenever you make a good call.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"wisp-charred conducting rod of the Weasel", desc:"Still warm. Hums when you're not paying attention.", type:"equip", slot:"weapon", bonus:{zip:4}, tier:'common', icon:iconHeirloomRod} },
   { name:"a stone sentinel, one eye still lit", ...MONSTER_STATS["a stone sentinel, one eye still lit"], zone:"vault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:17, boltMax:21, flavor:"focuses its one lit eye into a narrow beam" } ],
    art: artStoneSentinel, loot:{name:"fractured sentinel eye", desc:"Stopped watching. Eventually.", type:"junk", sell:7, icon:iconSentinelEye},
    rareDrop:{name:"the sentinel's other eye, still watching", desc:"You can feel it tracking you from the bottom of your pack.", type:"junk", sell:26, icon:iconFigurine},
    gearDrop:{name:"sentinel's cracked faceplate of the Loon", desc:"One eye socket. Still watching, faithfully.", type:"equip", slot:"head", bonus:{hoodoo:4}, tier:'common', icon:iconChampionCrown} },
   { name:"a hoard-rat, absolutely covered in gold flecks", ...MONSTER_STATS["a hoard-rat, absolutely covered in gold flecks"], zone:"vault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"burrows into its own hoard and comes back patched up" } ],
    art: artHoardRat, loot:{name:"gold-dusted whisker", desc:"Rich by rat standards.", type:"junk", sell:6, icon:iconGoldWhisker},
    rareDrop:{name:"fistful of the hoard-rat's actual hoard", desc:"It was surprisingly well-organized, for a rat.", type:"junk", sell:28, icon:iconFigurine},
    gearDrop:{name:"gold-flecked greaves of the Badger", desc:"Surprisingly light, for how much they're worth.", type:"equip", slot:"legs", bonus:{beef:4}, tier:'common', icon:iconBurrowGreaves} },
   { name:"an animated suit of ceremonial armor, empty inside", ...MONSTER_STATS["an animated suit of ceremonial armor, empty inside"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"clanks upright straighter, animated by something angrier" } ],
    art: artCeremonialArmor, loot:{name:"dented ceremonial gauntlet", desc:"Once belonged to somebody important, probably.", type:"junk", sell:8, icon:iconCeremonialGauntlet},
    rareDrop:{name:"ceremonial luck-charm, still humming with old magic", desc:"Whoever it was made for never got to keep it.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"scrap of animated ceremonial mail of the Weasel", desc:"Keeps twitching like it's still wearing someone.", type:"equip", slot:"chest", bonus:{zip:4}, tier:'common', icon:iconAdventurerCuirass} },
   /* Same gap-filling, class-free pass as Commons/Sewers/Quarry above —
   11 more Vault regulars. */
   { name:"a gnome treasure-diver, head-first into every chest", ...MONSTER_STATS["a gnome treasure-diver, head-first into every chest"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"surfaces from a chest clutching something shiny and charges harder for it" } ],
    art: artTreasureDiverGnome, loot:{name:"a handful of fool's gold", desc:"Glitters convincingly. Worth nothing at all.", type:"junk", sell:6, icon:iconGoldWhisker},
    rareDrop:{name:"a genuine gold nugget, somehow", desc:"The diver finally found real treasure. Shame it's yours now.", type:"junk", sell:24, icon:iconFigurine},
    gearDrop:{name:"diver's dented treasure-helm of the Tortoise", desc:"Dented from a hundred chest-lids slamming shut too early.", type:"equip", slot:"head", bonus:{grit:4}, tier:'common', icon:iconGuardHelm} },
   { name:"a gnome appraiser, squinting hard at everything", ...MONSTER_STATS["a gnome appraiser, squinting hard at everything"], zone:"vault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"appraises its own wound as \"not that bad, actually\"" } ],
    art: artAppraiserGnome, loot:{name:"a loupe, permanently fogged", desc:"Hasn't correctly appraised anything in years.", type:"junk", sell:6, icon:iconSentinelEye},
    rareDrop:{name:"an appraisal that's actually correct", desc:"For once, the number means something.", type:"junk", sell:24, icon:iconFigurine},
    gearDrop:{name:"appraiser's squint-worn spectacles of the Tortoise", desc:"Everything looks slightly more valuable through these.", type:"equip", slot:"head", bonus:{grit:4}, tier:'common', icon:iconChampionCrown} },
   { name:"a gnome coin-counter, buried under its own hoard", ...MONSTER_STATS["a gnome coin-counter, buried under its own hoard"], zone:"vault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"digs itself out of the coin pile, slightly richer and slightly better" } ],
    art: artCoinCounterGnome, loot:{name:"a single counted coin", desc:"Counted eleven times already. Still counting.", type:"junk", sell:6, icon:iconGoldWhisker},
    rareDrop:{name:"a coin that counts itself", desc:"Saves the gnome a lot of effort. You're keeping it.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"coin-counter's padded vest of the Badger", desc:"Lined with pockets. All of them full.", type:"equip", slot:"chest", bonus:{beef:4}, tier:'common', icon:iconVest} },
   { name:"a gnome ward-keeper, humming old protective charms", ...MONSTER_STATS["a gnome ward-keeper, humming old protective charms"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"hums a ward that's older than it is and means every word" } ],
    art: artWardKeeperGnome, loot:{name:"a half-remembered ward charm", desc:"Still warm. Still humming, faintly.", type:"junk", sell:7, icon:iconCapturedLight},
    rareDrop:{name:"a ward charm that actually works", desc:"You can feel it holding something back. Keep it close.", type:"junk", sell:25, icon:iconFigurine},
    gearDrop:{name:"ward-keeper's humming vestment of the Badger", desc:"Keeps humming the same four notes, forever.", type:"equip", slot:"chest", bonus:{beef:4}, tier:'common', icon:iconScorchRobe} },
   { name:"a gnome trap-dodger, light-footed through the vault", ...MONSTER_STATS["a gnome trap-dodger, light-footed through the vault"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"steps clean over a trip-wire it definitely saw coming" } ],
    art: artTrapDodgerGnome, loot:{name:"a disarmed tripwire", desc:"Still coiled, still dangerous-looking.", type:"junk", sell:6, icon:iconPipeFitting},
    rareDrop:{name:"a trap mechanism, fully intact and reusable", desc:"Could probably sell this back to whoever set it.", type:"junk", sell:23, icon:iconFigurine},
    gearDrop:{name:"dodger's trap-sprung leggings of the Weasel", desc:"Scuffed from more near-misses than you'd want to count.", type:"equip", slot:"legs", bonus:{zip:4}, tier:'common', icon:iconTrousers} },
   { name:"a gnome rune-reader, tracing symbols on the floor", ...MONSTER_STATS["a gnome rune-reader, tracing symbols on the floor"], zone:"vault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:16, boltMax:20, flavor:"finishes the rune mid-trace and it goes off early" } ],
    art: artRuneReaderGnome, loot:{name:"a half-traced rune, still glowing", desc:"Incomplete. Still does something, apparently.", type:"junk", sell:6, icon:iconVeinGemstone},
    rareDrop:{name:"a fully traced rune, genuinely powerful", desc:"Finished this one properly. You can feel it.", type:"junk", sell:24, icon:iconFigurine},
    gearDrop:{name:"rune-reader's chalk-dusted greaves of the Weasel", desc:"Covered in half-finished symbols, knee to ankle.", type:"equip", slot:"legs", bonus:{zip:4}, tier:'common', icon:iconFeatherScale} },
   { name:"a gnome lock-picker, three steps ahead of every trap", ...MONSTER_STATS["a gnome lock-picker, three steps ahead of every trap"], zone:"vault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:15, boltMax:19, flavor:"flicks a lock-pick at you with alarming precision" } ],
    art: artLockPickerGnome, loot:{name:"a bent lock-pick", desc:"Opened more locks than it had any right to.", type:"junk", sell:6, icon:iconPipeFitting},
    rareDrop:{name:"a lock-pick that opens absolutely anything", desc:"Doesn't fit most locks. Opens them anyway.", type:"junk", sell:23, icon:iconFigurine},
    gearDrop:{name:"lock-picker's silent boots of the Loon", desc:"Barely make a sound, even on loose gravel.", type:"equip", slot:"boots", bonus:{hoodoo:4}, tier:'common', icon:iconWardedSlippers} },
   { name:"a gnome vault-runner, racing the closing door", ...MONSTER_STATS["a gnome vault-runner, racing the closing door"], zone:"vault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"slides under the closing door and comes up breathless but fine" } ],
    art: artVaultRunnerGnome, loot:{name:"a scrap of door-seal gasket", desc:"Nearly didn't make it out with this one either.", type:"junk", sell:6, icon:iconPipeFitting},
    rareDrop:{name:"a stopwatch that's always exactly one second ahead", desc:"Explains a lot about how it keeps making it out.", type:"luck", hpValue:15, mpValue:8, icon:iconClover},
    gearDrop:{name:"vault-runner's own sprint boots of the Loon", desc:"Scorched slightly at the heels. Worth it, apparently.", type:"equip", slot:"boots", bonus:{hoodoo:4}, tier:'common', icon:iconMismatchedBoots} },
   { name:"a gnome relic-wielder, swinging something it doesn't understand", ...MONSTER_STATS["a gnome relic-wielder, swinging something it doesn't understand"], zone:"vault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:17, boltMax:21, flavor:"swings the relic and something happens that it clearly didn't expect either" } ],
    art: artRelicWielderGnome, loot:{name:"an inert ceremonial relic", desc:"Does nothing in your hands. Did something in its.", type:"junk", sell:7, icon:iconCeremonialGauntlet},
    rareDrop:{name:"a relic that still remembers what it's for", desc:"Hums faintly, like it's waiting to be asked properly.", type:"junk", sell:25, icon:iconFigurine},
    gearDrop:{name:"relic-wielder's own misused scepter of the Badger", desc:"Was ceremonial, once. Isn't anymore.", type:"equip", slot:"weapon", bonus:{beef:4}, tier:'common', icon:iconThroneScepter} },
   { name:"a gnome echo-chaser, following sounds that aren't there", ...MONSTER_STATS["a gnome echo-chaser, following sounds that aren't there"], zone:"vault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"chases an echo of its own footsteps back to full health" } ],
    art: artEchoChaserGnome, loot:{name:"a sound that doesn't match anything", desc:"You hear it sometimes. There's nothing there.", type:"junk", sell:6, icon:iconSentinelEye},
    rareDrop:{name:"an echo that's actually useful, for once", desc:"Tells you what's coming before it arrives.", type:"junk", sell:24, icon:iconFigurine},
    gearDrop:{name:"echo-chaser's own listening rod of the Weasel", desc:"Picks up footsteps from rooms that are empty.", type:"equip", slot:"weapon", bonus:{zip:4}, tier:'common', icon:iconHeirloomRod} },
   { name:"a gnome curse-breaker, muttering counter-charms", ...MONSTER_STATS["a gnome curse-breaker, muttering counter-charms"], zone:"vault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"mutters a counter-charm and shrugs off something unseen" } ],
    art: artCurseBreakerGnome, loot:{name:"a half-muttered counter-charm", desc:"You're not sure it finished. It seems to have worked anyway.", type:"junk", sell:7, icon:iconVizierLedger},
    rareDrop:{name:"a counter-charm that actually breaks something", desc:"You felt that one land. Something's different now.", type:"junk", sell:25, icon:iconFigurine},
    gearDrop:{name:"curse-breaker's own muttering wand of the Loon", desc:"Keeps talking, quietly, even when you're not using it.", type:"equip", slot:"weapon", bonus:{hoodoo:4}, tier:'common', icon:iconWandStick} },
   { name:"a gnome vizier, draped in stolen finery", ...MONSTER_STATS["a gnome vizier, draped in stolen finery"], zone:"sanctum",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:21, boltMax:26, flavor:"flings a fistful of stolen finery, pins and all" } ],
    art: artGnomeVizier, loot:{name:"vizier's confiscated ledger", desc:"Every debt in Gnometropolis, written in tiny cramped handwriting.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"vizier's uncanny hunch, bottled", desc:"It practically whispers good advice.", type:"luck", hpValue:18, mpValue:9, icon:iconClover},
    gearDrop:{name:"vizier's confiscated cane-wand of the Loon", desc:"Equal parts walking stick and unlicensed magic.", type:"equip", slot:"weapon", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   { name:"a heavily-armored gnome guard", ...MONSTER_STATS["a heavily-armored gnome guard"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"shrugs the dent out of its own armor" } ],
    art: artGnomeGuard, loot:{name:"dented guard-captain's shield-boss", desc:"Scratched from decades of very small, very serious duels.", type:"junk", sell:10, icon:iconShieldBoss},
    rareDrop:{name:"the guard-captain's ceremonial sash", desc:"Awarded for uninterrupted vigilance. Interrupted now.", type:"junk", sell:32, icon:iconFigurine},
    gearDrop:{name:"guard's dented vambrace-plating of the Badger", desc:"Decades of very small, very serious duels.", type:"equip", slot:"chest", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconClockworkPlate} },
   { name:"a burrowing tunnel-worm, gnome-bred", ...MONSTER_STATS["a burrowing tunnel-worm, gnome-bred"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"coils tighter and digs in" } ],
    art: artBurrowWorm, loot:{name:"chitinous burrow-shell fragment", desc:"Warm from the tunnel. You don't ask why.", type:"junk", sell:9, icon:iconBurrowShell},
    rareDrop:{name:"burrow-worm's lucky cast-off tooth", desc:"Smooth, oddly warm, and very possibly why you're still standing.", type:"luck", hpValue:19, mpValue:9, icon:iconClover},
    gearDrop:{name:"worm-chewed tunneling boots of the Weasel", desc:"Already broken in. Not by you.", type:"equip", slot:"boots", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconBlessedBoots} },
   { name:"a rogue clockwork automaton, sparking wildly", ...MONSTER_STATS["a rogue clockwork automaton, sparking wildly"], zone:"roguesden",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:26, boltMax:33, flavor:"sparks wildly and lashes out in every direction at once" } ],
    art: artFeralAutomaton, loot:{name:"scorched servo joint", desc:"Still twitches, if you're not careful.", type:"junk", sell:11, icon:iconServoJoint},
    rareDrop:{name:"the automaton's still-warm power cell", desc:"Hums like it's not entirely done working yet.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"automaton's salvaged headplate of the Loon", desc:"Still sparks a little when it rains.", type:"equip", slot:"head", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconGuardHelm} },
   /* Rounds the Garrison/Rogues' Den/Arcane Sanctum rosters out to 3
   regular monsters apiece (they launched with just 1/2/1) so each
   district has its own proper set instead of feeling like a rare-hunt
   waiting room. Same hp/atk/xp band as the 4 above (34-46/5-11/19-26),
   gearDrop slot picked to cover a different slot than each district's
   existing monster (weapon/boots for Garrison alongside its chest;
   chest/boots for Sanctum alongside its weapon; legs for Rogues' Den
   alongside its boots/head) so a full clear of a district doesn't just
   hand back 3 copies of the same slot. */
   { name:"a gnome drill sergeant, all bark and boot-camp", ...MONSTER_STATS["a gnome drill sergeant, all bark and boot-camp"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"field-dresses the wound mid-shout, never missing a beat" } ],
    art: artGnomeDrillSergeant, loot:{name:"sergeant's dog-eared drill roster", desc:"Every recruit's name, and a demerit next to most of them.", type:"junk", sell:9, icon:iconDrillRoster},
    rareDrop:{name:"the sergeant's secret medal stash, garrison edition", desc:"Every one of them self-awarded. Some things never change.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"sergeant's barked-order banner-lance of the Badger", desc:"Doubles as a pointer for yelling at recruits.", type:"equip", slot:"weapon", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconBannerLance} },
   { name:"a gnome siege-crew, operating a catapult built for one", ...MONSTER_STATS["a gnome siege-crew, operating a catapult built for one"], zone:"garrison",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"cranks the catapult's tension past anything safe" } ],
    art: artGnomeSiegeCrew, loot:{name:"splintered catapult peg", desc:"Load-bearing, allegedly.", type:"junk", sell:11, icon:iconCatapultPeg},
    rareDrop:{name:"the siege-crew's lucky firing pin", desc:"Pulled from a shot that somehow landed exactly right.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"siege-crew's scorched greaves of the Weasel", desc:"Singed. Still faster than running barefoot.", type:"equip", slot:"boots", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconScorchedGreaves} },
   { name:"an apprentice hex-weaver, sparks flying every wrong direction", ...MONSTER_STATS["an apprentice hex-weaver, sparks flying every wrong direction"], zone:"sanctum",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:21, boltMax:26, flavor:"flings a half-finished spell that goes off anyway" } ],
    art: artHexWeaver, loot:{name:"singed spellbook page", desc:"The diagram is half-right. That's the problem.", type:"junk", sell:9, icon:iconSpellbookPage},
    rareDrop:{name:"hex-weaver's stabilized spark, bottled", desc:"Finally behaving itself, for once.", type:"luck", hpValue:19, mpValue:10, icon:iconClover},
    gearDrop:{name:"apprentice's scorch-marked robe-plating of the Loon", desc:"Fire-proofed the hard way, one mistake at a time.", type:"equip", slot:"chest", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a gnome familiar, three sizes too ambitious", ...MONSTER_STATS["a gnome familiar, three sizes too ambitious"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"shrinks briefly, then reinflates good as new" } ],
    art: artGnomeFamiliar, loot:{name:"familiar's shed feather-scale", desc:"Not quite a feather. Not quite a scale either.", type:"junk", sell:8, icon:iconFeatherScale},
    rareDrop:{name:"the familiar's uncanny premonition, bottled", desc:"It saw this coming. It always does.", type:"luck", hpValue:19, mpValue:9, icon:iconClover},
    gearDrop:{name:"familiar-warded slippers of the Badger", desc:"Land softer than they have any right to.", type:"equip", slot:"boots", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconWardedSlippers} },
   { name:"a masked gnome pickpocket, light-fingered and lighter-footed", ...MONSTER_STATS["a masked gnome pickpocket, light-fingered and lighter-footed"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"lifts something off you mid-fight, purely for the thrill of it" } ],
    art: artGnomePickpocket, loot:{name:"pilfered coin purse, mostly empty", desc:"Somebody's definitely going to notice this is missing.", type:"junk", sell:10, icon:iconCoinPurse},
    rareDrop:{name:"the pickpocket's lucky lifted button", desc:"Not sure whose coat this came off of. Not asking.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"pickpocket's cutpurse leggings of the Weasel", desc:"Built for running, mostly away.", type:"equip", slot:"legs", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconCutpurseLeggings} },
   /* Per a later explicit request, every zone's gearDrop set needs to
   cover all 5 slots for all 3 classes — these Gnometropolis districts
   KEEP classRequired (unlike Commons/Sewers/Quarry/Vault above) since
   they're tied to the class trial itself, per explicit correction.
   12 more Garrison regulars. */
   { name:"a gnome quartermaster, counting rations nobody will eat", ...MONSTER_STATS["a gnome quartermaster, counting rations nobody will eat"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"rations out a field dressing like it's counting every scrap" } ],
    art: artGnomeQuartermaster, loot:{name:"a mis-counted ration crate", desc:"Off by exactly one, every single time.", type:"junk", sell:9, icon:iconBiscuitTin},
    rareDrop:{name:"a ration crate that's actually counted right", desc:"The quartermaster seemed personally offended by this.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"quartermaster's dented helm of the Badger", desc:"Doubles as a mess tin in a pinch.", type:"equip", slot:"head", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a gnome recruit, fresh out of basic training", ...MONSTER_STATS["a gnome recruit, fresh out of basic training"], zone:"garrison",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"remembers a drill at the worst possible moment and commits to it" } ],
    art: artGnomeRecruit, loot:{name:"a barely-earned training badge", desc:"Awarded for finishing. That's the whole requirement.", type:"junk", sell:8, icon:iconFigurine},
    rareDrop:{name:"a training badge that means something, for once", desc:"Actually earned this one. Feels different.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"recruit's stiff new greaves of the Badger", desc:"Not broken in yet. Will be, eventually.", type:"equip", slot:"legs", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a gnome drillfield runner, somehow always last to formation", ...MONSTER_STATS["a gnome drillfield runner, somehow always last to formation"], zone:"garrison",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:33, flavor:"sprints in late and swings twice as hard to make up for it" } ],
    art: artGnomeDrillfieldRunner, loot:{name:"a scuffed drillfield marker", desc:"Knocked over. Again.", type:"junk", sell:10, icon:iconDrillRoster},
    rareDrop:{name:"a marker that's never once been knocked over", desc:"The runner finally made formation on time. Miracles happen.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"runner's scuffed field-boots of the Badger", desc:"Worn through at the heel from constant catching-up.", type:"equip", slot:"boots", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a gnome scout-sergeant, watching from somewhere you can't see", ...MONSTER_STATS["a gnome scout-sergeant, watching from somewhere you can't see"], zone:"garrison",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"was apparently already in position for this" } ],
    art: artGnomeScoutSergeant, loot:{name:"a scout's folded vantage map", desc:"Marked with sightlines you didn't know existed.", type:"junk", sell:9, icon:iconSurveyMap},
    rareDrop:{name:"a vantage map that's actually accurate", desc:"Shows every blind spot in the garrison. Useful, unsettling.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"scout-sergeant's low-profile cap of the Weasel", desc:"Built to not be noticed. Working, apparently.", type:"equip", slot:"head", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a gnome supply-raider, light-fingered even in uniform", ...MONSTER_STATS["a gnome supply-raider, light-fingered even in uniform"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"palms a field dressing off its own belt before anyone notices" } ],
    art: artGnomeSupplyRaider, loot:{name:"a pilfered supply tag", desc:"Belongs to somebody. Not you, not anymore.", type:"junk", sell:9, icon:iconCoinPurse},
    rareDrop:{name:"a full requisition slip, somehow signed off", desc:"Nobody's sure how the raider got the paperwork approved.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"supply-raider's padded vest of the Weasel", desc:"Lined with pockets, every one of them suspiciously full.", type:"equip", slot:"chest", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a gnome perimeter-runner, circling the garrison walls", ...MONSTER_STATS["a gnome perimeter-runner, circling the garrison walls"], zone:"garrison",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"comes around the corner at a dead sprint, already swinging" } ],
    art: artGnomePerimeterRunner, loot:{name:"a worn perimeter-patrol token", desc:"Another lap. Always another lap.", type:"junk", sell:10, icon:iconCoinPurse},
    rareDrop:{name:"a patrol token for a lap that actually mattered", desc:"Caught something, this time.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"perimeter-runner's quickstep leggings of the Weasel", desc:"Scuffed smooth from a thousand laps.", type:"equip", slot:"legs", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a gnome blade-sergeant, drilled past the point of hesitation", ...MONSTER_STATS["a gnome blade-sergeant, drilled past the point of hesitation"], zone:"garrison",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:28, boltMax:35, flavor:"doesn't hesitate, hasn't in years, drilled it clean out" } ],
    art: artGnomeBladeSergeant, loot:{name:"a drill-notched practice blade", desc:"Used for training. Used hard.", type:"junk", sell:11, icon:iconCardShank},
    rareDrop:{name:"a practice blade that's somehow battle-ready", desc:"Shouldn't be this sharp. Is.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"blade-sergeant's own drilled edge of the Weasel", desc:"Honed the same way every single day for years.", type:"equip", slot:"weapon", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconAceBlade} },
   { name:"a gnome war-chaplain, muttering battlefield blessings", ...MONSTER_STATS["a gnome war-chaplain, muttering battlefield blessings"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"mutters a blessing over the wound, whether it needs one or not" } ],
    art: artGnomeWarChaplain, loot:{name:"a dog-eared blessing script", desc:"Half the words are made up. Works anyway.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a blessing that actually does something", desc:"You felt that one land. Somewhere.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"war-chaplain's battle-scuffed circlet of the Loon", desc:"Blessed so many times it's started to show.", type:"equip", slot:"head", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"a gnome signal-caster, relaying orders through hoodoo static", ...MONSTER_STATS["a gnome signal-caster, relaying orders through hoodoo static"], zone:"garrison",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"relays an order to itself through the static, loud and clear" } ],
    art: artGnomeSignalCaster, loot:{name:"a crackling signal charm", desc:"Still relaying something. Nobody's listening anymore.", type:"junk", sell:9, icon:iconCapturedLight},
    rareDrop:{name:"a signal that actually gets through", desc:"Clear as day, for once. Worth something to someone.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"signal-caster's static-charged vestment of the Loon", desc:"Crackles faintly whenever a new order comes through.", type:"equip", slot:"chest", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a gnome rune-marked scout, tracing wards into the dirt", ...MONSTER_STATS["a gnome rune-marked scout, tracing wards into the dirt"], zone:"garrison",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:33, flavor:"finishes a ward mid-trace and it goes off early, straight at you" } ],
    art: artGnomeRuneMarkedScout, loot:{name:"a half-traced warding sigil", desc:"Scratched into the dirt. Still faintly glowing.", type:"junk", sell:10, icon:iconVeinGemstone},
    rareDrop:{name:"a warding sigil that's fully finished", desc:"Whatever it wards against, you'd rather not find out.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"rune-marked scout's chalk-dusted leggings of the Loon", desc:"Covered knee to ankle in half-finished symbols.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a gnome ward-walker, patrolling a line only it can see", ...MONSTER_STATS["a gnome ward-walker, patrolling a line only it can see"], zone:"garrison",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"steps back over its own ward-line and the wound closes" } ],
    art: artGnomeWardWalker, loot:{name:"a faint boot-print, warded", desc:"Marks a line you can't quite see either.", type:"junk", sell:9, icon:iconPotLid},
    rareDrop:{name:"a ward-line that's actually visible, briefly", desc:"You saw it flare, just once. Unsettling.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"ward-walker's silent-step boots of the Loon", desc:"Leave the ward-line undisturbed, somehow.", type:"equip", slot:"boots", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a gnome battle-conjurer, channeling something ugly", ...MONSTER_STATS["a gnome battle-conjurer, channeling something ugly"], zone:"garrison",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:28, boltMax:35, flavor:"channels something it clearly isn't fully in control of" } ],
    art: artGnomeBattleConjurer, loot:{name:"a scorched conjuring focus", desc:"Channeled one thing too many, by the look of it.", type:"junk", sell:11, icon:iconArcaneFocus},
    rareDrop:{name:"a conjuring focus that's actually stable", desc:"Doesn't scorch your hand to hold it. Progress.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"battle-conjurer's own channeling rod of the Loon", desc:"Still warm from the last thing it channeled.", type:"equip", slot:"weapon", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* 10 more Rogues' Den regulars, same class-gated, gap-filling pass. */
   { name:"a gnome card-shill, running a game that's always rigged", ...MONSTER_STATS["a gnome card-shill, running a game that's always rigged"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"deals itself a hand that's suspiciously, specifically good" } ],
    art: artGnomeCardShill, loot:{name:"a marked, dog-eared playing card", desc:"Marked so obviously it's almost impressive.", type:"junk", sell:9, icon:iconCardShank},
    rareDrop:{name:"a card that's somehow not marked", desc:"Honest, for once. Almost suspicious on its own.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"card-shill's dented bowler of the Badger", desc:"Worn at a rakish angle, permanently.", type:"equip", slot:"head", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconBottlecapHelmet} },
   { name:"a gnome fence, moving goods nobody asks about", ...MONSTER_STATS["a gnome fence, moving goods nobody asks about"], zone:"roguesden",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"patches itself up with goods it was definitely not supposed to keep" } ],
    art: artGnomeFence, loot:{name:"an unmarked, unlabeled crate lid", desc:"No telling what was in it. Nobody's asking.", type:"junk", sell:9, icon:iconCoatButton},
    rareDrop:{name:"a crate that's actually worth what it claims", desc:"Shockingly, exactly as described.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"fence's padded smuggler's vest of the Badger", desc:"Lined with compartments for things that shouldn't fit.", type:"equip", slot:"chest", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconVest} },
   { name:"a gnome enforcer's apprentice, learning the trade the hard way", ...MONSTER_STATS["a gnome enforcer's apprentice, learning the trade the hard way"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"tries a move it clearly just learned, badly, but it lands" } ],
    art: artGnomeEnforcerApprentice, loot:{name:"a scuffed enforcer's training manual", desc:"Half the pages are just \"intimidate harder.\"", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a manual with the actually useful parts intact", desc:"The apprentice clearly skipped straight to this chapter.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"apprentice-enforcer's scuffed greaves of the Badger", desc:"Still learning how to stand properly in them.", type:"equip", slot:"legs", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a gnome getaway-driver, revving an engine with nowhere to go", ...MONSTER_STATS["a gnome getaway-driver, revving an engine with nowhere to go"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"revs hard, going absolutely nowhere, somehow faster for it" } ],
    art: artGnomeGetawayDriver, loot:{name:"a stripped ignition switch", desc:"Jury-rigged. Works more often than it should.", type:"junk", sell:10, icon:iconGear},
    rareDrop:{name:"an ignition switch that actually starts something real", desc:"Wherever that engine was going, it's finally going there.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"getaway-driver's scuffed boots of the Badger", desc:"Worn smooth on the pedal side.", type:"equip", slot:"boots", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconSpringBoots} },
   { name:"a gnome knife-juggler, three blades in and not stopping", ...MONSTER_STATS["a gnome knife-juggler, three blades in and not stopping"], zone:"roguesden",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"loses count of the blades and just throws all of them" } ],
    art: artGnomeKnifeJuggler, loot:{name:"a dropped juggling knife", desc:"Dulled from practice. Still throws true.", type:"junk", sell:10, icon:iconDiceFlail},
    rareDrop:{name:"a knife that's never once been dropped", desc:"The juggler's whole reputation rides on this one.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"knife-juggler's own favorite blade of the Weasel", desc:"The one that never gets dropped. Ever.", type:"equip", slot:"weapon", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a gnome shadow-broker, dealing in favors nobody can trace", ...MONSTER_STATS["a gnome shadow-broker, dealing in favors nobody can trace"], zone:"roguesden",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"calls in a favor and comes out ahead, as always" } ],
    art: artGnomeShadowBroker, loot:{name:"an untraceable IOU note", desc:"Owed to somebody. Collectible by nobody.", type:"junk", sell:9, icon:iconCoinPurse},
    rareDrop:{name:"an IOU that's actually collectible", desc:"This one's good. You could cash this in.", type:"luck", hpValue:20, mpValue:10, icon:iconClover},
    gearDrop:{name:"shadow-broker's own unmarked chest-wrap of the Weasel", desc:"Carries more hidden pockets than it looks like it should.", type:"equip", slot:"chest", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a gnome séance-caller, half-scamming and half-sincere", ...MONSTER_STATS["a gnome séance-caller, half-scamming and half-sincere"], zone:"roguesden",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"consults a spirit that's almost certainly made up, and it works anyway" } ],
    art: artGnomeSeanceCaller, loot:{name:"a tarnished séance bell", desc:"Rings for a spirit that may or may not be listening.", type:"junk", sell:9, icon:iconMendCharm},
    rareDrop:{name:"a séance that actually summons something", desc:"Nobody, including the caller, expected that to work.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"séance-caller's draped mantle of the Loon", desc:"Smells like incense and a sincere lack of confidence.", type:"equip", slot:"chest", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a gnome hex-dealer, selling curses by the dozen", ...MONSTER_STATS["a gnome hex-dealer, selling curses by the dozen"], zone:"roguesden",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"throws in a free curse with the purchase, no refunds" } ],
    art: artGnomeHexDealer, loot:{name:"a discount curse, lightly used", desc:"Mild side effects. Worked on the last three owners.", type:"junk", sell:10, icon:iconHexBolt},
    rareDrop:{name:"a curse with genuinely no side effects", desc:"The dealer seemed almost disappointed by this one.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"hex-dealer's own discount wand of the Loon", desc:"Comes with a lifetime guarantee. Terms unclear.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a gnome back-alley fortune-reader, reading palms for coin", ...MONSTER_STATS["a gnome back-alley fortune-reader, reading palms for coin"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"reads its own palm and likes what it sees" } ],
    art: artGnomeAlleyFortuneReader, loot:{name:"a palm-reading chart, water-stained", desc:"The lines don't match any hand you've seen.", type:"junk", sell:9, icon:iconLure},
    rareDrop:{name:"a palm reading that's unsettlingly accurate", desc:"Described your next five minutes exactly.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"fortune-reader's worn slippers of the Loon", desc:"Silent on cobblestone. Essential for the trade.", type:"equip", slot:"boots", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   /* 11 more Arcane Sanctum regulars, same class-gated, gap-filling pass. */
   { name:"a gnome battle-mage, overcompensating with raw force", ...MONSTER_STATS["a gnome battle-mage, overcompensating with raw force"], zone:"sanctum",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"overcompensates for a shaky spell with sheer force of will" } ],
    art: artGnomeBattleMage, loot:{name:"a scorched battle-focus crystal", desc:"Overcharged, same as the gnome holding it.", type:"junk", sell:9, icon:iconVeinGemstone},
    rareDrop:{name:"a battle-focus crystal that's actually stable", desc:"Doesn't scorch the hand holding it. Rare, for this district.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"battle-mage's scorched helm of the Badger", desc:"Singed from the inside, more than once.", type:"equip", slot:"head", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a gnome spell-smith, forging hexes instead of swords", ...MONSTER_STATS["a gnome spell-smith, forging hexes instead of swords"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"forges the wound shut with the same hammer it uses on hexes" } ],
    art: artGnomeSpellSmith, loot:{name:"a half-forged hex-blade", desc:"More spell than sword, at this stage.", type:"junk", sell:9, icon:iconRakeShank},
    rareDrop:{name:"a fully forged hex-blade, genuinely sharp", desc:"Finished this one properly. You can feel it humming.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"spell-smith's forge-scarred chest-plate of the Badger", desc:"Scarred from forging more hexes than swords.", type:"equip", slot:"chest", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a gnome arcane sentry, standing watch over nothing in particular", ...MONSTER_STATS["a gnome arcane sentry, standing watch over nothing in particular"], zone:"sanctum",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"snaps to attention for a threat that's definitely you" } ],
    art: artGnomeArcaneSentry, loot:{name:"a sentry's overdue watch-log", desc:"Every entry just says \"nothing to report.\" Until now.", type:"junk", sell:9, icon:iconVizierLedger},
    rareDrop:{name:"a watch-log with something actually worth reporting", desc:"Finally, an entry that matters.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"arcane sentry's standing-watch greaves of the Badger", desc:"Worn smooth from standing in exactly one spot.", type:"equip", slot:"legs", bonus:{beef:5}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a gnome runeblade adept, swinging a sword that hums", ...MONSTER_STATS["a gnome runeblade adept, swinging a sword that hums"], zone:"sanctum",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:28, boltMax:35, flavor:"the runeblade hums louder right before it connects" } ],
    art: artGnomeRuneblade, loot:{name:"a faintly humming rune-fragment", desc:"Broke off the blade. Still humming on its own.", type:"junk", sell:11, icon:iconVeinGemstone},
    rareDrop:{name:"a rune-fragment that's actually whole", desc:"Hums a lot louder than the broken ones.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"runeblade adept's own humming blade of the Badger", desc:"You can feel it vibrating even sheathed.", type:"equip", slot:"weapon", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconAceBlade} },
   { name:"a gnome scrying apprentice, watching you through a cracked mirror", ...MONSTER_STATS["a gnome scrying apprentice, watching you through a cracked mirror"], zone:"sanctum",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"saw this coming in the mirror, same as everything else" } ],
    art: artGnomeScryingApprentice, loot:{name:"a cracked scrying-mirror shard", desc:"Still shows a reflection. Not always yours.", type:"junk", sell:9, icon:iconSentinelEye},
    rareDrop:{name:"a shard that shows something actually useful", desc:"You can see where this is going. Literally.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"scrying apprentice's mirrored cap of the Weasel", desc:"Catches your own reflection from every angle.", type:"equip", slot:"head", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a gnome glyph-cutter, carving wards faster than you can read them", ...MONSTER_STATS["a gnome glyph-cutter, carving wards faster than you can read them"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"carves a quick healing glyph straight into its own palm" } ],
    art: artGnomeGlyphCutter, loot:{name:"a half-carved warding glyph", desc:"The chisel slipped. It still mostly works.", type:"junk", sell:9, icon:iconRakeShank},
    rareDrop:{name:"a glyph that's cleanly, perfectly carved", desc:"No slip this time. You can tell the difference.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"glyph-cutter's chisel-worn vest of the Weasel", desc:"Covered in half-finished practice glyphs.", type:"equip", slot:"chest", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a gnome conjure-thief, stealing spells it hasn't earned", ...MONSTER_STATS["a gnome conjure-thief, stealing spells it hasn't earned"], zone:"sanctum",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"lifts a technique off you mid-fight and uses it immediately" } ],
    art: artGnomeConjureThief, loot:{name:"a half-stolen spell fragment", desc:"Doesn't quite work right, lifted from somebody better.", type:"junk", sell:10, icon:iconCoinPurse},
    rareDrop:{name:"a spell fragment that's fully, cleanly stolen", desc:"Works perfectly. Somebody's definitely missing this.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"conjure-thief's pilfered leggings of the Weasel", desc:"Lifted off someone who probably still wants them back.", type:"equip", slot:"legs", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCutpurseLeggings} },
   { name:"a gnome trick-caster, every spell a sleight of hand", ...MONSTER_STATS["a gnome trick-caster, every spell a sleight of hand"], zone:"sanctum",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"the trick is there's no trick, it's just a real spell" } ],
    art: artGnomeTrickCaster, loot:{name:"a loaded spell-die", desc:"Weighted. Toward something unpleasant.", type:"junk", sell:10, icon:iconDiceFlail},
    rareDrop:{name:"a spell-die that rolls fair, for once", desc:"Genuinely random. The trick-caster seemed disappointed.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"trick-caster's own sleight-of-hand blade of the Weasel", desc:"You never quite see where it comes from.", type:"equip", slot:"weapon", bonus:{zip:6}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a gnome oracle-in-training, guessing right more than it should", ...MONSTER_STATS["a gnome oracle-in-training, guessing right more than it should"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"guesses correctly which wound to tend first, again" } ],
    art: artGnomeOracleInTraining, loot:{name:"a half-right prophecy scrap", desc:"Got the important part wrong. Close otherwise.", type:"junk", sell:8, icon:iconLure},
    rareDrop:{name:"a prophecy that's exactly, fully right", desc:"The oracle's finally earning the title.", type:"junk", sell:29, icon:iconFigurine},
    gearDrop:{name:"oracle-in-training's uncertain boots of the Loon", desc:"Never quite sure which foot goes first. Works out anyway.", type:"equip", slot:"boots", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a gnome ley-tapper, siphoning power it doesn't fully control", ...MONSTER_STATS["a gnome ley-tapper, siphoning power it doesn't fully control"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"taps the ley-line for just a moment and feels brand new" } ],
    art: artGnomeLeyTapper, loot:{name:"a leaking ley-siphon", desc:"Humming. Dripping, somehow, with raw hoodoo.", type:"junk", sell:11, icon:iconCapturedLight},
    rareDrop:{name:"a ley-siphon that's actually sealed tight", desc:"No leak this time. You're not sure where it all went.", type:"junk", sell:34, icon:iconFigurine},
    gearDrop:{name:"ley-tapper's own siphoning rod of the Loon", desc:"Still faintly warm, humming with borrowed power.", type:"equip", slot:"legs", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   /* 5 remaining gaps (Rogues' Den M-weapon/CS-head/Hx-weapon, Sanctum
   CS-boots/Hx-head) left over from the district gap-filling pass above. */
   { name:"a gnome enforcer's cane-man, swinging something heavier than it looks", ...MONSTER_STATS["a gnome enforcer's cane-man, swinging something heavier than it looks"], zone:"roguesden",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"the cane's a lot heavier than it looks, and it looked heavy" } ],
    art: artGnomeCaneMan, loot:{name:"a weighted walking cane", desc:"Not for walking. Never was.", type:"junk", sell:10, icon:iconDiceFlail},
    rareDrop:{name:"a cane with a genuinely hidden blade", desc:"The reveal would've been more impressive if you hadn't already guessed.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"cane-man's own weighted cane of the Badger", desc:"Heavier than it has any right to look.", type:"equip", slot:"weapon", bonus:{beef:6}, classRequired:'Meathead', tier:'common', icon:iconCatapultPeg} },
   { name:"a gnome lookout, perched where nobody thinks to check", ...MONSTER_STATS["a gnome lookout, perched where nobody thinks to check"], zone:"roguesden",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"drops from the perch nobody checked and lands already swinging" } ],
    art: artGnomeLookout, loot:{name:"a scuffed lookout's perch-mark", desc:"Chalked onto a rafter nobody looks up at.", type:"junk", sell:9, icon:iconSurveyMap},
    rareDrop:{name:"a perch-mark for a spot that actually matters", desc:"Overlooks the whole den from up there. Worth remembering.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"lookout's low-brim cap of the Weasel", desc:"Keeps the face in shadow, same as the rest of the job.", type:"equip", slot:"head", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a gnome fate-cheater, rigging odds that were never fair anyway", ...MONSTER_STATS["a gnome fate-cheater, rigging odds that were never fair anyway"], zone:"roguesden",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:27, boltMax:34, flavor:"rigs the odds of this swing too, same as everything else" } ],
    art: artGnomeFateCheater, loot:{name:"a weighted set of fate-dice", desc:"Never land the way they should. Never have.", type:"junk", sell:10, icon:iconLoadedDice},
    rareDrop:{name:"a die that rolls exactly what's needed", desc:"The cheater's own trick, finally working for you.", type:"junk", sell:33, icon:iconFigurine},
    gearDrop:{name:"fate-cheater's own loaded wand of the Loon", desc:"The odds were never fair. Now they're yours.", type:"equip", slot:"weapon", bonus:{hoodoo:6}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   { name:"a gnome spell-runner, delivering hexes door to door", ...MONSTER_STATS["a gnome spell-runner, delivering hexes door to door"], zone:"sanctum",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"delivers itself a quick patch-job, same route as always" } ],
    art: artGnomeSpellRunner, loot:{name:"an undelivered hex-package", desc:"Addressed to somebody who moved away years ago.", type:"junk", sell:9, icon:iconBottledFury},
    rareDrop:{name:"a hex-package that actually reaches its address", desc:"First successful delivery in recorded memory.", type:"junk", sell:31, icon:iconFigurine},
    gearDrop:{name:"spell-runner's worn delivery boots of the Weasel", desc:"Scuffed from a route that never quite ends.", type:"equip", slot:"boots", bonus:{zip:5}, classRequired:'Card Shark', tier:'common', icon:iconSpringBoots} },
   { name:"a gnome circle-warden, guarding a summoning ring nobody's used in years", ...MONSTER_STATS["a gnome circle-warden, guarding a summoning ring nobody's used in years"], zone:"sanctum",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"stands a little straighter at the edge of a ring long gone quiet" } ],
    art: artGnomeCircleWarden, loot:{name:"a dust-covered summoning chalk-line", desc:"Hasn't been redrawn in a long time.", type:"junk", sell:9, icon:iconVeinGemstone},
    rareDrop:{name:"a summoning ring that's suddenly, briefly active", desc:"Flickered once. Best not to think about what almost came through.", type:"junk", sell:30, icon:iconFigurine},
    gearDrop:{name:"circle-warden's own watch-circlet of the Loon", desc:"Worn at the edge of a ring that's been quiet for years.", type:"equip", slot:"head", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   ];

/* Every named boss below (gnomeCommander through arcaneSanctumGuardian)
carries a skills[] entry giving it one signature mechanic on top of its
plain auto-attack — same generic dispatcher trialChampion/casinoChampion/
hoodooChampion already use (monsterRetaliate(), combat.js), so no new
combat code was needed, just data. Picked to fit each one's own flavor:
a commander rallies, a captain guarding a retreat digs in and heals, a
rogue enforcer is hard to pin down, etc. */
const gnomeCommander = {
   name:"the gnome commander", ...MONSTER_STATS["the gnome commander"], rare:true, zone:"commons",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"rallies the gnomes for one more push" } ],
   art: artGnomeCommander, loot:null
};
const COMMANDER_SPAWN_CHANCE = 0.03; /* was 0.05 -- lowered per explicit
feedback that the earliest rare hunts (this one/diggerBot/gnomeKingsCaptain)
were showing up too readily for a brand-new player's first taste of the
"rare spawn" mechanic. */

/* Rare hunt target for the Tinker's quest, "Gears in the Dark" — spawns in
the Dank Sewers while state.quest4Accepted is true and the quest isn't
complete yet, same mechanic as gnomeCommander above (see
diggerBotHunt in goAdventuring()). Tuned tougher (higher HP) than
gnomeCommander to keep it a step up in difficulty even though all
three named hunts now share the same DIGGERBOT_SPAWN_CHANCE. */
const diggerBot = {
   name:"a runaway digger-bot, venting steam", ...MONSTER_STATS["a runaway digger-bot, venting steam"], rare:true, zone:"sewers",
   skills:[ { type:'bolt', chance:0.22, boltMin:7, boltMax:12, flavor:"vents a scalding jet of built-up steam" } ],
   art: artDiggerBot, loot:null
};
const DIGGERBOT_SPAWN_CHANCE = 0.03; /* was 0.05 -- see COMMANDER_SPAWN_CHANCE's own comment above. */

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
   name:"the gnome king's captain, left to guard the retreat", ...MONSTER_STATS["the gnome king's captain, left to guard the retreat"], rare:true, zone:"vault",
   skills:[ { type:'heal', chance:0.20, healPercentMin:0.05, healPercentMax:0.07, flavor:"digs in and patches his wounds, buying the King more time" } ],
   art: artGnomeKingsCaptain, loot:null
};
const VAULT_CAPTAIN_SPAWN_CHANCE = 0.03; /* was 0.05 -- see COMMANDER_SPAWN_CHANCE's own comment above. */

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
   name:"the outer gate sentinel, first line of a crumbling watch", ...MONSTER_STATS["the outer gate sentinel, first line of a crumbling watch"], rare:true, zone:"palace",
   art: artPalaceGuard1, loot:null
};
const palaceGuard2 = {
   name:"the inner ward-keeper, humming with old wards", ...MONSTER_STATS["the inner ward-keeper, humming with old wards"], rare:true, zone:"palace",
   skills:[ { type:'heal', chance:0.20, healPercentMin:0.05, healPercentMax:0.07, flavor:"leans on an old ward and stitches herself back together" } ],
   art: artPalaceGuard2, loot:null
};
const palaceGuard3 = {
   name:"the throne room usher, unnervingly polite", ...MONSTER_STATS["the throne room usher, unnervingly polite"], rare:true, zone:"palace",
   skills:[ { type:'buff', chance:0.20, buffMult:1.5, buffTurns:2, flavor:"straightens his collar and gets, somehow, more intense" } ],
   art: artPalaceGuard3, loot:null
};
const palaceGuard4 = {
   name:"the King's champion, undefeated and insufferable about it", ...MONSTER_STATS["the King's champion, undefeated and insufferable about it"], rare:true, zone:"palace",
   skills:[
      { type:'buff', chance:0.18, buffMult:1.6, buffTurns:2, flavor:"warms up with a few showboating practice swings" },
      { type:'bolt', chance:0.15, boltMin:10, boltMax:16, flavor:"hurls a trophy javelin clean across the throne room" },
   ],
   art: artPalaceGuard4, loot:null
};
const palaceGuard5 = {
   name:"the King's own shadow, never quite where you last saw it", ...MONSTER_STATS["the King's own shadow, never quite where you last saw it"], rare:true, zone:"palace",
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
   name:"the gnome king, throned in scavenged gold", ...MONSTER_STATS["the gnome king, throned in scavenged gold"], rare:true, zone:"palace",
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
   name:"the Guild's Trial Examiner, unbeaten and unimpressed", ...MONSTER_STATS["the Guild's Trial Examiner, unbeaten and unimpressed"], rare:true,
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
   name:"the Casino's own card shark, impossible to pin down", ...MONSTER_STATS["the Casino's own card shark, impossible to pin down"], rare:true,
   buffTurnsLeft:1, buffMult:2, art: artCasinoChampion, loot:null
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
   name:"a spirit summoned from the bottom of the pot", ...MONSTER_STATS["a spirit summoned from the bottom of the pot"], rare:true,
   skills:[
      { type:'heal', chance:0.18, healPercentMin:0.05, healPercentMax:0.07, flavor:"mutters over its own embers and knits its wounds shut" },
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
sequence, so they share one tier.

Every value below carries a small extra multiplier on top of its
original tier baseline — a ramp, not a flat percentage, per explicit
request once gear tempering (player-actions.js) gave every zone's own
power ceiling real headroom that didn't exist when these were first
tuned. The ramp is ~0% at Commons (a fresh character can't have
tempered anything yet — there's been no time to earn Bounty Tokens)
growing to ~18% by the Ember Warren (the deepest zone, where tempering
has had the most time to compound): +0/+2/+4/+6/+8/+10/+12/+15/+18%
across the 9 tiers below, in order. Deliberately NOT re-deriving
ZONE_LEVEL_RECOMMENDATION (below) to match — those floors were
calibrated for bare/lightly-geared characters, and the whole point of
this bump is that a TEMPERED character absorbs it at the same
recommended level, not that the recommended level itself needs to
rise. Revisit with a real win-rate probe (same "simulated, not
guessed" methodology used to catch Mudroot Warren/Warren's Ear's own
overtuned guesses) if that assumption turns out wrong in practice.

That assumption turned out wrong: player feedback after that first ramp
shipped was that tempering was STILL making the game too easy, so the
Mole Wars zones — rootcellar/bureau/mudflats/choir/ledgervault/foundry/
gearworks specifically, NOT garrison/roguesden/sanctum/palace, which
are Act 1's own finale content just housed in the Gnometropolis
building shell — get a second, much bigger correction on top of the
first ramp above: roughly +50% at Root Cellar/Bureau growing to +60% by
the Ember Warren, a decisive jump sized for a character with several
fully-tempered (+5) items rather than another small nudge. Act 1's own
zones (commons through vault) and the three Gnometropolis districts are
untouched by this second pass — this is scoped to Act 2's Mole Wars
content specifically, per explicit request. */
/* crystalcity (quest16's own capstone reveal) is deliberately its own
LEAF zone, not a hub with sub-districts like every Act 2 area before
it — a genuine "stub," per explicit instruction, meant to be expanded
later rather than fully fleshed out now. Continues the difficulty
ladder one more step past foundry/gearworks. */
const ZONE_DIFFICULTY = { commons:1, sewers:1.17, quarry:1.61, vault:2.01, garrison:2.48, roguesden:2.48, sanctum:2.48, palace:2.48, rootcellar:4.29, bureau:4.29, mudflats:4.97, choir:5.74, ledgervault:5.74, foundry:6.61, gearworks:6.61, crystalcity:7.5 };

/* Display names for each adventure zone, keyed by state.location/zone id —
used by the Bounty Board (render.js) to spell out where a bounty's
monster lives without hand-typing zone names in a second place. */
const ZONE_LABELS = { commons:'the Overgrown Commons', sewers:'the Dank Sewers', quarry:'the Clockwork Quarry', vault:'the Sunless Vault', garrison:'The Garrison', roguesden:"The Rogues' Den", sanctum:'The Arcane Sanctum', palace:'the Palace', rootcellar:'the Root Cellar', mudflats:'the Mudflats', bureau:'the Bureau', choir:'the Choir', ledgervault:'the Ledger Vault', foundry:'the Foundry', gearworks:'the Gearworks', crystalcity:'the Crystal City' };

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
const ZONE_ORDER = ['town', 'commons', 'sewers', 'quarry', 'vault', 'gnometropolis', 'mudrootwarren', 'warrensear', 'emberwarren', 'crystalcity'];

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
   warrensear: { min:16, max:20 },
   /* Not yet simulated the way the numbers above were -- an initial
   estimate off the same "gearDrop bonus x2" alignment noted at
   getGearRequirements() (item-tiers.js): the Ember Warren's own
   gearDrop values are +9, one step past Warren's Ear's +8. Revisit
   with a real win-rate probe once there's enough live play to bother,
   same as Mudroot Warren/Warren's Ear's own guessed numbers were
   caught and corrected above. */
   emberwarren: { min:18 },
   /* A stub zone (deliberately just one leaf, no districts of its own
   yet) — same "guessed, not simulated" caveat as emberwarren's own
   entry above. Corrected from an earlier guess of 24 down to 19 —
   per a real player's own direct report, level 19 is exactly where
   Crystal City/the Prism Depths are actually reached in practice, not
   24; see embercrypt's own min below for the same correction applied
   to the dungeon ladder right past this zone. */
   crystalcity: { min:19 },
   /* The Prism Depths' 8 dungeons (dungeon.js's own DUNGEONS registry)
   — simulated the same way ZONE_DIFFICULTY itself was retuned (see
   prismdepths-content.js's own embercrypt comment for the full
   methodology): each min is the level a live playtest found actually
   requires using spells/potions/this-tier gear to clear, not merely
   the level a bare-Attack run happens to survive. +2 per dungeon,
   matching the ladder's own escalation. */
   embercrypt: { min:20 },
   frostvault: { min:22 },
   stormreach: { min:24 },
   verdanthollow: { min:26 },
   duskward: { min:28 },
   ironloom: { min:30 },
   echochapel: { min:32 },
   sunkenarchive: { min:34 },
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
with tier the same way price/bonus magnitude already does.

Every item here carries `classRequired` (see CLASS_SIGNATURE_STAT,
above CLASS_TITLES) — the weapon slot already had one distinct,
already-flavored item per class (Beef/Hoodoo/Zip), so those three just
get tagged as-is. Head/chest/legs/boots used to be ONE universal item
per slot; each is now THREE near-identical variants, one per class,
sharing the same desc/icon and reusing the gearDrop "of the ___" animal
suffix (item-tiers.js's naming convention, previously gearDrop-only) so
the shop stays consistent with what monsters drop — a class can only
buy the variant tagged for it (getAvailableShopItems(), economy.js). */
const shopGearItems = [
   { name:"rake tine repurposed as a shank", desc:"Sharper than it has any right to be.", type:"equip", slot:"weapon", bonus:{beef:1}, classRequired:'Meathead', price:12, tier:'common', icon: iconRakeShank },
   { name:"wand-shaped stick, allegedly magic", desc:"The gnome who sold it swore up and down.", type:"equip", slot:"weapon", bonus:{hoodoo:1}, classRequired:'Hexpert', price:12, tier:'common', icon: iconWandStick },
   { name:"a deck shanked into a makeshift blade", desc:"Every card's an ace, if you throw it right.", type:"equip", slot:"weapon", bonus:{zip:1}, classRequired:'Card Shark', price:12, tier:'common', icon: iconCardShank },
   { name:"dented pot-lid helmet of the Badger", desc:"Rings like a bell if you get hit. You get used to it.", type:"equip", slot:"head", bonus:{beef:1}, classRequired:'Meathead', price:10, tier:'common', icon: iconPotLid },
   { name:"dented pot-lid helmet of the Weasel", desc:"Rings like a bell if you get hit. You get used to it.", type:"equip", slot:"head", bonus:{zip:1}, classRequired:'Card Shark', price:10, tier:'common', icon: iconPotLid },
   { name:"dented pot-lid helmet of the Loon", desc:"Rings like a bell if you get hit. You get used to it.", type:"equip", slot:"head", bonus:{hoodoo:1}, classRequired:'Hexpert', price:10, tier:'common', icon: iconPotLid },
   { name:"patched burlap vest of the Badger", desc:"Itchy. Surprisingly sturdy.", type:"equip", slot:"chest", bonus:{beef:1}, classRequired:'Meathead', price:12, tier:'common', icon: iconVest },
   { name:"patched burlap vest of the Weasel", desc:"Itchy. Surprisingly sturdy.", type:"equip", slot:"chest", bonus:{zip:1}, classRequired:'Card Shark', price:12, tier:'common', icon: iconVest },
   { name:"patched burlap vest of the Loon", desc:"Itchy. Surprisingly sturdy.", type:"equip", slot:"chest", bonus:{hoodoo:1}, classRequired:'Hexpert', price:12, tier:'common', icon: iconVest },
   { name:"shin guards whittled from a fence post of the Badger", desc:"Splintery, but they hold.", type:"equip", slot:"legs", bonus:{beef:1}, classRequired:'Meathead', price:10, tier:'common', icon: iconShinGuard },
   { name:"shin guards whittled from a fence post of the Weasel", desc:"Splintery, but they hold.", type:"equip", slot:"legs", bonus:{zip:1}, classRequired:'Card Shark', price:10, tier:'common', icon: iconShinGuard },
   { name:"shin guards whittled from a fence post of the Loon", desc:"Splintery, but they hold.", type:"equip", slot:"legs", bonus:{hoodoo:1}, classRequired:'Hexpert', price:10, tier:'common', icon: iconShinGuard },
   { name:"boots with suspiciously good grip of the Badger", desc:"You don't ask where they came from.", type:"equip", slot:"boots", bonus:{beef:1}, classRequired:'Meathead', price:10, tier:'common', icon: iconGripBoots },
   { name:"boots with suspiciously good grip of the Weasel", desc:"You don't ask where they came from.", type:"equip", slot:"boots", bonus:{zip:1}, classRequired:'Card Shark', price:10, tier:'common', icon: iconGripBoots },
   { name:"boots with suspiciously good grip of the Loon", desc:"You don't ask where they came from.", type:"equip", slot:"boots", bonus:{hoodoo:1}, classRequired:'Hexpert', price:10, tier:'common', icon: iconGripBoots },
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
   { name:"scepter looted from the vizier's chambers", desc:"Still radiates a faint, smug authority.", type:"equip", slot:"weapon", bonus:{hoodoo:2, grit:1}, classRequired:'Hexpert', price:40, tier:'uncommon', icon: iconVizierScepter },
   { name:"guard-captain's confiscated cleaver", desc:"Standard issue, before it wasn't standard issue anymore.", type:"equip", slot:"weapon", bonus:{beef:2, zip:1}, classRequired:'Meathead', price:38, tier:'uncommon', icon: iconGuardCleaver },
   { name:"loaded dice on a length of chain", desc:"Comes up snake eyes for whoever's on the other end.", type:"equip", slot:"weapon", bonus:{zip:2, hoodoo:1}, classRequired:'Card Shark', price:40, tier:'uncommon', icon: iconDiceFlail },
   { name:"guard-captain's dented helm of the Badger", desc:"Reinforced. Dented anyway.", type:"equip", slot:"head", bonus:{beef:2, grit:1}, classRequired:'Meathead', price:38, tier:'uncommon', icon: iconGuardHelm },
   { name:"guard-captain's dented helm of the Weasel", desc:"Reinforced. Dented anyway.", type:"equip", slot:"head", bonus:{zip:2, grit:1}, classRequired:'Card Shark', price:38, tier:'uncommon', icon: iconGuardHelm },
   { name:"guard-captain's dented helm of the Loon", desc:"Reinforced. Dented anyway.", type:"equip", slot:"head", bonus:{hoodoo:2, grit:1}, classRequired:'Hexpert', price:38, tier:'uncommon', icon: iconGuardHelm },
   { name:"clockwork-plated chestpiece of the Badger", desc:"Ticks faintly whenever your heart rate spikes.", type:"equip", slot:"chest", bonus:{beef:2, grit:1}, classRequired:'Meathead', price:42, tier:'uncommon', icon: iconClockworkPlate },
   { name:"clockwork-plated chestpiece of the Weasel", desc:"Ticks faintly whenever your heart rate spikes.", type:"equip", slot:"chest", bonus:{zip:2, grit:1}, classRequired:'Card Shark', price:42, tier:'uncommon', icon: iconClockworkPlate },
   { name:"clockwork-plated chestpiece of the Loon", desc:"Ticks faintly whenever your heart rate spikes.", type:"equip", slot:"chest", bonus:{hoodoo:2, grit:1}, classRequired:'Hexpert', price:42, tier:'uncommon', icon: iconClockworkPlate },
   { name:"burrow-worm hide greaves of the Badger", desc:"Flexible enough to squeeze through a tunnel-worm's old digs.", type:"equip", slot:"legs", bonus:{beef:2, grit:1}, classRequired:'Meathead', price:36, tier:'uncommon', icon: iconBurrowGreaves },
   { name:"burrow-worm hide greaves of the Weasel", desc:"Flexible enough to squeeze through a tunnel-worm's old digs.", type:"equip", slot:"legs", bonus:{zip:2, grit:1}, classRequired:'Card Shark', price:36, tier:'uncommon', icon: iconBurrowGreaves },
   { name:"burrow-worm hide greaves of the Loon", desc:"Flexible enough to squeeze through a tunnel-worm's old digs.", type:"equip", slot:"legs", bonus:{hoodoo:2, grit:1}, classRequired:'Hexpert', price:36, tier:'uncommon', icon: iconBurrowGreaves },
   { name:"spring-loaded gnome-tech boots of the Badger", desc:"Every step has a little more bounce than it should.", type:"equip", slot:"boots", bonus:{beef:2, grit:1}, classRequired:'Meathead', price:44, tier:'uncommon', icon: iconSpringBoots },
   { name:"spring-loaded gnome-tech boots of the Weasel", desc:"Every step has a little more bounce than it should.", type:"equip", slot:"boots", bonus:{zip:2, grit:1}, classRequired:'Card Shark', price:44, tier:'uncommon', icon: iconSpringBoots },
   { name:"spring-loaded gnome-tech boots of the Loon", desc:"Every step has a little more bounce than it should.", type:"equip", slot:"boots", bonus:{hoodoo:2, grit:1}, classRequired:'Hexpert', price:44, tier:'uncommon', icon: iconSpringBoots },
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
   { name:"heirloom hoodoo rod, mostly legitimate", desc:"The provenance is fuzzy. The results aren't.", type:"equip", slot:"weapon", bonus:{hoodoo:3, grit:1, zip:1}, classRequired:'Hexpert', price:100, tier:'rare', icon: iconHeirloomRod },
   { name:"heirloom war-cleaver, mostly legitimate", desc:"Family heirloom. Allegedly.", type:"equip", slot:"weapon", bonus:{beef:3, zip:1, grit:1}, classRequired:'Meathead', price:95, tier:'rare', icon: iconHeirloomCleaver },
   { name:"an ace-tipped blade, palmed from the deck", desc:"Nobody notices a card missing until it's too late.", type:"equip", slot:"weapon", bonus:{zip:3, hoodoo:1, beef:1}, classRequired:'Card Shark', price:95, tier:'rare', icon: iconAceBlade },
   { name:"champion's dented crown, repurposed, of the Badger", desc:"Whoever wore it first isn't asking for it back.", type:"equip", slot:"head", bonus:{beef:3, grit:1, zip:1}, classRequired:'Meathead', price:85, tier:'rare', icon: iconChampionCrown },
   { name:"champion's dented crown, repurposed, of the Weasel", desc:"Whoever wore it first isn't asking for it back.", type:"equip", slot:"head", bonus:{zip:3, grit:1, hoodoo:1}, classRequired:'Card Shark', price:85, tier:'rare', icon: iconChampionCrown },
   { name:"champion's dented crown, repurposed, of the Loon", desc:"Whoever wore it first isn't asking for it back.", type:"equip", slot:"head", bonus:{hoodoo:3, grit:1, beef:1}, classRequired:'Hexpert', price:85, tier:'rare', icon: iconChampionCrown },
   { name:"reinforced adventurer's cuirass of the Badger", desc:"Actually built for this. A first, around here.", type:"equip", slot:"chest", bonus:{beef:3, grit:1, zip:1}, classRequired:'Meathead', price:95, tier:'rare', icon: iconAdventurerCuirass },
   { name:"reinforced adventurer's cuirass of the Weasel", desc:"Actually built for this. A first, around here.", type:"equip", slot:"chest", bonus:{zip:3, grit:1, hoodoo:1}, classRequired:'Card Shark', price:95, tier:'rare', icon: iconAdventurerCuirass },
   { name:"reinforced adventurer's cuirass of the Loon", desc:"Actually built for this. A first, around here.", type:"equip", slot:"chest", bonus:{hoodoo:3, grit:1, beef:1}, classRequired:'Hexpert', price:95, tier:'rare', icon: iconAdventurerCuirass },
   { name:"tailored pair of quick-step trousers of the Badger", desc:"Somehow both stylish and functional.", type:"equip", slot:"legs", bonus:{beef:3, grit:1, zip:1}, classRequired:'Meathead', price:80, tier:'rare', icon: iconQuickstepTrousers },
   { name:"tailored pair of quick-step trousers of the Weasel", desc:"Somehow both stylish and functional.", type:"equip", slot:"legs", bonus:{zip:3, grit:1, hoodoo:1}, classRequired:'Card Shark', price:80, tier:'rare', icon: iconQuickstepTrousers },
   { name:"tailored pair of quick-step trousers of the Loon", desc:"Somehow both stylish and functional.", type:"equip", slot:"legs", bonus:{hoodoo:3, grit:1, beef:1}, classRequired:'Hexpert', price:80, tier:'rare', icon: iconQuickstepTrousers },
   { name:"boots blessed by a mildly competent hoodoo doctor, of the Badger", desc:"\"Mildly\" is doing some work in that sentence.", type:"equip", slot:"boots", bonus:{beef:3, grit:1, zip:1}, classRequired:'Meathead', price:90, tier:'rare', icon: iconBlessedBoots },
   { name:"boots blessed by a mildly competent hoodoo doctor, of the Weasel", desc:"\"Mildly\" is doing some work in that sentence.", type:"equip", slot:"boots", bonus:{zip:3, grit:1, hoodoo:1}, classRequired:'Card Shark', price:90, tier:'rare', icon: iconBlessedBoots },
   { name:"boots blessed by a mildly competent hoodoo doctor, of the Loon", desc:"\"Mildly\" is doing some work in that sentence.", type:"equip", slot:"boots", bonus:{hoodoo:3, grit:1, beef:1}, classRequired:'Hexpert', price:90, tier:'rare', icon: iconBlessedBoots },
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
   { name:"scepter reforged from the throne room's own gold", desc:"Melted down and reshaped before the guards even noticed it was gone.", type:"equip", slot:"weapon", bonus:{hoodoo:4, beef:1, zip:1, grit:1}, classRequired:'Hexpert', price:180, tier:'epic', icon: iconThroneScepter },
   { name:"headsman's axe, liberated from the throne room", desc:"The guards really should've kept a closer eye on the ceremonial weapons rack.", type:"equip", slot:"weapon", bonus:{beef:4, zip:1, grit:1, hoodoo:1}, classRequired:'Meathead', price:175, tier:'epic', icon: iconThroneAxe },
   { name:"a royal flush, fanned into a killing blow", desc:"The house doesn't usually lose this hand.", type:"equip", slot:"weapon", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, classRequired:'Card Shark', price:170, tier:'epic', icon: iconRoyalFlushBlade },
   { name:"crown stripped from the throne itself, of the Badger", desc:"Too big. You've stuffed it with rags to make it fit.", type:"equip", slot:"head", bonus:{beef:4, grit:1, hoodoo:1, zip:1}, classRequired:'Meathead', price:150, tier:'epic', icon: iconStolenCrown },
   { name:"crown stripped from the throne itself, of the Weasel", desc:"Too big. You've stuffed it with rags to make it fit.", type:"equip", slot:"head", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, classRequired:'Card Shark', price:150, tier:'epic', icon: iconStolenCrown },
   { name:"crown stripped from the throne itself, of the Loon", desc:"Too big. You've stuffed it with rags to make it fit.", type:"equip", slot:"head", bonus:{hoodoo:4, grit:1, beef:1, zip:1}, classRequired:'Hexpert', price:150, tier:'epic', icon: iconStolenCrown },
   { name:"plate forged in the palace's own furnace, of the Badger", desc:"Still warm, if you believe the gnome who sold it to you.", type:"equip", slot:"chest", bonus:{beef:4, grit:1, hoodoo:1, zip:1}, classRequired:'Meathead', price:170, tier:'epic', icon: iconPalaceForgedPlate },
   { name:"plate forged in the palace's own furnace, of the Weasel", desc:"Still warm, if you believe the gnome who sold it to you.", type:"equip", slot:"chest", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, classRequired:'Card Shark', price:170, tier:'epic', icon: iconPalaceForgedPlate },
   { name:"plate forged in the palace's own furnace, of the Loon", desc:"Still warm, if you believe the gnome who sold it to you.", type:"equip", slot:"chest", bonus:{hoodoo:4, grit:1, beef:1, zip:1}, classRequired:'Hexpert', price:170, tier:'epic', icon: iconPalaceForgedPlate },
   { name:"greaves stitched from a guard captain's dress uniform, of the Badger", desc:"Ceremonial. Somehow still holds up in a real fight.", type:"equip", slot:"legs", bonus:{beef:4, grit:1, hoodoo:1, zip:1}, classRequired:'Meathead', price:140, tier:'epic', icon: iconDressGreaves },
   { name:"greaves stitched from a guard captain's dress uniform, of the Weasel", desc:"Ceremonial. Somehow still holds up in a real fight.", type:"equip", slot:"legs", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, classRequired:'Card Shark', price:140, tier:'epic', icon: iconDressGreaves },
   { name:"greaves stitched from a guard captain's dress uniform, of the Loon", desc:"Ceremonial. Somehow still holds up in a real fight.", type:"equip", slot:"legs", bonus:{hoodoo:4, grit:1, beef:1, zip:1}, classRequired:'Hexpert', price:140, tier:'epic', icon: iconDressGreaves },
   { name:"boots off the palace steward's own feet, of the Badger", desc:"He wasn't using them anymore. Long story.", type:"equip", slot:"boots", bonus:{beef:4, grit:1, hoodoo:1, zip:1}, classRequired:'Meathead', price:160, tier:'epic', icon: iconStewardBoots },
   { name:"boots off the palace steward's own feet, of the Weasel", desc:"He wasn't using them anymore. Long story.", type:"equip", slot:"boots", bonus:{zip:4, grit:1, hoodoo:1, beef:1}, classRequired:'Card Shark', price:160, tier:'epic', icon: iconStewardBoots },
   { name:"boots off the palace steward's own feet, of the Loon", desc:"He wasn't using them anymore. Long story.", type:"equip", slot:"boots", bonus:{hoodoo:4, grit:1, beef:1, zip:1}, classRequired:'Hexpert', price:160, tier:'epic', icon: iconStewardBoots },
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
- 'heal'   — restores state.hp by `healValue` (a flat amount) plus,
when present, a fraction of state.maxHp (`healPercentOfMaxHp`/
`healPercentPerSkillLevel`, stubbornrecovery only — see its own
comment further down).
- 'ward'   — grants a flat, persistent shield (state.shield).
- 'buff'   — no immediate combat effect. Sets state.classBuffFightsLeft
= CLASS_BUFF_FIGHTS (castSpell(), combat.js), which powers up that
class's existing mechanic (Meathead melee damage/Card Shark sneak
attack/Hexpert spell damage) for the next few fights.
- 'shout'  — Meathead-exclusive; see its own entry below.
- 'evade'  — Card Shark's Smoke Screen and Hexpert's Illusion (below)
both use this type, sharing one mechanic and one underlying flag
(state.evasionActive) since a player only ever has one class at a
time; see its own entry for why this one breaks from every type above it.
'heal'/'ward'/'buff'/'shout'/'evade' are all castable mid-combat
(costing the one turn — monsterRetaliate() fires exactly once per
cast, same as 'damage' — per explicit correction; these used to be
free actions with no retaliation at all, which let a player chain-cast
something like Stubborn Recovery for unlimited healing in a single
turn) — see castSpell()'s own comment, combat.js, for the shared
per-type logic. 'heal'/'ward'/'buff'/'shout' (not 'evade') are ALSO
castable from the Character page (renderCastableSpellsBlock(),
class-spells.js) as a genuinely free action there, since there's no
turn to cost outside combat at all. 'evade' stays combat-only, same
restriction 'damage' has, see its own entry below for why.

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
building for that class — used by the Act 2 spells below (stubbornrecovery/
smokescreen/arcanelance/illusion) so they're taught at each class's new
Gnometropolis building (garrison/roguesden/sanctum) instead of that
class's original Act 1 trainer, without changing where the ORIGINAL 6
spells above are still taught. renderClassSpellList() (class-spells.js)
filters on this same effective location too, so a building's list only
ever shows spells actually learnable there, never a spell that would
silently refuse when clicked from the wrong building. Meathead/Card
Shark each fill in the one spell TYPE their class didn't already have
(heal/ward respectively); Hexpert gets TWO Act 2 spells instead of one
— Arcane Lance (its own class-exclusive damage type, since Hex Bolt is
everyone's) AND Illusion (evasion, matching what Smoke Screen already
gave Card Shark) — a deliberate asymmetry, not an oversight.

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
buff-spell tier.

'evade' (Smoke Screen, Card Shark's Act 2 spell — and now Illusion,
Hexpert's second Act 2 spell, mechanically identical) was originally a
plain 'ward' — a shield, same as everything else that "defends."
Reworked per explicit correction: a shield doesn't fit an evasive class
the way a dodge boost does, and a shield that just sits there mid-fight
doesn't create any real decision. castSpell() now grants a large,
temporary boost to the player's own dodge chance (playerDodgeChance(),
combat.js — the one place both monsterAutoAttack() and a monster's own
'bolt' skill roll it) instead of touching state.shield at all. Two
rules make it a genuine tool rather than a free stat stick:
- Combat-only (state.evasionActive is reset every time endCombat()
  fires, same funnel winCombat()/playerFlee()/checkDefeat() all use for
  classBuffFightsLeft) — cast it mid-fight and it's gone the moment
  that fight ends, never carried into the next encounter the way
  Loaded Dice/Adrenaline Rush/Arcane Focus persist for CLASS_BUFF_FIGHTS
  fights. Also can't be pre-cast from the Character page for the same
  reason 'damage' can't — there's no "current fight" to apply it to.
- Broken by your own aggression (playerAttack(), and a 'damage' spell
  cast — see castSpell()) — swing back and the cloud clears instantly,
  before that action's own retaliation roll. The intended play pattern
  is cast it, then spend the safe window on a heal/item/ward instead of
  attacking — "vanish into the smoke long enough to patch yourself up,"
  not "attack safely forever." Priced steeply (20 MP, well past every
  other class buff's 10) since a near-total dodge window is strong
  enough to be worth a real MP commitment, not a habitual open. */
const spells = [
   { id:'hexbolt', name:'Hex Bolt', desc:'A jagged little curse that stings more than it should.', type:'damage', mpCost:3, price:15, dmgMin:4, dmgMax:9, icon: iconHexBolt },
   { id:'mendcharm', name:'Mending Charm', desc:'Patches you up with muttered nonsense and surprising effectiveness.', type:'heal', healValue:10, mpCost:4, price:15, classRequired:'Hexpert', icon: iconMendCharm },
   { id:'wardcharm', name:'Warding Charm', desc:"Throws up a shimmering barrier that soaks up damage before it reaches you. Stacks if you're already shielded.", type:'ward', mpCost:3, price:12, classRequired:'Hexpert', icon: iconWardCharm },
   { id:'bottledfury', name:'Bottled Fury', desc:'Everything the potion ingredients were trying to tell you, unleashed at once.', type:'damage', mpCost:6, dmgMin:9, dmgMax:16, questReward:true, icon: iconBottledFury },
   /* shieldScaleStat/shieldScalePerPoint (read generically by castSpell()'s
   'shout' branch, combat.js) — added per a playtested balance finding:
   this shield used to be a near-flat 5 + classSkillLevel*3 (max 14),
   decorative against a late-game hit that can run 200-400+ after
   mitigation, while Hexpert's own Warding Charm ('ward' type) already
   scaled with Hoodoo and stayed relevant at any level. Scales off Beef
   (Meathead's own defining stat) the same way ward scales off Hoodoo,
   so investing in the class's main stat keeps this tool useful instead
   of falling behind the game's own damage curve. */
   { id:'shout', name:'Shout', desc:"A bone-rattling battle cry that braces for impact instead of attacking — throws up a small shield.", type:'shout', mpCost:3, price:12, classRequired:'Meathead', shieldScaleStat:'beef', shieldScalePerPoint:3, icon: iconShout },
   { id:'adrenalinerush', name:'Adrenaline Rush', desc:"Floods your muscles with borrowed strength — hits harder than usual for your next few fights, not just this one.", type:'buff', mpCost:10, price:250, classRequired:'Meathead', icon: iconAdrenalineRush },
   { id:'loadeddice', name:'Loaded Dice', desc:"Tips the odds your way for a while — your opening strike is guaranteed to catch the next few fights' targets off guard.", type:'buff', mpCost:10, price:250, classRequired:'Card Shark', icon: iconLoadedDice },
   /* Per a live dungeon playtest: Card Shark was the only class with
   ZERO heal/shield spell at all (just Loaded Dice's buff and Smoke
   Screen's evade, neither of which actually mitigates a hit the way
   Meathead's Shout/Stubborn Recovery or Hexpert's Warding Charm/
   Mending Charm do) — every other class had 2 Act 1 utility spells,
   Card Shark had exactly 1. That gap was already real before tonight
   (Meathead/Hexpert both had it from the start); it only became an
   actual, measured loss (not just a theoretical gap) once dungeon
   difficulty was retuned against a realistic level/gear baseline.
   wardScaleStat:'zip' reuses castSpell()'s own 'ward' branch
   (generalized below, combat.js) — same shape Warding Charm already
   has, just scaled off Card Shark's own primary stat instead of
   Hoodoo. */
   { id:'aceinthehole', name:'Ace in the Hole', desc:"You've still got one more trick up your sleeve — throws up a shimmering barrier before anything can land.", type:'ward', mpCost:3, price:12, classRequired:'Card Shark', wardScaleStat:'zip', icon: iconAceInTheHole },
   { id:'arcanefocus', name:'Arcane Focus', desc:"Sharpens your Hoodoo to a fine point for a while — your spells bite harder for the next few fights.", type:'buff', mpCost:10, price:250, classRequired:'Hexpert', icon: iconArcaneFocus },
   /* Act 2's own trainers (Garrison/Rogues' Den/Arcane Sanctum,
   Gnometropolis) — see the comment above spells[] for why these three
   and not another copy of an existing type. */
   /* healPercentOfMaxHp/healPercentPerSkillLevel (read generically by
   castSpell()'s 'heal' branch, combat.js) — this heal used to be a
   flat 35 regardless of level, found "functionally decorative" against
   a late-game HP pool in the thousands; the fix TRIED first (scaling
   off Beef, Meathead's own stat, the same way Shout's shield does) per
   explicit correction overcorrected the other way — Beef is an
   unbounded offense stat with no relationship to this class's own HP
   pool, so a heavily-invested Meathead could out-heal their own maxHp
   in one cast. Scaling off maxHp itself instead (which Grit already
   drives, recomputeMaxStats(), player-actions.js) fixes both problems
   at once: the heal is ALWAYS a real fraction of whatever this
   character's current HP pool actually is, at level 1 or level 50,
   never decorative and never absurd. Mending Charm (Hexpert's own
   early, cheap heal) deliberately has neither field — it stays flat;
   it's an Act 1 utility spell, not this class's late-game sustain tool
   the way Stubborn Recovery is for Meathead. */
   { id:'stubbornrecovery', name:'Stubborn Recovery', desc:"You refuse to go down like that. Grit your teeth, shake it off, and keep going.", type:'heal', mpCost:8, price:300, classRequired:'Meathead', learnLocation:'garrison', healPercentOfMaxHp:0.18, healPercentPerSkillLevel:0.04, icon: iconStubbornRecovery },
   { id:'smokescreen', name:'Smoke Screen', desc:"Kick up a cloud of grit and vanish into it — your dodge goes way up for the rest of this fight, as long as you don't swing back. One attack and the cloud clears.", type:'evade', mpCost:20, price:300, classRequired:'Card Shark', learnLocation:'roguesden', icon: iconSmokeScreen },
   { id:'arcanelance', name:'Arcane Lance', desc:"No flourish, no misdirection — just a thin, precise lance of raw arcane force.", type:'damage', dmgMin:14, dmgMax:22, mpCost:8, price:350, classRequired:'Hexpert', learnLocation:'sanctum', icon: iconArcaneLance },
   /* Hexpert's SECOND Act 2 spell — added alongside Arcane Lance rather
   than replacing it, per explicit request, so Hexpert gets both the
   offense (Arcane Lance) and the utility tool (Illusion) Card
   Shark/Meathead each only got one of. Mechanically identical to Smoke
   Screen (same 'evade' type, same EVASION_DODGE_BONUS/CAP, content.js)
   — see state.evasionActive's own comment, core.js, for why the two
   safely share one underlying flag despite being different spells. */
   { id:'illusion', name:'Illusion', desc:"Split yourself into a dozen flickering copies — your dodge goes way up for the rest of this fight, as long as you don't swing back. One attack and the illusion collapses.", type:'evade', mpCost:20, price:300, classRequired:'Hexpert', learnLocation:'sanctum', icon: iconIllusion },
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

/* Quest 16, "Breaking Through" — the Mole Wars arc's own true capstone,
one step past quest15. Per explicit request, its 3 parts are gathered
three DIFFERENT ways rather than one repeated fetch loop: a guaranteed
zone drop (same mechanism as veinIngredients above), a salvage re-hunt
of an already-defeated boss (tunnelWardenSalvageHunt, combat.js —
tunnelWarden himself, not a new monster, closing the loop on Act 2's
very first named boss), and a straight currency purchase at the
Tinker's Workshop (buyDriveShaft(), player-actions.js). All three are
plain `type:'quest'` items, consumed together on report the same way
turnInVein() consumes veinIngredients. */
const DRILLDOZER_PLATING_NEEDED = 3;
const drilldozerIngredients = [
   { monsterName:"a slag-hauler, dragging a cart twice its own size",
    item:{ name:"a scrap of drill-plating", desc:"Still cart-shaped, if you squint.", type:"quest", key:"drillPlating", sell:6, icon:iconOreGrit } },
   ];
const drillRigItem = { name:"the tunnel warden's own reinforced digging rig", desc:"Buried where you left him. Still runs.", type:"quest", key:"drillRig", sell:0, icon:iconGuardHelm };
const DRIVE_SHAFT_COST_POPTABS = 220;
const DRIVE_SHAFT_COST_BOUNTYTOKENS = 18;
const driveShaftItem = { name:"a fresh drive shaft", desc:"Machined to spec. Smells like the forge it came out of.", type:"quest", key:"driveShaft", sell:0, icon:iconServoJoint };

/* Which state flag has to be true before a given quest item (by its `key`)
can be sold as junk — see isQuestItemSellable()/sellItemByName() in
game.js. Built from the item lists above instead of hand-typed so a
future quest item just needs to exist in one of these arrays (or get a
new entry here directly) rather than being forgotten in a third place. */
const QUEST_ITEM_COMPLETION_FLAG = {
   rakeTine: 'questComplete',
   ...Object.fromEntries(potionIngredients.map(p => [p.item.key, 'quest3Complete'])),
   ...Object.fromEntries(veinIngredients.map(v => [v.item.key, 'quest5Complete'])),
   ...Object.fromEntries(drilldozerIngredients.map(d => [d.item.key, 'quest16Complete'])),
   drillRig: 'quest16Complete',
   driveShaft: 'quest16Complete',
};

/* ---------------- Class titles (level-10 Guild capstone, "The Adventurer's Trial") ---------------- */
/* Awarded by claimClassPath() in game.js based on whichever stat the player
has invested the most points in (ties broken in this key order). Purely
a title + a small stat nudge — see claimClassPath() for the mechanic. */
const CLASS_TITLES = { beef:'Meathead', zip:'Card Shark', grit:'Bulwark', hoodoo:'Hexpert' };

/* ---------------- Armor classes (Heavy/Medium/Light per class) ---------------- */
/* Every equip item can now carry a `classRequired` field (equipItem(),
player-actions.js, gates on it; same field name/shape the spells[] list
above already uses for the same concept). Absent/undefined means
universal — anyone can equip it, and the gate itself also no-ops
entirely while state.classTitle is still null (pre-Trial), so a new
character isn't locked out of every piece of gear in the game before
they've even picked a class.

CLASS_SIGNATURE_STAT is just CLASS_TITLES' own beef/zip/hoodoo pairing
read the other way round: a class-tagged item's PRIMARY stat is always
its class's signature stat, by design (rollShopGearStats/
rollGearDropTier, economy.js/combat.js, still roll secondaries
normally on top). Grit/Bulwark has no entry here since Bulwark isn't a
reachable class (claimClassPath(), class-trial.js only accepts
beef/zip/hoodoo) — grit still exists as a normal secondary-stat roll
and still does its own job everywhere else (armor mitigation, max HP),
it's just never a class-tagged item's primary.

ARMOR_CLASS_WEIGHT is the actual Heavy>Medium>Light multiplier on an
item's armor value (ensureGearArmor(), item-tiers.js) — Meathead gear
protects noticeably more per item than Hexpert gear, same theme as the
user's own "meathead does heavy armor" framing. ARMOR_WEIGHT_LABEL is
purely cosmetic, for showing "Heavy"/"Medium"/"Light" next to an item's
class in the UI (gearRequirementText(), item-tiers.js). */
const CLASS_SIGNATURE_STAT = { Meathead:'beef', 'Card Shark':'zip', Hexpert:'hoodoo' };
const ARMOR_WEIGHT_LABEL = { Meathead:'Heavy', 'Card Shark':'Medium', Hexpert:'Light' };
const ARMOR_CLASS_WEIGHT = { Meathead:1.4, 'Card Shark':1.0, Hexpert:0.7 };

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
swing in the same turn. Was CARD_SHARK_PAYOUT_BONUS (a Casino win-payout
bonus) — replaced because a Card Shark's capstone skill only mattering
at the Casino, not in combat, felt off next to Meathead/Hexpert's both
being combat bonuses. */
const CARD_SHARK_DOUBLE_ATTACK_CHANCE = [0, 0.05, 0.10, 0.15];
const HEXPERT_SPELL_DMG_BONUS = [0, 3, 6, 9]; /* flat bonus added to spell damage */
/* Combat-variety pass: Card Shark's double-attack above was the only
one of the 3 class skills that produces a visible, "eventful" moment in
a fight — Meathead's/Hexpert's bonuses above are just a bigger number
on the same hit, nothing a player actually sees happen differently.
These two give the other two classes an equivalent proc, scaling off
the SAME state.classSkillLevel lever rather than inventing a second
training currency — one level now grants both the existing flat bonus
AND this chance together. All three proc-based class skills (this pair
plus CARD_SHARK_DOUBLE_ATTACK_CHANCE above, retuned alongside them) share
one unified 5%/10%/15% curve per explicit correction — noticeable
without being overpowered, clearer than the original 1/2/3% Card Shark
shipped with. */
/* MEATHEAD_STAGGER_CHANCE — rolled in playerAttack() (combat.js) only on
a LANDED (non-dodged) hit, since "staggering" requires actually
connecting. A landed stagger denies the monster's own retaliation this
turn, reusing the exact same mechanism the opening-swing sneak attack
already uses to do that — this is just a second, independent,
class-exclusive condition on the same check, not a new system. */
const MEATHEAD_STAGGER_CHANCE = [0, 0.05, 0.10, 0.15];
/* HEXPERT_ECHO_CHANCE/HEXPERT_ECHO_DAMAGE_MULT — rolled in castSpell()'s
'damage' branch (combat.js) right after the main cast resolves: a
chance to immediately echo-cast the same spell again at half power
(HEXPERT_ECHO_DAMAGE_MULT), zero extra MP cost. Matches the flavor
already written for the Crystal City's echo wraith gearDrop ("casts the
spell, then casts it again, slightly earlier") — this is that same beat,
now a real mechanic. Half power because it's free; a player paying full
MP for a second real cast should still hit harder than this. */
const HEXPERT_ECHO_CHANCE = [0, 0.05, 0.10, 0.15];
const HEXPERT_ECHO_DAMAGE_MULT = 0.5;
/* The shared 'evade' spell mechanic's own dodge boost
(playerDodgeChance(), combat.js) — a flat add-on to the normal
Zip-based roll, not a classSkillLevel-indexed array like the three
constants above. An 'evade' spell isn't amplifying an existing
per-class mechanic the way Adrenaline Rush/Loaded Dice/Arcane Focus
amplify one of these, it's introducing a standalone evasion window, so
there's no existing base value for classSkillLevel to scale. Capped
well short of 1 (EVASION_DODGE_CAP) so "heal safely" still carries a
sliver of real risk rather than becoming true invincibility. Renamed
from SMOKE_SCREEN_DODGE_BONUS/CAP once Illusion (Hexpert's own Act 2
evasion spell, below) started sharing the exact same mechanic — the
old names would have been a lie the moment a second spell used them. */
const EVASION_DODGE_BONUS = 0.5;
const EVASION_DODGE_CAP = 0.92;
/* The Level 2 spell-upgrade system, Hexpert-only, purchasable at the
Arcane Sanctum for every spell they know regardless of which building
originally taught it — per explicit request. One flat tier per spell
(no deeper ladder): SPELL_UPGRADE_MULTIPLIER scales whichever single
number is that spell's own "effect" (damage roll, heal value, shield
amount, buff duration, or evasion's own dodge bonus — see castSpell(),
combat.js, for exactly where each type applies it). Cost scales off the
spell's own mpCost rather than a hand-typed price per spell, so a
future spell needs no separate upgrade-cost entry to slot into this. */
const SPELL_UPGRADE_MULTIPLIER = 1.45;
const SPELL_UPGRADE_BASE_COST = 200;
const SPELL_UPGRADE_COST_PER_MP = 20;
function spellUpgradeCost(spell){ return SPELL_UPGRADE_BASE_COST + spell.mpCost * SPELL_UPGRADE_COST_PER_MP; }
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
plus one extra lookup field: `classRequired` (matches state.classTitle,
same field name the equip-gate/spells use — see the armor-classes
comment above CLASS_SIGNATURE_STAT below). Each is
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
   { name:"warlord's siege-breaker", desc:"Not subtle. Doesn't need to be.", type:"equip", slot:"weapon", bonus:{beef:2}, classRequired:'Meathead', tier:'epic', icon: iconSiegeBreaker },
   { name:"stolen palace-guard's uniform", desc:"Fits well enough, if nobody looks twice.", type:"equip", slot:"chest", bonus:{zip:2}, classRequired:'Card Shark', tier:'epic', icon: iconGuardUniform },
   { name:"warded seal, still humming", desc:"Warm to the touch. Getting warmer.", type:"equip", slot:"head", bonus:{hoodoo:2}, classRequired:'Hexpert', tier:'epic', icon: iconWardedSeal },
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
   name:"the Garrison's watch-captain, built like a slammed door", ...MONSTER_STATS["the Garrison's watch-captain, built like a slammed door"], rare:true, zone:"garrison",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"braces like a slammed door and hits back twice as hard" } ],
   art: artGarrisonGuardian, loot: PALACE_GATE_GEAR.find(g => g.classRequired === 'Meathead')
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
   name:"the Rogues' Den enforcer, already taking side bets on you", ...MONSTER_STATS["the Rogues' Den enforcer, already taking side bets on you"], rare:true, zone:"roguesden",
   art: artRoguesDenEnforcer, loot: PALACE_GATE_GEAR.find(g => g.classRequired === 'Card Shark'),
   gearDrop:{name:"the enforcer's own marked deck of the Loon", desc:"Every card's a threat, if you know how to throw it.", type:"equip", slot:"weapon", bonus:{hoodoo:5}, classRequired:'Hexpert', tier:'common', icon:iconCheatersDeck}
};
const arcaneSanctumGuardian = {
   name:"the Arcane Sanctum's warden, muttering an unfinished spell", ...MONSTER_STATS["the Arcane Sanctum's warden, muttering an unfinished spell"], rare:true, zone:"sanctum",
   skills:[ { type:'bolt', chance:0.25, boltMin:12, boltMax:18, flavor:"finally finishes the spell, unleashing a burst of raw arcane energy" } ],
   art: artArcaneSanctumGuardian, loot: PALACE_GATE_GEAR.find(g => g.classRequired === 'Hexpert')
};

/* Bestiary registry — every named rare/boss monster in the game,
collected into one array for the first time (they otherwise only ever
exist as standalone consts, each referenced individually by its own
*Hunt spawn check in goAdventuring(), combat.js). Nothing before this
needed them collected together; the Bestiary (renderBestiaryBlock(),
render-character.js) and its completion-bonus math (winCombat(),
combat.js) are the first things that do. content.js's own 15 are listed
directly since all are already in scope by this point in the file;
mudroot-content.js/warrensear-content.js/emberwarren-content.js each
append their own with `NAMED_BOSSES.push(...)` at the bottom of that
file, the same extension pattern those files already use for
`monsters.push(...)`/`BOUNTY_TEMPLATES.push(...)`. A future new boss
(or zone-rare, see ZONE_RARE_MONSTERS below) just gets pushed here
wherever it's defined — no different from the other wiring a new boss
already needs. crystalcity-content.js has none of its own yet (still a
stub zone) but pushes its own zone-rare here once that's added. */
const NAMED_BOSSES = [
   gnomeCommander, diggerBot, gnomeKingsCaptain,
   palaceGuard1, palaceGuard2, palaceGuard3, palaceGuard4, palaceGuard5,
   gnomeKing, trialChampion, casinoChampion, hoodooChampion,
   garrisonGuardian, roguesDenEnforcer, arcaneSanctumGuardian,
];

/* One zone-rare monster per real adventuring zone (ADVENTURE_ZONES,
combat.js — deliberately 15, not 16: `palace` is gauntlet-only and was
never a wild-exploration zone, so it gets no zone-rare of its own).
Unlike every *Hunt rare above (quest-gated, one-time, a single
hand-written if-block per boss in goAdventuring()), these are
ALWAYS available and repeatable — a flat chance every adventure in
their zone, forever, checked generically once in goAdventuring()
rather than needing 15 near-identical copies of that block. One shared
chance constant, one lookup table built up the same way NAMED_BOSSES
is — content.js's own 7 Act 1 zone-rares populate it directly below;
mudroot-content.js/warrensear-content.js/emberwarren-content.js/
crystalcity-content.js each add their own with
`Object.assign(ZONE_RARE_MONSTERS, {...})` at the bottom of that file,
same convention noncombatEvents/hazardEvents already use. Every
zone-rare is ALSO pushed onto NAMED_BOSSES above, so it's trackable in
the Bestiary like any other named monster. */
const ZONE_RARE_SPAWN_CHANCE = 0.05;
const ZONE_RARE_MONSTERS = {};

/* Act 1's 7 zone-rares — stats derived from each zone's own toughest
REGULAR monster (monsters[] above), not invented: beef/grit run ~20%
above that ceiling, xp ~1.5-2x it, capped comfortably below whatever
quest-rare/boss already guards that same zone so a zone-rare never
outshines the real encounter there. */
const mossbackStrider = {
   name:"a mossback strider, somehow taller every time you look away", ...MONSTER_STATS["a mossback strider, somehow taller every time you look away"], rare:true, zone:"commons",
   art: artMossbackStrider,
   loot:{name:"a fistful of impossibly fresh moss", desc:"Still damp. The ground nearby is bone dry.", type:"junk", sell:8, icon:iconSoil}
};
const sewerSovereign = {
   name:"the sewer sovereign, crowned in bottlecaps nobody remembers losing", ...MONSTER_STATS["the sewer sovereign, crowned in bottlecaps nobody remembers losing"], rare:true, zone:"sewers",
   art: artSewerSovereign,
   loot:{name:"a bottlecap crown, slightly too small for you", desc:"Dented in exactly the shape of a tiny, confident head.", type:"junk", sell:12, icon:iconBottlecapHelmet}
};
const quarryWraith = {
   name:"a quarry wraith, worn into the rock face itself", ...MONSTER_STATS["a quarry wraith, worn into the rock face itself"], rare:true, zone:"quarry",
   art: artQuarryWraith,
   loot:{name:"a sliver of quarry-wraith stone, warm despite the chill", desc:"Keeps the exact shape it was chipped into. Won't say why.", type:"junk", sell:16, icon:iconOreGrit}
};
const vaultBornEcho = {
   name:"a vault-born echo, wearing a face it borrowed from a mirror", ...MONSTER_STATS["a vault-born echo, wearing a face it borrowed from a mirror"], rare:true, zone:"vault",
   art: artVaultBornEcho,
   loot:{name:"a shard of borrowed glass, reflecting something else entirely", desc:"Not your face. Not anyone's face you recognize.", type:"junk", sell:22, icon:iconCapturedLight}
};
const unlistedRecruit = {
   name:"the garrison's unlisted recruit, nobody's sure who signed off on it", ...MONSTER_STATS["the garrison's unlisted recruit, nobody's sure who signed off on it"], rare:true, zone:"garrison",
   art: artUnlistedRecruit,
   loot:{name:"the unlisted recruit's own forged enlistment papers", desc:"Signed, stamped, and entirely fictional.", type:"junk", sell:28, icon:iconDrillRoster}
};
const shadeFingeredCutpurse = {
   name:"a shade-fingered cutpurse, light-footed even by Rogues' Den standards", ...MONSTER_STATS["a shade-fingered cutpurse, light-footed even by Rogues' Den standards"], rare:true, zone:"roguesden",
   art: artShadeFingeredCutpurse,
   loot:{name:"a lifted trinket nobody's reported missing yet", desc:"Somebody's definitely going to notice this is gone. Eventually.", type:"junk", sell:28, icon:iconCoinPurse}
};
const halfCastFamiliar = {
   name:"a half-cast familiar, stuck between the spell and the shape it was meant to take", ...MONSTER_STATS["a half-cast familiar, stuck between the spell and the shape it was meant to take"], rare:true, zone:"sanctum",
   art: artHalfCastFamiliar,
   loot:{name:"a half-formed hex, still humming", desc:"Never finished. Still works, somehow, a little.", type:"junk", sell:22, icon:iconFeatherScale}
};
Object.assign(ZONE_RARE_MONSTERS, {
   commons: mossbackStrider, sewers: sewerSovereign, quarry: quarryWraith, vault: vaultBornEcho,
   garrison: unlistedRecruit, roguesden: shadeFingeredCutpurse, sanctum: halfCastFamiliar,
});
NAMED_BOSSES.push(mossbackStrider, sewerSovereign, quarryWraith, vaultBornEcho, unlistedRecruit, shadeFingeredCutpurse, halfCastFamiliar);

/* ---------------- Casino: Blackjack ---------------- */
/* Replaces the old flat coin-flip (gambleCasino() — Bet 5/10/25 for a
CASINO_WIN_CHANCE-ish shot at a flat 2x) per explicit direction: a real
card game instead of "straight betting." All the actual dealing/hand
logic lives in casino.js (dealBlackjack()/blackjackHit()/blackjackStand()/
resolveBlackjack()) — this is just the deck's own data (ranks/suits,
drawn from an infinite shoe — no depleting deck to track, same
"roll a fresh random one" shape startCombat() already uses for
monsters rather than modeling a finite pool) and the payout/flavor
constants split out the way every other content table in this file is.

Payouts are standard blackjack: a normal win pays 1:1
(BLACKJACK_WIN_PAYOUT), a natural blackjack (21 on the first two cards)
pays 3:2 (BLACKJACK_NATURAL_PAYOUT) — both on top of the returned bet.
The dealer stands at BLACKJACK_DEALER_STAND (17) or higher, hits below
it — no soft-17 distinction, a deliberate slight simplification (and
a hair player-favorable) rather than tracking soft/hard dealer logic
for a casual minigame. The house's edge now comes from the RULES
themselves (dealer-wins-on-push-adjacent totals, both-bust-you-still-
lose), not an injected probability the way CASINO_WIN_CHANCE used to
work — CASINO_WIN_BONUS (below) still matters, just as a payout boost
on a win instead of a chance-to-win boost. */
const CARD_RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const CARD_SUITS = ['♠','♥','♦','♣'];
const BLACKJACK_DEALER_STAND = 17;
const BLACKJACK_WIN_PAYOUT = 1;      /* 1:1 on a normal win */
const BLACKJACK_NATURAL_PAYOUT = 1.5; /* 3:2 on a natural blackjack */
const blackjackWinLines = [
   "You beat the dealer's hand clean. You win.",
   "The Croupier counts it out without a word. You win.",
   "Your hand holds up. You win.",
   ];
const blackjackNaturalLines = [
   "Blackjack! The Croupier doesn't even try to look pleased.",
   "Two cards, twenty-one. Blackjack.",
   ];
const blackjackDealerBustLines = [
   "The dealer busts chasing your hand. You win.",
   "The Croupier goes over trying to catch up. You win.",
   ];
const blackjackBustLines = [
   "You bust. The Croupier sweeps your stake without looking up.",
   "Over 21. The house doesn't need to do anything else.",
   ];
const blackjackLoseLines = [
   "The dealer's hand holds up better than yours.",
   "Not enough. The house takes it.",
   ];
const blackjackDealerBJLines = [
   "The dealer flips a natural blackjack. Rough beat.",
   "Blackjack, dealer's side. No beating that.",
   ];
const blackjackPushLines = [
   "Same total both sides. Push — your bet's returned.",
   "A tie. The Croupier slides your stake right back.",
   ];

/* ---------------- Rogues' Den: Hi-Lo ---------------- */
/* The second, simpler casino minigame per explicit direction ("what
other casino game is easy to develop") — lives at the Rogues' Den
(Card Shark's Act 2 building) rather than the Casino, so it gets its
own file (hilo.js) the same way Blackjack got casino.js, but shares
CARD_RANKS/CARD_SUITS/drawCard()/cardChipHtml() (content.js/casino.js)
rather than re-declaring a second deck.

One card shows face up; the player bets on whether the NEXT card will
rank higher or lower, using CARD_RANKS' own array order as the rank
scale (hiloRankIndex(), hilo.js — Ace is index 0, lowest, King is
index 12, highest, since that's the order CARD_RANKS is already
written in). A correct guess doesn't end the round: the drawn card
becomes the new one to beat, and the player can either cash out what's
built up so far or press their luck on another guess — HILO_STREAK_PAYOUT
is the profit added per correct guess IN A ROW, linear rather than
compounding (streak 2 is worth 2x this, not this-squared) to keep the
number legible and the house's edge from ballooning out of hand. A
wrong guess loses the whole streak, not just this guess — cash out is
the only way to actually bank anything. A tie (same rank) redraws
silently (hiloDrawDistinctFrom(), hilo.js) rather than counting as a
win, loss, or push — there's no clean rule for "the next card was
exactly as high as this one" that wouldn't feel arbitrary, so the game
simply doesn't let that case exist. No CASINO_WIN_BONUS-style building
upgrade bonus — that constant is scoped to the Casino building
specifically (state.buildingUpgrades.casino), and there's no
equivalent Rogues' Den upgrade to hang a second one off of. */
const HILO_STREAK_PAYOUT = 0.75; /* profit per correct guess, as a fraction of the bet */
const hiloLoseLines = [
   "Wrong side of the card. The Croupier collects the whole streak.",
   "Not this time — the streak's gone, stake and all.",
   ];
const hiloCashOutLines = [
   "You quit while you're ahead. Smart.",
   "The Croupier counts it out, visibly disappointed you stopped there.",
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

/* ---------------- Gear Tempering (Bounty Tokens' first real sink) ---------------- */
/* Bounty Tokens have paid out since Act 1 with nothing to spend them on
("Tokens can be spent at a future gear exchange — nothing to redeem
them for yet.", the Bounty Board's own old copy, render-shop.js) — this
is that exchange. temperEquippedItem(slot) (player-actions.js), only
from the Tinker's Workshop (state.location==='tinker' — a tinkerer's
workshop fits "reinforce my gear" better than a menu tucked away on
the Character page, per explicit correction; renderTinkerTemperBlock(),
render-character.js, is the Workshop's own version of
renderEquipmentBlock()'s item rows), permanently multiplies EVERY stat
an equipped item grants by TEMPER_STAT_MULTIPLIER, rounded UP to the
next whole number, one temper at a time — a multiplier rather than a
flat add, so it compounds: a +6 stat becomes 9, then 14, then 21, each
temper applying to the ALREADY-tempered value, not the original,
capped at TEMPER_MAX_LEVEL (+5) per item. Also stamps a `+N` onto the
item's displayed name (itemNameHtml(), item-tiers.js) for however many
times it's been tempered. temperLevel lives right on the item object
itself (like `bonus`/`tier` already do), not as a separate counter
anywhere in `state` — it round-trips through save.js's already-generic
serializeItem()/hydrateItem() for free, no save-format change needed,
and there's nothing to lose: tempering only ever mutates an item
that's already sitting in `state.equipment`, never removes or
replaces it.

Cost scales quadratically per temper ON THAT ITEM (temperCost(level) —
same shape classSkillCost()/buildingUpgradeCost() already use), so
spreading Bounty Tokens across several pieces of gear stays cheaper
than stacking them all onto one — a real brake against the compounding
multiplier above turning one item absurd well before TEMPER_MAX_LEVEL
even comes into it (temperCost(4), the cost of the 5th and final
temper, is 100 Bounty Tokens on its own). */
const TEMPER_BASE_COST = 4;
const TEMPER_STAT_MULTIPLIER = 0.5; /* +50% per temper, compounding, rounded up */
const TEMPER_MAX_LEVEL = 5;
function temperCost(level){ return TEMPER_BASE_COST * (level+1) * (level+1); }

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
- 'casino' — CASINO_WIN_BONUS, a payout multiplier on top of a
             Blackjack win (resolveBlackjack(), casino.js — a maxed
             Casino turns a normal win's 1:1 into 1.1:1), PLUS a
             second, independent effect, CASINO_WINNINGS_CAP (see its
             own comment further below) — raising the passive-income
             cap and unlocking it in the first place at level 1.
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

/* Monster combat stats (beef/zip/grit/hoodoo, mirroring the player's own 4)
replace every monster's old raw hp/atkMin/atkMax/dodgeChance fields —
deriveMonsterCombatStats() (combat.js) turns them into the numbers
startCombat() actually uses, via statBonus() same as every player formula.
No "level" term (monsters don't level). hoodoo now DOES have a real
mechanical effect — see hoodooResistance()'s own comment further down —
but it's a damage-mitigation layer read by applyDamageToMonster(), not a
skills[] input; every monster's skills[] still keeps its own hand-authored
heal/bolt/debuff numbers untouched regardless of hoodoo. */
const MONSTER_HP_PER_GRIT = 1; /* hp = statBonus(grit) * this */
const MONSTER_ATK_PER_BEEF = 1; /* atk center = statBonus(beef) * this, spread +/- MONSTER_ATK_SPREAD below */
const MONSTER_ATK_SPREAD = 0.25;
/* Zip's own coefficient/cap — shared by BOTH sides, BOTH directions:
a player's/monster's zip drives their own dodge chance via this same
formula (zipDodgeAndAccuracy(), combat.js) AND, symmetrically, their
own ACCURACY — how much they cancel out of whoever they're attacking's
dodge chance. One number, one meaning, on offense or defense, no
matter which side rolls it — per explicit request that zip "combat"
the opponent's dodge chance both ways, not just raise your own. No
longer MONSTER-only despite the name's history (this used to be
monster-specific before the player's own dodge formula's identical
0.03/0.5 got folded into the same shared function). */
const ZIP_DODGE_COEFFICIENT = 0.03;
const ZIP_DODGE_CAP = 0.5;

/* Armor — a brand new mitigation stat, shared by both the player (gear-only,
see STAT_LABELS/SPENDABLE_STAT_KEYS, core.js) and monsters. armorDamageReduction()
(combat.js) reuses statBonus()'s own superlinear curve — each point is worth
MORE, same as beef/zip/grit/hoodoo already are — but the result is capped at
ARMOR_REDUCTION_CAP, so in practice reduction climbs quickly at low-to-
moderate armor and then hard-flatlines at the ceiling rather than ever
reaching (or exceeding) 100%. */
const ARMOR_REDUCTION_COEFFICIENT = 0.02;
const ARMOR_REDUCTION_CAP = 0.6;

/* Hoodoo's own monster-side mechanic, per explicit request ("how do we
make hexpert viable" / "ethereal things should [use hoodoo]") — until
now a monster's hoodoo had NO mechanical effect at all (see the old
comment above `monsters[]`, content.js, for why: skills[] kept their
own hand-authored magnitude regardless of it). hoodooResistance()
(combat.js) reuses the exact same statBonus()-driven, capped-reduction
shape armorDamageReduction() already has — but it ONLY mitigates
NON-magic damage (a plain Attack, Card Shark's bonus swing), never a
spell (applyDamageToMonster()'s own `isMagic` parameter is what gates
this — see its comment). A monster with real hoodoo reads as
"ethereal": physically tougher than its armor alone would suggest, but
a Hexpert's own spell damage punches straight through untouched,
because magic was never what it was ever resisting. Deliberately a
LOWER cap than armor's own (0.4 vs 0.6) — this has to stay beatable
with nothing but Attack for the 2 of 3 classes who can never swap into
Hexpert mid-playthrough (class choice is permanent), just slower/
harder, not walled off; it's an edge for whoever brought magic, not a
hard class gate. No compensating grit cut on the "ethereal" archetype
monsters that use this (monster-stats.js) the way the evasive/armored
archetypes get one — unlike dodge/armor, this resistance is
CONDITIONAL on the attacker's own choice of damage type, not a
universal defense every class pays the same price to see, so there's
no universal difficulty increase to offset.

Rolled out as a real "ethereal" archetype across 70 of the 122 monsters
left eligible after the evasive/armored passes claimed the rest
(monster-stats.js, mutually exclusive with both the same way evasive
and armored already are with each other) — hoodoo 5-7 for regular/
dungeon-trash, 9-11 for zone-bosses/dungeon-minibosses (12-14, hitting
the cap outright, was reserved for dungeon-bosses but all 8 were
already claimed 4-evasive/4-armored, so no dungeon-boss ended up
ethereal this pass). Selection: an explicit ethereal-flavored name
(wisp/spirit/shadow/echo/ghost/familiar/summon/hex/rune/witch/wizard/
oracle/curse/etc) always converts; an explicit mundane-brute name
(brute/warden/sentinel/plated/forged/guard/etc) never does; anything
else in the remaining pool converts roughly 1-in-3, same density every
archetype pass here uses. */
const HOODOO_RESIST_COEFFICIENT = 0.02;
const HOODOO_RESIST_CAP = 0.4;

/* A monster's own armor WAS derived purely from grit + whether it's
rare:true (two flat per-grit rate constants that used to live here),
not an authored field — tried a hand-picked armor:N literal on a short
list of "marquee" bosses first, 0 on everyone else, then replaced BOTH
of those with a formula so the whole bestiary got a real, consistent
value. Per explicit later request ("monsters should also have an armor
stat"), it's now a third thing: a genuine authored field, `armor`, in
MONSTER_STATS (monster-stats.js) right alongside beef/zip/grit/hoodoo —
deriveMonsterCombatStats() (combat.js) just reads it straight off the
template now, no formula left here at all. Every monster was seeded
with exactly what the old formula would have produced for its grit/
rare at the time of the switch, so this was a pure architecture change,
not a balance change — see monster-stats.js's own comment for the
seeding math and how to deliberately diverge a monster's armor from
its grit going forward (a heavily-plated-but-fragile archetype, not
yet authored anywhere, the armor-side mirror of zip's own evasive
archetype). */

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

/* The Casino — a payout multiplier on a Blackjack win (resolveBlackjack(),
casino.js): winnings = round(bet * payout * (1 + CASINO_WIN_BONUS[level])).
0.10 at max level turns a normal win's 1:1 payout into 1.1:1, a natural's
3:2 into 1.65:1 — Blackjack's own rules already supply the house's edge
now (see the comment above blackjackWinLines), so this is framed as
"the house shares a little more of a win with you" rather than
"narrowing the house's edge" the old flat-bet version was. */
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
