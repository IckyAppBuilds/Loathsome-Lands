/* ---------------- Auth forms, shared between the pre-game gate and the Account drawer ---------------- */
/* `prefix` is 'gate' or 'acct' — it picks which element IDs to read/write
(${prefix}-login-username, ${prefix}-msg, etc.) so the two copies of the
form never collide, and lets each remember its own view/busy state via
authView[prefix]/authBusy[prefix]. */
function authSetView(prefix, view){
   authView[prefix] = view;
   renderAuthUI(prefix);
}

function renderAuthUI(prefix){
   if(prefix === 'gate') renderGate(); else renderAccountTab();
}

function renderAuthForms(prefix){
   const view = authView[prefix];
   const busy = authBusy[prefix];
   /* Enter key submits the form's primary action from any of its fields,
   same as hitting the button — matches normal browser form behavior even
   though these aren't real <form> elements (no page reload to guard
   against, and doRegister/doLogin/doForgotPassword already no-op while
   authBusy[prefix] is true, so a double-fire from Enter is harmless). */
if(view === 'register'){
   return `
   <div class="acct-form">
   <label>Username</label><input type="text" id="${prefix}-reg-username" autocomplete="username" onkeydown="if(event.key==='Enter')doRegister('${prefix}')">
   <label>Email</label><input type="email" id="${prefix}-reg-email" autocomplete="email" onkeydown="if(event.key==='Enter')doRegister('${prefix}')">
   <label>Password</label><input type="password" id="${prefix}-reg-password" autocomplete="new-password" onkeydown="if(event.key==='Enter')doRegister('${prefix}')">
   <div class="btn-row">
   <button class="btn-primary" onclick="doRegister('${prefix}')" ${busy?'disabled':''}>Register</button>
   </div>
   <div class="acct-msg" id="${prefix}-msg"></div>
   <span class="acct-link" onclick="authSetView('${prefix}','login')">Already have an account? Log in</span>
   </div>`;
} else if(view === 'forgot'){
   return `
   <div class="acct-form">
   <label>Username</label><input type="text" id="${prefix}-forgot-username" autocomplete="username" onkeydown="if(event.key==='Enter')doForgotPassword('${prefix}')">
   <div class="btn-row">
   <button class="btn-primary" onclick="doForgotPassword('${prefix}')" ${busy?'disabled':''}>Send Reset Link</button>
   </div>
   <div class="acct-msg" id="${prefix}-msg"></div>
   <span class="acct-link" onclick="authSetView('${prefix}','login')">Back to log in</span>
   </div>`;
}
   return `
   <div class="acct-form">
   <label>Username</label><input type="text" id="${prefix}-login-username" autocomplete="username" onkeydown="if(event.key==='Enter')doLogin('${prefix}')">
   <label>Password</label><input type="password" id="${prefix}-login-password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin('${prefix}')">
   <div class="btn-row">
   <button class="btn-primary" onclick="doLogin('${prefix}')" ${busy?'disabled':''}>Log In</button>
   </div>
   <div class="acct-msg" id="${prefix}-msg"></div>
   <span class="acct-link" onclick="authSetView('${prefix}','register')">Need an account? Register</span><br>
   <span class="acct-link" onclick="authSetView('${prefix}','forgot')">Forgot password?</span>
   </div>`;
}

function acctMsg(prefix, text, isErr){
   const el = document.getElementById(`${prefix}-msg`);
   if(!el) return;
   el.textContent = text;
   el.className = 'acct-msg ' + (isErr ? 'err' : 'ok');
}

/* ---------------- The pre-game gate ---------------- */
function showGate(){
   gateOpen = true;
   const el = document.getElementById('gate-screen');
   if(el) el.style.display = 'flex';
}
function closeGate(){
   gateOpen = false;
   const el = document.getElementById('gate-screen');
   if(el) el.style.display = 'none';
}

function renderGate(){
   const el = document.getElementById('gate-body');
   if(!el) return;
   if(acctSession){
      /* Only visible for the instant between a successful login and
      enterGameAfterAuth() closing the gate — but render something sane
      just in case. */
   el.innerHTML = `<div class="acct-status-line">Signed in as <b>${acctUsername || '...'}</b> — loading your game...</div>`;
      return;
   }
   el.innerHTML = renderAuthForms('gate');
}

function playAsGuest(){
   closeGate();
   startFreshGame();
}

/* Called once, right after the gate closes because of a real login (not a
guest). `loaded` says whether an existing save was found and hydrated. */
function enterGameAfterAuth(loaded){
   closeGate();
   if(loaded){
      clearLog();
      log(lastOfflineBiscuitGain > 0
          ? `Welcome back! Your save has been loaded. While you were away, you earned ${lastOfflineBiscuitGain} Biscuit${lastOfflineBiscuitGain===1?'':'s'}.`
          : "Welcome back! Your save has been loaded.");
      render();
   } else {
      startFreshGame();
   }
}

/* ---------------- Dev account & testing tools ---------------- */
/* Usernames in this list get the full dev-tools panel in the Account
drawer (direct-value setters, quest-stage jumper, reset buttons), for
testing content from any game state without having to grind there
legitimately. Not a security boundary — just a testing convenience
gated behind a specific account. Does NOT auto-enable devMode/unlimited
Biscuits on its own anymore (that used to happen on every sign-in —
removed since it left the account permanently stuck on infinite
Biscuits with no way to turn it off in-game); use the panel's Biscuits
setter, or ?dev=1 in the URL, if unlimited Biscuits are wanted for a
session. Compared case-insensitively since Supabase usernames aren't
normalized on registration. */
const DEV_USERNAMES = ['ickyadmin'];
function isDevAccount(){
   return !!acctUsername && DEV_USERNAMES.includes(acctUsername.toLowerCase());
}

