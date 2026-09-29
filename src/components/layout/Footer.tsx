import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bis-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* BIS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/bis-logo.webp" alt="BIS Logo" className="w-8 h-8 object-contain flex-shrink-0" />
              <div>
                <div className="font-bold text-sm">Bureau of Indian Standards</div>
              </div>
            </div>
            <ul className="space-y-2">
              {['About BIS', 'Contact', 'Regional Offices', 'Career'].map(l => (
                <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Standards', to: '/standards' },
                { label: 'Certification', to: '/certification' },
                { label: 'Testing', to: '/testing' },
                { label: 'Hallmarking', to: '/hallmarking' },
                { label: 'Consumer Services', to: '/consumer' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Documents & Publications', to: '/resources' },
                { label: 'FAQs', to: '/resources' },
                { label: 'Check My Requirements', to: '/compliance' },
                { label: 'BIS Assistant', to: '/assistant' },
              ].map(l => (
                <li key={l.label}><Link to={l.to} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Use', 'Accessibility Statement', 'Disclaimer'].map(l => (
                <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/50 leading-relaxed">
                This portal provides AI-assisted access to BIS information. Responses are informational and should be verified against official BIS sources.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">© Bureau of Indian Standards. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs">Government of India</span>
            <span className="text-white/20">|</span>
            <span className="text-white/40 text-xs">Ministry of Consumer Affairs, Food and Public Distribution</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
