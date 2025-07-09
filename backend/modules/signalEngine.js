// backend/modules/signalEngine.js
const { fetchNews } = require('./newsFetcher');
const { analyzeSentiment } = require('./sentimentAnalyzer');
const { getTechnicalIndicators } = require('./technicals');

async function generateSignal(symbol) {
  const headlines = await fetchNews(symbol);
  if (!headlines || headlines.length === 0) return null;

  // Sentiment: analyze each headline
  const sentiments = headlines.map(h => analyzeSentiment(h).score);
  const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

  // Technicals
  const tech = await getTechnicalIndicators(symbol);
  if (!tech) return null;

  // Logic
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
  };
}

module.exports = { generateSignal };
