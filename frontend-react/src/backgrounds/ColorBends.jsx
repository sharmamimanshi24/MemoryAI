import { useEffect, useRef } from "react"
export default function ColorBends({ dark = true, colors = ["#7c3aed","#ec4899","#3b82f6","#34d399","#f59e0b"] }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const bends = colors.map((c, i) => ({
      color: c,
      angle: (i / colors.length) * Math.PI * 2,
      radius: 0.3 + Math.random() * 0.3,
      speed: 0.002 + Math.random() * 0.002,
      phase: i * Math.PI * 0.4
    }))
    const draw = () => {
      ctx.fillStyle = dark ? "#040008" : "#fafafa"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2, cy = canvas.height / 2
      bends.forEach(b => {
        b.angle += b.speed
        const x = cx + Math.cos(b.angle + Math.sin(t * 0.001 + b.phase) * 0.5) * b.radius * canvas.width * 0.5
        const y = cy + Math.sin(b.angle + Math.cos(t * 0.0008 + b.phase) * 0.5) * b.radius * canvas.height * 0.5
        // Bent gradient strip
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 40
          const bx = x + Math.cos(b.angle + Math.PI / 2) * offset
          const by = y + Math.sin(b.angle + Math.PI / 2) * offset
          const r = (0.25 + i * 0.05) * Math.min(canvas.width, canvas.height)
          const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r)
          grad.addColorStop(0, b.color + (dark ? "60" : "40"))
          grad.addColorStop(0.4, b.color + (dark ? "25" : "18"))
          grad.addColorStop(1, "transparent")
          ctx.globalCompositeOperation = dark ? "screen" : "multiply"
          ctx.fillStyle = grad
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.globalCompositeOperation = "source-over"
        }
      })
      t += 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [dark])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
