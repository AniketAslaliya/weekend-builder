import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  Award, 
  TrendingUp, 
  Zap, 
  Code2, 
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { StatCard } from '@/components/ui/StatCard';
import { PillChip } from '@/components/ui/PillChip';

export function Community() {
  const communityStats = [
    { label: 'active builders', value: '12,847', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'projects created', value: '45,293', icon: Code2, color: 'from-green-500 to-emerald-500' },
    { label: 'events hosted', value: '156', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { label: 'countries', value: '89', icon: Globe, color: 'from-orange-500 to-red-500' }
  ];

  const featuredMembers = [
    {
      id: '1',
      name: 'sarah chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'community champion',
      projects: 23,
      points: 2847,
      badges: ['🏆 grand prize winner', '🔥 weekend warrior', '⭐ community champion']
    },
    {
      id: '2',
      name: 'alex kumar',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'innovation master',
      projects: 18,
      points: 2634,
      badges: ['🚀 innovation master', '🤝 team player', '💡 creative genius']
    },
    {
      id: '3',
      name: 'jamie rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      role: 'design expert',
      projects: 15,
      points: 2456,
      badges: ['🎨 design excellence', '🔥 streak master', '🌟 rising star']
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'ai-powered solutions weekend',
      date: '2025-02-15',
      participants: 847,
      prize: '$5,000',
      status: 'registration open'
    },
    {
      id: '2',
      title: 'web3 & blockchain builder weekend',
      date: '2025-02-22',
      participants: 423,
      prize: '$6,000',
      status: 'coming soon'
    },
    {
      id: '3',
      title: 'startup mvp weekend',
      date: '2025-03-01',
      participants: 234,
      prize: '$3,000',
      status: 'coming soon'
    }
  ];

  const communityFeatures = [
    {
      title: 'global collaboration',
      description: 'connect with builders from around the world and collaborate on amazing projects',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'mentorship program',
      description: 'learn from experienced builders and mentors in our community',
      icon: Users,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'skill sharing',
      description: 'share your expertise and learn new skills from fellow builders',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'recognition system',
      description: 'earn badges, points, and recognition for your contributions',
      icon: Award,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-center">
            <Badge variant="primary" size="lg" className="mb-4" glow>
              <Users className="w-4 h-4 mr-2" />
              community
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              join the global builder community
            </h1>
            <p className="text-xl text-light-300 max-w-2xl mx-auto">
              connect with thousands of passionate builders, share knowledge, and create amazing projects together
            </p>
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <StatCard
                    label={stat.label}
                    value={stat.value}
                    icon={<Icon className="w-6 h-6" />}
                    className={`bg-gradient-to-r ${stat.color}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Members */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassyCard className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-accent-400" />
                  featured members
                </h2>
                <p className="text-light-300">
                  meet our top contributors and community champions
                </p>
              </div>
              <div className="space-y-6">
                {featuredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur rounded-lg border border-accent-400/20"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full border-2 border-accent-400"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-accent-400 text-sm mb-2">{member.role}</p>
                      <div className="flex items-center space-x-4 text-sm text-light-400 mb-2">
                        <span>{member.projects} projects</span>
                        <span>{member.points} points</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.badges.slice(0, 2).map((badge, badgeIndex) => (
                          <PillChip key={badgeIndex}>{badge}</PillChip>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassyCard>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GlassyCard className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-accent-400" />
                  upcoming events
                </h2>
                <p className="text-light-300">
                  join our next building weekends and compete for prizes
                </p>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-4 bg-white/5 backdrop-blur rounded-lg border border-accent-400/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{event.title}</h3>
                      <Badge 
                        variant={event.status === 'registration open' ? 'success' : 'gray'} 
                        size="sm"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-light-400">
                      <span>{event.date}</span>
                      <span>{event.participants} participants</span>
                      <span className="text-accent-400 font-semibold">{event.prize}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassyCard>
          </motion.div>
        </div>

        {/* Community Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <GlassyCard className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-accent-400" />
                community features
              </h2>
              <p className="text-light-300">
                discover what makes our community special
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {communityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-light-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassyCard>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <GlassyCard className="max-w-2xl mx-auto p-12">
            <Users className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              ready to join the community?
            </h3>
            <p className="text-light-300 mb-8 leading-relaxed">
              become part of the most exciting builder community on the planet
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" glow>
                <Users className="w-5 h-5 mr-2" />
                join community
              </Button>
              <Button variant="outline" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                start chatting
              </Button>
            </div>
          </GlassyCard>
        </motion.div>
      </div>
    </div>
  );
}
