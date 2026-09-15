import { useState } from 'react'
import { catalog, productShowcase } from '../../content/content'
import type { CatalogCategory, CatalogProduct } from '../../content/content'
import Button from '../ui/Button'
import SearchBar from '../ui/SearchBar'
import CategoryFilter from '../ui/CategoryFilter'
import DataVizPanel from '../ui/DataVizPanel'
import PerformanceMetricsPanel from '../ui/PerformanceMetricsPanel'
import SideMetricsPanel from '../ui/SideMetricsPanel'
import EmergencySupportPanel from '../ui/EmergencySupportPanel'
import QuotePanel from '../ui/QuotePanel'
import Viewer3D from '../ui/Viewer3D'
import { model } from '../../three/models'

const modelAssets = model as Record<string, string>

type ProductCardProps = {
  product: CatalogProduct
  quoted: boolean
  onToggle: (id: string) => void
}

function ProductCard({ product, quoted, onToggle }: ProductCardProps) {
  const isFeatured = product.id === productShowcase.productId
  const [hover, setHover] = useState(false)
  const assetUrl = product.model ? modelAssets[product.model] : undefined
  const secondaryAction = isFeatured ? (
    <Button variant="secondary" href="#showcase">
      {catalog.cta.assembly}
    </Button>
  ) : (
    <Button
      variant="secondary"
      href={`${catalog.cta.diagnosisMailto}?subject=${encodeURIComponent(
        `DIAGNÓSTICO: ${product.name}`,
      )}`}
    >
      {catalog.cta.diagnosis}
    </Button>
  )

  return (
    <li className="cat-card">
      {assetUrl && (
        <div
          className="cat-card-media"
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <Viewer3D
            src={assetUrl}
            label={product.name}
            mode="turntable"
            autoRotate={hover}
          />
        </div>
      )}
      <div className="cat-card-head">
        <span className="cat-category">{product.category}</span>
        <h3 className="cat-code">{product.name}</h3>
      </div>
      <p className="cat-desc">{product.description}</p>
      <ul className="cat-specs">
        {product.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
      <div className="cat-actions">
        {secondaryAction}
        <button
          type="button"
          className={quoted ? 'btn btn--primary is-quoted' : 'btn btn--primary'}
          aria-pressed={quoted}
          onClick={() => onToggle(product.id)}
        >
          {quoted ? catalog.cta.quoted : catalog.cta.quote}
        </button>
      </div>
    </li>
  )
}

function Catalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CatalogCategory | ''>('')
  const [quoteIds, setQuoteIds] = useState<ReadonlySet<string>>(new Set())
  const [announcement, setAnnouncement] = useState('')
  const q = query.trim().toLowerCase()

  const filtered = catalog.products.filter((product) => {
    const inCategory = category === '' || product.category === category
    const inQuery =
      q === '' ||
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.specs.some((spec) => spec.toLowerCase().includes(q))
    return inCategory && inQuery
  })

  const quotedItems = catalog.products.filter((product) =>
    quoteIds.has(product.id),
  )
  const filtersActive = query !== '' || category !== ''

  const toggleQuote = (id: string) => {
    const product = catalog.products.find((p) => p.id === id)
    if (!product) return
    const remove = quoteIds.has(id)
    setQuoteIds((prev) => {
      const next = new Set(prev)
      if (remove) next.delete(id)
      else next.add(id)
      return next
    })
    setAnnouncement(
      (remove
        ? catalog.quote.announceRemoved
        : catalog.quote.announceAdded
      ).replace('{code}', product.name),
    )
  }

  const resetFilters = () => {
    setQuery('')
    setCategory('')
  }

  return (
    <section className="catalog" id="catalogo" aria-labelledby="catalog-title">
      <div className="catalog-main">
        <h2 className="section-eyebrow" id="catalog-title">
          {catalog.title}
        </h2>
        <div className="catalog-controls" role="search">
          <SearchBar
            value={query}
            onChange={setQuery}
            label={catalog.search.label}
            placeholder={catalog.search.placeholder}
          />
          <CategoryFilter
            value={category}
            onChange={setCategory}
            label={catalog.filter.label}
            placeholder={catalog.filter.placeholder}
            categories={catalog.categories}
          />
        </div>
        <EmergencySupportPanel />
        <QuotePanel items={quotedItems} onToggle={toggleQuote} />
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </span>
        {filtered.length > 0 ? (
          <ul className="catalog-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quoted={quoteIds.has(product.id)}
                onToggle={toggleQuote}
              />
            ))}
          </ul>
        ) : (
          <p className="catalog-empty" role="status">
            {catalog.empty}
            {filtersActive && (
              <button
                type="button"
                className="catalog-reset"
                onClick={resetFilters}
              >
                {catalog.emptyReset}
              </button>
            )}
          </p>
        )}
        <div className="catalog-panels">
          <DataVizPanel />
          <PerformanceMetricsPanel />
        </div>
      </div>
      <aside className="catalog-side">
        <SideMetricsPanel />
      </aside>
    </section>
  )
}

export default Catalog