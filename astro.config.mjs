// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel'; 
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
    vite: {
      resolve: {
        alias: {
          '@components': '/src/components',
          '@layouts': '/src/layouts',
          '@styles': '/src/styles',
          '@assets': '/src/assets',
          '@lib': '/src/lib',
        }
      },

      plugins: [tailwindcss()]
    },
    adapter: vercel(),
});