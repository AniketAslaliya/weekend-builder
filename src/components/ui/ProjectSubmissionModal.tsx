import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  eventTitle?: string;
}

export function ProjectSubmissionModal({ 
  isOpen, 
  onClose, 
  eventId, 
  eventTitle 
}: ProjectSubmissionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    demoUrl: '',
    repoUrl: '',
    videoUrl: '',
    images: [] as string[],
    tags: [] as string[],
    teamMembers: [{ name: user?.user_metadata?.display_name || '', role: 'creator' }],
    lookingForTeam: false,
    teamNeeds: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '' });

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const steps = [
    { id: 1, title: 'project details', icon: Upload },
    { id: 2, title: 'media & links', icon: Upload },
    { id: 3, title: 'team & tags', icon: Upload },
    { id: 4, title: 'review & submit', icon: Upload }
  ];

  const handleSubmit = async () => {
    if (!user) {
      toast.error('please sign in to submit a project');
      return;
    }

    setLoading(true);
    
    try {
      // Get user profile to get creator_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Failed to fetch user profile');
        return;
      }

      // Prepare project data
      const projectData = {
        event_id: eventId || null,
        creator_id: profile.id,
        title: formData.title,
        description: formData.description,
        short_description: formData.shortDescription,
        tags: formData.tags,
        demo_url: formData.demoUrl || null,
        repo_url: formData.repoUrl || null,
        video_url: formData.videoUrl || null,
        images: formData.images,
        status: 'submitted',
        looking_for_team: formData.lookingForTeam,
        team_needs: formData.teamNeeds,
        submitted_at: new Date().toISOString()
      };

      // Insert project into database
      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting project:', insertError);
        toast.error('Failed to submit project. Please try again.');
        return;
      }

      // If team members were added, create team entries
      if (formData.teamMembers.length > 1) {
        const teamData = formData.teamMembers.map(member => ({
          project_id: project.id,
          user_id: profile.id, // For now, all team members are the same user
          role: member.role === 'creator' ? 'creator' : 'member'
        }));

        const { error: teamError } = await supabase
          .from('teams')
          .insert(teamData);

        if (teamError) {
          console.error('Error creating team:', teamError);
          // Don't fail the submission for team errors
        }
      }

      toast.success('🎉 project submitted successfully!');
      onClose();
      setCurrentStep(1);
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        demoUrl: '',
        repoUrl: '',
        videoUrl: '',
        images: [],
        tags: [],
        teamMembers: [{ name: user?.user_metadata?.display_name || '', role: 'creator' }],
        lookingForTeam: false,
        teamNeeds: []
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Failed to submit project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(i => i !== image)
    }));
  };

  const addTeamMember = () => {
    if (newTeamMember.name.trim() && newTeamMember.role.trim()) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { ...newTeamMember }]
      }));
      setNewTeamMember({ name: '', role: '' });
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim();
      case 2:
        return true; // Optional fields
      case 3:
        return formData.tags.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const getStepError = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim()) return 'Project title is required';
        if (!formData.description.trim()) return 'Project description is required';
        return null;
      case 3:
        if (formData.tags.length === 0) return 'At least one tag is required';
        return null;
      default:
        return null;
    }
  };

  const canGoBack = () => {
    return currentStep > 1;
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      demoUrl: '',
      repoUrl: '',
      videoUrl: '',
      images: [],
      tags: [],
      teamMembers: [{ name: user?.user_metadata?.display_name || '', role: 'creator' }],
      lookingForTeam: false,
      teamNeeds: []
    });
    setCurrentStep(1);
    setNewTag('');
    setNewImage('');
    setNewTeamMember({ name: '', role: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-2xl max-w-4xl w-full relative shadow-2xl border border-accent-400/30 overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-light-400 hover:text-accent-400 transition-colors z-10"
            onClick={handleClose}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="relative z-10 p-8 border-b border-accent-400/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Submit Project</h2>
                <p className="text-light-400">
                  {eventTitle ? `for ${eventTitle}` : 'Share your amazing creation with the world'}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const canClick = isCompleted || isActive;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => canClick && goToStep(step.id)}
                      disabled={!canClick}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        isActive ? 'bg-accent-600 text-white shadow-lg' : 
                        isCompleted ? 'bg-success-600 text-white shadow-lg hover:bg-success-500' : 
                        'bg-white/10 text-light-400 border border-accent-400/20'
                      } ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-3 rounded-full ${
                        isCompleted ? 'bg-success-600' : 'bg-accent-400/20'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="relative z-10 p-8">
            {/* Error Message */}
            {getStepError() && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm font-medium">{getStepError()}</p>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Step 1: Project Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Project Title</label>
                      <Input 
                        value={formData.title} 
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                        placeholder="Enter your amazing project title..." 
                        className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                        placeholder="Tell us about your project, what it does, and why it's awesome..." 
                        rows={4}
                        className="w-full bg-white/10 border border-accent-400/30 rounded-lg p-3 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Short Description</label>
                      <Input 
                        value={formData.shortDescription} 
                        onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))} 
                        placeholder="Brief one-line description for project cards..." 
                        className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                      />
                      <p className="text-xs text-light-400 mt-1">This will be shown in project previews</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Media & Links */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Demo URL</label>
                      <Input 
                        value={formData.demoUrl} 
                        onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))} 
                        placeholder="https://your-demo.com" 
                        className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Repository URL</label>
                      <Input 
                        value={formData.repoUrl} 
                        onChange={(e) => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))} 
                        placeholder="https://github.com/username/project" 
                        className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Video URL (Optional)</label>
                      <Input 
                        value={formData.videoUrl} 
                        onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} 
                        placeholder="https://youtube.com/watch?v=..." 
                        className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                      />
                    </div>

                    {/* Images Section */}
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Project Images</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Project image ${index + 1}`} 
                              className="w-16 h-16 rounded-lg object-cover border border-accent-400/30"
                            />
                            <button 
                              onClick={() => removeImage(image)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input 
                          value={newImage} 
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Add image URL..." 
                          className="flex-1 bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addImage}
                          disabled={!newImage.trim()}
                          className="bg-accent-500/20 border-accent-400/30 text-accent-400 hover:bg-accent-500/30"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Team & Tags */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Tags Section */}
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Project Tags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag, index) => (
                          <div key={index} className="bg-accent-500/20 text-accent-400 border border-accent-400/30 rounded-full px-3 py-1 text-sm flex items-center">
                            {tag}
                            <button 
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-accent-400 hover:text-red-400 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input 
                          value={newTag} 
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..." 
                          className="flex-1 bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addTag}
                          disabled={!newTag.trim()}
                          className="bg-accent-500/20 border-accent-400/30 text-accent-400 hover:bg-accent-500/30"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Team Section */}
                    <div>
                      <label className="block text-sm font-semibold text-accent-400 mb-2">Team Members</label>
                      <div className="space-y-3 mb-4">
                        {formData.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-accent-400/20">
                            <div className="flex-1">
                              <p className="text-white font-medium">{member.name}</p>
                              <p className="text-light-400 text-sm">{member.role}</p>
                            </div>
                            {index > 0 && (
                              <button 
                                onClick={() => removeTeamMember(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input 
                          value={newTeamMember.name} 
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Member name..." 
                          className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                        />
                        <Input 
                          value={newTeamMember.role} 
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Role..." 
                          className="bg-white/10 border-accent-400/30 text-white placeholder-light-400 focus:border-accent-500 focus:bg-white/20 transition-all"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addTeamMember}
                        disabled={!newTeamMember.name.trim() || !newTeamMember.role.trim()}
                        className="mt-3 bg-accent-500/20 border-accent-400/30 text-accent-400 hover:bg-accent-500/30"
                      >
                        Add Team Member
                      </Button>
                    </div>

                    {/* Looking for Team */}
                    <div className="flex items-center space-x-3">
                      <input 
                        type="checkbox" 
                        id="lookingForTeam"
                        checked={formData.lookingForTeam}
                        onChange={(e) => setFormData(prev => ({ ...prev, lookingForTeam: e.target.checked }))}
                        className="w-4 h-4 text-accent-600 bg-white/10 border-accent-400/30 rounded focus:ring-accent-500"
                      />
                      <label htmlFor="lookingForTeam" className="text-white font-medium">
                        Looking for team members
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-accent-400/20">
                      <h3 className="text-xl font-bold text-white mb-4">Project Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-accent-400 text-sm font-medium">Title</p>
                          <p className="text-white">{formData.title}</p>
                        </div>
                        <div>
                          <p className="text-accent-400 text-sm font-medium">Description</p>
                          <p className="text-light-300">{formData.description}</p>
                        </div>
                        <div>
                          <p className="text-accent-400 text-sm font-medium">Tags</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.tags.map((tag, index) => (
                              <span key={index} className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-accent-400 text-sm font-medium">Team</p>
                          <div className="space-y-1 mt-1">
                            {formData.teamMembers.map((member, index) => (
                              <p key={index} className="text-light-300">
                                {member.name} - {member.role}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 p-8 border-t border-accent-400/20">
            <div className="flex gap-4">
              {canGoBack() && (
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1 bg-white/5 border-accent-400/30 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button 
                  variant="primary"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex-1"
                  glow
                >
                  {getStepError() ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      {getStepError()}
                    </>
                  ) : (
                    <>
                      Next
                      <span className="ml-2 text-sm opacity-75">Step {currentStep + 1}</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1"
                  glow
                >
                  {loading ? (
                    <>
                      <Upload className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit Project
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}