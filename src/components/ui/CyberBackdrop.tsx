import { useEffect, useRef } from 'react'

const FONT = '"Space Mono", ui-monospace, monospace'
const CYAN = '0, 255, 255'
const VIOLET = '148, 0, 211'
const MAGENTA = '255, 0, 127'

const HEX = '0123456789ABCDEF'
const PUNCT = [...':/<>=*+-|\\']
const BROKEN = ['#', '▓', '░', '▒', '0x', '::', '||', '<>', '+-']

const TERMINAL_LEFT = [
  '> ENLACE NEURAL: ESTABLE',
  '> SECTOR 7G — ONLINE',
  '> BRAZO_AUMENTADO_V4: OK',
  '> SYNCH: 99.8%',
  '> NEO-TOKYO 2049',
]

const TERMINAL_RIGHT = [
  '0xA3F2 01110 00101',
  '0xB4C9 10011 11010',
  '0xF7D1 01011 10000',
  '0xC8E4 10101 01100',
]

type Column = {
  x: number
  speed: number
  head: number
  len: number
  cell: number
  chars: string[]
  alpha: number
  violet: boolean
}

type Particle = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  w: number
  ph: number
  kind: number
  char: string
  alpha: number
  violet: boolean
}

type Terminal = {
  x: number
  y: number
  align: 'left' | 'right'
  lines: string[]
  line: number
  pos: number
  speed: number
  hold: number
}

const rnd = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
const glyph = () => {
  if (Math.random() < 0.35) return pick(PUNCT)
  return HEX[Math.floor(Math.random() * HEX.length)]
}

function makeColumn(W: number, fine: boolean): Column {
  const len = 6 + Math.floor(Math.random() * (fine ? 6 : 4))
  const edge = Math.random() < 0.85
  const x = edge
    ? (Math.random() < 0.5 ? 0.05 + Math.random() * 0.36 : 0.59 + Math.random() * 0.36) * W
    : 0.22 + Math.random() * 0.56 * W
  const cell = 15
  const chars = Array.from({ length: len }, () => glyph())
  return {
    x,
    speed: rnd(20, 54),
    head: -len * cell * rnd(1, 4),
    len,
    cell,
    chars,
    alpha: rnd(0.045, 0.08),
    violet: Math.random() < 0.12,
  }
}

function makeParticle(W: number, H: number): Particle {
  const kind = Math.floor(Math.random() * 3)
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: kind === 0 ? rnd(0.6, 1.6) : 1,
    vx: rnd(-4, 4),
    vy: -rnd(2, 14),
    w: rnd(0.4, 1.4),
    ph: Math.random() * Math.PI * 2,
    kind,
    char: pick(PUNCT),
    alpha: rnd(0.045, 0.11),
    violet: Math.random() < 0.18,
  }
}

function drawTicks(ctx: CanvasRenderingContext2D, sim: number, W: number, H: number) {
  const step = 46
  const count = Math.floor((H - 40) / step)
  const n = 4
  for (let i = 0; i < count; i++) {
    const y = 24 + i * step
    const travelling = i === Math.floor(sim / 2.6) % count
    const violet = i % 9 === 0
    const len = travelling ? 12 : 7
    const alpha = travelling ? 0.09 : violet ? 0.045 : 0.038
    ctx.fillStyle = violet ? `rgba(${VIOLET}, ${alpha})` : `rgba(${CYAN}, ${alpha})`
    ctx.fillRect(n, y, 1.5, len)
    ctx.fillRect(W - n - 1.5, y, 1.5, len)
  }
}

function drawReticle(ctx: CanvasRenderingContext2D, sim: number, W: number, H: number) {
  const cx = W * 0.17 + Math.sin(sim * 0.05) * 16
  const cy = H * 0.76 + Math.cos(sim * 0.07) * 12
  const r = 108 + Math.sin(sim * 0.03) * 8
  ctx.save()
  ctx.strokeStyle = `rgba(${CYAN}, 0.05)`
  ctx.lineWidth = 1
  ctx.setLineDash([3, 7])
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + sim * 0.02
    const t = r + 5
    ctx.fillStyle = `rgba(${CYAN}, 0.05)`
    ctx.fillRect(cx + Math.cos(a) * t - 3, cy + Math.sin(a) * t - 0.75, 6, 1.5)
    ctx.fillRect(cx + Math.cos(a) * t - 0.75, cy + Math.sin(a) * t - 3, 1.5, 6)
  }
  ctx.restore()
}

