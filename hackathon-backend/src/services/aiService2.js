// src/services/aiService2.js
import axios from "axios";

const LLM_STUDIO_URL =
    process.env.LLM_STUDIO_URL ||
    "https://lance-exhibitions-thru-antarctica.trycloudflare.com";

const MODEL_ID = "qwen/qwen2.5-vl-7b";

/**
 * Analyze an uploaded image for fraud / spam / misleading content
 * using the LLM Studio Qwen2.5-VL vision model (OpenAI-compatible API).
 *
 * @param {Buffer} imageBuffer – raw image bytes (from multer memoryStorage)
 * @param {string} mimeType    – e.g. "image/png", "image/jpeg"
 * @returns {object} structured analysis result
 */
export const analyzeImageWithAI = async (imageBuffer, mimeType = "image/png") => {
    try {
        //console.log("Hitting AI Service at:", `${LLM_STUDIO_URL}/v1/chat/completions`);
        const base64Image = imageBuffer.toString("base64");
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        const response = await axios.post(
            `${LLM_STUDIO_URL}/v1/chat/completions`,
            {
                model: MODEL_ID,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image_url",
                                image_url: { url: dataUrl }
                            },
                            {
                                type: "text",
                                text: `You are an AI fraud & spam detection system.
Analyze the provided image carefully for manipulation, fraud, or spam.

Return ONLY a valid JSON object strictly matching this schema:
- manipulation_score: number 0-100 (degree of fraud/manipulation)
- emotional_intensity: number 0-100 (how much it targets emotions)
- bias_type: string (e.g., "financial scam", "misinformation", "none")
- propaganda_techniques: array of strings (red flags or tactics used)
- sentiment: "positive", "neutral", "negative"
- risk_level: "low", "medium", "high", "critical"

Analyze the image and return the JSON only.`
                            }
                        ]
                    }
                ],
                max_tokens: 1024,
                temperature: 0.2
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 120000 // 2 min — vision models can be slow
            }
        );

        const rawText = response.data?.choices?.[0]?.message?.content ?? "";

        // Extract JSON from the response (model may wrap in ```json ... ```)
        let jsonStr = rawText;
        const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
        }

        let aiResult;
        try {
            aiResult = JSON.parse(jsonStr);
        } catch (parseErr) {
            console.error("Failed to parse LLM Studio response as JSON:", rawText);
            throw new Error("Invalid AI JSON response from image analysis");
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
        aiResult.bias_type = aiResult.bias_type || "none";

        return aiResult;
    } catch (error) {
        console.error("LLM Studio API Error:", error?.response?.data || error.message);
        throw new Error("LLM Studio API Error: " + (error?.response?.data?.error?.message || error.message));
    }
};
