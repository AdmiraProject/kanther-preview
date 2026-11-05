/* Shared shell: nav, mobile menu, cart drawer (localStorage), footer, reveals, UGC rail + lightbox. */
(() => {
  const K = window.KANTHER;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => "$" + n.toLocaleString("es-MX") + " MXN";
  const FREE_SHIP = 1900; // kanther.mx: "Envío gratis a partir de $1,900.00 MXN"
  const byK = k => K.products.find(p => p.k === String(k));
  const fixNote = s => s.replace("irirs", "iris").replace("Pachulli", "Pachulí").replace(/^Ambar$/, "Ámbar");

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h16M4 16h16"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    arrow: '<svg class="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>',
  };

  /* ---------- nav / footer ---------- */
  const NAV = [["Mujer", "index.html?para=mujer#coleccion"], ["Hombre", "index.html?para=hombre#coleccion"], ["Unisex", "index.html?para=unisex#coleccion"], ["Bundles", "index.html#bundles"], ["Sucursales", "index.html#sucursales"]];
  function shell() {
    const msgs = ["Envío gratis a partir de <b>$1,900 MXN</b>", "Regístrate y obtén <b>10%</b> en tu primera compra", "Envíos nacionales · México", "7 sucursales en CDMX y Edomex"];
    const head = document.createElement("div");
    head.innerHTML = `
      <div class="announce" role="region" aria-label="Avisos"><div class="track">${[...msgs, ...msgs, ...msgs, ...msgs].map(m => `<span>${m}</span>`).join("")}</div></div>
      <header class="nav"><div class="wrap">
        <nav class="nav-links" aria-label="Principal">${NAV.slice(0, 4).map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}</nav>
        <button class="icon-btn burger" aria-label="Abrir menú" data-menu>${ICON.menu}</button>
        <a class="logo" href="index.html" aria-label="Kanther inicio"><img src="media/logo.png" alt="Kanther" width="88" height="22"></a>
        <div class="nav-right">
          <a class="icon-btn" href="index.html#sucursales" aria-label="Sucursales">${ICON.pin}</a>
          <button class="icon-btn" aria-label="Abrir carrito" data-cart>${ICON.bag}<span class="cart-count">0</span></button>
        </div>
      </div></header>
      <div class="mnav" id="mnav" aria-hidden="true"><button class="icon-btn close" aria-label="Cerrar menú" data-menu-close>${ICON.x}</button>
        ${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="https://kanther.mx/quiz/" target="_blank" rel="noopener">Quiz de fragancia</a></div>`;
    document.body.prepend(...head.children);

    const foot = document.createElement("div");
    foot.innerHTML = `
      <div class="scrim" data-scrim></div>
      <aside class="drawer" aria-label="Carrito" aria-hidden="true">
        <div class="hd"><b>Tu carrito</b><button class="icon-btn" aria-label="Cerrar carrito" data-cart-close>${ICON.x}</button></div>
        <div class="ship" aria-live="polite"><span data-ship-msg></span><div class="meter"><i data-ship-bar></i></div></div>
        <div class="lines" data-lines></div>
        <div class="ft"><div class="tot"><span>Subtotal</span><span data-sub>$0</span></div>
          <a class="btn btn-ink btn-block" data-checkout href="https://kanther.mx/tienda/" target="_blank" rel="noopener">Finalizar compra ${ICON.arrow}</a>
          <p class="note2">Pago seguro en kanther.mx · Envíos nacionales</p></div>
      </aside>
      <div class="lightbox" data-lightbox role="dialog" aria-label="Video"><button class="icon-btn close" aria-label="Cerrar video" data-lb-close>${ICON.x}</button><video controls playsinline></video></div>
      <div class="toast" role="status" data-toast></div>
      <div class="leadm" data-lead role="dialog" aria-modal="true" aria-labelledby="lead-t" aria-hidden="true">
        <div class="lead-card">
          <button class="icon-btn lead-x" aria-label="Cerrar" data-lead-close>${ICON.x}</button>
          <div class="lead-sum" data-lead-sum></div>
          <form class="lead-form" data-lead-form novalidate>
            <span class="eyebrow">Paso 1 de 2 · Tus datos</span>
            <h2 class="h3" id="lead-t">Casi listo. ¿A quién le enviamos tu pedido?</h2>
            <label><span>Nombre completo</span><input name="name" autocomplete="name" required minlength="2" placeholder="Ana López"><em></em></label>
            <label><span>Teléfono (WhatsApp)</span><div class="tel"><b>+52</b><input name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required pattern="[0-9 ]{10,12}" placeholder="55 1234 5678"></div><em></em></label>
            <label><span>Correo electrónico</span><input name="email" type="email" autocomplete="email" required placeholder="tu@correo.com"><em></em></label>
            <label class="chk"><input type="checkbox" name="ok" required> <span>Acepto el <a href="https://kanther.mx/privacidad/" target="_blank" rel="noopener">aviso de privacidad</a>.</span></label>
            <button class="btn btn-ink btn-block" type="submit">Continuar al pago ${ICON.arrow}</button>
            <p class="lead-note">${ICON.bag.replace("<svg", '<svg width="14" height="14"')} Pago seguro en kanther.mx · Envíos nacionales</p>
          </form>
        </div>
      </div>
      <section class="news sec lap" id="registro"><div class="wrap">
        <span class="eyebrow" style="color:var(--stone)">Club Kanther</span>
        <h2 class="h2 split">Regístrate y llévate <span class="it">10%</span> en tu primera compra</h2>
        <p class="lead">Lanzamientos, bundles y nuevas fragancias inspiradas antes que nadie.</p>
        <form data-news><label class="sr" for="nem">Correo</label><input id="nem" type="email" required placeholder="tu@correo.com" autocomplete="email"><button class="btn btn-sand btn-sm" type="submit">Quiero mi 10%</button></form>
        <p class="ok" data-news-ok></p>
      </div></section>
      <footer><div class="wrap">
        <div class="foot">
          <div><img src="media/logo.png" alt="Kanther" width="88" height="22"><p style="max-width:34ch;font-size:14px">Fragancias de lujo inspiradas en tu perfume favorito. Smell exquisite without the extravagance.</p></div>
          <div><h4>Productos</h4><a href="index.html?para=mujer#coleccion">Mujer</a><a href="index.html?para=hombre#coleccion">Hombre</a><a href="index.html?para=unisex#coleccion">Unisex</a><a href="index.html#bundles">Bundles</a></div>
          <div><h4>Kanther</h4><a href="https://kanther.mx/quiz/" target="_blank" rel="noopener">Fragancia ideal (quiz)</a><a href="index.html#sucursales">Sucursales</a><a href="https://www.instagram.com/kanther.mx/" target="_blank" rel="noopener">Instagram</a></div>
          <div><h4>Información</h4><a href="https://kanther.mx/privacidad/" target="_blank" rel="noopener">Aviso de privacidad</a><a href="https://kanther.mx/cookies/" target="_blank" rel="noopener">Política de cookies</a></div>
        </div>
        <div class="foot-word" aria-hidden="true">KANTHER</div>
        <div class="legal"><span>© 2026 Kanther</span><span>Kanther no se asocia ni afilia con las marcas que inspiran sus fragancias.</span></div>
      </div></footer>`;
    document.body.append(...foot.children);

    const nav = $(".nav");
    addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
    const mnav = $("#mnav");
    $("[data-menu]").onclick = () => { mnav.classList.add("open"); mnav.setAttribute("aria-hidden", "false"); };
    $("[data-menu-close]").onclick = () => { mnav.classList.remove("open"); mnav.setAttribute("aria-hidden", "true"); };
    $$("#mnav a").forEach(a => a.addEventListener("click", () => $("[data-menu-close]").click()));
    $("[data-news]").onsubmit = e => { e.preventDefault(); $("[data-news-ok]").textContent = "¡Listo! Revisa tu correo para activar tu 10%."; e.target.reset(); };
  }

  /* ---------- cart ---------- */
  const CART_KEY = "kanther-cart";
  const load = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
  const save = c => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch {} };
  let cart = load();
  function priceOf(line) {
    if (line.bundle) return K.bundles.find(b => b.slug === line.bundle).price;
    return line.size === "100" ? 600 : 240;
  }
  function add(item) {
    const key = item.bundle || item.k + "-" + item.size;
    const ex = cart.find(l => (l.bundle || l.k + "-" + l.size) === key);
    ex ? ex.qty += item.qty || 1 : cart.push({ ...item, qty: item.qty || 1 });
    save(cart); render(); openCart();
  }
  function render() {
    const lines = $("[data-lines]"); if (!lines) return;
    const sub = cart.reduce((s, l) => s + priceOf(l) * l.qty, 0);
    const n = cart.reduce((s, l) => s + l.qty, 0);
    const cc = $(".cart-count"); cc.textContent = n; cc.classList.toggle("on", n > 0);
    lines.innerHTML = cart.length ? cart.map((l, i) => {
      const p = l.bundle ? K.bundles.find(b => b.slug === l.bundle) : byK(l.k);
      const img = l.bundle ? p.img : p.imgs[0];
      const title = l.bundle ? p.name : "K." + p.k;
      const sub2 = l.bundle ? "Fragancias a elegir en el checkout" : `${l.size} ml · Inspirado en ${p.insp}`;
      return `<div class="line"><img src="${img}" alt="" loading="lazy"><div><b>${title}</b><div class="s">${sub2}</div>
        <div class="qty"><button aria-label="Menos" data-q="${i}" data-d="-1">−</button><span>${l.qty}</span><button aria-label="Más" data-q="${i}" data-d="1">+</button></div></div>
        <div style="text-align:right"><b>$${(priceOf(l) * l.qty).toLocaleString("es-MX")}</b><button class="rm" data-rm="${i}">Quitar</button></div></div>`;
    }).join("") : `<div class="empty"><p style="font-size:18px;color:var(--ink);font-weight:600;margin-bottom:6px">Tu carrito está vacío</p><p>Empieza con un 30 ml desde $240.</p></div>`;
    $("[data-sub]").textContent = money(sub);
    const left = FREE_SHIP - sub;
    $("[data-ship-msg]").innerHTML = left > 0 ? `Te faltan <b>$${left.toLocaleString("es-MX")}</b> para envío gratis` : "<b>¡Tienes envío gratis!</b>";
    $("[data-ship-bar]").style.width = Math.min(100, sub / FREE_SHIP * 100) + "%";
    // single fragrance → deep-link straight into kanther.mx's WooCommerce cart
    const co = $("[data-checkout]");
    const one = cart.length === 1 && !cart[0].bundle && byK(cart[0].k).var?.[cart[0].size];
    co.href = one ? `https://kanther.mx/?add-to-cart=${byK(cart[0].k).var[cart[0].size]}&quantity=${cart[0].qty}` : "https://kanther.mx/tienda/";
    $$("[data-q]", lines).forEach(b => b.onclick = () => { const l = cart[b.dataset.q]; l.qty += +b.dataset.d; if (l.qty < 1) cart.splice(b.dataset.q, 1); save(cart); render(); });
    $$("[data-rm]", lines).forEach(b => b.onclick = () => { cart.splice(b.dataset.rm, 1); save(cart); render(); });
  }
  /* ---------- lead capture before checkout ---------- */
  const LEAD_KEY = "kanther-lead";
  let leadNext = null;
  function openLead(href) {
    leadNext = href;
    const m = $("[data-lead]"), f = $("[data-lead-form]");
    try { const l = JSON.parse(localStorage.getItem(LEAD_KEY)); if (l) { f.name.value = l.name; f.phone.value = l.phone; f.email.value = l.email; f.ok.checked = true; } } catch {}
    const sub = cart.reduce((t, l) => t + priceOf(l) * l.qty, 0), n = cart.reduce((t, l) => t + l.qty, 0);
    $("[data-lead-sum]").innerHTML = `<span class="eyebrow">Tu pedido</span>
      <div class="ls-items">${cart.slice(0, 4).map(l => { const p = l.bundle ? K.bundles.find(b => b.slug === l.bundle) : byK(l.k); return `<div class="ls-i"><img src="${l.bundle ? p.img : p.imgs[0]}" alt=""><span>${l.bundle ? p.name : "K." + p.k + " · " + l.size + " ml"}${l.qty > 1 ? " × " + l.qty : ""}</span><b>$${(priceOf(l) * l.qty).toLocaleString("es-MX")}</b></div>`; }).join("")}</div>
      <div class="ls-tot"><span>${n} ${n === 1 ? "artículo" : "artículos"}</span><b>${money(sub)}</b></div>
      <div class="ls-ship">${sub >= FREE_SHIP ? "✓ Envío gratis" : `Agrega $${(FREE_SHIP - sub).toLocaleString("es-MX")} para envío gratis`}</div>`;
    m.classList.add("open"); m.setAttribute("aria-hidden", "false"); closeCart();
    setTimeout(() => f.name.focus(), 50);
  }
  function closeLead() { const m = $("[data-lead]"); m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }
  function wireLead() {
    const f = $("[data-lead-form]");
    const msg = { name: "Escribe tu nombre", phone: "Teléfono a 10 dígitos", email: "Correo no válido", ok: "Acepta el aviso de privacidad" };
    const check = el => { const bad = !el.checkValidity() || (el.name === "phone" && el.value.replace(/\D/g, "").length !== 10); const lab = el.closest("label"); lab.classList.toggle("bad", bad); const em = lab.querySelector("em"); if (em) em.textContent = bad ? msg[el.name] : ""; return !bad; };
    [...f.elements].filter(e => e.name).forEach(e => e.addEventListener("blur", () => e.value && check(e)));
    f.onsubmit = e => {
      e.preventDefault();
      const ok = [...f.elements].filter(el => el.name).map(check).every(Boolean);
      if (!ok) { f.querySelector(".bad input")?.focus(); return; }
      const lead = { name: f.name.value.trim(), phone: "+52" + f.phone.value.replace(/\D/g, ""), email: f.email.value.trim(), at: new Date().toISOString(), cart };
      try { localStorage.setItem(LEAD_KEY, JSON.stringify({ ...lead, phone: f.phone.value })); } catch {}
      window.dispatchEvent(new CustomEvent("kanther:lead", { detail: lead })); // hook for CRM / Meta CAPI
      closeLead(); toast("¡Gracias! Te llevamos al pago…");
      setTimeout(() => window.open(leadNext, "_blank", "noopener"), 400);
    };
    $("[data-lead-close]").onclick = closeLead;
    $("[data-lead]").addEventListener("click", e => { if (e.target.matches("[data-lead]")) closeLead(); });
    // intercept every path to checkout
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-checkout],[data-buynow]");
      if (!a) return;
      e.preventDefault(); setTimeout(() => openLead(a.href), 0); // let "Comprar ahora" add its item first
    }, true);
  }

  function openCart() { $(".drawer").classList.add("open"); $(".drawer").setAttribute("aria-hidden", "false"); $("[data-scrim]").classList.add("on"); }
  function closeCart() { $(".drawer").classList.remove("open"); $(".drawer").setAttribute("aria-hidden", "true"); $("[data-scrim]").classList.remove("on"); }
  function toast(msg) { const t = $("[data-toast]"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2200); }

  /* ---------- product card ---------- */
  const PARA = { mujer: "Mujer", hombre: "Hombre", unisex: "Unisex" };
  function card(p) {
    return `<article class="card">
      <div class="ph">
        <a href="product.html?k=${p.k}" aria-label="K.${p.k}, inspirado en ${p.insp}">
          <img src="${p.imgs[0]}" alt="Botella Kanther K.${p.k}" loading="lazy" width="900" height="900">
          ${p.imgs[1] ? `<img src="${p.imgs[1]}" alt="" loading="lazy">` : ""}
        </a>
        <span class="tag">${PARA[p.para]}</span>
        ${UGC.some(u => u.k === p.k) ? `<span class="tag vtag">${ICON.play.replace("<svg", '<svg width="10" height="10"')} En video</span>` : ""}
        <div class="quick"><button data-add="${p.k}" data-size="30">+ 30 ml · $240</button><button data-add="${p.k}" data-size="100">+ 100 ml · $600</button></div>
      </div>
      <a class="meta" href="product.html?k=${p.k}">
        <div class="stars-row" aria-label="5 estrellas en kanther.mx">${ICON.star.repeat(5)}</div>
        <div class="kn"><b>K.${p.k}</b><span>Desde $240</span></div>
        <div class="in">Inspirado en ${p.insp}</div>
        ${p.boutique ? `<div class="bq">Precio en boutique <s>$${p.boutique.toLocaleString("es-MX")}</s></div>` : ""}
      </a></article>`;
  }
  function wireAdds(root = document) {
    $$("[data-add]", root).forEach(b => b.onclick = e => { e.preventDefault(); add({ k: b.dataset.add, size: b.dataset.size }); toast(`K.${b.dataset.add} · ${b.dataset.size} ml agregado`); });
    $$("[data-add-bundle]", root).forEach(b => b.onclick = e => { e.preventDefault(); add({ bundle: b.dataset.addBundle }); });
  }

  /* ---------- UGC rail ---------- */
  // Real Kanther videos from Dinametra's Drive (UGC guiones A–D + ad cuts S1/S2/S3/S5). Captions are lines the creators actually say.
  const UGC = [
    { v: "u2", q: "Alguien se me acercó y me dijo: ¿qué perfume traes?", k: "195" },
    { v: "u5", q: "Kanther 100 ml · $600", k: "201" },
    { v: "u3", q: "Lo huelo y me transporto a otro mundo.", k: "389" },
    { v: "u6", q: "Tu próxima fragancia: $240", k: "132" },
    { v: "u4", q: "3 cosas que debes saber antes de comprar.", k: "201" },
    { v: "u7", q: "2 × 100 ml", k: "343" },
    { v: "u1", q: "Perfumes inspirados en clásicos.", k: "195" },
    { v: "u8", q: "Inspirado en ti.", k: "101" },
  ];
  function ugc(el, filterK) {
    let list = UGC;
    if (filterK) list = [...UGC.filter(u => u.k === filterK), ...UGC.filter(u => u.k !== filterK)];
    el.innerHTML = list.map(u => {
      const p = byK(u.k);
      return `<figure class="vid">
        <video src="media/ugc/${u.v}.mp4" poster="media/ugc/${u.v}.jpg" muted loop playsinline preload="none" aria-label="Video Kanther"></video>
        <button class="play" aria-label="Ver con sonido" data-lb="${u.v}">${ICON.sound}</button>
        <figcaption class="ov"><q>${u.q}</q>
          <a class="prod" href="product.html?k=${p.k}"><img src="${p.imgs[0]}" alt=""><div><b>K.${p.k}</b><span>Inspirado en ${p.insp.split(" de ")[0]}</span></div><em>$240</em></a>
        </figcaption></figure>`;
    }).join("");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !reduce) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
    }), { threshold: .55 });
    $$("video", el).forEach(v => io.observe(v));
    $$("[data-lb]", el).forEach(b => b.onclick = () => {
      const lb = $("[data-lightbox]"), v = $("video", lb);
      v.src = `media/ugc/${b.dataset.lb}.mp4`; v.muted = false; lb.classList.add("open"); v.play().catch(() => {});
    });
    const nav = el.parentElement.querySelector(".rail-nav");
    if (nav) $$("button", nav).forEach(b => b.onclick = () => el.scrollBy({ left: (+b.dataset.dir) * el.clientWidth * .8, behavior: "smooth" }));
  }

  /* ---------- reveals + split headings ---------- */
  function reveals() {
    $$(".split").forEach(h => {
      if (h.dataset.done) return; h.dataset.done = 1;
      const walk = n => [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) return f.append(" ");
            const o = document.createElement("span"); o.className = "w"; const i = document.createElement("span"); i.textContent = w; o.append(i); f.append(o);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && !c.classList.contains("w")) walk(c);
      });
      walk(h);
      $$(".w>span", h).forEach((s, i) => s.style.transitionDelay = i * 45 + "ms");
    });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });
    $$(".rv,.split,.race").forEach(el => io.observe(el));
  }

  function init() {
    shell(); render(); wireLead();
    $("[data-cart]").onclick = openCart;
    $("[data-cart-close]").onclick = closeCart;
    $("[data-scrim]").onclick = closeCart;
    $("[data-lb-close]").onclick = () => { const lb = $("[data-lightbox]"); lb.classList.remove("open"); $("video", lb).pause(); };
    addEventListener("keydown", e => { if (e.key === "Escape") { closeCart(); closeLead(); $("[data-lb-close]").click(); $("[data-menu-close]").click(); } });
  }

  window.KT = { $, $$, money, byK, fixNote, ICON, card, wireAdds, add, toast, ugc, reveals, PARA, init };
})();
