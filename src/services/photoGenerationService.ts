// Photo generation service using Replicate API via Supabase Function

export interface PhotoGenerationRequest {
  image: File;
  style: 'linkedin' | 'startup' | 'corporate' | 'casual' | 'professional' | 'cv';
  quality?: 'standard' | 'high';
  aspectRatio?: '1:1' | '1:1' | '1:1' | '1:1' | '1:1';
}

export interface PhotoGenerationResponse {
  success: boolean;
  generatedImage?: string;
  predictionId?: string;
  error?: string;
}

export class PhotoGenerationService {
  /**
   * Generate professional photo using Google Nano Banana model
   * Uses Express server for production-ready photo generation
   */
  async generatePhoto(request: PhotoGenerationRequest): Promise<PhotoGenerationResponse> {
    try {
      // Use Express server - the proper production way
      return await this.generatePhotoWithExpress(request);
    } catch (error) {
      console.error('Photo generation failed:', error);
      throw error;
    }
  }


  /**
   * Generate photo using direct Replicate API call (fallback)
   */
  async generatePhotoDirect(request: PhotoGenerationRequest): Promise<PhotoGenerationResponse> {
    try {
      const replicateApiKey = import.meta.env.VITE_REPLICATE_API_KEY;
      console.log('API Key check:', replicateApiKey ? 'Present' : 'Missing');
      
      if (!replicateApiKey || replicateApiKey.includes('your_replicate_api_key')) {
        throw new Error('Replicate API key is missing. Please add VITE_REPLICATE_API_KEY to your .env file. Get your key from: https://replicate.com/account/api-tokens');
      }

      // Convert to data URL format for Replicate API
      const imageDataUrl = await this.convertFileToDataUrl(request.image);
      
      // Create prediction directly
      const predictionResponse = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'google/nano-banana:latest',
          input: {
            image: imageDataUrl,
            prompt: this.getStylePrompt(request.style),
            quality: request.quality || 'high',
            aspect_ratio: request.aspectRatio || '1:1'
          },
        }),
      });

      if (!predictionResponse.ok) {
        const errorText = await predictionResponse.text();
        console.error('Replicate API error:', errorText);
        throw new Error(`Replicate API error (${predictionResponse.status}): ${errorText}`);
      }

      const prediction = await predictionResponse.json();
      console.log('Prediction created:', prediction.id);
      
      // Poll for completion
      let attempts = 0;
      const maxAttempts = 150; // 5 minutes max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${replicateApiKey}`,
          },
        });

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error('Status check error:', errorText);
          throw new Error(`Status check failed (${statusResponse.status}): ${errorText}`);
        }

        const statusData = await statusResponse.json();
        console.log(`Prediction ${prediction.id} status:`, statusData.status);

        if (statusData.status === 'succeeded') {
          if (statusData.output && statusData.output.length > 0) {
            console.log('Photo generation completed successfully');
            return {
              success: true,
              generatedImage: statusData.output[0],
              predictionId: prediction.id
            };
          } else {
            throw new Error('No output received from prediction');
          }
        }

        if (statusData.status === 'failed' || statusData.status === 'canceled') {
          const errorMsg = statusData.error || statusData.logs || `Prediction ${statusData.status}`;
          console.error('Prediction failed:', errorMsg);
          throw new Error(errorMsg);
        }

        attempts++;
      }

      throw new Error('Generation timed out after 5 minutes');
    } catch (error) {
      console.error('Photo generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get style-specific prompt
   */
  private getStylePrompt(style: string): string {
    const stylePrompts = {
      linkedin: "Transform this person into a professional LinkedIn headshot: clean business attire, neutral professional background, confident expression, high-quality studio lighting, executive portrait style, modern and approachable",
      startup: "Transform this person into a modern startup professional photo: smart casual attire, contemporary urban background, approachable expression, natural lighting, tech industry style, innovative and dynamic",
      corporate: "Transform this person into a formal corporate executive photo: formal business suit, elegant office background, authoritative expression, premium studio lighting, Fortune 500 executive style, sophisticated and commanding",
      casual: "Transform this person into a professional casual photo: relaxed business attire, contemporary background, friendly expression, natural lighting, approachable professional style, modern and personable",
      professional: "Transform this person into a high-quality professional portrait: appropriate business attire, clean neutral background, confident expression, professional studio lighting, executive portrait style, polished and authoritative",
      cv: "Transform this person into a perfect CV/resume headshot: smart professional attire appropriate for job applications, trustworthy and competent appearance, clean neutral background (white or light gray), friendly yet professional expression, even lighting that shows facial features clearly, polished finish suitable for job applications and professional documents"
    };

    return stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.professional;
  }

  /**
   * Generate photo using Express server (main method)
   */
  async generatePhotoWithExpress(request: PhotoGenerationRequest): Promise<PhotoGenerationResponse> {
    try {
      const imageBase64 = await this.convertFileToBase64(request.image);
      
      // Use Express server running on port 3000
      const response = await fetch('http://localhost:3000/api/generate-professional-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageBase64,
          style: request.style
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.generatedImage) {
        return {
          success: true,
          generatedImage: data.generatedImage,
          predictionId: data.predictionId
        };
      } else {
        throw new Error('No image received from generation service');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate photo using Supabase Function (fallback)
   */
  async generatePhotoWithSupabase(request: PhotoGenerationRequest): Promise<PhotoGenerationResponse> {
    try {
      const imageBase64 = await this.convertFileToBase64(request.image);
      
      // Import supabase client dynamically to avoid issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('generate-professional-photo', {
        body: { 
          imageData: imageBase64,
          style: request.style 
        },
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate photo');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.generatedImage) {
        return {
          success: true,
          generatedImage: data.generatedImage,
          predictionId: data.predictionId
        };
      } else {
        throw new Error('No image received from generation service');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Convert File to base64
   */
  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert File to data URL (for Replicate API)
   */
  private async convertFileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Nieprawidłowy format pliku. Dozwolone: JPG, PNG, WebP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Plik jest zbyt duży. Maksymalny rozmiar: 10MB'
      };
    }

    return { valid: true };
  }

  /**
   * Get available styles
   */
  getAvailableStyles(): Array<{ value: string; label: string; description: string }> {
    return [
      {
        value: 'linkedin',
        label: 'LinkedIn',
        description: 'Profesjonalne zdjęcie biznesowe idealne do LinkedIn'
      },
      {
        value: 'startup',
        label: 'Startup',
        description: 'Nowoczesny styl tech industry - smart casual'
      },
      {
        value: 'corporate',
        label: 'Korporacyjne',
        description: 'Formalny styl executive - garnitur i elegancja'
      },
      {
        value: 'casual',
        label: 'Casual',
        description: 'Profesjonalny ale swobodny styl'
      },
      {
        value: 'professional',
        label: 'Profesjonalne',
        description: 'Uniwersalny styl biznesowy'
      },
      {
        value: 'cv',
        label: 'CV',
        description: 'Idealne zdjęcie do CV i aplikacji o pracę'
      }
    ];
  }
}

export const photoGenerationService = new PhotoGenerationService();
