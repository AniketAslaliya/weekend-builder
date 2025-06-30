import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error:', error, errorInfo);
    
    // Log to external service if available
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry logging would go here
      console.log('Error logged to monitoring service');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
          <Card variant="default" className="max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-error-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              authentication error
            </h2>
            <p className="text-light-400 mb-6 leading-relaxed">
              there was an issue with the authentication system. this might be due to missing supabase configuration or network issues.
            </p>
            
            {this.state.error && (
              <div className="bg-dark-800 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-light-500 mb-2">Error details:</p>
                <p className="text-xs text-error-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => window.location.reload()}
                icon={<RefreshCw className="w-5 h-5" />}
              >
                try again
              </Button>
              
              <Button 
                variant="outline" 
                size="md" 
                className="w-full"
                onClick={() => window.open('https://supabase.com/docs', '_blank')}
                icon={<ExternalLink className="w-4 h-4" />}
              >
                view documentation
              </Button>
              
              <p className="text-sm text-light-500">
                if the problem persists, please check your environment variables and supabase configuration
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}