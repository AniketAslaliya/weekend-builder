import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  ArrowLeft,
  ExternalLink,
  Github,
  Heart,
  MessageCircle,
  Share2,
  Flag,
  Award,
  Zap,
  Target,
  Search,
  Filter,
  Crown,
  Medal,
  Star,
  TrendingUp,
  Eye,
  Code2,
  Upload,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProjectSubmissionModal } from '@/components/ui/ProjectSubmissionModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);

  // Mock event data
  const event = {
    id: '1',
    title: 'ai-powered solutions weekend',
    theme: 'build the future with ai 🤖',
    emoji: '🤖',
    description: 'create innovative solutions using artificial intelligence to solve real-world problems. this weekend-long hackathon focuses on building ai applications that can make a positive impact on society, from healthcare and education to sustainability and accessibility.',
    bannerUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
    startDate: '2025-01-18T09:00:00Z',
    endDate: '2025-01-19T21:00:00Z',
    status: 'active' as const,
    participants: 847,
    projects: 156,
    category: 'ai',
    rules: `# event rules & guidelines

## 🎯 objective
build innovative ai-powered solutions that solve real-world problems and demonstrate creativity, technical excellence, and potential impact.

## 📋 requirements
- projects must incorporate ai/ml technologies
- all code must be original work created during the event
- teams can have 1-4 members
- must include a demo video (max 3 minutes)
- source code must be publicly available

## 🚫 restrictions
- no pre-existing code (except libraries/frameworks)
- no offensive or harmful content
- must respect intellectual property rights
- follow community guidelines and code of conduct

## 🏆 judging criteria
- **innovation** (25%): creativity and originality
- **technical excellence** (25%): code quality and ai implementation
- **impact** (25%): potential to solve real problems
- **presentation** (25%): demo quality and clarity`,
    prizes: [
      { place: 'grand prize', amount: '$5,000', description: 'best overall ai solution' },
      { place: 'runner-up', amount: '$2,500', description: 'second best solution' },
      { place: 'third place', amount: '$1,000', description: 'third best solution' },
      { place: 'best solo project', amount: '$500', description: 'outstanding individual effort' },
      { place: 'most innovative', amount: '$500', description: 'most creative approach' },
      { place: 'community choice', amount: '$500', description: 'most voted by community' }
    ],
    sponsors: [
      { name: 'openai', logo: '🤖', tier: 'platinum' },
      { name: 'google cloud', logo: '☁️', tier: 'gold' },
      { name: 'microsoft azure', logo: '🔷', tier: 'gold' },
      { name: 'hugging face', logo: '🤗', tier: 'silver' }
    ],
    announcements: [
      {
        id: '1',
        title: '🎉 event is now live!',
        content: 'welcome to ai-powered solutions weekend! the event has officially started. you can now submit your projects and start building amazing ai solutions.',
        timestamp: '2025-01-18T09:00:00Z',
        type: 'important'
      },
      {
        id: '2',
        title: '⏰ submission deadline reminder',
        content: 'don\'t forget! project submissions close tomorrow at 9 pm utc. make sure to submit your project with a demo video and complete documentation.',
        timestamp: '2025-01-18T15:30:00Z',
        type: 'reminder'
      },
      {
        id: '3',
        title: '🤝 mentor office hours',
        content: 'join our ai experts for office hours today from 2-4 pm utc. get help with your projects, ask technical questions, and receive valuable feedback.',
        timestamp: '2025-01-18T12:00:00Z',
        type: 'info'
      }
    ],
    miniChallenges: [
      {
        id: '1',
        title: 'first submission',
        description: 'be among the first 50 to submit a project',
        reward: '50 bonus points',
        progress: 42,
        total: 50,
        completed: false
      },
      {
        id: '2',
        title: 'community helper',
        description: 'help 3 other participants with feedback or votes',
        reward: 'helper badge + 25 points',
        progress: 1,
        total: 3,
        completed: false
      },
      {
        id: '3',
        title: 'social sharer',
        description: 'share your project on social media',
        reward: 'influencer badge + 15 points',
        progress: 0,
        total: 1,
        completed: false
      }
    ]
  };

  // Mock projects data
  const projects = [
    {
      id: '1',
      title: 'ai recipe generator',
      description: 'generate personalized recipes based on dietary preferences and available ingredients using advanced ai algorithms',
      creator: {
        name: 'sarah chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 127,
      comments: 23,
      views: 1240,
      tags: ['ai', 'food', 'health'],
      demoUrl: 'https://ai-recipe-gen.demo',
      repoUrl: 'https://github.com/sarahc/ai-recipe-gen',
      image: 'https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2025-01-18T10:30:00Z',
      trending: true
    },
    {
      id: '2',
      title: 'smart study planner',
      description: 'ai-powered study scheduler that adapts to your learning style and optimizes retention',
      creator: {
        name: 'alex kumar',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 93,
      comments: 15,
      views: 890,
      tags: ['ai', 'education', 'productivity'],
      demoUrl: 'https://smart-study.demo',
      repoUrl: 'https://github.com/alexk/smart-study',
      image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2025-01-18T11:45:00Z',
      trending: false
    },
    {
      id: '3',
      title: 'mood music matcher',
      description: 'detects your mood through voice analysis and creates perfect playlists using ai',
      creator: {
        name: 'jamie rodriguez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 156,
      comments: 34,
      views: 2100,
      tags: ['ai', 'music', 'wellness'],
      demoUrl: 'https://mood-music.demo',
      repoUrl: 'https://github.com/jamier/mood-music',
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2025-01-18T09:20:00Z',
      trending: true
    }
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, project: projects[2], votes: 156, trend: 'up' },
    { rank: 2, project: projects[0], votes: 127, trend: 'up' },
    { rank: 3, project: projects[1], votes: 93, trend: 'down' }
  ];

  const tabs = [
    { id: 'overview', label: 'overview' },
    { id: 'projects', label: `projects (${projects.length})` },
    { id: 'leaderboard', label: 'leaderboard' },
    { id: 'announcements', label: 'announcements' },
    { id: 'challenges', label: 'mini challenges' }
  ];

  const projectFilters = [
    { id: 'all', label: 'all projects', count: projects.length },
    { id: 'trending', label: 'trending', count: projects.filter(p => p.trending).length },
    { id: 'recent', label: 'recently added', count: projects.length },
    { id: 'most-voted', label: 'most voted', count: projects.length }
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const eventEnd = new Date(event.endDate).getTime();
      const distance = eventEnd - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event.endDate]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'trending' && project.trending) ||
                         selectedFilter === 'recent' ||
                         selectedFilter === 'most-voted';
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmitProject = () => {
    if (!user) {
      toast.error('please sign in to submit a project');
      navigate('/auth');
      return;
    }
    setShowSubmissionModal(true);
  };

  const handleVote = (projectId: string) => {
    if (!user) {
      toast.error('please sign in to vote');
      navigate('/auth');
      return;
    }
    toast.success('vote submitted!');
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/70 to-dark-950/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/events')}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="mb-8"
            >
              back to events
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <Badge variant="primary" size="lg" className="mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.status === 'active' ? 'live now' : event.status}
                  </Badge>
                  
                  <h1 className="text-5xl font-bold text-white mb-4">
                    {event.title}
                  </h1>
                  
                  <div className="text-3xl mb-6">{event.theme}</div>
                  
                  <p className="text-xl text-light-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-light-300">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-accent-400" />
                    <span className="font-semibold">{event.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-5 h-5 text-accent-400" />
                    <span className="font-semibold">{event.projects} projects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-accent-400" />
                    <span className="font-semibold">${event.prizes.reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, '')), 0).toLocaleString()} in prizes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {event.status === 'active' && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSubmitProject}
                      icon={<Upload className="w-5 h-5" />}
                      glow
                    >
                      submit project
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<Share2 className="w-5 h-5" />}
                  >
                    share event
                  </Button>
                </div>
              </div>

              {/* Countdown Timer */}
              <Card variant="default" className="p-8">
                <CardHeader>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Clock className="w-6 h-6 mr-2 text-accent-400" />
                    {event.status === 'active' ? 'time remaining' : 'event countdown'}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-dark-700 rounded-lg">
                      <div className="text-3xl font-bold text-accent-400">
                        {timeLeft.days}
                      </div>
                      <div className="text-sm text-light-400">days</div>
                    </div>
                    <div className="p-4 bg-dark-700 rounded-lg">
                      <div className="text-3xl font-bold text-accent-400">
                        {timeLeft.hours}
                      </div>
                      <div className="text-sm text-light-400">hours</div>
                    </div>
                    <div className="p-4 bg-dark-700 rounded-lg">
                      <div className="text-3xl font-bold text-accent-400">
                        {timeLeft.minutes}
                      </div>
                      <div className="text-sm text-light-400">minutes</div>
                    </div>
                    <div className="p-4 bg-dark-700 rounded-lg">
                      <div className="text-3xl font-bold text-accent-400">
                        {timeLeft.seconds}
                      </div>
                      <div className="text-sm text-light-400">seconds</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-500 text-accent-400'
                    : 'border-transparent text-light-400 hover:text-light-300 hover:border-light-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Rules & Guidelines */}
                  <Card variant="default" className="p-8">
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Flag className="w-6 h-6 mr-2 text-accent-400" />
                        rules & guidelines
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-light-300 leading-relaxed">
                          {event.rules}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* How to Join */}
                  <Card variant="default" className="p-8">
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Target className="w-6 h-6 mr-2 text-accent-400" />
                        
                        how to join
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">sign up & join</h3>
                            <p className="text-light-400">create your account and join the event to start building</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">build your project</h3>
                            <p className="text-light-400">create an ai-powered solution that solves a real problem</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">submit & demo</h3>
                            <p className="text-light-400">submit your project with code, demo video, and documentation</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                          <div>
                            <h3 className="font-semibold text-white mb-1">vote & win</h3>
                            <p className="text-light-400">vote for other projects and compete for amazing prizes</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  {/* Prizes */}
                  <Card variant="default" className="p-8">
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Trophy className="w-6 h-6 mr-2 text-accent-400" />
                        prizes & awards
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {event.prizes.map((prize, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                            <div>
                              <h3 className="font-semibold text-white">{prize.place}</h3>
                              <p className="text-sm text-light-400">{prize.description}</p>
                            </div>
                            <Badge variant="warning" size="md">
                              {prize.amount}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sponsors */}
                  <Card variant="default" className="p-8">
                    <CardHeader>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Star className="w-6 h-6 mr-2 text-accent-400" />
                        sponsors & partners
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {event.sponsors.map((sponsor, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{sponsor.logo}</div>
                              <span className="font-semibold text-white">{sponsor.name}</span>
                            </div>
                            <Badge variant="primary" size="sm">
                              {sponsor.tier}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8">
                {/* Search and Filters */}
                <Card variant="default" className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="search projects, creators, or technologies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-5 h-5" />}
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                    </div>
                    <Button variant="outline" size="md" icon={<Filter className="w-5 h-5" />}>
                      advanced filters
                    </Button>
                  </div>
                </Card>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3">
                  {projectFilters.map(filter => (
                    <motion.button
                      key={filter.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedFilter === filter.id
                          ? 'bg-accent-600 text-white'
                          : 'bg-dark-800 text-light-300 border border-dark-700 hover:border-accent-600 hover:text-accent-400'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <Badge 
                        variant={selectedFilter === filter.id ? 'secondary' : 'gray'} 
                        size="sm"
                      >
                        {filter.count}
                      </Badge>
                    </motion.button>
                  ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card hover className="h-full group overflow-hidden">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                              <div className="flex space-x-2">
                                {project.demoUrl && (
                                  <Button size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                )}
                                {project.repoUrl && (
                                  <Button size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                                    <Github className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {project.trending && (
                            <div className="absolute top-4 left-4">
                              <Badge variant="success" size="sm" glow>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                trending
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {project.title}
                            </h3>
                            <p className="text-light-300 text-sm line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <img
                              src={project.creator.avatar}
                              alt={project.creator.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium text-white text-sm">
                              {project.creator.name}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                              <Badge key={tag} variant="gray" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                            <div className="flex items-center space-x-4 text-light-400">
                              <button
                                onClick={() => handleVote(project.id)}
                                className="flex items-center space-x-1 hover:text-error-400 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-semibold">{project.votes}</span>
                              </button>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm font-semibold">{project.comments}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-semibold">{project.views}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-8">
                <Card variant="default" className="p-8">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Trophy className="w-6 h-6 mr-2 text-accent-400" />
                      live leaderboard
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboard.map((entry, index) => (
                        <div key={entry.project.id} className="flex items-center justify-between p-6 bg-dark-700 rounded-lg">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center justify-center w-12 h-12">
                              {entry.rank === 1 && <Crown className="w-8 h-8 text-warning-500" />}
                              {entry.rank === 2 && <Medal className="w-8 h-8 text-light-400" />}
                              {entry.rank === 3 && <Award className="w-8 h-8 text-warning-600" />}
                              {entry.rank > 3 && <span className="text-2xl font-bold text-accent-400">#{entry.rank}</span>}
                            </div>
                            
                            <img
                              src={entry.project.image}
                              alt={entry.project.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                {entry.project.title}
                              </h3>
                              <p className="text-sm text-light-400 mb-2">
                                by {entry.project.creator.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Heart className="w-4 h-4 text-error-500" />
                                <span className="text-sm font-semibold text-white">{entry.votes} votes</span>
                                {entry.trend === 'up' ? (
                                  <TrendingUp className="w-4 h-4 text-success-500" />
                                ) : (
                                  <TrendingUp className="w-4 h-4 text-error-500 rotate-180" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6">
                {event.announcements.map((announcement) => (
                  <Card key={announcement.id} variant="default" className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {announcement.title}
                        </h3>
                        <div className={`text-light-300 ${expandedAnnouncement === announcement.id ? '' : 'line-clamp-2'}`}>
                          {announcement.content}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-light-400">
                            {new Date(announcement.timestamp).toLocaleString()}
                          </span>
                          <button
                            onClick={() => setExpandedAnnouncement(
                              expandedAnnouncement === announcement.id ? null : announcement.id
                            )}
                            className="text-accent-400 hover:text-accent-300 text-sm font-medium flex items-center space-x-1"
                          >
                            <span>{expandedAnnouncement === announcement.id ? 'show less' : 'show more'}</span>
                            {expandedAnnouncement === announcement.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-6">
                <Card variant="default" className="p-8">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Zap className="w-6 h-6 mr-2 text-accent-400" />
                      mini challenges
                    </h2>
                    <p className="text-light-400">
                      complete these challenges to earn bonus points and special badges!
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {event.miniChallenges.map((challenge) => (
                        <div key={challenge.id} className="p-6 bg-dark-700 rounded-lg">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-2">
                                {challenge.title}
                              </h3>
                              <p className="text-light-300 mb-3">
                                {challenge.description}
                              </p>
                              <Badge variant="warning" size="sm">
                                {challenge.reward}
                              </Badge>
                            </div>
                            {challenge.completed && (
                              <Badge variant="success" size="sm">
                                ✓ completed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-light-400">progress</span>
                              <span className="text-white font-medium">
                                {challenge.progress}/{challenge.total}
                              </span>
                            </div>
                            <div className="w-full bg-dark-600 rounded-full h-2">
                              <div
                                className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Project Submission Modal */}
      <ProjectSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        eventId={event.id}
        eventTitle={event.title}
      />
    </div>
  );
}