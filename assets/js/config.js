window.PORTFOLIO_CONFIG = {
  storageKey: "portfolioDataOverride",
  // Analytics is off until real IDs are filled in (see assets/js/analytics.js).
  // cloudflareBeaconToken: leave empty if Web Analytics is enabled in the Pages dashboard.
  // ga4MeasurementId: your GA4 web stream ID, "G-XXXXXXXXXX".
  analytics: {
    cloudflareBeaconToken: "",
    ga4MeasurementId: "",
    plausibleDomain: ""
  },
  defaultTheme: "dark",
  dataPathByDepth: {
    root: "data/projects.json",
    nested: "../data/projects.json"
  },
  // Cloudflare Pages serves pages without the .html extension (it redirects /x.html to /x).
  pagePathsByDepth: {
    root: {
      index: "./",
      portfolio: "portfolio",
      project: "project",
      edit: "edit.html"
    },
    nested: {
      index: "../",
      portfolio: "../portfolio",
      project: "../project",
      edit: "../edit.html"
    }
  },
  design: {
    colors: {
      accent: "#00E5FF",
      accentAlt: "#7B61FF",
      accentTertiary: "#00FFA3",
      bgDark: "#050510",
      surfaceDark: "#0f1228",
      textDark: "#eaf7ff",
      bgLight: "#f8fafc",
      surfaceLight: "#ffffff",
      textLight: "#0f172a"
    },
    fonts: {
      body: "Inter, Segoe UI, Arial, sans-serif",
      heading: "Sora, Segoe UI, Arial, sans-serif"
    },
    layout: {
      containerWidth: "1120px",
      cardRadius: "14px"
    }
  }
};
