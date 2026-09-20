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
     lotTier: 0, /* the town-square Town Lot (translate(200,100) in artTownSquare()) — 0 = unpurchased "Empty Lot". See LOT_TIER_NAMES/LOT_TIER_COST (content.js) and buyTownLot()/upgradeTownLot() (game.js). Buying tier 1 is what unlocks buildingUpgrades below. */
     buildingUpgrades: {}, /* key = a BUILDING_UPGRADES entry's key (content.js) -> upgrade level, 0..BUILDING_UPGRADE_MAX. Missing keys read as level 0 — see upgradeBuilding()/buildingUpgradeLevel() in game.js. Levels are tracked only for now; they don't change anything about the buildings yet (see content.js comment above BUILDING_UPGRADES). */
     lastRegenAt: Date.now(),
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
     quest7RareDefeated: false, /* the REAL gnomeKing (content.js) beaten via approachPalaceGate() -- separate from quest6RareDefeated, which is the decoy gnomeKingsCaptain in the Vault */
     quest7Complete: false,
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
        CARD_SHARK_PAYOUT_BONUS/HEXPERT_SPELL_DMG_BONUS, content.js) — see
        classSkillCost() there. */
     classTrialGuildPassed: false,
     classTrialCasinoPassed: false,
     classTrialHoodooPassed: false,
     classSkillLevel: 0,
     /* Class-exclusive buff spells (content.js's spells[], classRequired) —
        how many upcoming fights the active buff still applies to. Set to
        CLASS_BUFF_FIGHTS (content.js) on cast, ticked down by 1 (never
        below 0) once per completed fight — see endCombat(), combat.js. */
     classBuffFightsLeft: 0,
     /* Bounty board (The Guild) — one active bounty at a time, auto-refreshed
        on claim or expiry (see ensureActiveBounty()/claimBounty() in
        guild.js). null until the player's first visit rolls one, or once
        bountiesClaimedToday hits BOUNTY_DAILY_CAP (content.js) for the day.
        activeBounty itself carries its own startedAt (Date.now() at roll
        time) for the BOUNTY_RESET_MS expiry check. */
     activeBounty: null,
     bountiesCompleted: 0,
     bountiesClaimedToday: 0,
     bountyDayKey: null, /* toDateString() of the last claim-day boundary check — see checkBountyDayReset() (guild.js) */
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
     /* Passive Casino income ("the house's cut") — unlocked once
        buildingUpgrades.casino is at least 1 (CASINO_WINNINGS_CAP[0]=0
        keeps it at zero/inert before that). Accrues off real elapsed time
        exactly like Biscuits (regenCasinoWinnings(), economy.js), capped
        per the Casino's own upgrade level, and claimed via
        claimCasinoWinnings() (guild.js) at the Casino screen. */
     casinoWinnings: 0,
     lastCasinoRegenAt: Date.now(),
     /* Rare-drop collection log — every rareDrop item name ever obtained,
        kept even if later sold/lost (see winCombat() in game.js and the
        Character drawer's Rare Finds block in render.js). */
     rareDropsSeen: [],
     allRaresBonusClaimed: false
   };
}
const state = createDefaultState();

/* Fun names for the four core stats. Beef = melee punch, Zip = speed/evasion,
   Grit = toughness (raises max HP), Hoodoo = odd mystical aptitude (raises max MP). */
const STAT_LABELS = { beef:'Beef', zip:'Zip', grit:'Grit', hoodoo:'Hoodoo' };
const STAT_HINTS = {
     beef:'Hit harder in a fight.',
     zip:'Dodge attacks and flee more often.',
     grit:'Tougher constitution — raises max HP.',
     hoodoo:'A knack for the weird — raises max MP.'
};
const SLOT_LABELS = { head:'Head', chest:'Chest', legs:'Legs', boots:'Boots', weapon:'Weapon' };
const SLOT_ORDER = ['head','chest','legs','boots','weapon'];

/* Turns a raw stat value (state.stats.beef/zip/grit/hoodoo, via getEffectiveStats()
   in account.js) into the superlinearly-scaled number combat math actually reads,
   so late points are worth meaningfully more than early ones. STAT_SCALING_DIVISOR
   lives in content.js with the other balance constants. Shared by game.js (combat
   rolls) and account.js (recomputeMaxStats) — lives here since core.js loads before
   both. */
function statBonus(value){ return value + Math.floor(value*value/STAT_SCALING_DIVISOR); }
