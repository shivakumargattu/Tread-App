const { fetchNews } = require('./newsFetcher');
const { analyzeSentiment } = require('./sentimentAnalyzer');
const { getTechnicalIndicators } = require('./technicals');
const { fetchStockPrice } = require('./priceFetcher');

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

  // Sentiment
  const sentiments = headlines.map(h => analyzeSentiment(h).score);
  const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

  // Technicals
  const tech = await getTechnicalIndicators(symbol);
  if (!tech) return null;

  // Chart Data (✅ This was missing)
  const priceData = await fetchStockPrice(symbol);
  if (!priceData || !priceData.chartData) return null;
  const { chartData } = priceData;

  // Signal Logic
  let signal = "Hold";
  let reason = "";

  const ema5 = parseFloat(tech.ema5);
  const ema20 = parseFloat(tech.ema20);

  if (avgSentiment > 0.4 && ema5 > ema20) {
    signal = "Buy";
    reason = "Positive news + Bullish EMA crossover";
  } else if (avgSentiment < -0.4 && ema5 < ema20) {
    signal = "Sell";
    reason = "Negative news + Bearish EMA crossover";
  } else {
    signal = "Hold";
    reason = "No strong signal — sentiment or trend unclear";
  }

  return {
    symbol,
    signal,
    reason,
    sentimentScore: avgSentiment.toFixed(2),
    rsi: tech.rsi,
    ema5: tech.ema5,
    ema20: tech.ema20,
    macd: tech.macd,
    headlines,
    chartData, // ✅ Now it’s correctly fetched and returned
  };
}

module.exports = { generateSignal };
