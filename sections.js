/* Section renderers shared by home + PDP so both pages use identical components. Real Kanther content only. */
(() => {
  const { $, $$, byK, fixNote, ICON } = window.KT;
  const K = window.KANTHER;
  const fmt = n => n.toLocaleString("es-MX");

  // Real customer quotes from Kanther's own ad statics (Lazzo Studio, Oct 2026 — Drive "Ads Octubre").
  const QUOTES = [
    { who: "Frida Z.", txt: "Descubrí Kanther y amé! Lo uso diario y me dura demasiado. Un aroma espectacular, elegante pero fresco, de esos perfumes que te preguntan <em>cuál traes puesto.</em>", k: "182" },
    { who: "Raúl E.", txt: "Excelente calidad, dura todo el día, el aroma <em>increíble!</em> 10/10", k: "158" },
  ];

  // Stores: sucursales.kanther.mx (Nov 2026). Photos from kanther.mx where available.
  const STORES = [
    { n: "Parque Delta", a: "Av. Cuauhtémoc 462, Piedad Narvarte, Benito Juárez, CDMX", img: "s-Delta", note: "2 tiendas" },
    { n: "Parque Toreo", a: "Blvd. Manuel Ávila Camacho 5, Int. K11, Lomas de Sotelo, Naucalpan, Edomex", img: "s-Toreo" },
    { n: "Parque Lindavista", a: "Colector 13 #280, Magdalena de las Salinas, Gustavo A. Madero, CDMX", img: "s-Linda-vista" },
    { n: "Parque Tezontle", a: "Canal de Tezontle 1512, Alfonso Ortiz Tirado, Iztapalapa, CDMX", img: "s-tezontle" },
    { n: "Parque Las Antenas", a: "Periférico 3278, La Esperanza, Iztapalapa, CDMX", img: "s-Las-Antenas" },
    { n: "Parque Tepeyac", a: "Eduardo Molina 6730, Int. C20, Granjas Modernas, Gustavo A. Madero, CDMX", img: null },
  ];

  const FAQ = [
    ["¿Qué significa “inspirado en”?", "Cada fragancia Kanther toma como referencia el perfil olfativo de un perfume de diseñador (por ejemplo, K.201 está inspirado en Sauvage de Dior). Kanther no se asocia ni afilia con esas marcas."],
    ["¿Cuánto dura el aroma?", "Nuestras fragancias tienen un aroma en piel duradero de más de 5 horas."],
    ["¿Qué tamaños hay y cuánto cuestan?", "Todas las fragancias vienen en 30 ml por $240 MXN y 100 ml por $600 MXN. También puedes armar bundles desde $400 MXN."],
    ["¿Hacen envíos a todo México?", "Sí, hacemos envíos nacionales rápidos y seguros. El envío es gratis a partir de $1,900 MXN."],
    ["¿Puedo probarlas antes de comprar?", "Claro. Visita cualquiera de nuestras sucursales en CDMX y Estado de México, abiertas todos los días de 11:00 a 21:00, o empieza con una presentación de 30 ml."],
    ["¿Cómo funcionan los bundles?", "Eliges el bundle y luego seleccionas cada fragancia. Puedes combinar aromas de las líneas Mujer, Hombre y Unisex, y buscarlos por nombre o por clave (por ejemplo “Sauvage” o “K.201”)."],
    ["¿Tienen descuento de bienvenida?", "Sí: regístrate y obtén un 10% de descuento en tu primera compra."],
  ];

  const BUNDLE_REG = { "bundle-set-2-piezas-30-ml": 480, "bundle-set-5-piezas-30-ml": 1000, "bundle-pack-100ml-30ml": 800, "bundle-set-2-piezas-100-ml": 1200, "bundle-set-2-piezas-100-ml-30-ml": 1400, "bundle-set-4-piezas-100-ml": 2400 };
  const BUNDLE_PCS = { "bundle-set-2-piezas-30-ml": "ss", "bundle-set-5-piezas-30-ml": "sssss", "bundle-pack-100ml-30ml": "Ls", "bundle-set-2-piezas-100-ml": "LL", "bundle-set-2-piezas-100-ml-30-ml": "LLs", "bundle-set-4-piezas-100-ml": "LLLL" };
  const BOTS = ["k201", "k105", "k301", "k128", "k343", "k132", "k254", "k101"];

  function stars(n = 5) { return `<span class="stars" aria-label="${n} de 5">${ICON.star.repeat(n)}</span>`; }

  function quotes(el) {
    el.innerHTML = QUOTES.map((q, i) => {
      const p = byK(q.k);
      return `<figure class="quote ${i ? "b" : "a"} rv ${i ? "rv-d1" : ""}">${stars()}
        <blockquote>${q.txt}</blockquote>
        <cite>${q.who} <span>· Cliente Kanther</span></cite>
        ${i === 0 ? `<img class="bot" src="media/cut/k201.webp" alt="" loading="lazy">` : ""}
      </figure>`;
    }).join("");
  }

  function faq(el, extra = []) {
    el.innerHTML = [...extra, ...FAQ].map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}<span class="pm" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">${a}</div></details>`).join("");
  }

  function stores(el) {
    el.innerHTML = STORES.map((s, i) => `<article class="store rv ${["", "rv-d1", "rv-d2", "rv-d3"][i % 4]}">
      <div class="im" style="${s.img ? `background-image:url(media/img/${s.img}.webp)` : "background:linear-gradient(135deg,var(--sand),var(--cream))"}"></div>
      <div class="bd"><b>${s.n}${s.note ? ` <span style="font-weight:500;font-size:13px;color:var(--mute)">· ${s.note}</span>` : ""}</b><p>${s.a}</p>
      <span class="hrs"><i></i>Todos los días · 11:00–21:00</span>
      <a class="dir" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Kanther " + s.a)}" target="_blank" rel="noopener">Cómo llegar</a></div></article>`).join("") +
      `<article class="store rv" style="background:var(--ink);color:var(--paper)"><div class="bd" style="justify-content:center;padding:28px"><b style="font-size:26px;line-height:1.05">7 sucursales en CDMX y Edomex</b><p style="color:#cfc6b9;margin-top:8px">Más de 30 fragancias te están esperando.</p><a class="dir" style="color:var(--sand)" href="https://sucursales.kanther.mx/" target="_blank" rel="noopener">Ver todas</a></div></article>`;
  }

  function bundles(el, limit) {
    const list = K.bundles.slice().sort((a, b) => a.price - b.price).slice(0, limit || 99);
    const maxSave = Math.max(...list.map(b => BUNDLE_REG[b.slug] - b.price));
    el.innerHTML = list.map((b, i) => {
      const reg = BUNDLE_REG[b.slug], save = reg - b.price, hl = save === maxSave;
      const pcs = [...BUNDLE_PCS[b.slug]].map((c, j) => `<img class="${c === "s" ? "s" : ""}" src="media/cut/${BOTS[(i + j) % BOTS.length]}.webp" alt="" loading="lazy">`).join("");
      return `<article class="bundle ${hl ? "hl" : ""} rv ${["", "rv-d1", "rv-d2"][i % 3]}">${hl ? `<span class="badge">Mayor ahorro</span>` : ""}
        <div class="pcs" aria-hidden="true">${pcs}</div>
        <h3 class="h3">${b.name.replace("Bundle Set · ", "").replace("Bundle Pack ", "")}</h3>
        <p class="sv">${b.desc.split(":")[0].replace(/\s+/g, " ").slice(0, 90)}</p>
        <div class="pr"><b>$${fmt(b.price)}</b><s>$${fmt(reg)}</s></div>
        <p class="sv" style="margin-top:-12px;margin-bottom:22px">Ahorras $${fmt(save)} MXN</p>
        <a class="btn ${hl ? "btn-sand" : "btn-ink"} btn-block" href="${b.url}" target="_blank" rel="noopener">Elegir fragancias</a></article>`;
    }).join("");
  }

  // Happy Mammoth "what to expect" timeline, built from the product's real note pyramid.
  function timeline(el, p) {
    const n = p.notes;
    const steps = [
      ["Al aplicar", "Notas de salida", n.top, "La primera impresión: brillante y directa."],
      ["Después", "Notas de corazón", n.heart, "El carácter de la fragancia se revela."],
      ["Hasta +5 hrs", "Notas de fondo", n.base, "La estela que se queda en tu piel."],
    ];
    el.innerHTML = `<div class="tl-track"><i class="tl-fill"></i></div>` + steps.map(([t, h, list, d], i) => `<div class="tl-step rv ${["", "rv-d1", "rv-d2"][i]}">
      <span class="tl-dot"></span><span class="eyebrow">${t}</span><h3 class="h3">${h}</h3><p>${d}</p>
      <ul>${(list || []).map(x => `<li>${fixNote(x)}</li>`).join("")}</ul></div>`).join("");
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && el.classList.add("in")), { threshold: .3 });
    io.observe(el);
  }

  function race(el, ks) {
    const list = ks.map(byK);
    const max = Math.max(...list.map(p => p.boutique));
    el.innerHTML = list.map(p => `<div class="r"><div class="who"><b>K.${p.k}</b><span>${p.insp.split(" de ")[0]}</span></div>
      <div class="bars"><div class="bar bq" style="--w:${p.boutique / max * 100}%">Boutique $${fmt(p.boutique)}</div><div class="bar kt" style="--w:${Math.max(600 / max * 100, 22)}%">Kanther $600</div></div></div>`).join("");
  }

  window.KS = { quotes, faq, stores, bundles, timeline, race, stars, QUOTES, BOTS };
})();

