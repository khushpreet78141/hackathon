import { extractTextFromImage } from "../services/visionService.js";
import { analyzeWithAI } from "../services/aiService.js";
import Analysis from "../models/analysis.js";
import User from "../models/user.js";
import { updateTrend } from "../services/trendService.js";

/**
 * POST /api/image-analysis
 * Accepts a multipart image upload, extracts text via Gemini Vision,
 * runs manipulation analysis via Gemini AI, and optionally saves to DB.
 */
export const analyzeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded. Send a file with field name 'image'."
            });
        }

        // Step 1: Extract text from image using Gemini Vision
        const extractedText = await extractTextFromImage(req.file.buffer);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Could not extract any text from the image."
            });
        }

        // Step 2: Analyze extracted text using Gemini AI (aiService)
        const aiResult = await analyzeWithAI(extractedText);

        let responseData = {
            extractedText,
            ...aiResult
        };

        // Save to database only if user is logged in
        if (req.user) {
            const analysis = await Analysis.create({
                userId: req.user._id,
                originalText: extractedText.substring(0, 3000),
                manipulationScore: aiResult.manipulation_score,
                emotionalIntensity: aiResult.emotional_intensity,
                biasType: aiResult.bias_type,
                propagandaTechniques: aiResult.propaganda_techniques,
                sentiment: aiResult.sentiment,
                riskLevel: aiResult.risk_level
            });

            // Update user stats
            await User.findByIdAndUpdate(req.user._id, { $inc: { totalAnalyses: 1 } });

            // Update daily trend
            await updateTrend(req.user._id, aiResult.manipulation_score, aiResult.emotional_intensity);

            responseData = {
                extractedText,
                analysis
            };
        }

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        next(error);
    }
};
