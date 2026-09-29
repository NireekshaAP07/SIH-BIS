import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge, Toast, Drawer } from '../components/ui';
import { MOCK_STANDARDS } from '../data/mockData';

export default function StandardDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const standardId = searchParams.get('id');
  const std = (location.state as any)?.standard ||
    (standardId ? MOCK_STANDARDS.find(s => s.id === standardId || s.number.toLowerCase().replace(/\s/g, '-') === standardId) : null) ||
    MOCK_STANDARDS[0];

  function handleSave() {
    setSaved(p => !p);
    setToast(saved ? 'Standard removed from saved.' : 'Standard saved to your collection.');
    setTimeout(() => setToast(null), 3000);
  }

  // Related standards from same division or general catalog
  const relatedStandards = MOCK_STANDARDS.filter(s => s.id !== std.id && (s.division === std.division || !std.division)).slice(0, 4);

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
                <Badge label={std.year ? `Year ${std.year}` : 'Current'} variant="blue" />
                {std.mandatory && <Badge label="Mandatory (QCO)" variant="red" />}
                {std.division && <Badge label={std.division} variant="gold" />}
              </div>
              <div className="text-lg font-mono font-bold text-bis-gold mb-1">{std.number}</div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{std.title}</h1>
              <div className="flex flex-wrap gap-1">
                {std.tags?.map((t: string) => <span key={t} className="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded">{t}</span>)}
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
                onClick={() => navigate('/assistant', { state: { initialQuery: `What are the testing and certification requirements for ${std.number}: ${std.title}?` } })}
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
                Scope & Overview
              </h2>
              <p className="text-sm text-bis-text leading-relaxed">{std.scope}</p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Compliance Highlights
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-bis-surface rounded-lg">
                  <div className="text-xs font-semibold text-bis-muted uppercase mb-1">Regulatory Scheme</div>
                  <div className="text-sm font-medium text-bis-text">{std.cert_scheme || (std.certRequired ? 'Scheme I — Product Certification (ISI Mark)' : 'Voluntary Indian Standard')}</div>
                </div>
                {std.qco_ref && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-xs font-semibold text-red-700 uppercase mb-1">Quality Control Order (Mandatory Law)</div>
                    <div className="text-sm text-red-900 font-medium">{std.qco_ref}</div>
                  </div>
                )}
                {std.committee && (
                  <div className="p-3 bg-bis-surface rounded-lg">
                    <div className="text-xs font-semibold text-bis-muted uppercase mb-1">Sectional Committee</div>
                    <div className="text-sm text-bis-text">{std.committee} — {std.division_full || std.division}</div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                Testing Laboratories
              </h2>
              <div className="space-y-2 text-sm">
                {(std.test_labs && std.test_labs.length > 0 ? std.test_labs : [
                  'BIS Central Laboratory (CL), Sahibabad',
                  'BIS Western Regional Office Laboratory, Mumbai',
                  'BIS Southern Regional Office Laboratory, Chennai',
                  'NABL-accredited BIS-recognised private testing facilities',
                ]).map((lab: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-bis-surface rounded">
                    <svg className="w-4 h-4 text-bis-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/></svg>
                    <span className="text-bis-text">{lab}</span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/testing')}>
                Explore Testing Laboratories Directory
              </Button>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Certification Applicability</h2>
              <div className={`p-4 rounded-lg mb-3 border ${std.mandatory ? 'bg-amber-50 border-amber-200' : 'bg-bis-surface border-bis-border'}`}>
                <p className="text-sm text-bis-text">
                  {std.mandatory
                    ? `Under the ${std.qco_ref || 'applicable QCO'}, manufacturing, importing, selling, or distributing this product without BIS certification is strictly prohibited under Section 16 & 17 of the BIS Act, 2016.`
                    : 'This standard is currently voluntary. Manufacturers may apply for the voluntary ISI mark scheme to demonstrate quality and build consumer trust.'}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/certification')}>
                View Certification Schemes
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
                {std.year && (
                  <div className="flex justify-between gap-2">
                    <span className="text-bis-muted">Edition / Year</span>
                    <span className="font-medium text-bis-text">{std.year}</span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Mandatory Law</span>
                  <Badge label={std.mandatory ? 'Yes (QCO)' : 'Voluntary'} variant={std.mandatory ? 'red' : 'gray'} />
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-bis-muted">Division</span>
                  <span className="font-medium text-bis-text">{std.division || 'BIS Technical'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Official BIS Source</h3>
              <TrustBadge type="official" />
              <p className="text-xs text-bis-muted mt-2 mb-3">Published by Bureau of Indian Standards, Government of India.</p>
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)} className="w-full justify-center">
                  View Reference Details
                </Button>
                <a
                  href={std.bis_url || 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-bis-blue/30 text-bis-blue hover:bg-bis-blue-light/50 text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>Official BIS Portal</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </Card>

            {relatedStandards.length > 0 && (
              <Card className="p-5">
                <h3 className="font-semibold text-bis-text mb-3 text-sm">Related Standards</h3>
                <div className="space-y-2">
                  {relatedStandards.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(`/standards/detail?id=${s.id}`, { state: { standard: s } })}
                      className="w-full text-left p-2 rounded hover:bg-bis-surface transition-colors"
                    >
                      <div className="text-xs font-mono text-bis-blue mb-0.5">{s.number}</div>
                      <div className="text-xs text-bis-text line-clamp-2">{s.title}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigate('/compliance')} className="w-full justify-center">
                  Check My Requirements
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/assistant', { state: { initialQuery: `How do I obtain certification for ${std.number}?` } })} className="w-full justify-center">
                  Ask Assistant
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Drawer open={drawerOpen} title="Source Reference" onClose={() => setDrawerOpen(false)}>
        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-1">Standard Reference</div>
            <p className="font-semibold text-bis-text">{std.title}</p>
            <p className="text-xs font-mono text-bis-blue">{std.number}</p>
            <div className="mt-2"><TrustBadge type="official" /></div>
          </div>
          <div>
            <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Scope Summary</div>
            <div className="bg-bis-blue-light border border-bis-blue/20 rounded-lg p-4">
              <p className="text-sm text-bis-text leading-relaxed">
                {std.scope}
              </p>
            </div>
          </div>
          {std.qco_ref && (
            <div>
              <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-1">Mandatory QCO Order</div>
              <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                {std.qco_ref}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 pt-4 border-t border-bis-border">
            <a
              href={std.bis_url || 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-bis-navy hover:bg-bis-navy-dark !text-white text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              style={{ color: '#ffffff', backgroundColor: '#0d2858' }}
            >
              <span className="!text-white text-white font-semibold" style={{ color: '#ffffff' }}>Open Official Source on bis.gov.in</span>
              <svg className="w-4 h-4 flex-shrink-0 !text-white text-white" style={{ color: '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
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
