'use client'

import { useState } from 'react'
import { CONTACT_EMAIL, type Dict } from '@/lib/content'

export default function ContactForm({ dict }: { dict: Dict }) {
  const f = dict.contact.form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')

  // MVP: opens the visitor's mail client with the message pre-filled.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `[Portfolio] ${name}${company ? ` — ${company}` : ''}`
    const body = `${message}\n\n—\n${name}\n${company}\n${email}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const inputClass =
    'w-full border-b border-line bg-transparent py-3 text-base outline-none transition-colors placeholder:text-warmgray/70 focus:border-ink'

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-6 md:grid-cols-2">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-warmgray">{f.name}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-warmgray">{f.email}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-xs uppercase tracking-[0.2em] text-warmgray">{f.company}</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
      </label>
      <label className="block md:col-span-2">
        <span className="text-xs uppercase tracking-[0.2em] text-warmgray">{f.message}</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </label>
      <div className="md:col-span-2">
        <button
          type="submit"
          className="border border-ink px-8 py-3 text-sm tracking-[0.08em] transition-colors hover:bg-ink hover:text-paper"
        >
          {f.submit}
        </button>
      </div>
    </form>
  )
}
