import { useEffect, useRef, useState } from 'react'
import { catalog } from '../../content/content'
import type { CatalogCategory, CatalogProduct } from '../../content/content'
import Button from '../ui/Button'
import SearchBar from '../ui/SearchBar'
import CategoryFilter from '../ui/CategoryFilter'
import DataVizPanel from '../ui/DataVizPanel'
import PerformanceMetricsPanel from '../ui/PerformanceMetricsPanel'
import SideMetricsPanel from '../ui/SideMetricsPanel'
import EmergencySupportPanel from '../ui/EmergencySupportPanel'

const ADDED_RESET_MS = 2000

function ProductCard({ product }: { product: CatalogProduct }) {
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onAdd = () => {
    window.clearTimeout(timer.current)
    if (added) {
      setAdded(false)
      return
    }
    setAdded(true)
    timer.current = window.setTimeout(() => setAdded(false), ADDED_RESET_MS)
  }

  return (
    <li className="cat-card">
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
        <Button variant="secondary" href="#showcase">
          {catalog.cta.specs}
        </Button>
        <button
          type="button"
          className={added ? 'btn btn--primary is-added' : 'btn btn--primary'}
          aria-pressed={added}
          onClick={onAdd}
        >
          {added ? catalog.cta.added : catalog.cta.cart}
        </button>
      </div>
    </li>
  )
}

function Catalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CatalogCategory | ''>('')
  const q = query.trim().toLowerCase()

  const filtered = catalog.products.filter((product) => {
    const inCategory = category === '' || product.category === category
    const inQuery =
      q === '' ||
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    return inCategory && inQuery
  })

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
        {filtered.length > 0 ? (
          <ul className="catalog-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className="catalog-empty">{catalog.empty}</p>
        )}
        <div className="catalog-panels">
          <DataVizPanel />
          <PerformanceMetricsPanel />
        </div>
        <EmergencySupportPanel />
      </div>
      <aside className="catalog-side">
        <SideMetricsPanel />
      </aside>
    </section>
  )
}

export default Catalog