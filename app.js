
const grid = document.getElementById("opportunity-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const audienceFilter =
  document.getElementById("audience-filter") ||
  document.getElementById("level-filter");
const sortFilter =
  document.getElementById("sort-select") ||
  document.getElementById("sort-filter");
const resultCount =
  document.getElementById("results-count") ||
  document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const resetButton =
  document.getElementById("reset-filters") ||
  document.getElementById("clear-filters");
const emptyReset =
  document.getElementById("empty-reset");
const searchButton = document.getElementById("search-button");

const yearElement = document.getElementById("current-year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

function getFilteredOpportunities() {
  const query = searchInput?.value.trim().toLowerCase() || "";
  const category = categoryFilter?.value || "all";
  const audience = audienceFilter?.value || "all";
  const sort = sortFilter?.value || "featured";

  const results = opportunities.filter(item => {
    const searchableText = [
      item.title,
      item.categoryLabel,
      item.description,
      item.audienceLabel,
      ...item.audience
    ].join(" ").toLowerCase();

    return (
      searchableText.includes(query) &&
      (category === "all" || item.category === category) &&
      (audience === "all" || item.audience.includes(audience))
    );
  });

  if (sort === "name" || sort === "alphabetical") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    results.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return results;
}

function createCard(item) {
  const article = document.createElement("article");
  article.className = "opportunity-card";

  const top = document.createElement("div");
  top.className = "card-topline";

  const category = document.createElement("span");
  category.className = "category-pill";
  category.textContent = item.categoryLabel;
  top.appendChild(category);

  if (item.featured) {
    const badge = document.createElement("span");
    badge.className = "featured-label";
    badge.textContent = "Recommended";
    top.appendChild(badge);
  }

  const icon = document.createElement("div");
  icon.className = "card-icon";
  icon.textContent = item.icon;
  icon.setAttribute("aria-hidden", "true");

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = item.title;

  const description = document.createElement("p");
  description.className = "card-description";
  description.textContent = item.description;

  const audience = document.createElement("p");
  audience.className = "card-audience";
  audience.textContent = "For: " + item.audienceLabel;

  const link = document.createElement("a");
  link.className = "card-link";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Visit official website ↗";
  link.setAttribute("aria-label", "Visit " + item.title);

  article.append(top, icon, title, description, audience, link);
  return article;
}

function renderOpportunities() {
  if (!grid || typeof opportunities === "undefined") {
    console.error("Umuntu: opportunity grid or data.js is missing.");
    return;
  }

  const results = getFilteredOpportunities();
  grid.replaceChildren();

  results.forEach(item => grid.appendChild(createCard(item)));

  if (resultCount) {
    resultCount.textContent =
      `${results.length} ${results.length === 1 ? "opportunity" : "opportunities"} found`;
  }

  if (emptyState) emptyState.hidden = results.length !== 0;
  grid.hidden = results.length === 0;
}

function resetFilters() {
  if (searchInput) searchInput.value = "";
  if (categoryFilter) categoryFilter.value = "all";
  if (audienceFilter) audienceFilter.value = "all";
  if (sortFilter) sortFilter.value = "featured";
  renderOpportunities();
}

searchInput?.addEventListener("input", renderOpportunities);
categoryFilter?.addEventListener("change", renderOpportunities);
audienceFilter?.addEventListener("change", renderOpportunities);
sortFilter?.addEventListener("change", renderOpportunities);
searchButton?.addEventListener("click", renderOpportunities);
resetButton?.addEventListener("click", resetFilters);
emptyReset?.addEventListener("click", resetFilters);

renderOpportunities();

