// File: backend/modules/fetchStockPrice.js
const axios = require("axios");

// 🔧 Toggle this to enable/disable logs
const DEBUG = false;

async function fetchStockPrice(symbol, range = "1d", interval = "5m", detailed = false) {
  try {
    const correctedSymbol = symbol.endsWith(".NS") ? symbol : symbol + ".NS";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${correctedSymbol}?range=${range}&interval=${interval}`;

    if (DEBUG) {
      console.log(`📊 Fetching chart: ${correctedSymbol}, range=${range}, interval=${interval}`);
    }

    const response = await axios.get(url);
    const result = response.data.chart?.result?.[0];
    if (!result) {
      if (DEBUG) console.warn(`⚠️ No result returned for ${symbol}`);
      return null;
    }

    const { timestamp: timestamps, indicators, meta } = result;
    const prices = indicators?.quote?.[0]?.close;

    if (!timestamps || !prices || !meta) {
      if (DEBUG) console.warn(`⚠️ Incomplete chart data for ${symbol}`);
      return null;
    }

    const chartData = timestamps.map((ts, i) => ({
      time: detailed
        ? new Date(ts * 1000).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
          })
        : ts * 1000,
      price: prices[i],
    })).filter(item => item.price !== null);

    const currentPrice = meta.regularMarketPrice;
    const lastClose = meta.previousClose;

    return detailed
      ? { symbol, lastClose, currentPrice, currency: meta.currency, chartData }
      : { chartData, currentPrice };

  } catch (err) {
    console.error(`❌ fetchStockPrice error for ${symbol}: ${err.message}`);
    return null;
  }
}

module.exports = { fetchStockPrice };
  
