# ARCHITECTURE.md — Arquitectura técnica de NEXUS

## Estructura de carpetas propuesta

```
src/
  components/
    layout/        Navbar, Footer
    sections/       Hero, Manifesto, Products, ProductShowcase,
                     Engineering, Human, FinalCTA
    ui/             Button, StatNumber, RevealOnScroll, etc. (piezas chicas reusables)
  content/          content.ts (importa/tipa lo que vive en CONTENT.md)
  hooks/            useReducedMotion, useInViewport, useScrollProgress
  styles/           tokens.css (paleta/tipografía de DESIGN.md), globals.css
  three/            (solo si se justifica — ver más abajo) escena 3D del hero, aislada y lazy
  assets/           imágenes/renders optimizados
```

Cada sección es un componente aislado que recibe su contenido desde `content/`, no hardcodeado adentro — así cambiar un texto no implica tocar JSX.

## Decisión sobre 3D

Evaluar en este orden, sección por sección, antes de tocar three.js:

1. **¿Se puede resolver con una imagen/render pre-renderizado + CSS (parallax de capas, mask, transform 3D con perspective)?** Esto cubre la mayoría de "elemento que reacciona sutilmente al mouse/scroll".
2. **¿Se puede resolver con SVG animado (paths, filtros sutiles)?** Útil para diagramas de la sección Ingeniería/Manifesto.
3. **Solo si ninguna alcanza** (ej. el objeto 3D del Hero realmente necesita rotar en profundidad real): usar three.js, pero:
   - Un único canvas, cargado con `React.lazy` / dynamic import, solo en el Hero.
   - Geometría low-poly, sin post-processing pesado.
   - Pausar el render loop cuando el hero no está en viewport.
   - Fallback estático (imagen) si `prefers-reduced-motion` está activo o en gama baja de mobile.

No usar three.js "de fondo" en varias secciones — un solo punto de uso, muy cuidado, es más coherente con la prioridad de rendimiento que varias escenas livianas.

> **Decisión tomada (Fase 3):** el elemento del hero es **SVG + parallax por `transform`** (`components/ui/HeroVisual.tsx`), sin three.js. El esquemático de miembro biomecánico se resuelve con SVG estático y el parallax con `--px`/`--py` + `calc()` bajo el media query `(pointer: fine)` y solo si `prefers-reduced-motion: no-preference`. No hay escena 3D que code-splitear.

## Animaciones (no-3D)

- CSS `@keyframes` + `transform`/`opacity` para la mayoría de reveals.
- `IntersectionObserver` (vía hook `useInViewport`) para disparar reveals y el conteo de números de Ingeniería — sin librerías de scroll externas si no hace falta.
- Product Showcase (scroll-linked): usar `IntersectionObserver` + progreso simple calculado en scroll, no una librería de scroll-jacking completa, salvo que la interacción lo requiera y se mida que no cuesta FPS.

## Performance

- Code splitting por sección pesada (especialmente la escena 3D, si existe).
- Imágenes: formato moderno (WebP/AVIF), `loading="lazy"` salvo el hero, tamaños responsivos con `srcset`.
- Evitar re-renders innecesarios: contenido estático fuera de estado de React donde se pueda.
- Ningún listener de `scroll`/`mousemove` sin throttle/rAF.
- Medir con Lighthouse (o el equivalente que tengas disponible) después de cada sección nueva, no solo al final.

## Responsive

- Mobile-first en CSS.
- En mobile: el elemento 3D del hero (si existe) se reemplaza por imagen estática o versión sin post-processing; el parallax se reduce a un solo eje o se elimina.
- Breakpoints sugeridos: mobile (<640px), tablet (640–1024px), desktop (>1024px) — ajustar si el contenido lo pide, no por número redondo.

## Accesibilidad técnica

- Foco gestionado explícitamente si hay algún elemento custom (ej. exploración de producto).
- Todo lo posible en HTML semántico (`nav`, `main`, `section`, `footer`) antes de recurrir a `div` genérico.
