let allEpisodes = [];

function setup() {
  showLoadingMessage();

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      return response.json();
    })
    .then((data) => {
      allEpisodes = data;
      hideLoadingMessage();
      makePageForEpisodes(allEpisodes);
      setupSearch();
    })
    .catch((error) => {
      showErrorMessage(
        "⚠️ Could not load episode data. Please try again later."
      );
    });
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const countElem = document.getElementById("episode-count");

  rootElem.innerHTML = ""; // Clear previous content
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

window.onload = setup;
