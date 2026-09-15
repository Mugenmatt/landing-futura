import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useSmoothAnchors(): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [reduced])
}