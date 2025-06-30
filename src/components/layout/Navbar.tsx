import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Folder, 
  Zap, 
  Trophy, 
  User, 
  Menu,
  X,
  Code2,
  LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/projects', label: 'Projects', icon: Folder },
  { path: '/ai-builder', label: 'AI Builder', icon: Zap },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-dark-900/95 backdrop-blur-xl border-b border-dark-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center"
            >
              <Code2 className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">
                Weekend Builder
              </span>
              <span className="text-xs text-light-400 -mt-1">Build. Create. Win.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
                      isActive 
                        ? 'bg-accent-600 text-white' 
                        : 'text-light-300 hover:bg-dark-800 hover:text-accent-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNavClick('/profile')}>
                  <Button variant="ghost" size="md" icon={<User className="w-4 h-4" />}>
                    Profile
                  </Button>
                </button>
                <Button variant="outline" size="md" onClick={handleSignOut} icon={<LogOut className="w-4 h-4" />}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNavClick('/auth')}>
                  <Button variant="ghost" size="md">
                    Sign In
                  </Button>
                </button>
                <button onClick={() => handleNavClick('/auth?mode=signup')}>
                  <Button variant="primary" size="md" glow>
                    Get Started
                  </Button>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-light-300" />
            ) : (
              <Menu className="w-5 h-5 text-light-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-900/98 backdrop-blur-xl border-t border-dark-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={clsx(
                      'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left',
                      isActive 
                        ? 'bg-accent-600 text-white' 
                        : 'text-light-300 hover:bg-dark-800'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-dark-700 pt-4 space-y-2">
                {user ? (
                  <>
                    <button onClick={() => handleNavClick('/profile')}>
                      <Button variant="ghost" size="md" className="w-full justify-start" icon={<User className="w-4 h-4" />}>
                        Profile
                      </Button>
                    </button>
                    <Button variant="outline" size="md" className="w-full" onClick={handleSignOut} icon={<LogOut className="w-4 h-4" />}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleNavClick('/auth')}>
                      <Button variant="ghost" size="md" className="w-full">
                        Sign In
                      </Button>
                    </button>
                    <button onClick={() => handleNavClick('/auth?mode=signup')}>
                      <Button variant="primary" size="md" className="w-full" glow>
                        Get Started
                      </Button>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}