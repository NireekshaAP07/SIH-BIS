import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge, Drawer, Modal, Toast } from '../components/ui';
import { RECENT_QUERIES, DEMO_RESPONSE, MOCK_STANDARDS } from '../data/mockData';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  state?: 'loading' | 'success' | 'partial' | 'error' | 'clarify';
  standards?: typeof MOCK_STANDARDS;
  sources?: typeof DEMO_RESPONSE.sources;
  certNote?: string;
  testingNote?: string;
};

const LOADING_STEPS = [
  'Searching BIS sources...',
  'Analysing relevant standards...',
  'Preparing your answer...',
];

const CLARIFY_OPTIONS = ['Product', 'Certification', 'Testing', 'Hallmarking', 'Consumer query'];

export default function AssistantPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
      window.history.replaceState({}, '');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  function sendMessage(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');

    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: q };
    const loadingId = `a${Date.now() + 1}`;
    const loadingMsg: Message = { id: loadingId, role: 'assistant', content: '', state: 'loading' };

    setMessages(prev => [...prev, userMsg, loadingMsg]);

    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) setLoadingStep(step);
    }, 1000);

    const isAmbiguous = q.toLowerCase() === 'what standard do i need?' ||
      (q.toLowerCase().includes('what standard') && q.length < 35 && !q.toLowerCase().includes('product'));
    const isError = q.toLowerCase().includes('error test');

    setTimeout(() => {
      clearInterval(interval);
      setMessages(prev => prev.map(m => m.id === loadingId ? {
        ...m,
        content: isAmbiguous
          ? "I'd be happy to help. Which product or service are you asking about?"
          : isError
          ? "We couldn't find sufficient authoritative information to answer this confidently."
          : DEMO_RESPONSE.answer,
        state: isAmbiguous ? 'clarify' : isError ? 'error' : 'success',
        standards: (!isAmbiguous && !isError) ? DEMO_RESPONSE.standards : undefined,
        sources: (!isAmbiguous && !isError) ? DEMO_RESPONSE.sources : undefined,
        certNote: (!isAmbiguous && !isError) ? DEMO_RESPONSE.certNote : undefined,
        testingNote: (!isAmbiguous && !isError) ? DEMO_RESPONSE.testingNote : undefined,
      } : m));
    }, 3200);
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
        <div className="bg-white border-b border-bis-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
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
          <div>
            <h1 className="font-semibold text-bis-text text-sm leading-tight">BIS Assistant</h1>
            <p className="text-[11px] text-bis-muted leading-tight">Source-backed information on Indian Standards and BIS services</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState onQuery={sendMessage} />
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
                placeholder="Ask about Indian Standards, certification, testing, hallmarking or BIS services..."
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
        {selectedSource && (
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
                  <span className="text-xs font-medium text-bis-blue">{selectedSource.section}</span>
                </div>
                <p className="text-sm text-bis-text leading-relaxed italic text-bis-muted">
                  "The relevant information from this section of the official BIS document would appear here. The applicable clause or paragraph would be highlighted to assist the user in locating the exact reference within the source document."
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
            <div className="flex flex-col gap-2 pt-4 border-t border-bis-border">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-bis-navy hover:bg-bis-navy-dark text-white text-sm font-medium rounded-lg transition-colors">
                Open Official Source
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
              </button>
              <button onClick={() => setDrawerOpen(false)} className="w-full flex items-center justify-center px-4 py-2.5 border border-bis-border hover:border-bis-blue text-bis-text text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
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

/* ── Empty state ──────────────────────────────────────────── */
function EmptyState({ onQuery }: { onQuery: (q: string) => void }) {
  const suggestions = [
    'Which standard applies to stainless steel water bottles?',
    'How do I apply for BIS certification?',
    'What are the testing requirements for LED lights?',
    'How does gold hallmarking work in India?',
    'Which products need mandatory BIS certification?',
    'What is the ISI Mark?',
  ];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-10 mb-6">
        <div className="w-12 h-12 bg-bis-navy rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
        </div>
        <h2 className="text-xl font-bold text-bis-text mb-2">How can I help you?</h2>
        <p className="text-bis-muted text-sm max-w-md mx-auto leading-relaxed">
          Ask about Indian Standards, BIS certification, testing requirements, hallmarking, or any BIS-related query. Responses are grounded in official BIS sources.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map(s => (
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

/* ── Message bubble ───────────────────────────────────────── */
function MessageBubble({
  msg, loadingStep, onOpenSource, onSaveStandard, onClarify, onNavigate
}: {
  msg: Message;
  loadingStep: number;
  onOpenSource: (src: typeof DEMO_RESPONSE.sources[0]) => void;
  onSaveStandard: () => void;
  onClarify: (q: string) => void;
  onNavigate: (path: string) => void;
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
              <p className="text-sm text-bis-text leading-relaxed mb-5">{msg.content}</p>

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
                              onClick={() => onNavigate('/standards/detail')}
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
