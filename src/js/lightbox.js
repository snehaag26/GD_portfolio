import gsap from 'gsap';

export function initLightbox(lenis) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;

  const backdrop = modal.querySelector('.lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');
  const zoomBtn = document.getElementById('lightbox-zoom-btn');
  const imgElement = document.getElementById('lightbox-img');
  const stage = modal.querySelector('.lightbox-stage');
  const titleElement = modal.querySelector('.lightbox-title');
  const categoryElement = modal.querySelector('.lightbox-category');
  const descElement = modal.querySelector('.lightbox-desc');
  const counterElement = modal.querySelector('.lightbox-counter');
  const tagsElement = modal.querySelector('.lightbox-tags-container');

  const cards = Array.from(document.querySelectorAll('.project-card'));
  if (cards.length === 0) return;

  // Extract project data
  const projects = cards.map((card, index) => {
    const img = card.querySelector('.project-img');
    const title = card.getAttribute('data-title') || card.querySelector('.project-title')?.textContent || `Project ${index + 1}`;
    const category = card.getAttribute('data-category') || 'UI/UX DESIGN';
    const desc = card.getAttribute('data-desc') || card.querySelector('.project-desc')?.textContent || '';
    const accent = card.getAttribute('data-accent') || 'var(--acid-green)';
    const src = card.getAttribute('data-src') || img?.getAttribute('src') || '';
    const tags = (card.getAttribute('data-tags') || '').split(',').map(t => t.trim()).filter(Boolean);

    return {
      index,
      title,
      category,
      desc,
      accent,
      src,
      tags,
      element: card
    };
  });

  let currentIndex = 0;
  let isOpen = false;
  let isZoomed = false;

  // Function to load and display a project by index
  function showProject(index, direction = 0) {
    if (index < 0) index = projects.length - 1;
    if (index >= projects.length) index = 0;
    currentIndex = index;

    const project = projects[currentIndex];
    if (!project) return;

    // Reset zoom state when switching
    resetZoom();

    // Update text and metadata
    if (titleElement) titleElement.textContent = project.title;
    if (categoryElement) categoryElement.textContent = project.category;
    if (descElement) descElement.textContent = project.desc;
    if (counterElement) counterElement.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;

    // Update tags
    if (tagsElement) {
      tagsElement.innerHTML = project.tags.map(tag => `<span class="lightbox-pill">${tag}</span>`).join('');
    }

    // Set accent color variable
    modal.style.setProperty('--modal-accent', project.accent);

    // Crossfade/Slide image animation
    if (direction !== 0) {
      gsap.to(imgElement, {
        x: direction * -40,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          imgElement.src = project.src;
          imgElement.alt = project.title;
          gsap.fromTo(imgElement,
            { x: direction * 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        }
      });
    } else {
      imgElement.src = project.src;
      imgElement.alt = project.title;
      gsap.fromTo(imgElement,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  // Open Lightbox
  function openLightbox(index) {
    isOpen = true;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Pause Lenis smooth scrolling while widened
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    showProject(index, 0);

    // Animate container entrance
    const content = modal.querySelector('.lightbox-content');
    gsap.fromTo(backdrop,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    gsap.fromTo(content,
      { scale: 0.92, y: 20, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
    );
  }

  // Close Lightbox
  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;
    resetZoom();

    const content = modal.querySelector('.lightbox-content');
    gsap.to(content, {
      scale: 0.92,
      y: 20,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Resume Lenis smooth scrolling
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      }
    });
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in'
    });
  }

  // Next / Prev handlers
  function next() {
    showProject(currentIndex + 1, 1);
  }

  function prev() {
    showProject(currentIndex - 1, -1);
  }

  // Zoom Toggle
  function resetZoom() {
    isZoomed = false;
    imgElement.classList.remove('zoomed');
    if (stage) stage.classList.remove('zoomed-stage');
    if (zoomBtn) {
      zoomBtn.classList.remove('active');
      const textSpan = zoomBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = '100% ZOOM';
    }
    gsap.set(imgElement, { x: 0, y: 0, scale: 1 });
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    imgElement.classList.toggle('zoomed', isZoomed);
    if (stage) stage.classList.toggle('zoomed-stage', isZoomed);

    if (zoomBtn) {
      zoomBtn.classList.toggle('active', isZoomed);
      const textSpan = zoomBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = isZoomed ? 'FIT VIEW' : '100% ZOOM';
    }

    if (isZoomed) {
      gsap.to(imgElement, {
        scale: 1.4,
        duration: 0.35,
        ease: 'power2.out'
      });
    } else {
      gsap.to(imgElement, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }

  // Attach card click handlers
  cards.forEach((card, index) => {
    // Clicking anywhere on the project card or its widen button opens the photo widened
    card.addEventListener('click', (e) => {
      // Don't trigger if user clicked an external link if any
      if (e.target.closest('a') && !e.target.closest('.widen-btn')) return;
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Controls listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (zoomBtn) zoomBtn.addEventListener('click', toggleZoom);

  // Click on image toggles zoom
  if (imgElement) {
    imgElement.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZoom();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      next();
    } else if (e.key === 'ArrowLeft') {
      prev();
    }
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchStartY = 0;

  modal.addEventListener('touchstart', (e) => {
    if (!isOpen || isZoomed) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (!isOpen || isZoomed) return;
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) next();
      else prev();
    } else if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
      // Swipe down to close
      closeLightbox();
    }
  }, { passive: true });
}
