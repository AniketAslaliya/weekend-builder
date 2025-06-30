import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Trophy, 
  Zap, 
  ArrowRight,
  Clock,
  Star,
  Rocket,
  Heart,
  Code2,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { StatCard } from '@/components/ui/StatCard';
import { PillChip } from '@/components/ui/PillChip';
import { ProjectSubmissionModal } from '@/components/ui/ProjectSubmissionModal';

export function Home() {
  const navigate = useNavigate();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Mock data for current event
  const currentEvent = {
    id: '1',
    title: 'ai-powered solutions weekend',
    theme: 'build the future with ai 🤖',
    description: 'create innovative solutions using artificial intelligence to solve real-world problems and win amazing prizes.',
    daysLeft: 2,
    hoursLeft: 14,
    minutesLeft: 32,
    participantsCount: 847,
    projectsCount: 156,
    prizes: ['$5,000 grand prize', 'ai api credits', 'mentorship sessions', 'startup accelerator'],
  };

  const howItWorksSteps = [
    {
      step: 1,
      title: 'join the festival',
      description: 'sign up and join this weekend\'s themed building challenge with thousands of creators',
      icon: Users,
    },
    {
      step: 2,
      title: 'build & create',
      description: 'use our ai tools to build amazing projects solo or with a team of passionate builders',
      icon: Zap,
    },
    {
      step: 3,
      title: 'share & get feedback',
      description: 'submit your project and get valuable feedback from the global community',
      icon: Heart,
    },
    {
      step: 4,
      title: 'win & celebrate',
      description: 'earn badges, climb leaderboards, win prizes, and celebrate your success',
      icon: Trophy,
    }
  ];

  const featuredProjects = [
    {
      id: '1',
      title: 'ai recipe generator',
      description: 'generate personalized recipes based on dietary preferences and available ingredients using advanced machine learning',
      creator: 'sarah chen',
      votes: 127,
      tags: ['ai', 'food', 'health'],
      image: 'https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true
    },
    {
      id: '2',
      title: 'smart study planner',
      description: 'ai-powered study scheduler that adapts to your learning style and optimizes retention rates',
      creator: 'alex kumar',
      votes: 93,
      tags: ['ai', 'education', 'productivity'],
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: false
    },
    {
      id: '3',
      title: 'mood music matcher',
      description: 'detects your mood through voice and creates perfect playlists that match your emotional state',
      creator: 'jamie rodriguez',
      votes: 156,
      tags: ['ai', 'music', 'wellness'],
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true
    }
  ];

  const stats = [
    { label: 'active builders', value: '2,847', icon: Users },
    { label: 'projects built', value: '1,293', icon: Rocket },
    { label: 'weekend events', value: '42', icon: Calendar },
    { label: 'community votes', value: '15,672', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 to-dark-950"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Badge variant="primary" size="lg" glow>
                    <Code2 className="w-4 h-4 mr-2" />
                    🎉 live now: {currentEvent.title}
                  </Badge>
                </motion.div>
                
                <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                  turn every weekend into a{' '}
                  <span className="text-accent-400">
                    building festival
                  </span>
                </h1>
                
                <p className="text-xl text-light-300 leading-relaxed max-w-2xl">
                  join thousands of creators in themed weekend hackathons. build incredible projects, collaborate with amazing people, and celebrate your success together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="xl" 
                  glow 
                  icon={<Rocket className="w-6 h-6" />}
                  onClick={() => navigate('/auth?mode=signup')}
                >
                  join this weekend
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate('/projects')}
                >
                  <Star className="w-5 h-5 mr-2" />
                  explore projects
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-light-300">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <Users className="w-6 h-6 text-accent-400" />
                  <span className="font-semibold text-lg">{currentEvent.participantsCount} builders</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <Rocket className="w-6 h-6 text-accent-400" />
                  <span className="font-semibold text-lg">{currentEvent.projectsCount} projects</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Event Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card variant="glass" className="overflow-hidden shadow-2xl" glow>
                <div className="h-40 bg-gradient-to-r from-accent-600 to-accent-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {currentEvent.theme}
                    </h3>
                    <Button variant="primary" size="md" disabled className="mt-4">
                      <Clock className="w-4 h-4 mr-1" />
                      live event
                    </Button>
                  </div>
                </div>
                
                <CardContent className="space-y-6 text-light-200">
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-3">
                      {currentEvent.title}
                    </h4>
                    <p className="text-light-300 leading-relaxed">
                      {currentEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-dark-800 rounded-xl">
                      <div className="text-3xl font-bold text-accent-400">
                        {currentEvent.daysLeft}
                      </div>
                      <div className="text-sm text-light-400 font-medium">days</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-dark-800 rounded-xl">
                      <div className="text-3xl font-bold text-accent-400">
                        {currentEvent.hoursLeft}
                      </div>
                      <div className="text-sm text-light-400 font-medium">hours</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="p-4 bg-dark-800 rounded-xl">
                      <div className="text-3xl font-bold text-accent-400">
                        {currentEvent.minutesLeft}
                      </div>
                      <div className="text-sm text-light-400 font-medium">minutes</div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-bold text-white flex items-center">
                      <Award className="w-5 h-5 mr-2 text-accent-400" />
                      amazing prizes:
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {currentEvent.prizes.map((prize, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {prize}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full" 
                    glow
                    onClick={() => setShowSubmissionModal(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    submit project
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <StatCard 
                    label={stat.label} 
                    value={stat.value} 
                    icon={<Icon className="w-6 h-6" />}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="primary" size="lg" className="mb-6">
              <Target className="w-4 h-4 mr-2" />
              how it works
            </Badge>
            <h2 className="text-5xl font-bold text-white mb-6">
              your journey to building success
            </h2>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              join our global community of builders and turn your weekend into an epic building adventure with these simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <GlassyCard className="h-full text-center p-8 hover:scale-105 transition-transform">
                    <div className="relative mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-600 rounded-2xl mb-4 shadow-xl">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-dark-800 rounded-full flex items-center justify-center border-4 border-accent-600 shadow-lg">
                        <span className="text-lg font-bold text-accent-400">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-light-300 leading-relaxed">
                      {step.description}
                    </p>
                  </GlassyCard>
                  
                  {/* Connection line */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent-600/50 transform -translate-y-1/2"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="primary" size="lg" className="mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              featured projects
            </Badge>
            <h2 className="text-5xl font-bold text-white mb-6">
              amazing projects built this weekend
            </h2>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              check out some incredible projects built by our community of weekend builders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassyCard className="h-full overflow-hidden group hover:scale-105 transition-transform">
                  <div className="aspect-video relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      {project.trending && (
                        <Badge variant="primary" size="sm" glow>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          trending
                        </Badge>
                      )}
                      <div className="bg-dark-800/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-bold text-white">{project.votes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-light-200">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {project.title}
                      </h3>
                      <p className="text-light-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-light-400 font-medium">
                        by {project.creator}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag) => (
                          <PillChip key={tag}>{tag}</PillChip>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassyCard>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="primary" 
              size="lg" 
              glow
              onClick={() => navigate('/projects')}
            >
              <Star className="w-5 h-5 mr-2" />
              view all projects
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <Badge variant="primary" size="lg" glow>
                <Code2 className="w-4 h-4 mr-2" />
                join the movement
              </Badge>
              
              <h2 className="text-5xl font-bold text-white leading-tight">
                ready to build something amazing?
              </h2>
              
              <p className="text-xl text-accent-100 max-w-2xl mx-auto">
                join thousands of builders this weekend and turn your ideas into reality. build, collaborate, and win amazing prizes!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary"
                size="xl" 
                glow
                className="w-full sm:w-auto"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <Rocket className="w-6 h-6 mr-2" />
                start building now
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={() => navigate('/events')}
              >
                <Calendar className="w-6 h-6 mr-2" />
                browse events
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Submission Modal */}
      <ProjectSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        eventId={currentEvent.id}
        eventTitle={currentEvent.title}
      />
    </div>
  );
}