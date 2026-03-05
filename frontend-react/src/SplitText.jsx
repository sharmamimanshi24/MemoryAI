import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

const SplitText = ({
  text,
  className,
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign = 'left',
  onLetterAnimationComplete,
  showCallback = false,
}) => {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [threshold])

  useEffect(() => {
    if (inView && containerRef.current) {
      gsap.to(containerRef.current.children, {
        ...to, duration, ease,
        stagger: delay / 1000,
        onComplete: () => {
          if (showCallback && onLetterAnimationComplete) onLetterAnimationComplete()
        },
      })
    }
  }, [inView, to, duration, ease, delay, showCallback, onLetterAnimationComplete])

  const letters = text.split('').map((char, index) => (
    <span key={index} style={{ display: 'inline-block', opacity: from.opacity, transform: `translateY(${from.y}px)` }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))

  return (
    <div ref={wrapperRef}>
      <div ref={containerRef} className={className} style={{ textAlign }}>
        {letters}
      </div>
    </div>
  )
}

export default SplitText
