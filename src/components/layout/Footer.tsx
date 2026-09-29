import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLang();

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
              {[t.footer.aboutBIS, t.footer.contact, t.footer.regionalOffices, t.footer.career].map(l => (
                <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t.footer.services}</h4>
            <ul className="space-y-2">
              {[
                { label: t.nav.standards, to: '/standards' },
                { label: t.nav.certification, to: '/certification' },
                { label: t.nav.testing, to: '/testing' },
                { label: t.nav.hallmarking, to: '/hallmarking' },
                { label: t.nav.consumerServices, to: '/consumer' },
              ].map(l => (
                <li key={l.to}><Link to={l.to} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t.footer.resources}</h4>
            <ul className="space-y-2">
              {[
                { label: t.footer.documentsPublications, to: '/resources' },
                { label: t.footer.faqs, to: '/resources' },
                { label: t.footer.checkRequirements, to: '/compliance' },
                { label: t.footer.bisAssistant, to: '/assistant' },
              ].map(l => (
                <li key={l.label}><Link to={l.to} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">{t.footer.legal}</h4>
            <ul className="space-y-2">
              {[t.footer.privacyPolicy, t.footer.termsOfUse, t.footer.accessibilityStatement, t.footer.disclaimer].map(l => (
                <li key={l}><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/50 leading-relaxed">{t.footer.disclaimer2}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs">{t.footer.govIndia}</span>
            <span className="text-white/20">|</span>
            <span className="text-white/40 text-xs">{t.footer.ministry}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
