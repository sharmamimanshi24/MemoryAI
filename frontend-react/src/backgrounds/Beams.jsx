import { useEffect, useRef } from "react"
export default function Beams({ color = "#a78bfa", dark = true }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const beams = Array.from({ length: 8 }, (_, i) => ({ angle: (i / 8) * Math.PI * 2, speed: 0.001 + Math.random() * 0.002, width: 30 + Math.random() * 60 }))
    const draw = () => {
      ctx.fillStyle = dark ? "#040010" : "#f0f4ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2, cy = canvas.height / 2
      beams.forEach(b => {
        b.angle += b.speed
        const x1 = cx + Math.cos(b.angle) * canvas.width
        const y1 = cy + Math.sin(b.angle) * canvas.height
        const grad = ctx.createLinearGradient(cx, cy, x1, y1)
        grad.addColorStop(0, color + "00")
        grad.addColorStop(0.3, color + (dark ? "25" : "18"))
        grad.addColorStop(1, color + "00")
        ctx.beginPath()
        const perpX = Math.cos(b.angle + Math.PI / 2) * b.width
        const perpY = Math.sin(b.angle + Math.PI / 2) * b.width
        ctx.moveTo(cx - perpX, cy - perpY)
        ctx.lineTo(cx + perpX, cy + perpY)
        ctx.lineTo(x1 + perpX, y1 + perpY)
        ctx.lineTo(x1 - perpX, y1 - perpY)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
