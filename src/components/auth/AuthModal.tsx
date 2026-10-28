import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Loader2, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PasswordField, TextField } from '@/components/ui/Field'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import { isValidEmail, isValidPhone, login, register } from '@/services/auth'
import type { AuthField } from '@/services/auth'
import type { AuthUser, AuthView } from '@/types'
import './AuthModal.css'

type Errors = Partial<Record<AuthField, string>>

const copy: Record<AuthView, { title: string; sub: string }> = {
  login: { title: 'Welcome back', sub: 'Log in to book shipments faster with your details saved.' },
  register: { title: 'Create your account', sub: 'Register once and skip retyping your name and number on every booking.' },
}

/** Renders the modal. Mount once, near the top of the app. */
export function AuthModal() {
  const { modalOpen, closeAuth, view } = useAuth()
  return (
    <Modal open={modalOpen} onClose={closeAuth} labelledBy="auth-title" closeOnDark>
      <AuthDialog view={view} />
    </Modal>
  )
}

function AuthDialog({ view }: { view: AuthView }) {
  const { setView, signIn, closeAuth } = useAuth()
  const [welcome, setWelcome] = useState<{ user: AuthUser; isNew: boolean } | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  // When the tab changes, put the cursor in the first field (desktop only, so phone keyboards don't pop up).
  useEffect(() => {
    if (welcome || !window.matchMedia('(pointer: fine)').matches) return
    bodyRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
  }, [view, welcome])

  // Close by itself shortly after a successful login / registration.
  useEffect(() => {
    if (!welcome) return
    const timer = window.setTimeout(closeAuth, 1800)
    return () => window.clearTimeout(timer)
  }, [welcome, closeAuth])

  const done = (user: AuthUser, isNew: boolean) => {
    signIn(user)
    setWelcome({ user, isNew })
  }

  const head = welcome
    ? { title: welcome.isNew ? 'Account created' : 'You’re logged in', sub: 'Your details are saved for your next booking.' }
    : copy[view]

  return (
    <div className="auth">
      <div className="auth__head">
        <Logo variant="light" height={34} className="auth__logo" />
        <h2 id="auth-title" className="auth__title">{head.title}</h2>
        <p className="auth__sub">{head.sub}</p>
      </div>

      <div className="auth__body" ref={bodyRef}>
        {welcome ? (
          <div className="auth__success" role="status">
            <span className="auth__success-icon"><CheckCircle2 size={34} aria-hidden="true" /></span>
            <h3>{welcome.isNew ? 'Welcome' : 'Welcome back'}, {welcome.user.name.split(' ')[0]}</h3>
            <p>You can now book a shipment in a few taps.</p>
            <Button fullWidth onClick={() => { closeAuth(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Book a shipment
            </Button>
          </div>
        ) : (
          <>
            <div className="auth__tabs" role="tablist" aria-label="Account" data-view={view}>
              <span className="auth__tabs-thumb" aria-hidden="true" />
              <button type="button" role="tab" id="tab-login" aria-selected={view === 'login'} aria-controls="auth-panel" className="auth__tab" onClick={() => setView('login')}>
                Log in
              </button>
              <button type="button" role="tab" id="tab-register" aria-selected={view === 'register'} aria-controls="auth-panel" className="auth__tab" onClick={() => setView('register')}>
                Register
              </button>
            </div>

            <div id="auth-panel" role="tabpanel" aria-labelledby={`tab-${view}`}>
              {view === 'login'
                ? <LoginForm onSuccess={(u) => done(u, false)} />
                : <RegisterForm onSuccess={(u) => done(u, true)} />}
            </div>

            <p className="auth__switch">
              {view === 'login' ? 'New to Shankh Logistics?' : 'Already have an account?'}{' '}
              <button type="button" className="auth__link" onClick={() => setView(view === 'login' ? 'register' : 'login')}>
                {view === 'login' ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function useFormHelpers() {
  const formRef = useRef<HTMLFormElement>(null)
  const focusInvalid = () =>
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
  return { formRef, focusInvalid }
}

function FormAlert({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="auth__alert" role="alert">
      <AlertCircle size={18} aria-hidden="true" /> <span>{message}</span>
    </p>
  )
}

function SubmitIcon({ sending, children }: { sending: boolean; children: ReactNode }) {
  return sending ? <Loader2 size={18} className="auth__spin" /> : <>{children}</>
}

function LoginForm({ onSuccess }: { onSuccess: (user: AuthUser) => void }) {
  const [values, setValues] = useState({ identifier: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const { formRef, focusInvalid } = useFormHelpers()

  const bind = (key: 'identifier' | 'password') => ({
    value: values[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      if (errors[key] || errors.form) setErrors((er) => ({ ...er, [key]: undefined, form: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    const found: Errors = {}
    const id = values.identifier.trim()
    if (!id) found.identifier = 'Enter your mobile number or email.'
    else if (id.includes('@') ? !isValidEmail(id) : !isValidPhone(id)) found.identifier = 'Enter a valid 10-digit mobile number or email.'
    if (!values.password) found.password = 'Enter your password.'
    setErrors(found)
    if (Object.keys(found).length) { focusInvalid(); return }

    setSending(true)
    const res = await login(values.identifier, values.password)
    if (res.ok) { onSuccess(res.user); return }
    setSending(false)
    setErrors({ [res.field]: res.message })
    focusInvalid()
  }

  return (
    <form ref={formRef} className="auth__form" onSubmit={onSubmit} noValidate>
      <FormAlert message={errors.form} />
      <TextField label="Mobile number or email" autoComplete="username" placeholder="98765 43210 or you@company.in" data-autofocus {...bind('identifier')} />
      <PasswordField label="Password" autoComplete="current-password" placeholder="Your password" {...bind('password')} />
      <Button type="submit" size="lg" fullWidth disabled={sending} icon={<SubmitIcon sending={sending}><LogIn size={18} /></SubmitIcon>}>
        {sending ? 'Logging in' : 'Log in'}
      </Button>
    </form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: (user: AuthUser) => void }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const { formRef, focusInvalid } = useFormHelpers()

  const bind = (key: keyof typeof values) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }))
      if (errors[key] || errors.form) setErrors((er) => ({ ...er, [key]: undefined, form: undefined }))
    },
  })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    const found: Errors = {}
    if (values.name.trim().length < 2) found.name = 'Enter your full name.'
    if (!isValidPhone(values.phone)) found.phone = 'Enter a valid 10-digit mobile number.'
    if (values.email.trim() && !isValidEmail(values.email)) found.email = 'Enter a valid email address.'
    if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
      found.password = 'Use at least 8 characters with a letter and a number.'
    }
    setErrors(found)
    if (Object.keys(found).length) { focusInvalid(); return }

    setSending(true)
    const res = await register(values)
    if (res.ok) { onSuccess(res.user); return }
    setSending(false)
    setErrors({ [res.field]: res.message })
    focusInvalid()
  }

  return (
    <form ref={formRef} className="auth__form" onSubmit={onSubmit} noValidate>
      <FormAlert message={errors.form} />
      <TextField label="Full name" autoComplete="name" placeholder="Your name" data-autofocus {...bind('name')} />
      <TextField label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...bind('phone')} />
      <TextField label="Email" type="email" autoComplete="email" placeholder="you@company.in" hint="Optional" {...bind('email')} />
      <PasswordField label="Password" autoComplete="new-password" placeholder="Create a password" hint={errors.password ? undefined : 'At least 8 characters, with a letter and a number.'} {...bind('password')} />
      <Button type="submit" size="lg" fullWidth disabled={sending} icon={<SubmitIcon sending={sending}><UserPlus size={18} /></SubmitIcon>}>
        {sending ? 'Creating account' : 'Create account'}
      </Button>
    </form>
  )
}