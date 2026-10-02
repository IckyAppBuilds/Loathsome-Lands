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
   { name:"a mole cantor, humming the wrong note on purpose", ...MONSTER_STATS["a mole cantor, humming the wrong note on purpose"], zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:87, boltMax:112, flavor:"hits the one note that actually hurts" } ],
    art: artMoleCantor, loot:{name:"cantor's cracked pitch-stone", desc:"Hums back at you, slightly out of tune.", type:"junk", sell:15, icon:iconWhistle},
    rareDrop:{name:"the cantor's own perfect note, bottled", desc:"You've never heard silence sound so loud.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"cantor's resonant collar-plate of the Badger", desc:"Hums faintly whenever something's listening back.", type:"equip", slot:"chest", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconVest} },
   { name:"an echo-mole, never quite where the sound says it is", ...MONSTER_STATS["an echo-mole, never quite where the sound says it is"], zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"an echo of itself arrives a beat late, already patched up" } ],
    art: artEchoMole, loot:{name:"warped echo-shell fragment", desc:"Whispers back whatever you last said, badly.", type:"junk", sell:14, icon:iconShellFragment},
    rareDrop:{name:"an echo that arrived before the sound did", desc:"You're choosing not to think about that too hard.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"echo-mole's mis-timed warpaint wand of the Weasel", desc:"Casts the spell a half-second before you finish it.", type:"equip", slot:"weapon", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconWandStick} },
   { name:"a listening-post sentry, all ears and no eyes", ...MONSTER_STATS["a listening-post sentry, all ears and no eyes"], zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"cups both ears and leans in, newly alert" } ],
    art: artListeningSentry, loot:{name:"sentry's oversized cupped ear", desc:"Still twitching toward the last thing that moved.", type:"junk", sell:16, icon:iconSentinelEye},
    rareDrop:{name:"the sentry's own uncanny early warning", desc:"You start hearing trouble a beat before it arrives.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"sentry's cupped-ear pauldron of the Loon", desc:"Hears everything. Blocks most of it, too.", type:"equip", slot:"head", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconGuardHelm} },
   { name:"an archivist-mole, buried under three ledgers at once", ...MONSTER_STATS["an archivist-mole, buried under three ledgers at once"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:87, boltMax:112, flavor:"hurls an entire ledger, spine-first" } ],
    art: artArchivistMole, loot:{name:"triple-cross-referenced ledger scrap", desc:"References two other ledgers you'll never find.", type:"junk", sell:15, icon:iconVizierLedger},
    rareDrop:{name:"a ledger entry that approves itself, recursively", desc:"It's been auditing itself for years. It's winning.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"archivist's ledger-strapped greaves of the Badger", desc:"Every step filed in triplicate.", type:"equip", slot:"legs", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a vault clerk, stamping things that don't need stamping", ...MONSTER_STATS["a vault clerk, stamping things that don't need stamping"], zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"over-stamps its own wound until it's technically fine" } ],
    art: artVaultClerk, loot:{name:"over-stamped requisition form", desc:"Approved, denied, and approved again.", type:"junk", sell:14, icon:iconCoinPurse},
    rareDrop:{name:"the clerk's own personal rubber stamp of destiny", desc:"Whatever it stamps next, apparently, happens.", type:"luck", hpValue:26, mpValue:13, icon:iconClover},
    gearDrop:{name:"clerk's ink-stained boots of the Weasel", desc:"Tracks ink into every room you enter after this.", type:"equip", slot:"boots", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconGripBoots} },
   { name:"an auditor-in-chief, radiating quiet disapproval", ...MONSTER_STATS["an auditor-in-chief, radiating quiet disapproval"], zone:"ledgervault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"radiates fresh disapproval, somehow emboldened by it" } ],
    art: artAuditorInChief, loot:{name:"auditor-in-chief's own red pen", desc:"Never runs out of ink. Never runs out of complaints.", type:"junk", sell:16, icon:iconDrillRoster},
    rareDrop:{name:"a complaint filed against the concept of complaints", desc:"It's somehow already been escalated.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"auditor-in-chief's own weapon-grade clipboard of the Loon", desc:"Objectively the most feared object in the building.", type:"equip", slot:"weapon", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconRakeShank} },
   /* Per a later explicit request, every zone's gearDrop set needs to
   cover all 5 slots for all 3 classes — 12 more regulars per district
   (Choir/Ledger Vault), same mole-silhouette vocabulary every Warren's
   Ear monster already uses, same class-gated treatment every zone past
   Gnometropolis already got (content.js/mudroot-content.js). */
   { name:"a mole chorister, singing lead whether asked or not", ...MONSTER_STATS["a mole chorister, singing lead whether asked or not"], zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"hits a lead note nobody asked for and commits fully" } ],
    art: artMoleChorister, loot:{name:"a dog-eared hymn sheet", desc:"Marked up with notes only the chorister can read.", type:"junk", sell:16, icon:iconWhistle},
    rareDrop:{name:"a hymn sheet that's actually, perfectly sung", desc:"Every note landed. First time ever, probably.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"chorister's own lead-note helm of the Badger", desc:"Still humming faintly from the last performance.", type:"equip", slot:"head", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a mole bell-ringer, hauling a bell twice its size", ...MONSTER_STATS["a mole bell-ringer, hauling a bell twice its size"], zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"rings the bell once and feels steadier for the toll" } ],
    art: artMoleBellRinger, loot:{name:"a dented bell-clapper", desc:"Knocked loose from ringing far too hard.", type:"junk", sell:14, icon:iconWhistle},
    rareDrop:{name:"a clapper that rings true every single time", desc:"No dent, no wobble. Perfect tone.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"bell-ringer's braced greaves of the Badger", desc:"Built to brace against the recoil of a very large bell.", type:"equip", slot:"legs", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconBurrowGreaves} },
   { name:"a mole step-caller, keeping the whole choir in time", ...MONSTER_STATS["a mole step-caller, keeping the whole choir in time"], zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"calls the beat and lands the hit exactly on it" } ],
    art: artMoleStepCaller, loot:{name:"a worn step-calling baton", desc:"Tapped out so many beats it's nearly smooth.", type:"junk", sell:16, icon:iconDrillRoster},
    rareDrop:{name:"a baton that keeps perfect, unbroken time", desc:"Hasn't missed a beat once, the whole performance.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"step-caller's own on-beat boots of the Badger", desc:"Land exactly on every downbeat, every time.", type:"equip", slot:"boots", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a mole conductor, swinging a baton like it means business", ...MONSTER_STATS["a mole conductor, swinging a baton like it means business"], zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:89, boltMax:114, flavor:"the baton comes down on the downbeat, and on you" } ],
    art: artMoleConductor, loot:{name:"a snapped conductor's baton", desc:"Snapped mid-performance. The show went on anyway.", type:"junk", sell:17, icon:iconDiceFlail},
    rareDrop:{name:"a baton that's never once snapped", desc:"Held through the whole performance. Impressive, honestly.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"conductor's own commanding baton of the Badger", desc:"Still conducts something, even sheathed.", type:"equip", slot:"weapon", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconCatapultPeg} },
   { name:"a mole descant-singer, hitting notes nobody asked for", ...MONSTER_STATS["a mole descant-singer, hitting notes nobody asked for"], zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"hits a descant note so high it rattles something loose" } ],
    art: artMoleDescantSinger, loot:{name:"a strained descant note, bottled", desc:"Still ringing faintly, uncomfortably high.", type:"junk", sell:14, icon:iconWhistle},
    rareDrop:{name:"a descant note that's genuinely, impressively clean", desc:"Hit it clean on the first try. Rare, for this singer.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"descant-singer's own high-note cap of the Weasel", desc:"Still ringing, very faintly, at an uncomfortable pitch.", type:"equip", slot:"head", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a mole harmony-weaver, blending in just enough to vanish", ...MONSTER_STATS["a mole harmony-weaver, blending in just enough to vanish"], zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"blends the wound into the harmony and it closes, unnoticed" } ],
    art: artMoleHarmonyWeaver, loot:{name:"a woven harmony-thread", desc:"Blends into whatever's around it. Including, apparently, itself.", type:"junk", sell:14, icon:iconFeatherScale},
    rareDrop:{name:"a harmony-thread that's genuinely seamless", desc:"Can't tell where it starts or ends. Impressive weaving.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"harmony-weaver's own blended vest of the Weasel", desc:"Blends into whatever you're already wearing.", type:"equip", slot:"chest", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a mole quick-step dancer, part of the act somehow", ...MONSTER_STATS["a mole quick-step dancer, part of the act somehow"], zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"the quick-step turns out to have a kick built into it" } ],
    art: artMoleQuickStepDancer, loot:{name:"a scuffed dance-step card", desc:"Choreography nobody remembers learning.", type:"junk", sell:16, icon:iconDiceFlail},
    rareDrop:{name:"a step-card for a routine that actually works", desc:"Every step lands exactly where it should.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"quick-step dancer's own routine leggings of the Weasel", desc:"Scuffed clean through from the same routine, nightly.", type:"equip", slot:"legs", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconTrousers} },
   { name:"a mole tap-dancer, keeping rhythm nobody else can hear", ...MONSTER_STATS["a mole tap-dancer, keeping rhythm nobody else can hear"], zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"finds a rhythm only it can hear and locks into it" } ],
    art: artMoleTapDancer, loot:{name:"a worn tap-shoe sole", desc:"Clicks out a rhythm nobody else can quite follow.", type:"junk", sell:14, icon:iconSpringBoots},
    rareDrop:{name:"a tap-shoe keeping genuinely perfect rhythm", desc:"You can almost hear the beat now too.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"tap-dancer's own rhythmic boots of the Weasel", desc:"Click faintly in time with your own heartbeat.", type:"equip", slot:"boots", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconMismatchedBoots} },
   { name:"a mole resonance-warden, vibrating in sympathy with the hall", ...MONSTER_STATS["a mole resonance-warden, vibrating in sympathy with the hall"], zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"vibrates in sympathy with the hall itself and knits back together" } ],
    art: artMoleResonanceWarden, loot:{name:"a faintly vibrating wall-stone", desc:"Still humming along with whatever's singing nearby.", type:"junk", sell:14, icon:iconCapturedLight},
    rareDrop:{name:"a wall-stone resonating with something real", desc:"You can feel it through your boots, even standing still.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"resonance-warden's own humming vestment of the Loon", desc:"Vibrates faintly, in sympathy with whatever's nearby.", type:"equip", slot:"chest", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a mole pitch-tuner, adjusting something only it can hear", ...MONSTER_STATS["a mole pitch-tuner, adjusting something only it can hear"], zone:"choir",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"tunes something only it can hear, and it finally clicks into place" } ],
    art: artMolePitchTuner, loot:{name:"a bent tuning fork", desc:"Rings a pitch nothing else quite matches.", type:"junk", sell:14, icon:iconMendCharm},
    rareDrop:{name:"a tuning fork that's genuinely, perfectly pitched", desc:"Everything around it seems to settle into tune.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"pitch-tuner's own fine-tuned leggings of the Loon", desc:"Hum a very faint, very specific note.", type:"equip", slot:"legs", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a mole silent-chorister, mouthing words with no sound", ...MONSTER_STATS["a mole silent-chorister, mouthing words with no sound"], zone:"choir",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"mouths a silent hymn and the wound closes without a sound" } ],
    art: artMoleSilentChorister, loot:{name:"a voiceless hymn sheet", desc:"No words on it at all. Somehow still a hymn.", type:"junk", sell:14, icon:iconWhistle},
    rareDrop:{name:"a hymn sheet that sings itself, silently", desc:"You can feel the song more than hear it.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"silent-chorister's own voiceless boots of the Loon", desc:"Move in perfect silence, same as the singer who wore them.", type:"equip", slot:"boots", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
   { name:"a mole hymn-caster, channeling a note into something sharper", ...MONSTER_STATS["a mole hymn-caster, channeling a note into something sharper"], zone:"choir",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"channels a held note until it's sharp enough to actually land" } ],
    art: artMoleHymnCaster, loot:{name:"a note sharpened into something else", desc:"Stopped being music a while ago. Still works.", type:"junk", sell:16, icon:iconArcaneFocus},
    rareDrop:{name:"a note sharpened to a genuinely dangerous point", desc:"You wouldn't want this one aimed at you twice.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"hymn-caster's own note-sharpened rod of the Loon", desc:"Still rings faintly, sharper than a hymn has any right to be.", type:"equip", slot:"weapon", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconWandStick} },
   /* 12 more Ledger Vault regulars. */
   { name:"a mole vault-guard, standing watch over numbers nobody reads", ...MONSTER_STATS["a mole vault-guard, standing watch over numbers nobody reads"], zone:"ledgervault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"stands a little straighter over a ledger nobody's opened in years" } ],
    art: artMoleVaultGuard, loot:{name:"a dusty vault watch-log", desc:"Every entry: \"nothing to report.\" Until now.", type:"junk", sell:16, icon:iconVizierLedger},
    rareDrop:{name:"a watch-log with something finally worth reporting", desc:"First real entry in this log in a very long time.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"vault-guard's own standing-watch helm of the Badger", desc:"Worn smooth from standing in exactly one spot, for years.", type:"equip", slot:"head", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconGuardHelm} },
   { name:"a mole strongbox-bearer, hauling a ledger-chest built like armor", ...MONSTER_STATS["a mole strongbox-bearer, hauling a ledger-chest built like armor"], zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"sets the strongbox down and straightens its back, good as new" } ],
    art: artMoleStrongboxBearer, loot:{name:"a dented strongbox corner", desc:"Reinforced like it's carrying something important. It is.", type:"junk", sell:14, icon:iconBiscuitTin},
    rareDrop:{name:"a strongbox corner that's somehow unscathed", desc:"Hasn't taken a dent in years. Well cared for.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"strongbox-bearer's own reinforced vest of the Badger", desc:"Built like the box it's named after. Nearly as heavy.", type:"equip", slot:"chest", bonus:{beef:7}, classRequired:'Meathead', tier:'common', icon:iconPalaceForgedPlate} },
   { name:"a mole vault-runner, racing a closing time nobody set", ...MONSTER_STATS["a mole vault-runner, racing a closing time nobody set"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"beats the closing time that was never actually set and swings anyway" } ],
    art: artMoleVaultRunner, loot:{name:"a vault closing-time notice", desc:"Posted. Never actually enforced. Never explained why.", type:"junk", sell:16, icon:iconVizierLedger},
    rareDrop:{name:"a closing-time notice that's actually, finally enforced", desc:"First time this vault's ever actually closed on schedule.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"vault-runner's own closing-time boots of the Badger", desc:"Scuffed from racing a deadline that technically doesn't exist.", type:"equip", slot:"boots", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconGripBoots} },
   { name:"a mole seal-breaker, swinging a wax-stamped mallet", ...MONSTER_STATS["a mole seal-breaker, swinging a wax-stamped mallet"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:89, boltMax:114, flavor:"the wax-stamped mallet comes down with the full weight of bureaucracy" } ],
    art: artMoleSealBreaker, loot:{name:"a cracked wax seal fragment", desc:"Broken open. Whatever it sealed is yours now.", type:"junk", sell:17, icon:iconCoinPurse},
    rareDrop:{name:"a seal that's somehow, completely unbroken", desc:"Whatever's inside this one is staying sealed, for now.", type:"junk", sell:47, icon:iconFigurine},
    gearDrop:{name:"seal-breaker's own wax-stamped mallet of the Badger", desc:"Still has flecks of broken seal-wax stuck to it.", type:"equip", slot:"weapon", bonus:{beef:8}, classRequired:'Meathead', tier:'common', icon:iconCatapultPeg} },
   { name:"a mole cipher-clerk, reading numbers nobody else can parse", ...MONSTER_STATS["a mole cipher-clerk, reading numbers nobody else can parse"], zone:"ledgervault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"parses something in the numbers nobody else can read and acts on it" } ],
    art: artMoleCipherClerk, loot:{name:"a cipher-coded ledger page", desc:"Makes no sense to you. Perfect sense to the clerk.", type:"junk", sell:14, icon:iconVizierLedger},
    rareDrop:{name:"a cipher page that's actually, finally decoded", desc:"Someone finally cracked it. Worth something, probably.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"cipher-clerk's own coded cap of the Weasel", desc:"Covered in numbers that only make sense to one reader.", type:"equip", slot:"head", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconCap} },
   { name:"a mole safecracker, listening for a click that isn't coming", ...MONSTER_STATS["a mole safecracker, listening for a click that isn't coming"], zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"hears a click that isn't there and somehow it still works" } ],
    art: artMoleSafecracker, loot:{name:"a worn safecracking tool", desc:"Used on locks that technically don't need cracking.", type:"junk", sell:14, icon:iconPipeFitting},
    rareDrop:{name:"a safecracking tool that's actually, properly earned its keep", desc:"Cracked something real this time.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"safecracker's own listening vest of the Weasel", desc:"Padded with tools for locks nobody's supposed to open.", type:"equip", slot:"chest", bonus:{zip:7}, classRequired:'Card Shark', tier:'common', icon:iconVest} },
   { name:"a mole ledger-runner, filing things faster than they're written", ...MONSTER_STATS["a mole ledger-runner, filing things faster than they're written"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"files the paperwork before you've even finished reading it, and swings" } ],
    art: artMoleLedgerRunner, loot:{name:"a pre-filed ledger entry", desc:"Filed before it was even written. Efficient, unsettling.", type:"junk", sell:16, icon:iconVizierLedger},
    rareDrop:{name:"a ledger entry filed exactly when it should've been", desc:"For once, the timing actually makes sense.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"ledger-runner's own quick-file leggings of the Weasel", desc:"Scuffed from sprinting the same filing route, daily.", type:"equip", slot:"legs", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconQuickstepTrousers} },
   { name:"a mole stamp-duelist, wielding two stamps at once", ...MONSTER_STATS["a mole stamp-duelist, wielding two stamps at once"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"stamps twice, fast, before you can even raise a hand" } ],
    art: artMoleStampDuelist, loot:{name:"a double-inked stamp pad", desc:"Worn down from use in both hands at once.", type:"junk", sell:16, icon:iconDiceFlail},
    rareDrop:{name:"a stamp pad that lands two perfect stamps every time", desc:"Both hands, both perfectly placed. Impressive.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"stamp-duelist's own twin stamp-blades of the Weasel", desc:"One in each hand. Both still faintly inked.", type:"equip", slot:"weapon", bonus:{zip:8}, classRequired:'Card Shark', tier:'common', icon:iconCardShank} },
   { name:"a mole number-seer, reading a ledger that hasn't been written yet", ...MONSTER_STATS["a mole number-seer, reading a ledger that hasn't been written yet"], zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"reads its own recovery off a page that hasn't been written yet" } ],
    art: artMoleNumberSeer, loot:{name:"a page from a ledger not yet written", desc:"Blank, except for one number that keeps changing.", type:"junk", sell:14, icon:iconVizierLedger},
    rareDrop:{name:"a page that's finally, fully written out", desc:"Whatever it predicted, it's already happened.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"number-seer's own foresighted circlet of the Loon", desc:"Shows numbers that haven't been counted yet.", type:"equip", slot:"head", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconChampionCrown} },
   { name:"a mole vault-warden, humming with old locked magic", ...MONSTER_STATS["a mole vault-warden, humming with old locked magic"], zone:"ledgervault",
    skills:[ { type:'buff', chance:TRASH_SKILL_CHANCE, buffMult:1.3, buffTurns:2, flavor:"the old locked magic in the walls answers back, just this once" } ],
    art: artMoleVaultWarden, loot:{name:"a humming lock-ward fragment", desc:"Old. Locked. Still working, somehow.", type:"junk", sell:14, icon:iconCapturedLight},
    rareDrop:{name:"a lock-ward fragment that's fully, properly intact", desc:"Whole and humming. Whatever it guards, it's guarding well.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"vault-warden's own locked vestment of the Loon", desc:"Humming faintly with magic nobody's bothered to unlock.", type:"equip", slot:"chest", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconScorchRobe} },
   { name:"a mole account-tracer, following a debt through the walls", ...MONSTER_STATS["a mole account-tracer, following a debt through the walls"], zone:"ledgervault",
    skills:[ { type:'bolt', chance:TRASH_SKILL_CHANCE, boltMin:88, boltMax:113, flavor:"traces the debt straight to you and collects, forcefully" } ],
    art: artMoleAccountTracer, loot:{name:"a traced debt-ledger fragment", desc:"Followed through three walls and one very confused mole.", type:"junk", sell:16, icon:iconVizierLedger},
    rareDrop:{name:"a debt-ledger that's finally, fully traced and settled", desc:"Whatever was owed, it's accounted for now.", type:"junk", sell:46, icon:iconFigurine},
    gearDrop:{name:"account-tracer's own debt-marked leggings of the Loon", desc:"Covered in tally-marks tracing a debt through the walls.", type:"equip", slot:"legs", bonus:{hoodoo:8}, classRequired:'Hexpert', tier:'common', icon:iconFeatherScale} },
   { name:"a mole silent-auditor, never once making a sound", ...MONSTER_STATS["a mole silent-auditor, never once making a sound"], zone:"ledgervault",
    skills:[ { type:'heal', chance:TRASH_SKILL_CHANCE, healPercentMin:0.08, healPercentMax:0.12, flavor:"audits its own injury in complete silence, and it's gone" } ],
    art: artMoleSilentAuditor, loot:{name:"a silent audit report", desc:"No sound, no notes, somehow still thorough.", type:"junk", sell:14, icon:iconVizierLedger},
    rareDrop:{name:"a silent audit that uncovers something real", desc:"Not a sound the whole time. Found it anyway.", type:"junk", sell:44, icon:iconFigurine},
    gearDrop:{name:"silent-auditor's own noiseless boots of the Loon", desc:"Move through the vault without a single sound.", type:"equip", slot:"boots", bonus:{hoodoo:7}, classRequired:'Hexpert', tier:'common', icon:iconWardedSlippers} },
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
   name:"a nervous tunnel-mole informant", ...MONSTER_STATS["a nervous tunnel-mole informant"], rare:true, zone:"rootcellar",
   art: artTunnelMoleInformant, loot:null
};
const seniorClerk = {
   name:"a senior clerk, guarding a very particular ledger", ...MONSTER_STATS["a senior clerk, guarding a very particular ledger"], rare:true, zone:"bureau",
   skills:[ { type:'heal', chance:0.20, healPercentMin:0.05, healPercentMax:0.07, flavor:"cites a procedural delay and buys itself time" } ],
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
   name:"a committee auditor, cross-referencing you against three different ledgers", ...MONSTER_STATS["a committee auditor, cross-referencing you against three different ledgers"], rare:true, zone:"ledgervault",
   skills:[ { type:'buff', chance:0.20, buffMult:1.5, buffTurns:2, flavor:"finds a discrepancy in your favor, then immediately revokes it" } ],
   art: artCommitteeAuditor, loot:null
};
const vaultKeeper = {
   name:"the vault keeper, the only door in the Warren's Ear that was never meant to open", ...MONSTER_STATS["the vault keeper, the only door in the Warren's Ear that was never meant to open"], rare:true, zone:"ledgervault",
   skills:[ { type:'heal', chance:0.20, healPercentMin:0.05, healPercentMax:0.07, flavor:"seals itself back up along an old, familiar seam" } ],
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
   name:"the unsung chorister, humming a note the Choir itself has never learned", ...MONSTER_STATS["the unsung chorister, humming a note the Choir itself has never learned"], rare:true, zone:"choir",
   art: artUnsungChorister,
   loot:{name:"a note nobody else can hit, bottled", desc:"Hums faintly whenever the room goes quiet.", type:"junk", sell:40, icon:iconWhistle}
};
const misfiledAuditor = {
   name:"a misfiled auditor, cross-referenced into something that shouldn't check out", ...MONSTER_STATS["a misfiled auditor, cross-referenced into something that shouldn't check out"], rare:true, zone:"ledgervault",
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
