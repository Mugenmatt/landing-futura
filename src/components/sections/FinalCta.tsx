import { finalCta } from '../../content/content'
import Button from '../ui/Button'
import RevealOnScroll from '../ui/RevealOnScroll'

function FinalCta() {
  const [pre, post] = finalCta.title.split(finalCta.highlight)

  return (
    <section className="final-cta" id="contacto" aria-labelledby="final-cta-title">
      <RevealOnScroll>
        <h2 className="final-cta-title" id="final-cta-title">
          {pre}
          <em className="text-glow">{finalCta.highlight}</em>
          {post}
        </h2>
        <Button variant="primary" href={finalCta.cta.href}>
          {finalCta.cta.label}
        </Button>
      </RevealOnScroll>
    </section>
  )
}

export default FinalCta