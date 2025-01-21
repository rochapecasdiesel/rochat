import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    isolate: true, // Garante isolamento entre os testes
    globals: true,
    environment: 'node',
  },
})
