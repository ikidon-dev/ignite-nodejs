import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 1000 * 60 * 60 * 24,
  },
})
