import { Mail, MapPin, Phone, Clock3 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { company, navItems, services } from '@/data/content'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <Container>
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo variant="light" height={52} />
            <p>{company.tagline} Dependable road freight, warehousing and last-mile delivery for businesses across India.</p>
          </div>

          <nav aria-label="Footer quick links">
            <h3>Company</h3>
            <ul>
              {navItems.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}
              <li><a href="#booking">Book a shipment</a></li>
            </ul>
          </nav>

          <nav aria-label="Footer services">
            <h3>Services</h3>
            <ul>
              {services.map((s) => <li key={s.title}><a href="#services">{s.title}</a></li>)}
            </ul>
          </nav>

          <div>
            <h3>Contact</h3>
            <ul className="footer__contact">
              <li><Phone size={18} aria-hidden="true" /><a href={company.phoneHref}>{company.phone}</a></li>
              <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><MapPin size={18} aria-hidden="true" /><span>{company.address}</span></li>
              <li><Clock3 size={18} aria-hidden="true" /><span>{company.hours}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {company.year} {company.name}. All rights reserved.</p>
          <p>Freight, warehousing and delivery services across India.</p>
        </div>
      </Container>
    </footer>
  )
}
