import { Phone, LocateFixed, BadgeCheck, Headset } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Photo } from '@/components/ui/Photo'
import { company } from '@/data/content'
import { images } from '@/data/images'
import './Hero.css'

const assurances = [
  { icon: LocateFixed, text: 'GPS-tracked vehicles' },
  { icon: BadgeCheck, text: 'Verified drivers' },
  { icon: Headset, text: 'Trip support by phone and WhatsApp' },
]

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* The photo is cut on the same slant as the logo mark, with a thin teal stripe alongside */}
      <div className="hero__visual" aria-hidden="true">
        <span className="hero__stripe" />
        <Photo src={images.hero} alt="" priority className="hero__photo" position="50% 60%" />
      </div>

      <Container className="hero__inner">
        <div className="hero__content">
          <h1 id="hero-title">Your cargo, delivered on schedule.</h1>
          <p className="hero__lead">
            Full truck load, part load and warehousing across India. Book in two minutes and get a
            confirmed rate from our team, not an auto-generated estimate.
          </p>
          <div className="hero__cta">
            <Button href="#booking" size="lg">Book a shipment</Button>
            <Button href={company.phoneHref} size="lg" variant="outline" className="hero__call" icon={<Phone size={18} />}>
              Call {company.phone}
            </Button>
          </div>
          <ul className="hero__assurances">
            {assurances.map(({ icon: Icon, text }) => (
              <li key={text}><Icon size={18} aria-hidden="true" />{text}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
