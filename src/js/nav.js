import gsap from 'gsap';

export function initNav(lenis) {
  const orb = document.getElementById('nav-orb');
  const orbCore = orb.querySelector('.orb-core');
  const orbRing = orb.querySelector('.orb-ring');
  const menuItems = orb.querySelectorAll('.menu-item');
  let isOpen = false;

  // Wobble physics on hover
  orbCore.addEventListener('mouseenter', () => {
    if (!isOpen) gsap.to(orbCore, { scale: 1.1, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
  });
  orbCore.addEventListener('mouseleave', () => {
    if (!isOpen) gsap.to(orbCore, { scale: 1, duration: 0.3, ease: 'power2.out' });
  });

  // Toggle Menu
  orbCore.addEventListener('click', () => {
    isOpen = !isOpen;
    orb.classList.toggle('open', isOpen);
    
    if (isOpen) {
      // Animate core
      gsap.to(orbCore, { scale: 0.8, backgroundColor: 'var(--acid-green)', duration: 0.3 });
      
      // Fan out menu items
      const radius = 100;
      const totalItems = menuItems.length;
      const angleStep = Math.PI / (totalItems - 1); // semicircle top
      
      menuItems.forEach((item, index) => {
        const angle = Math.PI - (angleStep * index); // 180 to 0 degrees
        const x = Math.cos(angle) * radius;
        const y = -Math.sin(angle) * radius; // negative y is up
        
        gsap.to(item, {
          x: x, y: y, scale: 1, opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
          delay: index * 0.05
        });
      });
    } else {
      // Close menu
      gsap.to(orbCore, { scale: 1, backgroundColor: 'var(--off-white)', duration: 0.3 });
      gsap.to(menuItems, {
        x: 0, y: 0, scale: 0, opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.05
      });
    }
  });

  // Navigate on click
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      lenis.scrollTo(target, { offset: 0, duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      orbCore.click(); // close menu
    });
  });

  // Scroll Progress Ring
  lenis.on('scroll', ({ scroll, limit }) => {
    const progress = scroll / limit;
    // Simple rotation for the ring based on scroll
    gsap.set(orbRing, { rotation: progress * 360 });
  });
}
