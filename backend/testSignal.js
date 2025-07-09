// backend/testSignal.js
const { generateSignal } = require('./modules/signalEngine');

async function run() {
  const symbol = 'INFY'; // Try RELIANCE, SBIN, etc
  const result = await generateSignal(symbol);

  if (!result) {
    console.log("❌ Signal could not be generated.");
    return;
  }

  console.log(`📊 ${result.symbol} Signal: ${result.signal}`);
  console.log(`🧠 Reason: ${result.reason}`);
  console.log(`💬 Avg Sentiment Score: ${result.sentimentScore}`);
  console.log(`📈 EMA-5: ₹${result.ema5} | EMA-20: ₹${result.ema20}`);
  console.log(`📉 RSI: ${result.rsi}`);
  console.log(`📰 Headlines:`);
  result.headlines.forEach(h => console.log(`- ${h}`));
}

run();
