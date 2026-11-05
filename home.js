/* Home: scroll-story hero + section wiring. */
(() => {
  KT.init();
  const { $, $$, byK, card, wireAdds, fixNote } = KT;
  const K = window.KANTHER;
  const fmt = n => n.toLocaleString("es-MX");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => innerWidth < 900;

  if ($("#hero")) {
  /* ================= HERO ================= */
  // One scent world per chapter. Colors chosen to read like each fragrance family.
  const SCENTS = [
    { k: "201", bg1: "#eef1f2", bg2: "#b8c5cc", glow: "#dbe6ec", mood: "Fresco · Especiado · Amaderado" },
    { k: "105", bg1: "#efe3d6", bg2: "#a88468", glow: "#d2a984", mood: "Café · Vainilla · Floral blanco" },
    { k: "301", bg1: "#f2e8d8", bg2: "#c9ab82", glow: "#e6cb9c", mood: "Sándalo · Cuero · Iris" },
  ];
  const BASE = { bg1: "#f4ede2", bg2: "#deceb8", glow: "#efe1b9" };
  const FAN = ["k105", "k301", "k201", "k128", "k343"]; // intro/outro lineup, K.201 in the middle
  const hero = $("#hero"), stage = $(".stage", hero), scene = $(".scene", hero), ghost = $(".ghost", hero);
  const copy = $(".hero-copy", hero), notesEl = $(".notes", hero), prog = $(".hero-progress", hero);
  const old = $("[data-old]"), nw = $("[data-new]"), save = $("[data-save]"), pcard = $(".price-card");

  // chapters: 0 intro, 1..4 scents, 5 outro
  SCENTS.forEach((s, i) => {
    const p = byK(s.k);
    copy.insertAdjacentHTML("beforeend", `<div class="chap" data-ch="${i + 1}">
      <span class="insp"><i></i>Para ${KT.PARA[p.para].toLowerCase()} · ${s.mood}</span>
      <div class="k-name">K.${p.k}</div><div class="k-insp">Inspirado en ${p.insp}</div>
      <p class="lead">${[...(p.notes.top || []).slice(0, 2), ...(p.notes.heart || []).slice(0, 1), ...(p.notes.base || []).slice(0, 2)].map(fixNote).join(" · ")}</p>
      <div class="ctas"><a class="btn btn-ink" href="product.html?k=${p.k}">Ver K.${p.k}</a><button class="btn btn-line" data-add="${p.k}" data-size="30">+ 30 ml · $240</button></div></div>`);
  });
  // no outro chapter: the last scent holds while the next section slides over (keeps the hero short)
  wireAdds(copy);
  const chaps = $$(".chap", copy);
  const NCH = chaps.length;
  prog.innerHTML = chaps.map((_, i) => `<button role="tab" aria-label="Capítulo ${i + 1}"><span></span></button>`).join("");
  const bars = $$("span", prog);
  $$("button", prog).forEach((b, i) => b.onclick = () => {
    const top = hero.offsetTop + (hero.offsetHeight - innerHeight) * ((i + .5) / NCH);
    scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  });

  // bottles: 5 fan bottles + 1 hero bottle (flips between scents)
  const mk = src => { const d = document.createElement("div"); d.className = "bottle"; d.innerHTML = `<img src="media/cut/${src}.webp" alt="" decoding="async"><i class="shine"></i>`; scene.append(d); return d; };
  const fan = FAN.map(mk);
  const main = mk("k201"); const mainImg = $("img", main);
  SCENTS.forEach(s => { const i = new Image(); i.src = `media/cut/k${s.k}.webp`; });

  // note chips around the bottle
  // side (-1 left / 1 right of the bottle) + vertical offset (fraction of vh). Left side only far top/bottom so chips never touch the copy column.
  const SLOTS = [[-1, -.36], [1, -.2], [1, .02], [1, .24], [-1, .37], [-1, -.2]];
  function buildNotes(p) {
    const n = p.notes, list = [];
    (n.top || []).slice(0, 2).forEach(x => list.push(["Salida", x]));
    (n.heart || []).slice(0, 2).forEach(x => list.push(["Corazón", x]));
    (n.base || []).slice(0, 2).forEach(x => list.push(["Fondo", x]));
    notesEl.innerHTML = list.map(([t, x]) => `<span class="note"><small>${t}</small>${fixNote(x)}</span>`).join("");
    return $$(".note", notesEl);
  }
  let noteEls = [], curScent = -1, shown = -1;

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (t, a, b) => clamp((t - a) / (b - a));

  function setWorld(c) {
    hero.style.setProperty("--bg1", c.bg1); hero.style.setProperty("--bg2", c.bg2); hero.style.setProperty("--glow", c.glow);
  }
  function countTo(el, to, pre = "$") {
    const from = +(el.dataset.v || to); el.dataset.v = to;
    if (reduce || from === to) { el.textContent = pre + fmt(to); return; }
    const t0 = performance.now();
    const step = now => { const t = clamp((now - t0) / 700); el.textContent = pre + fmt(Math.round(lerp(from, to, ease(t)))); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function setChapter(ch) {
    if (ch === shown) return; shown = ch;
    chaps.forEach((c, i) => c.classList.toggle("on", i === ch));
    const si = ch - 1;
    if (si >= 0 && si < SCENTS.length) {
      const s = SCENTS[si], p = byK(s.k);
      setWorld(s); ghost.textContent = "K." + p.k;
      countTo(old, p.boutique); countTo(nw, 600); save.textContent = `Ahorras $${fmt(p.boutique - 600)}`;
      $(".lbl", pcard).textContent = `${p.insp.split(" de ")[0]} en boutique`;
      if (curScent !== si) { noteEls = buildNotes(p); curScent = si; }
    } else {
      setWorld(BASE); ghost.textContent = ch === 0 ? "K." : "47";
      if (ch === 0) { const p = byK("201"); countTo(old, p.boutique); save.textContent = `Ahorras $${fmt(p.boutique - 600)}`; $(".lbl", pcard).textContent = "Sauvage en boutique"; }
      noteEls.forEach(n => n.style.opacity = 0);
    }
  }

  let target = 0, cur = 0, raf = 0;
  function measure() {
    const r = hero.getBoundingClientRect(), span = hero.offsetHeight - innerHeight;
    target = clamp(-r.top / span);
  }
  function frame() {
    cur = lerp(cur, target, reduce ? 1 : .12);
    if (Math.abs(cur - target) < .0004) cur = target;
    draw(cur);
    raf = Math.abs(cur - target) > .0004 ? requestAnimationFrame(frame) : 0;
  }
  function kick() { measure(); if (!raf) raf = requestAnimationFrame(frame); }

  function draw(P) {
    const m = mobile();
    const W = innerWidth, H = innerHeight;
    const x = P * NCH, ch = Math.min(NCH - 1, Math.floor(x)), t = x - ch;
    setChapter(ch);
    // copy chapter crossfade
    chaps.forEach((c, i) => {
      const local = x - i; // 0..1 inside this chapter
      const o = i === 0 ? 1 - seg(local, .55, .85) : i === NCH - 1 ? seg(local, .02, .2) : seg(local, .02, .18) * (1 - seg(local, .84, .97));
      const y = i === 0 ? -seg(local, .7, 1) * 40 : (1 - seg(local, 0, .22)) * 40 - seg(local, .8, 1) * 40;
      c.style.opacity = o.toFixed(3);
      c.style.transform = (m ? "" : "translateY(-50%) ") + `translateY(${y.toFixed(1)}px)`;
    });
    bars.forEach((b, i) => b.style.transform = `scaleX(${clamp(x - i).toFixed(3)})`);
    $(".scroll-cue", hero).style.opacity = P < .02 ? 1 : 0;

    // ---- fan (intro converge / outro spread) ----
    const spread = m ? W * .17 : Math.min(W * .085, 128);
    const convergeIn = ease(seg(x, .2, .9));            // intro → converge
        const fanAmt = 1 - convergeIn;
    const fanVisible = ch === 0;
    const cx = m ? 0 : W * .12; // intro: lineup slightly right of center so copy breathes
    fan.forEach((b, i) => {
      const off = i - 2;
      const tx = cx * (ch === NCH - 1 ? 1 : 1) + off * spread * fanAmt;
      const ty = Math.abs(off) * 26 * fanAmt;
      const rot = off * 7 * fanAmt;
      const sc = (i === 2 ? 1 : .86) * (m ? .9 : 1) * lerp(1, .82, fanAmt * (i === 2 ? 0 : 1));
      const o = fanVisible ? (i === 2 ? 1 - seg(x, .88, 1) : fanAmt) : 0;
      b.style.opacity = o.toFixed(3);
      b.style.zIndex = 10 - Math.abs(off);
      b.style.transform = `translate(-50%,-50%) translate3d(${tx}px,${ty}px,${-Math.abs(off) * 80 * fanAmt}px) rotateZ(${rot}deg) scale(${sc})`;
    });

    // ---- main bottle: visible during scent chapters, flips between them ----
    const inScent = x >= 1;
    const sx = x - 1; // 0..4 across scents
    const si = clamp(Math.floor(sx), 0, SCENTS.length - 1), st = sx - si;
    let ry = lerp(-18, 18, st);         // slow showcase turn
    let flip = 0;
    if (st > .86 && si < SCENTS.length - 1) flip = seg(st, .86, 1);   // turn away
    if (st < .14 && si > 0) flip = -(1 - seg(st, 0, .14));             // turn in
    ry += flip * 90;
    const wantK = SCENTS[st > .93 && si < SCENTS.length - 1 ? si + 1 : si].k;
    if (mainImg.dataset.k !== wantK) { mainImg.src = `media/cut/k${wantK}.webp`; mainImg.dataset.k = wantK; }
    const enter = seg(x, .88, 1.04);
    const mo = x > .88 ? enter : 0;
    const bob = Math.sin(performance.now() / 900) * 4;
    const mx = m ? 0 : W * .045;
    main.style.opacity = mo.toFixed(3);
    main.style.setProperty("--shine", (1 - Math.abs(flip)) * .9);
    main.style.transform = `translate(-50%,-50%) translate3d(${mx}px,${bob}px,0) rotateY(${ry.toFixed(2)}deg) scale(${(m ? .95 : 1.06) * lerp(.9, 1, enter)})`;

    // ---- ghost number parallax ----
    ghost.style.transform = `translate(-50%,-52%) translateX(${((st - .5) * -80).toFixed(1)}px) scale(${1 + Math.abs(flip) * .04})`;
    ghost.style.opacity = inScent ? (1 - Math.abs(flip)).toFixed(3) : .7;

    // ---- note chips orbit in, staggered ----
    if (inScent) {
      const hw = main.offsetHeight * .43 / 2 + (m ? 6 : 22); // bottle half-width + gap
      noteEls.forEach((n, i) => {
        const [side, ay] = SLOTS[i % SLOTS.length];
        const last = si === SCENTS.length - 1;
        const a = seg(st, .1 + i * .05, .26 + i * .05) * (last ? 1 : 1 - seg(st, .78, .88));
        const drift = (st - .5) * 26 * (i % 2 ? 1 : -1);
        n.style.opacity = a.toFixed(3);
        const nx = side * (hw - (1 - a) * 20) + mx, ny = ay * H * (m ? .4 : 1) + drift + (m ? H * .07 : 0);
        const anchor = side < 0 ? "-100%" : "0%"; // chips grow away from the bottle
        n.style.transform = `translate(${anchor},-50%) translate3d(${nx.toFixed(1)}px,${ny.toFixed(1)}px,0) scale(${lerp(.92, 1, a).toFixed(3)})`;
      });
    }
    // price card follows chapters
    const po = ch === 0 ? seg(x, .75, .95) : 1;
    pcard.style.opacity = po;
  }

  if (reduce) {
    hero.classList.add("static"); chaps.forEach((c, i) => { c.style.opacity = i === 0 ? 1 : 0; });
    setChapter(0); fan.forEach((b, i) => { b.style.opacity = 1; b.style.transform = `translate(-50%,-50%) translateX(${(i - 2) * 120}px) rotate(${(i - 2) * 6}deg)`; });
  } else {
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    setInterval(() => { if (!raf && hero.getBoundingClientRect().bottom > 0) draw(cur); }, 60); // idle bob
    kick();
  }

  }

  /* ================= SECTIONS ================= */
  // shop-by tiles
  const counts = { mujer: 0, hombre: 0, unisex: 0 }; K.products.forEach(p => counts[p.para]++);
  $("[data-tiles]").innerHTML = [
    ["Mujer", "mujer", `${counts.mujer} fragancias`],
    ["Hombre", "hombre", `${counts.hombre} fragancias`],
    ["Unisex", "unisex", `${counts.unisex} fragancias`],
    ["Bundles", "bundles", "Desde $400 · Ahorra hasta $640"],
  ].map(([t, f, sub], i) => `<a class="tile photo rv ${["", "rv-d1", "rv-d2", "rv-d3"][i]}" href="${f === "bundles" ? "#bundles" : "?para=" + f + "#coleccion"}" data-tile="${f}">
      <img class="tile-img" src="media/tiles/${f}.webp" alt="" loading="lazy">
      <div class="tile-top"><h3 class="h3">${t}</h3><span class="cnt">${sub}</span></div>
      <span class="go-pill"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg><em>Comprar ${t.toLowerCase()}</em></span></a>`).join("");

  // collection grid with filter
  const FEAT = ["201", "105", "301", "128", "254", "132", "343", "389", "182", "275", "175", "300"];
  const grid = $("[data-grid]"); let filt = new URLSearchParams(location.search).get("para") || "all", showAll = false;
  function drawGrid() {
    let list = K.products.filter(p => filt === "all" || p.para === filt);
    list.sort((a, b) => (FEAT.indexOf(a.k) + 1 || 99) - (FEAT.indexOf(b.k) + 1 || 99));
    const n = showAll ? list.length : 8;
    grid.innerHTML = list.slice(0, n).map(card).join("");
    $$(".card", grid).forEach((c, i) => { c.classList.add("rv"); c.style.transitionDelay = (i % 4) * 70 + "ms"; requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("in"))); });
    $("[data-more]").style.display = list.length > n ? "" : "none";
    $("[data-more]").textContent = `Ver ${filt === "all" ? "las " + list.length : "las " + list.length + " de " + KT.PARA[filt]} fragancias`;
    $$("[data-f]").forEach(b => b.classList.toggle("on", b.dataset.f === filt));
    wireAdds(grid);
  }
  $$("[data-f]").forEach(b => b.onclick = () => { filt = b.dataset.f; showAll = false; drawGrid(); });
  $("[data-more]").onclick = () => { showAll = true; drawGrid(); };
  drawGrid();

  KS.scents($("[data-scents]"));
  KS.swap($("[data-swap]"), $("[data-swap-chips]"), $("[data-swap-cta]"));
  KS.timeline($("[data-tline]"), byK("201"));
  KT.ugc($("[data-ugc]"));
  KS.bundles($("[data-bundles]"));
  KS.quotes($("[data-quotes]"));
  KS.stores($("[data-stores]"));
  KS.faq($("[data-faq]"));
  KV.filmExpand($("[data-vx]"));
  KG.hype($("[data-hype]"));
  KG.fan($("[data-fan]").closest("section"));
  KT.reveals();
})();
