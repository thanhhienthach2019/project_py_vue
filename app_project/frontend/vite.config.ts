import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@mdi': path.resolve(__dirname, './node_modules/@mdi'),
    },
  },
  server: {
    proxy: {
      "/token": "http://localhost:8000",
    },
  },
});
