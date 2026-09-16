import { useEffect, useRef, useState } from 'react'
import { catalog, productShowcase } from '../../content/content'
import Viewer3D from '../ui/Viewer3D'
import { model, armShowcaseFrames } from '../../three/models'

const NODE_ORDER = productShowcase.steps.map((s) => s.id)
const pad = (n: number) => String(n).padStart(2, '0')

function ArmSchematic({
  onUntil,
  at,
}: {
  onUntil: (stepId: string) => boolean
  at: (stepId: string) => boolean
}) {
  const CHIPS = [
    { id: 'anchor', code: '04', x: 30, y: 88, toX: 102, toY: 70 },
    { id: 'shell', code: '01', x: 166, y: 30, toX: 166, toY: 118 },
    { id: 'actuator', code: '03', x: 222, y: 150, toX: 192, toY: 206 },
    { id: 'sensors', code: '02', x: 214, y: 330, toX: 194, toY: 350 },
  ]
  const cls = (id: string) =>
    at(id) ? 'svg-chip is-live' : onUntil(id) ? 'svg-chip is-on' : 'svg-chip'
  return (
    <svg className="showcase-svg" viewBox="0 0 300 460" aria-hidden="true" focusable="false">
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
      {CHIPS.map((c) => (
        <g key={c.id} className={cls(c.id)}>
          <line x1={c.x + 4} y1={c.y + 9} x2={c.toX} y2={c.toY} />
          <rect x={c.x} y={c.y} width="58" height="18" rx="2" />
          <text x={c.x + 5} y={c.y + 12.5}>
            {c.code} {c.id.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  )
}

function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const steps = productShowcase.steps
  const [active, setActive] = useState(0)

  const featured = catalog.products.find(
    (p) => p.id === productShowcase.productId,
  )

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

  const onUntil = (stepId: string) =>
    NODE_ORDER.indexOf(stepId) !== -1 &&
    NODE_ORDER.indexOf(stepId) <= active
  const at = (stepId: string) => NODE_ORDER.indexOf(stepId) === active

  return (
    <section
      className="showcase"
      id="showcase"
      aria-labelledby="showcase-title"
      ref={sectionRef}
    >
      <div className="showcase-sticky">
        <div className="showcase-layout">
          <div className="showcase-stage">
            <div className="showcase-viewer">
              <Viewer3D
                src={model.armV4}
                label={featured?.name ?? 'BRAZO_AUMENTADO_V4'}
                mode="orbit"
                pose={armShowcaseFrames[active]}
                poster={<ArmSchematic onUntil={onUntil} at={at} />}
              />
            </div>
            <div className="showcase-hud" aria-hidden="true">
              <span className="hud-zone">
                <span className="hud-zone-code">MOD-{pad(active + 1)}</span>
                <span className="hud-zone-name">
                  {steps[active].id.toUpperCase()}
                </span>
              </span>
              <span className="hud-counter">
                <b className="hud-counter-current">{pad(active + 1)}</b>
                <i className="hud-counter-total">/{pad(steps.length)}</i>
              </span>
            </div>
            <div
              className="showcase-track"
              role="progressbar"
              aria-label={productShowcase.progressLabel}
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={active + 1}
            >
              {steps.map((step, i) => (
                <span
                  key={step.id}
                  className={
                    i === active ? 'is-live' : i < active ? 'is-on' : ''
                  }
                />
              ))}
            </div>
          </div>

          <div className="showcase-head">
            <div className="showcase-heading">
              <h2 className="section-eyebrow" id="showcase-title">
                {productShowcase.eyebrow}
              </h2>
              <h3 className="showcase-product">{featured?.name}</h3>
            </div>
            <ol className="showcase-steps">
              {steps.map((step, i) => (
                <li
                  key={step.id}
                  className={i === active ? 'is-active' : i < active ? 'is-done' : ''}
                >
                  <span className="step-index" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <div className="step-body">
                    <span className="step-label">{step.label}</span>
                    <p className="step-detail">{step.detail}</p>
                  </div>
                  <span className="step-state" aria-hidden="true" />
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