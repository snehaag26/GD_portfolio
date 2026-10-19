import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

export function initAnimations() {
  
  // --- HERO KINETIC TEXT & GRID PARALLAX ---
  const heroText = document.querySelector('.kinetic-text');
  const gridOverlay = document.querySelector('.grid-overlay');
  
  if (heroText || gridOverlay) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      
      if (heroText) {
        gsap.to(heroText, { x: x, y: y, skewX: x * 0.1, duration: 1, ease: 'power2.out' });
      }
      
      if (gridOverlay) {
        gsap.to(gridOverlay, { backgroundPosition: `${x * -1}px ${y * -1}px`, duration: 1, ease: 'power2.out' });
      }
    });
  }

  // Hero Blobs Parallax
  if (document.querySelector('.hero-blobs')) {
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
  }

  // --- ABOUT SECTION (Readable in one go) ---
  const aboutSection = document.querySelector('#about');
  const aboutPanel = document.querySelector('#about .glass-panel, .about-right');
  if (aboutSection && aboutPanel) {
    gsap.from(aboutPanel, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Stats Count Up
  const stats = document.querySelectorAll('.stat .count');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const suffix = stat.textContent.includes('+') ? '+' : '';
    const counterObj = { val: 0 };
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(counterObj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            stat.innerHTML = Math.round(counterObj.val) + suffix;
          }
        });
      }
    });
  });

  // Draggable Skills
  if (document.querySelector('.skill-node') && document.querySelector('.skills-constellation')) {
    Draggable.create('.skill-node', {
      type: 'x,y',
      bounds: '.skills-constellation',
      inertia: true
    });
  }

  // --- TIMELINE SECTION ---
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if (timelineItems.length > 0) {
    timelineItems.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: -40,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  // --- WORKSPACE SECTION ---
  if (document.querySelector('.drag-item') && document.querySelector('.desk-area')) {
    Draggable.create('.drag-item', {
      type: 'x,y',
      bounds: '.desk-area',
      edgeResistance: 0.65
    });
  }

  // Live Clock + Date
  const clockEl = document.querySelector('.clock-time');
  const labDateEl = document.getElementById('lab-date');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
      if (labDateEl) {
        labDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Terminal Typing Animation (Lab Page)
  const terminalTyping = document.getElementById('terminal-typing');
  if (terminalTyping) {
    const skills = [
      '> UI/UX Design',
      '> Interaction Design',
      '> Prototyping',
      '> Design Systems',
      '> Motion Design',
      '> Frontend Dev',
    ];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let output = '';

    const typeTerminal = () => {
      const current = skills[skillIndex];
      if (!isDeleting) {
        output = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeTerminal, 1200);
          return;
        }
      } else {
        output = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          skillIndex = (skillIndex + 1) % skills.length;
        }
      }
      terminalTyping.textContent = output + '▌';
      setTimeout(typeTerminal, isDeleting ? 40 : 80);
    };
    setTimeout(typeTerminal, 600);
  }

  // Design Quotes Typewriter (Lab Page)
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  if (quoteText && quoteAuthor) {
    const quotes = [
      { text: 'Design is not just what it looks like. Design is how it works.', author: '— Steve Jobs' },
      { text: 'Good design is obvious. Great design is transparent.', author: '— Joe Sparano' },
      { text: 'Design is thinking made visual.', author: '— Saul Bass' },
      { text: 'Simplicity is the ultimate sophistication.', author: '— Leonardo da Vinci' },
      { text: 'Every great design begins with an even better story.', author: '— Lorinda Mamo' },
    ];
    let qIndex = 0;
    let qChar = 0;
    let qDeleting = false;

    const typeQuote = () => {
      const currentQ = quotes[qIndex];
      if (!qDeleting) {
        quoteText.textContent = currentQ.text.substring(0, qChar + 1);
        if (qChar === 0) quoteAuthor.textContent = '';
        qChar++;
        if (qChar === currentQ.text.length) {
          quoteAuthor.textContent = currentQ.author;
          qDeleting = true;
          setTimeout(typeQuote, 2800);
          return;
        }
      } else {
        quoteText.textContent = currentQ.text.substring(0, qChar - 1);
        qChar--;
        if (qChar === 0) {
          qDeleting = false;
          qIndex = (qIndex + 1) % quotes.length;
          quoteAuthor.textContent = '';
        }
      }
      setTimeout(typeQuote, qDeleting ? 15 : 45);
    };
    setTimeout(typeQuote, 800);
  }

  // --- PROJECTS SECTION (Showcase & Accessible Grid) ---
  const projectsSection = document.querySelector('#projects');
  const projectCards = gsap.utils.toArray('.project-card');
  const workHeader = document.querySelector('.work-header');
  const projectsGrid = document.querySelector('.projects-grid');
  
  if (projectsSection && workHeader) {
    gsap.from(workHeader, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: projectsSection,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  if (projectCards.length > 0 && projectsGrid) {
    gsap.from(projectCards, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: projectsGrid,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Subtle magnetic lift on hover (natural & accessible)
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -8, duration: 0.35, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
      });
    });
  }

  // Work Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
            onStart: () => {
              card.style.display = 'flex';
              card.style.pointerEvents = 'auto';
            }
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.94,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => {
              card.style.display = 'none';
              card.style.pointerEvents = 'none';
            }
          });
        }
      });

      // Refresh ScrollTrigger after DOM changes
      setTimeout(() => ScrollTrigger.refresh(), 360);
    });
  });

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

  // Lab Tool Cards Entrance
  const labToolCards = gsap.utils.toArray('.lab-tool-card');
  if (labToolCards.length > 0) {
    gsap.from(labToolCards, {
      opacity: 0,
      y: 40,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.lab-tools-grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  // Desk Area entrance
  const deskArea = document.querySelector('.desk-area');
  if (deskArea) {
    gsap.from(deskArea, {
      opacity: 0,
      scale: 0.97,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: deskArea,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }
}
