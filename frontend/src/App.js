// src/App.js
import React from "react";
import SignalList from "./components/SignalList";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-300">
      <ThemeToggle />
      <SignalList />
    </div>
  );
}

export default App;
