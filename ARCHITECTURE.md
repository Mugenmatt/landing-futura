# ARCHITECTURE.md — Arquitectura técnica de NEO-CYBERNETICS

## Estructura de carpetas propuesta

```
src/
  components/
    layout/        Navbar, Footer
    sections/       Hero, Manifesto, Catalog, Engineering,
                     ProductShowcase, Human, FinalCTA
    ui/             Button, StatNumber, RevealOnScroll, StatusPill,
                     SearchBar, CategoryFilter, MetricBars, DataVizPanel,
                     PerformanceMetricsPanel, SideMetricsPanel,
                     EmergencySupportPanel, icons (mano biónica, user, etc.)
  content/          content.ts (importa/tipa lo que vive en CONTENT.md)
  hooks/            useReducedMotion, useInViewport, useScrollProgress
  styles/           tokens.css (paleta/tipografía de DESIGN.md), globals.css
  three/            Motor 3D singleton (engine.ts, useModelView.ts, models.ts,
                     support.ts) — único uso de three.js, lazy y compartido
  assets/           imágenes/renders optimizados
```

Cada sección es un componente aislado que recibe su contenido desde `content/`, no hardcodeado adentro — así cambiar un texto no implica tocar JSX.

## Sección Catálogo / Dashboard

Reemplaza a la sección simple de 3 cards de producto (Products.tsx, eliminado) por una interfaz tipo dashboard embebida en la landing (`sections/Catalog.tsx`, id `#catalogo`):

- `SearchBar` + `CategoryFilter`: filtrado 100% client-side sobre el array estático de `content.ts` — dos `useState` alcanzan, sin backend ni librería de forms.
- `ProductGrid` (`Catalog.tsx`): grid de cards (BRAZO_AUMENTADO_V4, UNIDAD_OCULAR_V9, PIERNA_DE_REEMPLAZO_MK2, REFUERZO_ESPINAL). Cada card: categoría, nombre tipo código, descripción corta, specs, botón "AÑADIR A COTIZACIÓN" (toggle en sesión → "EN COTIZACIÓN ✓"). La acción secundaria es por producto: el destacado (BRAZO_AUMENTADO_V4, vía `productShowcase.productId`) ofrece "VER ENSAMBLAJE" (`#showcase`); los demás ofrecen "SOLICITAR DIAGNÓSTICO" (`mailto:` con subject prellenado `DIAGNÓSTICO: <código>`).
- `QuotePanel` (`ui/QuotePanel.tsx`): panel "SESIÓN DE COTIZACIÓN" que aparece al agregar componentes (estado `useState` `Set<string>` en `Catalog`, sin backend ni persistencia); lista de códigos con botones "QUITAR DE COTIZACIÓN" y CTA "SOLICITAR COTIZACIÓN" → `mailto` con subject prellenado con los códigos. Los cambios se anuncian con una región `aria-live` y el estado no revierte solo.
- `DataVizPanel` (dona + línea) y `PerformanceMetricsPanel` (barras): **sin librería de charts** — SVG dibujado a mano (dona con `stroke-dasharray` acumulado, línea con `polyline`/`polygon`, barras con divs y ancho en %). Son decorativos, con datos fijos de `content.ts`.
- `SideMetricsPanel` (panel lateral "Métricas de Rendimiento"): header "NEO-TOKYO 2049" + barras MIEMBROS/ESPINAL/ORGANOS/RED/CPU; sticky en desktop, apilado abajo en mobile.
- `EmergencySupportPanel`: fila de 3 iconos con conectores SVG + CTA de alerta ("SOPORTE DE EMERGENCIA", variante danger).
- `StatusPill` (navbar): dot con `animation: pulse` en CSS puro + texto de estado.

Mantiene la regla general del proyecto: nada de esto necesita three.js ni una librería de gráficos — es todo SVG/CSS/estado local de React.

## Decisión sobre 3D

**Fase 4 (implementada):** los modelos GLB del hero/showroom pasan a ser el artefacto protagonista con un motor three.js **singleton y lazy**, sin dejar de cumplir el orden de evaluación de esta sección (CSS/SVG primero). Justificación de la dependencia (regla dura del repo): *el render real del hardware en profundidad —turntable, encuadres por paso, scan sweep— requiere un motor 3D; se limita a un solo `src/three/` y un único WebGL context pool bajo un mismo render loop.* No hay animación de fondo que CSS/SVG no resuelva por separado.

Reglas que se mantienen de la evaluación previa:
- Un único punto de uso real: `src/three/` (no escenas three.js independientes por sección).
- Carga con `React.lazy`/dynamic import: `three` entra como chunk aparte (`engine-*.js`) solo cuando un viewport del 3D se monta de verdad.
- Pausar el render loop cuando el viewport no está visible (IntersectionObserver continuo) y con `document.hidden`.
- Fallback estático (poster SVG/diagrama) en `pointer: coarse`, sin WebGL, o con `prefers-reduced-motion` + sin WebGL.

### Motor 3D (`src/three/`)

