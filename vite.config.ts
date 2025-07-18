import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'basic-result',
      fileName: 'basic-result',
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
  plugins: [dts({
    entryRoot: 'lib',
    outDir: 'dist/types',
  })],
})