/* Resets level/stats/HP/MP back to a fresh level 1, independent of quest
progress — lets a dev account re-test leveling, stat spending, and the
level-10 class quest gate without touching quest flags. Also clears the
class quest itself since it's gated on level>=10 and would otherwise be
left in a stale "already claimed" state after a level reset. */
function resetLevelDev(){
   if(!isDevAccount()) return;
   if(!confirm('Reset level, XP, stats and the class quest back to a fresh level 1? Quest progress is untouched.')) return;
   state.level = 1; state.xp = 0; state.xpToLevel = 40;
   state.stats = { beef:0, zip:0, grit:0, hoodoo:0 };
   state.statPoints = 0;
   state.baseMaxHp = 30; state.baseMaxMp = 10;
   state.classQuestAccepted = false; state.classQuestComplete = false; state.classTitle = null;
   recomputeMaxStats();
   state.hp = state.maxHp; state.mp = state.maxMp;
   clearLog();
   log('[Dev] Level, stats, and the class quest have been reset.');
   render();
   autosave();
}

/* Resets every quest flag (and the zone unlocks that ride on them) back to
never-started, so a dev account can replay quest 1 through the class
quest from scratch. Also strips any quest items already held — they'd
otherwise be stuck in the Pack, no longer tied to an active quest and
not yet sellable (selling a quest item requires its quest to be
complete — see isQuestItemSellable() in game.js). Leaves level/stats/
Pop Tabs/inventory-otherwise alone; pair with Reset Level for a fully
fresh run. */
function resetQuestsDev(){
   if(!isDevAccount()) return;
   if(!confirm('Reset all quest progress (including zone unlocks) back to never-started? Quest items in your Pack will be cleared. Level/stats are untouched.')) return;
   Object.assign(state, {
      questTinesGiven: 0, questAccepted: false, questComplete: false,
      quest2Accepted: false, commanderDefeated: false, quest2Complete: false,
      quest3Accepted: false, quest3Complete: false,
      quest4Accepted: false, quest4RareDefeated: false, quest4Complete: false,
      quest5Accepted: false, quest5Complete: false,
      quest6Accepted: false, quest6RareDefeated: false, quest6Complete: false,
      classQuestAccepted: false, classQuestComplete: false, classTitle: null,
   });
   state.inventory = state.inventory.filter(it => it.type !== 'quest');
   state.location = 'town';
   recomputeMaxStats();
   clearLog();
   log('[Dev] All quest progress and zone unlocks have been reset.');
   render();
   autosave();
}

/* ---------------- Dev tools: direct state setters ---------------- */
/* Companions to resetLevelDev()/resetQuestsDev() above — instead of wiping
back to a known-good baseline, these let a dev account punch in an exact
value (Biscuits, Pop Tabs, level, stats, items) or jump straight to a
named quest stage, so any character/quest state can be reached in one or
two clicks rather than by grinding or chaining resets. All gated behind
isDevAccount() same as the reset tools, and equally not a security
boundary. */

/* Replays checkLevelUp()'s *1.5-then-floor progression from the level-1
baseline (40) so a dev-set level gets the same xpToLevel a real climb to
that level would have produced. */
function xpToLevelForLevel(lvl){
   let x = 40;
   for(let i=1; i<lvl; i++) x = Math.floor(x*1.5);
   return x;
}

function readDevInt(id, min){
   const el = document.getElementById(id);
   const n = parseInt(el && el.value, 10);
   return Math.max(min, Number.isFinite(n) ? n : min);
}

function setLevelDev(){
   if(!isDevAccount()) return;
   const lvl = Math.min(999, readDevInt('dev-level-input', 1));
   state.level = lvl;
   state.xp = 0;
   state.xpToLevel = xpToLevelForLevel(lvl);
   state.baseMaxHp = 30 + (lvl-1)*6;
   state.baseMaxMp = 10 + (lvl-1)*2;
   recomputeMaxStats();
   state.hp = state.maxHp; state.mp = state.maxMp;
   clearLog();
   log(`[Dev] Level set to ${lvl}.`);
   render();
   autosave();
}

function setBiscuitsDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-biscuits-input', 0);
   state.adventures = val;
   clearLog();
   log(`[Dev] Biscuits set to ${val}.`);
   render();
   autosave();
}

function setPopTabsDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-poptabs-input', 0);
   state.popTabs = val;
   clearLog();
   log(`[Dev] Pop Tabs set to ${val}.`);
   render();
   autosave();
}

function setBountyTokensDev(){
   if(!isDevAccount()) return;
   const val = readDevInt('dev-bountytokens-input', 0);
   state.bountyTokens = val;
   clearLog();
   log(`[Dev] Bounty Tokens set to ${val}.`);
   render();
   autosave();
}

function setStatsDev(){
   if(!isDevAccount()) return;
   state.stats = {
      beef: readDevInt('dev-beef-input', 0),
      zip: readDevInt('dev-zip-input', 0),
      grit: readDevInt('dev-grit-input', 0),
      hoodoo: readDevInt('dev-hoodoo-input', 0),
   };
   state.statPoints = readDevInt('dev-statpoints-input', 0);
   recomputeMaxStats();
   clearLog();
   log('[Dev] Stats set directly.');
   render();
   autosave();
}

/* Deduped, name-sorted list of every item definition in the game, for the
"Give Item" dropdown. allItemDefs() has genuine duplicates (e.g. "a
slightly bruised apple" is both a free monster-adjacent heal item and a
shop purchase) — dedupe by name so it isn't listed twice. Called fresh
each time rather than cached since it's cheap and content.js's arrays
never change at runtime. */
function devItemList(){
   const seen = new Set();
   const out = [];
   allItemDefs().forEach(def=>{
      if(seen.has(def.name)) return;
      seen.add(def.name);
      out.push(def);
   });
   out.sort((a,b) => a.name.localeCompare(b.name));
   return out;
}

