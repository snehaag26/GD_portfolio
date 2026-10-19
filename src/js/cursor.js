import gsap from 'gsap';

export function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorLabel = cursor.querySelector('.cursor-label');
  
  // Set initial position
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let speed = 0.15; // Inertia delay

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // RAF for smooth inertia interpolation
  const updateCursor = () => {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    gsap.set(cursor, { x: cursorX, y: cursorY });
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  // Hover states helper
  const addHoverState = (elements, stateClass, labelText = '') => {
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add(stateClass);
        if (labelText) cursorLabel.textContent = labelText;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove(stateClass);
        if (labelText) cursorLabel.textContent = '';
      });
    });
  };

  // Buttons & Links
  addHoverState(document.querySelectorAll('a, button, .magnetic-btn, .menu-item'), 'hover-btn', 'CLICK');
  
  // Project Cards & Photos -> WIDEN
  addHoverState(document.querySelectorAll('.project-card, .project-img-wrapper'), 'hover-lens', 'WIDEN');
  addHoverState(document.querySelectorAll('.widen-btn'), 'hover-btn', 'EXPAND');
  addHoverState(document.querySelectorAll('.filter-btn'), 'hover-btn', 'FILTER');

  // Lightbox Controls
  addHoverState(document.querySelectorAll('.lightbox-close-btn, .lightbox-backdrop'), 'hover-btn', 'CLOSE');
  addHoverState(document.querySelectorAll('#lightbox-zoom-btn'), 'hover-btn', 'ZOOM');
  addHoverState(document.querySelectorAll('.prev-btn'), 'hover-btn', 'PREV');
  addHoverState(document.querySelectorAll('.next-btn'), 'hover-btn', 'NEXT');
  addHoverState(document.querySelectorAll('.lightbox-img'), 'hover-lens', 'ZOOM');
  
  // Draggables
  addHoverState(document.querySelectorAll('.drag-item, .skill-node'), 'hover-btn', 'DRAG');

  // Nav Orb: Hide custom cursor so it does not overlap the orb icon or menu tags
  const navOrb = document.getElementById('nav-orb');
  if (navOrb) {
    navOrb.addEventListener('mouseenter', () => {
      cursor.style.opacity = '0';
      cursor.style.pointerEvents = 'none';
    });
    navOrb.addEventListener('mouseleave', () => {
      cursor.style.opacity = '1';
    });
  }
}
