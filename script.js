/* ==========================================================
   SESCO website – script.js
   1) EDIT THE SETTINGS BELOW FIRST. Everything on the page that
      says "REPLACE" or "XXXX" is read from here.
   2) No backend is needed. Payments happen in the donor's UPI / bank app;
      confirmations and volunteer messages open WhatsApp with a ready message.
   ========================================================== */

const SESCO = {
  shortName: "SESCO",
  foundedYear: 1980,

  // Instagram handle without the @  (please check spelling: seaco.nsp or sesco.nsp?)
  instagram: "seaco.nsp",

  // WhatsApp number with country code, digits only. Example: "919820012345"
  whatsapp: "919323221103",
  phoneDisplay: "+91 88502 49811",
  email: "sesco.nsp1@gmail.com",
  address: "SESCO office, Shop No.2,Pearl Paza, Gass Road Near Hanuman Mandir Nallasopara (West), Palghar district, Maharashtra.",
  hours: "Mon–Sat, 10 am to 5 pm",
  mapsQuery: "SESCO Sudhar Educational Social and Cultural Organisation Nallasopara West",

  // ---- Payments ----
  upiId: "sesco.nsp1@okicici",
  payeeName: "SESCO TRUST",
  gpayNumber: "8850249811",
  // The office signage also shows "A/c BCC-27587" — that looks like a partial
  // reference, not a full account number/IFSC, so bank transfer rows below
  // are left for the office to fill in with complete, verified details.
  bank: [
    ["Account name", "REPLACE — e.g. SESCO Trust"],
    ["Bank & branch", "REPLACE"],
    ["Account number", "REPLACE"],
    ["IFSC", "REPLACE"],
  ],

  // Shown under the donation card. Leave "" to hide. Only write this if it is true.
  // Example: "Donations are eligible for tax exemption under Section 80G. Registration No. ..."
  taxNote: "",

  // What a gift could go towards (edit to match real costs)
  impact: {
    500: "Could go towards notebooks and stationery for students.",
    1000: "Could help cover learning materials for a student for a term.",
    2500: "Could support a health or awareness camp for the neighbourhood.",
    5000: "Could help run a community or cultural programme.",
    other: "Every amount is put to use, and you will get a receipt.",
  },
};

/* ---------- Programmes (edit titles and text to match SESCO's real work) ---------- */
const PROGRAMS = [
  {
    key: "Education",
    title: "Education",
    text: "Helping children and young people stay in school and learn well, with books, stationery and guidance.",
    icon: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5c-.8 0-1.5-.7-1.5-1.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
  },
  {
    key: "Health & care",
    title: "Health & care",
    text: "Awareness drives and camps that bring basic health information and help closer to families.",
    icon: '<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>',
  },
  {
    key: "Community welfare",
    title: "Community welfare",
    text: "Standing with families in need, and bringing neighbours together to solve local problems.",
    icon: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.4-3.2 2.6-5 5.5-5s5.1 1.8 5.5 5"/><path d="M15.5 14.3c2.6-.4 4.6 1 5 4.2"/>',
  },
  {
    key: "Cultural programmes",
    title: "Culture",
    text: "Festivals, competitions and gatherings that keep our traditions and our talents alive.",
    icon: '<path d="M4 13h16c0 3.3-3.6 6-8 6s-8-2.7-8-6z"/><path d="M12 3.5c1.8 2.2 2.6 3.7 0 5.6-2.6-1.9-1.8-3.4 0-5.6z"/>',
  },
];

/* ---------- Gallery ----------
   Put photos in the folder assets/photos/ and list them here.
   If a file is missing, a neat placeholder tile is shown instead. */
const GALLERY = [
  { src: "assets/photos/01.jpg", caption: "Sewing machine distribution — \u201cApni Silai, Apna Sahara\u201d" },
  { src: "assets/photos/02.jpg", caption: "Sewing machine distribution — with the SESCO team" },
  { src: "assets/photos/03.jpg", caption: "Ration kit distribution drive" },
  { src: "assets/photos/04.jpg", caption: "Free medical checkup & health camp" },
  { src: "assets/photos/05.jpg", caption: "Free eye checkup & spectacles camp" },
  { src: "assets/photos/06.jpg", caption: "Felicitation & recognition" },
];

