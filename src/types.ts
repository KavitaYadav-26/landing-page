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

export type BookingRole = 'customer' | 'broker'

export interface BookingPayload extends BookingDraft {
  role: BookingRole
  /** broker only */
  firm: string
  gst: string
  partyName: string
  partyPhone: string
  name: string
  phone: string
  cargo: string
  date: string
  weight: string
  notes: string
}

export type AuthView = 'login' | 'register'

export interface AuthUser {
  id: string
  name: string
  phone: string
  email: string
}