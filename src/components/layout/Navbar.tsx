import { useEffect, useState } from 'react'
import { brand, nav } from '../../content/content'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-nav">
        <a className="nav-brand" href="/">
          {brand.name}
        </a>
        <ul className="nav-links">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <a className="nav-cta" href={nav.cta.href}>
          {nav.cta.label}
        </a>
      </div>
    </header>
  )
}

export default Navbar