/* ─────────────────────────────────────────────────────────
   Talkadoo Store — parent app (classic script, no build step).

   The parent-facing companion described in pi-service/PHONE-CONTRACT.md. A signed-in
   parent manages their children and drives the child's TV LIVE — all by reading and
   writing the SAME Supabase project the box uses, tied together by the account. The
   phone and the box never talk directly; they meet in Supabase.

   What this page does (all as the signed-in parent, RLS-scoped to their own rows):
     1. Auth: sign in / sign up (+ parental consent), sign out.
     2. children: list, add, edit, delete   (minimal PII only: nickname, age band,
        avatar, l1, target — the DB + box reject extra identity fields).
     3. game_state: upsert {active_child_id, language, category, updated_by:'phone'}
        on parent_id — writing this is what switches the active child / language /
        category on the TV in real time (the box is subscribed via Realtime).
     4. learning_events: read a child's recent progress.

   supabase-js is loaded from a CDN in parent.html (window.supabase). Same config +
   auth + consent pattern as store/link.js.
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  // ── i18n (page chrome + parent flow) ──
  var STR = {
    en: {
      lang: 'Language', title: 'Your Talkadoo',
      lede: "Add your children and choose what plays on the TV — changes appear on your child's screen automatically.",
      notConfigured: "This page isn't connected yet. It needs the backend configured.",
      signInTitle: 'Sign in', signInHint: "Use the SAME account you set up on your child's Talkadoo.",
      email: 'Email', password: 'Password', signIn: 'Sign in', createAccount: 'Create account', signOut: 'Sign out',
      checkEmail: 'Check your email to confirm your account, then sign in.',
      consentLabel: "I'm the parent or guardian and I consent to Talkadoo storing my child's minimal profile — nickname, age band and language — to save their learning progress. (Required to create an account.)",
      consentRequired: 'Please tick the consent box to create an account.',
      childrenTitle: 'Children', childrenHint: 'Tap a child to make them the active player on the TV.',
      addChild: 'Add a child', editChild: 'Edit child', noChildren: "No children yet — add your first one below.",
      nickname: 'First name / nickname', ageBand: 'Age', l1: 'Home language', target: 'Learning', avatarLabel: 'Pick an avatar',
      save: 'Save', cancel: 'Cancel', delete: 'Delete', active: 'Playing now', makeActive: 'Play',
      deleteConfirm: 'Delete this child and all their progress? This cannot be undone.',
      nowPlaying: 'On the TV now', nowPlayingHint: 'These take effect on the TV within a second or two.',
      playLang: 'Language on the TV', category: 'Game / category', pickChildFirst: 'Add and select a child first.',
      sent: 'Sent to the TV ✓', sending: 'Sending…',
      settingsTitle: 'Settings', settingsHint: 'These apply on the TV within a second or two.',
      sessionLength: 'Session length', minutesShort: 'min',
      voiceLabel: 'Instruction voice', voiceRecorded: 'Alexandra (recorded)', voiceAuto: 'Auto friendly voice',
      settingsSaved: 'Saved ✓',
      remoteTitle: 'Remote', remoteHint: 'Control the TV like a remote.',
      remoteStart: "▶ Let's go", remotePause: '⏸ Pause', remoteResume: '▶ Resume', remoteBack: '← Back', remoteQuit: '■ Quit to menu',
      remoteNavHint: 'Move around the TV and press OK to select.', remoteDpad: 'Directional pad',
      navUp: 'Up', navDown: 'Down', navLeft: 'Left', navRight: 'Right', navOk: 'OK',
      progressTitle: 'Progress', progressHint: 'A summary for grown-ups.', progressNone: 'No progress recorded yet.',
      progressOnTv: '📺 Full report on TV',
      tvStatusTitle: 'Now on the TV', tvStatusNone: 'Nothing on the TV yet.',
      statusMenu: 'On the menu', statusChoosing: 'Choosing a game', statusReady: 'Getting ready',
      statusPlaying: '▶ Playing', statusResults: 'Results', statusReport: 'Grown-ups report',
      statusOther: 'On the TV', statusPaused: 'Paused',
      known: 'Known', learning: 'Learning', seen: 'Seen', refresh: 'Refresh',
      pLearned: 'Learned ✓', pLearning: 'Learning…',
      error: 'Something went wrong. Please try again.',
      bandYears: 'yrs',
    },
    sv: {
      lang: 'Språk', title: 'Din Talkadoo',
      lede: 'Lägg till dina barn och välj vad som spelas på TV:n — ändringar visas på barnets skärm automatiskt.',
      notConfigured: 'Den här sidan är inte ansluten ännu. Den kräver att backend är konfigurerad.',
      signInTitle: 'Logga in', signInHint: 'Använd SAMMA konto som du skapade på barnets Talkadoo.',
      email: 'E-post', password: 'Lösenord', signIn: 'Logga in', createAccount: 'Skapa konto', signOut: 'Logga ut',
      checkEmail: 'Kolla din e-post för att bekräfta kontot, logga sedan in.',
      consentLabel: 'Jag är förälder eller vårdnadshavare och samtycker till att Talkadoo lagrar mitt barns minimala profil — smeknamn, åldersintervall och språk — för att spara inlärningsframsteg. (Krävs för att skapa ett konto.)',
      consentRequired: 'Kryssa i samtyckesrutan för att skapa ett konto.',
      childrenTitle: 'Barn', childrenHint: 'Tryck på ett barn för att göra det till aktiv spelare på TV:n.',
      addChild: 'Lägg till barn', editChild: 'Ändra barn', noChildren: 'Inga barn ännu — lägg till det första nedan.',
      nickname: 'Förnamn / smeknamn', ageBand: 'Ålder', l1: 'Hemspråk', target: 'Lär sig', avatarLabel: 'Välj en avatar',
      save: 'Spara', cancel: 'Avbryt', delete: 'Radera', active: 'Spelar nu', makeActive: 'Spela',
      deleteConfirm: 'Radera detta barn och alla dess framsteg? Detta kan inte ångras.',
      nowPlaying: 'På TV:n nu', nowPlayingHint: 'Dessa träder i kraft på TV:n inom någon sekund.',
      playLang: 'Språk på TV:n', category: 'Spel / kategori', pickChildFirst: 'Lägg till och välj ett barn först.',
      sent: 'Skickat till TV:n ✓', sending: 'Skickar…',
      settingsTitle: 'Inställningar', settingsHint: 'Dessa träder i kraft på TV:n inom någon sekund.',
      sessionLength: 'Speltid', minutesShort: 'min',
      voiceLabel: 'Röst för instruktioner', voiceRecorded: 'Evelina (inspelad)', voiceAuto: 'Automatisk vänlig röst',
      settingsSaved: 'Sparat ✓',
      remoteTitle: 'Fjärrkontroll', remoteHint: 'Styr TV:n som en fjärrkontroll.',
      remoteStart: '▶ Nu kör vi', remotePause: '⏸ Pausa', remoteResume: '▶ Fortsätt', remoteBack: '← Tillbaka', remoteQuit: '■ Avsluta till menyn',
      remoteNavHint: 'Flytta runt på TV:n och tryck OK för att välja.', remoteDpad: 'Styrkors',
      navUp: 'Upp', navDown: 'Ner', navLeft: 'Vänster', navRight: 'Höger', navOk: 'OK',
      progressTitle: 'Framsteg', progressHint: 'En sammanfattning för vuxna.', progressNone: 'Inga framsteg registrerade ännu.',
      progressOnTv: '📺 Fullständig rapport på TV:n',
      tvStatusTitle: 'På TV:n nu', tvStatusNone: 'Inget på TV:n än.',
      statusMenu: 'I menyn', statusChoosing: 'Väljer ett spel', statusReady: 'Gör sig redo',
      statusPlaying: '▶ Spelar', statusResults: 'Resultat', statusReport: 'Vuxenrapport',
      statusOther: 'På TV:n', statusPaused: 'Pausad',
      known: 'Kan', learning: 'Lär sig', seen: 'Sett', refresh: 'Uppdatera',
      pLearned: 'Lärt sig ✓', pLearning: 'Lär sig…',
      error: 'Något gick fel. Försök igen.',
      bandYears: 'år',
    },
    es: {
      lang: 'Idioma', title: 'Tu Talkadoo',
      lede: 'Añade a tus hijos y elige qué se juega en la TV — los cambios aparecen en la pantalla automáticamente.',
      notConfigured: 'Esta página aún no está conectada. Necesita el backend configurado.',
      signInTitle: 'Iniciar sesión', signInHint: 'Usa la MISMA cuenta que configuraste en el Talkadoo de tu hijo/a.',
      email: 'Correo', password: 'Contraseña', signIn: 'Iniciar sesión', createAccount: 'Crear cuenta', signOut: 'Cerrar sesión',
      checkEmail: 'Revisa tu correo para confirmar la cuenta y luego inicia sesión.',
      consentLabel: 'Soy el padre/madre o tutor/a y doy mi consentimiento para que Talkadoo almacene el perfil mínimo de mi hijo/a — apodo, franja de edad e idioma — para guardar su progreso de aprendizaje. (Obligatorio para crear una cuenta.)',
      consentRequired: 'Marca la casilla de consentimiento para crear una cuenta.',
      childrenTitle: 'Niños', childrenHint: 'Toca a un niño para hacerlo el jugador activo en la TV.',
      addChild: 'Añadir niño', editChild: 'Editar niño', noChildren: 'Aún no hay niños — añade el primero abajo.',
      nickname: 'Nombre / apodo', ageBand: 'Edad', l1: 'Idioma de casa', target: 'Aprende', avatarLabel: 'Elige un avatar',
      save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', active: 'Jugando ahora', makeActive: 'Jugar',
      deleteConfirm: '¿Eliminar a este niño y todo su progreso? No se puede deshacer.',
      nowPlaying: 'En la TV ahora', nowPlayingHint: 'Se aplican en la TV en uno o dos segundos.',
      playLang: 'Idioma en la TV', category: 'Juego / categoría', pickChildFirst: 'Añade y selecciona un niño primero.',
      sent: 'Enviado a la TV ✓', sending: 'Enviando…',
      settingsTitle: 'Ajustes', settingsHint: 'Se aplican en la TV en uno o dos segundos.',
      sessionLength: 'Duración de sesión', minutesShort: 'min',
      voiceLabel: 'Voz de instrucciones', voiceRecorded: 'Sandra (grabada)', voiceAuto: 'Voz amable automática',
      settingsSaved: 'Guardado ✓',
      remoteTitle: 'Mando', remoteHint: 'Controla la TV como un mando.',
      remoteStart: '▶ ¡Vamos!', remotePause: '⏸ Pausar', remoteResume: '▶ Reanudar', remoteBack: '← Atrás', remoteQuit: '■ Salir al menú',
      remoteNavHint: 'Muévete por la TV y pulsa OK para seleccionar.', remoteDpad: 'Cruceta',
      navUp: 'Arriba', navDown: 'Abajo', navLeft: 'Izquierda', navRight: 'Derecha', navOk: 'OK',
      progressTitle: 'Progreso', progressHint: 'Un resumen para adultos.', progressNone: 'Aún no hay progreso registrado.',
      progressOnTv: '📺 Informe completo en la TV',
      tvStatusTitle: 'En la TV ahora', tvStatusNone: 'Nada en la TV todavía.',
      statusMenu: 'En el menú', statusChoosing: 'Eligiendo un juego', statusReady: 'Preparándose',
      statusPlaying: '▶ Jugando', statusResults: 'Resultados', statusReport: 'Informe para adultos',
      statusOther: 'En la TV', statusPaused: 'En pausa',
      known: 'Sabe', learning: 'Aprendiendo', seen: 'Visto', refresh: 'Actualizar',
      pLearned: 'Aprendido ✓', pLearning: 'Aprendiendo…',
      error: 'Algo salió mal. Inténtalo de nuevo.',
      bandYears: 'años',
    },
    de: {
      lang: 'Sprache', title: 'Dein Talkadoo',
      lede: 'Füge deine Kinder hinzu und wähle, was auf dem Fernseher läuft — Änderungen erscheinen automatisch auf dem Bildschirm deines Kindes.',
      notConfigured: 'Diese Seite ist noch nicht verbunden. Sie braucht das konfigurierte Backend.',
      signInTitle: 'Anmelden', signInHint: 'Nimm dasselbe Konto, das du auf dem Talkadoo deines Kindes eingerichtet hast.',
      email: 'E-Mail', password: 'Passwort', signIn: 'Anmelden', createAccount: 'Konto erstellen', signOut: 'Abmelden',
      checkEmail: 'Bestätige dein Konto per E-Mail und melde dich dann an.',
      consentLabel: 'Ich bin der Elternteil/Erziehungsberechtigte und willige ein, dass Talkadoo das minimale Profil meines Kindes — Spitzname, Altersgruppe und Sprache — speichert, um den Lernfortschritt zu sichern. (Zum Erstellen eines Kontos erforderlich.)',
      consentRequired: 'Bitte kreuze das Einwilligungskästchen an, um ein Konto zu erstellen.',
      childrenTitle: 'Kinder', childrenHint: 'Tippe auf ein Kind, um es zum aktiven Spieler am Fernseher zu machen.',
      addChild: 'Kind hinzufügen', editChild: 'Kind bearbeiten', noChildren: 'Noch keine Kinder — füge unten das erste hinzu.',
      nickname: 'Vorname / Spitzname', ageBand: 'Alter', l1: 'Zuhause-Sprache', target: 'Lernt', avatarLabel: 'Wähle einen Avatar',
      save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', active: 'Spielt gerade', makeActive: 'Spielen',
      deleteConfirm: 'Dieses Kind und seinen gesamten Fortschritt löschen? Das kann nicht rückgängig gemacht werden.',
      nowPlaying: 'Jetzt am Fernseher', nowPlayingHint: 'Diese wirken innerhalb von ein bis zwei Sekunden am Fernseher.',
      playLang: 'Sprache am Fernseher', category: 'Spiel / Kategorie', pickChildFirst: 'Füge zuerst ein Kind hinzu und wähle es aus.',
      sent: 'An den Fernseher gesendet ✓', sending: 'Senden…',
      settingsTitle: 'Einstellungen', settingsHint: 'Diese wirken innerhalb von ein bis zwei Sekunden am Fernseher.',
      sessionLength: 'Spieldauer', minutesShort: 'Min',
      voiceLabel: 'Stimme für Anweisungen', voiceRecorded: 'Katja (aufgenommen)', voiceAuto: 'Automatische freundliche Stimme',
      settingsSaved: 'Gespeichert ✓',
      remoteTitle: 'Fernbedienung', remoteHint: 'Steuere den Fernseher wie eine Fernbedienung.',
      remoteStart: "▶ Los geht's", remotePause: '⏸ Pause', remoteResume: '▶ Weiter', remoteBack: '← Zurück', remoteQuit: '■ Zum Menü beenden',
      remoteNavHint: 'Navigiere über den Fernseher und drücke OK zum Auswählen.', remoteDpad: 'Steuerkreuz',
      navUp: 'Hoch', navDown: 'Runter', navLeft: 'Links', navRight: 'Rechts', navOk: 'OK',
      progressTitle: 'Fortschritt', progressHint: 'Eine Zusammenfassung für Erwachsene.', progressNone: 'Noch kein Fortschritt erfasst.',
      progressOnTv: '📺 Vollständiger Bericht am TV',
      tvStatusTitle: 'Jetzt am Fernseher', tvStatusNone: 'Noch nichts am Fernseher.',
      statusMenu: 'Im Menü', statusChoosing: 'Wählt ein Spiel', statusReady: 'Macht sich bereit',
      statusPlaying: '▶ Spielt', statusResults: 'Ergebnisse', statusReport: 'Bericht für Erwachsene',
      statusOther: 'Am Fernseher', statusPaused: 'Pausiert',
      known: 'Kann', learning: 'Lernt', seen: 'Gesehen', refresh: 'Aktualisieren',
      pLearned: 'Gelernt ✓', pLearning: 'Am Lernen',
      error: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      bandYears: 'J.',
    },
  };

  // Languages the game supports (child l1/target + the live TV language).
  var LANGS = ['en', 'sv', 'es', 'de'];
  var LANG_LABEL = { en: 'English', sv: 'Svenska', es: 'Español', de: 'Deutsch' };
  var LANG_KEY = 'talkadoo_store_lang';
  var AGE_BANDS = ['4-5', '5-6', '6-7'];
  var AVATARS = ['🐰', '🐱', '🐶', '🦊', '🐻', '🐼', '🦁', '🐨', '🐸', '🦄', '🐯', '🐧', '🐷', '🐵'];

  // Session length bounds — mirror the game (GAME_MIN/MAX/DEFAULT_SESSION_DURATION_MINUTES).
  var SESSION_MIN = 5, SESSION_MAX = 10, SESSION_DEFAULT = 10;
  var VOICE_DEFAULT = 'recorded';

  // Categories the parent can push to the TV. Core (animals/actions) are always
  // playable; the rest are catalog packs (mirrors packs/catalog.js) — selecting one
  // still sets game_state, but it only plays on the box if that pack is owned+installed.
  var CATEGORIES = [
    { id: 'animals', emoji: '🐾', core: true, title: { en: 'Animals', sv: 'Djur', es: 'Animales', de: 'Tiere' } },
    { id: 'actions', emoji: '🤸', core: true, title: { en: 'Actions', sv: 'Rörelser', es: 'Acciones', de: 'Aktionen' } },
    { id: 'household', emoji: '🛏️', title: { en: 'Household Objects', sv: 'Saker hemma', es: 'Objetos de casa', de: 'Sachen zu Hause' } },
    { id: 'colours', emoji: '🎨', title: { en: 'Colours', sv: 'Färger', es: 'Colores', de: 'Farben' } },
    { id: 'fruits', emoji: '🍎', title: { en: 'Fruits', sv: 'Frukter', es: 'Frutas', de: 'Früchte' } },
    { id: 'alphabets', emoji: '🔤', title: { en: 'Alphabet', sv: 'Alfabetet', es: 'Alfabeto', de: 'Alphabet' } },
    { id: 'numbers', emoji: '🔢', title: { en: 'Numbers', sv: 'Siffror', es: 'Números', de: 'Zahlen' } },
    { id: 'body', emoji: '👋', title: { en: 'Body Parts', sv: 'Kroppsdelar', es: 'Partes del cuerpo', de: 'Körperteile' } },
    { id: 'family', emoji: '👪', title: { en: 'Family', sv: 'Familj', es: 'Familia', de: 'Familie' } },
    { id: 'food', emoji: '🍞', title: { en: 'Food', sv: 'Mat', es: 'Comida', de: 'Essen' } },
    { id: 'clothes', emoji: '👕', title: { en: 'Clothes', sv: 'Kläder', es: 'Ropa', de: 'Kleidung' } },
    { id: 'shapes', emoji: '🔷', title: { en: 'Shapes', sv: 'Former', es: 'Formas', de: 'Formen' } },
    { id: 'nature', emoji: '🌳', title: { en: 'Nature', sv: 'Naturen', es: 'Naturaleza', de: 'Natur' } },
  ];

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
  var children = [];            // rows from `children`
  var selectedChildId = null;   // active_child_id (from game_state)
  var gameState = null;         // the parent's game_state row
  var boxSettings = null;       // the parent's box_settings row (session length + voice)
  var boxStatus = null;         // the box's box_status row (what's on the TV now; read-only)
  var editingId = null;         // child id being edited (null = adding new)
  var stateChannel = null;      // Realtime subscription to game_state
  var statusChannel = null;     // Realtime subscription to box_status

  // Consent — same shape/columns the box + link page write.
  var CONSENT_VERSION = cfg.CONSENT_VERSION || '2026-06-30';
  var CONSENT_PENDING_KEY = 'talkadoo_link_pending_consent';

  function t(key) { return (STR[lang] && STR[lang][key]) || STR.en[key] || key; }
  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function catTitle(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? (c.title[lang] || c.title.en) : id;
  }
  // App-generated child id, same format the box uses (game.js genChildId): 'c_' + 6 base36.
  function newChildId() {
    var existing = {};
    children.forEach(function (c) { existing[c.id] = true; });
    var id;
    do { id = 'c_' + Math.random().toString(36).slice(2, 8); } while (existing[id]);
    return id;
  }

  function applyChrome() {
    document.documentElement.lang = lang;
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (STR[lang] && STR[lang][k]) nodes[i].textContent = STR[lang][k];
      else if (STR.en[k]) nodes[i].textContent = STR.en[k];
    }
    // aria-label localisation (D-pad buttons have icon glyphs, so the label carries meaning).
    var arias = document.querySelectorAll('[data-i18n-aria-label]');
    for (var j = 0; j < arias.length; j++) {
      var ak = arias[j].getAttribute('data-i18n-aria-label');
      arias[j].setAttribute('aria-label', (STR[lang] && STR[lang][ak]) || STR.en[ak] || ak);
    }
    var sel = el('lang-select'); if (sel) sel.value = lang;
    el('config-warning').hidden = configured;
  }

  function setAuthMsg(msg, kind) {
    var n = el('auth-msg'); if (!n) return;
    n.textContent = msg || '';
    n.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }
  function setPlayMsg(msg, kind) {
    var n = el('play-msg'); if (!n) return;
    n.textContent = msg || '';
    n.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }
  function setMsgOn(id, msg, kind) {
    var n = el(id); if (!n) return;
    n.textContent = msg || '';
    n.className = 'auth-msg' + (kind ? ' ' + kind : '');
  }

  function maybeWriteConsent(user) {
    if (!sb || !user || !user.id) return;
    var pending = null;
    try { pending = localStorage.getItem(CONSENT_PENDING_KEY); } catch (e) { /* ignore */ }
    if (!pending || pending !== user.email) return;
    sb.from('consents').upsert(
      { parent_id: user.id, version: CONSENT_VERSION, accepted_at: new Date().toISOString() },
      { onConflict: 'parent_id,version' }
    ).then(function (res) {
      if (!res || !res.error) { try { localStorage.removeItem(CONSENT_PENDING_KEY); } catch (e) { /* ignore */ } }
    });
  }

  // ── Auth state → show sign-in vs dashboard ──
  function onAuth(user) {
    currentUser = user || null;
    var chip = el('auth-chip');
    if (currentUser) {
      maybeWriteConsent(currentUser);
      chip.hidden = false;
      el('auth-email').textContent = currentUser.email || '';
      el('auth-panel').hidden = true;
      el('dash').hidden = false;
      loadAll();
      subscribeState();
    } else {
      chip.hidden = true;
      el('auth-panel').hidden = !configured;
      el('dash').hidden = true;
      if (stateChannel) { try { sb.removeChannel(stateChannel); } catch (e) {} stateChannel = null; }
      if (statusChannel) { try { sb.removeChannel(statusChannel); } catch (e) {} statusChannel = null; }
      boxStatus = null;
    }
  }

  // ── Load children + current game_state ──
  function loadAll() {
    if (!sb) return;
    Promise.all([
      sb.from('children').select('*').order('created_at', { ascending: true }),
      sb.from('game_state').select('*').maybeSingle(),
      sb.from('box_settings').select('*').maybeSingle(),
      sb.from('box_status').select('*').maybeSingle(),
    ]).then(function (res) {
      var childRes = res[0], stateRes = res[1], setRes = res[2], statusRes = res[3];
      children = (childRes && childRes.data) || [];
      gameState = (stateRes && stateRes.data) || null;
      boxSettings = (setRes && setRes.data) || null;
      boxStatus = (statusRes && statusRes.data) || null;
      selectedChildId = gameState ? gameState.active_child_id : null;
      // Default the live controls to the current state (or sensible fallbacks).
      var langSel = el('play-lang');
      if (langSel) langSel.value = (gameState && gameState.language) || (children[0] && children[0].target) || 'en';
      renderChildren();
      renderCategories();
      renderSettings();
      renderTvStatus();
      renderProgress();
    });
  }

  // ── Children list ──
  function renderChildren() {
    var host = el('children-list');
    if (!host) return;
    if (!children.length) {
      host.innerHTML = '<p class="muted">' + esc(t('noChildren')) + '</p>';
    } else {
      host.innerHTML = children.map(function (c) {
        var isActive = c.id === selectedChildId;
        return '' +
          '<div class="child-card' + (isActive ? ' is-active' : '') + '" data-id="' + esc(c.id) + '">' +
            '<div class="child-avatar">' + esc(c.avatar || '🙂') + '</div>' +
            '<div class="child-main">' +
              '<div class="child-name">' + esc(c.nickname) + (isActive ? ' <span class="badge">' + esc(t('active')) + '</span>' : '') + '</div>' +
              '<div class="child-meta muted small">' + esc(c.age_band) + ' ' + esc(t('bandYears')) +
                ' · ' + esc(LANG_LABEL[c.l1] || c.l1) + ' → ' + esc(LANG_LABEL[c.target] || c.target) + '</div>' +
            '</div>' +
            '<div class="child-actions">' +
              (isActive ? '' : '<button type="button" class="btn btn-primary btn-sm" data-act="play" data-id="' + esc(c.id) + '">' + esc(t('makeActive')) + '</button>') +
              '<button type="button" class="btn btn-ghost btn-sm" data-act="edit" data-id="' + esc(c.id) + '">' + esc(t('editChild')) + '</button>' +
              '<button type="button" class="btn btn-ghost btn-sm danger" data-act="del" data-id="' + esc(c.id) + '">' + esc(t('delete')) + '</button>' +
            '</div>' +
          '</div>';
      }).join('');
      host.querySelectorAll('[data-act]').forEach(function (btn) {
        var id = btn.getAttribute('data-id'), act = btn.getAttribute('data-act');
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (act === 'play') setActiveChild(id);
          else if (act === 'edit') startEdit(id);
          else if (act === 'del') deleteChild(id);
        });
      });
      // Tapping the card body also makes that child active.
      host.querySelectorAll('.child-card').forEach(function (card) {
        card.addEventListener('click', function () { setActiveChild(card.getAttribute('data-id')); });
      });
    }
    // keep the child <select> in the live controls in sync
    var sel = el('play-child');
    if (sel) {
      sel.innerHTML = children.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === selectedChildId ? ' selected' : '') + '>' + esc(c.nickname) + '</option>';
      }).join('') || '<option value="">—</option>';
    }
  }

  // ── Add / edit child form ──
  // Re-render the avatar chips (localised nothing — just marks `selected`). The HTML also
  // ships these chips statically, so the picker is never empty even if this doesn't run;
  // clicks are handled by a delegated listener in boot(), not per-chip here.
  function renderAvatarPicker(selected) {
    var host = el('avatar-picker');
    if (!host) return;
    host.innerHTML = AVATARS.map(function (a, i) {
      var on = selected ? a === selected : i === 0;
      return '<button type="button" class="avatar-chip' + (on ? ' selected' : '') + '" data-avatar="' + a + '">' + a + '</button>';
    }).join('');
  }
  function fillLangSelect(sel, selected) {
    if (!sel) return;
    sel.innerHTML = LANGS.map(function (l) {
      return '<option value="' + l + '"' + (l === selected ? ' selected' : '') + '>' + esc(LANG_LABEL[l]) + '</option>';
    }).join('');
  }
  function fillBandSelect(sel, selected) {
    if (!sel) return;
    sel.innerHTML = AGE_BANDS.map(function (b) {
      return '<option value="' + b + '"' + (b === selected ? ' selected' : '') + '>' + b + ' ' + esc(t('bandYears')) + '</option>';
    }).join('');
  }
  function openForm(child) {
    editingId = child ? child.id : null;
    // Populate the three dropdowns FIRST and guard every step, so a hiccup in any one
    // (e.g. avatar rendering) can never leave the form showing with empty/blank selects.
    try { fillBandSelect(el('cf-band'), child ? child.age_band : '4-5'); } catch (e) { /* ignore */ }
    try { fillLangSelect(el('cf-l1'), child ? child.l1 : lang); } catch (e) { /* ignore */ }
    try { fillLangSelect(el('cf-target'), child ? child.target : (lang === 'en' ? 'de' : 'en')); } catch (e) { /* ignore */ }
    var titleEl = el('form-title'); if (titleEl) titleEl.textContent = child ? t('editChild') : t('addChild');
    var nameEl = el('cf-name'); if (nameEl) nameEl.value = child ? (child.nickname || '') : '';
    try { renderAvatarPicker(child ? child.avatar : null); } catch (e) { /* ignore */ }
    var form = el('child-form'); if (form) form.hidden = false;
    try { el('cf-name').focus(); } catch (e) { /* ignore */ }
  }
  function closeForm() { el('child-form').hidden = true; editingId = null; }
  function startEdit(id) {
    var c = children.filter(function (x) { return x.id === id; })[0];
    if (c) openForm(c);
  }

  function saveChild(e) {
    if (e) e.preventDefault();
    if (!sb || !currentUser) return;
    var name = String(el('cf-name').value || '').trim();
    if (!name) { el('cf-name').classList.add('shake'); setTimeout(function () { el('cf-name').classList.remove('shake'); }, 500); el('cf-name').focus(); return; }
    var avatarEl = document.querySelector('#avatar-picker .selected');
    var payload = {
      nickname: name,
      age_band: el('cf-band').value,
      avatar: (avatarEl && avatarEl.getAttribute('data-avatar')) || AVATARS[0],
      l1: el('cf-l1').value,
      target: el('cf-target').value,
    };
    var btn = el('cf-save'); btn.disabled = true;
    var op;
    if (editingId) {
      op = sb.from('children').update(payload).eq('id', editingId);
    } else {
      payload.id = newChildId();
      op = sb.from('children').insert(payload);
    }
    op.then(function (res) {
      btn.disabled = false;
      if (res && res.error) { setPlayMsg(res.error.message || t('error'), 'error'); return; }
      closeForm();
      loadAll();
    }, function (err) { btn.disabled = false; setPlayMsg((err && err.message) || t('error'), 'error'); });
  }

  function deleteChild(id) {
    if (!sb) return;
    if (!window.confirm(t('deleteConfirm'))) return;
    sb.from('children').delete().eq('id', id).then(function () {
      if (selectedChildId === id) { selectedChildId = null; pushState({ active_child_id: null }); }
      loadAll();
    });
  }

  // ── game_state (the LIVE control) ──
  // Upsert on parent_id, always tagged updated_by:'phone' so the box ignores it on the
  // echo back. Partial upserts are fine — we merge with the known current state.
  function pushState(patch) {
    if (!sb || !currentUser) { setPlayMsg(t('pickChildFirst'), 'error'); return; }
    var row = {
      parent_id: currentUser.id,
      active_child_id: (patch.active_child_id !== undefined) ? patch.active_child_id
        : (gameState ? gameState.active_child_id : selectedChildId),
      language: (patch.language !== undefined) ? patch.language
        : (gameState ? gameState.language : (el('play-lang') && el('play-lang').value) || null),
      category: (patch.category !== undefined) ? patch.category
        : (gameState ? gameState.category : (el('play-cat-current') && el('play-cat-current').value) || null),
      updated_by: 'phone',
    };
    setPlayMsg(t('sending'));
    sb.from('game_state').upsert(row, { onConflict: 'parent_id' }).select().maybeSingle()
      .then(function (res) {
        if (res && res.error) { setPlayMsg(res.error.message || t('error'), 'error'); return; }
        gameState = (res && res.data) || row;
        selectedChildId = gameState.active_child_id;
        setPlayMsg(t('sent'), 'ok');
        renderChildren();
        renderCategories();
        renderProgress();   // selected child may have changed → refresh the per-category report
      }, function (err) { setPlayMsg((err && err.message) || t('error'), 'error'); });
  }

  function setActiveChild(id) {
    if (!id) return;
    var child = children.filter(function (x) { return x.id === id; })[0];
    // switching child also aligns the TV language to that child's target (nice default)
    var patch = { active_child_id: id };
    if (child && child.target) { patch.language = child.target; var ls = el('play-lang'); if (ls) ls.value = child.target; }
    pushState(patch);
  }

  // ── Category grid + language (live) ──
  function renderCategories() {
    var host = el('category-grid');
    if (!host) return;
    var current = gameState ? gameState.category : null;
    host.innerHTML = CATEGORIES.map(function (c) {
      var on = c.id === current;
      return '<button type="button" class="cat-tile' + (on ? ' is-active' : '') + '" data-cat="' + esc(c.id) + '">' +
        '<span class="cat-emoji" aria-hidden="true">' + c.emoji + '</span>' +
        '<span class="cat-name">' + esc(catTitle(c.id)) + '</span>' +
        (c.core ? '' : '<span class="cat-tag muted">pack</span>') +
      '</button>';
    }).join('');
    host.querySelectorAll('.cat-tile').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!selectedChildId) { setPlayMsg(t('pickChildFirst'), 'error'); return; }
        pushState({ category: btn.getAttribute('data-cat') });
      });
    });
  }

  // ── Settings (box_settings: session length + instruction voice) ──
  // Populate the two controls from the current row (or sensible defaults). The box
  // reads the SAME row via Realtime and applies it live.
  function renderSettings() {
    var sessionSel = el('set-session');
    if (sessionSel) {
      var minutes = (boxSettings && boxSettings.session_minutes) || SESSION_DEFAULT;
      var opts = '';
      for (var m = SESSION_MIN; m <= SESSION_MAX; m++) {
        opts += '<option value="' + m + '"' + (m === minutes ? ' selected' : '') + '>' + m + ' ' + esc(t('minutesShort')) + '</option>';
      }
      sessionSel.innerHTML = opts;
    }
    var voiceSel = el('set-voice');
    if (voiceSel) voiceSel.value = (boxSettings && boxSettings.voice) || VOICE_DEFAULT;
  }

  // Upsert box_settings on parent_id. Partial patches merge with the known row.
  function pushSettings(patch) {
    if (!sb || !currentUser) return;
    var row = {
      parent_id: currentUser.id,
      session_minutes: (patch.session_minutes !== undefined) ? patch.session_minutes
        : (boxSettings ? boxSettings.session_minutes : SESSION_DEFAULT),
      voice: (patch.voice !== undefined) ? patch.voice
        : (boxSettings ? boxSettings.voice : VOICE_DEFAULT),
      updated_at: new Date().toISOString(),
    };
    setMsgOn('set-msg', t('sending'));
    sb.from('box_settings').upsert(row, { onConflict: 'parent_id' }).select().maybeSingle()
      .then(function (res) {
        if (res && res.error) { setMsgOn('set-msg', res.error.message || t('error'), 'error'); return; }
        boxSettings = (res && res.data) || row;
        setMsgOn('set-msg', t('settingsSaved'), 'ok');
        renderSettings();
      }, function (err) { setMsgOn('set-msg', (err && err.message) || t('error'), 'error'); });
  }

  // ── Remote (box_command: one-shot quit/back/pause/resume) ──
  // Upsert one row per parent, changing `nonce` + `issued_at` each press so the box
  // sees a genuinely-new command (Realtime fires an UPDATE) and runs it exactly once.
  function newNonce() {
    return 'n_' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  }
  // msgId lets a command outside the Remote section report status in its own line
  // (e.g. the Progress-section "Full report on TV" button uses 'prog-cmd-msg').
  function sendCommand(command, msgId) {
    msgId = msgId || 'rc-msg';
    if (!sb || !currentUser) return;
    var row = {
      parent_id: currentUser.id,
      command: command,
      nonce: newNonce(),
      issued_at: new Date().toISOString(),
    };
    setMsgOn(msgId, t('sending'));
    sb.from('box_command').upsert(row, { onConflict: 'parent_id' })
      .then(function (res) {
        if (res && res.error) { setMsgOn(msgId, res.error.message || t('error'), 'error'); return; }
        setMsgOn(msgId, t('sent'), 'ok');
      }, function (err) { setMsgOn(msgId, (err && err.message) || t('error'), 'error'); });
  }

  // ── Progress (read the LIVE Leitner review store for the active child) ──
  // Per-category breakdown that mirrors the on-TV Framstegsrapport, from the SAME
  // continuously-saved source the box updates on every answer: the `review` row
  // ({ child_id, data }), where data is keyed "<category>:<word>" → { box, seen,
  // correct, struggle, cleanDays:[] }. Classification is game.js's own isWordMastered
  // ((box||0)>=4 && (cleanDays||[]).length>=3 → Learned; any other existing record →
  // Learning) — no new thresholds. RLS review_own scopes the read to the parent's
  // children. Re-runs on child change and on Refresh; note `review` isn't in the
  // realtime publication, so per-answer push would need a migration (Refresh re-reads).
  var lastProgressChild = null;
  function renderProgress() {
    var host = el('progress-body');
    if (!host) return;
    if (!sb || !selectedChildId) { host.innerHTML = '<p class="muted">' + esc(t('progressNone')) + '</p>'; return; }
    var forChild = selectedChildId;
    lastProgressChild = forChild;
    host.innerHTML = '<p class="muted">…</p>';
    sb.from('review')
      .select('data')
      .eq('child_id', forChild)
      .maybeSingle()
      .then(function (res) {
        if (forChild !== lastProgressChild) return;
        if (res && res.error) { host.innerHTML = '<p class="muted">' + esc(t('progressNone')) + '</p>'; return; }
        var store = res && res.data && res.data.data;
        if (!store || typeof store !== 'object') { host.innerHTML = '<p class="muted">' + esc(t('progressNone')) + '</p>'; return; }
        var byCat = {};
        Object.keys(store).forEach(function (id) {
          var sep = id.indexOf(':');            // split on the FIRST colon → category / word
          if (sep < 0) return;
          var cat = id.slice(0, sep), word = id.slice(sep + 1);
          var rec = store[id];
          if (!rec || typeof rec !== 'object') return;
          var c = (byCat[cat] = byCat[cat] || { learned: [], learning: [] });
          // isWordMastered (game.js): box>=4 AND cleaned on >=3 distinct days.
          if (((rec.box || 0) >= 4) && (((rec.cleanDays || []).length) >= 3)) c.learned.push(word);
          else c.learning.push(word);
        });
        if (!Object.keys(byCat).length) { host.innerHTML = '<p class="muted">' + esc(t('progressNone')) + '</p>'; return; }
        var wordList = function (label, words, cls) {
          if (!words.length) return '';
          return '<p class="prog-list ' + cls + '"><strong>' + esc(t(label)) + ':</strong> ' +
            words.map(esc).join(', ') + '</p>';
        };
        host.innerHTML = Object.keys(byCat).sort().map(function (cat) {
          var c = byCat[cat];
          return '<div class="prog-cat">' +
              '<h3>' + esc(catTitle(cat)) + '</h3>' +
              '<div class="prog-bars">' +
                '<span class="pbadge pb-learned">' + esc(t('pLearned')) + ': ' + c.learned.length + '</span>' +
                '<span class="pbadge pb-learning">' + esc(t('pLearning')) + ': ' + c.learning.length + '</span>' +
              '</div>' +
              wordList('pLearning', c.learning, 'plist-learning') +
              wordList('pLearned', c.learned, 'plist-learned') +
            '</div>';
        }).join('');
      });
  }

  // ── Realtime: reflect box-driven changes back into the UI ──
  function subscribeState() {
    if (!sb || !currentUser) return;
    if (!stateChannel) {
      try {
        stateChannel = sb.channel('parent-game-state')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'game_state', filter: 'parent_id=eq.' + currentUser.id },
            function (payload) {
              var row = payload && payload.new;
              if (!row) return;
              gameState = row;
              selectedChildId = row.active_child_id;
              var ls = el('play-lang'); if (ls && row.language) ls.value = row.language;
              renderChildren(); renderCategories(); renderProgress();
            })
          .subscribe();
      } catch (e) { /* realtime is a nice-to-have */ }
    }
    // The box writes box_status; reflect "what's on the TV now" live.
    if (!statusChannel) {
      try {
        statusChannel = sb.channel('parent-box-status')
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'box_status', filter: 'parent_id=eq.' + currentUser.id },
            function (payload) {
              boxStatus = (payload && (payload.new || payload.old)) || null;
              if (payload && payload.eventType === 'DELETE') boxStatus = null;
              renderTvStatus();
            })
          .subscribe();
      } catch (e) { /* realtime is a nice-to-have */ }
    }
  }

  // ── "Now on the TV" status (read-only; from box_status) ──
  function screenLabel(screen) {
    var map = {
      'screen-menu': 'statusMenu',
      'screen-intro': 'statusChoosing', 'screen-category': 'statusChoosing',
      'screen-children': 'statusChoosing', 'screen-add-child': 'statusChoosing',
      'screen-level-intro': 'statusReady',
      'screen-game': 'statusPlaying',
      'screen-results': 'statusResults',
      'screen-progress': 'statusReport',
    };
    return t(map[screen] || 'statusOther');
  }
  function renderTvStatus() {
    var host = el('tv-status');
    if (!host) return;
    var row = boxStatus;
    if (!row) { host.textContent = t('tvStatusNone'); host.className = 'tv-status muted'; return; }
    var parts = [];
    parts.push(row.paused ? '⏸ ' + t('statusPaused') : screenLabel(row.current_screen));
    if (row.current_category) parts.push(catTitle(row.current_category));
    var kid = row.active_child_id && children.filter(function (c) { return c.id === row.active_child_id; })[0];
    if (kid) parts.push(kid.nickname);   // host.textContent below escapes; don't double-escape
    var sc = row.score;
    if (row.current_screen === 'screen-game' && sc && (sc.total || sc.correct)) {
      parts.push((sc.correct || 0) + '/' + (sc.total || 0));
    }
    host.textContent = parts.join(' · ');
    host.className = 'tv-status';
  }

  // ── Auth wiring (same shape as store/link.js) ──
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
      var consent = el('consent-check');
      if (!consent || !consent.checked) return setAuthMsg(t('consentRequired'), 'error');
      sb.auth.signUp({ email: email, password: pw }).then(function (res) {
        if (res.error) return setAuthMsg(res.error.message, 'error');
        try { localStorage.setItem(CONSENT_PENDING_KEY, email); } catch (e) { /* ignore */ }
        if (res.data && res.data.session) onAuth(res.data.user);
        else setAuthMsg(t('checkEmail'), 'ok');
      });
    });
    el('signout-btn').addEventListener('click', function () {
      sb.auth.signOut().then(function () { onAuth(null); });
    });
    sb.auth.onAuthStateChange(function (_evt, session) { onAuth(session && session.user); });
  }

  // ── boot ──
  // Guarded event binding: a single missing element must NEVER throw and abort the rest
  // of boot() (which would leave later controls — e.g. the add-child form — unwired).
  function on(id, evt, fn) { var n = el(id); if (n) n.addEventListener(evt, fn); }

  function boot() {
    on('lang-select', 'change', function (e) {
      lang = e.target.value;
      try { localStorage.setItem(LANG_KEY, lang); } catch (err) { /* ignore */ }
      applyChrome();
      renderChildren(); renderCategories(); renderSettings(); renderTvStatus(); renderProgress();
    });
    on('add-child-btn', 'click', function () { openForm(null); });
    on('cf-cancel', 'click', closeForm);
    on('child-form', 'submit', saveChild);
    // Delegated avatar selection — works for the STATIC chips in the HTML and for any the
    // script re-renders, so picking an avatar never depends on renderAvatarPicker running.
    on('avatar-picker', 'click', function (e) {
      var chip = e.target && e.target.closest ? e.target.closest('.avatar-chip') : null;
      if (!chip) return;
      var host = el('avatar-picker'); if (!host) return;
      host.querySelectorAll('.avatar-chip').forEach(function (c) { c.classList.remove('selected'); });
      chip.classList.add('selected');
    });
    on('play-lang', 'change', function () { pushState({ language: el('play-lang').value }); });
    on('set-session', 'change', function () { pushSettings({ session_minutes: Number(el('set-session').value) }); });
    on('set-voice', 'change', function () { pushSettings({ voice: el('set-voice').value }); });
    ['rc-start', 'rc-pause', 'rc-resume', 'rc-back', 'rc-quit',
     'rc-nav-up', 'rc-nav-down', 'rc-nav-left', 'rc-nav-right', 'rc-nav-ok'].forEach(function (id) {
      var btn = el(id);
      if (btn) btn.addEventListener('click', function () { sendCommand(btn.getAttribute('data-cmd')); });
    });
    on('rc-progress', 'click', function () { sendCommand('progress_report', 'prog-cmd-msg'); });
    on('progress-refresh', 'click', renderProgress);

    fillLangSelect(el('play-lang'), 'en');
    applyChrome();
    if (configured) {
      wireAuth();
      sb.auth.getSession().then(function (res) {
        onAuth(res && res.data && res.data.session && res.data.session.user);
      });
    } else {
      el('auth-panel').hidden = true;
      el('dash').hidden = true;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
