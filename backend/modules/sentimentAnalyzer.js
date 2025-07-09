// backend/modules/sentimentAnalyzer.js
const vader = require("vader-sentiment");

function analyzeSentiment(text) {
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  let label = "Neutral";

  if (intensity.compound >= 0.4) label = "Positive";
  else if (intensity.compound <= -0.4) label = "Negative";

  return {
    score: intensity.compound,
    label,
  };
}

module.exports = { analyzeSentiment };
