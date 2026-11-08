// Saves cart and stats in a small first-party cookie so they persist between visits.
// Falls back to memory where cookies are unavailable (e.g. sandboxed previews).
(function () {
  const mem = {};
  const secure = location.protocol === "https:";
  const name = (k) => (secure ? "__Host-" : "") + k.replace(/[^a-z0-9]/gi, "_");
  function get(k) {
    try {
      const n = name(k) + "=";
      const hit = document.cookie.split("; ").find((c) => c.indexOf(n) === 0);
      if (hit) return decodeURIComponent(hit.slice(n.length));
    } catch (e) {}
    return k in mem ? mem[k] : null;
  }
  function set(k, v) {
    mem[k] = v;
    try {
      let val = encodeURIComponent(v);
      if (val.length > 3800) {
        // too big for one cookie: keep stats, drop the cart
        const o = JSON.parse(v); o.cart = []; val = encodeURIComponent(JSON.stringify(o));
      }
      document.cookie = name(k) + "=" + val + "; Path=/; Max-Age=31536000; SameSite=Lax" + (secure ? "; Secure" : "");
    } catch (e) {}
  }
  window.NeverStore = { get, set };
})();
