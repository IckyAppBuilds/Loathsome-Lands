/* ---------------- Supabase (accounts + save/load) ---------------- */
/* The Supabase JS library loads from a CDN <script> tag above this one.
   If that fails (offline, ad blocker, a network policy blocking the CDN),
   `supabase` is undefined — guard against that so the rest of the game
   still boots and plays fine; only the Account drawer degrades. */
const sb = (typeof supabase !== 'undefined')
  ? supabase.createClient(
           'https://ttgiwkunzkmzmsswjuzu.supabase.co',
           'sb_publishable_bsqoNRyjYSoGPaAbGlpLQA_N3RGmabX'
         )
     : null;
if(!sb) console.warn('Supabase JS failed to load — accounts/save/load are disabled for this session.');

/* Current signed-in state, kept in sync by onAuthStateChange below. Not part
   of `state` — it's session/account plumbing, not save data. */
let acctSession = null;
let acctUsername = null;

/* How many Biscuits the most recent loadGame() call credited for time spent
   away (computed by fast-forwarding regenBiscuits() right at load, rather
   than waiting for the next 1s display tick). Read by enterGameAfterAuth()
   and manualLoadGame() to tell the player what they earned while offline. */
let lastOfflineBiscuitGain = 0;

/* The login/register/forgot-password forms are shared markup rendered into
   two different spots: the full-screen gate shown before the game starts
   ('gate'), and the always-available Account drawer during play ('acct').
   Each keeps its own "which form is showing" / "is a request in flight"
   state so switching one doesn't affect the other. */
let authView = { gate: 'login', acct: 'login' }; /* 'login' | 'register' | 'forgot' */
let authBusy = { gate: false, acct: false };

/* Whether the pre-game gate is still up. Skipped entirely (see boot logic
   at the bottom of this script) when Supabase never loaded — there's
   nothing useful to gate on in that case. */
let gateOpen = true;

/* ---------------- State ---------------- */
const QUEST_TINES_NEEDED = 3;

/* Dev mode: unlimited Biscuits, for testing without the energy economy
   getting in the way. Auto-enables via ?dev=1 in the URL, or by signing
   in as the designated dev account (see isDevAccount() in account.js).
   Not player-facing — purely a development convenience. There used to
   also be a click-to-toggle on the header Biscuits box, but that put an
   unlimited-Biscuits cheat one click away for any player; removed in
   favor of the dev account's own tools (Account drawer → Biscuits, see
   account.js) for anyone who actually needs to grant themselves
   Biscuits while testing. */
let devMode = new URLSearchParams(location.search).has('dev');

/* A factory (not a bare literal) so a dev tool can call it again later to
   produce a brand-new default state for resetToNewGameDev() (account.js)
   — Object.assign(state, createDefaultState()) fully wipes an existing
   save's fields back to these defaults, including fresh nested objects
   (stats/equipment/etc.), without needing to reassign the `const state`
   binding itself. */
