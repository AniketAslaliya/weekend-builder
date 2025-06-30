import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export function SupabaseSetup() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const envTemplate = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-warning-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            supabase setup required
          </h1>
          <p className="text-xl text-light-300 max-w-2xl mx-auto">
            to enable authentication and database features, you need to configure supabase. follow these simple steps:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Card variant="default" className="p-8">
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      create supabase project
                    </h3>
                    <p className="text-light-400 mb-4">
                      go to supabase.com and create a new project. this will be your backend database and authentication provider.
                    </p>
                    <Button 
                      variant="outline" 
                      size="md"
                      onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      open supabase dashboard
                    </Button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      get your credentials
                    </h3>
                    <p className="text-light-400 mb-4">
                      in your supabase dashboard, go to settings → api and copy your project url and anon key.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="primary" size="sm">settings → api → project url</Badge>
                      <Badge variant="primary" size="sm">settings → api → anon/public key</Badge>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      create .env file
                    </h3>
                    <p className="text-light-400 mb-4">
                      create a .env file in your project root and add your supabase credentials:
                    </p>
                    <div className="bg-dark-800 rounded-lg p-4 relative">
                      <pre className="text-sm text-light-200 overflow-x-auto">
                        <code>{envTemplate}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(envTemplate, 3)}
                        className="absolute top-2 right-2 p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        {copiedStep === 3 ? (
                          <Check className="w-4 h-4 text-success-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-light-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      run database migrations
                    </h3>
                    <p className="text-light-400 mb-4">
                      in your supabase dashboard, go to sql editor and run the migration files from the supabase/migrations folder in your project.
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" size="sm">sql editor → new query</Badge>
                      <Badge variant="secondary" size="sm">copy & paste migration files</Badge>
                      <Badge variant="secondary" size="sm">run in order</Badge>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-success-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      restart your development server
                    </h3>
                    <p className="text-light-400 mb-4">
                      after setting up your .env file, restart your development server to load the new environment variables.
                    </p>
                    <div className="bg-dark-800 rounded-lg p-4 relative">
                      <pre className="text-sm text-light-200">
                        <code>npm run dev</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('npm run dev', 5)}
                        className="absolute top-2 right-2 p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        {copiedStep === 5 ? (
                          <Check className="w-4 h-4 text-success-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-light-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-accent-600/10 border border-accent-600/20 rounded-lg">
                <h4 className="font-bold text-white mb-2">need help?</h4>
                <p className="text-light-300 text-sm mb-4">
                  if you're having trouble, check out the supabase documentation or the readme file in your project.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://supabase.com/docs', '_blank')}
                    icon={<ExternalLink className="w-4 h-4" />}
                  >
                    supabase docs
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    refresh page
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}