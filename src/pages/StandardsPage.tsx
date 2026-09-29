import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Input } from '../components/ui';
import { MOCK_STANDARDS } from '../data/mockData';

const CATEGORIES = ['All', 'Food Contact', 'Electrical', 'Construction', 'Textiles', 'Chemicals', 'Consumer Goods'];
const STATUSES = ['All', 'Current', 'Under revision', 'Withdrawn'];
const YEARS = ['All', '2024', '2023', '2022', '2021', '2020'];

export default function StandardsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [year, setYear] = useState('All');
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = MOCK_STANDARDS.filter(s =>
    (!search || s.title.toLowerCase().includes(search.toLowerCase())) &&
    (status === 'All' || s.status === status)
  );

  return (
    <div className="min-h-screen bg-bis-surface">
      {/* Page header */}
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
            <span>›</span>
            <span className="text-white/80">Standards</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Indian Standards Explorer</h1>
          <p className="text-white/70">Search and explore Indian Standards relevant to your product or requirement.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, product, or keyword..."
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              }
            />
          </div>
          <button
            onClick={() => setMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-bis-border rounded bg-white text-sm text-bis-text hover:border-bis-blue transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            Filters
          </button>
          <Button onClick={() => navigate('/workflow')} variant="primary">
            Find Standards for My Product
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white border border-bis-border rounded-lg p-4">
              <h3 className="font-semibold text-bis-text text-sm mb-4">Filters</h3>

              <div className="mb-4">
                <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Category</div>
                <div className="space-y-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${category === c ? 'bg-bis-blue-light text-bis-blue font-medium' : 'text-bis-muted hover:text-bis-text hover:bg-bis-surface'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 border-t border-bis-border pt-4">
                <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Status</div>
                <div className="space-y-1">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${status === s ? 'bg-bis-blue-light text-bis-blue font-medium' : 'text-bis-muted hover:text-bis-text hover:bg-bis-surface'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-bis-border pt-4">
                <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Year</div>
                <div className="space-y-1">
                  {YEARS.map(y => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${year === y ? 'bg-bis-blue-light text-bis-blue font-medium' : 'text-bis-muted hover:text-bis-text hover:bg-bis-surface'}`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-bis-muted">
                Showing <strong className="text-bis-text">{filtered.length}</strong> results
              </p>
              <div className="flex items-center gap-2">
                <select className="text-sm border border-bis-border rounded px-2 py-1.5 text-bis-text bg-white focus:outline-none focus:border-bis-blue">
                  <option>Most relevant</option>
                  <option>Newest first</option>
                  <option>Alphabetical</option>
                </select>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map(std => (
                  <Card key={std.id} hoverable onClick={() => navigate(`/standards/detail?id=${std.id}`, { state: { standard: std } })} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xs font-mono font-semibold text-bis-blue">{std.number}</span>
                          <Badge label={std.status} variant="green" />
                          {std.mandatory && <Badge label="Mandatory (QCO)" variant="red" />}
                          {std.certRequired && <Badge label="Certification applicable" variant="gold" />}
                          {std.testingRequired && <Badge label="Testing required" variant="blue" />}
                        </div>
                        <h3 className="font-semibold text-bis-text mb-1">{std.title}</h3>
                        <p className="text-sm text-bis-muted line-clamp-2 mb-2">{std.scope}</p>
                        <div className="flex flex-wrap gap-1">
                          {std.tags.map(t => <Badge key={t} label={t} variant="gray" />)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button variant="primary" size="sm" onClick={e => { e.stopPropagation(); navigate(`/standards/detail?id=${std.id}`, { state: { standard: std } }); }}>
                          View Standard
                        </Button>
                        <Button variant="ghost" size="sm" onClick={e => e.stopPropagation()}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-bis-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-bis-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h3 className="font-semibold text-bis-text mb-2">No standards found</h3>
                <p className="text-bis-muted text-sm mb-4">Try adjusting your search or filters.</p>
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setCategory('All'); setStatus('All'); }}>
                    Clear filters
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/assistant')}>
                    Ask BIS Assistant
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters sheet */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileFilters(false)}/>
          <div className="relative bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-bis-text">Filters</h3>
              <button onClick={() => setMobileFilters(false)} className="text-bis-muted hover:text-bis-text">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${status === s ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => { setStatus('All'); setMobileFilters(false); }}>Clear</Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={() => setMobileFilters(false)}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
