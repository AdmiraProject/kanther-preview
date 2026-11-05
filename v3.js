/* v3 (Cometeer layout): wires shared Kanther data/components into the Cometeer section structure. */
(() => {
  KT.init();
  const { $, $$, byK, add, toast, ICON } = KT;
  const K = window.KANTHER;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // hero film: wide on desktop, reframed tall cut on phones
  const hv = $(".c-hero video");
  const pick = () => { const src = matchMedia("(max-width: 800px)").matches ? hv.dataset.tall : hv.dataset.wide; if (!hv.src.endsWith(src)) { hv.src = src; hv.play().catch(() => {}); } };
  pick(); addEventListener("resize", pick); if (reduce) hv.pause();

  // featured bundle: two fragrance pickers -> one bundle line (picks shown in toast; final selection happens at kanther.mx checkout)
  const opts = K.products.map(p => `<option value="${p.k}">K.${p.k} · ${p.insp}</option>`).join("");
  $$("[data-bsel]").forEach((s, i) => { s.innerHTML = opts; s.value = ["201", "105"][i]; });
  $("[data-badd]").onclick = () => { add({ bundle: "bundle-set-2-piezas-100-ml" }); toast(`Bundle: K.${$("#b1").value} + K.${$("#b2").value}`); };

  // product list (Cometeer grid: square image, ADD, unit price)
  const PICK = ["201", "105", "301", "389", "128", "254", "343", "300"];
  $("[data-c-grid]").innerHTML = PICK.map(k => {
    const p = byK(k);
    return `<article class="c-card"><a class="media" href="product.html?k=${k}"><img src="${p.imgs[0]}" alt="Kanther K.${k}" loading="lazy"><button class="add" data-add="${k}" data-size="100">Agregar</button></a>
      <h3>K.${k}</h3><div class="in">Inspirado en ${p.insp}</div><div class="pr">$600 · 100 ml</div><div class="unit">Precio unitario $6.00 por ml</div></article>`;
  }).join("");
  KT.wireAdds($("[data-c-grid]"));

  // reviews slideshow (only real customer quotes)
  const sl = $("[data-c-slides]");
  sl.innerHTML = KS.QUOTES.map((q, i) => `<figure class="c-slide ${i ? "" : "on"}">${KS.stars()}<blockquote>“${q.txt.replace(/<\/?em>/g, "")}”</blockquote><cite>${q.who} · Cliente Kanther</cite></figure>`).join("") +
    `<div class="c-dots">${KS.QUOTES.map((_, i) => `<button aria-label="Reseña ${i + 1}" class="${i ? "" : "on"}"></button>`).join("")}</div>`;
  const slides = $$(".c-slide", sl), dots = $$(".c-dots button", sl); let cur = 0;
  const go = i => { cur = i; slides.forEach((s, j) => s.classList.toggle("on", j === i)); dots.forEach((d, j) => d.classList.toggle("on", j === i)); };
  dots.forEach((d, i) => d.onclick = () => go(i));
  if (!reduce) setInterval(() => go((cur + 1) % slides.length), 6000);

  KS.scents($("[data-scents]"));
  KT.ugc($("[data-ugc]"));
  $$(".c-rail-sec").forEach(sec => { const rail = $(".scent-rail,.ugc-rail", sec); $$(".rail-nav button", sec).forEach(b => b.onclick = () => rail.scrollBy({ left: +b.dataset.dir * rail.clientWidth * .75, behavior: "smooth" })); });
  KS.bundles($("[data-bundles]"));
  KS.faq($("[data-faq]"));
  KT.reveals();
})();
