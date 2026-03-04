import SplitText from "./SplitText";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BlurText from "./BlurText";
import Aurora from "./Aurora";
import { Github, Linkedin, Mail, Code, Search, Sparkles, Settings, Cloud, Sun, Moon } from "lucide-react";
import BrainClockIcon from "./BrainClockIcon";
import GlassIcons from "./GlassIcons";

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState('dark');
  const [hoveredLink, setHoveredLink] = React.useState(null);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const themes = {
    dark: {
      background: "#050008",
      text: "white",
      textSecondary: "rgba(255,255,255,0.7)",
      textTertiary: "rgba(255,255,255,0.45)",
      accent: "#a78bfa",
      navBg: "rgba(5,0,8,0.6)",
      bentoBg: "rgba(255,255,255,0.02)",
      bentoBorder: "rgba(255,255,255,0.08)",
      navBorder: "rgba(177,158,239,0.15)",
    },
    light: {
      background: "#f8f7ff",
      text: "#1e1b4b",
      textSecondary: "rgba(30, 27, 75, 0.7)",
      textTertiary: "rgba(30, 27, 75, 0.55)",
      accent: "#6d28d9",
      navBg: "rgba(248, 247, 255, 0.6)",
      bentoBg: "rgba(0,0,0,0.02)",
      bentoBorder: "rgba(0,0,0,0.08)",
      navBorder: "rgba(30, 27, 75, 0.1)",
    }
  };

  const currentTheme = themes[theme];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ 
      background: currentTheme.background, 
      color: currentTheme.text, 
      fontFamily: "'Stritch', 'Inter', sans-serif", 
      width: "100%",
      position: "fixed",
      height: "100vh",
      display: "block", 
      overflowY: "auto",
      overflowX: "hidden"
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.5, pointerEvents: "none" }}>
        <Aurora />
      </div>
      
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── NAV ── */}
        <nav style={{ padding: "20px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, background: currentTheme.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${currentTheme.navBorder}` }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Features', 'Tech Stack', 'Connect'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', ''))}
                style={{
                  background: `rgba(${theme === 'dark' ? '167,139,250' : '109,40,217'},0.1)`,
                  border: `1px solid rgba(${theme === 'dark' ? '167,139,250' : '109,40,217'},0.2)`,
                  borderRadius: "20px",
                  padding: "8px 20px",
                  color: currentTheme.accent,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '1px'
                }}
              >
                {item}
              </motion.button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: currentTheme.text }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/chat")} style={{ background: theme === 'dark' ? "#fff" : "#1e1b4b", border: "none", borderRadius: "12px", padding: "10px 24px", color: theme === 'dark' ? "#000" : "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}>
              Get Started
            </motion.button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ textAlign: "center", padding: "120px 24px 80px", maxWidth: "900px", margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: "inline-block", background: `rgba(${theme === 'dark' ? '167,139,250' : '109,40,217'},0.1)`, border: `1px solid rgba(${theme === 'dark' ? '167,139,250' : '109,40,217'},0.2)`, borderRadius: "20px", padding: "6px 16px", fontSize: "0.7rem", color: currentTheme.accent, marginBottom: "32px", letterSpacing: "2px" }}>
              ✦ POWERED BY GOOGLE CLOUD
            </div>
          </motion.div>
          <h1 style={{ fontSize: "clamp(3.5rem,10vw,7rem)", fontWeight: 900, lineHeight: 1.2, paddingBottom: "20px", margin: 0 }}>
            <SplitText text="MemoryAI" delay={50} duration={1.25} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} threshold={0.1} rootMargin="-100px" textAlign="center" style={{ color: currentTheme.text }} />
          </h1>
          <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", fontWeight: 500, margin: "10px 0 40px", paddingBottom: "10px" }}>
            <BlurText text="An agent that actually knows you." delay={300} direction="top" style={{ color: currentTheme.textSecondary }} />
          </h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ fontSize: "1.2rem", color: currentTheme.textTertiary, lineHeight: 1.8, maxWidth: "600px", margin: "30px auto 50px" }}>
            A persistent assistant that remembers your context, your code, and your preferences across every session.
          </motion.p>
        </section>

        {/* ── FEATURES GRID ── */}
        <section id="features" style={{ maxWidth: "1100px", margin: "0 auto 100px", padding: "0 24px" }}><div id="techstack" style={{ position: 'relative', top: '-80px' }}></div>
          <GlassIcons
            theme={currentTheme}
            colorful={false}
            items={[
              { icon: <BrainClockIcon />, title: "Cross-Session Memory", desc: "Your context never resets. It remembers projects and decisions permanently." },
              { icon: <Code />, title: "Developer First", desc: "Optimized for code. Beautiful syntax highlighting with one-click copy-paste." },
              { icon: <Search />, title: "Semantic Retrieval", desc: "Find past conversations by meaning. It understands what you meant, not just typed." },
              { icon: <Sparkles />, title: "Thought of the Day", desc: "Start every day with fresh inspiration and technical insights fetched live." },
              { icon: <Settings />, title: "Choose your own Theme", desc: "A clean interface with 10 dark and light themes to fit your workflow." },
              { icon: <Cloud />, title: "Cloud Integration", desc: "Built on Vertex AI for high-speed, secure, and accurate intelligence." }
            ]}
          />
        </section>

        {/* ── CONNECT ── */}
        <section id="connect" style={{ textAlign: "center", padding: "80px 24px" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, marginBottom: "40px", color: currentTheme.text }}>
            <BlurText text="Connect" delay={100} />
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
            <a href="https://github.com/sharmamimanshi24" target="_blank" rel="noopener noreferrer" style={{ color: currentTheme.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <Github size={22} /> 
            </a>
            <a href="https://www.linkedin.com/in/mimanshi-sharma/" target="_blank" rel="noopener noreferrer" style={{ color: currentTheme.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <Linkedin size={22} /> 
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=sharma.mimanshi24@gmail.com" style={{ color: currentTheme.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
              <Mail size={22} /> 
            </a>
          </div>
        </section>

        <footer style={{ textAlign: "center", padding: "60px 24px", color: currentTheme.textTertiary, fontSize: "0.8rem", borderTop: `1px solid ${currentTheme.bentoBorder}` }}>
          © {new Date().getFullYear()} Memory AI · Built by Mimanshi Sharma
          · Google Cloud Vertex AI
        </footer>

    </div>
  );
}
