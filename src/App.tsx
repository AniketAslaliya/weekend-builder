import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthErrorBoundary } from '@/components/ui/AuthErrorBoundary';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { initSentry, trackWebVitals, captureException } from '@/utils/monitoring';

// Lazy load components for code splitting
import { 
  LazyHome,
  LazyAuth,
  LazyProjects,
  LazyEvents,
  LazyEventDetail,
  LazyAdminDashboard,
  LazyAIBuilder,
  LazyLeaderboard,
  LazyProfile
} from '@/utils/performance';

// Create a client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  useEffect(() => {
    captureException(error, { context: 'app_error_boundary' });
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-light-400 mb-6">We're sorry, but something unexpected happened.</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center">
        <SkeletonLoader variant="card" className="w-64 h-32 mx-auto mb-4" />
        <p className="text-light-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize monitoring
    initSentry();
    trackWebVitals();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-dark-950 flex flex-col">
              <Navbar />
              
              <main className="flex-1 pb-16 sm:pb-0">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<LazyHome />} />
                    <Route path="/auth" element={
                      <ProtectedRoute requireAuth={false}>
                        <LazyAuth />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={<LazyProjects />} />
                    <Route path="/events" element={<LazyEvents />} />
                    <Route path="/events/:id" element={<LazyEventDetail />} />
                    <Route path="/admin" element={
                      <ProtectedRoute requireAuth={true}>
                        <LazyAdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai-builder" element={<LazyAIBuilder />} />
                    <Route path="/leaderboard" element={<LazyLeaderboard />} />
                    <Route path="/profile" element={
                      <ProtectedRoute requireAuth={true}>
                        <LazyProfile />
                      </ProtectedRoute>
                    } />
                    
                    {/* Placeholder routes for future implementation */}
                    <Route path="/rules" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">rules & guidelines - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/help" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">help center - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/mentors" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">become a mentor - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/sponsors" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">sponsor an event - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/privacy" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">privacy policy - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/terms" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">terms of service - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/code-of-conduct" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">code of conduct - coming soon!</h1>
                      </div>
                    } />
                    <Route path="/contact" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <h1 className="text-2xl font-bold text-white">contact us - coming soon!</h1>
                      </div>
                    } />
                    
                    {/* Health check route */}
                    <Route path="/status" element={
                      <div className="min-h-screen flex items-center justify-center bg-dark-950">
                        <div className="text-center">
                          <h1 className="text-2xl font-bold text-white mb-4">System Status</h1>
                          <p className="text-light-400">All systems operational</p>
                        </div>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              <MobileNavigation />
              
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    border: '1px solid #374151',
                  },
                  success: {
                    iconTheme: {
                      primary: '#0ea5e9',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </QueryClientProvider>
      </AuthErrorBoundary>
    </ErrorBoundary>
  );
}