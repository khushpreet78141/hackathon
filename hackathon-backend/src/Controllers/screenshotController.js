import { extractTextFromImage } from "../services/visionService.js";
import { runAnalysis } from "../services/analysisService.js";

export const analyzeScreenshot = async (req, res, next) => {
  try {
    const imageBuffer = req.file.buffer;

    // Convert image → text using Gemini Vision
    const extractedText = await extractTextFromImage(imageBuffer);

    // Run your existing AI analysis
    const analysis = await runAnalysis(req.user?._id, extractedText);

    res.json({
      success: true,
      extractedText,
      analysis
    });

  } catch (error) {
    next(error);
  }
};