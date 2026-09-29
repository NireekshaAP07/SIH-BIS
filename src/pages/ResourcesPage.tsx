import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';

export default function ResourcesPage() {
  const navigate = useNavigate();

  const resources = [
    { title: 'Standards Catalogue', desc: 'Full catalogue of published Indian Standards.', type: 'Database', icon: '📚' },
    { title: 'Certification Scheme Documents', desc: 'Official scheme documents for BIS certification.', type: 'Document', icon: '📋' },
    { title: 'Hallmarking Scheme', desc: 'Complete information on BIS Hallmarking Scheme.', type: 'Document', icon: '🔶' },
    { title: 'BIS Annual Report', desc: 'Annual report of the Bureau of Indian Standards.', type: 'Publication', icon: '📊' },
    { title: 'Consumer Awareness Materials', desc: 'Brochures and materials for consumer awareness.', type: 'Publication', icon: '📰' },
    { title: 'Regulatory Notifications', desc: 'Government notifications related to BIS and mandatory certification.', type: 'Regulatory', icon: '📜' },
  ];

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Resources</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Resources & Documents</h1>
          <p className="text-white/70 max-w-2xl">Access BIS publications, documents, and official resources.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <Card key={r.title} hoverable className="p-5">
              <div className="text-2xl mb-3">{r.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-bis-text">{r.title}</h3>
              </div>
              <Badge label={r.type} variant="gray" />
              <p className="text-sm text-bis-muted leading-relaxed mt-2 mb-3">{r.desc}</p>
              <button className="text-sm text-bis-blue hover:text-bis-navy font-medium flex items-center gap-1 transition-colors">
                View resource
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </Card>
          ))}
        </div>

        <div className="p-6 bg-bis-navy rounded-xl text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold mb-2">Can't find what you need?</h3>
              <p className="text-white/70 text-sm">Ask the BIS Assistant for help locating specific documents or information.</p>
            </div>
            <Button onClick={() => navigate('/assistant')} size="lg" className="bg-bis-gold hover:bg-amber-700 text-white border-0">
              Ask BIS Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
