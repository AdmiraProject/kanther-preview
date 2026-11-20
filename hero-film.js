(() => {
  const fh = document.querySelector("[data-fh]"); if (!fh) return;
  const v = fh.querySelector("video"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pick = () => { const src = matchMedia("(max-width: 800px)").matches ? v.dataset.tall : v.dataset.wide; if (!v.src.endsWith(src)) { v.src = src; v.poster = src.replace(".mp4", ".jpg"); v.play().catch(() => {}); } };
  pick(); addEventListener("resize", pick);
  const t = fh.querySelector("[data-fh-title]");
  t.innerHTML = [...t.textContent].map((c, i) => `<span style="transition-delay:${180 + i * 70}ms">${c}</span>`).join("");
  t.setAttribute("aria-label", t.textContent);
  [...fh.querySelectorAll("[data-fh-in]")].forEach((e, i) => e.style.transitionDelay = 520 + i * 140 + "ms");
  const go = () => requestAnimationFrame(() => fh.classList.add("ready"));
  if (v.readyState >= 2) go(); else { v.addEventListener("loadeddata", go, { once: true }); setTimeout(go, 500); }
  const btn = fh.querySelector("[data-fh-pause]");
  btn.onclick = () => { if (v.paused) { v.play(); btn.classList.remove("paused"); btn.setAttribute("aria-label", "Pausar video"); } else { v.pause(); btn.classList.add("paused"); btn.setAttribute("aria-label", "Reproducir video"); } };
  if (reduce) { v.pause(); btn.classList.add("paused"); return; }
  let raf = 0;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const p = Math.min(1, Math.max(0, scrollY / fh.offsetHeight));
      fh.style.setProperty("--py", (p * fh.offsetHeight * .28).toFixed(1) + "px");
      fh.style.setProperty("--cy", (p * -60).toFixed(1) + "px");
      fh.style.setProperty("--co", (1 - p * 1.6).toFixed(3));
      fh.style.setProperty("--dk", (p * .5).toFixed(3));
      if (p > 0) fh.querySelector(".fh-v").style.transition = "none";
    });
  }, { passive: true });
})();
