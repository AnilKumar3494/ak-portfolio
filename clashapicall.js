// Wait for the HTML document to be fully loaded before running code
document.addEventListener("DOMContentLoaded", () => {
  // This is the function that will get your stats
  async function fetchClashStats() {
    // This is your live, working API URL!
    const apiUrl = "https://ak-portfolio-alpha.vercel.app/api/get-stats";

    // Select the HTML elements you want to update
    const nameEl = document.getElementById("crl-name");
    const trophiesEl = document.getElementById("crl-trophies");
    const winsEl = document.getElementById("crl-wins");
    const arenaEl = document.getElementById("crl-arena");

    try {
      // 1. Try to fetch the data from your API
      const response = await fetch(apiUrl);

      // Throw an error if the request failed
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 2. Get the JSON data from the response
      const data = await response.json();

      // 3. Update the HTML elements with the data
      nameEl.textContent = data.name;
      trophiesEl.textContent = data.trophies;
      winsEl.textContent = data.wins;
      arenaEl.textContent = data.arena.name; // Access nested data
    } catch (error) {
      // 4. If anything fails, log the error and show "N/A"
      console.error("Failed to fetch Clash stats:", error);
      nameEl.textContent = "N/A";
      trophiesEl.textContent = "N/A";
      winsEl.textContent = "N/A";
      arenaEl.textContent = "N/A";
    }
  }

  // Call the function to run it as soon as the page loads
  fetchClashStats();
});
