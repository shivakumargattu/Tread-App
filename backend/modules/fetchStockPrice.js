// File: backend/modules/fetchStockPrice.js
const axios = require("axios");

async function fetchStockPrice(symbol, range = "1d", interval = "5m", detailed = false) {
  try {
    const correctedSymbol = symbol.endsWith(".NS") ? symbol : symbol + ".NS";
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${correctedSymbol}?range=${range}&interval=${interval}`;
    console.log(`📊 Fetching chart: ${correctedSymbol}, range=${range}, interval=${interval}`);

    const response = await axios.get(url);
    const result = response.data.chart?.result?.[0];
    if (!result) {
      console.warn(`⚠️ No result returned for ${symbol}`);
      return null;
    }

    const { timestamp: timestamps, indicators, meta } = result;
    const prices = indicators?.quote?.[0]?.close;
    if (!timestamps || !prices) {
      console.warn(`⚠️ No chart data for ${symbol}`);
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
        : ts * 1000, // raw time for sparkline
      price: prices[i],
    })).filter(item => item.price !== null);

    if (detailed) {
      const lastClose = meta.previousClose;
      const currentPrice = meta.regularMarketPrice;

      return {
        symbol,
        lastClose,
        currentPrice,
        currency: meta.currency,
        chartData,
      };
    } else {
      return { chartData };
    }

  } catch (err) {
    console.error(`❌ fetchStockPrice error for ${symbol}:`, err.message);
    return null;
  }
}

module.exports = { fetchStockPrice };
