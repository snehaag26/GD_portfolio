import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        work: resolve(__dirname, 'work.html'),
        lab: resolve(__dirname, 'lab.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
