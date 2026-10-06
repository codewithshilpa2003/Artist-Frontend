import { useEffect, useRef } from 'react'

function CanvasBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let frameId
    let width = 0
    let height = 0
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
    let particles = []

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      particles = Array.from({ length: Math.min(90, Math.floor(width / 14)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.8,
        speed: 0.06 + Math.random() * 0.28,
        alpha: 0.08 + Math.random() * 0.3,
        hue: Math.random() < 0.75 ? 45 : 150,
      }))
    }

    const drawPolygon = (x, y, radius, rotation, sides, color, lineWidth) => {
      context.save()
      context.translate(x, y)
      context.rotate(rotation)
      context.strokeStyle = color
      context.lineWidth = lineWidth
      context.beginPath()
      for (let point = 0; point <= sides; point += 1) {
        const angle = (point / sides) * Math.PI * 2
        const pointX = Math.cos(angle) * radius
        const pointY = Math.sin(angle) * radius
        if (point === 0) context.moveTo(pointX, pointY)
        else context.lineTo(pointX, pointY)
      }
      context.stroke()
      context.restore()
    }

    const startTime = performance.now()
    const draw = (now) => {
      const time = (now - startTime) / 1000
      const gradient = context.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#050914')
      gradient.addColorStop(0.55, '#070d1f')
      gradient.addColorStop(1, '#050914')
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.strokeStyle = 'rgba(120,140,200,0.045)'
      context.lineWidth = 1
      const gridSize = 56
      context.beginPath()
      for (let x = (time * 4) % gridSize; x < width; x += gridSize) {
        context.moveTo(x, 0)
        context.lineTo(x, height)
      }
      for (let y = 0; y < height; y += gridSize) {
        context.moveTo(0, y)
        context.lineTo(width, y)
      }
      context.stroke()

      const centerX = width * 0.5
      const centerY = height * 0.32
      const shortestSide = Math.min(width, height)
      drawPolygon(centerX, centerY, shortestSide * 0.42, time * 0.03, 12, 'rgba(212,175,55,0.10)', 1.2)
      drawPolygon(centerX, centerY, shortestSide * 0.34, -time * 0.045, 8, 'rgba(212,175,55,0.08)', 1)
      drawPolygon(centerX, centerY, shortestSide * 0.26, time * 0.06, 3, 'rgba(212,175,55,0.07)', 1)
      drawPolygon(centerX, centerY, shortestSide * 0.16, -time * 0.09, 6, 'rgba(0,230,118,0.06)', 1)
      drawPolygon(width * 0.88, height * 0.85, shortestSide * 0.22, time * 0.05, 10, 'rgba(212,175,55,0.07)', 1)
      drawPolygon(width * 0.88, height * 0.85, shortestSide * 0.14, -time * 0.07, 5, 'rgba(212,175,55,0.06)', 1)

      particles.forEach((particle) => {
        particle.y -= particle.speed
        particle.x += Math.sin(time * 0.6 + particle.y * 0.01) * 0.12
        if (particle.y < -4) {
          particle.y = height + 4
          particle.x = Math.random() * width
        }
        const opacity = 0.55 + 0.45 * Math.sin(time * 2 + particle.x * 0.02)
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = particle.hue === 45
          ? `rgba(212,175,55,${(particle.alpha * opacity).toFixed(3)})`
          : `rgba(0,230,118,${(particle.alpha * opacity * 0.8).toFixed(3)})`
        context.fill()
      })

      frameId = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    frameId = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />
}

export default CanvasBackground
