/* ---------------- Gnometropolis art (Act 2 town hub) ---------------- */
/* New concern (Gnometropolis-as-a-town rework) — gets its own file per
the project's "new concern gets a new file" convention (AGENTS.md)
rather than growing art.js, which was already 500+ lines. Loads right
after art.js (index.html) since content.js references some of this
file's functions by value, same load-order reason art.js itself loads
before content.js.

Shares makeFlag()/makeBountyBadge()/makeTrialIcon()/plate()/biGet()
(art.js — extracted from artTownSquare() specifically so this file could
reuse them instead of re-authoring the same badge/plate SVG a second
time).

Palette matches the rest of the game (styles.css's --black/--white/
--grey/--grey-dark/--red/--blue/--yellow/--green/--magenta/--tan) but
leans into scrap-metal grey/tan and mushroom magenta/yellow rather than
Gladstone Hollow's cottage-warm red/yellow — Gnometropolis is a capital
built out of repurposed junk, not a village. */

/* One {flag} slot per real building tile (garrison/roguesden/sanctum/
palace/camp/gnomeguild/gnomeshop/gnometownlot) — see render.js's
isGnometropolis branch for how these get set. Simpler than
artTownSquare()'s buildingIndicators (no trial slot — there's no
class-trial building here) but same biGet() shape so a future addition
is just adding a badge call, not a signature change. campCooldownText
mirrors artTownSquare()'s innCooldownText param — non-null while
restAtCamp()'s CAMP_COOLDOWN_MS is still counting down (see render.js).
gnomeLotTier drives the Town Lot tile's own 4-stage art, same idea as
artTownSquare()'s lotTier param but for state.gnomeLotTier instead.

quest7Complete gates the Guild/Shop/Town Lot tiles specifically — all
three already refuse to actually open before then (enterGnomeGuild()/
enterGnomeShop()/enterGnomeTownLot(), guild.js/gnometropolis.js, each
"gate at the door" on state.quest7Complete), but the tiles themselves
used to render as real, inviting building-hit tiles regardless, so a
player could see "The Guild"/"The Shop"/"Reclaimed Vault" fully drawn
and plated well before the gnome king fight actually opens any of
them, and clicking would silently do nothing. Same reveal-not-marker
treatment Mudflats/the Warren's Ear door already use elsewhere in Act
2 (mudroot-art.js): before quest7Complete these three fall back to
plain decorative filler — no class, no data-action, no plate — same
mushroom-cluster look the genuinely-empty tile at (100,200) already
uses, so a locked building simply looks like nothing is there yet
rather than looking like a door that won't open. */
function artGnometropolisSquare(buildingIndicators, campCooldownText, gnomeLotTier, quest7Complete){
   const bi = (key) => biGet(buildingIndicators, key);
   /* Small mushroom-cap accent (ellipse-on-a-stalk) — the one recurring
   motif tying the tiles together as "underground gnome capital" without
   needing a literal cave backdrop on every one. */
   const mushroom = (x, y) => `
   <g transform="translate(${x},${y})">
   <line x1="0" y1="7" x2="0" y2="0" stroke-width="2"/>
   <ellipse cx="0" cy="-3" rx="5" ry="3" fill="#b06a97"/>
   <circle cx="-2" cy="-4" r="1" fill="#d1a94e" stroke="none"/>
   <circle cx="2" cy="-2" r="1" fill="#d1a94e" stroke="none"/>
   </g>`;
   /* Same dimming clock-face overlay as artTownSquare()'s innCooldown
   (art.js) — copied rather than shared since it's a small, self-
   contained SVG block and the two files don't otherwise share any
   per-tile overlay helper. */
   const campCooldown = !campCooldownText ? '' : `
   <g class="inn-cooldown-overlay">
   <rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.45"/>
   <circle cx="50" cy="46" r="15" fill="#3d5a80" stroke="#2b2b28" stroke-width="2.5"/>
   <line x1="50" y1="46" x2="50" y2="37" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
   <line x1="50" y1="46" x2="57" y2="46" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
   <text x="50" y="76" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="12" font-weight="700" fill="#f4efe4" stroke="none" id="camp-cooldown-text">${campCooldownText}</text>
   </g>`;
   return `<svg class="town-scene-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="292" height="292" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>

   <g transform="translate(0,0)" class="building-hit" data-action="garrison">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 42 Q50 24 86 42 L86 68 Q50 78 14 68 Z" fill="#8a8477"/>
   <rect x="30" y="42" width="40" height="24" fill="#b9b3a4"/>
   <line x1="36" y1="42" x2="36" y2="66"/><line x1="44" y1="42" x2="44" y2="66"/><line x1="56" y1="42" x2="56" y2="66"/><line x1="64" y1="42" x2="64" y2="66"/>
   <path d="M20 44 L14 30 L26 36 Z" fill="#b9b3a4"/><path d="M80 44 L86 30 L74 36 Z" fill="#b9b3a4"/>
   <circle cx="20" cy="52" r="4" fill="#d1a94e" stroke="#2b2b28" stroke-width="1.6"/>
   <circle cx="80" cy="52" r="4" fill="#d1a94e" stroke="#2b2b28" stroke-width="1.6"/>
   ${mushroom(10, 82)}
   ${makeFlag(bi('garrison').flag)}
   ${plate("The Garrison")}
   </g>

   <g transform="translate(100,0)" class="building-hit" data-action="palace">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M16 46 L50 16 L84 46 Z" fill="#d1a94e"/>
   <rect x="24" y="46" width="52" height="30" fill="#a97c53"/>
   <path d="M38 76 L38 54 Q50 44 62 54 L62 76 Z" fill="#2b2b28"/>
   <path d="M42 50 L46 42 L50 48 L54 42 L58 50 Z" fill="#d1a94e"/>
   ${mushroom(90, 20)}
   ${makeFlag(bi('palace').flag)}
   ${plate("The Palace")}
   </g>

   <g transform="translate(200,0)" class="building-hit" data-action="sanctum">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M40 18 L50 4 L60 18 Z" fill="#b06a97"/>
   <rect x="38" y="18" width="24" height="48" fill="#3d5a80"/>
   <circle cx="50" cy="66" r="16" fill="#d1a94e" opacity="0.3"/>
   <circle cx="50" cy="66" r="9" fill="none" stroke-width="2" opacity="0.6"/>
   <circle cx="50" cy="66" r="3.5" fill="#d1a94e" stroke="none"/>
   ${mushroom(14, 20)}
   ${makeFlag(bi('sanctum').flag)}
   ${plate("The Arcane Sanctum")}
   </g>

   <g transform="translate(0,100)" class="building-hit" data-action="roguesden">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M16 46 L48 24 L84 42 L80 70 Q50 82 20 70 Z" fill="#2b2b28"/>
   <path d="M38 46 Q50 42 62 46 L60 74 Q50 80 40 74 Z" fill="#b06a97"/>
   <rect x="24" y="56" width="8" height="8" fill="#f4efe4" transform="rotate(-8 28 60)"/>
   <circle cx="28" cy="60" r="1.4" fill="#b5453f" stroke="none"/>
   <rect x="66" y="54" width="9" height="9" fill="#f4efe4" transform="rotate(10 70 58)"/>
   <circle cx="70" cy="58" r="1.4" fill="#b5453f" stroke="none"/><circle cx="72" cy="61" r="1.4" fill="#b5453f" stroke="none"/>
   ${mushroom(90, 80)}
   ${makeFlag(bi('roguesden').flag)}
   ${plate("The Rogues' Den")}
   </g>

   <g transform="translate(100,100)" class="building-hit" data-action="camp">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M30 82 L50 48 L70 82 Z" fill="#5f4632"/>
   <rect x="42" y="70" width="16" height="12" fill="#2b2b28" stroke="none"/>
   <ellipse cx="76" cy="86" rx="14" ry="5" fill="#8a5a3a"/>
   <circle cx="76" cy="78" r="8" fill="#b5453f"/>
   <path d="M72 74 Q76 64 80 74" fill="none" stroke="#d1a94e" stroke-width="2.5"/>
   <circle cx="76" cy="76" r="3" fill="#d1a94e" stroke="none"/>
   ${mushroom(14, 26)}
   ${makeFlag(bi('camp').flag)}
   ${plate("The Camp")}
   ${campCooldown}
   </g>

   ${quest7Complete ? `
   <g transform="translate(200,100)" class="building-hit" data-action="gnomeguild">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M18 44 L18 36 L28 36 L28 44 L36 44 L36 36 L44 36 L44 44 L56 44 L56 36 L64 36 L64 44 L72 44 L72 36 L80 36 L80 44 Z" fill="#8a8477"/>
   <rect x="18" y="44" width="62" height="30" fill="#b9b3a4"/>
   <rect x="42" y="58" width="16" height="16" fill="#5f4632"/>
   <line x1="50" y1="36" x2="50" y2="14"/>
   <path d="M50 14 L68 20 L50 26 Z" fill="#d1a94e"/>
   ${makeFlag(bi('gnomeguild').flag)}
   ${plate("The Guild")}
   </g>` : `
   <g transform="translate(200,100)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${mushroom(30, 78)}${mushroom(68, 84)}${mushroom(50, 66)}
   </g>`}

   ${quest7Complete ? `
   <g transform="translate(0,200)" class="building-hit" data-action="gnomeshop">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M16 50 L50 26 L84 50 Z" fill="#d1a94e"/>
   <rect x="20" y="50" width="60" height="34" fill="#8a8477"/>
   <rect x="30" y="58" width="14" height="14" fill="#5f4632"/>
   <rect x="56" y="58" width="14" height="14" fill="#5f4632"/>
   <circle cx="37" cy="65" r="2" fill="#d1a94e" stroke="none"/>
   <circle cx="63" cy="65" r="2" fill="#d1a94e" stroke="none"/>
   ${makeFlag(bi('gnomeshop').flag)}
   ${plate("The Shop")}
   </g>` : `
   <g transform="translate(0,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${mushroom(30, 80)}${mushroom(64, 70)}${mushroom(50, 88)}
   </g>`}

   <g transform="translate(100,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <line x1="35" y1="80" x2="35" y2="60" stroke-width="3"/><ellipse cx="35" cy="55" rx="14" ry="8" fill="#b06a97"/><circle cx="30" cy="52" r="2" fill="#d1a94e" stroke="none"/><circle cx="40" cy="50" r="2" fill="#d1a94e" stroke="none"/>
   <line x1="62" y1="82" x2="62" y2="66" stroke-width="2.5"/><ellipse cx="62" cy="62" rx="10" ry="6" fill="#b06a97"/><circle cx="59" cy="60" r="1.6" fill="#d1a94e" stroke="none"/>
   <line x1="78" y1="80" x2="78" y2="70" stroke-width="2"/><ellipse cx="78" cy="67" rx="7" ry="4" fill="#b06a97"/>
   </g>

   ${quest7Complete ? `
   <g transform="translate(200,200)" class="building-hit" data-action="gnometownlot">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${gnomeLotTier===0 ? `
   <rect x="20" y="46" width="60" height="10" fill="#8a5a3a" stroke-dasharray="5,4"/>
   <rect x="26" y="56" width="48" height="26" fill="#5f4632" stroke-dasharray="5,4"/>
   <line x1="30" y1="60" x2="70" y2="78"/><line x1="70" y1="60" x2="30" y2="78"/>
   ` : gnomeLotTier===1 ? `
   <rect x="20" y="46" width="60" height="10" fill="#8a5a3a"/>
   <rect x="26" y="56" width="48" height="26" fill="#5f4632"/>
   <rect x="46" y="40" width="8" height="10" fill="#8a5a3a"/>
   ` : gnomeLotTier===2 ? `
   <path d="M16 50 L50 26 L84 50 Z" fill="#d1a94e"/>
   <rect x="20" y="50" width="60" height="34" fill="#8a8477"/>
   <rect x="42" y="60" width="16" height="24" fill="#5f4632"/>
   ` : `
   <path d="M12 46 L50 14 L88 46 Z" fill="#d1a94e"/>
   <rect x="18" y="46" width="64" height="38" fill="#b9b3a4"/>
   <rect x="42" y="56" width="16" height="28" fill="#5f4632"/>
   <rect x="26" y="52" width="8" height="8" fill="#f4efe4"/>
   <rect x="66" y="52" width="8" height="8" fill="#f4efe4"/>
   `}
   ${makeFlag(bi('gnometownlot').flag)}
   ${plate(gnomeLotTier===0 ? 'Shuttered Stall' : (gnomeLotTier>=3 ? "The Regent's Hall" : 'Reclaimed Vault'))}
   </g>` : `
   <g transform="translate(200,200)">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   ${mushroom(30, 84)}${mushroom(66, 78)}${mushroom(50, 60)}
   </g>`}
   </svg>`;
}

