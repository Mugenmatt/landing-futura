# DESIGN.md — Sistema visual de NEO-CYBERNETICS

Este documento fija las decisiones de diseño para que no cambien de sesión a sesión. Es la base visual acordada; si se ajusta, actualizá este archivo (no dejes que el criterio quede solo en la cabeza del agente de turno).

## Por qué esta dirección (y qué evita)

El proyecto arrancó con un brief de "empresa real de prótesis premium, sutil, sin neón". Esa dirección quedó **descartada**: NEO-CYBERNETICS ahora es una identidad cyberpunk/dashboard ambientada en Neo-Tokio 2049 (ver `CONTENT.md`). Evita los dos clichés del género por separado: no es negro casi puro + un solo verde de terminal (aburrido), ni cyberpunk saturado tipo gamer (ruidoso). Habita el medio: fondos oscuros profundos, superficies de panel, y **4 acentos neón con rol fijo** que se usan con intención, nunca intercambiables.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#05060A` | Fondo principal (dark core) |
| `--bg-surface` | `#12121A` | Cards, paneles, navbar |
| `--bg-panel-alt` | `#1A1D2A` | Paneles secundarios / sidebar |
| `--border-glow` | `#0FF` (opacidad baja en reposo, 100% en hover) | Bordes de cards y paneles activos |
| `--text-primary` | `#F2F4F8` | Texto principal |
| `--text-secondary` | `#7A8494` | Metadata, labels secundarias |
| `--neon-pink` | `#FF007F` | Acento 1 — alertas, highlights, hover de botones "danger" |
| `--cyber-blue` | `#00FFFF` | Acento 2 — botones primarios, bordes activos, data viz |
| `--violet-glare` | `#9400D3` | Acento 3 — estados "active", elementos seleccionados, categorías |
| `--electric-green` | `#00FF41` | Acento 4 — estados "success/stable", status dot, métricas positivas |

Regla de uso (para que 4 neones no se peleen): cada acento tiene un rol fijo, no se usan intercambiablemente. Cyan = acción principal. Rosa = alerta/destaque puntual. Violeta = selección/estado activo/categorías. Verde = estado positivo/stable. Nunca los 4 en el mismo componente. Ej.: en una card del catálogo conviven violeta (categoría) + cyan (acción) — rosa y verde quedan para sus paneles, no para cards.

## Tipografía

- **Display (titulares, hero, headline):** sans bold geométrica limpia — **Space Grotesk Bold** (~`--font-display`). No usar fuente decorativa tipo anime en el headline.
- **Labels de UI cortas** (nombre de producto tipo código: `BRAZO_AUMENTADO_V4`, contador de dona): **Orbitron/Michroma** (~`--font-ui`), únicamente para estas piezas, no para el headline.
- **Cuerpo y datos técnicos:** **Rajdhani** / **Chakra Petch** para texto corrido (~`--font-body`); **Space Mono** / **JetBrains Mono** (~`--font-mono`) para specs, contadores, labels de datos y código.
- Labels de UI (botones, tags, headers de panel) van en mayúsculas sostenidas — es parte del lenguaje visual de dashboard/HUD.
- Títulos de sección pueden llevar una palabra en acento cyan/rosa dentro del headline (una vez por sección, no en cada línea).

## Layout

