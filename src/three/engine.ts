import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export const DRACO_PATH = `${import.meta.env.BASE_URL}models3D/draco/`
export const MODEL_FIT_SIZE = 3

export type ViewerMode =
  | 'drift' /* rotación continua lenta, sin interact (hero) */
  | 'orbit' /* interact con pointer/teclado, autoplay opcional */
  | 'turntable' /* autoplay controlado externamente (hover en cards) */
  | 'static' /* primer frame, sin movimiento nunca (reduced-motion) */

export type FramePose = {
  /** Offset de la cámara sobre el eje largo del modelo, en fracción [-1, 1]. */
  axis?: number
  theta?: number
  phi?: number
  /** Multiplicador del radio base de cámara. < 1 = close-up. */
  radius?: number
  fov?: number
}

export type ModelViewOpts = {
  canvas: HTMLCanvasElement
  mode: ViewerMode
  /* Rotación continua y lenta (drift del hero). Se desactiva con reduced-motion. */
  autoRotate?: boolean
  autoRotateSpeed?: number
  /* Barrido de "diagnóstico" cyan recorriendo el modelo. */
  scan?: boolean
}

const MAX_VIEWS = 6
const PHI_MIN = 0.4
const PHI_MAX = 1.45
const NEUTRAL_THETA = 0.45
const NEUTRAL_PHI = 1.25
const NEUTRAL_FOV = 38

type GpuView = {
  renderer: THREE.WebGLRenderer
  owner: ModelView | null
}

/**
 * Motor three.js singleton — único punto de uso de la dependencia.
 * Todas las escenas del sitio viven acá: un solo render loop (un rAF global),
 * loader GLB + Draco compartido, cache de modelos y luz de estudio. Los
 * contextos WebGL se crean con pereza, se reutilizan vía pool y quedan a lo
 * sumo MAX_VIEWS vivos (límites de contexto de los browsers).
 */
class Engine {
  private gpus: GpuView[] = []
  private views = new Set<ModelView>()
  private modelCache = new Map<string, Promise<THREE.Group>>()
  private draco?: DRACOLoader
  private gltf?: GLTFLoader
  private rafId: number | null = null
  private last = 0

  private getGltfLoader() {
    if (!this.draco) {
      this.draco = new DRACOLoader()
      this.draco.setDecoderPath(DRACO_PATH)
    }
    if (!this.gltf) {
      this.gltf = new GLTFLoader()
      this.gltf.setDRACOLoader(this.draco)
    }
    return this.gltf
  }

  private acquireGpu(canvas: HTMLCanvasElement): GpuView {
    for (const gpu of this.gpus) {
      if (!gpu.owner && gpu.renderer.domElement === canvas) return gpu
    }
    const gpu = this.createGpu(canvas)
    this.gpus.push(gpu)
    return gpu
  }

  private createGpu(canvas: HTMLCanvasElement): GpuView {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      /* Sin tone mapping ACES ni entorno IBL (PMREM): en implementaciones
         WebGL por software (SwiftShader) ambos degradan el buffer a negro o
         blanco total. La luz de estudio directa sale bien en todo contexto y
         no paga el costo de generar el envMap por contexto. */
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return { renderer, owner: null }
  }

  requestView(opts: ModelViewOpts) {
    if (this.views.size >= MAX_VIEWS) return null
    const view = new ModelView(opts)
    view.gpu = this.acquireGpu(opts.canvas)
    this.views.add(view)
    this.ensureLoop()
    return view
  }

  releaseView(view: ModelView) {
    if (!this.views.has(view)) return
    this.views.delete(view)
    view.teardown()
    const gpu = view.gpu
    if (gpu) {
      /* El renderer quedó ligado al canvas de esta vista (ver createGpu):
         liberar el contexto WebGL al soltar la vista para no agotar límites. */
      gpu.renderer.dispose()
      gpu.renderer.forceContextLoss()
      this.gpus = this.gpus.filter((g) => g !== gpu)
    }
    if (this.views.size === 0) this.stopLoop()
  }

  loadModel(url: string) {
    let pending = this.modelCache.get(url)
    if (!pending) {
      pending = new Promise<THREE.Group>((resolve, reject) => {
        this.getGltfLoader()
          .loadAsync(url)
          .then((gltf) => resolve(this.normalize(gltf.scene)), reject)
      })
      this.modelCache.set(url, pending)
    }
    return pending
  }

