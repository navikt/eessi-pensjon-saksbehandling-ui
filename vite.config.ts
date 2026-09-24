import { defineConfig } from 'vite'
//@ts-ignore
import react from '@vitejs/plugin-react'
import {IS_Q} from "./src/constants/environment";

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
    sourcemap: IS_Q,
    manifest: true
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      src: "/src",
    },
  },
})
