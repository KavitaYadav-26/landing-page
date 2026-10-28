import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import { vehicles } from '@/data/content'
import type { BookingDraft } from '@/types'
import './QuickBook.css'

interface QuickBookProps { onSubmit: (draft: BookingDraft) => void }

/** Compact route picker shown under the hero. Hands its values to the full booking form. */
export function QuickBook({ onSubmit }: QuickBookProps) {
  const [draft, setDraft] = useState<BookingDraft>({ pickup: '', drop: '', vehicle: '' })
  const set = (key: keyof BookingDraft) => (value: string) => setDraft((d) => ({ ...d, [key]: value }))

  const handle = (e: FormEvent) => { e.preventDefault(); onSubmit(draft) }

  return (
    <form className="quick-book" onSubmit={handle} aria-label="Start a booking">
      <TextField label="Pickup city" placeholder="e.g. Lucknow" value={draft.pickup} onChange={(e) => set('pickup')(e.target.value)} autoComplete="off" />
      <TextField label="Drop city" placeholder="e.g. Delhi" value={draft.drop} onChange={(e) => set('drop')(e.target.value)} autoComplete="off" />
      <SelectField label="Vehicle" value={draft.vehicle} onChange={(e) => set('vehicle')(e.target.value)}>
        <option value="">Not sure yet</option>
        {vehicles.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
      </SelectField>
      <Button type="submit" size="lg" icon={<ArrowRight size={18} />}>Continue booking</Button>
    </form>
  )
}
