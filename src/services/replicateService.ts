// Replicate API service for Google Nano Banana model
// https://replicate.com/google/nano-banana/api

export interface ReplicateGenerationRequest {
  image: string; // Base64 encoded image or URL
  prompt: string;
  style?: 'professional' | 'corporate' | 'startup' | 'linkedin' | 'casual' | 'cv';
  quality?: 'standard' | 'high';
  aspect_ratio?: '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
}

export interface ReplicateGenerationResponse {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string[]; // Array of generated image URLs
  error?: string;
  urls?: {
    get: string;
    cancel: string;
  };
}

export class ReplicateService {
  private apiKey: string;
  private baseUrl = 'https://api.replicate.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_REPLICATE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('VITE_REPLICATE_API_KEY is required');
    }
  }

  /**
   * Generate professional photos using Google Nano Banana model
   */
  async generateProfessionalPhoto(request: ReplicateGenerationRequest): Promise<ReplicateGenerationResponse> {
    const modelVersion = "google/nano-banana:latest"; // Use latest version
    
    const response = await fetch(`${this.baseUrl}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          image: request.image,
          prompt: request.prompt,
          style: request.style || 'professional',
          quality: request.quality || 'high',
          aspect_ratio: request.aspect_ratio || '1:1',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    return response.json();
  }

  /**
   * Check prediction status
   */
  async getPrediction(predictionId: string): Promise<ReplicateGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/predictions/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    return response.json();
  }

  /**
   * Cancel a prediction
   */
  async cancelPrediction(predictionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/predictions/${predictionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${error}`);
    }
  }

  /**
   * Get style-specific prompts for professional photos
   */
  getStylePrompt(style: string): string {
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
   * Convert File to base64 for Replicate API
   */
  async convertFileToBase64(file: File): Promise<string> {
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
   * Poll for completion with progress updates
   */
  async pollForCompletion(
    predictionId: string, 
    onProgress?: (status: string) => void,
    maxWaitTime: number = 300000 // 5 minutes
  ): Promise<ReplicateGenerationResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const prediction = await this.getPrediction(predictionId);
      
      if (onProgress) {
        onProgress(prediction.status);
      }
      
      if (prediction.status === 'succeeded') {
        return prediction;
      }
      
      if (prediction.status === 'failed' || prediction.status === 'canceled') {
        throw new Error(prediction.error || `Prediction ${prediction.status}`);
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Prediction timed out');
  }
}

export const replicateService = new ReplicateService();
