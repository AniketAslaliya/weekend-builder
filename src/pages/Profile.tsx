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
  UserCircle
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <GlassyCard className="w-full max-w-lg relative">
              <button onClick={() => setEditOpen(false)} className="absolute top-4 right-4 text-accent-400 hover:text-accent-600">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-accent-500 mb-6 text-center">Edit Profile</h2>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-accent-400 shadow bg-white overflow-hidden flex items-center justify-center mb-2">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-20 h-20 text-accent-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="mt-2 px-4 py-1 rounded-full bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-all"
                >
                  Change Avatar
                </button>
              </div>
              <div className="space-y-4">
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.display_name}
                  onChange={e => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Display Name"
                />
                <textarea
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.bio}
                  onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Bio"
                  rows={3}
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.location}
                  onChange={e => setEditData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.github_username}
                  onChange={e => setEditData(prev => ({ ...prev, github_username: e.target.value }))}
                  placeholder="GitHub Username"
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.twitter_username}
                  onChange={e => setEditData(prev => ({ ...prev, twitter_username: e.target.value }))}
                  placeholder="Twitter Username"
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.linkedin_username}
                  onChange={e => setEditData(prev => ({ ...prev, linkedin_username: e.target.value }))}
                  placeholder="LinkedIn Username"
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.instagram_username}
                  onChange={e => setEditData(prev => ({ ...prev, instagram_username: e.target.value }))}
                  placeholder="Instagram Username"
                />
                <input
                  className="w-full rounded-lg border border-accent-400 bg-white text-primary px-4 py-2 font-semibold"
                  value={editData.website}
                  onChange={e => setEditData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Website"
                />
              </div>
              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-6 py-2 rounded-full bg-white/20 text-accent-500 font-bold hover:bg-white/40 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-6 py-2 rounded-full bg-accent-500 text-white font-bold hover:bg-accent-600 transition-all shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </GlassyCard>
          </div>
        )}

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          <StatCard label="total points" value={editData.total_points} icon={<Star className="w-6 h-6" />} />
          <StatCard label="projects" value={editData.projects_count} icon={<Code2 className="w-6 h-6" />} />
          <StatCard label="votes received" value={editData.votes_received} icon={<Heart className="w-6 h-6" />} />
          <StatCard label="votes given" value={editData.votes_given} icon={<Zap className="w-6 h-6" />} />
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