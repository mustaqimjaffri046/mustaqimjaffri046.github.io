window.PORTFOLIO_CONFIG = {
  storageKey: "portfolioDataOverride",
  defaultTheme: "dark",
  dataPathByDepth: {
    root: "data/projects.json",
    nested: "../data/projects.json"
  },
  pagePathsByDepth: {
    root: {
      index: "index.html",
      project: "project.html",
      edit: "edit.html"
    },
    nested: {
      index: "../index.html",
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
