const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// Google Nano Banana style prompts for Replicate
const stylePrompts = {
  linkedin: "Transform this person into a professional LinkedIn headshot: clean business attire, neutral professional background, confident expression, high-quality studio lighting, executive portrait style, modern and approachable",
  startup: "Transform this person into a modern startup professional photo: smart casual attire, contemporary urban background, approachable expression, natural lighting, tech industry style, innovative and dynamic",
  corporate: "Transform this person into a formal corporate executive photo: formal business suit, elegant office background, authoritative expression, premium studio lighting, Fortune 500 executive style, sophisticated and commanding",
  casual: "Transform this person into a professional casual photo: relaxed business attire, contemporary background, friendly expression, natural lighting, approachable professional style, modern and personable",
  professional: "Transform this person into a high-quality professional portrait: appropriate business attire, clean neutral background, confident expression, professional studio lighting, executive portrait style, polished and authoritative",
  cv: "Transform this person into a perfect CV/resume headshot: smart professional attire appropriate for job applications, trustworthy and competent appearance, clean neutral background (white or light gray), friendly yet professional expression, even lighting that shows facial features clearly, polished finish suitable for job applications and professional documents"
};

// Photo generation endpoint
app.post('/api/generate-professional-photo', async (req, res) => {
  try {
    const { imageData, style } = req.body;

    if (!imageData || !style) {
      return res.status(400).json({ 
        error: "Image data and style are required" 
      });
    }

    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
    if (!REPLICATE_API_KEY) {
      return res.status(500).json({ 
        error: "REPLICATE_API_KEY is not configured" 
      });
    }

    const prompt = stylePrompts[style] || stylePrompts.linkedin;

    console.log(`Generating photo with style: ${style}`);
    console.log(`Using prompt: ${prompt.substring(0, 100)}...`);

    // Create prediction with Google Nano Banana model
    const predictionResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "google/nano-banana:latest",
        input: {
          image: imageData,
          prompt: prompt,
          quality: "high",
          aspect_ratio: "1:1"
        },
      }),
    });

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text();
      console.error('Replicate API error:', errorText);
      return res.status(predictionResponse.status).json({ 
        error: `Replicate API error: ${errorText}` 
      });
    }

    const prediction = await predictionResponse.json();
    
    if (!prediction.id) {
      return res.status(500).json({ 
        error: "No prediction ID received from Replicate" 
      });
    }

    console.log(`Prediction created with ID: ${prediction.id}`);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes max (150 * 2 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      console.log(`Checking status... attempt ${attempts + 1}/${maxAttempts}`);
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Replicate status error:', errorText);
        return res.status(statusResponse.status).json({ 
          error: `Replicate status error: ${errorText}` 
        });
      }

      const statusData = await statusResponse.json();
      console.log(`Status: ${statusData.status}`);

      if (statusData.status === 'succeeded') {
        if (statusData.output && statusData.output.length > 0) {
          const generatedImageUrl = statusData.output[0];
          console.log('Photo generation successful!');
          return res.json({ 
            generatedImage: generatedImageUrl, 
            success: true,
            predictionId: prediction.id 
          });
        } else {
          return res.status(500).json({ 
            error: "No image generated in response" 
          });
        }
      }

      if (statusData.status === 'failed' || statusData.status === 'canceled') {
        console.error(`Generation failed: ${statusData.error}`);
        return res.status(500).json({ 
          error: statusData.error || `Prediction ${statusData.status}` 
        });
      }

      attempts++;
    }

    console.error('Generation timed out');
    return res.status(408).json({ 
      error: "Generation timed out" 
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Photo generation error:', errorMessage);
    return res.status(500).json({
      error: errorMessage || "Failed to generate professional photo",
      success: false,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'express-photo-generation',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express Photo Generation Service running on port ${PORT}`);
  console.log(`📸 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Generate photos: POST http://localhost:${PORT}/api/generate-professional-photo`);
  console.log(`🔑 Using API Key: ${process.env.REPLICATE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;
