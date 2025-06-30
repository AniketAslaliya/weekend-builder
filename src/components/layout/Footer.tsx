import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Twitter, Heart, Code2, Zap, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Events', path: '/events' },
        { label: 'Projects', path: '/projects' },
        { label: 'AI Builder', path: '/ai-builder' },
        { label: 'Leaderboard', path: '/leaderboard' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Rules & Guidelines', path: '/rules' },
        { label: 'Help Center', path: '/help' },
        { label: 'Become a Mentor', path: '/mentors' },
        { label: 'Sponsor an Event', path: '/sponsors' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Code of Conduct', path: '/code-of-conduct' },
        { label: 'Contact Us', path: '/contact' },
      ]
    }
  ];

  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <footer className="bg-dark-950 text-light-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/50 to-dark-950"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-accent-600"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Code2 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <span className="font-bold text-2xl text-white">
                  Weekend Builder
                </span>
                <div className="text-sm text-light-400">Build. Create. Win.</div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-light-300 leading-relaxed max-w-md"
            >
              Turn every weekend into a global building festival. Join thousands of creators, build incredible projects, and celebrate your success together in the most exciting community on the planet.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4"
            >
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://github.com" 
                className="w-10 h-10 bg-dark-800 hover:bg-accent-600 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://twitter.com" 
                className="w-10 h-10 bg-dark-800 hover:bg-accent-600 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
              className="space-y-6"
            >
              <h3 className="font-bold text-lg text-white flex items-center">
                {section.title === 'Product' && <Zap className="w-4 h-4 mr-2 text-accent-400" />}
                {section.title === 'Community' && <Star className="w-4 h-4 mr-2 text-accent-400" />}
                {section.title === 'Legal' && <Heart className="w-4 h-4 mr-2 text-accent-400" />}
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * linkIndex }}
                  >
                    <Link 
                      to={link.path} 
                      className="text-light-400 hover:text-accent-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-dark-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-light-400 text-sm flex items-center">
            © 2025 Weekend Builder. Made with <Heart className="w-4 h-4 inline text-red-500 mx-1 animate-pulse" /> for builders everywhere.
          </p>
          <div className="flex items-center space-x-6 text-sm text-light-400">
            <span className="flex items-center">
              <Code2 className="w-4 h-4 mr-1 text-accent-400" />
              Empowering creators worldwide
            </span>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col items-center">
          <Button variant="primary" size="lg" glow onClick={() => setShowContactModal(true)}>
            Sponsor or Contact Us
          </Button>
          <p className="text-light-400 mt-2">Email: <a href="mailto:aniketaslaliya@gmail.com" className="underline hover:text-accent-400">aniketaslaliya@gmail.com</a></p>
        </div>

        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-dark-900 rounded-xl p-8 max-w-md w-full relative">
              <button className="absolute top-4 right-4 text-light-400 hover:text-accent-400" onClick={() => setShowContactModal(false)}>
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-accent-400" />
                Contact & Sponsorship
              </h2>
              <form className="space-y-4">
                <Input placeholder="Your Name" className="bg-white text-primary" />
                <Input placeholder="Your Email" className="bg-white text-primary" />
                <textarea placeholder="Message or sponsorship inquiry..." className="w-full p-3 rounded-lg bg-white text-primary min-h-[100px]" />
                <Button variant="primary" type="submit" className="w-full">Send</Button>
              </form>
              <p className="text-xs text-light-400 mt-4">Or email us directly at <a href="mailto:aniketaslaliya@gmail.com" className="underline hover:text-accent-400">aniketaslaliya@gmail.com</a></p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}