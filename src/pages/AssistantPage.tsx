import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge, Drawer, Modal, Toast } from '../components/ui';
import { RECENT_QUERIES, DEMO_RESPONSE, MOCK_STANDARDS } from '../data/mockData';
import { useLang } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

// ── Backend API config ────────────────────────────────────────────────────────
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001';

type Source = {
  title: string;
  section: string;
  clause: string;
  page: string;
  type: string;
  relevance_score?: number;
};

type StandardRef = {
  number: string;
  title: string;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  state?: 'loading' | 'success' | 'partial' | 'error' | 'clarify';
  standards?: typeof MOCK_STANDARDS;
  sources?: Source[];
  certNote?: string;
  testingNote?: string;
  fromBackend?: boolean;
};

const LOADING_STEPS_BY_LANG: Record<string, string[]> = {
  hi: [
    'BIS स्रोतों में खोज की जा रही है...',
    'प्रासंगिक मानकों का विश्लेषण किया जा रहा है...',
    'सरल उत्तर तैयार किया जा रहा है...',
  ],
  kn: [
    'BIS ಮೂಲಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    'ಸಂಬಂಧಿತ ಮಾನದಂಡಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    'ಸರಳ ಉತ್ತರವನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
  ],
  ta: [
    'BIS ஆதாரங்கள் தேடப்படுகின்றன...',
    'தொடர்புடைய தரநிலைகள் பகுப்பாய்வு செய்யப்படுகின்றன...',
    'எளிய பதில் தயாரிக்கப்படுகிறது...',
  ],
  en: [
    'Searching BIS sources...',
    'Analysing relevant standards...',
    'Preparing your answer...',
  ],
};

const LOADING_STEPS = LOADING_STEPS_BY_LANG.en;

const PLACEHOLDERS: Record<string, string> = {
  hi: 'भारतीय मानक, प्रमाणीकरण, परीक्षण या हॉलमार्किंग के बारे में पूछें...',
  kn: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು, ಪ್ರಮಾಣೀಕರಣ, ಪರೀಕ್ಷೆ ಅಥವಾ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಬಗ್ಗೆ ಕೇಳಿ...',
  ta: 'இந்திய தரநிலைகள், சான்றிதழ், சோதனை அல்லது ஹால்மார்க்கிங் பற்றி கேளுங்கள்...',
  en: 'Ask about Indian Standards, certification, testing, hallmarking or BIS services...',
};

const CLARIFY_OPTIONS = ['Product', 'Certification', 'Testing', 'Hallmarking', 'Consumer query'];

function getSourceLinkDetails(source: { title?: string; section?: string; type?: string; bis_url?: string; url?: string } | null) {
  if (!source) {
    return {
      externalUrl: 'https://www.bis.gov.in',
      externalLabel: 'Open Official BIS Portal (bis.gov.in)',
      internalPath: null,
    };
  }

  if (source.bis_url || source.url) {
    return {
      externalUrl: source.bis_url || source.url || 'https://www.bis.gov.in',
      externalLabel: 'Open Official Source on bis.gov.in',
      internalPath: null,
    };
  }

  const combined = `${source.title || ''} ${source.section || ''}`.toUpperCase();

  // Check for Indian Standard like IS 1786, IS 2062, IS 10500, etc.
  const isMatch = combined.match(/IS\s*(\d+)(?:\s*\(PART\s*\d+\))?(?::\d{4})?/i);
  if (isMatch) {
    const isNum = isMatch[1];
    const standardId = `is-${isNum}`;
    const standardNum = isMatch[0];
    return {
      externalUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails',
      externalLabel: `Open ${standardNum} on Official BIS Portal`,
      internalPath: `/standards/detail?id=${standardId}`,
    };
  }

  // Quality Control Orders
  if (combined.includes('QUALITY CONTROL') || combined.includes('QCO')) {
    return {
      externalUrl: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/',
      externalLabel: 'Open Mandatory QCO List on bis.gov.in',
      internalPath: '/compliance',
    };
  }

  // Hallmarking
  if (combined.includes('HALLMARK') || combined.includes('HUID')) {
    return {
      externalUrl: 'https://www.bis.gov.in/hallmarking-overview/',
      externalLabel: 'Open Hallmarking Scheme on bis.gov.in',
      internalPath: '/hallmarking',
    };
  }

  // Testing
  if (combined.includes('TEST') || combined.includes('LABORATOR')) {
    return {
      externalUrl: 'https://www.bis.gov.in/laboratory-services/laboratory-network/',
      externalLabel: 'Open Testing Laboratories on bis.gov.in',
      internalPath: '/testing',
    };
  }

  // Certification schemes
  if (combined.includes('CERTIFICATION') || combined.includes('SCHEME')) {
    return {
      externalUrl: 'https://www.bis.gov.in/product-certification/conformity-assessment-schemes/',
      externalLabel: 'Open Certification Schemes on bis.gov.in',
      internalPath: '/certification',
    };
  }

  return {
    externalUrl: 'https://www.bis.gov.in',
    externalLabel: 'Open Official BIS Portal (bis.gov.in)',
    internalPath: null,
  };
}

