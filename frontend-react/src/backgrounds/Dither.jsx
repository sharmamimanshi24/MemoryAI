import { useEffect, useRef } from "react"
export default function Dither({ dark = true, color = "#7c3aed" }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const SCALE = 6
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const hexToRgb = hex => {
      const r = parseInt(hex.slice(1,3),16)
      const g = parseInt(hex.slice(3,5),16)
      const b = parseInt(hex.slice(5,7),16)
      return {r,g,b}
    }
    const rgb = hexToRgb(color)
    const draw = () => {
      const cols = Math.ceil(canvas.width / SCALE)
      const rows = Math.ceil(canvas.height / SCALE)
      const bg = dark ? 0 : 255
      ctx.fillStyle = dark ? "#050010" : "#f8f8ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = col / cols, ny = row / rows
          const wave = Math.sin(nx * 8 + t) * Math.cos(ny * 6 + t * 0.7) * 0.5 + 0.5
          const noise = Math.sin(nx * 20 + ny * 15 + t * 2) * 0.15
          const val = Math.max(0, Math.min(1, wave + noise))
          const threshold = (((col + row * 4) % 16) / 16)
          if (val > threshold) {
            const alpha = dark ? 0.8 : 0.5
            ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
            ctx.fillRect(col * SCALE, row * SCALE, SCALE - 1, SCALE - 1)
          }
        }
      }
      t += 0.015
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [dark, color])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
