// backend/testNews.js
const { fetchNews } = require("./modules/newsFetcher");
const { analyzeSentiment } = require("./modules/sentimentAnalyzer");

async function run() {
  const stock = "Infosys";
  const headlines = await fetchNews(stock);

  console.log(`📰 Top Headlines for ${stock}:\n`);

  headlines.forEach((headline) => {
    const result = analyzeSentiment(headline);
    console.log(`- ${headline}`);
    console.log(`  → Sentiment: ${result.label} (${result.score})\n`);
  });
}

run();
