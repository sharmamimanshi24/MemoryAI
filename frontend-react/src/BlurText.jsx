import { useRef, useEffect, useState } from "react"

export default function BlurText({ text, delay = 200, animateBy = "words", direction = "top", onAnimationComplete, className = "", style = {} }) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")
  const [visibleCount, setVisibleCount] = useState(0)
  const timeouts = useRef([])

  useEffect(() => {
    setVisibleCount(0)
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    elements.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === elements.length - 1 && onAnimationComplete) {
          onAnimationComplete()
        }
      }, i * delay)
      timeouts.current.push(t)
    })
    return () => timeouts.current.forEach(clearTimeout)
  }, [text])

  const fromY = direction === "top" ? "-20px" : "20px"

  return (
    <span className={className} style={{ display: "inline", ...style }}>
      {elements.map((el, i) => (
        <span key={i} style={{
          display: "inline-block",
          opacity: i < visibleCount ? 1 : 0,
          filter: i < visibleCount ? "blur(0px)" : "blur(10px)",
          transform: i < visibleCount ? "translateY(0)" : `translateY(${fromY})`,
          transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
          marginRight: animateBy === "words" ? "0.25em" : "0"
        }}>
          {el}
        </span>
      ))}
    </span>
  )
}
