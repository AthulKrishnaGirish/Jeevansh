import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

// Pages
import { Home } from './pages/Home';
import { SearchDonor } from './pages/SearchDonor';
import { MatchResults } from './pages/MatchResults';
import { DonorRegister } from './pages/DonorRegister';
import { DonorDashboard } from './pages/DonorDashboard';
import { RequestsDashboard } from './pages/RequestsDashboard';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0407] text-zinc-100 selection:bg-red-500 selection:text-white">
      {/* Background ambient lighting effects for glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-red-800/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[150px]" />
      </div>

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchDonor />} />
            <Route path="/matches" element={<MatchResults />} />
            <Route path="/register" element={<DonorRegister />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/requests" element={<RequestsDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />

        {/* Global Auth Modal for Doctor / Donor switcher */}
        <AuthModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
