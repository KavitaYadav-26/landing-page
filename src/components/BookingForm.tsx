import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { cargoTypes, vehicles } from '@/data/content'
import { submitBooking } from '@/services/booking'
import type { BookingDraft, BookingPayload } from '@/types'
import type { BookingResult } from '@/services/booking'
import './BookingForm.css'

type Errors = Partial<Record<keyof BookingPayload, string>>

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = (draft: BookingDraft): BookingPayload => ({
  name: '', phone: '', pickup: draft.pickup, drop: draft.drop, vehicle: draft.vehicle,
  cargo: '', date: '', weight: '', notes: '',
})

function validate(values: BookingPayload): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  const digits = values.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = 'Enter a valid 10-digit mobile number.'
  if (!values.pickup.trim()) errors.pickup = 'Enter the pickup city.'
  if (!values.drop.trim()) errors.drop = 'Enter the drop city.'
  if (!values.cargo) errors.cargo = 'Select the type of cargo.'
  if (!values.date) errors.date = 'Choose a pickup date.'
  else if (values.date < today()) errors.date = 'Pickup date cannot be in the past.'
  return errors
}

export function BookingForm({ draft }: { draft: BookingDraft }) {
  const [values, setValues] = useState<BookingPayload>(() => emptyForm(draft))
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [result, setResult] = useState<BookingResult | null>(null)

  // When the hero booking bar sends a new route, reflect it here.
  useEffect(() => {
    setValues((v) => ({ ...v, pickup: draft.pickup || v.pickup, drop: draft.drop || v.drop, vehicle: draft.vehicle || v.vehicle }))
  }, [draft])

  const bind = (key: keyof BookingPayload) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById('booking-form')?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('sending')
    const res = await submitBooking(values)
    setResult(res)
    setStatus('done')
  }

  if (status === 'done' && result) {
    return (
      <div className="booking-success" role="status">
        <CheckCircle2 size={44} aria-hidden="true" />
        <h3>Booking request received</h3>
        <p>
          Reference <strong>{result.reference}</strong>. Our team will call <strong>{values.phone}</strong> shortly
          with a confirmed rate and vehicle plan.
        </p>
        <div className="booking-success__actions">
          <Button href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" icon={<MessageCircle size={18} />}>
            Confirm on WhatsApp
          </Button>
          <Button variant="outline" onClick={() => { setValues(emptyForm({ pickup: '', drop: '', vehicle: '' })); setStatus('idle') }}>
            Book another shipment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form id="booking-form" className="booking-form" onSubmit={onSubmit} noValidate>
      <div className="booking-form__grid">
        <TextField label="Full name" autoComplete="name" placeholder="Your name" {...bind('name')} />
        <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
        <TextField label="Pickup city" placeholder="e.g. Lucknow" {...bind('pickup')} />
        <TextField label="Drop city" placeholder="e.g. Delhi" {...bind('drop')} />
        <SelectField label="Cargo type" {...bind('cargo')}>
          <option value="">Select cargo type</option>
          {cargoTypes.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
        <SelectField label="Vehicle" {...bind('vehicle')}>
          <option value="">Not sure yet</option>
          {vehicles.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.capacity})</option>)}
        </SelectField>
        <TextField label="Pickup date" type="date" min={today()} {...bind('date')} />
        <TextField label="Approx. weight" placeholder="e.g. 4 tonnes" hint="Optional" {...bind('weight')} />
      </div>
      <TextAreaField label="Anything we should know?" placeholder="Loading time, fragile items, special handling" hint="Optional" {...bind('notes')} />
      <Button type="submit" size="lg" fullWidth disabled={status === 'sending'} icon={status === 'sending' ? <Loader2 size={18} className="spin" /> : <Send size={18} />}>
        {status === 'sending' ? 'Sending request' : 'Request booking'}
      </Button>
      <p className="booking-form__note">No payment needed now. We confirm the rate by phone before anything is booked.</p>
    </form>
  )
}
