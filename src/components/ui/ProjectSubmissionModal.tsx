import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Send, 
  Link as LinkIcon, 
  Github, 
  Video, 
  Image as ImageIcon,
  FileText,
  Users,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
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

  const steps = [
    { id: 1, title: 'project details', icon: FileText },
    { id: 2, title: 'media & links', icon: LinkIcon },
    { id: 3, title: 'team & tags', icon: Users },
    { id: 4, title: 'review & submit', icon: Send }
  ];

  const handleSubmit = async () => {
    if (!user) {
      toast.error('please sign in to submit a project');
      return;
    }

    setLoading(true);
    
    try {
      // Here you would integrate with Supabase to save the project
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      toast.error('failed to submit project. please try again.');
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
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div>
              <h2 className="text-2xl font-bold text-white">submit your project</h2>
              {eventTitle && (
                <p className="text-light-400 mt-1">for {eventTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-light-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-dark-700">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-accent-600 text-white' : 
                      isCompleted ? 'bg-success-600 text-white' : 
                      'bg-dark-700 text-light-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        isCompleted ? 'bg-success-600' : 'bg-dark-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step 1: Project Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Input
                      label="project title"
                      placeholder="enter your project title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white border-dark-400 text-primary placeholder-dark-400"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-light-300 mb-2">
                        project description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="describe your project in detail..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-lg border border-dark-400 bg-white text-primary placeholder-dark-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                      />
                    </div>

                    <Input
                      label="short description"
                      placeholder="brief one-line description..."
                      value={formData.shortDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                      className="bg-white border-dark-400 text-primary placeholder-dark-400"
                      helper="this will be shown in project cards"
                    />
                  </div>
                )}

                {/* Step 2: Media & Links */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <Input
                      label="demo url"
                      placeholder="https://your-demo.com"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                      className="bg-white border-dark-400 text-primary placeholder-dark-400"
                      icon={<LinkIcon className="w-4 h-4" />}
                    />

                    <Input
                      label="repository url"
                      placeholder="https://github.com/username/repo"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))}
                      className="bg-white border-dark-400 text-primary placeholder-dark-400"
                      icon={<Github className="w-4 h-4" />}
                    />

                    <Input
                      label="video demo url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      className="bg-white border-dark-400 text-primary placeholder-dark-400"
                      icon={<Video className="w-4 h-4" />}
                      helper="upload a demo video showcasing your project"
                    />

                    <div>
                      <label className="block text-sm font-medium text-light-300 mb-2">
                        project images
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          className="bg-white border-dark-400 text-primary placeholder-dark-400 flex-1"
                        />
                        <Button size="md" onClick={addImage} icon={<ImageIcon className="w-4 h-4" />}>
                          add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="flex items-center">
                            <Badge variant="primary" size="sm">
                              image {index + 1}
                              <button
                                onClick={() => removeImage(image)}
                                className="ml-2 text-accent-800 hover:text-accent-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Team & Tags */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-light-300 mb-2">
                        technologies used
                      </label>
                      <div className="flex space-x-2 mb-3">
                        <Input
                          placeholder="react, node.js, ai, etc."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'enter' && addTag()}
                          className="bg-white border-dark-400 text-primary placeholder-dark-400 flex-1"
                        />
                        <Button size="md" onClick={addTag} icon={<Tag className="w-4 h-4" />}>
                          add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <div key={tag} className="flex items-center">
                            <Badge variant="primary" size="sm">
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-accent-800 hover:text-accent-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-light-300 mb-2">
                        team members
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <Input
                          placeholder="team member name"
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-white border-dark-400 text-primary placeholder-dark-400"
                        />
                        <div className="flex space-x-2">
                          <Input
                            placeholder="role"
                            value={newTeamMember.role}
                            onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                            className="bg-white border-dark-400 text-primary placeholder-dark-400 flex-1"
                          />
                          <Button size="md" onClick={addTeamMember} icon={<Users className="w-4 h-4" />}>
                            add
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {formData.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                            <div>
                              <span className="text-white font-medium">{member.name}</span>
                              <span className="text-light-400 ml-2">({member.role})</span>
                            </div>
                            {index > 0 && (
                              <button
                                onClick={() => removeTeamMember(index)}
                                className="text-error-400 hover:text-error-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <Card variant="default" className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">project summary</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white">{formData.title}</h4>
                          <p className="text-light-400 text-sm">{formData.shortDescription}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-light-400">team size:</span>
                            <span className="text-white ml-2">{formData.teamMembers.length} member{formData.teamMembers.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div>
                            <span className="text-light-400">technologies:</span>
                            <span className="text-white ml-2">{formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {formData.tags.slice(0, 5).map(tag => (
                            <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                          ))}
                          {formData.tags.length > 5 && (
                            <Badge variant="gray" size="sm">+{formData.tags.length - 5} more</Badge>
                          )}
                        </div>
                      </div>
                    </Card>

                    <div className="bg-dark-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">submission checklist</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${formData.title && formData.description ? 'bg-success-600' : 'bg-dark-600'}`} />
                          <span className="text-light-300">project details completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${formData.tags.length > 0 ? 'bg-success-600' : 'bg-dark-600'}`} />
                          <span className="text-light-300">technologies tagged</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded ${formData.teamMembers.length > 0 ? 'bg-success-600' : 'bg-dark-600'}`} />
                          <span className="text-light-300">team information added</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-dark-700">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button variant="outline" size="lg" onClick={prevStep}>
                  previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="lg" onClick={onClose}>
                cancel
              </Button>
              {currentStep < steps.length ? (
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={nextStep}
                  disabled={!canProceed()}
                  glow
                >
                  next step
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSubmit}
                  loading={loading}
                  icon={<Send className="w-5 h-5" />}
                  glow
                >
                  submit project
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}