// Ad loader. Reads window.NEVERSHIPS_CONFIG (config.js).
// With no publisher ID it renders labeled placeholders so you can see where ads go.
(function () {
  const cfg = window.NEVERSHIPS_CONFIG || {};
  const client = (cfg.adsenseClient || "").trim();
  const slots = cfg.slots || {};
  let scriptAdded = false;

  function addScript() {
    if (scriptAdded || !client) return;
    scriptAdded = true;
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    document.head.appendChild(s);
  }

  function render(el) {
    if (!el || el.dataset.rendered) return;
    el.dataset.rendered = "1";
    const key = el.dataset.ad;
    const slotId = (slots[key] || "").trim();

    if (client && slotId) {
      addScript();
      const ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", client);
      ins.setAttribute("data-ad-slot", slotId);
      ins.setAttribute("data-ad-format", el.dataset.format || "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      el.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ad blocked */ }
      return;
    }

    if (client) {
      // Publisher ID set but no unit for this slot: Google Auto ads can still place ads.
      addScript();
      el.remove();
      return;
    }

    // No ad network configured: hide the slot for visitors. Placeholders show only
    // on localhost or with ?showads=1 so you can check the layout.
    const showPh = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]showads=1/.test(location.search);
    if (!showPh) { el.remove(); return; }
    const ph = document.createElement("div");
    ph.className = "ad-placeholder";
    ph.textContent = "Ad space · \"" + key + "\" · add your AdSense IDs in config.js";
    el.appendChild(ph);
  }

  function renderAll(root) {
    (root || document).querySelectorAll(".ad-slot").forEach(render);
  }

  window.NeverAds = { render, renderAll };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderAll());
  } else {
    renderAll();
  }
})();