function createDefaultState(){
   return {
     hp: 30, maxHp: 30,
     shield: 0, /* Temporary damage-absorption pool, depleted before hp on any
       hit (see applyDamageToPlayer() in combat.js) — granted by the Hoodoo
       Doctor's Warding Charm spell (Hoodoo-scaled) or the Meathead's Shout
       (Beef-scaled, combat.js). Not tied to combat — persists until spent. */
     mp: 10, maxMp: 10,
     baseMaxHp: 30, /* level-derived HP ceiling, before Grit bonuses */
     baseMaxMp: 10, /* level-derived MP ceiling, before Hoodoo bonuses */
     adventures: 100, /* "Biscuits" */
     popTabs: 0,
  bountyTokens: 0, /* earned only from the Bounty Board (see BOUNTY_TEMPLATES/claimBounty) — a separate currency from Pop Tabs, meant for a future gear exchange. Not spendable anywhere yet. */
     /* Act 3 (the Prism Depths, dungeon.js) — prismShards is a third
     currency, earned only from a dungeon's own guaranteed treasure
     payout on a full clear (grantDungeonTreasure(), dungeon.js), spent
     at the Depths' own shop (a future pass — see the Act 3 plan).
     dungeonClears is a per-dungeon LIFETIME counter (key = a DUNGEONS
     entry's id, content.js-equivalent), same shape
     gnomeBuildingUpgrades uses — missing keys read as 0 via `|| 0` at
     every call site, same convention. Deliberately NOT a doneFlag —
     every dungeon stays repeatable forever once unlocked, same
     "nothing ever locks" philosophy the Bounty Board/zone-rares
     already settled on. */
     prismShards: 0,
     dungeonClears: {},
     lotTier: 0, /* the town-square Town Lot (translate(200,100) in artTownSquare()) — 0 = unpurchased "Empty Lot". See LOT_TIER_NAMES/LOT_TIER_COST (content.js) and buyTownLot()/upgradeTownLot() (game.js). Buying tier 1 is what unlocks buildingUpgrades below. */
     buildingUpgrades: {}, /* key = a BUILDING_UPGRADES entry's key (content.js) -> upgrade level, 0..BUILDING_UPGRADE_MAX. Missing keys read as level 0 — see upgradeBuilding()/buildingUpgradeLevel() in game.js. Levels are tracked only for now; they don't change anything about the buildings yet (see content.js comment above BUILDING_UPGRADES). */
     /* Act 2's own Town Lot, at the Gnometropolis square — same shape as
     lotTier/buildingUpgrades above, deliberately kept as a fully
     separate pair rather than generalizing both into one hub-keyed
     system yet (see GNOME_LOT_TIER_NAMES's own comment, content.js). */
     gnomeLotTier: 0,
     gnomeBuildingUpgrades: {},
     lastRegenAt: Date.now(),
     /* MP's own passive regen timestamp (regenMp(), economy.js) — same
     elapsed-real-time-to-a-cap shape as lastRegenAt above (Biscuits) and
     lastCasinoRegenAt below, kept separate since it ticks against a
     different cap (state.maxMp, which itself grows with level) at a
     different, Hoodoo-scaled rate (mpRegenMs(), economy.js). */
     lastMpRegenAt: Date.now(),
     level: 1, xp: 0, xpToLevel: 40,
     stats: { beef: 0, zip: 0, grit: 0, hoodoo: 0 },
     statPoints: 0,
     equipment: { head: null, chest: null, legs: null, boots: null, weapon: null },
     spellsKnown: [],
     inventory: [],
     inCombat: false,
     monster: null,
     showVictory: false,
     victoryMonster: null,
     location: 'town',
     homeTown: 'town', /* last town square visited — see TOWN_HUBS in game.js. What a returning player logs back into, regardless of state.location. */
     questTinesGiven: 0,
     questAccepted: false,
     questComplete: false,
     quest2Accepted: false,
     commanderDefeated: false,
     quest2Complete: false,
     quest3Accepted: false,
     quest3Complete: false,
     quest4Accepted: false,
     quest4RareDefeated: false,
     quest4Complete: false,
     quest5Accepted: false,
     quest5Complete: false,
     quest6Accepted: false,
     quest6RareDefeated: false,
     quest6Complete: false,
     quest7Accepted: false,
     /* One per Gnometropolis district guardian (garrisonGuardian/
     roguesDenEnforcer/arcaneSanctumGuardian, content.js) -- each a rare
     encounter while exploring that district (goAdventuring(), combat.js),
     gates approaching the Palace gate. Bespoke names rather than a
     questNRareDefeated-style slot since there's no spare quest number for
     3 separate sub-bosses under quest7 -- same reasoning commanderDefeated
     above uses. */
     garrisonGuardianDefeated: false,
     roguesDenEnforcerDefeated: false,
     arcaneSanctumGuardianDefeated: false,
     quest7RareDefeated: false, /* the REAL gnomeKing (content.js) beaten via approachPalaceGate() -- separate from quest6RareDefeated, which is the decoy gnomeKingsCaptain in the Vault */
     quest7Complete: false,
     /* Act 2 opener, "New Digs" -- accepted/reported at the new Guild
     building in Gnometropolis (enterGnomeGuild(), guild.js), only
     reachable once quest7Complete. A formality quest (no combat
     objective yet), not a typo -- see acceptQuest8()'s own comment. */
     quest8Accepted: false,
     quest8Complete: false,
     /* Act 2's first multi-stage quest, "What the Throne Room Opened" —
     offered at the new Guild once quest8Complete. Stage 1 is
     tunnelWardenDefeated (fought in the Root Cellar), stage 2 is
     warrenScoutDefeated (fought in the Mudflats, only reachable once
     stage 1 clears) — see quest9State (render.js) for how these combine
     into one progression, and tunnelWardenHunt/warrenScoutHunt
     (combat.js) for the actual encounters. */
     quest9Accepted: false,
     quest9Complete: false,
     tunnelWardenDefeated: false,
     warrenScoutDefeated: false,
     /* Quest 10, "Whatever's Listening" — offered once quest9Complete.
     Its two rare hunts (tunnelMoleInformant in the Root Cellar,
     seniorClerk in the Bureau — tunnelMoleInformantHunt/seniorClerkHunt,
     combat.js) run in PARALLEL, not in sequence like quest9's own two
     stages: whichever is defeated first sets quest10Path ('informant'
     or 'ledger', winCombat(), combat.js), unlocking the Warren's Ear
     (a second adventure hub, one step past Mudroot Warren) and
     revealing that district there immediately; the other rare hunt
     stays available afterward so the OTHER district can still be
     revealed later too, purely as an optional bonus — see
     warrensear-content.js's own comment. */
     quest10Accepted: false,
     quest10Complete: false,
     quest10Path: null,
     tunnelMoleInformantDefeated: false,
     seniorClerkDefeated: false,
     /* Quest 11, "Loose Ends" — offered once quest10Complete. No new
     rare hunt of its own: it just requires BOTH tunnelMoleInformant-
     Defeated AND seniorClerkDefeated (guild.js's own comment), forcing
     a return trip to whichever Warren's Ear district quest10Path
     didn't already cover. Completing it unlocks the Ember Warren (a
     third adventure hub, past the Warren's Ear) via Mudroot Warren's
     own root-door tile, same reveal mechanism as every hub before it. */
     quest11Accepted: false,
     quest11Complete: false,
     /* Quest 12, "Chain of Custody" — offered once quest11Complete. A
     sequential two-stage hunt like quest9's own, but stage 2 sends the
     player BACK to the Bureau (an already-explored Mudroot Warren
     district) instead of further out — see gearworksForemanHunt/
     bureauQuartermasterHunt (combat.js) for the actual sequencing. */
     quest12Accepted: false,
     quest12Complete: false,
     gearworksForemanDefeated: false,
     bureauQuartermasterDefeated: false,
     /* Quest 13, "Quenched" — offered once quest12Complete. A single rare
     hunt, no second stage — see quenchMasterHunt (combat.js). */
     quest13Accepted: false,
     quest13Complete: false,
     quenchMasterDefeated: false,
     /* Quest 14, "What the Vault Was Guarding" — offered once quest13Complete.
     A scripted gauntlet (gauntlet.js's own 'ledgerCommittee' entry), not a
     random hunt — vaultKeeperDefeated is the only persisted flag; the
     guard(s) ahead of it are tracked by the transient gauntletProgress
     object (gauntlet.js), same as the Act 1 Palace Gauntlet's own
     palaceGauntletProgress never being saved either. */
     quest14Accepted: false,
     quest14Complete: false,
     vaultKeeperDefeated: false,
     /* Quest 15, "The Warren Answers" — offered once quest14Complete. The
     Mole Wars arc's own finale gauntlet (gauntlet.js's 'moleCouncil'
     entry) — same not-saved-guard-progress reasoning as quest14 above. */
     quest15Accepted: false,
     quest15Complete: false,
     warrenMotherDefeated: false,
     /* Quest 16, "Breaking Through" — the Mole Wars arc's TRUE capstone,
     offered once quest15Complete. drillRigSalvaged is separate from
     tunnelWardenDefeated (which stays true throughout) — it's what
     tells winCombat() (combat.js) this specific tunnelWarden kill was
     the SALVAGE re-fight, not the original one from quest9. Completing
     it reveals the Crystal Breach tile in the Ember Warren's own
     square. */
     quest16Accepted: false,
     quest16Complete: false,
     drillRigSalvaged: false,
     /* Quest 17, "What Light Remembers" — Act 3's own opener, offered at
     the Crystal City itself once quest16Complete. Deliberately a
     formality quest, same shape as quest8's own "New Digs" (no fetch
     objective, accept/report in one visit) — the real content is the
     Prism Depths dungeons themselves (dungeon.js), which this quest now
     gates (DUNGEONS.*.requiredFlag) instead of them hanging directly off
     quest16Complete with no quest ever announcing they exist. */
     quest17Accepted: false,
     quest17Complete: false,
     /* Quest 18, "Old Light, Older Debts," and quest19, "The Last Two
     Rooms" — the wave 2/wave 3 unlocks for the Prism Depths
     (DUNGEONS.*.requiredFlag, dungeon.js), each offered at the Crystal
     City only once the WHOLE prior wave has actually been cleared at
     least once (allDungeonsCleared(), dungeon.js — state.dungeonClears,
     below), not merely once the prior quest is complete. Same
     formality shape as quest17/quest8 otherwise. */
     quest18Accepted: false,
     quest18Complete: false,
     quest19Accepted: false,
     quest19Complete: false,
     classQuestAccepted: false,
     classQuestComplete: false,
     classTitle: null,
     /* "The Adventurer's Trial" capstone, cont'd — three independent trainers
        each administer their own test once classQuestAccepted; all three
        must be true before claimClassPath() (game.js) can be called. Each
        tier is its own themed boss fight (content.js's trialChampion/
        casinoChampion/hoodooChampion), none requiring the player to have
        already put stat points into that class's own stat:
        - classTrialGuildPassed: beat the Trial Champion at the Guild — a
          straightforward, hard-hitting fight (the Meathead test).
        - classTrialCasinoPassed: beat the Casino's card shark — lower HP but
          evasive (dodgeChance) and opens with a guaranteed Loaded Dice
          crit, so the challenge is landing hits, not surviving them
          (the Card Shark test).
        - classTrialHoodooPassed: beat the Hoodoo Doctor's summoned spirit
          (the game's first monster with skills[] — heal/buff/bolt) AND land
          the killing blow specifically with a cast spell (the Hexpert test).
        classSkillLevel is the single shared level counter for whichever
        class-skill the chosen classTitle unlocks (MEATHEAD_DAMAGE_BONUS/
        CARD_SHARK_DOUBLE_ATTACK_CHANCE/HEXPERT_SPELL_DMG_BONUS, content.js)
        — see classSkillCost() there. */
     classTrialGuildPassed: false,
     classTrialCasinoPassed: false,
     classTrialHoodooPassed: false,
     classSkillLevel: 0,
     /* Class-exclusive buff spells (content.js's spells[], classRequired) —
        how many upcoming fights the active buff still applies to. Set to
        CLASS_BUFF_FIGHTS (content.js) on cast, ticked down by 1 (never
        below 0) once per completed fight — see endCombat(), combat.js. */
     classBuffFightsLeft: 0,
     /* The shared 'evade' spell mechanic (Card Shark's Smoke Screen,
        Hexpert's Illusion — content.js) — null, or the id of whichever
        evade spell is currently active ('smokescreen'/'illusion'), for
        the rest of the CURRENT fight only, unlike classBuffFightsLeft
        above. Storing the id rather than a plain boolean is what lets
        the two spells share this one flag safely (a player only ever
        has one class, so only one of the two could ever be known/cast
        anyway) while still picking the right flavor text and the right
        per-spell upgrade level (state.spellUpgradeLevel, below) at the
        point it's actually read. Cleared by endCombat() (so it never
        survives into the next fight) and by playerAttack()/a cast
        damage spell (so swinging back breaks it immediately) — see
        castSpell(), combat.js. Deliberately not part of serializeState()
        (save.js): same reasoning as state.inCombat/state.monster not
        being saved either — this only ever matters mid-fight, and a
        reload never resumes mid-fight. */
     evasionActive: null,
     /* Whichever spell id castSpell() (combat.js) most recently cast —
        read by the Hexpert-exclusive Recast button (recastLastSpell(),
        combat.js) so a Hexpert can repeat their last spell without
        reopening the Use menu every turn. Not reset by endCombat(): a
        Hexpert's favorite spell staying remembered into the NEXT fight
        too is the point, unlike evasionActive/playerStatusEffect above
        which are genuinely meaningless outside the fight they were set
        in. Same not-saved reasoning as those two regardless — a reload
        never resumes mid-fight, and remembering a spell across a login
        gap isn't worth a save-field. */
     lastSpellCast: null,
     /* A boss's own 'debuff' skill (useMonsterSkill(), combat.js) inflicts
        this instead of just attacking that turn -- null, or
        { type:'burn'|'poison'|'freeze', turnsLeft, dmgPerTurn, dmgReduction }.
        Only one active at a time (a fresh debuff overwrites whatever was
        there), ticked down by applyPlayerStatusEffectForTurn() only on the
        player's own next N turns (Attack/a damage spell/an item use — the
        same "turns that cost a turn" set monsterRetaliate() already keys
        off of), not real-time turns. Same not-saved reasoning as
        evasionActive right above — this only ever matters mid-fight. */
     playerStatusEffect: null,
     /* Each known spell's own upgrade level (by id, 0-SPELL_UPGRADE_MAX_LEVEL,
        missing/0 = never upgraded) — bought one level at a time at that
        class's own Act 2 district (CLASS_UPGRADE_LOCATION, content.js),
        per explicit request: "instead of skills scaling, let's have
        them be upgradable... 5 times, where they do more but cost more
        MP." Unlike state.spellsKnown this is a genuine permanent
        progression choice, so — unlike evasionActive/playerStatusEffect
        above — it IS part of serializeState() (save.js). See
        SPELL_UPGRADE_POWER_PER_LEVEL/MP_PER_LEVEL's own comment
        (content.js) for what each level actually does. */
     spellUpgradeLevel: {},
     /* The highest CHANGELOG entry id (changelog.js) this player has
        already been shown, checked once per login (checkChangelogOnLogin(),
        called from enterGameAfterAuth(), auth.js) — null covers both a
        genuinely brand-new character (never shown anything, and never
        will be: nothing has happened yet) and a save that predates this
        field entirely (treated as "show the full history once," not
        "silently already caught up"). Unlike playerStatusEffect above,
        THIS one is saved — see serializeState()/hydrateState(), save.js. */
     lastSeenChangelogVersion: null,
     /* Daily login streak (dailystreak.js) — checkDailyStreakOnLogin(),
        called right alongside checkChangelogOnLogin() from
        enterGameAfterAuth() (auth.js), grants an escalating Pop
        Tabs/Biscuits/Bounty Tokens reward once per real calendar day and
        pops its own overlay. dailyStreakCount counts UP indefinitely (so
        "Day 12!" can be shown) even though the actual reward tier cycles
        through DAILY_STREAK_REWARDS' own 7 entries via a modulo — see that
        array's own comment. lastLoginRewardDateKey is a toDateString()
        string (compares calendar days, not exact timestamps) used both
        to guard against granting twice in one day and to compute the
        gap since the last login for the streak's own one-day-grace
        rule. null on a brand-new character or a save that predates
        this field — both treated as "no streak yet," same as
        lastSeenChangelogVersion above. */
     dailyStreakCount: 0,
     lastLoginRewardDateKey: null,
     /* Bounty board (The Guild) — one active bounty at a time, auto-refreshed
        on claim or expiry (see ensureActiveBounty()/claimBounty() in
        guild.js). null until the player's first visit rolls one. No daily
        claim cap — per explicit request, the board can be worked all day
        long. activeBounty itself carries its own startedAt (Date.now() at
        roll time) for the BOUNTY_RESET_MS expiry check. bountiesCompleted
        is a lifetime counter, unrelated to any per-day limit. */
     activeBounty: null,
     bountiesCompleted: 0,
     /* Stat-reset (respec) potion purchase count, ever — not tiered by
        building level like everything else. Each brew's price climbs
        steeply off this counter (STAT_RESET_BASE_PRICE/_PRICE_MULT,
        content.js). See the brew function in game.js (separate change). */
     statResetsBrewed: 0,
     /* Real-time cooldown gate for restAtInn() (town.js) — Date.now() of the
        last successful rest, 0 meaning "never rested" so a brand-new
        character can rest immediately. Checked against INN_COOLDOWN_MS
        (content.js), independent of devMode/Biscuits — this is about
        pacing clicks in real time, not the energy economy. */
     lastInnRestAt: 0,
     /* Same cooldown gate as lastInnRestAt above, but for restAtCamp()
        (gnometropolis.js) — kept as its own separate timestamp rather
        than sharing lastInnRestAt so resting at one building doesn't
        also lock out the other. */
     lastCampRestAt: 0,
     /* Passive Casino income ("the house's cut") — unlocked once
        buildingUpgrades.casino is at least 1 (CASINO_WINNINGS_CAP[0]=0
        keeps it at zero/inert before that). Accrues off real elapsed time
        exactly like Biscuits (regenCasinoWinnings(), economy.js), capped
        per the Casino's own upgrade level, and claimed via
        claimCasinoWinnings() (guild.js) at the Casino screen. */
     casinoWinnings: 0,
     lastCasinoRegenAt: Date.now(),
     /* The Blackjack table (casino.js) — null while in the Casino lobby,
        set the moment the player sits down (enterBlackjackTable()) and
        cleared on leaveBlackjackTable(); its own `phase` field tracks
        betting/playerTurn/resolved from there. Deliberately not part of
        serializeState() (save.js), same reasoning as state.inCombat/
        state.monster: a reload should never resume mid-hand or
        mid-sitting-at-the-table. */
     blackjack: null,
     /* The Hi-Lo table (hilo.js, Rogues' Den) — same shape/same
        not-saved reasoning as blackjack above, just its own building
        and its own `{ bet, currentCard, streak, phase, resultText }`. */
     hilo: null,
     /* Rare-drop collection log — every rareDrop item name ever obtained,
        kept even if later sold/lost (see winCombat() in game.js and the
        Character drawer's Rare Finds block in render.js). */
     rareDropsSeen: [],
     allRaresBonusClaimed: false,
     /* Bestiary collection log — same shape as rareDropsSeen/
     allRaresBonusClaimed just above, but keyed by monster NAME instead
     of a rare drop's own name, and unlocked on actually DEFEATING a
     monster (winCombat(), combat.js), not merely encountering one. See
     NAMED_BOSSES (content.js) and renderBestiaryBlock()
     (render-character.js). */
     monstersSeen: [],
     allMonstersBonusClaimed: false
   };
}
const state = createDefaultState();

