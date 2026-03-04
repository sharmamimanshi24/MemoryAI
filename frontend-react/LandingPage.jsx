import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Mail, Linkedin } from 'lucide-react';

// Assuming these components exist in the same directory
import SplitText from './SplitText'; 
import MagicBento from './MagicBento';
// import Aurora from './Aurora'; // You can uncomment this if you have the Aurora component

const LandingPage = () => {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const navigate = useNavigate();

  const features = [
    { icon: "∞", title: "Cross-Session Memory", desc: "Your context never resets. It remembers projects and decisions permanently." },
    { icon: "💻", title: "Developer First", desc: "Optimized for code. Beautiful syntax highlighting with one-click copy-paste." },
    { icon: "⌗", title: "Semantic Retrieval", desc: "Find past conversations by meaning. It understands what you meant, not just typed." },
    { icon: "✦", title: "Thought of the Day", desc: "Start every day with fresh inspiration and technical insights fetched live." },
    { icon: "◒", title: "10 Minimal Themes", desc: "A clean interface with 10 dark and light themes to fit your workflow." },
    { icon: "⌬", title: "Cloud Integration", desc: "Built on Vertex AI for high-speed, secure, and accurate intelligence." }
  ];

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    // Using Tailwind CSS classes for styling
    <div 
      style={{fontFamily: "'Inter', sans-serif"}}
      className={`min-h-screen overflow-y-auto transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-[#050008] text-white'}`}
    >
      {/* Optional: Aurora Background - you might want to adjust colors or opacity for a light theme */}
      {theme === 'dark' && (
        <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
          {/* Assuming you have an Aurora component */}
          {/* <Aurora colorStops={["#B19EEF", "#5227FF", "#f04ceb"]} /> */}
        </div>
      )}

      <div className="relative z-10">
        {/* --- NAV --- */}
        <nav className={`py-5 px-[5%] flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50/80 border-gray-200/80' : 'bg-[rgba(5,0,8,0.8)] border-white/10'}`}>
          <div className="cursor-pointer">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Memory AI
            </h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white'}`}>
              <Github size={20} />
            </a>
            <a href="mailto:your-email@gmail.com" aria-label="Gmail" className={`transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white'}`}>
              <Mail size={20} />
            </a>
            <span 
              className={`text-sm cursor-pointer transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-900' : 'text-white/60 hover:text-white'}`}
              onClick={() => {
                const featuresSection = document.getElementById('features');
                if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
              }}
            >Features</span>
            <button onClick={toggleTheme} className={`text-2xl transition-transform duration-300 hover:scale-110 ${theme === 'light' ? 'text-gray-600' : 'text-yellow-300'}`}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chat")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 border-none rounded-full py-2.5 px-6 text-white font-semibold cursor-pointer text-sm"
            >
              Launch App →
            </motion.button>
          </div>
        </nav>

        {/* --- HERO --- */}
        <section className="text-center py-20 px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className={`inline-block border rounded-full py-1.5 px-4 text-xs mb-8 tracking-widest font-semibold transition-colors duration-300 ${theme === 'light' ? 'bg-purple-100 border-purple-200 text-purple-600' : 'bg-purple-400/10 border-purple-400/20 text-purple-400'}`}>
              ✦ POWERED BY GOOGLE CLOUD
            </div>
          </motion.div>

          <SplitText
            text="MemoryAI"
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
            delay={50}
            from={{ opacity: 0, y: 40 }}
          />

          <h2 className={`text-xl md:text-2xl lg:text-3xl font-medium mt-4 mb-10 transition-colors duration-300 ${theme === 'light' ? 'text-gray-600' : 'text-white/70'}`}>
            An agent that actually knows you.
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-lg leading-relaxed max-w-xl mx-auto mb-12 transition-colors duration-300 ${theme === 'light' ? 'text-gray-500' : 'text-white/50'}`}
          >
            A persistent assistant that remembers your context, your code, and your preferences across every session.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/chat")}
            className={`border-none rounded-xl py-4 px-12 font-bold cursor-pointer text-lg transition-colors duration-300 ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
          >
            Get Started
          </motion.button>
        </section>

        {/* --- FEATURES BENTO GRID --- */}
        <section id="features" className="max-w-5xl mx-auto p-6 pb-24">
          <MagicBento
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            enableStars
            enableSpotlight
            enableBorderGlow
            spotlightRadius={400}
            glowColor="132, 0, 255"
          >
            {features.map((feature, i) => (
              <div key={i} className={`rounded-2xl p-6 transition-colors duration-300 ${theme === 'light' ? 'bg-white/50 border border-gray-200/80' : 'bg-transparent border-none'}`}>
                <div className="text-3xl text-purple-400 mb-5">{feature.icon}</div>
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{feature.title}</h3>
                <p className={`leading-relaxed transition-colors duration-300 ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>{feature.desc}</p>
              </div>
            ))}
          </MagicBento>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;