/* ---------------- Act 2 district backdrop art ---------------- */
/* Same role as artZoneCommons()/artZoneSewers()/etc. (art.js) — shown
between fights in place of artIdle() while exploring a district
(goAdventuring(), combat.js). No difficulty escalation between these
three the way Act 1's zones escalate (all 3 districts share
ZONE_DIFFICULTY's same 2.3x multiplier, content.js); each just gets its
own mood matching its class/guardian motif instead. */
function artZoneGarrison(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.15"/><rect x="0" y="0" width="16" height="100" fill="#8a8477"/><rect x="84" y="0" width="16" height="100" fill="#8a8477"/><path d="M16 100 L16 30 Q50 10 84 30 L84 100" fill="none" stroke="#8a8477" stroke-width="6"/><line x1="20" y1="20" x2="20" y2="42"/><circle cx="20" cy="18" r="4" fill="#d1a94e"/><line x1="80" y1="20" x2="80" y2="42"/><circle cx="80" cy="18" r="4" fill="#d1a94e"/><rect x="40" y="58" width="10" height="32" fill="#b9b3a4"/><rect x="52" y="58" width="10" height="32" fill="#b9b3a4"/><line x1="45" y1="58" x2="45" y2="90"/><line x1="57" y1="58" x2="57" y2="90"/>`, 0);
}
function artZoneRoguesden(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.3"/><rect x="10" y="40" width="34" height="24" fill="#3d5a80" transform="rotate(-2 27 52)"/><circle cx="20" cy="50" r="2" fill="#f4efe4" stroke="none"/><circle cx="30" cy="54" r="2" fill="#f4efe4" stroke="none"/><rect x="56" y="44" width="30" height="20" fill="#5f4632" transform="rotate(3 71 54)"/><rect x="62" y="48" width="8" height="8" fill="#f4efe4"/><rect x="74" y="50" width="8" height="8" fill="#f4efe4"/><path d="M0 20 Q50 4 100 20" fill="none" stroke-width="2" opacity="0.5"/>`, 0);
}
function artZoneSanctum(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.1"/><circle cx="50" cy="70" r="26" fill="#d1a94e" opacity="0.22"/><circle cx="50" cy="70" r="18" fill="none" stroke-width="2" opacity="0.55"/><circle cx="50" cy="70" r="6" fill="#d1a94e" stroke="none"/><rect x="6" y="20" width="14" height="36" fill="#5f4632"/><rect x="80" y="14" width="14" height="42" fill="#5f4632"/><path d="M8 22 L18 22 M8 30 L18 30 M8 38 L18 38" stroke-width="2"/><path d="M82 16 L92 16 M82 24 L92 24 M82 32 L92 32" stroke-width="2"/>`, 0);
}
/* The palace gate itself — not an ADVENTURE_ZONES entry (no random
encounters here, just approachPalaceGate(), guild.js), so this is shown
once and stays static rather than alternating like the district scenes
above. Gaudier than every other backdrop on purpose — scavenged-gold
flourishes, a crown silhouette glimpsed above the bars, matching
gnomeKing's own "throned in scavenged gold" flavor (content.js). */
function artPalaceGate(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.15"/><path d="M10 96 L10 30 Q50 4 90 30 L90 96" fill="none" stroke="#d1a94e" stroke-width="7"/><rect x="24" y="40" width="52" height="56" fill="#2b2b28"/><line x1="30" y1="40" x2="30" y2="96"/><line x1="38" y1="40" x2="38" y2="96"/><line x1="62" y1="40" x2="62" y2="96"/><line x1="70" y1="40" x2="70" y2="96"/><path d="M42 30 L50 16 L58 30 Z" fill="#d1a94e"/><circle cx="50" cy="22" r="2" fill="#b5453f" stroke="none"/><circle cx="20" cy="20" r="3" fill="#d1a94e" stroke="none"/><circle cx="80" cy="20" r="3" fill="#d1a94e" stroke="none"/>`, 0);
}
