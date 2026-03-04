import React from 'react';
import { Brain, Clock } from 'lucide-react';

const BrainClockIcon = ({ size = 32, color = "currentColor", strokeWidth = 2 }) => {
  const brainSize = size;
  const clockSize = size * 0.55;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Brain
        size={brainSize}
        color={color}
        strokeWidth={strokeWidth}
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.7 }}
      />
      <Clock size={clockSize} color="#c4b5fd" style={{ position: 'absolute', bottom: -1, right: -2, background: '#050008', padding: '2px', borderRadius: '50%' }} strokeWidth={2.5} />
    </div>
  );
};

export default BrainClockIcon;