- Alineación predominante: **izquierda** (default genérico = centrada; acá se lee como documentación técnica/dashboard).
- Mucho espacio negativo — las secciones respiran.
- Grilla de fondo sutil (líneas tipo blueprint) como recurso ocasional, no en toda la página.
- **Fondo atmosférico global (2026-09)**: para que el `--bg-base` no quede plano, el `body` lleva dos auras radiales fijas muy sutiles (cyan arriba-izquierda ≈ leyendo como energía del hero; violeta abajo-derecha en zona baja) más una viñeta que pega solo en los bordes extremos y un grano analógico (`feTurbulence` en SVG data-URI, opacidad ínfima) encima. Todo está **estático** (sin animar), efectuado con un `body::before`/`body::after` fijos (`z-index: -1`, `pointer-events: none`) — la opacidad es tan baja que no compite con paneles ni sube contraste. Las auras van en posiciones centrales de la vista, nunca apoyadas contra esquinas: la viñeta las cancela.
- **Backdrop animado (CyberBackdrop, 2026-09)**: un único `<canvas>` fijo (`z-index: -1`, `pointer-events: none`, `aria-hidden`) detrás de todo el contenido, entre las auras y el grano, le da vida al fondo sin animar texturas. Capas, de atrás hacia adelante: (1) **data rain** — columnas de glifos hex/mono cayendo lento, 85% hacia los bordes (el centro queda libre para el contenido), cyan dominante con algunas columnas violetas; (2) **terminales** — bloques de lectura mono tipeándose lento en los bordes izquierdo/derecho, usando etiquetas on-world de `CONTENT.md` (ENLACE NEURAL: ESTABLE, SECTOR 7G, códigos de producto) y dumps hex estilo preloader; (3) **partículas** — puntos, cruces y glifos derivando arriba con *twinkle*; (4) **elementos HUD** — ticks de medición en los bordes, anillo-reticle con dash, ping radar al costado, readout `NEO-TOKYO 2049 // SECTOR 7G` abajo-izquierda; (5) **scan sweep** — línea horizontal cyan bajando ~52 s/vuelta, solo `pointer: fine`; (6) **glitch** — bandas finas cyan/magenta con split, 1–2 cortes, cada 9–20 s y durante ~0.14 s (puntual, extremadamente sutil). Régimen de acentos en el fondo: **cyan = dominante** (energía/datos), **violeta = acento ocasional** (holograma/selección), **magenta = solo en glitch** (alerta). **Verde nunca entra al backdrop** (es rol de estado positivo). Opacidad objetivo por capa 0.04–0.11 (picos glitch ≤0.14): el fondo jamás sube contraste ni roba jerarquía. Performance: un solo rAF con delta-time, `devicePixelRatio` capado a 2, pausa con `document.hidden`, densidades reducidas en `pointer: coarse` (menos columnas/partículas, sin scan ni glitch). `prefers-reduced-motion` → un único frame estático (columnas quietas, ticks, terminal sin tipeo) y se corta el loop.
- **Corner brackets HUD (2026-09)**: paneles y cards del catálogo llevan marcas de esquina tipo dashboard (líneas cyan de 12px inset 5px vía `::before` con `z-index: 1`, opacidad 0.3 reposo / 0.65 hover). Es el mismo lenguaje de los brackets del loader 3D y del crosshair del hero; no reemplaza ni compite con el borde hairline.
- Numeración/eyebrows solo donde el contenido es realmente secuencial (ej. pasos del showcase `01/04`) o como label de sección en mono mayúsculas.

## Motion

- Una sola animación de entrada orquestada en el Hero (no fade-up genérico repetido en cada sección).
- El resto del motion responde a la acción del usuario: hover, scroll-linked reveal en Product Showcase, números que cuentan al entrar en viewport, **pulso del status dot** (CSS `@keyframes`, autoplay apenas perceptible, permitido porque es señal de sistema).
- Animar solo `transform` y `opacity` (el pulso del dot usa `opacity`, el glow usa `box-shadow` estático por frame).
- Glitch/parpadeo: extremadamente sutil y puntual, nunca textura de fondo.
- Respetar `prefers-reduced-motion: reduce` en todos los casos: desactivar parallax, auto-play de conteos y pulso.

## Componentes UI (estilo dashboard)

- Botones: **primary** (borde cyan, fill transparente, glow en hover), **secondary** (borde blanco/gris, sin glow), **danger** (borde/texto rosa neón — Soporte de Emergencia).
- StatusPill (navbar): dot verde + texto mono mayúsculas; pulso CSS en `opacity`. Es señal de sistema, no decoración animada.
- Cards de catálogo: borde hairline cyan en reposo, glow en hover; código de producto en Orbitron; categoría en violeta.
- Showroom (vitrinas): slider horizontal con `scroll-snap` + drag nativo (sin librería), dots abajo en todas las pantallas y flechas solo en desktop. Cada slide conserva el acento del módulo (`--acc-cyan/violet/green`) en borde/glow y el pedestal (rejilla de escaneo + crosshair holograma + pip, tag `MOD-0X` en mono), la categoría siempre en violeta y el CTA "PROYECTAR MÓDULO" como botón primary chico en cyan. Título del módulo en Orbitron con corte de línea permitido (`overflow-wrap`).
- Inputs (search) y select (filtro de categoría): fondo `--bg-surface`, borde hairline, focus con outline cyan + glow. Estilo más plano que los cards.
- Paneles de datos: borde fino + glow sutil, header con label en mayúsculas + ícono, contenido tipo gráfico (dona, línea) en acentos.
- Gráficos: **SVG dibujado a mano** (dona con `stroke-dasharray`, línea con `polyline`/`polygon`, barras con divs) — nunca una librería de charts.
- Glow: `box-shadow` con acento a baja opacidad, más notorio en hover/focus, nunca un glow enorme y constante.

## Accesibilidad (piso mínimo, no negociable)

- Contraste AA mínimo entre `--text-primary`/`--text-secondary` y los fondos usados.
- Foco visible en todos los elementos interactivos (incluidos `input`/`select`/`button`).
- Estructura de headings correcta: un solo `h1` (Hero), `h2` por sección, `h3` por item.
- `alt`/label promped en todo elemento que aporte información; SVG decorativos con `aria-hidden="true"`, `focusable="false"`.

## Integración 3D (showroom de componentes)

Los modelos GLB pasan a ser pieza real de inventario, no render decorativo. Firme visual que no rompe la identidad dashboard:

