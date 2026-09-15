type StatusPillProps = {
  label: string
}

function StatusPill({ label }: StatusPillProps) {
  return (
    <span className="status-pill" role="status">
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  )
}

export default StatusPill