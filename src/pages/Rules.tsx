import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users,
  Heart,
  Code2,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';

export function Rules() {
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
              <BookOpen className="w-4 h-4 mr-2" />
              rules & guidelines
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              community standards
            </h1>
            <p className="text-xl text-light-300 max-w-2xl mx-auto">
              our rules ensure a fair, respectful, and inspiring environment for all builders
            </p>
          </div>
        </motion.div>

        <GlassyCard className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Core Principles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-red-400 mt-1" />
                <div>
                  <h3 className="font-bold text-white">Respect & Inclusivity</h3>
                  <p className="text-light-300 text-sm">Treat everyone with respect and create an inclusive environment.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-bold text-white">Collaboration Over Competition</h3>
                  <p className="text-light-300 text-sm">Focus on helping each other grow and succeed together.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Code2 className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <h3 className="font-bold text-white">Innovation & Creativity</h3>
                  <p className="text-light-300 text-sm">Push boundaries and create something truly amazing.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-purple-400 mt-1" />
                <div>
                  <h3 className="font-bold text-white">Integrity & Honesty</h3>
                  <p className="text-light-300 text-sm">Be honest about your work and give credit where it's due.</p>
                </div>
              </div>
            </div>
          </div>
        </GlassyCard>
      </div>
    </div>
  );
}
