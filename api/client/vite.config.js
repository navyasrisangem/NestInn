import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  //  Add base path for correct asset reference
  base: '/client/'
})
