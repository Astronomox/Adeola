import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

// IMPORTANT: Do not use this key directly in production.
// This is a placeholder and should be handled securely.
const FAKE_API_KEY = 'YOUR_API_KEY_HERE';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  poem = signal<string>('');
  isLoading = signal<boolean>(false);
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
