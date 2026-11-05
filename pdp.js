/* Product page: works for every fragrance via product.html?k=201 (default K.201, the hero SKU in the UGC ads). */
(() => {
  KT.init();
  const { $, $$, byK, card, wireAdds, fixNote, ICON, add, toast } = KT;
  const K = window.KANTHER;
  const fmt = n => n.toLocaleString("es-MX");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const p = byK(new URLSearchParams(location.search).get("k")) || byK("201");
  const PARA = KT.PARA[p.para];
  const short = p.insp.split(" de ")[0];
  const hasNotes = p.notes.top && p.notes.heart && p.notes.base;
  const cut = ["201", "101", "301", "343", "132", "105", "128", "254"].includes(p.k) ? `media/cut/k${p.k}.webp` : null;
  const UGC_FOR = { "201": ["u5", "u4"], "132": ["u6"], "343": ["u7"], "195": ["u2", "u1"], "389": ["u3"] };
  let size = "100", qty = 1;

  document.title = `K.${p.k} · Inspirado en ${p.insp} · Kanther`;
  $("[data-crumb-k]").textContent = "K." + p.k;
  const cp = $("[data-crumb-para]"); cp.textContent = PARA; cp.href = `index.html?para=${p.para}#coleccion`;

  /* ---------- gallery ---------- */
  const media = [...p.imgs.map(src => ({ t: "img", src })), ...(UGC_FOR[p.k] || []).map(v => ({ t: "vid", src: `media/ugc/${v}.mp4`, poster: `media/ugc/${v}.jpg` }))];
  $("[data-main]").innerHTML = media.map((m, i) => m.t === "img"
    ? `<img class="${i ? "" : "on"}" src="${m.src}" alt="Kanther K.${p.k} ${i + 1}" ${i ? 'loading="lazy"' : ""}>`
    : `<video src="${m.src}" poster="${m.poster}" muted loop playsinline preload="none"></video>`).join("") + `<span class="badge">Inspirado en ${short}</span>`;
  $("[data-thumbs]").innerHTML = media.map((m, i) => `<button role="tab" class="${i ? "" : "on"}" aria-label="Ver ${m.t === "vid" ? "video" : "foto"} ${i + 1}">
    ${m.t === "img" ? `<img src="${m.src}" alt="">` : `<img src="${m.poster}" alt=""><span class="pv">${ICON.play.replace("<svg", '<svg width="18" height="18"')}</span>`}</button>`).join("");
  const slides = [...$("[data-main]").children].filter(e => !e.classList.contains("badge"));
  $$("[data-thumbs] button").forEach((b, i) => b.onclick = () => {
    $$("[data-thumbs] button").forEach(x => x.classList.toggle("on", x === b));
    slides.forEach((s, j) => { s.classList.toggle("on", i === j); if (s.tagName === "VIDEO") j === i && !reduce ? s.play().catch(() => {}) : s.pause(); });
  });

  /* ---------- info / buy box ---------- */
  const tags = [...(p.notes.top || []), ...(p.notes.heart || [])].slice(0, 6).map(fixNote);
  const intro = p.desc || (hasNotes ? `Abre con ${fixNote(p.notes.top[0]).toLowerCase()}, revela ${fixNote(p.notes.heart[0]).toLowerCase()} en el corazón y deja una estela de ${fixNote(p.notes.base[0]).toLowerCase()}.` : "Una fragancia inspirada en uno de los perfumes más queridos, con aroma en piel duradero.");
  function notesBlock() {
    const all = [...p.notes.top.map(n => [n, "Salida"]), ...p.notes.heart.map(n => [n, "Corazón"]), ...p.notes.base.map(n => [n, "Fondo"])];
    const withIcon = all.filter(([n]) => KS.noteIcon(n));
    const pick = [withIcon.find(([, l]) => l === "Salida"), withIcon.find(([, l]) => l === "Corazón"), withIcon.find(([, l]) => l === "Fondo"), ...withIcon].filter(Boolean)
      .filter((v, i, a) => a.findIndex(x => x[0] === v[0]) === i).slice(0, 5);
    const col = (t, ico, list) => `<div class="nb-col"><span class="nb-h">${ico}${t}</span><p>${list.map(fixNote).join(", ")}</p></div>`;
    const up = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 16V8M8.5 11.5 12 8l3.5 3.5"/></svg>';
    const heart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
    const down = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8.5 12.5 12 16l3.5-3.5"/></svg>';
    return `<div class="nb">
      <span class="nb-title">Notas destacadas</span>
      <div class="nb-icons">${pick.map(([n]) => `<figure><img src="${KS.noteIcon(n)}" alt="" loading="lazy"><figcaption>${fixNote(n).replace(/\s*\(.*?\)/, "")}</figcaption></figure>`).join("")}</div>
      <div class="nb-cols">${col("Salida", up, p.notes.top)}${col("Corazón", heart, p.notes.heart)}${col("Fondo", down, p.notes.base)}</div>
    </div>`;
  }
  $("[data-info]").innerHTML = `
    <div class="para"><span class="eyebrow">Perfume para ${PARA.toLowerCase()}</span><a class="eyebrow" href="#resenas" style="color:var(--ink);display:flex;gap:6px;align-items:center">${KS.stars()} Reseñas</a></div>
    <h1>K.${p.k}</h1>
    <div class="insp-row"><span class="insp-chip">Inspirado en</span><span class="insp-name">${p.insp}</span>${p.boutique ? `<span class="insp-ret">Precio en boutique: $${fmt(p.boutique)}</span>` : ""}</div>
    <p class="desc">${intro}</p>
    ${hasNotes ? notesBlock() : ""}
    <div class="pbox">
      <div class="now"><b data-price>$600</b>${p.boutique ? `<s>$${fmt(p.boutique)}</s><span class="sv" data-sv></span>` : ""}</div>
      <p class="ref">${p.boutique ? `Precio en boutique: $${fmt(p.boutique)} MXN · ` : ""}Envío gratis desde $1,900</p>
      <div class="sizes" role="radiogroup" aria-label="Tamaño">
        <button class="size" role="radio" data-size="30"><b>30 ml</b><span>$240 · Para probar o viajar</span></button>
        <button class="size on" role="radio" data-size="100"><em>Mejor precio por ml</em><b>100 ml</b><span>$600 · Para el día a día</span></button>
      </div>
      <div class="buyrow">
        <div class="qty"><button aria-label="Menos" data-qd="-1">−</button><span data-qty>1</span><button aria-label="Más" data-qd="1">+</button></div>
        <button class="btn btn-ink btn-block" data-atc>Agregar al carrito · <span data-atc-price>$600</span></button>
      </div>
      <a class="btn btn-line btn-block" style="margin-top:10px" data-buynow target="_blank" rel="noopener">Comprar ahora</a>
      <div class="upsell"><img src="media/p/bundle-set-2-piezas-100-ml-0.webp" alt=""><div><b>Hazlo set: 2 × 100 ml por $900</b><span>Ahorras $300 vs. comprarlos por separado</span></div><a href="#bundles-pdp">Ver bundles</a></div>
    </div>
    <div class="perks">
      <div class="perk"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></i>Aroma +5 hrs</div>
      <div class="perk"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg></i>Envíos nacionales</div>
      <div class="perk"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z"/><path d="m5 5 14 14"/></svg></i>Libre de parabenos</div>
      <div class="perk"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg></i>Garantía de satisfacción</div>
    </div>
    <div class="acc pdp-acc">
            <details><summary>Envíos y pagos<span class="pm"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">Envíos nacionales rápidos y seguros a todo México, gratis a partir de $1,900 MXN. Pagos seguros en kanther.mx.</div></details>
      <details><summary>Pruébalo en sucursal<span class="pm"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></summary><div class="ans">Visítanos en Parque Delta, Toreo, Lindavista, Tezontle, Las Antenas o Tepeyac. Todos los días de 11:00 a 21:00.</div></details>
    </div>
    <p class="disc">No nos asociamos ni afiliamos con ${p.insp.includes(" de ") ? "esta marca" : "la marca original"}.</p>`;

  const buyHref = () => p.var?.[size] ? `https://kanther.mx/?add-to-cart=${p.var[size]}&quantity=${qty}` : p.url;
  function sync() {
    const price = size === "100" ? 600 : 240;
    $("[data-price]").textContent = "$" + fmt(price);
    $("[data-atc-price]").textContent = "$" + fmt(price * qty);
    $("[data-qty]").textContent = qty;
    const sv = $("[data-sv]"); if (sv) sv.textContent = `Ahorras $${fmt(p.boutique - price)}`;
    $$(".size").forEach(b => { b.classList.toggle("on", b.dataset.size === size); b.setAttribute("aria-checked", b.dataset.size === size); });
    $$("[data-sticky-size]").forEach(b => b.classList.toggle("on", b.dataset.stickySize === size));
    $$("[data-sg]").forEach(b => b.classList.toggle("on", b.dataset.sg === size));
    $("[data-buynow]").href = buyHref();
    const sp = $("[data-sticky-price]"); if (sp) sp.textContent = "$" + fmt(price);
  }
  $$(".size").forEach(b => b.onclick = () => { size = b.dataset.size; sync(); });
  $$("[data-qd]").forEach(b => b.onclick = () => { qty = Math.max(1, qty + +b.dataset.qd); sync(); });
  $("[data-atc]").onclick = () => { add({ k: p.k, size, qty }); toast(`K.${p.k} · ${size} ml agregado`); };
  $("[data-buynow]").addEventListener("click", () => add({ k: p.k, size, qty }), true); // add, then the lead modal (app.js) opens

  /* ---------- sticky add-to-cart ---------- */
  $("[data-sticky-inner]").innerHTML = `<img src="${p.imgs[0]}" alt=""><div class="txt"><b>K.${p.k}</b> <span>· Inspirado en ${p.insp}</span></div>
    <div class="sp"><div class="sizes-mini"><button data-sticky-size="30">30 ml</button><button data-sticky-size="100">100 ml</button></div>
    <button class="btn btn-ink btn-sm" data-sticky-atc>Agregar · <span data-sticky-price>$600</span></button></div>`;
  $$("[data-sticky-size]").forEach(b => b.onclick = () => { size = b.dataset.stickySize; sync(); });
  $("[data-sticky-atc]").onclick = () => $("[data-atc]").click();
  const sticky = $("[data-sticky]");
  new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; sticky.classList.toggle("on", on); sticky.setAttribute("aria-hidden", !on); }).observe($("[data-atc]"));

  /* ---------- note pyramid (pinned) ---------- */
  const pyr = $(".pyr");
  if (!hasNotes) pyr.remove();
  else {
    $("[data-pyr-img]").src = cut || p.imgs[0];
    if (!cut) $(".pyr .bt").style.cssText += ";border-radius:28px;overflow:hidden";
    const L = [["Notas de salida", "La primera impresión", p.notes.top], ["Notas de corazón", "El carácter", p.notes.heart], ["Notas de fondo", "La estela que se queda", p.notes.base]];
    $("[data-layers]").innerHTML = L.map(([e, h, list], i) => `<div class="layer ${i ? "" : "on"}"><span class="eyebrow">${e} · K.${p.k}</span><h2 class="h2">${h}</h2><ul>${list.map(x => `<li>${fixNote(x)}</li>`).join("")}</ul></div>`).join("");
    const layers = $$(".layer", pyr), marks = $$("[data-m]", pyr), bt = $(".pyr .bt"), glow = $(".pyr .glow");
    if (reduce) pyr.classList.add("static");
    else {
      let last = -1;
      const onScroll = () => {
        const r = pyr.getBoundingClientRect(), t = Math.min(1, Math.max(0, -r.top / (pyr.offsetHeight - innerHeight)));
        const i = Math.min(2, Math.floor(t * 3));
        if (i !== last) { last = i; layers.forEach((l, j) => l.classList.toggle("on", j === i)); marks.forEach((m, j) => m.classList.toggle("on", j <= i)); }
        bt.style.transform = `rotateY(${(t - .5) * 50}deg) translateY(${(t - .5) * -40}px)`;
        glow.style.transform = `translate(-50%,-50%) scale(${.8 + t * .5})`;
        glow.style.opacity = .5 + t * .5;
      };
      $(".pyr .stage").style.perspective = "1200px";
      addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
  }

  /* ---------- "haz la cuenta" (1 boutique bottle vs N Kanther) ---------- */
  const vsSec = $("[data-vs-swap]").closest("section");
  if (p.boutique) {
    const n = Math.floor(p.boutique / 600), save = p.boutique - 600, brand = short;
    $("[data-vs-title]").innerHTML = `Un ${brand} en boutique. <span class="it">O ${n} de estos.</span>`;
    $("[data-vs-lead]").textContent = `Por lo que cuesta un frasco de ${p.insp} en boutique, te llevas ${n} frascos de K.${p.k} de 100 ml.`;
    const ck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity=".3"/><path d="m7.5 12 3 3 6-6"/></svg>';
    $("[data-vs-checks]").innerHTML = [`Inspirado en ${p.insp}`, "Aroma en piel duradero, más de 5 hrs", "Libre de parabenos", "Pruébalo antes en 30 ml por $240"].map(t => `<li>${ck}${t}</li>`).join("");
    const bottle = cut || p.imgs[0];
    const el = $("[data-vs-swap]");
    el.innerHTML = `
      <div class="swap-top">
        <div class="swap-one"><span class="eyebrow">1 frasco en boutique</span><b>$${fmt(p.boutique)}</b><em>${p.insp}</em></div>
        <div class="swap-eq">=</div>
        <div class="swap-many"><span class="eyebrow">Frascos Kanther de 100 ml</span><b data-count>${n}</b><em>K.${p.k} · $600 c/u</em></div>
      </div>
      <div class="swap-grid ${cut ? "" : "photo"}">${Array.from({ length: n }, (_, i) => `<img src="${bottle}" alt="" style="--d:${i * 70}ms">`).join("")}</div>
      <div class="swap-foot"><span>Con un solo frasco K.${p.k} ahorras</span><b>$${fmt(save)}</b></div>`;
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { el.classList.add("pop"); let v = 0; const c = el.querySelector("[data-count]"); const t = setInterval(() => { c.textContent = ++v; if (v >= n) clearInterval(t); }, 70); o.disconnect(); } }, { threshold: .3 }).observe(el);
    $("[data-vs-add]").onclick = () => { add({ k: p.k, size: "100" }); toast(`K.${p.k} · 100 ml agregado`); };
  } else vsSec.remove();

  /* ---------- size guide (Luuna) ---------- */
  const bimg = cut || p.imgs[0];
  $("[data-sizeguide]").innerHTML = [["30", 240, "Para probar un aroma nuevo, llevarlo en la bolsa, viajar o regalar.", .62], ["100", 600, "Para tu fragancia de todos los días. El mejor precio por mililitro.", 1]]
    .map(([ml, pr, d, s], i) => `<button class="sg ${ml === size ? "on" : ""} rv ${i ? "rv-d1" : ""}" data-sg="${ml}">
      <div class="sg-art"><img src="${bimg}" alt="" style="height:${Math.round(s * 280)}px" loading="lazy"></div>
      <div class="sg-bd"><div class="sg-top"><b>${ml} ml</b><span>$${pr}</span></div><p>${d}</p><span class="sg-ml">$${(pr / +ml).toFixed(0)} por ml</span></div></button>`).join("");
  $$("[data-sg]").forEach(b => b.onclick = () => { size = b.dataset.sg; sync(); toast(`${size} ml seleccionado`); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- UGC, timeline, reviews, faq, related, bundles ---------- */
  KT.ugc($("[data-ugc]"), p.k);
  if (hasNotes) KS.timeline($("[data-tline]"), p); else $("[data-tline]").closest("section").remove();

  const RKEY = "kanther-reviews-" + p.k;
  const mine = () => { try { return JSON.parse(localStorage.getItem(RKEY)) || []; } catch { return []; } };
  function drawReviews() {
    const real = KS.QUOTES.map(q => ({ who: q.who, txt: q.txt.replace(/<\/?em>/g, ""), n: 5, src: "Reseña de cliente compartida por Kanther" }));
    const list = [...mine().map(r => ({ ...r, pending: true })), ...real];
    $("[data-rv-list]").innerHTML = list.map(r => `<article class="rv-item ${r.pending ? "pending" : ""}"><span class="av">${r.who[0]}</span><div>
      <div class="tp"><b>${r.who.replace(/</g, "")}</b>${r.pending ? '<span class="vf" style="color:var(--mute)">Pendiente de moderación</span>' : '<span class="vf">✓ Cliente Kanther</span>'}</div>
      ${KS.stars(r.n)}<p>${r.txt.replace(/</g, "&lt;")}</p><p class="src">${r.pending ? "Enviada desde este dispositivo" : r.src}</p></div></article>`).join("");
  }
  drawReviews();
  let stars = 5;
  const si = $("[data-star-in]");
  si.innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-label="${n} estrellas" data-st="${n}">${ICON.star}</button>`).join("");
  const paintStars = () => $$("[data-st]", si).forEach(b => b.style.color = +b.dataset.st <= stars ? "var(--ink)" : "var(--line)");
  $$("[data-st]", si).forEach(b => b.onclick = () => { stars = +b.dataset.st; paintStars(); }); paintStars();
  $("[data-rv-open]").onclick = () => { $("[data-rv-form]").classList.toggle("open"); $("#rvn").focus(); };
  $("[data-rv-form]").onsubmit = e => {
    e.preventDefault();
    const r = { who: $("#rvn").value.trim(), txt: $("#rvt").value.trim(), n: stars };
    try { localStorage.setItem(RKEY, JSON.stringify([r, ...mine()])); } catch {}
    e.target.reset(); e.target.classList.remove("open"); drawReviews(); toast("¡Gracias! Tu reseña está en revisión.");
  };

  $("[data-store-title]").innerHTML = `Huele K.${p.k} <span class="it">antes</span> de llevarlo`;
  const others = ["k105", "k201", "k301", "k128"].filter(s => s !== "k" + p.k);
  const trio = cut ? [others[0], "k" + p.k, others[1]] : others.slice(0, 3); // this fragrance in the middle when we have its cutout
  $("[data-store-art]").innerHTML = trio.map(s => `<img src="media/cut/${s}.webp" alt="" loading="lazy">`).join("");

  KS.faq($("[data-faq]"), p.boutique ? [[`¿K.${p.k} es igual a ${p.insp}?`, `K.${p.k} está inspirado en ${p.insp}: toma su perfil olfativo como referencia. No es el producto original y Kanther no se asocia ni afilia con la marca.`]] : []);

  $("[data-rel-title]").innerHTML = `Más para <span class="it">${PARA.toLowerCase()}</span>`;
  const rel = K.products.filter(x => x.para === p.para && x.k !== p.k).sort((a, b) => (b.boutique || 0) - (a.boutique || 0)).slice(0, 8);
  $("[data-rel]").innerHTML = rel.map(card).join(""); wireAdds($("[data-rel]"));
  $("[data-bundles]").parentElement.parentElement.id = "bundles-pdp";
  KS.bundles($("[data-bundles]"), 3);

  /* ---------- video sections ---------- */
  const film = { hombre: "s1", mujer: "s2", unisex: "s3" }[p.para];
  const vv = $("[data-vx-video]"); vv.dataset.wide = `media/film/${film}-wide.mp4`;
  $("[data-vx-eyebrow]").textContent = `K.${p.k} · Inspirado en ${p.insp}`;
  $("[data-vx-lead]").textContent = p.boutique ? `En boutique: $${fmt(p.boutique)}. Aquí, el mismo perfil olfativo.` : "El aroma que amas, a un precio justo.";
  $("[data-vx-add]").onclick = () => { add({ k: p.k, size: "100" }); toast(`K.${p.k} · 100 ml agregado`); };
  KV.filmExpand($("[data-vx]"));
  KG.hype($("[data-hype]"));

  sync(); KT.reveals();
})();
