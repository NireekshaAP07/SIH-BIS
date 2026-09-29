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

        {/* BIS CARE App Banner */}
        <div className="bg-gradient-to-r from-bis-navy to-bis-blue-mid rounded-2xl p-6 text-white shadow-md border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-bis-navy text-2xl font-bold flex-shrink-0 shadow">
              📱
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">BIS CARE App</h2>
                <span className="px-2 py-0.5 text-xs bg-bis-gold text-white font-medium rounded-full">Official App</span>
              </div>
              <p className="text-white/80 text-sm max-w-xl leading-relaxed">
                Verify ISI Mark, Hallmarking (HUID), and CRS registration numbers directly on your mobile device. Report complaints and check standard specifications on the go.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white text-bis-navy font-semibold text-sm rounded-lg hover:bg-bis-blue-light transition-colors flex items-center gap-2 shadow"
            >
              <span>Google Play Store</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
            <a
              href="https://apps.apple.com/in/app/bis-care/id1527749002"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg border border-white/20 transition-colors flex items-center gap-2"
            >
              <span>Apple App Store</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
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
