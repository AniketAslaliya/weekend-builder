import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, Code2, Zap, Rocket, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SupabaseSetup } from '@/components/ui/SupabaseSetup';
import { isValidEmail, validatePasswordStrength, formatErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AuthFormData {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
}

export function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isSupabaseConfigured } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    clearErrors,
  } = useForm<AuthFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  // Show setup page if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SupabaseSetup />;
  }

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    clearErrors();

    try {
      if (mode === 'signup') {
        // Validate password confirmation
        if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(data.password);
        if (!passwordValidation.isValid) {
          toast.error(passwordValidation.errors[0]);
          setLoading(false);
          return;
        }

        // Validate email format
        if (!isValidEmail(data.email)) {
          toast.error('Please enter a valid email address');
          setLoading(false);
          return;
        }

        const { data: authData, error } = await signUp(data.email, data.password, {
          display_name: data.displayName || data.email.split('@')[0],
        });
        
        if (error) {
          console.error('Signup error:', error);
          toast.error(formatErrorMessage(error));
          setLoading(false);
          return;
        }

        // If signup successful
        if (authData.user) {
          if (authData.user.email_confirmed_at) {
            toast.success('🎉 Welcome to Weekend Builder! Account created successfully!');
            navigate('/profile');
          } else {
            toast.success('Please check your email to confirm your account!');
            navigate('/');
          }
        } else {
          toast.success('Please check your email to confirm your account!');
          navigate('/');
        }
      } else {
        // Validate email format for sign in
        if (!isValidEmail(data.email)) {
          toast.error('Please enter a valid email address');
          setLoading(false);
          return;
        }

        const { data: authData, error } = await signIn(data.email, data.password);
        
        if (error) {
          console.error('Signin error:', error);
          toast.error(formatErrorMessage(error));
          setLoading(false);
          return;
        }

        // If signin successful
        if (authData.user) {
          // Navigate to the intended destination or home
          navigate(from !== '/auth' ? from : '/');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'signup' ? 'signin' : 'signup';
    setMode(newMode);
    reset();
    clearErrors();
    setShowPassword(false);
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    if (newMode === 'signup') {
      newSearchParams.set('mode', 'signup');
    }
    navigate(`/auth?${newSearchParams.toString()}`, { replace: true });
  };

  // Demo login handler
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await signIn('demo@weekendbuilder.com', 'Demo123!');
      if (error) {
        toast.error('Demo login failed.');
      } else if (data?.user) {
        toast.success('Logged in as demo user!');
        navigate('/');
      }
    } catch (err) {
      toast.error('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card variant="default" className="overflow-hidden shadow-2xl border-2 border-accent-500/30">
            <CardHeader className="text-center bg-gradient-to-r from-accent-600 via-orange-500 to-yellow-400 text-white relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center justify-center space-y-2 mb-6"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight uppercase">build. hustle. win.</span>
                <div className="text-sm opacity-90 font-semibold tracking-wide">join the next wave of creators</div>
              </motion.div>
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Badge variant="secondary" size="md" className="bg-white/20 text-white border-white/30 mb-4">
                    <Flame className="w-4 h-4 mr-2 animate-pulse" />
                    {mode === 'signup' ? 'join the festival' : 'welcome back'}
                  </Badge>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-2xl font-extrabold drop-shadow-lg"
                >
                  {mode === 'signup' ? 'start your journey' : 'continue building'}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-white/90 leading-relaxed text-sm font-medium"
                >
                  {mode === 'signup' 
                    ? 'Unleash your inner builder. Join thousands of hustlers, founders, and creators building amazing projects every weekend.'
                    : "Welcome back to the most energetic building community. Let's hustle!"}
                </motion.p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-8 bg-dark-800 text-light-200">
              {/* Email Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-4"
                noValidate
              >
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label="display name"
                        type="text"
                        icon={<User className="w-4 h-4" />}
                        className="bg-dark-700 border-dark-600 text-white focus:border-accent-500"
                        placeholder="Enter your display name"
                        {...register('displayName', {
                          required: mode === 'signup' ? 'Display name is required' : false,
                          minLength: {
                            value: 2,
                            message: 'Display name must be at least 2 characters'
                          }
                        })}
                        error={errors.displayName?.message}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Input
                  label="email address"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  className="bg-dark-700 border-dark-600 text-white focus:border-accent-500"
                  placeholder="Enter your email address"
                  {...register('email', {
                    required: 'Email is required',
                    validate: (value) => {
                      if (!isValidEmail(value)) {
                        return 'Please enter a valid email address';
                      }
                      return true;
                    }
                  })}
                  error={errors.email?.message}
                />
                <div className="relative">
                  <Input
                    label="password"
                    type={showPassword ? 'text' : 'password'}
                    icon={<Lock className="w-4 h-4" />}
                    className="bg-dark-700 border-dark-600 text-white focus:border-accent-500 pr-10"
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      validate: (value) => {
                        if (mode === 'signup') {
                          const validation = validatePasswordStrength(value);
                          if (!validation.isValid) {
                            return validation.errors[0];
                          }
                        }
                        return true;
                      }
                    })}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-light-400 hover:text-light-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        label="confirm password"
                        type={showPassword ? 'text' : 'password'}
                        icon={<Lock className="w-4 h-4" />}
                        className="bg-dark-700 border-dark-600 text-white focus:border-accent-500"
                        placeholder="Confirm your password"
                        {...register('confirmPassword', {
                          required: mode === 'signup' ? 'Please confirm your password' : false,
                          validate: (value) => {
                            if (mode === 'signup' && value !== watchPassword) {
                              return 'Passwords do not match';
                            }
                            return true;
                          }
                        })}
                        error={errors.confirmPassword?.message}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-extrabold text-lg tracking-wide bg-gradient-to-r from-accent-600 via-orange-500 to-yellow-400 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
                  loading={loading}
                  disabled={loading}
                  glow
                >
                  {mode === 'signup' ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-spin" />
                      create account & start building
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      sign in & continue building
                    </>
                  )}
                </Button>
              </motion.form>
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-accent-400 hover:text-accent-300 font-bold transition-colors text-sm underline underline-offset-4"
                  disabled={loading}
                >
                  {mode === 'signup' 
                    ? 'already have an account? sign in'
                    : "don't have an account? join the festival"
                  }
                </button>
              </div>
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full font-bold bg-gradient-to-r from-accent-600 via-orange-500 to-yellow-400 text-white shadow hover:scale-105 transition-all duration-200"
                  onClick={handleDemoLogin}
                  loading={loading}
                  disabled={loading}
                  icon={<Zap className="w-4 h-4 mr-2 animate-pulse" />}
                >
                  Demo Login (Instant Access)
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}