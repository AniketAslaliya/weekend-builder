import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Code2, 
  Sparkles, 
  Wand2,
  Rocket,
  Brain,
  Settings,
  Play,
  Download,
  Share2,
  Copy,
  Check,
  Plus,
  Save,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { StatCard } from '@/components/ui/StatCard';
import { PillChip } from '@/components/ui/PillChip';
import { ProjectSubmissionModal } from '@/components/ui/ProjectSubmissionModal';

export function AIBuilder() {
  const [projectIdea, setProjectIdea] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [savedProjects, setSavedProjects] = useState([
    {
      id: '1',
      title: 'task manager app',
      description: 'ai-powered task management with smart prioritization',
      template: 'web-app',
      createdAt: '2025-01-15',
      status: 'completed'
    },
    {
      id: '2',
      title: 'mood tracker',
      description: 'wellness app that tracks emotional patterns',
      template: 'mobile-app',
      createdAt: '2025-01-14',
      status: 'draft'
    }
  ]);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const templates = [
    {
      id: 'web-app',
      title: 'web application',
      description: 'full-stack web app with react, node.js, and database',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      features: ['react frontend', 'express backend', 'database integration', 'authentication']
    },
    {
      id: 'mobile-app',
      title: 'mobile app',
      description: 'cross-platform mobile app with react native',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      features: ['react native', 'navigation', 'state management', 'api integration']
    },
    {
      id: 'ai-tool',
      title: 'ai-powered tool',
      description: 'ai application with machine learning capabilities',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      features: ['ai/ml integration', 'data processing', 'model training', 'api endpoints']
    },
    {
      id: 'chrome-extension',
      title: 'browser extension',
      description: 'chrome extension with modern web technologies',
      icon: Wand2,
      color: 'from-orange-500 to-red-500',
      features: ['manifest v3', 'content scripts', 'background service', 'popup interface']
    }
  ];

  const aiFeatures = [
    {
      title: 'smart code generation',
      description: 'generate complete project structures with ai-powered code generation',
      icon: Code2
    },
    {
      title: 'intelligent architecture',
      description: 'ai suggests optimal project architecture and best practices',
      icon: Settings
    },
    {
      title: 'instant deployment',
      description: 'deploy your generated projects instantly to the cloud',
      icon: Rocket
    },
    {
      title: 'real-time collaboration',
      description: 'collaborate with ai and team members in real-time',
      icon: Share2
    }
  ];

  const handleGenerate = async () => {
    if (!projectIdea.trim() || !selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockCode = `// generated ${templates.find(t => t.id === selectedTemplate)?.title}
// project: ${projectIdea}

import React from 'react';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initialize your ${projectIdea} application
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // your api calls here
      setLoading(false);
    } catch (error) {
      console.error('error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <header className="p-6">
        <h1 className="text-3xl font-bold">${projectIdea}</h1>
      </header>
      
      <main className="container mx-auto px-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* your generated components will appear here */}
            <div className="bg-dark-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">welcome to your ${projectIdea}!</h2>
              <p className="text-light-300">
                this is your ai-generated starting point. customize and extend as needed.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;`;
      
      setGeneratedCode(mockCode);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProject = () => {
    if (!projectIdea.trim() || !selectedTemplate) return;
    
    const newProject = {
      id: Date.now().toString(),
      title: projectIdea.toLowerCase(),
      description: `ai-generated ${templates.find(t => t.id === selectedTemplate)?.title}`,
      template: selectedTemplate,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    };
    
    setSavedProjects(prev => [newProject, ...prev]);
    setProjectIdea('');
    setSelectedTemplate('');
    setGeneratedCode('');
  };

  const handleSubmitToEvent = () => {
    setShowSubmissionModal(true);
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    if (downloadRef.current) {
      downloadRef.current.href = url;
      downloadRef.current.download = `${projectIdea.replace(/\s+/g, '_') || 'ai_project'}.js`;
      downloadRef.current.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
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
          <div className="text-center">
            <Badge variant="primary" size="lg" className="mb-4" glow>
              <Brain className="w-4 h-4 mr-2" />
              ai builder
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              build with ai power
            </h1>
            <p className="text-xl text-light-300 max-w-2xl mx-auto">
              transform your ideas into fully functional projects using our advanced ai builder. just describe what you want to build!
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Templates */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Project Idea Input */}
            <GlassyCard className="p-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-accent-400" />
                  describe your project
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <Input
                    placeholder="e.g., a task management app with ai-powered prioritization..."
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    className="text-lg py-4 bg-white text-primary placeholder-dark-400 focus:border-accent-500"
                  />
                  <p className="text-sm text-light-400 mt-2">
                    be as detailed as possible. the ai will use this to generate your project structure.
                  </p>
                </div>
              </div>
            </GlassyCard>

            {/* Template Selection */}
            <GlassyCard className="p-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Wand2 className="w-6 h-6 mr-2 text-accent-400" />
                  choose template
                </h2>
              </div>
              <div className="grid gap-4">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedTemplate === template.id
                          ? 'border-accent-500 bg-accent-500/10'
                          : 'border-accent-400/20 bg-white/5 backdrop-blur hover:border-accent-600/50'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${template.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">
                            {template.title}
                          </h3>
                          <p className="text-light-300 text-sm mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {template.features.map((feature, index) => (
                              <PillChip key={index}>{feature}</PillChip>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </GlassyCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="xl"
                className="flex-1"
                onClick={handleGenerate}
                disabled={!projectIdea.trim() || !selectedTemplate || isGenerating}
                loading={isGenerating}
                glow
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-6 h-6 mr-2 animate-pulse" />
                    ai is building your project...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 mr-2" />
                    generate project with ai
                  </>
                )}
              </Button>
              
              {generatedCode && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={handleSaveProject}
                  icon={<Save className="w-5 h-5" />}
                >
                  save project
                </Button>
              )}
            </div>

            {/* Generated Code Output */}
            {generatedCode && (
              <GlassyCard className="p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Code2 className="w-6 h-6 mr-2 text-accent-400" />
                      generated code
                    </h2>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {copied ? 'copied!' : 'copy'}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmitToEvent}
                        icon={<Upload className="w-4 h-4" />}
                      >
                        submit to event
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bg-dark-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-light-200 whitespace-pre-wrap">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </GlassyCard>
            )}

            {/* Action Buttons for Generated Code */}
            {generatedCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 gap-4"
              >
                <Button variant="primary" size="lg" icon={<Play className="w-5 h-5" />} onClick={() => setShowRunModal(true)}>
                  run project
                </Button>
                <Button variant="outline" size="lg" icon={<Download className="w-5 h-5" />} onClick={handleDownload}>
                  download
                </Button>
                <a ref={downloadRef} style={{ display: 'none' }} />
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Saved Projects & Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Saved Projects */}
            <GlassyCard className="p-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Save className="w-5 h-5 mr-2 text-accent-400" />
                  saved projects ({savedProjects.length})
                </h2>
              </div>
              <div className="space-y-4">
                {savedProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-white/5 backdrop-blur rounded-lg border border-accent-400/20">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{project.title}</h3>
                      <Badge 
                        variant={project.status === 'completed' ? 'success' : 'gray'} 
                        size="sm"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-light-400 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-light-500">
                      <span>{project.createdAt}</span>
                      <span>{templates.find(t => t.id === project.template)?.title}</span>
                    </div>
                  </div>
                ))}
                
                {savedProjects.length === 0 && (
                  <div className="text-center py-8">
                    <Code2 className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                    <p className="text-light-400">no saved projects yet</p>
                    <p className="text-sm text-light-500">generate your first project to get started</p>
                  </div>
                )}
              </div>
            </GlassyCard>

            {/* AI Features */}
            <GlassyCard className="p-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-accent-400" />
                  ai features
                </h2>
              </div>
              <div className="space-y-6">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="w-10 h-10 bg-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-light-300 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassyCard>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <GlassyCard className="max-w-2xl mx-auto p-12">
            <Rocket className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              ready to build the future?
            </h3>
            <p className="text-light-300 mb-8 leading-relaxed">
              join thousands of builders using ai to create amazing projects faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" glow>
                <Sparkles className="w-5 h-5 mr-2" />
                start building
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                share project
              </Button>
            </div>
          </GlassyCard>
        </motion.div>
      </div>

      {/* Project Submission Modal */}
      <ProjectSubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        eventId="1"
        eventTitle="ai-powered solutions weekend"
      />

      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-dark-900 rounded-xl p-8 max-w-lg w-full relative">
            <button className="absolute top-4 right-4 text-light-400 hover:text-accent-400" onClick={() => setShowRunModal(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Play className="w-6 h-6 mr-2 text-accent-400" />
              How to Start Your Project
            </h2>
            <ol className="list-decimal pl-6 text-light-300 space-y-2 mb-4">
              <li>Download the generated code file.</li>
              <li>Open it in your favorite code editor (e.g., VS Code).</li>
              <li>Follow the comments in the code to customize and run locally.</li>
              <li>For full-stack templates, set up backend and database as needed.</li>
            </ol>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setShowRunModal(false)}>
                Got it!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}