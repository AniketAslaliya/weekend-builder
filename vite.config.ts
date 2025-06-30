import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks
          'auth': ['src/pages/Auth.tsx', 'src/hooks/useAuth.ts'],
          'events': ['src/pages/Events.tsx', 'src/pages/EventDetail.tsx'],
          'projects': ['src/pages/Projects.tsx'],
          'admin': ['src/pages/AdminDashboard.tsx'],
          'ai-builder': ['src/pages/AIBuilder.tsx'],
          'profile': ['src/pages/Profile.tsx'],
          'leaderboard': ['src/pages/Leaderboard.tsx'],
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Enable compression
  server: {
    compress: true,
  },
  // Preload critical resources
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` };
      } else {
        return { relative: true };
      }
    },
  },
});