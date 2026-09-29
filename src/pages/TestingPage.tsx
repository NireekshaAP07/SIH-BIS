import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '../components/ui';
import { MOCK_LABS } from '../data/mockData';

export default function TestingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = MOCK_LABS.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Testing & Laboratories</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Testing & Laboratories</h1>
          <p className="text-white/70 max-w-2xl">Find testing information and relevant laboratories for BIS-related product testing.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex-1 min-w-48">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product, test or standard..."
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              }
            />
          </div>
          <select className="border border-bis-border rounded px-3 py-2 text-sm text-bis-text bg-white focus:outline-none focus:border-bis-blue">
            <option>All product types</option>
            <option>Electrical goods</option>
            <option>Consumer goods</option>
            <option>Food contact</option>
          </select>
          <select className="border border-bis-border rounded px-3 py-2 text-sm text-bis-text bg-white focus:outline-none focus:border-bis-blue">
            <option>All locations</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Chennai</option>
          </select>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Card className="p-5 bg-bis-blue-light border-bis-blue/20">
            <h3 className="font-semibold text-bis-text mb-2">BIS Laboratories</h3>
            <p className="text-sm text-bis-muted leading-relaxed mb-3">
              BIS operates central and regional laboratories that provide testing services for products seeking BIS certification.
            </p>
            <Button variant="secondary" size="sm">Learn More</Button>
          </Card>
          <Card className="p-5 bg-bis-gold-light border-bis-gold/20">
            <h3 className="font-semibold text-bis-text mb-2">Recognised Laboratories</h3>
            <p className="text-sm text-bis-muted leading-relaxed mb-3">
              BIS also recognises private and government laboratories for conducting specific tests required for BIS certification.
            </p>
            <Button variant="secondary" size="sm">View Directory</Button>
          </Card>
        </div>

        {/* Lab cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-bis-text">Laboratories ({filtered.length})</h2>
          </div>
          <div className="space-y-4">
            {filtered.map(lab => (
              <Card key={lab.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-bis-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                      </div>
                      <h3 className="font-semibold text-bis-text">{lab.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-bis-muted mb-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {lab.location}
                    </div>
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-1.5">Testing Capabilities</div>
                      <div className="flex flex-wrap gap-1">
                        {lab.capabilities.map(c => <Badge key={c} label={c} variant="blue" />)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button variant="primary" size="sm">View Details</Button>
                    <Button variant="secondary" size="sm">Contact</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-6 bg-bis-blue-light border border-bis-blue/20 rounded-xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-bis-text mb-1">Need testing guidance?</h3>
              <p className="text-sm text-bis-muted">Ask the BIS Assistant for product-specific testing requirements.</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/assistant')}>Ask BIS Assistant</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
