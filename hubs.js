/* ---------------- Town hub registry ---------------- */
/* One entry per persistent town hub, keyed by its own state.location
value, mapped to the list of every OTHER location reached only from
inside that hub's square (never directly from the Map/another hub) —
both its explorable "districts" (garrison/roguesden/sanctum/palace/
rootcellar/mudflats) and its plain building interiors (gaffer/shop/
hoodoo/guild/tinker/casino/townlot/noticeboard for town; gnomeguild/
gnomeshop/gnometownlot for gnometropolis). Both kinds belong here for
the same reason: standing in any of them still counts as "inside this
hub's area" for travelCostFor()'s (town.js) distance calculation —
opening the Map from inside the Shop and clicking another zone should
price that trip from Gladstone Hollow's own position, not treat 'shop'
as some unrelated place with no position on the chain at all.

Generalizes what was Gnometropolis-specific logic (isGnometropolisArea()/
travelCostFor() used to hardcode exactly one hub, town.js) so a second
hub town — Act 2's planned Gnometropolis-as-home-base upgrade, and
whatever comes after it — is "add one entry here," not "copy-paste and
rename three functions." */
const HUB_TOWNS = {
   town: ['gaffer', 'shop', 'hoodoo', 'guild', 'tinker', 'casino', 'townlot', 'noticeboard'],
   gnometropolis: ['garrison', 'roguesden', 'sanctum', 'palace', 'gnomeguild', 'gnomeshop', 'gnometownlot'],
   /* Act 2 Part 2's first Mole People area — three real combat districts
   (no rest tile; resting happens at Gnometropolis's Camp instead,
   one Biscuit away). 'mudflats' is deliberately still listed even
   though it's not enterable until tunnelWardenDefeated (quest9,
   guild.js) — this registry is about which hub a location BELONGS to
   for travel-cost/area purposes, not whether it's currently reachable;
   that gating lives in travelTo() (town.js) same as every other
   quest-gated destination already does. */
   mudrootwarren: ['rootcellar', 'mudflats', 'bureau'],
   /* Quest 10's own hub — deeper in the same warren system, reached
   through Mudroot Warren's sealed root-door once quest10Path is set
   (either rare hunt found first — see quest10's own comment, guild.js).
   Choir/Ledger Vault are alternate CHOICES, not a sequence: whichever
   rare hunt (the tunnel-mole informant in rootcellar, or the senior
   clerk in bureau) the player finds FIRST sets quest10Path and reveals
   that district immediately; the other stays an inert filler tile
   until its own rare hunt is separately defeated, same reveal
   mechanism Mudflats already uses. */
   warrensear: ['choir', 'ledgervault'],
};

/* Which of HUB_TOWNS's keys are proper TOWN hubs — a real home base with
its own Shop/Guild/rest option — as opposed to an "adventure hub" like
mudrootwarren, which is hub-SHAPED (a square plus districts, same
free-to-roam-once-inside rules) but has no Shop/Guild/rest tile of its
own and was never meant to double as anywhere to actually live. Read
by travelCostFor()'s (town.js) hub-to-hub free-travel rule — per
explicit correction, free hub-to-hub travel is a town-hub-to-town-hub
thing only; reaching or leaving an adventure hub still costs Biscuits
like any other expedition, even between two hubs. */
const TOWN_HUB_KEYS = ['town', 'gnometropolis'];

/* Which hub (by key) `loc` belongs to — either a hub square itself, or
one of its districts. null if `loc` isn't part of any hub (an Act 1
adventure zone, a Gladstone building interior, etc.). */
function hubKeyForLocation(loc){
   if(loc in HUB_TOWNS) return loc;
   for(const key in HUB_TOWNS){
      if(HUB_TOWNS[key].includes(loc)) return key;
   }
   return null;
}

/* Whether `loc` is anywhere inside a hub's free-to-roam area — its own
square, or any of its districts. Used by travelCostFor() below to know
when a trip is "moving around inside a hub you already paid to enter"
(free) versus "crossing into one from outside" (priced). */
function isHubArea(loc){ return hubKeyForLocation(loc) !== null; }
