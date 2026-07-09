/* ═══════════════════════════════════════════════════════════════
   team v4 — mission narrative
   00 · OVERTURE — the operations picture: a release rendered as a
   living system map. Entities, connections, a timeline horizon,
   packets in flight, and a telemetry feed of real release events.
   ═══════════════════════════════════════════════════════════════ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (p, a, b) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
const touch = matchMedia('(pointer:coarse)').matches;
const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ── loader — plays once per session ── */
const q = new URLSearchParams(location.search);
const seenIntro = (() => {
  try { const s = sessionStorage.getItem('tm4-intro'); sessionStorage.setItem('tm4-intro', '1'); return !!s; }
  catch { return false; }
})();
if (q.has('noloader') || seenIntro) {
  const l = $('#loader'); l.style.transition = 'none'; l.style.display = 'none';
  document.body.removeAttribute('data-loading');
} else {
  addEventListener('load', () => setTimeout(() => document.body.removeAttribute('data-loading'), 1450));
  setTimeout(() => document.body.removeAttribute('data-loading'), 3600);
}
if (q.has('y')) addEventListener('load', () => {
  document.documentElement.style.scrollBehavior = 'auto';
  scrollTo(0, +q.get('y'));
});

/* ── cursor: native by default; the logomark equalizer over anything interactive ── */
if (!touch && !reduced) {
  document.documentElement.classList.add('eqcur');
  const cur = $('.cursor');
  let tx = -100, ty = -100, cx = -100, cy = -100;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,[data-hover]');
    cur.classList.toggle('is-on', !!t);
    if (t) {
      const bg = getComputedStyle(t).backgroundColor.match(/\d+/g) || [0, 0, 0];
      cur.classList.toggle('is-ink', (+bg[0] * 0.299 + +bg[1] * 0.587 + +bg[2] * 0.114) > 140);
    }
  });
  (function cloop() {
    cx = lerp(cx, tx, 0.55); cy = lerp(cy, ty, 0.55);
    cur.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(cloop);
  })();
}

