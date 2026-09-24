/* ---------------- Mudroot Warren art (Act 2 Part 2, first Mole People hub) ---------------- */
/* New concern, new file — same convention as gnometropolis-art.js.
Loads after art.js/gnometropolis-art.js (index.html) so it can reuse
makeFlag()/plate()/biGet() (art.js) and sceneWrap() (art.js) without
re-authoring any of it a third time.

3 of the 9 tiles are real buildings for this first area — Root Cellar,
Mudflats, and the Bureau — all three real combat districts, per the
user's own explicit correction ("multiple combat zones, not a combat
zone and a recovery zone"). There is no rest tile in this hub at all;
resting happens at Gnometropolis's Camp instead, one Biscuit away
(ZONE_ORDER, content.js). The rest of the 9 are decorative filler — no
data-action, no plate() label — same as Gnometropolis's own remaining
filler tile.

Mudflats is the one tile with a real visual gate on it: it renders as
a second real building ONLY once `tunnelWardenDefeated` is true,
otherwise it renders as a collapsed, dirt-packed tunnel mouth — same
inert-filler treatment as the rest, no plate, no data-action — so
there's nothing on screen marking it as "a door that opens later,"
just a tile that quietly becomes a different tile. travelTo() (town.js)
gates the actual destination the same way, independently, so a player
can't reach it early by clicking around either. The Bureau has no such
gate — it's available from the start, a parallel option alongside Root
Cellar rather than a further step in that same sequence.

The root-wrapped, chained-shut door (translate(200,0)) was a deliberate
foreshadow of a future boss gate — it's now quest10's own gateway to
the Warren's Ear, one hub deeper: it becomes a real clickable tile
(data-action="warrensear") once `warrensEarUnlocked` is true (that's
`state.quest10Path` being set, either rare hunt found first — see
warrensear-content.js), same reveal-not-marker treatment as Mudflats
above; travelTo() gates the real destination independently. */
function artMudrootWarrenSquare(buildingIndicators, mudflatsRevealed, warrensEarUnlocked){
   const bi = (key) => biGet(buildingIndicators, key);
   /* A small root-tangle accent, this area's answer to
   gnometropolis-art.js's mushroom() — ties the filler tiles together as
   "claimed-by-something-that-digs" without needing a full backdrop on
   each one. */
   const roots = (x, y) => `
   <g transform="translate(${x},${y})">
   <path d="M0 0 Q-6 8 -2 16 M0 0 Q6 6 4 15 M0 0 Q0 10 3 18" stroke="#5f4632" stroke-width="2.5" fill="none"/>
   </g>`;
   const mudflatsTile = mudflatsRevealed ? `
   <g transform="translate(100,0)" class="building-hit" data-action="mudflats">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="66" rx="42" ry="20" fill="#5f4632"/>
   <ellipse cx="34" cy="62" rx="10" ry="4" fill="#3d5a80" opacity="0.6"/>
   <ellipse cx="64" cy="70" rx="8" ry="3" fill="#3d5a80" opacity="0.6"/>
   <path d="M20 44 Q24 32 20 20" stroke="#5c8a5c" stroke-width="3" fill="none"/>
   <path d="M76 40 Q80 28 78 16" stroke="#5c8a5c" stroke-width="3" fill="none"/>
   <path d="M40 78 L34 88 M46 80 L44 90 M54 80 L58 90" stroke="#2b2b28" stroke-width="2.5"/>
   ${makeFlag(bi('mudflats').flag)}
   ${plate("The Mudflats")}
   </g>` : `
   <g transform="translate(100,0)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="70" rx="36" ry="16" fill="#5f4632"/>
   <path d="M50 70 Q50 40 50 20" stroke="#2b2b28" stroke-width="10" stroke-dasharray="1,0" opacity="0.5"/>
   <ellipse cx="50" cy="52" rx="20" ry="26" fill="#2b2b28" opacity="0.85"/>
   ${roots(30, 30)}${roots(68, 34)}
   </g>`;
   return `<svg class="town-scene-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="292" height="292" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>

   <g transform="translate(0,0)" class="building-hit" data-action="rootcellar">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 82 L14 46 Q50 26 86 46 L86 82 Z" fill="#5f4632"/>
   <line x1="20" y1="50" x2="20" y2="80"/><line x1="34" y1="46" x2="34" y2="80"/><line x1="50" y1="44" x2="50" y2="80"/><line x1="66" y1="46" x2="66" y2="80"/><line x1="80" y1="50" x2="80" y2="80"/>
   <path d="M40 82 Q42 68 36 58" stroke="#8a5a3a" stroke-width="3" fill="none"/>
   <path d="M62 82 Q60 66 68 56" stroke="#8a5a3a" stroke-width="3" fill="none"/>
   <circle cx="50" cy="64" r="3" fill="#b5453f"/><circle cx="46" cy="70" r="3" fill="#b5453f"/><circle cx="54" cy="70" r="3" fill="#b5453f"/>
   ${roots(12, 20)}
   ${makeFlag(bi('rootcellar').flag)}
   ${plate("The Root Cellar")}
   </g>

   ${mudflatsTile}

   ${warrensEarUnlocked ? `
   <g transform="translate(200,0)" class="building-hit" data-action="warrensear">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <rect x="30" y="26" width="40" height="60" fill="#8a5a3a"/>
   <line x1="36" y1="32" x2="36" y2="80" stroke-width="2"/><line x1="50" y1="30" x2="50" y2="82" stroke-width="2"/><line x1="64" y1="32" x2="64" y2="80" stroke-width="2"/>
   <circle cx="50" cy="58" r="5" fill="#d1a94e" stroke="#2b2b28" stroke-width="2"/>
   ${plate("The Warren's Ear")}
   </g>` : `
   <g transform="translate(200,0)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <rect x="30" y="30" width="40" height="56" fill="#2b2b28"/>
   <line x1="36" y1="36" x2="64" y2="80"/><line x1="64" y1="36" x2="36" y2="80"/>
   <path d="M30 40 Q22 46 26 56 M70 44 Q78 50 74 60 M34 66 Q26 72 30 82 M66 70 Q74 76 70 86" stroke="#5f4632" stroke-width="3" fill="none"/>
   <circle cx="50" cy="58" r="5" fill="#8a8477" stroke="#2b2b28" stroke-width="2"/>
   </g>`}

   <g transform="translate(0,100)" class="building-hit" data-action="bureau">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 46 L50 26 L86 46 L86 82 L14 82 Z" fill="#8a5a3a"/>
   <rect x="30" y="52" width="14" height="14" fill="#f4efe4"/>
   <rect x="56" y="52" width="14" height="14" fill="#f4efe4"/>
   <rect x="24" y="70" width="52" height="12" fill="#5f4632"/>
   <rect x="46" y="18" width="8" height="10" fill="#8a5a3a"/>
   ${roots(10, 22)}
   ${makeFlag(bi('bureau').flag)}
   ${plate("The Bureau")}
   </g>

   <g transform="translate(100,100)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${roots(30, 40)}${roots(50, 60)}${roots(70, 44)}
   <ellipse cx="50" cy="80" rx="30" ry="8" fill="#5f4632" opacity="0.6"/>
   </g>

   <g transform="translate(200,100)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="40" cy="70" rx="16" ry="10" fill="#b06a97"/><circle cx="34" cy="66" r="2" fill="#d1a94e" stroke="none"/><circle cx="46" cy="64" r="2" fill="#d1a94e" stroke="none"/>
   <ellipse cx="66" cy="78" rx="10" ry="6" fill="#b06a97"/>
   ${roots(20, 50)}
   </g>

   <g transform="translate(0,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 60 Q50 40 86 60 L82 82 Q50 92 18 82 Z" fill="#8a8477" opacity="0.6"/>
   ${roots(50, 30)}
   </g>

   <g transform="translate(100,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="76" rx="22" ry="9" fill="#5f4632" opacity="0.7"/>
   ${roots(30, 50)}${roots(66, 52)}
   </g>

   <g transform="translate(200,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="36" cy="72" rx="12" ry="7" fill="#b06a97"/><circle cx="32" cy="68" r="1.6" fill="#d1a94e" stroke="none"/>
   <ellipse cx="58" cy="80" rx="9" ry="5" fill="#b06a97"/>
   ${roots(70, 40)}
   </g>
   </svg>`;
}

