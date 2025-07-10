// backend/server.js
const express = require("express");
const cors = require("cors");
const { generateSignal } = require("./modules/signalEngine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("📡 Stock Signal API is running");
});

// 1️⃣ Single stock signal
app.get("/api/signal/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const result = await generateSignal(symbol);
    if (!result) return res.status(404).json({ error: "Unable to generate signal" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2️⃣ Multiple stocks
app.get("/api/signals", async (req, res) => {
  const watchlist = ["RELIANCE", "INFY", "HDFCBANK"];
  try {
    const results = await Promise.all(
      watchlist.map(symbol => generateSignal(symbol))
    );
    res.json(results.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch signals" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`);
});
