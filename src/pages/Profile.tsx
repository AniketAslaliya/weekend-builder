import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Loader2,
  BadgeCheck,
  UserCircle,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { StatCard } from '@/components/ui/StatCard';
import { PillChip } from '@/components/ui/PillChip';
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
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
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
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');
  const fileInputRef = useRef(null);

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
              setEditData({
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
          setEditData({
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
        display_name: editData.display_name,
        bio: editData.bio,
        location: editData.location,
        website: editData.website,
        company: editData.company,
        position: editData.position,
        education: editData.education,
        github_username: editData.github_username,
        twitter_username: editData.twitter_username,
        linkedin_username: editData.linkedin_username,
        instagram_username: editData.instagram_username,
        skills: editData.skills,
        interests: editData.interests,
        user_type: editData.user_type,
        is_mentor: editData.is_mentor,
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
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim().toLowerCase())) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim().toLowerCase()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !editData.interests.includes(newInterest.trim().toLowerCase())) {
      setEditData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim().toLowerCase()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  // Open edit modal and copy current profile data
  const openEdit = () => {
    setEditData(editData);
    setAvatarPreview(editData.avatar_url || '');
    setEditOpen(true);
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const saveEdit = async () => {
    setSaving(true);
    try {
      await handleSaveProfile();
      setEditOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // AnimatedCounter component
  const AnimatedCounter = ({ value }: { value: number }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      if (start === end) return;
      let increment = end > start ? 1 : -1;
      let stepTime = Math.abs(Math.floor(1000 / (end - start)));
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        setDisplay(current);
        if (current === end) clearInterval(timer);
      }, Math.max(stepTime, 20));
      return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-accent-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Banner & Avatar */}
        <div className="relative flex flex-col items-center justify-center mb-8">
          <div className="w-full h-32 rounded-2xl bg-gradient-to-r from-accent-600 via-accent-400 to-accent-700 mb-[-64px] shadow-lg" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="w-32 h-32 rounded-full border-4 border-accent-400 shadow-xl bg-white overflow-hidden flex items-center justify-center -mt-16">
              {editData.avatar_url ? (
                <img src={editData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-28 h-28 text-accent-400" />
              )}
            </div>
            <button
              onClick={openEdit}
              className="absolute right-0 bottom-0 bg-accent-500 text-white rounded-full p-2 shadow-lg hover:bg-accent-600 transition-all border-2 border-white"
              title="Edit Profile"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </motion.div>
          <div className="mt-4 text-center">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg flex items-center justify-center gap-2">
              {editData.display_name || 'Your Name'}
              <BadgeCheck className="w-6 h-6 text-accent-400" />
            </h1>
            <div className="text-light-400 text-sm mt-1 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> joined {editData.created_at ? new Date(editData.created_at).toLocaleDateString() : '--'}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl border border-accent-400/30 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
              
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-light-400 hover:text-accent-400 transition-colors z-10"
                onClick={() => setEditOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
                    <p className="text-light-400">Customize your builder identity</p>
                  </div>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="relative z-10 mb-8">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-accent-400/50 shadow-2xl overflow-hidden bg-gradient-to-br from-accent-500/20 to-purple-500/20">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserCircle className="w-20 h-20 text-accent-400" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-accent-500 to-purple-500 text-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarChange} 
                    />
                  </div>
                  <p className="text-light-400 text-sm text-center">
                    Click the camera icon to upload a new avatar
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="relative z-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">Display Name</label>
                    <Input 
                      value={editData.display_name} 
                      onChange={e => setEditData({ ...editData, display_name: e.target.value })} 
                      placeholder="Your awesome name" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">Location</label>
                    <Input 
                      value={editData.location} 
                      onChange={e => setEditData({ ...editData, location: e.target.value })} 
                      placeholder="Where are you building?" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-accent-400 mb-2">Bio</label>
                  <textarea 
                    value={editData.bio} 
                    onChange={e => setEditData({ ...editData, bio: e.target.value })} 
                    placeholder="Tell us about your building journey..." 
                    rows={3}
                    className="w-full bg-white/10 border border-accent-400/30 rounded-lg p-3 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">GitHub</label>
                    <Input 
                      value={editData.github_username} 
                      onChange={e => setEditData({ ...editData, github_username: e.target.value })} 
                      placeholder="github-username" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">Twitter</label>
                    <Input 
                      value={editData.twitter_username} 
                      onChange={e => setEditData({ ...editData, twitter_username: e.target.value })} 
                      placeholder="twitter-username" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">LinkedIn</label>
                    <Input 
                      value={editData.linkedin_username} 
                      onChange={e => setEditData({ ...editData, linkedin_username: e.target.value })} 
                      placeholder="linkedin-username" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent-400 mb-2">Website</label>
                    <Input 
                      value={editData.website} 
                      onChange={e => setEditData({ ...editData, website: e.target.value })} 
                      placeholder="your-website.com" 
                      className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <label className="block text-sm font-semibold text-accent-400 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editData.skills.map((skill, index) => (
                      <PillChip key={index} className="bg-accent-500/20 text-accent-400 border-accent-400/30">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-accent-400 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </PillChip>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..." 
                      className="flex-1 bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addSkill}
                      disabled={!newSkill.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Interests Section */}
                <div>
                  <label className="block text-sm font-semibold text-accent-400 mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editData.interests.map((interest, index) => (
                      <PillChip key={index} className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                        {interest}
                        <button 
                          onClick={() => removeInterest(interest)}
                          className="ml-2 text-purple-400 hover:text-red-400 transition-colors"
                        >
                          ×
                        </button>
                      </PillChip>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input 
                      value={newInterest} 
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest..." 
                      className="flex-1 bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addInterest}
                      disabled={!newInterest.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-accent-400/20">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditOpen(false)} 
                    className="flex-1 bg-white/5 border-accent-400/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={saveEdit} 
                    loading={saving} 
                    className="flex-1 bg-gradient-to-r from-accent-500 to-purple-500 hover:from-accent-600 hover:to-purple-600"
                    glow
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <StatCard label="total points" value={<AnimatedCounter value={editData.total_points} />} icon={<Star className="w-6 h-6" />} />
          <StatCard label="projects" value={<AnimatedCounter value={editData.projects_count} />} icon={<Code2 className="w-6 h-6" />} />
          <StatCard label="votes received" value={<AnimatedCounter value={editData.votes_received} />} icon={<Heart className="w-6 h-6" />} />
          <StatCard label="votes given" value={<AnimatedCounter value={editData.votes_given} />} icon={<Zap className="w-6 h-6" />} />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-accent-500 text-white shadow' : 'bg-white/10 text-accent-400 hover:bg-accent-500/20'}`}
            >
              <span className="inline-flex items-center gap-1">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Recent Projects */}
              <GlassyCard>
                <h2 className="text-lg font-bold text-accent-400 mb-4 flex items-center gap-2"><Code2 /> recent projects</h2>
                {mockProjects.length === 0 ? (
                  <div className="text-light-400">No projects yet.</div>
                ) : (
                  <div className="space-y-4">
                    {mockProjects.map(project => (
                      <div key={project.id} className="bg-white/5 rounded-xl p-4 shadow flex flex-col gap-1 border border-accent-400/10">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{project.title}</span>
                          <Badge variant="primary" size="sm">{project.status}</Badge>
                        </div>
                        <div className="text-light-400 text-xs">{project.description}</div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <Heart className="w-4 h-4 text-error-400" /> {project.votes}
                          <span className="text-light-400">{project.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassyCard>

              {/* Skills & Interests */}
              <GlassyCard>
                <h2 className="text-lg font-bold text-accent-400 mb-4 flex items-center gap-2"><Zap /> skills</h2>
                <div className="flex flex-wrap mb-4">
                  {editData.skills.length === 0 ? (
                    <span className="text-light-400">No skills added.</span>
                  ) : (
                    editData.skills.map(skill => <PillChip key={skill} className="mr-2 mb-2">{skill}</PillChip>)
                  )}
                </div>
                <h2 className="text-lg font-bold text-accent-400 mb-4 flex items-center gap-2"><Star /> interests</h2>
                <div className="flex flex-wrap">
                  {editData.interests.length === 0 ? (
                    <span className="text-light-400">No interests added.</span>
                  ) : (
                    editData.interests.map(interest => <PillChip key={interest} className="mr-2 mb-2">{interest}</PillChip>)
                  )}
                </div>
              </GlassyCard>
            </motion.div>
          )}
          {/* Add similar modern layouts for projects, badges, settings tabs if needed */}
        </AnimatePresence>
      </div>
    </div>
  );
}