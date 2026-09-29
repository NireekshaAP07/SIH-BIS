import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '../components/ui';
import { MOCK_STANDARDS } from '../data/mockData';

type Step = 1 | 2 | 3 | 4;

export default function WorkflowPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [product, setProduct] = useState('');
  const [material, setMaterial] = useState('');
  const [intendedUse, setIntendedUse] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [stage, setStage] = useState('');

  const STEPS = ['Product', 'Context', 'Results', 'Next Steps'];

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <button onClick={() => navigate('/standards')} className="hover:text-white">Standards</button>
            <span>›</span>
            <span className="text-white/80">Find Standards for My Product</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Standards for My Product</h1>
          <p className="text-white/70">Answer a few questions to discover potentially relevant Indian Standards.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => {
            const num = (i + 1) as Step;
            const active = num === step;
            const done = num < step;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? 'bg-bis-success text-white' : active ? 'bg-bis-navy text-white' : 'bg-bis-border text-bis-muted'}`}>
                    {done ? '✓' : num}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${active ? 'text-bis-navy' : done ? 'text-bis-success' : 'text-bis-muted'}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 mb-4 ${done ? 'bg-bis-success' : 'bg-bis-border'}`}/>
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-bis-text mb-2">What product are you asking about?</h2>
            <p className="text-sm text-bis-muted mb-6">Describe the product you manufacture, import, or want to understand requirements for.</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-bis-text mb-2">Product description</label>
              <textarea
                value={product}
                onChange={e => setProduct(e.target.value)}
                placeholder='e.g. "Stainless steel water bottle for consumer use"'
                className="w-full border border-bis-border rounded-lg px-4 py-3 text-sm text-bis-text placeholder:text-bis-muted/70 focus:outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue transition-colors min-h-[120px] resize-y"
              />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="lg" onClick={() => product.trim() && setStep(2)} disabled={!product.trim()}>
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-bis-text mb-2">Tell us more about the product</h2>
            <p className="text-sm text-bis-muted mb-6">
              Product: <strong className="text-bis-text">{product}</strong>
            </p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-bis-text mb-1">Primary material (optional)</label>
                <input
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  placeholder='e.g. "Stainless steel grade 304"'
                  className="w-full border border-bis-border rounded px-3 py-2 text-sm text-bis-text placeholder:text-bis-muted/70 focus:outline-none focus:border-bis-blue focus:ring-1 focus:ring-bis-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bis-text mb-2">Intended use</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Consumer', 'Industrial', 'Commercial', 'Other'].map(u => (
                    <button
                      key={u}
                      onClick={() => setIntendedUse(u)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${intendedUse === u ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue hover:text-bis-text'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bis-text mb-2">Target users</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Adults', 'Children', 'General public', 'Industrial users'].map(u => (
                    <button
                      key={u}
                      onClick={() => setTargetUsers(u)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${targetUsers === u ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue hover:text-bis-text'}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bis-text mb-2">Manufacturing stage</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Idea', 'Prototype', 'Manufacturing', 'Ready for market', 'Existing product'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStage(s)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${stage === s ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue hover:text-bis-text'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-8">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                Back
              </Button>
              <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                Find Relevant Standards
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-bis-text">Potentially Relevant Standards</h2>
                <Badge label={`${MOCK_STANDARDS.length} found`} variant="blue" />
              </div>
              <div className="p-3 bg-bis-gold-light border border-bis-gold/20 rounded-lg mb-4 text-sm text-bis-text">
                <strong>Note:</strong> These results are AI-assisted and based on the information you provided. Verify against official BIS sources before making compliance decisions.
              </div>
              <div className="space-y-3">
                {MOCK_STANDARDS.map((std, i) => (
                  <div key={i} className="p-4 bg-bis-surface rounded-lg border border-bis-border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono font-semibold text-bis-blue">{std.number}</span>
                          <Badge label={std.status} variant="green" />
                          <Badge label={`${std.relevance} relevance`} variant="gold" />
                        </div>
                        <h3 className="font-medium text-bis-text mb-1">{std.title}</h3>
                        <p className="text-xs text-bis-muted line-clamp-2 mb-2">{std.scope}</p>
                        <div className="flex flex-wrap gap-1">
                          {std.certRequired && <Badge label="Certification may apply" variant="gold" />}
                          {std.testingRequired && <Badge label="Testing required" variant="blue" />}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button variant="primary" size="sm" onClick={() => navigate('/standards/detail')}>View</Button>
                        <Button variant="ghost" size="sm">Save</Button>
                        <Button variant="secondary" size="sm" onClick={() => navigate('/assistant')}>Ask</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                Refine
              </Button>
              <Button variant="primary" size="lg" onClick={() => setStep(4)}>
                View Next Steps
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <Card className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-bis-text mb-2">Recommended Next Steps</h2>
            <p className="text-sm text-bis-muted mb-6">Based on your product and the identified standards.</p>
            <div className="space-y-4 mb-8">
              {[
                { n: 1, title: 'Review identified standards', desc: 'Obtain and review the full text of the potentially applicable standards through official BIS channels.' },
                { n: 2, title: 'Verify mandatory certification requirements', desc: 'Check the current Schedule of Products for Mandatory Certification to confirm whether your product requires BIS certification.' },
                { n: 3, title: 'Consult testing requirements', desc: 'Identify the specific tests required and locate appropriate BIS-recognised testing laboratories.' },
                { n: 4, title: 'Seek professional guidance', desc: 'For complex compliance questions, consider consulting a qualified standards or regulatory professional.' },
              ].map(s => (
                <div key={s.n} className="flex gap-4 p-4 bg-bis-surface rounded-lg border border-bis-border">
                  <div className="w-7 h-7 rounded-full bg-bis-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</div>
                  <div>
                    <h3 className="font-medium text-bis-text text-sm mb-1">{s.title}</h3>
                    <p className="text-sm text-bis-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => navigate('/compliance')}>
                Check My BIS Requirements
              </Button>
              <Button variant="secondary" onClick={() => navigate('/assistant')}>
                Ask BIS Assistant
              </Button>
              <Button variant="ghost" onClick={() => { setStep(1); setProduct(''); }}>
                Start Over
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
