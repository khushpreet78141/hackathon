import { extractTextFromImage, describeImage } from "../services/visionService.js";
import { analyzeWithAI } from "../services/aiService.js";
import Analysis from "../models/analysis.js";
import User from "../models/user.js";
import { updateTrend } from "../services/trendService.js";

/**
 * POST /api/image-analysis
 * Accepts a multipart image upload, describes the image via Gemini Vision,
 * extracts text, runs manipulation analysis, and optionally saves to DB.
 */
export const analyzeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded. Send a file with field name 'image'."
            });
        }

        const mimeType = req.file.mimetype || "image/png";

        // Step 1: Describe the image and extract text in parallel
        const [imageDescription, extractedText] = await Promise.all([
            describeImage(req.file.buffer, mimeType),
            extractTextFromImage(req.file.buffer, mimeType)
        ]);

        // Combine description + extracted text for AI analysis
        const combinedText = `
[IMAGE DESCRIPTION]:
${imageDescription}

[EXTRACTED TEXT FROM IMAGE]:
${extractedText || "No text found in the image."}
`.trim();

        // Step 2: Analyze with Gemini AI
        const aiResult = await analyzeWithAI(combinedText);

        let responseData = {
            imageDescription,
            extractedText: extractedText || "",
            ...aiResult
        };

        // Save to database only if user is logged in
        if (req.user) {
            const analysis = await Analysis.create({
                userId: req.user._id,
                originalText: combinedText.substring(0, 3000),
                manipulationScore: aiResult.manipulation_score,
                emotionalIntensity: aiResult.emotional_intensity,
                biasType: aiResult.bias_type,
                propagandaTechniques: aiResult.propaganda_techniques,
                sentiment: aiResult.sentiment,
                riskLevel: aiResult.risk_level
            });

            await User.findByIdAndUpdate(req.user._id, { $inc: { totalAnalyses: 1 } });
            await updateTrend(req.user._id, aiResult.manipulation_score, aiResult.emotional_intensity);

            responseData = {
                imageDescription,
                extractedText: extractedText || "",
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