/* ---------------- Mudroot Warren district backdrops ---------------- */
/* Same role as artZoneGarrison()/etc. (gnometropolis-art.js) — shown
between fights while exploring. Root Cellar reads as cramped/underground;
Mudflats reads as open, wet, and exposed — a visual step further from
"town" than anything Act 1 or Gnometropolis's own districts show, since
this is meant to feel like genuinely hostile, unclaimed territory. */
function artZoneRootCellar(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.35"/><path d="M0 100 L0 40 Q50 14 100 40 L100 100" fill="none" stroke="#5f4632" stroke-width="6"/><line x1="14" y1="30" x2="14" y2="100"/><line x1="34" y1="20" x2="34" y2="100"/><line x1="50" y1="16" x2="50" y2="100"/><line x1="66" y1="20" x2="66" y2="100"/><line x1="86" y1="30" x2="86" y2="100"/><path d="M20 100 Q26 80 18 62 M80 100 Q74 78 82 58" stroke="#8a5a3a" stroke-width="3" fill="none"/>`, 0);
}
function artZoneMudflats(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.2"/><ellipse cx="50" cy="78" rx="56" ry="20" fill="#5f4632"/><ellipse cx="30" cy="72" rx="12" ry="4" fill="#3d5a80" opacity="0.55"/><ellipse cx="68" cy="80" rx="10" ry="4" fill="#3d5a80" opacity="0.55"/><path d="M14 50 Q18 34 12 18 M86 46 Q82 30 88 14 M50 52 Q54 36 48 20" stroke="#5c8a5c" stroke-width="3" fill="none"/><circle cx="20" cy="94" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="30" cy="96" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="72" cy="95" r="2.4" fill="#2b2b28" stroke="none"/>`, 0);
}
/* The Bureau reads as cramped-office rather than underground-tunnel —
filing cabinets and a counter instead of roots and dirt, the one
Mudroot Warren backdrop that isn't visibly a burrow, matching its own
"business moles" theme. */
function artZoneBureau(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.1"/><rect x="4" y="20" width="18" height="70" fill="#8a5a3a"/><line x1="4" y1="38" x2="22" y2="38"/><line x1="4" y1="56" x2="22" y2="56"/><line x1="4" y1="74" x2="22" y2="74"/><rect x="78" y="14" width="18" height="76" fill="#8a5a3a"/><line x1="78" y1="32" x2="96" y2="32"/><line x1="78" y1="50" x2="96" y2="50"/><line x1="78" y1="68" x2="96" y2="68"/><rect x="34" y="66" width="32" height="24" fill="#5f4632"/><rect x="42" y="50" width="16" height="16" fill="#f4efe4"/>`, 0);
}
