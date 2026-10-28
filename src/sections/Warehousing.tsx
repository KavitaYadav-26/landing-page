import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Photo } from '@/components/ui/Photo'
import { Section } from '@/components/ui/Section'
import { images } from '@/data/images'
import './Warehousing.css'

const benefits = [
  'Covered, racked storage with controlled access',
  'Inbound checks and stock records you can ask for any day',
  'Pick, pack and dispatch on your schedule',
  'One team for storage and transport, so nothing falls between two vendors',
]

export function Warehousing() {
  return (
    <Section tone="mist" labelledBy="warehouse-title">
      <div className="split">
        <div className="split__media">
          <Photo src={images.warehouse} alt="Workers handling boxes on racked shelves inside a warehouse" ratio="5 / 4" className="split__photo" />
        </div>
        <div className="split__body">
          <h2 id="warehouse-title">Storage and dispatch, handled by the team that moves your freight</h2>
          <p>
            Stock waiting for a truck should not be waiting on a second vendor. Store with us,
            and we load the vehicle straight from the shelf.
          </p>
          <ul className="split__list">
            {benefits.map((b) => (
              <li key={b}><Check size={18} aria-hidden="true" /><span>{b}</span></li>
            ))}
          </ul>
          <Button href="#booking" variant="secondary" icon={<ArrowRight size={18} />}>Ask about warehousing</Button>
        </div>
      </div>
    </Section>
  )
}