/* ═══ THE OPERATIONS PICTURE ═══ */
const OpsMap = (() => {
  const cv = $('#ops'); if (!cv) return { frame() {} };
  const cx = cv.getContext('2d');
  let W, H, DPR;

  const BONE = '239,235,227', LIME = '217,250,135', ORANGE = '245,96,2';

  /* the release, drawn as everything it actually touches.
     majors: ringed + labelled · minors: the tool/thread noise around them.
     Positions dodge the copy block (left-centre) but crowd everywhere else. */
  const NODES = [
    /* top band */
    { id: 'SOCIALS',    x: .295, y: .085, d: .8 },
    { id: 'ARTWORK',    x: .505, y: .10,  d: .7 },
    { id: 'VIDEO',      x: .685, y: .065, d: 1.15 },
    { id: 'SYNC',       x: .865, y: .095, d: .9 },
    /* right column */
    { id: 'RADIO',      x: .955, y: .185, d: 1.0 },
    { id: 'MASTER',     x: .745, y: .195, d: 1.0 },
    { id: 'BUDGET',     x: .875, y: .30,  d: .85 },
    { id: 'MERCH',      x: .955, y: .415, d: .8 },
    { id: 'PRESS',      x: .765, y: .385, d: 1.05 },
    { id: 'VINYL',      x: .865, y: .53,  d: .95 },
    { id: 'TOUR',       x: .945, y: .635, d: 1.1 },
    { id: 'PLAYLISTS',  x: .725, y: .555, d: .75 },
    { id: 'PRE-SAVES',  x: .81,  y: .665, d: .85 },
    /* lower band */
    { id: 'METADATA',   x: .665, y: .70,  d: .9 },
    { id: 'EPK',        x: .60,  y: .625, d: .8 },
    { id: 'DSPs',       x: .525, y: .775, d: .9 },
    { id: 'ROYALTIES',  x: .675, y: .795, d: 1.0 },
    /* minors — the tool layer */
    { id: 'DROPBOX',    x: .61,  y: .155, d: .7,  min: 1 },
    { id: 'ASANA',      x: .585, y: .045, d: .9,  min: 1 },
    { id: 'DRIVE',      x: .69,  y: .285, d: .8,  min: 1 },
    { id: 'ZOOM',       x: .825, y: .43,  d: 1.0, min: 1 },
    { id: 'MONDAY',     x: .705, y: .46,  d: .75, min: 1 },
    { id: 'DOCS',       x: .925, y: .51,  d: .8,  min: 1 },
    { id: 'TRELLO',     x: .91,  y: .715, d: .9,  min: 1 },
    { id: 'TEAMS',      x: .70,  y: .615, d: .8,  min: 1 },
    { id: 'SLACK',      x: .095, y: .77,  d: .9,  min: 1 },
    { id: 'SHEETS',     x: .175, y: .845, d: .8,  min: 1 },
    { id: 'NOTION',     x: .27,  y: .80,  d: .75, min: 1 },
    { id: 'GMAIL',      x: .36,  y: .845, d: .9,  min: 1 },
    { id: 'CALENDAR',   x: .415, y: .825, d: .8,  min: 1 },
    { id: 'CAPCUT',     x: .79,  y: .045, d: .85, min: 1 },
    { id: 'DISTRIBUTOR',x: .555, y: .70,  d: 1.0, min: 1 },
    { id: 'PR AGENCY',  x: .935, y: .855, d: .9,  min: 1 },
  ].map((n, i) => ({ ...n, ph: i * 2.4, pulse: 0, hot: 0 }));
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));

  /* backbone between the majors, then every minor wires itself to its two
     nearest neighbours, then long cross-links for honest mess */
  const LINKS = [
    ['MASTER', 'VINYL'], ['MASTER', 'PLAYLISTS'], ['MASTER', 'DSPs'], ['MASTER', 'RADIO'],
    ['ARTWORK', 'PRESS'], ['ARTWORK', 'MASTER'], ['ARTWORK', 'MERCH'], ['ARTWORK', 'SOCIALS'],
    ['BUDGET', 'VIDEO'], ['BUDGET', 'VINYL'], ['BUDGET', 'TOUR'], ['BUDGET', 'MERCH'],
    ['PRESS', 'SOCIALS'], ['PRESS', 'EPK'], ['PRESS', 'RADIO'], ['VIDEO', 'SOCIALS'],
    ['VIDEO', 'SYNC'], ['PLAYLISTS', 'DSPs'], ['PLAYLISTS', 'PRE-SAVES'], ['PRESS', 'PLAYLISTS'],
    ['METADATA', 'DSPs'], ['METADATA', 'ROYALTIES'], ['VINYL', 'TOUR'], ['TOUR', 'MERCH'],
    ['PRE-SAVES', 'METADATA'], ['EPK', 'METADATA'], ['SYNC', 'RADIO'], ['ROYALTIES', 'PRE-SAVES'],
  ];
  NODES.filter(n => n.min).forEach(n => {
    const near = NODES.filter(o => o !== n)
      .map(o => ({ o, d2: (o.x - n.x) ** 2 + (o.y - n.y) ** 2 }))
      .sort((a, b) => a.d2 - b.d2).slice(0, 2);
    near.forEach(({ o }) => LINKS.push([n.id, o.id]));
  });
  LINKS.push(['SLACK', 'MASTER'], ['GMAIL', 'PRESS'], ['SHEETS', 'BUDGET'],
    ['NOTION', 'METADATA'], ['CALENDAR', 'VIDEO'], ['DISTRIBUTOR', 'VINYL'],
    ['CAPCUT', 'SOCIALS'], ['PR AGENCY', 'ROYALTIES']);

  /* timeline horizon — launch sits mid-line; the release keeps living after it */
  const ARC = { x0: .05, y0: .90, x1: .95, y1: .845, bow: -.04 };
  const TICKS = [
    [0.03, 'T–16W'], [0.16, 'T–12W'], [0.30, 'T–8W'], [0.44, 'SINGLE 2'],
    [0.57, 'VIDEO'], [0.70, 'LAUNCH'], [0.84, '+4W'], [0.965, '+12W'],
  ];
  /* anchor entities onto the horizon */
  const DROPS = [['MASTER', .30], ['PLAYLISTS', .44], ['DSPs', .70],
    ['TOUR', .84], ['ROYALTIES', .965], ['PRESS', .57]];

  const arcPt = t => {
    const mx = (ARC.x0 + ARC.x1) / 2, my = (ARC.y0 + ARC.y1) / 2 + ARC.bow;
    const x = lerp(lerp(ARC.x0, mx, t), lerp(mx, ARC.x1, t), t);
    const y = lerp(lerp(ARC.y0, my, t), lerp(my, ARC.y1, t), t);
    return [x, y];
  };

  /* packets in flight — a sparse subset of the (now many) links */
  const packs = LINKS.map((l, i) => ({ l, t: (i * 0.37) % 1, v: 0.0016 + (i % 3) * 0.0009, live: i % 4 === 0 }));

  let px = 0, py = 0;          // pointer parallax target
  addEventListener('pointermove', e => {
    px = (e.clientX / innerWidth - 0.5);
    py = (e.clientY / innerHeight - 0.5);
  }, { passive: true });
  let sx = 0, sy = 0;

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth * DPR; H = cv.clientHeight * DPR;
    cv.width = W; cv.height = H;
  }
  resize(); addEventListener('resize', resize);

  const pos = n => {
    const wx = Math.sin(T * 0.5 + n.ph) * 4, wy = Math.cos(T * 0.4 + n.ph * 1.3) * 4;
    return [
      (n.x + sx * -0.022 * n.d) * W + wx * DPR,
      (n.y + sy * -0.022 * n.d) * H + wy * DPR,
    ];
  };

  let T = 0;
  const MOB = () => innerWidth < 900;

  function frame(dt) {
    T += dt;
    sx = lerp(sx, px, 0.04); sy = lerp(sy, py, 0.04);
    cx.clearRect(0, 0, W, H);
    const mob = MOB();
    const dim = mob ? 0.42 : 1;              // quieter behind stacked mobile copy
    const mono = `500 ${9.5 * DPR}px ui-monospace,Menlo,monospace`;

    /* hairline grid */
    cx.strokeStyle = `rgba(${BONE},${0.028 * dim})`;
    cx.lineWidth = 1;
    for (let i = 1; i < 12; i++) {
      const gx = (i / 12) * W;
      cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, H); cx.stroke();
    }

    /* timeline horizon */
    cx.strokeStyle = `rgba(${BONE},${0.17 * dim})`;
    cx.lineWidth = DPR;
    cx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const [ax, ay] = arcPt(i / 60);
      i ? cx.lineTo(ax * W, ay * H) : cx.moveTo(ax * W, ay * H);
    }
    cx.stroke();
    cx.font = mono;
    TICKS.forEach(([t, lab]) => {
      const [ax, ay] = arcPt(t);
      const launch = lab === 'LAUNCH';
      cx.strokeStyle = launch ? `rgba(${LIME},${0.6 * dim})` : `rgba(${BONE},${0.3 * dim})`;
      cx.beginPath();
      cx.moveTo(ax * W, ay * H - (launch ? 8 : 4) * DPR);
      cx.lineTo(ax * W, ay * H + (launch ? 8 : 4) * DPR);
      cx.stroke();
      cx.fillStyle = launch ? `rgba(${LIME},${0.7 * dim})` : `rgba(${BONE},${0.3 * dim})`;
      cx.textAlign = 'center';
      cx.fillText(lab, ax * W, ay * H + 18 * DPR);
    });

    /* drop lines: entity → horizon anchor */
    DROPS.forEach(([id, t]) => {
      const n = byId[id]; const [nx, ny] = pos(n); const [ax, ay] = arcPt(t);
      cx.strokeStyle = `rgba(${BONE},${(0.05 + n.hot * 0.14) * dim})`;
      cx.setLineDash([3 * DPR, 5 * DPR]);
      cx.beginPath(); cx.moveTo(nx, ny); cx.lineTo(ax * W, ay * H); cx.stroke();
      cx.setLineDash([]);
    });

    /* entity ↔ entity connections */
    LINKS.forEach(([a, b]) => {
      const na = byId[a], nb = byId[b];
      const [x1, y1] = pos(na), [x2, y2] = pos(nb);
      const hot = Math.max(na.hot, nb.hot);
      cx.strokeStyle = `rgba(${BONE},${(0.055 + hot * 0.22) * dim})`;
      cx.lineWidth = DPR;
      const bx = (x1 + x2) / 2 + (y2 - y1) * 0.08, by = (y1 + y2) / 2 - (x2 - x1) * 0.08;
      cx.beginPath(); cx.moveTo(x1, y1); cx.quadraticCurveTo(bx, by, x2, y2); cx.stroke();
    });

    /* packets */
    packs.forEach(p => {
      if (!p.live) return;
      p.t = (p.t + p.v * dt * 60) % 1;
      const na = byId[p.l[0]], nb = byId[p.l[1]];
      const [x1, y1] = pos(na), [x2, y2] = pos(nb);
      const bx = (x1 + x2) / 2 + (y2 - y1) * 0.08, by = (y1 + y2) / 2 - (x2 - x1) * 0.08;
      const t = p.t;
      const xx = lerp(lerp(x1, bx, t), lerp(bx, x2, t), t);
      const yy = lerp(lerp(y1, by, t), lerp(by, y2, t), t);
      cx.fillStyle = `rgba(${LIME},${0.75 * dim})`;
      cx.beginPath(); cx.arc(xx, yy, 1.6 * DPR, 0, 7); cx.fill();
    });

    /* entities — majors ringed + labelled, minors small and quiet */
    NODES.forEach(n => {
      const [x, y] = pos(n);
      n.hot = Math.max(0, n.hot - dt * 0.55);
      if (n.pulse > 0) {
        const pr = (1 - n.pulse) * 34 * DPR;
        cx.strokeStyle = `rgba(${n.k === 'risk' ? ORANGE : LIME},${n.pulse * 0.55 * dim})`;
        cx.lineWidth = DPR;
        cx.beginPath(); cx.arc(x, y, 6 * DPR + pr, 0, 7); cx.stroke();
        n.pulse = Math.max(0, n.pulse - dt * 0.66);
      }
      if (!n.min) {
        cx.strokeStyle = `rgba(${BONE},${(0.22 + n.hot * 0.5) * dim})`;
        cx.lineWidth = DPR;
        cx.beginPath(); cx.arc(x, y, 5.5 * DPR, 0, 7); cx.stroke();
      }
      const heat = n.hot > 0.01 && n.k === 'risk' ? ORANGE : (n.hot > 0.01 ? LIME : BONE);
      cx.fillStyle = `rgba(${heat},${((n.min ? 0.4 : 0.55) + n.hot * 0.45) * dim})`;
      cx.beginPath(); cx.arc(x, y, (n.min ? 1.5 : 2) * DPR, 0, 7); cx.fill();
      if (n.min && mob) return;               // mobile: tool layer stays as quiet dots
      cx.font = n.min ? `500 ${8 * DPR}px ui-monospace,Menlo,monospace` : mono;
      cx.fillStyle = `rgba(${BONE},${((n.min ? 0.2 : 0.36) + n.hot * 0.55) * dim})`;
      cx.textAlign = 'left';
      cx.fillText(n.id, x + (n.min ? 7 : 11) * DPR, y + 3.5 * DPR);
    });
  }

  function fire(id, kind) {
    const n = byId[id]; if (!n) return;
    n.pulse = 1; n.hot = 1; n.k = kind;
  }

  return { frame, fire };
})();

