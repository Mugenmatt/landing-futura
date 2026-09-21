---
target: revisión de calidad de código de la landing (todo src/)
timestamp: 2026-09-16T16:37:35Z
slug: code-quality-review
verification: 'npm run lint ✓ · npm run build ✓ (tsc -b + vite) sin errores'
score_summary: '0 críticos / 4 mayores / 10 menores'
---

# Revisión de calidad de código — NEO-CYBERNETICS

## 1. Header

| | |
|---|---|
| **Rama** | `main` @ `2d22739` (working tree limpio salvo este doc) |
| **Stack** | React 19 + TS 6 + Vite 8 + three 0.186 (única dep. de runtime) |
| **Verificación** | `eslint .` OK · `tsc -b && vite build` OK (627 ms, sin type errors) |
| **Bundle** | `index` 265 KB (gzip 82 KB) + chunk `engine` 625 KB (gzip 158 KB) lazy via `import()` |
| **Scope** | Componentes, hooks, motor three, content-as-data, estilos |

## 2. Overview

La arquitectura es una vertical slice limpia y bien separada por responsabilidades:

- `src/content/content.ts` es la única fuente de datos (alineado con `CONTENT.md`); los componentes no hardcodean copy ni specs.
- `src/three/engine.ts` encapsula **todo** three.js en un singleton: un solo `requestAnimationFrame` global, loader GLTF + Draco compartido, cache de modelos y un techo de `MAX_VIEWS = 6` contextos WebGL.
- `src/three/useModelView.ts` monta cada vista con `IntersectionObserver`, desactiva el render fuera de viewport (`setActive`) y libera el contexto al desmontar usando `renderer.dispose()` (con el comentario correcto de por qué no `forceContextLoss`).
- Los scroll handlers (Navbar, ProductShowcase) están throttled con rAF y listeners `passive: true`.
- `prefers-reduced-motion` está bien atendido: hook reactivo + reset global CSS + `mode:'static'` en el motor + `behavior:'auto'` en `scrollTo`/`scrollIntoView`.

Es código deliberado, con decisiones documentadas *in situ* (bake del bind pose, por qué no usar IBL/envMap, por qué no reusar contextos). El promedio de calidad está muy por encima de una landing típica; los hallazgos que siguen son pulido, no reconstrucción.

## 3. What works

1. **Motor three como pivote único** (`engine.ts`): el riesgo "three.js sin justificar" del proyecto se mitigó limitando la dependencia a un archivo, lazy-loading y un renderer por modalidad. La normalización (`bakeStaticBindPose` + `orientUpright` + wrapper escalado) tiene comentarios que explican el "por qué" de cada paso no obvio.
2. **Gestión de ciclo de vida impecable** en `useModelView` / `ModelView`: `cancelled` cubre la carrera entre desmontaje y resolución del `import()`; `teardown()` desconecta listeners y `ResizeObserver`; la cache de modelos evita re-descargas de los 8 GLB.
3. **Accesibilidad funcional, no decorativa**: skip link, `aria-pressed` en cotización, `aria-live` con anuncios presellados, `aria-busy` en canvas, `role="progressbar"` en el track del showcase, `aria-modal` + restore de foco + Esc en el Spotlight.
4. **Movimiento correctamente orquestado**: `RevealOnScroll` se desconecta al primer intersect; `showroom.goTo` lee layout en batch y respeta reduced-motion; sin layout thrashing evidente.
5. **`content.ts` tipado** (`satisfies Link`, `satisfies ChartSegment[]`, etc.): los datos ficticios no se pueden descuadrar del contrato sin romper el build.

## 4. Issues

### 4.1 Critical

Ninguno. Lint/build verdes, sin bugs de seguridad ni pérdida de datos, y el patrón de release de WebGL es correcto en el flujo normal (incluido StrictMode dev).

### 4.2 Major

**M1. Error path del motor → canvas en blanco, no poster** (`Viewer3D.tsx:138-157`, `engine.ts:231`).
`usePoster` solo cubre "sin WebGL / pointer coarse". Si `engine.requestView` devuelve `null` (techo de `MAX_VIEWS=6` alcanzado) o `setModel` rechaza, `status` queda `'error'` y `busy` es `false` → se renderiza un `<canvas>` vacío sin poster ni loader. Hoy el pico real es ~5 vistas concurrentes (3 cards + hero + showcase/pospot), bajo el techo, pero el fallo degrada mal: debería caer al `poster` igual que sin WebGL.

**M2. Catálogo con N contextos WebGL vivos re-renderizando idle** (`Catalog.tsx:44-57`, `engine.ts:636-661`).
Las 3 cards con modelo montan cada una un `Viewer3D`; al estar en el mismo viewport, los 3 (más el hero arriba) corren `renderer.render()` en **todos** los frames aunque el `turntable` esté quieto (`autoRotate` es falso hasta el hover). En GPU de gama baja o SwiftShader es 3-4 render passthrough por frame sin duda algo visible. La regla "Rendimiento > Fluidez > Calidad" del proyecto justifica un dirty-flag de render (skippear cuando nada cambió).

**M3. Spotlight `aria-modal="true"` sin focus trap** (`Showroom.tsx:94-125`).
Tab sale del diálogo al documento de fondo. Hay restore de foco al cerrar y Esc, pero un lector de pantalla serializa el fondo detrás del modal. Fix de 10 líneas (trap de Tab ciclando dentro del panel) o `inert` en el resto.

