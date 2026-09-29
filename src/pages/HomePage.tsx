import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, TrustBadge } from '../components/ui';
import { MOCK_STANDARDS, DEMO_RESPONSE } from '../data/mockData';

const SERVICE_CARDS = [
  {
    title: 'Find a Standard',
    desc: 'Discover Indian Standards relevant to your product or requirement.',
    btn: 'Explore Standards',
    path: '/standards',
    color: 'bg-bis-blue-light',
    iconColor: 'text-bis-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
      </svg>
    ),
  },
  {
    title: 'Certification',
    desc: 'Understand BIS certification schemes, requirements and procedures.',
    btn: 'View Certification',
    path: '/certification',
    color: 'bg-green-50',
    iconColor: 'text-bis-success',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/>
      </svg>
    ),
  },
  {
    title: 'Testing & Laboratories',
    desc: 'Find testing information and relevant laboratories for your product.',
    btn: 'Find Testing Services',
    path: '/testing',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"/>
      </svg>
    ),
  },
  {
    title: 'Hallmarking',
    desc: 'Understand BIS hallmarking requirements and verification processes.',
    btn: 'Explore Hallmarking',
    path: '/hallmarking',
    color: 'bg-amber-50',
    iconColor: 'text-bis-gold',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
      </svg>
    ),
  },
  {
    title: 'Consumer Services',
    desc: 'Find information and guidance for BIS-related consumer queries.',
    btn: 'Get Consumer Help',
    path: '/consumer',
    color: 'bg-teal-50',
    iconColor: 'text-teal-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
      </svg>
    ),
  },
  {
    title: 'Ask BIS Assistant',
    desc: 'Ask questions in natural language and receive source-backed answers.',
    btn: 'Start Conversation',
    path: '/assistant',
    highlight: true,
    color: 'bg-bis-navy',
    iconColor: 'text-bis-gold',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
      </svg>
    ),
  },
];

const SUGGESTED_QUERIES = [
  'Which standard applies to my product?',
  'How do I apply for BIS certification?',
  'What testing is required?',
  'How does hallmarking work?',
];

