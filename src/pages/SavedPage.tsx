import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Toast } from '../components/ui';

export default function SavedPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<{ id: string; number: string; title: string; date: string }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">Saved Standards</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Saved Standards</h1>
          <p className="text-white/70">Indian Standards you have saved for reference.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {saved.length > 0 ? (
          <div className="space-y-3">
            {saved.map(s => (
              <Card key={s.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono font-semibold text-bis-blue mb-1">{s.number}</div>
                    <h3 className="font-medium text-bis-text">{s.title}</h3>
                    <span className="text-xs text-bis-muted">Saved on {s.date}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => navigate('/standards/detail')}>Open</Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSaved(p => p.filter(i => i.id !== s.id));
                      setToast('Standard removed from saved.');
                      setTimeout(() => setToast(null), 3000);
                    }}>Remove</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-bis-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-bis-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
            <h3 className="font-semibold text-bis-text mb-2">No saved standards yet</h3>
            <p className="text-bis-muted text-sm mb-4">Standards you save will appear here for quick access.</p>
            <Button variant="primary" onClick={() => navigate('/standards')}>Explore Standards</Button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
          <Toast message={toast} type="success" onClose={() => setToast(null)}/>
        </div>
      )}
    </div>
  );
}
