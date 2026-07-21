import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePrerenderPlugin } from 'vite-prerender-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Renders '/' to static HTML at build time so crawlers, link previews and AI
    // agents see real content rather than an empty SPA shell. See src/prerender.tsx.
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: './src/prerender.tsx',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
