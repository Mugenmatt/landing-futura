export type Link = {
  label: string
  href: string
}

export type ProductSpec = string

export type Product = {
  id: string
  kind: string
  name: string
  description: string
  specs: ProductSpec[]
  cta: Link
}

export type Pillar = {
  name: string
  description: string
}

export type Stat = {
  label: string
  value: number
  prefix: string
  suffix: string
  decimals: number
}

export const brand = {
  name: 'NEXUS',
  tagline: 'Ingeniería biomecánica para el cuerpo humano.',
}

export const nav = {
  links: [
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Productos', href: '#productos' },
    { label: 'Ingeniería', href: '#ingenieria' },
    { label: 'Nosotros', href: '#nosotros' },
  ] satisfies Link[],
  cta: { label: 'Explorar tecnología', href: '#tecnologia' } satisfies Link,
}

export const hero = {
  headline: 'El cuerpo, versión siguiente.',
  highlight: 'versión',
  subheadline:
    'NEXUS diseña e integra prótesis y componentes biomecánicos de precisión — brazos, piernas y sistemas visuales construidos para funcionar como parte del cuerpo, no encima de él.',
  primaryCta: { label: 'Explorar tecnología', href: '#tecnologia' } satisfies Link,
  secondaryCta: { label: 'Ver productos', href: '#productos' } satisfies Link,
}

export const manifesto = {
  title: 'Ingeniería, no ciencia ficción.',
  pillars: [
    {
      name: 'Precisión',
      description:
        'tolerancias de fabricación por debajo del milímetro en cada articulación.',
    },
    {
      name: 'Integración biomecánica',
      description:
        'interfaces neuromusculares que aprenden el patrón de movimiento de cada usuario.',
    },
    {
      name: 'Materiales avanzados',
      description:
        'aleaciones de titanio y compuestos de fibra de carbono, seleccionados por peso y durabilidad.',
    },
    {
      name: 'Adaptación humana',
      description:
        'cada componente se ajusta a la fisiología de la persona, no al revés.',
    },
  ] satisfies Pillar[],
}

export const products = {
  items: [
    {
      id: 'arc-7',
      kind: 'Brazo biomecánico',
      name: 'NEXUS Arc-7',
      description: 'Control motor de precisión con retroalimentación táctil integrada.',
      specs: [
        '12 grados de libertad',
        '340g menos que la generación anterior',
        'batería para 36h de uso continuo',
      ],
      cta: { label: 'Ver especificaciones', href: '#showcase' },
    },
    {
      id: 'stride-4',
      kind: 'Pierna biomecánica',
      name: 'NEXUS Stride-4',
      description: 'Adaptación automática a terreno e inclinación en tiempo real.',
      specs: [
        'respuesta de sensor en 8ms',
        '4 modos de marcha adaptativa',
        'resistencia IP67',
      ],
      cta: { label: 'Ver especificaciones', href: '#stride-4' },
    },
    {
      id: 'lumen-2',
      kind: 'Ojo biónico',
      name: 'NEXUS Lumen-2',
      description:
        'Resolución visual comparable al ojo humano, con rango espectral ampliado.',
      specs: [
        '24 megapíxeles equivalentes',
        'visión de bajo nivel de luz mejorada',
        'latencia de procesamiento de 4ms',
      ],
      cta: { label: 'Ver especificaciones', href: '#lumen-2' },
    },
  ] satisfies Product[],
  featuredId: 'arc-7' satisfies Product['id'],
}

export const productShowcase = {
  steps: [
    {
      id: 'shell',
      label: 'Material de la carcasa',
      detail:
        'aleaciones de titanio y compuestos de fibra de carbono, seleccionados por peso y durabilidad.',
    },
    {
      id: 'sensors',
      label: 'Ubicación de sensores',
      detail:
        'interfaces neuromusculares que aprenden el patrón de movimiento de cada usuario.',
    },
    {
      id: 'actuator',
      label: 'Tipo de actuador',
      detail:
        'actuadores de precisión con tolerancias por debajo del milímetro en cada articulación.',
    },
    {
      id: 'anchor',
      label: 'Punto de anclaje neural',
      detail:
        'adaptación automática a la fisiología de la persona, con retroalimentación táctica integrada.',
    },
  ],
}

export const engineeringStats = [
  {
    label: 'Precisión de integración',
    value: 98,
    prefix: '+',
    suffix: '%',
    decimals: 0,
  },
  {
    label: 'Tiempo de respuesta',
    value: 12,
    prefix: '',
    suffix: ' ms',
    decimals: 0,
  },
  {
    label: 'Sensores biomecánicos',
    value: 240,
    prefix: '',
    suffix: '+',
    decimals: 0,
  },
  {
    label: 'Tasa de sincronización',
    value: 99.8,
    prefix: '',
    suffix: '%',
    decimals: 1,
  },
] satisfies Stat[]

export const human = {
  title: 'La tecnología no reemplaza lo humano.',
  body: 'Lo amplifica. Cada componente que diseñamos existe para devolver movimiento, autonomía y precisión a una persona concreta — no para reemplazarla.',
}

export const finalCta = {
  title: 'Tu cuerpo, rediseñado.',
  highlight: 'rediseñado',
  cta: { label: 'Descubrir NEXUS', href: 'mailto:contacto@nexus-biomech.example' } satisfies Link,
}

export const footer = {
  links: [
    { label: 'Tecnología', href: '#tecnologia' },
    { label: 'Productos', href: '#productos' },
    { label: 'Ingeniería', href: '#ingenieria' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: 'mailto:contacto@nexus-biomech.example' },
  ] satisfies Link[],
  contactEmail: 'contacto@nexus-biomech.example',
  location: 'Buenos Aires, Argentina',
  legal: 'NEXUS Biomechanical Systems — proyecto de portfolio, sin fines comerciales reales.',
}