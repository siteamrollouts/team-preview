/* ═══════════════════════════════════════════════════════════════
   LOGO ORBIT — scroll-scrubbed. The platform logos from the hero
   tiles fall down into a ring around the Team logomark, then orbit
   it as you keep scrolling. Chips swap channels on a timer so the
   ring stays alive. Icons come from window.NH_CHANNELS (nh-hero.js).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var sec = document.getElementById('lorbit');
  var CH = window.NH_CHANNELS;
  if (!sec || !CH) return;
  var keys = Object.keys(CH);
  var wrap = document.getElementById('lorbitChips');
  var path = document.getElementById('lorbitPath');
  var center = sec.querySelector('.lorbit__center');
  var heroL = document.getElementById('nhHero');   // hero layer inside the stage

  var N = 8, chips = [], used = {};
  for (var i = 0; i < N; i++) {
    var k = keys[i % keys.length];
    used[k] = 1;
    var el = document.createElement('div');
    el.className = 'lorbit__chip';
    var f = document.createElement('div');
    f.className = 'chipfade';
    f.style.background = CH[k].bg;
    f.innerHTML = CH[k].svg;
    el.appendChild(f);
    wrap.appendChild(el);
    chips.push({ el: el, fade: f, key: k, seed: (i * 0.618) % 1 });
  }

  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };
  var smooth = function (v, a, b) { var t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  var vis = false;
  new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0 }).observe(sec);

  function frame() {
    if (vis) {
      var vh = innerHeight, vw = innerWidth;
      var range = sec.offsetHeight - vh;
      var p = clamp((scrollY - sec.offsetTop) / range);
      var R = vw < 760 ? Math.min(vw * 0.38, 165) : Math.min(Math.min(vw, vh) * 0.32, 300);

      /* hero holds, then fades in place while the chips fall through it */
      var hf = 1 - smooth(p, 0.1, 0.26);
      if (heroL) {
        heroL.style.opacity = hf.toFixed(3);
        heroL.style.visibility = hf < 0.01 ? 'hidden' : '';
        heroL.style.transform = 'translateY(' + (-(1 - hf) * vh * 0.06).toFixed(1) + 'px)';
      }
      var f = easeOut(smooth(p, 0.14, 0.42));       // fall + form the ring
      var rot = p * Math.PI * 1.7;                  // then circle Team as you scroll

      center.style.opacity = f;
      center.style.transform = 'scale(' + (0.7 + 0.3 * f).toFixed(3) + ')';
      path.style.width = path.style.height = R * 2 + 'px';
      path.style.opacity = (f * 0.9).toFixed(2);
      path.style.transform = 'scale(' + (0.85 + 0.15 * f).toFixed(3) + ')';

      for (var i = 0; i < N; i++) {
        var c = chips[i];
        var a = -Math.PI / 2 + (i / N) * Math.PI * 2 + rot;
        var tx = Math.cos(a) * R, ty = Math.sin(a) * R;
        var sx = (i / (N - 1) - 0.5) * vw * 0.85;    // scattered, echoing the hero tiles
        var sy = -vh * (0.6 + c.seed * 0.35);        // starting above the viewport
        var x = sx + (tx - sx) * f, y = sy + (ty - sy) * f;
        c.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + (0.6 + 0.4 * f).toFixed(3) + ')';
        c.el.style.opacity = clamp(f * 1.6).toFixed(2);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* interchange: one chip at a time swaps to a channel not on the ring */
  var idx = 0;
  setInterval(function () {
    if (!vis) return;
    var c = chips[idx++ % N];
    var fresh = null;
    for (var t = 0; t < 24; t++) {
      var k = keys[Math.floor(Math.random() * keys.length)];
      if (!used[k]) { fresh = k; break; }
    }
    if (!fresh) return;
    delete used[c.key];
    used[fresh] = 1;
    c.key = fresh;
    c.fade.style.opacity = 0;
    c.fade.style.transform = 'scale(.45)';
    setTimeout(function () {
      c.fade.style.background = CH[fresh].bg;
      c.fade.innerHTML = CH[fresh].svg;
      c.fade.style.opacity = 1;
      c.fade.style.transform = 'scale(1)';
    }, 340);
  }, 2600);
})();
