import type { LucideIcon } from 'lucide-react'
import './IconBadge.css'

interface IconBadgeProps { icon: LucideIcon; tone?: 'teal' | 'dark' | 'glass'; size?: number }

export function IconBadge({ icon: Icon, tone = 'teal', size = 24 }: IconBadgeProps) {
  return (
    <span className={`icon-badge icon-badge--${tone}`} aria-hidden="true">
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}
