(function () {
  "use strict";

  function getConfig() {
    return window.PORTFOLIO_CONFIG || {};
  }

  function getStorageKey() {
    return getConfig().storageKey || "portfolioDataOverride";
  }

  function isNestedPage() {
    return document.body.dataset.depth === "nested";
  }

  function getDataPath() {
    const pathMap = getConfig().dataPathByDepth || {};
    return isNestedPage() ? pathMap.nested : pathMap.root;
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeProject(project) {
    return {
      title: project.title || "",
      slug: project.slug || "",
      type: project.type || "",
      description: project.description || "",
      technologies: normalizeArray(project.technologies),
      images: normalizeArray(project.images),
      videos: normalizeArray(project.videos),
      github: project.github || "",
      demo: project.demo || "",
      playStore: project.playStore || "",
      tags: normalizeArray(project.tags),
      projectDetails: project.projectDetails || {},
      features: normalizeArray(project.features),
      screenshots: normalizeArray(project.screenshots)
    };
  }

  function normalizePortfolioData(raw) {
    const source = raw || {};
    return {
      site: source.site || {},
      navigation: normalizeArray(source.navigation),
      sections: normalizeArray(source.sections),
      customSections: normalizeArray(source.customSections),
      services: normalizeArray(source.services),
      achievements: normalizeArray(source.achievements),
      testimonials: normalizeArray(source.testimonials),
      certifications: normalizeArray(source.certifications),
      skillCategories: normalizeArray(source.skillCategories),
      skills: normalizeArray(source.skills),
      experience: normalizeArray(source.experience),
      contact: source.contact || {},
      socialLinks: normalizeArray(source.socialLinks),
      projects: normalizeArray(source.projects).map(normalizeProject)
    };
  }

  function getDefaultPortfolioData() {
    return normalizePortfolioData({
      site: {
        name: "Developer Name",
        title: "Game / VR Developer",
        intro: "Update data/projects.json or use edit.html to customize this portfolio.",
        about: "Portfolio data fallback is being shown because the configured data source could not be loaded.",
        heroCtaText: "View Projects",
        heroCtaTarget: "#projects",
        copyright: "Developer Name"
      },
      navigation: [
        { label: "Home", target: "#home" },
        { label: "Projects", target: "#projects" },
        { label: "Contact", target: "#contact" }
      ],
      sections: [
        { id: "hero", title: "Hero", enabled: true, order: 1 },
        { id: "about", title: "About", enabled: true, order: 2 },
        { id: "services", title: "Services", enabled: true, order: 3 },
        { id: "projects", title: "Projects", enabled: true, order: 4 },
        { id: "skills", title: "Skills", enabled: true, order: 5 },
        { id: "experience", title: "Experience", enabled: true, order: 6 },
        { id: "achievements", title: "Achievements", enabled: true, order: 7 },
        { id: "testimonials", title: "Testimonials", enabled: true, order: 8 },
        { id: "certifications", title: "Certifications", enabled: true, order: 9 },
        { id: "contact", title: "Contact", enabled: true, order: 10 },
        { id: "social", title: "Social", enabled: true, order: 11 }
      ],
      services: [],
      achievements: [],
      testimonials: [],
      certifications: [],
      skillCategories: [],
      projects: [],
      contact: {
        email: "hello@example.com",
        location: "Remote",
        message: "No project data loaded yet."
      }
    });
  }

  function safeParseJson(value) {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }

  async function loadPortfolioData() {
    const storageKey = getStorageKey();
    const localData = localStorage.getItem(storageKey);
    if (localData) {
      const parsedLocal = safeParseJson(localData);
      if (parsedLocal) {
        return normalizePortfolioData(parsedLocal);
      }
      localStorage.removeItem(storageKey);
    }

    const paths = Array.from(
      new Set([getDataPath(), "data/projects.json", "./data/projects.json", "../data/projects.json"].filter(Boolean))
    );

    for (let index = 0; index < paths.length; index += 1) {
      const path = paths[index];
      try {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) {
          continue;
        }
        const parsed = await response.json();
        return normalizePortfolioData(parsed);
      } catch (_error) {
        // Try next path.
      }
    }

    return getDefaultPortfolioData();
  }

  function savePortfolioData(data) {
    localStorage.setItem(getStorageKey(), JSON.stringify(data, null, 2));
  }

  function clearPortfolioOverride() {
    localStorage.removeItem(getStorageKey());
  }

  function getPagePath(pageName) {
    const maps = getConfig().pagePathsByDepth || {};
    const depthKey = isNestedPage() ? "nested" : "root";
    const map = maps[depthKey] || {};
    return map[pageName] || "";
  }

  function getProjectPageHref(slug) {
    if (!slug) {
      return getPagePath("project");
    }
    const baseProject = getPagePath("project");
    return baseProject ? baseProject + "?slug=" + encodeURIComponent(slug) : "#";
  }

  window.PortfolioStore = {
    loadPortfolioData,
    savePortfolioData,
    clearPortfolioOverride,
    normalizePortfolioData,
    getDefaultPortfolioData,
    getPagePath,
    getProjectPageHref
  };
})();
