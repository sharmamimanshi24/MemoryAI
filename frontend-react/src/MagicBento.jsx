import React, { useRef, useState, useEffect } from 'react';

const MagicBento = ({
  children,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = "132, 0, 255",
  disableAnimations = false,
  className = '',
  style = {},
}) => {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: -1, y: -1 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState([]);
  const [clickPosition, setClickPosition] = useState(null);

  useEffect(() => {
    if (enableStars && isHovering) {
      const rect = containerRef.current.getBoundingClientRect();
      setParticles(
        Array.from({ length: particleCount }, () => ({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        }))
      );
    }
  }, [isHovering, enableStars, particleCount]);

  const handleMouseMove = (e) => {
    if (disableAnimations) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (disableAnimations) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (disableAnimations) return;
    setIsHovering(false);
    setMouse({ x: -1, y: -1 });
  };

  const handleClick = (e) => {
    if (disableAnimations || !clickEffect) return;
    const rect = containerRef.current.getBoundingClientRect();
    setClickPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
  };

  const spotlightStyle = enableSpotlight && isHovering ? {
    background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, rgba(${glowColor}, 0.15), transparent ${spotlightRadius}px)`,
  } : {};

  const borderGlowStyle = enableBorderGlow && isHovering ? {
    '--mouse-x': `${mouse.x}px`,
    '--mouse-y': `${mouse.y}px`,
    '--glow-color': glowColor,
    animation: 'border-glow-anim 1.5s infinite linear',
  } : {};

  const tiltStyle = enableTilt && isHovering ? {
    transform: `perspective(1000px) rotateX(${(mouse.y / containerRef.current.offsetHeight - 0.5) * -10}deg) rotateY(${(mouse.x / containerRef.current.offsetWidth - 0.5) * 10}deg) scale3d(1.03, 1.03, 1.03)`,
    transition: 'transform 0.1s ease-out',
  } : {
    transition: 'transform 0.3s ease-in-out',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`magic-bento-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...tiltStyle,
        ...style,
      }}
    >
      {/* Border Glow Effect */}
      {enableBorderGlow && <div className="magic-bento-border-glow" style={borderGlowStyle} />}

      {/* Spotlight Effect */}
      <div className="magic-bento-spotlight" style={spotlightStyle} />

      {/* Stars Effect */}
      {enableStars && isHovering && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                background: `rgba(${glowColor}, ${p.opacity})`,
                borderRadius: '50%',
                boxShadow: `0 0 8px rgba(${glowColor}, ${p.opacity})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Click Effect */}
      {clickEffect && clickPosition && (
        <div
          key={clickPosition.id}
          className="magic-bento-click-effect"
          style={{
            '--click-x': `${clickPosition.x}px`,
            '--click-y': `${clickPosition.y}px`,
            '--glow-color': glowColor,
          }}
          onAnimationEnd={(e) => e.target.remove()}
        />
      )}

      {/* Content */}
      <div
        className="magic-bento-content"
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: textAutoHide && isHovering ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MagicBento;