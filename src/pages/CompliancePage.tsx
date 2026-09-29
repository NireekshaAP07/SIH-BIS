import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, TrustBadge } from '../components/ui';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SourceItem {
  title: string;
  section: string;
  clause?: string;
  page?: string;
  type?: string;
  relevance_score?: number | null;
}

interface StandardRef {
  number: string;
  title: string;
}

interface ReportData {
  answer: string;
  sources: SourceItem[];
  standards: StandardRef[];
}

type Phase = 'questions' | 'overview' | 'report';

// ── Inline markdown renderer ──────────────────────────────────────────────────

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

function FormattedAnswer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^[⚠️ℹ️📋🔴🟢✅❌]/.test(line)) {
      elements.push(
        <div key={i} className="bg-amber-50 border-l-4 border-amber-400 px-4 py-2 rounded-r-lg text-sm text-amber-800 my-2">
          {parseInlineMarkdown(line)}
        </div>
      );
      i++; continue;
    }
    if (line.startsWith('### ')) {
      elements.push(<h4 key={i} className="font-bold text-slate-700 mt-4 mb-1 text-sm uppercase tracking-wide">{parseInlineMarkdown(line.slice(4))}</h4>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h3 key={i} className="font-bold text-slate-800 mt-4 mb-1 text-base">{parseInlineMarkdown(line.slice(3))}</h3>);
      i++; continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h2 key={i} className="font-bold text-slate-900 mt-4 mb-2 text-lg">{parseInlineMarkdown(line.slice(2))}</h2>);
      i++; continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2 pl-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2 pl-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-blue-500 font-bold flex-shrink-0 w-5">{j + 1}.</span>
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }
    elements.push(<p key={i} className="text-sm text-slate-700 leading-relaxed my-1">{parseInlineMarkdown(line)}</p>);
    i++;
  }
  return <div className="space-y-1">{elements}</div>;
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('questions');
  const [product, setProduct] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const QUESTIONS = [
    { id: 'product_type', q: 'What type of product is it?', opts: ['Consumer product', 'Industrial product', 'Electrical/Electronic', 'Food/Food contact', 'Building material', 'Other'] },
    { id: 'market', q: 'Where will the product be sold?', opts: ['India only', 'Export only', 'Both India and export'] },
    { id: 'users', q: 'Who will use this product?', opts: ['General consumers', 'Children', 'Industrial/professional users', 'All users'] },
  ];

  async function generateReport() {
    setGenerating(true);
    setError(null);

    const answerSummary = Object.entries(answers)
      .map(([k, v]) => {
        if (k === 'product_type') return `Product type: ${v}`;
        if (k === 'market') return `Market: ${v}`;
        if (k === 'users') return `Target users: ${v}`;
        return `${k}: ${v}`;
      })
      .join('. ');

    const query = `What are the BIS compliance requirements, applicable Indian Standards, mandatory certifications, and testing requirements for: ${product}? Additional details — ${answerSummary}. Please explain in simple language suitable for a small business owner in India.`;

    try {
      const res = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 8 }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: ReportData = await res.json();
      setReportData(data);
      setPhase('report');
    } catch (err: any) {
      setError(err.message || 'Could not connect to the server. Please make sure the backend is running.');
    } finally {
      setGenerating(false);
    }
  }

  if (phase === 'report' && reportData) {
    return (
      <ComplianceReport
        product={product}
        answers={answers}
        reportData={reportData}
        navigate={navigate}
        onBack={() => setPhase('overview')}
      />
    );
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
            <p className="text-white/70">Review your product details, then generate a full AI compliance report below.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
          <Card className="p-5">
            <h2 className="font-semibold text-bis-text mb-3">Your Product</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Badge label={product || 'Your product'} variant="navy" />
              {Object.entries(answers).map(([k, v]) => <Badge key={k} label={v} variant="gray" />)}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-bis-text mb-2">What happens next?</h2>
            <p className="text-sm text-bis-muted mb-4">
              Click the button below. Our AI will search through BIS rules, Indian Standards, and certification requirements to give you a personalised compliance summary in simple language.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                loading={generating}
                onClick={generateReport}
              >
                {generating ? 'Generating your report…' : '✨ Generate My Compliance Report'}
              </Button>
              <Button variant="secondary" onClick={() => setPhase('questions')}>Edit My Answers</Button>
              <Button variant="ghost" onClick={() => navigate('/assistant')}>Ask Assistant Instead</Button>
            </div>
          </Card>

          <p className="text-xs text-bis-muted">
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

function ComplianceReport({
  product,
  answers,
  reportData,
  navigate,
  onBack,
}: {
  product: string;
  answers: Record<string, string>;
  reportData: ReportData;
  navigate: (p: string) => void;
  onBack: () => void;
}) {
  const { answer, sources, standards } = reportData;

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">BIS Compliance Report</h1>
              <p className="text-white/60 text-sm">AI-generated information summary — not an official BIS document</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => window.print()}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white" onClick={onBack}>
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {/* Report header */}
        <div className="bg-white border border-bis-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-bis-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-bis-navy rounded-sm flex items-center justify-center text-white text-xs font-black">BIS</div>
              <div>
                <div className="font-bold text-sm text-bis-navy">Bureau of Indian Standards</div>
                <div className="text-xs text-bis-muted">AI-generated information summary</div>
              </div>
            </div>
            <div className="text-right text-xs text-bis-muted">
              <p>Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ Important: This report is AI-generated and is only for guidance. It is not an official BIS document or legal compliance advice. Always check with official BIS sources before taking action.
            </p>
          </div>
        </div>

        {/* Product summary */}
        <Card className="p-5">
          <h3 className="font-semibold text-bis-text mb-3">1. Your Product</h3>
          <div className="flex flex-wrap gap-2">
            <Badge label={product || 'Your product'} variant="navy" />
            {Object.entries(answers).map(([k, v]) => <Badge key={k} label={v} variant="gray" />)}
          </div>
        </Card>

        {/* AI Answer */}
        <Card className="p-5">
          <h3 className="font-semibold text-bis-text mb-4">2. Compliance Requirements</h3>
          <FormattedAnswer text={answer} />
        </Card>

        {/* Standards found */}
        {standards && standards.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-bis-text mb-4">3. Relevant Indian Standards</h3>
            <div className="space-y-2">
              {standards.map((std, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-bis-surface rounded-lg border border-bis-border">
                  <span className="font-mono font-semibold text-bis-blue text-sm">{std.number}</span>
                  <span className="text-sm text-bis-text flex-1">{std.title}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Source documents */}
        {sources && sources.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-bis-text mb-4">4. Source Documents</h3>
            <div className="space-y-2">
              {sources.map((src, i) => (
                <div key={i} className="p-3 bg-bis-surface rounded-lg border border-bis-border text-sm">
                  <span className="font-medium text-bis-text">{src.title}</span>
                  {src.section && <span className="text-bis-muted"> · {src.section}</span>}
                  {src.clause && <span className="text-bis-muted"> · Clause {src.clause}</span>}
                  <div className="mt-1"><TrustBadge type="official" /></div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Next steps */}
        <Card className="p-5">
          <h3 className="font-semibold text-bis-text mb-4">5. What Should You Do Next?</h3>
          <div className="space-y-3">
            {[
              'Read the full text of the standards listed above from the official BIS website (bis.gov.in).',
              'Check if your product needs mandatory BIS certification (ISI Mark or CRS).',
              'Find a BIS-approved testing laboratory in your area to get your product tested.',
              'Talk to a BIS consultant or a certified professional for advice specific to your product.',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-bis-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                <p className="text-sm text-bis-text">{s}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap gap-3 print:hidden">
          <Button variant="primary" onClick={() => window.print()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Report
          </Button>
          <Button variant="ghost" onClick={() => navigate('/assistant')}>
            Ask Assistant More Questions
          </Button>
        </div>

        <p className="text-xs text-bis-muted pb-4">
          This is an AI-generated information summary and does not constitute official BIS certification or legal compliance advice. Always verify against official BIS sources at bis.gov.in.
        </p>
      </div>
    </div>
  );
}
