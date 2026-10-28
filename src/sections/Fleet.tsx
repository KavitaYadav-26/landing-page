import { Container } from '@/components/ui/Container'
import { Photo } from '@/components/ui/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { industries, vehicles } from '@/data/content'
import { images } from '@/data/images'
import './Fleet.css'

export function Fleet() {
  return (
    <section className="section fleet" id="fleet" aria-labelledby="fleet-title">
      <Container>
        <SectionHeading
          id="fleet-title"
          title="The right vehicle for every load"
          description="Capacities below are typical. We confirm the exact vehicle and body type when we quote."
        />
        <div className="fleet__layout">
          <Photo src={images.fleet} alt="Flatbed truck carrying heavy cargo on the highway" className="fleet__photo" ratio="4 / 5" position="50% 40%" />
          <div className="fleet__table" role="table" aria-label="Vehicle types and capacities">
            <div className="fleet__row fleet__row--head" role="row">
              <span role="columnheader">Vehicle</span>
              <span role="columnheader">Capacity</span>
              <span role="columnheader">Best for</span>
            </div>
            {vehicles.map((v) => (
              <div className="fleet__row" role="row" key={v.name}>
                <strong role="cell">{v.name}</strong>
                <span role="cell">{v.capacity}</span>
                <span role="cell">{v.bestFor}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fleet__industries">
          <h3>Industries we move freight for</h3>
          <ul>
            {industries.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </Container>
    </section>
  )
}
