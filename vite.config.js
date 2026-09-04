import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      includePublic: true,
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 82 },
      webp: { quality: 82, effort: 6 },
      avif: { quality: 60 },
      svg: { multipass: true },
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: { compress: { drop_console: true, drop_debugger: true } },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor';
          if (id.includes('node_modules/framer-motion')) return 'motion';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