/* Scroll-driven video components (shared). */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = () => matchMedia("(max-width: 700px)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const pick = v => { const src = (small() && v.dataset.tall) || v.dataset.wide; if (src && !v.src.endsWith(src)) { v.src = src; v.poster = src.replace(".mp4", ".jpg"); } };
  const autoplay = v => new IntersectionObserver(([e]) => { if (e.isIntersecting && !reduce) { pick(v); v.play().catch(() => {}); } else v.pause(); }, { threshold: .15 }).observe(v);

  // Film card that expands to full screen; side words part around it; caption lands at the end.
  function filmExpand(sec) {
    const fr = sec.querySelector(".vx-frame"), v = fr.querySelector("video"), [l, r] = sec.querySelectorAll(".vx-words span"), cap = sec.querySelector(".vx-cap");
    pick(v); autoplay(v); addEventListener("resize", () => pick(v));
    if (reduce) { sec.classList.add("static"); return; }
    const draw = () => {
      const rect = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
      const p = clamp(-rect.top / span), q = clamp((p - .04) / .62), e = q < .5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
      const m = small(), t0 = m ? 25 : 22, s0 = m ? 12 : 33;
      fr.style.setProperty("--t", (t0 * (1 - e)).toFixed(2) + "vh");
      fr.style.setProperty("--s", (s0 * (1 - e)).toFixed(2) + "vw");
      fr.style.setProperty("--r", (24 * (1 - e)).toFixed(1) + "px");
      fr.style.setProperty("--z", (1.18 - .18 * e).toFixed(3));
      fr.style.setProperty("--shade", clamp((p - .55) / .25).toFixed(3));
      const gap = innerWidth * (s0 / 100) * (1 - e) + innerWidth * .5 * e;
      const half = innerWidth / 2 - innerWidth * s0 / 100;
      if (l && r) {
        const o = (1 - clamp((p - .25) / .35)).toFixed(3);
        l.style.cssText = `right:calc(50% + ${(half + 24 + e * innerWidth * .25).toFixed(0)}px);opacity:${o};transform:translateY(${m ? "-28vh" : "0"})`;
        r.style.cssText = `left:calc(50% + ${(half + 24 + e * innerWidth * .25).toFixed(0)}px);opacity:${o};transform:translateY(${m ? "28vh" : "0"})`;
        if (m) { l.style.right = "auto"; l.style.left = "50%"; l.style.transform = `translate(-50%,-36vh)`; r.style.left = "50%"; r.style.transform = `translate(-50%,35vh)`; }
      }
      const c = clamp((p - .72) / .2);
      cap.style.opacity = c.toFixed(3); cap.style.transform = `translateY(${((1 - c) * 24).toFixed(1)}px)`;
    };
    addEventListener("scroll", draw, { passive: true }); // direct: cheap style writes, stays in sync with fast scrolls
    addEventListener("resize", draw); draw();
  }

  // Closing banner: video plays when visible, slow parallax zoom.
  function ctaFilm(el) {
    const v = el.querySelector("video"); pick(v); autoplay(v); addEventListener("resize", () => pick(v));
    if (reduce) return;
    let raf = 0;
    addEventListener("scroll", () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; const r = el.getBoundingClientRect(); const p = clamp(1 - (r.top + r.height) / (innerHeight + r.height)); el.style.setProperty("--z", (1.16 - .16 * p).toFixed(3)); }); }, { passive: true });
  }

  window.KV = { filmExpand, ctaFilm };
})();

