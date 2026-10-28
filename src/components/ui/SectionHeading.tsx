import type { ReactNode } from 'react'
import './SectionHeading.css'

interface SectionHeadingProps {
  id?: string
  title: string
  description?: ReactNode
  align?: 'left' | 'center'
  action?: ReactNode
}

export function SectionHeading({ id, title, description, align = 'left', action }: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      <div className="section-heading__text">
        <h2 id={id}>{title}</h2>
        {description && <p className="section-heading__desc">{description}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </header>
  )
}
