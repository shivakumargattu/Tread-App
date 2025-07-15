// backend/modules/llmAdvisor.js
const axios = require("axios");

async function getLLMAdvice({ symbol, headlines, sentimentScore, rsi, ema5, ema20, macd }) {
  const prompt = `
You are a stock trading assistant.
Here is the data for stock ${symbol}:
- Sentiment Score: ${sentimentScore}
- RSI: ${rsi}
- EMA(5): ${ema5}
- EMA(20): ${ema20}
- MACD: ${macd}
- Recent News Headlines: ${headlines.slice(0, 3).join(" | ")}

Based on the data, provide a 1-2 sentence recommendation for a retail investor (e.g., "Buy now", "Hold for now", "Avoid - negative news").

Be concise and actionable.
`;

  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("LLM advice error:", error.message);
    return "No LLM recommendation available.";
  }
}

module.exports = { getLLMAdvice };
