import { useState, useEffect, useRef } from 'react'

const BOOT_LINES = [
  '> INICIALIZANDO INTERFAZ NEURAL...',
  '> CARGANDO PROTOCOLO BIO-SEGURIDAD...',
  '> SINCRONIZANDO SUBREDES...',
  '> CALIBRANDO SENSORES BIOMÉTRICOS...',
  '> ESTABLECIENDO ENLACE NEURAL...',
  '> VERIFICANDO INTEGRIDAD DEL SISTEMA...',
  '> CARGANDO CATÁLOGO DE MÓDULOS...',
  '> VALIDACIÓN DE COMPONENTES...',
  '> NEO-TOKYO SECTOR 7G — ONLINE',
  '> SISTEMA OPERATIVO: NEO-CYBERNETICS v4.2.1',
  '> CRYPTO HANDSHAKE: 0xF7A2...',
  '> BIOMETRIC HASH: 0xB3C9...',
  '> NEURAL BRIDGE: ESTABLE',
]

const GLITCH_SET: string[][] = [
  ['█▓░▒█▓', '░▒▓█▒░'],
  ['╔══╗', '╚══╝'],
  ['▓▓▓▓▓▓▓▓▓▓▓▓▓▓'],
  ['░░░░░░░░░░░░░░░░░░'],
  ['Binary overflow', 'Stack trace: 0x8F2A'],
  ['BIO-SECURITY: OK', 'NEURAL: ESTABLE'],
  ['Calibrando...', 'Sinck FAIL'],
  ['■■■■■■■■', '□□□□□□□□'],
  ['▓▓▒▒░░▓▓▒▒░░▓▓▒▒'],
  ['0xF4C3D2', '0xA1B2C3'],
]

export default function Preloader() {
  const [bootLine, setBootLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [glitchText, setGlitchText] = useState(GLITCH_SET[0])
  const [exiting, setExiting] = useState(false)
  const [gone, setGone] = useState(false)
  const lineIdx = useRef(0)
  const progressRef = useRef(0)

  useEffect(() => {
    const boot = setInterval(() => {
      lineIdx.current = (lineIdx.current + 1) % BOOT_LINES.length
      setBootLine(lineIdx.current)
    }, 420)

    const prog = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 0.4, 100)
      setProgress(progressRef.current)
    }, 20)

    const glitch = setInterval(() => {
      setGlitchText(GLITCH_SET[Math.floor(Math.random() * GLITCH_SET.length)])
    }, 350)

    const exitTimer = setTimeout(() => setExiting(true), 4500)
    const removeTimer = setTimeout(() => setGone(true), 5100)

    return () => {
      clearInterval(boot)
      clearInterval(prog)
      clearInterval(glitch)
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div
      className={`preloader-overlay ${exiting ? 'preloader-exit' : ''}`}
      aria-busy={!exiting}
      aria-label="Cargando sistema"
      role="status"
    >
      {/* Grid blueprint */}
      <div className="preloader-grid" aria-hidden="true" />

      {/* Scanlines */}
      <div className="preloader-scanlines" aria-hidden="true" />
      <div className="preloader-scanline-sweep" aria-hidden="true" />

      {/* Data streams */}
      <div className="preloader-data preloader-data-left" aria-hidden="true">
        {`0xA3F2 10110 0xB4C9 11010 0xF7D1 01011 0xC8E4 10101 0x3B7A 11100 0xD2F5 10011 0x7E1C 01110 0xA9B8 11001 0x5F3D 10110 0xE6A2 01001 0x8C4B 11101 0x2D7F 10100 0xB1E9 01101 0x6A53 11010 0xF0C7 10011 0x4E28 01111 0x9D61 11000 0x3FA4 10101 0xC7B6 01010`}
      </div>
      <div className="preloader-data preloader-data-right" aria-hidden="true">
        {`01110 0xF4A2 10011 0xD3E1 11100 0xB7C5 01001 0xA1F8 10110 0xE2D4 11010 0x5C6B 01011 0x8E3F 10100 0x2A97 11001 0x6F1D 10011 0xC4B3 01110 0x7D5E 11101 0x38A6 10110 0x9B0C 01001 0xE5F2 11010 0x41D8 10101 0x6C3A 01010`}
      </div>

      {/* Central content */}
      <div className="preloader-center">
        <div className="preloader-logo-wrapper">
          <div className="preloader-logo" data-text="NEO-CYBERNETICS">
            NEO-CYBERNETICS
          </div>
          <div className="preloader-logo preloader-logo-shadow" aria-hidden="true" data-text="NEO-CYBERNETICS">
            NEO-CYBERNETICS
          </div>
        </div>

        <div className="preloader-subtitle">INICIALIZACIÓN DEL SISTEMA</div>

        <div className="preloader-progress-container">
          <div className="preloader-progress" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>

        <div className="preloader-percentage">{Math.floor(progress)}%</div>

        <div className="preloader-boot-line" aria-live="polite">
          {BOOT_LINES[bootLine]}
        </div>
      </div>

      {/* Glitch slices */}
      <div className="preloader-glitch-slice preloader-glitch-slice-1" aria-hidden="true">
        {glitchText[0]}
      </div>
      <div className="preloader-glitch-slice preloader-glitch-slice-2" aria-hidden="true">
        {glitchText[1]}
      </div>
      <div className="preloader-glitch-slice preloader-glitch-slice-3" aria-hidden="true">
        {glitchText[0]}
      </div>

      {/* Corner brackets */}
      <div className="preloader-corner preloader-corner-tl" aria-hidden="true" />
      <div className="preloader-corner preloader-corner-tr" aria-hidden="true" />
      <div className="preloader-corner preloader-corner-bl" aria-hidden="true" />
      <div className="preloader-corner preloader-corner-br" aria-hidden="true" />
    </div>
  )
}
