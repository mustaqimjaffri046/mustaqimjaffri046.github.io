(function () {
  "use strict";

  const state = {
    data: null,
    currentTag: "All",
    mode: "dark",
    projectFilterBound: false
  };

  function applyDesignTokens() {
    const config = window.PORTFOLIO_CONFIG || {};
    const design = config.design || {};
    const root = document.documentElement;
    const colors = design.colors || {};
    const fonts = design.fonts || {};
    const layout = design.layout || {};

    root.style.setProperty("--accent", colors.accent || "#20c997");
    root.style.setProperty("--accent-alt", colors.accentAlt || "#7c5cff");
    root.style.setProperty("--accent-xr", colors.accentTertiary || "#00FFA3");
    root.style.setProperty("--bg-dark", colors.bgDark || "#0d1117");
    root.style.setProperty("--surface-dark", colors.surfaceDark || "#161b22");
    root.style.setProperty("--text-dark", colors.textDark || "#e6edf3");
    root.style.setProperty("--bg-light", colors.bgLight || "#f8fafc");
    root.style.setProperty("--surface-light", colors.surfaceLight || "#ffffff");
    root.style.setProperty("--text-light", colors.textLight || "#0f172a");
    root.style.setProperty("--font-body", fonts.body || "Inter, Segoe UI, Arial, sans-serif");
    root.style.setProperty("--font-heading", fonts.heading || "Sora, Segoe UI, Arial, sans-serif");
    root.style.setProperty("--container-width", layout.containerWidth || "1120px");
    root.style.setProperty("--card-radius", layout.cardRadius || "14px");
  }

  function setMeta(name, content) {
    const element = document.querySelector('meta[name="' + name + '"]');
    if (element) {
      element.setAttribute("content", content || "");
    }
  }

  function setProperty(name, content) {
    const element = document.querySelector('meta[property="' + name + '"]');
    if (element) {
      element.setAttribute("content", content || "");
    }
  }

  function setSEO(data) {
    const site = data.site || {};
    const seo = site.seo || {};
    const title = site.name ? site.name + " | " + site.title : "Developer Portfolio";
    document.title = title;
    setMeta("description", seo.description || "");
    setMeta("keywords", seo.keywords || "");
    setProperty("og:title", title);
    setProperty("og:description", seo.description || "");
    setProperty("og:image", seo.ogImage || "");
  }

  function iconMarkup(type) {
    const icons = {
      user:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M20 21a8 8 0 0 0-16 0'></path><circle cx='12' cy='8' r='4'></circle></svg>",
      trophy:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M8 4h8v3a4 4 0 0 1-8 0z'></path><path d='M6 7H4a3 3 0 0 0 3 3'></path><path d='M18 7h2a3 3 0 0 1-3 3'></path><path d='M12 11v4'></path><path d='M9 21h6'></path><path d='M10 15h4a2 2 0 0 1-2 2 2 2 0 0 1-2-2z'></path></svg>",
      badge:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='9' r='5'></circle><path d='m9.5 14 1.1 6L12 18.6 13.4 20l1.1-6'></path><path d='m10.2 9.2 1.1 1.1 2.5-2.5'></path></svg>",
      linkedin:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3.5' y='3.5' width='17' height='17' rx='3'></rect><path d='M8 10v6'></path><circle cx='8' cy='7.6' r='0.9'></circle><path d='M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16'></path></svg>",
      github:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M9 18c-3 1-3-1.5-4.3-1.8'></path><path d='M15 18v-2.3c0-.8.1-1.3-.4-1.8 1.7-.2 3.4-.8 3.4-3.5 0-.8-.3-1.4-.8-1.9.1-.2.4-1-.1-2.1 0 0-.6-.2-2 .8a7 7 0 0 0-3.8 0c-1.4-1-2-.8-2-.8-.5 1.1-.2 1.9-.1 2.1-.5.5-.8 1.1-.8 1.9 0 2.7 1.7 3.3 3.4 3.5-.5.5-.5 1-.5 1.8V18'></path><path d='M12 3a9 9 0 0 0-2.8 17.6'></path><path d='M12 3a9 9 0 0 1 2.8 17.6'></path></svg>",
      youtube:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='6' width='18' height='12' rx='4'></rect><path d='m11 10 4 2-4 2z'></path></svg>",
      instagram:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='4' y='4' width='16' height='16' rx='4'></rect><circle cx='12' cy='12' r='3.5'></circle><circle cx='17.2' cy='6.8' r='0.9'></circle></svg>",
      x:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 4h4.2l4.1 5.5L16.5 4H20l-6 6.5L20.3 20h-4.2l-4.5-6-4.8 6H3l6.3-7.3z'></path></svg>",
      facebook:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='4' y='4' width='16' height='16' rx='3'></rect><path d='M13.2 20v-6.1h2.1l.3-2.3h-2.4v-1.4c0-.7.2-1.2 1.2-1.2h1.3V6.9a18 18 0 0 0-1.9-.1c-1.9 0-3.2 1.1-3.2 3.3v1.5H8.8v2.3h1.8V20'></path></svg>",
      tiktok:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14.5 4c.4 1.9 1.5 3.2 3.5 3.6v2.8a7 7 0 0 1-3.5-1.1V15a4.5 4.5 0 1 1-4.5-4.5c.4 0 .8.1 1.2.2v2.8a2 2 0 1 0 1.8 2V4z'></path></svg>",
      globe:
        "<svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='9'></circle><path d='M3 12h18'></path><path d='M12 3a14 14 0 0 1 0 18'></path><path d='M12 3a14 14 0 0 0 0 18'></path></svg>"
    };
    return "<span class='ui-icon ui-icon-" + type + "'>" + (icons[type] || icons.globe) + "</span>";
  }

  function getSocialIconType(item) {
    const text = (String((item && item.label) || "") + " " + String((item && item.url) || "")).toLowerCase();
    if (text.includes("linkedin")) return "linkedin";
    if (text.includes("github")) return "github";
    if (text.includes("youtube") || text.includes("youtu.be")) return "youtube";
    if (text.includes("instagram")) return "instagram";
    if (text.includes("twitter") || text.includes("x.com")) return "x";
    if (text.includes("facebook") || text.includes("fb.com")) return "facebook";
    if (text.includes("tiktok")) return "tiktok";
    return "globe";
  }

  function renderNavigation(data) {
    const navList = document.querySelector("[data-nav-list]");
    if (!navList) {
      return;
    }
    navList.innerHTML = data.navigation
      .map(function (item) {
        return '<a href="' + item.target + '">' + item.label + "</a>";
      })
      .join("");
  }

  function toggleSectionVisibility(data) {
    const sectionMap = {};
    data.sections.forEach(function (section) {
      sectionMap[section.id] = section;
    });

    document.querySelectorAll("[data-section-id]").forEach(function (sectionNode) {
      const id = sectionNode.dataset.sectionId;
      const config = sectionMap[id];
      if (!config || config.enabled !== true) {
        sectionNode.hidden = true;
      } else {
        sectionNode.hidden = false;
        sectionNode.style.order = String(config.order || 0);
      }
    });
  }

  function renderCustomSections(data) {
    const root = document.querySelector("[data-root]");
    if (!root) {
      return;
    }

    root.querySelectorAll("[data-custom='true']").forEach(function (node) {
      node.remove();
    });

    const builtIn = new Set([
      "hero",
      "about",
      "services",
      "projects",
      "skills",
      "experience",
      "achievements",
      "testimonials",
      "certifications",
      "contact",
      "social"
    ]);
    (data.sections || []).forEach(function (sectionMeta) {
      if (builtIn.has(sectionMeta.id)) {
        return;
      }
      const content = (data.customSections || []).find(function (entry) {
        return entry.id === sectionMeta.id;
      });
      const section = document.createElement("section");
      section.className = "container";
      section.dataset.sectionId = sectionMeta.id;
      section.dataset.custom = "true";
      section.id = sectionMeta.id;
      section.innerHTML =
        "<h2 class='section-heading'>" + (sectionMeta.title || sectionMeta.id) + "</h2>" +
        "<p>" + ((content && content.content) || "Add content from edit panel.") + "</p>";
      root.appendChild(section);
    });
  }

  function renderHero(data) {
    const site = data.site || {};
    const nameNode = document.querySelector("[data-hero-name]");
    const titleNode = document.querySelector("[data-hero-title]");
    const introNode = document.querySelector("[data-hero-intro]");
    const ctaPortfolioNode = document.querySelector("[data-hero-cta-portfolio]");
    const ctaHireNode = document.querySelector("[data-hero-cta-hire]");
    const ctaContactNode = document.querySelector("[data-hero-cta-contact]");
    const metaNode = document.querySelector("[data-hero-meta]");

    if (nameNode) {
      nameNode.textContent = site.name || "";
    }
    if (titleNode) {
      titleNode.textContent = site.title || "";
    }
    if (introNode) {
      introNode.textContent = site.intro || "";
    }
    if (metaNode) {
      metaNode.textContent = (site.location || "") + (site.experienceYears ? " • " + site.experienceYears + " Experience" : "");
    }
    if (ctaPortfolioNode) {
      ctaPortfolioNode.textContent = "View Portfolio";
      ctaPortfolioNode.setAttribute("href", "#projects");
    }
    if (ctaHireNode) {
      ctaHireNode.textContent = "Hire Me";
      ctaHireNode.setAttribute("href", (data.contact && data.contact.hireUrl) || "mailto:" + ((data.contact && data.contact.email) || ""));
    }
    if (ctaContactNode) {
      ctaContactNode.textContent = "Contact Me";
      ctaContactNode.setAttribute("href", "#contact");
    }
  }

  function renderAbout(data) {
    const aboutNode = document.querySelector("[data-about-content]");
    if (aboutNode) {
      aboutNode.textContent = (data.site && data.site.about) || "";
    }
  }

  function renderServices(data) {
    const node = document.querySelector("[data-services-grid]");
    if (!node) {
      return;
    }
    node.innerHTML = (data.services || [])
      .map(function (service) {
        return (
          "<article class='service-card reveal'>" +
          "<div class='service-icon'>" + (service.icon || "◆") + "</div>" +
          "<h3>" + service.title + "</h3>" +
          "<p>" + service.description + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderSkills(data) {
    const skillsGrid = document.querySelector("[data-skills-grid]");
    if (!skillsGrid) {
      return;
    }
    const iconMap = {
      unity: "🎮",
      "construct 3": "🧩",
      "c#": "⌘",
      "c++": "⚙",
      "oculus sdk": "🥽",
      "ar foundation": "📱",
      openxr: "XR",
      webxr: "🌐",
      steamvr: "🕶",
      arcore: "📍",
      "photon pun 2": "🔗",
      "unity netcode": "🛰",
      "unity relay": "📡",
      "gpu instancing": "⚡",
      addressables: "📦",
      "asset bundles": "🗂",
      "memory profiling": "📈",
      "frame rate optimization": "FPS",
      git: "⑂",
      jira: "✓",
      blender: "🧊",
      fmod: "🎧"
    };

    function getSkillIcon(label) {
      const key = String(label || "").toLowerCase().trim();
      return iconMap[key] || "◆";
    }

    const categories = (data.skillCategories || []).filter(function (item) {
      return item && item.title;
    });

    if (categories.length > 0) {
      skillsGrid.innerHTML = categories
        .map(function (group) {
          return (
            "<article class='skill-category reveal'>" +
            "<h3>" + group.title + "</h3>" +
            "<ul>" +
            (group.items || []).map(function (item) {
              return (
                "<li>" +
                "<span class='skill-icon' aria-hidden='true'>" + getSkillIcon(item) + "</span>" +
                "<span>" + item + "</span>" +
                "</li>"
              );
            }).join("") +
            "</ul>" +
            "</article>"
          );
        })
        .join("");
      return;
    }

    skillsGrid.innerHTML = data.skills
      .map(function (skill) {
        return (
          "<article class='skill-item'>" +
          "<header><h3>" + skill.name + "</h3><span>" + skill.level + "%</span></header>" +
          "<div class='skill-meter'><div class='skill-meter-fill' style='width:" +
          skill.level +
          "%'></div></div>" +
          "</article>"
        );
      })
      .join("");
  }

  function collectTags(projects) {
    const tags = new Set(["All"]);
    projects.forEach(function (project) {
      (project.tags || []).forEach(function (tag) {
        tags.add(tag);
      });
    });
    return Array.from(tags);
  }

  function getFilteredProjects() {
    if (state.currentTag === "All") {
      return state.data.projects;
    }
    return state.data.projects.filter(function (project) {
      return (project.tags || []).includes(state.currentTag);
    });
  }

  function renderProjectCardMedia(project, sliderTargetId) {
    const media = [];
    (project.images || []).slice(0, 4).forEach(function (src) {
      media.push({ type: "image", src: src, alt: project.title });
    });
    (project.videos || []).slice(0, 2).forEach(function (src) {
      media.push({ type: "video", src: src, alt: project.title + " video" });
    });

    setTimeout(function () {
      const target = document.getElementById(sliderTargetId);
      if (target) {
        window.createMediaSlider(target, media);
      }
    }, 0);
  }

  function renderProjectCards(projects) {
    const projectsGrid = document.querySelector("[data-project-grid]");
    if (!projectsGrid) {
      return;
    }
    projectsGrid.innerHTML = projects
      .map(function (project, index) {
        const sliderId = "project-slider-" + index + "-" + project.slug;
        return (
          "<article class='project-card reveal'>" +
          "<div id='" + sliderId + "' class='project-slider-frame'></div>" +
          "<div class='project-card-body'>" +
          "<p class='tag-row'>" +
          ["Type: " + (project.type || "Game"), ...(project.tags || [])].map(function (tag) {
            return "<span>" + tag + "</span>";
          }).join("") +
          "</p>" +
          "<h3>" + project.title + "</h3>" +
          "<p>" + project.description + "</p>" +
          "<p class='tech-row'>" + (project.technologies || []).slice(0, 4).map(function (tech) { return "<span>" + tech + "</span>"; }).join("") + "</p>" +
          "<div class='project-actions'>" +
          "<a class='btn btn-secondary' href='" + window.PortfolioStore.getProjectPageHref(project.slug) + "'>Details</a>" +
          (project.demo ? "<a class='btn btn-ghost' href='" + project.demo + "' target='_blank' rel='noopener'>Live Demo</a>" : "") +
          "</div></div></article>"
        );
      })
      .join("");

    projects.forEach(function (project, index) {
      renderProjectCardMedia(project, "project-slider-" + index + "-" + project.slug);
    });
  }

  function renderProjectFilters(data) {
    const filterWrap = document.querySelector("[data-project-filters]");
    if (!filterWrap) {
      return;
    }
    const tags = collectTags(data.projects);
    filterWrap.innerHTML = tags
      .map(function (tag) {
        const active = tag === state.currentTag ? " active" : "";
        return "<button class='chip" + active + "' data-tag='" + tag + "'>" + tag + "</button>";
      })
      .join("");

    if (!state.projectFilterBound) {
      filterWrap.addEventListener("click", function (event) {
        const button = event.target.closest("[data-tag]");
        if (!button) {
          return;
        }
        state.currentTag = button.dataset.tag;
        renderProjectFilters(state.data);
        renderProjectCards(getFilteredProjects());
        startRevealAnimation();
      });
      state.projectFilterBound = true;
    }
  }

  function renderExperience(data) {
    const timeline = document.querySelector("[data-timeline]");
    if (!timeline) {
      return;
    }
    timeline.innerHTML = data.experience
      .map(function (entry) {
        return (
          "<article class='timeline-item reveal'>" +
          "<p class='timeline-period'>" + entry.period + "</p>" +
          "<h3>" + entry.role + "</h3>" +
          "<h4>" + entry.company + "</h4>" +
          "<p>" + entry.description + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderContact(data) {
    const email = document.querySelector("[data-contact-email]");
    const location = document.querySelector("[data-contact-location]");
    const message = document.querySelector("[data-contact-message]");
    const linkedin = document.querySelector("[data-contact-linkedin]");
    const portfolio = document.querySelector("[data-contact-portfolio]");
    const hire = document.querySelector("[data-contact-hire]");

    if (email) {
      email.textContent = data.contact.email || "";
      email.href = "mailto:" + (data.contact.email || "");
    }
    if (location) {
      location.textContent = data.contact.location || "";
    }
    if (message) {
      message.textContent = data.contact.message || "";
    }
    if (linkedin) {
      linkedin.href = data.contact.linkedin || "#";
    }
    if (portfolio) {
      portfolio.href = data.contact.portfolio || "#";
    }
    if (hire) {
      hire.href = data.contact.hireUrl || ("mailto:" + (data.contact.email || ""));
    }
  }

  function renderAchievements(data) {
    const node = document.querySelector("[data-achievements-grid]");
    if (!node) {
      return;
    }
    node.innerHTML = (data.achievements || [])
      .map(function (item) {
        return (
          "<article class='achievement-card reveal'>" +
          "<div class='card-icon-wrap'>" + iconMarkup("trophy") + "</div>" +
          "<h3>" + (item.metric || "") + "</h3>" +
          "<p>" + (item.description || "") + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderTestimonials(data) {
    const node = document.querySelector("[data-testimonials-grid]");
    if (!node) {
      return;
    }
    const fallbackTestimonials = [
      {
        quote: "Muhammad delivered polished gameplay systems with excellent optimization. The project quality exceeded our expectations.",
        author: "Studio Client",
        role: "Game Production Lead",
        avatar: "SC"
      },
      {
        quote: "His VR simulation work was technically strong and practical for real training scenarios. Great problem-solving under deadlines.",
        author: "Enterprise Client",
        role: "XR Program Manager",
        avatar: "EC"
      },
      {
        quote: "Clear communication, reliable delivery, and strong Unity expertise throughout development.",
        author: "Freelance Client",
        role: "Product Founder",
        avatar: "FC"
      }
    ];

    function normalizeTestimonial(item) {
      if (typeof item === "string") {
        return { quote: item.trim(), author: "Client", role: "", avatar: "" };
      }

      const quoteRaw = (item && (item.quote || item.content || item.text || item.message || item.feedback)) || "";
      const authorRaw = (item && (item.author || item.name || item.client || item.person)) || "";
      const roleRaw = (item && (item.role || item.company || item.title || item.position)) || "";
      const avatarRaw = (item && (item.avatar || item.icon || item.initials)) || "";

      const quote = String(quoteRaw).trim();
      const author = String(authorRaw).trim();
      const role = String(roleRaw).trim();
      const avatar = String(avatarRaw).trim();

      const placeholderValues = new Set([".", "..", "...", "-", "--", "---"]);
      return {
        quote: placeholderValues.has(quote) ? "" : quote,
        author: placeholderValues.has(author) ? "" : author,
        role: placeholderValues.has(role) ? "" : role,
        avatar: placeholderValues.has(avatar) ? "" : avatar
      };
    }

    const sanitized = (data.testimonials || [])
      .map(normalizeTestimonial)
      .filter(function (item) {
        return item.quote.length > 3;
      });

    const finalTestimonials = sanitized.length > 0 ? sanitized : fallbackTestimonials;

    node.innerHTML = finalTestimonials
      .map(function (item) {
        return (
          "<article class='testimonial-card reveal'>" +
          "<div class='testimonial-avatar-wrap'><span class='testimonial-avatar'>" + iconMarkup("user") + "</span></div>" +
          "<p>\"" + (item.quote || "") + "\"</p>" +
          "<h3>" + (item.author || "") + "</h3>" +
          "<small>" + (item.role || "") + "</small>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderCertifications(data) {
    const node = document.querySelector("[data-certifications-grid]");
    if (!node) {
      return;
    }
    const certifications = (data.certifications || [])
      .map(function (item) {
        if (typeof item === "string") {
          return {
            title: item.trim(),
            url: ""
          };
        }

        const title = String(
          (item && (item.title || item.tittle || item.name || item.label)) || ""
        ).trim();
        const url = String(
          (item && (item.url || item.link || item.href || item.externalLink)) || ""
        ).trim();

        return { title: title, url: url };
      })
      .filter(function (item) {
        return item.title.length > 0;
      });

    node.innerHTML = certifications
      .map(function (item) {
        const safeTitle = item.title;
        if (item.url) {
          return (
            "<article class='cert-card reveal'>" +
            "<div class='card-icon-wrap'>" + iconMarkup("badge") + "</div>" +
            "<h3><a class='cert-link' href='" + item.url + "' target='_blank' rel='noopener'>" + safeTitle + "</a></h3>" +
            "</article>"
          );
        }

        return (
          "<article class='cert-card reveal'>" +
          "<div class='card-icon-wrap'>" + iconMarkup("badge") + "</div>" +
          "<h3>" + safeTitle + "</h3>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderSocial(data) {
    const socialNode = document.querySelector("[data-social-links]");
    if (!socialNode) {
      return;
    }
    socialNode.innerHTML = data.socialLinks
      .map(function (item) {
        const iconType = getSocialIconType(item);
        return (
          "<a href='" + item.url + "' target='_blank' rel='noopener' aria-label='" + item.label + "'>" +
          iconMarkup(iconType) + "<small>" + item.label + "</small></a>"
        );
      })
      .join("");
  }

  function renderFooter(data) {
    const node = document.querySelector("[data-footer-copy]");
    if (node) {
      node.textContent = "© " + new Date().getFullYear() + " " + (data.site.copyright || data.site.name || "");
    }
  }

  function setupThemeToggle() {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) {
      return;
    }
    const config = window.PORTFOLIO_CONFIG || {};
    const defaultTheme = config.defaultTheme || "dark";
    state.mode = localStorage.getItem("portfolioTheme") || defaultTheme;
    document.documentElement.dataset.theme = state.mode;
    button.textContent = state.mode === "dark" ? "Light Mode" : "Dark Mode";
    button.addEventListener("click", function () {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("portfolioTheme", state.mode);
      document.documentElement.dataset.theme = state.mode;
      button.textContent = state.mode === "dark" ? "Light Mode" : "Dark Mode";
    });
  }

  function setupSmoothScrolling() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) {
        return;
      }
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setupFuturisticEffects() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.getElementById("particleCanvas");
    const geoRoot = document.querySelector("[data-floating-geo]");
    const pointer = document.getElementById("pointerGlow");
    const fxRoot = document.querySelector("[data-bg-fx]");
    if (!canvas || !fxRoot) {
      return;
    }

    if (geoRoot && geoRoot.children.length === 0) {
      const shapeTypes = ["ring", "cube", "sphere"];
      for (let index = 0; index < 12; index += 1) {
        const shape = document.createElement("span");
        const type = shapeTypes[index % shapeTypes.length];
        shape.className = "floating-shape " + type;
        shape.style.left = (6 + ((index * 9) % 86)) + "%";
        shape.style.top = (8 + ((index * 7) % 80)) + "%";
        shape.style.width = (28 + (index % 5) * 10) + "px";
        shape.style.height = shape.style.width;
        shape.style.animationDelay = (index * 0.55) + "s";
        shape.style.animationDuration = (11 + (index % 4) * 4) + "s";
        geoRoot.appendChild(shape);
      }
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const particles = [];
    const particleCount = prefersReduced ? 0 : 56;
    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const pointerPos = { x: mouse.x, y: mouse.y };

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function seedParticles() {
      particles.length = 0;
      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.08,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0.2 + Math.random() * 0.7
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = 0; index < particles.length; index += 1) {
        const p = particles[index];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = window.innerWidth + 5;
        if (p.x > window.innerWidth + 5) p.x = -5;
        if (p.y < -5) p.y = window.innerHeight + 5;
        if (p.y > window.innerHeight + 5) p.y = -5;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 229, 255, " + p.alpha + ")";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pointer) {
        pointerPos.x += (mouse.x - pointerPos.x) * 0.15;
        pointerPos.y += (mouse.y - pointerPos.y) * 0.15;
        pointer.style.transform = "translate(" + pointerPos.x + "px, " + pointerPos.y + "px)";
      }

      requestAnimationFrame(animateParticles);
    }

    function handleMouseMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      const xShift = ((event.clientX / window.innerWidth) - 0.5) * 16;
      const yShift = ((event.clientY / window.innerHeight) - 0.5) * 16;
      fxRoot.style.setProperty("--mx", xShift.toFixed(2) + "px");
      fxRoot.style.setProperty("--my", yShift.toFixed(2) + "px");
    }

    resizeCanvas();
    seedParticles();
    animateParticles();

    window.addEventListener("resize", function () {
      resizeCanvas();
      seedParticles();
    });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
  }

  function startRevealAnimation() {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    document.querySelectorAll(".reveal").forEach(function (node) {
      observer.observe(node);
    });
  }

  function renderAll(data) {
    state.data = data;
    setSEO(data);
    renderNavigation(data);
    renderCustomSections(data);
    toggleSectionVisibility(data);
    renderHero(data);
    renderAbout(data);
    renderServices(data);
    renderProjectFilters(data);
    renderProjectCards(getFilteredProjects());
    renderSkills(data);
    renderExperience(data);
    renderAchievements(data);
    renderTestimonials(data);
    renderCertifications(data);
    renderContact(data);
    renderSocial(data);
    renderFooter(data);
    startRevealAnimation();
  }

  async function init() {
    try {
      applyDesignTokens();
      setupThemeToggle();
      setupSmoothScrolling();
      setupFuturisticEffects();
      const data = await window.PortfolioStore.loadPortfolioData();
      renderAll(data);
    } catch (error) {
      const root = document.querySelector("[data-root]");
      if (root) {
        root.innerHTML = "<p class='error'>Unable to load content. Check data/projects.json.</p>";
      }
      console.error(error);
    }
  }

  init();
})();