function giveItemDev(){
   if(!isDevAccount()) return;
   const list = devItemList();
   const def = list[readDevInt('dev-item-select', 0)];
   if(!def) return;
   const qty = Math.min(99, readDevInt('dev-item-qty', 1));
   for(let i=0; i<qty; i++) state.inventory.push({ ...def });
   clearLog();
   log(`[Dev] Added ${qty} × ${def.name} to your Pack.`);
   render();
   autosave();
}

function clearInventoryDev(){
   if(!isDevAccount()) return;
   if(!confirm('Clear your entire Pack (equipped gear is untouched)? This cannot be undone.')) return;
   state.inventory = [];
   clearLog();
   log('[Dev] Pack cleared.');
   render();
   autosave();
}

/* Named, discrete stages for each quest chain — jumping to one sets every
flag (and any held quest items) that stage implies, so the state stays
internally consistent rather than letting individual flags drift out of
sync with each other or with the Pack. detect() looks at the live state
to figure out which stage is "current", purely so the dropdown opens on
the right option; it isn't used by apply(). */
const QUEST_DEV_STAGES = [
   { id:'quest1', label:"Gaffer's Rake Tines", stages: [
      { label:'Not started', apply(){ Object.assign(state, { questAccepted:false, questTinesGiven:0, questComplete:false }); } },
      { label:'Accepted (0/3 tines)', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:0, questComplete:false }); } },
      { label:'Accepted (3/3 tines, ready to turn in)', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:QUEST_TINES_NEEDED, questComplete:false }); } },
      { label:'Complete', apply(){ Object.assign(state, { questAccepted:true, questTinesGiven:QUEST_TINES_NEEDED, questComplete:true }); } },
      ], detect(){ if(state.questComplete) return 3; if(state.questAccepted && state.questTinesGiven>=QUEST_TINES_NEEDED) return 2; if(state.questAccepted) return 1; return 0; } },

   { id:'quest2', label:'Guild: The Gnome Commander', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest2Accepted:false, commanderDefeated:false, quest2Complete:false }); } },
      { label:'Accepted (commander not yet found)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:false, quest2Complete:false }); } },
      { label:'Commander defeated (ready to turn in)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:true, quest2Complete:false }); } },
      { label:'Complete (unlocks Dank Sewers)', apply(){ Object.assign(state, { quest2Accepted:true, commanderDefeated:true, quest2Complete:true }); } },
      ], detect(){ if(state.quest2Complete) return 3; if(state.quest2Accepted && state.commanderDefeated) return 2; if(state.quest2Accepted) return 1; return 0; } },

   { id:'quest3', label:'Hoodoo Doctor: A Proper Potion', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest3Accepted:false, quest3Complete:false }); state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); } },
      { label:'Accepted (0/4 ingredients)', apply(){ Object.assign(state, { quest3Accepted:true, quest3Complete:false }); state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); } },
      { label:'Accepted (4/4 ingredients, ready to turn in)', apply(){ state.quest3Accepted = true; state.quest3Complete = false; potionIngredients.forEach(p => { if(!state.inventory.some(it => it.key===p.item.key)) state.inventory.push({ ...p.item }); }); } },
      { label:'Complete (learns Bottled Fury)', apply(){ state.quest3Accepted = true; state.quest3Complete = true; state.inventory = state.inventory.filter(it => !potionIngredients.some(p=>p.item.key===it.key)); if(!state.spellsKnown.includes('bottledfury')) state.spellsKnown.push('bottledfury'); } },
      ], detect(){ if(state.quest3Complete) return 3; if(state.quest3Accepted && countPotionIngredientsHeld()>=potionIngredients.length) return 2; if(state.quest3Accepted) return 1; return 0; } },

   { id:'quest4', label:'Tinker: Gears in the Dark', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest4Accepted:false, quest4RareDefeated:false, quest4Complete:false }); } },
      { label:'Accepted (digger-bot not yet found)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:false, quest4Complete:false }); } },
      { label:'Digger-bot defeated (ready to turn in)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:true, quest4Complete:false }); } },
      { label:'Complete (unlocks Clockwork Quarry)', apply(){ Object.assign(state, { quest4Accepted:true, quest4RareDefeated:true, quest4Complete:true }); } },
      ], detect(){ if(state.quest4Complete) return 3; if(state.quest4Accepted && state.quest4RareDefeated) return 2; if(state.quest4Accepted) return 1; return 0; } },

   { id:'quest5', label:'Tinker: The Last Vein', stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest5Accepted:false, quest5Complete:false }); state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      { label:'Accepted (0 gathered)', apply(){ Object.assign(state, { quest5Accepted:true, quest5Complete:false }); state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      { label:'Accepted (all gathered, ready to turn in)', apply(){ state.quest5Accepted = true; state.quest5Complete = false; veinIngredients.forEach(v => { const held = state.inventory.filter(it => it.key===v.item.key).length; for(let n=held; n<VEIN_ITEM_COUNT_NEEDED; n++) state.inventory.push({ ...v.item }); }); } },
      { label:'Complete (unlocks Sunless Vault)', apply(){ state.quest5Accepted = true; state.quest5Complete = true; state.inventory = state.inventory.filter(it => !veinIngredients.some(v=>v.item.key===it.key)); } },
      ], detect(){ if(state.quest5Complete) return 3; if(state.quest5Accepted && countVeinIngredientsHeld()>=veinIngredients.length*VEIN_ITEM_COUNT_NEEDED) return 2; if(state.quest5Accepted) return 1; return 0; } },

   { id:'quest6', label:"Guild: The Gnome King's Throne", stages: [
      { label:'Not started', apply(){ Object.assign(state, { quest6Accepted:false, quest6RareDefeated:false, quest6Complete:false }); } },
      { label:'Accepted (Gnome King not yet found)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:false, quest6Complete:false }); } },
      { label:'Gnome King defeated (ready to turn in)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:true, quest6Complete:false }); } },
      { label:'Complete (unlocks Gnometropolis)', apply(){ Object.assign(state, { quest6Accepted:true, quest6RareDefeated:true, quest6Complete:true }); } },
      ], detect(){ if(state.quest6Complete) return 3; if(state.quest6Accepted && state.quest6RareDefeated) return 2; if(state.quest6Accepted) return 1; return 0; } },

   { id:'classquest', label:"Guild: The Adventurer's Trial (class)", stages: [
      { label:'Not accepted', apply(){ Object.assign(state, { classQuestAccepted:false, classQuestComplete:false, classTitle:null }); } },
      { label:'Accepted (requires level 10+ in real play)', apply(){ Object.assign(state, { classQuestAccepted:true, classQuestComplete:false, classTitle:null }); } },
      { label:'Complete (title + bonus from current dominant stat)', apply(){
         state.classQuestAccepted = true;
         if(!state.classQuestComplete){
            const dominant = Object.keys(STAT_LABELS).reduce((best, key) => state.stats[key] > state.stats[best] ? key : best, Object.keys(STAT_LABELS)[0]);
            state.stats[dominant] += 2;
            state.classTitle = CLASS_TITLES[dominant];
         }
         state.classQuestComplete = true;
      } },
      ], detect(){ if(state.classQuestComplete) return 2; if(state.classQuestAccepted) return 1; return 0; } },
   ];

function setQuestStageDev(id){
   if(!isDevAccount()) return;
   const cfg = QUEST_DEV_STAGES.find(q => q.id === id);
   if(!cfg) return;
   const idx = readDevInt(`dev-quest-${id}`, 0);
   const stage = cfg.stages[idx];
   if(!stage) return;
   stage.apply();
   recomputeMaxStats();
   clearLog();
   log(`[Dev] ${cfg.label} → ${stage.label}`);
   render();
   autosave();
}

/* ---------------- Account drawer (available during play regardless of guest/signed-in status) ---------------- */
function renderAccountTab(){
   const btn = document.getElementById('account-tab-btn');
   const label = document.getElementById('account-tab-label');
   const el = document.getElementById('account-body');
   /* Reachable from every state of this drawer — signed in, guest, or even
   when accounts failed to load entirely — so a player can revisit the
   tutorial without it depending on Supabase at all. See "In-game
   tutorial" near the bottom of this file. */
const tutorialBtnRow = `<div class="btn-row"><button class="btn-secondary" onclick="openTutorial()">📖 How to Play</button></div>`;

if(!sb){
   label.textContent = 'Account';
   if(el) el.innerHTML = tutorialBtnRow + `<div class="acct-status-line">Accounts aren't available right now — the login service didn't load (check your connection and reload). You can still play; nothing will be saved.</div>`;
   return;
}

const existingDot = btn.querySelector('.acct-dot');
   if(acctSession){
      label.textContent = 'Account';
      if(!existingDot){
         const dot = document.createElement('span');
         dot.className = 'acct-dot';
         btn.appendChild(dot);
      }
   } else if(existingDot){
      existingDot.remove();
   }

if(!el) return;

if(acctSession){
   const devPanel = isDevAccount() ? `
   <div class="acct-status-line" style="margin-top:14px;">⚙ Dev account — testing tools:</div>
   <div class="btn-row">
   <button class="btn-secondary" onclick="resetLevelDev()">Reset Level</button>
   <button class="btn-secondary" onclick="resetQuestsDev()">Reset Quests</button>
   </div>

   <div class="acct-form dev-form">
   <label>Set Level</label>
   <div class="dev-row">
   <input type="number" id="dev-level-input" min="1" max="999" value="${state.level}">
   <button class="btn-secondary" onclick="setLevelDev()">Set</button>
   </div>

   <label>Biscuits</label>
   <div class="dev-row">
   <input type="number" id="dev-biscuits-input" min="0" value="${state.adventures}">
   <button class="btn-secondary" onclick="setBiscuitsDev()">Set</button>
   </div>

   <label>Pop Tabs</label>
   <div class="dev-row">
   <input type="number" id="dev-poptabs-input" min="0" value="${state.popTabs}">
   <button class="btn-secondary" onclick="setPopTabsDev()">Set</button>
   </div>

   <label>Bounty Tokens</label>
   <div class="dev-row">
   <input type="number" id="dev-bountytokens-input" min="0" value="${state.bountyTokens}">
   <button class="btn-secondary" onclick="setBountyTokensDev()">Set</button>
   </div>

   <label>Stats — Beef / Zip / Grit / Hoodoo / unspent points</label>
   <div class="dev-row dev-row-5">
   <input type="number" id="dev-beef-input" min="0" value="${state.stats.beef}" title="Beef">
   <input type="number" id="dev-zip-input" min="0" value="${state.stats.zip}" title="Zip">
   <input type="number" id="dev-grit-input" min="0" value="${state.stats.grit}" title="Grit">
   <input type="number" id="dev-hoodoo-input" min="0" value="${state.stats.hoodoo}" title="Hoodoo">
   <input type="number" id="dev-statpoints-input" min="0" value="${state.statPoints}" title="Unspent stat points">
   </div>
   <div class="btn-row"><button class="btn-secondary" onclick="setStatsDev()">Set Stats</button></div>

   <label>Give Item</label>
   <div class="dev-row">
   <select id="dev-item-select">
   ${devItemList().map((def,i) => `<option value="${i}">${def.name}</option>`).join('')}
   </select>
   <input type="number" id="dev-item-qty" min="1" max="99" value="1" style="max-width:56px;">
   <button class="btn-secondary" onclick="giveItemDev()">Give</button>
   </div>
   <div class="btn-row"><button class="btn-secondary" onclick="clearInventoryDev()">Clear Inventory</button></div>

   <label style="margin-bottom:2px;">Quest progress</label>
   ${QUEST_DEV_STAGES.map(cfg => `
   <label style="text-transform:none; font-weight:400; color:var(--black); margin:6px 0 2px;">${cfg.label}</label>
   <div class="dev-row">
   <select id="dev-quest-${cfg.id}" title="${cfg.label}">
   ${cfg.stages.map((s,i) => `<option value="${i}" ${i===cfg.detect()?'selected':''}>${s.label}</option>`).join('')}
   </select>
   <button class="btn-secondary" onclick="setQuestStageDev('${cfg.id}')">Set</button>
   </div>
   `).join('')}
   </div>
   ` : '';
   el.innerHTML = tutorialBtnRow + `
   <div class="acct-status-line">Signed in as <b>${acctUsername || '...'}</b> — your progress saves automatically as you play.</div>
   <div class="btn-row">
   <button class="btn-primary" id="acct-save-btn" onclick="manualSaveGame()">Save Now</button>
   <button class="btn-secondary" id="acct-load-btn" onclick="manualLoadGame()">Load</button>
   </div>
   <div class="btn-row">
   <button class="btn-secondary" onclick="doLogout()">Log Out</button>
   </div>
   <div class="acct-msg" id="acct-msg"></div>
   ${devPanel}
   `;
   return;
}

el.innerHTML = tutorialBtnRow + `<div class="acct-status-line">Playing as a guest — nothing you do will be saved. Log in or register below to enable Save/Load.</div>` + renderAuthForms('acct');
}

async function doRegister(prefix){
   if(authBusy[prefix]) return;
   const username = document.getElementById(`${prefix}-reg-username`).value.trim();
   const email = document.getElementById(`${prefix}-reg-email`).value.trim();
   const password = document.getElementById(`${prefix}-reg-password`).value;
   if(!username || !email || !password){ acctMsg(prefix, 'Fill in all three fields.', true); return; }

authBusy[prefix] = true; renderAuthUI(prefix);
   const { data: existingEmail } = await sb.rpc('email_for_username', { lookup_username: username });
   if(existingEmail){
      authBusy[prefix] = false; renderAuthUI(prefix);
      acctMsg(prefix, 'That username is already taken.', true);
      return;
   }
   const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { username }, emailRedirectTo: location.href.split('?')[0] },
   });
   authBusy[prefix] = false; renderAuthUI(prefix);
   if(error){ acctMsg(prefix, error.message, true); return; }
   acctMsg(prefix, 'Check your email to confirm your account, then log in.', false);
}

