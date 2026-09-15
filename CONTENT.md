# CONTENT.md — Copys y datos ficticios de NEO-CYBERNETICS

Fuente única de verdad para todo el texto de la landing. Si un agente necesita cambiar una frase, la cambia acá primero y después la refleja en el código — así no queda copy distinto entre las secciones y lo que se pensó originalmente.

## Marca

- Nombre: **NEO-CYBERNETICS**.
- Ambientación: Neo-Tokio, 2049. Estética dashboard/HUD.
- Tono de voz: directo, técnico, con lenguaje de sistema/interfaz (ej. "ENLACE NEURAL: ESTABLE") en los elementos de UI y tono publicitario/imperativo en el hero ("RECUPERA TUS LÍMITES."). El texto corrido de secciones y los labels de UI van en español (`lang="es"` en el HTML); los labels de UI en mayúsculas sostenidas.
- Emails ficticios: `support@neo-cybernetics.example` (contacto/diagnóstico) · `emergency@neo-cybernetics.example` (soporte de emergencia).

## Navbar

- Logo: NEO-CYBERNETICS + ícono de mano biónica (SVG inline, `aria-hidden`).
- `StatusPill`: "ESTADO DEL SISTEMA — ENLACE NEURAL: ESTABLE" — dot verde con pulso CSS (ver `DESIGN.md`).
- Link "SHOWROOM" → `#showroom`.
- CTA: "ESTADO DEL SISTEMA" → `#catalogo`.
- Ícono de usuario a la derecha (decorativo, `aria-hidden`).

## Hero

- Headline (h1): **"RECUPERA TUS LÍMITES."** — palabra "LÍMITES." resaltada en cyan (recuso del diseño, no itálica).
- Subheadline: "TU CUERPO, EVOLUCIONADO."
- Cuerpo: "Reemplazos mecánicos de grado militar. Integración biológica garantizada."
- CTA principal: "VER CATÁLOGO" → `#catalogo`.
- CTA secundario: "SOLICITAR DIAGNÓSTICO" → `#contacto` (sección CTA final).
- Visual: modelo **CYBMAN_V2.0** en 3D (drift lento + scan sweep cyan); con `pointer: coarse`/sin WebGL cae al esquemático SVG de miembro (poster).

## Manifiesto / Tecnología

Título de sección (h2): "Ingeniería, no ciencia ficción."

Cuatro pilares (en paralelo, no numerados):
1. **Precisión** — tolerancias de fabricación por debajo del milímetro en cada articulación.
2. **Integración biomecánica** — interfaces neuromusculares que aprenden el patrón de movimiento de cada usuario.
3. **Materiales avanzados** — aleaciones de titanio y compuestos de fibra de carbono, seleccionados por peso y durabilidad.
4. **Adaptación humana** — cada componente se ajusta a la fisiología de la persona, no al revés.

## Catálogo (reemplaza a la sección "Productos" anterior)

Título de sección (h2 eyebrow): "EL CATÁLOGO (AUMENTOS BIOMÉTRICOS)"

Controles:
- Buscador: placeholder "Buscar", filtra por nombre, categoría, descripción y specs (`aria-label` "Buscar en el catálogo").
- Filtro por categoría: dropdown placeholder "Categoría", opciones `MIEMBROS` · `ORGANOS` · `ESPINAL` (100% client-side, dos `useState`).
- Estado vacío (sin resultados): "SIN COINCIDENCIAS" + botón "LIMPIAR FILTROS" que resetea búsqueda y categoría (la región es `role="status"`).

Productos (4, nomenclatura tipo código de sistema, mismos para `name`/`id`):

### BRAZO_AUMENTADO_V4 (`MIEMBROS`)
- Descripción: "Miembro superior motriz con enlace neural bidireccional y articulaciones de precisión."
- Specs: "Ancho de banda neural: 1.2 GB/s" · "Garantía: 10 Años"
- Modelo 3D: `l-x3-b_bionic_arm`.

### UNIDAD_OCULAR_V9 (`ORGANOS`)
- Descripción: "Unidad visual de espectro ampliado con integración cortical directa."
- Specs: "Sensibilidad: 0.01 lux" · "Campo visual: 210°"
- Modelo 3D: `eye_implant`.

