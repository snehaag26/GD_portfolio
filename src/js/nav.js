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
      // Fan out menu items with balanced radius and clearance so no items overlap
      const radius = 120;
      const totalItems = menuItems.length;
      const startAngle = (170 * Math.PI) / 180;
      const endAngle = (10 * Math.PI) / 180;
      const angleStep = (startAngle - endAngle) / (totalItems - 1);
      
      menuItems.forEach((item, index) => {
        const angle = startAngle - (angleStep * index);
        const x = Math.cos(angle) * radius;
        const y = -Math.sin(angle) * radius; // negative y is up
        
        gsap.to(item, {
          x: x, y: y, scale: 1, opacity: 1,
          duration: 0.45,
          ease: 'back.out(1.4)',
          delay: index * 0.04
        });
      });
    } else {
      // Close menu
      gsap.to(menuItems, {
        x: 0, y: 0, scale: 0, opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        stagger: 0.03
      });
    }
  });

  // Active page indicator
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .menu-item');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const isHome = (href === '/' || href === '/index.html') && (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '');
      const isMatch = href !== '/' && currentPath.includes(href.replace('.html', ''));
      if (isHome || isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });

  // Navigate on click
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      const target = item.getAttribute('data-target');
      
      if (href && href !== '#') {
        // If it's a link to another page or current page
        orbCore.click();
        return;
      }
      
      if (target && lenis) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        orbCore.click(); // close menu
      }
    });
  });

  // Scroll Progress Ring
  if (lenis && orbRing) {
    lenis.on('scroll', ({ scroll, limit }) => {
      if (!limit) return;
      const progress = scroll / limit;
      gsap.set(orbRing, { rotation: progress * 360 });
    });
  }
}