function drawPing(ctx: CanvasRenderingContext2D, sim: number, W: number, H: number) {
  const anchorX = W * 0.9
  const anchorY = H * 0.7
  for (let i = 0; i < 2; i++) {
    const p = ((sim / 16 + i * 0.5) % 1)
    const r = 24 + p * Math.min(W * 0.28, 420)
    const alpha = (1 - p) * 0.05
    ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(anchorX, anchorY, r, r * 0.42, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawScan(ctx: CanvasRenderingContext2D, sim: number, H: number) {
  const y = ((sim * 0.02) % 1) * H
  const alpha = 0.055
  ctx.fillStyle = `rgba(${CYAN}, ${alpha * 0.4})`
  ctx.fillRect(0, y - 54, ctx.canvas.clientWidth, 12)
  ctx.fillStyle = `rgba(${CYAN}, ${alpha * 0.7})`
  ctx.fillRect(0, y - 42, ctx.canvas.clientWidth, 10)
  ctx.fillStyle = `rgba(${CYAN}, ${alpha})`
  ctx.fillRect(0, y - 30, ctx.canvas.clientWidth, 22)
  ctx.fillStyle = `rgba(${CYAN}, ${alpha * 2})`
  ctx.fillRect(0, y - 0.75, ctx.canvas.clientWidth, 1.5)
}

function drawGlitch(
  ctx: CanvasRenderingContext2D,
  glitch: { until: number; bands: [number, number, number, number][] } | null,
  sim: number,
) {
  if (!glitch || sim > glitch.until) return
  for (const [x, y, w, h] of glitch.bands) {
    ctx.fillStyle = `rgba(${CYAN}, 0.1)`
    ctx.fillRect(x + 3.5, y, w, h)
    ctx.fillStyle = `rgba(${MAGENTA}, 0.075)`
    ctx.fillRect(x, y + 1.5, w, h)
    ctx.fillStyle = `rgba(${CYAN}, 0.12)`
    ctx.font = `12px ${FONT}`
    ctx.fillText(pick(BROKEN), x + 4, y + 2)
    ctx.fillStyle = `rgba(${MAGENTA}, 0.1)`
    ctx.fillText(pick(BROKEN), x + 22, y + h - 2)
  }
}

function terminalAdvance(term: Terminal, dt: number) {
  const line = term.lines[term.line]
  term.hold -= dt
  if (term.pos < line.length) {
    term.pos = Math.min(line.length, term.pos + term.speed * dt)
  } else if (term.hold <= 0) {
    term.line = (term.line + 1) % term.lines.length
    term.pos = 0
    term.hold = 2.4 + Math.random() * 2.4
  }
}

export default function CyberBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const motionOn = !reduced

    let W = window.innerWidth
    let H = window.innerHeight
    let dpr = 1
    let columns: Column[] = []
    let particles: Particle[] = []
    const terminals: Terminal[] = []

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const colCount = coarse ? 13 : 24
      columns = Array.from({ length: colCount }, () => makeColumn(W, !coarse))
      const partCount = coarse ? 20 : 44
      particles = Array.from({ length: partCount }, () => makeParticle(W, H))

      terminals.length = 0
      terminals.push({
        x: 14,
        y: 22,
        align: 'left',
        lines: TERMINAL_LEFT,
        line: 0,
        pos: 0,
        speed: 26,
        hold: 1.2,
      })
      if (!coarse) {
        terminals.push({
          x: W - 14,
          y: 22,
          align: 'right',
          lines: TERMINAL_RIGHT,
          line: 0,
          pos: 0,
          speed: 34,
          hold: 1.2,
        })
      }
    }
    resize()

    let raf = 0
    let sim = 0
    let last = performance.now()
    let glitchUntil = 0
    let glitch: { until: number; bands: [number, number, number, number][] } | null = null

    const render = (dt: number) => {
      sim += dt

      ctx.clearRect(0, 0, W, H)
      ctx.textBaseline = 'top'

      drawTicks(ctx, sim, W, H)
      if (motionOn && !coarse) drawScan(ctx, sim, H)
      drawReticle(ctx, sim, W, H)
      if (motionOn) drawPing(ctx, sim, W, H)

      ctx.font = `13px ${FONT}`
      for (const col of columns) {
        col.head += col.speed * dt
        if (col.head - col.len * col.cell > H) {
          col.head = -col.len * col.cell * rnd(1, 3)
        }
        if (Math.random() < 0.028) col.chars[0] = glyph()
        const rgb = col.violet ? VIOLET : CYAN
        for (let j = 0; j < col.len; j++) {
          const y = col.head - j * col.cell
          if (y < -14 || y > H) continue
          const t = j / col.len
          const a = col.alpha * (1 - t * 0.85) * (j === 0 ? 1.8 : 1)
          ctx.fillStyle = `rgba(${rgb}, ${Math.min(a, 0.16)})`
          ctx.fillText(col.chars[j], col.x, y)
        }
      }

      ctx.font = `12px ${FONT}`
      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        if (p.y < -12) {
          p.y = H + 8
          p.x = Math.random() * W
        }
        if (p.x < -12) p.x = W + 8
        if (p.x > W + 12) p.x = -8
        const tw = 0.5 + 0.5 * Math.sin(sim * p.w + p.ph)
        const a = p.alpha * tw
        const rgb = p.violet ? VIOLET : CYAN
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(a, 0.16)})`
        if (p.kind === 0) {
          ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2)
        } else if (p.kind === 1) {
          ctx.fillRect(p.x - 2, p.y, 4, 1.5)
          ctx.fillRect(p.x, p.y - 1, 1.5, 4)
        } else {
          ctx.fillText(p.char, p.x, p.y)
        }
      }

      for (const term of terminals) {
        if (motionOn) terminalAdvance(term, dt)
        const line = term.lines[term.line]
        const shown = motionOn ? line.slice(0, Math.floor(term.pos)) : line
        ctx.font = `11px ${FONT}`
        ctx.fillStyle = `rgba(${CYAN}, 0.075)`
        const textX = term.align === 'right' ? term.x - ctx.measureText(line).width : term.x
        for (let i = 0; i < term.lines.length; i++) {
          const l = term.lines[i]
          const color = i === term.line ? `rgba(${CYAN}, 0.075)` : 'rgba(122, 132, 148, 0.05)'
          ctx.fillStyle = color
          const drawX = term.align === 'right' ? term.x - ctx.measureText(i === term.line ? shown : l).width : term.x
          ctx.fillText(i === term.line ? shown : l, drawX, term.y + i * 18)
        }
        if (term.pos >= line.length && Math.floor(sim * 1.4) % 2 === 0) {
          ctx.fillStyle = `rgba(${CYAN}, 0.12)`
          ctx.fillRect(textX + ctx.measureText(shown).width + 4, term.y + term.line * 18, 5, 11)
        }
      }

      ctx.font = `10px ${FONT}`
      ctx.fillStyle = 'rgba(122, 132, 148, 0.055)'
      ctx.fillText('NEO-TOKYO 2049 // SECTOR 7G', 14, H - 24)

      if (motionOn && !coarse && sim > glitchUntil) {
        const bands: [number, number, number, number][] = []
        const sliceCount = 1 + (Math.random() < 0.3 ? 1 : 0)
        for (let i = 0; i < sliceCount; i++) {
          const x = rnd(0, W * 0.8)
          const y = rnd(24, H - 60)
          bands.push([x, y, rnd(90, 300), rnd(5, 16)])
        }
        glitch = { until: sim + 0.14, bands }
        glitchUntil = sim + rnd(9, 20)
      }
      drawGlitch(ctx, glitch, sim)
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!document.hidden) render(dt)
      raf = requestAnimationFrame(frame)
    }

    if (reduced) {
      render(0)
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      resize()
      if (reduced) render(0)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="cyber-backdrop" aria-hidden="true" />
}