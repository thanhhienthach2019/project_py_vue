import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    {
      name: 'log-on-server-start',
      configureServer(server) {
        server.httpServer?.on('listening', () => {
          const address = server.httpServer?.address();
          if (typeof address === 'object' && address?.port) {
            console.log(`✅ Vite HTTPS server is running at https://localhost:${address.port}`);
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@mdi': path.resolve(__dirname, './node_modules/@mdi'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  base: '/',
  server: {
    https: {
      key: (() => {
        const keyPath = path.resolve(__dirname, 'cert/localhost.key');
        console.log('Reading SSL key from:', keyPath);
        try {
          return fs.readFileSync(keyPath);
        } catch (e) {
          console.error('Error reading SSL key:', e);
          throw e;
        }
      })(),
      cert: (() => {
        const certPath = path.resolve(__dirname, 'cert/localhost.crt');
        console.log('Reading SSL cert from:', certPath);
        try {
          return fs.readFileSync(certPath);
        } catch (e) {
          console.error('Error reading SSL cert:', e);
          throw e;
        }
      })(),
    },
    host: 'localhost',
    port: 5173,
    proxy: {
      '/token': {
        target: 'https://localhost:9600',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://localhost:9600',
        changeOrigin: true,
        secure: false,
      },
    },
    open: true,
  },
});
