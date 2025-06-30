import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search,
  BookOpen,
  Zap,
  FileText,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { Input } from '@/components/ui/Input';

export function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-center">
            <Badge variant="primary" size="lg" className="mb-4" glow>
              <HelpCircle className="w-4 h-4 mr-2" />
              help center
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              how can we help you?
            </h1>
            <p className="text-xl text-light-300 max-w-2xl mx-auto">
              find answers to common questions and get support when you need it
            </p>
          </div>
        </motion.div>

        <GlassyCard className="p-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-400 w-5 h-5" />
              <Input
                placeholder="search for help articles, faqs, or guides..."
                className="pl-12 text-lg py-4 bg-white text-primary placeholder-dark-400 focus:border-accent-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <BookOpen className="w-12 h-12 text-accent-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Getting Started</h3>
              <p className="text-light-300 text-sm">New to Weekend Builder? Start here</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Events & Competitions</h3>
              <p className="text-light-300 text-sm">Everything about participating in events</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Projects & Submissions</h3>
              <p className="text-light-300 text-sm">How to create and submit your projects</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-2">Community & Networking</h3>
              <p className="text-light-300 text-sm">Connect with other builders</p>
            </div>
          </div>
        </GlassyCard>
      </div>
    </div>
  );
}
