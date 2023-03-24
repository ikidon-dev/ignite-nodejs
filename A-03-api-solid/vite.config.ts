import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
  plugins: [viteTsConfigPaths()],
})
