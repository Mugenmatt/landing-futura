# AGENTS.md — Proyecto NEO-CYBERNETICS (landing biomecánica)

Este archivo es la fuente de verdad para cualquier agente de IA que trabaje en este repo (OpenCode, Claude, etc.). Leelo completo antes de tocar código. Si algo acá contradice lo que te pide el usuario en el momento, el mensaje del usuario gana — pero avisá si el pedido rompe un principio del proyecto.

## Qué es esto

Landing page ficticia de una sola página para "NEO-CYBERNETICS" (antes "NEXUS", nombre provisorio desaparecido), una empresa de aumentos biométricos (prótesis y componentes biomecánicos avanzados) ambientada en Neo-Tokio, 2049. Es un proyecto de **portfolio/práctica**, sin backend. El objetivo no es "una landing futurista genérica" sino que se sienta como la interfaz real de un proveedor de hardware biomecánico premium: estética cyberpunk/dashboard con 4 acentos neón de rol fijo.

Antes de escribir código para cualquier sección, releé `DESIGN.md` (sistema visual) y `CONTENT.md` (copys y specs ficticias) para no inventar valores nuevos cada vez.

## Stack (no expandir sin justificar)

- React + TypeScript + Vite
- CSS moderno (custom properties, no framework de utilidades salvo que se justifique)
- 3D/animación: evaluar SIEMPRE la alternativa más simple antes de sumar una librería (ver `ARCHITECTURE.md`)

Regla dura: **antes de instalar cualquier dependencia nueva, escribí en el PR/commit por qué CSS/SVG/Canvas nativo no alcanza.** Si no podés justificarlo en una frase, no la instales.

## Principios de decisión (en este orden)

1. Rendimiento
2. Fluidez (60fps, sin layout thrashing)
3. Calidad visual
4. Mantenibilidad
5. Simplicidad de código

Si dos principios entran en conflicto, gana el de arriba.

## Qué NO hacer

- No agregar librerías "porque una landing futurista debería tener X" (three.js, GSAP, frameworks de animación) sin haber descartado antes CSS transforms/opacity o SVG.
- [ACTUALIZADO] Se abandonó la dirección "premium sutil, sin neón" del brief original: NEO-CYBERNETICS usa una identidad cyberpunk/dashboard con 4 acentos neón (ver `DESIGN.md`, sección Paleta). Sigue vigente evitar: cards idénticas con el mismo border-radius y sombra gris sin variación, flechitas "→" al final de todos los botones, separadores con "·", y usar los 4 neones sin rol fijo en un mismo componente.
- No animar todo: una sola animación de entrada bien orquestada en el hero vale más que fade-in-up repetido en cada sección.
- No ignorar `prefers-reduced-motion`.
- No sacrificar performance por un efecto 3D/parallax que "se ve lindo".
- No inventar copy nuevo cada vez que se toca una sección: usar `CONTENT.md` como fuente única de textos y datos ficticios.

## Flujo de trabajo esperado

1. Antes de implementar: proponer brevemente el enfoque técnico de la sección (¿CSS puro? ¿SVG animado? ¿three.js justificado?).
2. Implementar en componentes chicos y aislados (ver `ARCHITECTURE.md` para estructura de carpetas).
3. Revisar responsive (mobile primero para animaciones/3D: en mobile se simplifica, no se elimina la experiencia).
4. Verificar accesibilidad básica: foco visible, contraste, `alt`, orden de headings.
5. Si se togen decisiones de diseño no cubiertas en `DESIGN.md`, agregarlas ahí para no perder consistencia entre sesiones.

## Archivos de referencia en este repo

- `DESIGN.md` — sistema visual: paleta, tipografía, espaciado, principios de motion.
- `ARCHITECTURE.md` — estructura de carpetas, enfoque técnico para 3D/animaciones, estrategia de performance y responsive.
- `CONTENT.md` — todos los textos y datos ficticios (marca, hero, catálogo/dashboard, stats, showcase, footer) para que no cambien entre sesiones.
- `TASKS.md` — backlog dividido en tareas chicas, en orden sugerido de implementación.

## Definición de "terminado" para cada sección

- Se ve bien en mobile, tablet y desktop.
- No rompe con `prefers-reduced-motion` activado.
- No hay animaciones que dependan de JS para cosas que CSS puede resolver solo.
- El texto es el de `CONTENT.md` (o se actualizó ese archivo si cambió).
- Lighthouse (o similar) no muestra regresiones grandes de performance vs. la sección anterior.
