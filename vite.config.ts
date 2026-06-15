import { defineConfig } from 'vite'
//@ts-ignore
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
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
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      src: "/src",
    },
  },
})
