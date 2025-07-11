// backend/modules/signalEngine.js
const { fetchNews } = require("./newsFetcher");
const { analyzeSentiment } = require("./sentimentAnalyzer");
const { getTechnicalIndicators } = require("./technicals");
const { fetchStockPrice } = require("./fetchStockPrice");

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

  const scores = headlines.map(h => analyzeSentiment(h).score);
  const avgSentiment = scores.reduce((a, b) => a + b, 0) / scores.length;

  const tech = await getTechnicalIndicators(symbol);
  if (!tech) return null;

  const { ema5, ema20, rsi, macd } = tech;

  let signal = "Hold", reason = "No strong signal";
  if (avgSentiment > 0.4 && ema5 > ema20) {
    signal = "Buy";
    reason = "Positive news + EMA crossover";
  } else if (avgSentiment < -0.4 && ema5 < ema20) {
    signal = "Sell";
    reason = "Negative news + EMA crossover";
  }

  // 🟢 Get chart and current price
  const { chartData, currentPrice } = await fetchStockPrice(symbol, "1d", "5m");
  if (!chartData || !currentPrice) return null;

  // 🎯 Calculate 5% target above current price
  const targetPrice = parseFloat((currentPrice * 1.05).toFixed(2));

  return {
    symbol,
    signal,
    reason,
    sentimentScore: avgSentiment.toFixed(2),
    rsi,
    ema5,
    ema20,
    macd,
    headlines,
    chartData,
    currentPrice: currentPrice.toFixed(2),
    targetPrice,
  };
}

module.exports = { generateSignal };
  