import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import './Modal.css'

const EXIT_MS = 220
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalProps {
  open: boolean
  onClose: () => void
  /** id of the heading inside the modal, for screen readers */
  labelledBy: string
  /** set true when the top of the modal has a dark background */
  closeOnDark?: boolean
  children: ReactNode
}

export function Modal({ open, onClose, labelledBy, closeOnDark = false, children }: ModalProps) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  // Keep the modal in the DOM while the exit animation plays.
  useEffect(() => {
    if (open) {
      if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    setClosing(true)
    const timer = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
      returnFocus.current?.focus?.()
      returnFocus.current = null
    }, EXIT_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useLockBodyScroll(mounted)
  useEscapeKey(open, onClose)

  // Stop the page from jumping sideways when the scrollbar disappears.
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const previous = root.style.getPropertyValue('scrollbar-gutter')
    root.style.setProperty('scrollbar-gutter', 'stable')
    return () => { root.style.setProperty('scrollbar-gutter', previous) }
  }, [mounted])

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (!mounted || !open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const wantsKeyboard = window.matchMedia('(pointer: fine)').matches
    const target = wantsKeyboard ? dialog.querySelector<HTMLElement>('[data-autofocus]') : null
    ;(target ?? dialog).focus({ preventScroll: true })
  }, [mounted, open])

  if (!mounted) return null

  // Keep Tab / Shift+Tab inside the dialog.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((n) => n.offsetParent !== null)
    if (!nodes.length) { e.preventDefault(); return }
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || active === dialogRef.current)) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
  }

  return createPortal(
    <div
      className={`modal ${closing ? 'is-closing' : ''}`.trim()}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button
          type="button"
          className={`modal__close ${closeOnDark ? 'modal__close--dark' : ''}`.trim()}
          aria-label="Close"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}