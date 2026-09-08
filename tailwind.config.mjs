/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#0C0D0F',
        graphite: '#15171A',
        panel: '#1B1E22',
        gold: '#C7A56A',
        'gold-soft': '#E1C791',
        mist: '#B8BDC6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0,0,0,.28)'
      }
    }
  },
  plugins: []
};
