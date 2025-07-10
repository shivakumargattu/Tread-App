// modules/nseIndex.js
const axios = require("axios");

async function fetchNiftyIndex() {
  try {
    const res = await axios.get("https://www.nseindia.com/api/marketStatus", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const nifty = res.data.marketState.find(
      (item) => item.index === "NIFTY 50"
    );

    return {
      index: nifty.index,
      last: nifty.last,
      change: nifty.change,
      percentChange: nifty.pChange,
    };
  } catch (error) {
    console.log("Nifty index fetch error:", error.message);
    return null;
  }
}

module.exports = { fetchNiftyIndex };
