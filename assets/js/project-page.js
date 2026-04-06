(function () {
  "use strict";

  function getSlugFromPage() {
    const url = new URL(window.location.href);
    const querySlug = url.searchParams.get("slug");
    if (querySlug) {
      return querySlug;
    }
    const metaSlug = document.querySelector('meta[name="project-slug"]');
    if (metaSlug) {
      return metaSlug.getAttribute("content") || "";
    }
    return "";
  }

  function setProjectSEO(project) {
    document.title = project.title + " | Project Case Study";
    const description = project.description || "";
    const image = (project.images && project.images[0]) || "";

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", project.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
    }
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute("content", image);
    }
  }

  function renderExternalLinks(project) {
    const linksNode = document.querySelector("[data-project-links]");
    if (!linksNode) {
      return;
    }
    const links = [];
    if (project.github) {
      links.push("<a class='btn btn-secondary' href='" + project.github + "' target='_blank' rel='noopener'>GitHub</a>");
    }
    if (project.playStore) {
      links.push("<a class='btn btn-secondary' href='" + project.playStore + "' target='_blank' rel='noopener'>Play Store</a>");
    }
    if (project.demo) {
      links.push("<a class='btn btn-secondary' href='" + project.demo + "' target='_blank' rel='noopener'>Live Demo</a>");
    }
    linksNode.innerHTML = links.join("");
  }

  function renderProject(project) {
    setProjectSEO(project);

    document.querySelector("[data-project-title]").textContent = project.title;
    document.querySelector("[data-project-description]").textContent = project.description;

    const techNode = document.querySelector("[data-project-tech]");
    techNode.innerHTML = (project.technologies || [])
      .map(function (tech) {
        return "<li>" + tech + "</li>";
      })
      .join("");

    const detailsNode = document.querySelector("[data-project-details]");
    detailsNode.innerHTML = Object.keys(project.projectDetails || {})
      .map(function (key) {
        return "<li><strong>" + key + ":</strong> " + project.projectDetails[key] + "</li>";
      })
      .join("");

    const featuresNode = document.querySelector("[data-project-features]");
    featuresNode.innerHTML = (project.features || [])
      .map(function (feature) {
        return "<li>" + feature + "</li>";
      })
      .join("");

    const galleryNode = document.querySelector("[data-project-gallery]");
    galleryNode.innerHTML = (project.screenshots || [])
      .map(function (src) {
        return "<img loading='lazy' decoding='async' src='" + src + "' alt='" + project.title + " screenshot'>";
      })
      .join("");

    renderExternalLinks(project);

    const media = [];
    (project.images || []).forEach(function (src) {
      media.push({ type: "image", src: src, alt: project.title });
    });
    (project.videos || []).forEach(function (src) {
      media.push({ type: "video", src: src, alt: project.title + " video" });
    });
    const sliderTarget = document.querySelector("[data-project-slider]");
    window.createMediaSlider(sliderTarget, media);
  }

  async function init() {
    try {
      const slug = getSlugFromPage();
      const data = await window.PortfolioStore.loadPortfolioData();
      const project = (data.projects || []).find(function (item) {
        return item.slug === slug;
      });
      if (!project) {
        throw new Error("Project not found for slug: " + slug);
      }
      renderProject(project);
    } catch (error) {
      const app = document.querySelector("[data-project-root]");
      if (app) {
        app.innerHTML = "<h1>Project not found</h1><p>Check slug and data/projects.json.</p>";
      }
      console.error(error);
    }
  }

  init();
})();
