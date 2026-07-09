/* ─────────────────────────────────────────────────────────
   Talkadoo Store — device link page (classic script, no build step).

   The parent-facing half of "sign the box in without a TV remote". A signed-in
   parent enters the 4-character code shown on the child's TV; this calls the
   device_claim(p_pairing_code) RPC AS THE SIGNED-IN PARENT (so the row binds to
   their own account), and shows success (ok===true) or try-again (ok===false).
   Accepts ?code=<CODE> to pre-fill (the in-game QR encodes LINK_URL?code=<code>).

   supabase-js is loaded from a CDN in link.html (window.supabase). Same config +
   auth pattern as store/app.js — using fetch/SDK here is fine (the no-fetch rule is
   for the GAME, not this website).
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── i18n (page chrome + link flow) ──
  var STR = {
    en: {
      lang: 'Language', title: 'Link your Talkadoo box',
      lede: "Enter the code shown on your child's TV to connect the box to your account — no typing on the TV needed.",
      notConfigured: "This page isn't connected yet. Linking needs the backend configured.",
      signInTitle: 'Sign in to link your box', signInHint: "Use the SAME account you set up on your child's Talkadoo.",
      email: 'Email', password: 'Password', signIn: 'Sign in', createAccount: 'Create account', signOut: 'Sign out',
      checkEmail: 'Check your email to confirm your account, then sign in.',
      consentLabel: "I'm the parent or guardian and I consent to Talkadoo storing my child's minimal profile — nickname, age band and language — to save their learning progress. (Required to create an account.)",
      consentRequired: 'Please tick the consent box to create an account.',
      linkTitle: 'Enter the code from the TV', linkHint: "You'll see a 4-character code on your child's Talkadoo screen.",
      codeLabel: 'Pairing code', linkBtn: 'Link box',
      linking: 'Linking…', need4: 'Enter the 4-character code from the TV.', needSignin: 'Please sign in first.',
      tryAgain: "That code didn't work. Check the TV and try again (codes expire after a few minutes).",
      linkedBody: "Your box is linked. It signs in on its own in a few seconds — you can put your phone down.",
      error: "Something went wrong. Please try again.",
      footNote: "Linking only connects this box to your account. Your child's profiles and any packs you own appear on the box automatically — you can view or delete them from the child's Talkadoo at any time.",
    },
    sv: {
      lang: 'Språk', title: 'Koppla din Talkadoo-box',
      lede: 'Skriv in koden som visas på barnets TV för att koppla boxen till ditt konto — inget behöver skrivas på TV:n.',
      notConfigured: 'Den här sidan är inte ansluten ännu. Koppling kräver att backend är konfigurerad.',
      signInTitle: 'Logga in för att koppla boxen', signInHint: 'Använd SAMMA konto som du skapade på barnets Talkadoo.',
      email: 'E-post', password: 'Lösenord', signIn: 'Logga in', createAccount: 'Skapa konto', signOut: 'Logga ut',
      checkEmail: 'Kolla din e-post för att bekräfta kontot, logga sedan in.',
      consentLabel: 'Jag är förälder eller vårdnadshavare och samtycker till att Talkadoo lagrar mitt barns minimala profil — smeknamn, åldersintervall och språk — för att spara inlärningsframsteg. (Krävs för att skapa ett konto.)',
      consentRequired: 'Kryssa i samtyckesrutan för att skapa ett konto.',
      linkTitle: 'Skriv in koden från TV:n', linkHint: 'Du ser en fyrteckenskod på barnets Talkadoo-skärm.',
      codeLabel: 'Kopplingskod', linkBtn: 'Koppla box',
      linking: 'Kopplar…', need4: 'Skriv in fyrteckenskoden från TV:n.', needSignin: 'Logga in först.',
      tryAgain: 'Koden fungerade inte. Kontrollera TV:n och försök igen (koder går ut efter några minuter).',
      linkedBody: 'Din box är kopplad. Den loggar in av sig själv om några sekunder — du kan lägga ifrån dig telefonen.',
      error: 'Något gick fel. Försök igen.',
      footNote: 'Koppling ansluter bara boxen till ditt konto. Barnets profiler och paket du äger dyker upp på boxen automatiskt — du kan visa eller radera dem från barnets Talkadoo när som helst.',
    },
    es: {
      lang: 'Idioma', title: 'Vincula tu caja Talkadoo',
      lede: 'Introduce el código que aparece en la TV de tu hijo/a para conectar la caja a tu cuenta — sin escribir nada en la TV.',
      notConfigured: 'Esta página aún no está conectada. La vinculación requiere el backend configurado.',
      signInTitle: 'Inicia sesión para vincular la caja', signInHint: 'Usa la MISMA cuenta que configuraste en el Talkadoo de tu hijo/a.',
      email: 'Correo', password: 'Contraseña', signIn: 'Iniciar sesión', createAccount: 'Crear cuenta', signOut: 'Cerrar sesión',
      checkEmail: 'Revisa tu correo para confirmar la cuenta y luego inicia sesión.',
      consentLabel: 'Soy el padre/madre o tutor/a y doy mi consentimiento para que Talkadoo almacene el perfil mínimo de mi hijo/a — apodo, franja de edad e idioma — para guardar su progreso de aprendizaje. (Obligatorio para crear una cuenta.)',
      consentRequired: 'Marca la casilla de consentimiento para crear una cuenta.',
      linkTitle: 'Introduce el código de la TV', linkHint: 'Verás un código de 4 caracteres en la pantalla del Talkadoo.',
      codeLabel: 'Código de vinculación', linkBtn: 'Vincular caja',
      linking: 'Vinculando…', need4: 'Introduce el código de 4 caracteres de la TV.', needSignin: 'Inicia sesión primero.',
      tryAgain: 'Ese código no funcionó. Comprueba la TV e inténtalo de nuevo (los códigos caducan a los pocos minutos).',
      linkedBody: 'Tu caja está vinculada. Se conecta sola en unos segundos — ya puedes dejar el teléfono.',
      error: 'Algo salió mal. Inténtalo de nuevo.',
      footNote: 'La vinculación solo conecta esta caja a tu cuenta. Los perfiles de tu hijo/a y los packs que tengas aparecen en la caja automáticamente — puedes verlos o borrarlos desde el Talkadoo cuando quieras.',
    },
    de: {
      lang: 'Sprache', title: 'Verbinde deine Talkadoo-Box',
      lede: 'Gib den Code ein, der auf dem Fernseher deines Kindes angezeigt wird, um die Box mit deinem Konto zu verbinden — kein Tippen am Fernseher nötig.',
      notConfigured: 'Diese Seite ist noch nicht verbunden. Das Verbinden braucht das konfigurierte Backend.',
      signInTitle: 'Zum Verbinden anmelden', signInHint: 'Nimm dasselbe Konto, das du auf dem Talkadoo deines Kindes eingerichtet hast.',
      email: 'E-Mail', password: 'Passwort', signIn: 'Anmelden', createAccount: 'Konto erstellen', signOut: 'Abmelden',
      checkEmail: 'Bestätige dein Konto per E-Mail und melde dich dann an.',
      consentLabel: 'Ich bin der Elternteil/Erziehungsberechtigte und willige ein, dass Talkadoo das minimale Profil meines Kindes — Spitzname, Altersgruppe und Sprache — speichert, um den Lernfortschritt zu sichern. (Zum Erstellen eines Kontos erforderlich.)',
      consentRequired: 'Bitte kreuze das Einwilligungskästchen an, um ein Konto zu erstellen.',
      linkTitle: 'Gib den Code vom Fernseher ein', linkHint: 'Auf dem Talkadoo-Bildschirm siehst du einen 4-stelligen Code.',
      codeLabel: 'Verbindungscode', linkBtn: 'Box verbinden',
      linking: 'Verbinde…', need4: 'Gib den 4-stelligen Code vom Fernseher ein.', needSignin: 'Bitte zuerst anmelden.',
      tryAgain: 'Der Code hat nicht funktioniert. Prüfe den Fernseher und versuche es erneut (Codes laufen nach ein paar Minuten ab).',
      linkedBody: 'Deine Box ist verbunden. Sie meldet sich in ein paar Sekunden von selbst an — du kannst das Handy weglegen.',
      error: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      footNote: 'Das Verbinden koppelt nur diese Box an dein Konto. Die Profile deines Kindes und gekaufte Pakete erscheinen automatisch auf der Box — du kannst sie jederzeit im Talkadoo deines Kindes ansehen oder löschen.',
    },
  };

  var LANGS = ['en', 'sv', 'es', 'de'];
  var LANG_KEY = 'talkadoo_store_lang';

  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  function pickLang() {
    var q = (qs('lang') || '').toLowerCase();
    if (LANGS.indexOf(q) !== -1) return q;
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : 'en';
  }

  var lang = pickLang();
  var cfg = (typeof window !== 'undefined' && window.TALKADOO_STORE_CONFIG) || {};

  // ── Supabase client (only when configured) ──
  var sb = null;
  var configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  if (configured) sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  var currentUser = null;

  // Parental consent. We record it with the SAME shape the box/phone flows use — a
  // consents row {parent_id, version, accepted_at}, version = CONSENT_VERSION — so all
  // flows write the same value. The store config may set CONSENT_VERSION; default to the
  // value the box ships. CONSENT_PENDING_KEY marks "this browser just consented at
  // sign-up" so the row is written the moment the account is authenticated (now, or on
  // the first sign-in after email confirmation) — a plain sign-in never triggers it.
  var CONSENT_VERSION = cfg.CONSENT_VERSION || '2026-06-30';
  var CONSENT_PENDING_KEY = 'talkadoo_link_pending_consent';

  // The code from the URL (?code=), kept across a sign-in so it's still pre-filled
  // after the parent authenticates. Normalised to the pairing alphabet.
  var urlCode = normalizeCode(qs('code') || '');

  function t(key) { return (STR[lang] && STR[lang][key]) || STR.en[key] || key; }
  function el(id) { return document.getElementById(id); }

  // Pairing codes are 4 chars from an unambiguous UPPER-CASE alphabet (no 0/O/1/I).
  // Strip anything else and cap at 4 so paste/typos are forgiven; device_claim also
  // upper()s + trim()s server-side, so an exact match still requires the right chars.
  function normalizeCode(raw) {
    return String(raw || '').toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 4);
  }

  function applyChrome() {
    document.documentElement.lang = lang;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (STR[lang] && STR[lang][k]) nodes[i].textContent = STR[lang][k];
      else if (STR.en[k]) nodes[i].textContent = STR.en[k];
    }
    var sel = el('lang-select'); if (sel) sel.value = lang;
    el('config-warning').hidden = configured;
  }

  function setAuthMsg(msg, kind) {
    var n = el('auth-msg'); if (!n) return;
    n.textContent = msg || '';
    n.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }
  function setLinkMsg(msg, kind) {
    var n = el('link-msg'); if (!n) return;
    n.textContent = msg || '';
    n.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }

  // Write the consents row for a just-created account — ONLY when this browser has a
  // pending consent for this exact user (set at sign-up). Same shape/columns the box +
  // phone use: {parent_id, version, accepted_at}, upserted on the (parent_id, version)
  // primary key (merge-duplicates). A plain sign-in has no pending flag → no write.
  function maybeWriteConsent(user) {
    if (!sb || !user || !user.id) return;
    var pending = null;
    try { pending = localStorage.getItem(CONSENT_PENDING_KEY); } catch (e) { /* ignore */ }
    if (!pending || pending !== user.email) return;
    sb.from('consents').upsert(
      { parent_id: user.id, version: CONSENT_VERSION, accepted_at: new Date().toISOString() },
      { onConflict: 'parent_id,version' }
    ).then(function (res) {
      // Clear the flag on success; on error keep it so the next authenticated load retries.
      if (!res || !res.error) { try { localStorage.removeItem(CONSENT_PENDING_KEY); } catch (e) { /* ignore */ } }
    });
  }

  // Toggle sign-in vs link card based on auth state.
  function onAuth(user) {
    currentUser = user || null;
    var chip = el('auth-chip');
    if (currentUser) {
      maybeWriteConsent(currentUser);   // records consent iff this browser just signed up
      // Signed in with no box-pairing code to enter → go straight to the parent dashboard.
      // A QR scan carries ?code=, so in that case we stay here to pair first, then hand off
      // to the dashboard from onLinked().
      if (!urlCode) { goToDashboard(); return; }
      chip.hidden = false;
      el('auth-email').textContent = currentUser.email || '';
      el('auth-panel').hidden = true;
      el('link-panel').hidden = false;
      // Fresh form each time we (re)enter the link card.
      el('link-done').hidden = true;
      el('link-form').hidden = false;
      var codeInput = el('code');
      if (urlCode) codeInput.value = urlCode;
      try { (urlCode ? el('link-btn') : codeInput).focus(); } catch (e) { /* ignore */ }
    } else {
      chip.hidden = true;
      el('auth-panel').hidden = !configured;   // nothing to sign into if unconfigured
      el('link-panel').hidden = true;
    }
  }

  // ── The claim itself ──
  function submitCode(e) {
    if (e) e.preventDefault();
    if (!configured || !sb) { setLinkMsg(t('notConfigured'), 'error'); return; }
    if (!currentUser) { setLinkMsg(t('needSignin'), 'error'); onAuth(null); return; }
    var code = normalizeCode(el('code').value);
    el('code').value = code;
    if (code.length !== 4) { setLinkMsg(t('need4'), 'error'); return; }

    var btn = el('link-btn');
    btn.disabled = true;
    setLinkMsg(t('linking'));
    // device_claim runs as the signed-in parent: it sets parent_id = auth.uid() and
    // returns true on success, false if the code is unknown/expired/already-claimed.
    sb.rpc('device_claim', { p_pairing_code: code }).then(function (res) {
      btn.disabled = false;
      if (res.error) { setLinkMsg(res.error.message || t('error'), 'error'); return; }
      if (res.data === true) { onLinked(); }
      else { setLinkMsg(t('tryAgain'), 'error'); try { el('code').select(); } catch (x) {} }
    }, function (err) {
      btn.disabled = false;
      setLinkMsg((err && err.message) || t('error'), 'error');
    });
  }

  function onLinked() {
    setLinkMsg('');
    el('link-form').hidden = true;
    el('link-done').hidden = false;
    urlCode = '';   // consumed
    // Show the "linked ✅" confirmation briefly, then hand off to the parent dashboard.
    setTimeout(goToDashboard, 1600);
  }

  // After sign-in (and after a box is paired), send the parent to the dashboard. Same
  // origin as this page, so the Supabase session carries over and it opens signed-in.
  // Relative 'parent.html' resolves whether the page is served at /link or /link.html.
  function goToDashboard() {
    var q = lang ? ('?lang=' + encodeURIComponent(lang)) : '';
    try { location.replace('parent.html' + q); } catch (e) { location.href = 'parent.html' + q; }
  }

  // ── Auth wiring (same shape as store/app.js) ──
  function wireAuth() {
    if (!configured || !sb) return;
    el('auth-form').addEventListener('submit', function (e) {
      e.preventDefault();
      setAuthMsg('');
      var email = el('email').value.trim(), pw = el('password').value;
      sb.auth.signInWithPassword({ email: email, password: pw }).then(function (res) {
        if (res.error) return setAuthMsg(res.error.message, 'error');
        onAuth(res.data && res.data.user);
      });
    });
    el('signup-btn').addEventListener('click', function () {
      setAuthMsg('');
      var email = el('email').value.trim(), pw = el('password').value;
      if (!email || !pw) return setAuthMsg(t('email') + ' + ' + t('password'), 'error');
      // GDPR: creating an account is blocked until the parent ticks consent. (Sign-in
      // above does NOT check this — an existing parent signs in with no consent prompt.)
      var consent = el('consent-check');
      if (!consent || !consent.checked) return setAuthMsg(t('consentRequired'), 'error');
      sb.auth.signUp({ email: email, password: pw }).then(function (res) {
        if (res.error) return setAuthMsg(res.error.message, 'error');
        // Mark this browser's consent so the consents row is written the moment the
        // account is authenticated — now (session returned) or on the first sign-in
        // after email confirmation. Keyed by email so a plain sign-in never writes it.
        try { localStorage.setItem(CONSENT_PENDING_KEY, email); } catch (e) { /* ignore */ }
        if (res.data && res.data.session) onAuth(res.data.user);   // signed in → consent written in onAuth
        else setAuthMsg(t('checkEmail'), 'ok');                    // confirm email, then sign in → written then
      });
    });
    el('signout-btn').addEventListener('click', function () {
      sb.auth.signOut().then(function () { onAuth(null); });
    });
    sb.auth.onAuthStateChange(function (_evt, session) { onAuth(session && session.user); });
  }

  // ── boot ──
  function boot() {
    el('lang-select').addEventListener('change', function (e) {
      lang = e.target.value;
      try { localStorage.setItem(LANG_KEY, lang); } catch (err) { /* ignore */ }
      applyChrome();
    });
    el('link-form').addEventListener('submit', submitCode);
    el('code').addEventListener('input', function () {
      // Live-normalise as they type (uppercase, drop stray chars).
      var pos = this.selectionStart;
      this.value = normalizeCode(this.value);
      try { this.setSelectionRange(pos, pos); } catch (e) { /* ignore */ }
    });

    applyChrome();
    if (configured) {
      wireAuth();
      sb.auth.getSession().then(function (res) {
        onAuth(res && res.data && res.data.session && res.data.session.user);
      });
    } else {
      el('auth-panel').hidden = true;
      el('link-panel').hidden = true;   // can't link without a backend
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
