import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ['__tests__/e2e/**.spec.ts', 'database'],
      ['__tests__/unit/**', 'node'],
    ],
    setupFiles: ['./setup.ts'],
  },
})