/* ═══ TELEMETRY FEED ═══ */
const Tele = (() => {
  const box = $('#teleLines'); if (!box) return { tick() {} };
  const EVENTS = [
    ['MASTER',    'ok',   'MASTER v10 RECEIVED — DROPBOX'],
    ['BUDGET',    'risk', 'BUDGET Δ +$600 — FLAGGED'],
    ['PRESS',     'ok',   'PRESS LIST RE-BRIEFED'],
    ['VINYL',     'risk', 'VINYL LEAD 11W vs 9W — RISK'],
    ['PRE-SAVES', 'sig',  'PRE-SAVE VELOCITY ×2 — SIGNAL'],
    ['ARTWORK',   'ok',   'ARTWORK v7 APPROVED'],
    ['METADATA',  'ok',   'METADATA DELIVERED → DSPs'],
    ['VIDEO',     'ok',   'SHOOT CONFIRMED — THU 14'],
    ['SOCIALS',   'sig',  'TEASER CLIP TRENDING +38%'],
    ['TOUR',      'ok',   'ROUTING HOLDS CONFIRMED — 8 CITIES'],
    ['ROYALTIES', 'ok',   'SPLITS RECONCILED — Q3'],
    ['PLAYLISTS', 'ok',   'PITCH MOVED UP 1W'],
  ];
  let i = 0, mins = 23 * 60 + 41, next = 0.8;

  function push() {
    const [node, kind, text] = EVENTS[i % EVENTS.length]; i++;
    mins = (mins + 3 + Math.floor(Math.random() * 7)) % 1440;
    const hh = String(Math.floor(mins / 60)).padStart(2, '0');
    const mm = String(mins % 60).padStart(2, '0');
    const p = document.createElement('p');
    p.className = `tele__ln k-${kind}`;
    p.innerHTML = `<u>${hh}:${mm}</u><b>${text}</b>`;
    box.prepend(p);
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('on')));
    while (box.children.length > 5) box.lastChild.remove();
    OpsMap.fire(node, kind);
  }

  return {
    tick(dt) {
      next -= dt;
      if (next <= 0) { push(); next = 2.7 + Math.random() * 1.6; }
    }
  };
})();

