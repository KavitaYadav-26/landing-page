import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { BookingForm } from '@/components/BookingForm'
import { Section } from '@/components/ui/Section'
import { company } from '@/data/content'
import type { BookingDraft } from '@/types'
import './Booking.css'

const contactRows = [
  { icon: Phone, label: 'Call', value: company.phone, href: company.phoneHref },
  { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
  { icon: Clock3, label: 'Hours', value: company.hours },
  { icon: MapPin, label: 'Office', value: company.address },
]

export function Booking({ draft }: { draft: BookingDraft }) {
  return (
    <Section id="booking" tone="mist" labelledBy="booking-title">
      <div className="booking">
        <aside className="booking__info">
          <h2 id="booking-title">Book your Customer</h2>
          <p>
            Fill in the details and our team will call you back with a confirmed rate. Prefer to talk
            first? Reach us directly.
          </p>
          <ul>
            {contactRows.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <Icon size={20} aria-hidden="true" />
                <div>
                  <span className="booking__label">{label}</span>
                  {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <div className="booking__card">
          <BookingForm draft={draft} />
        </div>
      </div>
    </Section>
  )
}
