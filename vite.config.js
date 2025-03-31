import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  // Remove or comment out the base path for Vercel deployment
  // base: process.env.VITE_BASE_PATH || "/cosmetic_formula_frontend",
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  } 
})