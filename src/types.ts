import type { LucideIcon } from 'lucide-react'

export interface NavItem { label: string; href: string }

export interface Service { title: string; description: string; icon: LucideIcon; points: string[] }

export interface Vehicle { name: string; capacity: string; bestFor: string }

export interface ProcessStep { title: string; description: string; icon: LucideIcon }

export interface Feature { title: string; description: string; icon: LucideIcon }

export interface Faq { question: string; answer: string }

export interface BookingDraft {
  pickup: string
  drop: string
  vehicle: string
}

export interface BookingPayload extends BookingDraft {
  name: string
  phone: string
  cargo: string
  date: string
  weight: string
  notes: string
}
