import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      pages: resolve(__dirname, 'src/pages'),
      layouts: resolve(__dirname, 'src/layouts'),
    },
  },
  test: {
    environment: 'jsdom',
  },
});
