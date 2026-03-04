import { useEffect, useRef } from "react"

function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } 
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function Aurora({ baseColor, speed = 0.5, amplitude = 1.0 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const defaultColors = ["#3B82F6", "#8B5CF6", "#EC4899"];
    let colorStops = defaultColors;
    if (baseColor) {
        const [h, s, l] = hexToHsl(baseColor);
        const c1 = hslToHex((h + 30) % 360, s, l);
        const c2 = hslToHex((h - 30 + 360) % 360, s, l);
        colorStops = [c1, baseColor, c2];
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#080010"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      colorStops.forEach((color, i) => {
        const x = canvas.width * (0.2 + 0.3 * i + 0.1 * Math.sin(t * speed + i * 2))
        const y = canvas.height * (0.3 + 0.2 * Math.cos(t * speed * 0.7 + i * 1.5)) * amplitude
        const r = canvas.width * 0.45

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, color + "aa")
        grad.addColorStop(1, "transparent")

        ctx.globalCompositeOperation = "screen"
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Color bends layer
      const bendGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bendGrad.addColorStop(0, "#3B82F610")
      bendGrad.addColorStop(0.5, "#8B5CF620")
      bendGrad.addColorStop(1, "#EC489910")
      ctx.globalCompositeOperation = "overlay"
      ctx.fillStyle = bendGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "source-over"
      t += 0.008
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [baseColor])

return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />}
