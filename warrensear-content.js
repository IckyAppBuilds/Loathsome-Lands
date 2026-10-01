/* ---------------- The Warren's Ear content (Act 2, quest10) ---------------- */
/* New concern, new file per the project's "new concern gets a new file"
convention (AGENTS.md) — mirrors mudroot-content.js's own role exactly,
one hub deeper. Loads after content.js/mudroot-content.js/icons.js/
warrensear-art.js (whose functions this file references by value at
parse time or extends by reference).

The Choir's 3 regulars + the Ledger Vault's 3 regulars follow the exact
same loot/rareDrop/gearDrop shape as every monster in content.js's own
monsters[] — reusing existing icons throughout, same established
convention. gearDrop bonus values continue the same per-zone ladder
(+8 — one step past rootcellar/mudflats/bureau's own +6/+7). */
const warrensEarMonsters = [
   { name:"a mole cantor, humming the wrong note on purpose", beef:8, zip:0, grit:24, hoodoo:0, xp:38, zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:87, boltMax:112, flavor:"hits the one note that actually hurts" } ],
    art: artMoleCantor, loot:{name:"cantor's cracked pitch-stone", desc:"Hums back at you, slightly out of tune.", type:"junk", sell:15, icon:iconWhistle},
    rareDrop:{name:"the cantor's own perfect note, bottled", desc:"You've never heard silence sound so loud.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"cantor's resonant collar-plate of the Badger", desc:"Hums faintly whenever something's listening back.", type:"equip", slot:"chest", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconVest} },
   { name:"an echo-mole, never quite where the sound says it is", beef:7, zip:0, grit:23, hoodoo:0, xp:36, zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:27, healMax:50, flavor:"an echo of itself arrives a beat late, already patched up" } ],
    art: artEchoMole, loot:{name:"warped echo-shell fragment", desc:"Whispers back whatever you last said, badly.", type:"junk", sell:14, icon:iconShellFragment},
    rareDrop:{name:"an echo that arrived before the sound did", desc:"You're choosing not to think about that too hard.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"echo-mole's mis-timed warpaint wand of the Weasel", desc:"Casts the spell a half-second before you finish it.", type:"equip", slot:"weapon", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconWandStick} },
   { name:"a listening-post sentry, all ears and no eyes", beef:8, zip:0, grit:25, hoodoo:0, xp:40, zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"cups both ears and leans in, newly alert" } ],
    art: artListeningSentry, loot:{name:"sentry's oversized cupped ear", desc:"Still twitching toward the last thing that moved.", type:"junk", sell:16, icon:iconSentinelEye},
    rareDrop:{name:"the sentry's own uncanny early warning", desc:"You start hearing trouble a beat before it arrives.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"sentry's cupped-ear pauldron of the Loon", desc:"Hears everything. Blocks most of it, too.", type:"equip", slot:"head", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconGuardHelm} },
   { name:"an archivist-mole, buried under three ledgers at once", beef:8, zip:0, grit:24, hoodoo:0, xp:39, zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:87, boltMax:112, flavor:"hurls an entire ledger, spine-first" } ],
    art: artArchivistMole, loot:{name:"triple-cross-referenced ledger scrap", desc:"References two other ledgers you'll never find.", type:"junk", sell:15, icon:iconVizierLedger},
    rareDrop:{name:"a ledger entry that approves itself, recursively", desc:"It's been auditing itself for years. It's winning.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"archivist's ledger-strapped greaves of the Badger", desc:"Every step filed in triplicate.", type:"equip", slot:"legs", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a vault clerk, stamping things that don't need stamping", beef:7, zip:0, grit:23, hoodoo:0, xp:37, zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healMin:27, healMax:50, flavor:"over-stamps its own wound until it's technically fine" } ],
    art: artVaultClerk, loot:{name:"over-stamped requisition form", desc:"Approved, denied, and approved again.", type:"junk", sell:14, icon:iconCoinPurse},
    rareDrop:{name:"the clerk's own personal rubber stamp of destiny", desc:"Whatever it stamps next, apparently, happens.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"clerk's ink-stained boots of the Weasel", desc:"Tracks ink into every room you enter after this.", type:"equip", slot:"boots", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconGripBoots} },
   { name:"an auditor-in-chief, radiating quiet disapproval", beef:8, zip:0, grit:25, hoodoo:0, xp:41, zone:"ledgervault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"radiates fresh disapproval, somehow emboldened by it" } ],
    art: artAuditorInChief, loot:{name:"auditor-in-chief's own red pen", desc:"Never runs out of ink. Never runs out of complaints.", type:"junk", sell:16, icon:iconDrillRoster},
    rareDrop:{name:"a complaint filed against the concept of complaints", desc:"It's somehow already been escalated.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"auditor-in-chief's own weapon-grade clipboard of the Loon", desc:"Objectively the most feared object in the building.", type:"equip", slot:"weapon", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconRakeShank} },
   ];

/* Quest 10's two rare hunt targets — a CHOICE, not a sequence: both spawn
the moment quest10Accepted (unlike quest9's tunnelWarden/warrenScout,
which gate each other), each in an EXISTING Mudroot Warren district
(Root Cellar/the Bureau) rather than a brand-new zone, so the two paths
are available in parallel from the very start. Whichever the player
defeats FIRST sets state.quest10Path (winCombat(), combat.js) and
reveals that district of the Warren's Ear immediately (the OTHER rare
hunt keeps spawning independently — defeating it later still reveals
its own district, just doesn't change quest10Path once already set).
No rareDrop/loot of their own, same reasoning as every other named
quest-hunt boss (gnomeCommander/diggerBot/tunnelWarden/etc.) — they're
already a dedicated quest reward. */
const TUNNEL_MOLE_INFORMANT_SPAWN_CHANCE = 0.05;
const SENIOR_CLERK_SPAWN_CHANCE = 0.05;
const tunnelMoleInformant = {
   name:"a nervous tunnel-mole informant", beef:7, zip:5, grit:26, hoodoo:0, xp:48, rare:true, zone:"rootcellar",
   art: artTunnelMoleInformant, loot:null
};
const seniorClerk = {
   name:"a senior clerk, guarding a very particular ledger", beef:7, zip:0, grit:26, hoodoo:0, xp:48, rare:true, zone:"bureau",
   skills:[ { type:'heal', chance:0.20, healMin:12, healMax:18, flavor:"cites a procedural delay and buys itself time" } ],
   art: artSeniorClerk, loot:null
};

/* Quest 14's own gauntlet, "the Ledger Committee" — the Ledger Vault's
first named encounter of any kind (it's had 3 regular monsters since
warrensEarMonsters above, but no rare hunt/boss until now). A SCRIPTED
approach, not a random hunt — see approachGauntlet('ledgerCommittee'),
gauntlet.js, which generalizes the Act 1 Palace Gate's own
approach-a-gate-in-order pattern instead of hand-copying it a second
time. committeeAuditor is the one guard standing between the door and
vaultKeeper; no loot/rareDrop on either, same reasoning as every other
named quest-hunt boss. */
const committeeAuditor = {
   name:"a committee auditor, cross-referencing you against three different ledgers", beef:9, zip:0, grit:29, hoodoo:0, xp:45, rare:true, zone:"ledgervault",
   skills:[ { type:'buff', chance:0.20, buffMult:1.5, buffTurns:2, flavor:"finds a discrepancy in your favor, then immediately revokes it" } ],
   art: artCommitteeAuditor, loot:null
};
const vaultKeeper = {
   name:"the vault keeper, the only door in the Warren's Ear that was never meant to open", beef:9, zip:0, grit:31, hoodoo:0, xp:68, rare:true, zone:"ledgervault",
   skills:[ { type:'heal', chance:0.20, healMin:14, healMax:20, flavor:"seals itself back up along an old, familiar seam" } ],
   art: artVaultKeeper, loot:null
};

monsters.push(...warrensEarMonsters);
BOUNTY_TEMPLATES.push(...warrensEarMonsters.map(makeBountyTemplate));

/* Bestiary registry (NAMED_BOSSES, content.js) — this hub's own 4
quest-rare bosses defined above. */
NAMED_BOSSES.push(tunnelMoleInformant, seniorClerk, committeeAuditor, vaultKeeper);

/* This hub's own 2 zone-rares (ZONE_RARE_MONSTERS, content.js) — same
derivation as every other zone-rare: ~20% above the zone's own regular
trash ceiling, xp capped below whatever quest-rare/gauntlet boss
already guards that zone. Ledger Vault already has committeeAuditor
(45 xp)/vaultKeeper (68 xp) from the gauntlet above, so
misfiledAuditor's own xp stays comfortably under the lower of the two. */
const unsungChorister = {
   name:"the unsung chorister, humming a note the Choir itself has never learned", beef:10, zip:0, grit:30, hoodoo:0, xp:55, rare:true, zone:"choir",
   art: artUnsungChorister,
   loot:{name:"a note nobody else can hit, bottled", desc:"Hums faintly whenever the room goes quiet.", type:"junk", sell:40, icon:iconWhistle}
};
const misfiledAuditor = {
   name:"a misfiled auditor, cross-referenced into something that shouldn't check out", beef:10, zip:0, grit:30, hoodoo:0, xp:38, rare:true, zone:"ledgervault",
   art: artMisfiledAuditor,
   loot:{name:"a ledger entry filed under nothing at all", desc:"Technically doesn't exist. You're holding it anyway.", type:"junk", sell:38, icon:iconDrillRoster}
};
Object.assign(ZONE_RARE_MONSTERS, { choir: unsungChorister, ledgervault: misfiledAuditor });
NAMED_BOSSES.push(unsungChorister, misfiledAuditor);

/* Same reasoning as mudroot-content.js's own extension of these two
objects — Choir/the Ledger Vault get their own flavor instead of
falling back to the Commons pool. */
Object.assign(noncombatEvents, {
   choir: [
      "A note hangs in the air long after whatever made it should have stopped.",
      "You hear your own footsteps a half-second after you take them.",
      "Something hums a scale you don't recognize, three notes short of finishing it.",
      "The dark ahead seems to be listening back, politely, and waiting for you to go first.",
      "A word you didn't say echoes back to you anyway, slightly wrong.",
      "Somewhere close, something is counting. You don't ask what."
      ],
   ledgervault: [
      "A stack of forms shifts on its own and resettles, taller than before.",
      "You find a ledger entry dated for tomorrow, already filled out correctly.",
      "Something files a complaint about the noise you're making. You didn't make any noise.",
      "A stamp comes down somewhere deeper in, followed by a long, satisfied silence.",
      "You find your own name in a ledger you've never seen before, several entries back.",
      "A door marked PENDING REVIEW has clearly been pending for a very long time."
      ]
});
Object.assign(hazardEvents, {
   choir: [
      { text:"A sound arrives before whatever made it does, and you flinch a beat too early into a wall.", dmg:[5,8] },
      { text:"Something unseen clips you from a direction the echo swore was empty.", dmg:[4,8] },
      { text:"A note lands wrong and rattles straight through you.", dmg:[5,9] },
      ],
   ledgervault: [
      { text:"An entire shelf of ledgers lets go at once, and you're standing under it.", dmg:[5,9] },
      { text:"A stamp comes down on your hand before you can move it.", dmg:[4,8] },
      { text:"You trip over a stack of forms filed specifically where you'd trip over them.", dmg:[4,8] },
      ]
});
