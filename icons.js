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
function iconGuardCleaver(){
     return iconWrap(`<path d="M14 40 L14 16 Q14 10 22 10 L40 10 Q48 10 48 20 L48 34 Q48 40 40 40 Z" fill="#b9b3a4"/><rect x="8" y="38" width="10" height="16" fill="#5f4632"/>`);
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

/* ---------------- Shop tier-3 icons (shopGearItemsTier3 / shopFoodItemsTier3) ---------------- */
function iconHeirloomRod(){
     return iconWrap(`<line x1="18" y1="52" x2="40" y2="14"/><circle cx="42" cy="12" r="7" fill="#d1a94e"/><circle cx="42" cy="12" r="2.5" fill="#b06a97" stroke="none"/>`);
}
function iconHeirloomCleaver(){
     return iconWrap(`<path d="M14 40 L14 16 Q14 10 22 10 L40 10 Q48 10 48 20 L48 34 Q48 40 40 40 Z" fill="#d1a94e"/><rect x="8" y="38" width="10" height="16" fill="#5f4632"/><line x1="16" y1="16" x2="44" y2="14" stroke="#f4efe4" stroke-width="2"/>`);
}
function iconChampionCrown(){
     return iconWrap(`<path d="M12 40 L16 20 L26 32 L30 16 L34 32 L44 20 L48 40 Z" fill="#d1a94e"/><rect x="12" y="40" width="36" height="8" fill="#d1a94e"/><circle cx="30" cy="20" r="2.5" fill="#b06a97" stroke="none"/>`);
}
function iconAdventurerCuirass(){
     return iconWrap(`<path d="M16 14 L44 14 L48 50 L12 50 Z" fill="#8a8477"/><path d="M22 14 L22 50 M38 14 L38 50" stroke-width="2"/><circle cx="30" cy="28" r="6" fill="#d1a94e"/>`);
}
function iconQuickstepTrousers(){
     return iconWrap(`<path d="M20 10 L40 10 L40 24 L34 24 L34 50 L26 50 L26 24 L20 24 Z" fill="#3d5a80"/><line x1="12" y1="30" x2="18" y2="28" stroke-width="2.5"/><line x1="12" y1="38" x2="18" y2="36" stroke-width="2.5"/>`);
}
function iconBlessedBoots(){
     return iconWrap(`<path d="M18 12 L34 12 L34 34 L44 34 L44 48 L18 48 Z" fill="#5c8a5c"/><circle cx="40" cy="20" r="3" fill="#f4efe4" stroke="none"/><path d="M36 14 L40 10 L44 14 L40 18 Z" fill="#f4efe4" stroke="none"/>`);
}
function iconBiscuitTin(){
     return iconWrap(`<rect x="14" y="20" width="32" height="30" fill="#b9b3a4"/><rect x="12" y="14" width="36" height="8" fill="#d1a94e"/><circle cx="30" cy="34" r="10" fill="#a97c53"/><circle cx="26" cy="31" r="1.6" fill="#2b2b28" stroke="none"/><circle cx="34" cy="30" r="1.6" fill="#2b2b28" stroke="none"/><circle cx="30" cy="38" r="1.6" fill="#2b2b28" stroke="none"/>`);
}

/* ---------------- Shop tier-4 icons (shopGearItemsTier4) ---------------- */
function iconThroneScepter(){
     return iconWrap(`<line x1="18" y1="54" x2="38" y2="16"/><circle cx="40" cy="14" r="8" fill="#d1a94e"/><circle cx="40" cy="14" r="3" fill="#b06a97" stroke="none"/><path d="M32 22 L36 18 M44 10 L48 6" stroke-width="2.5"/>`);
}
function iconThroneAxe(){
     return iconWrap(`<line x1="30" y1="10" x2="30" y2="52" stroke-width="5"/><path d="M30 10 Q8 6 6 22 Q8 32 30 26 Z" fill="#d1a94e"/><circle cx="16" cy="18" r="2.2" fill="#b06a97" stroke="none"/>`);
}
function iconStolenCrown(){
     return iconWrap(`<path d="M10 42 L14 18 L24 32 L30 14 L36 32 L46 18 L50 42 Z" fill="#d1a94e"/><rect x="10" y="42" width="40" height="8" fill="#d1a94e"/><circle cx="30" cy="18" r="3" fill="#b06a97" stroke="none"/><circle cx="18" cy="30" r="2" fill="#f4efe4" stroke="none"/><circle cx="42" cy="30" r="2" fill="#f4efe4" stroke="none"/>`);
}
function iconPalaceForgedPlate(){
     return iconWrap(`<path d="M16 14 L44 14 L48 50 L12 50 Z" fill="#8a8477"/><path d="M16 14 L44 14 L46 20 L14 20 Z" fill="#d1a94e" stroke="none"/><path d="M22 20 L22 50 M38 20 L38 50" stroke-width="2"/><circle cx="30" cy="32" r="6" fill="#b06a97"/>`);
}
function iconDressGreaves(){
     return iconWrap(`<path d="M20 10 L40 10 L40 24 L34 24 L34 50 L26 50 L26 24 L20 24 Z" fill="#3d5a80"/><line x1="20" y1="10" x2="40" y2="10" stroke="#d1a94e" stroke-width="3"/><line x1="26" y1="24" x2="26" y2="50" stroke="#d1a94e" stroke-width="2"/><line x1="34" y1="24" x2="34" y2="50" stroke="#d1a94e" stroke-width="2"/>`);
}
function iconStewardBoots(){
     return iconWrap(`<path d="M18 12 L34 12 L34 34 L44 34 L44 48 L18 48 Z" fill="#5f4632"/><rect x="18" y="12" width="16" height="6" fill="#d1a94e" stroke="none"/><circle cx="26" cy="40" r="2" fill="#d1a94e" stroke="none"/><circle cx="34" cy="40" r="2" fill="#d1a94e" stroke="none"/>`);
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

/* Palace-gate gear (content.js's PALACE_GATE_GEAR, quest 7) — one icon
per class-gated item. */
function iconSiegeBreaker(){
     return iconWrap(`<line x1="14" y1="50" x2="38" y2="10"/><rect x="34" y="6" width="14" height="14" fill="#8a8477" transform="rotate(35 41 13)"/>`);
}
function iconGuardUniform(){
     return iconWrap(`<path d="M16 14 L44 14 L48 50 L12 50 Z" fill="#3d5a80"/><path d="M22 14 L30 22 L38 14" fill="none"/><circle cx="30" cy="34" r="2" fill="#d1a94e" stroke="none"/>`);
}
function iconWardedSeal(){
     return iconWrap(`<circle cx="30" cy="30" r="16" fill="#b06a97"/><path d="M30 16 L36 30 L30 44 L24 30 Z" fill="#f4efe4" stroke="none"/>`);
}

/* Gnometropolis district monsters (content.js) — one loot/gearDrop icon
per new monster added to round the Garrison/Rogues' Den/Arcane Sanctum
rosters out to 3 apiece (garrisonGuardian/roguesDenEnforcer/
arcaneSanctumGuardian's own rareDrop/gearDrop icons already existed;
these are for the new regular monsters standing alongside them). */
function iconDrillRoster(){
     return iconWrap(`<rect x="14" y="10" width="32" height="42" fill="#f4efe4"/><rect x="22" y="6" width="16" height="8" fill="#8a8477"/><line x1="20" y1="22" x2="40" y2="22"/><line x1="20" y1="30" x2="40" y2="30"/><line x1="20" y1="38" x2="34" y2="38"/>`);
}
function iconBannerLance(){
     return iconWrap(`<line x1="30" y1="52" x2="30" y2="8"/><path d="M30 10 L48 16 L30 22 Z" fill="#b5453f"/>`);
}
function iconCatapultPeg(){
     return iconWrap(`<path d="M20 10 L40 10 L34 50 L26 50 Z" fill="#8a5a3a"/><line x1="24" y1="20" x2="36" y2="20"/>`);
}
function iconScorchedGreaves(){
     return iconWrap(`<path d="M18 8 L38 8 L38 34 Q46 38 44 50 L16 50 L16 34 Z" fill="#8a8477"/><line x1="22" y1="16" x2="30" y2="24"/><line x1="30" y1="14" x2="24" y2="22"/>`);
}
function iconSpellbookPage(){
     return iconWrap(`<path d="M12 12 Q30 4 48 12 L46 46 Q30 54 14 46 Z" fill="#f4efe4"/><circle cx="30" cy="30" r="6" fill="none" stroke="#b06a97" stroke-width="3"/>`);
}
function iconScorchRobe(){
     return iconWrap(`<path d="M22 8 L38 8 L44 50 L16 50 Z" fill="#b06a97"/><circle cx="30" cy="34" r="5" fill="#2b2b28" opacity="0.4" stroke="none"/>`);
}
function iconFeatherScale(){
     return iconWrap(`<path d="M30 8 Q42 20 34 44 Q30 50 26 44 Q18 20 30 8 Z" fill="#3d5a80"/><line x1="30" y1="12" x2="30" y2="42"/>`);
}
function iconWardedSlippers(){
     return iconWrap(`<path d="M14 40 Q14 26 30 26 Q46 26 46 40 Q46 48 30 48 Q14 48 14 40 Z" fill="#b06a97"/><circle cx="30" cy="36" r="5" fill="#d1a94e" stroke="none"/>`);
}
function iconCoinPurse(){
     return iconWrap(`<path d="M18 26 Q18 14 30 14 Q42 14 42 26 L42 44 Q42 52 30 52 Q18 52 18 44 Z" fill="#5f4632"/><line x1="20" y1="26" x2="40" y2="26"/>`);
}
function iconCutpurseLeggings(){
     return iconWrap(`<path d="M20 8 L40 8 L40 30 L46 50 L36 50 L30 32 L24 50 L14 50 L20 30 Z" fill="#2b2b28"/>`);
}

/* Class-exclusive buff spells (content.js's spells[], classRequired) —
one icon per class, same fixed palette as everything above. */
function iconAdrenalineRush(){
     return iconWrap(`<circle cx="28" cy="36" r="14" fill="#b5453f"/><path d="M34 8 L22 28 L30 28 L24 48" fill="none" stroke="#d1a94e" stroke-width="4"/>`);
}
function iconLoadedDice(){
     return iconWrap(`<rect x="9" y="24" width="20" height="20" fill="#b06a97" transform="rotate(-8 19 34)"/><rect x="29" y="15" width="20" height="20" fill="#3d5a80" transform="rotate(8 39 25)"/><circle cx="17" cy="32" r="2" fill="#f4efe4" stroke="none"/><circle cx="23" cy="38" r="2" fill="#f4efe4" stroke="none"/><circle cx="35" cy="21" r="2" fill="#f4efe4" stroke="none"/><circle cx="41" cy="27" r="2" fill="#f4efe4" stroke="none"/><circle cx="38" cy="21" r="2" fill="#f4efe4" stroke="none"/>`);
}
function iconArcaneFocus(){
     return iconWrap(`<circle cx="30" cy="30" r="16" fill="#3d5a80"/><path d="M30 14 L38 30 L30 46 L22 30 Z" fill="#d1a94e"/><circle cx="30" cy="30" r="4" fill="#f4efe4" stroke="none"/>`);
}
function iconShout(){
     return iconWrap(`<path d="M18 20 Q30 8 42 20 L42 40 Q30 52 18 40 Z" fill="#b5453f"/><path d="M46 16 Q56 24 46 32" fill="none" stroke-width="3"/><path d="M48 10 Q62 24 48 38" fill="none" stroke-width="2.5"/>`);
}

