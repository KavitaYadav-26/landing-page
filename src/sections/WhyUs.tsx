import { IconBadge } from '@/components/ui/IconBadge'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { features } from '@/data/content'
import './WhyUs.css'

export function WhyUs() {
  return (
    <Section id="why" tone="dark" labelledBy="why-title" className="why">
      <SectionHeading
        id="why-title"
        title="Why businesses keep their freight with Shankh"
        description="Logistics is a promise made to your customer. These are the things we do to keep it."
      />
      <div className="why__grid">
        {features.map((f) => (
          <div className="why__item" key={f.title}>
            <IconBadge icon={f.icon} tone="glass" />
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
