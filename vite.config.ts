import { defineConfig } from 'vite'
//@ts-ignore
import react from '@vitejs/plugin-react'

const enableSourceMaps = process.env.ENABLE_SOURCEMAPS === 'true'

export default defineConfig({
  base: process.env.CDN_BASE_URL || '/',
  plugins: [
    react()
  ],
  server: {
    open: true,
    port: 3000
  },
  build:{
    outDir: "build",
    assetsDir: 'assets',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    sourcemap: enableSourceMaps,
    manifest: true
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      src: "/src",
    },
  },
})
