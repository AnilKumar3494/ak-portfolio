require("dotenv").config(); // Loads environment variables from .env file

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
// const port = 3300;

// app.use(cors());
app.use(cors({ origin: "*" }));

app.get("/api/get-stats", async (req, res) => {
  console.log("Received a request for Clash Royale stats!");

  const CLASH_API_KEY = process.env.CLASH_API_KEY;

  if (!CLASH_API_KEY) {
    console.error("ERROR: API key is not loaded from .env file.");
    return res.status(500).json({ error: "API key is not configured." });
  }

  const playerTag = "#9GU2YQ0V"; // Change to your player tag

  const apiUrl = `https://proxy.royaleapi.dev/v1/players/%23${playerTag.substring(
    1
  )}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${CLASH_API_KEY}` },
    });

    if (!apiResponse.ok) {
      throw new Error(
        `Clash Royale API responded with status: ${apiResponse.status}`
      );
    }

    const data = await apiResponse.json();

    // console.log("--- Successfully fetched data from API: ---");
    // console.log(data);
    console.log("------------------------------------------");
    console.log(data.name);
    console.log(data.arena.name);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch data from Clash Royale API." });
  }
});

module.exports = app;

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
