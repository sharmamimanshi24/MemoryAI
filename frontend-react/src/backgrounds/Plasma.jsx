import { useEffect, useRef } from "react"
export default function Plasma({ dark = true }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let t = 0, animId
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      for (let x = 0; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          const v1 = Math.sin(x * 0.01 + t)
          const v2 = Math.sin(y * 0.01 + t * 0.8)
          const v3 = Math.sin((x + y) * 0.007 + t * 1.2)
          const v4 = Math.sin(Math.sqrt(x * x + y * y) * 0.008 + t)
          const v = (v1 + v2 + v3 + v4) / 4
          const r = dark ? Math.floor((Math.sin(v * Math.PI) + 1) * 60) : Math.floor((Math.sin(v * Math.PI) + 1) * 120 + 100)
          const g = dark ? Math.floor((Math.sin(v * Math.PI + 2) + 1) * 40) : Math.floor((Math.sin(v * Math.PI + 2) + 1) * 80 + 80)
          const b = dark ? Math.floor((Math.cos(v * Math.PI) + 1) * 100) : Math.floor((Math.cos(v * Math.PI) + 1) * 120 + 100)
          for (let dx = 0; dx < 2; dx++) {
            for (let dy = 0; dy < 2; dy++) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4
              data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = 255
            }
          }
        }
      }
      ctx.putImageData(imageData, 0, 0)
      t += 0.02
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [dark])
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
}