/* Gruns-style social fan + closing CTA (shared). Fan cards ride a big wheel that turns with scroll. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CARDS = ["u2", "st1", "p1", "hf4", "u5", "u8", "hf6", "p3", "u6", "st2", "hf2", "u7", "p2"];
  function fan(sec) {
    const wrap = sec.querySelector(".fan"), N = 24, STEP = 360 / N;
    wrap.innerHTML = Array.from({ length: N }, (_, i) => `<div class="spoke" style="transform:rotate(${(i - (N >> 1)) * STEP}deg)"><figure class="fan-card"><img src="media/fan/${CARDS[i % CARDS.length]}.jpg" alt="" loading="lazy"></figure></div>`).join("");
    if (reduce) return;
    let rot = 0, timer = 0;
    const step = () => { rot -= STEP; wrap.style.setProperty("--rot", rot + "deg"); };
    new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) timer = setInterval(step, 3000); }, { threshold: .2 }).observe(sec);
  }
  function hype(el) {
    if (reduce) return;
    const b1 = el.querySelector(".b1");
    addEventListener("scroll", () => {
      const r = el.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height);
      if (p < 0 || p > 1) return;
      b1.style.transform = `translateY(${((.5 - p) * 60).toFixed(1)}px) rotate(${((p - .5) * 6).toFixed(2)}deg)`;
    }, { passive: true });
  }
  window.KG = { fan, hype };
})();

/* "Haz la cuenta": 1 boutique bottle vs. how many Kanther 100 ml the same money buys. */
(() => {
  const { byK } = window.KT;
  const fmt = n => n.toLocaleString("es-MX");
  const PICKS = ["301", "343", "105", "128", "254", "201"]; // fragrances with real bottle cutouts
  function swap(el, chipsEl, cta) {
    chipsEl.innerHTML = PICKS.map((k, i) => { const p = byK(k); return `<button class="swap-chip ${i ? "" : "on"}" role="tab" data-k="${k}"><b>${p.insp.split(" de ")[0]}</b><span>K.${k}</span></button>`; }).join("");
    let timer;
    const show = k => {
      const p = byK(k), n = Math.floor(p.boutique / 600), save = p.boutique - 600;
      el.innerHTML = `
        <div class="swap-top">
          <div class="swap-one"><span class="eyebrow">1 frasco en boutique</span><b>$${fmt(p.boutique)}</b><em>${p.insp}</em></div>
          <div class="swap-eq">=</div>
          <div class="swap-many"><span class="eyebrow">Frascos Kanther de 100 ml</span><b data-count>0</b><em>K.${p.k} · $600 c/u</em></div>
        </div>
        <div class="swap-grid" style="--n:${Math.min(n, 12)}">${Array.from({ length: n }, (_, i) => `<img src="media/cut/k${k}.webp" alt="" style="--d:${i * 70}ms">`).join("")}</div>
        <div class="swap-foot"><span>Con un solo frasco Kanther ahorras</span><b>$${fmt(save)}</b></div>`;
      requestAnimationFrame(() => el.classList.add("pop"));
      const c = el.querySelector("[data-count]"); let v = 0; clearInterval(timer);
      timer = setInterval(() => { v++; c.textContent = v; if (v >= n) clearInterval(timer); }, 70);
      cta.href = `product.html?k=${k}`; cta.textContent = `Ver K.${k}`;
      chipsEl.querySelectorAll(".swap-chip").forEach(b => { b.classList.toggle("on", b.dataset.k === k); b.setAttribute("aria-selected", b.dataset.k === k); });
    };
    chipsEl.querySelectorAll(".swap-chip").forEach(b => b.onclick = () => { el.classList.remove("pop"); void el.offsetWidth; show(b.dataset.k); });
    // first reveal when scrolled into view
    show(PICKS[0]); el.classList.remove("pop"); // render immediately; animate when it comes into view
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { show(chipsEl.querySelector(".swap-chip.on").dataset.k); o.disconnect(); } }, { threshold: .2 }).observe(el);
  }
  Object.assign(window.KS, { swap });
})();

/* Scent film rail: one looping film per fragrance (real bottle, Higgsfield), notes from kanther.mx. */
(() => {
  const { byK, fixNote, add, toast } = window.KT;
  const fmt = n => n.toLocaleString("es-MX");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = [["201", "#b9c9d6"], ["105", "#5b3a26"], ["301", "#d9c2a0"], ["128", "#f0cfc4"], ["343", "#4a2e1f"], ["132", "#cbbbe0"]];
  function scents(el) {
    el.innerHTML = S.map(([k, c]) => {
      const p = byK(k), n = p.notes, line = [...(n.top || []).slice(0, 2), ...(n.base || []).slice(0, 1)].map(fixNote).join(", ");
      return `<article class="scent"><a class="media" href="product.html?k=${k}" style="--c:${c}" aria-label="K.${k}, inspirado en ${p.insp}">
          <img src="media/scents/k${k}.jpg" alt="" loading="lazy"><video data-src="media/scents/k${k}.mp4" muted loop playsinline preload="none"></video>
          <button class="add" data-k="${k}">+ 30 ml · $240</button></a>
        <b>K.${k}<span>${p.insp.split(" de ")[0]}</span></b><p>${line}.</p>
        <div class="pr">100 ml $600${p.boutique ? `<s>$${fmt(p.boutique)} en boutique</s>` : ""}</div></article>`;
    }).join("");
    el.querySelectorAll(".add").forEach(b => b.onclick = e => { e.preventDefault(); add({ k: b.dataset.k, size: "30" }); toast(`K.${b.dataset.k} · 30 ml agregado`); });
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !reduce) { if (!v.src) { v.src = v.dataset.src; v.addEventListener("playing", () => v.classList.add("on"), { once: true }); } v.play().catch(() => {}); } else v.pause();
    }), { threshold: .5 });
    el.querySelectorAll("video").forEach(v => io.observe(v));
    const nav = el.previousElementSibling.querySelector(".rail-nav");
    nav.querySelectorAll("button").forEach(b => b.onclick = () => el.scrollBy({ left: +b.dataset.dir * el.clientWidth * .75, behavior: "smooth" }));
  }
  Object.assign(window.KS, { scents });
})();