/* ========================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isPlaceholder = (v) => !v || /REPLACE|XXXX|example\.org/i.test(v);
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), 3600);
}

/* ---------- WhatsApp helper ---------- */
function openWhatsApp(text) {
  if (isPlaceholder(SESCO.whatsapp)) {
    toast("Add the trust's WhatsApp number in script.js to enable this button.");
    return;
  }
  window.open(`https://wa.me/${SESCO.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}

/* ---------- Fill settings into the page ---------- */
function applySettings() {
  const igUrl = `https://www.instagram.com/${SESCO.instagram}/`;
  $$("[data-ig-link]").forEach((a) => (a.href = igUrl));
  $$("[data-ig-handle]").forEach((s) => (s.textContent = SESCO.instagram));

  $$("[data-cfg]").forEach((el) => (el.textContent = SESCO[el.dataset.cfg] ?? ""));
  const tel = $("[data-cfg-tel]");
  if (tel && !isPlaceholder(SESCO.phoneDisplay)) tel.href = "tel:" + SESCO.phoneDisplay.replace(/[^\d+]/g, "");
  const mail = $("[data-cfg-mail]");
  if (mail && !isPlaceholder(SESCO.email)) mail.href = "mailto:" + SESCO.email;

  $("#mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SESCO.mapsQuery);

  const years = new Date().getFullYear() - SESCO.foundedYear;
  $$("[data-years]").forEach((el) => (el.textContent = years));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  if (SESCO.taxNote) {
    $("#taxNote").textContent = SESCO.taxNote;
    $("#faqTax").textContent = SESCO.taxNote;
  }
}

/* ---------- Header + mobile nav ---------- */
function initHeader() {
  const header = $("#siteHeader");
  const toggle = $("#navToggle");
  const nav = $("#nav");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

/* ---------- Programmes ---------- */
function renderPrograms() {
  $("#programs").innerHTML = PROGRAMS.map(
    (p) => `
    <li class="program">
      <div class="program__icon" aria-hidden="true"><svg viewBox="0 0 24 24">${p.icon}</svg></div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        <button type="button" class="linklike" data-give="${p.key}">Give to ${p.title.toLowerCase()}</button>
      </div>
    </li>`
  ).join("");

  $("#programs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-give]");
    if (!b) return;
    $("#purpose").value = b.dataset.give;
    $("#donate").scrollIntoView({ behavior: "smooth" });
    toast(`Your gift will go to: ${b.dataset.give}`);
  });
}

/* ---------- Gallery + lightbox ---------- */
function renderGallery() {
  const grid = $("#mosaic");
  const lb = $("#lightbox");

  GALLERY.forEach((g) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", `View photo: ${g.caption}`);

    const img = new Image();
    img.alt = g.caption;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      tile.className = "tile tile--empty";
      tile.disabled = true;
      tile.setAttribute("aria-label", g.caption);
      tile.innerHTML = `<img src="assets/logo-emblem.png" alt=""><span class="tile__cap">${g.caption}<small>Photo coming soon</small></span>`;
    };
    img.src = g.src;
    tile.appendChild(img);

    const cap = document.createElement("span");
    cap.className = "tile__cap";
    cap.textContent = g.caption;
    tile.appendChild(cap);

    tile.addEventListener("click", () => {
      if (tile.disabled) return;
      $("#lbImg").src = g.src;
      $("#lbImg").alt = g.caption;
      $("#lbCap").textContent = g.caption;
      lb.showModal();
    });
    grid.appendChild(tile);
  });

  $("#lbClose").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
}

/* ---------- Donation card ---------- */
const state = { freq: "once", amount: 1000 };
let qr = null;

function currentAmount() {
  const custom = parseInt($("#customAmount").value, 10);
  return Number.isFinite(custom) && custom > 0 ? custom : state.amount;
}

