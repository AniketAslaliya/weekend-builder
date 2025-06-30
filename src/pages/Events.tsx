import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  ArrowRight,
  Filter,
  Search,
  MapPin,
  Star,
  Zap,
  Award,
  Code2,
  Crown,
  Medal,
  Gift,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Events() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is admin
  const isAdmin = user?.email === 'admin@weekendbuilder.com';

  // Mock data with sample events
  const events = [
    {
      id: '1',
      title: 'AI-Powered Solutions Weekend',
      description: 'Create innovative solutions using artificial intelligence to solve real-world problems and win amazing prizes.',
      theme: 'Build the future with AI 🤖',
      emoji: '🤖',
      startDate: '2025-01-18T09:00:00Z',
      endDate: '2025-01-19T21:00:00Z',
      status: 'active' as const,
      participants: 847,
      projects: 156,
      prizes: ['$5,000 Grand Prize', 'AI API Credits', 'Mentorship Sessions'],
      bannerUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 4,
      featured: true,
      category: 'AI',
      totalPrizePool: 15000
    },
    {
      id: '2',
      title: 'Startup MVP Weekend',
      description: 'Launch a minimum viable product, solo or as a team. Build the next big thing in just 48 hours.',
      theme: 'Launch your startup dream 🚀',
      emoji: '🚀',
      startDate: '2025-01-25T09:00:00Z',
      endDate: '2025-01-26T21:00:00Z',
      status: 'upcoming' as const,
      participants: 234,
      projects: 0,
      prizes: ['$3,000 Grand Prize', 'Startup Accelerator', 'Investor Meetings'],
      bannerUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 5,
      featured: false,
      category: 'Startup',
      totalPrizePool: 8000
    },
    {
      id: '3',
      title: 'Wellness & Self-Care Builders',
      description: 'Build technology solutions for well-being, mental health, and self-care to help people live better lives.',
      theme: 'Tech for wellness and health 🌱',
      emoji: '🌱',
      startDate: '2025-02-01T09:00:00Z',
      endDate: '2025-02-02T21:00:00Z',
      status: 'upcoming' as const,
      participants: 156,
      projects: 0,
      prizes: ['$2,500 Grand Prize', 'Health Tech Mentorship', 'Wellness Retreat'],
      bannerUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 3,
      featured: true,
      category: 'Health',
      totalPrizePool: 6000
    },
    {
      id: '4',
      title: 'Hack for Good',
      description: 'Create solutions for social, environmental, or community impact. Build technology that makes the world better.',
      theme: 'Technology for social impact 🌏',
      emoji: '🌏',
      startDate: '2025-02-08T09:00:00Z',
      endDate: '2025-02-09T21:00:00Z',
      status: 'upcoming' as const,
      participants: 89,
      projects: 0,
      prizes: ['$4,000 Grand Prize', 'NGO Partnerships', 'Impact Accelerator'],
      bannerUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 4,
      featured: false,
      category: 'Social Impact',
      totalPrizePool: 10000
    },
    {
      id: '5',
      title: 'No-Code Magic',
      description: 'Create anything with no-code tools and AI. No programming required - just creativity and innovation.',
      theme: 'Build without code ✨',
      emoji: '✨',
      startDate: '2025-02-15T09:00:00Z',
      endDate: '2025-02-16T21:00:00Z',
      status: 'upcoming' as const,
      participants: 312,
      projects: 0,
      prizes: ['$2,000 Grand Prize', 'No-Code Tool Credits', 'Creator Spotlight'],
      bannerUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 2,
      featured: true,
      category: 'No-Code',
      totalPrizePool: 5000
    },
    {
      id: '6',
      title: 'Web3 & Blockchain Builder Weekend',
      description: 'Explore the future of decentralized applications and blockchain technology. Build the next generation of web.',
      theme: 'Decentralized future 🔗',
      emoji: '🔗',
      startDate: '2025-01-11T09:00:00Z',
      endDate: '2025-01-12T21:00:00Z',
      status: 'completed' as const,
      participants: 423,
      projects: 89,
      prizes: ['$6,000 Grand Prize', 'Crypto Rewards', 'Blockchain Mentorship'],
      bannerUrl: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Global (Online)',
      maxTeamSize: 4,
      featured: false,
      category: 'Blockchain',
      totalPrizePool: 18000,
      winners: {
        grandPrize: { name: 'DeFi Portfolio Tracker', creator: 'Alex Chen', prize: '$6,000' },
        runnerUp: { name: 'NFT Marketplace', creator: 'Sarah Kim', prize: '$3,000' },
        thirdPlace: { name: 'DAO Governance Tool', creator: 'Mike Johnson', prize: '$1,500' }
      }
    }
  ];

  const filters = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'active', label: 'Live Now', count: events.filter(e => e.status === 'active').length },
    { id: 'upcoming', label: 'Upcoming', count: events.filter(e => e.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: events.filter(e => e.status === 'completed').length },
    { id: 'featured', label: 'Featured', count: events.filter(e => e.featured).length }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'AI', label: 'AI & Machine Learning' },
    { id: 'Startup', label: 'Startup & Business' },
    { id: 'Health', label: 'Health & Wellness' },
    { id: 'Social Impact', label: 'Social Impact' },
    { id: 'No-Code', label: 'No-Code' },
    { id: 'Blockchain', label: 'Blockchain & Web3' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.theme.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         event.status === selectedFilter ||
                         (selectedFilter === 'featured' && event.featured);
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'primary';
      case 'completed': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="text-center lg:text-left">
              <Badge variant="primary" size="lg" className="mb-4" glow>
                <Calendar className="w-4 h-4 mr-2" />
                Weekend Events
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-4">
                Join Amazing Building Events
              </h1>
              <p className="text-xl text-light-300 max-w-2xl">
                Participate in themed weekend hackathons, collaborate with builders worldwide, and win incredible prizes
              </p>
            </div>
            {isAdmin && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/admin')}
                icon={<Plus className="w-5 h-5" />}
                glow
              >
                Admin Dashboard
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12 space-y-8"
        >
          {/* Search Bar */}
          <Card variant="default" className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search events, themes, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  className="text-lg py-4 bg-dark-700 border-dark-600 text-white placeholder-light-400 focus:border-accent-500"
                />
              </div>
              <Button variant="outline" size="lg" icon={<Filter className="w-5 h-5" />}>
                Advanced Filters
              </Button>
            </div>
          </Card>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {filters.map(filter => (
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

          {/* Category Filter */}
          <Card variant="default" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-accent-400" />
                Filter by Category:
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-accent-600 text-white'
                        : 'bg-dark-800 text-light-300 border border-dark-700 hover:border-accent-600 hover:text-accent-400'
                    }`}
                  >
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-lg text-light-300">
            Showing <span className="font-bold text-accent-400">{filteredEvents.length}</span> amazing events
          </p>
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
              >
                <Card hover className="h-full group overflow-hidden cursor-pointer" onClick={() => handleEventClick(event.id)}>
                  {/* Event Banner */}
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-4xl mb-2">{event.emoji}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {event.theme}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Status and Featured Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex flex-col space-y-2">
                        <Badge variant={getStatusColor(event.status)} size="sm" glow={event.status === 'active'}>
                          {event.status === 'active' && <Zap className="w-3 h-3 mr-1" />}
                          {getStatusText(event.status)}
                        </Badge>
                        {event.featured && (
                          <Badge variant="warning" size="sm">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <Badge variant="primary" size="sm">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="space-y-6 text-light-200">
                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {event.title}
                      </h3>
                      <p className="text-light-300 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-accent-400" />
                        <span className="text-light-300">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-accent-400" />
                        <span className="text-light-300">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-accent-400" />
                        <span className="text-light-300">
                          {event.participants} builders
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Code2 className="w-4 h-4 text-accent-400" />
                        <span className="text-light-300">
                          {event.projects} projects
                        </span>
                      </div>
                    </div>

                    {/* Prizes */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-white flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-accent-400" />
                          Prizes:
                        </h5>
                        <Badge variant="warning" size="sm">
                          <Gift className="w-3 h-3 mr-1" />
                          ${event.totalPrizePool.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.prizes.slice(0, 2).map((prize, index) => (
                          <Badge key={index} variant="primary" size="sm">
                            {prize}
                          </Badge>
                        ))}
                        {event.prizes.length > 2 && (
                          <Badge variant="gray" size="sm">
                            +{event.prizes.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Winners Section for Completed Events */}
                    {event.status === 'completed' && event.winners && (
                      <div className="space-y-3 pt-4 border-t border-dark-700">
                        <h5 className="font-bold text-white flex items-center">
                          <Crown className="w-4 h-4 mr-2 text-warning-500" />
                          Winners:
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Crown className="w-4 h-4 text-warning-500" />
                              <span className="text-white font-medium">{event.winners.grandPrize.name}</span>
                            </div>
                            <span className="text-light-400">by {event.winners.grandPrize.creator}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Medal className="w-4 h-4 text-light-400" />
                              <span className="text-white font-medium">{event.winners.runnerUp.name}</span>
                            </div>
                            <span className="text-light-400">by {event.winners.runnerUp.creator}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-4 border-t border-dark-700">
                      {event.status === 'active' ? (
                        <Button variant="primary" size="lg" className="w-full" glow>
                          <Zap className="w-5 h-5 mr-2" />
                          Join Live Event
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : event.status === 'upcoming' ? (
                        <Button variant="outline" size="lg" className="w-full">
                          <Calendar className="w-5 h-5 mr-2" />
                          Register for Event
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="lg" className="w-full">
                          <Award className="w-5 h-5 mr-2" />
                          View Results
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-20"
          >
            <Card variant="default" className="max-w-md mx-auto p-12">
              <div className="w-20 h-20 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No events found
              </h3>
              <p className="text-light-300 mb-8 leading-relaxed">
                We couldn't find any events matching your criteria. Try adjusting your search or filters.
              </p>
              <Button 
                variant="primary"
                size="lg"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedCategory('all');
                }}
                glow
              >
                <Calendar className="w-5 h-5 mr-2" />
                Show All Events
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-20"
        >
          <Card variant="default" className="max-w-2xl mx-auto p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Building?
            </h3>
            <p className="text-light-300 mb-8 leading-relaxed">
              Join thousands of creators in weekend hackathons and turn your ideas into reality!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" glow>
                <Zap className="w-5 h-5 mr-2" />
                Join Next Event
              </Button>
              <Button variant="outline" size="lg">
                <Eye className="w-5 h-5 mr-2" />
                Browse Projects
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}