import { useEffect, useRef } from "react"
export default function Orbs({ colors = ["#7c3aed","#ec4899","#3b82f6","#34d399"], dark = true }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const orbs = colors.map((c, i) => ({ color: c, x: Math.random(), y: Math.random(), phase: i * Math.PI / 2 }))
    const draw = () => {
      ctx.fillStyle = dark ? "#060010" : "#f5f0ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      orbs.forEach(orb => {
        const x = (orb.x + Math.sin(t * 0.001 + orb.phase) * 0.1) * canvas.width
        const y = (orb.y + Math.cos(t * 0.0008 + orb.phase) * 0.1) * canvas.height
        const r = 0.3 * Math.min(canvas.width, canvas.height)
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, orb.color + (dark ? "70" : "50"))
        grad.addColorStop(1, "transparent")
        ctx.globalCompositeOperation = "screen"
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalCompositeOperation = "source-over"
      })
      t += 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
