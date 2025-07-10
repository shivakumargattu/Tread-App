// backend/index.js
require('dotenv').config();
const { fetchStockPrice } = require('./modules/priceFetcher');
const { fetchNiftyIndex } = require('./modules/nseIndex');

const stocks = ['RELIANCE', 'HDFCBANK', 'INFY']; // Removed ^NSEI (we use separate fetcher)

async function run() {
  for (const stock of stocks) {
    const data = await fetchStockPrice(stock);
    if (data) {
      console.log(`📈 ${data.symbol}: ₹${data.currentPrice} (Prev Close: ₹${data.lastClose})`);
    }
  }

  const nifty = await fetchNiftyIndex();
if (nifty) {
  const percent = nifty.percentChange ?? "N/A";
  console.log(`📊 ${nifty.index}: ₹${nifty.last} (Change: ${percent}%)`);
}
}

run();
