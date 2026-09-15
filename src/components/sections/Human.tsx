import { human } from '../../content/content'
import RevealOnScroll from '../ui/RevealOnScroll'

function Human() {
  return (
    <section className="human" id="nosotros" aria-labelledby="human-title">
      <RevealOnScroll>
        <h2 className="human-title" id="human-title">
          {human.title}
        </h2>
        <p className="human-body">{human.body}</p>
      </RevealOnScroll>
    </section>
  )
}

export default Human