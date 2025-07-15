// File: backend/server.js
const express = require("express");
const cors = require("cors");
const { generateSignal } = require("./modules/signalEngine");
const { fetchStockPrice } = require("./modules/fetchStockPrice");
const { fetchIndexData } = require("./modules/fetchIndexData");
const stockList = require("./data/nseStocks.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("📡 Stock Signal API running");
});

// ✅ GET /api/signals — Top 10 BUY & SELL from stockList
app.get("/api/signals", async (req, res) => {
  try {
    const allSignals = await Promise.all(
      stockList.map((symbol) => generateSignal(symbol))
    );

    const validSignals = allSignals.filter(Boolean);

    const buySignals = validSignals
      .filter((s) => s.signal === "Buy")
      .sort((a, b) => b.sentimentScore - a.sentimentScore)
      .slice(0, 10);

    const sellSignals = validSignals
      .filter((s) => s.signal === "Sell")
      .sort((a, b) => a.sentimentScore - b.sentimentScore)
      .slice(0, 10);

    res.json([...buySignals, ...sellSignals]);
  } catch (err) {
    console.error("❌ Error in /api/signals", err.message);
    res.status(500).json({ error: "Failed to fetch signals" });
  }
});

// ✅ GET /api/chartdata?symbol=TCS&range=1d&interval=5m — for mini chart
app.get("/api/chartdata", async (req, res) => {
  const { symbol, range = "1d", interval = "5m" } = req.query;
  try {
    const chartData = await fetchStockPrice(symbol, range, interval);
    if (!chartData) return res.status(500).json({ error: "Chart fetch failed" });
    res.json(chartData);
  } catch (e) {
    console.error("❌ Error in /api/chartdata:", e.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /api/stock?symbol=TCS — for single stock detailed search
app.get("/api/stock", async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: "Missing symbol" });

  try {
    const result = await generateSignal(symbol.toUpperCase());
    if (!result) return res.status(404).json({ error: "No signal found" });
    res.json(result);
  } catch (err) {
    console.error("❌ Error in /api/stock:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// ✅ GET /api/indices — Nifty, Sensex, Bank Nifty live data
app.get("/api/indices", async (req, res) => {
  const symbols = ["^NSEI", "^BSESN", "^NSEBANK"];
  try {
    const data = await Promise.all(symbols.map(fetchIndexData));
    res.json(data.filter(Boolean));
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch index data" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server at http://localhost:${PORT}`);
});
