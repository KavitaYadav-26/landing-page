import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Photo } from '@/components/ui/Photo'
import { company } from '@/data/content'
import { images } from '@/data/images'
import './CtaBand.css'

export function CtaBand() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <Photo src={images.warehouseWide} alt="" className="cta__bg" />
      <Container className="cta__inner">
        <h2 id="cta-title">Have a load ready to move?</h2>
        <p>Tell us the route and we will come back with a clear rate today.</p>
        <div className="cta__actions">
          <Button href="#booking" variant="primary" size="lg" icon={<ArrowRight size={18} />}>Book a shipment</Button>
          <Button href={company.phoneHref} variant="light" size="lg" icon={<Phone size={18} />}>{company.phone}</Button>
        </div>
      </Container>
    </section>
  )
}
