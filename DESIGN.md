# DESIGN.md — Sistema visual de NEXUS

Este documento fija las decisiones de diseño para que no cambien de sesión a sesión. Es una propuesta inicial coherente con el brief — se puede ajustar, pero una vez ajustado, actualizá este archivo (no dejes que el criterio quede solo en la cabeza del agente de turno).

## Por qué esta dirección (y qué evita)

Los brief de "landing futurista/tech" tienden a caer siempre en los mismos dos lugares: (a) negro casi puro + un acento neón verde o vermellón, o (b) cyberpunk de neón saturado tipo gamer. El brief pide explícitamente evitar ambos. La dirección elegida acá viene de los **materiales reales de una prótesis biomecánica**: titanio, fibra de carbono, aleaciones tibias, superficies cepilladas — no de la estética "hacker".

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#05060A` | Fondo principal (dark core) |
| `--bg-surface` | `#12121A` | Cards, paneles, navbar |
| `--bg-panel-alt` | `#1A1D2A` | Paneles secundarios / sidebars |
| `--border-glow` | `#0FF` (con opacidad baja para el borde en reposo, 100% en hover) | Bordes de cards y paneles activos |
| `--text-primary` | `#F2F4F8` | Texto principal |
| `--text-secondary` | `#7A8494` | Metadata, labels secundarias |
| `--neon-pink` | `#FF007F` | Acento 1 — alertas, highlights, hover de botones "danger"/destacados |
| `--cyber-blue` | `#00FFFF` | Acento 2 — botones primarios, bordes activos, data viz |
| `--violet-glare` | `#9400D3` | Acento 3 — estados "active", elementos seleccionados |
| `--electric-green` | `#00FF41` | Acento 4 — estados "success/stable", switches ON, métricas positivas |

Regla de uso (para que 4 neones no se peleen entre sí): cada acento tiene un rol fijo, no se usan intercambiablemente. Cyan = acción principal. Rosa = alerta/destaque puntual. Violeta = selección/estado activo. Verde = estado positivo/stable. Nunca los 4 en el mismo componente.

## Tipografía

- **Display (titulares, hero, headline):** estilo expandido/geométrico tipo "Akira Expanded" — si no está disponible como fuente libre, usar como alternativa **Michroma** o **Orbitron** (Google Fonts, gratuitas, mismo espíritu display-cyberpunk).
- **Cuerpo y datos técnicos:** una sans técnica/monoespaciada — usar **Space Mono** o **JetBrains Mono** para specs, contadores y labels de datos; **Rajdhani** o **Chakra Petch** para texto corrido más largo (mejor legibilidad que un monospace completo).
- Labels de UI (botones, tags, headers de panel) van en mayúsculas sostenidas — acá sí aplica, es parte del lenguaje visual de dashboard/HUD.
- Los títulos de sección pueden llevar doble tratamiento: una palabra en el acento cyan/rosa dentro del headline (ej. "THE FUTURE IS NOW" con una palabra en neón) — es un recurso propio de este estilo, se usa con moderación (una vez por sección, no en cada línea).

## Layout

- Alineación predominante: **izquierda**, no centrada. Una landing centrada y simétrica es el default genérico; el brief pide sensación de ingeniería/documentación técnica, que se lee más natural alineada a la izquierda con una grilla visible.
- Mucho espacio negativo — dejar que las secciones respiren, no llenar el viewport.
- Grilla de fondo sutil (líneas finas tipo blueprint) como recurso ocasional, no en toda la página.
- Numeración/eyebrows: usarlos únicamente donde el contenido es realmente secuencial (ej. componentes de una prótesis, pasos de ensamblaje). No ponerlos como decoración sobre cada sección.

## Motion

- Una sola animación de entrada orquestada en el Hero (no fade-up genérico repetido en cada sección).
- El resto del motion responde a la acción del usuario: hover, scroll-linked reveal en la sección Product Showcase, números que cuentan al entrar en viewport.
- Animar solo `transform` y `opacity`.
- Glitch: extremadamente sutil y puntual (ej. un parpadeo de 100ms en un dato técnico al hacer hover), nunca como textura de fondo constante.
- Respetar `prefers-reduced-motion: reduce` en todos los casos: desactivar parallax, 3D con movimiento constante y auto-play de conteos.

## Componentes UI (nuevo, estilo dashboard)

- Botones: variantes **primary** (borde cyan, fill transparente, glow en hover), **secondary** (borde blanco/gris, sin glow), **danger** (borde/texto rosa neón). Tamaños small/large.
- Toggles y checkboxes: estado ON en verde eléctrico con glow, estado OFF en gris apagado.
- Paneles de datos (usar en la sección Ingeniería): borde fino con glow sutil en la esquina, header con label en mayúsculas + ícono, contenido tipo gráfico (dona, línea) en los colores de acento.
- Glow: `box-shadow` con el color de acento a baja opacidad, más notorio en hover/focus que en reposo — nunca un glow enorme y constante en toda la página.

## Accesibilidad (piso mínimo, no negociable)

- Contraste AA mínimo entre `--text-primary`/`--text-secondary` y los fondos usados.
- Foco visible en todos los elementos interactivos (no `outline: none` sin reemplazo).
- Estructura de headings correcta (un solo `h1`, jerarquía sin saltos).
- `alt` descriptivo en toda imagen/render que aporte información (no `alt=""` salvo decorativo puro).

## Decisiones de implementación (ya resueltas, no reflotar)

- **Elemento del hero**: esquemático SVG de miembro biomecánico + parallax por capas con `transform: translate` guiado por `--px`/`--py`. Se descartó three.js (criterio ARCHITECTURE, orden 1-2: SVG + CSS alcanza). Fallbacks: sin parallax en `pointer: coarse` ni con `prefers-reduced-motion`.
- **Stats de Ingeniería**: valor en Orbitron cian con `--glow-dim`, sparkline SVG decorativo (aria-hidden) por tarjeta.
- **Reveal**: animación de entrada solo en títulos de sección (restraint). Los números de Ingeniería cuentan al entrar en viewport; navbar cambia a `--bg-surface` con scroll (`is-scrolled`).
- **Eyebrows de sección** (Productos, Ingeniería, Product Showcase): label mono mayúsculas cian; reutilizan labels de navegación de `CONTENT.md`, no inventan copy.
- **Product Showcase**: sticky + progreso de scroll (rAF-throttled), pasos del Arc-7 con numeración secuencial `01/04` (permitido: contenido realmente secuencial), SVG de brazo que enciende nodos por paso.
