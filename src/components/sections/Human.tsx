import { human } from '../../content/content'
import RevealOnScroll from '../ui/RevealOnScroll'

function Human() {
  return (
    <section className="human" id="nosotros" aria-labelledby="human-title">
      <RevealOnScroll>
        <div className="human-grid">
          <div className="human-copy">
            <h2 className="human-title" id="human-title">
              {human.title}
            </h2>
            <p className="human-body">{human.body}</p>
          </div>
          <div className="human-media">
            <video
              className="human-video"
              src="/video/nosotros-video.mp4"
              poster="/video/nosotros-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              Tu navegador no soporta video embebido.
            </video>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  )
}

export default Human
