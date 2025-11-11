import Detection from "../models/Detection.js";
import { TextAnalyzer } from "../utils/analyzeText.js";

export const detectText = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        error: "Text to long (max 10000 characters)",
      });
    }

    // Analyze text
    const analysis = TextAnalyzer.analyzeText(text);

    // Save detection to history
    const detection = new Detection({
      user: req.user._id,
      text: text.substring(0, 500),
      aiProbability: analysis.aiProbability,
      metrics: analysis.metrics, // This now has the new metric names
      wordCount: analysis.wordCount,
      characters: analysis.characters,
    });

    await detection.save();

    res.json({
      detection: {
        id: detection._id,
        aiProbability: analysis.aiProbability,
        metrics: analysis.metrics,
        wordCount: analysis.wordCount,
        characters: analysis.characters,
        timestamp: detection.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
