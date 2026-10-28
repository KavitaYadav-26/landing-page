import { useCallback, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { AuthModal } from '@/components/auth/AuthModal'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/sections/Hero'
import { BookingBar } from '@/sections/BookingBar'
import { Services } from '@/sections/Services'
import { Warehousing } from '@/sections/Warehousing'
import { Fleet } from '@/sections/Fleet'
import { Process } from '@/sections/Process'
import { WhyUs } from '@/sections/WhyUs'
import { Booking } from '@/sections/Booking'
import { Faq } from '@/sections/Faq'
import { CtaBand } from '@/sections/CtaBand'
import type { BookingDraft } from '@/types'

export default function App() {
  const [draft, setDraft] = useState<BookingDraft>({ pickup: '', drop: '', vehicle: '' })

  const startBooking = useCallback((next: BookingDraft) => {
    setDraft(next)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <a className="skip-link" href="#services">Skip to content</a>
      <Header />
      <main>
        <Hero />
        <BookingBar onSubmit={startBooking} />
        
        <Services />
        <Booking draft={draft} />
        <Warehousing />
        <Fleet />
        <Process />
        <WhyUs />
        
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <AuthModal />
    </>
  )
}