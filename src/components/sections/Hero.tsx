import { hero } from '../../content/content'
import Button from '../ui/Button'
import HeroVisual from '../ui/HeroVisual'
import Viewer3D from '../ui/Viewer3D'
import { model } from '../../three/models'

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
        <p className="hero-body-copy">{hero.body}</p>
        <div className="hero-actions">
          <Button variant="primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </Button>
          <Button variant="secondary" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
      <div className="hero-visual">
        <Viewer3D
          src={model.cybman}
          label="CYBMAN_V2.0"
          mode="drift"
          autoRotateSpeed={0.18}
          scan
          poster={<HeroVisual />}
        />
      </div>
    </section>
  )
}

export default Hero