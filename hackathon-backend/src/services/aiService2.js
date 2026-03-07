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
Analyze the provided image carefully and determine whether it is:
- "fraud"       – fake documents, forged IDs, phishing pages, counterfeit items
- "spam"        – unsolicited ads, clickbait, scam promotions
- "misleading"  – doctored / manipulated photos, out-of-context imagery, deepfakes
- "legitimate"  – genuine, non-manipulated, harmless content

Return ONLY a valid JSON object (no markdown, no explanation outside JSON) with exactly these keys:
{
  "verdict": "fraud" | "spam" | "misleading" | "legitimate",
  "confidence": <number 0-100>,
  "risk_level": "low" | "medium" | "high" | "critical",
  "explanation": "<one-paragraph reason>",
  "red_flags": ["<flag1>", "<flag2>"]
}
If the image is legitimate, red_flags should be an empty array.`
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
            // Return a safe fallback so the endpoint doesn't crash
            aiResult = {
                verdict: "unknown",
                confidence: 0,
                risk_level: "medium",
                explanation: "The AI model returned an unparseable response.",
                red_flags: [],
                raw_response: rawText
            };
        }

        // Normalize / clamp values
        const validVerdicts = ["fraud", "spam", "misleading", "legitimate"];
        aiResult.verdict = validVerdicts.includes(aiResult.verdict?.toLowerCase())
            ? aiResult.verdict.toLowerCase()
            : "unknown";

        aiResult.confidence = Math.min(
            Math.max(Number(aiResult.confidence) || 0, 0),
            100
        );

        const validRisks = ["low", "medium", "high", "critical"];
        aiResult.risk_level = validRisks.includes(aiResult.risk_level?.toLowerCase())
            ? aiResult.risk_level.toLowerCase()
            : "medium";

        aiResult.red_flags = Array.isArray(aiResult.red_flags)
            ? aiResult.red_flags
            : [];

        return aiResult;
    } catch (error) {
        console.error("LLM Studio API Error:", error?.response?.data || error.message);
        throw new Error("LLM Studio API Error: " + (error?.response?.data?.error?.message || error.message));
    }
};
