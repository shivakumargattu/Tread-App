// App.jsx
import React, { useState, useEffect } from "react";
import SignalList from "./components/SignalList";
import ThemeToggle from "./components/ThemeToggle";
<<<<<<< HEAD
import IndexTracker from "./components/IndexTracker/IndexTracker";
import SearchStock from "./components/SearchStock/SearchStock";
=======
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
<<<<<<< HEAD
        
        {/* Header with Title and Theme Toggle */}
=======
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            📈 Daily Stock Signals
          </h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
<<<<<<< HEAD

        {/* Market Index (Nifty, Sensex, Bank Nifty) */}
        <IndexTracker />

        {/* 🔍 Search Stocks */}
        <SearchStock />

        {/* 📊 Signal List */}
=======
>>>>>>> 8473e5219ee93fb22025729de8898db29731a915
        <SignalList />
      </div>
    </div>
  );
}

export default App;
