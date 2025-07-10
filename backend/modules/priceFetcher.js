const axios = require("axios");

async function fetchStockPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=5m&range=1d`;
    const response = await axios.get(url);

    const result = response.data.chart.result?.[0];
    if (!result) {
      console.warn(`⚠️ No result returned for ${symbol}`);
      return null;
    }

    const meta = result.meta;
    const timestamps = result.timestamp;
    const prices = result.indicators?.quote?.[0]?.close;

    const lastClose = meta.previousClose;
    const currentPrice = meta.regularMarketPrice;

    console.log(`➡️ ${symbol} fetched:`);
    console.log(`Timestamps: ${timestamps?.length}, Prices: ${prices?.length}`);

  

    let chartData = [];

if (timestamps && prices) {
  chartData = timestamps.map((ts, index) => {
    const date = new Date(ts * 1000);
    return {
      time: date.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        day: "2-digit",
        month: "short",
      }),
      price: prices[index],
    };
  }).filter((d) => d.price !== null);
}
 else {
      console.warn(`⚠️ No chart data for ${symbol}`);
    }

    console.log(`📉 Chart Data Points for ${symbol}: ${chartData.length}`);

    return {
      symbol,
      lastClose,
      currentPrice,
      currency: meta.currency,
      chartData,
    };
  } catch (error) {
    console.error(`❌ Error fetching price for ${symbol}:`, error.message);
    return null;
  }
}

module.exports = { fetchStockPrice };
