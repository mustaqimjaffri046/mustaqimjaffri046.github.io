(function () {
  "use strict";

  function extractGoogleDriveId(value) {
    const src = String(value || "").trim();
    const fileMatch = src.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (fileMatch && fileMatch[1]) {
      return fileMatch[1];
    }
    const openMatch = src.match(/[?&]id=([^&]+)/i);
    if (openMatch && openMatch[1]) {
      return openMatch[1];
    }
    const ucMatch = src.match(/drive\.google\.com\/uc\?.*id=([^&]+)/i);
    if (ucMatch && ucMatch[1]) {
      return ucMatch[1];
    }
    return "";
  }

  function toEmbeddableVideoSource(value) {
    const src = String(value || "").trim();
    if (!src) {
      return { url: "", useIframe: false };
    }

    const driveId = extractGoogleDriveId(src);
    if (driveId) {
      return {
        url: "https://drive.google.com/file/d/" + driveId + "/preview",
        useIframe: true,
        isDriveEmbed: true
      };
    }

    const youtubeWatchMatch = src.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
    if (youtubeWatchMatch && youtubeWatchMatch[1]) {
      return {
        url: "https://www.youtube.com/embed/" + youtubeWatchMatch[1],
        useIframe: true
      };
    }

    const youtubeShortMatch = src.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (youtubeShortMatch && youtubeShortMatch[1]) {
      return {
        url: "https://www.youtube.com/embed/" + youtubeShortMatch[1],
        useIframe: true
      };
    }

    const isKnownEmbed =
      src.includes("youtube.com/embed") ||
      src.includes("player.vimeo.com");

    return {
      url: src,
      useIframe: isKnownEmbed,
      isDriveEmbed: false
    };
  }

  function createSlide(item, index) {
    const figure = document.createElement("figure");
    figure.className = "slider-slide";
    figure.dataset.index = String(index);

    if (item.type === "video") {
      const videoSource = toEmbeddableVideoSource(item.src);
      if (videoSource.useIframe) {
        if (videoSource.isDriveEmbed) {
          figure.classList.add("slider-slide-drive");
        }
        const iframe = document.createElement("iframe");
        iframe.src = videoSource.url;
        iframe.loading = "lazy";
        iframe.title = item.alt || "Project video";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        figure.appendChild(iframe);
      } else {
        const video = document.createElement("video");
        video.src = videoSource.url;
        video.controls = true;
        video.preload = "none";
        figure.appendChild(video);
      }
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "Project image";
      img.loading = "lazy";
      img.decoding = "async";
      figure.appendChild(img);
    }

    return figure;
  }

  function createMediaSlider(target, items, options) {
    const opts = options || {};
    const media = Array.isArray(items) ? items : [];
    if (!target || media.length === 0) {
      if (target) {
        target.innerHTML = "<div class='slider-empty'>No media available.</div>";
      }
      return null;
    }

    target.classList.add("media-slider");
    target.innerHTML = "";

    const viewport = document.createElement("div");
    viewport.className = "slider-viewport";
    target.appendChild(viewport);

    const track = document.createElement("div");
    track.className = "slider-track";
    viewport.appendChild(track);

    media.forEach(function (item, idx) {
      track.appendChild(createSlide(item, idx));
    });

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "slider-btn slider-btn-prev";
    prevBtn.innerHTML = "<span class='slider-btn-icon' aria-hidden='true'>&larr;</span>";
    prevBtn.setAttribute("aria-label", "Previous project image");
    prevBtn.setAttribute("title", "Previous image");

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "slider-btn slider-btn-next";
    nextBtn.innerHTML = "<span class='slider-btn-icon' aria-hidden='true'>&rarr;</span>";
    nextBtn.setAttribute("aria-label", "Next project image");
    nextBtn.setAttribute("title", "Next image");

    const dots = document.createElement("div");
    dots.className = "slider-dots";

    media.forEach(function (_item, idx) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.dataset.index = String(idx);
      dots.appendChild(dot);
    });

    target.appendChild(prevBtn);
    target.appendChild(nextBtn);
    target.appendChild(dots);

    let current = opts.startIndex && opts.startIndex > 0 ? opts.startIndex : 0;
    const slideWidth = 100;

    function render() {
      track.style.transform = "translateX(-" + current * slideWidth + "%)";
      dots.querySelectorAll(".slider-dot").forEach(function (dot, idx) {
        dot.classList.toggle("active", idx === current);
      });
    }

    function goTo(index) {
      if (index < 0) {
        current = media.length - 1;
      } else if (index >= media.length) {
        current = 0;
      } else {
        current = index;
      }
      render();
    }

    prevBtn.addEventListener("click", function () {
      goTo(current - 1);
    });

    nextBtn.addEventListener("click", function () {
      goTo(current + 1);
    });

    dots.addEventListener("click", function (event) {
      const button = event.target.closest(".slider-dot");
      if (!button) {
        return;
      }
      goTo(Number(button.dataset.index));
    });

    render();

    return {
      goTo: goTo,
      getCurrent: function () {
        return current;
      }
    };
  }

  window.createMediaSlider = createMediaSlider;
})();