/* ── top CTAs appear once the hero's own have scrolled away (desktop) ── */
const topcta = $('.topcta');
addEventListener('scroll', () => {
  topcta.classList.toggle('on', scrollY > innerHeight * 0.62);  // as the hero's own CTAs fade out
}, { passive: true });

/* ═══ master loop — parked when the hero is offscreen or tab hidden ═══ */
const heroInner = $('.hero__inner'), teleBox = $('#tele');
let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05); last = now;
  if (!document.hidden && !reduced) {
    if (scrollY < innerHeight * 1.25) {
      OpsMap.frame(dt);
      Tele.tick(dt);
      /* hero content bows out before it can collide with the fixed chrome */
      const hp = clamp(scrollY / (innerHeight * 0.9));
      heroInner.style.opacity = 1 - smooth(hp, 0.25, 0.75);
      heroInner.style.transform = `translate3d(0,${(-hp * 42).toFixed(1)}px,0)`;
      teleBox.style.opacity = 1 - smooth(hp, 0.2, 0.6);
    }
    if (typeof chapters === 'function') chapters(dt);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ═══════════════════════════════════════════════════════════════
   CHAPTERS 01–09 — scroll engine
   Pinned chapters scrub against raw scroll; on mobile the heavy
   chapters un-pin (CSS) and their progress maps to viewport entry,
   the pattern proven in v3.
   ═══════════════════════════════════════════════════════════════ */

let VH = innerHeight, VW = innerWidth;
let pins = {};
function measure() {
  VH = innerHeight; VW = innerWidth;
  pins = {};
  $$('[data-scrub]').forEach(el => {
    const stage = el.querySelector('.pin__stage');
    if (stage && getComputedStyle(stage).position !== 'sticky') {
      pins[el.dataset.scrub] = { el, top: el.offsetTop - VH * 0.82, range: Math.max(el.offsetHeight, VH * 0.9), pinned: false };
    } else {
      pins[el.dataset.scrub] = { el, top: el.offsetTop, range: Math.max(el.offsetHeight - VH, 1), pinned: true };
    }
  });
}
addEventListener('resize', measure);
addEventListener('load', () => { measure(); requestAnimationFrame(measure); });
measure();

const isNear = pin => pin && scrollY > pin.top - VH && scrollY < pin.top + pin.range + VH;
const prog = pin => pin ? clamp((scrollY - pin.top) / pin.range) : 0;

/* ── 01 · the operation ── */
const boms = $$('[data-bom]'), frays = $$('[data-fray]');
const opNote = $('#opNote'), opCloser = $('#opCloser');
function op(p) {
  /* the board starts building while the section is still arriving —
     progress leads the pin by just over half a viewport (desktop only;
     mobile's entry mapping already does this) */
  const pin = pins.op;
  if (pin && pin.pinned) p = clamp((scrollY - (pin.top - VH * 0.55)) / (pin.range + VH * 0.55));
  boms.forEach((el, i) => {
    const t = smooth(p, 0.04 + i * 0.028, 0.13 + i * 0.028);
    el.style.opacity = t;
    el.style.transform = `translateX(${(1 - t) * -14}px)`;
  });
  frays.forEach((el, i) => {
    const t = smooth(p, 0.5 + i * 0.05, 0.56 + i * 0.05);
    el.style.opacity = t;
    el.style.transform = `scale(${0.9 + t * 0.1}) rotate(${(1 - t) * -1.5 - 1.5}deg)`;
  });
  opNote.style.opacity = smooth(p, 0.52, 0.6);
  if (opCloser) opCloser.style.opacity = smooth(p, 0.86, 0.94);
}

/* ── 02 · 02:43am ── */
const nights = $$('[data-night]'), nightClock = $('#nightClock'), nightBg = $('#nightBg');

/* the clock is an alarm clock — seven-segment LED digits built in SVG */
const Clock = (() => {
  if (!nightClock) return { set() {} };
  const SEG = { A: [2, 0, 6, 2], B: [8, 1.5, 2, 6.5], C: [8, 10, 2, 6.5], D: [2, 16, 6, 2],
    E: [0, 10, 2, 6.5], F: [0, 1.5, 2, 6.5], G: [2, 8, 6, 2] };
  const MAP = { 0: 'ABCDEF', 1: 'BC', 2: 'ABGED', 3: 'ABGCD', 4: 'FGBC',
    5: 'AFGCD', 6: 'AFGECD', 7: 'ABC', 8: 'ABCDEFG', 9: 'ABCDFG' };
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 57 18');
  svg.setAttribute('class', 'clock__svg');
  const digits = [];
  [0, 13, 32, 45].forEach(ox => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${ox} 0)`);
    const segs = {};
    Object.entries(SEG).forEach(([k, [x, y, w, h]]) => {
      const r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('rx', 1);
      r.setAttribute('class', 'seg');
      g.append(r); segs[k] = r;
    });
    svg.append(g); digits.push(segs);
  });
  const colon = document.createElementNS(NS, 'g');
  colon.setAttribute('class', 'clock__colon');
  [[26.8, 4.6], [26.8, 11]].forEach(([x, y]) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', 2.4); r.setAttribute('height', 2.4); r.setAttribute('rx', 0.8);
    colon.append(r);
  });
  svg.append(colon);
  nightClock.prepend(svg);
  let cur = '';
  return {
    set(str) {
      if (str === cur) return; cur = str;
      [...str].forEach((ch, i) => {
        const on = MAP[+ch];
        Object.entries(digits[i]).forEach(([k, r]) =>
          r.setAttribute('class', on.includes(k) ? 'seg on' : 'seg'));
      });
    }
  };
})();

function night(p) {
  const W = [[0.05, 0.24], [0.28, 0.47], [0.51, 0.70], [0.76, 1.01]];
  nights.forEach((el, i) => {
    const [a, b] = W[i];
    const f = smooth(p, a, a + 0.06) * (1 - smooth(p, b - 0.05, b));
    el.style.opacity = i === 3 ? smooth(p, a, a + 0.07) : f;
    el.style.transform = `translateY(${(1 - smooth(p, a, a + 0.07)) * 24}px)`;
  });
  const mins = 41 + Math.floor(smooth(p, 0.1, 0.75) * 2);
  Clock.set(`02${mins}`);
  /* the studio holds behind every line, then dissolves to plain black
     just as the section hands over to Meet Team */
  if (nightBg) nightBg.style.opacity = 1 - smooth(p, 0.86, 1);
}

/* ── 03 · meet team ── */
const turnH = $('#turnH'), turnSub = $('#turnSub');
function turn(p) {
  const h = smooth(p, 0.22, 0.42);
  turnH.style.opacity = h;
  turnH.style.transform = `translateY(${(1 - h) * 30}px)`;
  const s = smooth(p, 0.34, 0.52);
  turnSub.style.opacity = s;
  turnSub.style.transform = `translateY(${(1 - s) * 18}px)`;
}

/* ── 04 · the architecture — lattice built once, scrubbed forever ── */
const Lattice = (() => {
  const svg = $('#lattice'); if (!svg) return { scrub() {} };
  /* a few tools sit out on the far ring — the system isn't a tidy circle */
  const TOOLS = [['SLACK', 224], ['GMAIL', 224], ['SHEETS', 296], ['NOTION', 224],
    ['DRIVE', 224], ['CALENDAR', 296], ['DOCS', 224], ['DROPBOX', 296]];
  const linesG = $('#latLines'), chipsG = $('#latChips'), paxG = $('#latPax');
  const CX = 320, CY = 320, R = 224;
  const lines = [], chips = [], pax = [];
  const NSVG = 'http://www.w3.org/2000/svg';

  /* phantom spokes — connections beyond the ones we name. They reach out
     past the ring and dissolve, so the system reads bigger than the diagram. */
  const defs = document.createElementNS(NSVG, 'defs');
  defs.innerHTML = `<radialGradient id="latfade" gradientUnits="userSpaceOnUse" cx="320" cy="320" r="310">
    <stop offset="0.16" stop-color="rgba(13,12,11,.34)"/>
    <stop offset="0.55" stop-color="rgba(13,12,11,.16)"/>
    <stop offset="1" stop-color="rgba(13,12,11,0)"/></radialGradient>`;
  svg.prepend(defs);
  const ghostG = document.createElementNS(NSVG, 'g');
  linesG.parentNode.insertBefore(ghostG, linesG);
  const ghosts = [];
  for (let i = 0; i < 26; i++) {
    const a = -Math.PI / 2 + (i / 26) * Math.PI * 2 + 0.13 + ((i * 0.618) % 1 - 0.5) * 0.14;
    const len = 190 + ((i * 0.417 + 0.23) % 1) * 115;
    const g = document.createElementNS(NSVG, 'path');
    g.setAttribute('d', `M${(CX + Math.cos(a) * 52).toFixed(1)} ${(CY + Math.sin(a) * 52).toFixed(1)} L${(CX + Math.cos(a) * len).toFixed(1)} ${(CY + Math.sin(a) * len).toFixed(1)}`);
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', 'url(#latfade)');
    g.setAttribute('stroke-width', (0.8 + ((i * 0.29) % 1) * 0.7).toFixed(2));
    ghostG.append(g);
    const L = g.getTotalLength();
    g.style.strokeDasharray = L; g.style.strokeDashoffset = L;
    ghosts.push({ g, L, ph: (i * 0.77) % (Math.PI * 2), sp: 0.5 + ((i * 0.618) % 1) * 0.5,
      base: 0.3 + ((i * 0.531 + 0.11) % 1) * 0.7 });   // some spokes barely-there
  }
  TOOLS.forEach(([t, Rr], i) => {
    const a = -Math.PI / 2 + (i / TOOLS.length) * Math.PI * 2;
    const x = CX + Math.cos(a) * Rr, y = CY + Math.sin(a) * Rr;
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ln.setAttribute('d', `M${CX + Math.cos(a) * 52} ${CY + Math.sin(a) * 52} L${x.toFixed(1)} ${y.toFixed(1)}`);
    ln.setAttribute('class', 'lat__line');
    linesG.append(ln);
    const L = ln.getTotalLength();
    ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L;
    lines.push({ ln, L });
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'lat__chip');
    const w = t.length * 7.4 + 26;
    g.innerHTML = `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - 14).toFixed(1)}" width="${w.toFixed(1)}" height="28" rx="3"/>
      <text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle">${t}</text>`;
    g.style.opacity = 0;
    chipsG.append(g);
    chips.push(g);
    /* two packets per spoke — opposite directions, uneven speeds and phases */
    for (let k = 0; k < 2; k++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', k ? 2.4 : 3); c.setAttribute('class', 'lat__pax'); c.style.opacity = 0;
      paxG.append(c);
      const j = i * 2 + k;
      pax.push({ c, a, Rr, dir: (i + k) % 2 ? -1 : 1,
        sp: 0.16 + ((j * 0.618 + 0.21) % 1) * 0.22, ph: (j * 0.417 + 0.09) % 1 });
    }
  });
  /* unlabelled chip outlines on the far ring — more connections, out of focus */
  const gchips = [];
  [0, 2, 3, 5, 6].forEach((k, i) => {
    const a = -Math.PI / 2 + (k + 0.5) * Math.PI / 4;
    const w = [64, 52, 70, 58, 66][i];
    const x = CX + Math.cos(a) * 296, y = CY + Math.sin(a) * 296;
    const r = document.createElementNS(NSVG, 'rect');
    r.setAttribute('x', (x - w / 2).toFixed(1)); r.setAttribute('y', (y - 13).toFixed(1));
    r.setAttribute('width', w); r.setAttribute('height', 26); r.setAttribute('rx', 3);
    r.setAttribute('fill', 'none'); r.setAttribute('stroke', 'rgba(13,12,11,.16)');
    r.style.opacity = 0;
    ghostG.append(r);
    gchips.push({ r, ph: i * 1.7 });
  });

  const core = $('#latCore'); core.style.opacity = 0; core.style.transformOrigin = '320px 320px';
  const stages = $$('[data-stage]');

  return {
    scrub(p, t) {
      /* stage windows: connect .05–.38 · listen .38–.66 · understand .66–1 */
      stages.forEach((s, i) => s.classList.toggle('on',
        p >= [0.02, 0.38, 0.66][i] && p < [0.38, 0.66, 1.01][i]));
      const coreIn = smooth(p, 0.03, 0.14);
      core.style.opacity = coreIn;
      core.style.transform = `scale(${0.7 + coreIn * 0.3})`;
      chips.forEach((g, i) => { g.style.opacity = smooth(p, 0.06 + i * 0.028, 0.14 + i * 0.028); });
      lines.forEach(({ ln, L }, i) => {
        ln.style.strokeDashoffset = L * (1 - smooth(p, 0.14 + i * 0.026, 0.3 + i * 0.026));
      });
      ghosts.forEach(({ g, L, ph, sp, base }, i) => {
        g.style.strokeDashoffset = L * (1 - smooth(p, 0.18 + i * 0.009, 0.36 + i * 0.009));
        g.style.opacity = (base * (0.6 + 0.4 * Math.sin(t * sp + ph))).toFixed(2);
      });
      gchips.forEach(({ r, ph }, i) => {
        r.style.opacity = (smooth(p, 0.14 + i * 0.04, 0.26 + i * 0.04) *
          (0.55 + 0.25 * Math.sin(t * 0.7 + ph))).toFixed(2);
      });
      /* once flowing, the packets never park — they keep riding the spokes
         as the section scrolls away (isNear keeps this scrub live past the pin) */
      const flow = smooth(p, 0.4, 0.5);
      pax.forEach(({ c, a, Rr, dir, sp, ph }) => {
        if (flow <= 0.01) { c.style.opacity = 0; return; }
        let tt = (t * sp + ph) % 1;
        if (dir < 0) tt = 1 - tt;                        // half flow out, half flow in
        const rr = Rr - tt * (Rr - 52);
        c.setAttribute('cx', (CX + Math.cos(a) * rr).toFixed(1));
        c.setAttribute('cy', (CY + Math.sin(a) * rr).toFixed(1));
        c.style.opacity = (flow * (0.35 + 0.65 * Math.sin(tt * Math.PI))).toFixed(2);
      });
      /* understand: the core breathes */
      const u = smooth(p, 0.66, 0.78);
      const disc = $('.lat__coredisc');
      disc.style.filter = u > 0 ? `drop-shadow(0 0 ${18 * u}px rgba(125,163,36,.45))` : '';
    }
  };
})();

