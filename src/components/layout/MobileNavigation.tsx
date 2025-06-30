import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Upload, 
  User,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/submit', label: 'Submit', icon: Plus },
  { path: '/profile', label: 'Profile', icon: User },
];

export function MobileNavigation() {
  const { user } = useAuth();
  const location = useLocation();

  // Only show on mobile screens
  if (typeof window !== 'undefined' && window.innerWidth > 640) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-xl border-t border-dark-700 sm:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          // Don't show profile if not authenticated
          if (item.path === '/profile' && !user) {
            return (
              <Link
                key="/auth"
                to="/auth"
                className="flex flex-col items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-lg transition-all duration-200 text-light-400 hover:text-accent-400 hover:bg-dark-800"
                aria-label="Sign in"
              >
                <User className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">Sign In</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center justify-center p-3 min-w-[44px] min-h-[44px] rounded-lg transition-all duration-200',
                isActive 
                  ? 'text-accent-400 bg-accent-600/20' 
                  : 'text-light-400 hover:text-accent-400 hover:bg-dark-800'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-accent-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </motion.nav>
  );
}