// backend/modules/signalEngine.js
const { fetchNews } = require("./newsFetcher");
const { analyzeSentiment } = require("./sentimentAnalyzer");
const { getTechnicalIndicators } = require("./technicals");
const { fetchStockPrice } = require("./fetchStockPrice");

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

  // 🧠 Sentiment analysis
  const scores = headlines.map(h => analyzeSentiment(h).score);
  const avgSentiment = scores.reduce((a, b) => a + b, 0) / scores.length;

  // 📉 Technical indicators
  const tech = await getTechnicalIndicators(symbol);
  if (!tech) return null;
  const { ema5, ema20, rsi, macd } = tech;

  // 📊 Chart + Price
  const { chartData, currentPrice } = await fetchStockPrice(symbol, "1d", "5m");
  if (!chartData || !currentPrice) return null;
  const targetPrice = parseFloat((currentPrice * 1.05).toFixed(2));

  // 💡 Signal Logic
  let signal = "Hold";
  let reason = "No strong signal — sentiment or trend unclear";

  if (avgSentiment > 0.4 && ema5 > ema20) {
    signal = "Buy";
    reason = "Positive news + Bullish EMA crossover";
  } else if (avgSentiment < -0.4 && ema5 < ema20) {
    signal = "Sell";
    reason = "Negative news + Bearish EMA crossover";
  }

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
    targetPrice
  };
}

module.exports = { generateSignal };
