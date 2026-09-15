export type Link = {
  label: string
  href: string
}

export type CatalogCategory = 'MIEMBROS' | 'ORGANOS' | 'ESPINAL'

export type CatalogProduct = {
  id: string
  category: CatalogCategory
  name: string
  description: string
  specs: string[]
}

export type ChartSegment = {
  label: string
  value: number
  className: string
}

export type MetricBar = {
  label: string
  value: number
}

type Pillar = {
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
  name: 'NEO-CYBERNETICS',
}

export const nav = {
  status: 'ESTADO DEL SISTEMA — ENLACE NEURAL: ESTABLE',
  cta: 'ESTADO DEL SISTEMA',
  href: '#catalogo',
}

export const hero = {
  headline: 'RECUPERA TUS LÍMITES.',
  highlight: 'LÍMITES.',
  subheadline: 'TU CUERPO, EVOLUCIONADO.',
  body: 'Reemplazos mecánicos de grado militar. Integración biológica garantizada.',
  primaryCta: { label: 'VER CATÁLOGO', href: '#catalogo' } satisfies Link,
  secondaryCta: { label: 'SOLICITAR DIAGNÓSTICO', href: '#contacto' } satisfies Link,
}

export const catalog = {
  title: 'EL CATÁLOGO (AUMENTOS BIOMÉTRICOS)',
  search: {
    label: 'Buscar en el catálogo',
    placeholder: 'Buscar',
  },
  filter: {
    label: 'Filtrar por categoría',
    placeholder: 'Categoría',
    all: 'TODAS',
  },
  categories: ['MIEMBROS', 'ORGANOS', 'ESPINAL'] as const,
  empty: 'SIN COINCIDENCIAS',
  products: [
    {
      id: 'BRAZO_AUMENTADO_V4',
      category: 'MIEMBROS',
      name: 'BRAZO_AUMENTADO_V4',
      description:
        'Miembro superior motriz con enlace neural bidireccional y articulaciones de precisión.',
      specs: ['Ancho de banda neural: 1.2 GB/s', 'Garantía: 10 Años'],
    },
    {
      id: 'UNIDAD_OCULAR_V9',
      category: 'ORGANOS',
      name: 'UNIDAD_OCULAR_V9',
      description:
        'Unidad visual de espectro ampliado con integración cortical directa.',
      specs: ['Sensibilidad: 0.01 lux', 'Campo visual: 210°'],
    },
    {
      id: 'PIERNA_DE_REEMPLAZO_MK2',
      category: 'MIEMBROS',
      name: 'PIERNA_DE_REEMPLAZO_MK2',
      description:
        'Extremidad inferior adaptativa con respuesta a terreno en tiempo real.',
      specs: ['Respuesta: 8 ms', 'Carga nominal: 220 kg'],
    },
    {
      id: 'REFUERZO_ESPINAL',
      category: 'ESPINAL',
      name: 'REFUERZO_ESPINAL',
      description:
        'Refuerzo de columna con amortiguación activa y puente de datos medular.',
      specs: ['Puente de datos: 3.4 GB/s', 'Carcasa: aleación de titanio'],
    },
  ] satisfies CatalogProduct[],
  cta: {
    specs: 'VER ESPECIFICACIONES',
    cart: 'AGREGAR AL CARRITO',
    added: 'AGREGADO ✓',
  },
}

export const dataViz = {
  donut: {
    title: 'COMPATIBILIDAD DE COMPONENTES',
    segments: [
      { label: 'COMPATIBLE', value: 82, className: 'seg-cyan' },
      { label: 'EN REVISIÓN', value: 12, className: 'seg-violet' },
      { label: 'INCOMPATIBLE', value: 6, className: 'seg-dim' },
    ] satisfies ChartSegment[],
  },
  line: {
    title: 'TENDENCIAS DE INTEGRACIÓN AUMENTADA',
    points: [0.42, 0.5, 0.58, 0.63, 0.71, 0.78, 0.84, 0.91],
  },
}

export const performanceMetrics = {
  title: 'MÉTRICAS DE RENDIMIENTO',
  bars: [
    { label: 'MIEMBROS', value: 72 },
    { label: 'ESPINAL', value: 58 },
    { label: 'ORGANOS', value: 64 },
  ] satisfies MetricBar[],
}

export const sideMetrics = {
  header: 'NEO-TOKYO 2049',
  bars: [
    { label: 'MIEMBROS', value: 72 },
    { label: 'ESPINAL', value: 58 },
    { label: 'ORGANOS', value: 64 },
    { label: 'RED', value: 88 },
    { label: 'CPU', value: 76 },
  ] satisfies MetricBar[],
}

export const emergency = {
  title: 'SOPORTE DE EMERGENCIA',
  cta: {
    label: 'SOPORTE DE EMERGENCIA',
    href: 'mailto:emergency@neo-cybernetics.example',
  } satisfies Link,
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

export const productShowcase = {
  eyebrow: 'VITRINA DEL PRODUCTO',
  productId: 'BRAZO_AUMENTADO_V4',
  progressLabel:
    'Progreso del ensamblaje del BRAZO_AUMENTADO_V4',
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
        'adaptación automática a la fisiología de la persona, con retroalimentación táctil integrada.',
    },
  ],
}

export const finalCta = {
  title: 'Tu cuerpo, rediseñado.',
  highlight: 'rediseñado',
  cta: {
    label: 'SOLICITAR DIAGNÓSTICO',
    href: 'mailto:support@neo-cybernetics.example',
  } satisfies Link,
}

export const footer = {
  links: [
    { label: 'Legal', href: '#' },
    { label: 'Términos', href: '#' },
    {
      label: 'Contacto',
      href: 'mailto:support@neo-cybernetics.example',
    },
  ] satisfies Link[],
  cert: 'CERTIFICACIÓN BIO-SEGURIDAD: VERIFICADA ✓',
  legal: '© 2049 NEO-CYBERNETICS CORP. El futuro es ahora.',
}