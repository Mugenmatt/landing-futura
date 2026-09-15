import { hero } from '../../content/content'
import Button from '../ui/Button'
import HeroVisual from '../ui/HeroVisual'

function Hero() {
  const [pre, post] = hero.headline.split(hero.highlight)

  return (
    <section className="hero">
      <div className="hero-body">
        <h1 className="hero-title">
          {pre}
          <em className="hero-highlight">{hero.highlight}</em>
          {post}
        </h1>
        <p className="hero-sub">{hero.subheadline}</p>
        <div className="hero-actions">
          <Button variant="primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </Button>
          <Button variant="secondary" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
      <HeroVisual />
    </section>
  )
}

export default Hero