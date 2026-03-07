import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
});

/**
 * Extract text from an image using Gemini Vision.
 */
export const extractTextFromImage = async (imageBuffer, mimeType = "image/png") => {
  const base64Image = imageBuffer.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Image
      }
    },
    {
      text: "Extract all visible text from this image exactly as written. If there is no text, return an empty string."
    }
  ]);

  return result.response.text();
};

/**
 * Describe and analyze an image using Gemini Vision.
 * Returns a detailed description of the image content.
 */
export const describeImage = async (imageBuffer, mimeType = "image/png") => {
  const base64Image = imageBuffer.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Image
      }
    },
    {
      text: `Analyze this image in detail. Provide:
1. A clear description of what the image shows
2. Any visible text or branding
3. Whether the image appears genuine, manipulated, or AI-generated
4. Any red flags suggesting fraud, spam, misinformation, or manipulation
5. The overall context and intent of the image

Be thorough but concise. Return as a single detailed paragraph.`
    }
  ]);

  return result.response.text();
};