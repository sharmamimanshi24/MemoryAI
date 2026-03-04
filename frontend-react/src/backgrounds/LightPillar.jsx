import { useEffect, useRef } from "react"
export default function LightPillar({ dark = true, colors = ["#a78bfa","#60a5fa","#f472b6","#34d399"] }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const pillars = colors.map((c, i) => ({
      color: c,
      x: (i + 0.5) / colors.length,
      width: 0.04 + Math.random() * 0.03,
      speed: 0.003 + Math.random() * 0.002,
      phase: i * Math.PI / 2,
      brightness: 0.6 + Math.random() * 0.4
    }))
    const draw = () => {
      ctx.fillStyle = dark ? "#030008" : "#f8f4ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      pillars.forEach(p => {
        const x = (p.x + Math.sin(t * p.speed + p.phase) * 0.08) * canvas.width
        const w = p.width * canvas.width
        const grad = ctx.createLinearGradient(x, 0, x, canvas.height)
        const alpha = Math.floor(p.brightness * (dark ? 180 : 100)).toString(16).padStart(2, "0")
        const alphaLow = Math.floor(p.brightness * (dark ? 40 : 20)).toString(16).padStart(2, "0")
        grad.addColorStop(0, p.color + alphaLow)
        grad.addColorStop(0.2, p.color + alpha)
        grad.addColorStop(0.5, p.color + alpha)
        grad.addColorStop(0.8, p.color + alpha)
        grad.addColorStop(1, p.color + alphaLow)
        ctx.globalCompositeOperation = dark ? "screen" : "multiply"
        const pillarGrad = ctx.createLinearGradient(x - w, 0, x + w, 0)
        pillarGrad.addColorStop(0, "transparent")
        pillarGrad.addColorStop(0.5, p.color + alpha)
        pillarGrad.addColorStop(1, "transparent")
        ctx.fillStyle = pillarGrad
        ctx.fillRect(x - w, 0, w * 2, canvas.height)
        ctx.globalCompositeOperation = "source-over"
      })
      t += 1
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [dark])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
