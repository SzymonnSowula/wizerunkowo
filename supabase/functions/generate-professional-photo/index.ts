import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google Nano Banana style prompts for Replicate
const stylePrompts = {
  linkedin: "Transform this person into a professional LinkedIn headshot: clean business attire, neutral professional background, confident expression, high-quality studio lighting, executive portrait style, modern and approachable",
  startup: "Transform this person into a modern startup professional photo: smart casual attire, contemporary urban background, approachable expression, natural lighting, tech industry style, innovative and dynamic",
  corporate: "Transform this person into a formal corporate executive photo: formal business suit, elegant office background, authoritative expression, premium studio lighting, Fortune 500 executive style, sophisticated and commanding",
  casual: "Transform this person into a professional casual photo: relaxed business attire, contemporary background, friendly expression, natural lighting, approachable professional style, modern and personable",
  professional: "Transform this person into a high-quality professional portrait: appropriate business attire, clean neutral background, confident expression, professional studio lighting, executive portrait style, polished and authoritative",
  cv: "Transform this person into a perfect CV/resume headshot: smart professional attire appropriate for job applications, trustworthy and competent appearance, clean neutral background (white or light gray), friendly yet professional expression, even lighting that shows facial features clearly, polished finish suitable for job applications and professional documents"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageData, style } = await req.json()

    if (!imageData || !style) {
      return new Response(
        JSON.stringify({ error: "Image data and style are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const REPLICATE_API_KEY = Deno.env.get("REPLICATE_API_KEY")
    if (!REPLICATE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "REPLICATE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const prompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.linkedin

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
    })

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text()
      return new Response(
        JSON.stringify({ error: `Replicate API error: ${errorText}` }),
        { status: predictionResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const prediction = await predictionResponse.json()
    
    if (!prediction.id) {
      return new Response(
        JSON.stringify({ error: "No prediction ID received from Replicate" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Poll for completion
    let attempts = 0
    const maxAttempts = 150 // 5 minutes max (150 * 2 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Token ${REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      })

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        return new Response(
          JSON.stringify({ error: `Replicate status error: ${errorText}` }),
          { status: statusResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      const statusData = await statusResponse.json()

      if (statusData.status === 'succeeded') {
        if (statusData.output && statusData.output.length > 0) {
          const generatedImageUrl = statusData.output[0]
          return new Response(
            JSON.stringify({ 
              generatedImage: generatedImageUrl, 
              success: true,
              predictionId: prediction.id 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        } else {
          return new Response(
            JSON.stringify({ error: "No image generated in response" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        }
      }

      if (statusData.status === 'failed' || statusData.status === 'canceled') {
        return new Response(
          JSON.stringify({ 
            error: statusData.error || `Prediction ${statusData.status}` 
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }

      attempts++
    }

    return new Response(
      JSON.stringify({ error: "Generation timed out" }),
      { status: 408, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({
        error: errorMessage || "Failed to generate professional photo",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})