/* Fun names for the four core stats. Beef = melee punch, Zip = speed/evasion
   AND accuracy (raises your own dodge chance AND cancels out some of
   whoever you're fighting's own dodge chance — zipDodgeAndAccuracy(),
   combat.js — the same number does both jobs, on both sides of a fight),
   Grit = toughness (raises max HP), Hoodoo = odd mystical aptitude (raises max MP).
   Armor is a 5th entry here too, for display only — see SPENDABLE_STAT_KEYS
   below for why it never becomes a stat-point spend option. */
const STAT_LABELS = { beef:'Beef', zip:'Zip', grit:'Grit', hoodoo:'Hoodoo', armor:'Armor' };
const STAT_HINTS = {
     beef:'Hit harder in a fight.',
     zip:'Dodge attacks, flee more often, and gain accuracy against a slippery target.',
     grit:'Tougher constitution — raises max HP.',
     hoodoo:'A knack for the weird — raises max MP.',
     armor:'Reduces damage taken from every hit.',
};
/* Armor is gear-only, by design — it flows through getEffectiveStats()'s
   already-generic equipment-merge loop (player-actions.js) purely as an
   item.bonus key, and never lives in state.stats at all (createDefaultState()
   below, dev-tools.js's stat reset, and town.js's respec all stay untouched
   because of this). STAT_LABELS above still needs an 'armor' entry so any
   item.bonus display (item-tiers.js, render-shop.js, render-character.js)
   can label it generically the same way it labels beef/zip/grit/hoodoo — but
   renderStatsBlock()'s stat-point spend buttons (render-character.js) and
   spendStatPoint()'s own guard (player-actions.js) iterate/check THIS list
   instead of STAT_LABELS, which is what actually keeps "Armor +1" from ever
   showing up as something a level-up point can buy. */
const SPENDABLE_STAT_KEYS = ['beef', 'zip', 'grit', 'hoodoo'];
const SLOT_LABELS = { head:'Head', chest:'Chest', legs:'Legs', boots:'Boots', weapon:'Weapon' };
const SLOT_ORDER = ['head','chest','legs','boots','weapon'];

/* Turns a raw stat value (state.stats.beef/zip/grit/hoodoo, via getEffectiveStats()
   in account.js) into the superlinearly-scaled number combat math actually reads,
   so late points are worth meaningfully more than early ones. STAT_SCALING_DIVISOR
   lives in content.js with the other balance constants. Shared by game.js (combat
   rolls) and account.js (recomputeMaxStats) — lives here since core.js loads before
   both. */
function statBonus(value){ return value + Math.floor(value*value/STAT_SCALING_DIVISOR); }
