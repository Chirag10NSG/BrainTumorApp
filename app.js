const searchInput = document.querySelector("#searchInput");
const filterGroup = document.querySelector("#filterGroup");
const cardGrid = document.querySelector("#cardGrid");
const resultsMeta = document.querySelector("#resultsMeta");
const template = document.querySelector("#tumorCardTemplate");
const questionGrid = document.querySelector("#questionGrid");
const questionTemplate = document.querySelector("#questionCardTemplate");
const sourceList = document.querySelector("#sourceList");
const sourceTemplate = document.querySelector("#sourceItemTemplate");

let currentFilter = "all";
let tumors = [];

function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTumorDetailUrl(tumor) {
  return `./tumor.html?slug=${encodeURIComponent(tumor.slug)}`;
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
    tags: normalizeTags(tumor.tags)
  };
}

function matchesSearch(tumor, term) {
  if (!term) return true;
  const haystack = [
    tumor.name,
    tumor.subtitle,
    tumor.grade,
    tumor.summary,
    tumor.symptoms,
    tumor.diagnosis,
    tumor.treatment,
    tumor.questions,
    tumor.tags.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term.toLowerCase());
}

function matchesFilter(tumor, filter) {
  return filter === "all" ? true : tumor.tags.includes(filter);
}

function setText(id, value) {
  const element = document.querySelector(`#${id}`);
  if (element && value) {
    element.textContent = value;
  }
}

function setLink(id, value) {
  const element = document.querySelector(`#${id}`);
  if (!element || !value) return;
  element.textContent = value.label;
  element.href = value.href;
}

function renderQuestions(groups) {
  questionGrid.innerHTML = "";

  groups.forEach((group) => {
    const fragment = questionTemplate.content.cloneNode(true);
    fragment.querySelector(".question-title").textContent = group.title;

    const list = fragment.querySelector(".question-items");
    group.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    questionGrid.appendChild(fragment);
  });
}

function renderSources(sources) {
  sourceList.innerHTML = "";

  sources.forEach((source) => {
    const fragment = sourceTemplate.content.cloneNode(true);
    const link = fragment.querySelector("a");
    link.href = source.url;
    link.textContent = source.label;
    sourceList.appendChild(fragment);
  });
}

function applySiteContent(siteContent) {
  setText("heroEyebrow", siteContent.hero.eyebrow);
  setText("heroTitle", siteContent.hero.title);
  setText("heroDescription", siteContent.hero.description);
  setLink("primaryCta", siteContent.hero.primaryCta);
  setLink("secondaryCta", siteContent.hero.secondaryCta);

  setText("focusLabel", siteContent.hero.focusCard.label);
  setText("focusTitle", siteContent.hero.focusCard.title);
  setText("focusDescription", siteContent.hero.focusCard.description);

  setText("urgentLabel", siteContent.hero.urgentCard.label);
  setText("urgentTitle", siteContent.hero.urgentCard.title);
  setText("urgentDescription", siteContent.hero.urgentCard.description);

  siteContent.infoStrip.forEach((item, index) => {
    setText(`infoTitle${index + 1}`, item.title);
    setText(`infoBody${index + 1}`, item.body);
  });

  setText("directoryEyebrow", siteContent.directory.eyebrow);
  setText("directoryTitle", siteContent.directory.title);
  setText("directoryDescription", siteContent.directory.description);

  setText("careEyebrow", siteContent.careGuide.eyebrow);
  setText("careTitle", siteContent.careGuide.title);
  renderQuestions(siteContent.careGuide.groups);

  setText("sourcesEyebrow", siteContent.sources.eyebrow);
  setText("sourcesTitle", siteContent.sources.title);
  setText("sourcesDescription", siteContent.sources.description);
  renderSources(siteContent.sources.links);
}

function renderCards() {
  const term = searchInput.value.trim();
  const filteredTumors = tumors.filter(
    (tumor) => matchesSearch(tumor, term) && matchesFilter(tumor, currentFilter)
  );

  cardGrid.innerHTML = "";
  resultsMeta.textContent = `${filteredTumors.length} tumor type${
    filteredTumors.length === 1 ? "" : "s"
  } shown`;

  if (filteredTumors.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML =
      "<strong>No matches found.</strong><p>Try a broader search term like 'seizure', 'grade 4', 'surgery', or 'children'.</p>";
    cardGrid.appendChild(emptyState);
    return;
  }

  filteredTumors.forEach((tumor) => {
    const fragment = template.content.cloneNode(true);
    const detailUrl = getTumorDetailUrl(tumor);

    fragment.querySelector(".card-link-overlay").href = detailUrl;
    fragment
      .querySelector(".card-link-overlay")
      .setAttribute("aria-label", `View details for ${tumor.name}`);
    fragment.querySelector(".card-label").textContent = tumor.subtitle;
    fragment.querySelector(".card-title").textContent = tumor.name;
    fragment.querySelector(".card-grade").textContent = tumor.grade;
    fragment.querySelector(".card-summary").textContent = tumor.summary;
    fragment.querySelector(".card-symptoms").textContent = tumor.symptoms;
    fragment.querySelector(".card-diagnosis").textContent = tumor.diagnosis;
    fragment.querySelector(".card-treatment").textContent = tumor.treatment;
    fragment.querySelector(".card-questions").textContent = tumor.questions;

    const tagRow = fragment.querySelector(".tag-row");
    tumor.tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "tag";
      pill.textContent = tag.replace("-", " ");
      tagRow.appendChild(pill);
    });

    fragment.querySelector(".card-detail-link").href = detailUrl;

    cardGrid.appendChild(fragment);
  });
}

filterGroup.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  currentFilter = button.dataset.filter;

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip === button);
  });

  renderCards();
});

searchInput.addEventListener("input", renderCards);

async function loadContent() {
  try {
    const [siteResponse, tumorsResponse] = await Promise.all([
      fetch("./content/site.json"),
      fetch("./content/tumors.json")
    ]);

    if (!siteResponse.ok) {
      throw new Error("Site content could not be loaded.");
    }

    const siteContent = await siteResponse.json();
    let tumorsContent;

    if (tumorsResponse.ok) {
      tumorsContent = await tumorsResponse.json();
      tumors = (Array.isArray(tumorsContent) ? tumorsContent : tumorsContent.tumors || []).map(
        normalizeTumor
      );
    } else {
      const tumorIndexResponse = await fetch("./content/tumors/index.json");
      if (!tumorIndexResponse.ok) {
        throw new Error("Tumor content could not be loaded.");
      }

      const tumorIndex = await tumorIndexResponse.json();
      const tumorResponses = await Promise.all(
        tumorIndex.files.map((file) => fetch(`./content/tumors/${file}`))
      );

      if (tumorResponses.some((response) => !response.ok)) {
        throw new Error("One or more tumor files could not be loaded.");
      }

      tumors = (await Promise.all(tumorResponses.map((response) => response.json()))).map(
        normalizeTumor
      );
    }

    applySiteContent(siteContent);
    renderCards();
  } catch (error) {
    resultsMeta.textContent =
      "The content files could not be loaded. Run this app with a local server like python3 -m http.server 8000.";
  }
}

loadContent();
