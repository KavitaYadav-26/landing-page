import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './Accordion.css'

export interface AccordionItem { question: string; answer: string }

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <div className={`accordion__item ${open ? 'is-open' : ''}`} key={item.question}>
            <h3>
              <button
                className="accordion__trigger"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                <span>{item.question}</span>
                <ChevronDown size={20} aria-hidden="true" className="accordion__chevron" />
              </button>
            </h3>
            <div className="accordion__panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-trigger-${i}`}>
              <div><p>{item.answer}</p></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