function upiLink(amount) {
  const note = `Donation ${$("#purpose").value}${state.freq === "monthly" ? " (monthly)" : ""}`;
  const p = new URLSearchParams({
    pa: SESCO.upiId,
    pn: SESCO.payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return "upi://pay?" + p.toString();
}

function updateDonation() {
  const amount = currentAmount();
  $("#upiAmount").textContent = inr(amount);
  $("#impact").textContent = SESCO.impact[amount] || SESCO.impact.other;

  const link = upiLink(amount);
  $("#upiPay").href = link;
  $("#upiIdText").textContent = SESCO.upiId;
  $("#gpayText").textContent = isPlaceholder(SESCO.gpayNumber) ? "–" : SESCO.gpayNumber;

  const qrBox = $("#qr");
  if (window.QRCode) {
    if (!qr) {
      qr = new QRCode(qrBox, { text: link, width: 150, height: 150, colorDark: "#12224f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    } else {
      qr.clear();
      qr.makeCode(link);
    }
    const qrWrap = $(".upi__qr");
    qrWrap.classList.remove("is-ready");
    void qrWrap.offsetWidth; // restart the pulse animation
    qrWrap.classList.add("is-ready");
  } else {
    qrBox.textContent = "QR unavailable offline";
  }

  const notice = $("#upiNotice");
  const badge = $("#verifiedBadge");
  if (isPlaceholder(SESCO.upiId)) {
    notice.hidden = false;
    notice.textContent = "Setup needed: this QR uses a sample UPI ID. Replace upiId in script.js with the trust's real UPI ID before publishing.";
    badge.hidden = true;
  } else {
    notice.hidden = true;
    badge.hidden = false;
  }

  const monthly = state.freq === "monthly";
  $$(".monthly-only").forEach((el) => (el.hidden = !monthly));
}

function initDonation() {
  $$('input[name="freq"]').forEach((r) =>
    r.addEventListener("change", () => { state.freq = r.value; updateDonation(); })
  );
  $$('input[name="amount"]').forEach((r) =>
    r.addEventListener("change", () => {
      state.amount = parseInt(r.value, 10);
      $("#customAmount").value = "";
      updateDonation();
    })
  );
  $("#customAmount").addEventListener("input", () => {
    if ($("#customAmount").value) $$('input[name="amount"]').forEach((r) => (r.checked = false));
    else $$('input[name="amount"]').forEach((r) => (r.checked = parseInt(r.value, 10) === state.amount));
    updateDonation();
  });
  $("#purpose").addEventListener("change", updateDonation);

  /* Payment tabs */
  const tabs = $$('.tabs [role="tab"]');
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  /* Bank rows */
  $("#bankRows").innerHTML = SESCO.bank
    .map(([k, v], i) => `<tr><th scope="row">${k}</th><td id="bk${i}">${v}</td><td><button type="button" class="copy" data-copy-target="bk${i}">Copy</button></td></tr>`)
    .join("");

  /* Copy buttons */
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy-target]");
    if (!b) return;
    const text = $("#" + b.dataset.copyTarget).textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast("Copied: " + text);
  });

  /* UPI button on desktop: explain instead of failing silently */
  $("#upiPay").addEventListener("click", (e) => {
    if (isPlaceholder(SESCO.upiId)) {
      e.preventDefault();
      toast("Add the trust's real UPI ID in script.js first.");
      return;
    }
    if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      e.preventDefault();
      toast("Open this page on your phone, or scan the QR code with any UPI app.");
    }
  });

  /* WhatsApp confirmation and reminder */
  $("#confirmWa").addEventListener("click", () => {
    const name = $("#donorName").value.trim();
    const amt = inr(currentAmount());
    const freq = state.freq === "monthly" ? " (monthly)" : "";
    openWhatsApp(
      `Hello SESCO, I have donated ${amt}${freq} for "${$("#purpose").value}".` +
        (name ? ` My name is ${name}.` : "") +
        " Please share a receipt. (Payment screenshot attached.)"
    );
  });
  $("#remindWa").addEventListener("click", () => {
    const name = $("#donorName").value.trim();
    openWhatsApp(
      `Hello SESCO, I would like to give ${inr(currentAmount())} every month for "${$("#purpose").value}".` +
        (name ? ` My name is ${name}.` : "") +
        " Please remind me each month."
    );
  });

  /* "More ways to give" buttons */
  $$("[data-action]").forEach((b) =>
    b.addEventListener("click", () => {
      const a = b.dataset.action;
      if (a === "monthly") {
        $("#freqMonthly").checked = true;
        state.freq = "monthly";
        updateDonation();
        $("#giveCard").scrollIntoView({ behavior: "smooth", block: "center" });
        toast("Monthly giving selected. Choose an amount below.");
      } else if (a === "wa") {
        openWhatsApp(b.dataset.msg);
      } else if (a === "share") {
        const text = "SESCO has been serving Nallasopara since 1980 in education, welfare and culture. See their work and give here:";
        const url = location.href.split("#")[0];
        if (navigator.share) {
          navigator.share({ title: "SESCO – A Trust Since 1980", text, url }).catch(() => {});
        } else {
          window.open("https://wa.me/?text=" + encodeURIComponent(text + " " + url), "_blank", "noopener");
        }
      }
    })
  );

  updateDonation();
  window.addEventListener("load", updateDonation); // QR library loads with defer
}