- **Luz de estudio neutra + key cyan sutil** en la escena (el neón vive en los overlays HUD/CSS, casi nunca en la malla).
- **Scan sweep cyan** atravesando el modelo = señal de "diagnóstico" (rol de acción). **Violeta** = selección/quotado de un módulo. **Verde** = status estable (unidad base). **Rosa** queda para alertas (no aparece en escenas 3D). Nunca los 4 acentos en la misma vista de un modelo.
- Firma de piso: rejilla de escaneo en perspectiva bajo cada pieza (+ crosshair/ID holograma mono).
- Motion 3D controlado: **drift lento** en el hero (una sola animación, sin drag), **turntable en hover** solo con `pointer: fine` (cards, spotlight del showroom), **encuadres de cámara por paso** en el Product Showcase (según scroll), **scan sweep** al entrar a viewport / abrir spotlight. Nada se anima por defecto en masa.
- `prefers-reduced-motion` → el 3D muestra un primer frame estático (modo `static`) y las animaciones de sobrevuelo/scan se apagan; con `pointer: coarse` o sin WebGL → poster/diagrama estático (esquemáticos SVG del hero/showcase o el fallback de código del widget).
- Fallback de carga: label mono tipo sistema ("CARACTERIZANDO MÓDULO…") con dot cyan pulsando (`aria-busy`), hasta que el modelo está listo.

## Decisiones de implementación (ya resueltas, no reflotar)

- **Elemento del hero**: `CYBMAN_V2.0` en 3D (drift lento + scan sweep) vía el motor singleton de `src/three/`; en coarse/ sin WebGL cae al esquemático SVG estático (ex `HeroVisual`) como poster. El parallax por `--px`/`--py` se retiró.
- **Stats de Ingeniería**: valor en display (Space Grotesk) cian con `--glow-dim`, sparkline SVG decorativo (`aria-hidden`) por tarjeta.
- **Reveal**: animación de entrada solo en títulos de sección (restraint). Los números de Ingeniería cuentan al entrar en viewport; navbar cambia a `--bg-surface` con scroll (`is-scrolled`).
- **Eyebrows de sección** (Catálogo, Ingeniería, Showcase): label mono mayúsculas cian; la sección usa el título de `CONTENT.md`, no copia inventada.
- **Product Showcase**: sticky + progreso de scroll (rAF-throttled), pasos del **BRAZO_AUMENTADO_V4** (producto destacado del catálogo) con numeración secuencial `01/04` (contenido realmente secuencial). El brazo 3D (`l-x3-b_bionic_arm`) encuadra regiones del modelo por paso vía cámara (`armShowcaseFrames`); en coarse/sin WebGL se muestra el esquemático SVG que enciende nodos por paso. En mobile/tablet el panel se fija a `100svh` y se comprime; en pantallas muy cortas (`max-height: 600px`) permite scroll interno.
- **Product Showcase · panel de diagnóstico (2026-09)**: el lado visual es un escenario cuadrado con ancho definido en el wrapper (nunca un % circular sobre un flex item: colapsaba el canvas a 0×0 y la columna izquierda quedaba vacía). Sobre el escenario: HUD con contador `01/04` y tag `MOD-0X + ZONA` (mono, cyan), y una **pista de ensamblaje** de `N` segmentos abajo que se verifican a verde y se iluminan a cyan en el paso actual como barras `progressbar`. Los pasos de la derecha son readouts con número compartido a dos dígitos (ata cada paso a su segmento de la pista), estado verde "verificado" cuando el paso ya pasó y cyan cuando es el actual. El esquemático mobile/SVG gana chips `MOD-01..04` con leader-line a su región. Acentos usados, con rol fijo: cyan = acción/paso actual, verde = stable/verificado. Nunca rosa ni violeta en este componente.
- **Smooth scroll**: solo y exclusivamente al hacer clic en un link interno de la página (nav, footer, CTAs a `#sección`, skip-link), vía delegado `useSmoothAnchors` que usa `scrollIntoView({ behavior: 'smooth' })` respetando `prefers-reduced-motion`. El scroll de rueda/teclado queda nativo: no hay `scroll-behavior: smooth` en CSS ni interceptación de `wheel`.
- **Catálogo / Dashboard**: buscador + filtro 100% client-side (dos `useState` sobre el array de `content.ts`); cards con "AÑADIR A COTIZACIÓN" que agregan/quitan componentes a la "SESIÓN DE COTIZACIÓN" (estado real en sesión: lista visible con botones "QUITAR DE COTIZACIÓN", anuncios `aria-live`, CTA "SOLICITAR COTIZACIÓN" con `mailto` y subject prellenado; sin backend ni persistencia; se confirma con selección violeta `is-quoted`, nunca revierte solo); dona/ línea y barras en SVG/divs a mano; panel lateral "Métricas de Rendimiento" sticky en desktop que se apila abajo en mobile.