import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

export function initAnimations() {
  
  // --- HERO KINETIC TEXT & GRID PARALLAX ---
  const heroText = document.querySelector('.kinetic-text');
  const gridOverlay = document.querySelector('.grid-overlay');
  
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 50;
    const y = (e.clientY / window.innerHeight - 0.5) * 50;
    
    gsap.to(heroText, { x: x, y: y, skewX: x * 0.1, duration: 1, ease: 'power2.out' });
    
    if (gridOverlay) {
      gsap.to(gridOverlay, { backgroundPosition: `${x * -1}px ${y * -1}px`, duration: 1, ease: 'power2.out' });
    }
  });

  // Hero Blobs Parallax
  gsap.to('.hero-blobs .blob-1', {
    yPercent: 100, xPercent: 50,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-blobs .blob-2', {
    yPercent: -150, xPercent: -50,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // --- ABOUT SECTION ---
  // Scroll Highlight Text
  const highlightTexts = document.querySelectorAll('.scroll-text .highlight');
  highlightTexts.forEach(el => {
    gsap.fromTo(el, 
      { color: 'var(--off-white)', textDecorationColor: 'transparent' },
      { 
        color: 'var(--acid-green)', textDecorationColor: 'var(--acid-green)',
        scrollTrigger: {
          trigger: el, start: 'top 80%', end: 'top 50%', scrub: true
        }
      }
    );
  });

  // Stats Count Up
  const stats = document.querySelectorAll('.stat .count');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power2.out'
        });
      }
    });
  });

  // Draggable Skills
  Draggable.create('.skill-node', {
    type: 'x,y',
    bounds: '.skills-constellation',
    inertia: true
  });

  // --- TIMELINE SECTION ---
  const timelineItems = gsap.utils.toArray('.timeline-item');
  timelineItems.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // --- WORKSPACE SECTION ---
  Draggable.create('.drag-item', {
    type: 'x,y',
    bounds: '.desk-area',
    edgeResistance: 0.65
  });

  // Live Clock
  const clockEl = document.querySelector('.clock-time');
  if (clockEl) {
    setInterval(() => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
  }

  // --- PROJECTS SECTION (Horizontal Scroll) ---
  const projectScroll = document.querySelector('.horizontal-scroll');
  const projectCards = gsap.utils.toArray('.project-card');
  
  if (projectScroll) {
    const totalWidth = projectScroll.scrollWidth - window.innerWidth;
    
    gsap.to(projectScroll, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        pin: true,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1
      }
    });

    // 3D Tilt on Hover for Cards
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
          rotationY: (x / rect.width) * 30,
          rotationX: -(y / rect.height) * 30,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power1.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power1.out' });
      });
    });
  }

  // --- CONTACT / FOOTER ---
  // Magnetic Buttons
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2; // Reduced multiplier for wider buttons
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // Glitch text easter egg
  const glitch = document.querySelector('.glitch-text');
  if (glitch) {
    glitch.addEventListener('mouseenter', () => {
      gsap.to(glitch, { x: () => Math.random() * 10 - 5, y: () => Math.random() * 10 - 5, duration: 0.05, yoyo: true, repeat: 10 });
    });
  }
}