async function doLogin(prefix){
   if(authBusy[prefix]) return;
   const username = document.getElementById(`${prefix}-login-username`).value.trim();
   const password = document.getElementById(`${prefix}-login-password`).value;
   if(!username || !password){ acctMsg(prefix, 'Enter your username and password.', true); return; }

authBusy[prefix] = true; renderAuthUI(prefix);
   const { data: email } = await sb.rpc('email_for_username', { lookup_username: username });
   if(!email){
      authBusy[prefix] = false; renderAuthUI(prefix);
      acctMsg(prefix, 'No account found with that username.', true);
      return;
   }
   const { error } = await sb.auth.signInWithPassword({ email, password });
   authBusy[prefix] = false;
   if(error){
      renderAuthUI(prefix);
      acctMsg(prefix, error.message.toLowerCase().includes('confirm')
              ? "This account hasn't confirmed its email yet — check your inbox."
              : error.message, true);
      return;
   }
   /* onAuthStateChange also fires from here and updates acctSession/renders
   the drawer independently; we still drive the gate/load/message flow
   directly so we can sequence "load, then reveal the game". */
const loaded = await loadGame().catch(() => false);
   if(prefix === 'gate'){
      enterGameAfterAuth(loaded);
   } else {
      renderAuthUI(prefix);
      acctMsg(prefix, loaded ? 'Logged in — save loaded.' : 'Logged in — no save found yet. Just start playing, it saves automatically.', false);
   }
}

