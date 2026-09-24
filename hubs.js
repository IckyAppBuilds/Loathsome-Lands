/* ---------------- Town hub registry ---------------- */
/* One entry per persistent town hub, keyed by its own state.location
value, mapped to the list of district location keys reached ONLY from
inside that hub's square (never directly from the Map/another hub).
Gladstone Hollow has none — Act 1's adventure zones are reached
straight from the Map, not from inside the square. Gnometropolis's four
(garrison/roguesden/sanctum/palace) are the first real case.

Generalizes what was Gnometropolis-specific logic (isGnometropolisArea()/
travelCostFor() used to hardcode exactly one hub, town.js) so a second
hub town — Act 2's planned Gnometropolis-as-home-base upgrade, and
whatever comes after it — is "add one entry here," not "copy-paste and
rename three functions." Behavior-preserving as of this pass: no
gameplay change, just where the knowledge lives. Deliberately doesn't
duplicate ZONE_TRAVEL_COST's own per-hub-square price (content.js) —
that stays the single source of truth for what entering a hub square
from outside costs; this registry only needs to know WHICH locations
belong to WHICH hub. */
const HUB_TOWNS = {
   town: [],
   gnometropolis: ['garrison', 'roguesden', 'sanctum', 'palace'],
};

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
