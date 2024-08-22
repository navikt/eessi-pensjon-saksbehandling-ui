import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    viteTsconfigPaths()
  ],
  server: {
    open: true,
    port: 3000,
    fs: {
      cachedChecks: false
    }
  },
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['moment']
  },
  build:{
    outDir: "build",
    assetsDir: 'assets',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
})
