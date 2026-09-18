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

const state = {
     hp: 30, maxHp: 30,
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
     classQuestAccepted: false,
     classQuestComplete: false,
     classTitle: null,
     /* Bounty board (The Guild) — one active bounty at a time, auto-refreshed
        on claim (see rollNewBounty()/claimBounty() in game.js). null until the
        player's first visit to the bounty section rolls one. */
     activeBounty: null,
     bountiesCompleted: 0,
     /* Rare-drop collection log — every rareDrop item name ever obtained,
        kept even if later sold/lost (see winCombat() in game.js and the
        Character drawer's Rare Finds block in render.js). */
     rareDropsSeen: [],
     allRaresBonusClaimed: false
};

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

/* ---------------- Item icons (crude MS-Paint-style doodles) ---------------- */
function iconWrap(inner, fill){
     return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="none">${inner}</svg>`;
}
function iconApple(){
     return iconWrap(`<circle cx="28" cy="34" r="18" fill="#b5453f"/><path d="M28 16 Q30 8 36 6" fill="none"/><path d="M32 10 Q42 6 44 16 Q34 18 32 10 Z" fill="#5c8a5c"/>`);
}
function iconJerky(){
     return iconWrap(`<path d="M10 40 Q14 18 30 14 Q48 10 50 26 Q52 42 34 46 Q16 50 10 40 Z" fill="#8a5a3a"/><line x1="20" y1="34" x2="30" y2="26"/><line x1="28" y1="40" x2="40" y2="28"/>`);
}
function iconSoil(){
     return iconWrap(`<path d="M10 42 Q14 26 30 28 Q46 22 50 38 Q52 48 30 48 Q10 50 10 42 Z" fill="#5f4632"/><circle cx="20" cy="38" r="2" fill="#2b2b28" stroke="none"/><circle cx="34" cy="34" r="2" fill="#2b2b28" stroke="none"/><circle cx="42" cy="40" r="2" fill="#2b2b28" stroke="none"/>`);
}
function iconRakeTine(){
     return iconWrap(`<line x1="30" y1="52" x2="30" y2="14"/><line x1="18" y1="20" x2="12" y2="8"/><line x1="24" y1="18" x2="20" y2="6"/><line x1="30" y1="18" x2="30" y2="4"/><line x1="36" y1="18" x2="40" y2="6"/><line x1="42" y1="20" x2="48" y2="8"/>`);
}
function iconLure(){
     return iconWrap(`<ellipse cx="26" cy="26" rx="14" ry="8" fill="#3d5a80" transform="rotate(-20 26 26)"/><path d="M36 34 Q46 40 42 50 Q40 54 34 50" fill="none" stroke-width="3"/><circle cx="44" cy="48" r="3" fill="#2b2b28" stroke="none"/>`);
}
function iconShellFragment(){
     return iconWrap(`<path d="M10 44 Q10 20 34 20 Q52 20 52 36 Q52 48 38 48 Q28 48 28 38 Q28 30 36 30" fill="#b9b3a4"/>`);
}
function iconWhistle(){
     return iconWrap(`<circle cx="26" cy="30" r="16" fill="#d1a94e"/><circle cx="26" cy="30" r="5" fill="#2b2b28" stroke="none"/><path d="M40 24 L52 14" stroke-width="3"/><path d="M40 20 Q52 20 50 10" fill="none" stroke-width="3"/>`);
}
function iconFigurine(){
     return iconWrap(`<path d="M30 6 L20 24 L40 24 Z" fill="#b06a97"/><circle cx="30" cy="32" r="8" fill="#e0c49a"/><path d="M22 40 Q30 46 38 40 L36 54 L24 54 Z" fill="#5c8a5c"/>`);
}
function iconClover(){
     return iconWrap(`<circle cx="22" cy="20" r="9" fill="#5c8a5c"/><circle cx="38" cy="20" r="9" fill="#5c8a5c"/><circle cx="22" cy="36" r="9" fill="#5c8a5c"/><circle cx="38" cy="36" r="9" fill="#5c8a5c"/><line x1="30" y1="28" x2="30" y2="52"/>`);
}
function iconBiscuit(){
     return iconWrap(`<circle cx="30" cy="30" r="22" fill="#a97c53"/><circle cx="20" cy="22" r="3" fill="#2b2b28" stroke="none"/><circle cx="38" cy="18" r="3" fill="#2b2b28" stroke="none"/><circle cx="40" cy="36" r="3" fill="#2b2b28" stroke="none"/><circle cx="22" cy="40" r="3" fill="#2b2b28" stroke="none"/>`);
}
function iconPopTab(){
     return iconWrap(`<ellipse cx="28" cy="36" rx="18" ry="10" fill="#b9b3a4"/><ellipse cx="28" cy="36" rx="8" ry="4" fill="#f4efe4"/><rect x="24" y="10" width="8" height="16" fill="#b9b3a4"/><circle cx="28" cy="14" r="5" fill="#f4efe4"/>`);
}
function iconRatTail(){
     return iconWrap(`<path d="M14 44 Q20 20 40 16 Q50 14 46 22 Q30 26 24 44 Z" fill="#b06a97"/>`);
}
function iconBottlecapHelmet(){
     return iconWrap(`<circle cx="30" cy="32" r="18" fill="#b9b3a4"/><path d="M12 32 L14 24 M18 20 L22 14 M30 14 L30 8 M38 14 L42 20 M46 24 L48 32" stroke-width="3"/>`);
}
function iconPipeFitting(){
     return iconWrap(`<path d="M14 44 L14 26 Q14 14 26 14 L44 14" fill="none" stroke-width="8"/>`);
}
function iconCoatButton(){
     return iconWrap(`<circle cx="30" cy="30" r="18" fill="#5f4632"/><circle cx="24" cy="24" r="2" fill="#2b2b28" stroke="none"/><circle cx="36" cy="24" r="2" fill="#2b2b28" stroke="none"/><circle cx="24" cy="36" r="2" fill="#2b2b28" stroke="none"/><circle cx="36" cy="36" r="2" fill="#2b2b28" stroke="none"/>`);
}

/* ---------------- Clockwork Quarry loot icons ---------------- */
function iconGear(){
     return iconWrap(`<circle cx="30" cy="30" r="14" fill="#d1a94e"/><circle cx="30" cy="30" r="6" fill="#f4efe4"/><path d="M30 12 L30 18 M30 42 L30 48 M12 30 L18 30 M42 30 L48 30 M17 17 L21 21 M39 39 L43 43 M17 43 L21 39 M39 21 L43 17" stroke-width="4"/>`);
}
function iconSurveyMap(){
     return iconWrap(`<path d="M12 14 L48 10 L46 46 L10 50 Z" fill="#f4efe4"/><path d="M18 20 Q30 28 40 18" fill="none" stroke-width="2.5"/><path d="M16 36 L28 30 L42 38" fill="none" stroke-width="2.5"/><circle cx="34" cy="26" r="2" fill="#b5453f" stroke="none"/>`);
}
function iconPickaxeHead(){
     return iconWrap(`<path d="M10 22 Q30 10 50 22 Q34 26 30 34 Q26 26 10 22 Z" fill="#8a8477"/><line x1="30" y1="34" x2="30" y2="54" stroke-width="5"/>`);
}
function iconOreGrit(){
     return iconWrap(`<path d="M10 42 Q14 24 30 26 Q46 20 50 36 Q52 46 30 48 Q10 50 10 42 Z" fill="#5f4632"/><circle cx="20" cy="36" r="2.4" fill="#d1a94e" stroke="none"/><circle cx="34" cy="32" r="2.4" fill="#d1a94e" stroke="none"/><circle cx="42" cy="40" r="2.4" fill="#d1a94e" stroke="none"/>`);
}

/* ---------------- Sunless Vault loot icons ---------------- */
function iconCapturedLight(){
     return iconWrap(`<path d="M30 8 L38 26 L30 52 L22 26 Z" fill="#f4efe4"/><path d="M30 8 L34 26 L30 52 L26 26 Z" fill="#d1a94e" stroke="none"/>`);
}
function iconSentinelEye(){
     return iconWrap(`<path d="M10 30 Q30 12 50 30 Q30 48 10 30 Z" fill="#8a8477"/><circle cx="30" cy="30" r="9" fill="#3d5a80"/><circle cx="30" cy="30" r="3" fill="#f4efe4" stroke="none"/>`);
}
function iconGoldWhisker(){
     return iconWrap(`<path d="M10 44 Q30 46 50 30" fill="none" stroke-width="3"/><circle cx="18" cy="42" r="2" fill="#d1a94e" stroke="none"/><circle cx="30" cy="38" r="2" fill="#d1a94e" stroke="none"/><circle cx="42" cy="32" r="2" fill="#d1a94e" stroke="none"/>`);
}
function iconCeremonialGauntlet(){
     return iconWrap(`<path d="M20 50 L20 26 Q20 16 30 16 Q40 16 40 26 L40 50 Z" fill="#b9b3a4"/><line x1="24" y1="30" x2="24" y2="46"/><line x1="30" y1="28" x2="30" y2="46"/><line x1="36" y1="30" x2="36" y2="46"/><circle cx="30" cy="20" r="3" fill="#d1a94e" stroke="none"/>`);
}

/* ---------------- Gnometropolis loot icons ---------------- */
function iconVizierLedger(){
     return iconWrap(`<rect x="14" y="10" width="32" height="42" fill="#f4efe4"/><rect x="14" y="10" width="6" height="42" fill="#5f4632"/><line x1="26" y1="18" x2="42" y2="18"/><line x1="26" y1="26" x2="42" y2="26"/><line x1="26" y1="34" x2="38" y2="34"/>`);
}
function iconShieldBoss(){
     return iconWrap(`<path d="M30 8 L48 16 L46 36 Q46 48 30 54 Q14 48 14 36 L12 16 Z" fill="#8a8477"/><circle cx="30" cy="30" r="8" fill="#b9b3a4"/>`);
}
function iconBurrowShell(){
     return iconWrap(`<path d="M12 40 Q10 20 30 18 Q50 16 48 36 Q46 50 28 48 Q14 46 12 40 Z" fill="#8a5a3a"/><path d="M20 30 Q30 26 40 32" fill="none" stroke-width="2.5"/>`);
}
function iconServoJoint(){
     return iconWrap(`<circle cx="30" cy="30" r="12" fill="#3d5a80"/><circle cx="30" cy="30" r="5" fill="#f4efe4"/><rect x="26" y="4" width="8" height="14" fill="#8a8477"/><rect x="26" y="42" width="8" height="14" fill="#8a8477"/>`);
}

/* ---------------- Gnometropolis-tier gear icons (shopGearItemsTier2) ---------------- */
function iconVizierScepter(){
     return iconWrap(`<line x1="20" y1="52" x2="42" y2="12"/><circle cx="44" cy="10" r="7" fill="#b06a97"/><circle cx="44" cy="10" r="2.5" fill="#f4efe4" stroke="none"/>`);
}
function iconGuardHelm(){
     return iconWrap(`<path d="M14 36 Q14 14 30 14 Q46 14 46 36 L46 42 L14 42 Z" fill="#8a8477"/><rect x="24" y="30" width="12" height="6" fill="#2b2b28" stroke="none"/><rect x="12" y="42" width="36" height="6" fill="#8a8477"/>`);
}
function iconClockworkPlate(){
     return iconWrap(`<path d="M18 14 L42 14 L46 50 L14 50 Z" fill="#3d5a80"/><circle cx="30" cy="30" r="7" fill="#d1a94e"/><circle cx="30" cy="30" r="2.4" fill="#f4efe4" stroke="none"/>`);
}
function iconBurrowGreaves(){
     return iconWrap(`<path d="M22 10 L38 10 L36 46 L24 46 Z" fill="#8a5a3a"/><line x1="24" y1="20" x2="34" y2="18"/><line x1="24" y1="30" x2="34" y2="28"/><line x1="24" y1="40" x2="34" y2="38"/>`);
}
function iconSpringBoots(){
     return iconWrap(`<rect x="14" y="30" width="32" height="20" fill="#d1a94e"/><path d="M18 30 Q18 20 24 20 Q30 20 30 30 M34 30 Q34 20 40 20" fill="none" stroke-width="3"/>`);
}

/* ---------------- Equipment icons (starter gear + shop upgrades) ---------------- */
function iconFork(){
     return iconWrap(`<line x1="30" y1="12" x2="30" y2="26"/><line x1="22" y1="12" x2="22" y2="26"/><line x1="38" y1="12" x2="38" y2="26"/><path d="M18 26 Q30 32 42 26" fill="none"/><line x1="30" y1="30" x2="30" y2="52"/>`);
}
function iconCap(){
     return iconWrap(`<path d="M14 40 Q14 20 30 20 Q46 20 46 40 Z" fill="#3d5a80"/><rect x="10" y="38" width="40" height="6" fill="#3d5a80"/><circle cx="30" cy="20" r="3" fill="#d1a94e" stroke="none"/>`);
}
function iconTunic(){
     return iconWrap(`<path d="M20 16 L40 16 L46 28 L40 26 L40 50 L20 50 L20 26 L14 28 Z" fill="#b06a97"/>`);
}
function iconTrousers(){
     return iconWrap(`<path d="M20 12 L40 12 L40 30 L36 52 L30 52 L30 32 L24 52 L18 52 L20 30 Z" fill="#5f4632"/>`);
}
function iconMismatchedBoots(){
     return iconWrap(`<rect x="10" y="34" width="14" height="18" fill="#8a8477"/><rect x="30" y="30" width="16" height="22" fill="#a97c53"/><line x1="10" y1="44" x2="24" y2="44"/><line x1="30" y1="40" x2="46" y2="40"/>`);
}
function iconRakeShank(){
     return iconWrap(`<line x1="30" y1="52" x2="30" y2="14"/><path d="M30 14 L22 22 M30 14 L38 22" stroke-width="3"/>`);
}
function iconWandStick(){
     return iconWrap(`<line x1="18" y1="50" x2="42" y2="14"/><path d="M42 14 L46 8 M42 14 L48 16 M42 14 L38 8"/>`);
}
function iconPotLid(){
     return iconWrap(`<ellipse cx="30" cy="34" rx="20" ry="8" fill="#b9b3a4"/><rect x="26" y="14" width="8" height="14" fill="#8a8477"/><circle cx="30" cy="14" r="4" fill="#8a8477"/>`);
}
function iconVest(){
     return iconWrap(`<path d="M18 16 L42 16 L38 50 L22 50 Z" fill="#5f4632"/><line x1="24" y1="22" x2="24" y2="44"/><line x1="36" y1="22" x2="36" y2="44"/>`);
}
function iconShinGuard(){
     return iconWrap(`<path d="M22 12 L38 12 L36 48 L24 48 Z" fill="#8a5a3a"/><line x1="26" y1="20" x2="34" y2="20"/><line x1="26" y1="30" x2="34" y2="30"/><line x1="26" y1="40" x2="34" y2="40"/>`);
}
function iconGripBoots(){
     return iconWrap(`<rect x="14" y="28" width="32" height="22" fill="#3d5a80"/><line x1="18" y1="46" x2="42" y2="46"/><path d="M18 50 L20 54 M26 50 L28 54 M34 50 L36 54 M42 50 L44 54"/>`);
}

/* ---------------- Spell icons (crude MS-Paint-style doodles) ---------------- */
function iconHexBolt(){
     return iconWrap(`<path d="M34 6 L14 34 L28 34 L20 54 L46 26 L32 26 Z" fill="#b06a97"/>`);
}
function iconMendCharm(){
     return iconWrap(`<path d="M30 48 C10 34 10 14 24 12 C30 11 30 18 30 18 C30 18 30 11 36 12 C50 14 50 34 30 48 Z" fill="#b5453f"/>`);
}
function iconWardCharm(){
     return iconWrap(`<circle cx="30" cy="30" r="18" fill="#3d5a80"/><circle cx="30" cy="30" r="10" fill="none" stroke="#f4efe4" stroke-width="3"/><circle cx="30" cy="30" r="3" fill="#f4efe4" stroke="none"/>`);
}
function iconBottledFury(){
     return iconWrap(`<path d="M24 10 L36 10 L36 20 L42 30 L42 50 Q42 54 38 54 L22 54 Q18 54 18 50 L18 30 Z" fill="#b06a97"/><rect x="26" y="6" width="8" height="6" fill="#5f4632"/><path d="M24 34 Q30 28 36 34" fill="none" stroke="#f4efe4" stroke-width="2"/>`);
}

/* ---------------- Potion-ingredient icons (Hoodoo Doctor's quest) ---------------- */
function iconPotionWorms(){
     return iconWrap(`<ellipse cx="30" cy="42" rx="18" ry="10" fill="#a97c53"/><path d="M14 40 Q18 28 26 34 Q34 40 30 28" fill="none" stroke="#5c8a5c" stroke-width="3"/><path d="M20 44 Q26 36 34 42" fill="none" stroke="#5c8a5c" stroke-width="3"/>`);
}
function iconPotionTadpole(){
     return iconWrap(`<circle cx="26" cy="28" r="12" fill="#5c8a5c"/><path d="M34 34 Q52 44 48 54" fill="none" stroke-width="3"/><circle cx="22" cy="24" r="1.8" fill="#2b2b28" stroke="none"/>`);
}
function iconPotionSludge(){
     return iconWrap(`<path d="M22 10 L22 20 L14 40 Q12 48 22 50 L38 50 Q48 48 46 40 L38 20 L38 10 Z" fill="#5c8a5c"/><rect x="20" y="8" width="20" height="6" fill="#8a8477"/>`);
}
function iconPotionWhisker(){
     return iconWrap(`<path d="M10 44 Q30 46 50 30" fill="none" stroke-width="3"/><circle cx="10" cy="44" r="3" fill="#8a8477" stroke="none"/>`);
}

/* ---------------- Vein ingredient icons (the Tinker's quest, "The Last Vein") ---------------- */
function iconVeinGearCore(){
     return iconWrap(`<circle cx="30" cy="30" r="16" fill="#8a8477"/><circle cx="30" cy="30" r="7" fill="#b5453f"/><path d="M30 10 L30 16 M30 44 L30 50 M10 30 L16 30 M44 30 L50 30" stroke-width="4"/>`);
}
function iconVeinOreChunk(){
     return iconWrap(`<path d="M14 40 L18 20 L32 12 L48 22 L44 44 L26 50 Z" fill="#5f4632"/><path d="M22 26 L34 22 L40 32 L30 40 Z" fill="#3d5a80" stroke="none"/>`);
}
function iconVeinGemstone(){
     return iconWrap(`<path d="M30 8 L48 24 L38 52 L22 52 L12 24 Z" fill="#b06a97"/><path d="M30 8 L38 24 L22 24 Z" fill="#f4efe4" stroke="none"/>`);
}
function iconVeinWiring(){
     return iconWrap(`<path d="M10 16 Q30 16 20 30 Q10 44 30 44 Q50 44 40 30 Q30 16 50 16" fill="none" stroke="#d1a94e" stroke-width="3"/>`);
}

/* ---------------- Monster + player scene art ---------------- */
function sceneWrap(inner, rot){
     return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(${rot||0}deg)">${inner}</svg>`;
}
function artIdle(){
     return sceneWrap(`<circle cx="50" cy="26" r="13" fill="#d1a94e"/><line x1="50" y1="39" x2="50" y2="68"/><line x1="50" y1="48" x2="32" y2="58"/><line x1="50" y1="48" x2="68" y2="58"/><line x1="50" y1="68" x2="36" y2="92"/><line x1="50" y1="68" x2="64" y2="92"/>`, 0);
}
function artVillager(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M38 20 Q50 6 62 20 L60 22 Q50 12 40 22 Z" fill="#5f4632"/><path d="M34 36 Q50 30 66 36 L64 76 Q50 82 36 76 Z" fill="#3d5a80"/><line x1="34" y1="40" x2="18" y2="58"/><line x1="18" y1="58" x2="10" y2="42"/><line x1="66" y1="40" x2="76" y2="52"/><line x1="50" y1="82" x2="42" y2="98"/><line x1="50" y1="82" x2="58" y2="98"/>`, -1);
}
function artShopkeeper(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M34 36 Q50 30 66 36 L64 76 Q50 82 36 76 Z" fill="#5c8a5c"/><rect x="40" y="50" width="20" height="24" fill="#f4efe4"/><line x1="34" y1="40" x2="20" y2="56"/><line x1="20" y1="56" x2="26" y2="70"/><line x1="66" y1="40" x2="80" y2="56"/><line x1="80" y1="56" x2="74" y2="70"/><line x1="50" y1="82" x2="42" y2="98"/><line x1="50" y1="82" x2="58" y2="98"/>`, 1);
}
function artGuildmaster(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M34 36 Q50 30 66 36 L64 76 Q50 82 36 76 Z" fill="#8a8477"/><line x1="38" y1="38" x2="62" y2="72"/><circle cx="50" cy="55" r="4" fill="#d1a94e" stroke="none"/><line x1="34" y1="40" x2="20" y2="56"/><line x1="20" y1="56" x2="26" y2="70"/><line x1="66" y1="40" x2="82" y2="46"/><line x1="82" y1="46" x2="86" y2="66"/><line x1="50" y1="82" x2="42" y2="98"/><line x1="50" y1="82" x2="58" y2="98"/>`, -1);
}
function artCroupier(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M36 20 Q50 14 64 20 L62 24 Q50 18 38 24 Z" fill="#2b2b28"/><path d="M34 36 Q50 30 66 36 L64 76 Q50 82 36 76 Z" fill="#b06a97"/><rect x="40" y="50" width="20" height="14" fill="#f4efe4"/><line x1="45" y1="57" x2="55" y2="57"/><line x1="34" y1="40" x2="20" y2="56"/><line x1="20" y1="56" x2="26" y2="70"/><line x1="66" y1="40" x2="80" y2="52"/><path d="M74 46 L86 40 M78 50 L90 46" stroke-width="3"/><line x1="50" y1="82" x2="42" y2="98"/><line x1="50" y1="82" x2="58" y2="98"/>`, 1);
}
function artHoodooDoctor(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M40 20 Q50 8 60 20" fill="none" stroke-width="3"/><path d="M34 36 Q50 28 66 36 L64 78 Q50 84 36 78 Z" fill="#b06a97"/><circle cx="30" cy="50" r="5" fill="#8a8477"/><circle cx="30" cy="50" r="1.8" fill="#2b2b28" stroke="none"/><line x1="30" y1="55" x2="30" y2="62"/><line x1="34" y1="40" x2="18" y2="54"/><line x1="18" y1="54" x2="24" y2="68"/><line x1="66" y1="40" x2="82" y2="50"/><path d="M82 50 Q90 46 88 38" fill="none" stroke-width="2.5"/><line x1="50" y1="84" x2="42" y2="99"/><line x1="50" y1="84" x2="58" y2="99"/>`, 0);
}
function artTinker(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M36 18 L64 18 L62 24 L38 24 Z" fill="#8a8477"/><rect x="34" y="36" width="32" height="42" fill="#3d5a80"/><circle cx="42" cy="50" r="6" fill="#d1a94e"/><circle cx="42" cy="50" r="2" fill="#2b2b28" stroke="none"/><rect x="54" y="46" width="10" height="10" fill="#b9b3a4"/><line x1="34" y1="40" x2="18" y2="52"/><path d="M18 52 Q10 52 12 44" fill="none" stroke-width="2.5"/><line x1="66" y1="40" x2="80" y2="48"/><line x1="50" y1="78" x2="42" y2="98"/><line x1="50" y1="78" x2="58" y2="98"/>`, 0);
}

