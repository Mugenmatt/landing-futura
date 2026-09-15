import { emergency } from '../../content/content'
import Button from './Button'
import { BioHazardIcon, ChipIcon, ConnectorIcon, ToolsIcon } from './icons'

function EmergencySupportPanel() {
  return (
    <section className="panel panel--emergency" aria-labelledby="emergency-title">
      <h3 className="panel-title" id="emergency-title">
        {emergency.title}
      </h3>
      <div className="emergency-icons">
        <ChipIcon className="emergency-icon" />
        <ConnectorIcon className="emergency-connector" />
        <BioHazardIcon className="emergency-icon" />
        <ConnectorIcon className="emergency-connector" />
        <ToolsIcon className="emergency-icon" />
      </div>
      <Button variant="danger" href={emergency.cta.href}>
        {emergency.cta.label}
      </Button>
    </section>
  )
}

export default EmergencySupportPanel