import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '../components/ui';
import { MOCK_CERTIFICATIONS } from '../data/mockData';

const PROCESS_STEPS = [
  { num: '1', label: 'Application', desc: 'Submit application to BIS with required product details.' },
  { num: '2', label: 'Documentation', desc: 'Submit required documents and test reports.' },
  { num: '3', label: 'Testing', desc: 'Product tested at BIS-recognised laboratory.' },
  { num: '4', label: 'Assessment', desc: 'Factory inspection and quality management assessment.' },
  { num: '5', label: 'Licensing', desc: 'Grant of licence/certification upon successful completion.' },
];

export default function CertificationPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_CERTIFICATIONS[0] | null>(null);

  const filtered = MOCK_CERTIFICATIONS.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <CertificationDetail cert={selected} onBack={() => setSelected(null)} navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <span>›</span>
            <span className="text-white/80">Certification</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">BIS Certification</h1>
          <p className="text-white/70 max-w-2xl">Understand certification schemes, requirements and procedures for BIS product certification.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-md mb-8">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search certification information..."
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            }
          />
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {filtered.map(cert => (
            <Card key={cert.id} hoverable onClick={() => setSelected(cert)} className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-bis-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                </div>
                <div>
                  <Badge label={cert.scheme} variant="navy" />
                </div>
              </div>
              <h3 className="font-semibold text-bis-text mb-2">{cert.title}</h3>
              <p className="text-sm text-bis-muted leading-relaxed mb-4 line-clamp-3">{cert.description}</p>
              <button className="text-sm text-bis-blue hover:text-bis-navy font-medium flex items-center gap-1 transition-colors">
                View details
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </Card>
          ))}
        </div>

        {/* General process */}
        <div className="bg-white border border-bis-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-2">General Certification Process</h2>
          <p className="text-sm text-bis-muted mb-8">The specific steps may vary depending on the certification scheme and product category.</p>
          <div className="flex flex-col md:flex-row gap-0">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="flex-1 relative">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-bis-navy text-white flex flex-col items-center justify-center mb-3 shadow-md relative z-10">
                    <span className="text-xs text-white/60">{step.num}</span>
                  </div>
                  <div className="font-semibold text-bis-text text-sm mb-1">{step.label}</div>
                  <p className="text-xs text-bis-muted leading-relaxed">{step.desc}</p>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 w-1/2 h-px bg-bis-border"/>
                )}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-1/2 h-px bg-bis-border"/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 bg-bis-blue-light border border-bis-blue/20 rounded-xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-bis-text mb-1">Need guidance on certification?</h3>
              <p className="text-sm text-bis-muted">Ask the BIS Assistant for product-specific certification information.</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/assistant')}>
              Ask BIS Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificationDetail({
  cert, onBack, navigate
}: {
  cert: typeof MOCK_CERTIFICATIONS[0];
  onBack: () => void;
  navigate: (p: string) => void;
}) {
  const PROCESS_STEPS = [
    { num: '1', label: 'Application', desc: 'Submit application with product and manufacturer details.' },
    { num: '2', label: 'Documentation', desc: 'Provide required documents as specified for this scheme.' },
    { num: '3', label: 'Testing', desc: 'Product samples tested at recognised laboratory.' },
    { num: '4', label: 'Assessment', desc: 'Factory inspection and evaluation.' },
    { num: '5', label: 'Certification', desc: 'Certificate or licence granted upon successful completion.' },
  ];

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <button onClick={onBack} className="hover:text-white">Certification</button>
            <span>›</span>
            <span className="text-white/80">{cert.scheme}</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <Badge label={cert.scheme} variant="gold" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{cert.title}</h1>
          <p className="text-white/70 max-w-2xl">{cert.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Overview</h2>
              <p className="text-sm text-bis-text leading-relaxed">{cert.description}</p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-3">Applicability</h2>
              <p className="text-sm text-bis-text leading-relaxed">{cert.applicability}</p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-4">Required Documents</h2>
              <div className="space-y-2">
                {cert.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded">
                    <svg className="w-4 h-4 text-bis-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <span className="text-sm text-bis-text">{doc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-bis-muted mt-3 pt-3 border-t border-bis-border">
                Document requirements may vary. Verify with official BIS guidance before applying.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-bis-text mb-6">Certification Process</h2>
              <div className="space-y-4">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-bis-navy text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{step.num}</div>
                      {i < PROCESS_STEPS.length - 1 && <div className="w-px h-full bg-bis-border mt-1 mb-0 min-h-8"/>}
                    </div>
                    <div className="pb-4">
                      <div className="font-semibold text-bis-text text-sm">{step.label}</div>
                      <p className="text-sm text-bis-muted">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-3 text-sm">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="sm" onClick={() => navigate('/assistant')} className="w-full justify-center">
                  Ask BIS Assistant
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/compliance')} className="w-full justify-center">
                  Check My Requirements
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  Official BIS Source
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-bis-text mb-2 text-sm">Related Services</h3>
              <div className="space-y-1">
                <button onClick={() => navigate('/testing')} className="w-full text-left text-sm p-2 rounded hover:bg-bis-surface text-bis-blue hover:text-bis-navy transition-colors">Testing & Laboratories →</button>
                <button onClick={() => navigate('/standards')} className="w-full text-left text-sm p-2 rounded hover:bg-bis-surface text-bis-blue hover:text-bis-navy transition-colors">Standards Explorer →</button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
