import { useEffect, useRef } from "react"
export default function Waves({ color1 = "#7c3aed", color2 = "#4f46e5", dark = true }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      ctx.fillStyle = dark ? "#050010" : "#f8f8ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin(x * 0.003 + t + i * 0.8) * (60 + i * 20) + Math.cos(x * 0.005 + t * 0.7) * 30
          ctx.lineTo(x, y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
        grad.addColorStop(0, color1 + (dark ? "40" : "30"))
        grad.addColorStop(1, color2 + (dark ? "40" : "30"))
        ctx.fillStyle = grad
        ctx.fill()
      }
      t += 0.01
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
