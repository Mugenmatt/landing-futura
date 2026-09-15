import { useState } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useModelView } from '../../three/useModelView'
import { supportsWebGL } from '../../three/support'
import type { FramePose, ViewerMode } from '../../three/engine'

type Viewer3DProps = {
  src: string
  /** Código del módulo para `aria-label` (ej. "CYBMAN_V2.0"). */
  label: string
  mode?: ViewerMode
  className?: string
  scan?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  pose?: FramePose | null
  /** Fallback en pointer coarse / sin WebGL / mientras no se monta el motor. */
  poster?: ReactNode
}

function hasCoarsePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches
  )
}

function PosterFallback({ label }: { label: string }) {
  return (
    <div className="viewer3d-poster" role="img" aria-label={label}>
      <span className="viewer3d-poster-code">{label}</span>
      <span className="viewer3d-poster-node" aria-hidden="true" />
      <svg
        className="viewer3d-poster-ring"
        viewBox="0 0 100 100"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="10" y="10" width="80" height="80" rx="2" />
        <circle cx="50" cy="50" r="34" />
      </svg>
    </div>
  )
}

function Viewer3D({
  src,
  label,
  mode = 'orbit',
  className = '',
  scan = false,
  autoRotate = false,
  autoRotateSpeed,
  pose,
  poster,
}: Viewer3DProps) {
  const reduced = useReducedMotion()
  const [webgl] = useState(() => supportsWebGL())
  const [coarse] = useState(hasCoarsePointer)

  /* pointer coarse o sin WebGL → poster estático, el motor jamás se monta. */
  const usePoster = !webgl || coarse

  const effectiveMode: ViewerMode = reduced ? 'static' : mode

  const { containerRef, canvasRef, status } = useModelView({
    src,
    mode: effectiveMode,
    enabled: !usePoster,
    autoRotate: reduced ? false : autoRotate,
    autoRotateSpeed,
    scan: reduced ? false : scan,
    pose,
  })

  if (usePoster) {
    return (
      <div className={`viewer3d viewer3d--poster ${className}`}>
        {poster ?? <PosterFallback label={label} />}
      </div>
    )
  }

  const busy = status === 'idle' || status === 'loading'

  return (
    <div className={`viewer3d ${className}`} ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="viewer3d-canvas"
        tabIndex={mode === 'orbit' ? 0 : -1}
        role="img"
        aria-label={label}
        aria-busy={busy}
        aria-hidden={mode !== 'orbit'}
      />
      <svg className="viewer3d-corner" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M2 22 V6 a4 4 0 0 1 4 -4 h18" fill="none" />
        <circle cx="6" cy="17" r="1" />
        <circle cx="9" cy="17" r="1" />
        <circle cx="12" cy="17" r="1" />
      </svg>
      {busy && (
        <div className="viewer3d-status" role="status" aria-live="polite">
          <span className="viewer3d-status-dot" aria-hidden="true" />
          CARACTERIZANDO MÓDULO…
        </div>
      )}
    </div>
  )
}

export default Viewer3D