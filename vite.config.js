import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    base: './', // Generates relative asset paths so it runs flawlessly on any hosting subdirectory (e.g., GitHub Pages) or custom domain
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-server',
        configureServer(server) {
          // Dynamically import handler only in dev mode (not during build)
          import('./src/api/handler.js').then(({ handleApiRequest }) => {
            server.middlewares.use('/api', (req, res, next) => {
              handleApiRequest(req, res);
            });
          }).catch(() => {
            console.log('[Vite] API handler not available — running in static mode.');
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
