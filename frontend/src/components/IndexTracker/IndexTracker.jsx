// frontend/src/components/IndexTracker/IndexTracker.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const indexLabels = {
  "^NSEI": "Nifty 50",
  "^BSESN": "Sensex",
  "^NSEBANK": "Bank Nifty"
};

function IndexTracker() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/indices`);
        setIndices(res.data);
      } catch (err) {
        console.error("Failed to fetch index data:", err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 mb-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">📈 Market Indexes</h2>
      <div className="flex flex-wrap gap-4">
        {indices.map((index) => (
          <div
            key={index.name}
            className={`flex-1 p-3 rounded-lg shadow text-sm font-medium
              ${index.status === "up"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
          >
            <p className="font-semibold">{indexLabels[index.name]}</p>
            <p>Open: ₹{index.open}</p>
            <p>Current: ₹{index.current}</p>
            <p>
              {index.status === "up" ? "🔼" : "🔽"} {index.percentChange}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndexTracker;
