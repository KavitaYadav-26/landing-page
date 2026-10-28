import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import './Field.css'

interface FieldShellProps { label: string; error?: string; hint?: string; children: (id: string, describedBy?: string) => ReactNode }

function FieldShell({ label, error, hint, children }: FieldShellProps) {
  const id = useId()
  const msgId = `${id}-msg`
  const describedBy = error || hint ? msgId : undefined
  return (
    <div className={`field ${error ? 'field--error' : ''}`.trim()}>
      <label className="field__label" htmlFor={id}>{label}</label>
      {children(id, describedBy)}
      {(error || hint) && (
        <p id={msgId} className="field__msg" role={error ? 'alert' : undefined}>{error ?? hint}</p>
      )}
    </div>
  )
}

interface BaseProps { label: string; error?: string; hint?: string }

export function TextField({ label, error, hint, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <input id={id} className="field__control" aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      )}
    </FieldShell>
  )
}

export function SelectField({ label, error, hint, children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <select id={id} className="field__control field__control--select" aria-invalid={!!error} aria-describedby={describedBy} {...props}>
          {children}
        </select>
      )}
    </FieldShell>
  )
}

export function TextAreaField({ label, error, hint, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} error={error} hint={hint}>
      {(id, describedBy) => (
        <textarea id={id} className="field__control" rows={3} aria-invalid={!!error} aria-describedby={describedBy} {...props} />
      )}
    </FieldShell>
  )
}
