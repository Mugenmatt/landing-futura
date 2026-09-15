import { performanceMetrics } from '../../content/content'
import MetricBars from './MetricBars'

function PerformanceMetricsPanel() {
  return (
    <section
      className="panel panel--metrics"
      aria-labelledby="performance-metrics-title"
    >
      <h3 className="panel-title" id="performance-metrics-title">
        {performanceMetrics.title}
      </h3>
      <MetricBars bars={performanceMetrics.bars} />
    </section>
  )
}

export default PerformanceMetricsPanel