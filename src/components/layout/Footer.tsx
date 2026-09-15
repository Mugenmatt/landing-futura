import { brand, footer } from '../../content/content'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <p className="footer-name">{brand.name}</p>
          <p>{brand.tagline}</p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <ul>
            {footer.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer-contact">
          {footer.contactEmail} · {footer.location}
        </p>
        <p className="footer-legal">{footer.legal}</p>
      </div>
    </footer>
  )
}

export default Footer