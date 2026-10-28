import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { IconBadge } from '@/components/ui/IconBadge'
import { steps } from '@/data/content'
import './Process.css'

export function Process() {
  return (
    <Section id="process" tone="mist" labelledBy="process-title">
      <SectionHeading
        id="process-title"
        title="From first call to delivered, in four steps"
        description="You always know what happens next and who to call."
      />
      <ol className="process">
        {steps.map((step, i) => (
          <li className="process__step" key={step.title}>
            <div className="process__top">
              <IconBadge icon={step.icon} tone="dark" />
              <span className="process__num" aria-hidden="true">{i + 1}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
