import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Manifesto from './components/sections/Manifesto'
import Products from './components/sections/Products'
import Engineering from './components/sections/Engineering'
import Human from './components/sections/Human'
import FinalCta from './components/sections/FinalCta'
import ProductShowcase from './components/sections/ProductShowcase'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Navbar />
      <main className="site-main" id="main">
        <Hero />
        <Manifesto />
        <Products />
        <Engineering />
        <ProductShowcase />
        <Human />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

export default App