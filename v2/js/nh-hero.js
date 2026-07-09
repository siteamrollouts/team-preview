/* ═══════════════════════════════════════════════════════════════
   ALT HERO — notification scatter, lifted from the live site
   (teamrollouts.com /components/notifications-hero.js).
   Adapted for v3: typewriter removed (static v3 headline), scroll
   fade swapped for an IntersectionObserver since this section sits
   mid-page rather than at the top.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.__nhHeroInit) return;
  window.__nhHeroInit = true;

  /* ============ CHANNEL ICONS ============ */
  var CHANNELS = {
    slack: {
      bg: '#4A154B',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"/></svg>'
    },
    gmail: {
      bg: '#EA4335',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>'
    },
    asana: {
      bg: '#F06A6A',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M19.09 16.14a4.91 4.91 0 1 1-4.91-4.91 4.91 4.91 0 0 1 4.91 4.91zm-9.18 0a4.91 4.91 0 1 1-4.91-4.91 4.91 4.91 0 0 1 4.91 4.91zM12 2.77a4.91 4.91 0 1 0 4.91 4.91A4.91 4.91 0 0 0 12 2.77z"/></svg>'
    },
    excel: {
      bg: '#217346',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM1 16.5h14v-9H1zm7.5-2.25h-2.6l-1.4-2.4-1.4 2.4H.59l2.14-3.5L.73 7.3h2.55L4.5 9.6l1.17-2.3h2.51L6.09 10.8zM23 19V2H7v4h8q.41 0 .7.3.3.29.3.7v10q0 .41-.3.7-.29.3-.7.3H7v4zM20 14v-2h-4v2zm0-4V8h-4v2zm0 8v-2h-4v2z"/></svg>'
    },
    whatsapp: {
      bg: '#25D366',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'
    },
    monday: {
      bg: '#6161FF',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="5.5" cy="18.5" r="3.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="18.5" cy="5.5" r="3.5"/></svg>'
    },
    drive: {
      bg: '#0066DA',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M7.71 3.5L1.15 15l2.79 4.84L10.5 8.34zM16.29 3.5H7.71l6.56 11.34h8.57zM8.87 15l-2.79 4.84h13.86L22.73 15z"/></svg>'
    },
    gcal: {
      bg: '#4285F4',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM7 12h5v5H7z"/></svg>'
    },
    trello: {
      bg: '#0079BF',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v13.62zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v7.62z"/></svg>'
    },
    teams: {
      bg: '#5B5FC7',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M20.625 8.5h-6.25a.625.625 0 0 0-.625.625v6.25c0 .345.28.625.625.625h3.127v3.75a.625.625 0 0 0 .625.625h1.875a2.5 2.5 0 0 0 2.5-2.5v-7a2 2 0 0 0-1.877-2.375zM19 7.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm-5.75 0h-2.5A5.75 5.75 0 0 0 5 13.25v4.125c0 .345.28.625.625.625h7.75a.625.625 0 0 0 .625-.625V13.25A5.75 5.75 0 0 0 8.25 7.5h5zm-3 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>'
    },
    spotify: {
      bg: '#1DB954',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.371a.748.748 0 0 1-1.029.249c-2.819-1.722-6.367-2.111-10.546-1.156a.748.748 0 1 1-.331-1.46c4.566-1.043 8.488-.594 11.658 1.34a.748.748 0 0 1 .248 1.027zm1.467-3.265a.935.935 0 0 1-1.286.308c-3.227-1.984-8.146-2.558-11.961-1.4a.935.935 0 1 1-.541-1.79c4.355-1.32 9.776-.681 13.481 1.595.44.27.578.846.307 1.287zm.126-3.4c-3.872-2.299-10.262-2.51-13.96-1.388a1.121 1.121 0 1 1-.65-2.146c4.243-1.287 11.298-1.039 15.756 1.611a1.121 1.121 0 1 1-1.146 1.923z"/></svg>'
    },
    instagram: {
      bg: '#E4405F',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>'
    },
    tiktok: {
      bg: '#000000',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>'
    },
    youtube: {
      bg: '#FF0000',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    },
    discord: {
      bg: '#5865F2',
      svg: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>'
    }
  };

  window.NH_CHANNELS = CHANNELS;   // shared with the logo-orbit section

  /* ============ NOTIFICATION POOL ============ */
  var POOL = [
    { channel: 'slack',     sender: 'Sarah from Marketing',   message: "URGENT!! Where's the latest file??",         time: '3m ago' },
    { channel: 'gmail',     sender: 'Re: Album artwork v4.8', message: "I can't find where you've put the latest…",  time: '2m ago' },
    { channel: 'asana',     sender: 'Task overdue',           message: 'Submit playlist pitch — 2 days late',        time: '8m ago' },
    { channel: 'excel',     sender: 'Release Tracker v28.3',  message: 'Sheet has been updated by James',            time: '11m ago' },
    { channel: 'whatsapp',  sender: 'Artist Manager',         message: 'Can we talk urgently about the release…',    time: '5m ago' },
    { channel: 'monday',    sender: 'Status changed',         message: 'PR outreach moved to Stuck',                 time: '14m ago' },
    { channel: 'drive',     sender: 'Access requested',       message: 'Tom wants access to Press Assets',           time: '18m ago' },
    { channel: 'gcal',      sender: 'Release sync in 15 min', message: 'Weekly release standup — 4 attendees',       time: '22m ago' },
    { channel: 'trello',    sender: 'Card moved',             message: 'Final master → Review queue',                time: '31m ago' },
    { channel: 'teams',     sender: 'Missed call',            message: 'Alex tried to reach you about the mix',      time: '45m ago' },
    { channel: 'spotify',   sender: 'Spotify for Artists',    message: 'New playlist add: Fresh Finds',              time: '1m ago' },
    { channel: 'instagram', sender: 'Instagram',              message: '@team_rollouts mentioned you in a story',    time: '6m ago' },
    { channel: 'tiktok',    sender: 'TikTok',                 message: 'Your sound has 12.4k new uses',              time: '9m ago' },
    { channel: 'youtube',   sender: 'YouTube',                message: 'Content ID match — flagged for review',      time: '24m ago' },
    { channel: 'discord',   sender: 'Fan community',          message: '@mod-team please clarify drop date',         time: '38m ago' },
    { channel: 'gmail',     sender: 'DSP Pitch — Atlantic',   message: 'Following up on the masters package…',       time: '7m ago' },
    { channel: 'slack',     sender: 'Label Operations',       message: 'Distributor flagged metadata mismatch',      time: '4m ago' },
    { channel: 'whatsapp',  sender: 'Producer',               message: 'Final stems ready — link incoming',          time: '12m ago' },
    { channel: 'asana',     sender: 'Approval needed',        message: 'Press release v3 awaiting sign-off',         time: '20m ago' },
    { channel: 'gcal',      sender: 'Marketing sync',         message: 'Tomorrow 10:00 — agenda attached',           time: '28m ago' },
    { channel: 'monday',    sender: 'Deadline tomorrow',      message: 'Submit DSP playlist pitches by EOD',         time: '33m ago' },
    { channel: 'drive',     sender: 'New comment',            message: 'Manager left feedback on cover art',         time: '41m ago' },
    { channel: 'spotify',   sender: 'Spotify for Artists',    message: 'You hit 50k monthly listeners — milestone',  time: '15m ago' }
  ];

  /* ============ DOM HOOKUPS ============ */
  var hero = document.getElementById('nhHero');
  if (!hero) return;
  var notifs = hero.querySelectorAll('#nhNotifLayer .nh-notif');
  if (!notifs.length) return;

  /* ============ HYDRATE ============ */
  function paintSlot(slot, entry) {
    var ch = CHANNELS[entry.channel] || CHANNELS.slack;
    var iconEl = slot.querySelector('.nh-notif__icon');
    iconEl.style.background = ch.bg;
    iconEl.innerHTML = ch.svg;
    slot.querySelector('.nh-notif__title').textContent = entry.sender;
    slot.querySelector('.nh-notif__time').textContent = entry.time;
    slot.querySelector('.nh-notif__msg').textContent = entry.message;
    slot.dataset.channel = entry.channel;
  }

  var seen = {};
  notifs.forEach(function (slot) {
    var entry, attempts = 0;
    do { entry = POOL[Math.floor(Math.random() * POOL.length)]; attempts++; }
    while (seen[entry.channel] && attempts < 8);
    seen[entry.channel] = true;
    paintSlot(slot, entry);
  });

  /* ============ VISIBILITY (IntersectionObserver — mid-page section) ============ */
  var visible = false;
  var io = new IntersectionObserver(function (entries) {
    var on = entries[0].isIntersecting;
    if (on && !visible) {
      visible = true;
      notifs.forEach(function (n, i) {
        setTimeout(function () { if (visible) n.classList.add('nh-notif-in'); }, 200 + i * 120);
      });
    } else if (!on && visible) {
      visible = false;
      notifs.forEach(function (n) { n.classList.remove('nh-notif-in'); });
    }
  }, { threshold: 0.12 });
  io.observe(hero);

  /* ============ MOUSE PARALLAX + FLOAT ============ */
  var mouseX = 0.5, mouseY = 0.5, currentX = 0.5, currentY = 0.5;
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / r.width;
    mouseY = (e.clientY - r.top) / r.height;
  });
  function loop(time) {
    if (visible) {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
      var dx = currentX - 0.5, dy = currentY - 0.5;
      for (var i = 0; i < notifs.length; i++) {
        var n = notifs[i];
        var depth = parseFloat(n.dataset.depth) || 0.03;
        var fy = parseFloat(n.dataset.floatY) || 0;
        var fx = parseFloat(n.dataset.floatX) || 0;
        var dur = parseFloat(n.dataset.floatDur) || 5;
        var t = time / 1000 + depth * 1000;
        var period = (2 * Math.PI) / dur;
        var px = dx * depth * 2400 + Math.sin(t * period) * fx;
        var py = dy * depth * 2400 + Math.sin(t * period + 0.5) * fy;
        n.style.transform = 'translate(' + px.toFixed(2) + 'px, ' + py.toFixed(2) + 'px)';
      }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ============ PER-SLOT CONTENT CYCLER ============ */
  var FADE_MS = 500, MIN_INTERVAL = 7000, MAX_INTERVAL = 12000;

  function pickFreshFor(slot) {
    var inUse = {};
    notifs.forEach(function (n) {
      if (n !== slot && n.dataset.channel) inUse[n.dataset.channel] = true;
    });
    inUse[slot.dataset.channel] = true;
    for (var i = 0; i < 12; i++) {
      var pick = POOL[Math.floor(Math.random() * POOL.length)];
      if (!inUse[pick.channel]) return pick;
    }
    for (var j = 0; j < POOL.length; j++) {
      if (!inUse[POOL[j].channel]) return POOL[j];
    }
    return POOL[Math.floor(Math.random() * POOL.length)];
  }

  function scheduleSwap(slot) {
    var delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    setTimeout(function () {
      if (!visible) { scheduleSwap(slot); return; }
      slot.classList.remove('nh-notif-in');
      setTimeout(function () {
        paintSlot(slot, pickFreshFor(slot));
        slot.offsetHeight; // reflow so the transition replays
        if (visible) slot.classList.add('nh-notif-in');
        scheduleSwap(slot);
      }, FADE_MS + 20);
    }, delay);
  }

  notifs.forEach(function (slot, i) {
    setTimeout(function () { scheduleSwap(slot); }, 1500 + i * 400);
  });
})();
