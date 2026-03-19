/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'

const swHeaderPlugin = () => ({
  name: 'sw-header',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      // Inject the header whenever the browser asks for the Service Worker file
      if (req.url?.includes('sw.ts')) {
        res.setHeader('Service-Worker-Allowed', '/')
      }
      next()
    })
  }
})

// https://vite.dev/config/
const root = path.resolve(__dirname, 'src')
const publicPath = path.resolve(__dirname, 'public')

export default defineConfig({
  base: '/family-app-frontend',
  plugins: [react(), swHeaderPlugin()],
  resolve: {
    alias: {
      '@src': root,
      '@public': publicPath
    }
  },
  build: {
    rollupOptions: {
      input: {
        // Your main application entry point
        main: resolve(__dirname, 'index.html'),
        // Your Service Worker entry point
        sw: resolve(__dirname, 'src/sw.ts')
      },
      output: {
        // Force the Service Worker to be named 'sw.js' in the root directory
        // while other compiled files get standard hashes in the 'assets/' folder.
        entryFileNames: (assetInfo) => {
          return assetInfo.name === 'sw'
            ? '[name].js'
            : 'assets/[name]-[hash].js'
        }
      }
    }
  }
})
