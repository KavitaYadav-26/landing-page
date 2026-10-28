import { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarCheck, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import './UserMenu.css'

/** Avatar button + dropdown shown in the header after login. */
export function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEscapeKey(open, close)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) close() }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, close])

  if (!user) return null
  const firstName = user.name.split(' ')[0]

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu__btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="user-menu__avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
        <span className="user-menu__name">{firstName}</span>
        <ChevronDown size={16} aria-hidden="true" className="user-menu__chev" />
      </button>

      {open && (
        <div className="user-menu__panel" role="menu">
          <div className="user-menu__who">
            <strong>{user.name}</strong>
            <span>{user.email || `+91 ${user.phone}`}</span>
          </div>
          <a href="#booking" role="menuitem" className="user-menu__item" onClick={close}>
            <CalendarCheck size={18} aria-hidden="true" /> Book a shipment
          </a>
          <button type="button" role="menuitem" className="user-menu__item" onClick={() => { close(); signOut() }}>
            <LogOut size={18} aria-hidden="true" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}