import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'What is the ISI Mark and why does it matter?',
    a: 'The ISI Mark (Indian Standards Institute mark) is India\'s official quality stamp given by BIS (Bureau of Indian Standards). When you see this mark on a product — like a helmet, electrical wire, or kitchen appliance — it means the product has been tested and certified to be safe. Without this mark, many products cannot be legally sold in India.',
  },
  {
    q: 'How do I check if an ISI Mark is genuine?',
    a: 'Download the free BIS Care App on your smartphone (available on Android and iOS). Open the app, tap "Verify License Details", and enter the 7-digit CM/L number printed near the ISI mark. The app will instantly tell you if the brand is genuine or fake. You can also visit www.bis.gov.in.',
  },
  {
    q: 'Which products must compulsorily have BIS certification?',
    a: 'Many everyday products are covered under Government Quality Control Orders (QCOs). These include electrical wires, switches, LPG cylinders, helmets, LED lights, steel rods (TMT bars), cement, and many electronics. Selling these without BIS certification is a legal offence under the BIS Act, 2016.',
  },
  {
    q: 'How does gold hallmarking work in India?',
    a: 'Gold hallmarking is mandatory in India. When you buy a hallmarked gold ornament, it has a unique 6-digit HUID (Hallmark Unique ID) laser-etched on it. You can verify this code on the BIS Care App or at www.bis.gov.in/hallmarking to confirm the gold purity (22K, 18K, etc.).',
  },
  {
    q: 'How can my business apply for BIS certification?',
    a: 'Visit the official BIS portal at manakonline.in. Register your company, submit your product for testing at a BIS-recognized laboratory, and then BIS officers will audit your factory. Once approved, you get a CM/L license number to stamp the ISI mark on your products.',
  },
  {
    q: 'What is the difference between ISI Mark and CRS registration?',
    a: 'ISI Mark (Scheme I) is for physical products like steel, cement, and appliances. CRS — Compulsory Registration Scheme (Scheme II) — is specifically for electronics like chargers, power banks, laptops, and LED drivers. Both are BIS certifications, just for different product categories.',
  },
  {
    q: 'Can I complain about a fake or uncertified product?',
    a: 'Yes! You can file a complaint with BIS online at www.bis.gov.in, email them at bis.india@bis.gov.in, or call the BIS Consumer Helpline at 1800-11-4000 (toll-free). You can also write to your nearest BIS Regional or Branch Office.',
  },
  {
    q: 'What is the BIS Care App and how do I use it?',
    a: 'The BIS Care App is a free government app available on Android (Google Play Store) and iOS (App Store). You can use it to: verify ISI-marked products, check gold hallmarking (HUID), find BIS-certified labs, locate nearby BIS offices, and report fake products.',
  },
];

const QUICK_LINKS = [
  {
    icon: '🤖',
    title: 'Ask BIS Assistant',
    desc: 'Get instant, plain-language answers to any BIS or standards question.',
    to: '/assistant',
    cta: 'Ask Now',
    color: 'bg-amber-50 border-amber-200',
    btnColor: 'bg-amber-600 hover:bg-amber-700',
  },
  {
    icon: '📋',
    title: 'Indian Standards Directory',
    desc: 'Search and browse thousands of Indian Standards (IS) across all industries.',
    to: '/standards',
    cta: 'Browse Standards',
    color: 'bg-blue-50 border-blue-200',
    btnColor: 'bg-bis-navy hover:bg-bis-navy-dark',
  },
  {
    icon: '✅',
    title: 'Product Certification Guide',
    desc: 'Step-by-step guide to getting your product BIS-certified in India.',
    to: '/certification',
    cta: 'View Guide',
    color: 'bg-emerald-50 border-emerald-200',
    btnColor: 'bg-emerald-700 hover:bg-emerald-800',
  },
  {
    icon: '🏺',
    title: 'Gold Hallmarking Info',
    desc: 'Everything about mandatory gold & silver hallmarking and the HUID system.',
    to: '/hallmarking',
    cta: 'Learn More',
    color: 'bg-yellow-50 border-yellow-200',
    btnColor: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    icon: '🧪',
    title: 'Find a Testing Lab',
    desc: 'Locate BIS-accredited laboratories near you for product testing.',
    to: '/testing',
    cta: 'Find Labs',
    color: 'bg-purple-50 border-purple-200',
    btnColor: 'bg-purple-700 hover:bg-purple-800',
  },
  {
    icon: '👤',
    title: 'Consumer Services',
    desc: 'Consumer rights, complaint filing, and guidance for everyday citizens.',
    to: '/consumer',
    cta: 'Consumer Help',
    color: 'bg-red-50 border-red-200',
    btnColor: 'bg-red-700 hover:bg-red-800',
  },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-bis-navy text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Help Centre
        </div>
        <h1 className="text-3xl font-bold text-bis-text mb-3">How can we help you?</h1>
        <p className="text-bis-muted text-base max-w-xl mx-auto leading-relaxed">
          Find answers to common questions about BIS certification, ISI marks, gold hallmarking, and consumer rights — explained in simple, everyday language.
        </p>
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
          Ask the AI Assistant instead
        </Link>
      </div>

      {/* Quick Links Grid */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-bis-text mb-4">Quick Help Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map(link => (
            <div key={link.to} className={`border rounded-xl p-5 flex flex-col gap-3 ${link.color}`}>
              <div className="text-2xl">{link.icon}</div>
              <div>
                <p className="font-semibold text-bis-text text-sm mb-1">{link.title}</p>
                <p className="text-xs text-bis-muted leading-relaxed">{link.desc}</p>
              </div>
              <Link
                to={link.to}
                className={`mt-auto inline-flex items-center gap-1.5 text-xs text-white font-semibold px-3 py-1.5 rounded-lg transition-colors ${link.btnColor}`}
              >
                {link.cta}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-bis-text mb-1">Frequently Asked Questions</h2>
        <p className="text-bis-muted text-sm mb-5">Plain-language answers for everyday citizens, consumers, and small businesses.</p>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-bis-border rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-bis-text hover:bg-bis-surface transition-colors"
                aria-expanded={openIdx === idx}
              >
                <span>{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-bis-muted flex-shrink-0 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-4 text-sm text-bis-muted leading-relaxed border-t border-bis-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still need help banner */}
      <div className="bg-bis-navy rounded-2xl p-8 text-center text-white">
        <p className="text-lg font-bold mb-2">Still have a question?</p>
        <p className="text-white/70 text-sm mb-5 max-w-md mx-auto">
          Our AI-powered BIS Assistant can answer questions in Hindi, Kannada, Tamil, and English — instantly, 24/7.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/assistant"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Ask the BIS Assistant
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2.5 border border-white/30 hover:border-white text-white font-medium rounded-xl text-sm transition-colors"
          >
            Contact BIS
          </Link>
        </div>
      </div>
    </div>
  );
}
