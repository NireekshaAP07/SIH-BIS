import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge, Toast, Drawer } from '../components/ui';
import { MOCK_STANDARDS, DEMO_RESPONSE } from '../data/mockData';

export default function StandardDetailPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const std = MOCK_STANDARDS[0];

  function handleSave() {
    setSaved(p => !p);
    setToast(saved ? 'Standard removed from saved.' : 'Standard saved to your collection.');
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-xs text-white/50 mb-4 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <span>›</span>
            <button onClick={() => navigate('/standards')} className="hover:text-white transition-colors">Standards</button>
            <span>›</span>
            <span className="text-white/80">{std.number}</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-white/60 text-sm font-mono">Indian Standard</span>
                <span className="text-white/30">·</span>
                <Badge label={std.status} variant="green" />
                <Badge label={`Revised ${std.year}`} variant="blue" />
              </div>
              <div className="text-lg font-mono font-bold text-bis-gold mb-1">{std.number}</div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{std.title}</h1>
              <div className="flex flex-wrap gap-1">
                {std.tags.map(t => <span key={t} className="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded">{t}</span>)}
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${saved ? 'bg-bis-gold border-bis-gold text-white' : 'border-white/30 text-white hover:bg-white/10'}`}
              >
                <svg className={`w-4 h-4 ${saved ? 'fill-white' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                {saved ? 'Saved' : 'Save Standard'}
              </button>
              <button
                onClick={() => navigate('/assistant', { state: { initialQuery: `Tell me more about ${std.title}` } })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                Ask Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Scope
              </h2>
              <p className="text-sm text-bis-text leading-relaxed">{std.scope}</p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Key Requirements
              </h2>
              <div className="space-y-3">
                {[
                  { title: 'Material composition', desc: 'Specifies permitted grades and compositional requirements for the stainless steel used.' },
                  { title: 'Surface finish', desc: 'Requirements for interior and exterior finish to ensure food safety and cleanability.' },
                  { title: 'Dimensional tolerances', desc: 'Permitted dimensional variation for capacity, wall thickness, and overall dimensions.' },
                  { title: 'Marking and labelling', desc: 'Requirements for mandatory marking including material grade, capacity, and manufacturer identification.' },
                ].map((req, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-bis-surface rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-bis-blue-light text-bis-blue flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <span className="text-sm font-medium text-bis-text">{req.title}: </span>
                      <span className="text-sm text-bis-muted">{req.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-bis-muted mt-3 pt-3 border-t border-bis-border">
                This is an AI-generated summary. Refer to the official standard document for complete requirements.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Testing</h2>
              <div className="space-y-2 text-sm">
                {[
                  'Chemical composition analysis',
                  'Mechanical properties testing',
                  'Migration testing for food contact compliance',
                  'Dimensional measurement',
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded">
                    <svg className="w-4 h-4 text-bis-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/></svg>
                    <span className="text-bis-text">{t}</span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/testing')}>
                Find Testing Laboratories
              </Button>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Certification Relevance</h2>
              <div className="p-3 bg-bis-gold-light border border-bis-gold/20 rounded-lg mb-3">
                <p className="text-sm text-bis-text">
                  Products covered by this standard may be subject to mandatory BIS certification under the BIS (Certification) Regulations. Verify the current Schedule of Products for Mandatory Certification to confirm applicability.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/certification')}>
                View Certification Information
              </Button>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Standard Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Number</span>
                  <span className="font-medium text-bis-text font-mono">{std.number}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Status</span>
                  <Badge label={std.status} variant="green" />
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Year</span>
                  <span className="font-medium text-bis-text">{std.year}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Certification</span>
                  <Badge label={std.certRequired ? 'Applicable' : 'Verify'} variant={std.certRequired ? 'gold' : 'gray'} />
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Testing</span>
                  <Badge label="Required" variant="blue" />
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Source</h3>
              <TrustBadge type="official" />
              <p className="text-xs text-bis-muted mt-2 mb-3">Official BIS document. View the original standard for authoritative requirements.</p>
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)} className="w-full justify-center">
                  View Source
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  Open Document
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Related Standards</h3>
              <div className="space-y-2">
                {MOCK_STANDARDS.slice(1).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/standards/detail')}
                    className="w-full text-left p-2 rounded hover:bg-bis-surface transition-colors"
                  >
                    <div className="text-xs font-mono text-bis-blue mb-0.5">{s.number}</div>
                    <div className="text-xs text-bis-text line-clamp-2">{s.title}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigate('/compliance')} className="w-full justify-center">
                  Check My Requirements
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/assistant')} className="w-full justify-center">
                  Ask Assistant
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  Share
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} title="Source Document" onClose={() => setDrawerOpen(false)}>
        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-1">Document</div>
            <p className="font-semibold text-bis-text">{std.title}</p>
            <p className="text-xs text-bis-muted">{std.number}</p>
            <div className="mt-2"><TrustBadge type="official" /></div>
          </div>
          <div>
            <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Relevant Section</div>
            <div className="bg-bis-blue-light border border-bis-blue/20 rounded-lg p-4">
              <p className="text-sm text-bis-text leading-relaxed italic">
                "Relevant section text from the official BIS standard document would appear here. The applicable clause, paragraph, or table would be highlighted to assist the user in locating the exact reference."
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t border-bis-border">
            <Button variant="primary" className="w-full justify-center">Open Official Source</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)} className="w-full justify-center">Close</Button>
          </div>
        </div>
      </Drawer>

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
          <Toast message={toast} type="success" onClose={() => setToast(null)}/>
        </div>
      )}
    </div>
  );
}
