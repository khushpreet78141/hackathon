// src/services/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
});

export const analyzeWithAI = async (text) => {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an AI system that detects manipulation, propaganda, and emotional influence in text.

Return JSON strictly matching this schema:
- manipulation_score: number 0-100
- emotional_intensity: number 0-100
- bias_type: string
- propaganda_techniques: array of strings
- sentiment: "positive", "neutral", "negative"
- risk_level: "low", "medium", "high", "critical"
- explanation: string (a detailed paragraph explaining the analysis — why it is or isn't manipulative, what techniques were found, and advice for the reader)

Analyze the following text:

TEXT:
${text}
`
            }
          ]
        }
      ],
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: {
          type: "object",
          properties: {
            manipulation_score: { type: "number" },
            emotional_intensity: { type: "number" },
            bias_type: { type: "string" },
            propaganda_techniques: { type: "array", items: { type: "string" } },
            sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
            risk_level: { type: "string", enum: ["low", "medium", "high", "critical"] },
            explanation: { type: "string" }
          },
          required: [
            "manipulation_score",
            "emotional_intensity",
            "bias_type",
            "propaganda_techniques",
            "sentiment",
            "risk_level",
            "explanation"
          ]
        }
      }
    });

    const responseText = result.response.text();

    // Safe JSON parsing
    let aiResult;
    try {
      aiResult = JSON.parse(responseText);
    } catch (err) {
      console.error("Invalid JSON from Gemini:", responseText);
      throw new Error("Invalid AI JSON response");
    }

    // Normalize values to match Analysis schema
    const riskMap = {
      low: "Low",
      medium: "Moderate",
      high: "High",
      critical: "Extreme"
    };
    const sentimentEnum = ["positive", "neutral", "negative"];

    aiResult.risk_level = riskMap[aiResult.risk_level?.toLowerCase()] || "Moderate";
    aiResult.sentiment = sentimentEnum.includes(aiResult.sentiment?.toLowerCase())
      ? aiResult.sentiment.toLowerCase()
      : "neutral";
    aiResult.propaganda_techniques = Array.isArray(aiResult.propaganda_techniques)
      ? aiResult.propaganda_techniques
      : [];
    aiResult.manipulation_score = Math.min(Math.max(Number(aiResult.manipulation_score) || 0, 0), 100);
    aiResult.emotional_intensity = Math.min(Math.max(Number(aiResult.emotional_intensity) || 0, 0), 100);

    return aiResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini API Error");
  }
};