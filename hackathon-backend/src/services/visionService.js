import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash"
});

export const extractTextFromImage = async (imageBuffer) => {

  const base64Image = imageBuffer.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image
      }
    },
    {
      text: "Extract all visible text from this screenshot exactly as written."
    }
  ]);

  const text = result.response.text();

  return text;
};