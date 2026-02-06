import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

// IMPORTANT: Do not use this key directly in production.
// This is a placeholder and should be handled securely.
const FAKE_API_KEY = 'YOUR_API_KEY_HERE';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  poem = signal<string>('');
  reasons = signal<string[]>([]);
  isLoading = signal<boolean>(false);
  isGeneratingReasons = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    // In a real app, process.env.API_KEY would be set in the environment.
    // For this applet, we will use a placeholder and show an alert if it's not replaced.
    const apiKey = (process.env as any).API_KEY || FAKE_API_KEY;
    if (apiKey === FAKE_API_KEY) {
       console.warn('Using placeholder API Key for Gemini Service. Please replace it with your actual key.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }
  
  async generateReasons(herName: string, yourName: string): Promise<void> {
    if (!this.ai) return;
    this.isGeneratingReasons.set(true);
    this.error.set(null);

    const prompt = `Create a list of 12 unique, deeply personal, and heartfelt reasons why ${yourName} loves ${herName}. The reasons should be a mix of poetic, sweet, and observant, as if coming from someone who pays attention to the little things.`;
    
    try {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        reasons: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const result = JSON.parse(response.text);
        this.reasons.set(result.reasons);
    } catch (e) {
        console.error('Error generating reasons:', e);
        this.error.set('Could not generate reasons from the heart. Using my own.');
        // Fallback to a default list
        this.reasons.set([
          "Your smile lights up my darkest days.",
          "The way you laugh at my terrible jokes.",
          "Your kindness inspires me to be a better person.",
          "How you're passionate about your dreams.",
          "The way your eyes sparkle when you're excited.",
          "How you make even ordinary days feel special.",
          "Your incredible intelligence and wit.",
          "How you believe in me, even when I don't.",
          "The comfort of just being with you.",
          "Your strength and resilience.",
          "The way you care for everyone around you.",
          "For being my greatest adventure and my calmest harbor."
        ]);
    } finally {
        this.isGeneratingReasons.set(false);
    }
  }

  async generatePoem(herName: string, yourName: string, customPrompt: string): Promise<void> {
    if (!this.ai) {
      this.error.set('Gemini AI client is not initialized.');
      return;
    }

    this.isLoading.set(true);
    this.poem.set('');
    this.error.set(null);

    const fullPrompt = `
      As a celebrated romantic poet, write a short, breathtakingly beautiful Valentine's Day poem from ${yourName} to ${herName}.
      The poem must be heartfelt, elegant, and profoundly sincere, feeling like a whispered secret.
      Use vivid imagery and sensory language to bring the following memory or theme to life: "${customPrompt}".
      Focus on the deep emotion and feeling of that moment. The tone should be one of complete love and admiration.
      Do not include a title. The poem should be between 8 and 12 lines long.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      const text = response.text;
      this.poem.set(text);
    } catch (e) {
      console.error('Error generating poem:', e);
      this.error.set('Could not generate the poem. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}