import { useSmoothAnchors } from './hooks/useSmoothAnchors'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Manifesto from './components/sections/Manifesto'
import Catalog from './components/sections/Catalog'
import Engineering from './components/sections/Engineering'
import ProductShowcase from './components/sections/ProductShowcase'
import Showroom from './components/sections/Showroom'
import Human from './components/sections/Human'
import FinalCta from './components/sections/FinalCta'

function App() {
  useSmoothAnchors()
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Navbar />
      <main className="site-main" id="main">
        <Hero />
        <Manifesto />
        <Catalog />
        <Engineering />
        <ProductShowcase />
        <Showroom />
        <Human />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

export default App