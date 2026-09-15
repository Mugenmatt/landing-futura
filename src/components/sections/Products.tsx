import { products } from '../../content/content'
import Button from '../ui/Button'

function Products() {
  return (
    <section className="products" id="productos" aria-labelledby="products-title">
      <h2 className="section-eyebrow" id="products-title">
        Productos
      </h2>
      <ul className="product-grid">
        {products.items.map((product) => (
          <li
            className="product-card"
            id={product.id}
            key={product.id}
            data-featured={product.id === products.featuredId ? '' : undefined}
          >
            <div className="product-head">
              <span className="product-kind">{product.kind}</span>
              <span className="product-id">{product.id}</span>
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-desc">{product.description}</p>
            <ul className="product-specs">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <Button variant="primary" href={product.cta.href}>
              {product.cta.label}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Products