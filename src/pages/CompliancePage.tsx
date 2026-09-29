import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge } from '../components/ui';
import { MOCK_STANDARDS, DEMO_RESPONSE } from '../data/mockData';

type Phase = 'questions' | 'overview' | 'report';

export default function CompliancePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('questions');
  const [product, setProduct] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const QUESTIONS = [
    { id: 'product_type', q: 'What type of product is it?', opts: ['Consumer product', 'Industrial product', 'Electrical/Electronic', 'Food/Food contact', 'Building material', 'Other'] },
    { id: 'market', q: 'Where will the product be sold?', opts: ['India only', 'Export only', 'Both India and export'] },
    { id: 'users', q: 'Who will use this product?', opts: ['General consumers', 'Children', 'Industrial/professional users', 'All users'] },
  ];

  function generateReport() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportGenerated(true);
      setPhase('report');
    }, 2000);
  }

  if (phase === 'report') {
    return <ComplianceReport product={product} navigate={navigate} onBack={() => setPhase('overview')} />;
  }

  if (phase === 'overview') {
    return (
      <div className="min-h-screen bg-bis-surface">
        <div className="bg-bis-navy text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
              <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
              <span>›</span>
              <button onClick={() => setPhase('questions')} className="hover:text-white">Check Requirements</button>
              <span>›</span>
              <span className="text-white/80">Compliance Overview</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Compliance Overview</h1>
            <p className="text-white/70">AI-generated information summary based on your product details. Verify against official BIS sources.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-bis-text">Product</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={product || 'Your product'} variant="navy" />
              {Object.entries(answers).map(([k, v]) => <Badge key={k} label={v} variant="gray" />)}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-bis-text mb-4">Relevant Standards</h2>
            <div className="space-y-2">
              {MOCK_STANDARDS.map((std, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bis-surface rounded-lg border border-bis-border">
                  <div>
                    <span className="text-xs font-mono font-semibold text-bis-blue">{std.number}</span>
                    <span className="text-sm text-bis-text ml-2">{std.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={`${std.relevance} relevance`} variant="gold" />
                    <Button variant="secondary" size="sm" onClick={() => navigate('/standards/detail')}>View</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Certification</h2>
              <p className="text-sm text-bis-muted leading-relaxed">{DEMO_RESPONSE.certNote}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/certification')}>
                View Certification Info
              </Button>
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Testing</h2>
              <p className="text-sm text-bis-muted leading-relaxed">{DEMO_RESPONSE.testingNote}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/testing')}>
                Find Laboratories
              </Button>
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="font-semibold text-bis-text mb-4">Suggested Next Steps</h2>
            <div className="space-y-3">
              {[
                'Review the full text of identified standards from official BIS sources.',
                'Verify whether your product is notified for mandatory BIS certification.',
                'Identify BIS-recognised testing laboratories for required tests.',
                'Consult a qualified professional for product-specific compliance advice.',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-bis-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-bis-text">{s}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-bis-text mb-3">Evidence & Sources</h2>
            <div className="space-y-2">
              {DEMO_RESPONSE.sources.map((src, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bis-surface rounded-lg border border-bis-border text-sm">
                  <div>
                    <span className="font-medium text-bis-text">{src.title}</span>
                    <span className="text-bis-muted"> · {src.section}</span>
                    <div className="mt-1"><TrustBadge type="official" /></div>
                  </div>
                  <Button variant="secondary" size="sm">View Source</Button>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              loading={generating}
              onClick={generateReport}
            >
              {generating ? 'Generating...' : 'Generate Summary Report'}
            </Button>
            <Button variant="secondary" onClick={() => setPhase('questions')}>Refine Input</Button>
            <Button variant="ghost" onClick={() => navigate('/assistant')}>Ask Assistant</Button>
          </div>

          <p className="text-xs text-bis-muted pt-2">
            This is an AI-generated information summary and does not constitute official BIS certification or legal compliance advice. Always verify against official BIS sources.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Check My BIS Requirements</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Check My BIS Requirements</h1>
          <p className="text-white/70 max-w-2xl">Answer a few questions to get an overview of potentially applicable BIS standards, certification, and testing requirements.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-bis-text mb-2">Your product</h2>
          <p className="text-sm text-bis-muted mb-4">Describe the product you are asking about.</p>
          <textarea
            value={product}
            onChange={e => setProduct(e.target.value)}
            placeholder='e.g. "Electric kettle for domestic use"'
            className="w-full border border-bis-border rounded-lg px-4 py-3 text-sm text-bis-text placeholder:text-bis-muted/70 focus:outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue transition-colors min-h-[100px] resize-y"
          />
        </Card>

        {QUESTIONS.map(q => (
          <Card key={q.id} className="p-6">
            <h2 className="text-lg font-bold text-bis-text mb-4">{q.q}</h2>
            <div className="grid grid-cols-2 gap-2">
              {q.opts.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all text-left ${answers[q.id] === opt ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue hover:text-bis-text'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Card>
        ))}

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setPhase('overview')}
            disabled={!product.trim()}
          >
            Find My Requirements
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ComplianceReport({ product, navigate, onBack }: { product: string; navigate: (p: string) => void; onBack: () => void }) {
  const [printing, setPrinting] = useState(false);

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">BIS Compliance Information Summary</h1>
              <p className="text-white/60 text-sm">AI-generated information summary — not an official BIS document</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => window.print()}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
              </Button>
              <Button variant="secondary" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download PDF
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={onBack}>
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Report header */}
        <div className="bg-white border border-bis-border rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-bis-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-bis-navy rounded-sm flex items-center justify-center text-white text-xs font-black">BIS</div>
                <div>
                  <div className="font-bold text-sm text-bis-navy">Bureau of Indian Standards</div>
                  <div className="text-xs text-bis-muted">AI-generated information summary</div>
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-bis-muted">
              <p>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="mt-1">Reference: AI-SUMMARY</p>
            </div>
          </div>
          <div className="p-4 bg-bis-warning-bg border border-amber-200 rounded-lg">
            <p className="text-sm text-bis-warning font-medium">
              Important: This is an AI-generated information summary and does not constitute official BIS certification, legal compliance advice, or an official BIS document. Always verify requirements against official BIS sources.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {[
            {
              title: '1. Product',
              content: <div className="flex items-center gap-2"><Badge label={product || 'Product as specified'} variant="navy" /></div>
            },
            {
              title: '2. Query Summary',
              content: <p className="text-sm text-bis-text">Standards, certification, and testing requirements potentially applicable to the specified product.</p>
            },
            {
              title: '3. Relevant Standards',
              content: (
                <div className="space-y-2">
                  {MOCK_STANDARDS.map((std, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-bis-surface rounded border border-bis-border text-sm">
                      <span className="font-mono font-semibold text-bis-blue">{std.number}</span>
                      <span className="text-bis-text flex-1">{std.title}</span>
                      <Badge label={std.status} variant="green" />
                    </div>
                  ))}
                </div>
              )
            },
            {
              title: '4. Certification Information',
              content: <p className="text-sm text-bis-text leading-relaxed">{DEMO_RESPONSE.certNote}</p>
            },
            {
              title: '5. Testing Information',
              content: <p className="text-sm text-bis-text leading-relaxed">{DEMO_RESPONSE.testingNote}</p>
            },
            {
              title: '6. Suggested Next Steps',
              content: (
                <ol className="list-decimal list-inside space-y-2 text-sm text-bis-text">
                  <li>Review the full text of identified standards from official BIS sources.</li>
                  <li>Verify whether the product is notified for mandatory BIS certification.</li>
                  <li>Identify BIS-recognised testing laboratories for required tests.</li>
                  <li>Consult a qualified professional for product-specific compliance advice.</li>
                </ol>
              )
            },
            {
              title: '7. Sources',
              content: (
                <div className="space-y-2">
                  {DEMO_RESPONSE.sources.map((src, i) => (
                    <div key={i} className="p-3 bg-bis-surface rounded border border-bis-border text-sm">
                      <span className="font-medium text-bis-text">{src.title}</span>
                      <span className="text-bis-muted"> · {src.section}</span>
                      <div className="mt-1"><TrustBadge type="official" /></div>
                    </div>
                  ))}
                </div>
              )
            },
          ].map(section => (
            <Card key={section.title} className="p-5">
              <h3 className="font-semibold text-bis-text mb-3">{section.title}</h3>
              {section.content}
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button variant="primary" onClick={() => window.print()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Report
          </Button>
          <Button variant="secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download PDF
          </Button>
          <Button variant="secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            Share
          </Button>
          <Button variant="ghost" onClick={() => navigate('/assistant')}>
            Back to Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}
