import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';

const SERVICES = [
  {
    title: 'Product Certification (ISI Mark)',
    desc: 'Find information about products that carry the ISI Mark and what it signifies.',
    icon: '🏷️',
    path: '/certification',
  },
  {
    title: 'BIS Mark Verification',
    desc: 'Learn how to verify the authenticity of BIS marked products.',
    icon: '✓',
    path: '/consumer',
  },
  {
    title: 'Hallmarking',
    desc: 'Understand gold and silver hallmarking and how to verify hallmarks.',
    icon: '🔶',
    path: '/hallmarking',
  },
  {
    title: 'Consumer Complaints',
    desc: 'Find information on how to raise consumer complaints related to BIS-certified products.',
    icon: '📝',
    path: '/consumer',
  },
  {
    title: 'Product Verification',
    desc: 'Verify whether a product is genuinely BIS-certified or hallmarked.',
    icon: '🔍',
    path: '/consumer',
  },
  {
    title: 'Frequently Asked Questions',
    desc: 'Find answers to common questions about BIS standards, certification and services.',
    icon: '❓',
    path: '/resources',
  },
];

const FAQS = [
  {
    q: 'What is the ISI Mark?',
    a: 'The ISI Mark is a certification mark for industrial products in India, administered by the Bureau of Indian Standards (BIS). Products certified under BIS carry the ISI Mark as an indication that they conform to specified Indian Standards.',
  },
  {
    q: 'Which products require mandatory BIS certification?',
    a: 'The Government of India periodically notifies products that require mandatory BIS certification. The list includes a wide range of products across sectors such as electrical goods, electronics, food, construction materials, and more. Check the official BIS notification for the current list.',
  },
  {
    q: 'How can I verify a BIS certificate?',
    a: 'BIS provides an online portal and mobile app (BIS Care) that allows consumers and businesses to verify the validity of BIS licences and certificates.',
  },
  {
    q: 'What should I do if I find a product with a fake ISI Mark?',
    a: 'If you suspect a product carries a fraudulent BIS mark, you can report it to BIS through their official complaint mechanism or contact the nearest BIS regional office.',
  },
];

export default function ConsumerServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Consumer Services</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Consumer Services</h1>
          <p className="text-white/70 max-w-2xl">Information and guidance for consumers on BIS standards, certification, and services.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <Card key={s.title} hoverable onClick={() => navigate(s.path)} className="p-5">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-bis-text mb-2">{s.title}</h3>
              <p className="text-sm text-bis-muted leading-relaxed mb-3">{s.desc}</p>
              <button className="text-sm text-bis-blue hover:text-bis-navy font-medium flex items-center gap-1 transition-colors">
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-bis-text mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group border border-bis-border rounded-lg">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none hover:bg-bis-surface rounded-lg transition-colors">
                  <span className="font-medium text-bis-text text-sm">{faq.q}</span>
                  <svg className="w-4 h-4 text-bis-muted flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="px-4 pb-4 pt-2">
                  <p className="text-sm text-bis-muted leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 bg-bis-blue-light border border-bis-blue/20 rounded-xl">
            <h3 className="font-semibold text-bis-text mb-2">BIS Care App</h3>
            <p className="text-sm text-bis-muted mb-4">The official BIS consumer app for verifying certificates and hallmarks, and raising complaints.</p>
            <Badge label="Official BIS Service" variant="blue" />
          </div>
          <div className="p-6 bg-bis-gold-light border border-bis-gold/20 rounded-xl">
            <h3 className="font-semibold text-bis-text mb-2">Ask BIS Assistant</h3>
            <p className="text-sm text-bis-muted mb-4">Get clear, source-backed answers to your consumer queries about BIS standards and services.</p>
            <Button variant="primary" size="sm" onClick={() => navigate('/assistant')}>Ask Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
