import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the built site can be hosted from any path (root or subfolder).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
