import { Component, ChangeDetectionStrategy, signal, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from './gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) particleCanvas!: ElementRef<HTMLCanvasElement>;
  geminiService = inject(GeminiService);

  private animationFrameId: number | null = null;

  // --- PERSONALIZATION ---
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

  poemPrompt = signal<string>("our first coffee date");
  view = signal<'intro' | 'main'>('intro');
  poemStream = signal<string>('');
  
  beginExperience() {
    this.view.set('main');
  }

  async generatePoem() {
    if (this.poemPrompt().trim() === '') return;
    this.poemStream.set('');
    await this.geminiService.generatePoem(this.HER_NAME, this.YOUR_NAME, this.poemPrompt());

    const fullPoem = this.geminiService.poem();
    if (fullPoem) {
      this.typeOutPoem(fullPoem);
    }
  }
  
  private typeOutPoem(text: string) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        this.poemStream.update(current => current + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);
  }

  handlePromptInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.poemPrompt.set(target.value);
  }

  ngAfterViewInit() {
    this.initParticleBackground();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initParticleBackground() {
    const canvas = this.particleCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, size: number, speedX: number, speedY: number }[] = [];
    
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() * 0.3 - 0.15),
                speedY: (Math.random() * 0.3 - 0.15)
            });
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.fillStyle = `rgba(255, 182, 217, ${Math.random() * 0.5 + 0.3})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        this.animationFrameId = requestAnimationFrame(animateParticles);
    };

    setCanvasSize();
    createParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        setCanvasSize();
        createParticles();
    });
  }
}
