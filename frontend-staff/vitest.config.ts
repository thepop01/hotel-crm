import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,pbt,spec}.ts', 'src/**/*.{test,pbt,spec}.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/utils/**', 'src/services/**'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
