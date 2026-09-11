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
  if(view === 'register'){
    return `
      <div class="acct-form">
        <label>Username</label><input type="text" id="${prefix}-reg-username" autocomplete="username">
        <label>Email</label><input type="email" id="${prefix}-reg-email" autocomplete="email">
        <label>Password</label><input type="password" id="${prefix}-reg-password" autocomplete="new-password">
        <div class="btn-row">
          <button class="btn-primary" onclick="doRegister('${prefix}')" ${busy?'disabled':''}>Register</button>
        </div>
        <div class="acct-msg" id="${prefix}-msg"></div>
        <span class="acct-link" onclick="authSetView('${prefix}','login')">Already have an account? Log in</span>
      </div>`;
  } else if(view === 'forgot'){
    return `
      <div class="acct-form">
        <label>Username</label><input type="text" id="${prefix}-forgot-username" autocomplete="username">
        <div class="btn-row">
          <button class="btn-primary" onclick="doForgotPassword('${prefix}')" ${busy?'disabled':''}>Send Reset Link</button>
        </div>
        <div class="acct-msg" id="${prefix}-msg"></div>
        <span class="acct-link" onclick="authSetView('${prefix}','login')">Back to log in</span>
      </div>`;
  }
  return `
    <div class="acct-form">
      <label>Username</label><input type="text" id="${prefix}-login-username" autocomplete="username">
      <label>Password</label><input type="password" id="${prefix}-login-password" autocomplete="current-password">
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

/* ---------------- Account drawer (available during play regardless of guest/signed-in status) ---------------- */
function renderAccountTab(){
  const btn = document.getElementById('account-tab-btn');
  const label = document.getElementById('account-tab-label');
  const el = document.getElementById('account-body');

  if(!sb){
    label.textContent = 'Account';
    if(el) el.innerHTML = `<div class="acct-status-line">Accounts aren't available right now — the login service didn't load (check your connection and reload). You can still play; nothing will be saved.</div>`;
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
    el.innerHTML = `
      <div class="acct-status-line">Signed in as <b>${acctUsername || '...'}</b> — your progress saves automatically as you play.</div>
      <div class="btn-row">
        <button class="btn-primary" id="acct-save-btn" onclick="manualSaveGame()">Save Now</button>
        <button class="btn-secondary" id="acct-load-btn" onclick="manualLoadGame()">Load</button>
      </div>
      <div class="btn-row">
        <button class="btn-secondary" onclick="doLogout()">Log Out</button>
      </div>
      <div class="acct-msg" id="acct-msg"></div>
    `;
    return;
  }

  el.innerHTML = `<div class="acct-status-line">Playing as a guest — nothing you do will be saved. Log in or register below to enable Save/Load.</div>` + renderAuthForms('acct');
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
  const potionIngredientItems = potionIngredients.map(p => p.item);
  /* veinIngredients (quest 5's gather items, content.js) were missing here
     — hydrateItem() below would silently drop them from inventory on
     save/reload since itemByName() couldn't find their def. Fixed as part
     of tagging quest items in the inventory UI. */
  const veinIngredientItems = veinIngredients.map(v => v.item);
  return [...healItems, ...shopBuyItems, ...monsterLoot, ...commanderLoot,
          ...rareDrops, ...Object.values(starterGear), ...potionIngredientItems,
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
  const { hp, maxHp, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs,
          lastRegenAt, level, xp, xpToLevel, stats, statPoints, location,
          spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
          commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
          quest4Accepted, quest4RareDefeated, quest4Complete,
          quest5Accepted, quest5Complete,
          classQuestAccepted, classQuestComplete, classTitle } = state;
  return {
    hp, maxHp, mp, maxMp, baseMaxHp, baseMaxMp, adventures, popTabs,
    lastRegenAt, level, xp, xpToLevel, stats, statPoints, location,
    spellsKnown, questTinesGiven, questAccepted, questComplete, quest2Accepted,
    commanderDefeated, quest2Complete, quest3Accepted, quest3Complete,
    quest4Accepted, quest4RareDefeated, quest4Complete,
    quest5Accepted, quest5Complete,
    classQuestAccepted, classQuestComplete, classTitle,
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