const HOW_STEPS = [
  { num: '01', title: 'Ask', desc: 'Describe your product or question in plain language.' },
  { num: '02', title: 'Understand', desc: 'The assistant identifies the product, intent and relevant BIS service.' },
  { num: '03', title: 'Retrieve', desc: 'Relevant BIS standards, documents and official information are retrieved.' },
  { num: '04', title: 'Verify', desc: 'The response includes supporting documents, sections, clauses or pages wherever applicable.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(q?: string) {
    const final = (q || query).trim();
    if (final) navigate('/assistant', { state: { initialQuery: final } });
    else navigate('/assistant');
  }

  return (
    <div id="main-content" className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-bis-navy relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,.5) 39px, rgba(255,255,255,.5) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,.5) 39px, rgba(255,255,255,.5) 40px)'
        }}/>
        {/* Diagonal accent block */}
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-bis-navy-hover/30 transform skew-x-12 translate-x-1/4 pointer-events-none"/>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Gov badge */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded px-2.5 py-1">
                <div className="w-2 h-2 rounded-full bg-bis-gold"/>
                <span className="text-white/80 text-xs font-medium tracking-wide">GOVERNMENT OF INDIA</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded px-2.5 py-1">
                <span className="text-white/80 text-xs font-medium">AI-ASSISTED INFORMATION</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Understand Indian Standards.
              <br/>
              <span className="text-bis-gold">Simplify BIS Services.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl">
              Ask questions in plain language and get source-backed information about Indian Standards, certification, testing, hallmarking and BIS services.
            </p>

            {/* AI Search box */}
            <div className="bg-white rounded-xl shadow-2xl shadow-black/30 mb-5 overflow-hidden max-w-2xl">
              <div className="flex items-center px-4 py-1 gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-bis-blue-light flex-shrink-0">
                  <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
                </div>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="Ask about an Indian Standard, certification, testing requirement, hallmarking or BIS service..."
                  className="flex-1 py-4 text-bis-text text-sm placeholder:text-bis-muted/70 outline-none bg-transparent"
                  aria-label="Ask the BIS Assistant"
                />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="p-2 text-bis-muted hover:text-bis-blue rounded-lg transition-colors"
                    aria-label="Voice input"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                  </button>
                  <button
                    className="p-2 text-bis-muted hover:text-bis-blue rounded-lg transition-colors"
                    aria-label="Attach document"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/></svg>
                  </button>
                  <div className="w-px h-6 bg-bis-border mx-1"/>
                  <button
                    onClick={() => handleSubmit()}
                    className="flex items-center gap-1.5 bg-bis-navy hover:bg-bis-navy-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ask
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </button>
                </div>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-2 border-t border-bis-border/50 pt-2.5">
                <span className="text-xs text-bis-muted py-0.5">Try:</span>
                {SUGGESTED_QUERIES.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="text-xs text-bis-blue bg-bis-blue-light hover:bg-bis-blue hover:text-white px-2.5 py-1 rounded border border-bis-blue/20 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/assistant')}
                className="flex items-center gap-2 px-6 py-3 bg-bis-gold hover:bg-bis-gold-bright text-white font-semibold rounded-lg text-sm transition-all active:scale-95 shadow-lg shadow-amber-900/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
                Ask the BIS Assistant
              </button>
              <button
                onClick={() => navigate('/standards')}
                className="flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-white/10 text-white font-medium rounded-lg text-sm border border-white/30 transition-all active:scale-95"
              >
                Explore Indian Standards
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ──────────────────────────────────────── */}
      <section className="bg-bis-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-bis-text">BIS Digital Services</h2>
              <p className="text-bis-muted text-sm mt-1">Access information on standards, certification, testing, hallmarking, and more.</p>
            </div>
            <button onClick={() => navigate('/resources')} className="text-sm text-bis-blue hover:text-bis-navy font-medium whitespace-nowrap transition-colors">
              All services →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_CARDS.map(card => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className={`text-left rounded-xl border transition-all duration-150 active:scale-[0.98] group
                  ${card.highlight
                    ? 'bg-bis-navy border-bis-navy-hover hover:bg-bis-navy-hover text-white'
                    : 'bg-white border-bis-border hover:border-bis-blue hover:shadow-md'
                  } p-5 flex flex-col gap-4`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${card.highlight ? 'bg-white/10' : card.color} ${card.iconColor}`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1.5 ${card.highlight ? 'text-white' : 'text-bis-text'}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${card.highlight ? 'text-white/70' : 'text-bis-muted'}`}>{card.desc}</p>
                </div>
                <span className={`text-sm font-medium flex items-center gap-1 transition-colors ${card.highlight ? 'text-bis-gold group-hover:text-white' : 'text-bis-blue group-hover:text-bis-navy'}`}>
                  {card.btn}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </span>
              </button>
            ))}
          </div>

          {/* Compliance CTA */}
          <div className="mt-5 p-5 bg-bis-gold-light border border-amber-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-bis-text mb-0.5">Check My BIS Requirements</h3>
              <p className="text-sm text-bis-muted">Answer guided questions to get an overview of potentially applicable standards, certification, and testing requirements.</p>
            </div>
            <button
              onClick={() => navigate('/compliance')}
              className="flex items-center gap-2 px-5 py-2.5 bg-bis-navy hover:bg-bis-navy-dark text-white font-medium rounded-lg text-sm transition-all whitespace-nowrap"
            >
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-bis-text mb-3">How the BIS Assistant Works</h2>
            <p className="text-bis-muted max-w-lg mx-auto text-sm">A four-step process that connects your question to authoritative BIS information.</p>
          </div>
          <div className="relative">
            {/* connector */}
            <div className="hidden md:block absolute top-9 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-bis-border"/>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {HOW_STEPS.map((step, i) => (
                <div key={step.num} className="flex flex-col items-center text-center px-4 py-2 relative">
                  <div className="w-16 h-16 rounded-full bg-bis-navy text-white flex flex-col items-center justify-center mb-4 relative z-10 shadow-md shadow-bis-navy/20">
                    <span className="text-[10px] text-white/50 font-mono leading-none tracking-wider">{step.num}</span>
                    <span className="text-base font-bold leading-none mt-0.5">{step.title}</span>
                  </div>
                  <p className="text-sm text-bis-muted leading-relaxed max-w-[180px]">{step.desc}</p>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="md:hidden mt-5 mb-1 text-bis-border">
                      <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ──────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-bis-surface border-y border-bis-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-bis-text mb-4">
                Built Around Evidence, Not Guesswork
              </h2>
              <p className="text-bis-muted leading-relaxed text-sm mb-6">
                The assistant prioritises authoritative BIS information and provides references for important claims. When evidence is unavailable, it says so clearly.
              </p>
              <button
                onClick={() => navigate('/assistant')}
                className="text-sm font-medium text-bis-blue hover:text-bis-navy flex items-center gap-1 transition-colors"
              >
                Try the assistant
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </button>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 gap-4">
              {[
                { icon: '📋', title: 'Source-backed', desc: 'Answers are grounded in retrieved BIS information drawn from official standards, certification documents, and BIS publications.' },
                { icon: '🔍', title: 'Traceable', desc: 'Users can inspect the source behind any answer. Every significant claim links to the underlying BIS document, section, or clause.' },
                { icon: '⚖️', title: 'Transparent', desc: 'The system clearly indicates when sufficient evidence is unavailable rather than generating speculative or unverified responses.' },
              ].map(c => (
                <div key={c.title} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-bis-border">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{c.icon}</div>
                  <div>
                    <h3 className="font-semibold text-bis-text mb-1">{c.title}</h3>
                    <p className="text-sm text-bis-muted leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ───────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-bis-text mb-3">See the Assistant in Action</h2>
            <p className="text-bis-muted text-sm">An example response to a real-world product query.</p>
          </div>

          {/* User message */}
          <div className="flex justify-end mb-4">
            <div className="bg-bis-navy text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-lg text-sm leading-relaxed shadow-sm">
              "I manufacture stainless-steel water bottles. Which Indian Standards may apply and what BIS requirements should I check?"
            </div>
          </div>

          {/* Assistant card */}
          <div className="bg-white rounded-xl border border-bis-border shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-bis-surface border-b border-bis-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-bis-navy rounded-md flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
                </div>
                <span className="font-semibold text-bis-text text-sm">BIS Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrustBadge type="source-backed" />
                <TrustBadge type="evidence" />
              </div>
            </div>

            <div className="p-5">
              {/* Product identified */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-bis-border">
                <span className="text-xs text-bis-muted font-medium uppercase tracking-wide">Product identified:</span>
                <span className="text-xs font-semibold text-white bg-bis-navy px-2.5 py-0.5 rounded">Stainless Steel Water Bottle</span>
              </div>

              <p className="text-sm text-bis-text leading-relaxed mb-5">{DEMO_RESPONSE.answer}</p>

              {/* Standards */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-3">Potentially Relevant Standards</h4>
                <div className="space-y-2">
                  {MOCK_STANDARDS.slice(0, demoOpen ? undefined : 2).map((std, i) => (
                    <div key={i} className="p-3.5 bg-bis-surface rounded-lg border border-bis-border">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className="text-xs font-mono font-bold text-bis-blue">{std.number}</span>
                            <Badge label={std.status} variant="green" />
                            <Badge label={`${std.relevance} relevance`} variant="gold" />
                          </div>
                          <p className="text-sm font-medium text-bis-text">{std.title}</p>
                          <p className="text-xs text-bis-muted mt-1 line-clamp-2">{std.scope}</p>
                        </div>
                        <button
                          onClick={() => navigate('/standards/detail')}
                          className="text-xs font-medium text-bis-blue hover:text-bis-navy border border-bis-border hover:border-bis-blue px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {!demoOpen && MOCK_STANDARDS.length > 2 && (
                  <button onClick={() => setDemoOpen(true)} className="mt-2 text-xs text-bis-blue hover:underline">
                    +{MOCK_STANDARDS.length - 2} more standards
                  </button>
                )}
              </div>

              {/* Sources */}
              <div className="pt-4 border-t border-bis-border">
                <h4 className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-3">Sources & Evidence</h4>
                <div className="space-y-2">
                  {DEMO_RESPONSE.sources.map((src, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bis-surface rounded-lg border border-bis-border gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-bis-text">{src.title}</span>
                        <span className="text-bis-muted text-xs"> · {src.section}</span>
                        <div className="mt-1.5"><TrustBadge type="official" /></div>
                      </div>
                      <button className="text-xs font-medium text-bis-blue hover:text-bis-navy border border-bis-border hover:border-bis-blue px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
                        View Source
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-bis-surface border-t border-bis-border flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/assistant')}
                className="px-4 py-2 bg-bis-navy hover:bg-bis-navy-dark text-white text-sm font-medium rounded-lg transition-colors"
              >
                Continue in Assistant
              </button>
              <button
                onClick={() => navigate('/compliance')}
                className="px-4 py-2 border border-bis-border hover:border-bis-blue text-bis-text text-sm font-medium rounded-lg transition-colors"
              >
                Check My Requirements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="bg-bis-navy py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Find relevant information faster.
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl mx-auto">
            Understand BIS requirements clearly. Explore source-backed information on Indian Standards and BIS services.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="flex items-center gap-2 px-6 py-3 bg-bis-gold hover:bg-bis-gold-bright text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-black/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
              Ask BIS Assistant
            </button>
            <button
              onClick={() => navigate('/workflow')}
              className="px-6 py-3 border border-white/30 hover:bg-white/10 text-white font-medium rounded-lg text-sm transition-all"
            >
              Find Standards for My Product
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
