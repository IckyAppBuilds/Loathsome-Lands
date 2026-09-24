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
   { name:"a mole cantor, humming the wrong note on purpose", hp:62, atkMin:9, atkMax:14, xp:38, zone:"choir",
    art: artMoleCantor, loot:{name:"cantor's cracked pitch-stone", desc:"Hums back at you, slightly out of tune.", type:"junk", sell:15, icon:iconWhistle},
    rareDrop:{name:"the cantor's own perfect note, bottled", desc:"You've never heard silence sound so loud.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"cantor's resonant collar-plate of the Tortoise", desc:"Hums faintly whenever something's listening back.", type:"equip", slot:"chest", bonus:{grit:8}, tier:'common', icon:iconVest} },
   { name:"an echo-mole, never quite where the sound says it is", hp:58, atkMin:8, atkMax:14, xp:36, zone:"choir",
    art: artEchoMole, loot:{name:"warped echo-shell fragment", desc:"Whispers back whatever you last said, badly.", type:"junk", sell:14, icon:iconShellFragment},
    rareDrop:{name:"an echo that arrived before the sound did", desc:"You're choosing not to think about that too hard.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"echo-mole's mis-timed warpaint wand of the Loon", desc:"Casts the spell a half-second before you finish it.", type:"equip", slot:"weapon", bonus:{hoodoo:8}, tier:'common', icon:iconWandStick} },
   { name:"a listening-post sentry, all ears and no eyes", hp:66, atkMin:9, atkMax:15, xp:40, zone:"choir",
    art: artListeningSentry, loot:{name:"sentry's oversized cupped ear", desc:"Still twitching toward the last thing that moved.", type:"junk", sell:16, icon:iconSentinelEye},
    rareDrop:{name:"the sentry's own uncanny early warning", desc:"You start hearing trouble a beat before it arrives.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"sentry's cupped-ear pauldron of the Tortoise", desc:"Hears everything. Blocks most of it, too.", type:"equip", slot:"head", bonus:{grit:8}, tier:'common', icon:iconGuardHelm} },
   { name:"an archivist-mole, buried under three ledgers at once", hp:64, atkMin:9, atkMax:14, xp:39, zone:"ledgervault",
    art: artArchivistMole, loot:{name:"triple-cross-referenced ledger scrap", desc:"References two other ledgers you'll never find.", type:"junk", sell:15, icon:iconVizierLedger},
    rareDrop:{name:"a ledger entry that approves itself, recursively", desc:"It's been auditing itself for years. It's winning.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"archivist's ledger-strapped greaves of the Weasel", desc:"Every step filed in triplicate.", type:"equip", slot:"legs", bonus:{zip:8}, tier:'common', icon:iconQuickstepTrousers} },
   { name:"a vault clerk, stamping things that don't need stamping", hp:60, atkMin:8, atkMax:14, xp:37, zone:"ledgervault",
    art: artVaultClerk, loot:{name:"over-stamped requisition form", desc:"Approved, denied, and approved again.", type:"junk", sell:14, icon:iconCoinPurse},
    rareDrop:{name:"the clerk's own personal rubber stamp of destiny", desc:"Whatever it stamps next, apparently, happens.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"clerk's ink-stained boots of the Weasel", desc:"Tracks ink into every room you enter after this.", type:"equip", slot:"boots", bonus:{zip:8}, tier:'common', icon:iconGripBoots} },
   { name:"an auditor-in-chief, radiating quiet disapproval", hp:68, atkMin:9, atkMax:15, xp:41, zone:"ledgervault",
    art: artAuditorInChief, loot:{name:"auditor-in-chief's own red pen", desc:"Never runs out of ink. Never runs out of complaints.", type:"junk", sell:16, icon:iconDrillRoster},
    rareDrop:{name:"a complaint filed against the concept of complaints", desc:"It's somehow already been escalated.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"auditor-in-chief's own weapon-grade clipboard of the Badger", desc:"Objectively the most feared object in the building.", type:"equip", slot:"weapon", bonus:{beef:8}, tier:'common', icon:iconRakeShank} },
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
   name:"a nervous tunnel-mole informant", hp:70, atkMin:8, atkMax:13, xp:48, rare:true, zone:"rootcellar",
   dodgeChance:0.2,
   art: artTunnelMoleInformant, loot:null
};
const seniorClerk = {
   name:"a senior clerk, guarding a very particular ledger", hp:72, atkMin:8, atkMax:13, xp:48, rare:true, zone:"bureau",
   skills:[ { type:'heal', chance:0.20, healMin:12, healMax:18, flavor:"cites a procedural delay and buys itself time" } ],
   art: artSeniorClerk, loot:null
};

monsters.push(...warrensEarMonsters);
BOUNTY_TEMPLATES.push(...warrensEarMonsters.map(makeBountyTemplate));

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
