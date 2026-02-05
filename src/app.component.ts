import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from './gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppComponent {
  geminiService = inject(GeminiService);

  // --- PERSONALIZATION ---
  // Replace these with your actual data!
  readonly HER_NAME = "Adeola";
  readonly YOUR_NAME = "Adeola";

  readonly reasons = signal<string[]>([
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
  // --- END PERSONALIZATION ---

  poemPrompt = signal<string>("my first love");
  view = signal<'intro' | 'main'>('intro');

  beginExperience() {
    this.view.set('main');
  }

  generatePoem() {
    if (this.poemPrompt().trim() === '') return;
    this.geminiService.generatePoem(this.HER_NAME, this.YOUR_NAME, this.poemPrompt());
  }

  handlePromptInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.poemPrompt.set(target.value);
  }
}