/* Note → ingredient icon (media/notes). Notes without a matching icon get a monogram circle. */
(() => {
  const RULES = [["pimienta rosa","pimientarosa"],["bergamota","bergamota"],["jazm","jazmin"],["cedr","cedro"],["almizcle","almizcle"],["vetiver","vetiver"],["vainilla","vainilla"],["pach","pachuli"],["rosa","rosa"],["mandarina","mandarina"],["sándalo","sandalo"],["sandalo","sandalo"],["azahar","azahar"],["flor del naranjo","azahar"],["naranjo","azahar"],["tonka","tonka"],["ámbar","ambar"],["ambar","ambar"],["ambroxan","ambar"],["limón","limon"],["lima","limon"],["lavanda","lavanda"],["cuero","cuero"],["cardamomo","cardamomo"],["musgo","musgo"],["pera","pera"],["fresia","fresia"],["grosella","grosella"],["naranja","naranja"],["geranio","geranio"],["menta","menta"],["canela","canela"],["marina","marinas"],["salvia","salvia"],["toronja","toronja"],["pomelo","toronja"],["jengibre","jengibre"],["café","cafe"],["iris","iris"],["almendra","almendra"],["orquídea","orquidea"],["durazno","durazno"],["melocot","durazno"],["lirio","lirio"],["nardo","nardos"],["té","te"],["praliné","praline"],["gaiac","gaiac"],["guayaco","gaiac"],["violeta","violeta"],["ládano","ladano"],["romero","romero"],["azafrán","azafran"],["tabaco","tabaco"],["incienso","incienso"],["laurel","laurel"],["higo","higo"]];
  function noteIcon(name) {
    const n = name.toLowerCase();
    const hit = RULES.find(([k]) => k === "té" ? /(^|\s)té(\s|$)/.test(n) : n.includes(k));
    return hit ? `media/notes/${hit[1]}.jpg` : null;
  }
  Object.assign(window.KS, { noteIcon });
})();
