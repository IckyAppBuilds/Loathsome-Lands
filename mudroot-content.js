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
need a brand-new SVG). gearDrop bonus values are +4 (one step past
Gnometropolis districts' own +3, tracking the same "+1/+2/+3" curve
content.js's own comment above monsters[] describes). */
const mudrootMonsters = [
   { name:"a blind tunnel-mole, all claws", hp:42, atkMin:6, atkMax:10, xp:25, zone:"rootcellar",
    art: artTunnelMole, loot:{name:"fistful of freshly-turned root-dirt", desc:"Rich, dark, and recently disturbed.", type:"junk", sell:10, icon:iconSoil},
    rareDrop:{name:"the mole's own lucky digging claw", desc:"Worn smooth from decades of tunneling toward something.", type:"junk", sell:35, icon:iconFigurine},
    gearDrop:{name:"claw-notched digging spike of the Badger", desc:"Balanced for digging. Repurposed for hitting things.", type:"equip", slot:"weapon", bonus:{beef:4}, tier:'common', icon:iconRakeShank} },
   { name:"a root-gnawing grub, fat and glistening", hp:38, atkMin:5, atkMax:9, xp:23, zone:"rootcellar",
    art: artRootGrub, loot:{name:"glistening chewed root-fiber", desc:"Still faintly warm. You don't ask why.", type:"junk", sell:9, icon:iconOreGrit},
    rareDrop:{name:"grub's own hoarded good-luck pebble", desc:"Grubs, it turns out, believe in luck too.", type:"luck", hpValue:21, mpValue:11, icon:iconClover},
    gearDrop:{name:"grub-slick carapace plating of the Tortoise", desc:"Slick, load-bearing, and faintly unpleasant to touch.", type:"equip", slot:"chest", bonus:{grit:4}, tier:'common', icon:iconVest} },
   { name:"a mole-sapper, packing a satchel of loose dirt", hp:46, atkMin:6, atkMax:11, xp:27, zone:"rootcellar",
    art: artMoleSapper, loot:{name:"satchel of finely sifted collapse-dirt", desc:"Packed for exactly one purpose: bringing down a ceiling.", type:"junk", sell:11, icon:iconPipeFitting},
    rareDrop:{name:"the sapper's unused good-luck charm", desc:"Never needed it, evidently. You do now.", type:"junk", sell:37, icon:iconFigurine},
    gearDrop:{name:"sapper's dirt-packed leg wraps of the Weasel", desc:"Built for a fast retreat after the ceiling comes down.", type:"equip", slot:"legs", bonus:{zip:4}, tier:'common', icon:iconShinGuard} },
   { name:"a mudflat leech, bloated and patient", hp:50, atkMin:7, atkMax:12, xp:30, zone:"mudflats",
    art: artMudflatLeech, loot:{name:"bloated, still-twitching leech segment", desc:"You cut it off. It's still moving.", type:"junk", sell:12, icon:iconRatTail},
    rareDrop:{name:"leech's hoarded silt-pearl", desc:"Patient enough to swallow one, apparently.", type:"luck", hpValue:23, mpValue:12, icon:iconClover},
    gearDrop:{name:"leech-slick wading boots of the Weasel", desc:"Somehow keeps the mud out. Somehow.", type:"equip", slot:"boots", bonus:{zip:4}, tier:'common', icon:iconGripBoots} },
   { name:"a mole scout, painted in warpaint mud", hp:54, atkMin:7, atkMax:12, xp:32, zone:"mudflats",
    art: artMoleScout, loot:{name:"scout's smeared warpaint mud", desc:"Still wet. Still watching, somehow, from wherever it went.", type:"junk", sell:13, icon:iconSurveyMap},
    rareDrop:{name:"scout's own uncanny sense of direction, bottled", desc:"It never once got lost down here. Neither will you, for a while.", type:"luck", hpValue:23, mpValue:12, icon:iconClover},
    gearDrop:{name:"scout's mud-caked warpaint wand of the Loon", desc:"Doubles as a weapon. Mostly a paintbrush, though.", type:"equip", slot:"weapon", bonus:{hoodoo:4}, tier:'common', icon:iconWandStick} },
   { name:"a burrow-hound, all teeth and no eyes", hp:58, atkMin:8, atkMax:13, xp:34, zone:"mudflats",
    art: artBurrowHound, loot:{name:"burrow-hound's cast-off tooth", desc:"Doesn't need eyes when it's got teeth like this.", type:"junk", sell:14, icon:iconBurrowShell},
    rareDrop:{name:"the hound's own keen, sightless instinct", desc:"You start noticing things a beat before they happen.", type:"junk", sell:40, icon:iconFigurine},
    gearDrop:{name:"hound-tooth skullguard of the Tortoise", desc:"Bite marks included, free of charge.", type:"equip", slot:"head", bonus:{grit:4}, tier:'common', icon:iconGuardHelm} },
   /* The Bureau's business moles — a third, parallel district (same
   ZONE_DIFFICULTY tier as Root Cellar, not part of the tunnelWarden/
   warrenScout sequence), run entirely on paperwork instead of claws. */
   { name:"a mole clerk, drowning in triplicate paperwork", hp:40, atkMin:6, atkMax:10, xp:24, zone:"bureau",
    art: artMoleClerk, loot:{name:"hopelessly tangled reel of red tape", desc:"Somehow still spooling. Nobody knows where it ends.", type:"junk", sell:10, icon:iconVizierLedger},
    rareDrop:{name:"a form that approves its own approval", desc:"Bureaucratically flawless. Deeply unsettling.", type:"junk", sell:36, icon:iconFigurine},
    gearDrop:{name:"paperwork-padded trouser cuffs of the Weasel", desc:"Filed correctly, for once, and surprisingly comfortable.", type:"equip", slot:"legs", bonus:{zip:4}, tier:'common', icon:iconQuickstepTrousers} },
   { name:"a mole auditor, sniffing out every discrepancy", hp:44, atkMin:6, atkMax:11, xp:26, zone:"bureau",
    art: artMoleAuditor, loot:{name:"auditor's marked-up ledger page", desc:"Every number circled twice, in a different color both times.", type:"junk", sell:11, icon:iconDrillRoster},
    rareDrop:{name:"the auditor's own clean bill of health, forged", desc:"Passed inspection. Somehow. You're not asking how.", type:"luck", hpValue:22, mpValue:11, icon:iconClover},
    gearDrop:{name:"auditor's spectacles-and-helm of the Tortoise", desc:"Sees every discrepancy. Stops most head trauma.", type:"equip", slot:"head", bonus:{grit:4}, tier:'common', icon:iconGuardHelm} },
   { name:"a mole notary, stamping everything twice out of spite", hp:48, atkMin:7, atkMax:11, xp:28, zone:"bureau",
    art: artMoleNotary, loot:{name:"notary's over-inked rubber stamp", desc:"Stamps everything. Has opinions about all of it.", type:"junk", sell:12, icon:iconCoinPurse},
    rareDrop:{name:"the notary's own personal seal of approval", desc:"Rarely given. Never explained.", type:"luck", hpValue:22, mpValue:11, icon:iconClover},
    gearDrop:{name:"notary's oversized rubber stamp-mace of the Badger", desc:"Notarized. Also a mace.", type:"equip", slot:"weapon", bonus:{beef:4}, tier:'common', icon:iconRakeShank} },
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
   name:"the tunnel warden, wide as the passage itself", hp:80, atkMin:9, atkMax:14, xp:50, rare:true, zone:"rootcellar",
   skills:[ { type:'buff', chance:0.20, buffMult:1.6, buffTurns:2, flavor:"plants itself like the tunnel grew it there" } ],
   art: artTunnelWarden, loot:null
};
const warrenScout = {
   name:"the warren scout, already circling", hp:90, atkMin:10, atkMax:15, xp:55, rare:true, zone:"mudflats",
   dodgeChance:0.25,
   art: artWarrenScout, loot:null
};

/* Folds these two districts into the pool startCombat() actually draws
from (monsters.filter(m => m.zone===state.location), combat.js) — a
plain array mutation, not a reassignment, so it stays a genuine `const`
concatenation rather than needing combat.js's own filter touched. */
monsters.push(...mudrootMonsters);

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
