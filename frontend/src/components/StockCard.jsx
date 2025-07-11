import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

function StockCard({ stock }) {
  const {
    symbol,
    signal,
    reason,
    rsi,
    ema5,
    ema20,
    sentimentScore,
    headlines,
  } = stock;

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("1d");
  const [interval, setInterval] = useState("5m");

  const signalStyles = {
    Buy: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-600",
    Sell: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-600",
    Hold: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-500",
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/chartdata?symbol=${symbol}&range=${range}&interval=${interval}`
        );
        const rawData = Array.isArray(res.data)
          ? res.data
          : res.data.chartData || [];

        const formatted = rawData.map((point) => ({
          ...point,
          timeLabel: new Date(point.time).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }));
        setChartData(formatted);
      } catch (err) {
        console.error(`❌ Chart fetch error for ${symbol}:`, err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, range, interval]);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 hover:shadow-lg transition-all min-h-[350px] flex flex-col justify-between">
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

      {/* 🔽 Range & Interval Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 text-sm mb-4">
        <label>
          ⏳ Range:
          <select
            className="ml-2 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded px-2 py-1"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="1d">1d</option>
            <option value="5d">5d</option>
            <option value="1mo">1mo</option>
            <option value="3mo">3mo</option>
          </select>
        </label>

        <label>
          🕒 Interval:
          <select
            className="ml-2 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded px-2 py-1"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="1d">1d</option>
          </select>
        </label>
      </div>

      {/* 📉 Mini Chart */}
      <div className="h-32 my-4">
        {loading ? (
          <p className="text-sm italic text-center text-gray-400">⏳ Loading chart...</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(label) => `🕒 ${label}`}
                formatter={(value) => [`₹${value?.toFixed(2)}`, "Price"]}
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                labelStyle={{ color: "#d1d5db" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm italic text-center text-red-400">⚠️ No chart data</p>
        )}
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
