(function () {
  "use strict";

  // Analytics stays off until an ID is set in config.js → analytics. Loaded on every page
  // (including project, videos and 404, which don't load main.js).
  //   cloudflareBeaconToken — only if Web Analytics was NOT switched on in the Pages dashboard
  //                           (the dashboard injects the same beacon itself; both = double counts)
  //   ga4MeasurementId      — "G-XXXXXXXXXX"
  //   plausibleDomain       — alternative cookieless analytics
  const settings = (window.PORTFOLIO_CONFIG || {}).analytics || {};
  const cfToken = String(settings.cloudflareBeaconToken || "").trim();
  const ga4Id = String(settings.ga4MeasurementId || "").trim();
  const plausibleDomain = String(settings.plausibleDomain || "").trim();

  function addScript(src, attributes) {
    const script = document.createElement("script");
    script.src = src;
    Object.keys(attributes || {}).forEach(function (name) {
      script.setAttribute(name, attributes[name]);
    });
    document.head.appendChild(script);
  }

  if (cfToken) {
    addScript("https://static.cloudflareinsights.com/beacon.min.js", {
      defer: "",
      "data-cf-beacon": JSON.stringify({ token: cfToken })
    });
  }

  // Loads for every visitor (no consent banner), as chosen for this site. GA4 sets cookies;
  // UK/EU visitors would normally need consent first.
  if (/^G-[A-Z0-9]+$/.test(ga4Id)) {
    addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id), { async: "" });
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id);
  }

  if (plausibleDomain) {
    addScript("https://plausible.io/js/script.js", { defer: "", "data-domain": plausibleDomain });
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  function track(name, props) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, props || {});
      }
      if (typeof window.plausible === "function") {
        window.plausible(name, { props: props || {} });
      }
    } catch (_error) {
      // Analytics must never break the page.
    }
  }

  // Clicks: explicit data-track names, plus email, LinkedIn and demo videos anywhere.
  // These are interest signals; only main.js's generate_lead marks a sent inquiry.
  document.addEventListener("click", function (event) {
    const link = event.target.closest("a, button");
    if (!link) {
      return;
    }
    const href = link.getAttribute("href") || "";
    const name = link.dataset.track ||
      (href.startsWith("mailto:") ? "email_click" : "") ||
      (href.includes("linkedin.com") ? "linkedin_click" : "") ||
      (link.hasAttribute("data-play-video") ? "video_play" : "");
    if (name) {
      track(name, { label: (link.dataset.videoTitle || link.textContent || "").trim().slice(0, 60) });
    }
  });

  window.SiteAnalytics = { track: track };
})();
