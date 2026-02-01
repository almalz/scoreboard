import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['features/**/*.test.ts', 'app/**/*.test.tsx'],
    globals: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
