import { useEffect, useRef, useState } from 'react'

export function useInViewport<T extends HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null)
  const optionsRef = useRef(options)
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px', ...optionsRef.current },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, inView }
}