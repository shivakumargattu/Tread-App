<<<<<<< HEAD
// backend/modules/signalEngine.js
const { fetchNews } = require("./newsFetcher");
const { analyzeSentiment } = require("./sentimentAnalyzer");
const { getTechnicalIndicators } = require("./technicals");
const { fetchStockPrice } = require("./fetchStockPrice");
=======
const { fetchNews } = require('./newsFetcher');
const { analyzeSentiment } = require('./sentimentAnalyzer');
const { getTechnicalIndicators } = require('./technicals');
const { fetchStockPrice } = require('./priceFetcher');
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

<<<<<<< HEAD
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

=======
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

>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
  return {
    symbol,
    signal,
    reason,
    sentimentScore: avgSentiment.toFixed(2),
<<<<<<< HEAD
    rsi,
    ema5,
    ema20,
    macd,
    headlines,
    chartData,
    currentPrice: currentPrice.toFixed(2),
    targetPrice,
=======
    rsi: tech.rsi,
    ema5: tech.ema5,
    ema20: tech.ema20,
    macd: tech.macd,
    headlines,
    chartData, // ✅ Now it’s correctly fetched and returned
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
  };
}

module.exports = { generateSignal };
<<<<<<< HEAD
  
=======
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
