import type { MetricBar } from '../../content/content'

type MetricBarsProps = {
  bars: readonly MetricBar[]
  className?: string
}

function MetricBars({ bars, className }: MetricBarsProps) {
  const classes = ['metric-bars', className].filter(Boolean).join(' ')
  return (
    <div className={classes}>
      {bars.map((bar) => (
        <div className="metric-row" key={bar.label}>
          <span className="metric-label">{bar.label}</span>
          <span className="metric-track">
            <span
              className="metric-fill"
              style={{ width: `${bar.value}%` }}
              aria-hidden="true"
            />
          </span>
          <span className="metric-value">{bar.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default MetricBars