window.PORTFOLIO_CONFIG = {
  storageKey: "portfolioDataOverride",
  // Fill in ONE of these to turn on analytics; both empty = no tracking script loads.
  // Plausible is cookieless (no consent banner needed for EU visitors); GA4 uses cookies.
  analytics: {
    plausibleDomain: "",
    ga4MeasurementId: ""
  },
  defaultTheme: "dark",
  dataPathByDepth: {
    root: "data/projects.json",
    nested: "../data/projects.json"
  },
  pagePathsByDepth: {
    root: {
      index: "./",
      portfolio: "portfolio.html",
      project: "project.html",
      edit: "edit.html"
    },
    nested: {
      index: "../",
      portfolio: "../portfolio.html",
      project: "../project.html",
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
