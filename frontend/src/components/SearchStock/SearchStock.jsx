import React, { useState } from "react";
import axios from "axios";
import StockCard from "../StockCard"

function SearchStock() {
  const [symbol, setSymbol] = useState("");
  const [stock, setStock] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    const inputSymbol = symbol.trim().toUpperCase(); 
    setStock(null);

    if (!inputSymbol.trim()) {
      setError("Please enter a stock symbol");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/stock?symbol=${symbol}`
      );
      setStock(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch stock data. Try again."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., TCS)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="text-red-600 mb-2 dark:text-red-400">{error}</p>
      )}

      {stock && (
        <div className="mt-4">
          <StockCard stock={stock} />
        </div>
      )}
    </div>
  );
}

export default SearchStock;
