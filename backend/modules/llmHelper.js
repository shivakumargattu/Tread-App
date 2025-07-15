// backend/modules/llmHelper.js
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

async function getLLMSummary(headlines) {
  const prompt = `Summarize the following stock news headlines into one simple summary:\n${headlines.join("\n")}`;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.7,
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { getLLMSummary };