export default function AssistantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLang();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<typeof DEMO_RESPONSE.sources[0] | null>(null);
  const [newQueryModal, setNewQueryModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle initial query from navigation state
  useEffect(() => {
    const state = location.state as { initialQuery?: string } | null;
    if (state?.initialQuery) {
      setTimeout(() => sendMessage(state.initialQuery!), 100);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  async function sendMessage(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');

    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: q };
    const loadingId = `a${Date.now() + 1}`;
    const loadingMsg: Message = { id: loadingId, role: 'assistant', content: '', state: 'loading' };

    setMessages(prev => [...prev, userMsg, loadingMsg]);

    // Animate loading steps
    const activeSteps = LOADING_STEPS_BY_LANG[lang] || LOADING_STEPS_BY_LANG.en;
    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step++;
      if (step < activeSteps.length) setLoadingStep(step);
    }, 1000);

    // Handle clarify intent (ambiguous queries)
    const isAmbiguous =
      q.toLowerCase() === 'what standard do i need?' ||
      (q.toLowerCase().includes('what standard') && q.length < 35 && !q.toLowerCase().includes('product'));

    if (isAmbiguous) {
      clearInterval(interval);
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === loadingId ? {
          ...m,
          content: "I'd be happy to help. Which product or service are you asking about?",
          state: 'clarify',
        } : m));
      }, 800);
      return;
    }

    // ── Call the real RAG backend ────────────────────────────────────────────
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, top_k: 5, language: lang }),
        signal: AbortSignal.timeout(45000),  // 45s timeout for LLM
      });

      clearInterval(interval);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(err.detail || `Server error ${response.status}`);
      }

      const data = await response.json();

      // Map backend standard refs to MOCK_STANDARDS shape (for UI display)
      const backendStandards = data.standards?.map((s: StandardRef) => ({
        id: s.number.toLowerCase().replace(/\s/g, '-'),
        number: s.number,
        title: s.title,
        status: 'Current',
        year: '',
        scope: '',
        relevance: 'High',
        certRequired: false,
        testingRequired: true,
        tags: [],
        division: '',
        mandatory: false,
      })) ?? [];

      setMessages(prev => prev.map(m => m.id === loadingId ? {
        ...m,
        content: data.answer,
        state: 'success',
        standards: backendStandards.length > 0 ? backendStandards : undefined,
        sources: data.sources?.length > 0 ? data.sources : undefined,
        fromBackend: data.ready,
      } : m));

    } catch (err: any) {
      clearInterval(interval);

      // Fallback to demo data if backend is unreachable
      const isNetworkError = err.name === 'TypeError' || err.name === 'AbortError' || err.message?.includes('fetch');

      if (isNetworkError) {
        // Backend not running — gracefully degrade to demo response
        setMessages(prev => prev.map(m => m.id === loadingId ? {
          ...m,
          content: DEMO_RESPONSE.answer + '\n\n*(Note: Using demo data — start the backend for real RAG-powered answers)*',
          state: 'success',
          standards: DEMO_RESPONSE.standards as any,
          sources: DEMO_RESPONSE.sources,
          certNote: DEMO_RESPONSE.certNote,
          testingNote: DEMO_RESPONSE.testingNote,
          fromBackend: false,
        } : m));
      } else {
        // Real backend error
        setMessages(prev => prev.map(m => m.id === loadingId ? {
          ...m,
          content: `Error: ${err.message ?? 'Failed to get a response. Please try again.'}`,
          state: 'error',
        } : m));
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    /* full viewport minus sticky header (32 + 56 + 44 = 132px) */
    <div className="flex bg-bis-surface overflow-hidden" style={{ height: 'calc(100dvh - 132px)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static inset-y-0 left-0 z-40 md:z-auto
        w-64 bg-white border-r border-bis-border flex flex-col transition-transform duration-200
        shadow-xl md:shadow-none
      `}>
        <div className="p-3 border-b border-bis-border">
          <button
            onClick={() => messages.length > 0 ? setNewQueryModal(true) : null}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-bis-navy hover:bg-bis-navy-dark text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            New Query
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest px-2 mb-1.5">Recent Queries</p>
            <div className="space-y-0.5">
              {RECENT_QUERIES.map(q => (
                <button
                  key={q.id}
                  onClick={() => { sendMessage(q.title); setSidebarOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-bis-text hover:bg-bis-surface rounded-lg transition-colors group"
                >
                  <div className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-bis-muted flex-shrink-0 mt-0.5 group-hover:text-bis-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs font-medium">{q.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-bis-muted">{q.date}</span>
                        <Badge label={q.category} variant="gray" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 pb-3 border-t border-bis-border pt-3">
            <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest px-2 mb-1.5">Saved Standards</p>
            <div className="px-2 py-2 text-xs text-bis-muted">No saved standards yet.</div>
            <button
              onClick={() => navigate('/saved')}
              className="w-full text-left px-2 py-1 text-xs text-bis-blue hover:text-bis-navy transition-colors"
            >
              View all saved →
            </button>
          </div>

          <div className="px-3 pb-3 border-t border-bis-border pt-3">
            <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest px-2 mb-1.5">Saved Reports</p>
            <div className="px-2 py-2 text-xs text-bis-muted">No generated reports.</div>
          </div>
        </div>

        <div className="p-3 border-t border-bis-border">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-bis-muted hover:text-bis-text hover:bg-bis-surface rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Help & Guidance
          </button>
        </div>
      </aside>

      {/* ── Main chat ───────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat header */}
        <div className="bg-white border-b border-bis-border px-4 py-2.5 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-1.5 rounded-lg text-bis-muted hover:text-bis-text hover:bg-bis-surface transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            </button>
            <div className="w-7 h-7 bg-bis-navy rounded-md flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-bis-text text-sm leading-tight truncate">{t.nav.askAssistant}</h1>
              <p className="text-[11px] text-bis-muted leading-tight truncate">Source-backed information on Indian Standards</p>
            </div>
          </div>

          {/* Quick language toggle */}
          <div className="flex items-center gap-1 bg-bis-surface p-1 rounded-lg border border-bis-border flex-shrink-0">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-0.5 text-xs rounded-md font-medium transition-all ${
                  lang === l.code
                    ? 'bg-bis-navy text-white shadow-xs'
                    : 'text-bis-muted hover:text-bis-text hover:bg-white'
                }`}
                title={l.label}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState onQuery={sendMessage} lang={lang} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  loadingStep={loadingStep}
                  onOpenSource={src => { setSelectedSource(src); setDrawerOpen(true); }}
                  onSaveStandard={() => showToast('Standard saved to your collection.')}
                  onClarify={sendMessage}
                  onNavigate={navigate}
                />
              ))}
              <div ref={bottomRef}/>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-bis-border p-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 border border-bis-border rounded-xl bg-white focus-within:border-bis-blue focus-within:ring-1 focus-within:ring-bis-blue/30 transition-all p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDERS[lang] || PLACEHOLDERS.en}
                className="flex-1 resize-none text-sm text-bis-text placeholder:text-bis-muted/60 outline-none bg-transparent min-h-[40px] max-h-32 py-1.5 px-2 leading-relaxed"
                rows={1}
                aria-label="Message input"
              />
              <div className="flex items-center gap-1 flex-shrink-0 pb-0.5">
                <button className="p-1.5 text-bis-muted hover:text-bis-blue rounded-lg transition-colors" aria-label="Voice input">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </button>
                <button className="p-1.5 text-bis-muted hover:text-bis-blue rounded-lg transition-colors" aria-label="Attach file">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/></svg>
                </button>
                <div className="w-px h-5 bg-bis-border"/>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  className="p-1.5 bg-bis-navy hover:bg-bis-navy-dark text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-bis-muted mt-2 text-center">
              AI-generated information — verify important decisions against official BIS sources.
            </p>
          </div>
        </div>
      </main>

      {/* Source Drawer */}
      <Drawer open={drawerOpen} title="Source Document" onClose={() => setDrawerOpen(false)}>
        {selectedSource && (() => {
          const linkDetails = getSourceLinkDetails(selectedSource);
          return (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-wider mb-1.5">Document</p>
                <p className="font-semibold text-bis-text">{selectedSource.title}</p>
                <p className="text-xs text-bis-muted mb-2">{selectedSource.type}</p>
                <TrustBadge type="official" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-wider mb-2">Relevant Section</p>
                <div className="bg-bis-blue-pale border border-bis-blue/20 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-bis-blue"/>
                    <span className="text-xs font-semibold text-bis-blue">{selectedSource.section}</span>
                  </div>
                  <p className="text-sm text-bis-text leading-relaxed">
                    {selectedSource.title?.includes('IS 1786')
                      ? 'Specifies requirements for high strength deformed steel bars and wires for concrete reinforcement (TMT bars), including Fe 415, Fe 500, Fe 500D, Fe 550, and Fe 600 grades.'
                      : selectedSource.title?.includes('IS 2062')
                      ? 'Specifies requirements for hot-rolled medium and high tensile structural steel for buildings, bridges, and infrastructure.'
                      : selectedSource.title?.includes('QUALITY CONTROL')
                      ? 'Government notification mandating compulsory BIS certification (ISI Mark) under Section 16 of the BIS Act, 2016.'
                      : selectedSource.title?.includes('TESTING')
                      ? 'Standard testing protocol for product conformity assessment conducted by BIS Central Laboratory and recognised NABL testing laboratories.'
                      : `Official Bureau of Indian Standards document citation for ${selectedSource.title}.`}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-wider mb-2">Reference</p>
                <div className="bg-bis-surface rounded-lg p-3 space-y-1.5 text-sm">
                  <div className="flex gap-3"><span className="text-bis-muted w-16">Section</span><span className="font-medium text-bis-text">{selectedSource.section}</span></div>
                  <div className="flex gap-3"><span className="text-bis-muted w-16">Clause</span><span className="font-medium text-bis-text">{selectedSource.clause || '—'}</span></div>
                  <div className="flex gap-3"><span className="text-bis-muted w-16">Page</span><span className="font-medium text-bis-text">{selectedSource.page || '—'}</span></div>
                </div>
              </div>

              {/* Working Navigation and External Links */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-bis-border">
                <a
                  href={linkDetails.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bis-navy hover:bg-bis-navy-dark !text-white text-white text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                  style={{ color: '#ffffff', backgroundColor: '#0d2858' }}
                >
                  <span className="!text-white text-white font-semibold" style={{ color: '#ffffff' }}>{linkDetails.externalLabel}</span>
                  <svg className="w-4 h-4 flex-shrink-0 !text-white text-white" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {linkDetails.internalPath && (
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate(linkDetails.internalPath!);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-bis-blue/40 hover:border-bis-blue bg-bis-blue-light/50 text-bis-navy text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Full Standard Profile in App</span>
                  </button>
                )}

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-bis-border hover:bg-bis-surface text-bis-muted hover:text-bis-text text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Drawer>

      {/* New Query Modal */}
      <Modal open={newQueryModal} title="Start a new query?" onClose={() => setNewQueryModal(false)}>
        <p className="text-sm text-bis-muted mb-6">This will clear your current conversation. Previous queries remain accessible in the sidebar.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setNewQueryModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setMessages([]); setInput(''); setNewQueryModal(false); }}>
            Start New
          </Button>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-2 duration-200">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>
        </div>
      )}
    </div>
  );
}