### PIERNA_DE_REEMPLAZO_MK2 (`MIEMBROS`)
- Descripción: "Extremidad inferior adaptativa con respuesta a terreno en tiempo real."
- Specs: "Respuesta: 8 ms" · "Carga nominal: 220 kg"
- Modelo 3D: `advanced_prosthetic_leg_design`.

### REFUERZO_ESPINAL (`ESPINAL`)
- Descripción: "Refuerzo de columna con amortiguación activa y puente de datos medular."
- Specs: "Puente de datos: 3.4 GB/s" · "Carcasa: aleación de titanio"
- Sin modelo 3D: conserva su card de código (no forcejear una malla que no existe).

Botones por card:
- `BRAZO_AUMENTADO_V4` (producto destacado): "VER ENSAMBLAJE" → `#showcase` (el ensamblaje interactivo es de este producto, no de los demás).
- Resto de productos: "SOLICITAR DIAGNÓSTICO" → `mailto:support@neo-cybernetics.example` con subject prellenado `DIAGNÓSTICO: <CÓDIGO>` (las specs ya están visibles en la card; el botón es la acción posterior a evaluarlas).
- Todos los productos: "AÑADIR A COTIZACIÓN" agrega el componente a la "SESIÓN DE COTIZACIÓN" (sección siguiente). Al agregar pasa a "EN COTIZACIÓN ✓" (selección violeta, `aria-pressed`); clickeando de nuevo se quita. El agregado/eliminado se anuncia por `aria-live` y **no** revierte solo: es un estado real en sesión, sin persistencia ni backend.

## Sesión de cotización

Panel "SESIÓN DE COTIZACIÓN" que aparece en el catálogo cuando hay componentes agregados (estado en sesión, sin backend):
- Lista de códigos agregados, cada uno con su categoría y botón "QUITAR DE COTIZACIÓN".
- CTA "SOLICITAR COTIZACIÓN" → `mailto:support@neo-cybernetics.example` con subject prellenado `COTIZACIÓN: <códigos separados por +>`.
- Anuncios `aria-live`: "{CÓDIGO} AGREGADO A LA COTIZACIÓN" / "{CÓDIGO} ELIMINADO DE LA COTIZACIÓN". Sin componentes, el panel no se muestra.

## Visualización de datos (panel)

Título de panel: "VISUALIZACIÓN DE DATOS"
- Gráfico dona: **"COMPATIBILIDAD DE COMPONENTES"** — COMPATIBLE 82% · EN REVISIÓN 12% · INCOMPATIBLE 6% (colores: cyan, violeta, gris).
- Gráfico de línea: **"TENDENCIAS DE INTEGRACIÓN AUMENTADA"** — puntos `[0.42, 0.5, 0.58, 0.63, 0.71, 0.78, 0.84, 0.91]`.

## Métricas de Rendimiento (panel, dentro del catálogo)

Título de panel: "MÉTRICAS DE RENDIMIENTO"
- Barras: MIEMBROS 72% · ESPINAL 58% · ORGANOS 64%

## Métricas de Rendimiento (panel lateral)

Header del panel: "NEO-TOKYO 2049" — logo (mano biónica) — ícono de usuario.
- Barras: MIEMBROS 72% · ESPINAL 58% · ORGANOS 64% · RED 88% · CPU 76%

## Soporte de Emergencia

Título de panel: "SOPORTE DE EMERGENCIA"
- Línea de copia (qué hace el soporte y en cuánto): "RESPUESTA AUTOMÁTICA EN <15 MIN — LÍNEA CRÍTICA".
- Iconos en secuencia (SVG inline, trazo rosa neón, con conectores entre ellos): Cerebro Chip → Bio-Hazard → Herramientas (`aria-hidden`).
- CTA: "SOPORTE DE EMERGENCIA" (variante danger del sistema, no neón estándar) → `mailto:emergency@neo-cybernetics.example` **prellenado**: subject `EMERGENCIA: IMPLANTE` + body con plantilla `ID DEL IMPLANTE:` / `DESCRIPCIÓN DEL PROBLEMA:`.
- Ubicación: **clúster de seguridad al inicio del catálogo** (strip compacto antes de la grilla de productos), no dentro del cluster de datos. En desktop es horizontal (copy + iconos + CTA); en mobile apilado pero primero en el flujo de scroll.

