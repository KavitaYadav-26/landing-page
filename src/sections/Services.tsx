import { Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { IconBadge } from '@/components/ui/IconBadge'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { services } from '@/data/content'
import './Services.css'

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeading
        id="services-title"
        title="Freight services built around your load"
        description="Whether it is one carton or twenty tonnes, pick the service that fits and we plan the rest."
      />
      <div className="services__grid">
        {services.map((s) => (
          <Card key={s.title} className="service">
            <IconBadge icon={s.icon} />
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <ul>
              {s.points.map((p) => (
                <li key={p}><Check size={16} aria-hidden="true" />{p}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  )
}
