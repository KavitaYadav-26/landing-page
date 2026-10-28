import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Briefcase, CheckCircle2, Loader2, MessageCircle, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { cargoTypes, vehicles } from '@/data/content'
import { submitBooking } from '@/services/booking'
import { useAuth } from './context/AuthContext'
import type { AuthUser, BookingDraft, BookingPayload, BookingRole } from '@/types'
import type { BookingResult } from '@/services/booking'
import './BookingForm.css'

type Errors = Partial<Record<keyof BookingPayload, string>>

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = (draft: BookingDraft, user: AuthUser | null = null, role: BookingRole = 'customer'): BookingPayload => ({
  role, firm: '', gst: '', partyName: '', partyPhone: '',
  name: user?.name ?? '', phone: user?.phone ?? '', pickup: draft.pickup, drop: draft.drop, vehicle: draft.vehicle,
  cargo: '', date: '', weight: '', notes: '',
})

const phoneDigits = (v: string) => v.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

function validate(values: BookingPayload): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!/^[6-9]\d{9}$/.test(phoneDigits(values.phone))) errors.phone = 'Enter a valid 10-digit mobile number.'

  if (values.role === 'broker') {
    if (values.firm.trim().length < 2) errors.firm = 'Enter your firm or agency name.'
    if (values.gst && !GSTIN.test(values.gst)) errors.gst = 'Enter a valid 15-character GST number.'
    if (values.partyName.trim().length < 2) errors.partyName = 'Enter the party name.'
    if (!/^[6-9]\d{9}$/.test(phoneDigits(values.partyPhone))) errors.partyPhone = 'Enter a valid 10-digit party mobile number.'
  }

  if (!values.pickup.trim()) errors.pickup = 'Enter the pickup city.'
  if (!values.drop.trim()) errors.drop = 'Enter the drop city.'
  if (!values.cargo) errors.cargo = 'Select the type of cargo.'
  if (!values.date) errors.date = 'Choose a pickup date.'
  else if (values.date < today()) errors.date = 'Pickup date cannot be in the past.'
  return errors
}

const roles: { id: BookingRole; label: string; hint: string; icon: typeof User }[] = [
  { id: 'customer', label: 'Customer', hint: 'Shipping your own goods', icon: User },
  { id: 'broker', label: 'Broker', hint: 'Booking for your party', icon: Briefcase },
]

function RoleTabs({ value, onChange }: { value: BookingRole; onChange: (role: BookingRole) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = value === 'customer' ? 'broker' : 'customer'
    onChange(next)
    refs.current[next]?.focus()
  }

  return (
    <div className="booking-roles" role="tablist" aria-label="Booking as" data-role={value} onKeyDown={onKeyDown}>
      <span className="booking-roles__thumb" aria-hidden="true" />
      {roles.map(({ id, label, hint, icon: Icon }) => (
        <button
          key={id}
          ref={(el) => { refs.current[id] = el }}
          type="button"
          role="tab"
          id={`role-${id}`}
          aria-selected={value === id}
          aria-controls="booking-form"
          tabIndex={value === id ? 0 : -1}
          className="booking-roles__tab"
          onClick={() => onChange(id)}
        >
          <span className="booking-roles__icon"><Icon size={18} aria-hidden="true" /></span>
          <span className="booking-roles__text">
            <strong>{label}</strong>
            <small>{hint}</small>
          </span>
        </button>
      ))}
    </div>
  )
}

export function BookingForm({ draft }: { draft: BookingDraft }) {
  const { user } = useAuth()
  const [values, setValues] = useState<BookingPayload>(() => emptyForm(draft, user))
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [result, setResult] = useState<BookingResult | null>(null)
  const isBroker = values.role === 'broker'

  // When the hero booking bar sends a new route, reflect it here.
  useEffect(() => {
    setValues((v) => ({ ...v, pickup: draft.pickup || v.pickup, drop: draft.drop || v.drop, vehicle: draft.vehicle || v.vehicle }))
  }, [draft])

  // Fill in name and mobile for logged-in users (never overwrites what they typed).
  useEffect(() => {
    if (user) setValues((v) => ({ ...v, name: v.name || user.name, phone: v.phone || user.phone }))
  }, [user])

  const bind = (key: Exclude<keyof BookingPayload, 'role'>, transform?: (v: string) => string) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: { target: { value: string } }) => {
      const next = transform ? transform(e.target.value) : e.target.value
      setValues((v) => ({ ...v, [key]: next }))
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
    },
  })

  const setRole = (role: BookingRole) => {
    setValues((v) => ({ ...v, role }))
    setErrors({})
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      window.setTimeout(() => document.getElementById('booking-form')?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
      return
    }
    setStatus('sending')
    const payload: BookingPayload = isBroker ? values : { ...values, firm: '', gst: '', partyName: '', partyPhone: '' }
    const res = await submitBooking(payload)
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
          <Button variant="outline" onClick={() => { setValues(emptyForm({ pickup: '', drop: '', vehicle: '' }, user, values.role)); setStatus('idle') }}>
            Book another shipment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <RoleTabs value={values.role} onChange={setRole} />

      <form id="booking-form" className="booking-form" role="tabpanel" aria-labelledby={`role-${values.role}`} onSubmit={onSubmit} noValidate>
        <div className="booking-form__grid">
          <TextField label={isBroker ? 'Your name' : 'Full name'} autoComplete="name" placeholder="Your name" {...bind('name')} />
          <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 xxxxx" {...bind('phone')} />
        </div>

        {isBroker && (
          <fieldset className="booking-form__panel">
            <legend className="sr-only">Broker and party details</legend>
            <div className="booking-form__panel-head" aria-hidden="true">
              <span><Briefcase size={16} /></span>
              <div>
                <strong>Broker &amp; party details</strong>
                <small>Tell us whose goods we are picking up.</small>
              </div>
            </div>
            {/* <div className="booking-form__grid">
              <TextField label="Firm / agency name" autoComplete="organization" placeholder="e.g. Shree Ram Transport Co." {...bind('firm')} />
              <TextField
                label="GST number" placeholder="22AAAAA0000A1Z5" maxLength={15} autoCapitalize="characters" spellCheck={false} hint="Optional"
                {...bind('gst', (v) => v.toUpperCase().replace(/\s/g, ''))}
              />
              <TextField label="Party name" placeholder="Consignor / company name" {...bind('partyName')} />
              <TextField label="Party mobile" type="tel" inputMode="tel" placeholder="98765 43210" {...bind('partyPhone')} />
            </div> */}
          </fieldset>
        )}

        <div className="booking-form__grid">
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
    </>
  )
}