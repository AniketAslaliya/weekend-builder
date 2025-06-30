import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
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
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { PillChip } from '@/components/ui/PillChip';
import { LikeButton } from '@/components/ui/LikeButton';
import { ProjectSubmissionModal } from '@/components/ui/ProjectSubmissionModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  creator_id: string;
  creator: {
    display_name: string;
    avatar_url: string | null;
  };
  votes: number;
  comments: number;
  views: number;
  tags: string[];
  project_type: string;
  status: string;
  demo_url: string | null;
  repo_url: string | null;
  image: string | null;
  submitted_at: string | null;
  event: {
    title: string;
  } | null;
  trending: boolean;
  featured: boolean;
}

export function Projects() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            creator:profiles!creator_id(display_name, avatar_url),
            event:events(title)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          setError('Failed to load projects');
          return;
        }

        // Transform the data to match our interface
        const transformedProjects = data?.map(project => ({
          ...project,
          votes: project.vote_count || 0,
          comments: project.comment_count || 0,
          views: 0, // We don't have view tracking yet
          trending: project.vote_count > 50, // Simple trending logic
          featured: project.is_featured || false,
          image: project.images?.[0] || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400'
        })) || [];

        setProjects(transformedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = [
    { id: 'all', label: 'All Projects', count: projects.length, icon: Star },
    { id: 'trending', label: 'Trending', count: projects.filter(p => p.trending).length, icon: TrendingUp },
    { id: 'featured', label: 'Featured', count: projects.filter(p => p.featured).length, icon: Award },
    { id: 'web', label: 'Web Apps', count: projects.filter(p => p.project_type === 'web').length, icon: ExternalLink },
    { id: 'mobile', label: 'Mobile Apps', count: projects.filter(p => p.project_type === 'mobile').length, icon: Users },
    { id: 'ai', label: 'AI Projects', count: projects.filter(p => p.tags.some(tag => tag.toLowerCase().includes('ai'))).length, icon: Zap }
  ];

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         project.creator.display_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         project.project_type === selectedFilter ||
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

  const createTestProject = async () => {
    if (!user) {
      toast.error('Please sign in to create a test project');
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      const testProject = {
        event_id: null,
        creator_id: profile.id,
        title: 'Test Project - ' + new Date().toLocaleTimeString(),
        description: 'This is a test project created to verify the submission functionality.',
        short_description: 'Test project for verification',
        tags: ['test', 'demo', 'verification'],
        demo_url: 'https://example.com',
        repo_url: 'https://github.com/example/test',
        status: 'submitted',
        submitted_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('projects')
        .insert([testProject]);

      if (error) {
        console.error('Error creating test project:', error);
        toast.error('Failed to create test project');
      } else {
        toast.success('Test project created! Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error creating test project:', error);
      toast.error('Failed to create test project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent-400 animate-spin mx-auto mb-4" />
          <p className="text-light-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
              <p className="text-xl text-light-300 max-w-3xl">
                explore incredible projects built by our community of weekend builders
              </p>
              {user && (
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={createTestProject}
                    className="bg-accent-500/10 border-accent-400/30 text-accent-400 hover:bg-accent-500/20"
                  >
                    🧪 Create Test Project
                  </Button>
                </div>
              )}
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              glow
              onClick={() => setShowSubmissionModal(true)}
            >
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
                      src={project.image || undefined}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="flex space-x-2">
                          {project.demo_url && (
                            <Button size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          {project.repo_url && (
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
                        <span>{project.creator.display_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 text-light-200">
                    {/* Event Badge */}
                    <Badge variant="primary" size="sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.event?.title}
                    </Badge>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-light-300 text-sm line-clamp-2 leading-relaxed">
                        {project.short_description}
                      </p>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center space-x-3">
                      <img
                        src={project.creator.avatar_url || undefined}
                        alt={project.creator.display_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-accent-600"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {project.creator.display_name}
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
                        variant={project.project_type === 'web' ? 'primary' : project.project_type === 'mobile' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {project.project_type}
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

      {/* Project Submission Modal */}
      <ProjectSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        eventId={undefined}
        eventTitle="General Project Submission"
      />
    </div>
  );
}