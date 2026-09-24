/* ---------------- The Warren's Ear art (Act 2, quest10) ---------------- */
/* New concern, new file — mirrors mudroot-art.js's own role, one hub
deeper. Loads after art.js/mudroot-art.js so it can reuse makeFlag()/
plate()/biGet()/sceneWrap() (art.js) without re-authoring any of it a
third time.

Both of the Warren's Ear's two tiles are real combat districts — Choir
and the Ledger Vault — but each renders as an inert filler (no
data-action, no plate label) until its OWN rare hunt is defeated
(tunnelMoleInformant/seniorClerk, warrensear-content.js): whichever the
player finds FIRST sets quest10Path and reveals that district
immediately; the other stays hidden until its own hunt is separately
cleared. Same "tile quietly becomes a different tile, no marker
pointing at it" mechanism Mudflats already uses (mudroot-art.js) —
travelTo() (town.js) gates the actual destinations the same way,
independently. Only a 2-tile hub (no rest tile, no third district) — a
tighter grid than Mudroot Warren's own 3x3, since there's nothing else
here yet. */
function artWarrensEarSquare(choirRevealed, ledgerVaultRevealed){
   const choirTile = choirRevealed ? `
   <g transform="translate(0,0)" class="building-hit" data-action="choir">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M20 82 Q20 40 50 30 Q80 40 80 82 Z" fill="#5f4632"/>
   <circle cx="50" cy="52" r="10" fill="#2b2b28" opacity="0.6"/>
   <path d="M30 70 Q40 60 50 70 Q60 60 70 70" fill="none" stroke="#d1a94e" stroke-width="2.5" opacity="0.7"/>
   <path d="M34 78 Q42 70 50 78 Q58 70 66 78" fill="none" stroke="#d1a94e" stroke-width="2" opacity="0.5"/>
   ${plate("The Choir")}
   </g>` : `
   <g transform="translate(0,0)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="70" rx="34" ry="16" fill="#5f4632"/>
   <ellipse cx="50" cy="54" rx="18" ry="24" fill="#2b2b28" opacity="0.85"/>
   </g>`;
   const ledgerVaultTile = ledgerVaultRevealed ? `
   <g transform="translate(100,0)" class="building-hit" data-action="ledgervault">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <rect x="22" y="34" width="56" height="50" fill="#8a5a3a"/>
   <line x1="30" y1="42" x2="70" y2="42" stroke-width="2"/><line x1="30" y1="50" x2="70" y2="50" stroke-width="2"/>
   <line x1="30" y1="58" x2="70" y2="58" stroke-width="2"/><line x1="30" y1="66" x2="70" y2="66" stroke-width="2"/>
   <line x1="30" y1="74" x2="70" y2="74" stroke-width="2"/>
   <rect x="42" y="18" width="16" height="18" fill="#8a5a3a"/>
   ${plate("The Ledger Vault")}
   </g>` : `
   <g transform="translate(100,0)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="70" rx="34" ry="16" fill="#5f4632"/>
   <ellipse cx="50" cy="54" rx="18" ry="24" fill="#2b2b28" opacity="0.85"/>
   </g>`;
   return `<svg class="town-scene-svg" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="192" height="92" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>
   ${choirTile}
   ${ledgerVaultTile}
   </svg>`;
}

/* ---------------- The Warren's Ear district backdrops ---------------- */
function artZoneChoir(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.3"/><path d="M10 100 Q10 40 50 26 Q90 40 90 100" fill="none" stroke="#5f4632" stroke-width="6"/><circle cx="50" cy="55" r="8" fill="#2b2b28" opacity="0.6"/><path d="M25 80 Q37 68 50 80 Q63 68 75 80" fill="none" stroke="#d1a94e" stroke-width="2.5" opacity="0.6"/><path d="M20 92 Q34 78 50 92 Q66 78 80 92" fill="none" stroke="#d1a94e" stroke-width="2" opacity="0.4"/>`, 0);
}
function artZoneLedgerVault(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.12"/><rect x="10" y="16" width="80" height="76" fill="#8a5a3a" opacity="0.5"/><line x1="18" y1="30" x2="82" y2="30" stroke-width="2"/><line x1="18" y1="42" x2="82" y2="42" stroke-width="2"/><line x1="18" y1="54" x2="82" y2="54" stroke-width="2"/><line x1="18" y1="66" x2="82" y2="66" stroke-width="2"/><line x1="18" y1="78" x2="82" y2="78" stroke-width="2"/><rect x="40" y="4" width="20" height="14" fill="#8a5a3a"/>`, 0);
}