/* ── 05 · not another chat window ── */
const botQ = $('#botQ'), teamQ = $('#teamQ'), botA = $('#botA');
const strata = $$('[data-stratum]'), teamA = $('#teamA');
const Q = "Where's the final master?";
const BOT = "I don't have access to your files, but here are some best practices for organising masters: use clear naming conventions, keep a single source of truth, and archive old versions…";
function chat(p) {
  const qt = smooth(p, 0.05, 0.2);
  const qn = Math.round(qt * Q.length);
  botQ.textContent = Q.slice(0, qn);
  teamQ.textContent = Q.slice(0, qn);
  const at = smooth(p, 0.24, 0.5);
  botA.textContent = BOT.slice(0, Math.round(at * BOT.length));
  strata.forEach((el, i) => {
    el.classList.toggle('lit', p > 0.26 + i * 0.055);
  });
  teamA.classList.toggle('on', p > 0.6);
}

/* ── 07 · while you slept — night lifts to morning ── */
const dawnStage = $('#dawnStage'), dawnSec = $('#ch-07'), dawnH = $('#ch-07 .h2');
const lrows = $$('[data-lrow]'), brief = $('#brief');
const mix = (a, b, t) => Math.round(lerp(a, b, t));
function dawn(p) {
  lrows.forEach((el, i) => {
    const t = smooth(p, 0.08 + i * 0.09, 0.18 + i * 0.09);
    el.style.opacity = t;
    el.style.transform = `translateY(${(1 - t) * 18}px)`;
  });
  const b = smooth(p, 0.52, 0.64);
  brief.style.opacity = b;
  brief.style.transform = `translateY(${(1 - b) * 22}px)`;
  /* the page lightens: ink → bone across the back half */
  const d = smooth(p, 0.45, 0.8);
  dawnSec.style.background = `rgb(${mix(13, 239, d)},${mix(12, 235, d)},${mix(11, 227, d)})`;
  /* the heading is the exact inverse of the ground — they cross in lockstep */
  dawnH.style.color = `rgb(${mix(239, 13, d)},${mix(235, 12, d)},${mix(227, 11, d)})`;
  dawnStage.classList.toggle('is-dawn', d > 0.32);   // cards/chips flip at the same crossover
}

