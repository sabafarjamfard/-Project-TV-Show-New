//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  displayEpisodes(allEpisodes);
}

function displayEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = ""; // Clear previous content

  episodes.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

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

    episodeCard.appendChild(title);
    episodeCard.appendChild(image);
    episodeCard.appendChild(summary);

    root.appendChild(episodeCard);
  });
}

window.onload = setup;
