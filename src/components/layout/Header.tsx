import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { company, navItems } from '@/data/content'
import { useScrolled } from '@/hooks/useScrolled'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import './Header.css'

export function Header() {
  const scrolled = useScrolled(12)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useLockBodyScroll(open)
  useEscapeKey(open, close)

  return (
    <header className={`header ${scrolled || open ? 'header--solid' : ''}`}>
      <Container className="header__inner">
        <a href="#top" className="header__logo" aria-label="Shankh Logistics, back to top" onClick={close}>
          <Logo height={46} variant={scrolled || open ? 'dark' : 'light'} />
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          {/* <a className="header__phone" href={company.phoneHref}>
            <Phone size={16} aria-hidden="true" />
            <span>{company.phone}</span>
          </a> */}
          <Button href="#booking" size="md">Book now</Button>
          <button
            className="header__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}><a href={item.href} onClick={close}>{item.label}</a></li>
            ))}
          </ul>
        </nav>
        <Button href="#booking" size="lg" fullWidth onClick={close}>Book now</Button>
        <a className="mobile-menu__phone" href={company.phoneHref}>
          <Phone size={18} aria-hidden="true" /> {company.phone}
        </a>
      </div>
    </header>
  )
}