/* ── chrome theme ── */
const railIts = $$('.rail__it');   // rail removed — kept as an empty list
const themed = $$('[data-theme]');
function narrate() {
  /* the theme probes at the logo's height — the flip lands exactly when the
     ground under the chrome actually changes, including inside gradient bridges */
  const probe = scrollY + 56;
  let cur = null;
  themed.forEach(el => { if (el.offsetTop <= probe) cur = el; });
  let theme = cur ? cur.dataset.theme : 'dark';
  if (cur && cur.classList.contains('bridge')) {
    const bp = (probe - cur.offsetTop) / cur.offsetHeight;   // position within the gradient
    theme = cur.classList.contains('bridge--toink')
      ? (bp > 0.45 ? 'dark' : 'light')
      : (bp > (cur.classList.contains('bridge--dev') ? 0.68 : 0.58) ? 'light' : 'dark');
  }
  if (theme === 'dawn') theme = smooth(prog(pins.dawn), 0.45, 0.8) > 0.5 ? 'light' : 'dark';
  document.body.dataset.theme = theme;
}

/* ── [data-reveal] entrances ── */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.25 });
$$('[data-reveal]').forEach(el => io.observe(el));

/* ── extend the master loop ── */
/* a fast flick can jump clean past a scrub's window, stranding it mid-state
   (e.g. the truth line left visible) — settle each scrub once as it leaves */
