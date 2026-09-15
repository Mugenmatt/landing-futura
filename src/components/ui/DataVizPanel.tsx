import { dataViz } from '../../content/content'
import type { ChartSegment } from '../../content/content'

const DONUT_SIZE = 120
const DONUT_STROKE = 12
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2
const LINE_WIDTH = 280
const LINE_HEIGHT = 84
const LINE_PAD = 5

function Donut({ segments }: { segments: readonly ChartSegment[] }) {
  const circumference = 2 * Math.PI * DONUT_RADIUS
  const total = segments.reduce((sum, seg) => sum + seg.value, 0)

  const arcs = segments.reduce<Array<ChartSegment & { length: number; offset: number }>>(
    (acc, seg) => {
      const length = (seg.value / total) * circumference
      const offset = acc.reduce((sum, arc) => sum + arc.length, 0)
      return [...acc, { ...seg, length, offset }]
    },
    [],
  )

  return (
    <div className="donut-wrap">
      <svg
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        aria-hidden="true"
        focusable="false"
      >
        <circle
          className="donut-track"
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
        />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            className={`donut-seg ${arc.className}`}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_RADIUS}
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={-arc.offset}
            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
          />
        ))}
      </svg>
      <span className="donut-center" aria-hidden="true">
        {segments[0].value}%
      </span>
    </div>
  )
}

function LineChart({ points }: { points: readonly number[] }) {
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const coords = points.map((value, i) => {
    const x =
      LINE_PAD + (i / (points.length - 1)) * (LINE_WIDTH - LINE_PAD * 2)
    const y =
      LINE_HEIGHT -
      LINE_PAD -
      ((value - min) / span) * (LINE_HEIGHT - LINE_PAD * 2)
    return [x, y] as const
  })
  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const firstX = coords[0][0].toFixed(1)
  const lastX = coords[coords.length - 1][0].toFixed(1)
  const area = `${firstX},${LINE_HEIGHT} ${line} ${lastX},${LINE_HEIGHT}`
  const last = coords[coords.length - 1]

  return (
    <svg
      className="linechart-svg"
      viewBox={`0 0 ${LINE_WIDTH} ${LINE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line
          key={fraction}
          className="chart-grid"
          x1="0"
          x2={LINE_WIDTH}
          y1={LINE_HEIGHT * fraction}
          y2={LINE_HEIGHT * fraction}
        />
      ))}
      <polygon className="chart-area" points={area} />
      <polyline className="chart-line" points={line} />
      <circle className="chart-end" cx={last[0]} cy={last[1]} r="2.5" />
    </svg>
  )
}

function DataVizPanel() {
  return (
    <section className="panel panel--viz" aria-label="Visualización de datos">
      <div className="chart-block">
        <h3 className="panel-title">{dataViz.donut.title}</h3>
        <div className="chart-row">
          <Donut segments={dataViz.donut.segments} />
          <ul className="donut-legend">
            {dataViz.donut.segments.map((seg) => (
              <li key={seg.label}>
                <span
                  className={`swatch ${seg.className}`}
                  aria-hidden="true"
                />
                <span>{seg.label}</span>
                <span className="legend-value">{seg.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chart-block">
        <h3 className="panel-title">{dataViz.line.title}</h3>
        <LineChart points={dataViz.line.points} />
      </div>
    </section>
  )
}

export default DataVizPanel