import { Injectable, signal } from 'https://esm.sh/@angular/core@^21.1.3?external=rxjs';
import { GoogleGenAI, GenerateContentResponse, Type } from 'https://esm.sh/@google/genai@^1.40.0?external=rxjs';

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

    const prompt = `Create a list of 12 reasons of deep appreciation from ${yourName} for ${herName}. Their relationship is unique: more than friends, less than lovers. ${herName} is a focused, intelligent university student. A key aspect of their bond is that she trusts ${yourName} enough to share when she's in discomfort or feeling vulnerable. The reasons should reflect deep respect for her ambition, admiration for her mind, and immense gratitude for the trust she places in him. The tone should be supportive and understanding, not overtly romantic.`;
    
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
      Write a short, sincere, and reflective poem from ${yourName} to ${herName} about their unique and supportive connection.
      It should not be an overt love poem, but one of deep appreciation and understanding.
      Bring the following memory or theme to life: "${customPrompt}".
      The tone should be one of quiet respect and gratitude, acknowledging the feeling of being a safe harbor for someone who is strong and focused.
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