let T4 = 0;
const wasNear = {};
function runScrub(key, fn) {
  const pin = pins[key];
  if (!pin) return;
  if (isNear(pin)) { fn(prog(pin)); wasNear[key] = true; }
  else if (wasNear[key]) { fn(prog(pin)); wasNear[key] = false; }   // prog clamps to 0/1
}
function chapters(dt) {
  T4 += dt;
  runScrub('op', op);
  runScrub('night', night);
  runScrub('turn', turn);
  runScrub('arch', p => Lattice.scrub(p, T4));
  runScrub('chat', chat);
  runScrub('dawn', dawn);
  narrate();
}

/* ═══ the app screen lives — countdown ticks, tasks land, teammate chats ═══ */
(() => {
  const band = $('#devband'); if (!band || reduced) return;
  let live = false;
  new IntersectionObserver(e => { live = e[0].isIntersecting; }, { threshold: 0.12 }).observe(band);

  /* countdown counts for real */
  const secsEl = $('#appSecs'), minsEl = $('#appMins');
  let m = 6, s = 27;
  setInterval(() => {
    if (!live || document.hidden) return;
    s--; if (s < 0) { s = 59; m = m > 0 ? m - 1 : 59; }
    secsEl.textContent = String(s).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
  }, 1000);

  /* tasks keep landing on the timeline */
  const days = $$('.app__day');
  const POOL = [
    ['tcard--blue',  'Master v10 QC Check', 'AUDIO'],
    ['tcard--teal',  'Pre-Save Link Goes Live', 'DSP_ACTIVATION'],
    ['tcard--amber', 'Vinyl PO Sign-off', 'OPS'],
    ['tcard--dark',  'EPK Refresh + Press Shots', 'PRESS'],
    ['tcard--purple','Lyric Video Teaser Cut', 'CONTENT'],
    ['tcard--blue',  'Radio One-Sheet Draft', 'RADIO'],
  ];
  let ti = 0;
  setInterval(() => {
    if (!live || document.hidden) return;
    const [cls, title, tag] = POOL[ti % POOL.length];
    const day = days[1 + (ti % 3)];              // columns 2–4; col 1 keeps its anchors
    ti++;
    if (!day) return;
    const el = document.createElement('div');
    el.className = `tcard ${cls} tcard--pop`;
    el.innerHTML = `<p class="mono tcard__meta">ACTIVE · NEW</p><b>${title}</b><span class="mono">${tag}</span>`;
    day.append(el);
    const mine = day.querySelectorAll('.tcard--pop');
    if (mine.length > 2) { const o = mine[0]; o.classList.add('tcard--out'); setTimeout(() => o.remove(), 550); }
  }, 3800);

  /* the conversation carries on */
  const scroll = $('.app__scroll');
  const CHAT = [
    [0, 'TEAMMATE · 12:53', "Pulled 3 past releases. Ava's pre-save pushes in week 2 outperformed week 4 by 31%."],
    [1, '12:54 · YOU', 'Move the pre-save blast earlier then.'],
    [0, 'TEAMMATE · 12:54', 'Done. Moved to Thu 25 and assigned to Maya. Budget untouched.'],
    [1, '12:56 · YOU', "What's still unassigned this week?"],
    [0, 'TEAMMATE · 12:56', 'Two tasks: the country playlist pitch and the venue shortlist. Want owners on both?'],
    [1, '12:57 · YOU', 'Yes, assign them.'],
    [0, 'TEAMMATE · 12:57', 'Assigned. Playlist pitch to Sam, venues to Maya. Timeline updated.'],
  ];
  let ci = 0;
  setInterval(() => {
    if (!live || document.hidden) return;
    const [you, meta, text] = CHAT[ci % CHAT.length]; ci++;
    const d = document.createElement('div');
    d.className = 'app__msg' + (you ? ' app__msg--you' : '') + ' app__msg--in';
    d.innerHTML = `<u class="mono">${meta}</u><p>${text}</p>`;
    scroll.append(d);
    while (scroll.children.length > 4) scroll.firstChild.remove();
  }, 4200);
})();
