// backend/modules/signalEngine.js
const { fetchNews } = require("./newsFetcher");
const { analyzeSentiment } = require("./sentimentAnalyzer");
const { getTechnicalIndicators } = require("./technicals");
const { fetchStockPrice } = require("./fetchStockPrice");

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

  const scores = headlines.map(h => analyzeSentiment(h).score);
  const avgSentiment = scores.reduce((a, b) => a + b) / scores.length;

  const tech = await getTechnicalIndicators(symbol);
  if (!tech) return null;

  let signal = "Hold", reason = "No strong signal";
  const ema5 = parseFloat(tech.ema5), ema20 = parseFloat(tech.ema20);

  if (avgSentiment > 0.4 && ema5 > ema20) {
    signal = "Buy";
    reason = "Positive news + EMA crossover";
  } else if (avgSentiment < -0.4 && ema5 < ema20) {
    signal = "Sell";
    reason = "Negative news + EMA crossover";
  }

  const chartData = await fetchStockPrice(symbol, "1d", "5m");

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
    chartData,
  };
}

module.exports = { generateSignal };