const SUGGESTIONS_BY_LANG: Record<string, { heading: string; sub: string; items: string[] }> = {
  hi: {
    heading: 'मैं आपकी क्या मदद कर सकता हूँ?',
    sub: 'भारतीय मानकों, BIS प्रमाणीकरण, परीक्षण आवश्यकताओं, हॉलमार्किंग या किसी भी सरकारी नियम के बारे में पूछें। उत्तर आधिकारिक BIS स्रोतों पर आधारित हैं।',
    items: [
      'स्टेनलेस स्टील पानी की बोतल के लिए कौन सा मानक लागू होता है?',
      'BIS प्रमाणीकरण के लिए आवेदन कैसे करें?',
      'LED लाइट के लिए परीक्षण आवश्यकताएं क्या हैं?',
      'भारत में सोने की हॉलमार्किंग कैसे काम करती है?',
      'किन उत्पादों के लिए BIS प्रमाणीकरण अनिवार्य है?',
      'ISI मार्क क्या है और असली की पहचान कैसे करें?',
    ]
  },
  kn: {
    heading: 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    sub: 'ಭಾರತೀಯ ಮಾನದಂಡಗಳು, BIS ಪ್ರಮಾಣೀಕರಣ, ಪರೀಕ್ಷಾ ಅವಶ್ಯಕತೆಗಳು, ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಅಥವಾ ಯಾವುದೇ BIS ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ. ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಉತ್ತರಗಳು ಲಭ್ಯ.',
    items: [
      'ಸ್ಟೇನ್‌ಲೆಸ್ ಸ್ಟೀಲ್ ನೀರಿನ ಬಾಟಲಿಗೆ ಯಾವ ಮಾನದಂಡ ಅನ್ವಯಿಸುತ್ತದೆ?',
      'BIS ಪ್ರಮಾಣೀಕರಣಕ್ಕೆ ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು?',
      'LED ದೀಪಗಳಿಗೆ ಪರೀಕ್ಷಾ ಅವಶ್ಯಕತೆಗಳು ಯಾವುವು?',
      'ಭಾರತದಲ್ಲಿ ಚಿನ್ನದ ಹಾಲ್‌ಮಾರ್ಕಿಂಗ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?',
      'ಯಾವ ಉತ್ಪನ್ನಗಳಿಗೆ BIS ಪ್ರಮಾಣೀಕರಣ ಕಡ್ಡಾಯವಾಗಿದೆ?',
      'ISI ಮುದ್ರೆ ಎಂದರೇನು ಮತ್ತು ಅದನ್ನು ಹೇಗೆ ಗುರುತಿಸುವುದು?',
    ]
  },
  ta: {
    heading: 'நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
    sub: 'இந்திய தரநிலைகள், BIS சான்றிதழ், சோதனை தேவைகள், ஹால்மார்க்கிங் அல்லது ஏதேனும் BIS தொடர்பான கேள்விகளைக் கேளுங்கள். பதில்கள் அதிகாரப்பூர்வ BIS ஆதாரங்களை அடிப்படையாகக் கொண்டவை.',
    items: [
      'துருப்பிடிக்காத எஃகு தண்ணீர் பாட்டிலுக்கு எந்த தரநிலை பொருந்தும்?',
      'BIS சான்றிதழுக்கு எவ்வாறு விண்ணப்பிப்பது?',
      'LED விளக்குகளுக்கான சோதனை தேவைகள் யாவை?',
      'இந்தியாவில் தங்க ஹால்மார்க்கிங் எவ்வாறு செயல்படுகிறது?',
      'எந்த தயாரிப்புகளுக்கு BIS சான்றிதழ் கட்டாயமாகும்?',
      'ISI முத்திரை என்றால் என்ன மற்றும் அதை எவ்வாறு அடையாளம் காண்பது?',
    ]
  },
  en: {
    heading: 'How can I help you?',
    sub: 'Ask about Indian Standards, BIS certification, testing requirements, hallmarking, or any BIS-related query. Responses are grounded in official BIS sources.',
    items: [
      'Which standard applies to stainless steel water bottles?',
      'How do I apply for BIS certification?',
      'What are the testing requirements for LED lights?',
      'How does gold hallmarking work in India?',
      'Which products need mandatory BIS certification?',
      'What is the ISI Mark?',
    ]
  }
};

