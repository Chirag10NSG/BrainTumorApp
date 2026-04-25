function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTumor(tumor) {
  return {
    name: tumor.name || "Untitled tumor",
    slug: createSlug(tumor.slug || tumor.name || "untitled-tumor"),
    subtitle: tumor.subtitle || "",
    grade: tumor.grade || "",
    summary: tumor.summary || "",
    symptoms: tumor.symptoms || "",
    diagnosis: tumor.diagnosis || "",
    treatment: tumor.treatment || "",
    questions: tumor.questions || "",
    videoTitle: tumor.videoTitle || "",
    youtubeUrl: tumor.youtubeUrl || "",
    tags: normalizeTags(tumor.tags)
  };
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname === "/watch") {
        const videoId = parsedUrl.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/")[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      }
    }
  } catch (error) {
    return "";
  }

  return "";
}

function setText(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element) {
    element.textContent = value || "";
  }
}

function renderTags(tags) {
  const tagRow = document.querySelector("#detailTagRow");
  tagRow.innerHTML = "";

  tags.forEach((tag) => {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag.replace("-", " ");
    tagRow.appendChild(pill);
  });
}

function renderTumor(tumor) {
  document.title = `${tumor.name} | Brain Tumor Guide`;
  setText("detailLabel", tumor.subtitle);
  setText("detailTitle", tumor.name);
  setText("detailGrade", tumor.grade);
  setText("detailSummary", tumor.summary);
  setText("detailSymptoms", tumor.symptoms);
  setText("detailDiagnosis", tumor.diagnosis);
  setText("detailTreatment", tumor.treatment);
  setText("detailQuestions", tumor.questions);
  renderTags(tumor.tags);

  const videoSection = document.querySelector("#videoSection");
  const videoTitle = document.querySelector("#videoTitle");
  const videoFrame = document.querySelector("#videoFrame");
  const embedUrl = getYouTubeEmbedUrl(tumor.youtubeUrl);

  if (embedUrl) {
    videoSection.hidden = false;
    videoTitle.textContent = tumor.videoTitle || `Watch Dr. Patil explain ${tumor.name}`;
    videoFrame.src = embedUrl;
    videoFrame.title = tumor.videoTitle || `${tumor.name} video`;
  } else {
    videoSection.hidden = true;
    videoFrame.src = "";
  }
}

function showMissingState(message) {
  const container = document.querySelector("#detailContainer");
  container.innerHTML = `
    <section class="detail-shell detail-empty">
      <p class="eyebrow">Tumor details</p>
      <h1>We could not find that tumor page.</h1>
      <p>${message}</p>
      <a class="button button-primary" href="./index.html#tumor-directory">Back to directory</a>
    </section>
  `;
}

async function loadTumorDetail() {
  const slug = new URLSearchParams(window.location.search).get("slug");

  if (!slug) {
    showMissingState("Pick a tumor from the directory to open its detail page.");
    return;
  }

  try {
    const response = await fetch("./content/tumors.json");
    if (!response.ok) {
      throw new Error("Tumor content could not be loaded.");
    }

    const tumorsContent = await response.json();
    const tumors = (Array.isArray(tumorsContent) ? tumorsContent : tumorsContent.tumors || []).map(
      normalizeTumor
    );

    const tumor = tumors.find((item) => item.slug === slug);
    if (!tumor) {
      showMissingState("This tumor is not in the current content list yet.");
      return;
    }

    renderTumor(tumor);
  } catch (error) {
    showMissingState("The content files could not be loaded right now. Please try again in a moment.");
  }
}

loadTumorDetail();
