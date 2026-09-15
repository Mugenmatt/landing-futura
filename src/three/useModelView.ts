import { useEffect, useRef, useState } from 'react'
import type { FramePose, ModelView, ViewerMode } from './engine'

export type ViewerStatus = 'idle' | 'loading' | 'ready' | 'error'

export type UseModelViewOptions = {
  src: string
  mode: ViewerMode
  /** true recién cuando el canvas está en viewport y el WebGL está permitido. */
  enabled: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  scan?: boolean
  pose?: FramePose | null
}

const VIEWER_ROOT_MARGIN = '0px 0px -8% 0px'

export function useModelView(options: UseModelViewOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<ViewerStatus>('idle')
  const viewRef = useRef<ModelView | null>(null)
  const inViewRef = useRef(false)

  useEffect(() => {
    if (!options.enabled) {
      inViewRef.current = false
      return
    }
    let cancelled = false
    let inView = false

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        inViewRef.current = inView
        viewRef.current?.setActive(inView)
      },
      { rootMargin: VIEWER_ROOT_MARGIN, threshold: 0.02 },
    )
    if (containerRef.current) io.observe(containerRef.current)

    let engineModule: typeof import('./engine') | undefined
    let view: ModelView | null = null

    import('./engine')
      .then((mod) => {
        engineModule = mod
        if (cancelled || !canvasRef.current) return
        view = mod.engine.requestView({
          canvas: canvasRef.current,
          mode: options.mode,
          autoRotate: options.autoRotate,
          autoRotateSpeed: options.autoRotateSpeed,
          scan: options.scan,
        })
        if (!view) {
          setStatus('error')
          return
        }
        viewRef.current = view
        view.setActive(inViewRef.current)
        setStatus('loading')
        return view.setModel(options.src).then(() => {
          if (cancelled) return
          if (options.pose) view?.setFrame(options.pose)
          setStatus('ready')
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      io.disconnect()
      if (view && engineModule) engineModule.engine.releaseView(view)
      viewRef.current = null
    }
    /* scan/autoRotate/pose se aplican en efectos dedicados (pose por frame,
       autoRotate por hover); reconstruir la vista en esos cambios cancelaría
       el turntable en hover. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.enabled,
    options.mode,
    options.src,
    options.autoRotateSpeed,
  ])

  const poseKey = options.pose
    ? JSON.stringify(options.pose)
    : null

  useEffect(() => {
    if (!poseKey || !viewRef.current) return
    viewRef.current.setFrame(options.pose!)
  }, [poseKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    viewRef.current?.setAutoRotate(Boolean(options.autoRotate))
  }, [options.autoRotate])

  return { containerRef, canvasRef, status }
}