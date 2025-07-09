// backend/modules/priceFetcher.js
const axios = require('axios');

async function fetchStockPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1m&range=1d`;
    const response = await axios.get(url);

    const result = response.data.chart.result[0];
    const meta = result.meta;
    const lastClose = meta.previousClose;
    const currentPrice = meta.regularMarketPrice;

    return {
      symbol,
      lastClose,
      currentPrice,
      currency: meta.currency
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error.message);
    return null;
  }
}

module.exports = { fetchStockPrice };
