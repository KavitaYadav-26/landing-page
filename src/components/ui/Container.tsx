import type { ElementType, ReactNode } from 'react'
import './Container.css'

interface ContainerProps { children: ReactNode; as?: ElementType; className?: string }

export function Container({ children, as: Tag = 'div', className = '' }: ContainerProps) {
  return <Tag className={`container ${className}`.trim()}>{children}</Tag>
}
