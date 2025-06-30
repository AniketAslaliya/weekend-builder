import { lazy } from 'react';

// Lazy load components for code splitting
export const LazyHome = lazy(() => import('@/pages/Home').then(module => ({ default: module.default || module.Home })));
export const LazyAuth = lazy(() => import('@/pages/Auth').then(module => ({ default: module.default || module.Auth })));
export const LazyProjects = lazy(() => import('@/pages/Projects').then(module => ({ default: module.default || module.Projects })));
export const LazyEvents = lazy(() => import('@/pages/Events').then(module => ({ default: module.default || module.Events })));
export const LazyEventDetail = lazy(() => import('@/pages/EventDetail').then(module => ({ default: module.default || module.EventDetail })));
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard').then(module => ({ default: module.default || module.AdminDashboard })));
export const LazyAIBuilder = lazy(() => import('@/pages/AIBuilder').then(module => ({ default: module.default || module.AIBuilder })));
export const LazyLeaderboard = lazy(() => import('@/pages/Leaderboard').then(module => ({ default: module.default || module.Leaderboard })));
export const LazyProfile = lazy(() => import('@/pages/Profile').then(module => ({ default: module.default || module.Profile })));

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Core Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined' && 'web-vital' in window) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};

// Image optimization utilities
export const generateSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200]) => {
  return sizes.map(size => `${baseUrl}?w=${size}&auto=format&q=75 ${size}w`).join(', ');
};

export const generateWebPSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200]) => {
  return sizes.map(size => `${baseUrl}?w=${size}&auto=format&fm=webp&q=75 ${size}w`).join(', ');
};