async function doForgotPassword(prefix){
   if(authBusy[prefix]) return;
   const username = document.getElementById(`${prefix}-forgot-username`).value.trim();
   if(!username){ acctMsg(prefix, 'Enter your username.', true); return; }

authBusy[prefix] = true; renderAuthUI(prefix);
   const { data: email } = await sb.rpc('email_for_username', { lookup_username: username });
   if(email){
      await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('?')[0] });
   }
   authBusy[prefix] = false; renderAuthUI(prefix);
   /* Same message regardless of whether the account exists, to avoid username enumeration. */
acctMsg(prefix, 'If that account exists, a password reset link has been sent to its email.', false);
}

async function doLogout(){
   await sb.auth.signOut();
   authSetView('acct', 'login');
}

async function manualSaveGame(){
   acctMsg('acct', 'Saving...', false);
   try{
      await saveGame();
      acctMsg('acct', 'Saved!', false);
   }catch(e){
      acctMsg('acct', 'Save failed: ' + e.message, true);
   }
}

async function manualLoadGame(){
   acctMsg('acct', 'Loading...', false);
   try{
      const loaded = await loadGame();
      acctMsg('acct', loaded
              ? (lastOfflineBiscuitGain > 0 ? `Loaded! (+${lastOfflineBiscuitGain} Biscuit${lastOfflineBiscuitGain===1?'':'s'} earned while away)` : 'Loaded!')
              : 'No save found yet.', !loaded);
      render();
   }catch(e){
      acctMsg('acct', 'Load failed: ' + e.message, true);
   }
}

