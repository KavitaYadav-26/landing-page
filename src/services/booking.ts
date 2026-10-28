import type { BookingPayload } from '@/types'
import { company } from '@/data/content'

export interface BookingResult { reference: string; whatsappUrl: string }

/**
 * Submits a booking request.
 * TODO: replace the body with a real call, e.g.
 *   await fetch('/api/bookings', { method: 'POST', body: JSON.stringify(payload) })
 * The WhatsApp link below works today with no backend.
 */
export async function submitBooking(payload: BookingPayload): Promise<BookingResult> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const reference = `SL-${Date.now().toString().slice(-6)}`
  const message = [
    `Hello Shankh Logistics, I would like to book a shipment (Ref ${reference}).`,
    `Name: ${payload.name}`,
    `Route: ${payload.pickup} to ${payload.drop}`,
    `Cargo: ${payload.cargo}${payload.weight ? `, ${payload.weight}` : ''}`,
    `Vehicle: ${payload.vehicle || 'Not sure'}`,
    `Pickup date: ${payload.date}`,
  ].join('\n')

  return {
    reference,
    whatsappUrl: `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`,
  }
}
