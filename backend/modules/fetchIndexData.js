// backend/modules/fetchIndexData.js
const axios = require("axios");

async function fetchIndexData(symbol) {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
    );

    const result = response.data.chart.result?.[0];
    const meta = result?.meta;

    const open = meta?.chartPreviousClose || 0;
    const current = meta?.regularMarketPrice || 0;
    const change = current - open;
    const percentChange = ((change / open) * 100).toFixed(2);

    return {
      name: symbol,
      open,
      current,
      change,
      percentChange,
      status: change > 0 ? "up" : change < 0 ? "down" : "neutral",
    };
  } catch (err) {
    console.error(`❌ Error fetching index ${symbol}:`, err.message);
    return null;
  }
}

module.exports = { fetchIndexData };
