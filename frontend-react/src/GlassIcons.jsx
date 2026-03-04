import React from 'react';
import { motion } from 'framer-motion';

const GlassIcons = ({ items, theme, colorful = true }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const glassStyle = {
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    border: `1px solid ${theme.bentoBorder}`,
    borderRadius: '24px',
    padding: '24px',
    textAlign: 'center',
    color: theme.text,
  };

  const iconColor = colorful ? 'white' : (theme.mode === 'dark' ? '#050008' : '#f8f7ff');

  return (
    <motion.div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        padding: '24px',
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          style={{
            ...glassStyle,
            background: colorful
              ? `linear-gradient(135deg, ${item.color}33, ${item.color}11)`
              : theme.bentoBg,
          }}
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5, boxShadow: `0 10px 20px rgba(0,0,0,0.1)` }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: colorful ? item.color : theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: iconColor,
          }}>
            {React.cloneElement(item.icon, { size: 32 })}
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
          <p style={{ color: theme.textTertiary, lineHeight: 1.7 }}>{item.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GlassIcons;