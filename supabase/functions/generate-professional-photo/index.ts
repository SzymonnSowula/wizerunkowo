import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stylePrompts = {
  linkedin: "Transform this person into a professional LinkedIn headshot: clean business attire, neutral professional background, confident expression, high-quality studio lighting, executive portrait style",
  startup: "Transform this person into a modern startup professional photo: smart casual attire, contemporary urban background, approachable expression, natural lighting, tech industry style",
  corporate: "Transform this person into a formal corporate executive photo: formal business suit, elegant office background, authoritative expression, premium studio lighting, Fortune 500 executive style",
  cv: "Transform this person into a perfect CV/resume headshot: smart professional attire appropriate for job applications, trustworthy and competent appearance, clean neutral background (white or light gray), friendly yet professional expression, even lighting that shows facial features clearly, polished finish suitable for job applications and professional documents"
};

app.options("/", (_, res) => {
  res.set(corsHeaders).sendStatus(200);
});

app.post("/", async (req, res) => {
  try {
    const { imageData, style } = req.body;

    if (!imageData || !style) {
      return res.status(400).json({ error: "Image data and style are required" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const prompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.linkedin;

    const response = await fetch("https://generativeai.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image: imageData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const generatedImageUrl = data.generatedImageUrl;
    
    if (!generatedImageUrl) {
      return res.status(500).json({ error: "No image generated in response" });
    }

    res.set(corsHeaders).json({ generatedImage: generatedImageUrl, success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    res.status(500).json({
      error: errorMessage || "Failed to generate professional photo",
      success: false,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});