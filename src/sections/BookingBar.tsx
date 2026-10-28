import { Container } from '@/components/ui/Container'
import { QuickBook } from '@/components/QuickBook'
import type { BookingDraft } from '@/types'
import './BookingBar.css'

export function BookingBar({ onSubmit }: { onSubmit: (draft: BookingDraft) => void }) {
  return (
    <div className="booking-bar">
      <Container><QuickBook onSubmit={onSubmit} /></Container>
    </div>
  )
}
