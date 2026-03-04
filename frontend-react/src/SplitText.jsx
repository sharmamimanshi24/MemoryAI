import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'

const SplitText = ({
  text,
  className,
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete,
  showCallback = false,
}) => {
  const containerRef = useRef(null)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && containerRef.current) {
      const elements = containerRef.current.children
      gsap.to(elements, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000, // GSAP stagger is in seconds
        onComplete: () => {
          if (showCallback && onLetterAnimationComplete) {
            onLetterAnimationComplete()
          }
        },
      })
    }
  }, [
    inView,
    to,
    duration,
    ease,
    delay,
    showCallback,
    onLetterAnimationComplete,
  ])

  const letters = text.split('').map((char, index) => {
    // Use a non-breaking space to prevent layout shifts for spaces
    const character = char === ' ' ? '\u00A0' : char
    return (
      <span
        key={index}
        style={{
          display: 'inline-block', // Necessary for transforms
          opacity: from.opacity,
          transform: `translateY(${from.y}px)`,
        }}
      >
        {character}
      </span>
    )
  })

  return (
    <div ref={ref}>
      <div ref={containerRef} className={className} style={{ textAlign }}>
        {letters}
      </div>
    </div>
  )
}

export default SplitText