if(sb){
   sb.auth.onAuthStateChange((event, session) => {
      if(event === 'PASSWORD_RECOVERY'){
         const newPassword = prompt('Enter a new password:');
         if(newPassword){
            sb.auth.updateUser({ password: newPassword }).then(({error})=>{
               alert(error ? ('Password update failed: '+error.message) : 'Password updated — you are now logged in.');
            });
         }
         return;
      }
      acctSession = session || null;
      acctUsername = session ? (session.user.user_metadata && session.user.user_metadata.username) : null;
      /* The dev account used to auto-enable devMode (unlimited Biscuits) on
      every sign-in — removed by request, since it meant the account was
      permanently stuck on infinite Biscuits with no in-game way to turn
      it off (only ?dev=1 or the removed header toggle could). The
      dev-tools panel below (isDevAccount()-gated) still gives this
      account everything it needs for testing, including a direct
      Biscuits setter (setBiscuitsDev()) — that's the intended way to
      grant Biscuits now, on this account or any other via ?dev=1. */
                             renderAccountTab();

                             /* INITIAL_SESSION fires once, shortly after the client is created, with
      whatever session Supabase already had persisted (a returning player
      who never logged out). If the gate is still up at that point, either
      auto-continue them straight into their save, or — if there's no
      existing session — just let the gate's login/register/guest options
      sit there as already rendered. Later SIGNED_IN events (an explicit
      login from the gate or drawer) are handled by doLogin() itself, not
      here, so a real login isn't double-processed. */
                             if(gateOpen && event === 'INITIAL_SESSION'){
                                if(session){
                                   loadGame().catch(() => false).then(loaded => enterGameAfterAuth(loaded));
                                } else {
                                   renderGate();
                                }
                             }
   });
}

/* ---------------- Save / load (serialize/hydrate around the icon-function gotcha) ---------------- */
function allItemDefs(){
   const monsterLoot = monsters.map(m => m.loot).filter(Boolean);
   const commanderLoot = gnomeCommander.loot ? [gnomeCommander.loot] : [];
   /* Rare drops are per-monster (state.monster.rareDrop, content.js) rather
   than one shared rareDrops[] array — collect every monster's own rare
   item here so hydrateItem() can still look each one up by name after a
   save/reload, same as monsterLoot above. */
const monsterRareDrops = monsters.map(m => m.rareDrop).filter(Boolean);
   const potionIngredientItems = potionIngredients.map(p => p.item);
   /* veinIngredients (quest 5's gather items, content.js) were missing here
   — hydrateItem() below would silently drop them from inventory on
   save/reload since itemByName() couldn't find their def. Fixed as part
   of tagging quest items in the inventory UI. */
const veinIngredientItems = veinIngredients.map(v => v.item);
   /* shopGearItemsTier2 (content.js, unlocked once state.quest6Complete is
   true) isn't part of shopBuyItems — listed separately here, always
   (regardless of the current unlock state), so a held tier-2 piece still
   hydrates correctly after a reload. The new Gnometropolis monsters'
   loot/rareDrop items need no extra line of their own: they're already
   part of monsters[], so monsterLoot/monsterRareDrops above pick them up
   automatically. */
return [...healItems, ...shopBuyItems, ...shopGearItemsTier2, ...monsterLoot, ...commanderLoot,
        ...monsterRareDrops, ...Object.values(starterGear), ...potionIngredientItems,
        ...veinIngredientItems];
}
function itemByName(name){
   return allItemDefs().find(d => d.name === name) || null;
}
function serializeItem(item){ return item ? item.name : null; }
function hydrateItem(name){
   if(!name) return null;
   const def = itemByName(name);
   if(!def){ console.warn(`Save referenced unknown item "${name}" — dropped.`); return null; }
   return { ...def };
}

function serializeState(){
   /* quest4/quest5/class-quest fields (added after this list was first
   written) were missing here — saveGame() would silently drop that
   progress on every autosave, so reloading mid-Tinker-quest or after
   claiming a class title would revert it. Fixed alongside the similar
   allItemDefs() gap above. */
const { hp, maxHp, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs, bountyTokens,
       lastRegenAt, level, xp, xpToLevel, stats, statPoints, location, homeTown,
       spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
       commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
       quest4Accepted, quest4RareDefeated, quest4Complete,
       quest5Accepted, quest5Complete,
       quest6Accepted, quest6RareDefeated, quest6Complete,
       classQuestAccepted, classQuestComplete, classTitle,
       activeBounty, bountiesCompleted, rareDropsSeen, allRaresBonusClaimed } = state;
   return {
      hp, maxHp, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs, bountyTokens,
      lastRegenAt, level, xp, xpToLevel, stats, statPoints, location, homeTown,
      spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
      commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
      quest4Accepted, quest4RareDefeated, quest4Complete,
      quest5Accepted, quest5Complete,
      quest6Accepted, quest6RareDefeated, quest6Complete,
      classQuestAccepted, classQuestComplete, classTitle,
      activeBounty, bountiesCompleted, rareDropsSeen, allRaresBonusClaimed,
      equipment: Object.fromEntries(
         SLOT_ORDER.map(slot => [slot, serializeItem(state.equipment[slot])])
         ),
      inventory: state.inventory.map(serializeItem),
   };
}

