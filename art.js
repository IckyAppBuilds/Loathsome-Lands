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

function artTownSquare(gafferFlagType, guildFlagType, hoodooFlagType, tinkerFlagType, lotTier, guildBountyReady, innCooldownText){
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
   isn't a quest state (see isBountyReady(), guild.js), and needs to be
   visible alongside a genuine Guild quest flag without overlapping it, so
   it sits in the opposite corner. Glow via a soft pulsing halo circle
   behind a solid shield shape, rather than quest-flag's bob, so the two
   read as distinct kinds of "something's ready here." */
   const bountyShield = !guildBountyReady ? '' : `
   <g class="bounty-ready-shield">
   <circle cx="82" cy="16" r="12" fill="#d1a94e" opacity="0.45"/>
   <path d="M82 7 L91 10.5 L91 17 Q91 25 82 29 Q73 25 73 17 L73 10.5 Z" fill="#3d5a80" stroke="#2b2b28" stroke-width="2.5"/>
   <path d="M78 17.5 L81 20.5 L87 13" fill="none" stroke="#f4efe4" stroke-width="2.5"/>
   </g>`;
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
   /* One uniform font-size for every building label — was 6-10 depending
   on the building, purely to dodge overflow on longer names ("Tinker's
   Workshop" vs "Casino"), which made otherwise-identical labels read as
   inconsistent from one building to the next. 7 is the largest size that
   still comfortably fits the longest label ("Tinker's Workshop", ~75px
   measured) inside this plate's fixed 88px width — verified across every
   label, not just that one. No `fontSize` parameter anymore; every call
   site below was updated to drop it. */
   const plate = (label) => `
   <rect x="6" y="76" width="88" height="18" fill="#f4efe4" stroke="#2b2b28" stroke-width="2"/>
   <text x="50" y="89" text-anchor="middle" class="building-label" fill="#2b2b28" stroke="none">${label}</text>`;
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
   ${makeFlag(hoodooFlagType)}
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
   ${makeFlag(tinkerFlagType)}
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
   ${plate("The Shop")}
   </g>

   <g transform="translate(0,200)" class="building-hit" data-action="guild">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M20 42 L20 34 L28 34 L28 42 L36 42 L36 34 L44 34 L44 42 L56 42 L56 34 L64 34 L64 42 L72 42 L72 34 L80 34 L80 42 Z" fill="#8a8477"/>
   <rect x="20" y="42" width="60" height="30" fill="#b9b3a4"/>
   <rect x="42" y="56" width="16" height="16" fill="#5f4632"/>
   <line x1="50" y1="34" x2="50" y2="12"/>
   <path d="M50 12 L68 18 L50 24 Z" fill="#3d5a80"/>
   ${makeFlag(guildFlagType)}
   ${bountyShield}
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
   ${plate("Fountain")}
   </g>

   <g transform="translate(200,200)" class="building-hit" data-action="casino">
   <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="none"/>
   <path d="M14 40 L22 26 L30 40 L38 26 L46 40 L54 26 L62 40 L70 26 L78 40 L86 26 L90 40 Z" fill="#b06a97"/>
   <rect x="18" y="40" width="64" height="26" fill="#a97c53"/>
   <circle cx="50" cy="53" r="10" fill="#f4efe4" stroke="#2b2b28" stroke-width="3"/>
   <circle cx="50" cy="53" r="3" fill="#d1a94e" stroke="none"/>
   <line x1="50" y1="43" x2="50" y2="46"/><line x1="50" y1="60" x2="50" y2="63"/><line x1="40" y1="53" x2="43" y2="53"/><line x1="57" y1="53" x2="60" y2="53"/>
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
/* Real pass on trialChampion (content.js) — the toughest fight in the
game (hp:95, the Guild's Trial Examiner), so it needs to read as bigger
and more armored than artGnomeKing rather than a recolor: wider shoulder
guards that push past the usual body silhouette, a full closed helm
instead of a face, and a two-handed greatsword planted in front of it
in place of the usual single raised arm. */
function artTrialChampion(){
   return sceneWrap(`<path d="M16 92 Q50 70 84 92 L74 30 Q50 20 26 30 Z" fill="#5f4632"/><path d="M26 30 L10 40 L14 62 L28 54 Z" fill="#8a8477"/><path d="M74 30 L90 40 L86 62 L72 54 Z" fill="#8a8477"/><rect x="34" y="26" width="32" height="9" fill="#b9b3a4"/><path d="M36 20 Q50 6 64 20 L60 40 Q50 46 40 40 Z" fill="#b9b3a4"/><line x1="44" y1="28" x2="44" y2="36"/><line x1="56" y1="28" x2="56" y2="36"/><line x1="50" y1="46" x2="50" y2="96"/><line x1="50" y1="56" x2="18" y2="48"/><line x1="18" y1="48" x2="8" y2="26"/><line x1="50" y1="56" x2="82" y2="48"/><line x1="82" y1="48" x2="92" y2="26"/><path d="M50 12 L46 60 L54 60 Z" fill="#8a8477"/><line x1="34" y1="18" x2="66" y2="18"/><path d="M38 88 L62 88 L58 100 L42 100 Z" fill="#3d5a80"/><line x1="50" y1="96" x2="34" y2="100"/><line x1="50" y1="96" x2="66" y2="100"/>`, 0);
}
/* ---------------- Zone backdrop art ---------------- */
/* One scene per adventure zone (ZONE_DIFFICULTY, content.js), shown
between fights in place of artIdle() (see render.js) so each zone has
its own visual identity rather than reusing the generic player
stick-figure. Escalates in mood/elaborateness with zone danger:
Commons (bright, open, harmless) -> Sewers (dark, enclosed) -> Quarry
(rocky, industrial) -> Vault (ornate, torchlit dark) -> Gnometropolis
(a real skyline glimpse, the grandest). Same shape vocabulary/palette
as every other art*() function above -- no text, no gradients. */
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
function artZoneGnometropolis(){
   return sceneWrap(`<rect x="0" y="70" width="100" height="30" fill="#2b2b28" opacity="0.12"/><rect x="4" y="46" width="20" height="52" fill="#8a8477"/><rect x="28" y="24" width="24" height="74" fill="#a97c53"/><rect x="56" y="52" width="18" height="46" fill="#8a8477"/><rect x="78" y="36" width="18" height="62" fill="#b06a97"/><path d="M28 24 L40 8 L52 24 Z" fill="#d1a94e"/><line x1="40" y1="8" x2="40" y2="0"/><path d="M40 0 L48 3 L40 6 Z" fill="#b5453f"/><rect x="34" y="34" width="8" height="10" fill="#f4efe4"/><rect x="60" y="60" width="7" height="9" fill="#f4efe4"/><rect x="83" y="44" width="7" height="9" fill="#f4efe4"/><rect x="9" y="56" width="7" height="9" fill="#f4efe4"/>`, 0);
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
