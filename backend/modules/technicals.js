// backend/modules/technicals.js
const axios = require("axios");
const ti = require("technicalindicators");

async function fetchHistoricalData(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=3mo&interval=1d`;
  try {
    const res = await axios.get(url);
    const data = res.data.chart.result[0];
    return {
      close: data.indicators.quote[0].close,
      timestamps: data.timestamp,
    };
  } catch (err) {
    console.error(`Error fetching data for ${symbol}:`, err.message);
    return null;
  }
}

function getRSI(closes, period = 14) {
  return ti.RSI.calculate({ values: closes, period }).pop();
}

function getEMA(closes, period = 20) {
  return ti.EMA.calculate({ values: closes, period }).pop();
}

function getMACD(closes) {
  const result = ti.MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });
  return result.pop();
}

async function getTechnicalIndicators(symbol) {
  const data = await fetchHistoricalData(symbol);
  if (!data) return null;

  const rsi = getRSI(data.close);
  const ema5 = getEMA(data.close, 5);
  const ema20 = getEMA(data.close, 20);
  const macd = getMACD(data.close);

  return {
    symbol,
    rsi: rsi?.toFixed(2),
    ema5: ema5?.toFixed(2),
    ema20: ema20?.toFixed(2),
    macd: {
      MACD: macd?.MACD?.toFixed(2),
      signal: macd?.signal?.toFixed(2),
      histogram: macd?.histogram?.toFixed(2),
    },
  };
}

module.exports = { getTechnicalIndicators };
