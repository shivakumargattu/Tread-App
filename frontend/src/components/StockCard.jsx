import React from "react";

function StockCard({ stock }) {
  const { symbol, signal, reason, rsi, ema5, ema20, sentimentScore, headlines } = stock;

  const signalStyles = {
    Buy: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-600",
    Sell: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-600",
    Hold: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-500",
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 hover:shadow-lg transition-all min-h-[320px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg md:text-xl font-semibold">{symbol}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${signalStyles[signal]}`}>
          {signal}
        </span>
      </div>

      <p className="text-xs sm:text-sm italic mb-4">🧠 {reason}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm mb-4">
        <p>📊 RSI: <strong>{rsi}</strong></p>
        <p>📈 EMA-5: ₹<strong>{ema5}</strong></p>
        <p>📉 EMA-20: ₹<strong>{ema20}</strong></p>
        <p>💬 Sentiment: <strong>{sentimentScore}</strong></p>
      </div>

      <div>
        <p className="font-semibold mb-1">📰 Top News:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          {headlines.slice(0, 3).map((headline, index) => (
            <li key={index}>{headline}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StockCard;
