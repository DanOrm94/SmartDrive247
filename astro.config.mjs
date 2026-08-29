import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://smartdrive247.co.uk',
  vite: {
    plugins: [tailwindcss()],
  },
});
