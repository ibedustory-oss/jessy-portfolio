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
    'w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-warmgray/60 focus:border-accent focus:shadow-[0_0_0_4px_rgba(27,100,218,0.12)]'

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-charcoal">{f.name}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-charcoal">{f.email}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-[13px] font-semibold text-charcoal">{f.company}</span>
        <input value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-[13px] font-semibold text-charcoal">{f.message}</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </label>
      <div className="md:col-span-2 pt-1">
        <button
          type="submit"
          className="rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 ease-swift hover:bg-accenthover active:scale-[0.97]"
        >
          {f.submit}
        </button>
      </div>
    </form>
  )
}
