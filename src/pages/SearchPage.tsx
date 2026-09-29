import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '../components/ui';
import { MOCK_STANDARDS, MOCK_CERTIFICATIONS, MOCK_LABS } from '../data/mockData';

type Tab = 'all' | 'standards' | 'certification' | 'testing' | 'resources';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    if (query.trim()) setSearched(true);
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'standards', label: 'Standards' },
    { key: 'certification', label: 'Certification' },
    { key: 'testing', label: 'Testing' },
    { key: 'resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Search BIS Information</h1>
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1">
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                placeholder="Search standards, certification, testing, resources..."
                className="bg-white"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                }
              />
            </div>
            <Button variant="primary" size="md" onClick={handleSearch}>Search</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-bis-border mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${tab === t.key ? 'text-bis-navy border-bis-navy' : 'text-bis-muted border-transparent hover:text-bis-text'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!searched ? (
          <div className="text-center py-16">
            <p className="text-bis-muted">Enter a search term to find standards, certification information, testing services, and more.</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar filters */}
            <aside className="hidden md:block w-48 flex-shrink-0">
              <div className="bg-white border border-bis-border rounded-lg p-4">
                <h3 className="font-semibold text-bis-text text-sm mb-4">Filters</h3>
                {[['Standard status', ['Current', 'Under revision']], ['Year', ['2024', '2023', '2022']]].map(([group, opts]) => (
                  <div key={group as string} className="mb-4">
                    <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">{group}</div>
                    {(opts as string[]).map(o => (
                      <label key={o} className="flex items-center gap-2 text-sm text-bis-muted hover:text-bis-text py-1 cursor-pointer">
                        <input type="checkbox" className="rounded border-bis-border text-bis-blue focus:ring-bis-blue"/>
                        {o}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </aside>

            <div className="flex-1 space-y-4">
              <p className="text-sm text-bis-muted">Results for "<strong className="text-bis-text">{query}</strong>"</p>

              {(tab === 'all' || tab === 'standards') && (() => {
                const results = MOCK_STANDARDS.filter(s =>
                  !query.trim() ||
                  s.number.toLowerCase().includes(query.toLowerCase()) ||
                  s.title.toLowerCase().includes(query.toLowerCase()) ||
                  s.scope.toLowerCase().includes(query.toLowerCase()) ||
                  s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
                );

                if (results.length === 0) {
                  return tab === 'standards' ? (
                    <div className="bg-white border border-bis-border rounded-lg p-8 text-center text-bis-muted">
                      No standards found matching "{query}".
                    </div>
                  ) : null;
                }

                return results.map((std, i) => (
                  <Card key={i} hoverable onClick={() => navigate(`/standards/detail?id=${std.id}`, { state: { standard: std } })} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge label="Standard" variant="blue" />
                          <span className="text-xs font-mono font-semibold text-bis-blue">{std.number}</span>
                          <Badge label={std.status} variant="green" />
                          {std.mandatory && <Badge label="Mandatory (QCO)" variant="red" />}
                        </div>
                        <h3 className="font-medium text-bis-text mb-1">{std.title}</h3>
                        <p className="text-xs text-bis-muted line-clamp-2">{std.scope}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); navigate(`/standards/detail?id=${std.id}`, { state: { standard: std } }); }}>View</Button>
                    </div>
                  </Card>
                ));
              })()}

              {(tab === 'all' || tab === 'certification') && (() => {
                const results = MOCK_CERTIFICATIONS.filter(c =>
                  !query.trim() ||
                  c.title.toLowerCase().includes(query.toLowerCase()) ||
                  c.scheme.toLowerCase().includes(query.toLowerCase()) ||
                  c.description.toLowerCase().includes(query.toLowerCase())
                );

                if (results.length === 0) {
                  return tab === 'certification' ? (
                    <div className="bg-white border border-bis-border rounded-lg p-8 text-center text-bis-muted">
                      No certification schemes found matching "{query}".
                    </div>
                  ) : null;
                }

                return results.map((cert, i) => (
                  <Card key={i} hoverable onClick={() => navigate('/certification')} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge label="Certification" variant="gold" />
                          <Badge label={cert.scheme} variant="navy" />
                        </div>
                        <h3 className="font-medium text-bis-text mb-1">{cert.title}</h3>
                        <p className="text-xs text-bis-muted line-clamp-2">{cert.description}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={e => { e.stopPropagation(); navigate('/certification'); }}>View</Button>
                    </div>
                  </Card>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
