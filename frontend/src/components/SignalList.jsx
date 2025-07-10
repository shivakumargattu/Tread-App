import React, { useEffect, useState } from "react";
import axios from "axios";
import StockCard from "./StockCard";

function SignalList() {
  const [signals, setSignals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/signals")
      .then(res => {
        setSignals(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API error:", err.message);
        setLoading(false);
      });
  }, []);

  const handleFilter = (type) => {
    setActiveFilter(type);
    if (type === "All") {
      setFiltered(signals);
    } else {
      setFiltered(signals.filter(s => s.signal === type));
    }
  };

  const btnStyle = (type) =>
    `px-4 py-2 rounded-full font-medium border ${
      activeFilter === type ? "bg-blue-600 text-white" : "bg-white text-gray-600 border-gray-300"
    }`;

  if (loading) return <p className="text-center mt-10">Loading signals...</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
        📈 Daily Stock Signals
      </h1>

      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {["All", "Buy", "Sell", "Hold"].map((type) => (
          <button key={type} onClick={() => handleFilter(type)} className={btnStyle(type)}>
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No signals found.</p>
        ) : (
          filtered.map((stock, i) => <StockCard key={i} stock={stock} />)
        )}
      </div>
    </div>
  );
}

export default SignalList;
