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
   <button class="btn-attack" onclick="resetToNewGameDev()">Full Reset (New Game)</button>
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

   <label>Lot Tier (0-${LOT_TIER_MAX})</label>
   <div class="dev-row">
   <input type="number" id="dev-lottier-input" min="0" max="${LOT_TIER_MAX}" value="${state.lotTier}">
   <button class="btn-secondary" onclick="setLotTierDev()">Set</button>
   </div>
   <div class="btn-row"><button class="btn-secondary" onclick="maxBuildingUpgradesDev()">Max Building Upgrades</button></div>

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
