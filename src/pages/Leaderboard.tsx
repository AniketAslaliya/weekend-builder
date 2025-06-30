import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  TrendingUp,
  Users,
  Code2,
  Heart,
  Calendar,
  Crown,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlassyCard } from '@/components/ui/GlassyCard';
import { PillChip } from '@/components/ui/PillChip';

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

// Type definitions for leaderboard entries
type OverallEntry = {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    location: string;
  };
  points: number;
  projects: number;
  votes: number;
  badges: number;
  streak: number;
  specialBadges: string[];
};

type ProjectEntry = {
  rank: number;
  project: {
    title: string;
    creator: string;
    image: string;
  };
  votes: number;
  views: number;
  comments: number;
};

type EventEntry = {
  rank: number;
  event: string;
  winner: {
    name: string;
    project: string;
    prize: string;
  };
  participants: number;
  projects: number;
};

type LeaderboardEntry = OverallEntry | ProjectEntry | EventEntry;

export function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  // Mock data for different leaderboard types
  const overallLeaderboard = [
    {
      rank: 1,
      user: {
        id: '1',
        name: 'sarah chen',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'san francisco, ca'
      },
      points: 2847,
      projects: 12,
      votes: 1456,
      badges: 8,
      streak: 6,
      specialBadges: ['🏆 grand prize winner', '🔥 weekend warrior', '⭐ community champion']
    },
    {
      rank: 2,
      user: {
        id: '2',
        name: 'alex kumar',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'london, uk'
      },
      points: 2634,
      projects: 15,
      votes: 1289,
      badges: 7,
      streak: 4,
      specialBadges: ['🚀 innovation master', '🤝 team player', '💡 creative genius']
    },
    {
      rank: 3,
      user: {
        id: '3',
        name: 'jamie rodriguez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'barcelona, spain'
      },
      points: 2456,
      projects: 11,
      votes: 1178,
      badges: 6,
      streak: 8,
      specialBadges: ['🎨 design excellence', '🔥 streak master', '🌟 rising star']
    },
    {
      rank: 4,
      user: {
        id: '4',
        name: 'emma thompson',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'toronto, canada'
      },
      points: 2234,
      projects: 9,
      votes: 1045,
      badges: 5,
      streak: 3,
      specialBadges: ['🌱 sustainability champion', '📱 mobile expert']
    },
    {
      rank: 5,
      user: {
        id: '5',
        name: 'david lee',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
        location: 'seoul, south korea'
      },
      points: 2156,
      projects: 13,
      votes: 967,
      badges: 6,
      streak: 2,
      specialBadges: ['⚡ speed builder', '🤖 ai specialist']
    }
  ];

  const projectLeaderboard = [
    {
      rank: 1,
      project: {
        title: 'ai recipe generator',
        creator: 'sarah chen',
        image: 'https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 156,
      views: 2100,
      comments: 34
    },
    {
      rank: 2,
      project: {
        title: 'smart study planner',
        creator: 'alex kumar',
        image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 127,
      views: 1240,
      comments: 23
    },
    {
      rank: 3,
      project: {
        title: 'mood music matcher',
        creator: 'jamie rodriguez',
        image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      votes: 93,
      views: 890,
      comments: 15
    }
  ];

  const eventLeaderboard = [
    {
      rank: 1,
      event: 'ai-powered solutions weekend',
      winner: {
        name: 'sarah chen',
        project: 'ai recipe generator',
        prize: '$5,000'
      },
      participants: 847,
      projects: 156
    },
    {
      rank: 2,
      event: 'web3 & blockchain builder weekend',
      winner: {
        name: 'alex chen',
        project: 'defi portfolio tracker',
        prize: '$6,000'
      },
      participants: 423,
      projects: 89
    },
    {
      rank: 3,
      event: 'startup mvp weekend',
      winner: {
        name: 'emma wilson',
        project: 'eco delivery app',
        prize: '$3,000'
      },
      participants: 234,
      projects: 67
    }
  ];

  const periods = [
    { id: 'all-time', label: 'all time' },
    { id: 'this-year', label: 'this year' },
    { id: 'this-month', label: 'this month' },
    { id: 'this-week', label: 'this week' }
  ];

  const categories = [
    { id: 'overall', label: 'overall ranking', icon: Trophy, description: 'top builders by total points' },
    { id: 'projects', label: 'project ranking', icon: Code2, description: 'most voted projects' },
    { id: 'events', label: 'event winners', icon: Crown, description: 'competition champions' },
    { id: 'streak', label: 'streak masters', icon: TrendingUp, description: 'longest building streaks' }
  ];

  const getCurrentData = () => {
    switch (selectedCategory) {
      case 'projects':
        return projectLeaderboard;
      case 'events':
        return eventLeaderboard;
      case 'streak':
        return [...overallLeaderboard].sort((a, b) => b.streak - a.streak);
      default:
        return overallLeaderboard;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Award className="w-8 h-8 text-amber-600" />;
      default: return <span className="text-2xl font-bold text-accent-400">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 2: return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3: return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      default: return 'from-dark-800 to-dark-900 border-dark-700';
    }
  };

  const getRankHighlight = (rank: number) => {
    if (rank === 1) return 'border-4 border-yellow-400 shadow-xl';
    if (rank === 2) return 'border-4 border-gray-300 shadow-lg';
    if (rank === 3) return 'border-4 border-amber-700 shadow-md';
    return '';
  };

  const renderLeaderboardItem = (entry: LeaderboardEntry) => {
    if (selectedCategory === 'projects' && 'project' in entry) {
      return (
        <GlassyCard className={`hover:scale-105 transition-all duration-300 ${getRankColor(entry.rank)}`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-16 h-16">
                {getRankIcon(entry.rank)}
              </div>
              
              <img
                src={entry.project.image}
                alt={entry.project.title}
                className="w-16 h-16 rounded-lg object-cover border-2 border-accent-600"
              />
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {entry.project.title}
                </h3>
                <p className="text-light-400 text-sm mb-2">
                  by {entry.project.creator}
                </p>
                <div className="flex items-center space-x-4 text-sm text-light-400">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span><AnimatedCounter value={entry.votes} /></span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span><AnimatedCounter value={entry.views} /></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassyCard>
      );
    }

    if (selectedCategory === 'events' && 'event' in entry) {
      return (
        <GlassyCard className={`hover:scale-105 transition-all duration-300 ${getRankColor(entry.rank)}`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-16 h-16">
                {getRankIcon(entry.rank)}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {entry.event}
                </h3>
                <p className="text-light-400 text-sm mb-2">
                  winner: {entry.winner.name} - {entry.winner.project}
                </p>
                <div className="flex items-center space-x-4 text-sm text-light-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span><AnimatedCounter value={entry.participants} /></span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Code2 className="w-4 h-4 text-green-500" />
                    <span><AnimatedCounter value={entry.projects} /></span>
                  </span>
                </div>
              </div>
            </div>
            
            <Badge variant="warning" size="lg">
              {entry.winner.prize}
            </Badge>
          </div>
        </GlassyCard>
      );
    }

    // Default: Overall/Streak leaderboard
    if ('user' in entry) {
      return (
        <GlassyCard className={`hover:scale-105 transition-all duration-300 ${getRankColor(entry.rank)} ${getRankHighlight(entry.rank)}`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-16 h-16">
                {getRankIcon(entry.rank)}
              </div>
              
              <img
                src={entry.user.avatar}
                alt={entry.user.name}
                className="w-16 h-16 rounded-full border-2 border-accent-600"
              />
              
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {entry.user.name}
                </h3>
                <p className="text-light-400 text-sm mb-2">
                  {entry.user.location}
                </p>
                <div className="flex flex-wrap gap-1">
                  {entry.specialBadges.slice(0, 2).map((badge: string, badgeIndex: number) => (
                    <PillChip key={badgeIndex}>{badge}</PillChip>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={entry.points} />
                </div>
                <div className="text-sm text-light-400">points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={entry.projects} />
                </div>
                <div className="text-sm text-light-400">projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={entry.votes} />
                </div>
                <div className="text-sm text-light-400">votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={entry.badges} />
                </div>
                <div className="text-sm text-light-400">badges</div>
              </div>
            </div>
          </div>
        </GlassyCard>
      );
    }

    return null;
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
              <Trophy className="w-4 h-4 mr-2" />
              leaderboard
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              top weekend builders
            </h1>
            <p className="text-xl text-light-300 max-w-2xl mx-auto">
              celebrate the most active and successful builders in our community
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12 space-y-8"
        >
          {/* Category Filter */}
          <GlassyCard className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent-400" />
                leaderboard category:
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex flex-col items-center space-y-3 p-6 rounded-xl font-semibold transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-accent-600 text-white shadow-lg'
                          : 'bg-white/10 backdrop-blur text-light-300 border border-accent-400/20 hover:border-accent-600 hover:text-accent-400'
                      }`}
                    >
                      <Icon className="w-8 h-8" />
                      <div className="text-center">
                        <div className="font-bold">{category.label}</div>
                        <div className="text-xs opacity-80 mt-1">{category.description}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </GlassyCard>

          {/* Period Filter */}
          <GlassyCard className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent-400" />
                  time period:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {periods.map(period => (
                    <motion.button
                      key={period.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        selectedPeriod === period.id
                          ? 'bg-accent-600 text-white shadow-lg'
                          : 'bg-white/10 backdrop-blur text-light-300 border border-accent-400/20 hover:border-accent-600 hover:text-accent-400'
                      }`}
                    >
                      {period.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </GlassyCard>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {getCurrentData().slice(0, 3).map((_, index) => {
              const positions = [1, 0, 2]; // 2nd, 1st, 3rd for visual arrangement
              const actualIndex = positions[index];
              const actualEntry = getCurrentData()[actualIndex];
              
              return (
                <motion.div
                  key={actualEntry.rank || actualIndex}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`order-${index + 1} ${actualIndex === 0 ? 'md:-mt-8' : ''}`}
                >
                  <GlassyCard className={`text-center p-8 h-full ${actualIndex === 0 ? 'shadow-2xl' : ''} ${getRankColor(actualEntry.rank || actualIndex + 1)}`} glow={actualIndex === 0}>
                    <div className="flex justify-center mb-4">
                      {getRankIcon(actualEntry.rank || actualIndex + 1)}
                    </div>
                    
                    {selectedCategory === 'projects' && 'project' in actualEntry ? (
                      <>
                        <img
                          src={actualEntry.project.image}
                          alt={actualEntry.project.title}
                          className={`${actualIndex === 0 ? 'w-24 h-24' : 'w-20 h-20'} rounded-lg mx-auto mb-4 border-4 ${
                            actualIndex === 0 ? 'border-yellow-500' : 
                            actualIndex === 1 ? 'border-gray-400' : 'border-amber-600'
                          }`}
                        />
                        <h3 className={`${actualIndex === 0 ? 'text-2xl' : 'text-xl'} font-bold text-white mb-2`}>
                          {actualEntry.project.title}
                        </h3>
                        <p className="text-light-400 text-sm mb-4">
                          by {actualEntry.project.creator}
                        </p>
                      </>
                    ) : selectedCategory === 'events' && 'event' in actualEntry ? (
                      <>
                        <div className={`${actualIndex === 0 ? 'w-24 h-24' : 'w-20 h-20'} bg-gradient-to-br from-accent-500 to-accent-700 rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                          <Crown className={`${actualIndex === 0 ? 'w-12 h-12' : 'w-10 h-10'} text-white`} />
                        </div>
                        <h3 className={`${actualIndex === 0 ? 'text-2xl' : 'text-xl'} font-bold text-white mb-2`}>
                          {actualEntry.event}
                        </h3>
                        <p className="text-light-400 text-sm mb-4">
                          {actualEntry.winner.name}
                        </p>
                      </>
                    ) : 'user' in actualEntry ? (
                      <>
                        <img
                          src={actualEntry.user.avatar}
                          alt={actualEntry.user.name}
                          className={`${actualIndex === 0 ? 'w-24 h-24' : 'w-20 h-20'} rounded-full mx-auto mb-4 border-4 ${
                            actualIndex === 0 ? 'border-yellow-500' : 
                            actualIndex === 1 ? 'border-gray-400' : 'border-amber-600'
                          }`}
                        />
                        <h3 className={`${actualIndex === 0 ? 'text-2xl' : 'text-xl'} font-bold text-white mb-2`}>
                          {actualEntry.user.name}
                        </h3>
                        <p className="text-light-400 text-sm mb-4">
                          {actualEntry.user.location}
                        </p>
                      </>
                    ) : null}
                    
                    <div className={`${actualIndex === 0 ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2`}>
                      {selectedCategory === 'streak' && 'streak' in actualEntry ? <AnimatedCounter value={actualEntry.streak} /> : 
                       selectedCategory === 'projects' && 'votes' in actualEntry ? <AnimatedCounter value={actualEntry.votes} /> :
                       selectedCategory === 'events' && 'participants' in actualEntry ? <AnimatedCounter value={actualEntry.participants} /> :
                       'points' in actualEntry ? <AnimatedCounter value={actualEntry.points} /> : 0}
                    </div>
                    <p className="text-light-400 text-sm mb-4">
                      {selectedCategory === 'streak' ? 'weeks' : 
                       selectedCategory === 'projects' ? 'votes' :
                       selectedCategory === 'events' ? 'participants' :
                       'points'}
                    </p>
                    
                    {actualIndex === 0 && (
                      <Badge variant="warning" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        champion
                      </Badge>
                    )}
                  </GlassyCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Users className="w-6 h-6 mr-2 text-accent-400" />
            full rankings
          </h2>
          
          {getCurrentData().map((entry, index) => (
            <motion.div
              key={entry.rank || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {renderLeaderboardItem(entry)}
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <GlassyCard className="max-w-2xl mx-auto p-12">
            <Trophy className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              ready to climb the leaderboard?
            </h3>
            <p className="text-light-300 mb-8 leading-relaxed">
              join weekend events, build amazing projects, and earn your place among the top builders!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" glow>
                <Code2 className="w-5 h-5 mr-2" />
                start building
              </Button>
              <Button variant="outline" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                join next event
              </Button>
            </div>
          </GlassyCard>
        </motion.div>
      </div>
    </div>
  );
}