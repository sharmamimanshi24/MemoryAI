import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { quotes } from './quotes';

export default function ThoughtOfDay({ t }) {
  const [dailyQuote, setDailyQuote] = useState({ quote: '', author: '' });

  useEffect(() => {
    // Calculate days since Unix epoch for a continuous daily cycle
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const quoteIndex = daysSinceEpoch % quotes.length;
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  return (
    <motion.div
      key="thought"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center', margin: 'auto', color: t.subtext, maxWidth: '500px' }}>
      <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: t.text, lineHeight: 1.6 }}>"{dailyQuote.quote}"</p>
      <p style={{ fontSize: '0.8rem', marginTop: '12px', fontWeight: 600, color: t.accent }}>— {dailyQuote.author}</p>
    </motion.div>
  );
}