function hydrateState(saved){
   Object.assign(state, saved);
   state.spellsKnown = Array.isArray(saved.spellsKnown) ? saved.spellsKnown.filter(id => spells.some(s=>s.id===id)) : [];
   state.equipment = {};
   SLOT_ORDER.forEach(slot => { state.equipment[slot] = hydrateItem(saved.equipment && saved.equipment[slot]); });
   state.inventory = (saved.inventory || []).map(hydrateItem).filter(Boolean);
   state.inCombat = false; state.monster = null;
   state.showVictory = false; state.victoryMonster = null;
   combatSubView = 'main';
   /* Never resume inside a shop interior, an adventure zone, or mid-combat —
   always land back in a town square. Older saves (or a corrupted/unknown
   value) have no valid homeTown, so fall back to Gladstone Hollow ('town').
   Once a second town exists (added to TOWN_HUBS in game.js), this already
   sends a returning player back to whichever town they were actually in,
   not always the original one. */
state.homeTown = TOWN_HUBS.includes(saved.homeTown) ? saved.homeTown : 'town';
   state.location = state.homeTown;
   /* Bounty board + rare-drop collection log — added after this function was
   first written, so give older saves that predate these fields sane
   fallbacks rather than leaving them undefined. */
state.activeBounty = saved.activeBounty || null;
   state.bountiesCompleted = typeof saved.bountiesCompleted === 'number' ? saved.bountiesCompleted : 0;
   state.bountyTokens = typeof saved.bountyTokens === 'number' ? saved.bountyTokens : 0;
   state.rareDropsSeen = Array.isArray(saved.rareDropsSeen) ? saved.rareDropsSeen : [];
   state.allRaresBonusClaimed = !!saved.allRaresBonusClaimed;
   recomputeMaxStats();
}

async function saveGame(){
   if(!sb) throw new Error('Accounts are unavailable — the login service failed to load.');
   const { data: { user } } = await sb.auth.getUser();
   if(!user) throw new Error('Not signed in.');
   const { error } = await sb.from('saves').upsert({ user_id: user.id, state: serializeState() });
   if(error) throw error;
}
async function loadGame(){
   if(!sb) return false;
   const { data: { user } } = await sb.auth.getUser();
   if(!user) return false;
   const { data, error } = await sb.from('saves').select('state').eq('user_id', user.id).maybeSingle();
   if(error) throw error;
   if(data && data.state){
      hydrateState(data.state);
      /* Biscuits regenerate off real elapsed time (see regenBiscuits() near
      the bottom of this file), keyed off the lastRegenAt we just hydrated
      from the save — so time spent away already counts. Fast-forward it
      here (rather than waiting for the next 1s display tick) so the gain
      is ready immediately for the "while you were away" message below. */
   const before = state.adventures;
      regenBiscuits();
      lastOfflineBiscuitGain = state.adventures - before;
      render();
      return true;
   }
   return false;
}

/* Autosave after every state-changing action — called from the bottom of
render(), so anything that updates the screen also (debounced) persists
the game. Debounced by AUTOSAVE_DEBOUNCE_MS rather than firing on every
single render(): a burst of actions (mashing Attack, spending several
stat points) collapses into one save shortly after things settle down,
instead of one Supabase write per click. Fire-and-forget — a failed
autosave logs to the console rather than interrupting play. The manual
Save button in the Account drawer still works too, for a "save right
now, don't wait" option, but nothing requires clicking it anymore. */
const AUTOSAVE_DEBOUNCE_MS = 1200;
let autosaveTimer = null;
function autosave(){
   if(!acctSession) return;
   if(autosaveTimer) clearTimeout(autosaveTimer);
   autosaveTimer = setTimeout(() => {
      autosaveTimer = null;
      saveGame().catch(e => console.warn('Autosave failed:', e.message));
   }, AUTOSAVE_DEBOUNCE_MS);
}

/* ---------------- Drawers (Inventory / Map / Character / Quests / Account) ---------------- */
const DRAWER_IDS = { inv:'inv-drawer', map:'map-drawer', character:'character-drawer', quests:'quest-log-drawer', account:'account-drawer' };

function toggleDrawer(which){
   const targetId = DRAWER_IDS[which];
   const wasOpen = document.getElementById(targetId).classList.contains('open');
   closeAllDrawers();
   if(!wasOpen){
      openDrawer(targetId);
      if(which==='character') renderCharacterDrawer();
      if(which==='quests') renderQuestLogDrawer();
      if(which==='account') renderAccountTab();
   }
}
function openDrawer(id){
   document.getElementById(id).classList.add('open');
   document.getElementById('backdrop').classList.add('show');
}
function closeAllDrawers(){
   Object.values(DRAWER_IDS).forEach(id => document.getElementById(id).classList.remove('open'));
   document.getElementById('backdrop').classList.remove('show');
}

function useItem(idx){
   const item = state.inventory[idx];
   if(item.type==='hp'){
      state.hp = Math.min(state.maxHp, state.hp+item.value);
      log(`You eat ${item.name}. Solid choice. (+${item.value} HP)`);
   } else if(item.type==='mp'){
      state.mp = Math.min(state.maxMp, state.mp+item.value);
      log(`You puzzle through ${item.name}. (+${item.value} MP)`);
   } else if(item.type==='luck'){
      state.hp = Math.min(state.maxHp, state.hp+item.hpValue);
      state.mp = Math.min(state.maxMp, state.mp+item.mpValue);
      log(`You tuck ${item.name} behind your ear for luck. (+${item.hpValue} HP, +${item.mpValue} MP)`);
   }
   state.inventory.splice(idx,1);
   render();
}

/* ---------------- Equipment & stats ---------------- */
/* Effective stats = base stats (raised by spending level-up points) plus
whatever bonuses are on currently-equipped gear. Nothing here mutates
state.stats itself — equipment bonuses are only ever additive on top. */
function getEffectiveStats(){
   const eff = { beef: state.stats.beef, zip: state.stats.zip, grit: state.stats.grit, hoodoo: state.stats.hoodoo };
   Object.values(state.equipment).forEach(item=>{
      if(item && item.bonus){
         Object.keys(item.bonus).forEach(k=>{ eff[k] = (eff[k]||0) + item.bonus[k]; });
      }
   });
   return eff;
}

