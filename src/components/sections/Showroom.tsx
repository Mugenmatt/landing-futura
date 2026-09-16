import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { showroom } from '../../content/content'
import type { ShowroomItem } from '../../content/content'
import Viewer3D from '../ui/Viewer3D'
import { model } from '../../three/models'

const modelAssets = model as Record<string, string>

function SliderArrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg
      className={`slider-arrow slider-arrow--${dir}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {dir === 'prev' ? <path d="M14.5 5 8 12l6.5 7" /> : <path d="M9.5 5 16 12l-6.5 7" />}
    </svg>
  )
}

function Vitrine({
  item,
  index,
  onOpen,
}: {
  item: ShowroomItem
  index: number
  onOpen: (item: ShowroomItem) => void
}) {
  const code = `MOD-${String(index + 1).padStart(2, '0')}`
  return (
    <li className="vitrine" style={{ '--acc': `var(--acc-${item.accent})` } as CSSProperties}>
      <button
        type="button"
        className="vitrine-trigger"
        aria-haspopup="dialog"
        onClick={() => onOpen(item)}
        aria-label={`${showroom.action} ${item.title}`}
      >
        <span className="vitrine-stage" aria-hidden="true">
          <span className="vitrine-floor">
            <span className="vitrine-grid" />
            <span className="vitrine-scan" />
          </span>
          <svg className="vitrine-cross" viewBox="0 0 60 60" fill="none">
            <line x1="30" y1="12" x2="30" y2="48" />
            <line x1="12" y1="30" x2="48" y2="30" />
            <circle cx="30" cy="30" r="13" />
            <circle cx="30" cy="30" r="2" />
          </svg>
          <span className="vitrine-tag">{code}</span>
          <span className="vitrine-pip" />
        </span>
        <span className="vitrine-info">
          <span className="vitrine-category">{item.category}</span>
          <span className="vitrine-title">{item.title}</span>
          <span className="vitrine-spec">{item.spec}</span>
          <span className="vitrine-action">{showroom.action}</span>
        </span>
      </button>
    </li>
  )
}

function Spotlight({
  item,
  onClose,
}: {
  item: ShowroomItem
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [onClose])

  return (
    <div className="spotlight" role="dialog" aria-modal="true" aria-labelledby="spotlight-title">
      <div className="spotlight-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="spotlight-panel">
        <div className="spotlight-stage">
          <Viewer3D
            src={modelAssets[item.model]}
            label={item.title}
            mode="turntable"
            autoRotate
            className="spotlight-viewer"
          />
        </div>
        <div className="spotlight-info">
          <span className="spotlight-category">{item.category}</span>
          <h3 className="spotlight-title" id="spotlight-title">
            {item.title}
          </h3>
          <p className="spotlight-spec">{item.spec}</p>
          <button
            ref={closeRef}
            type="button"
            className="btn btn--secondary spotlight-close"
            onClick={onClose}
          >
            {showroom.close}
          </button>
        </div>
      </div>
    </div>
  )
}

function Showroom() {
  const [active, setActive] = useState<ShowroomItem | null>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [current, setCurrent] = useState(0)
  const [bounds, setBounds] = useState({ prev: false, next: showroom.items.length > 1 })

  const indexRef = useRef(0)
  const stepRef = useRef(0)
  const count = showroom.items.length

  const setIndex = useCallback((index: number) => {
    indexRef.current = index
    setCurrent(index)
  }, [])

  const updateStep = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const first = track.children[0] as HTMLElement | undefined
    if (!first) return
    const gap = parseFloat(getComputedStyle(track).columnGap || '0')
    stepRef.current = first.offsetWidth + gap
  }, [])

  useEffect(() => {
    updateStep()
    window.addEventListener('resize', updateStep)
    return () => window.removeEventListener('resize', updateStep)
  }, [updateStep])

  const goTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    const trackRect = track.getBoundingClientRect()
    const slideRect = slide.getBoundingClientRect()
    const padLeft = parseFloat(getComputedStyle(track).scrollPaddingLeft || '0')
    const left = track.scrollLeft + slideRect.left - trackRect.left - padLeft
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
  }, [])

  const shift = useCallback(
    (step: number) => {
      const next = Math.min(count - 1, Math.max(0, indexRef.current + step))
      goTo(next)
      setIndex(next)
    },
    [count, goTo, setIndex],
  )

  const onTrackKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      shift(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      shift(-1)
    }
  }

  const onTrackScroll = () => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, clientWidth, scrollWidth } = track
    const prev = scrollLeft > 4
    const next = scrollLeft + clientWidth < scrollWidth - 4
    setBounds((curr) => (curr.prev === prev && curr.next === next ? curr : { prev, next }))

    let index = indexRef.current
    if (scrollLeft <= 4) index = 0
    else if (scrollLeft + clientWidth >= scrollWidth - 4) index = count - 1
    else if (stepRef.current > 0) {
      index = Math.round(scrollLeft / stepRef.current)
      index = Math.min(count - 1, Math.max(0, index))
    }
    if (index !== indexRef.current) setIndex(index)
  }

  const open = (item: ShowroomItem) => setActive(item)
  const close = () => setActive(null)

  return (
    <section className="showroom" id="showroom" aria-labelledby="showroom-title">
      <h2 className="section-eyebrow" id="showroom-title">
        {showroom.eyebrow}
      </h2>
      <div className="showroom-head">
        <h3 className="showroom-title">{showroom.title}</h3>
        <div className="showroom-nav">
          <button
            type="button"
            className="showroom-nav-btn"
            onClick={() => shift(-1)}
            disabled={!bounds.prev}
            aria-label="Módulo anterior"
          >
            <SliderArrow dir="prev" />
          </button>
          <button
            type="button"
            className="showroom-nav-btn"
            onClick={() => shift(1)}
            disabled={!bounds.next}
            aria-label="Módulo siguiente"
          >
            <SliderArrow dir="next" />
          </button>
        </div>
      </div>
      <ul
        ref={trackRef}
        className="vitrines"
        tabIndex={0}
        aria-label="Galería de módulos en exhibición"
        onKeyDown={onTrackKeyDown}
        onScroll={onTrackScroll}
      >
        {showroom.items.map((item, index) => (
          <Vitrine key={item.id} item={item} index={index} onOpen={open} />
        ))}
      </ul>
      <ol className="showroom-dots">
        {showroom.items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={index === current ? 'is-active' : undefined}
              onClick={() => {
                goTo(index)
                setIndex(index)
              }}
              aria-label={`Ir a ${item.title}`}
              aria-current={index === current ? 'true' : undefined}
            />
          </li>
        ))}
      </ol>
      {active && <Spotlight item={active} onClose={close} />}
    </section>
  )
}

export default Showroom