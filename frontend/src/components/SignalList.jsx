import React, { useEffect, useState } from "react";
import axios from "axios";
import StockCard from "./StockCard";

function SignalList() {
  const [signals, setSignals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/signals");
        setSignals(res.data);
        setFiltered(res.data);
        setLoading(false);
      } catch (err) {
        console.error("🚨 API error:", err.message);
        setError("Failed to fetch stock signals.");
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const handleFilter = (type) => {
    setActiveFilter(type);
    if (type === "All") {
      setFiltered(signals);
    } else {
      setFiltered(signals.filter((s) => s.signal === type));
    }
  };

  const btnStyle = (type) =>
    `px-4 py-2 rounded-full font-medium border transition ${
      activeFilter === type
        ? "bg-blue-600 text-white border-blue-700"
        : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
    }`;

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
        ⏳ Loading signals...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* 🔍 Filter Buttons */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {["All", "Buy", "Sell", "Hold"].map((type) => (
          <button key={type} onClick={() => handleFilter(type)} className={btnStyle(type)}>
            {type}
          </button>
        ))}
      </div>

      {/* 📈 Stock Signal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No stock signals found for <strong>{activeFilter}</strong>.
          </p>
        ) : (
          filtered.map((stock, index) => <StockCard key={index} stock={stock} />)
        )}
      </div>
    </div>
  );
}

export default SignalList;
