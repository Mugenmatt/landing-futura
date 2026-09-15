import { emergency } from '../../content/content'
import Button from './Button'
import { BioHazardIcon, ChipIcon, ConnectorIcon, ToolsIcon } from './icons'

function EmergencySupportPanel() {
  const mailto = `${emergency.mailto}?subject=${encodeURIComponent(
    emergency.subject,
  )}&body=${encodeURIComponent(emergency.body)}`

  return (
    <section className="panel panel--emergency" aria-labelledby="emergency-title">
      <div className="emergency-head">
        <h3 className="panel-title" id="emergency-title">
          {emergency.title}
        </h3>
        <p className="emergency-copy">{emergency.copy}</p>
      </div>
      <div className="emergency-icons" aria-hidden="true">
        <ChipIcon className="emergency-icon" />
        <ConnectorIcon className="emergency-connector" />
        <BioHazardIcon className="emergency-icon" />
        <ConnectorIcon className="emergency-connector" />
        <ToolsIcon className="emergency-icon" />
      </div>
      <Button variant="danger" href={mailto}>
        {emergency.cta.label}
      </Button>
    </section>
  )
}

export default EmergencySupportPanel