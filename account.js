/* account.js has been split (stage 2 of the file-split refactor) into:
   - auth.js            — sign-in/out, the account gate, and the Account drawer body
   - dev-tools.js       — isDevAccount()-gated dev/cheat tools
   - save.js            — serialize/hydrate and the save/load round-trip
   - player-actions.js  — drawers, use/equip/unequip item, stats
   - tutorial.js         — the in-game tutorial overlay
   Nothing lives in this file anymore. index.html's <script> tags still need
   to be updated to load the 5 files above instead of this one (out of scope
   for this split — see AGENTS.md). */
