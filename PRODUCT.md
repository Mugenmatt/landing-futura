# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitor: a prospective client of NEO-CYBERNETICS inside the fictional Neo-Tokio 2049 world. They arrive looking for biomechanical augment components (limbs, organs, spinal support): they browse the catalog, evaluate specs and compatibility, check system status, and have a path to request a diagnosis or emergency support. The project is a portfolio/practice piece, but the confirmed audience remains the in-world client, not a real-world evaluator; the world must stay immersive.

## Product Purpose

A single-page landing storefront for NEO-CYBERNETICS, a fictional premium provider of biomechanical augment hardware (prostheses and components) set in Neo-Tokio 2049. Success means the fictional catalog/dashboard is coherent and premium enough that the visitor "buys" the world: consistent system language, real-feeling technical specs, no fake noise. The repo is portfolio/practice work with no backend or real commerce.

## Positioning

A premium hardware storefront that reads as the real interface of a biomechanical supplier: a cyberpunk/dashboard/HUD identity with 4 fixed-role neon accents and system-style copy in Spanish — not a generic "futuristic landing" and not a gaming-saturated neon overload. Distinguishable mechanism: the catalog is rendered as an embedded operational dashboard (data viz, performance metrics, status) rather than a card marketing page.

## Operating Context

Visitor enters a single responsive page (mobile-first, tablet/desktop) in a browser, in Spanish (`lang="es"`). The in-world context is Neo-Tokio 2049: system/dashboard aesthetic, uppercase UI labels, status pips, technical spec nomenclature. All content and fictional data live in `CONTENT.md` and are the single source of copy; the catalog filters client-side with no persistence. Emergency/contact CTAs are `mailto:` links to fictional addresses.

## Capabilities and Constraints

- Capabilities: product catalog with client-side search + category filter; per-card decorative "AGREGAR AL CARRITO" state (~2 s, no cart/backend); SVG data viz (donut, line, bars) hand-drawn; sticky Product Showcase of BRAZO_AUMENTADO_V4 with scroll progress; animated stat counters; hero with layered SVG parallax; emergency/contact CTAs.
- Stack is fixed and not to expand without justification: React + TypeScript + Vite; modern CSS with custom properties; no UI/anim/chart/deps-new libraries unless CSS/SVG/Canvas provably can't cover it (see ARCHITECTURE.md). No three.js: hero is SVG + CSS parallax.
- Constraints: copy must come from CONTENT.md (edit there first); 4 neon accents have fixed roles (cyan=action, pink=alert, violet=selection/categories, green=positive); never all 4 in one component; uppercase UI labels; no arrow "→" flourishes, no "·" separators, no repeated fade-up reveals; Spanish copy.
- Terminology: product nomenclatures are uppercase system codes (e.g. BRAZO_AUMENTADO_V4).

## Brand Commitments

- Name: NEO-CYBERNETICS (NEXUS is retired; do not reintroduce).
- Fictional brand voice: direct, technical, system/interface language (e.g. "ENLACE NEURAL: ESTABLE") mixed with imperative advertising tone in the hero.
- Fictional emails: `support@neo-cybernetics.example`, `emergency@neo-cybernetics.example`.
- Aesthetic identity (cyberpunk/dashboard, 4 neon accents, dark panels) is binding per DESIGN.md; evolving it requires updating DESIGN.md.

## Evidence on Hand

- `CONTENT.md` — all copy and fictional data (brand, hero, catalog, panels, showcase, stats, footer).
- `DESIGN.md` — the committed visual system.
- `ARCHITECTURE.md` — folder structure, 3D/performance decision record.
- Implemented app in `src/` (components, hooks, styles) matching the above.
- No real customers, testimonials, pricing, or press exist; those must not be invented.

## Product Principles

1. The world must be believable and self-consistent: system language, fixed-role accents, no fake noise.
2. Copy is the single source of truth in CONTENT.md; codes and specs must not drift.
3. Performance and 60fps fluency outrank visual flourishes; no library before CSS/SVG/Canvas is proven insufficient.
4. Restraint in motion: one orchestrated hero entrance, action-driven microinteractions, battle-tested reveals, no repeated generic animation.
5. Accessibility is a floor, not a feature: AA contrast, visible focus, single h1, reduced-motion respected.

## Accessibility & Inclusion

- Contrast AA minimum for body/secondary text on used backgrounds.
- Visible focus on all interactive elements.
- Correct heading structure (single h1, h2 per section, h3 per item).
- `alt`/`aria-hidden` discipline on all informational vs decorative SVG.
- Respect `prefers-reduced-motion` everywhere (no autoplay stats/pulse/parallax under it).
- Keyboard navigation for interactive elements; smooth scroll only for in-page anchor clicks, honoring reduced motion.