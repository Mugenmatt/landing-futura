# TASKS.md — Backlog de NEO-CYBERNETICS

Tareas chicas, en orden sugerido. Marcá con [x] a medida que avanzás — así una sesión nueva de IA sabe exactamente dónde quedó el proyecto sin que tengas que reexplicar todo.

> **Nota de pivote:** la marca cambió de NEXUS a **NEO-CYBERNETICS** (Neo-Tokio 2049 / dashboard, ver `CONTENT.md`). Las Fases 0–7 se implementaron sobre el concepto NEXUS; la **Fase 1.5 (Catálogo/Dashboard)** es el retrofit post-pivote: reemplazó la sección "Productos" (3 cards, eliminada) por el catálogo/dashboard y rebautizó el Product Showcase al producto destacado del catálogo (BRAZO_AUMENTADO_V4). Por eso su número no es secuencial.

## Fase 0 — Base del proyecto
- [x] Setup Vite + React + TypeScript
- [x] `styles/tokens.css` con la paleta y tipografía de `DESIGN.md`
- [x] `content/content.ts` tipado, cargando los textos de `CONTENT.md`
- [x] Layout base: `Navbar` + `Footer` + estructura semántica de `main`

## Fase 1 — Secciones estáticas (sin motion todavía)
- [x] Hero (solo layout + copy, sin 3D/animación aún)
- [x] Manifesto/Tecnología (4 pilares)
- [x] Productos (3 cards)
- [x] Ingeniería (4 stats, sin animar números todavía)
- [x] Sección humana
- [x] CTA final

## Fase 1.5 — Catálogo / Dashboard (retrofit NEO-CYBERNETICS)
- [x] SearchBar + CategoryFilter (filtrado client-side sobre content.ts, dos useState)
- [x] ProductGrid con los 4 productos (nomenclatura tipo código; reemplaza Products.tsx)
- [x] Botón "AGREGAR AL CARRITO" con estado local decorativo (→ "AGREGADO ✓" ~2 s, sin carrito real)
- [x] DataVizPanel: donut + línea en SVG a mano (`stroke-dasharray` + `polyline`)
- [x] PerformanceMetricsPanel: barras en divs/SVG a mano
- [x] EmergencySupportPanel (iconos + conectores + CTA danger)
- [x] StatusPill en navbar con pulso CSS (dot verde) — y rebaranda completa de Navbar/Footer/Hero a NEO-CYBERNETICS

## Fase 2 — Motion y microinteracciones
- [x] Hook `useInViewport` + reveal animations en Manifesto/Ingeniería
- [x] Contador animado de los 4 stats de Ingeniería
- [x] Hover states de las cards de producto
- [x] Navbar: cambio de estado al hacer scroll
- [x] Respetar `prefers-reduced-motion` en todo lo anterior

## Fase 3 — Elemento hero (3D o alternativa)
- [x] Decidir con `ARCHITECTURE.md` (sección "Decisión sobre 3D") si el elemento del hero es imagen+CSS, SVG, o three.js — **resuelto: SVG + parallax por `transform`, sin three.js**
- [x] Implementar reacción sutil a mouse/scroll
- [x] Fallback mobile / reduced-motion

## Fase 4 — Product Showcase (sección experimental)
- [x] Estructura scroll-linked (IntersectionObserver + progreso)
- [x] Aparición progresiva de datos técnicos y componentes del BRAZO_AUMENTADO_V4

## Fase 5 — Responsive y performance
- [x] Pasada completa mobile/tablet — se compactó el panel del Showcase (SVG e interlineado menor, panel fijado a 100svh) y se agregó fallback `overflow-y` para pantallas cortas (landscape)
- [x] Optimización de imágenes (WebP/AVIF, srcset) — **N/A: todo el contenido visual es SVG inline (HeroVisual, ArmSchematic, sparklines), no hay raster images en `public/` ni `src/assets/`**
- [x] Code splitting de la escena 3D (si existe) — **N/A: no hay escena 3D (decisión de Fase 3), el JS total es ~235 kB (73 kB gzip) y no hay secciones pesadas que dividir**
- [x] Medición Lighthouse y ajustes — `npm run build` y `npm run lint` limpios; fonts de Google cargadas async (sin render-blocking) + `preconnect`; ajustes de la pasada manual (ver arriba)

## Fase 6 — SEO y accesibilidad
- [x] Meta title/description, Open Graph básico — title/description/OG ya existían; se sumó `canonical`, `og:site_name`, `og:locale es_AR`, `twitter:card`
- [x] Revisión de headings y alt text — 1 solo `h1` (Hero), jerarquía sin saltos (h2 de sección → h3 de item); no hay `<img>`, todos los SVG decorativos llevan `aria-hidden="true"`
- [x] Navegación por teclado y foco visible en toda la página — `:focus-visible` global con outline cyan + glow (`globals.css`), skip-link a `#main`, todos los interactivos son `<a>` reales
- [x] Chequeo de contraste (AA) — `--text-secondary` #7A8494 ≈ 5.4:1 sobre `--bg-base` y ≈ 4.9:1 sobre `--bg-surface` (pasa AA en cuerpo); cyan #00FFFF ≈ 16:1; primary #F2F4F8 alto

## Fase 7 — Pulido final
- [x] Pasada de "restraint": revisar si hay algo que se pueda sacar (ver `DESIGN.md`) — se mantuvo todo con intención (`.btn--danger` es variante del sistema de DESIGN.md aunque hoy no se use); sin flechitas "→", sin 4 neones en un mismo componente
- [x] Revisión de copy final contra `CONTENT.md` — se corrigió "retroalimentación **táctica**" → "**táctil**" en `content.ts` (step del Showcase BRAZO_AUMENTADO_V4); el resto coincide 1:1