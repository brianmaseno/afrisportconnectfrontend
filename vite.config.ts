import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const target = env.VITE_API_PROXY_TARGET;

  /**
   * The deployed Laravel host does not send Access-Control-Allow-Origin for
   * browser origins (CORS_ALLOWED_ORIGINS is unset), so a direct fetch from
   * localhost fails. Proxying /api through Vite makes the call same-origin
   * during development — the browser never performs a cross-origin request,
   * and the backend needs no change.
   *
   * Production still needs the API host to allow the site's origin.
   */
  const proxy: Record<string, ProxyOptions> | undefined = target
    ? {
        '/api': {
          target,
          changeOrigin: true,
          secure: true,
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      }
    : undefined;

  return {
    plugins: [react()],
    base: '/',
    build: {
      // Marketing site stays in website/ — do not overwrite Laravel admin public root.
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      proxy,
    },
    preview: {
      port: 4173,
      proxy,
    },
    // SPA deep links when previewing / hosting static build
    appType: 'spa',
  };
});
