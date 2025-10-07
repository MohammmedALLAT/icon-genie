// /api/generateIcon.js
import { GoogleGenAI, Modality } from "@google/genai";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const { prompt, colors, imageData, logoData } = req.body;

  const defaultColors = ["green", "white", "black", "yellow", "red", "blue"];
  const colorList = colors
    ? colors.split(',').map((c) => c.trim()).filter((c) => c)
    : defaultColors;

  const promptStructure = {
    prompt,
    style: "3D realistic, glossy, professional, icon design",
    lighting: "studio soft light, realistic reflections",
    color_palette: colorList,
    background: "simple gradient or solid neutral tone",
    format: "high resolution, transparent background if possible",
  };

  const fullPrompt = JSON.stringify(promptStructure, null, 2);

  try {
    // 🖼 If editing (image or logo provided)
    if (imageData || logoData) {
      const images = [];
      if (imageData) images.push(imageData);
      if (logoData) images.push(logoData);

      const imageParts = images.map((img) => ({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType,
        },
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            ...imageParts,
            {
              text: `Use this JSON as your design instruction: ${fullPrompt}`,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      const result = response?.candidates?.[0]?.content?.parts?.find(
        (part) => part.inlineData
      );

      if (result?.inlineData) {
        return res.status(200).json({
          imageUrl: `data:${result.inlineData.mimeType};base64,${result.inlineData.data}`,
        });
      }

      throw new Error("No image was returned by Gemini (edit mode).");
    }

    // 🧠 If generating from scratch
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Create an icon using the following JSON design structure:\n${fullPrompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
    if (!imageBytes) throw new Error("No image was returned by Gemini (generate mode).");

    return res.status(200).json({
      imageUrl: `data:image/png;base64,${imageBytes}`,
    });

  } catch (error) {
    console.error("Error generating icon:", error);
    return res.status(500).json({
      error: error.message || "Unknown error occurred.",
    });
  }
};

export default handler;
