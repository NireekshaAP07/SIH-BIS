import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card } from '../components/ui';

const HALLMARK_COMPONENTS = [
  { symbol: 'BIS', label: 'BIS Mark', desc: 'The Bureau of Indian Standards logo, indicating BIS hallmarking.' },
  { symbol: '916', label: 'Purity Grade', desc: 'Purity in parts per thousand (e.g., 916 for 22-carat gold).' },
  { symbol: '🔶', label: 'Assaying Centre', desc: 'Identity mark of the Assaying and Hallmarking Centre.' },
  { symbol: 'Yr', label: 'Year of Marking', desc: 'The year the article was hallmarked.' },
  { symbol: 'J', label: "Jeweller's Mark", desc: "The jeweller's or manufacturer's identification mark." },
];

const PURITY_GRADES = [
  { grade: '999', carat: '24 Karat', desc: '99.9% purity' },
  { grade: '995', carat: '24 Karat', desc: '99.5% purity' },
  { grade: '916', carat: '22 Karat', desc: '91.6% purity' },
  { grade: '875', carat: '21 Karat', desc: '87.5% purity' },
  { grade: '750', carat: '18 Karat', desc: '75.0% purity' },
  { grade: '585', carat: '14 Karat', desc: '58.5% purity' },
  { grade: '375', carat: '9 Karat', desc: '37.5% purity' },
];

export default function HallmarkingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Hallmarking</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Hallmarking</h1>
          <p className="text-white/70 max-w-2xl">Understanding the BIS Hallmarking scheme for gold and silver jewellery and articles.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* What is hallmarking */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-4">What is Hallmarking?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-bis-text leading-relaxed mb-3">
                Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in precious metal articles. In India, the BIS administers the hallmarking of gold and silver articles.
              </p>
              <p className="text-sm text-bis-muted leading-relaxed">
                BIS Hallmarking provides consumers with assurance of the purity of gold and silver articles they purchase, protecting consumer interests and supporting fair trade practices.
              </p>
            </div>
            <div className="bg-bis-gold-light border border-bis-gold/20 rounded-lg p-4">
              <div className="text-xs font-semibold text-bis-muted uppercase tracking-wide mb-2">Key Benefit</div>
              <p className="text-sm font-medium text-bis-text">
                Hallmarking provides consumers with reliable assurance of the purity of precious metal articles.
              </p>
            </div>
          </div>
        </Card>

        {/* How it works */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-6">How Hallmarking Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Submission', desc: 'Jeweller submits articles to a BIS-recognised Assaying and Hallmarking Centre.' },
              { step: '2', title: 'Testing', desc: 'The centre tests the article to determine its precious metal content.' },
              { step: '3', title: 'Marking', desc: 'The hallmark with purity grade, AHC mark, and year mark is applied.' },
              { step: '4', title: 'Sale', desc: 'The hallmarked article can then be sold to consumers with verified purity.' },
            ].map(s => (
              <div key={s.step} className="text-center p-4">
                <div className="w-10 h-10 rounded-full bg-bis-navy text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-semibold text-bis-text text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-bis-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Hallmark components */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-2">Understanding a BIS Hallmark</h2>
          <p className="text-sm text-bis-muted mb-6">A BIS Hallmark contains several components that together provide complete traceability.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HALLMARK_COMPONENTS.map(c => (
              <div key={c.label} className="p-4 bg-bis-surface rounded-lg border border-bis-border text-center">
                <div className="text-2xl font-bold text-bis-navy mb-2">{c.symbol}</div>
                <div className="text-xs font-semibold text-bis-text mb-1">{c.label}</div>
                <p className="text-xs text-bis-muted leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Purity grades */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-2">Gold Purity Grades</h2>
          <p className="text-sm text-bis-muted mb-6">BIS recognises the following gold purity grades for hallmarking.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bis-border">
                  <th className="text-left py-2 pr-4 font-semibold text-bis-muted text-xs uppercase tracking-wide">Fineness</th>
                  <th className="text-left py-2 pr-4 font-semibold text-bis-muted text-xs uppercase tracking-wide">Carat</th>
                  <th className="text-left py-2 font-semibold text-bis-muted text-xs uppercase tracking-wide">Description</th>
                </tr>
              </thead>
              <tbody>
                {PURITY_GRADES.map(g => (
                  <tr key={g.grade} className="border-b border-bis-border last:border-0">
                    <td className="py-2.5 pr-4 font-mono font-bold text-bis-navy">{g.grade}</td>
                    <td className="py-2.5 pr-4 text-bis-text font-medium">{g.carat}</td>
                    <td className="py-2.5 text-bis-muted">{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Consumer guidance */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-4">Consumer Guidance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-bis-text text-sm">When buying hallmarked jewellery</h3>
              {[
                'Look for the complete BIS Hallmark with all mandatory components.',
                'Check the purity grade to ensure it matches what is being sold.',
                'Ask for a purchase receipt with details of the article.',
                'Verify the hallmark through the BIS CAKNOW app if needed.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-bis-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4"/></svg>
                  <p className="text-sm text-bis-text">{tip}</p>
                </div>
              ))}
            </div>
            <div className="bg-bis-blue-light border border-bis-blue/20 rounded-lg p-4">
              <Badge label="Official Resource" variant="blue" />
              <h3 className="font-semibold text-bis-text text-sm mt-3 mb-2">BIS CAKNOW App</h3>
              <p className="text-sm text-bis-muted leading-relaxed mb-3">
                BIS provides a mobile application that allows consumers to verify the validity of BIS hallmarks on gold and silver articles.
              </p>
              <Button variant="secondary" size="sm">Learn More</Button>
            </div>
          </div>
        </Card>

        {/* Official resources */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-bis-text mb-4">Official Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Hallmarking Scheme Information', desc: 'Official BIS information on the hallmarking scheme.' },
              { title: 'Find Assaying Centres', desc: 'Locate BIS-recognised Assaying and Hallmarking Centres.' },
              { title: 'Hallmarking Regulations', desc: 'Official rules and regulations governing hallmarking.' },
            ].map(r => (
              <div key={r.title} className="p-4 bg-bis-surface rounded-lg border border-bis-border">
                <h4 className="font-medium text-bis-text text-sm mb-1">{r.title}</h4>
                <p className="text-xs text-bis-muted mb-2">{r.desc}</p>
                <button className="text-xs text-bis-blue hover:underline">View official source →</button>
              </div>
            ))}
          </div>
        </Card>

        <div className="text-center p-8 bg-bis-navy rounded-xl text-white">
          <h3 className="text-xl font-bold mb-2">Have questions about hallmarking?</h3>
          <p className="text-white/70 mb-6">Ask the BIS Assistant for specific guidance on hallmarking requirements.</p>
          <Button onClick={() => navigate('/assistant')} size="lg" className="bg-bis-gold hover:bg-amber-700 text-white border-0">
            Ask BIS Assistant
          </Button>
        </div>
      </div>
    </div>
  );
}