  private normalize(group: THREE.Group): THREE.Group {
    const box = new THREE.Box3().setFromObject(group)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const center = box.getCenter(new THREE.Vector3())
    const scale = MODEL_FIT_SIZE / maxDim
    /* Wrapper contenedor: los GLB traen transformaciones propias en sus
       nodos internos; aplicar la compensación al ROOT no garantiza el
       centrado world. Envolver el árbol garantiza que el bbox del wrapper
       (matriz identity) quede centrado y con el tamaño de encaje. */
    const wrapper = new THREE.Group()
    wrapper.add(group)
    wrapper.position.set(-center.x, -center.y, -center.z)
    wrapper.scale.setScalar(scale)
    wrapper.updateMatrix()
    return wrapper
  }

  private ensureLoop() {
    if (this.rafId !== null) return
    this.last = performance.now()
    const tick = (now: number) => {
      this.rafId = requestAnimationFrame(tick)
      const dt = Math.min((now - this.last) / 1000, 0.05)
      this.last = now
      for (const view of this.views) {
        try {
          view.update(dt)
        } catch (err) {
          if (!view.renderErrorReported) {
            view.renderErrorReported = true
            console.error('[neo-viewer] error renderizando la vista:', err)
          }
        }
      }
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private stopLoop() {
    if (this.rafId === null) return
    cancelAnimationFrame(this.rafId)
    this.rafId = null
  }
}

export const engine = new Engine()

export class ModelView {
  readonly mode: ViewerMode
  readonly canvas: HTMLCanvasElement
  scene = new THREE.Scene()
  private opts: ModelViewOpts
  private camera = new THREE.PerspectiveCamera(NEUTRAL_FOV, 1, 0.1, 200)
  private group = new THREE.Group()
  private scanMesh?: THREE.Mesh
  private scanBounds = { minY: 0, maxY: 0 }
  private scanDir = 1
  private scanY = 0
  private phi = NEUTRAL_PHI
  private theta = NEUTRAL_THETA
  private fov = NEUTRAL_FOV
  private baseRadius = 4
  private radius = 4
  private lookTarget = new THREE.Vector3()
  private model?: THREE.Group
  private disposed = false
  private active = true
  private autoRotateOn = false
  private dragging = false
  private lastX = 0
  private lastY = 0
  private polarActive = false
  private ro: ResizeObserver | null = null
  gpu: GpuView | null = null
  renderErrorReported = false

  constructor(opts: ModelViewOpts) {
    this.opts = opts
    this.canvas = opts.canvas
    this.mode = opts.mode
    this.autoRotateOn = opts.autoRotate ?? opts.mode === 'drift'
    this.polarActive =
      opts.mode === 'orbit' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches
    this.scene.add(this.group)
    this.addStudioLights()
    if (opts.mode === 'static') this.autoRotateOn = false
    this.bindEvents()
    this.scheduleResize()
  }

  /**
   * Luz de estudio neutra por escena: el `scene.environment` (IBL) da el
   * realismo premium cuando WebGL corre en GPU, pero con implementaciones
   * por software (SwiftShader o fallbacks) no ilumina nada y los modelos
   * salen negros. Las luces directas garantizan visibilidad en todo contexto.
   */
  private addStudioLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    this.scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffffff, 1.15)
    key.position.set(3, 5, 4)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0xffffff, 0.45)
    rim.position.set(-4, 2, -3)
    this.scene.add(rim)
  }

  private bindEvents() {
    if (this.polarActive) {
      this.canvas.addEventListener('pointerdown', this.onPointerDown)
      this.canvas.addEventListener('keydown', this.onKeyDown)
      window.addEventListener('pointermove', this.onPointerMove)
      window.addEventListener('pointerup', this.onPointerUp)
    }
  }

  private onPointerDown = (e: PointerEvent) => {
    this.dragging = true
    this.lastX = e.clientX
    this.lastY = e.clientY
    try {
      this.canvas.setPointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.dragging) return
    const dx = e.clientX - this.lastX
    const dy = e.clientY - this.lastY
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.theta += dx * 0.006
    this.phi = Math.min(PHI_MAX, Math.max(PHI_MIN, this.phi - dy * 0.004))
  }

  private onPointerUp = (e: PointerEvent) => {
    this.dragging = false
    try {
      this.canvas.releasePointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') this.theta += 0.12
    else if (e.key === 'ArrowRight') this.theta -= 0.12
    else if (e.key === 'ArrowUp') {
      this.phi = Math.min(PHI_MAX, this.phi + 0.08)
    } else if (e.key === 'ArrowDown') {
      this.phi = Math.max(PHI_MIN, this.phi - 0.08)
    } else return
    e.preventDefault()
  }

  private scheduleResize() {
    const parent = this.canvas.parentElement
    if (!parent) return
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(parent)
    this.resize()
  }

  private resize() {
    const parent = this.canvas.parentElement
    if (!parent) return
    const w = parent.clientWidth
    const h = parent.clientHeight
    if (!w || !h) return
    this.gpu?.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  async setModel(src: string) {
    const group = await engine.loadModel(src)
    if (this.disposed) return
    if (this.model) this.group.remove(this.model)
    this.model = group.clone(true)
    this.group.add(this.model)
    this.fitCamera()
    if (this.opts.scan) this.addScan()
  }

  setFrame(pose: FramePose) {
    if (!this.model) return
    const bbox = new THREE.Box3().setFromObject(this.model)
    const size = bbox.getSize(new THREE.Vector3())
    const center = bbox.getCenter(new THREE.Vector3())
    const axis =
      size.x >= size.y && size.x >= size.z
        ? new THREE.Vector3(1, 0, 0)
        : size.y >= size.z
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(0, 0, 1)
    const axisLen = Math.max(size.x, size.y, size.z)
    const offset = axis.multiplyScalar((pose.axis ?? 0) * (axisLen / 2) * 0.85)
    const target = center.clone().add(offset)
    this.fov = pose.fov ?? NEUTRAL_FOV
    this.theta = pose.theta ?? NEUTRAL_THETA
    this.phi = pose.phi ?? NEUTRAL_PHI
    this.radius = this.baseRadius * (pose.radius ?? 1)
    this.camera.fov = this.fov
    this.camera.updateProjectionMatrix()
    this.lookTarget.copy(target)
  }

  resetFrame() {
    this.fitCamera()
  }

  setAutoRotate(on: boolean) {
    this.autoRotateOn = on && this.opts.mode !== 'static'
  }

  private fitCamera() {
    if (!this.model) return
    const bbox = new THREE.Box3().setFromObject(this.model)
    const size = bbox.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    this.baseRadius =
      maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(this.fov / 2)))
    this.radius = this.baseRadius * 1.45
    this.lookTarget.copy(bbox.getCenter(new THREE.Vector3()))
    this.scanBounds = {
      minY: bbox.min.y + (bbox.max.y - bbox.min.y) * 0.08,
      maxY: bbox.max.y - (bbox.max.y - bbox.min.y) * 0.08,
    }
    this.scanY = this.scanBounds.minY
  }

  private addScan() {
    if (this.scanMesh || !this.model) return
    const geo = new THREE.PlaneGeometry(1, 1)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.scanMesh = new THREE.Mesh(geo, mat)
    this.group.add(this.scanMesh)
    this.placeScan()
  }

  private placeScan() {
    if (!this.scanMesh || !this.model) return
    const bbox = new THREE.Box3().setFromObject(this.model)
    const size = bbox.getSize(new THREE.Vector3())
    this.scanMesh.scale.set(size.x * 1.2, 0.02, size.z * 1.2)
    this.scanMesh.position.set(0, this.scanY, 0)
  }

  update(dt: number) {
    if (this.disposed || !this.gpu) return
    if (!this.active) return
    if (this.autoRotateOn && !this.dragging) {
      this.theta += (this.opts.autoRotateSpeed ?? 0.35) * dt
    }
    if (this.scanMesh?.visible) {
      const span = this.scanBounds.maxY - this.scanBounds.minY
      if (span > 0) {
        this.scanY += this.scanDir * span * 0.16 * dt
        if (this.scanY >= this.scanBounds.maxY) {
          this.scanY = this.scanBounds.maxY
          this.scanDir = -1
        } else if (this.scanY <= this.scanBounds.minY) {
          this.scanY = this.scanBounds.minY
          this.scanDir = 1
        }
        this.placeScan()
      }
    }
    this.group.rotation.y = this.theta
    this.camera.position.setFromSphericalCoords(this.radius, this.phi, 0)
    this.camera.position.add(this.lookTarget)
    this.camera.lookAt(this.lookTarget)
    this.gpu.renderer.render(this.scene, this.camera)
  }

  setActive(on: boolean) {
    this.active = on
  }

  teardown() {
    this.disposed = true
    if (this.gpu) this.gpu.owner = null
    if (this.polarActive) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDown)
      this.canvas.removeEventListener('keydown', this.onKeyDown)
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerUp)
    }
    this.ro?.disconnect()
    if (this.scanMesh) {
      this.scanMesh.geometry.dispose()
      const material = this.scanMesh.material
      if (Array.isArray(material)) material.forEach((m) => m.dispose())
      else material.dispose()
    }
    this.scene.clear()
  }
}