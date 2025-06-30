import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SkeletonLoader } from './SkeletonLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <SkeletonLoader variant="card" className="w-64 h-32 mx-auto" />
          <p className="text-light-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If Supabase is not configured, show setup page
  if (!isSupabaseConfigured) {
    return <Navigate to="/auth" replace />;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access auth page, redirect to home
  if (!requireAuth && user && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 