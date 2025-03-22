let allEpisodes = [];
let cachedShows = {};
const API_BASE = "https://api.tvmaze.com";

async function fetchShows() {
  const selectElem = document.getElementById("show-select");

  try {
    const response = await fetch(`${API_BASE}/shows`);
    if (!response.ok) throw new Error(`Failed to fetch shows`);

    let shows = await response.json();

    shows.sort((a, b) => a.name.localeCompare(b.name));

    selectElem.innerHTML = shows
      .map((show) => `<option value="${show.id}">${show.name}</option>`)
      .join("");

    loadEpisodes(shows[0].id);
  } catch (error) {
    selectElem.innerHTML = '<option value="">⚠️ Failed to load shows</option>';
    console.error(error);
  }
}

async function loadEpisodes(showId) {
  const rootElem = document.getElementById("root");
  showLoadingMessage();

  try {
    if (!cachedShows[showId]) {
      const response = await fetch(`${API_BASE}/shows/${showId}/episodes`);
      if (!response.ok) throw new Error("Failed to fetch episodes");
      cachedShows[showId] = await response.json();
    }

    allEpisodes = cachedShows[showId];
    hideLoadingMessage();
    makePageForEpisodes(allEpisodes);
    setupSearch();
  } catch (error) {
    showErrorMessage("⚠️ Could not load episodes. Please try again.");
    console.error(error);
  }
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;
      return nameMatch || summaryMatch;
    });
    makePageForEpisodes(filteredEpisodes);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const countElem = document.getElementById("episode-count");

  rootElem.innerHTML = "";
  countElem.textContent = `Showing ${episodeList.length} episode(s)`;

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${String(episode.season).padStart(
      2,
      "0"
    )}E${String(episode.number).padStart(2, "0")}`;

    const image = document.createElement("img");
    image.src = episode.image ? episode.image.medium : "placeholder.jpg";
    image.alt = `Image for ${episode.name}`;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(summary);
    rootElem.appendChild(card);
  });
}

function showLoadingMessage() {
  const root = document.getElementById("root");
  root.innerHTML = "<p>Loading episodes...</p>";
}

function hideLoadingMessage() {
  const root = document.getElementById("root");
  root.innerHTML = "";
}

function showErrorMessage(message) {
  const root = document.getElementById("root");
  root.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
}

function setup() {
  fetchShows();

  const selectElem = document.getElementById("show-select");
  selectElem.addEventListener("change", (event) => {
    if (event.target.value) {
      loadEpisodes(event.target.value);
    }
  });
}

window.onload = setup;
