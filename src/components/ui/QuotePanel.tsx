import { catalog } from '../../content/content'
import type { CatalogProduct } from '../../content/content'
import Button from './Button'

type QuotePanelProps = {
  items: CatalogProduct[]
  onToggle: (id: string) => void
}

function QuotePanel({ items, onToggle }: QuotePanelProps) {
  if (items.length === 0) return null

  const subject = encodeURIComponent(
    `COTIZACIÓN: ${items.map((item) => item.name).join(' + ')}`,
  )
  const href = `${catalog.quote.actionMailto}?subject=${subject}`

  return (
    <section className="panel panel--quote quote-panel" aria-labelledby="quote-title">
      <div className="quote-head">
        <h3 className="panel-title" id="quote-title">
          {catalog.quote.title}
        </h3>
        <span className="quote-count" aria-hidden="true">
          {String(items.length).padStart(2, '0')}
        </span>
      </div>
      <ul className="quote-list">
        {items.map((item) => (
          <li key={item.id} className="quote-item">
            <span className="quote-code">{item.name}</span>
            <span className="quote-category">{item.category}</span>
            <button
              type="button"
              className="quote-remove"
              aria-label={`${catalog.quote.removeLabel} ${item.name}`}
              onClick={() => onToggle(item.id)}
            >
              {catalog.quote.removeLabel}
            </button>
          </li>
        ))}
      </ul>
      <div className="quote-actions">
        <Button variant="primary" href={href}>
          {catalog.quote.action}
        </Button>
      </div>
    </section>
  )
}

export default QuotePanel