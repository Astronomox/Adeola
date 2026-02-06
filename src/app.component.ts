import { Component, ChangeDetectionStrategy, signal, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy } from 'https://esm.sh/@angular/core@^21.1.3?external=rxjs';
import { CommonModule } from 'https://esm.sh/@angular/common@^21.1.3?external=rxjs';
import { GeminiService } from './gemini.service';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  life?: number;
  decay?: number;
}

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
  private ctx: CanvasRenderingContext2D | null = null;

  // --- PERSONALIZATION ---
  readonly HER_NAME = "Adeola";
  readonly YOUR_NAME = "Adeola";
  // --- END PERSONALIZATION ---

  isTransitioning = signal(false);
  poemPrompt = signal<string>("our first coffee date");
  view = signal<'intro' | 'main'>('intro');
  poemStream = signal<string>('');
  
  beginExperience() {
    if (this.isTransitioning()) return;

    this.isTransitioning.set(true);
    this.geminiService.generateReasons(this.HER_NAME, this.YOUR_NAME);
    
    this.triggerHeartExplosion().then(() => {
      this.view.set('main');
      // A short delay to allow the main view to render before we declare transition over
      setTimeout(() => {
        this.isTransitioning.set(false);
        this.initParticleBackground(); // restart ambient particles
      }, 100);
    });
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
    this.ctx = this.particleCanvas.nativeElement.getContext('2d');
    this.initParticleBackground();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.isTransitioning()) {
      this.initParticleBackground();
    }
  };

  private setCanvasSize() {
    if (!this.ctx) return;
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }

  initParticleBackground() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (!this.ctx) return;

    this.setCanvasSize();
    const particleCount = Math.floor((this.ctx.canvas.width * this.ctx.canvas.height) / 15000);
    const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * this.ctx!.canvas.width,
        y: Math.random() * this.ctx!.canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() * 0.3 - 0.15),
        speedY: (Math.random() * 0.3 - 0.15),
        color: `rgba(255, 182, 217, ${Math.random() * 0.5 + 0.3})`
    }));

    const animate = () => {
        this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
        for (const p of particles) {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.ctx!.canvas.width;
            if (p.x > this.ctx!.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.ctx!.canvas.height;
            if (p.y > this.ctx!.canvas.height) p.y = 0;

            this.ctx!.fillStyle = p.color;
            this.ctx!.beginPath();
            this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx!.fill();
        }
        this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }
  
  triggerHeartExplosion(): Promise<void> {
    return new Promise(resolve => {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      if (!this.ctx) return resolve();

      this.setCanvasSize();
      const particles: Particle[] = [];
      const numParticles = 1200;
      const centerX = this.ctx.canvas.width / 2;
      const centerY = this.ctx.canvas.height / 2;

      // Create particles in a heart shape
      for (let i = 0; i < numParticles; i++) {
        const t = Math.random() * 2 * Math.PI;
        const scale = (Math.min(this.ctx.canvas.width, this.ctx.canvas.height) / 40) * (1 - Math.random() * 0.2);
        const x = centerX + scale * 16 * Math.pow(Math.sin(t), 3);
        const y = centerY - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const angle = Math.atan2(y - centerY, x - centerX) + (Math.random() - 0.5) * 0.2;
        const speed = 2 + Math.random() * 4;

        particles.push({
          x, y,
          size: Math.random() * 2 + 1,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          color: Math.random() > 0.3 ? '#ff6b9d' : '#ffc3a0',
          life: 1,
          decay: 0.01 + Math.random() * 0.01
        });
      }

      let animationStartTime: number | null = null;
      const duration = 2500;

      const animate = (timestamp: number) => {
        if (!animationStartTime) animationStartTime = timestamp;
        const elapsed = timestamp - animationStartTime;

        // Fading background for trails
        this.ctx!.fillStyle = 'rgba(10, 0, 21, 0.2)';
        this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

        let activeParticles = 0;
        for (const p of particles) {
          if (p.life! <= 0) continue;
          activeParticles++;

          p.x += p.speedX;
          p.y += p.speedY;
          p.speedX *= 0.98; // friction
          p.speedY *= 0.98;
          p.life! -= p.decay!;
          
          this.ctx!.globalAlpha = p.life!;
          this.ctx!.fillStyle = p.color;
          this.ctx!.beginPath();
          this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx!.fill();
        }
        this.ctx!.globalAlpha = 1;

        if (elapsed < duration) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          this.ctx!.clearRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }
}