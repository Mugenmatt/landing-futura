import { sideMetrics } from '../../content/content'
import MetricBars from './MetricBars'
import { BionicHandIcon, UserIcon } from './icons'

function SideMetricsPanel() {
  return (
    <section className="side-panel" aria-labelledby="side-metrics-title">
      <div className="side-header">
        <h3 className="side-header-label" id="side-metrics-title">
          {sideMetrics.header}
        </h3>
        <BionicHandIcon className="side-logo" />
        <span className="side-placeholder" aria-hidden="true">
          LOGO
        </span>
        <UserIcon className="side-user" />
      </div>
      <MetricBars bars={sideMetrics.bars} className="side-metrics" />
    </section>
  )
}

export default SideMetricsPanel