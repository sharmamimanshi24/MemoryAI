import { useEffect, useRef } from "react"
export default function Silk({ color = "#7c3aed", dark = false }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      ctx.fillStyle = dark ? "#050008" : "#fff8ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let y = 0; y < canvas.height; y += 4) {
        const wave = Math.sin(y * 0.01 + t) * 80 + Math.cos(y * 0.02 + t * 0.7) * 40
        const alpha = (Math.sin(y * 0.005 + t * 0.5) + 1) / 2
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(canvas.width * 0.25, y + wave * 0.5, canvas.width * 0.75, y - wave * 0.5, canvas.width, y)
        ctx.strokeStyle = color + Math.floor(alpha * (dark ? 60 : 40)).toString(16).padStart(2, "0")
        ctx.lineWidth = 2
        ctx.stroke()
      }
      t += 0.005
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
