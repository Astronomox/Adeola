// =====================================================================
//  SAILOR SONG — Valentine's for Adeola
//  Cinematic JS: Starfield, Ocean Waves, Scroll Animations, Interactions
// =====================================================================

(function () {
    'use strict';

    // ===== STARFIELD CANVAS =====
    const starCanvas = document.getElementById('starCanvas');
    const starCtx = starCanvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 280;

    function resizeStarCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                radius: Math.random() * 1.8 + 0.2,
                alpha: Math.random() * 0.8 + 0.2,
                alphaSpeed: Math.random() * 0.008 + 0.002,
                alphaDir: Math.random() > 0.5 ? 1 : -1,
                hue: Math.random() > 0.85 ? Math.random() * 40 + 20 : 0, // Some warm stars
                saturation: Math.random() > 0.85 ? 40 : 0,
            });
        }
    }

    function drawStars() {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

        for (const star of stars) {
            // Twinkle
            star.alpha += star.alphaSpeed * star.alphaDir;
            if (star.alpha >= 1) { star.alpha = 1; star.alphaDir = -1; }
            if (star.alpha <= 0.1) { star.alpha = 0.1; star.alphaDir = 1; }

            starCtx.beginPath();
            starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            if (star.hue) {
                starCtx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 85%, ${star.alpha})`;
            } else {
                starCtx.fillStyle = `rgba(220, 225, 240, ${star.alpha})`;
            }
            starCtx.fill();

            // Subtle glow for brighter stars
            if (star.radius > 1.2) {
                starCtx.beginPath();
                starCtx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                starCtx.fillStyle = `rgba(200, 210, 230, ${star.alpha * 0.06})`;
                starCtx.fill();
            }
        }
    }

    // ===== OCEAN WAVES CANVAS =====
    const oceanCanvas = document.getElementById('oceanCanvas');
    const oceanCtx = oceanCanvas.getContext('2d');
    let oceanTime = 0;

    function resizeOceanCanvas() {
        oceanCanvas.width = window.innerWidth;
        oceanCanvas.height = window.innerHeight * 0.35;
    }

    function drawOcean() {
        const w = oceanCanvas.width;
        const h = oceanCanvas.height;
        oceanCtx.clearRect(0, 0, w, h);

        // Multiple wave layers
        const layers = [
            { amp: 18, freq: 0.004, speed: 0.015, yBase: h * 0.15, color: 'rgba(10, 20, 55, 0.6)' },
            { amp: 14, freq: 0.006, speed: 0.02, yBase: h * 0.25, color: 'rgba(12, 25, 65, 0.5)' },
            { amp: 10, freq: 0.008, speed: 0.025, yBase: h * 0.35, color: 'rgba(15, 30, 75, 0.4)' },
            { amp: 8, freq: 0.012, speed: 0.03, yBase: h * 0.45, color: 'rgba(18, 35, 85, 0.35)' },
            { amp: 5, freq: 0.015, speed: 0.035, yBase: h * 0.55, color: 'rgba(20, 40, 90, 0.3)' },
        ];

        for (const layer of layers) {
            oceanCtx.beginPath();
            oceanCtx.moveTo(0, h);

            for (let x = 0; x <= w; x += 2) {
                const y = layer.yBase +
                    Math.sin(x * layer.freq + oceanTime * layer.speed) * layer.amp +
                    Math.sin(x * layer.freq * 1.8 + oceanTime * layer.speed * 0.7) * (layer.amp * 0.4);
                oceanCtx.lineTo(x, y);
            }

            oceanCtx.lineTo(w, h);
            oceanCtx.closePath();
            oceanCtx.fillStyle = layer.color;
            oceanCtx.fill();
        }

        // Moon reflection shimmer
        const moonReflectX = w * 0.8;
        const reflectGrad = oceanCtx.createLinearGradient(moonReflectX - 30, 0, moonReflectX + 30, h);
        reflectGrad.addColorStop(0, 'rgba(255, 240, 210, 0.03)');
        reflectGrad.addColorStop(0.5, 'rgba(255, 240, 210, 0.06)');
        reflectGrad.addColorStop(1, 'rgba(255, 240, 210, 0)');

        oceanCtx.fillStyle = reflectGrad;
        for (let y = 0; y < h; y += 3) {
            const shimmer = Math.sin(y * 0.05 + oceanTime * 0.02) * 8;
            oceanCtx.fillRect(moonReflectX + shimmer - 2, y, 4, 2);
        }

        oceanTime++;
    }

    // ===== MAIN RENDER LOOP =====
    function animate() {
        drawStars();
        drawOcean();
        requestAnimationFrame(animate);
    }

    function initCanvases() {
        resizeStarCanvas();
        resizeOceanCanvas();
        createStars();
        animate();
    }

    window.addEventListener('resize', () => {
        resizeStarCanvas();
        resizeOceanCanvas();
        createStars(); // Re-distribute stars
    });

    // ===== SCROLL-TRIGGERED REVEALS =====
    const revealElements = document.querySelectorAll('.reveal-line');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== FINALE SECTION REVEAL =====
    const finaleSection = document.getElementById('finale');
    const finaleTitle = finaleSection?.querySelector('.finale-title');
    const finaleName = finaleSection?.querySelector('.finale-name');
    const finaleHeart = finaleSection?.querySelector('.finale-heart');
    const finaleQuote = finaleSection?.querySelector('.finale-quote');
    const finaleSignature = finaleSection?.querySelector('.finale-signature');

    if (finaleSection) {
        const finaleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the finale animations
                    setTimeout(() => {
                        if (finaleTitle) finaleTitle.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1.2s cubic-bezier(0.16,1,0.3,1)';
                    }, 200);
                    setTimeout(() => {
                        if (finaleName) finaleName.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1.4s cubic-bezier(0.16,1,0.3,1)';
                    }, 600);
                    setTimeout(() => {
                        if (finaleHeart) {
                            finaleHeart.style.cssText = 'opacity:1; transition: opacity 1s ease';
                            finaleHeart.classList.add('visible');
                        }
                    }, 1000);
                    setTimeout(() => {
                        if (finaleQuote) finaleQuote.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1s ease';
                    }, 1800);
                    setTimeout(() => {
                        if (finaleSignature) finaleSignature.style.cssText = 'opacity:1; transform:translateY(0); transition: all 1s ease';
                    }, 2400);

                    finaleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        finaleObserver.observe(finaleSection);

        // Initial state
        [finaleTitle, finaleName, finaleQuote, finaleSignature].forEach(el => {
            if (el) el.style.cssText = 'opacity:0; transform:translateY(30px)';
        });
        if (finaleHeart) finaleHeart.style.opacity = '0';
    }

    // ===== SCROLL INDICATOR =====
    const scrollIndicator = document.getElementById('scrollIndicator');

    function handleScrollIndicator() {
        if (window.scrollY > 100) {
            scrollIndicator?.classList.add('faded');
        } else {
            scrollIndicator?.classList.remove('faded');
        }
    }

    window.addEventListener('scroll', handleScrollIndicator, { passive: true });

    // ===== MUSIC TOGGLE =====
    const musicToggle = document.getElementById('musicToggle');
    const spotifyEmbed = document.getElementById('spotifyEmbed');
    let musicOpen = false;

    if (musicToggle && spotifyEmbed) {
        musicToggle.addEventListener('click', () => {
            musicOpen = !musicOpen;
            if (musicOpen) {
                spotifyEmbed.classList.remove('hidden');
            } else {
                spotifyEmbed.classList.add('hidden');
            }
        });
    }

    // ===== COMPASS BUTTON =====
    const compassButton = document.getElementById('compassButton');
    const secretReveal = document.getElementById('secretReveal');
    let compassActivated = false;

    if (compassButton && secretReveal) {
        compassButton.addEventListener('click', () => {
            if (compassActivated) return;
            compassActivated = true;

            // Stop spinning, lock compass
            compassButton.classList.add('activated');

            // Create burst particles
            createCompassBurst(compassButton);

            // Show secret message
            setTimeout(() => {
                secretReveal.classList.remove('hidden');
                // Force reflow
                void secretReveal.offsetWidth;
                secretReveal.classList.add('visible');
            }, 600);
        });
    }

    function createCompassBurst(element) {
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const particleCount = 24;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 80 + Math.random() * 60;
            const size = Math.random() * 4 + 2;

            Object.assign(particle.style, {
                position: 'fixed',
                left: cx + 'px',
                top: cy + 'px',
                width: size + 'px',
                height: size + 'px',
                borderRadius: '50%',
                background: `hsl(${30 + Math.random() * 20}, 70%, ${60 + Math.random() * 25}%)`,
                pointerEvents: 'none',
                zIndex: '9999',
                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: 'translate(-50%, -50%)',
            });

            document.body.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`;
                particle.style.opacity = '0';
            });

            setTimeout(() => particle.remove(), 1300);
        }
    }

    // ===== PARALLAX MOON =====
    const moon = document.getElementById('moon');

    function handleMoonParallax() {
        if (!moon) return;
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollY / maxScroll, 1);

        // Moon rises and drifts slightly as you scroll
        const yOffset = progress * -80;
        const xOffset = progress * 30;
        const opacity = Math.max(1 - progress * 1.5, 0.1);

        moon.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        moon.style.opacity = opacity;
    }

    window.addEventListener('scroll', handleMoonParallax, { passive: true });

    // ===== SUBTLE MOUSE GLOW =====
    let mouseGlow = null;

    function createMouseGlow() {
        mouseGlow = document.createElement('div');
        Object.assign(mouseGlow.style, {
            position: 'fixed',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,168,124,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: '5',
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.3s ease, top 0.3s ease',
        });
        document.body.appendChild(mouseGlow);
    }

    document.addEventListener('mousemove', (e) => {
        if (!mouseGlow) createMouseGlow();
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });

    // ===== PERFORMANCE: PAUSE WHEN TAB IS INACTIVE =====
    let animating = true;

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            animating = false;
        } else {
            animating = true;
        }
    });

    // ===== INIT =====
    window.addEventListener('load', () => {
        initCanvases();
        handleMoonParallax();

        console.log('%c⚓ Sailor Song — For Adeola ⚓',
            'color: #e8a87c; font-size: 18px; font-family: Georgia; font-style: italic; padding: 8px;');
        console.log('%cHappy Valentine\'s Day 💕',
            'color: #d4707a; font-size: 14px; font-family: Georgia;');
    });

})();
