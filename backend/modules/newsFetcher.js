// backend/modules/newsFetcher.js
const axios = require("axios");

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
    console.error("News fetch error:", error.message);
    return [];
  }
}

module.exports = { fetchNews };
