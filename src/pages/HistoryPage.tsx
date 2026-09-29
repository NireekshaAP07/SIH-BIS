import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge, Card, Modal, Toast } from '../components/ui';
import { RECENT_QUERIES } from '../data/mockData';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState(RECENT_QUERIES);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleDelete(id: string) {
    setQueries(prev => prev.filter(q => q.id !== id));
    setDeleteModal(null);
    setToast('Query deleted.');
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-bis-surface">
      <div className="bg-bis-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <nav className="text-xs text-white/50 mb-3 flex items-center gap-1">
            <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
            <span>›</span>
            <span className="text-white/80">My Queries</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Queries</h1>
          <p className="text-white/70">Your previous conversations with the BIS Assistant.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {queries.length > 0 ? (
          <div className="space-y-3">
            {queries.map(q => (
              <Card key={q.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-bis-text mb-1">{q.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-bis-muted">{q.date}</span>
                      <Badge label={q.category} variant="blue" />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => navigate('/assistant')}>Open</Button>
                    <Button variant="ghost" size="sm">Rename</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteModal(q.id)}>
                      <svg className="w-4 h-4 text-bis-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-12 h-12 bg-bis-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-bis-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 className="font-semibold text-bis-text mb-2">No query history</h3>
            <p className="text-bis-muted text-sm mb-4">Your previous queries will appear here.</p>
            <Button variant="primary" onClick={() => navigate('/assistant')}>Ask BIS Assistant</Button>
          </div>
        )}
      </div>

      <Modal open={!!deleteModal} title="Delete this query?" onClose={() => setDeleteModal(null)}>
        <p className="text-sm text-bis-muted mb-6">This conversation will be permanently removed from your history.</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteModal && handleDelete(deleteModal)}>Delete</Button>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50">
          <Toast message={toast} type="success" onClose={() => setToast(null)}/>
        </div>
      )}
    </div>
  );
}
