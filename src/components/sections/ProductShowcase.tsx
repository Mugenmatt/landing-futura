import { useEffect, useRef, useState } from 'react'
import { productShowcase, products } from '../../content/content'

const NODE_ORDER = productShowcase.steps.map((s) => s.id)

function ArmSchematic({
  onUntil,
}: {
  onUntil: (stepId: string) => boolean
}) {
  return (
    <svg className="showcase-svg" viewBox="0 0 300 460" aria-hidden="true">
      <g className={`svg-part${onUntil('shell') ? ' is-on' : ''}`}>
        <line x1="108" y1="64" x2="190" y2="210" />
        <line x1="190" y1="210" x2="140" y2="336" />
        <line x1="140" y1="336" x2="196" y2="396" />
        <polyline points="88,50 176,202 130,336 202,408" />
      </g>
      <g className={`svg-part${onUntil('sensors') ? ' is-on' : ''}`}>
        <circle cx="132" cy="112" r="2.5" />
        <circle cx="164" cy="172" r="2.5" />
        <circle cx="198" cy="228" r="2.5" />
        <circle cx="154" cy="286" r="2.5" />
        <circle cx="182" cy="352" r="2.5" />
      </g>
      <g className={`svg-part${onUntil('actuator') ? ' is-on' : ''}`}>
        <circle className="joint-core" cx="190" cy="210" r="7" />
        <circle className="joint-core" cx="190" cy="210" r="3" />
        <line x1="170" y1="210" x2="210" y2="210" />
        <line x1="190" y1="190" x2="190" y2="230" />
      </g>
      <g className={`svg-part${onUntil('anchor') ? ' is-on' : ''}`}>
        <circle className="joint-core" cx="108" cy="64" r="6" />
        <circle className="joint-core" cx="108" cy="64" r="2.5" />
        <line x1="88" y1="64" x2="128" y2="64" />
        <line x1="108" y1="44" x2="108" y2="84" />
      </g>
    </svg>
  )
}

function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const steps = productShowcase.steps
  const [active, setActive] = useState(0)

  useEffect(() => {
    let ticking = false
    const update = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const sec = sectionRef.current
        if (sec) {
          const rect = sec.getBoundingClientRect()
          const span = rect.height - window.innerHeight
          const progress =
            span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0
          const next = Math.min(
            Math.floor(progress * steps.length),
            steps.length - 1,
          )
          setActive((prev) => (prev === next ? prev : next))
        }
        ticking = false
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [steps.length])

  const featured = products.items.find(
    (p) => p.id === products.featuredId,
  )
  const onUntil = (stepId: string) =>
    NODE_ORDER.indexOf(stepId) !== -1 &&
    NODE_ORDER.indexOf(stepId) <= active

  return (
    <section
      className="showcase"
      id="showcase"
      aria-labelledby="showcase-title"
      ref={sectionRef}
    >
      <div className="showcase-sticky">
        <div className="showcase-layout">
          <div className="showcase-visual">
            <ArmSchematic onUntil={onUntil} />
            <div
              className="showcase-progress"
              role="progressbar"
              aria-label="Progreso del ensamblaje del NEXUS Arc-7"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={active + 1}
            >
              <span className="progress-current">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="progress-total">
                /{String(steps.length).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="showcase-head">
            <h2 className="section-eyebrow" id="showcase-title">
              Product showcase
            </h2>
            <h3 className="showcase-product">{featured?.name}</h3>
            <ol className="showcase-steps">
              {steps.map((step, i) => (
                <li
                  className={i <= active ? 'is-active' : ''}
                  key={step.id}
                >
                  <span className="step-label">{step.label}</span>
                  <p className="step-detail">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase