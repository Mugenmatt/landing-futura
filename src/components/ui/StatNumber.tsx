import { useEffect, useState } from 'react'
import type { Stat } from '../../content/content'
import { useInViewport } from '../../hooks/useInViewport'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function StatNumber({ value, prefix, suffix, decimals }: Stat) {
  const { ref, inView } = useInViewport<HTMLSpanElement>()
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, value])

  const shown = reduced ? value : display

  return (
    <span className="stat-number" ref={ref}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export default StatNumber