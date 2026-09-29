import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { useLang } from '../../i18n/LanguageContext';
import { LANGUAGES } from '../../i18n/translations';

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLang();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [textScale, setTextScale] = useState<1 | 1.12 | 1.25>(1);
  const [scrolled, setScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useOutsideClick(langRef, () => setLangOpen(false));
  useOutsideClick(accessRef, () => setAccessOpen(false));
  useOutsideClick(notifRef, () => setNotifOpen(false));

  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale * 100}%`;
  }, [textScale]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const NAV_ITEMS = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.standards, path: '/standards' },
    { label: t.nav.certification, path: '/certification' },
    { label: t.nav.testing, path: '/testing' },
    { label: t.nav.hallmarking, path: '/hallmarking' },
    { label: t.nav.consumerServices, path: '/consumer' },
    { label: t.nav.resources, path: '/resources' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <header className={`w-full sticky top-0 z-40 transition-shadow duration-200 ${scrolled ? 'shadow-lg shadow-black/10' : ''}`}>

      {/* ── Utility bar ─────────────────────────────── */}
      <div className="bg-bis-navy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-[11px]">
          {/* Left */}
          <div className="flex items-center gap-2 text-white/40">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-1 focus:left-1 focus:px-2 focus:py-1 focus:bg-bis-gold focus:text-white focus:rounded focus:text-xs focus:z-50"
            >
              {t.nav.skipToMain}
            </a>
            <span>{t.footer.govIndia}</span>
            <span className="text-white/20">·</span>
            <span className="hidden sm:inline">{t.footer.ministry}</span>
          </div>

          {/* Right utilities */}
          <div className="flex items-center">
            {/* Accessibility */}
            <div className="relative" ref={accessRef}>
              <button
                onClick={() => { setAccessOpen(p => !p); setLangOpen(false); setNotifOpen(false); }}
                className="flex items-center gap-1 px-2.5 h-8 text-white/70 hover:text-white transition-colors"
                aria-label={t.nav.accessibility}
                aria-expanded={accessOpen}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="4" r="1"/><path strokeLinecap="round" strokeLinejoin="round" d="M10 9h4m-2 0v11M7.5 15l2.5-3 2.5 3"/></svg>
                <span className="hidden sm:inline">{t.nav.accessibility}</span>
              </button>
              {accessOpen && (
                <div className="absolute right-0 top-full mt-0.5 bg-white border border-bis-border rounded-xl shadow-xl w-52 z-50 p-4">
                  <p className="text-[10px] font-semibold text-bis-muted uppercase tracking-wider mb-3">{t.nav.textSize}</p>
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {([1, 1.12, 1.25] as const).map((s, i) => (
                      <button
                        key={s}
                        onClick={() => setTextScale(s)}
                        className={`py-1.5 text-sm font-bold rounded-lg border transition-colors ${textScale === s ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue hover:text-bis-text'}`}
                        aria-label={['Normal text size', 'Large text size', 'Larger text size'][i]}
                      >
                        {['A', 'A+', 'A++'][i]}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-bis-border pt-3">
                    <Link to="/settings" className="flex items-center justify-between text-xs text-bis-blue hover:text-bis-navy py-0.5 transition-colors">
                      {t.nav.allAccessibility}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-white/15 mx-0.5"/>

            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setLangOpen(p => !p); setAccessOpen(false); setNotifOpen(false); }}
                className="flex items-center gap-1 px-2.5 h-8 text-white/70 hover:text-white transition-colors"
                aria-label={t.nav.language}
                aria-expanded={langOpen}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                {LANGUAGES.find(l => l.code === lang)?.native ?? 'English'}
                <svg className="w-2.5 h-2.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-0.5 bg-white border border-bis-border rounded-xl shadow-xl w-48 z-50 overflow-hidden">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        lang === l.code
                          ? 'bg-bis-blue-light text-bis-blue font-semibold'
                          : 'text-bis-text hover:bg-bis-surface'
                      }`}
                    >
                      <span>{l.native}</span>
                      {lang === l.code && (
                        <svg className="w-3.5 h-3.5 text-bis-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-white/15 mx-0.5"/>
            <Link to="/help" className="px-2.5 h-8 flex items-center text-white/70 hover:text-white transition-colors">{t.nav.help}</Link>
            <div className="w-px h-4 bg-white/15 mx-0.5"/>
            <Link to="/contact" className="px-2.5 h-8 flex items-center text-white/70 hover:text-white transition-colors hidden sm:flex">{t.nav.contact}</Link>
          </div>
        </div>
      </div>

      {/* ── Brand bar ───────────────────────────────── */}
      <div className="bg-bis-navy">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="Bureau of Indian Standards — Home">
            <div className="w-9 h-9 bg-white rounded flex items-center justify-center shadow-sm flex-shrink-0">
              <div className="flex flex-col items-center gap-[2px]">
                <div className="w-7 h-[3px] bg-bis-navy rounded-[1px]"/>
                <div className="text-bis-navy font-black text-[11px] leading-none tracking-tight">BIS</div>
                <div className="w-7 h-[2px] bg-bis-gold rounded-[1px]"/>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[13px] text-white leading-tight group-hover:text-white/90 transition-colors">
                Bureau of Indian Standards
              </div>
              <div className="text-[10px] text-white/50 leading-tight">भारतीय मानक ब्यूरो</div>
            </div>
          </Link>

          {/* Desktop: notification + search + CTA */}
          <div className="hidden md:flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t.nav.search}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(p => !p); setLangOpen(false); setAccessOpen(false); }}
                className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`${t.nav.notifications}${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}`}
                aria-expanded={notifOpen}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-bis-gold rounded-full"/>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-bis-border rounded-xl shadow-2xl w-80 z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-bis-border">
                    <h3 className="text-sm font-semibold text-bis-text">{t.nav.notifications}</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-bis-blue hover:text-bis-navy transition-colors">
                        {t.nav.markAllRead}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-bis-border last:border-0 transition-colors hover:bg-bis-surface ${!n.read ? 'bg-bis-blue-pale' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-bis-blue' : 'bg-transparent'}`}/>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-bis-text leading-tight">{n.title}</p>
                            <p className="text-xs text-bis-muted mt-0.5 leading-relaxed">{n.body}</p>
                            <p className="text-[10px] text-bis-muted-light mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center text-sm text-bis-muted">{t.nav.noNotifications}</div>
                    )}
                  </div>
                  <div className="px-4 py-2.5 border-t border-bis-border">
                    <button className="text-xs text-bis-blue hover:text-bis-navy transition-colors w-full text-center">
                      {t.nav.viewAll}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20 mx-1"/>

            {/* BIS Assistant CTA */}
            <Link
              to="/assistant"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === '/assistant'
                  ? 'bg-bis-gold text-white shadow-sm shadow-amber-900/20'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/25 hover:border-white/40'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
              {t.nav.askAssistant}
            </Link>
          </div>

          {/* Mobile: compact controls */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t.nav.search}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(p => !p)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop nav bar ─────────────────────────── */}
      <div className="bg-white border-b border-bis-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive(item.path)
                    ? 'text-bis-navy after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-bis-navy after:rounded-t-full'
                    : 'text-bis-muted hover:text-bis-text'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-bis-border shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-0.5" aria-label="Mobile navigation">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-bis-navy bg-bis-blue-light'
                    : 'text-bis-muted hover:text-bis-text hover:bg-bis-surface'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-bis-border my-1.5"/>
            <Link
              to="/assistant"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-bis-gold rounded-lg hover:bg-bis-gold-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>
              {t.nav.askAssistant}
            </Link>
            <Link
              to="/compliance"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-bis-muted rounded-lg hover:bg-bis-surface transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {t.nav.checkRequirements}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
