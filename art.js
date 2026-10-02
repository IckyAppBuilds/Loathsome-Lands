/* ---------------- Monster + player scene art ---------------- */
function sceneWrap(inner, rot){
     return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(${rot||0}deg)">${inner}</svg>`;
}
function artIdle(){
     return sceneWrap(`<circle cx="50" cy="26" r="13" fill="#d1a94e"/><line x1="50" y1="39" x2="50" y2="68"/><line x1="50" y1="48" x2="32" y2="58"/><line x1="50" y1="48" x2="68" y2="58"/><line x1="50" y1="68" x2="36" y2="92"/><line x1="50" y1="68" x2="64" y2="92"/>`, 0);
}
/* Player-portrait art for the three renamed classes (CLASS_TITLES,
content.js) — same #char-portrait slot as artIdle, so same head-and-limb
scale; each just exaggerates one silly detail instead of redesigning
the whole silhouette. Bulwark keeps artIdle (out of scope). */
function artMeathead(){
     return sceneWrap(`<path d="M12 44 Q50 26 88 44 L72 78 Q50 84 28 78 Z" fill="#d1a94e"/><circle cx="14" cy="48" r="13" fill="#e0c49a"/><circle cx="86" cy="48" r="13" fill="#e0c49a"/><circle cx="50" cy="20" r="8" fill="#e0c49a"/><line x1="14" y1="61" x2="8" y2="78"/><line x1="86" y1="61" x2="92" y2="78"/><line x1="50" y1="80" x2="38" y2="98"/><line x1="50" y1="80" x2="62" y2="98"/>`, 0);
}
function artCardShark(){
     return sceneWrap(`<circle cx="50" cy="26" r="12" fill="#e0c49a"/><rect x="39" y="22" width="9" height="5" rx="1" fill="#2b2b28" stroke="none"/><rect x="52" y="22" width="9" height="5" rx="1" fill="#2b2b28" stroke="none"/><line x1="48" y1="24" x2="52" y2="24"/><path d="M36 40 Q50 34 64 40 L62 78 Q50 84 38 78 Z" fill="#2b2b28"/><path d="M46 40 L54 40 L52 54 L48 54 Z" fill="#b5453f"/><line x1="36" y1="44" x2="20" y2="56"/><line x1="20" y1="56" x2="26" y2="70"/><line x1="64" y1="44" x2="78" y2="52"/><rect x="72" y="46" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(-18 77 54)"/><rect x="76" y="44" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(2 81 52)"/><rect x="80" y="47" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(20 85 55)"/><line x1="50" y1="84" x2="42" y2="99"/><line x1="50" y1="84" x2="58" y2="99"/>`, 0);
}
function artHexpert(){
     return sceneWrap(`<path d="M36 20 L50 2 L64 20 Z" fill="#b06a97"/><line x1="32" y1="20" x2="68" y2="20"/><circle cx="50" cy="28" r="11" fill="#e0c49a"/><path d="M34 38 Q50 32 66 38 L64 80 Q50 86 36 80 Z" fill="#b06a97"/><line x1="34" y1="42" x2="20" y2="54"/><line x1="66" y1="42" x2="76" y2="54"/><circle cx="76" cy="60" r="8" fill="none" stroke-width="2" opacity="0.55"/><circle cx="76" cy="60" r="4" fill="#d1a94e" stroke="none"/><line x1="50" y1="86" x2="42" y2="99"/><line x1="50" y1="86" x2="58" y2="99"/>`, 0);
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
/* No NPC here, unlike the other building-interior art above — the
Fountain's Notice Board is just a corkboard with pinned notes, so the
close-up scene is the board itself. */
function artNoticeBoard(){
     return sceneWrap(`<rect x="16" y="14" width="68" height="72" fill="#8a8477"/><rect x="22" y="20" width="56" height="60" fill="#a97c53"/><rect x="30" y="26" width="22" height="14" fill="#f4efe4" transform="rotate(-4 41 33)"/><rect x="54" y="30" width="20" height="13" fill="#f4efe4" transform="rotate(3 64 36)"/><rect x="28" y="46" width="20" height="13" fill="#f4efe4" transform="rotate(2 38 52)"/><rect x="52" y="50" width="22" height="14" fill="#f4efe4" transform="rotate(-3 63 57)"/><rect x="34" y="66" width="18" height="12" fill="#f4efe4" transform="rotate(4 43 72)"/><circle cx="41" cy="30" r="1.8" fill="#b5453f" stroke="none"/><circle cx="64" cy="33" r="1.8" fill="#b5453f" stroke="none"/><circle cx="38" cy="49" r="1.8" fill="#b5453f" stroke="none"/><circle cx="63" cy="53" r="1.8" fill="#b5453f" stroke="none"/><circle cx="43" cy="69" r="1.8" fill="#b5453f" stroke="none"/>`, 0);
}
function artHoodooDoctor(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M40 20 Q50 8 60 20" fill="none" stroke-width="3"/><path d="M34 36 Q50 28 66 36 L64 78 Q50 84 36 78 Z" fill="#b06a97"/><circle cx="30" cy="50" r="5" fill="#8a8477"/><circle cx="30" cy="50" r="1.8" fill="#2b2b28" stroke="none"/><line x1="30" y1="55" x2="30" y2="62"/><line x1="34" y1="40" x2="18" y2="54"/><line x1="18" y1="54" x2="24" y2="68"/><line x1="66" y1="40" x2="82" y2="50"/><path d="M82 50 Q90 46 88 38" fill="none" stroke-width="2.5"/><line x1="50" y1="84" x2="42" y2="99"/><line x1="50" y1="84" x2="58" y2="99"/>`, 0);
}
function artTinker(){
     return sceneWrap(`<circle cx="50" cy="24" r="12" fill="#e0c49a"/><path d="M36 18 L64 18 L62 24 L38 24 Z" fill="#8a8477"/><rect x="34" y="36" width="32" height="42" fill="#3d5a80"/><circle cx="42" cy="50" r="6" fill="#d1a94e"/><circle cx="42" cy="50" r="2" fill="#2b2b28" stroke="none"/><rect x="54" y="46" width="10" height="10" fill="#b9b3a4"/><line x1="34" y1="40" x2="18" y2="52"/><path d="M18 52 Q10 52 12 44" fill="none" stroke-width="2.5"/><line x1="66" y1="40" x2="80" y2="48"/><line x1="50" y1="78" x2="42" y2="98"/><line x1="50" y1="78" x2="58" y2="98"/>`, 0);
}

/* Shared town-tile helpers — used by artTownSquare() below and by
artGnometropolisSquare() (gnometropolis-art.js), extracted here (instead
of staying as local consts inside artTownSquare()) so a second town
doesn't need to duplicate ~80 lines of badge/plate SVG that would drift
out of sync. */

/* buildingIndicators is one object per building tile, keyed by its
data-action, each an optional {flag, bounty, trial} — see makeFlag()/
makeBountyBadge()/makeTrialIcon() below for what each one means. Every
building calls all three uniformly (biGet() just returns {} for a key
with nothing set, so each helper's own `!show` guard renders nothing)
rather than only the buildings that currently use one having a slot for
it — a future 4th indicator, or a bounty/trial moving to a different
building, is then just a matter of the render.js caller passing that
key, not a signature change here. */
function biGet(buildingIndicators, key){ return (buildingIndicators && buildingIndicators[key]) || {}; }

/* Building-upgrade decoration -- layers progressively more small detail
shapes onto a building's FIXED base art as its real
state.buildingUpgrades[key] level (0..BUILDING_UPGRADE_MAX, content.js)
rises 0->3, same additive-overlay principle as makeFlag()/bountyShield/
innCooldown below (never redraws or removes the base art, only adds on
top). `layers` is one small SVG-string block per level (index 0 = level
1's addition, index 1 = level 2's, index 2 = level 3's); concatenating
the first N gives level N's cumulative decoration. */
function decorLayers(level, layers){
   let out = '';
   for(let i = 0; i < Math.min(level, layers.length); i++) out += layers[i];
   return out;
}
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
/* Separate from makeFlag()'s quest-! / turn-in-? — a bounty being ready
isn't a quest state (see isBountyReady(), guild.js). Sits in the opposite
top corner from makeFlag so both can show on the same tile without
overlapping. Glow via a soft pulsing halo circle behind a solid shield
shape, rather than quest-flag's bob, so the two read as distinct kinds
of "something's ready here." */
const makeBountyBadge = (show) => !show ? '' : `
<g class="bounty-ready-shield">
<circle cx="82" cy="16" r="12" fill="#d1a94e" opacity="0.45"/>
<path d="M82 7 L91 10.5 L91 17 Q91 25 82 29 Q73 25 73 17 L73 10.5 Z" fill="#3d5a80" stroke="#2b2b28" stroke-width="2.5"/>
<path d="M78 17.5 L81 20.5 L87 13" fill="none" stroke="#f4efe4" stroke-width="2.5"/>
</g>`;
/* A class-trial fight (startClassTrialGuild/Casino/Hoodoo, guild.js) is
available and not yet passed at this specific building — separate from
both indicators above, so it gets the third corner (top-left) rather
than overlapping either. */
const makeTrialIcon = (show) => !show ? '' : `
<g class="trial-ready-icon">
<circle cx="18" cy="16" r="9" fill="#b5453f" stroke="#2b2b28" stroke-width="3"/>
<line x1="13" y1="11" x2="23" y2="21" stroke="#f4efe4" stroke-width="2.2" stroke-linecap="round"/>
<line x1="23" y1="11" x2="13" y2="21" stroke="#f4efe4" stroke-width="2.2" stroke-linecap="round"/>
<line x1="15" y1="13" x2="17.5" y2="10.5" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
<line x1="21" y1="13" x2="18.5" y2="10.5" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
</g>`;
/* One uniform font-size for every building label — was 6-10 depending on
the building, purely to dodge overflow on longer names ("Tinker's
Workshop" vs "Casino"), which made otherwise-identical labels read as
inconsistent from one building to the next. 7 is the largest size that
still comfortably fits the longest label ("Tinker's Workshop", ~75px
measured) inside this plate's fixed 88px width — verified across every
label, not just that one. */
const plate = (label) => `
<rect x="6" y="76" width="88" height="18" fill="#f4efe4" stroke="#2b2b28" stroke-width="2"/>
<text x="50" y="89" text-anchor="middle" class="building-label" fill="#2b2b28" stroke="none">${label}</text>`;

function artTownSquare(buildingIndicators, lotTier, innCooldownText, buildingUpgrades){
   const bi = (key) => biGet(buildingIndicators, key);
   const bu = buildingUpgrades || {};
   const gafferDecor = decorLayers(bu.gaffer || 0, [
      /* lvl1: planter box under the window */
      `<rect x="29" y="67" width="16" height="6" fill="#5f4632"/><circle cx="32" cy="66" r="2" fill="#b5453f" stroke="none"/><circle cx="37" cy="65" r="2" fill="#d1a94e" stroke="none"/><circle cx="42" cy="66" r="2" fill="#b06a97" stroke="none"/>`,
      /* lvl2: second planter by the door + a tidied roofline highlight */
      `<rect x="55" y="67" width="16" height="6" fill="#5f4632"/><circle cx="58" cy="66" r="2" fill="#b5453f" stroke="none"/><circle cx="63" cy="65" r="2" fill="#d1a94e" stroke="none"/><circle cx="68" cy="66" r="2" fill="#b06a97" stroke="none"/><line x1="18" y1="34" x2="82" y2="34" stroke="#f4efe4" stroke-width="1.5"/>`,
      /* lvl3: a little garden fence around the base */
      `<path d="M20 75 L20 72 M30 75 L30 72 M50 75 L50 72 M70 75 L70 72 M80 75 L80 72" stroke="#a97c53" stroke-width="2"/><line x1="18" y1="75" x2="82" y2="75" stroke="#a97c53" stroke-width="2"/>`
   ]);
   const hoodooDecor = decorLayers(bu.hoodoo || 0, [
      /* lvl1: a hanging charm/talisman left of the door */
      `<line x1="40" y1="38" x2="40" y2="48"/><path d="M40 46 L44 51 L40 56 L36 51 Z" fill="#d1a94e"/>`,
      /* lvl2: a second charm right of the door + a faint magic-glow wisp */
      `<line x1="60" y1="38" x2="60" y2="48"/><path d="M60 46 L64 51 L60 56 L56 51 Z" fill="#d1a94e"/><circle cx="50" cy="26" r="9" fill="#b06a97" opacity="0.25"/>`,
      /* lvl3: the glow gets bigger/brighter + a third charm above the door */
      `<circle cx="50" cy="26" r="14" fill="#d1a94e" opacity="0.3"/><line x1="50" y1="40" x2="50" y2="49"/><path d="M50 47 L54 52 L50 57 L46 52 Z" fill="#d1a94e"/>`
   ]);
   const innDecor = decorLayers(bu.inn || 0, [
      /* lvl1: a lit window (warm glow over the left window) */
      `<rect x="32" y="42" width="8" height="8" fill="#d1a94e" opacity="0.7"/><circle cx="36" cy="46" r="7" fill="#d1a94e" opacity="0.25"/>`,
      /* lvl2: a second lit window + a hanging placard under the sign */
      `<rect x="60" y="42" width="8" height="8" fill="#d1a94e" opacity="0.7"/><circle cx="64" cy="46" r="7" fill="#d1a94e" opacity="0.25"/><rect x="4" y="33" width="12" height="7" fill="#f4efe4"/>`,
      /* lvl3: a small chimney with smoke wisps */
      `<rect x="64" y="18" width="8" height="12" fill="#5f4632"/><path d="M68 16 Q72 10 68 5" stroke-width="2" opacity="0.6"/><path d="M70 12 Q74 7 71 2" stroke-width="1.5" opacity="0.4"/>`
   ]);
   const tinkerDecor = decorLayers(bu.tinker || 0, [
      /* lvl1: a small gear hanging on the exterior, left of the big gear-window */
      `<circle cx="31" cy="58" r="5" fill="#d1a94e" stroke="#2b2b28" stroke-width="2"/><circle cx="31" cy="58" r="1.6" fill="#2b2b28" stroke="none"/><line x1="31" y1="52" x2="31" y2="55"/><line x1="31" y1="61" x2="31" y2="64"/>`,
      /* lvl2: a second gear on the right + a smokestack on the roof */
      `<circle cx="69" cy="58" r="5" fill="#d1a94e" stroke="#2b2b28" stroke-width="2"/><circle cx="69" cy="58" r="1.6" fill="#2b2b28" stroke="none"/><line x1="69" y1="52" x2="69" y2="55"/><line x1="69" y1="61" x2="69" y2="64"/><rect x="68" y="14" width="7" height="20" fill="#5f4632"/>`,
      /* lvl3: steam puffs from the smokestack */
      `<circle cx="71" cy="12" r="3" fill="#b9b3a4" opacity="0.5"/><circle cx="74" cy="7" r="4" fill="#b9b3a4" opacity="0.4"/><circle cx="69" cy="6" r="2.5" fill="#b9b3a4" opacity="0.35"/>`
   ]);
   const shopDecor = decorLayers(bu.shop || 0, [
      /* lvl1: a striped awning over the display window */
      `<rect x="26" y="49" width="48" height="6" fill="#b5453f"/><rect x="34" y="49" width="8" height="6" fill="#f4efe4"/><rect x="58" y="49" width="8" height="6" fill="#f4efe4"/>`,
      /* lvl2: more goods on display in the window */
      `<rect x="33" y="61" width="4" height="4" fill="#d1a94e"/><rect x="48" y="61" width="4" height="4" fill="#b5453f"/><rect x="63" y="61" width="4" height="4" fill="#5c8a5c"/>`,
      /* lvl3: a gold trim on the awning + an "OPEN" sign */
      `<rect x="26" y="47" width="48" height="2" fill="#d1a94e"/><rect x="43" y="68" width="14" height="6" fill="#f4efe4"/><text x="50" y="73" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="5" font-weight="700" fill="#5c8a5c" stroke="none">OPEN</text>`
   ]);
   const guildDecor = decorLayers(bu.guild || 0, [
      /* lvl1: a second banner/pennant */
      `<line x1="30" y1="34" x2="30" y2="16"/><path d="M30 16 L16 21 L30 26 Z" fill="#b5453f"/>`,
      /* lvl2: a third banner + a torch/lantern by the door */
      `<line x1="18" y1="34" x2="18" y2="20"/><path d="M18 20 L6 24 L18 28 Z" fill="#5c8a5c"/><line x1="62" y1="56" x2="62" y2="66"/><path d="M62 50 Q66 53 62 56 Q58 53 62 50 Z" fill="#d1a94e"/>`,
      /* lvl3: gold trim/crest upgrade on the original banner */
      `<line x1="50" y1="12" x2="50" y2="24" stroke="#d1a94e" stroke-width="1.5"/><circle cx="58" cy="18" r="3" fill="#d1a94e" stroke="#2b2b28" stroke-width="1.5"/>`
   ]);
   const casinoDecor = decorLayers(bu.casino || 0, [
      /* lvl1: string lights along the marquee */
      `<circle cx="24" cy="40" r="1.8" fill="#d1a94e" stroke="none"/><circle cx="38" cy="40" r="1.8" fill="#d1a94e" stroke="none"/><circle cx="62" cy="40" r="1.8" fill="#d1a94e" stroke="none"/><circle cx="76" cy="40" r="1.8" fill="#d1a94e" stroke="none"/>`,
      /* lvl2: the wheel gets colored betting segments (a real spinning-wheel motif) */
      `<path d="M50 53 L50 43 A10 10 0 0 1 58.7 48 Z" fill="#b5453f" opacity="0.85"/><path d="M50 53 L50 63 A10 10 0 0 1 41.3 58 Z" fill="#5c8a5c" opacity="0.85"/>`,
      /* lvl3: gold trim makes it the most lavish building in town */
      `<rect x="18" y="40" width="64" height="26" fill="none" stroke="#d1a94e" stroke-width="2"/><circle cx="50" cy="24" r="3" fill="#d1a94e" stroke="#2b2b28" stroke-width="1.5"/>`
   ]);
   /* Inn cooldown overlay — dims the whole tile (unlike the flag/shield
   badges above, which sit on top of a fully-usable building) since
   clicking during cooldown does nothing but log a "not yet" message.
   The clock face's hands are two short lines from the center; the
   countdown text gets a stable id so updateInnCooldownDisplay() (town.js)
   can tick it down every second without regenerating this whole SVG. */
   const innCooldown = !innCooldownText ? '' : `
   <g class="inn-cooldown-overlay">
   <rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.45"/>
   <circle cx="50" cy="46" r="15" fill="#3d5a80" stroke="#2b2b28" stroke-width="2.5"/>
   <line x1="50" y1="46" x2="50" y2="37" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
   <line x1="50" y1="46" x2="57" y2="46" stroke="#f4efe4" stroke-width="2" stroke-linecap="round"/>
   <text x="50" y="76" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="12" font-weight="700" fill="#f4efe4" stroke="none" id="inn-cooldown-text">${innCooldownText}</text>
   </g>`;
   return `<svg class="town-scene-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" stroke="#2b2b28" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <rect x="4" y="4" width="292" height="292" fill="none" stroke="#2b2b28" stroke-width="9" stroke-dasharray="17,4" stroke-linecap="butt" stroke-linejoin="miter"/>

   <g transform="translate(0,0)" class="building-hit" data-action="gaffer">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M18 34 L50 22 L82 34 Z" fill="#b5453f"/>
   <rect x="27" y="34" width="46" height="32" fill="#a97c53"/>
   <rect x="42" y="50" width="16" height="16" fill="#5f4632"/>
   <rect x="32" y="40" width="9" height="9" fill="#f4efe4"/>
   <line x1="36" y1="40" x2="36" y2="49"/><line x1="32" y1="44" x2="41" y2="44"/>
   ${gafferDecor}
   ${makeFlag(bi('gaffer').flag)}
   ${makeBountyBadge(bi('gaffer').bounty)}
   ${makeTrialIcon(bi('gaffer').trial)}
   ${plate("Gaffer's Cottage")}
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
   ${hoodooDecor}
   ${makeFlag(bi('hoodoo').flag)}
   ${makeBountyBadge(bi('hoodoo').bounty)}
   ${makeTrialIcon(bi('hoodoo').trial)}
   ${plate("Hoodoo Doctor")}
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
   ${innDecor}
   ${makeFlag(bi('rest').flag)}
   ${makeBountyBadge(bi('rest').bounty)}
   ${makeTrialIcon(bi('rest').trial)}
   ${plate("The Inn")}
   ${innCooldown}
   </g>

   <g transform="translate(0,100)" class="building-hit" data-action="tinker">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M22 34 L50 22 L78 34 Z" fill="#8a8477"/>
   <rect x="28" y="34" width="44" height="32" fill="#3d5a80"/>
   <circle cx="50" cy="50" r="9" fill="#d1a94e"/>
   <circle cx="50" cy="50" r="3" fill="#2b2b28" stroke="none"/>
   <rect x="34" y="40" width="8" height="8" fill="#f4efe4"/>
   <rect x="58" y="40" width="8" height="8" fill="#f4efe4"/>
   ${tinkerDecor}
   ${makeFlag(bi('tinker').flag)}
   ${makeBountyBadge(bi('tinker').bounty)}
   ${makeTrialIcon(bi('tinker').trial)}
   ${plate("Tinker's Workshop")}
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
   ${makeFlag(bi('townlot').flag)}
   ${makeBountyBadge(bi('townlot').bounty)}
   ${makeTrialIcon(bi('townlot').trial)}
   ${plate(lotTier===0 ? 'Empty Lot' : (lotTier>=3 ? 'Town Hall' : 'Town Lot'))}
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
   ${shopDecor}
   ${makeFlag(bi('shop').flag)}
   ${makeBountyBadge(bi('shop').bounty)}
   ${makeTrialIcon(bi('shop').trial)}
   ${plate("The Shop")}
   </g>

   <g transform="translate(0,200)" class="building-hit" data-action="guild">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M20 42 L20 34 L28 34 L28 42 L36 42 L36 34 L44 34 L44 42 L56 42 L56 34 L64 34 L64 42 L72 42 L72 34 L80 34 L80 42 Z" fill="#8a8477"/>
   <rect x="20" y="42" width="60" height="30" fill="#b9b3a4"/>
   <rect x="42" y="56" width="16" height="16" fill="#5f4632"/>
   <line x1="50" y1="34" x2="50" y2="12"/>
   <path d="M50 12 L68 18 L50 24 Z" fill="#3d5a80"/>
   ${guildDecor}
   ${makeFlag(bi('guild').flag)}
   ${makeBountyBadge(bi('guild').bounty)}
   ${makeTrialIcon(bi('guild').trial)}
   ${plate("The Guild")}
   </g>

   <g transform="translate(100,100)" class="building-hit" data-action="fountain">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <ellipse cx="50" cy="62" rx="28" ry="10" fill="#3d5a80"/>
   <ellipse cx="50" cy="56" rx="30" ry="8" fill="none" stroke="#2b2b28" stroke-width="4"/>
   <rect x="44" y="44" width="12" height="20" fill="#b9b3a4"/>
   <ellipse cx="50" cy="36" rx="15" ry="5" fill="#3d5a80"/>
   <circle cx="50" cy="28" r="4" fill="#b9b3a4"/>
   <line x1="50" y1="23" x2="50" y2="16"/>
   <circle cx="46" cy="19" r="1.8" fill="#3d5a80" stroke="none"/>
   <circle cx="54" cy="17" r="1.8" fill="#3d5a80" stroke="none"/>
   <rect x="70" y="46" width="20" height="24" fill="#8a8477"/>
   <rect x="73" y="49" width="14" height="9" fill="#f4efe4" transform="rotate(-3 80 53.5)"/>
   <rect x="74" y="60" width="13" height="8" fill="#f4efe4" transform="rotate(2 80.5 64)"/>
   <circle cx="80" cy="53.5" r="1.3" fill="#b5453f" stroke="none"/>
   <circle cx="80.5" cy="64" r="1.3" fill="#b5453f" stroke="none"/>
   ${makeFlag(bi('fountain').flag)}
   ${makeBountyBadge(bi('fountain').bounty)}
   ${makeTrialIcon(bi('fountain').trial)}
   ${plate("Fountain")}
   </g>

   <g transform="translate(200,200)" class="building-hit" data-action="casino">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 40 L22 26 L30 40 L38 26 L46 40 L54 26 L62 40 L70 26 L78 40 L86 26 L90 40 Z" fill="#b06a97"/>
   <rect x="18" y="40" width="64" height="26" fill="#a97c53"/>
   <circle cx="50" cy="53" r="10" fill="#f4efe4" stroke="#2b2b28" stroke-width="3"/>
   <circle cx="50" cy="53" r="3" fill="#d1a94e" stroke="none"/>
   <line x1="50" y1="43" x2="50" y2="46"/><line x1="50" y1="60" x2="50" y2="63"/><line x1="40" y1="53" x2="43" y2="53"/><line x1="57" y1="53" x2="60" y2="53"/>
   ${casinoDecor}
   ${makeFlag(bi('casino').flag)}
   ${makeBountyBadge(bi('casino').bounty)}
   ${makeTrialIcon(bi('casino').trial)}
   ${plate("Casino")}
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
/* Commons' own gap-filling pass (10 more regulars, per a later explicit
request that every zone's gearDrop set cover all 5 slots, class-free
before Gnometropolis) — same triangle-hat/circle-head/line-limb gnome
template every Commons monster above already uses, just a new hat
shape/color and pose per monster, same as the existing 5 already vary
from each other. */
function artGnomeBeekeeper(){
   return sceneWrap(`<ellipse cx="50" cy="30" rx="18" ry="14" fill="#f4efe4" opacity="0.5"/><path d="M50 14 L34 44 L66 44 Z" fill="#f4efe4"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="30" y2="68"/><line x1="50" y1="74" x2="70" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/><circle cx="26" cy="64" r="2" fill="#d1a94e" stroke="none"/><circle cx="20" cy="58" r="2" fill="#d1a94e" stroke="none"/>`, 2);
}
function artGnomeScarecrow(){
   return sceneWrap(`<line x1="50" y1="14" x2="50" y2="92" stroke-width="4"/><line x1="24" y1="40" x2="76" y2="40" stroke-width="4"/><path d="M50 14 L32 36 L68 36 Z" fill="#a97c53"/><circle cx="50" cy="52" r="11" fill="#e0c49a"/><circle cx="44" cy="52" r="1.8" fill="#2b2b28" stroke="none"/><circle cx="56" cy="52" r="1.8" fill="#2b2b28" stroke="none"/><line x1="24" y1="40" x2="16" y2="30"/><line x1="76" y1="40" x2="84" y2="30"/><line x1="50" y1="92" x2="38" y2="99"/><line x1="50" y1="92" x2="62" y2="99"/>`, 0);
}
function artGnomePlumber(){
   return sceneWrap(`<path d="M50 14 L30 42 L70 42 Z" fill="#3d5a80"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="68" y2="60"/><rect x="64" y="52" width="6" height="16" fill="#8a8477" transform="rotate(30 67 60)"/><line x1="50" y1="72" x2="32" y2="84"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -2);
}
function artGnomeHerald(){
   return sceneWrap(`<path d="M50 8 L28 42 L72 42 Z" fill="#b06a97"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><path d="M50 66 L50 80 Q62 78 64 90 Q50 86 50 90" fill="#f4efe4"/><line x1="50" y1="66" x2="32" y2="76"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, 1);
}
function artGnomeTailor(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#5c8a5c"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="68" y2="68"/><circle cx="70" cy="66" r="2" fill="#d1a94e" stroke="none"/><circle cx="74" cy="70" r="2" fill="#d1a94e" stroke="none"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -1);
}
function artGnomeDuelist(){
   return sceneWrap(`<path d="M50 10 L34 42 L66 42 Z" fill="#2b2b28"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="76" y2="58"/><line x1="76" y1="58" x2="86" y2="52"/><line x1="50" y1="72" x2="34" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="64" y2="96"/>`, -3);
}
function artGnomeLibrarian(){
   return sceneWrap(`<path d="M50 12 L34 44 L66 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><rect x="38" y="50" width="24" height="5" fill="#2b2b28"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="80"/><line x1="50" y1="74" x2="68" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeWeathervaneKeeper(){
   return sceneWrap(`<path d="M50 10 L36 40 L64 40 Z" fill="#d1a94e"/><circle cx="50" cy="52" r="12" fill="#e0c49a"/><line x1="50" y1="64" x2="50" y2="86"/><line x1="50" y1="30" x2="50" y2="10"/><path d="M50 10 L58 16 L50 22 L42 16 Z" fill="#8a8477"/><line x1="50" y1="70" x2="30" y2="62"/><line x1="50" y1="70" x2="70" y2="78"/><line x1="50" y1="86" x2="40" y2="97"/><line x1="50" y1="86" x2="60" y2="97"/>`, 0);
}
function artGnomeForager(){
   return sceneWrap(`<path d="M50 14 L32 46 L68 46 Z" fill="#b06a97" opacity="0.8"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="30" y2="70"/><ellipse cx="24" cy="68" rx="5" ry="7" fill="#5c8a5c"/><line x1="50" y1="76" x2="68" y2="84"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, 2);
}
function artGnomeFortuneTeller(){
   return sceneWrap(`<path d="M50 10 L30 42 L70 42 Z" fill="#3d5a80" opacity="0.85"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><circle cx="50" cy="78" r="9" fill="#f4efe4" opacity="0.5"/><line x1="50" y1="66" x2="50" y2="72"/><line x1="50" y1="72" x2="36" y2="78"/><line x1="50" y1="72" x2="64" y2="78"/><line x1="50" y1="87" x2="40" y2="98"/><line x1="50" y1="87" x2="60" y2="98"/>`, 0);
}
/* Boss pass (rare:true, content.js) — bigger and more menacing than the
regular Commons roster, not just a recolor: a low-opacity red aura disc
drawn first (behind everything, same halo technique as
bounty-ready-shield/artHexpert's charm glow below), and a cape/shoulder
span that crowds the viewBox edges instead of sitting well inside it. */
function artGnomeCommander(){
   return sceneWrap(`<circle cx="50" cy="54" r="46" fill="#b5453f" opacity="0.3"/><path d="M8 88 Q50 72 92 88 L80 34 Q50 26 20 34 Z" fill="#b5453f"/><path d="M50 2 L18 46 L82 46 Z" fill="#d1a94e"/><rect x="38" y="6" width="24" height="7" fill="#b06a97"/><circle cx="50" cy="58" r="16" fill="#e0c49a"/><circle cx="40" cy="58" r="2.8" fill="#2b2b28" stroke="none"/><circle cx="60" cy="58" r="2.8" fill="#2b2b28" stroke="none"/><line x1="50" y1="74" x2="50" y2="92"/><line x1="50" y1="80" x2="14" y2="72"/><line x1="14" y1="72" x2="4" y2="88"/><line x1="50" y1="80" x2="86" y2="90"/><path d="M40 86 L60 86 L55 98 L45 98 Z" fill="#3d5a80"/><line x1="50" y1="92" x2="36" y2="99"/><line x1="50" y1="92" x2="64" y2="99"/>`, 0);
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
/* Same gap-filling pass as Commons' own above — 11 more Sewers
regulars, same rat-silhouette vocabulary (artSewerRat's own ellipse-
body/circle-head/ear-circle formula) every Sewers monster already
uses, varied body size/color and accent detail per monster. */
function artSewerBrawlerRat(){
   return sceneWrap(`<ellipse cx="46" cy="64" rx="28" ry="17" fill="#8a8477"/><circle cx="76" cy="52" r="13" fill="#8a8477"/><circle cx="68" cy="42" r="5" fill="#8a8477"/><circle cx="82" cy="42" r="5" fill="#8a8477"/><circle cx="81" cy="49" r="1.8" fill="#2b2b28" stroke="none"/><line x1="22" y1="58" x2="10" y2="48" stroke-width="3"/><line x1="22" y1="68" x2="10" y2="72" stroke-width="3"/><line x1="34" y1="78" x2="30" y2="90"/><line x1="46" y1="80" x2="46" y2="92"/><line x1="58" y1="78" x2="62" y2="90"/>`, -2);
}
function artDrainpipeCrawler(){
   return sceneWrap(`<ellipse cx="42" cy="62" rx="24" ry="14" fill="#5f4632"/><circle cx="72" cy="50" r="12" fill="#5f4632"/><circle cx="65" cy="41" r="4.5" fill="#5f4632"/><circle cx="78" cy="41" r="4.5" fill="#5f4632"/><circle cx="76" cy="47" r="1.6" fill="#2b2b28" stroke="none"/><path d="M16 62 Q4 68 8 82" fill="none"/><line x1="26" y1="74" x2="18" y2="90" stroke-width="3"/><line x1="40" y1="76" x2="36" y2="92" stroke-width="3"/><line x1="54" y1="74" x2="56" y2="90" stroke-width="3"/>`, 0);
}
function artMuckStriderRat(){
   return sceneWrap(`<ellipse cx="44" cy="64" rx="24" ry="14" fill="#8a8477" opacity="0.85"/><ellipse cx="44" cy="64" rx="24" ry="14" fill="#5f4632" opacity="0.3"/><circle cx="72" cy="52" r="12" fill="#8a8477"/><circle cx="65" cy="43" r="4.5" fill="#8a8477"/><circle cx="78" cy="43" r="4.5" fill="#8a8477"/><circle cx="76" cy="49" r="1.6" fill="#2b2b28" stroke="none"/><line x1="30" y1="76" x2="26" y2="90"/><line x1="44" y1="78" x2="44" y2="92"/><line x1="58" y1="76" x2="60" y2="90"/>`, 1);
}
function artRustFangedRat(){
   return sceneWrap(`<ellipse cx="42" cy="62" rx="26" ry="15" fill="#8a8477"/><circle cx="74" cy="50" r="13" fill="#8a8477"/><circle cx="66" cy="40" r="5" fill="#8a8477"/><circle cx="80" cy="40" r="5" fill="#8a8477"/><path d="M68 54 L70 60 M76 54 L78 60" stroke="#f4efe4" stroke-width="2"/><circle cx="79" cy="47" r="1.8" fill="#2b2b28" stroke="none"/><line x1="28" y1="74" x2="24" y2="88"/><line x1="42" y1="76" x2="42" y2="90"/><line x1="56" y1="74" x2="60" y2="88"/>`, -1);
}
function artShadowSlickRat(){
   return sceneWrap(`<ellipse cx="42" cy="62" rx="22" ry="13" fill="#2b2b28" opacity="0.8"/><circle cx="70" cy="50" r="11" fill="#2b2b28" opacity="0.8"/><circle cx="63" cy="41" r="4" fill="#2b2b28" opacity="0.8"/><circle cx="76" cy="41" r="4" fill="#2b2b28" opacity="0.8"/><circle cx="74" cy="47" r="1.6" fill="#d1a94e" stroke="none"/><path d="M18 62 Q6 56 10 44" fill="none"/><line x1="28" y1="72" x2="24" y2="86"/><line x1="42" y1="74" x2="42" y2="88"/><line x1="54" y1="72" x2="58" y2="86"/>`, 0);
}
function artQuickPawsRat(){
   return sceneWrap(`<ellipse cx="44" cy="62" rx="22" ry="13" fill="#8a8477"/><circle cx="70" cy="50" r="11" fill="#8a8477"/><circle cx="63" cy="41" r="4" fill="#8a8477"/><circle cx="76" cy="41" r="4" fill="#8a8477"/><circle cx="74" cy="47" r="1.6" fill="#2b2b28" stroke="none"/><line x1="30" y1="72" x2="20" y2="80"/><line x1="44" y1="74" x2="44" y2="90"/><line x1="56" y1="72" x2="66" y2="80"/>`, 3);
}
function artGrateRunnerRat(){
   return sceneWrap(`<ellipse cx="42" cy="64" rx="24" ry="14" fill="#8a8477"/><circle cx="70" cy="52" r="12" fill="#8a8477"/><circle cx="63" cy="43" r="4.5" fill="#8a8477"/><circle cx="76" cy="43" r="4.5" fill="#8a8477"/><circle cx="74" cy="49" r="1.6" fill="#2b2b28" stroke="none"/><path d="M22 54 L8 52 M22 60 L8 64" stroke-width="2.5"/><line x1="28" y1="76" x2="22" y2="92" stroke-width="3"/><line x1="42" y1="78" x2="42" y2="92" stroke-width="3"/><line x1="56" y1="76" x2="60" y2="92" stroke-width="3"/>`, -1);
}
function artScrapBladeRat(){
   return sceneWrap(`<ellipse cx="42" cy="62" rx="22" ry="13" fill="#8a8477"/><circle cx="68" cy="50" r="11" fill="#8a8477"/><circle cx="61" cy="41" r="4" fill="#8a8477"/><circle cx="74" cy="41" r="4" fill="#8a8477"/><circle cx="72" cy="47" r="1.6" fill="#2b2b28" stroke="none"/><path d="M22 58 L8 54 L10 62 Z" fill="#b9b3a4"/><line x1="28" y1="72" x2="24" y2="86"/><line x1="42" y1="74" x2="42" y2="88"/><line x1="54" y1="72" x2="58" y2="86"/>`, 0);
}
function artSewerSoothsayerRat(){
   return sceneWrap(`<ellipse cx="44" cy="64" rx="22" ry="13" fill="#8a8477" opacity="0.7"/><circle cx="70" cy="52" r="11" fill="#8a8477" opacity="0.7"/><circle cx="63" cy="43" r="4" fill="#8a8477" opacity="0.7"/><circle cx="76" cy="43" r="4" fill="#8a8477" opacity="0.7"/><circle cx="74" cy="49" r="1.6" fill="#b06a97" stroke="none"/><path d="M90 50 Q96 56 90 62" fill="none" stroke="#b06a97" stroke-width="2"/><line x1="30" y1="74" x2="26" y2="88"/><line x1="44" y1="76" x2="44" y2="90"/><line x1="58" y1="74" x2="62" y2="88"/>`, 1);
}
function artGlowMossRat(){
   return sceneWrap(`<ellipse cx="42" cy="62" rx="26" ry="15" fill="#5c8a5c" opacity="0.8"/><circle cx="74" cy="50" r="13" fill="#5c8a5c" opacity="0.8"/><circle cx="66" cy="40" r="5" fill="#5c8a5c" opacity="0.8"/><circle cx="80" cy="40" r="5" fill="#5c8a5c" opacity="0.8"/><circle cx="42" cy="62" r="3" fill="#d1a94e" stroke="none"/><circle cx="79" cy="47" r="1.8" fill="#d1a94e" stroke="none"/><line x1="28" y1="74" x2="24" y2="88"/><line x1="42" y1="76" x2="42" y2="90"/><line x1="56" y1="74" x2="60" y2="88"/>`, -1);
}
function artSiltStepperRat(){
   return sceneWrap(`<ellipse cx="44" cy="66" rx="24" ry="13" fill="#5f4632" opacity="0.7"/><circle cx="72" cy="54" r="12" fill="#5f4632" opacity="0.7"/><circle cx="65" cy="45" r="4.5" fill="#5f4632" opacity="0.7"/><circle cx="78" cy="45" r="4.5" fill="#5f4632" opacity="0.7"/><circle cx="76" cy="51" r="1.6" fill="#2b2b28" stroke="none"/><line x1="30" y1="76" x2="26" y2="90"/><line x1="44" y1="78" x2="44" y2="92"/><line x1="58" y1="76" x2="60" y2="90"/>`, 2);
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
/* Same gap-filling pass as Commons/Sewers above — 11 more Quarry
regulars, same gnome stick-figure template (quarry gnomes, matching
the surveyor/sergeant family) as every Quarry regular already uses. */
function artQuarryForeman(){
   return sceneWrap(`<path d="M50 10 L28 44 L72 44 Z" fill="#d1a94e"/><circle cx="50" cy="56" r="13" fill="#e0c49a"/><circle cx="43" cy="56" r="2" fill="#2b2b28" stroke="none"/><circle cx="57" cy="56" r="2" fill="#2b2b28" stroke="none"/><rect x="40" y="38" width="20" height="5" fill="#8a8477"/><line x1="50" y1="69" x2="50" y2="88"/><line x1="50" y1="76" x2="30" y2="84"/><line x1="50" y1="76" x2="70" y2="84"/><line x1="50" y1="88" x2="38" y2="98"/><line x1="50" y1="88" x2="62" y2="98"/>`, 0);
}
function artStoneHaulerGnome(){
   return sceneWrap(`<path d="M50 14 L32 44 L68 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="13" fill="#e0c49a"/><circle cx="50" cy="78" r="16" fill="#b9b3a4"/><line x1="50" y1="69" x2="50" y2="64"/><line x1="36" y1="78" x2="24" y2="72"/><line x1="64" y1="78" x2="76" y2="72"/><line x1="50" y1="94" x2="40" y2="99"/><line x1="50" y1="94" x2="60" y2="99"/>`, 0);
}
function artScaffoldClimberGnome(){
   return sceneWrap(`<line x1="20" y1="20" x2="20" y2="94" stroke-width="3"/><line x1="80" y1="20" x2="80" y2="94" stroke-width="3"/><line x1="20" y1="56" x2="80" y2="56" stroke-width="3"/><path d="M50 30 L36 56 L64 56 Z" fill="#5c8a5c"/><circle cx="50" cy="68" r="11" fill="#e0c49a"/><circle cx="44" cy="68" r="1.8" fill="#2b2b28" stroke="none"/><circle cx="56" cy="68" r="1.8" fill="#2b2b28" stroke="none"/><line x1="50" y1="79" x2="50" y2="94"/><line x1="50" y1="94" x2="40" y2="99"/><line x1="50" y1="94" x2="60" y2="99"/>`, 1);
}
function artBlastChargeGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#b5453f"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><rect x="66" y="52" width="8" height="22" fill="#8a5a3a" transform="rotate(14 70 63)"/><circle cx="76" cy="50" r="2" fill="#d1a94e" stroke="none"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -2);
}
function artTunnelRunnerGnome(){
   return sceneWrap(`<path d="M50 14 L34 44 L66 44 Z" fill="#3d5a80"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="86"/><line x1="50" y1="74" x2="32" y2="66"/><line x1="50" y1="74" x2="68" y2="80"/><line x1="50" y1="86" x2="34" y2="94"/><line x1="50" y1="86" x2="64" y2="96"/>`, -4);
}
function artRockslideDodgerGnome(){
   return sceneWrap(`<path d="M50 12 L34 42 L66 42 Z" fill="#b06a97"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><circle cx="18" cy="70" r="6" fill="#8a8477"/><circle cx="26" cy="84" r="8" fill="#8a8477"/><line x1="50" y1="66" x2="50" y2="86"/><line x1="50" y1="72" x2="70" y2="66"/><line x1="50" y1="86" x2="40" y2="96"/><line x1="50" y1="86" x2="60" y2="96"/>`, 3);
}
function artChiselGnome(){
   return sceneWrap(`<path d="M50 12 L34 44 L66 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="72" y2="60"/><rect x="70" y="54" width="5" height="14" fill="#b9b3a4" transform="rotate(30 72 61)"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -1);
}
function artQuarrySurveyorApprentice(){
   return sceneWrap(`<path d="M50 12 L30 42 L70 42 Z" fill="#5c8a5c" opacity="0.8"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><rect x="32" y="58" width="16" height="12" fill="#f4efe4"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="32" y2="64"/><line x1="50" y1="72" x2="68" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 2);
}
function artCrystalDivinerGnome(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#3d5a80" opacity="0.8"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="86"/><line x1="50" y1="70" x2="76" y2="54"/><circle cx="78" cy="50" r="3" fill="#b06a97" stroke="none"/><line x1="50" y1="70" x2="30" y2="80"/><line x1="50" y1="86" x2="40" y2="96"/><line x1="50" y1="86" x2="60" y2="96"/>`, 0);
}
function artTremorSensingGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#8a8477" opacity="0.8"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="86"/><line x1="36" y1="74" x2="26" y2="70"/><line x1="64" y1="74" x2="74" y2="70"/><line x1="50" y1="86" x2="38" y2="94"/><line x1="50" y1="86" x2="62" y2="94"/><path d="M20 96 Q50 90 80 96" fill="none" stroke-width="2"/>`, -1);
}
function artDowsingRodGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#b06a97" opacity="0.8"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="78" y2="62"/><path d="M78 62 L84 58 M78 62 L84 66" stroke-width="2"/><line x1="50" y1="74" x2="32" y2="84"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 2);
}
/* Boss pass (rare:true, content.js) — an amber hazard-glow aura drawn
first (behind everything), plus a hull/head/reach that crowds the
viewBox edges instead of the regular Quarry drones' comfortable margin. */
function artDiggerBot(){
   return sceneWrap(`<circle cx="50" cy="54" r="47" fill="#d1a94e" opacity="0.3"/><rect x="12" y="30" width="76" height="52" fill="#b5453f"/><circle cx="50" cy="24" r="18" fill="#8a8477"/><circle cx="41" cy="22" r="3.6" fill="#2b2b28" stroke="none"/><circle cx="59" cy="22" r="3.6" fill="#2b2b28" stroke="none"/><path d="M50 6 L45 18 M50 6 L55 18" stroke-width="3"/><line x1="12" y1="42" x2="0" y2="30"/><path d="M0 30 L8 12" stroke-width="4"/><line x1="88" y1="42" x2="100" y2="34"/><path d="M100 34 L96 16" stroke-width="4"/><line x1="30" y1="82" x2="22" y2="99"/><line x1="70" y1="82" x2="78" y2="99"/><path d="M18 58 L10 50 M18 66 L6 64" stroke-width="2.5"/>`, 0);
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
/* Same gap-filling pass as Commons/Sewers/Quarry above — 11 more Vault
regulars, same gnome stick-figure template every Vault gnome already
uses, a gold/treasure accent palette fitting the hoard theme. */
function artTreasureDiverGnome(){
   return sceneWrap(`<path d="M30 70 L70 70 L62 46 L38 46 Z" fill="#8a8477"/><path d="M50 10 L32 42 L68 42 Z" fill="#d1a94e"/><circle cx="50" cy="60" r="11" fill="#e0c49a"/><line x1="50" y1="71" x2="50" y2="88"/><line x1="50" y1="78" x2="32" y2="86"/><line x1="50" y1="78" x2="68" y2="86"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artAppraiserGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><circle cx="44" cy="56" r="4" fill="none" stroke="#2b2b28" stroke-width="1.5"/><circle cx="56" cy="56" r="4" fill="none" stroke="#2b2b28" stroke-width="1.5"/><line x1="48" y1="56" x2="52" y2="56" stroke-width="1.5"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="68" y2="66"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artCoinCounterGnome(){
   return sceneWrap(`<ellipse cx="50" cy="80" rx="30" ry="14" fill="#d1a94e" opacity="0.6"/><path d="M50 14 L32 46 L68 46 Z" fill="#b06a97"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><line x1="50" y1="70" x2="50" y2="82"/><line x1="50" y1="76" x2="32" y2="78"/><line x1="50" y1="76" x2="68" y2="78"/><circle cx="34" cy="84" r="3" fill="#d1a94e" stroke="none"/><circle cx="50" cy="88" r="3" fill="#d1a94e" stroke="none"/><circle cx="64" cy="84" r="3" fill="#d1a94e" stroke="none"/>`, 0);
}
function artWardKeeperGnome(){
   return sceneWrap(`<circle cx="50" cy="56" r="40" fill="#d1a94e" opacity="0.15"/><path d="M50 14 L34 44 L66 44 Z" fill="#3d5a80"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="80"/><line x1="50" y1="74" x2="68" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artTrapDodgerGnome(){
   return sceneWrap(`<line x1="20" y1="80" x2="80" y2="80" stroke-width="2" stroke-dasharray="4 4"/><path d="M50 10 L36 38 L64 38 Z" fill="#5c8a5c"/><circle cx="50" cy="50" r="11" fill="#e0c49a"/><line x1="50" y1="61" x2="50" y2="74"/><line x1="50" y1="66" x2="30" y2="58"/><line x1="50" y1="66" x2="70" y2="58"/><line x1="50" y1="74" x2="36" y2="88"/><line x1="50" y1="74" x2="64" y2="88"/>`, -4);
}
function artRuneReaderGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#b06a97" opacity="0.8"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="36" y2="86"/><line x1="50" y1="74" x2="70" y2="68"/><path d="M60 94 L64 86 L68 94 L64 90 Z" fill="#d1a94e" stroke="none"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 1);
}
function artLockPickerGnome(){
   return sceneWrap(`<path d="M50 14 L34 44 L66 44 Z" fill="#2b2b28"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="86"/><line x1="50" y1="74" x2="72" y2="64"/><path d="M70 60 L76 58 L74 64 Z" fill="#b9b3a4"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="86" x2="40" y2="97"/><line x1="50" y1="86" x2="60" y2="97"/>`, -2);
}
function artVaultRunnerGnome(){
   return sceneWrap(`<path d="M50 10 L34 38 L66 38 Z" fill="#3d5a80"/><circle cx="50" cy="50" r="11" fill="#e0c49a"/><line x1="50" y1="61" x2="50" y2="78"/><line x1="50" y1="66" x2="28" y2="56"/><line x1="50" y1="66" x2="72" y2="72"/><line x1="50" y1="78" x2="30" y2="88"/><line x1="50" y1="78" x2="70" y2="92"/>`, -6);
}
function artRelicWielderGnome(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="76" y2="58"/><circle cx="78" cy="54" r="4" fill="#d1a94e" stroke="none"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artEchoChaserGnome(){
   return sceneWrap(`<path d="M50 14 L32 46 L68 46 Z" fill="#b9b3a4"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><circle cx="50" cy="58" r="20" fill="none" stroke="#f4efe4" stroke-width="1.5" opacity="0.6"/><circle cx="50" cy="58" r="28" fill="none" stroke="#f4efe4" stroke-width="1.5" opacity="0.3"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="32" y2="84"/><line x1="50" y1="76" x2="68" y2="84"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, 0);
}
function artCurseBreakerGnome(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#2b2b28" opacity="0.85"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="86"/><line x1="50" y1="72" x2="30" y2="64"/><path d="M26 58 Q22 62 26 66 Q30 62 26 58 Z" fill="#b06a97" stroke="none"/><line x1="50" y1="72" x2="70" y2="80"/><line x1="50" y1="86" x2="40" y2="96"/><line x1="50" y1="86" x2="60" y2="96"/>`, 1);
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
/* gnomeKingsCaptain's art (content.js) — referenced by value at that
file's parse time, so it must exist before content.js loads (see
AGENTS.md rule #1) or the whole game fails to boot. Functional
placeholder: a guard-uniform recolor of artGnomeGuard's silhouette with
a smaller red aura than artGnomeKing's below, since he's a step down
from the real King in both stats and menace. */
function artGnomeKingsCaptain(){
   return sceneWrap(`<circle cx="50" cy="54" r="40" fill="#b5453f" opacity="0.22"/><path d="M50 8 L30 42 L70 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="13" fill="#e0c49a"/><rect x="32" y="66" width="36" height="26" fill="#b9b3a4"/><ellipse cx="20" cy="80" rx="10" ry="14" fill="#5f4632"/><line x1="68" y1="70" x2="82" y2="78"/><line x1="50" y1="92" x2="40" y2="99"/><line x1="50" y1="92" x2="60" y2="99"/>`, 0);
}
/* The palace gauntlet (palaceGuard1-5, content.js) — five unique
silhouettes with a gently widening aura (r36->44) matching their own
escalating stats, so the gauntlet visually ramps up toward artGnomeKing
below the same way its numbers do. */
function artPalaceGuard1(){
   return sceneWrap(`<circle cx="50" cy="54" r="36" fill="#8a8477" opacity="0.2"/><path d="M50 10 L32 40 L68 40 Z" fill="#8a8477"/><circle cx="50" cy="52" r="12" fill="#e0c49a"/><rect x="34" y="64" width="32" height="24" fill="#b9b3a4"/><line x1="76" y1="30" x2="76" y2="90"/><path d="M70 30 L82 30 L76 18 Z" fill="#b9b3a4"/><line x1="50" y1="88" x2="40" y2="99"/><line x1="50" y1="88" x2="60" y2="99"/>`, 0);
}
function artPalaceGuard2(){
   return sceneWrap(`<circle cx="50" cy="54" r="38" fill="#3d5a80" opacity="0.22"/><path d="M36 20 Q50 8 64 20 L60 40 L40 40 Z" fill="#b06a97"/><circle cx="50" cy="50" r="12" fill="#e0c49a"/><path d="M32 62 Q50 54 68 62 L64 92 Q50 98 36 92 Z" fill="#b06a97"/><circle cx="50" cy="72" r="10" fill="none" stroke-width="2.5" opacity="0.7"/><circle cx="50" cy="72" r="4" fill="#d1a94e" stroke="none"/><line x1="50" y1="92" x2="42" y2="99"/><line x1="50" y1="92" x2="58" y2="99"/>`, 0);
}
function artPalaceGuard3(){
   return sceneWrap(`<circle cx="50" cy="54" r="40" fill="#d1a94e" opacity="0.22"/><path d="M40 18 L60 18 L56 32 L44 32 Z" fill="#2b2b28"/><circle cx="50" cy="42" r="12" fill="#e0c49a"/><rect x="44" y="52" width="12" height="6" fill="#b5453f" stroke="none"/><path d="M32 58 Q50 50 68 58 L64 94 Q50 99 36 94 Z" fill="#2b2b28"/><line x1="32" y1="62" x2="18" y2="70"/><line x1="18" y1="70" x2="20" y2="60"/><line x1="68" y1="62" x2="82" y2="70"/><line x1="82" y1="70" x2="80" y2="60"/><line x1="50" y1="94" x2="42" y2="99"/><line x1="50" y1="94" x2="58" y2="99"/>`, 0);
}
function artPalaceGuard4(){
   return sceneWrap(`<circle cx="50" cy="54" r="44" fill="#b5453f" opacity="0.26"/><path d="M50 6 L28 38 L72 38 Z" fill="#8a8477"/><circle cx="50" cy="50" r="14" fill="#e0c49a"/><rect x="30" y="64" width="40" height="28" fill="#b9b3a4"/><rect x="34" y="68" width="10" height="20" fill="#8a8477"/><rect x="56" y="68" width="10" height="20" fill="#8a8477"/><line x1="72" y1="60" x2="92" y2="46"/><path d="M88 40 L98 44 L92 52 Z" fill="#d1a94e"/><line x1="28" y1="60" x2="10" y2="70"/><line x1="50" y1="92" x2="40" y2="99"/><line x1="50" y1="92" x2="60" y2="99"/>`, 0);
}
function artPalaceGuard5(){
   return sceneWrap(`<circle cx="50" cy="54" r="38" fill="#2b2b28" opacity="0.3"/><path d="M50 8 Q68 22 62 44 L38 44 Q32 22 50 8 Z" fill="#2b2b28" opacity="0.85"/><circle cx="50" cy="46" r="11" fill="#e0c49a" opacity="0.7"/><path d="M30 52 Q50 44 70 52 L64 94 Q50 99 36 94 Z" fill="#2b2b28" opacity="0.85"/><line x1="30" y1="56" x2="12" y2="66" opacity="0.6"/><line x1="70" y1="56" x2="88" y2="66" opacity="0.6"/><circle cx="12" cy="66" r="5" fill="none" stroke-width="2" opacity="0.4"/><circle cx="88" cy="66" r="5" fill="none" stroke-width="2" opacity="0.4"/><line x1="50" y1="94" x2="42" y2="99" opacity="0.85"/><line x1="50" y1="94" x2="58" y2="99" opacity="0.85"/>`, 0);
}
/* Boss pass (rare:true, content.js) — biggest of the two gnome bosses:
a wider red aura disc than artGnomeCommander's, and a cape/robe/crown
that pushes almost to the viewBox edges. */
function artGnomeKing(){
   return sceneWrap(`<circle cx="50" cy="52" r="48" fill="#b5453f" opacity="0.32"/><path d="M10 90 Q50 74 90 90 L82 34 Q50 24 18 34 Z" fill="#d1a94e"/><path d="M50 0 L16 40 L84 40 Z" fill="#b5453f"/><rect x="34" y="2" width="32" height="9" fill="#f4efe4"/><circle cx="41" cy="6" r="2.4" fill="#3d5a80" stroke="none"/><circle cx="59" cy="6" r="2.4" fill="#3d5a80" stroke="none"/><circle cx="50" cy="58" r="17" fill="#e0c49a"/><circle cx="39" cy="58" r="3" fill="#2b2b28" stroke="none"/><circle cx="61" cy="58" r="3" fill="#2b2b28" stroke="none"/><line x1="50" y1="75" x2="50" y2="94"/><line x1="50" y1="82" x2="10" y2="72"/><line x1="10" y1="72" x2="0" y2="88"/><line x1="50" y1="82" x2="94" y2="88"/><path d="M36 88 L64 88 L58 99 L42 99 Z" fill="#3d5a80"/><line x1="50" y1="94" x2="34" y2="99"/><line x1="50" y1="94" x2="66" y2="99"/>`, 0);
}
/* Real pass on trialChampion (content.js) — the toughest fight in the
game (hp:95, the Guild's Trial Examiner), so it needs to read as bigger
and more armored than artGnomeKing rather than a recolor: wider shoulder
guards that push past the usual body silhouette, a full closed helm
instead of a face, and a two-handed greatsword planted in front of it
in place of the usual single raised arm. */
function artTrialChampion(){
   return sceneWrap(`<circle cx="50" cy="55" r="48" fill="#3d5a80" opacity="0.3"/><path d="M6 96 Q50 72 94 96 L82 26 Q50 15 18 26 Z" fill="#5f4632"/><path d="M18 26 L0 38 L4 64 L20 56 Z" fill="#8a8477"/><path d="M82 26 L100 38 L96 64 L80 56 Z" fill="#8a8477"/><rect x="32" y="22" width="36" height="10" fill="#b9b3a4"/><path d="M34 16 Q50 0 66 16 L62 38 Q50 45 38 38 Z" fill="#b9b3a4"/><line x1="42" y1="25" x2="42" y2="35"/><line x1="58" y1="25" x2="58" y2="35"/><line x1="50" y1="45" x2="50" y2="98"/><line x1="50" y1="56" x2="12" y2="47"/><line x1="12" y1="47" x2="0" y2="20"/><line x1="50" y1="56" x2="88" y2="47"/><line x1="88" y1="47" x2="100" y2="20"/><path d="M50 8 L45 62 L55 62 Z" fill="#8a8477"/><line x1="30" y1="15" x2="70" y2="15"/><path d="M34 92 L66 92 L60 100 L40 100 Z" fill="#3d5a80"/><line x1="50" y1="98" x2="32" y2="100"/><line x1="50" y1="98" x2="68" y2="100"/>`, 0);
}
/* Casino tier of the Trial (casinoChampion, content.js) — same cloaked-
silhouette build as artRoguesDenEnforcer below, but swaps its empty
raised arm for a fan of cards (same motif as artCardShark above) and
gets a gold-tinted aura instead of grey, tying it to the Casino/chips
rather than the Rogues' Den. */
function artCasinoChampion(){
   return sceneWrap(`<circle cx="50" cy="55" r="42" fill="#d1a94e" opacity="0.28"/><path d="M50 6 Q66 20 60 42 L40 42 Q34 20 50 6 Z" fill="#2b2b28"/><circle cx="50" cy="48" r="12" fill="#e0c49a"/><rect x="40" y="44" width="20" height="6" fill="#2b2b28" stroke="none"/><path d="M30 52 Q50 44 70 52 L64 94 Q50 100 36 94 Z" fill="#2b2b28"/><line x1="30" y1="56" x2="14" y2="66"/><rect x="4" y="52" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(-18 9 60)"/><rect x="8" y="50" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(2 13 58)"/><rect x="12" y="53" width="11" height="16" fill="#f4efe4" stroke-width="2" transform="rotate(20 17 61)"/><line x1="70" y1="56" x2="88" y2="64"/><line x1="50" y1="94" x2="40" y2="99"/><line x1="50" y1="94" x2="60" y2="99"/>`, 0);
}
/* Hoodoo tier of the Trial (hoodooChampion, content.js) — a spectral
riff on artArcaneSanctumGuardian below: translucent robe (opacity, not a
solid fill) instead of a solid construct, a jagged/wavy hem instead of a
straight one to read as trailing smoke rather than legs, and a cauldron
at its base (the "pot" it was summoned from) instead of ground. */
function artHoodooChampion(){
   return sceneWrap(`<circle cx="50" cy="52" r="44" fill="#3d5a80" opacity="0.24"/><path d="M50 6 Q64 22 56 40 L44 40 Q36 22 50 6 Z" fill="#3d5a80" opacity="0.7"/><circle cx="50" cy="46" r="11" fill="#e0c49a" opacity="0.85"/><circle cx="45" cy="45" r="2" fill="#d1a94e" stroke="none"/><circle cx="55" cy="45" r="2" fill="#d1a94e" stroke="none"/><path d="M30 54 Q50 46 70 54 Q66 74 74 92 Q50 84 26 92 Q34 74 30 54 Z" fill="#3d5a80" opacity="0.7"/><circle cx="16" cy="70" r="8" fill="none" stroke-width="2.5" opacity="0.6"/><circle cx="16" cy="70" r="3.5" fill="#d1a94e" stroke="none"/><ellipse cx="50" cy="94" rx="30" ry="6" fill="#5f4632"/><ellipse cx="50" cy="92" rx="14" ry="3" fill="#2b2b28" opacity="0.3"/>`, 0);
}
/* Gnometropolis district guardians (garrisonGuardian/roguesDenEnforcer/
arcaneSanctumGuardian, content.js) — same visual weight as
artGnomeKingsCaptain above (aura radius ~40-42, no shape pushed to the
viewBox edge), not the wider/edge-crowding treatment artGnomeKing/
artTrialChampion get, even though `rare:true` still earns all three the
existing boss-encounter CSS scale-up (render.js) automatically. Each
gets its own silhouette matching its class's motif: Garrison ->
armored guard with shield, Rogues' Den -> hooded/masked cloak, Arcane
Sanctum -> robed construct with a floating rune. */
function artGarrisonGuardian(){
   return sceneWrap(`<circle cx="50" cy="54" r="42" fill="#b5453f" opacity="0.24"/><path d="M50 6 L28 40 L72 40 Z" fill="#8a8477"/><circle cx="50" cy="54" r="14" fill="#e0c49a"/><rect x="30" y="66" width="40" height="28" fill="#b9b3a4"/><rect x="34" y="70" width="10" height="20" fill="#8a8477"/><rect x="56" y="70" width="10" height="20" fill="#8a8477"/><path d="M6 58 Q0 78 10 96 Q22 92 24 74 Q22 60 6 58 Z" fill="#5f4632"/><line x1="70" y1="70" x2="88" y2="60"/><line x1="88" y1="60" x2="92" y2="76"/><line x1="50" y1="94" x2="40" y2="99"/><line x1="50" y1="94" x2="60" y2="99"/>`, 0);
}
function artRoguesDenEnforcer(){
   return sceneWrap(`<circle cx="50" cy="54" r="40" fill="#2b2b28" opacity="0.26"/><path d="M50 6 Q66 18 62 38 L38 38 Q34 18 50 6 Z" fill="#2b2b28"/><circle cx="50" cy="46" r="11" fill="#e0c49a"/><rect x="40" y="42" width="20" height="6" fill="#2b2b28" stroke="none"/><path d="M30 50 Q50 42 70 50 L66 92 Q50 98 34 92 Z" fill="#2b2b28"/><line x1="30" y1="54" x2="12" y2="66"/><path d="M12 66 L4 58 M12 66 L6 76" stroke-width="2.5"/><line x1="70" y1="54" x2="88" y2="64"/><path d="M88 64 L96 56 M88 64 L94 74" stroke-width="2.5"/><line x1="50" y1="94" x2="40" y2="99"/><line x1="50" y1="94" x2="60" y2="99"/>`, 0);
}
function artArcaneSanctumGuardian(){
   return sceneWrap(`<circle cx="50" cy="54" r="42" fill="#b06a97" opacity="0.28"/><path d="M50 4 L34 30 L66 30 Z" fill="#b06a97"/><circle cx="50" cy="42" r="12" fill="#e0c49a"/><circle cx="45" cy="41" r="2" fill="#d1a94e" stroke="none"/><circle cx="55" cy="41" r="2" fill="#d1a94e" stroke="none"/><path d="M30 54 Q50 46 70 54 L64 94 Q50 99 36 94 Z" fill="#b06a97"/><line x1="30" y1="58" x2="12" y2="70"/><circle cx="12" cy="76" r="9" fill="none" stroke-width="2.5" opacity="0.6"/><circle cx="12" cy="76" r="4" fill="#d1a94e" stroke="none"/><line x1="70" y1="58" x2="86" y2="66"/><line x1="50" y1="94" x2="42" y2="99"/><line x1="50" y1="94" x2="58" y2="99"/>`, 0);
}

/* Regular (non-rare) Gnometropolis district monsters, rounding the
Garrison/Arcane Sanctum/Rogues' Den rosters out to 3 apiece alongside
the existing gnomeGuard/gnomeVizier/burrowWorm/feralAutomaton above —
same plain-doodle weight as those, no aura circle (that's reserved for
rare spawns, see the district guardians above). */
function artGnomeDrillSergeant(){
   return sceneWrap(`<path d="M50 10 L34 30 L66 30 Z" fill="#5f4632"/><circle cx="50" cy="42" r="12" fill="#e0c49a"/><rect x="34" y="54" width="32" height="26" fill="#8a8477"/><line x1="40" y1="58" x2="60" y2="58"/><line x1="40" y1="64" x2="60" y2="64"/><line x1="66" y1="58" x2="82" y2="46"/><line x1="82" y1="46" x2="82" y2="26"/><path d="M82 28 L94 32 L82 36 Z" fill="#b5453f"/><line x1="50" y1="80" x2="40" y2="98"/><line x1="50" y1="80" x2="60" y2="98"/>`, 0);
}
function artGnomeSiegeCrew(){
   return sceneWrap(`<rect x="14" y="70" width="40" height="8" fill="#5f4632"/><rect x="18" y="40" width="6" height="30" fill="#8a5a3a"/><rect x="44" y="40" width="6" height="30" fill="#8a5a3a"/><line x1="21" y1="42" x2="47" y2="66"/><path d="M47 66 L60 50 L54 60 Z" fill="#8a8477"/><circle cx="70" cy="60" r="11" fill="#e0c49a"/><path d="M62 52 L78 52 L70 42 Z" fill="#8a8477"/><line x1="70" y1="71" x2="64" y2="90"/><line x1="70" y1="71" x2="78" y2="90"/>`, -1);
}
function artHexWeaver(){
   return sceneWrap(`<path d="M50 12 L38 32 L62 32 Z" fill="#b06a97"/><circle cx="50" cy="44" r="11" fill="#e0c49a"/><path d="M36 56 Q50 48 64 56 L60 92 Q50 98 40 92 Z" fill="#b06a97"/><path d="M64 56 Q76 50 72 38" fill="none" stroke-width="2.5"/><circle cx="72" cy="36" r="4" fill="#d1a94e" stroke="none"/><circle cx="78" cy="30" r="2.4" fill="#d1a94e" stroke="none"/><line x1="50" y1="92" x2="42" y2="99"/><line x1="50" y1="92" x2="58" y2="99"/>`, 1);
}
function artGnomeFamiliar(){
   return sceneWrap(`<ellipse cx="50" cy="60" rx="22" ry="18" fill="#3d5a80"/><circle cx="40" cy="48" r="4" fill="#d1a94e" stroke="none"/><circle cx="60" cy="48" r="4" fill="#d1a94e" stroke="none"/><path d="M30 52 Q20 44 24 32" fill="none" stroke-width="2.5"/><path d="M70 52 Q80 44 76 32" fill="none" stroke-width="2.5"/><path d="M36 74 Q50 82 64 74" fill="none" stroke-width="2.5"/>`, -2);
}
function artGnomePickpocket(){
   return sceneWrap(`<path d="M50 8 Q64 14 60 30 L40 30 Q36 14 50 8 Z" fill="#2b2b28"/><rect x="40" y="26" width="20" height="6" fill="#2b2b28" stroke="none"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><path d="M34 48 Q50 40 66 48 L62 86 Q50 92 38 86 Z" fill="#2b2b28"/><line x1="34" y1="52" x2="18" y2="60"/><path d="M18 60 L10 54 M18 60 L14 68" stroke-width="2.5"/><line x1="66" y1="52" x2="80" y2="46"/><line x1="50" y1="86" x2="42" y2="99"/><line x1="50" y1="86" x2="58" y2="99"/>`, 0);
}
/* Same gap-filling, class-gated pass as the other zones above — 33
more Gnometropolis district regulars (12 Garrison, 10 Rogues' Den, 11
Arcane Sanctum), same gnome stick-figure template every district
regular already uses. */
function artGnomeQuartermaster(){
   return sceneWrap(`<path d="M50 10 L30 44 L70 44 Z" fill="#8a8477"/><circle cx="50" cy="56" r="13" fill="#e0c49a"/><rect x="40" y="62" width="20" height="14" fill="#a97c53"/><line x1="50" y1="76" x2="50" y2="88"/><line x1="36" y1="60" x2="26" y2="54"/><line x1="64" y1="60" x2="74" y2="54"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeRecruit(){
   return sceneWrap(`<path d="M50 14 L34 44 L66 44 Z" fill="#5c8a5c"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="68" y2="68"/><line x1="50" y1="74" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 1);
}
function artGnomeDrillfieldRunner(){
   return sceneWrap(`<path d="M50 10 L34 38 L66 38 Z" fill="#5c8a5c"/><circle cx="50" cy="50" r="11" fill="#e0c49a"/><line x1="50" y1="61" x2="50" y2="78"/><line x1="50" y1="66" x2="26" y2="56"/><line x1="50" y1="66" x2="74" y2="72"/><line x1="50" y1="78" x2="28" y2="90"/><line x1="50" y1="78" x2="72" y2="94"/>`, -6);
}
function artGnomeScoutSergeant(){
   return sceneWrap(`<path d="M50 12 L34 42 L66 42 Z" fill="#8a8477" opacity="0.7"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="76" y2="60"/><circle cx="80" cy="56" r="3" fill="none" stroke="#2b2b28" stroke-width="1.5"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeSupplyRaider(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#b06a97"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><rect x="66" y="50" width="14" height="18" fill="#a97c53"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 2);
}
function artGnomePerimeterRunner(){
   return sceneWrap(`<path d="M50 8 L34 36 L66 36 Z" fill="#b06a97"/><circle cx="50" cy="48" r="11" fill="#e0c49a"/><line x1="50" y1="59" x2="50" y2="76"/><line x1="50" y1="64" x2="24" y2="54"/><line x1="50" y1="64" x2="76" y2="70"/><line x1="50" y1="76" x2="26" y2="88"/><line x1="50" y1="76" x2="74" y2="92"/>`, -7);
}
function artGnomeBladeSergeant(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="80" y2="56"/><line x1="80" y1="56" x2="88" y2="48"/><line x1="50" y1="72" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -2);
}
function artGnomeWarChaplain(){
   return sceneWrap(`<path d="M50 10 L32 44 L68 44 Z" fill="#f4efe4" opacity="0.7"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="30" x2="50" y2="14"/><line x1="42" y1="22" x2="58" y2="22"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="74" x2="68" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeSignalCaster(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#3d5a80" opacity="0.8"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><circle cx="50" cy="56" r="22" fill="none" stroke="#d1a94e" stroke-width="1.5" opacity="0.5"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="74" x2="68" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeRuneMarkedScout(){
   return sceneWrap(`<path d="M50 10 L34 40 L66 40 Z" fill="#b06a97" opacity="0.8"/><circle cx="50" cy="52" r="11" fill="#e0c49a"/><line x1="50" y1="63" x2="50" y2="84"/><path d="M34 90 L38 82 L42 90 L38 86 Z" fill="#d1a94e" stroke="none"/><line x1="50" y1="68" x2="30" y2="60"/><line x1="50" y1="68" x2="70" y2="74"/><line x1="50" y1="84" x2="60" y2="96"/>`, 2);
}
function artGnomeWardWalker(){
   return sceneWrap(`<line x1="20" y1="90" x2="80" y2="90" stroke-width="2" stroke-dasharray="3 5"/><path d="M50 12 L34 42 L66 42 Z" fill="#3d5a80" opacity="0.7"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="84"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="72" x2="68" y2="80"/><line x1="50" y1="84" x2="40" y2="94"/><line x1="50" y1="84" x2="60" y2="94"/>`, 0);
}
function artGnomeBattleConjurer(){
   return sceneWrap(`<circle cx="50" cy="56" r="40" fill="#b06a97" opacity="0.2"/><path d="M50 10 L32 42 L68 42 Z" fill="#2b2b28" opacity="0.85"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="76" y2="60"/><circle cx="80" cy="56" r="4" fill="#b06a97" stroke="none"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeCardShill(){
   return sceneWrap(`<path d="M50 8 Q62 12 58 28 L42 28 Q38 12 50 8 Z" fill="#2b2b28"/><circle cx="50" cy="36" r="10" fill="#e0c49a"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#b06a97"/><line x1="34" y1="50" x2="18" y2="44"/><path d="M14 40 L22 44 L14 48 Z" fill="#f4efe4" stroke="none"/><line x1="66" y1="50" x2="80" y2="56"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeFence(){
   return sceneWrap(`<path d="M50 8 Q64 14 60 30 L40 30 Q36 14 50 8 Z" fill="#8a8477"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><path d="M34 48 Q50 40 66 48 L62 86 Q50 92 38 86 Z" fill="#5f4632"/><rect x="66" y="50" width="12" height="16" fill="#a97c53" transform="rotate(10 72 58)"/><line x1="34" y1="52" x2="18" y2="60"/><line x1="50" y1="86" x2="42" y2="99"/><line x1="50" y1="86" x2="58" y2="99"/>`, 0);
}
function artGnomeEnforcerApprentice(){
   return sceneWrap(`<path d="M50 10 Q62 16 58 30 L42 30 Q38 16 50 10 Z" fill="#b5453f"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><path d="M34 48 Q50 40 66 48 L62 84 Q50 90 38 84 Z" fill="#2b2b28"/><line x1="34" y1="52" x2="16" y2="48"/><line x1="66" y1="52" x2="84" y2="58"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, -2);
}
function artGnomeGetawayDriver(){
   return sceneWrap(`<ellipse cx="50" cy="92" rx="34" ry="6" fill="#2b2b28" opacity="0.3"/><path d="M50 10 Q62 16 58 30 L42 30 Q38 16 50 10 Z" fill="#3d5a80"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><path d="M34 48 Q50 40 66 48 L62 84 Q50 90 38 84 Z" fill="#2b2b28"/><line x1="34" y1="52" x2="20" y2="62"/><line x1="66" y1="52" x2="80" y2="62"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeKnifeJuggler(){
   return sceneWrap(`<path d="M50 8 Q62 14 58 28 L42 28 Q38 14 50 8 Z" fill="#d1a94e"/><circle cx="50" cy="36" r="10" fill="#e0c49a"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#2b2b28"/><line x1="34" y1="50" x2="14" y2="42"/><path d="M10 38 L18 42 L10 46 Z" fill="#b9b3a4" stroke="none"/><line x1="66" y1="50" x2="86" y2="42"/><path d="M90 38 L82 42 L90 46 Z" fill="#b9b3a4" stroke="none"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeShadowBroker(){
   return sceneWrap(`<path d="M50 8 Q62 14 58 28 L42 28 Q38 14 50 8 Z" fill="#2b2b28"/><circle cx="50" cy="36" r="10" fill="#e0c49a" opacity="0.85"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#2b2b28" opacity="0.85"/><line x1="34" y1="50" x2="18" y2="58"/><line x1="66" y1="50" x2="82" y2="44"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 1);
}
function artGnomeSeanceCaller(){
   return sceneWrap(`<circle cx="50" cy="56" r="42" fill="#b06a97" opacity="0.12"/><path d="M50 10 L32 42 L68 42 Z" fill="#2b2b28" opacity="0.8"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="72" x2="68" y2="80"/><circle cx="68" cy="76" r="2.5" fill="#d1a94e" stroke="none"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeHexDealer(){
   return sceneWrap(`<path d="M50 8 Q62 14 58 28 L42 28 Q38 14 50 8 Z" fill="#b06a97"/><circle cx="50" cy="36" r="10" fill="#e0c49a"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#2b2b28"/><line x1="34" y1="50" x2="18" y2="58"/><circle cx="14" cy="62" r="2.5" fill="#b06a97" stroke="none"/><line x1="66" y1="50" x2="82" y2="56"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeAlleyFortuneReader(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#b06a97" opacity="0.7"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><circle cx="50" cy="80" r="8" fill="#f4efe4" opacity="0.4"/><line x1="50" y1="66" x2="50" y2="72"/><line x1="50" y1="72" x2="34" y2="78"/><line x1="50" y1="72" x2="66" y2="78"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 1);
}
function artGnomeBattleMage(){
   return sceneWrap(`<circle cx="50" cy="56" r="40" fill="#3d5a80" opacity="0.2"/><path d="M50 8 L30 44 L70 44 Z" fill="#3d5a80"/><circle cx="50" cy="56" r="13" fill="#e0c49a"/><line x1="50" y1="69" x2="50" y2="88"/><line x1="50" y1="76" x2="30" y2="68"/><circle cx="26" cy="64" r="3.5" fill="#d1a94e" stroke="none"/><line x1="50" y1="76" x2="70" y2="84"/><line x1="50" y1="88" x2="38" y2="98"/><line x1="50" y1="88" x2="62" y2="98"/>`, 0);
}
function artGnomeSpellSmith(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="72" y2="60"/><path d="M68 56 L76 50 L80 58 Z" fill="#b9b3a4"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -1);
}
function artGnomeArcaneSentry(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#5c8a5c"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="30" y2="64"/><line x1="50" y1="72" x2="70" y2="64"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeRuneblade(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="80" y2="58"/><circle cx="76" cy="60" r="2.5" fill="#d1a94e" stroke="none"/><line x1="50" y1="72" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -2);
}
function artGnomeScryingApprentice(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#b06a97" opacity="0.7"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><circle cx="50" cy="80" r="10" fill="none" stroke="#f4efe4" stroke-width="2"/><circle cx="50" cy="80" r="4" fill="#3d5a80" stroke="none"/><line x1="50" y1="68" x2="50" y2="70"/><line x1="50" y1="70" x2="32" y2="78"/><line x1="50" y1="70" x2="68" y2="78"/>`, 1);
}
function artGnomeGlyphCutter(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#b06a97"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="70" y2="66"/><path d="M68 62 L74 58 L76 64 Z" fill="#b9b3a4"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeConjureThief(){
   return sceneWrap(`<path d="M50 10 Q62 16 58 30 L42 30 Q38 16 50 10 Z" fill="#b06a97"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><path d="M34 48 Q50 40 66 48 L62 84 Q50 90 38 84 Z" fill="#3d5a80"/><line x1="34" y1="52" x2="18" y2="60"/><line x1="66" y1="52" x2="82" y2="46"/><circle cx="86" cy="42" r="3" fill="#d1a94e" stroke="none"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeTrickCaster(){
   return sceneWrap(`<path d="M50 8 Q62 14 58 28 L42 28 Q38 14 50 8 Z" fill="#b06a97"/><circle cx="50" cy="36" r="10" fill="#e0c49a"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#2b2b28"/><line x1="34" y1="50" x2="18" y2="44"/><line x1="66" y1="50" x2="82" y2="56"/><circle cx="86" cy="58" r="3" fill="#d1a94e" stroke="none"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeOracleInTraining(){
   return sceneWrap(`<path d="M50 12 L32 44 L68 44 Z" fill="#3d5a80" opacity="0.6"/><circle cx="50" cy="56" r="12" fill="#e0c49a"/><circle cx="50" cy="56" r="20" fill="none" stroke="#f4efe4" stroke-width="1.5" opacity="0.4"/><line x1="50" y1="68" x2="50" y2="88"/><line x1="50" y1="74" x2="32" y2="82"/><line x1="50" y1="74" x2="68" y2="82"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
function artGnomeLeyTapper(){
   return sceneWrap(`<circle cx="50" cy="56" r="38" fill="#b06a97" opacity="0.18"/><path d="M50 10 L32 42 L68 42 Z" fill="#3d5a80" opacity="0.8"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="30" y2="64"/><circle cx="26" cy="60" r="3" fill="#d1a94e" stroke="none"/><line x1="50" y1="72" x2="70" y2="64"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, 0);
}
/* 5 remaining district monsters' art, same gnome template. */
function artGnomeCaneMan(){
   return sceneWrap(`<path d="M50 10 L32 42 L68 42 Z" fill="#2b2b28"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="88"/><line x1="50" y1="72" x2="74" y2="64"/><path d="M74 64 Q80 58 76 52" fill="none" stroke-width="3"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="88" x2="40" y2="98"/><line x1="50" y1="88" x2="60" y2="98"/>`, -1);
}
function artGnomeLookout(){
   return sceneWrap(`<line x1="50" y1="94" x2="50" y2="60" stroke-width="3"/><path d="M50 10 Q62 16 58 30 L42 30 Q38 16 50 10 Z" fill="#2b2b28"/><circle cx="50" cy="38" r="10" fill="#e0c49a"/><line x1="40" y1="46" x2="60" y2="46" stroke-width="3"/><line x1="34" y1="50" x2="22" y2="44"/><line x1="66" y1="50" x2="78" y2="44"/>`, 1);
}
function artGnomeFateCheater(){
   return sceneWrap(`<path d="M50 8 Q62 14 58 28 L42 28 Q38 14 50 8 Z" fill="#b06a97"/><circle cx="50" cy="36" r="10" fill="#e0c49a"/><path d="M34 46 Q50 38 66 46 L62 84 Q50 90 38 84 Z" fill="#3d5a80"/><line x1="34" y1="50" x2="18" y2="44"/><rect x="10" y="38" width="8" height="8" fill="#f4efe4" transform="rotate(20 14 42)"/><line x1="66" y1="50" x2="82" y2="56"/><line x1="50" y1="84" x2="42" y2="97"/><line x1="50" y1="84" x2="58" y2="97"/>`, 0);
}
function artGnomeSpellRunner(){
   return sceneWrap(`<path d="M50 10 L34 40 L66 40 Z" fill="#b06a97"/><circle cx="50" cy="52" r="11" fill="#e0c49a"/><line x1="50" y1="63" x2="50" y2="82"/><line x1="50" y1="68" x2="28" y2="58"/><rect x="18" y="52" width="12" height="10" fill="#a97c53"/><line x1="50" y1="68" x2="72" y2="76"/><line x1="50" y1="82" x2="34" y2="94"/><line x1="50" y1="82" x2="66" y2="94"/>`, -3);
}
function artGnomeCircleWarden(){
   return sceneWrap(`<ellipse cx="50" cy="88" rx="30" ry="6" fill="none" stroke="#d1a94e" stroke-width="2" opacity="0.4"/><path d="M50 10 L32 42 L68 42 Z" fill="#3d5a80"/><circle cx="50" cy="54" r="12" fill="#e0c49a"/><line x1="50" y1="66" x2="50" y2="84"/><line x1="50" y1="72" x2="32" y2="80"/><line x1="50" y1="72" x2="68" y2="80"/><line x1="50" y1="84" x2="40" y2="94"/><line x1="50" y1="84" x2="60" y2="94"/>`, 0);
}

/* Act 1's 7 zone-rare monsters (ZONE_RARE_MONSTERS, content.js) — same
primitive-shape gnome-silhouette convention as every monster above,
each with its own small distinguishing flourish and palette rather than
a full redesign. */
function artMossbackStrider(){
   return sceneWrap(`<path d="M50 4 L34 50 L66 50 Z" fill="#3f5c3f"/><circle cx="50" cy="62" r="12" fill="#e0c49a"/><path d="M40 20 Q36 14 40 8 M60 20 Q64 14 60 8" stroke-width="2.5"/><line x1="50" y1="74" x2="50" y2="94"/><line x1="50" y1="80" x2="30" y2="70"/><line x1="50" y1="80" x2="70" y2="70"/><line x1="50" y1="94" x2="38" y2="99"/><line x1="50" y1="94" x2="62" y2="99"/>`, -4);
}
function artSewerSovereign(){
   return sceneWrap(`<path d="M50 14 L32 46 L68 46 Z" fill="#5c7a6b"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><path d="M40 46 L44 36 L48 44 L52 34 L56 44 L60 36 L64 46" fill="#b9b3a4"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="32" y2="84"/><line x1="50" y1="76" x2="68" y2="84"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, 2);
}
function artQuarryWraith(){
   return sceneWrap(`<path d="M50 10 L30 48 L70 48 Z" fill="#8a8477" opacity="0.6"/><circle cx="50" cy="60" r="12" fill="#b9b3a4" opacity="0.6"/><circle cx="44" cy="58" r="2" fill="#2b2b28" stroke="none"/><circle cx="56" cy="58" r="2" fill="#2b2b28" stroke="none"/><line x1="50" y1="72" x2="50" y2="92" opacity="0.6"/><line x1="50" y1="78" x2="32" y2="68" opacity="0.6"/><line x1="50" y1="78" x2="68" y2="68" opacity="0.6"/>`, 0);
}
function artVaultBornEcho(){
   return sceneWrap(`<circle cx="50" cy="46" r="24" fill="#3d5a80"/><circle cx="50" cy="46" r="24" fill="none" stroke="#f4efe4" stroke-width="2" opacity="0.6"/><path d="M38 40 Q50 48 62 40" stroke-width="2.5"/><path d="M38 52 Q50 44 62 52" stroke-width="2.5"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="34" y2="84"/><line x1="50" y1="76" x2="66" y2="84"/>`, 0);
}
function artUnlistedRecruit(){
   return sceneWrap(`<path d="M50 6 L32 42 L68 42 Z" fill="#8a8477"/><circle cx="50" cy="54" r="13" fill="#e0c49a"/><rect x="34" y="64" width="32" height="24" fill="#b5453f"/><line x1="34" y1="70" x2="18" y2="78"/><line x1="66" y1="70" x2="82" y2="62"/><line x1="50" y1="88" x2="40" y2="99"/><line x1="50" y1="88" x2="60" y2="99"/>`, 0);
}
function artShadeFingeredCutpurse(){
   return sceneWrap(`<path d="M50 10 L31 46 L69 46 Z" fill="#5a4a6b"/><circle cx="50" cy="58" r="12" fill="#e0c49a"/><path d="M38 52 L34 44" stroke-width="2.5"/><line x1="50" y1="70" x2="50" y2="90"/><line x1="50" y1="76" x2="28" y2="68"/><path d="M28 68 L20 60 M28 68 L22 76" stroke-width="2.5"/><line x1="50" y1="76" x2="70" y2="84"/><line x1="50" y1="90" x2="40" y2="99"/><line x1="50" y1="90" x2="60" y2="99"/>`, 0);
}
function artHalfCastFamiliar(){
   return sceneWrap(`<circle cx="50" cy="48" r="20" fill="#5a4a8a" opacity="0.5"/><path d="M34 40 Q50 26 66 40" fill="none" stroke-width="2.5"/><circle cx="43" cy="46" r="2.4" fill="#2b2b28" stroke="none"/><circle cx="57" cy="46" r="2.4" fill="#2b2b28" stroke="none"/><path d="M50 68 Q40 78 46 90 M50 68 Q60 78 54 90" opacity="0.5"/>`, -2);
}

/* ---------------- Mudroot Warren monster art (Act 2 Part 2) ---------------- */
/* mudroot-content.js's 6 regulars + 2 rare hunts (tunnelWarden/
warrenScout) — kept here rather than a new file, following this
session's own established precedent of centralizing ALL monster art in
art.js regardless of which zone/file the monster's own data lives in
(palaceGuard1-5 did the same). */
function artTunnelMole(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="26" ry="20" fill="#5f4632"/><ellipse cx="50" cy="46" rx="14" ry="11" fill="#5f4632"/><path d="M40 42 Q36 34 30 36" fill="none" stroke-width="3"/><path d="M60 42 Q64 34 70 36" fill="none" stroke-width="3"/><path d="M42 76 L36 90 M50 78 L48 92 M58 76 L64 90" stroke-width="3.5"/>`, 0);
}
function artRootGrub(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="30" ry="22" fill="#5c8a5c"/><ellipse cx="50" cy="66" rx="30" ry="22" fill="#d1a94e" opacity="0.25"/><circle cx="36" cy="52" r="2" fill="#2b2b28" stroke="none"/><circle cx="64" cy="52" r="2" fill="#2b2b28" stroke="none"/><path d="M20 66 Q10 60 12 50 M80 66 Q90 60 88 50" fill="none" stroke-width="2.5"/>`, 0);
}
function artMoleSapper(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="19" fill="#5f4632"/><ellipse cx="50" cy="48" rx="12" ry="10" fill="#5f4632"/><rect x="66" y="54" width="18" height="20" fill="#8a5a3a" transform="rotate(12 75 64)"/><path d="M42 44 Q38 36 32 38" fill="none" stroke-width="3"/><path d="M58 44 Q62 36 68 38" fill="none" stroke-width="3"/><line x1="42" y1="80" x2="38" y2="92"/><line x1="58" y1="80" x2="62" y2="92"/>`, 0);
}
function artMudflatLeech(){
   return sceneWrap(`<ellipse cx="50" cy="60" rx="20" ry="34" fill="#3d5a80"/><ellipse cx="50" cy="60" rx="20" ry="34" fill="#5f4632" opacity="0.35"/><circle cx="50" cy="32" r="4" fill="#2b2b28" stroke="none"/><path d="M50 90 Q40 80 50 70 Q60 80 50 90 Z" fill="#2b2b28" opacity="0.5"/>`, -4);
}
function artMoleScout(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="22" ry="18" fill="#5f4632"/><ellipse cx="50" cy="46" rx="12" ry="10" fill="#5f4632"/><path d="M40 40 L46 48 M56 40 L54 48 M46 48 L54 48" stroke="#2b2b28" stroke-width="2.5"/><path d="M42 44 Q38 36 32 38" fill="none" stroke-width="3"/><path d="M58 44 Q62 36 68 38" fill="none" stroke-width="3"/><line x1="42" y1="78" x2="36" y2="92"/><line x1="58" y1="78" x2="64" y2="92"/>`, 0);
}
function artBurrowHound(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="28" ry="18" fill="#2b2b28"/><ellipse cx="26" cy="54" rx="12" ry="10" fill="#2b2b28"/><path d="M16 48 L10 38 M20 46 L18 34" stroke-width="3"/><path d="M22 60 L36 58 M22 66 L38 66 M22 72 L36 70" stroke="#f4efe4" stroke-width="2.5"/><line x1="70" y1="78" x2="76" y2="90"/><line x1="58" y1="80" x2="60" y2="92"/>`, 0);
}
function artTunnelWarden(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="34" ry="24" fill="#5f4632"/><ellipse cx="50" cy="64" rx="34" ry="24" fill="#8a5a3a" opacity="0.3"/><ellipse cx="50" cy="42" rx="16" ry="13" fill="#5f4632"/><path d="M38 36 Q32 26 24 28" fill="none" stroke-width="3.5"/><path d="M62 36 Q68 26 76 28" fill="none" stroke-width="3.5"/><path d="M40 80 L32 96 M50 82 L48 98 M60 80 L68 96" stroke-width="4"/>`, 0);
}
function artWarrenScout(){
   return sceneWrap(`<ellipse cx="50" cy="60" rx="24" ry="20" fill="#5f4632"/><ellipse cx="50" cy="42" rx="13" ry="11" fill="#5f4632"/><path d="M38 36 L44 44 M62 36 L56 44 M44 44 L56 44" stroke="#2b2b28" stroke-width="2.5"/><path d="M40 38 Q35 28 27 30" fill="none" stroke-width="3"/><path d="M60 38 Q65 28 73 30" fill="none" stroke-width="3"/><path d="M20 62 Q10 58 12 46 M80 62 Q90 58 88 46" fill="none" stroke-width="2.5"/><line x1="40" y1="76" x2="34" y2="92"/><line x1="60" y1="76" x2="66" y2="92"/>`, 0);
}

/* The Warren's Ear's own monsters (warrensear-content.js) — Choir
(exaggerated ears, echo motifs) and the Ledger Vault (buried in
paperwork, continuing the Bureau's own bureaucracy joke one hub
deeper). Same mole silhouette vocabulary as every other Mudroot Warren
monster above. */
function artMoleCantor(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="50" cy="46" rx="13" ry="11" fill="#5f4632"/><path d="M42 42 Q38 34 32 36" fill="none" stroke-width="3"/><path d="M58 42 Q62 34 68 36" fill="none" stroke-width="3"/><path d="M44 46 Q50 42 56 46" fill="none" stroke="#2b2b28" stroke-width="2.5"/><circle cx="50" cy="70" r="4" fill="#d1a94e" stroke="none"/><path d="M50 66 Q56 60 62 64 M50 66 Q44 60 38 64" fill="none" stroke-width="2"/>`, 0);
}
function artEchoMole(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="22" ry="18" fill="#5f4632" opacity="0.7"/><ellipse cx="58" cy="58" rx="22" ry="18" fill="#5f4632" opacity="0.4"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M42 40 Q37 30 29 32" fill="none" stroke-width="3"/><path d="M58 40 Q63 30 71 32" fill="none" stroke-width="3"/><line x1="42" y1="78" x2="36" y2="92"/><line x1="58" y1="78" x2="64" y2="92"/>`, 0);
}
function artListeningSentry(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="50" cy="44" rx="14" ry="12" fill="#5f4632"/><path d="M38 38 Q28 30 24 40 Q30 42 38 38 Z" fill="#5f4632" stroke-width="2.5"/><path d="M62 38 Q72 30 76 40 Q70 42 62 38 Z" fill="#5f4632" stroke-width="2.5"/><circle cx="44" cy="46" r="1.6" fill="#2b2b28" stroke="none"/><circle cx="56" cy="46" r="1.6" fill="#2b2b28" stroke="none"/>`, 0);
}
function artArchivistMole(){
   return sceneWrap(`<ellipse cx="46" cy="66" rx="22" ry="16" fill="#5f4632"/><ellipse cx="46" cy="48" rx="12" ry="10" fill="#5f4632"/><path d="M38 44 Q34 36 28 38" fill="none" stroke-width="3"/><path d="M54 44 Q58 36 64 38" fill="none" stroke-width="3"/><rect x="60" y="52" width="20" height="26" fill="#f4efe4" stroke="#2b2b28" stroke-width="2" transform="rotate(8 70 65)"/><line x1="65" y1="58" x2="76" y2="60" stroke-width="1.5"/><line x1="64" y1="65" x2="75" y2="67" stroke-width="1.5"/><line x1="64" y1="72" x2="74" y2="74" stroke-width="1.5"/>`, 0);
}
function artVaultClerk(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="23" ry="17" fill="#5f4632"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632"/><path d="M42 41 Q38 33 32 35" fill="none" stroke-width="3"/><path d="M58 41 Q62 33 68 35" fill="none" stroke-width="3"/><rect x="66" y="46" width="14" height="14" fill="#b5453f" transform="rotate(-8 73 53)"/><line x1="73" y1="60" x2="73" y2="72" stroke-width="3"/>`, 0);
}
function artAuditorInChief(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="19" fill="#2b2b28"/><ellipse cx="50" cy="43" rx="13" ry="11" fill="#5f4632"/><path d="M41 39 Q36 30 29 32" fill="none" stroke-width="3.5"/><path d="M59 39 Q64 30 71 32" fill="none" stroke-width="3.5"/><line x1="72" y1="50" x2="82" y2="46" stroke="#b5453f" stroke-width="3"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}
/* Same gap-filling, class-gated pass as the zones above — 24 more
Warren's Ear regulars (12 Choir, 12 Ledger Vault), same mole-silhouette
vocabulary every Warren's Ear monster already uses. */
function artMoleChorister(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="50" cy="44" rx="14" ry="12" fill="#5f4632"/><path d="M40 40 Q34 30 24 32" fill="none" stroke-width="3.5"/><path d="M60 40 Q66 30 76 32" fill="none" stroke-width="3.5"/><circle cx="50" cy="44" r="2.5" fill="#d1a94e" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleBellRinger(){
   return sceneWrap(`<ellipse cx="50" cy="26" rx="18" ry="16" fill="#8a8477" opacity="0.5"/><ellipse cx="50" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M40 40 Q36 32 30 34" fill="none" stroke-width="3"/><path d="M60 40 Q64 32 70 34" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artMoleStepCaller(){
   return sceneWrap(`<ellipse cx="50" cy="58" rx="22" ry="15" fill="#5f4632"/><ellipse cx="50" cy="40" rx="11" ry="9" fill="#5f4632"/><path d="M40 36 Q36 28 30 30" fill="none" stroke-width="2.5"/><path d="M60 36 Q64 28 70 30" fill="none" stroke-width="2.5"/><line x1="40" y1="72" x2="30" y2="88" stroke-width="3"/><line x1="60" y1="72" x2="70" y2="88" stroke-width="3"/>`, 2);
}
function artMoleConductor(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="24" ry="17" fill="#2b2b28" opacity="0.8"/><ellipse cx="46" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><line x1="64" y1="54" x2="86" y2="44" stroke-width="2.5"/><line x1="40" y1="78" x2="34" y2="92"/>`, -1);
}
function artMoleDescantSinger(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.85"/><ellipse cx="50" cy="44" rx="12" ry="10" fill="#5f4632" opacity="0.85"/><path d="M40 40 Q36 32 30 34" fill="none" stroke-width="3"/><path d="M60 40 Q64 32 70 34" fill="none" stroke-width="3"/><circle cx="50" cy="64" r="20" fill="none" stroke="#d1a94e" stroke-width="1.5" opacity="0.4"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleHarmonyWeaver(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="23" ry="17" fill="#5f4632" opacity="0.6"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.6"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><path d="M30 64 Q50 56 70 64" fill="none" stroke="#b06a97" stroke-width="2" opacity="0.6"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleQuickStepDancer(){
   return sceneWrap(`<ellipse cx="50" cy="56" rx="21" ry="14" fill="#5f4632"/><ellipse cx="50" cy="38" rx="10" ry="8" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><line x1="40" y1="70" x2="24" y2="84" stroke-width="3"/><line x1="60" y1="70" x2="76" y2="86" stroke-width="3"/>`, 4);
}
function artMoleTapDancer(){
   return sceneWrap(`<ellipse cx="50" cy="90" rx="26" ry="5" fill="#2b2b28" opacity="0.3"/><ellipse cx="50" cy="60" rx="22" ry="16" fill="#5f4632"/><ellipse cx="50" cy="42" rx="11" ry="9" fill="#5f4632"/><path d="M40 38 Q36 30 30 32" fill="none" stroke-width="2.5"/><path d="M60 38 Q64 30 70 32" fill="none" stroke-width="2.5"/><line x1="40" y1="74" x2="34" y2="88"/><line x1="60" y1="74" x2="66" y2="88"/>`, 0);
}
function artMoleResonanceWarden(){
   return sceneWrap(`<circle cx="50" cy="60" r="36" fill="#b06a97" opacity="0.1"/><ellipse cx="50" cy="62" rx="23" ry="17" fill="#5f4632"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artMolePitchTuner(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><path d="M50 20 L48 36 M50 20 L52 36" stroke-width="2"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleSilentChorister(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.55"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.55"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleHymnCaster(){
   return sceneWrap(`<ellipse cx="50" cy="60" rx="23" ry="17" fill="#5f4632"/><ellipse cx="50" cy="41" rx="12" ry="10" fill="#5f4632"/><path d="M40 37 Q36 29 30 31" fill="none" stroke-width="3"/><path d="M60 37 Q64 29 70 31" fill="none" stroke-width="3"/><path d="M50 78 L46 90 L54 90 Z" fill="#b06a97" stroke="none"/><line x1="40" y1="74" x2="34" y2="88"/>`, 0);
}
function artMoleVaultGuard(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="18" fill="#5f4632"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M40 40 Q36 32 30 34" fill="none" stroke-width="3"/><path d="M60 40 Q64 32 70 34" fill="none" stroke-width="3"/><line x1="20" y1="30" x2="80" y2="30" stroke-width="4" opacity="0.4"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleStrongboxBearer(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="22" ry="16" fill="#5f4632" opacity="0.85"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632" opacity="0.85"/><rect x="36" y="58" width="28" height="18" fill="#8a5a3a"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/>`, 0);
}
function artMoleVaultRunner(){
   return sceneWrap(`<ellipse cx="50" cy="56" rx="21" ry="14" fill="#5f4632"/><ellipse cx="50" cy="38" rx="10" ry="8" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><line x1="40" y1="70" x2="26" y2="86" stroke-width="3"/><line x1="60" y1="70" x2="74" y2="88" stroke-width="3"/>`, 5);
}
function artMoleSealBreaker(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="46" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><circle cx="76" cy="52" r="8" fill="#b5453f" opacity="0.6"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleCipherClerk(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><path d="M44 44 L46 46 M54 44 L56 46" stroke="#d1a94e" stroke-width="1.5"/><line x1="40" y1="80" x2="34" y2="94"/>`, 0);
}
function artMoleSafecracker(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.75"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.75"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><circle cx="50" cy="45" r="2" fill="#d1a94e" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleLedgerRunner(){
   return sceneWrap(`<ellipse cx="50" cy="56" rx="21" ry="14" fill="#5f4632"/><ellipse cx="50" cy="38" rx="10" ry="8" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><rect x="60" y="48" width="10" height="8" fill="#f4efe4" transform="rotate(-10 65 52)"/><line x1="40" y1="70" x2="28" y2="86"/><line x1="60" y1="70" x2="72" y2="88"/>`, 4);
}
function artMoleStampDuelist(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="22" ry="17" fill="#5f4632"/><ellipse cx="46" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><rect x="62" y="48" width="8" height="8" fill="#b5453f" opacity="0.6"/><rect x="72" y="56" width="8" height="8" fill="#3d5a80" opacity="0.6"/>`, 0);
}
function artMoleNumberSeer(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.7"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.7"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><circle cx="50" cy="45" r="2" fill="#b06a97" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleVaultWarden(){
   return sceneWrap(`<circle cx="50" cy="60" r="36" fill="#3d5a80" opacity="0.12"/><ellipse cx="50" cy="62" rx="23" ry="17" fill="#5f4632"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleAccountTracer(){
   return sceneWrap(`<ellipse cx="50" cy="58" rx="22" ry="15" fill="#5f4632"/><ellipse cx="50" cy="40" rx="11" ry="9" fill="#5f4632"/><path d="M40 36 Q36 28 30 30" fill="none" stroke-width="2.5"/><path d="M60 36 Q64 28 70 30" fill="none" stroke-width="2.5"/><line x1="20" y1="72" x2="80" y2="72" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="40" y1="72" x2="34" y2="88"/>`, 0);
}
function artMoleSilentAuditor(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.5"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.5"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}

/* The Warren's Ear's own 2 zone-rares (ZONE_RARE_MONSTERS, content.js)
— same mole silhouette vocabulary, a musical-note flourish for the
Choir's unsungChorister and a crossed-out-paperwork flourish for the
Ledger Vault's misfiledAuditor. */
function artUnsungChorister(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="19" fill="#5f4632"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M41 40 Q36 31 29 33" fill="none" stroke-width="3.5"/><path d="M59 40 Q64 31 71 33" fill="none" stroke-width="3.5"/><circle cx="76" cy="40" r="3.5" fill="#d1a94e" stroke="none"/><line x1="79" y1="38" x2="79" y2="24" stroke-width="2"/><path d="M44 44 Q50 40 56 44" fill="none" stroke="#2b2b28" stroke-width="2.5"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}
function artMisfiledAuditor(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="19" fill="#5f4632"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M41 40 Q36 31 29 33" fill="none" stroke-width="3.5"/><path d="M59 40 Q64 31 71 33" fill="none" stroke-width="3.5"/><rect x="66" y="50" width="18" height="22" fill="#f4efe4" stroke="#2b2b28" stroke-width="2" transform="rotate(-8 75 61)"/><line x1="69" y1="56" x2="81" y2="68" stroke="#b5453f" stroke-width="2"/><line x1="81" y1="56" x2="69" y2="68" stroke="#b5453f" stroke-width="2"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}
function artTunnelMoleInformant(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="26" ry="19" fill="#5f4632"/><ellipse cx="50" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M40 42 Q34 32 25 34" fill="none" stroke-width="3.5"/><path d="M60 42 Q66 32 75 34" fill="none" stroke-width="3.5"/><path d="M44 46 L50 40 L56 46" stroke="#2b2b28" stroke-width="2.5" fill="none"/><line x1="40" y1="82" x2="32" y2="98"/><line x1="60" y1="82" x2="68" y2="98"/>`, 0);
}
function artSeniorClerk(){
   return sceneWrap(`<ellipse cx="48" cy="66" rx="26" ry="19" fill="#5f4632"/><ellipse cx="48" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M39 42 Q34 33 26 35" fill="none" stroke-width="3.5"/><path d="M57 42 Q62 33 70 35" fill="none" stroke-width="3.5"/><rect x="68" y="50" width="20" height="26" fill="#f4efe4" stroke="#2b2b28" stroke-width="2.5" transform="rotate(-6 78 63)"/><line x1="72" y1="58" x2="84" y2="59" stroke-width="1.6"/><line x1="72" y1="65" x2="84" y2="66" stroke-width="1.6"/>`, 0);
}

/* The Bureau's business moles (mudroot-content.js) — same mole
silhouette vocabulary as the 6 above, dressed in office trappings
(spectacles, a stack of papers, a stamp) instead of tunnel gear. */
function artMoleClerk(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="50" cy="46" rx="13" ry="11" fill="#5f4632"/><path d="M42 42 Q38 34 32 36" fill="none" stroke-width="3"/><path d="M58 42 Q62 34 68 36" fill="none" stroke-width="3"/><rect x="66" y="54" width="18" height="22" fill="#f4efe4" stroke="#2b2b28" stroke-width="2" transform="rotate(6 75 65)"/><line x1="70" y1="60" x2="80" y2="62" stroke-width="1.6"/><line x1="70" y1="66" x2="80" y2="68" stroke-width="1.6"/>`, 0);
}
function artMoleAuditor(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="24" ry="19" fill="#5f4632"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><circle cx="43" cy="44" r="5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><circle cx="57" cy="44" r="5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><line x1="48" y1="44" x2="52" y2="44" stroke-width="2"/><path d="M40 78 L34 92 M60 78 L66 92" stroke-width="3.5"/>`, 0);
}

/* Mudroot Warren's own 3 zone-rares (ZONE_RARE_MONSTERS, content.js) —
same mole silhouette vocabulary, bark-toned/overgrown for Root Cellar's
rootWarden, paper-themed for Bureau's unregisteredAuditor, and
elongated/ghosted for Mudflats' siltWalker. */
function artRootWarden(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="27" ry="20" fill="#5f4632"/><ellipse cx="50" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M40 42 Q34 32 25 34" fill="none" stroke-width="3.5"/><path d="M60 42 Q66 32 75 34" fill="none" stroke-width="3.5"/><path d="M30 60 Q24 54 28 46 M70 60 Q76 54 72 46" fill="none" stroke="#3f5c3f" stroke-width="3"/><line x1="40" y1="84" x2="34" y2="98"/><line x1="60" y1="84" x2="66" y2="98"/>`, 0);
}
function artUnregisteredAuditor(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="19" fill="#5f4632"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M41 40 Q36 31 29 33" fill="none" stroke-width="3.5"/><path d="M59 40 Q64 31 71 33" fill="none" stroke-width="3.5"/><rect x="68" y="50" width="16" height="20" fill="#f4efe4" stroke="#2b2b28" stroke-width="2" transform="rotate(10 76 60)"/><circle cx="76" cy="54" r="3" fill="none" stroke="#b5453f" stroke-width="1.6"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}
function artSiltWalker(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="17" fill="#5f4632" opacity="0.7"/><ellipse cx="50" cy="44" rx="12" ry="10" fill="#5f4632" opacity="0.7"/><path d="M40 40 Q35 32 27 34" fill="none" stroke-width="3" opacity="0.7"/><path d="M60 40 Q65 32 73 34" fill="none" stroke-width="3" opacity="0.7"/><line x1="38" y1="80" x2="30" y2="96" opacity="0.7"/><line x1="50" y1="82" x2="48" y2="98" opacity="0.7"/><line x1="62" y1="80" x2="70" y2="96" opacity="0.7"/>`, 0);
}
function artMoleNotary(){
   return sceneWrap(`<ellipse cx="46" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="46" cy="46" rx="13" ry="11" fill="#5f4632"/><path d="M38 42 Q34 34 28 36" fill="none" stroke-width="3"/><path d="M54 42 Q58 34 64 36" fill="none" stroke-width="3"/><rect x="68" y="46" width="14" height="14" fill="#b5453f" transform="rotate(-10 75 53)"/><line x1="75" y1="60" x2="75" y2="72" stroke-width="3"/>`, 0);
}
/* Same gap-filling, class-gated pass as the Gnometropolis districts
above — 35 more Mudroot Warren regulars (12 Root Cellar, 12 Mudflats,
11 Bureau), same mole-silhouette vocabulary every Mudroot Warren
monster already uses. */
function artRootCellarBrawler(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="28" ry="19" fill="#5f4632"/><ellipse cx="50" cy="44" rx="14" ry="11" fill="#5f4632"/><path d="M40 40 Q36 32 30 34" fill="none" stroke-width="3"/><path d="M60 40 Q64 32 70 34" fill="none" stroke-width="3"/><line x1="20" y1="30" x2="80" y2="30" stroke-width="4" opacity="0.5"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artTunnelBraceMole(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="26" ry="18" fill="#5f4632" opacity="0.85"/><ellipse cx="50" cy="46" rx="13" ry="10" fill="#5f4632" opacity="0.85"/><line x1="20" y1="20" x2="20" y2="90" stroke-width="3"/><line x1="80" y1="20" x2="80" y2="90" stroke-width="3"/><line x1="42" y1="80" x2="36" y2="94"/><line x1="58" y1="80" x2="64" y2="94"/>`, 0);
}
function artRootKickerMole(){
   return sceneWrap(`<ellipse cx="46" cy="60" rx="24" ry="17" fill="#5f4632"/><ellipse cx="46" cy="42" rx="12" ry="10" fill="#5f4632"/><path d="M38 38 Q34 30 28 32" fill="none" stroke-width="3"/><path d="M54 38 Q58 30 64 32" fill="none" stroke-width="3"/><line x1="66" y1="74" x2="86" y2="68" stroke-width="4"/>`, -2);
}
function artPackedEarthMole(){
   return sceneWrap(`<ellipse cx="50" cy="70" rx="30" ry="12" fill="#2b2b28" opacity="0.3"/><ellipse cx="50" cy="60" rx="26" ry="18" fill="#5f4632"/><ellipse cx="50" cy="42" rx="13" ry="11" fill="#5f4632"/><path d="M40 38 Q36 30 30 32" fill="none" stroke-width="3"/><path d="M60 38 Q64 30 70 32" fill="none" stroke-width="3"/><line x1="40" y1="76" x2="36" y2="90" stroke-width="4"/><line x1="60" y1="76" x2="64" y2="90" stroke-width="4"/>`, 0);
}
function artQuickClawMole(){
   return sceneWrap(`<ellipse cx="44" cy="62" rx="22" ry="16" fill="#5f4632"/><ellipse cx="44" cy="44" rx="11" ry="9" fill="#5f4632"/><path d="M36 40 Q32 32 26 34" fill="none" stroke-width="2.5"/><path d="M52 40 Q56 32 62 34" fill="none" stroke-width="2.5"/><line x1="64" y1="56" x2="84" y2="50" stroke-width="3"/><line x1="64" y1="64" x2="82" y2="70" stroke-width="3"/>`, 2);
}
function artNarrowShaftMole(){
   return sceneWrap(`<line x1="26" y1="14" x2="26" y2="94" stroke-width="3"/><line x1="74" y1="14" x2="74" y2="94" stroke-width="3"/><ellipse cx="50" cy="62" rx="20" ry="16" fill="#5f4632"/><ellipse cx="50" cy="44" rx="10" ry="9" fill="#5f4632"/><line x1="40" y1="76" x2="36" y2="90"/><line x1="60" y1="76" x2="64" y2="90"/>`, 0);
}
function artLooseSoilMole(){
   return sceneWrap(`<ellipse cx="50" cy="80" rx="34" ry="8" fill="#a97c53" opacity="0.4"/><ellipse cx="50" cy="62" rx="25" ry="17" fill="#5f4632"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artRootBladeMole(){
   return sceneWrap(`<ellipse cx="44" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="44" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M36 40 Q32 32 26 34" fill="none" stroke-width="3"/><path d="M52 40 Q56 32 62 34" fill="none" stroke-width="3"/><path d="M64 56 L88 48 L86 56 L66 62 Z" fill="#b9b3a4"/><line x1="40" y1="78" x2="34" y2="92"/>`, -1);
}
function artDeepListeningMole(){
   return sceneWrap(`<ellipse cx="50" cy="62" rx="24" ry="17" fill="#5f4632" opacity="0.8"/><ellipse cx="50" cy="42" rx="14" ry="12" fill="#5f4632" opacity="0.8"/><path d="M36 36 Q30 26 20 28" fill="none" stroke-width="3.5"/><path d="M64 36 Q70 26 80 28" fill="none" stroke-width="3.5"/><circle cx="50" cy="42" r="2" fill="#d1a94e" stroke="none"/><line x1="42" y1="78" x2="36" y2="92"/><line x1="58" y1="78" x2="64" y2="92"/>`, 0);
}
function artRootWardedMole(){
   return sceneWrap(`<circle cx="50" cy="60" r="36" fill="#d1a94e" opacity="0.12"/><ellipse cx="50" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artSilentDiggerMole(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="17" fill="#5f4632" opacity="0.65"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.65"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artCellarConjurorMole(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><circle cx="50" cy="84" r="4" fill="#b06a97" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMudflatBrawler(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="30" ry="20" fill="#5f4632"/><ellipse cx="50" cy="46" rx="15" ry="12" fill="#5f4632"/><ellipse cx="50" cy="66" rx="30" ry="20" fill="#8a5a3a" opacity="0.3"/><path d="M40 42 Q36 34 30 36" fill="none" stroke-width="3.5"/><path d="M60 42 Q64 34 70 36" fill="none" stroke-width="3.5"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}
function artSiltPackedMole(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="28" ry="19" fill="#5f4632"/><ellipse cx="50" cy="64" rx="28" ry="19" fill="#b9b3a4" opacity="0.3"/><ellipse cx="50" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M40 40 Q36 32 30 34" fill="none" stroke-width="3"/><path d="M60 40 Q64 32 70 34" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artBogStriderMole(){
   return sceneWrap(`<ellipse cx="50" cy="90" rx="36" ry="6" fill="#3d5a80" opacity="0.25"/><ellipse cx="50" cy="58" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="40" rx="12" ry="10" fill="#5f4632"/><path d="M40 36 Q36 28 30 30" fill="none" stroke-width="3"/><path d="M60 36 Q64 28 70 30" fill="none" stroke-width="3"/><line x1="40" y1="74" x2="32" y2="92"/><line x1="60" y1="74" x2="68" y2="92"/>`, 0);
}
function artTideClubMole(){
   return sceneWrap(`<ellipse cx="44" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="44" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M36 39 Q32 31 26 33" fill="none" stroke-width="3"/><path d="M52 39 Q56 31 62 33" fill="none" stroke-width="3"/><rect x="62" y="52" width="10" height="26" fill="#3d5a80" opacity="0.7" transform="rotate(20 67 65)"/><line x1="40" y1="78" x2="34" y2="92"/>`, -1);
}
function artReedMaskedMole(){
   return sceneWrap(`<line x1="24" y1="20" x2="20" y2="90" stroke-width="2" opacity="0.5"/><line x1="34" y1="16" x2="30" y2="90" stroke-width="2" opacity="0.5"/><line x1="70" y1="16" x2="74" y2="90" stroke-width="2" opacity="0.5"/><ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.85"/><ellipse cx="50" cy="46" rx="11" ry="9" fill="#5f4632" opacity="0.85"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artSiltSlickMole(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="25" ry="17" fill="#5f4632" opacity="0.6"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.6"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><ellipse cx="50" cy="64" rx="25" ry="17" fill="none" stroke="#f4efe4" stroke-width="1.5" opacity="0.4"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artTideRunnerMole(){
   return sceneWrap(`<ellipse cx="50" cy="58" rx="22" ry="15" fill="#5f4632"/><ellipse cx="50" cy="40" rx="11" ry="9" fill="#5f4632"/><path d="M40 36 Q36 28 30 30" fill="none" stroke-width="2.5"/><path d="M60 36 Q64 28 70 30" fill="none" stroke-width="2.5"/><line x1="40" y1="72" x2="26" y2="88" stroke-width="3"/><line x1="60" y1="72" x2="74" y2="90" stroke-width="3"/>`, 3);
}
function artMudskipperMole(){
   return sceneWrap(`<ellipse cx="50" cy="86" rx="30" ry="6" fill="#3d5a80" opacity="0.2"/><ellipse cx="50" cy="56" rx="22" ry="15" fill="#5f4632"/><ellipse cx="50" cy="38" rx="11" ry="9" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><line x1="40" y1="70" x2="30" y2="84"/><line x1="60" y1="70" x2="70" y2="84"/>`, 4);
}
function artBogWardedMole(){
   return sceneWrap(`<circle cx="50" cy="60" r="36" fill="#3d5a80" opacity="0.1"/><ellipse cx="50" cy="62" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="43" rx="12" ry="10" fill="#5f4632"/><path d="M40 39 Q36 31 30 33" fill="none" stroke-width="3"/><path d="M60 39 Q64 31 70 33" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artReedCharmMole(){
   return sceneWrap(`<line x1="24" y1="20" x2="20" y2="90" stroke-width="2" opacity="0.5"/><line x1="76" y1="20" x2="80" y2="90" stroke-width="2" opacity="0.5"/><ellipse cx="50" cy="64" rx="23" ry="16" fill="#5f4632"/><ellipse cx="50" cy="46" rx="12" ry="10" fill="#5f4632"/><circle cx="50" cy="46" r="2.5" fill="#b06a97" stroke="none"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artSiltStepMole(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="24" ry="16" fill="#5f4632" opacity="0.7"/><ellipse cx="50" cy="48" rx="12" ry="10" fill="#5f4632" opacity="0.7"/><path d="M40 44 Q36 36 30 38" fill="none" stroke-width="3"/><path d="M60 44 Q64 36 70 38" fill="none" stroke-width="3"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artTideConjurorMole(){
   return sceneWrap(`<ellipse cx="50" cy="58" rx="24" ry="17" fill="#5f4632"/><ellipse cx="50" cy="40" rx="12" ry="10" fill="#5f4632"/><path d="M40 36 Q36 28 30 30" fill="none" stroke-width="3"/><path d="M60 36 Q64 28 70 30" fill="none" stroke-width="3"/><circle cx="50" cy="82" r="5" fill="#3d5a80" opacity="0.5" stroke="none"/><line x1="40" y1="74" x2="34" y2="90"/><line x1="60" y1="74" x2="66" y2="90"/>`, 0);
}
function artMoleEnforcer(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="24" ry="18" fill="#5f4632"/><ellipse cx="46" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><rect x="68" y="44" width="14" height="16" fill="#b5453f" transform="rotate(-8 75 52)"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleBailiff(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="16" fill="#5f4632" opacity="0.85"/><ellipse cx="50" cy="46" rx="11" ry="9" fill="#5f4632" opacity="0.85"/><path d="M40 42 Q36 34 30 36" fill="none" stroke-width="3"/><path d="M60 42 Q64 34 70 36" fill="none" stroke-width="3"/><line x1="40" y1="78" x2="34" y2="92"/><line x1="60" y1="78" x2="66" y2="92"/>`, 0);
}
function artMoleCollectionsRunner(){
   return sceneWrap(`<ellipse cx="50" cy="56" rx="20" ry="14" fill="#5f4632"/><ellipse cx="50" cy="38" rx="10" ry="8" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><line x1="40" y1="70" x2="26" y2="86" stroke-width="3"/><line x1="60" y1="70" x2="74" y2="88" stroke-width="3"/>`, 5);
}
function artMoleRepoAgent(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="24" ry="18" fill="#5f4632"/><ellipse cx="46" cy="44" rx="13" ry="11" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><rect x="66" y="48" width="16" height="12" fill="#f4efe4" transform="rotate(14 74 54)"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleFilingClerk(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="17" fill="#5f4632"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><rect x="38" y="58" width="24" height="5" fill="#f4efe4" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleCourier(){
   return sceneWrap(`<ellipse cx="50" cy="56" rx="21" ry="14" fill="#5f4632"/><ellipse cx="50" cy="38" rx="10" ry="8" fill="#5f4632"/><path d="M40 34 Q36 26 30 28" fill="none" stroke-width="2.5"/><path d="M60 34 Q64 26 70 28" fill="none" stroke-width="2.5"/><rect x="60" y="48" width="10" height="8" fill="#f4efe4" transform="rotate(-10 65 52)"/><line x1="40" y1="70" x2="28" y2="86"/><line x1="60" y1="70" x2="72" y2="88"/>`, 4);
}
function artMoleShortcutTaker(){
   return sceneWrap(`<ellipse cx="50" cy="60" rx="22" ry="16" fill="#5f4632" opacity="0.75"/><ellipse cx="50" cy="42" rx="11" ry="9" fill="#5f4632" opacity="0.75"/><path d="M40 38 Q36 30 30 32" fill="none" stroke-width="2.5"/><path d="M60 38 Q64 30 70 32" fill="none" stroke-width="2.5"/><line x1="40" y1="74" x2="30" y2="90" stroke-width="3"/><line x1="60" y1="74" x2="72" y2="92" stroke-width="3"/>`, 0);
}
function artMoleLetterOpener(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="22" ry="17" fill="#5f4632"/><ellipse cx="46" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><path d="M64 54 L86 48 L84 54 L66 58 Z" fill="#b9b3a4"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleRecordsKeeper(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="17" fill="#5f4632" opacity="0.7"/><ellipse cx="50" cy="45" rx="13" ry="11" fill="#5f4632" opacity="0.7"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><rect x="40" y="38" width="20" height="5" fill="#d1a94e" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artMoleComplianceOfficer(){
   return sceneWrap(`<circle cx="50" cy="58" r="36" fill="#b06a97" opacity="0.1"/><ellipse cx="50" cy="60" rx="22" ry="16" fill="#5f4632"/><ellipse cx="50" cy="42" rx="11" ry="9" fill="#5f4632"/><path d="M40 38 Q36 30 30 32" fill="none" stroke-width="3"/><path d="M60 38 Q64 30 70 32" fill="none" stroke-width="3"/><line x1="40" y1="74" x2="34" y2="88"/><line x1="60" y1="74" x2="66" y2="88"/>`, 0);
}
function artMoleAppealsProcessor(){
   return sceneWrap(`<ellipse cx="46" cy="62" rx="22" ry="17" fill="#5f4632"/><ellipse cx="46" cy="44" rx="12" ry="10" fill="#5f4632"/><path d="M38 40 Q34 32 28 34" fill="none" stroke-width="3"/><path d="M54 40 Q58 32 64 34" fill="none" stroke-width="3"/><rect x="66" y="46" width="16" height="14" fill="#b5453f" opacity="0.6" transform="rotate(-6 74 53)"/><line x1="40" y1="78" x2="34" y2="92"/>`, 0);
}
function artMoleNightAuditor(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="22" ry="17" fill="#5f4632" opacity="0.6"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#5f4632" opacity="0.6"/><path d="M40 41 Q36 33 30 35" fill="none" stroke-width="3"/><path d="M60 41 Q64 33 70 35" fill="none" stroke-width="3"/><circle cx="50" cy="45" r="2" fill="#d1a94e" stroke="none"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}

/* The Ember Warren's mole rig (emberwarren-content.js) -- same mole
silhouette vocabulary as every warren above, dressed in forge/machine
trappings (sparks, bellows, cogs, steam) instead of tunnel or office
gear. #b5453f doubles as ember-glow here same as it does as a red pen/
stamp accent elsewhere -- no new palette color introduced. */
function artForgeMole(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="25" ry="18" fill="#5f4632"/><ellipse cx="50" cy="47" rx="13" ry="11" fill="#5f4632"/><path d="M41 43 Q36 34 28 36" fill="none" stroke-width="3.5"/><path d="M59 43 Q64 34 72 36" fill="none" stroke-width="3.5"/><circle cx="30" cy="30" r="2" fill="#b5453f" stroke="none"/><circle cx="70" cy="26" r="2.4" fill="#d1a94e" stroke="none"/><circle cx="60" cy="20" r="1.8" fill="#b5453f" stroke="none"/><line x1="40" y1="82" x2="34" y2="96"/><line x1="60" y1="82" x2="66" y2="96"/>`, 0);
}

/* The Ember Warren's own 2 zone-rares (ZONE_RARE_MONSTERS, content.js)
— same mole silhouette vocabulary, molten/ember tones for the
Foundry's emberForgedWretch and a mechanical cog flourish for the
Gearworks' looseCogIncarnate. */
function artEmberForgedWretch(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="26" ry="19" fill="#5f4632"/><ellipse cx="50" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M40 42 Q34 32 25 34" fill="none" stroke-width="3.5"/><path d="M60 42 Q66 32 75 34" fill="none" stroke-width="3.5"/><circle cx="36" cy="28" r="2.4" fill="#b5453f" stroke="none"/><circle cx="64" cy="24" r="2" fill="#d1a94e" stroke="none"/><circle cx="50" cy="18" r="1.8" fill="#b5453f" stroke="none"/><path d="M38 60 Q50 54 62 60" fill="none" stroke="#b5453f" stroke-width="2.5"/><line x1="40" y1="84" x2="34" y2="98"/><line x1="60" y1="84" x2="66" y2="98"/>`, 0);
}
function artLooseCogIncarnate(){
   return sceneWrap(`<ellipse cx="50" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="50" cy="45" rx="13" ry="11" fill="#5f4632"/><path d="M41 41 Q36 32 28 34" fill="none" stroke-width="3.5"/><path d="M59 41 Q64 32 72 34" fill="none" stroke-width="3.5"/><circle cx="70" cy="56" r="8" fill="none" stroke="#8a8477" stroke-width="2.5"/><circle cx="70" cy="56" r="2.5" fill="#8a8477" stroke="none"/><path d="M70 48 L70 44 M70 64 L70 68 M62 56 L58 56 M78 56 L82 56" stroke="#8a8477" stroke-width="2"/><line x1="40" y1="80" x2="34" y2="94"/><line x1="60" y1="80" x2="66" y2="94"/>`, 0);
}
function artBellowsMole(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="27" ry="17" fill="#5f4632"/><ellipse cx="50" cy="47" rx="14" ry="12" fill="#5f4632"/><path d="M40 43 Q35 34 27 36" fill="none" stroke-width="3.5"/><path d="M60 43 Q65 34 73 36" fill="none" stroke-width="3.5"/><ellipse cx="38" cy="54" rx="6" ry="5" fill="#5f4632" opacity="0.8"/><ellipse cx="62" cy="54" rx="6" ry="5" fill="#5f4632" opacity="0.8"/><path d="M50 30 Q56 20 50 12 Q44 20 50 30" fill="none" stroke="#b5453f" stroke-width="2" opacity="0.6"/>`, 0);
}
function artSlagHauler(){
   return sceneWrap(`<rect x="60" y="70" width="26" height="16" fill="#8a8477"/><circle cx="66" cy="88" r="5" fill="none" stroke-width="2.5"/><circle cx="80" cy="88" r="5" fill="none" stroke-width="2.5"/><path d="M64 74 L74 74 L70 66 Z" fill="#b5453f"/><ellipse cx="38" cy="66" rx="24" ry="18" fill="#5f4632"/><ellipse cx="38" cy="47" rx="13" ry="11" fill="#5f4632"/><path d="M30 43 Q25 34 17 36" fill="none" stroke-width="3.5"/><path d="M46 43 Q51 34 59 36" fill="none" stroke-width="3.5"/><line x1="60" y1="66" x2="46" y2="70" stroke-width="3"/>`, 0);
}
function artCogFitter(){
   return sceneWrap(`<ellipse cx="46" cy="64" rx="24" ry="18" fill="#5f4632"/><ellipse cx="46" cy="45" rx="13" ry="11" fill="#5f4632"/><path d="M38 41 Q33 32 25 34" fill="none" stroke-width="3.5"/><path d="M54 41 Q59 32 67 34" fill="none" stroke-width="3.5"/><circle cx="76" cy="58" r="11" fill="none" stroke="#d1a94e" stroke-width="3"/><circle cx="76" cy="58" r="4" fill="#d1a94e" stroke="none"/><line x1="76" y1="45" x2="76" y2="49" stroke="#d1a94e" stroke-width="2.5"/><line x1="76" y1="67" x2="76" y2="71" stroke="#d1a94e" stroke-width="2.5"/><line x1="63" y1="58" x2="67" y2="58" stroke="#d1a94e" stroke-width="2.5"/><line x1="85" y1="58" x2="89" y2="58" stroke="#d1a94e" stroke-width="2.5"/>`, 0);
}
function artPressureMole(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="25" ry="17" fill="#5f4632"/><ellipse cx="50" cy="48" rx="13" ry="11" fill="#5f4632"/><path d="M41 44 Q36 35 28 37" fill="none" stroke-width="3.5"/><path d="M59 44 Q64 35 72 37" fill="none" stroke-width="3.5"/><path d="M68 60 Q76 54 74 44" fill="none" stroke="#b9b3a4" stroke-width="2.5" opacity="0.8"/><path d="M74 50 Q82 42 78 30" fill="none" stroke="#f4efe4" stroke-width="2" opacity="0.6"/>`, 0);
}
function artLineRunner(){
   return sceneWrap(`<ellipse cx="46" cy="66" rx="22" ry="16" fill="#5f4632"/><ellipse cx="46" cy="48" rx="12" ry="10" fill="#5f4632"/><path d="M39 45 Q34 37 27 39" fill="none" stroke-width="3"/><path d="M53 45 Q58 37 65 39" fill="none" stroke-width="3"/><line x1="70" y1="56" x2="86" y2="52" stroke="#8a8477" stroke-width="2"/><line x1="70" y1="64" x2="86" y2="60" stroke="#8a8477" stroke-width="2"/><line x1="70" y1="72" x2="86" y2="68" stroke="#8a8477" stroke-width="2"/>`, 0);
}

/* Quest12's own two rare-hunt bosses (emberwarren-content.js) — the
first pair of monsters in this game with a 'debuff' skill (see
state.playerStatusEffect's own comment, core.js), so both get a bigger,
more distinct silhouette than a regular zone mole, same "boss reads as
a step up" treatment as gnomeCommander/tunnelWarden/etc. The foreman
carries a clipboard (ties Gearworks back to its own "precision" theme);
the quartermaster is dressed exactly like the Bureau's own business
moles (art.js's artMoleClerk/artMoleAuditor, above) on purpose — same
silhouette, since this IS one of them, just with the paper trail
finally catching up. */
function artGearworksForeman(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="30" ry="21" fill="#5f4632"/><ellipse cx="50" cy="45" rx="15" ry="13" fill="#5f4632"/><path d="M40 40 Q34 30 24 32" fill="none" stroke-width="4"/><path d="M60 40 Q66 30 76 32" fill="none" stroke-width="4"/><rect x="68" y="52" width="16" height="22" fill="#f4efe4" stroke="#2b2b28" stroke-width="2" transform="rotate(8 76 63)"/><line x1="71" y1="58" x2="81" y2="60" stroke-width="1.6"/><line x1="71" y1="64" x2="81" y2="66" stroke-width="1.6"/><rect x="18" y="60" width="14" height="20" fill="#8a8477" transform="rotate(-10 25 70)"/><circle cx="58" cy="26" r="2.4" fill="#d1a94e" stroke="none"/>`, 0);
}
function artBureauQuartermaster(){
   return sceneWrap(`<ellipse cx="50" cy="66" rx="28" ry="20" fill="#5f4632"/><ellipse cx="50" cy="44" rx="14" ry="12" fill="#5f4632"/><circle cx="43" cy="44" r="5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><circle cx="57" cy="44" r="5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><line x1="48" y1="44" x2="52" y2="44" stroke-width="2"/><rect x="66" y="50" width="18" height="24" fill="#f4efe4" stroke="#2b2b28" stroke-width="2.5" transform="rotate(-6 75 62)"/><line x1="70" y1="56" x2="82" y2="57" stroke-width="1.6"/><line x1="70" y1="63" x2="82" y2="64" stroke-width="1.6"/><line x1="70" y1="70" x2="82" y2="71" stroke-width="1.6"/><line x1="40" y1="80" x2="34" y2="94" stroke-width="3.5"/><line x1="60" y1="80" x2="66" y2="94" stroke-width="3.5"/>`, 0);
}

/* Quest13-15's own escalating arc, "harder" bosses by explicit request —
same mole silhouette vocabulary throughout, scaled up (wider bodies,
thicker strokes) so each one reads as a step above the quest9-12 roster
without needing a whole new visual language. quenchMaster (Foundry)
introduces freeze via a quenching-trough motif; the Ledger Committee
(committeeAuditor/vaultKeeper) and the Mole Council
(tunnelCaptain/foundryMarshal/warrenMother) are the two new gauntlets
(gauntlet.js) — warrenMother is deliberately the largest silhouette in
the game, mirroring how gnomeKing (Act 1's own finale) reads bigger than
every guard before it. */
function artQuenchMaster(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="30" ry="20" fill="#5f4632"/><ellipse cx="50" cy="46" rx="15" ry="13" fill="#5f4632"/><path d="M40 42 Q34 32 24 34" fill="none" stroke-width="4"/><path d="M60 42 Q66 32 76 34" fill="none" stroke-width="4"/><rect x="14" y="70" width="34" height="18" fill="#375270" opacity="0.55" transform="translate(0,-4)"/><path d="M18 68 Q26 58 34 68" fill="none" stroke="#b9b3a4" stroke-width="2.5" opacity="0.7"/><circle cx="66" cy="30" r="2.2" fill="#b5453f" stroke="none"/>`, 0);
}
function artCommitteeAuditor(){
   return sceneWrap(`<ellipse cx="48" cy="66" rx="27" ry="19" fill="#5f4632"/><ellipse cx="48" cy="45" rx="14" ry="12" fill="#5f4632"/><circle cx="41" cy="45" r="5.5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><circle cx="55" cy="45" r="5.5" fill="none" stroke="#2b2b28" stroke-width="2.5"/><line x1="46.5" y1="45" x2="49.5" y2="45" stroke-width="2"/><rect x="68" y="48" width="18" height="26" fill="#f4efe4" stroke="#2b2b28" stroke-width="2.5" transform="rotate(5 77 61)"/><line x1="72" y1="55" x2="83" y2="56" stroke-width="1.6"/><line x1="72" y1="62" x2="83" y2="63" stroke-width="1.6"/><line x1="72" y1="69" x2="83" y2="70" stroke-width="1.6"/>`, 0);
}
function artVaultKeeper(){
   return sceneWrap(`<rect x="10" y="30" width="30" height="60" fill="#8a5a3a"/><circle cx="25" cy="60" r="7" fill="none" stroke="#d1a94e" stroke-width="3"/><circle cx="25" cy="60" r="2" fill="#d1a94e" stroke="none"/><ellipse cx="62" cy="68" rx="28" ry="20" fill="#5f4632"/><ellipse cx="62" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M53 42 Q48 33 39 35" fill="none" stroke-width="4"/><path d="M71 42 Q76 33 85 35" fill="none" stroke-width="4"/><circle cx="78" cy="30" r="2.2" fill="#d1a94e" stroke="none"/>`, 0);
}
function artTunnelCaptain(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="28" ry="19" fill="#5f4632"/><ellipse cx="50" cy="46" rx="14" ry="12" fill="#5f4632"/><path d="M40 42 Q34 32 24 34" fill="none" stroke-width="4"/><path d="M60 42 Q66 32 76 34" fill="none" stroke-width="4"/><path d="M30 56 L18 52 M30 62 L16 62 M30 68 L18 74" stroke="#8a8477" stroke-width="2.5"/><circle cx="66" cy="30" r="2" fill="#d1a94e" stroke="none"/>`, 0);
}
function artFoundryMarshal(){
   return sceneWrap(`<ellipse cx="50" cy="68" rx="29" ry="20" fill="#5f4632"/><ellipse cx="50" cy="46" rx="15" ry="13" fill="#5f4632"/><path d="M40 42 Q34 32 24 34" fill="none" stroke-width="4"/><path d="M60 42 Q66 32 76 34" fill="none" stroke-width="4"/><circle cx="34" cy="60" r="2.4" fill="#b5453f" stroke="none"/><circle cx="66" cy="58" r="2" fill="#d1a94e" stroke="none"/><circle cx="50" cy="76" r="2.2" fill="#b5453f" stroke="none"/><path d="M50 26 Q58 14 50 2 Q42 14 50 26" fill="none" stroke="#b5453f" stroke-width="3" opacity="0.7" transform="translate(0,22)"/>`, 0);
}
function artWarrenMother(){
   return sceneWrap(`<ellipse cx="50" cy="72" rx="38" ry="24" fill="#2b2b28"/><ellipse cx="50" cy="46" rx="18" ry="15" fill="#2b2b28"/><path d="M36 40 Q28 26 14 29" fill="none" stroke-width="5"/><path d="M64 40 Q72 26 86 29" fill="none" stroke-width="5"/><circle cx="42" cy="46" r="4" fill="#d1a94e" stroke="none"/><circle cx="58" cy="46" r="4" fill="#d1a94e" stroke="none"/><path d="M20 82 Q10 90 8 100 M80 82 Q90 90 92 100 M50 96 Q50 106 50 112" stroke="#5f4632" stroke-width="3" fill="none"/>`, 0);
}

/* The Crystal City's own roster (crystalcity-content.js) — deliberately
NOT the mole silhouette every other Act 2 monster has used up to now.
Angular, faceted shapes instead of soft mole-ellipses signal "this is
somewhere new" at a glance, same reasoning the Ember Warren's own
forge-heat accents used one step earlier, just a bigger visual swing
this time since it's a genuinely new area, not another warren. */
function artCrystalSentinel(){
   return sceneWrap(`<path d="M50 20 L74 46 L62 82 L38 82 L26 46 Z" fill="#3d5a80" opacity="0.85"/><path d="M50 20 L74 46 L50 52 Z" fill="#f4efe4" opacity="0.5"/><path d="M50 20 L26 46 L50 52 Z" fill="#8a8477" opacity="0.4"/><circle cx="50" cy="52" r="4" fill="#d1a94e" stroke="none"/><line x1="38" y1="82" x2="34" y2="96" stroke-width="3"/><line x1="62" y1="82" x2="66" y2="96" stroke-width="3"/>`, 0);
}
function artGeodeCrawler(){
   return sceneWrap(`<path d="M18 78 L34 56 L50 66 L66 52 L84 78 Z" fill="#8a8477"/><path d="M30 74 L36 62 L44 70 Z" fill="#b06a97" opacity="0.8"/><path d="M52 70 L60 58 L68 68 Z" fill="#f4efe4" opacity="0.7"/><circle cx="40" cy="74" r="2" fill="#d1a94e" stroke="none"/><circle cx="60" cy="72" r="2" fill="#d1a94e" stroke="none"/>`, 0);
}

/* ---------------- Act 3: the Prism Depths — Embercrypt ---------------- */
/* Every Act 3 creature shares one "Lucent-made" visual family — the
same angular/faceted vocabulary artCrystalSentinel/artGeodeCrawler
above introduced for Crystal City, never the gnome (Act 1) or mole
(Act 2) silhouettes — with each dungeon just varying the palette for
its own theme. Embercrypt's is ember red/orange over the same cut-
crystal shapes, like something still hot behind the facets. */
function artSlagBoundHusk(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477"/><path d="M50 14 L74 42 L50 50 Z" fill="#b5453f" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#c97b3d" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#d1a94e" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artAshVeiledWatcher(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.85"/><circle cx="42" cy="44" r="4.5" fill="#b5453f" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#c97b3d" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artCinderHound(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.8"/><path d="M38 54 L44 44 L52 54 Z" fill="#b5453f" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#c97b3d" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#d1a94e" stroke="none"/>`, 0);
}
/* The Emberwright — Embercrypt's own boss, bigger and more layered than
the 3 regulars above, same palette with a brighter forge-core center
to read as "still burning" at a glance. */
function artEmberwright(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.8"/><path d="M50 8 L80 40 L50 50 Z" fill="#b5453f" opacity="0.75"/><path d="M50 8 L20 40 L50 50 Z" fill="#c97b3d" opacity="0.65"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#d1a94e" stroke="none"/><circle cx="50" cy="50" r="3" fill="#f4efe4" stroke="none"/>`, 0);
}

/* Frostvault's own creatures — same Lucent angular family, ice
blue/white over the same shapes Embercrypt used ember red/orange for. */
function artGlassStillCustodian(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#3d5a80" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#f4efe4" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#f4efe4" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artRimeCrustedDrifter(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#3d5a80" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#f4efe4" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artFrostboundArchivist(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#3d5a80" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#f4efe4" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#f4efe4" stroke="none"/>`, 0);
}
/* The Stillglass Warden — Frostvault's own boss, bigger/more layered
than the 3 regulars above, same shape artEmberwright uses with a cold
white-blue core instead of a forge-orange one. */
function artStillglassWarden(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#3d5a80" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#f4efe4" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#f4efe4" stroke="none"/><circle cx="50" cy="50" r="3" fill="#3d5a80" stroke="none"/>`, 0);
}

/* Stormreach's own creatures — same Lucent angular family, storm
purple/yellow over the same shapes. */
function artChargeSplitSentry(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#5a4a8a" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#d1a94e" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#d1a94e" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artWindwornHerald(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#5a4a8a" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#d1a94e" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artStormTideWalker(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#5a4a8a" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#d1a94e" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#d1a94e" stroke="none"/>`, 0);
}
/* The Unanswered Herald — Stormreach's own boss, same bigger/layered
shape as the other two dungeon bosses, storm purple/yellow core. */
function artUnansweredHerald(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#5a4a8a" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#d1a94e" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#d1a94e" stroke="none"/><circle cx="50" cy="50" r="3" fill="#f4efe4" stroke="none"/>`, 0);
}

/* Verdant Hollow's own creatures (Act 3, wave 2) — same Lucent angular
family, forest green/moss-olive over the same shapes the first wave
used. */
function artBrambleBoundSentinel(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#4a7a4a" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#8ba23f" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#8ba23f" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artSeedCaster(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#4a7a4a" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#8ba23f" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artMossGrownCaretaker(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#4a7a4a" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#8ba23f" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#8ba23f" stroke="none"/>`, 0);
}
/* The Rootbound Warden — Verdant Hollow's own boss, same bigger/layered
shape as every other dungeon boss, forest green/moss core. */
function artRootboundWarden(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#4a7a4a" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#8ba23f" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#8ba23f" stroke="none"/><circle cx="50" cy="50" r="3" fill="#4a7a4a" stroke="none"/>`, 0);
}

/* Duskward's own creatures (Act 3, wave 2) — same Lucent angular
family, shadow-violet/pale lavender over the same shapes. */
function artHollowEyedWatchman(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#3a2f52" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#9c8ab5" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#9c8ab5" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artUnlitLanternbearer(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.75"/><circle cx="42" cy="44" r="4.5" fill="#3a2f52" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#9c8ab5" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artShadeStitchedMender(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#3a2f52" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#9c8ab5" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#9c8ab5" stroke="none"/>`, 0);
}
/* The Last Candle — Duskward's own boss, same bigger/layered shape as
every other dungeon boss, shadow-violet/pale lavender core. */
function artLastCandle(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.8"/><path d="M50 8 L80 40 L50 50 Z" fill="#3a2f52" opacity="0.75"/><path d="M50 8 L20 40 L50 50 Z" fill="#9c8ab5" opacity="0.65"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#9c8ab5" stroke="none"/><circle cx="50" cy="50" r="3" fill="#3a2f52" stroke="none"/>`, 0);
}

/* Ironloom's own creatures (Act 3, wave 2) — same Lucent angular
family, bronze/brass over the same shapes, a deliberate callback to
the Moles' own clockwork theme (see dungeon.js's own comment). */
function artCoiledTensioner(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#8a6a3f" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#b5934a" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#b5934a" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artLoomSpindle(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#8a6a3f" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#b5934a" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artStitchWorker(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#8a6a3f" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#b5934a" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#b5934a" stroke="none"/>`, 0);
}
/* The Warp-Loom Overseer — Ironloom's own boss, same bigger/layered
shape as every other dungeon boss, bronze/brass core. */
function artWarpLoomOverseer(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#8a6a3f" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#b5934a" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#b5934a" stroke="none"/><circle cx="50" cy="50" r="3" fill="#8a6a3f" stroke="none"/>`, 0);
}

/* Echo Chapel's own creatures (Act 3, wave 3) — same Lucent angular
family, slate blue/pale sky over the same shapes. */
function artResonanceWarden(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#4a6a8a" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#a8c4d9" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#a8c4d9" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artChimeCaster(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#4a6a8a" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#a8c4d9" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artHumKeeper(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#4a6a8a" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#a8c4d9" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#a8c4d9" stroke="none"/>`, 0);
}
/* The Unbroken Chord — Echo Chapel's own boss, same bigger/layered
shape as every other dungeon boss, slate blue/pale sky core. */
function artUnbrokenChord(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#4a6a8a" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#a8c4d9" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#a8c4d9" stroke="none"/><circle cx="50" cy="50" r="3" fill="#4a6a8a" stroke="none"/>`, 0);
}

/* The Sunken Archive's own creatures (Act 3, wave 3) — same Lucent
angular family, aged sepia/faded gold over the same shapes, the last
of the first 8 dungeons and the direct lead-in to the finale. */
function artMarginaliaWraith(){
   return sceneWrap(`<path d="M50 14 L74 42 L62 86 L38 86 L26 42 Z" fill="#8a8477" opacity="0.5"/><path d="M50 14 L74 42 L50 50 Z" fill="#5a4a3a" opacity="0.7"/><path d="M50 14 L26 42 L50 50 Z" fill="#9c8560" opacity="0.6"/><circle cx="50" cy="52" r="3" fill="#9c8560" stroke="none"/><line x1="38" y1="86" x2="34" y2="98" stroke-width="3"/><line x1="62" y1="86" x2="66" y2="98" stroke-width="3"/>`, 0);
}
function artIndexWalker(){
   return sceneWrap(`<path d="M50 16 L70 38 L64 70 L36 70 L30 38 Z" fill="#2b2b28" opacity="0.7"/><circle cx="42" cy="44" r="4.5" fill="#5a4a3a" stroke="none"/><circle cx="58" cy="44" r="4.5" fill="#9c8560" stroke="none"/><path d="M36 70 L30 86 M64 70 L70 86" stroke-width="3"/>`, 0);
}
function artPageBinder(){
   return sceneWrap(`<path d="M20 70 L38 54 L52 62 L68 48 L86 66 L70 80 L50 72 L34 82 Z" fill="#8a8477" opacity="0.6"/><path d="M38 54 L44 44 L52 54 Z" fill="#5a4a3a" opacity="0.8"/><path d="M68 48 L76 40 L80 50 Z" fill="#9c8560" opacity="0.8"/><circle cx="46" cy="64" r="1.8" fill="#9c8560" stroke="none"/>`, 0);
}
/* The Last Archivist — the Sunken Archive's own boss, same bigger/
layered shape as every other dungeon boss, sepia/faded gold core. */
function artLastArchivist(){
   return sceneWrap(`<path d="M50 8 L80 40 L68 92 L32 92 L20 40 Z" fill="#2b2b28" opacity="0.75"/><path d="M50 8 L80 40 L50 50 Z" fill="#5a4a3a" opacity="0.7"/><path d="M50 8 L20 40 L50 50 Z" fill="#9c8560" opacity="0.6"/><path d="M50 50 L68 92 L32 92 Z" fill="#8a8477" opacity="0.5"/><circle cx="50" cy="50" r="6" fill="#9c8560" stroke="none"/><circle cx="50" cy="50" r="3" fill="#5a4a3a" stroke="none"/>`, 0);
}

function artEchoWraith(){
   return sceneWrap(`<path d="M50 22 Q68 30 66 54 Q64 78 50 84 Q36 78 34 54 Q32 30 50 22 Z" fill="#b06a97" opacity="0.55"/><path d="M46 26 Q64 34 62 58 Q60 82 46 88" fill="none" stroke="#3d5a80" stroke-width="2.5" opacity="0.6"/><circle cx="44" cy="44" r="3" fill="#f4efe4" stroke="none"/><circle cx="56" cy="44" r="3" fill="#f4efe4" stroke="none"/>`, 0);
}

/* Crystal City's own single zone-rare (ZONE_RARE_MONSTERS, content.js)
— same angular crystalline-facet vocabulary as artCrystalSentinel
above, this one a loose cluster of drifting shards rather than one
solid silhouette. */
function artDriftingFacet(){
   return sceneWrap(`<path d="M50 14 L62 34 L50 48 L38 34 Z" fill="#3d5a80" opacity="0.7"/><path d="M68 50 L82 62 L68 78 L56 62 Z" fill="#b06a97" opacity="0.6"/><path d="M32 56 L46 66 L34 84 L20 72 Z" fill="#f4efe4" opacity="0.5"/><circle cx="50" cy="48" r="2.4" fill="#d1a94e" stroke="none"/>`, 0);
}

/* ---------------- Zone backdrop art ---------------- */
/* One scene per Act 1 adventure zone (ZONE_DIFFICULTY, content.js), shown
between fights in place of artIdle() (see render.js) so each zone has
its own visual identity rather than reusing the generic player
stick-figure. Escalates in mood/elaborateness with zone danger:
Commons (bright, open, harmless) -> Sewers (dark, enclosed) -> Quarry
(rocky, industrial) -> Vault (ornate, torchlit dark). Same shape
vocabulary/palette as every other art*() function above -- no text, no
gradients. The Act 2 equivalents (Garrison/Rogues' Den/Arcane Sanctum)
live in gnometropolis-art.js, alongside artGnometropolisSquare() and
artPalaceGate(). */
function artZoneCommons(){
   return sceneWrap(`<rect x="0" y="58" width="100" height="42" fill="#5c8a5c"/><path d="M6 58 Q16 48 26 58 Q36 50 46 58 Q56 49 66 58 Q78 50 90 58 Q96 54 100 58 L100 100 L0 100 Z" fill="#5c8a5c"/><path d="M18 58 Q14 44 22 40 Q26 44 22 58 Z" fill="#5c8a5c"/><path d="M76 60 Q71 46 80 42 Q85 47 80 60 Z" fill="#5c8a5c"/><line x1="34" y1="60" x2="30" y2="34"/><line x1="30" y1="34" x2="24" y2="42"/><line x1="30" y1="34" x2="37" y2="40"/><line x1="64" y1="62" x2="70" y2="82"/><path d="M8 24 Q30 12 52 24" fill="none" stroke-width="2.5"/>`, 0);
}
function artZoneSewers(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.12"/><path d="M0 6 L100 6" stroke="#8a8477" stroke-width="10"/><path d="M0 94 L100 94" stroke="#8a8477" stroke-width="10"/><rect x="0" y="14" width="18" height="66" fill="#5f4632"/><rect x="82" y="14" width="18" height="66" fill="#5f4632"/><path d="M32 16 Q50 6 68 16 L64 44 Q50 52 36 44 Z" fill="#2b2b28"/><ellipse cx="50" cy="88" rx="42" ry="9" fill="#3d5a80"/><ellipse cx="50" cy="86" rx="20" ry="4" fill="#3d5a80"/><line x1="26" y1="14" x2="26" y2="30"/><circle cx="26" cy="32" r="2.4" fill="#3d5a80" stroke="none"/>`, 0);
}
function artZoneQuarry(){
   return sceneWrap(`<path d="M0 70 L14 30 L30 62 L46 24 L60 58 L76 32 L92 66 L100 56 L100 100 L0 100 Z" fill="#8a8477"/><path d="M20 100 L34 58 Q42 52 48 58 L58 100 Z" fill="#d1a94e"/><rect x="66" y="52" width="6" height="40" fill="#5f4632"/><rect x="24" y="46" width="6" height="46" fill="#5f4632"/><circle cx="66" cy="42" r="11" fill="none" stroke-width="3.5"/><line x1="66" y1="31" x2="66" y2="24"/><line x1="66" y1="53" x2="66" y2="60"/><line x1="55" y1="42" x2="48" y2="42"/><line x1="77" y1="42" x2="84" y2="42"/>`, 0);
}
function artZoneVault(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.2"/><path d="M20 96 L20 30 Q50 6 80 30 L80 96" fill="none" stroke="#8a8477" stroke-width="7"/><line x1="48" y1="16" x2="52" y2="34"/><rect x="10" y="24" width="10" height="72" fill="#8a8477"/><rect x="80" y="24" width="10" height="72" fill="#8a8477"/><path d="M15 24 Q9 18 15 10 Q21 18 15 24 Z" fill="#d1a94e"/><circle cx="15" cy="8" r="3" fill="#d1a94e" stroke="none"/><circle cx="38" cy="88" r="4" fill="#d1a94e" stroke="none"/><circle cx="58" cy="92" r="3" fill="#d1a94e" stroke="none"/><circle cx="68" cy="86" r="4" fill="#b06a97" stroke="none"/><circle cx="48" cy="90" r="2.4" fill="#d1a94e" stroke="none"/>`, 0);
}
/* The Crystal City (quest16's own capstone reveal, crystalcity-content.js)
— a stub zone with no hub-square art file of its own (it's a single
leaf zone, not a district-bearing hub like every other Act 2 area), so
its one backdrop lives directly here alongside Act 1's own four rather
than getting a whole new paired art file for just one function. */
function artZoneCrystalCity(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#3d5a80" opacity="0.12"/><path d="M50 8 L78 40 L64 92 L36 92 L22 40 Z" fill="none" stroke="#3d5a80" stroke-width="3"/><path d="M50 8 L50 92 M22 40 L78 40" stroke="#8a8477" stroke-width="1.6" opacity="0.6"/><circle cx="30" cy="60" r="2.4" fill="#d1a94e" stroke="none"/><circle cx="70" cy="66" r="2" fill="#b06a97" stroke="none"/><circle cx="50" cy="30" r="2.2" fill="#f4efe4" stroke="none"/>`, 0);
}
/* The Prism Depths' own backdrop (Act 3, dungeon.js) — same crystalline
motif as artZoneCrystalCity above, one level further down: darker,
more facets, no single clean silhouette, since it's not a place with
one shape the way every other zone background has one. */
function artPrismDepths(){
   return sceneWrap(`<rect x="0" y="0" width="100" height="100" fill="#2b2b28" opacity="0.15"/><path d="M50 4 L70 30 L62 60 L38 60 L30 30 Z" fill="none" stroke="#3d5a80" stroke-width="2.5" opacity="0.8"/><path d="M50 60 L68 84 L50 98 L32 84 Z" fill="none" stroke="#b06a97" stroke-width="2.5" opacity="0.7"/><circle cx="50" cy="60" r="2.4" fill="#f4efe4" stroke="none"/><circle cx="24" cy="44" r="1.8" fill="#d1a94e" stroke="none"/><circle cx="76" cy="50" r="1.8" fill="#d1a94e" stroke="none"/>`, 0);
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
