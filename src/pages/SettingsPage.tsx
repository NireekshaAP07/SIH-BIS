import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ standards: true, reports: true, updates: false });
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-white/70">Manage your preferences and account settings.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <Card className="p-5">
          <h2 className="font-semibold text-bis-text mb-4">Language</h2>
          <div className="grid grid-cols-2 gap-2">
            {[{ code: 'en', label: 'English', active: true }, { code: 'hi', label: 'हिंदी', active: false }, { code: 'kn', label: 'ಕನ್ನಡ', active: false }].map(l => (
              <button key={l.code} className={`p-3 rounded-lg border text-sm font-medium transition-all ${l.active ? 'bg-bis-navy text-white border-bis-navy' : 'border-bis-border text-bis-muted hover:border-bis-blue'}`}>
                {l.label}
                {!l.active && <span className="ml-2 text-xs opacity-60">Coming soon</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-bis-text mb-4">Accessibility</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-bis-border">
              <div>
                <div className="text-sm font-medium text-bis-text">High contrast mode</div>
                <div className="text-xs text-bis-muted">Increases text and border contrast</div>
              </div>
              <button
                onClick={() => setHighContrast(p => !p)}
                className={`relative w-10 h-5 rounded-full transition-colors ${highContrast ? 'bg-bis-navy' : 'bg-bis-border'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-0.5'}`}/>
              </button>
            </div>
            <div className="py-2">
              <div className="text-sm font-medium text-bis-text mb-2">Text size</div>
              <div className="flex gap-2">
                {['Normal', 'Large', 'Larger'].map(s => (
                  <button key={s} className="flex-1 py-1.5 border border-bis-border rounded text-sm text-bis-muted hover:border-bis-blue transition-colors">{s}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-bis-text mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {[
              { key: 'standards' as const, label: 'Standard updates', desc: 'When saved standards are revised or updated' },
              { key: 'reports' as const, label: 'Report ready', desc: 'When a compliance summary is generated' },
              { key: 'updates' as const, label: 'BIS service updates', desc: 'General BIS service announcements' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-2 border-b border-bis-border last:border-0">
                <div>
                  <div className="text-sm font-medium text-bis-text">{n.label}</div>
                  <div className="text-xs text-bis-muted">{n.desc}</div>
                </div>
                <button
                  onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${notifications[n.key] ? 'bg-bis-navy' : 'bg-bis-border'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`}/>
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-bis-text mb-4">Data & Privacy</h2>
          <div className="space-y-2">
            <Button variant="secondary" size="sm" className="w-full justify-start">Clear chat history</Button>
            <Button variant="secondary" size="sm" className="w-full justify-start">Export my data</Button>
            <Button variant="destructive" size="sm" className="w-full justify-start">Delete all saved standards</Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-bis-text mb-2">About BIS Assistant</h2>
          <p className="text-sm text-bis-muted leading-relaxed mb-3">
            The BIS Assistant provides AI-assisted access to information on Indian Standards and BIS services. It is an information tool and does not constitute official legal or compliance advice.
          </p>
          <div className="text-xs text-bis-muted space-y-1">
            <p>Version: [Placeholder]</p>
            <p>Information current as of: [Refer to source documents]</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
