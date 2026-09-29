import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import HomePage from './pages/HomePage';
import AssistantPage from './pages/AssistantPage';
import StandardsPage from './pages/StandardsPage';
import StandardDetailPage from './pages/StandardDetailPage';
import CertificationPage from './pages/CertificationPage';
import TestingPage from './pages/TestingPage';
import HallmarkingPage from './pages/HallmarkingPage';
import ConsumerServicesPage from './pages/ConsumerServicesPage';
import ResourcesPage from './pages/ResourcesPage';
import WorkflowPage from './pages/WorkflowPage';
import CompliancePage from './pages/CompliancePage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import SearchPage from './pages/SearchPage';

function AppLayout() {
  const location = useLocation();
  const isAssistant = location.pathname === '/assistant';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className={`flex-1 ${isAssistant ? '' : 'pb-16 md:pb-0'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/standards/detail" element={<StandardDetailPage />} />
          <Route path="/certification" element={<CertificationPage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/hallmarking" element={<HallmarkingPage />} />
          <Route path="/consumer" element={<ConsumerServicesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAssistant && <Footer />}
      <MobileNav />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-bold text-bis-border mb-4">404</div>
      <h1 className="text-2xl font-bold text-bis-text mb-2">Page not found</h1>
      <p className="text-bis-muted mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-5 py-2.5 bg-bis-navy text-white rounded-lg text-sm font-medium hover:bg-bis-navy-dark transition-colors">
        Return to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