- `engine.ts` — singleton `engine` + clase `ModelView`:
  - **Un solo render loop** global (un rAF) que recorre las vistas activas (las no visibles se saltan el render).
  - **Pool de renderers acotado** (`MAX_VIEWS = 6`): los contextos WebGL se crean con pereza, se reutilizan y se liberan al desmontar (límites de contexto de los browsers, ~8–16).
  - Loader GLB + **DRACO** compartido, `scene.environment` con `RoomEnvironment` (los metales PBR no deben verse negros), tonemapping ACES.
  - **Cache de modelos** por URL: un único decode por archivo; cada vista clona el grupo (normalizado a `MODEL_FIT_SIZE = 3` y centrado). Nunca se `dispose()`an geometrías compartidas (rompe el cache).
  - Encadre de cámara por `setFrame(FramePose)` con `axis` (fracción sobre el eje largo) para los pasos del showcase; scan sweep cyan como "diagnóstico".
- `useModelView.ts` — hook que monta/desmonta la vista (lazy import del engine), la pausa fuera de viewport e idempotente bajo StrictMode; `status` para overlays de carga.
- `models.ts` — URLs de los GLB optimizados + presets de cámara por paso. `support.ts` — `supportsWebGL()` sin arrastrar three (import estático seguro).
- `components/ui/Viewer3D.tsx` — widget reutilizable: poster cuando coarse/sin WebGL, `mode` (`drift` hero, `orbit` showcase, `turntable` cards/spotlight, `static` reduced-motion), `role="img"` + `aria-label` con el código del módulo, teclado (flechas) solo en `orbit` + `pointer: fine`.

### Assets 3D

- Origen `public/models3D/*.glb` (~80MB crudos). Se sirve la carpeta `public/models3D/optimized/` procesada con `@gltf-transform/cli --compress draco --texture-compress webp --texture-size 1024` (−92%: ≈6.3MB en total). Decoder en `public/models3D/draco/` (copiado de `three/examples/jsm/libs/draco/`).
- **Presupuesto:** carga lazy por modelo (solo al montar su vista), el hero seria el mayor ~1.5MB; nunca precargar los 7 juntos. **Anti-goals:** sin escenas three.js por sección, sin drag en coarse/reduced-motion, sin modelo inventado para `REFUERZO_ESPINAL` (card de código, sin malla), sin los 4 acentos neón en la misma vista 3D.
- **Riesgo de licencia:** verificar licencia de los GLB descargados antes de un deploy público.

## Animaciones (no-3D)

- **CyberBackdrop (2026-09)**: el fondo ambiente animado es un **único canvas 2D fijo** (`z-index: -1`, `pointer-events: none`, `aria-hidden`) montado como primer hijo de `App`. Justificación de la decisión técnica (regla dura del repo, CSS/SVG/Canvas nativo primero): docenas de glifos de data rain + partículas + glifos HUD en movimiento simultáneo serían cientos de nodos DOM/SVG churn-eando layout; un solo canvas los dibuja en una superficie a 60fps. No es three.js (2D plano, sin profundidad) y no introduce dependencias. Estrategia de rendimiento: un solo `requestAnimationFrame` con delta-time (dt clamp 0.1 s), `devicePixelRatio` capado a 2, pausa con `document.hidden`, densidades por `pointer: coarse` (menos columnas/partículas, sin scan sweep ni glitch), glitch programado cada 9–20 s. `prefers-reduced-motion` → dibuja UN frame estático y no arranca el loop. Ver `DESIGN.md` para el régimen de acentos y capas del fondo.

- CSS `@keyframes` + `transform`/`opacity` para la mayoría de reveals.
- `IntersectionObserver` (vía hook `useInViewport`) para disparar reveals y el conteo de números de Ingeniería — sin librerías de scroll externas si no hace falta.
- Product Showcase (scroll-linked): usar `IntersectionObserver` + progreso simple calculado en scroll, no una librería de scroll-jacking completa, salvo que la interacción lo requiera y se mida que no cuesta FPS.

## Performance

- Code splitting por sección pesada: el motor 3D (`three`) vive en su propio chunk (`engine-*.js`) y solo se importa cuando una vista 3D monta; los GLB se optimizan (Draco + WebP) y se cargan lazy por modelo.
- Imágenes: formato moderno (WebP/AVIF), `loading="lazy"` salvo el hero, tamaños responsivos con `srcset`.
- Evitar re-renders innecesarios: contenido estático fuera de estado de React donde se pueda.
- Ningún listener de `scroll`/`mousemove` sin throttle/rAF.
- Medir con Lighthouse (o el equivalente que tengas disponible) después de cada sección nueva, no solo al final.

## Responsive

- Mobile-first en CSS.
- En mobile (`pointer: coarse`) el 3D se reemplaza por poster estático (esquemático SVG del hero/showcase o diagrama); con `prefers-reduced-motion` fina se muestra el primer frame sin movimiento (`mode: static`). El parallax se reduce a un solo eje o se elimina.
- Breakpoints sugeridos: mobile (<640px), tablet (640–1024px), desktop (>1024px) — ajustar si el contenido lo pide, no por número redondo.

## Accesibilidad técnica

- Foco gestionado explícitamente si hay algún elemento custom (ej. exploración de producto).
- Todo lo posible en HTML semántico (`nav`, `main`, `section`, `footer`) antes de recurrir a `div` genérico.