/* ── Empty state ──────────────────────────────────────────── */
function EmptyState({ onQuery, lang }: { onQuery: (q: string) => void; lang: string }) {
  const content = SUGGESTIONS_BY_LANG[lang] || SUGGESTIONS_BY_LANG.en;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-10 mb-6">
        <div className="w-12 h-12 bg-bis-navy rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
        </div>
        <h2 className="text-xl font-bold text-bis-text mb-2">{content.heading}</h2>
        <p className="text-bis-muted text-sm max-w-md mx-auto leading-relaxed">
          {content.sub}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {content.items.map(s => (
          <button
            key={s}
            onClick={() => onQuery(s)}
            className="text-left p-3.5 bg-white border border-bis-border rounded-xl hover:border-bis-blue hover:shadow-sm transition-all text-sm text-bis-text group"
          >
            <div className="flex items-start gap-2.5">
              <svg className="w-3.5 h-3.5 text-bis-muted group-hover:text-bis-blue mt-0.5 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              <span className="leading-relaxed">{s}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Markdown parser and FormattedMessage for simple Indian-citizen answers ── */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-bis-navy-dark">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-bis-text">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-bis-surface border border-bis-border rounded font-mono text-xs text-bis-blue">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  // Split by double newline or '---' to form individual visual sections
  const rawSections = content.split(/\n\s*---\s*\n|\n\n+/);

  return (
    <div className="space-y-4 text-sm text-bis-text leading-relaxed">
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // 1. In Simple Words (Quick Summary callout)
        if (
          trimmed.includes('In Simple Words') ||
          trimmed.includes('सरल शब्दों में') ||
          trimmed.includes('ಸರಳ ಮಾತುಗಳಲ್ಲಿ') ||
          trimmed.includes('எளிய சொற்களில்')
        ) {
          const lines = trimmed.split('\n');
          const titleLine = lines[0].replace(/^[#*\s💡]+/, '').replace(/[*#]/g, '').trim();
          const bodyLines = lines.slice(1).join('\n').trim();

          return (
            <div key={idx} className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
                <span className="text-base">💡</span>
                <span>{titleLine || 'In Simple Words'}</span>
                <span className="ml-auto text-[10px] bg-amber-200/70 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Quick Summary
                </span>
              </div>
              <div className="text-amber-950 text-sm leading-relaxed space-y-1">
                {(bodyLines || lines.join(' ')).split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{parseInlineMarkdown(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // 2. Is It Compulsory by Law (Legal Status Card)
        if (
          trimmed.includes('Compulsory by Law') ||
          trimmed.includes('Mandatory by Law') ||
          trimmed.includes('Is It Compulsory') ||
          trimmed.includes('कानूनन अनिवार्य') ||
          trimmed.includes('ಕಾನೂನಿನ ಪ್ರಕಾರ ಕಡ್ಡಾಯ') ||
          trimmed.includes('ಕಡ್ಡಾಯವೇ') ||
          trimmed.includes('சட்டப்படி கட்டாயமா')
        ) {
          const isMandatory =
            trimmed.toUpperCase().includes('YES') ||
            trimmed.includes('Mandatory') ||
            trimmed.includes('हाँ') ||
            trimmed.includes('ಹೌದು') ||
            trimmed.includes('ஆம்') ||
            trimmed.includes('ಕಡ್ಡಾಯ') ||
            trimmed.includes('கட்டாய');
          const lines = trimmed.split('\n');
          const titleLine = lines[0].replace(/^[#*\s⚖️]+/, '').replace(/[*#]/g, '').trim();
          const bodyLines = lines.slice(1).join('\n').trim();

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border shadow-xs ${
                isMandatory ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                <span className="text-base">⚖️</span>
                <span className={isMandatory ? 'text-red-900' : 'text-emerald-900'}>
                  {titleLine || 'Is It Compulsory by Law in India?'}
                </span>
                <span
                  className={`ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isMandatory ? 'bg-red-600 text-white shadow-xs' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isMandatory ? 'Compulsory By Law' : 'Voluntary'}
                </span>
              </div>
              <div className={`text-sm leading-relaxed space-y-1.5 ${isMandatory ? 'text-red-950' : 'text-emerald-950'}`}>
                {bodyLines.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{parseInlineMarkdown(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // 3. Quick Tip (BIS Care App Card)
        if (
          trimmed.includes('Quick Tip') ||
          trimmed.includes('BIS Care App') ||
          trimmed.includes('सत्यापन टिप') ||
          trimmed.includes('ಪರಿಶೀಲನೆ ಸಲಹೆ') ||
          trimmed.includes('சரிபார்ப்பு குறிப்பு')
        ) {
          const lines = trimmed.split('\n');
          const titleLine = lines[0].replace(/^[#*\s📲]+/, '').replace(/[*#]/g, '').trim();
          const bodyLines = lines.slice(1).join('\n').trim();

          return (
            <div key={idx} className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm">
                <span className="text-base">📲</span>
                <span>{titleLine || 'Quick Tip: Verify Instantly on BIS Care App'}</span>
                <span className="ml-auto text-[10px] bg-blue-200/80 text-blue-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Mobile App Tip
                </span>
              </div>
              <div className="text-blue-950 text-sm leading-relaxed space-y-1">
                {bodyLines.split('\n').map((line, lIdx) => (
                  <p key={lIdx}>{parseInlineMarkdown(line)}</p>
                ))}
              </div>
            </div>
          );
        }

        // 4. Standard sections with headings, lists, bullets, and paragraphs
        const lines = trimmed.split('\n');
        return (
          <div key={idx} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const lineTrimmed = line.trim();
              if (!lineTrimmed) return null;

              // Headings with #
              if (lineTrimmed.startsWith('###') || lineTrimmed.startsWith('##') || lineTrimmed.startsWith('#')) {
                const headerText = lineTrimmed.replace(/^#+\s*/, '').replace(/[*_]/g, '');
                return (
                  <h4 key={lineIdx} className="font-bold text-bis-navy text-sm md:text-[15px] pt-3 pb-1 border-b border-bis-border/60 flex items-center gap-2">
                    {headerText}
                  </h4>
                );
              }

              // Headers starting with emoji badges (e.g. 🔍 **What You Should Check**)
              if (/^[🔍📋🏢💡⚖️📲🏷️📌]\s*\*\*/.test(lineTrimmed)) {
                return (
                  <h4 key={lineIdx} className="font-bold text-bis-navy text-sm md:text-[15px] pt-3 pb-1 border-b border-bis-border/60 flex items-center gap-2">
                    {parseInlineMarkdown(lineTrimmed)}
                  </h4>
                );
              }

              // Bullet item: * or -
              if (lineTrimmed.startsWith('* ') || lineTrimmed.startsWith('- ')) {
                const bulletContent = lineTrimmed.replace(/^[*\-]\s+/, '');
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-bis-blue mt-2 flex-shrink-0" />
                    <div className="flex-1 text-sm text-bis-text leading-relaxed">
                      {parseInlineMarkdown(bulletContent)}
                    </div>
                  </div>
                );
              }

              // Numbered item: 1. or 2.
              if (/^\d+\.\s+/.test(lineTrimmed)) {
                const numMatch = lineTrimmed.match(/^(\d+)\.\s+(.*)/);
                if (numMatch) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
                      <span className="w-5 h-5 rounded-full bg-bis-navy text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {numMatch[1]}
                      </span>
                      <div className="flex-1 text-sm text-bis-text leading-relaxed">
                        {parseInlineMarkdown(numMatch[2])}
                      </div>
                    </div>
                  );
                }
              }

              // Blockquote: >
              if (lineTrimmed.startsWith('>')) {
                return (
                  <div key={lineIdx} className="border-l-3 border-bis-blue bg-bis-blue-light/50 p-2.5 rounded-r-lg text-xs md:text-sm text-bis-navy leading-relaxed italic my-1">
                    {parseInlineMarkdown(lineTrimmed.replace(/^>\s*/, ''))}
                  </div>
                );
              }

              // Normal paragraph
              return (
                <p key={lineIdx} className="text-sm text-bis-text leading-relaxed">
                  {parseInlineMarkdown(lineTrimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ── Message bubble ───────────────────────────────────────── */
function MessageBubble({
  msg, loadingStep, onOpenSource, onSaveStandard, onClarify, onNavigate
}: {
  msg: Message;
  loadingStep: number;
  onOpenSource: (src: typeof DEMO_RESPONSE.sources[0]) => void;
  onSaveStandard: () => void;
  onClarify: (q: string) => void;
  onNavigate: (path: string, options?: any) => void;
}) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-bis-navy text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-lg text-sm leading-relaxed shadow-sm">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 bg-bis-navy rounded-md flex items-center justify-center text-white flex-shrink-0 mt-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
      </div>

      <div className="flex-1 min-w-0 space-y-0">
        {/* Loading */}
        {msg.state === 'loading' && (
          <div className="bg-white border border-bis-border rounded-xl rounded-tl-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-bis-blue rounded-full bis-dot-1"/>
                <div className="w-2 h-2 bg-bis-blue rounded-full bis-dot-2"/>
                <div className="w-2 h-2 bg-bis-blue rounded-full bis-dot-3"/>
              </div>
              <span className="text-sm text-bis-muted">{LOADING_STEPS[loadingStep]}</span>
            </div>
            <div className="space-y-2.5">
              {[0.85, 0.65, 0.92, 0.55].map((w, i) => (
                <div key={i} className="h-3 bg-bis-surface rounded-full animate-pulse" style={{ width: `${w * 100}%` }}/>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {msg.state === 'error' && (
          <div className="bg-white border border-amber-200 rounded-xl rounded-tl-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-bis-warning-bg rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-bis-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-bis-text mb-1">Insufficient information available</p>
                <p className="text-sm text-bis-muted">{msg.content}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">Refine Query</Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/standards')}>Browse Standards</Button>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('/resources')}>Visit BIS Resources</Button>
            </div>
          </div>
        )}

        {/* Clarify */}
        {msg.state === 'clarify' && (
          <div className="bg-white border border-bis-border rounded-xl rounded-tl-sm p-5">
            <p className="text-sm text-bis-text mb-4 leading-relaxed">{msg.content}</p>
            <div className="flex flex-wrap gap-2">
              {CLARIFY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => onClarify(opt)}
                  className="px-3 py-1.5 border border-bis-border rounded-lg text-sm text-bis-text hover:border-bis-blue hover:bg-bis-blue-pale transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success */}
        {msg.state === 'success' && (
          <div className="bg-white border border-bis-border rounded-xl rounded-tl-sm overflow-hidden">
            <div className="px-5 py-3 bg-bis-surface border-b border-bis-border flex flex-wrap gap-2">
              <TrustBadge type="source-backed" />
              <TrustBadge type="evidence" />
            </div>

            <div className="p-5">
              <div className="mb-6">
                <FormattedMessage content={msg.content} />
              </div>

              {msg.standards && msg.standards.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest mb-3">Applicable Standards</h4>
                  <div className="space-y-2.5">
                    {msg.standards.map((std, i) => (
                      <div key={i} className="p-3.5 bg-bis-surface rounded-xl border border-bis-border">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="text-xs font-mono font-bold text-bis-blue">{std.number}</span>
                              <Badge label={std.status} variant="green" />
                              <Badge label={`${std.relevance} relevance`} variant="gold" />
                            </div>
                            <p className="text-sm font-semibold text-bis-text">{std.title}</p>
                            <p className="text-xs text-bis-muted mt-1 line-clamp-2 leading-relaxed">{std.scope}</p>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => {
                                const match = MOCK_STANDARDS.find(s => s.number === std.number || s.id === std.id);
                                onNavigate(`/standards/detail?id=${std.id}`, { state: { standard: match || std } });
                              }}
                              className="text-xs font-medium text-white bg-bis-navy hover:bg-bis-navy-dark px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={onSaveStandard}
                              className="text-xs font-medium text-bis-muted hover:text-bis-text border border-bis-border hover:border-bis-blue-mid px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.certNote && (
                <div className="mb-4 p-3.5 bg-bis-blue-pale border border-bis-blue/20 rounded-xl">
                  <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest mb-1.5">Certification</p>
                  <p className="text-sm text-bis-text leading-relaxed">{msg.certNote}</p>
                </div>
              )}

              {msg.testingNote && (
                <div className="mb-5 p-3.5 bg-bis-surface rounded-xl border border-bis-border">
                  <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest mb-1.5">Testing</p>
                  <p className="text-sm text-bis-text leading-relaxed">{msg.testingNote}</p>
                </div>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-4 border-t border-bis-border">
                  <h4 className="text-[10px] font-semibold text-bis-muted uppercase tracking-widest mb-3">Sources & Evidence</h4>
                  <div className="space-y-2">
                    {msg.sources.map((src, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-bis-surface rounded-xl border border-bis-border gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-bis-text truncate">{src.title}</p>
                          <p className="text-xs text-bis-muted">{src.section}</p>
                          <div className="mt-1"><TrustBadge type="official" /></div>
                        </div>
                        <button
                          onClick={() => onOpenSource(src)}
                          className="text-xs font-medium text-bis-blue hover:text-bis-navy border border-bis-border hover:border-bis-blue px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
                        >
                          View Source
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-bis-surface border-t border-bis-border flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('/compliance')}
                className="px-3.5 py-1.5 text-xs font-medium bg-bis-navy hover:bg-bis-navy-dark text-white rounded-lg transition-colors"
              >
                Check My Requirements
              </button>
              <button
                onClick={() => onNavigate('/standards')}
                className="px-3.5 py-1.5 text-xs font-medium border border-bis-border hover:border-bis-blue text-bis-muted hover:text-bis-text rounded-lg transition-colors"
              >
                Browse Standards
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