/* ---------- Volunteer form ---------- */
function initVolunteer() {
  const form = $("#volForm");
  const err = $("#volErr");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#vName");
    const phone = $("#vPhone");
    [name, phone].forEach((f) => f.removeAttribute("aria-invalid"));
    const digits = phone.value.replace(/\D/g, "");
    const problems = [];
    if (name.value.trim().length < 2) { problems.push("your name"); name.setAttribute("aria-invalid", "true"); }
    if (digits.length < 10) { problems.push("a 10-digit phone number"); phone.setAttribute("aria-invalid", "true"); }
    if (problems.length) {
      err.hidden = false;
      err.textContent = "Please add " + problems.join(" and ") + ".";
      (name.getAttribute("aria-invalid") ? name : phone).focus();
      return;
    }
    err.hidden = true;
    const note = $("#vNote").value.trim();
    openWhatsApp(
      `Hello SESCO, I would like to volunteer.\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}\nInterest: ${$("#vArea").value}` +
        (note ? `\nNote: ${note}` : "")
    );
  });
}

/* ---------- Count-up stats ---------- */
function initStats() {
  $$("[data-count-years]").forEach((el) => (el.dataset.count = new Date().getFullYear() - SESCO.foundedYear));
  const nums = $$(".stat__num");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const plain = el.dataset.format === "plain"; // show as-is, e.g. a year, no thousands grouping tricks
    if (reduced) {
      el.textContent = (plain ? target : target.toLocaleString("en-IN")) + suffix;
      return;
    }
    const dur = 1100;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = (plain ? val : val.toLocaleString("en-IN")) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((el) => io.observe(el));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const targets = $$(
    ".section__head, .about__grid > *, .office, .programs, .mosaic, .give-card, .ways, .assure > *, .involved__grid > *, .contact__grid > *"
  );
  targets.forEach((el) => el.classList.add("reveal"));
  const groups = $$(".programs, .ways__list, .ticks");
  groups.forEach((el) => el.classList.add("reveal-stagger"));

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal, .reveal-stagger").forEach((el) => io.observe(el));
}

/* ---------- Sticky mobile donate bar ---------- */
function initStickyGive() {
  const bar = $("#stickyGive");
  const donateSection = $("#donate");
  const hero = $("#top");
  if (!bar) return;
  const io = new IntersectionObserver(
    (entries) => {
      const heroGone = entries.find((e) => e.target === hero)?.isIntersecting === false;
      const onDonate = entries.find((e) => e.target === donateSection)?.isIntersecting;
      bar.classList.toggle("is-on", window.innerWidth <= 720 && heroGone && !onDonate);
    },
    { threshold: 0.01 }
  );
  io.observe(hero);
  io.observe(donateSection);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) bar.classList.remove("is-on");
  });
}

/* ---------- Hero seal tilt (desktop, mouse-driven) ---------- */
function initHeroTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const stage = $(".hero__seal");
  const seal = $(".seal");
  if (!stage || !seal || window.matchMedia("(pointer: coarse)").matches) return;
  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    seal.style.setProperty("--tx", (px * 14).toFixed(2) + "deg");
    seal.style.setProperty("--ty", (-py * 14).toFixed(2) + "deg");
  });
  stage.addEventListener("mouseleave", () => {
    seal.style.setProperty("--tx", "0deg");
    seal.style.setProperty("--ty", "0deg");
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applySettings();
  initHeader();
  renderPrograms();
  renderGallery();
  initDonation();
  initVolunteer();
  initStats();
  initReveal();
  initStickyGive();
  initHeroTilt();
});