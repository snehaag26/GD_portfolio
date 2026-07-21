import './style.css';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initCursor } from './js/cursor.js';
import { initNav } from './js/nav.js';
import { initAnimations } from './js/animations.js';

// Setup GSAP
gsap.registerPlugin(ScrollTrigger);

// Setup Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Initialize modules
document.addEventListener('DOMContentLoaded', () => {
  // Preloader could go here (if requested, currently just raw page load)
  
  // Custom Cursor
  initCursor();
  
  // Navigation Orb
  initNav(lenis);
  
  // Section Animations (GSAP)
  initAnimations();
});

// Refresh ScrollTrigger calculations after all images/resources load
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
