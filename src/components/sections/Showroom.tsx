import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { showroom } from '../../content/content'
import type { ShowroomItem } from '../../content/content'
import Viewer3D from '../ui/Viewer3D'
import { model } from '../../three/models'

const modelAssets = model as Record<string, string>

function Vitrine({
  item,
  onOpen,
}: {
  item: ShowroomItem
  onOpen: (item: ShowroomItem) => void
}) {
  return (
    <li className="vitrine" style={{ '--acc': `var(--acc-${item.accent})` } as CSSProperties}>
      <button
        type="button"
        className="vitrine-trigger"
        aria-haspopup="dialog"
        onClick={() => onOpen(item)}
        aria-label={`PROYECTAR MÓDULO ${item.title}`}
      >
        <span className="vitrine-floor" aria-hidden="true">
          <span className="vitrine-grid" />
          <span className="vitrine-scan" />
        </span>
        <svg className="vitrine-cross" viewBox="0 0 60 60" aria-hidden="true" focusable="false">
          <line x1="30" y1="14" x2="30" y2="46" />
          <line x1="14" y1="30" x2="46" y2="30" />
          <circle cx="30" cy="30" r="13" />
        </svg>
        <span className="vitrine-id">
          <span className="vitrine-title">{item.title}</span>
          <span className="vitrine-category">{item.category}</span>
        </span>
        <span className="vitrine-spec">{item.spec}</span>
        <span className="vitrine-action">{showroom.action} →</span>
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
    const onKey = (e: KeyboardEvent) => {
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

  const open = (item: ShowroomItem) => setActive(item)
  const close = () => setActive(null)

  return (
    <section className="showroom" id="showroom" aria-labelledby="showroom-title">
      <h2 className="section-eyebrow" id="showroom-title">
        {showroom.eyebrow}
      </h2>
      <div className="showroom-head">
        <h3 className="showroom-title">{showroom.title}</h3>
      </div>
      <ul className="vitrines">
        {showroom.items.map((item) => (
          <Vitrine key={item.id} item={item} onOpen={open} />
        ))}
      </ul>
      {active && (
        <Spotlight item={active} onClose={close} />
      )}
    </section>
  )
}

export default Showroom