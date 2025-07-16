const { fetchNews } = require("./newsFetcher");
const { analyzeSentiment } = require("./sentimentAnalyzer");
const { getTechnicalIndicators } = require("./technicals");
const { fetchStockPrice } = require("./fetchStockPrice");

async function generateSignal(symbol) {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Invalid symbol provided.");
    }

    // 1️⃣ Fetch News Headlines
    const headlines = await fetchNews(symbol);
    if (!headlines || headlines.length === 0) return null;

    // 2️⃣ Sentiment Analysis
    const scores = headlines.map(h => analyzeSentiment(h).score);
    const avgSentiment = scores.reduce((a, b) => a + b, 0) / scores.length;

    // 3️⃣ Technical Indicators
    const tech = await getTechnicalIndicators(symbol);
    if (!tech) return null;
    const { ema5, ema20, rsi, macd } = tech;

    // 4️⃣ Chart Data and Current Price
    const { chartData, currentPrice } = await fetchStockPrice(symbol, "1d", "5m");
    if (!chartData || !currentPrice) return null;
    const targetPrice = parseFloat((currentPrice * 1.05).toFixed(2));

    // 5️⃣ Signal Logic
    let signal = "Hold";
    let reason = "Neutral sentiment or unclear technicals";
    let confidence = 50; // Out of 100

    if (avgSentiment > 0.4 && ema5 > ema20 && rsi < 70 && macd.histogram > 0) {
      signal = "Buy";
      reason = "Positive news + Bullish EMA crossover + RSI < 70 + MACD > 0";
      confidence = 80;
    } else if (avgSentiment < -0.4 && ema5 < ema20 && rsi > 30 && macd.histogram < 0) {
      signal = "Sell";
      reason = "Negative news + Bearish EMA crossover + RSI > 30 + MACD < 0";
      confidence = 80;
    }

    // Debug Log (optional)
    // console.log({ symbol, avgSentiment, ema5, ema20, rsi, macd, currentPrice });

    return {
      symbol,
      signal,
      reason,
      confidence,
      sentimentScore: avgSentiment.toFixed(2),
      rsi: parseFloat(rsi.toFixed(2)),
      ema5: parseFloat(ema5.toFixed(2)),
      ema20: parseFloat(ema20.toFixed(2)),
      macd,
      headlines,
      chartData,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      targetPrice
    };
  } catch (error) {
    console.error("Error generating signal:", error.message);
    return null;
  }
}

module.exports = { generateSignal };
