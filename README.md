# NEXUS — Landing de prótesis biomecánicas

Landing page de una sola página para **NEXUS** (nombre provisorio), una empresa ficticia de prótesis y componentes biomecánicos avanzados. Es un proyecto de portfolio/práctica, sin backend.

## Stack

- React + TypeScript + Vite
- CSS moderno (custom properties, sin framework de utilidades)
- Sin librerías de 3D/animación: el elemento del hero es SVG + parallax por `transform`

## Documentación

Los archivos `DESIGN.md`, `CONTENT.md`, `ARCHITECTURE.md` y `TASKS.md` son la fuente de verdad del proyecto: sistema visual, copys ficticios, decisiones técnicas y backlog. Leelos antes de tocar código.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción en /dist
npm run lint     # eslint
npm run preview  # preview del build
```

## Reglas del proyecto

- Cada sección lee su contenido desde `src/content/content.ts` (tipado, espejo de `CONTENT.md`), no hardcodeado en el JSX.
- Antes de sumar una dependencia nueva hay que justificar por qué CSS/SVG/Canvas nativo no alcanza.
- Mobile-first, `prefers-reduced-motion` respetado, foco visible en todo lo interactivo.