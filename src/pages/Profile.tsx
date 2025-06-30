import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Trophy, 
  Star, 
  Code2, 
  Heart,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Edit3,
  Award,
  Zap,
  TrendingUp,
  Save,
  Plus,
  X,
  Instagram,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Target,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateProfile, getProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Profile data state
  const [profileData, setProfileData] = useState({
    id: user?.id || '',
    display_name: '',
    email: user?.email || '',
    avatar_url: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    position: '',
    education: '',
    github_username: '',
    twitter_username: '',
    linkedin_username: '',
    instagram_username: '',
    skills: [] as string[],
    interests: [] as string[],
    user_type: 'solo' as 'solo' | 'team' | 'mentor',
    is_mentor: false,
    total_points: 0,
    projects_count: 0,
    votes_given: 0,
    votes_received: 0,
    created_at: '',
    updated_at: ''
  });

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await getProfile();
        if (error) {
          // If profile is missing, create it and reload
          if (error.message?.includes('No user logged in') || error.message?.includes('not found')) {
            await updateProfile({
              display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'builder',
              bio: 'passionate builder creating amazing projects',
              user_type: 'solo',
              is_mentor: false,
              total_points: 0,
              projects_count: 0,
              votes_given: 0,
              votes_received: 0
            });
            // Try loading again
            const { data: newData } = await getProfile();
            if (newData) {
              setProfileData({
                ...newData,
                email: user.email || '',
                skills: newData.skills || [],
                interests: newData.interests || []
              });
              toast.success('Profile created!');
            }
          } else {
            console.error('Error loading profile:', error);
            toast.error('failed to load profile');
          }
        } else if (data) {
          setProfileData({
            ...data,
            email: user.email || '',
            skills: data.skills || [],
            interests: data.interests || []
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, getProfile, updateProfile]);

  const tabs = [
    { id: 'overview', label: 'overview', icon: User },
    { id: 'projects', label: 'projects', icon: Code2 },
    { id: 'badges', label: 'badges', icon: Award },
    { id: 'settings', label: 'settings', icon: Settings }
  ];

  const mockBadges = [
    { id: '1', name: 'first project', icon: '🌟', rarity: 'common', description: 'completed first project submission' },
    { id: '2', name: 'team player', icon: '🤝', rarity: 'common', description: 'collaborated on 5+ team projects' },
    { id: '3', name: 'weekend warrior', icon: '🔥', rarity: 'rare', description: 'participated in 10+ weekend events' },
    { id: '4', name: 'ai specialist', icon: '🤖', rarity: 'epic', description: 'built 5+ ai-powered projects' }
  ];

  const mockProjects = [
    {
      id: '1',
      title: 'ai recipe generator',
      votes: 127,
      status: 'featured',
      createdAt: '2025-01-15',
      description: 'ai-powered recipe generation based on dietary preferences'
    },
    {
      id: '2',
      title: 'task manager app',
      votes: 89,
      status: 'completed',
      createdAt: '2025-01-08',
      description: 'smart task management with ai prioritization'
    }
  ];

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'warning';
      case 'epic': return 'primary';
      case 'rare': return 'success';
      default: return 'gray';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'featured': return 'warning';
      case 'trending': return 'success';
      default: return 'gray';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    
    try {
      const updates = {
        display_name: profileData.display_name,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        company: profileData.company,
        position: profileData.position,
        education: profileData.education,
        github_username: profileData.github_username,
        twitter_username: profileData.twitter_username,
        linkedin_username: profileData.linkedin_username,
        instagram_username: profileData.instagram_username,
        skills: profileData.skills,
        interests: profileData.interests,
        user_type: profileData.user_type,
        is_mentor: profileData.is_mentor,
        updated_at: new Date().toISOString()
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        toast.error('failed to update profile');
        console.error('Error updating profile:', error);
      } else {
        toast.success('profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim().toLowerCase())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim().toLowerCase()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim().toLowerCase())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim().toLowerCase()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent-400 animate-spin mx-auto mb-4" />
          <p className="text-light-300">loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card variant="default" className="p-12 text-center max-w-md">
          <User className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">sign in required</h2>
          <p className="text-light-400 mb-6">
            please sign in to view your profile
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            sign in
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card variant="default" className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-accent-600 to-accent-700"></div>
            <CardContent className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
                <div className="w-32 h-32 rounded-full border-4 border-dark-950 shadow-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                  {profileData.avatar_url ? (
                    <img
                      src={profileData.avatar_url}
                      alt={profileData.display_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h1 className="text-3xl font-bold text-white">{profileData.display_name || 'builder'}</h1>
                      <Badge variant="primary" size="sm">
                        <Trophy className="w-3 h-3 mr-1" />
                        {profileData.total_points} points
                      </Badge>
                    </div>
                    <p className="text-light-300 leading-relaxed max-w-2xl">
                      {profileData.bio || 'passionate builder creating amazing projects'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-light-400">
                    {profileData.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                    {profileData.company && profileData.position && (
                      <div className="flex items-center space-x-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{profileData.position} at {profileData.company}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>joined {new Date(profileData.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {profileData.github_username && (
                      <a href={`https://github.com/${profileData.github_username}`} className="text-light-400 hover:text-accent-400 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.twitter_username && (
                      <a href={`https://twitter.com/${profileData.twitter_username}`} className="text-light-400 hover:text-accent-400 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.linkedin_username && (
                      <a href={`https://linkedin.com/in/${profileData.linkedin_username}`} className="text-light-400 hover:text-accent-400 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.website && (
                      <a href={profileData.website} className="text-light-400 hover:text-accent-400 transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant={isEditing ? "primary" : "outline"} 
                  size="md" 
                  icon={isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  loading={saving}
                >
                  {isEditing ? 'save profile' : 'edit profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent-400 mb-2">
              {profileData.total_points}
            </div>
            <div className="text-sm text-light-400">total points</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent-400 mb-2">
              {profileData.projects_count}
            </div>
            <div className="text-sm text-light-400">projects</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent-400 mb-2">
              {profileData.votes_received}
            </div>
            <div className="text-sm text-light-400">votes received</div>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-accent-400 mb-2">
              {profileData.votes_given}
            </div>
            <div className="text-sm text-light-400">votes given</div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-accent-600 text-white'
                      : 'bg-dark-800 text-light-300 border border-dark-700 hover:border-accent-600 hover:text-accent-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Projects */}
              <Card variant="default" className="p-6">
                <CardHeader>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Code2 className="w-5 h-5 mr-2 text-accent-400" />
                    recent projects
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockProjects.map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                        <p className="text-sm text-light-400 mb-2">{project.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-light-400">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-error-500" />
                            <span>{project.votes}</span>
                          </span>
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant={getProjectStatusColor(project.status)} size="sm">
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills & Interests */}
              <div className="space-y-6">
                {/* Skills */}
                <Card variant="default" className="p-6">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-accent-400" />
                      skills
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.skills.map(skill => (
                        <div key={skill} className="flex items-center">
                          <Badge variant="primary" size="sm">
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-accent-800 hover:text-accent-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="bg-dark-700 border-dark-600 text-white"
                        />
                        <Button size="md" onClick={addSkill} icon={<Plus className="w-4 h-4" />}>
                          add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card variant="default" className="p-6">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-accent-400" />
                      interests
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profileData.interests.map(interest => (
                        <div key={interest} className="flex items-center">
                          <Badge variant="secondary" size="sm">
                            {interest}
                            {isEditing && (
                              <button
                                onClick={() => removeInterest(interest)}
                                className="ml-2 text-dark-600 hover:text-dark-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="add an interest..."
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                          className="bg-dark-700 border-dark-600 text-white"
                        />
                        <Button size="md" onClick={addInterest} icon={<Plus className="w-4 h-4" />}>
                          add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <Card variant="default" className="p-6">
              <CardHeader>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code2 className="w-5 h-5 mr-2 text-accent-400" />
                  all projects ({profileData.projects_count})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProjects.map(project => (
                    <Card key={project.id} hover className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-accent-600 to-accent-700 flex items-center justify-center">
                        <Code2 className="w-12 h-12 text-white" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-light-400 mb-3">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-light-400">
                            <Heart className="w-4 h-4 text-error-500" />
                            <span>{project.votes} votes</span>
                          </div>
                          <Badge variant={getProjectStatusColor(project.status)} size="sm">
                            {project.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'badges' && (
            <Card variant="default" className="p-6">
              <CardHeader>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-accent-400" />
                  achievement badges ({mockBadges.length})
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {mockBadges.map(badge => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-dark-700 rounded-lg"
                    >
                      <div className="text-3xl mb-3">{badge.icon}</div>
                      <div className="text-sm font-semibold text-white mb-2">{badge.name}</div>
                      <p className="text-xs text-light-400 mb-3">{badge.description}</p>
                      <Badge variant={getBadgeColor(badge.rarity)} size="sm">
                        {badge.rarity}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card variant="default" className="p-6">
              <CardHeader>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-accent-400" />
                  profile settings
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="display name"
                    value={profileData.display_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="email"
                    value={profileData.email}
                    disabled
                    className="bg-dark-700 border-dark-600 text-white opacity-50"
                    helper="email cannot be changed"
                  />
                  <Input
                    label="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="github username"
                    value={profileData.github_username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, github_username: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="twitter username"
                    value={profileData.twitter_username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, twitter_username: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="linkedin username"
                    value={profileData.linkedin_username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, linkedin_username: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="instagram username"
                    value={profileData.instagram_username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, instagram_username: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border-dark-600 bg-dark-700 text-white placeholder-light-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">education</label>
                  <Input
                    value={profileData.education}
                    onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                    className="bg-dark-700 border-dark-600 text-white"
                    placeholder="e.g., computer science, stanford university"
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
                    cancel
                  </Button>
                  <Button variant="primary" size="lg" glow onClick={handleSaveProfile} loading={saving}>
                    save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}