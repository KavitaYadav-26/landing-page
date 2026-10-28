import { Accordion } from '@/components/ui/Accordion'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { faqs } from '@/data/content'
import './Faq.css'

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="faq">
        <SectionHeading id="faq-title" title="Questions, answered" description="Can't find what you need? Call us and a person will pick up." />
        <Accordion items={faqs} />
      </div>
    </Section>
  )
}
