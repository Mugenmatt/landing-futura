type IconProps = {
  className?: string
}

function BionicHandIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 19V8a2 2 0 0 1 4 0v9" />
      <path d="M13 18V6.5A2 2 0 0 1 17 5v12" />
      <path d="M17 18V7.5a2 2 0 0 1 4 0V16" />
      <path d="M21 16V8a2 2 0 0 1 4 0v9q0 5-3.5 7T17 26h-2q-4 0-6.5-3.5T6 15.5V13a2 2 0 0 1 4 0" />
    </svg>
  )
}

function UserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  )
}

function ChipIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      <path d="M10 10h4v4h-4z" />
    </svg>
  )
}

function BioHazardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 20 12 7.5 19.5 20Z" />
      <circle cx="12" cy="15" r="2" />
      <circle cx="12" cy="15" r="0.4" fill="currentColor" />
      <path d="M12 7.5V10" />
      <path d="M12 17v3" />
    </svg>
  )
}

function ToolsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.7 6.3a4.5 4.5 0 0 0 6 6l-9.1 9.2a2.1 2.1 0 0 1-3-3l9.2-9.1a4.5 4.5 0 0 0-3.1-3.1Z" />
      <path d="M6.5 2.5a4 4 0 0 1 3.6 5.6L3.4 14.8a2.1 2.1 0 0 0 3 3l6.7-6.7" />
    </svg>
  )
}

function ConnectorIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 12h14.5" />
      <path d="m13.5 7 5 5-5 5" />
    </svg>
  )
}

export { BionicHandIcon, UserIcon, ChipIcon, BioHazardIcon, ToolsIcon, ConnectorIcon }