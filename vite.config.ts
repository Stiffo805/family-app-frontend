import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
const root = path.resolve(__dirname, 'src')
const publicPath = path.resolve(__dirname, 'public')

export default defineConfig({
  base: '/family-app-frontend/',
  plugins: [react()],
  resolve: {
    alias: {
      '@src': root,
      '@public': publicPath
    }
  }
})
