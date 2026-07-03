/* Western Gateway Outfitters — concept site by Aoraki Creations */
(function () {
  "use strict";

  /* ---------- year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var backdrop = document.querySelector(".nav-backdrop");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }
  function closeNav() { setNav(false); }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeNav);
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeNav(); closeLightbox(); }
  });

  /* ---------- scrolled header ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- reveal on scroll ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function showEl(el) { el.classList.add("in"); }
  var ticking = false;
  function revealInView() {
    ticking = false;
    var h = window.innerHeight || document.documentElement.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) { showEl(el); reveals.splice(i, 1); }
    }
  }
  function onRevealScroll() {
    if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(revealInView); }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) showEl(en.target); });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }
  window.addEventListener("scroll", onRevealScroll, { passive: true });
  window.addEventListener("resize", onRevealScroll, { passive: true });
  window.addEventListener("load", revealInView);
  revealInView();
  setTimeout(function () { reveals.forEach(showEl); reveals = []; }, 2600);

  /* ---------- gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".gallery-filter button");
  var figures = [].slice.call(document.querySelectorAll(".gallery figure"));
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      figures.forEach(function (fig) {
        var show = f === "all" || fig.getAttribute("data-cat") === f;
        fig.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  var lbImg = lb ? lb.querySelector("img") : null;
  var lbCap = lb ? lb.querySelector(".lightbox__cap") : null;
  var lbClose = lb ? lb.querySelector(".lightbox__x") : null;
  var current = -1;
  var opener = null;
  function visibleFigures() { return figures.filter(function (f) { return !f.classList.contains("is-hidden"); }); }
  function openLightbox(fig) {
    if (!lb) return;
    opener = fig;
    var vis = visibleFigures();
    current = vis.indexOf(fig);
    showCurrent(vis);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }
  function showCurrent(vis) {
    vis = vis || visibleFigures();
    if (current < 0 || current >= vis.length) return;
    var fig = vis[current];
    var img = fig.querySelector("img");
    var full = img.getAttribute("data-full") || img.getAttribute("src");
    lbImg.setAttribute("src", full);
    lbImg.setAttribute("alt", img.getAttribute("alt") || "");
    var cap = fig.querySelector("figcaption");
    if (lbCap) lbCap.textContent = cap ? cap.textContent : "";
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains("open")) return;
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (opener && opener.focus) opener.focus();
    opener = null;
  }
  function step(dir) {
    var vis = visibleFigures();
    if (!vis.length) return;
    current = (current + dir + vis.length) % vis.length;
    showCurrent(vis);
  }
  figures.forEach(function (fig) {
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    fig.addEventListener("click", function () { openLightbox(fig); });
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        openLightbox(fig);
      }
    });
  });
  if (lb) {
    lbClose.addEventListener("click", closeLightbox);
    lb.querySelector(".lightbox__nav.prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.querySelector(".lightbox__nav.next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- demo badge dismiss ---------- */
  var badgeX = document.querySelector(".demo-badge__x");
  if (badgeX) badgeX.addEventListener("click", function () {
    var b = document.querySelector(".demo-badge");
    if (b) b.style.display = "none";
  });

  /* ---------- inquiry form (concept demo, no backend) ---------- */
  var form = document.querySelector("#inquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      if (msg) {
        msg.textContent = "Thanks — this is a concept demo, so nothing was actually sent. On the live site this would reach Russ at Western Gateway. For now, please call or text 605-639-1589 to check dates.";
        msg.classList.add("show");
        msg.setAttribute("tabindex", "-1");
        if (msg.focus) msg.focus();
      }
      form.querySelectorAll("input,textarea,select").forEach(function (el) {
        if (el.type !== "submit") el.value = "";
      });
    });
  }
})();
