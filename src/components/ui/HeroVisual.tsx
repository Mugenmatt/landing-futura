import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function HeroVisual() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let ticking = false
    const onMove = (e: MouseEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height
        el.style.setProperty('--px', String(dx))
        el.style.setProperty('--py', String(dy))
        ticking = false
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <div className="hero-visual" ref={wrapRef} aria-hidden="true">
      <div className="hero-grid" />
      <div className="hero-visual-layer" data-depth="1.5">
        <svg className="hero-svg" viewBox="0 0 360 420">
          <g className="svg-construction">
            <line x1="120" y1="10" x2="120" y2="410" />
            <line x1="40" y1="385" x2="330" y2="385" />
          </g>
          <g className="svg-bones">
            <line x1="120" y1="70" x2="200" y2="210" />
            <line x1="200" y1="210" x2="150" y2="330" />
            <line x1="150" y1="330" x2="202" y2="386" />
          </g>
          <g className="svg-joints">
            <circle cx="120" cy="70" r="6" />
            <circle cx="120" cy="70" r="2" />
            <circle cx="200" cy="210" r="6" />
            <circle cx="200" cy="210" r="2" />
            <circle cx="150" cy="330" r="6" />
            <circle cx="150" cy="330" r="2" />
            <circle cx="202" cy="386" r="4" />
            <circle cx="202" cy="386" r="1.5" />
          </g>
        </svg>
      </div>
      <div className="hero-visual-layer" data-depth="2.5">
        <svg className="hero-crosshair" viewBox="0 0 80 80" aria-hidden="true">
          <line x1="40" y1="18" x2="40" y2="62" />
          <line x1="18" y1="40" x2="62" y2="40" />
          <circle cx="40" cy="40" r="16" />
        </svg>
      </div>
    </div>
  )
}

export default HeroVisual