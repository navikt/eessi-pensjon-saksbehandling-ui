import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    setupFiles: './vitest-setup.ts',
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
