import type { FramePose } from './engine'

const O = `${import.meta.env.BASE_URL}models3D/optimized/`

/**
 * Map de modelos GLB (optimizados con Draco + texturas WebP).
 * Los nombres de archivo originales viven en CONTENT.md / public/models3D.
 */
export const model = {
  /** BRAZO_AUMENTADO_V4 — brazo canónico (hero ida, showcase, card catálogo). */
  armV4: `${O}l-x3-b_bionic_arm.glb`,
  /** UNIDAD_OCULAR_V9. */
  ocularV9: `${O}eye_implant.glb`,
  /** PIERNA_DE_REEMPLAZO_MK2. */
  legMk2: `${O}advanced_prosthetic_leg_design.glb`,
  /** Showroom — piezas adicionales. */
  cybman: `${O}cybman_v2.0.glb`,
  armSteel: `${O}tears_of_steel_bionic_arm.glb`,
  armProsthetic: `${O}robotic_prosthetic_arm.glb`,
  ocularRobotic: `${O}robotic_eye.glb`,
} as const

/**
 * Encuadres de cámara por paso del ensamblaje del BRAZO_AUMENTADO_V4.
 * `axis` es la posición a lo largo del eje largo del arm (-1 extremo, +1
 * extremo opuesto): encuadrar regiones del modelo ligadas al scroll.
 */
export const armShowcaseFrames: FramePose[] = [
  /* shell — vista completa del módulo */
  { axis: 0, radius: 1, theta: 0.45, phi: 1.25, fov: 36 },
  /* sensors — extremo distal (mano/sensores) */
  { axis: -0.7, radius: 0.8, theta: 0.95, phi: 1.08, fov: 30 },
  /* actuator — sección media (articulaciones) */
  { axis: 0.05, radius: 0.82, theta: 0.62, phi: 1.32, fov: 29 },
  /* anchor — extremo proximal (montaje neural) */
  { axis: 0.7, radius: 0.78, theta: 0.28, phi: 1.12, fov: 29 },
]