import { useEffect, useState } from 'react'
import { brand, nav } from '../../content/content'
import StatusPill from '../ui/StatusPill'
import { BionicHandIcon, UserIcon } from '../ui/icons'

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
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="site-nav">
        <a className="nav-brand" href="#top">
          <BionicHandIcon />
          {brand.name}
        </a>
        <StatusPill label={nav.status} />
        <a className="nav-cta" href={nav.href}>
          {nav.cta}
        </a>
        <span className="nav-user" aria-hidden="true">
          <UserIcon />
        </span>
      </div>
    </header>
  )
}

export default Navbar