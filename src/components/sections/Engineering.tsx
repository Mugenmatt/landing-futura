import { engineeringStats } from '../../content/content'
import StatNumber from '../ui/StatNumber'

function Sparkline({ value }: { value: number }) {
  const points = Array.from({ length: 8 }, (_, i) => {
    const x = i * 8
    const y = 26 - Math.round(((i / 7) * 0.6 + value * 0.01) * 18)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg
      className="stat-sparkline"
      viewBox="0 0 56 28"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Engineering() {
  return (
    <section className="engineering" id="ingenieria" aria-labelledby="engineering-title">
      <h2 className="section-eyebrow" id="engineering-title">
        Ingeniería
      </h2>
      <ul className="stats-grid">
        {engineeringStats.map((stat) => (
          <li className="stat" key={stat.label}>
            <Sparkline value={stat.value} />
            <StatNumber {...stat} />
            <span className="stat-label">{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Engineering