import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Star, 
  TrendingUp, 
  Award, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Crown, 
  Medal, 
  Trophy, 
  BarChart3,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Check if user is admin (in real app, this would be from database)
  const isAdmin = user?.email === 'admin@weekendbuilder.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Card variant="default" className="p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-error-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-light-400 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Mock data
  const events = [
    {
      id: '1',
      title: 'AI-Powered Solutions Weekend',
      theme: 'Build the future with AI 🤖',
      status: 'active',
      participants: 847,
      projects: 156,
      startDate: '2025-01-18T09:00:00Z',
      endDate: '2025-01-19T21:00:00Z',
      category: 'AI',
      featured: true
    },
    {
      id: '2',
      title: 'Sustainable Tech Challenge',
      theme: 'Tech for Planet Earth 🌍',
      status: 'upcoming',
      participants: 234,
      projects: 0,
      startDate: '2025-01-25T09:00:00Z',
      endDate: '2025-01-26T21:00:00Z',
      category: 'Sustainability',
      featured: false
    },
    {
      id: '3',
      title: 'Web3 & Blockchain Builder Weekend',
      theme: 'Decentralized Future 🔗',
      status: 'completed',
      participants: 423,
      projects: 89,
      startDate: '2025-01-11T09:00:00Z',
      endDate: '2025-01-12T21:00:00Z',
      category: 'Blockchain',
      featured: false,
      winners: {
        grandPrize: { name: 'DeFi Portfolio Tracker', creator: 'Alex Chen' },
        runnerUp: { name: 'NFT Marketplace', creator: 'Sarah Kim' },
        thirdPlace: { name: 'DAO Governance Tool', creator: 'Mike Johnson' }
      }
    }
  ];

  const stats = [
    { label: 'Total Events', value: '42', icon: Calendar, color: 'text-accent-400' },
    { label: 'Active Participants', value: '2,847', icon: Users, color: 'text-success-400' },
    { label: 'Projects Submitted', value: '1,293', icon: Trophy, color: 'text-warning-400' },
    { label: 'Total Prize Money', value: '$125K', icon: Award, color: 'text-error-400' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'winners', label: 'Winners', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const handleAnnounceWinners = () => {
    setShowWinnerModal(true);
  };

  const handleDeleteEvent = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      toast.success('Event deleted successfully');
    }
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
            <div>
              <Badge variant="warning" size="lg" className="mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">
                Event Management
              </h1>
              <p className="text-xl text-light-300">
                Manage events, announce winners, and oversee the community
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateEvent}
              icon={<Plus className="w-5 h-5" />}
              glow
            >
              Create Event
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-light-400">{stat.label}</div>
              </Card>
            );
          })}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <Card variant="default" className="p-8">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-lg">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">New project submitted</p>
                          <p className="text-sm text-light-400">AI Recipe Generator by Sarah Chen</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-lg">
                        <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">Event started</p>
                          <p className="text-sm text-light-400">AI-Powered Solutions Weekend is now live</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-dark-700 rounded-lg">
                        <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">Winners announced</p>
                          <p className="text-sm text-light-400">Web3 & Blockchain Builder Weekend</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="default" className="p-8">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full justify-start"
                        onClick={handleCreateEvent}
                        icon={<Plus className="w-5 h-5" />}
                      >
                        Create New Event
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full justify-start"
                        onClick={() => handleAnnounceWinners()}
                        icon={<Crown className="w-5 h-5" />}
                      >
                        Announce Winners
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full justify-start"
                        icon={<BarChart3 className="w-5 h-5" />}
                      >
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                {events.map((event) => (
                  <Card key={event.id} variant="default" className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="text-4xl">{event.theme.split(' ').pop()}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                            <Badge 
                              variant={
                                event.status === 'active' ? 'success' : 
                                event.status === 'upcoming' ? 'primary' : 'gray'
                              } 
                              size="sm"
                            >
                              {event.status}
                            </Badge>
                            {event.featured && (
                              <Badge variant="warning" size="sm">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-light-400 mb-2">{event.theme}</p>
                          <div className="flex items-center space-x-6 text-sm text-light-400">
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{event.participants} participants</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Trophy className="w-4 h-4" />
                              <span>{event.projects} projects</span>
                            </span>
                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {event.status === 'completed' && !event.winners && (
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handleAnnounceWinners()}
                            icon={<Crown className="w-4 h-4" />}
                          >
                            Announce Winners
                          </Button>
                        )}
                        {event.winners && (
                          <Badge variant="success" size="md">
                            <Crown className="w-3 h-3 mr-1" />
                            Winners Announced
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="md"
                          icon={<Edit3 className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="md"
                          onClick={() => handleDeleteEvent()}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'winners' && (
              <div className="space-y-8">
                {events.filter(e => e.winners).map((event) => (
                  <Card key={event.id} variant="default" className="p-8">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                        <Badge variant="success" size="md">
                          <Crown className="w-4 h-4 mr-1" />
                          Winners Announced
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-warning-500/20 to-warning-600/20 border border-warning-500/30 rounded-lg">
                          <Crown className="w-12 h-12 text-warning-500 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">🥇 Grand Prize</h3>
                          <p className="text-warning-400 font-semibold mb-1">{event.winners?.grandPrize.name}</p>
                          <p className="text-sm text-light-400">by {event.winners?.grandPrize.creator}</p>
                        </div>
                        
                        <div className="text-center p-6 bg-gradient-to-br from-light-400/20 to-light-500/20 border border-light-400/30 rounded-lg">
                          <Medal className="w-12 h-12 text-light-400 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">🥈 Runner-up</h3>
                          <p className="text-light-300 font-semibold mb-1">{event.winners?.runnerUp.name}</p>
                          <p className="text-sm text-light-400">by {event.winners?.runnerUp.creator}</p>
                        </div>
                        
                        <div className="text-center p-6 bg-gradient-to-br from-warning-600/20 to-warning-700/20 border border-warning-600/30 rounded-lg">
                          <Award className="w-12 h-12 text-warning-600 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-white mb-2">🥉 Third Place</h3>
                          <p className="text-warning-300 font-semibold mb-1">{event.winners?.thirdPlace.name}</p>
                          <p className="text-sm text-light-400">by {event.winners?.thirdPlace.creator}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <Card variant="default" className="p-8">
                <CardHeader>
                  <h2 className="text-2xl font-bold text-white mb-4">Admin Settings</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        label="Platform Name"
                        defaultValue="Weekend Builder"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                      <Input
                        label="Admin Email"
                        defaultValue="admin@weekendbuilder.com"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-light-300 mb-2">
                        Platform Description
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Turn every weekend into a building festival. Join thousands of creators in themed weekend hackathons."
                        className="w-full rounded-lg border-dark-600 bg-dark-700 text-white placeholder-light-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="primary" size="lg" icon={<Save className="w-5 h-5" />} glow>
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
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
              className="bg-dark-800 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="text-light-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Event Title"
                    placeholder="e.g., AI-Powered Solutions Weekend"
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="Theme & Emoji"
                    placeholder="e.g., Build the future with AI 🤖"
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Event Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the event, its goals, and what participants will build..."
                    className="w-full rounded-lg border-dark-600 bg-dark-700 text-white placeholder-light-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Start Date & Time"
                    type="datetime-local"
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                  <Input
                    label="End Date & Time"
                    type="datetime-local"
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-light-300 mb-2">
                      Category
                    </label>
                    <select className="w-full rounded-lg border-dark-600 bg-dark-700 text-white focus:border-accent-500 focus:ring-1 focus:ring-accent-500">
                      <option value="AI">AI & Machine Learning</option>
                      <option value="Web">Web Development</option>
                      <option value="Mobile">Mobile Apps</option>
                      <option value="Blockchain">Blockchain & Web3</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Gaming">Gaming</option>
                      <option value="NoCode">No-Code</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Banner Image URL"
                    placeholder="https://example.com/banner.jpg"
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Rules & Guidelines
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Enter the event rules, requirements, and judging criteria..."
                    className="w-full rounded-lg border-dark-600 bg-dark-700 text-white placeholder-light-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-300 mb-2">
                    Prizes (JSON format)
                  </label>
                  <textarea
                    rows={4}
                    placeholder='[{"place": "Grand Prize", "amount": "$5,000", "description": "Best overall solution"}]'
                    className="w-full rounded-lg border-dark-600 bg-dark-700 text-white placeholder-light-400 focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-dark-600 bg-dark-700 text-accent-600 focus:ring-accent-500" />
                    <span className="text-light-300">Featured Event</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-dark-600 bg-dark-700 text-accent-600 focus:ring-accent-500" />
                    <span className="text-light-300">Enable Team Formation</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowCreateEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Save className="w-5 h-5" />}
                    glow
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner Announcement Modal */}
      <AnimatePresence>
        {showWinnerModal && (
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
              className="bg-dark-800 rounded-xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-warning-500" />
                  Announce Winners
                </h2>
                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="text-light-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-warning-500/20 to-warning-600/20 border border-warning-500/30 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-warning-500" />
                      🥇 Grand Prize Winner
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Project Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                      <Input
                        placeholder="Creator Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-light-400/20 to-light-500/20 border border-light-400/30 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      <Medal className="w-5 h-5 mr-2 text-light-400" />
                      🥈 Runner-up
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Project Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                      <Input
                        placeholder="Creator Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-warning-600/20 to-warning-700/20 border border-warning-600/30 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-warning-600" />
                      🥉 Third Place
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Project Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                      <Input
                        placeholder="Creator Name"
                        className="bg-dark-700 border-dark-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowWinnerModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Crown className="w-5 h-5" />}
                    glow
                  >
                    Announce Winners
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}