/* Grit/Hoodoo (base + equipment) push max HP/MP above the level-derived
floor. Call this after anything that changes stats or equipment. */
function recomputeMaxStats(){
   const eff = getEffectiveStats();
   state.maxHp = state.baseMaxHp + eff.grit*3;
   state.maxMp = state.baseMaxMp + eff.hoodoo*2;
   state.hp = Math.min(state.hp, state.maxHp);
   state.mp = Math.min(state.mp, state.maxMp);
}

function spendStatPoint(stat){
   if(state.statPoints<=0 || !STAT_LABELS[stat]) return;
   state.stats[stat]++;
   state.statPoints--;
   recomputeMaxStats();
   clearLog();
   log(`You put your training to use. ${STAT_LABELS[stat]} increases!`);
   render();
}

function equipItem(idx){
   const item = state.inventory[idx];
   if(!item || item.type!=='equip') return;
   const slot = item.slot;
   const prev = state.equipment[slot];
   state.equipment[slot] = item;
   state.inventory.splice(idx,1);
   if(prev) state.inventory.push(prev);
   recomputeMaxStats();
   clearLog();
   log(`You equip ${item.name}.`);
   render();
}

function unequipItem(slot){
   const item = state.equipment[slot];
   if(!item) return;
   state.equipment[slot] = null;
   state.inventory.push(item);
   recomputeMaxStats();
   clearLog();
   log(`You unequip ${item.name}.`);
   render();
}

/* ---------------- In-game tutorial ---------------- */
/* Shown automatically the moment a brand-new run actually starts —
startFreshGame() (game.js) calls openTutorial() at the very end of
itself, and that function is the single choke point for guest play
(playAsGuest()), a freshly registered/logged-in account with no save
yet (enterGameAfterAuth(false)), and degraded no-Supabase boot. An
account that logs in to an *existing* save never touches
startFreshGame(), so returning players aren't re-shown this. Also
reachable any time via the "📖 How to Play" button renderAccountTab()
adds to every state of the Account drawer (signed in, guest, or even
when accounts are unavailable) — reopening always restarts at step 1,
there's no "resume where you left off" for the tutorial itself. */
const TUTORIAL_STEPS = [
   { title: 'Welcome to Gladstone Hollow', body: [
      "You've wandered into a small town with a gnome problem, a suspicious sewer, and a rake that needs avenging.",
      'This quick tour covers the basics — takes about a minute.',
      'You can reopen it anytime from the Account tab (📖 How to Play).',
      ]},
   { title: 'Biscuits & Pop Tabs', body: [
      'Biscuits are your energy — adventuring or resting at the Inn costs 1. They regenerate slowly over time, even while you’re away.',
      'Pop Tabs are your money — earned by selling loot and finishing quests, spent on gear, apples, and spells.',
      ]},
   { title: 'Around Town', body: [
      'Gladstone Hollow is a 3×3 grid of buildings — tap one to walk in.',
      'Quest-givers show a flag overhead: a red ! means a quest is offered, a green ? means it’s ready to turn in.',
      'The Shop, the Hoodoo Doctor’s Shack, the Inn, and the Casino are always open, no quest required.',
      ]},
   { title: 'Adventuring & Combat', body: [
      'Open the Map tab to travel to the Overgrown Commons (and zones you’ll unlock later), then tap Adventure!',
      'Fights are turn-based: Attack, Cast a spell once you’ve learned one, or Flee.',
      'Defeated monsters sometimes drop loot — sell the junk at the Shop, and hang onto anything quest-related.',
      ]},
   { title: 'Quests & Leveling Up', body: [
      'Check the Quest Log tab anytime to see what’s active and what’s done.',
      'Leveling up grants a stat point — spend it in the Character tab on Beef, Zip, Grit, or Hoodoo.',
      'Equip gear from your Pack to boost those stats further.',
      ]},
   { title: 'Saving Your Progress', body: [
      'Playing as a guest? Nothing saves — great for trying the game, but progress resets if you close the tab.',
      'Register a free account from the Account tab and your progress saves automatically as you play.',
      'You can come back to this tutorial anytime — look for 📖 How to Play in the Account tab.',
      ]},
   ];

let tutorialStep = 0;

function openTutorial(){
   closeAllDrawers();
   tutorialStep = 0;
   renderTutorial();
   const el = document.getElementById('tutorial-screen');
   if(el) el.style.display = 'flex';
}

function closeTutorial(){
   const el = document.getElementById('tutorial-screen');
   if(el) el.style.display = 'none';
}

function tutorialSkip(){ closeTutorial(); }

function tutorialBack(){
   if(tutorialStep <= 0) return;
   tutorialStep--;
   renderTutorial();
}

function tutorialNext(){
   if(tutorialStep >= TUTORIAL_STEPS.length - 1){ closeTutorial(); return; }
   tutorialStep++;
   renderTutorial();
}

function renderTutorial(){
   const step = TUTORIAL_STEPS[tutorialStep];
   const body = document.getElementById('tutorial-body');
   if(body){
      body.innerHTML = `
      <div class="tutorial-step-title">${step.title}</div>
      <ul class="tutorial-list">${step.body.map(line => `<li>${line}</li>`).join('')}</ul>
      `;
   }
   const dots = document.getElementById('tutorial-dots');
   if(dots){
      dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
         `<span class="tutorial-dot ${i === tutorialStep ? 'active' : ''}"></span>`
                                          ).join('');
   }
   const backBtn = document.getElementById('tutorial-back-btn');
   if(backBtn) backBtn.disabled = tutorialStep === 0;
   const nextBtn = document.getElementById('tutorial-next-btn');
   if(nextBtn) nextBtn.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Got it!' : 'Next';
}
