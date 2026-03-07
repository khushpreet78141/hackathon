// src/Controllers/imageAnalysisController.js
import { analyzeImageWithAI } from "../services/aiService2.js";

/**
 * POST /api/image-analysis
 * Accepts a multipart image upload and returns fraud/spam analysis.
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
        const result = await analyzeImageWithAI(req.file.buffer, mimeType);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
