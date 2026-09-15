# TASKS.md — Backlog de NEXUS

Tareas chicas, en orden sugerido. Marcá con [x] a medida que avanzás — así una sesión nueva de IA sabe exactamente dónde quedó el proyecto sin que tengas que reexplicar todo.

## Fase 0 — Base del proyecto
- [x] Setup Vite + React + TypeScript
- [x] `styles/tokens.css` con la paleta y tipografía de `DESIGN.md`
- [x] `content/content.ts` tipado, cargando los textos de `CONTENT.md`
- [x] Layout base: `Navbar` + `Footer` + estructura semántica de `main`

## Fase 1 — Secciones estáticas (sin motion todavía)
- [x] Hero (solo layout + copy, sin 3D/animación aún)
- [ ] Manifesto/Tecnología (4 pilares)
- [ ] Productos (3 cards)
- [ ] Ingeniería (4 stats, sin animar números todavía)
- [ ] Sección humana
- [ ] CTA final

## Fase 2 — Motion y microinteracciones
- [ ] Hook `useInViewport` + reveal animations en Manifesto/Ingeniería
- [ ] Contador animado de los 4 stats de Ingeniería
- [ ] Hover states de las cards de producto
- [ ] Navbar: cambio de estado al hacer scroll
- [ ] Respetar `prefers-reduced-motion` en todo lo anterior

## Fase 3 — Elemento hero (3D o alternativa)
- [ ] Decidir con `ARCHITECTURE.md` (sección "Decisión sobre 3D") si el elemento del hero es imagen+CSS, SVG, o three.js
- [ ] Implementar reacción sutil a mouse/scroll
- [ ] Fallback mobile / reduced-motion

## Fase 4 — Product Showcase (sección experimental)
- [ ] Estructura scroll-linked (IntersectionObserver + progreso)
- [ ] Aparición progresiva de datos técnicos y componentes del NEXUS Arc-7

## Fase 5 — Responsive y performance
- [ ] Pasada completa mobile/tablet
- [ ] Optimización de imágenes (WebP/AVIF, srcset)
- [ ] Code splitting de la escena 3D (si existe)
- [ ] Medición Lighthouse y ajustes

## Fase 6 — SEO y accesibilidad
- [ ] Meta title/description, Open Graph básico
- [ ] Revisión de headings y alt text
- [ ] Navegación por teclado y foco visible en toda la página
- [ ] Chequeo de contraste (AA)

## Fase 7 — Pulido final
- [ ] Pasada de "restraint": revisar si hay algo que se pueda sacar (ver `DESIGN.md`)
- [ ] Revisión de copy final contra `CONTENT.md`
