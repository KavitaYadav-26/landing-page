import type { ReactNode } from 'react'
import { Container } from './Container'
import './Section.css'

type Tone = 'default' | 'mist' | 'dark'

interface SectionProps {
  id?: string
  tone?: Tone
  children: ReactNode
  className?: string
  labelledBy?: string
}

export function Section({ id, tone = 'default', children, className = '', labelledBy }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section section--${tone} ${className}`.trim()}>
      <Container>{children}</Container>
    </section>
  )
}
