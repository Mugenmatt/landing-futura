import { manifesto } from '../../content/content'
import RevealOnScroll from '../ui/RevealOnScroll'

function Manifesto() {
  return (
    <section className="manifesto" id="tecnologia" aria-labelledby="manifesto-title">
      <RevealOnScroll>
        <h2 className="manifesto-title" id="manifesto-title">
          {manifesto.title}
        </h2>
      </RevealOnScroll>
      <ul className="manifesto-grid">
        {manifesto.pillars.map((pillar) => (
          <li className="manifesto-pillar" key={pillar.name}>
            <h3 className="pillar-name">{pillar.name}</h3>
            <p className="pillar-desc">{pillar.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Manifesto