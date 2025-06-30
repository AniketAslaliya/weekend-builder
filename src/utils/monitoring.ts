// Sentry configuration
export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    import('@sentry/react').then(({ init, BrowserTracing }) => {
      init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new BrowserTracing(),
        ],
        tracesSampleRate: 1.0,
        environment: import.meta.env.MODE,
        beforeSend(event) {
          // Filter out non-critical errors
          if (event.exception) {
            const error = event.exception.values?.[0];
            if (error?.type === 'ChunkLoadError') {
              return null; // Don't send chunk load errors
            }
          }
          return event;
        }
      });
    });
  }
};

// Performance monitoring
export const trackPerformance = (name: string, fn: () => Promise<any> | any) => {
  const start = performance.now();
  
  const finish = () => {
    const end = performance.now();
    const duration = end - start;
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    // Send to analytics in production
    if (import.meta.env.PROD && 'gtag' in window) {
      (window as any).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      });
    }
  };
  
  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(finish);
    } else {
      finish();
      return result;
    }
  } catch (error) {
    finish();
    throw error;
  }
};

// Error boundary for React components
export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Application Error:', error, context);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    import('@sentry/react').then(({ captureException: sentryCaptureException, setContext }) => {
      if (context) {
        setContext('error_context', context);
      }
      sentryCaptureException(error);
    });
  }
};

// Health check utility
export const healthCheck = async (): Promise<{ status: 'ok' | 'error'; checks: Record<string, boolean> }> => {
  const checks: Record<string, boolean> = {};
  
  try {
    // Check Supabase connection
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('profiles').select('id').limit(1);
      checks.database = !error;
    } else {
      checks.database = false;
    }
    
    // Check authentication
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.getSession();
      checks.auth = !error;
    } else {
      checks.auth = false;
    }
    
    // Check local storage
    try {
      localStorage.setItem('health_check', 'test');
      localStorage.removeItem('health_check');
      checks.localStorage = true;
    } catch {
      checks.localStorage = false;
    }
    
    const allHealthy = Object.values(checks).every(Boolean);
    
    return {
      status: allHealthy ? 'ok' : 'error',
      checks
    };
  } catch (error) {
    captureException(error as Error, { context: 'health_check' });
    return {
      status: 'error',
      checks
    };
  }
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const sendToAnalytics = (metric: any) => {
        if (import.meta.env.PROD && 'gtag' in window) {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
        
        // Log in development
        if (import.meta.env.DEV) {
          console.log('Web Vital:', metric);
        }
      };

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    });
  }
};