import { useState } from 'react';
import { Link } from 'react-router-dom';

const BIS_OFFICES = [
  {
    type: 'Head Office',
    name: 'BIS Bhavan, Manak Bhavan',
    address: '9, Bahadur Shah Zafar Marg, New Delhi – 110 002',
    phone: '+91-11-23230131',
    email: 'bis.india@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
  {
    type: 'Central Regional Office',
    name: 'BIS Central Regional Office',
    address: 'Plot No. 4, Sector 12, Dwarka, New Delhi – 110 078',
    phone: '+91-11-25092300',
    email: 'cro@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
  {
    type: 'Eastern Regional Office',
    name: 'BIS Eastern Regional Office',
    address: 'P-19, CIT Road, Scheme VII-M, Kolkata – 700 054',
    phone: '+91-33-23578986',
    email: 'ero@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
  {
    type: 'Western Regional Office',
    name: 'BIS Western Regional Office',
    address: 'Manakalaya, E-9, MIDC, Behind Maharashtra Police Headquarters, Andheri (E), Mumbai – 400 093',
    phone: '+91-22-28327091',
    email: 'wro@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
  {
    type: 'Southern Regional Office',
    name: 'BIS Southern Regional Office',
    address: 'IV Cross Road, CIT Campus, Taramani, Chennai – 600 113',
    phone: '+91-44-22541987',
    email: 'sro@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
  {
    type: 'Northern Regional Office',
    name: 'BIS Northern Regional Office',
    address: 'SCO 70-71, Sector 17-B, Chandigarh – 160 017',
    phone: '+91-172-2700803',
    email: 'nro@bis.gov.in',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
  },
];

const CONTACT_CHANNELS = [
  {
    icon: '📞',
    title: 'Consumer Helpline',
    value: '1800-11-4000',
    sub: 'Toll-Free · Mon–Sat, 9 AM – 6 PM',
    cta: 'tel:1800114000',
    ctaLabel: 'Call Now',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    icon: '✉️',
    title: 'General Enquiries',
    value: 'bis.india@bis.gov.in',
    sub: 'Response within 3–5 working days',
    cta: 'mailto:bis.india@bis.gov.in',
    ctaLabel: 'Send Email',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    btnColor: 'bg-bis-navy hover:bg-bis-navy-dark',
  },
  {
    icon: '🌐',
    title: 'Official Website',
    value: 'www.bis.gov.in',
    sub: 'Online services, licensing, complaints',
    cta: 'https://www.bis.gov.in',
    ctaLabel: 'Open Portal',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    btnColor: 'bg-amber-600 hover:bg-amber-700',
    external: true,
  },
  {
    icon: '📱',
    title: 'BIS Care App',
    value: 'Verify ISI, Gold HUID & more',
    sub: 'Free App — Android & iOS',
    cta: 'https://play.google.com/store/apps/details?id=com.bis.biscare',
    ctaLabel: 'Download App',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    btnColor: 'bg-purple-700 hover:bg-purple-800',
    external: true,
  },
];

type FormData = { name: string; email: string; phone: string; category: string; message: string };

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to a backend endpoint
    setSubmitted(true);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-bis-navy text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Contact BIS
        </div>
        <h1 className="text-3xl font-bold text-bis-text mb-3">Get in Touch with BIS</h1>
        <p className="text-bis-muted text-base max-w-xl mx-auto leading-relaxed">
          Bureau of Indian Standards is here to help citizens, businesses, and consumers. Reach us through any of the channels below.
        </p>
      </div>

      {/* Quick contact channels */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {CONTACT_CHANNELS.map(ch => (
          <div key={ch.title} className={`border rounded-xl p-5 flex flex-col gap-3 ${ch.color}`}>
            <div className="text-2xl">{ch.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm mb-0.5">{ch.title}</p>
              <p className="font-bold text-base leading-tight break-all">{ch.value}</p>
              <p className="text-xs opacity-70 mt-1">{ch.sub}</p>
            </div>
            <a
              href={ch.cta}
              target={ch.external ? '_blank' : undefined}
              rel={ch.external ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1.5 text-xs text-white font-semibold px-3 py-1.5 rounded-lg transition-colors ${ch.btnColor}`}
            >
              {ch.ctaLabel}
              {ch.external
                ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              }
            </a>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <section className="bg-white border border-bis-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-bis-text mb-1">Send a Query or Complaint</h2>
          <p className="text-xs text-bis-muted mb-5">Fill this form and a BIS representative will get back to you within 3–5 working days.</p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <p className="font-bold text-bis-text mb-1">Query Submitted!</p>
              <p className="text-sm text-bis-muted mb-4">Thank you. A BIS representative will respond to your registered email within 3–5 working days.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', category: '', message: '' }); }}
                className="text-sm text-bis-blue hover:text-bis-navy font-medium"
              >
                Submit another query →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-bis-text mb-1.5" htmlFor="contact-name">Full Name *</label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full border border-bis-border rounded-lg px-3 py-2 text-sm text-bis-text outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-bis-text mb-1.5" htmlFor="contact-phone">Mobile Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-bis-border rounded-lg px-3 py-2 text-sm text-bis-text outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-bis-text mb-1.5" htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-bis-border rounded-lg px-3 py-2 text-sm text-bis-text outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-bis-text mb-1.5" htmlFor="contact-category">Query Category *</label>
                <select
                  id="contact-category"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-bis-border rounded-lg px-3 py-2 text-sm text-bis-text outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue/20 transition-all bg-white"
                >
                  <option value="">Select a category...</option>
                  <option>ISI Mark / Product Certification</option>
                  <option>Gold / Silver Hallmarking</option>
                  <option>Electronics (CRS Registration)</option>
                  <option>Testing Laboratories</option>
                  <option>Complaint about Fake/Uncertified Product</option>
                  <option>License Renewal / New Application</option>
                  <option>Consumer Rights / General Query</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-bis-text mb-1.5" htmlFor="contact-message">Your Query / Message *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your query, complaint, or feedback in detail..."
                  className="w-full border border-bis-border rounded-lg px-3 py-2 text-sm text-bis-text outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue/20 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-bis-navy hover:bg-bis-navy-dark text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Submit Query
              </button>
            </form>
          )}
        </section>

        {/* Regional Offices */}
        <section>
          <h2 className="text-lg font-bold text-bis-text mb-1">BIS Regional Offices</h2>
          <p className="text-xs text-bis-muted mb-5">Find the office closest to you for in-person assistance.</p>
          <div className="space-y-3">
            {BIS_OFFICES.map(office => (
              <div key={office.type} className="bg-white border border-bis-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-bold text-bis-blue uppercase tracking-wide">{office.type}</p>
                  <span className="text-[10px] bg-bis-surface text-bis-muted px-2 py-0.5 rounded-full">{office.hours}</span>
                </div>
                <p className="font-semibold text-bis-text text-sm mb-1">{office.name}</p>
                <p className="text-xs text-bis-muted mb-2">{office.address}</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-1 text-bis-blue hover:text-bis-navy font-medium transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    {office.phone}
                  </a>
                  <a href={`mailto:${office.email}`} className="flex items-center gap-1 text-bis-blue hover:text-bis-navy font-medium transition-colors">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    {office.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* AI Assistant CTA */}
      <div className="bg-gradient-to-r from-bis-navy to-bis-navy-dark rounded-2xl p-8 text-center text-white">
        <p className="text-lg font-bold mb-2">Need an instant answer?</p>
        <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
          The BIS AI Assistant answers questions in Hindi, Kannada, Tamil, and English — 24/7, no waiting.
        </p>
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
          Ask BIS Assistant
        </Link>
      </div>
    </div>
  );
}
