(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const money2 = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const icon = (name, cls = "") => `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const refreshIcons = () => window.lucide && window.lucide.createIcons();

  const P = window.PRODUCTS;
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const STORE_KEY = "nevership.v1";
  const DEAL_MS = 75000;
  const TRACK_MS = 42000;

  // ---------- state ----------
  const state = Object.assign(
    { cart: [], spent: 0, orders: 0, slip: "NS-" + String(Math.floor(Math.random() * 900000) + 100000), active: null },
    safeLoad()
  );
  function safeLoad() { try { return JSON.parse(window.NeverStore.get(STORE_KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { window.NeverStore.set(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  let currentCat = "all";
  let query = "";
  let sortBy = "featured";

  // ---------- deals (same for everyone, rotate every 75s) ----------
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let deals = {};
  let dealSlot = -1;
  function computeDeals() {
    const slot = Math.floor(Date.now() / DEAL_MS);
    if (slot === dealSlot) return false;
    dealSlot = slot;
    const r = rng(slot * 2654435761);
    const ids = P.map((p) => p.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    deals = {};
    ids.slice(0, 8).forEach((id) => { deals[id] = 40 + Math.floor(r() * 5) * 5; });
    return true;
  }
  const priceOf = (p) => (deals[p.id] ? p.price * (1 - deals[p.id] / 100) : p.price);

  // ---------- render: cards ----------
  function stars(r) { const full = Math.round(r); return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full); }
  function cardHTML(p) {
    const d = deals[p.id];
    return `<button class="card" data-id="${p.id}" aria-label="${esc(p.name)}, ${money(priceOf(p))}">
      <div class="card-media">${d ? `<span class="badge">-${d}%</span>` : p.rating >= 4.9 ? `<span class="badge dark">BESTSELLER</span>` : ""}${icon(p.icon)}</div>
      <div class="card-body">
        <span class="card-brand">${esc(p.brand)}</span>
        <span class="card-name">${esc(p.name)}</span>
        <span class="card-rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span> ${p.rating.toFixed(1)} · ${p.reviews.toLocaleString()} reviews</span>
        <span class="card-price"><span class="price">${money(priceOf(p))}</span>${d ? `<span class="was">${money(p.price)}</span>` : ""}</span>
        <span class="eta">Arrives: never</span>
      </div>
    </button>`;
  }

  function renderCats() {
    $("#cats").innerHTML = window.CATEGORIES.map((c) => `<button class="cat" data-cat="${c.id}" aria-pressed="${c.id === currentCat}">${icon(c.icon)}${esc(c.name)}</button>`).join("");
  }

  function renderGrid() {
    let list = P.filter((p) => (currentCat === "all" || p.cat === currentCat));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name + " " + p.brand + " " + p.blurb + " " + p.cat).toLowerCase().includes(q));
    }
    if (sortBy === "low") list.sort((a, b) => priceOf(a) - priceOf(b));
    if (sortBy === "high") list.sort((a, b) => priceOf(b) - priceOf(a));
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    const html = list.map(cardHTML);
    if (html.length > 12) html.splice(12, 0, `<div class="ad-slot" data-ad="catalog" data-format="fluid"></div>`);
    $("#grid").innerHTML = html.join("");
    $("#empty").hidden = list.length > 0;
    refreshIcons();
    window.NeverAds && window.NeverAds.renderAll($("#grid"));
  }

  function renderDeals(animate) {
    const row = $("#dealRow");
    row.innerHTML = Object.keys(deals).map((id) => cardHTML(byId[id])).join("");
    if (animate) { row.classList.remove("flash"); void row.offsetWidth; row.classList.add("flash"); }
    refreshIcons();
  }

  function tickDeals() {
    const left = DEAL_MS - (Date.now() % DEAL_MS);
    const s = Math.ceil(left / 1000);
    $("#dealTimer").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    if (computeDeals()) { renderDeals(true); renderGrid(); }
  }

  // ---------- stats ----------
  function renderStats() {
    $("#statSpent").textContent = money(state.spent);
    $("#statOrders").textContent = state.orders.toLocaleString();
    $("#slipNo").textContent = "#" + state.slip;
    const count = state.cart.reduce((n, l) => n + l.qty, 0);
    const cc = $("#cartCount");
    if (cc.textContent !== String(count)) { cc.textContent = count; cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump"); }
  }

  // ---------- product modal ----------
  const pm = $("#productModal");
  function openProduct(id) {
    const p = byId[id];
    const d = deals[p.id];
    const opts = p.options.map((o, oi) => `
      <fieldset><legend>${esc(o.name)}</legend><div class="chips">
        ${o.choices.map(([label, add], ci) => `<label class="chip"><input type="radio" name="o${oi}" value="${ci}" ${ci === 0 ? "checked" : ""}/><span>${esc(label)}${add ? `<small>+${money(add)}</small>` : ""}</span></label>`).join("")}
      </div></fieldset>`).join("");
    $("#productForm").innerHTML = `
      <div class="modal-top">
        <div><span class="card-brand">${esc(p.brand)}</span><h2 id="pmTitle">${esc(p.name)}</h2></div>
        <button type="button" class="icon-btn" data-close aria-label="Close">${icon("x")}</button>
      </div>
      <div class="pm-media">${icon(p.icon)}</div>
      <p class="pm-blurb">${esc(p.blurb)}</p>
      ${d ? `<p class="note">Lightning deal: ${d}% off for the next ${$("#dealTimer").textContent}. Act fast. Or don't. It won't arrive either way.</p>` : ""}
      ${opts}
      <fieldset><legend>Protection</legend><div class="chips">
        <label class="chip"><input type="radio" name="care" value="0" checked/><span>No coverage</span></label>
        <label class="chip"><input type="radio" name="care" value="199"/><span>NeverCare+ 3 yr<small>+$199</small></span></label>
      </div></fieldset>
      <div class="pm-foot">
        <div><span class="mono small muted">TOTAL (IMAGINARY)</span><div class="pm-total" id="pmTotal"></div></div>
        <button type="submit" class="btn btn-primary">${icon("shopping-cart")} Add to cart</button>
      </div>`;
    const form = $("#productForm");
    const calc = () => {
      let t = priceOf(p);
      p.options.forEach((o, oi) => { const v = form.querySelector(`input[name=o${oi}]:checked`); t += o.choices[+v.value][1]; });
      t += +form.querySelector("input[name=care]:checked").value;
      $("#pmTotal").textContent = money(t);
      return t;
    };
    form.oninput = calc;
    form.onsubmit = (e) => {
      e.preventDefault();
      const chosen = p.options.map((o, oi) => o.choices[+form.querySelector(`input[name=o${oi}]:checked`).value][0]);
      const care = +form.querySelector("input[name=care]:checked").value;
      if (care) chosen.push("NeverCare+");
      addToCart(p, chosen, calc());
      pm.close();
    };
    form.querySelector("[data-close]").onclick = () => pm.close();
    calc();
    refreshIcons();
    pm.showModal();
  }

  // ---------- cart ----------
  function addToCart(p, opts, unit) {
    const key = p.id + "|" + opts.join("|");
    const ex = state.cart.find((l) => l.key === key);
    if (ex) ex.qty++;
    else state.cart.push({ key, id: p.id, opts, unit: Math.round(unit), list: p.price, qty: 1 });
    save(); renderStats(); renderCart();
    toast(`Added ${p.name}. It's already not on its way.`);
  }
  function totals() {
    const sub = state.cart.reduce((n, l) => n + l.unit * l.qty, 0);
    const savings = state.cart.reduce((n, l) => n + Math.max(0, l.list - l.unit) * l.qty, 0);
    return { sub, savings };
  }
  function renderCart() {
    const body = $("#cartItems"), foot = $("#cartFoot");
    if (!state.cart.length) {
      body.innerHTML = `<div class="cart-empty">${icon("package-open")}<p>Your cart is empty. Much like every box we ship.</p></div>`;
      foot.innerHTML = `<button class="btn btn-dark btn-block" data-shop>Browse the catalog</button>`;
      foot.querySelector("[data-shop]").onclick = () => { closeCart(); location.hash = "#shop"; };
      refreshIcons();
      return;
    }
    body.innerHTML = state.cart.map((l, i) => {
      const p = byId[l.id];
      return `<div class="line-item">
        <div class="li-thumb">${icon(p.icon)}</div>
        <div><div class="li-name">${esc(p.name)}</div><div class="li-opts">${esc(l.opts.join(" · ") || "Standard")}</div></div>
        <div class="li-right"><span class="mono small">${money(l.unit * l.qty)}</span>
          <div class="qty"><button data-dec="${i}" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Increase quantity">+</button></div>
        </div></div>`;
    }).join("");
    const t = totals();
    foot.innerHTML = `
      <div class="totals">
        <div><span>Subtotal</span><span class="mono">${money(t.sub)}</span></div>
        ${t.savings ? `<div class="green"><span>Lightning savings</span><span class="mono">−${money(t.savings)}</span></div>` : ""}
        <div><span>Shipping</span><span class="mono">FREE (theoretically)</span></div>
        <div><span>Tax</span><span class="mono">$0 (imaginary)</span></div>
        <div class="grand"><span>You actually pay</span><span>$0.00</span></div>
      </div>
      <button class="btn btn-primary btn-block" id="toCheckout">Checkout · ${money(t.sub)} of pretend money</button>`;
    $("#toCheckout").onclick = openCheckout;
    refreshIcons();
  }
  function openCart() { renderCart(); $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#scrim").hidden = false; $("#closeCart").focus(); }
  function closeCart() { $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true"); $("#scrim").hidden = true; }

  // ---------- checkout ----------
  const co = $("#checkoutModal");
  function openCheckout() {
    closeCart();
    const t = totals();
    $("#checkoutInner").innerHTML = `
      <div class="modal-top"><h2 id="coTitle">Checkout</h2><button class="icon-btn" data-close aria-label="Close">${icon("x")}</button></div>
      <div class="fake-card" aria-label="Pre-filled demo card. Not a real card.">
        <div class="chip-gold"></div>
        <span class="void">DEMO</span>
        <div class="num">4000 NEVR SHIP 0000</div>
        <div class="row"><span>A. Shopper</span><span>EXP 00/00</span></div>
      </div>
      <div class="ro-fields">
        <div class="ro-field full"><span>Ship to</span><strong>404 Nowhere Lane, Nonexistent, NV 00000</strong></div>
        <div class="ro-field"><span>Card</span><strong>NeverCard demo ••••0000</strong></div>
        <div class="ro-field"><span>Items</span><strong>${state.cart.reduce((n, l) => n + l.qty, 0)}</strong></div>
      </div>
      <fieldset><legend>Delivery speed</legend><div class="chips">
        <label class="chip"><input type="radio" name="spd" value="Standard" checked/><span>Standard · never</span></label>
        <label class="chip"><input type="radio" name="spd" value="Express"/><span>Express · never, but faster</span></label>
        <label class="chip"><input type="radio" name="spd" value="Same-day"/><span>Same-day · not today</span></label>
      </div></fieldset>
      <p class="note">This is a parody. There are no real payment fields and nothing is charged or sent anywhere. Please don't enter real card details anywhere on this site — there's nowhere to put them.</p>
      <div class="totals">
        <div><span>Order total</span><span class="mono">${money(t.sub)}</span></div>
        <div class="grand"><span>Charged to you</span><span>$0.00</span></div>
      </div>
      <button class="btn btn-primary btn-block" id="placeOrder">${icon("lock")} Place order</button>`;
    co.querySelector("[data-close]").onclick = () => co.close();
    $("#placeOrder").onclick = placeOrder;
    refreshIcons();
    co.showModal();
  }
  function placeOrder() {
    const speed = co.querySelector("input[name=spd]:checked").value;
    const t = totals();
    const first = byId[state.cart[0].id];
    const items = state.cart.reduce((n, l) => n + l.qty, 0);
    const msgs = ["Contacting your bank…", "Your bank is laughing…", "Approved for $0.00", "Generating a tracking number that tracks nothing…"];
    $("#checkoutInner").innerHTML = `<div class="processing"><div class="spinner"></div><p class="mono" id="procMsg">${msgs[0]}</p></div>`;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < msgs.length) { $("#procMsg").textContent = msgs[i]; return; }
      clearInterval(iv);
      state.spent += t.sub; state.orders++;
      state.active = {
        no: "1Z" + Math.random().toString(36).slice(2, 10).toUpperCase() + "NVR",
        item: first.name, itemIcon: first.icon, items, total: t.sub, speed,
        driver: Math.floor(Math.random() * window.DRIVERS.length),
        started: Date.now(), called: false
      };
      state.cart = [];
      save(); renderStats(); renderCart(); updateTrackBtn();
      co.close();
      openTracker();
    }, 900);
  }

  // ---------- tracker ----------
  const tm = $("#trackModal");
  let trackTimer = null;
  function openTracker() {
    const o = state.active; if (!o) return;
    const drv = window.DRIVERS[o.driver];
    $("#trackInner").innerHTML = `
      <div class="modal-top">
        <div><span class="track-no">TRACKING ${esc(o.no)} · ${esc(o.speed)}</span><h2 id="trTitle">Your ${esc(o.item)}${o.items > 1 ? ` + ${o.items - 1} more` : ""}</h2></div>
        <button class="icon-btn" data-close aria-label="Close tracker">${icon("x")}</button>
      </div>
      <p class="eta-line" id="etaLine"></p>
      <div class="route" aria-hidden="true"><span class="wh">${icon("warehouse")}</span><span class="van" id="van">${icon(drv.avatar)}</span><span class="home">${icon("house")}</span></div>
      <p class="small muted">Driver: <strong>${esc(drv.name)}</strong>, riding ${esc(drv.vehicle)}.</p>
      <ol class="steps" id="steps">${window.TRACK_STEPS.map((s) => `<li><span class="dot">${icon("check")}</span><div><strong>${esc(s.t)}</strong><p>${esc(s.d)}</p></div></li>`).join("")}</ol>
      <div class="ad-slot" data-ad="tracker" data-format="horizontal"></div>
      <button class="btn btn-ghost btn-block" id="skipAhead">I'm impatient — skip ahead</button>`;
    tm.querySelector("[data-close]").onclick = () => tm.close();
    $("#skipAhead").onclick = () => { state.active.started = Date.now() - TRACK_MS + 2500; save(); updateTracker(); };
    refreshIcons();
    window.NeverAds && window.NeverAds.renderAll($("#trackInner"));
    if (!tm.open) tm.showModal();
    updateTracker();
    clearInterval(trackTimer);
    trackTimer = setInterval(updateTracker, 500);
  }
  function progress() { return state.active ? Math.min(1, (Date.now() - state.active.started) / TRACK_MS) : 0; }
  function updateTracker() {
    const o = state.active; if (!o) return;
    const pr = progress();
    const n = window.TRACK_STEPS.length;
    const idx = Math.min(n - 1, Math.floor(pr * (n - 1) + 0.0001));
    const steps = $$("#steps li");
    steps.forEach((li, i) => { li.classList.toggle("done", i < idx || (pr >= 1 && i === idx)); li.classList.toggle("now", i === idx && pr < 1); });
    const van = $("#van");
    if (van) van.style.left = `calc(72px + (100% - 144px) * ${pr})`;
    const left = Math.max(0, Math.ceil((TRACK_MS - (Date.now() - o.started)) / 1000));
    const eta = $("#etaLine");
    if (eta) eta.innerHTML = pr < 1 ? `Estimated arrival in <b>${left}s</b> (estimate is a lie)` : `Status: <b>Delivered</b> · please check your front door`;
    if (pr >= 1 && !o.called) {
      o.called = true; save();
      clearInterval(trackTimer);
      setTimeout(() => { if (tm.open) tm.close(); incomingCall(); }, 1600);
    }
  }
  function updateTrackBtn() {
    let b = $("#trackBtn");
    const show = state.active && !state.active.called;
    if (show && !b) {
      b = document.createElement("button");
      b.id = "trackBtn"; b.className = "cart-btn"; b.style.background = "var(--accent)";
      b.innerHTML = `${icon("truck")}<span>Track</span>`;
      b.onclick = openTracker;
      $(".header-row").insertBefore(b, $("#cartBtn"));
      refreshIcons();
    } else if (!show && b) b.remove();
  }

  // ---------- the call ----------
  const call = $("#call");
  let callTimer = null;
  function lines(o, drv) {
    return [
      `Hey, it's ${drv.name} from NeverShips. I'm outside with your ${o.item}.`,
      `Well, outside of somewhere. I'm on ${drv.vehicle}.`,
      `I've knocked on every door on your street. I'm not sure your street exists.`,
      `Okay. I'm going to be honest with you. I checked the back. There was never a ${o.item}.`,
      `There was never a warehouse. I'm not sure there was ever a me.`,
      `But hey, you paid nothing, so honestly? Great deal. Five stars?`
    ];
  }
  function speak(text, rate = 1.02) {
    return new Promise((res) => {
      const fallback = setTimeout(res, Math.max(2200, text.length * 62));
      try {
        if (!("speechSynthesis" in window)) return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = rate; u.pitch = 0.95;
        u.onend = () => { clearTimeout(fallback); setTimeout(res, 250); };
        u.onerror = () => {};
        speechSynthesis.speak(u);
      } catch (e) {}
    });
  }
  function incomingCall() {
    const o = state.active; const drv = window.DRIVERS[o.driver];
    call.classList.remove("connected");
    call.innerHTML = `
      <div class="call-top">
        <span class="call-label">Incoming call · NeverShips Delivery</span>
        <div class="call-avatar">${icon(drv.avatar)}</div>
        <h2 id="callName">${esc(drv.name)}</h2>
        <span class="call-sub">Your driver · re: ${esc(o.item)}</span>
      </div>
      <p class="call-transcript" id="transcript" aria-live="polite"></p>
      <div class="call-actions">
        <button class="call-btn decline" id="decline"><span class="circle">${icon("phone-off")}</span>Decline</button>
        <button class="call-btn accept" id="accept"><span class="circle">${icon("phone")}</span>Accept</button>
      </div>`;
    call.hidden = false;
    refreshIcons();
    if (navigator.vibrate) try { navigator.vibrate([400, 200, 400]); } catch (e) {}
    $("#accept").focus();
    $("#accept").onclick = () => connect(o, drv);
    $("#decline").onclick = () => voicemail(o, drv);
  }
  async function connect(o, drv) {
    call.classList.add("connected");
    const t0 = Date.now();
    $(".call-label").textContent = "Connected";
    $(".call-sub").innerHTML = `<span class="call-timer" id="callTime">00:00</span>`;
    callTimer = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); const el = $("#callTime"); if (el) el.textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }, 500);
    $(".call-actions").innerHTML = `<button class="call-btn decline" id="hang"><span class="circle">${icon("phone-off")}</span>Hang up</button>`;
    refreshIcons();
    let hung = false;
    $("#hang").onclick = () => { hung = true; endCall(o, drv, true); };
    for (const line of lines(o, drv)) {
      if (hung) return;
      $("#transcript").textContent = "“" + line + "”";
      await speak(line);
    }
    if (!hung) endCall(o, drv, false);
  }
  function voicemail(o, drv) {
    $(".call-label").textContent = "Missed call · new voicemail";
    $(".call-avatar").style.animation = "none";
    $("#transcript").textContent = "“" + lines(o, drv).slice(3).join(" ") + "”";
    $(".call-actions").innerHTML = `<button class="btn btn-primary" id="doneVm">Okay. Fair.</button>`;
    $("#doneVm").onclick = () => endCall(o, drv, false);
  }
  function endCall(o, drv, early) {
    clearInterval(callTimer);
    try { speechSynthesis.cancel(); } catch (e) {}
    call.innerHTML = `
      <div class="call-top">
        <span class="call-label">Call ended</span>
        <div class="call-avatar" style="animation:none;background:#3b382f">${icon("package-x")}</div>
        <h2 id="callName">Order "delivered"</h2>
        <span class="call-sub">${early ? "You hung up on him. Understandable." : `${esc(drv.name)} would like a rating.`}</span>
      </div>
      <p class="call-transcript">You spent <strong>${money(o.total)}</strong> of pretend money and received exactly nothing. Lifetime imaginary spend: <strong>${money(state.spent)}</strong>.</p>
      <div class="call-actions" style="gap:12px;flex-wrap:wrap;justify-content:center">
        <button class="btn btn-primary" id="again">Shop again</button>
        <button class="btn btn-ghost" style="color:#f3efe6;border-color:#f3efe6" id="share">Copy share text</button>
      </div>`;
    refreshIcons();
    state.active = null; save(); updateTrackBtn();
    $("#again").onclick = () => { call.hidden = true; location.hash = "#deals"; };
    $("#share").onclick = async () => {
      const txt = `I just spent ${money(o.total)} on a ${o.item} at NeverShips and it never came. ${location.origin}${location.pathname}`;
      try { await navigator.clipboard.writeText(txt); toast("Copied. Spread the disappointment."); } catch (e) { toast(txt); }
    };
  }

  // ---------- toast ----------
  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); }

  // ---------- events ----------
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) return openProduct(card.dataset.id);
    const cat = e.target.closest(".cat");
    if (cat) { currentCat = cat.dataset.cat; renderCats(); renderGrid(); refreshIcons(); return; }
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]");
    if (inc) { state.cart[+inc.dataset.inc].qty++; save(); renderCart(); renderStats(); }
    if (dec) { const l = state.cart[+dec.dataset.dec]; l.qty--; if (l.qty <= 0) state.cart.splice(+dec.dataset.dec, 1); save(); renderCart(); renderStats(); }
  });
  $("#cartBtn").onclick = openCart;
  $("#closeCart").onclick = closeCart;
  $("#scrim").onclick = closeCart;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#drawer").classList.contains("open")) closeCart(); });
  $("#search").addEventListener("input", (e) => { query = e.target.value.trim(); renderGrid(); if (query) $("#shop").scrollIntoView({ behavior: "smooth", block: "start" }); });
  $("#sort").addEventListener("change", (e) => { sortBy = e.target.value; renderGrid(); });
  $("#resetStats").onclick = (e) => { e.preventDefault(); state.spent = 0; state.orders = 0; state.cart = []; state.active = null; save(); renderStats(); renderCart(); updateTrackBtn(); toast("Stats reset. Your shame has been cleared."); };
  [pm, co, tm].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  tm.addEventListener("close", () => { if (!state.active || state.active.called) clearInterval(trackTimer); });

  // ---------- init ----------
  computeDeals();
  renderCats(); renderDeals(false); renderGrid(); renderStats(); renderCart(); updateTrackBtn();
  setInterval(tickDeals, 1000); tickDeals();
  // keep the tracker running in the background so the call still happens if the modal is closed
  setInterval(() => { if (state.active && !state.active.called && !tm.open) updateTracker(); }, 1000);
  refreshIcons();
})();
