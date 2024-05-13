import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "/",
  plugins: [react(
/*    {
    jsxRuntime: 'classic', // Add this line
    include: /\.(jsx|tsx)$/,
    babel: {
      babelrc: false,
      configFile: false,
    },
  }*/
  ),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    viteTsconfigPaths(), nodePolyfills()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
    fs: {
      cachedChecks: false
    }
  },
  define: {
    'process.env': {}
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
