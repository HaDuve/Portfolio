(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("theme");
  if (stored === "dark") {
    root.setAttribute("data-theme", "dark");
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      if (!current) next = "dark";
      if (next === "light") {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  });

  var menuBtn = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var wasOpen = item.classList.contains("open");
      item.closest(".faq-list").querySelectorAll(".faq-item").forEach(function (el) {
        el.classList.remove("open");
        el.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  var siteHeader = document.querySelector("[data-site-header]");
  if (siteHeader) {
    var onScroll = function () {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var reveals = document.querySelectorAll(".reveal");
    if (reveals.length && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("visible"); });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();
