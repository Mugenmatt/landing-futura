# NEO-CYBERNETICS — Landing (portfolio / práctica)

Landing page de una sola página para **NEO-CYBERNETICS**, una empresa ficticia de aumentos biométricos ambientada en Neo-Tokio, 2049. Estética cyberpunk/dashboard: fondo oscuro, 4 acentos neón con rol fijo, lenguaje de UI en mayúsculas y datos técnicos estilo sistema. Proyecto de portfolio, sin backend.

## Qué hay en la página

```
Navbar        logo + StatusPill ("ESTADO DEL SISTEMA — ENLACE NEURAL: ESTABLE") + CTA
Hero          "RECUPERA TUS LÍMITES." + esquemático SVG biomecánico con parallax
Manifiesto    4 pilares (Precisión · Integración · Materiales · Adaptación)
Catálogo      buscador + filtro por categoría (client-side) y 4 productos tipo código
              └─ DataViz (dona + línea en SVG a mano) · Métricas de Rendimiento
              └─ Soporte de Emergencia (CTA danger) · panel lateral "NEO-TOKYO 2049"
Ingeniería    4 stats con contador animado y sparklines SVG
Showcase      ensamblaje del BRAZO_AUMENTADO_V4, scroll-linked (sticky + progreso 01/04)
Humana        "La tecnología no reemplaza lo humano."
CTA final     "SOLICITAR DIAGNÓSTICO"
Footer        copyright 2049 + certificación bio-seguridad
```

Notas de implementación:

- **"AGREGAR AL CARRITO" es decorativo**: pasa a "AGREGADO ✓" ~2 s (estado local por card), sin carrito.
- Los gráficos (dona, línea, barras) son **SVG/CSS dibujados a mano**, sin librerías de charts.
- El catálogo filtra 100% client-side con dos `useState` sobre `src/content/content.ts`.
- Responde a `prefers-reduced-motion` (parallax, contadores y pulso se desactivan).
- Todo el texto proviene de `CONTENT.md` → `src/content/content.ts` (no hay copy hardcodeado en JSX).

## Stack

- React 19 + TypeScript + Vite
- CSS moderno (custom properties, sin framework de utilidades)
- Sin librerías de 3D/animación: hero en SVG + parallax por `transform`, reveals con `IntersectionObserver`, todo SVG/CSS

## Documentación

`DESIGN.md` (sistema visual), `CONTENT.md` (copys y datos ficticios, fuente única), `ARCHITECTURE.md` (estructura y decisiones técnicas) y `TASKS.md` (backlog) son la fuente de verdad del proyecto. Leelos antes de tocar código; `AGENTS.md` resume las reglas del repo.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción en /dist
npm run lint     # eslint
npm run preview  # preview del build
```

## Reglas del proyecto

- Cada sección lee su contenido desde `src/content/content.ts` (tipado, espejo de `CONTENT.md`).
- Antes de sumar una dependencia nueva hay que justificar por qué CSS/SVG/Canvas nativo no alcanza.
- Mobile-first, `prefers-reduced-motion` respetado, foco visible en todo lo interactivo.
- Rebranding antes: **NEXUS** (nombre provisorio original); la marca actual es NEO-CYBERNETICS.