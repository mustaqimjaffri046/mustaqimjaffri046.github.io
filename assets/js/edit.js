(function () {
  "use strict";

  const state = {
    data: null,
    selectedProjectSlug: ""
  };

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function toArrayFromLines(value) {
    return String(value || "")
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function toArrayFromCSV(value) {
    return String(value || "")
      .split(",")
      .map(function (token) {
        return token.trim();
      })
      .filter(Boolean);
  }

  function getProjectBySlug(slug) {
    return (state.data.projects || []).find(function (project) {
      return project.slug === slug;
    });
  }

  function renderStatus(message) {
    const status = byId("editorStatus");
    if (status) {
      status.textContent = message;
    }
  }

  function renderProjectSelect() {
    const select = byId("projectSelect");
    select.innerHTML = (state.data.projects || [])
      .map(function (project) {
        return "<option value='" + project.slug + "'>" + project.title + " (" + project.slug + ")</option>";
      })
      .join("");

    if (!state.selectedProjectSlug && state.data.projects.length > 0) {
      state.selectedProjectSlug = state.data.projects[0].slug;
    }
    select.value = state.selectedProjectSlug;
  }

  function renderProjectFields() {
    const project = getProjectBySlug(state.selectedProjectSlug);
    if (!project) {
      return;
    }

    byId("projectTitle").value = project.title || "";
    byId("projectSlug").value = project.slug || "";
    byId("projectDescription").value = project.description || "";
    byId("projectTech").value = (project.technologies || []).join(", ");
    byId("projectImages").value = (project.images || []).join("\n");
    byId("projectVideos").value = (project.videos || []).join("\n");
    byId("projectGitHub").value = project.github || "";
    byId("projectDemo").value = project.demo || "";
    byId("projectPlayStore").value = project.playStore || "";
    byId("projectTags").value = (project.tags || []).join(", ");
    byId("projectFeatures").value = (project.features || []).join("\n");
    byId("projectScreenshots").value = (project.screenshots || []).join("\n");
    byId("projectDuration").value = (project.projectDetails && project.projectDetails.duration) || "";
    byId("projectTeamSize").value = (project.projectDetails && project.projectDetails.teamSize) || "";
    byId("projectPlatform").value = (project.projectDetails && project.projectDetails.platform) || "";
    byId("projectRole").value = (project.projectDetails && project.projectDetails.role) || "";
  }

  function renderSectionsTable() {
    const body = byId("sectionsTableBody");
    const sorted = (state.data.sections || []).slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    body.innerHTML = sorted
      .map(function (section) {
        return (
          "<tr>" +
          "<td>" + section.id + "</td>" +
          "<td>" + section.title + "</td>" +
          "<td><input type='checkbox' data-section-enable='" + section.id + "' " + (section.enabled ? "checked" : "") + "></td>" +
          "<td>" + section.order + "</td>" +
          "<td>" +
          "<button data-section-edit='" + section.id + "'>Edit</button>" +
          "<button data-section-up='" + section.id + "'>↑</button>" +
          "<button data-section-down='" + section.id + "'>↓</button>" +
          "<button data-section-delete='" + section.id + "'>Delete</button>" +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function saveData() {
    window.PortfolioStore.savePortfolioData(state.data);
    byId("jsonPreview").value = JSON.stringify(state.data, null, 2);
    renderStatus("Changes saved locally. Download JSON to update file in repo.");
  }

  function updateProjectFromForm() {
    const project = getProjectBySlug(state.selectedProjectSlug);
    if (!project) {
      return;
    }

    const oldSlug = project.slug;
    project.title = byId("projectTitle").value.trim();
    project.slug = slugify(byId("projectSlug").value || project.title);
    project.description = byId("projectDescription").value.trim();
    project.technologies = toArrayFromCSV(byId("projectTech").value);
    project.images = toArrayFromLines(byId("projectImages").value);
    project.videos = toArrayFromLines(byId("projectVideos").value);
    project.github = byId("projectGitHub").value.trim();
    project.demo = byId("projectDemo").value.trim();
    project.playStore = byId("projectPlayStore").value.trim();
    project.tags = toArrayFromCSV(byId("projectTags").value);
    project.features = toArrayFromLines(byId("projectFeatures").value);
    project.screenshots = toArrayFromLines(byId("projectScreenshots").value);
    project.projectDetails = {
      duration: byId("projectDuration").value.trim(),
      teamSize: byId("projectTeamSize").value.trim(),
      platform: byId("projectPlatform").value.trim(),
      role: byId("projectRole").value.trim()
    };

    if (oldSlug !== project.slug) {
      state.selectedProjectSlug = project.slug;
    }
    renderProjectSelect();
    saveData();
  }

  function addProject() {
    const title = prompt("Project title:");
    if (!title) {
      return;
    }
    const slug = slugify(title);
    if (getProjectBySlug(slug)) {
      alert("A project with this slug already exists.");
      return;
    }
    state.data.projects.push({
      title: title,
      slug: slug,
      description: "",
      technologies: [],
      images: [],
      videos: [],
      github: "",
      demo: "",
      playStore: "",
      tags: [],
      projectDetails: {},
      features: [],
      screenshots: []
    });
    state.selectedProjectSlug = slug;
    renderProjectSelect();
    renderProjectFields();
    saveData();
  }

  function deleteProject() {
    if (!state.selectedProjectSlug) {
      return;
    }
    const confirmed = confirm("Delete selected project?");
    if (!confirmed) {
      return;
    }
    state.data.projects = state.data.projects.filter(function (project) {
      return project.slug !== state.selectedProjectSlug;
    });
    state.selectedProjectSlug = state.data.projects.length ? state.data.projects[0].slug : "";
    renderProjectSelect();
    renderProjectFields();
    saveData();
  }

  function handleMediaUpload(event, targetFieldId, asVideo) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }
    const field = byId(targetFieldId);
    const existing = toArrayFromLines(field.value);

    Promise.all(
      files.map(function (file) {
        return new Promise(function (resolve) {
          const reader = new FileReader();
          reader.onload = function (loadEvent) {
            resolve(loadEvent.target.result);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then(function (results) {
      const values = existing.concat(results);
      field.value = values.join("\n");
      updateProjectFromForm();
      renderStatus(
        (asVideo ? "Video" : "Image") +
          " embedded as data URL. For production, upload to assets folder and replace URLs."
      );
    });
  }

  function addSection() {
    const id = slugify(prompt("Section id (example: awards):") || "");
    if (!id) {
      return;
    }
    if ((state.data.sections || []).some(function (section) { return section.id === id; })) {
      alert("Section id already exists.");
      return;
    }
    const title = prompt("Section title:", id) || id;
    const content = prompt("Section content (optional):", "") || "";
    const maxOrder = Math.max.apply(
      null,
      state.data.sections.map(function (section) {
        return section.order || 0;
      }).concat([0])
    );
    state.data.sections.push({
      id: id,
      title: title,
      enabled: true,
      order: maxOrder + 1
    });
    if (!state.data.customSections) {
      state.data.customSections = [];
    }
    state.data.customSections.push({
      id: id,
      content: content
    });
    renderSectionsTable();
    saveData();
  }

  function deleteSection(id) {
    state.data.sections = state.data.sections.filter(function (section) {
      return section.id !== id;
    });
    state.data.customSections = (state.data.customSections || []).filter(function (entry) {
      return entry.id !== id;
    });
    renderSectionsTable();
    saveData();
  }

  function editSection(id) {
    const section = state.data.sections.find(function (item) {
      return item.id === id;
    });
    if (!section) {
      return;
    }
    const title = prompt("Section title:", section.title || section.id);
    if (title) {
      section.title = title;
    }
    const custom = (state.data.customSections || []).find(function (entry) {
      return entry.id === id;
    });
    if (custom) {
      const content = prompt("Section content:", custom.content || "");
      if (content !== null) {
        custom.content = content;
      }
    }
    renderSectionsTable();
    saveData();
  }

  function swapSectionOrder(id, direction) {
    const sorted = state.data.sections.slice().sort(function (a, b) {
      return a.order - b.order;
    });
    const index = sorted.findIndex(function (section) {
      return section.id === id;
    });
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }
    const a = sorted[index];
    const b = sorted[targetIndex];
    const temp = a.order;
    a.order = b.order;
    b.order = temp;
    renderSectionsTable();
    saveData();
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "projects.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const parsed = JSON.parse(event.target.result);
        state.data = window.PortfolioStore.normalizePortfolioData(parsed);
        state.selectedProjectSlug = state.data.projects.length ? state.data.projects[0].slug : "";
        renderAll();
        saveData();
      } catch (_error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function bindEvents() {
    byId("projectSelect").addEventListener("change", function (event) {
      state.selectedProjectSlug = event.target.value;
      renderProjectFields();
    });
    byId("saveProjectBtn").addEventListener("click", updateProjectFromForm);
    byId("addProjectBtn").addEventListener("click", addProject);
    byId("deleteProjectBtn").addEventListener("click", deleteProject);
    byId("uploadImages").addEventListener("change", function (event) {
      handleMediaUpload(event, "projectImages", false);
    });
    byId("uploadVideos").addEventListener("change", function (event) {
      handleMediaUpload(event, "projectVideos", true);
    });

    byId("addSectionBtn").addEventListener("click", addSection);
    byId("sectionsTableBody").addEventListener("click", function (event) {
      const edit = event.target.closest("[data-section-edit]");
      const up = event.target.closest("[data-section-up]");
      const down = event.target.closest("[data-section-down]");
      const del = event.target.closest("[data-section-delete]");
      if (edit) {
        editSection(edit.dataset.sectionEdit);
      } else if (up) {
        swapSectionOrder(up.dataset.sectionUp, -1);
      } else if (down) {
        swapSectionOrder(down.dataset.sectionDown, 1);
      } else if (del) {
        deleteSection(del.dataset.sectionDelete);
      }
    });

    byId("sectionsTableBody").addEventListener("change", function (event) {
      const input = event.target.closest("[data-section-enable]");
      if (!input) {
        return;
      }
      const id = input.dataset.sectionEnable;
      const section = state.data.sections.find(function (item) {
        return item.id === id;
      });
      if (section) {
        section.enabled = input.checked;
        saveData();
      }
    });

    byId("saveSiteBtn").addEventListener("click", function () {
      state.data.site.name = byId("siteName").value.trim();
      state.data.site.title = byId("siteTitle").value.trim();
      state.data.site.intro = byId("siteIntro").value.trim();
      state.data.site.about = byId("siteAbout").value.trim();
      saveData();
    });

    byId("exportJsonBtn").addEventListener("click", exportJSON);
    byId("clearLocalBtn").addEventListener("click", function () {
      window.PortfolioStore.clearPortfolioOverride();
      renderStatus("Local override cleared. Refresh to load data/projects.json.");
    });
    byId("importJsonInput").addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0];
      if (file) {
        importJSON(file);
      }
    });
    byId("importJsonBtn").addEventListener("click", function () {
      byId("importJsonInput").click();
    });
  }

  function renderSiteFields() {
    byId("siteName").value = state.data.site.name || "";
    byId("siteTitle").value = state.data.site.title || "";
    byId("siteIntro").value = state.data.site.intro || "";
    byId("siteAbout").value = state.data.site.about || "";
  }

  function renderAll() {
    renderSiteFields();
    renderProjectSelect();
    renderProjectFields();
    renderSectionsTable();
    byId("jsonPreview").value = JSON.stringify(state.data, null, 2);
  }

  async function init() {
    state.data = await window.PortfolioStore.loadPortfolioData();
    state.selectedProjectSlug = state.data.projects.length ? state.data.projects[0].slug : "";
    renderAll();
    bindEvents();
    renderStatus("Editor loaded. Save changes and export JSON when ready.");
  }

  init().catch(function (error) {
    renderStatus("Failed to load editor data.");
    console.error(error);
  });
})();
