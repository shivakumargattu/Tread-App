// backend/testTechnicals.js
const { getTechnicalIndicators } = require("./modules/technicals");

async function run() {
  const symbol = "INFY";
  const result = await getTechnicalIndicators(symbol);

  if (!result) return console.log("❌ Unable to get indicators");

  console.log(`📊 Technicals for ${result.symbol}`);
  console.log(`- RSI: ${result.rsi}`);
  console.log(`- EMA-5: ₹${result.ema5}`);
  console.log(`- EMA-20: ₹${result.ema20}`);
  console.log(`- MACD: ${JSON.stringify(result.macd)}`);

  if (parseFloat(result.ema5) > parseFloat(result.ema20)) {
    console.log(`🔼 Bullish Crossover (EMA-5 > EMA-20)`);
  } else {
    console.log(`🔽 Bearish Crossover (EMA-5 < EMA-20)`);
  }
}

run();
