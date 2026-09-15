import { brand, footer } from '../../content/content'
import { BionicHandIcon } from '../ui/icons'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <BionicHandIcon />
          <p className="footer-name">{brand.name}</p>
        </div>
        <nav aria-label="Pie de página" className="footer-nav">
          <ul>
            {footer.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer-cert">{footer.cert}</p>
        <p className="footer-legal">{footer.legal}</p>
      </div>
    </footer>
  )
}

export default Footer