**M4. Preloader bloquea 4.5–5.1 s por load, ignora reduced-motion** (`Preloader.tsx:41-66`).
El temporizador es wall-clock (no depende de que el hero esté listo), sigue corriendo con `prefers-reduced-motion: reduce` (el CSS congela las animaciones pero los `setInterval`/`setTimeout` siguen), y `role="status"` + `aria-live="polite"` sobre `preloader-boot-line` re-anuncia una línea que cambia cada 420 ms → ruido para screen readers. Es la misma conclusión que la critique de diseño anterior: acortar / volver dismissible / saltarlo con reduced-motion.

### 4.3 Minor

1. **Pool de renderers muerto** (`engine.ts:206-213`): `acquireGpu` solo reusa una `GpuView` si su `canvas` coincide con el pedido, lo que nunca ocurre (un canvas vive y muere con una vista). Cada `requestView` crea un `WebGLRenderer` y cada `releaseView` lo destruye → churn de contextos en navegación rápida del showroom y bajo StrictMode. El comentario "se reutilizan vía pool" es engañoso; el beneficio real es la pausa por viewport, no la reutilización. Documentar o intentar un cap real.
2. **`as Record<string, string>` sobre `model`** en `Catalog.tsx:15` y `Showroom.tsx:8`: rompe el tipado literal de `three/models.ts`. Un typo en una clave pasa al build como `undefined` en el `src` y falla en runtime. Mejor un helper `resolveModel(key: string): string | undefined`.
3. **Video de Human sin fallback ni BASE_URL** (`Human.tsx:16-27`): `/video/nosotros-video.mp4` es una ruta absoluta (rompe si el sitio se sirve desde un subpath) y no hay `onError` → poster + texto inline si el asset falta. Además `autoPlay+loop` descarga aunque la sección esté muy abajo; un play gateado por `IntersectionObserver` + pausa fuera de viewport reduciría datos y GPU.
4. **`error` vs. poster en `useModelView`** (ampliación de M1): el estado `'error'` no se propaga como prop; `status` se usa solo para `busy`. Si se añade el poster-on-error, tiene que venir de acá.
5. **Hover de cards re-renderiza todo el subtree** (`Catalog.tsx:23-57`): `onPointerEnter/Leave` → `setHover` → re-render de `ProductCard` + `Viewer3D` en cada entrada/salida del ratón al pasar entre cards. Barato hoy, pero se arregla con un `useCallback` en el toggle y/o memo de la card.
6. **Typo "Sinck FAIL"** (`Preloader.tsx:26`): si es glitch intencional, ok; si no, corregir a "Sync FAIL".
7. **`useInViewport` con `IntersectionObserver` ausente** (`useInViewport.ts:8-10`) devuelve `inView=true` por defecto: correcto (fallback progresivo) pero `RevealOnScroll` revela y nunca vuelve a ocultar; si en el futuro se anima en ambas direcciones, habrá que re-observar.
8. **`scene.clear()` no libera geometría/`materiales clonados** (`engine.ts:683`): los clones comparten geometría/material de la cache de modelos, de modo que está acotado a los 8 GLB; correcto hoy, pero conviene un comentario que explique la decisión para que no se "arregle" con `dispose()` doble en el futuro.
9. **Capítulo `draco_decoder-fzg4nYZr.js` de 719 KB** (gzip 158 KB junto al engine): lazy, aceptable. Si la landing se abre en 3G móvil sin WebGL (poster path), ese chunk igual se descarga porque el `import()` corre antes de saber que se usará poster. Podría gatearse el `import()` con `supportsWebGL()`.

## 5. Suggestions

1. **Poster-on-error** en `Viewer3D`: `status === 'error' || usePoster` → renderizar `poster ?? PosterFallback`. Cubre M1 y 4 en un solo cambio.
2. **Focus trap / `inert`** en el Spotlight (M3). El patrón minimalista: en `Spotlight`, handler `keydown` de `Tab` que recicle focus dentro de `.spotlight-panel`.
3. **Dirty-flag en `ModelView.update`**: llevar un contador de suciedad (`theta`/`phi`/`scanY`/modelo cargado); si nada cambió, `return` sin llamar `renderer.render`. Reduce el costo de las cards idle (M2) sin tocar la arquitectura.
4. **Resolver tipado de modelos**: `export const getModel = (key: string) => model[key as keyof typeof model]` en `three/models.ts` y reemplazar ambos `as Record<string,string>`.
5. **Preloader**: reducir a contenido listo (~1.2 s), dismissible (click/Espacio), y con `matchMedia('(prefers-reduced-motion: reduce)')` → saltar la pantalla. Cambiar el `role="status"` por un label estático (`aria-hidden` en el boot line que rota).
6. **Video de Human**: `import.meta.env.BASE_URL + 'video/…'`, `onError` → fallback poster, y play/pausa con `IntersectionObserver` respetando `prefers-reduced-motion`.
7. **`content-visibility: auto`** en secciones largas bajo el fold (manifesto, showcasing) con `contain-intrinsic-size`; cuidado con el sticky del showcase (no aplicar ahí). Es el win de perf más barato que queda.
8. **Gatear el `import('./engine')`** con `supportsWebGL()` antes de pedir el chunk en dispositivos que usarán poster (aplica también a reducir descarga en móvil sin WebGL).

## Verdict

Código sólido y maduro: tipado de datos, ciclo de vida del motor, a11y y reduced-motion están por encima de la norma. Lo que queda pendiente son 4 temas acotados — error path del 3D, re-render idle del catálogo, focus trap del modal y un preloader que cobra caro cada load — ninguno requiere reestructurar. Orden sugerido: M1 → M3 → M2 → S7 (los dos primeros son fixes chicos y de alto impacto para usuarios de riesgo).