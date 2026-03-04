import { useEffect, useRef } from "react"
export default function DotGrid({ color = "#6366f1", dark = false }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const mouse = { x: 0, y: 0 }
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY })
    const SPACING = 30
    const draw = () => {
      ctx.fillStyle = dark ? "#060010" : "#f8faff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          const dx = mouse.x - x, dy = mouse.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const wave = Math.sin(dist * 0.02 - t) * 0.5 + 0.5
          const r = 1.5 + wave * 3
          const alpha = 0.2 + wave * (dark ? 0.6 : 0.4)
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, "0")
          ctx.fill()
        }
      }
      t += 0.05
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