function artTownSquare(gafferFlagType, guildFlagType, hoodooFlagType, tinkerFlagType, lotTier){
   const makeFlag = (flagType) => {
      if(!flagType) return '';
      const bg = flagType==='offer' ? '#b5453f' : '#5c8a5c';
      const symbol = flagType==='offer' ? '!' : '?';
      return `
      <g class="quest-flag">
      <circle cx="50" cy="16" r="9" fill="${bg}" stroke="#2b2b28" stroke-width="3"/>
      <text x="50" y="21" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="12" font-weight="700" fill="#f4efe4" stroke="none">${symbol}</text>
      </g>`;
   };
   const plate = (label, fontSize) => `
   <rect x="6" y="76" width="88" height="18" fill="#f4efe4" stroke="#2b2b28" stroke-width="2"/>
   <text x="50" y="89" text-anchor="middle" class="building-label" font-size="${fontSize}" fill="#2b2b28" stroke="none">${label}</text>`;
   return `<svg class="town-scene-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="292" height="292" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>

   <g transform="translate(0,0)" class="building-hit" data-action="gaffer">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M18 34 L50 22 L82 34 Z" fill="#b5453f"/>
   <rect x="27" y="34" width="46" height="32" fill="#a97c53"/>
   <rect x="42" y="50" width="16" height="16" fill="#5f4632"/>
   <rect x="32" y="40" width="9" height="9" fill="#f4efe4"/>
   <line x1="36" y1="40" x2="36" y2="49"/><line x1="32" y1="44" x2="41" y2="44"/>
   ${makeFlag(gafferFlagType)}
   ${plate("Gaffer's Cottage", 8)}
   </g>

   <g transform="translate(100,0)" class="building-hit" data-action="hoodoo">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M22 38 L50 20 L78 38 Z" fill="#b06a97"/>
   <rect x="28" y="38" width="44" height="28" fill="#5f4632"/>
   <rect x="43" y="52" width="14" height="14" fill="#2b2b28"/>
   <circle cx="36" cy="46" r="4" fill="#f4efe4"/>
   <circle cx="36" cy="46" r="1.6" fill="#2b2b28" stroke="none"/>
   <path d="M62 30 Q66 24 62 18" fill="none" stroke-width="2.5"/>
   <path d="M66 32 Q72 24 66 16" fill="none" stroke-width="2.5"/>
   ${makeFlag(hoodooFlagType)}
   ${plate("Hoodoo Doctor", 7)}
   </g>

   <g transform="translate(200,0)" class="building-hit" data-action="rest">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 36 L50 14 L86 36 Z" fill="#8a8477"/>
   <rect x="24" y="36" width="52" height="30" fill="#b9b3a4"/>
   <rect x="43" y="50" width="14" height="16" fill="#5f4632"/>
   <rect x="32" y="42" width="8" height="8" fill="#f4efe4"/>
   <rect x="60" y="42" width="8" height="8" fill="#f4efe4"/>
   <line x1="24" y1="28" x2="12" y2="28"/>
   <rect x="4" y="22" width="12" height="9" fill="#d1a94e"/>
   ${plate("The Inn", 10)}
   </g>

   <g transform="translate(0,100)" class="building-hit" data-action="tinker">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M22 34 L50 22 L78 34 Z" fill="#8a8477"/>
   <rect x="28" y="34" width="44" height="32" fill="#3d5a80"/>
   <circle cx="50" cy="50" r="9" fill="#d1a94e"/>
   <circle cx="50" cy="50" r="3" fill="#2b2b28" stroke="none"/>
   <rect x="34" y="40" width="8" height="8" fill="#f4efe4"/>
   <rect x="58" y="40" width="8" height="8" fill="#f4efe4"/>
   ${makeFlag(tinkerFlagType)}
   ${plate("Tinker's Workshop", 6)}
   </g>

   <g transform="translate(200,100)" class="building-hit" data-action="townlot">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${lotTier===0 ? `
   <rect x="16" y="40" width="68" height="34" fill="#5c8a5c" stroke-dasharray="5,4"/>
   ` : lotTier===1 ? `
   <rect x="16" y="40" width="68" height="34" fill="#5c8a5c"/>
   <line x1="16" y1="52" x2="30" y2="46"/><line x1="30" y1="46" x2="30" y2="72"/>
   <line x1="40" y1="44" x2="40" y2="72"/><line x1="60" y1="44" x2="60" y2="72"/>
   <line x1="70" y1="46" x2="84" y2="52"/>
   ` : lotTier===2 ? `
   <rect x="16" y="40" width="68" height="34" fill="#5c8a5c"/>
   <path d="M32 46 L50 32 L68 46 Z" fill="#8a8477"/>
   <rect x="38" y="46" width="24" height="22" fill="#a97c53"/>
   <rect x="46" y="56" width="8" height="12" fill="#5f4632"/>
   ` : `
   <rect x="16" y="40" width="68" height="34" fill="#5c8a5c"/>
   <path d="M18 40 L50 16 L82 40 Z" fill="#3d5a80"/>
   <rect x="26" y="40" width="48" height="34" fill="#b9b3a4"/>
   <rect x="43" y="52" width="14" height="22" fill="#5f4632"/>
   <rect x="30" y="46" width="8" height="8" fill="#f4efe4"/>
   <rect x="62" y="46" width="8" height="8" fill="#f4efe4"/>
   `}
   ${plate(lotTier===0 ? 'Empty Lot' : (lotTier>=3 ? 'Town Hall' : 'Town Lot'), 9)}
   </g>

   <g transform="translate(100,200)" class="building-hit" data-action="shop">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M16 44 L23 26 L30 44 L37 26 L44 44 L51 26 L58 44 L65 26 L72 44 L79 26 L84 44 Z" fill="#b5453f"/>
   <rect x="20" y="44" width="60" height="22" fill="#d1a94e"/>
   <rect x="28" y="54" width="44" height="12" fill="#f4efe4"/>
   <line x1="28" y1="60" x2="72" y2="60"/>
   <circle cx="38" cy="59" r="2.5" fill="#5c8a5c"/>
   <circle cx="50" cy="59" r="2.5" fill="#b06a97"/>
   <circle cx="62" cy="59" r="2.5" fill="#3d5a80"/>
   ${plate("The Shop", 10)}
   </g>

   <g transform="translate(0,200)" class="building-hit" data-action="guild">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M20 42 L20 34 L28 34 L28 42 L36 42 L36 34 L44 34 L44 42 L56 42 L56 34 L64 34 L64 42 L72 42 L72 34 L80 34 L80 42 Z" fill="#8a8477"/>
   <rect x="20" y="42" width="60" height="30" fill="#b9b3a4"/>
   <rect x="42" y="56" width="16" height="16" fill="#5f4632"/>
   <line x1="50" y1="34" x2="50" y2="12"/>
   <path d="M50 12 L68 18 L50 24 Z" fill="#3d5a80"/>
   ${makeFlag(guildFlagType)}
   ${plate("The Guild", 9)}
   </g>

   <g transform="translate(100,100)">
   <ellipse cx="50" cy="62" rx="28" ry="10" fill="#3d5a80"/>
   <ellipse cx="50" cy="56" rx="30" ry="8" fill="none" stroke="#2b2b28" stroke-width="4"/>
   <rect x="44" y="44" width="12" height="20" fill="#b9b3a4"/>
   <ellipse cx="50" cy="36" rx="15" ry="5" fill="#3d5a80"/>
   <circle cx="50" cy="28" r="4" fill="#b9b3a4"/>
   <line x1="50" y1="23" x2="50" y2="16"/>
   <circle cx="46" cy="19" r="1.8" fill="#3d5a80" stroke="none"/>
   <circle cx="54" cy="17" r="1.8" fill="#3d5a80" stroke="none"/>
   ${plate("Fountain", 10)}
   </g>

   <g transform="translate(200,200)" class="building-hit" data-action="casino">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 40 L22 26 L30 40 L38 26 L46 40 L54 26 L62 40 L70 26 L78 40 L86 26 L90 40 Z" fill="#b06a97"/>
   <rect x="18" y="40" width="64" height="26" fill="#a97c53"/>
   <circle cx="50" cy="53" r="10" fill="#f4efe4" stroke="#2b2b28" stroke-width="3"/>
   <circle cx="50" cy="53" r="3" fill="#d1a94e" stroke="none"/>
   <line x1="50" y1="43" x2="50" y2="46"/><line x1="50" y1="60" x2="50" y2="63"/><line x1="40" y1="53" x2="43" y2="53"/><line x1="57" y1="53" x2="60" y2="53"/>
   ${plate("Casino", 10)}
   </g>
   </svg>`;
}
function artCompostGnome(){
   return sceneWrap(`<path d="M50 12 L32 46 L68 46 Z" fill="#b5453f"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><line x1="50" y1="70" x2="50" y2="88"/><line x1="50" y1="76" x2="34" y2="84"/><line x1="50" y1="76" x2="66" y2="84"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -3);
}
function artGnomeFeral(){
   return sceneWrap(`<path d="M50 12 L28 48 L72 48 Z" fill="#5c8a5c"/><circle cx="50" cy="60" r="12" fill="#e0c49a"/><line x1="50" y1="72" x2="50" y2="90"/><line x1="50" y1="78" x2="26" y2="66"/><line x1="26" y1="66" x2="18" y2="52"/><line x1="10" y1="50" x2="26" y2="58"/><line x1="50" y1="78" x2="68" y2="88"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, -8);
}
function artGnomeFishing(){
   return sceneWrap(`<path d="M50 12 L33 44 L67 44 Z" fill="#3d5a80"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="72" y2="58"/><path d="M72 58 Q80 60 78 70" fill="none"/><line x1="50" y1="74" x2="34" y2="84"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 2);
}
function artGnomeSnail(){
   return sceneWrap(`<ellipse cx="50" cy="72" rx="26" ry="14" fill="#b9b3a4"/><circle cx="58" cy="54" r="16" fill="#b9b3a4"/><circle cx="58" cy="54" r="9" fill="#8a8477"/><circle cx="58" cy="54" r="3" fill="#8a8477"/><path d="M50 44 L40 26 L60 26 Z" fill="#b06a97"/><circle cx="50" cy="40" r="8" fill="#e0c49a"/><line x1="30" y1="76" x2="18" y2="70"/><line x1="30" y1="80" x2="18" y2="84"/>`, -2);
}
function artGnomeSergeant(){
   return sceneWrap(`<path d="M50 10 L30 46 L70 46 Z" fill="#d1a94e"/><circle cx="50" cy="58" r="13" fill="#e0c49a"/><circle cx="42" cy="58" r="2" fill="#2b2b28" stroke="none"/><circle cx="58" cy="58" r="2" fill="#2b2b28" stroke="none"/><line x1="50" y1="71" x2="50" y2="90"/><line x1="50" y1="78" x2="32" y2="86"/><line x1="50" y1="78" x2="68" y2="86"/><path d="M42 74 L58 74 L54 82 L46 82 Z" fill="#b5453f"/><line x1="50" y1="90" x2="38" y2="99"/><line x1="50" y1="90" x2="62" y2="99"/>`, 0);
}
function artGnomeCommander(){
   return sceneWrap(`<path d="M28 78 Q50 68 72 78 L66 40 Q50 34 34 40 Z" fill="#b5453f"/><path d="M50 6 L28 44 L72 44 Z" fill="#d1a94e"/><rect x="42" y="8" width="16" height="6" fill="#b06a97"/><circle cx="50" cy="56" r="14" fill="#e0c49a"/><circle cx="41" cy="56" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="59" cy="56" r="2.4" fill="#2b2b28" stroke="none"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="24" y2="70"/><line x1="24" y1="70" x2="16" y2="82"/><line x1="50" y1="76" x2="72" y2="84"/><path d="M42 82 L58 82 L54 92 L46 92 Z" fill="#3d5a80"/><line x1="50" y1="90" x2="38" y2="99"/><line x1="50" y1="90" x2="62" y2="99"/>`, 0);
}
function artSewerRat(){
   return sceneWrap(`<ellipse cx="42" cy="64" rx="26" ry="15" fill="#8a8477"/><circle cx="74" cy="52" r="13" fill="#8a8477"/><circle cx="66" cy="42" r="5" fill="#8a8477"/><circle cx="80" cy="42" r="5" fill="#8a8477"/><circle cx="79" cy="49" r="1.8" fill="#2b2b28" stroke="none"/><line x1="85" y1="52" x2="96" y2="48"/><line x1="85" y1="56" x2="97" y2="58"/><path d="M18 66 Q4 74 10 90" fill="none"/><line x1="30" y1="76" x2="26" y2="88"/><line x1="42" y1="78" x2="42" y2="90"/><line x1="54" y1="76" x2="58" y2="88"/>`, -2);
}
function artRatHelmet(){
   return sceneWrap(`<ellipse cx="42" cy="64" rx="26" ry="15" fill="#a97c53"/><circle cx="74" cy="52" r="13" fill="#a97c53"/><circle cx="66" cy="42" r="5" fill="#a97c53"/><circle cx="80" cy="42" r="5" fill="#a97c53"/><circle cx="79" cy="49" r="1.8" fill="#2b2b28" stroke="none"/><line x1="85" y1="52" x2="96" y2="48"/><line x1="85" y1="56" x2="97" y2="58"/><path d="M18 66 Q4 74 10 90" fill="none"/><line x1="30" y1="76" x2="26" y2="88"/><line x1="42" y1="78" x2="42" y2="90"/><line x1="54" y1="76" x2="58" y2="88"/><path d="M62 40 A13 13 0 0 1 86 40" fill="#b9b3a4"/><path d="M62 40 L64 34 M68 36 L70 30 M74 35 L74 29 M80 36 L82 30 M86 40 L88 34" stroke-width="2.5"/>`, -1);
}
function artGiantSewerRat(){
   return sceneWrap(`<ellipse cx="40" cy="66" rx="30" ry="18" fill="#5f4632"/><circle cx="76" cy="52" r="15" fill="#5f4632"/><circle cx="66" cy="40" r="6" fill="#5f4632"/><circle cx="84" cy="40" r="6" fill="#5f4632"/><circle cx="82" cy="48" r="2.2" fill="#2b2b28" stroke="none"/><line x1="88" y1="52" x2="99" y2="47"/><line x1="88" y1="57" x2="99" y2="60"/><path d="M14 68 Q0 78 6 94" fill="none"/><line x1="26" y1="80" x2="20" y2="94"/><line x1="40" y1="82" x2="40" y2="96"/><line x1="54" y1="80" x2="60" y2="94"/>`, -2);
}
function artRatTrenchcoat(){
   return sceneWrap(`<path d="M30 40 L50 40 L58 92 L22 92 Z" fill="#5f4632"/><line x1="40" y1="46" x2="40" y2="88"/><circle cx="34" cy="30" r="9" fill="#8a8477"/><circle cx="50" cy="26" r="9" fill="#8a8477"/><circle cx="66" cy="32" r="9" fill="#8a8477"/><circle cx="30" cy="27" r="2.5" fill="#8a8477"/><circle cx="38" cy="27" r="2.5" fill="#8a8477"/><circle cx="46" cy="23" r="2.5" fill="#8a8477"/><circle cx="54" cy="23" r="2.5" fill="#8a8477"/><circle cx="62" cy="29" r="2.5" fill="#8a8477"/><circle cx="70" cy="29" r="2.5" fill="#8a8477"/><circle cx="33" cy="30" r="1.4" fill="#2b2b28" stroke="none"/><circle cx="50" cy="26" r="1.4" fill="#2b2b28" stroke="none"/><circle cx="66" cy="32" r="1.4" fill="#2b2b28" stroke="none"/><line x1="26" y1="92" x2="24" y2="98"/><line x1="40" y1="92" x2="40" y2="98"/><line x1="54" y1="92" x2="56" y2="98"/>`, 0);
}
function artQuarryDrone(){
   return sceneWrap(`<rect x="28" y="36" width="44" height="38" fill="#8a8477"/><circle cx="50" cy="30" r="14" fill="#b9b3a4"/><circle cx="44" cy="28" r="3" fill="#2b2b28" stroke="none"/><circle cx="56" cy="28" r="3" fill="#2b2b28" stroke="none"/><path d="M28 44 L14 40 M28 54 L14 58" stroke-width="3"/><path d="M72 44 L86 40 M72 54 L86 58" stroke-width="3"/><line x1="38" y1="74" x2="34" y2="92"/><line x1="62" y1="74" x2="66" y2="92"/><path d="M40 20 L38 8 M60 20 L62 8" stroke-width="3"/>`, -2);
}
function artGnomeSurveyor(){
   return sceneWrap(`<path d="M50 12 L32 42 L68 42 Z" fill="#5c8a5c"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><rect x="30" y="60" width="18" height="14" fill="#f4efe4"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="30" y2="66"/><line x1="50" y1="72" x2="70" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 4);
}
function artPickaxeGolem(){
   return sceneWrap(`<path d="M26 90 Q22 50 50 44 Q78 50 74 90 Z" fill="#5f4632"/><circle cx="50" cy="30" r="15" fill="#8a8477"/><circle cx="44" cy="28" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="56" cy="28" r="2.4" fill="#2b2b28" stroke="none"/><line x1="26" y1="60" x2="10" y2="48"/><path d="M10 48 Q2 40 10 32" fill="none" stroke-width="3"/><line x1="74" y1="60" x2="90" y2="70"/>`, 0);
}
function artQuarryRat(){
   return sceneWrap(`<ellipse cx="42" cy="66" rx="30" ry="17" fill="#5f4632"/><circle cx="76" cy="52" r="14" fill="#5f4632"/><circle cx="67" cy="41" r="5.5" fill="#5f4632"/><circle cx="83" cy="41" r="5.5" fill="#5f4632"/><circle cx="81" cy="49" r="2" fill="#2b2b28" stroke="none"/><line x1="87" y1="53" x2="98" y2="49"/><path d="M16 66 Q2 76 8 92" fill="none"/><circle cx="30" cy="60" r="2.2" fill="#d1a94e" stroke="none"/><circle cx="46" cy="70" r="2.2" fill="#d1a94e" stroke="none"/>`, -2);
}
function artDiggerBot(){
   return sceneWrap(`<rect x="24" y="34" width="52" height="46" fill="#b5453f"/><circle cx="50" cy="26" r="16" fill="#8a8477"/><circle cx="42" cy="24" r="3.4" fill="#2b2b28" stroke="none"/><circle cx="58" cy="24" r="3.4" fill="#2b2b28" stroke="none"/><path d="M50 10 L46 20 M50 10 L54 20" stroke-width="3"/><line x1="24" y1="46" x2="6" y2="36"/><path d="M6 36 L14 20" stroke-width="4"/><line x1="76" y1="46" x2="94" y2="40"/><line x1="34" y1="80" x2="28" y2="98"/><line x1="66" y1="80" x2="72" y2="98"/><path d="M20 60 L14 54 M20 66 L12 64" stroke-width="2.5"/>`, 0);
}
function artVaultWisp(){
   return sceneWrap(`<circle cx="50" cy="46" r="26" fill="#3d5a80"/><circle cx="50" cy="46" r="14" fill="#f4efe4" stroke="none" opacity="0.5"/><circle cx="42" cy="40" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="58" cy="40" r="2.4" fill="#2b2b28" stroke="none"/><path d="M30 20 Q50 4 70 20" fill="none" stroke-width="2.5"/><path d="M24 66 Q50 84 76 66" fill="none" stroke-width="2.5"/>`, 0);
}
function artStoneSentinel(){
   return sceneWrap(`<path d="M50 8 L26 30 L26 88 L74 88 L74 30 Z" fill="#8a8477"/><circle cx="50" cy="40" r="10" fill="#3d5a80"/><circle cx="50" cy="40" r="3.4" fill="#f4efe4" stroke="none"/><line x1="26" y1="56" x2="10" y2="66"/><line x1="74" y1="56" x2="90" y2="66"/><line x1="40" y1="60" x2="40" y2="80"/><line x1="60" y1="60" x2="60" y2="80"/>`, 0);
}
function artHoardRat(){
   return sceneWrap(`<ellipse cx="42" cy="66" rx="28" ry="16" fill="#b06a97"/><circle cx="74" cy="52" r="13" fill="#b06a97"/><circle cx="66" cy="42" r="5" fill="#b06a97"/><circle cx="80" cy="42" r="5" fill="#b06a97"/><circle cx="79" cy="49" r="1.8" fill="#2b2b28" stroke="none"/><line x1="85" y1="52" x2="96" y2="48"/><circle cx="30" cy="72" r="2.2" fill="#d1a94e" stroke="none"/><circle cx="42" cy="78" r="2.2" fill="#d1a94e" stroke="none"/><circle cx="54" cy="72" r="2.2" fill="#d1a94e" stroke="none"/><path d="M18 66 Q4 74 10 90" fill="none"/>`, -2);
}
function artCeremonialArmor(){
   return sceneWrap(`<path d="M34 34 Q50 26 66 34 L64 78 Q50 86 36 78 Z" fill="#b9b3a4"/><path d="M40 28 Q50 18 60 28 L58 36 Q50 32 42 36 Z" fill="#8a8477"/><rect x="44" y="50" width="12" height="4" fill="#2b2b28" stroke="none"/><line x1="34" y1="40" x2="18" y2="56"/><line x1="18" y1="56" x2="24" y2="72"/><line x1="66" y1="40" x2="82" y2="56"/><line x1="82" y1="56" x2="76" y2="72"/><line x1="50" y1="86" x2="42" y2="99"/><line x1="50" y1="86" x2="58" y2="99"/>`, 0);
}
function artGnomeVizier(){
   return sceneWrap(`<path d="M50 10 L30 44 L70 44 Z" fill="#3d5a80"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><rect x="34" y="62" width="14" height="18" fill="#f4efe4"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="34" y2="66"/><line x1="50" y1="74" x2="68" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 2);
}
function artGnomeGuard(){
   return sceneWrap(`<path d="M50 8 L30 42 L70 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="13" fill="#e0c49a"/><rect x="32" y="66" width="36" height="26" fill="#b9b3a4"/><ellipse cx="20" cy="80" rx="10" ry="14" fill="#5f4632"/><line x1="68" y1="70" x2="82" y2="78"/><line x1="50" y1="92" x2="40" y2="99"/><line x1="50" y1="92" x2="60" y2="99"/>`, 0);
}
function artBurrowWorm(){
   return sceneWrap(`<ellipse cx="50" cy="86" rx="30" ry="10" fill="#5f4632"/><path d="M40 86 Q34 60 44 40 Q50 26 60 34 Q68 42 58 52 Q50 60 56 70 Q62 78 54 86" fill="#8a5a3a"/><circle cx="58" cy="34" r="6" fill="#2b2b28"/><circle cx="58" cy="34" r="2" fill="#f4efe4" stroke="none"/>`, -3);
}
function artFeralAutomaton(){
   return sceneWrap(`<rect x="26" y="30" width="48" height="44" fill="#3d5a80"/><circle cx="50" cy="22" r="14" fill="#b9b3a4"/><circle cx="44" cy="20" r="3" fill="#b5453f" stroke="none"/><circle cx="56" cy="20" r="3" fill="#b5453f" stroke="none"/><path d="M26 40 L10 34 M74 40 L90 34" stroke-width="3"/><line x1="38" y1="74" x2="34" y2="94"/><line x1="62" y1="74" x2="66" y2="94"/><path d="M50 8 L47 2 M50 8 L53 2" stroke-width="3"/>`, 0);
}
function artGnomeKing(){
   return sceneWrap(`<path d="M26 84 Q50 72 74 84 L68 38 Q50 30 32 38 Z" fill="#d1a94e"/><path d="M50 4 L30 40 L70 40 Z" fill="#b5453f"/><rect x="40" y="6" width="20" height="8" fill="#f4efe4"/><circle cx="45" cy="10" r="2" fill="#3d5a80" stroke="none"/><circle cx="55" cy="10" r="2" fill="#3d5a80" stroke="none"/><circle cx="50" cy="54" r="15" fill="#e0c49a"/><circle cx="41" cy="54" r="2.6" fill="#2b2b28" stroke="none"/><circle cx="59" cy="54" r="2.6" fill="#2b2b28" stroke="none"/><line x1="50" y1="69" x2="50" y2="90"/><line x1="50" y1="76" x2="20" y2="68"/><line x1="20" y1="68" x2="10" y2="82"/><line x1="50" y1="76" x2="80" y2="82"/><path d="M40 84 L60 84 L56 94 L44 94 Z" fill="#3d5a80"/><line x1="50" y1="90" x2="38" y2="99"/><line x1="50" y1="90" x2="62" y2="99"/>`, 0);
}
function artDefeated(monsterArtFn){
   const inner = monsterArtFn();
   return `<div style="position:relative; display:flex; justify-content:center; align-items:center;">
   <div style="transform:rotate(88deg); filter:grayscale(55%); opacity:0.75;">${inner}</div>
   <svg viewBox="0 0 40 40" style="position:absolute; top:2px; left:18px; width:26px; height:26px;" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" stroke-linecap="round">
   <line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/>
   <line x1="24" y1="4" x2="36" y2="16"/><line x1="36" y1="4" x2="24" y2="16"/>
   </svg>
   <svg viewBox="0 0 30 30" style="position:absolute; bottom:6px; right:8px; width:20px; height:20px;" xmlns="http://www.w3.org/2000/svg" stroke="#a97c53" stroke-width="3" stroke-linecap="round" fill="none">
   <path d="M15 4 L17 12 L25 14 L17 16 L15 24 L13 16 L5 14 L13 12 Z"/>
   </svg>
   </div>`;
}