## Product Showcase

Eyebrow (h2): "VITRINA DEL PRODUCTO"
Producto destacado: **BRAZO_AUMENTADO_V4** (primer producto del catálogo). Se muestra el ensamblaje por partes durante el scroll (sticky + progreso).

Pasos secuenciales numerados `01/04` (contenido realmente secuencial, permitido):
1. **Material de la carcasa** — aleaciones de titanio y compuestos de fibra de carbono, seleccionados por peso y durabilidad.
2. **Ubicación de sensores** — interfaces neuromusculares que aprenden el patrón de movimiento de cada usuario.
3. **Tipo de actuador** — actuadores de precisión con tolerancias por debajo del milímetro en cada articulación.
4. **Punto de anclaje neural** — adaptación automática a la fisiología de la persona, con retroalimentación táctil integrada.

Visual: el modelo 3D del brazo encuadra la región de cada paso (cámara ligada al scroll); en coarse/sin WebGL, el esquemático SVG enciende los nodos del paso activo.

## Showroom (sección nueva)

Eyebrow (h2): "SHOWROOM"
Título: "UNIDADES EN EXHIBICIÓN"
Botones de vitrina: "PROYECTAR MÓDULO" (abre el spotlight en vivo) / "CERRAR".

Las 7 vitrinas (modelo 3D · acento de rol):
1. **CYBMAN_V2.0** — UNIDAD BASE — "CARCASA: ALEACIÓN DE TITANIO · ESTADO: OPERATIVO" — acento verde (unidad estable).
2. **BRAZO_BIONICO_LX3B** — MIEMBROS — "ENLACE NEURAL BIDIRECCIONAL · 1.2 GB/S" — acento cyan.
3. **ARM_TEARS_OF_STEEL** — MIEMBROS — "MÓDULO EXPERIMENTAL · SERIE LIMITADA" — acento violeta.
4. **ARM_PROSTETICO_RPA** — MIEMBROS — "ARTICULACIÓN 6 GDL · SERVO DE PRECISIÓN" — acento cyan.
5. **OJO_ROBOTICO_RXE** — ORGANOS — "ESPECTRO AMPLIADO · INTEGRACIÓN CORTICAL" — acento violeta.
6. **UNIDAD_OCULAR_V9** — ORGANOS — "SENSIBILIDAD 0.01 LUX · CAMPO 210°" — acento cyan.
7. **PIERNA_DE_REEMPLAZO_MK2** — MIEMBROS — "RESPUESTA A TERRENO · 8 MS" — acento violeta.

Cada vitrina: rejilla de escaneo en piso (CSS), crosshair + ID holograma mono y un solo acento de rol (nunca los 4 juntos). El click abre un *spotlight* (overlay `role="dialog"`) que proyecta el modelo en turntable live + categoria/título/spec + botón CERRAR (Esc también). Cierra devolviendo el foco al trigger. En coarse/ sin WebGL, el spotlight muestra el fallback de código del módulo.

## Ingeniería (datos ficticios)

- **+98%** — Precisión de integración
- **12 ms** — Tiempo de respuesta
- **240+** — Sensores biomecánicos
- **99.8%** — Tasa de sincronización

## Sección humana

Título (h2): "La tecnología no reemplaza lo humano."
Cuerpo: "Lo amplifica. Cada componente que diseñamos existe para devolver movimiento, autonomía y precisión a una persona concreta — no para reemplazarla."

## CTA final (contacto)

Título (h2): "Tu cuerpo, rediseñado." — palabra "rediseñado" resaltada en cyan.
CTA: "SOLICITAR DIAGNÓSTICO" → `mailto:support@neo-cybernetics.example`

## Footer

- "© 2049 NEO-CYBERNETICS CORP. El futuro es ahora."
- Links: Legal · Términos (href `#`, decorativos) · Contacto (`mailto:support@neo-cybernetics.example`)
- "CERTIFICACIÓN BIO-SEGURIDAD: VERIFICADA ✓" (verde eléctrico)