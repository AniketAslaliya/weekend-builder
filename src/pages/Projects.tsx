import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  ExternalLink, 
  Github,
  Users,
  Calendar,
  Tag,
  TrendingUp,
  Star,
  Eye,
  Zap,
  Award,
  Code2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { StatCard } from '@/components/ui/StatCard';
import { PillChip } from '@/components/ui/PillChip';
import { LikeButton } from '@/components/ui/LikeButton';

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data
  const projects = [
    {
      id: '1',
      title: 'AI Recipe Generator',
      description: 'Generate personalized recipes based on dietary preferences and available ingredients using advanced AI algorithms and machine learning models',
      shortDescription: 'AI-powered recipe generation for personalized cooking experiences',
      creator: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      team: [
        { name: 'Sarah Chen', role: 'Creator' },
        { name: 'Mike Johnson', role: 'Developer' }
      ],
      votes: 127,
      comments: 23,
      views: 1240,
      tags: ['AI', 'Food', 'Health', 'React'],
      projectType: 'web',
      status: 'submitted',
      demoUrl: 'https://ai-recipe-gen.demo',
      repoUrl: 'https://github.com/sarahc/ai-recipe-gen',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2024-01-15T10:30:00Z',
      eventTitle: 'AI-Powered Solutions Weekend',
      trending: true,
      featured: false
    },
    {
      id: '2',
      title: 'Smart Study Planner',
      description: 'AI-powered study scheduler that adapts to your learning style, tracks progress, and optimizes study sessions for maximum retention and productivity',
      shortDescription: 'Intelligent study planning with AI optimization and progress tracking',
      creator: {
        name: 'Alex Kumar',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      team: [
        { name: 'Alex Kumar', role: 'Creator' }
      ],
      votes: 93,
      comments: 15,
      views: 890,
      tags: ['AI', 'Education', 'Productivity', 'Vue'],
      projectType: 'web',
      status: 'submitted',
      demoUrl: 'https://smart-study.demo',
      repoUrl: 'https://github.com/alexk/smart-study',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2024-01-14T15:45:00Z',
      eventTitle: 'AI-Powered Solutions Weekend',
      trending: false,
      featured: true
    },
    {
      id: '3',
      title: 'Mood Music Matcher',
      description: 'Detects your current mood through voice analysis and facial recognition, then creates perfect playlists that match your emotional state using advanced AI',
      shortDescription: 'Mood detection with personalized music curation and emotional AI',
      creator: {
        name: 'Jamie Rodriguez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      team: [
        { name: 'Jamie Rodriguez', role: 'Creator' },
        { name: 'Lisa Park', role: 'Designer' },
        { name: 'Tom Wilson', role: 'AI Engineer' }
      ],
      votes: 156,
      comments: 34,
      views: 2100,
      tags: ['AI', 'Music', 'Wellness', 'Python'],
      projectType: 'mobile',
      status: 'submitted',
      demoUrl: 'https://mood-music.demo',
      repoUrl: 'https://github.com/jamier/mood-music',
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2024-01-13T12:20:00Z',
      eventTitle: 'AI-Powered Solutions Weekend',
      trending: true,
      featured: true
    },
    {
      id: '4',
      title: 'EcoTrack Carbon Monitor',
      description: 'Track your daily carbon footprint through smart integrations with transportation apps, energy bills, and shopping habits to promote sustainable living',
      shortDescription: 'Personal carbon footprint tracking and reduction with smart insights',
      creator: {
        name: 'Emma Thompson',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      team: [
        { name: 'Emma Thompson', role: 'Creator' },
        { name: 'David Lee', role: 'Backend Developer' }
      ],
      votes: 89,
      comments: 19,
      views: 650,
      tags: ['Sustainability', 'Health', 'Mobile', 'React Native'],
      projectType: 'mobile',
      status: 'submitted',
      demoUrl: 'https://ecotrack.demo',
      repoUrl: 'https://github.com/emma/ecotrack',
      image: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=400',
      submittedAt: '2024-01-12T09:15:00Z',
      eventTitle: 'AI-Powered Solutions Weekend',
      trending: false,
      featured: false
    }
  ];

  const filters = [
    { id: 'all', label: 'All Projects', count: projects.length, icon: Star },
    { id: 'trending', label: 'Trending', count: projects.filter(p => p.trending).length, icon: TrendingUp },
    { id: 'featured', label: 'Featured', count: projects.filter(p => p.featured).length, icon: Award },
    { id: 'web', label: 'Web Apps', count: projects.filter(p => p.projectType === 'web').length, icon: ExternalLink },
    { id: 'mobile', label: 'Mobile Apps', count: projects.filter(p => p.projectType === 'mobile').length, icon: Users },
    { id: 'ai', label: 'AI Projects', count: projects.filter(p => p.tags.some(tag => tag.toLowerCase().includes('ai'))).length, icon: Zap }
  ];

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         project.projectType === selectedFilter ||
                         (selectedFilter === 'ai' && project.tags.some(tag => tag.toLowerCase().includes('ai'))) ||
                         (selectedFilter === 'trending' && project.trending) ||
                         (selectedFilter === 'featured' && project.featured);
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => project.tags.includes(tag));
    
    return matchesSearch && matchesFilter && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="text-center lg:text-left">
              <Badge variant="primary" size="lg" className="mb-4" glow>
                <Star className="w-4 h-4 mr-2" />
                Project Gallery
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-4">
                Discover Amazing Projects
              </h1>
              <p className="text-xl text-light-300 max-w-2xl">
                Explore incredible projects built by our community of weekend builders from around the world
              </p>
            </div>
            <Button variant="primary" size="lg" glow>
              <Zap className="w-5 h-5 mr-2" />
              Submit Project
            </Button>
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
          <GlassyCard className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search projects, creators, or technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  className="text-lg py-4 bg-dark-900 text-primary placeholder-light-400 focus:border-accent-500"
                />
              </div>
              <Button variant="outline" size="lg" icon={<Filter className="w-5 h-5" />}>
                Advanced Filters
              </Button>
            </div>
          </GlassyCard>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-accent-600 text-white shadow-lg'
                      : 'bg-white/10 backdrop-blur text-light-300 border border-accent-400/20 hover:border-accent-600 hover:text-accent-400 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{filter.label}</span>
                  <Badge 
                    variant={selectedFilter === filter.id ? 'secondary' : 'gray'} 
                    size="sm"
                  >
                    {filter.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>

          {/* Tag Filters */}
          <GlassyCard className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Tag className="w-5 h-5 mr-2 text-accent-400" />
                Filter by Technology:
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? 'bg-accent-600 text-white shadow-lg'
                        : 'bg-white/10 backdrop-blur text-light-300 border border-accent-400/20 hover:border-accent-600 hover:text-accent-400 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </GlassyCard>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg text-light-300">
              Showing <span className="font-bold text-accent-400">{filteredProjects.length}</span> amazing projects
              {selectedTags.length > 0 && (
                <span className="ml-2">
                  with: {selectedTags.map(tag => (
                    <PillChip key={tag} className="ml-1">{tag}</PillChip>
                  ))}
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
              >
                <GlassyCard className="h-full group overflow-hidden hover:scale-105 transition-transform">
                  {/* Project Image */}
                  <div className="aspect-video relative overflow-hidden rounded-xl mb-6">
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
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="flex flex-col space-y-2">
                        {project.trending && (
                          <Badge variant="success" size="sm" glow>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {project.featured && (
                          <Badge variant="warning" size="sm">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-white text-sm bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                        <Users className="w-4 h-4" />
                        <span>{project.team.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 text-light-200">
                    {/* Event Badge */}
                    <Badge variant="primary" size="sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.eventTitle}
                    </Badge>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-light-300 text-sm line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={project.creator.avatar}
                        alt={project.creator.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-accent-600"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {project.creator.name}
                        </p>
                        <p className="text-sm text-light-400">
                          {project.team.length > 1 ? `+ ${project.team.length - 1} teammates` : 'Solo project'}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map(tag => (
                        <PillChip key={tag}>{tag}</PillChip>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="gray" size="sm">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-accent-400/20">
                      <div className="flex items-center space-x-6 text-light-400">
                        <LikeButton projectId={project.id} />
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold">{project.comments}</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold">{project.views}</span>
                        </motion.div>
                      </div>
                      <Badge 
                        variant={project.projectType === 'web' ? 'primary' : project.projectType === 'mobile' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {project.projectType}
                      </Badge>
                    </div>
                  </div>
                </GlassyCard>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Button variant="primary" size="lg" glow>
              <Star className="w-5 h-5 mr-2" />
              Load More Amazing Projects
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-20"
          >
            <GlassyCard className="max-w-md mx-auto p-12">
              <div className="w-20 h-20 bg-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No projects found
              </h3>
              <p className="text-light-300 mb-8 leading-relaxed">
                We couldn't find any projects matching your criteria. Try adjusting your search or filters to discover more amazing projects.
              </p>
              <Button 
                variant="primary"
                size="lg"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedTags([]);
                }}
                glow
              >
                <Star className="w-5 h-5 mr-2" />
                Clear All Filters
              </Button>
            </GlassyCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}