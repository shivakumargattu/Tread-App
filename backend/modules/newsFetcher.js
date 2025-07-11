// backend/modules/newsFetcher.js
const axios = require("axios");

<<<<<<< HEAD
// 📰 Fetch top 5 news headlines for a stock
=======
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
async function fetchNews(stockName) {
  try {
    const response = await axios.get(
      `https://news.google.com/rss/search?q=${stockName}+stock+india`
    );

    const xml = response.data;
    const headlines = [...xml.matchAll(/<title>(.*?)<\/title>/g)]
      .map((match) => match[1])
      .filter((title) => !title.toLowerCase().includes("google news")); // remove default headline

    return headlines.slice(0, 5); // return top 5 headlines
  } catch (error) {
<<<<<<< HEAD
    console.error("❌ News fetch error:", error.message);
=======
    console.error("News fetch error:", error.message);
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
    return [];
  }
}

<<<<<<< HEAD
// 🔥 Fetch trending Indian stocks from Yahoo Finance
async function getTrendingStocks(limit = 10) {
  const url = `https://query1.finance.yahoo.com/v1/finance/trending/IN`;

  try {
    const res = await axios.get(url);
    const symbols = res.data.finance.result[0]?.quotes.map(q => q.symbol);

    // Filter to Indian NSE stocks like RELIANCE.NS → RELIANCE
    const indianStocks = symbols
      .filter(sym => sym.endsWith(".NS"))
      .map(s => s.replace(".NS", ""));

    return indianStocks.slice(0, limit); // Return top N trending
  } catch (err) {
    console.error("❌ Failed to fetch trending stocks:", err.message);
    return ["RELIANCE", "INFY", "HDFCBANK"]; // fallback list
  }
}

module.exports = { fetchNews, getTrendingStocks };
=======
module.exports = { fetchNews };
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
