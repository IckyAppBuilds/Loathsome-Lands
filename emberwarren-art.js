/* ---------------- The Ember Warren art (Act 2, quest11) ---------------- */
/* New concern, new file — mirrors warrensear-art.js's own role, one hub
deeper still. Loads after art.js/warrensear-art.js so it can reuse
makeFlag()/plate()/biGet()/sceneWrap() (art.js) without re-authoring
any of it a third time.

Unlike the Warren's Ear (which hides each district behind its own
rare-hunt reveal), both the Foundry and the Gearworks are real,
clickable districts from the very start — hub-level access is already
gated by quest11Complete via travelTo() (town.js), so there's no need
for a SECOND layer of per-tile gating on either of them.

A THIRD tile was added on top of that original 2-tile grid (widened
from 200x100 to 300x100) for quest16's own capstone reveal — same
reveal-not-marker mechanism as every hub before this one (Mudroot
Warren's rockpile becoming the Ember Warren's own door, mudroot-art.js):
inert crystalline filler, embedded in the rock but not yet broken
through, until state.quest16Complete flips it into a real
data-action="crystalcity" tile. Angular/blue-purple rather than the
brown mole-vocabulary the other two tiles use, on purpose — the same
"this reads as somewhere new" signal artCrystalSentinel's own comment
(art.js) uses. */
function artEmberWarrenSquare(crystalBreachRevealed){
   return `<svg class="town-scene-svg" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="292" height="92" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>
   <g transform="translate(0,0)" class="building-hit" data-action="foundry">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M18 84 L18 40 Q50 24 82 40 L82 84 Z" fill="#5f4632"/>
   <path d="M50 20 Q58 8 50 -2 Q42 8 50 20" fill="none" stroke="#b5453f" stroke-width="3" opacity="0.7" transform="translate(0,14)"/>
   <circle cx="38" cy="60" r="3" fill="#b5453f" stroke="none"/>
   <circle cx="60" cy="68" r="2.4" fill="#d1a94e" stroke="none"/>
   ${plate("The Foundry")}
   </g>
   <g transform="translate(100,0)" class="building-hit" data-action="gearworks">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <rect x="24" y="36" width="52" height="48" fill="#8a8477"/>
   <circle cx="50" cy="30" r="14" fill="none" stroke="#d1a94e" stroke-width="3"/>
   <circle cx="50" cy="30" r="5" fill="#d1a94e" stroke="none"/>
   <line x1="50" y1="14" x2="50" y2="19" stroke="#d1a94e" stroke-width="2.5"/>
   <line x1="50" y1="41" x2="50" y2="46" stroke="#d1a94e" stroke-width="2.5"/>
   <line x1="34" y1="30" x2="39" y2="30" stroke="#d1a94e" stroke-width="2.5"/>
   <line x1="61" y1="30" x2="66" y2="30" stroke="#d1a94e" stroke-width="2.5"/>
   ${plate("The Gearworks")}
   </g>
   ${crystalBreachRevealed ? `
   <g transform="translate(200,0)" class="building-hit" data-action="crystalcity">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M50 14 L76 42 L64 88 L36 88 L24 42 Z" fill="#3d5a80"/>
   <path d="M50 14 L76 42 L50 46 Z" fill="#f4efe4" opacity="0.5"/>
   <circle cx="50" cy="46" r="4" fill="#d1a94e" stroke="none"/>
   ${plate("The Crystal City")}
   </g>` : `
   <g transform="translate(200,0)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M50 30 L68 52 L58 78 L42 78 L32 52 Z" fill="#8a8477" opacity="0.5"/>
   <circle cx="50" cy="54" r="2.4" fill="#3d5a80" opacity="0.6" stroke="none"/>
   </g>`}
   </svg>`;
}

/* ---------------- The Ember Warren district backdrops ---------------- */
function artZoneFoundry(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#b5453f" opacity="0.1"/><path d="M8 100 L8 46 Q50 20 92 46 L92 100" fill="none" stroke="#5f4632" stroke-width="6"/><path d="M50 16 Q60 2 50 -12 Q40 2 50 16" fill="none" stroke="#b5453f" stroke-width="3" opacity="0.7" transform="translate(0,20)"/><circle cx="30" cy="66" r="3" fill="#b5453f" stroke="none"/><circle cx="66" cy="72" r="2.4" fill="#d1a94e" stroke="none"/><circle cx="46" cy="80" r="2" fill="#b5453f" stroke="none"/>`, 0);
}
function artZoneGearworks(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.1"/><rect x="14" y="30" width="72" height="62" fill="#8a8477" opacity="0.6"/><circle cx="50" cy="24" r="16" fill="none" stroke="#d1a94e" stroke-width="3"/><circle cx="50" cy="24" r="6" fill="#d1a94e" stroke="none"/><line x1="50" y1="6" x2="50" y2="12" stroke="#d1a94e" stroke-width="2.5"/><line x1="50" y1="36" x2="50" y2="42" stroke="#d1a94e" stroke-width="2.5"/><line x1="30" y1="24" x2="36" y2="24" stroke="#d1a94e" stroke-width="2.5"/><line x1="64" y1="24" x2="70" y2="24" stroke="#d1a94e" stroke-width="2.5"/><line x1="26" y1="50" x2="74" y2="50" stroke-width="2"/><line x1="26" y1="64" x2="74" y2="64" stroke-width="2"/>`, 0);
}
