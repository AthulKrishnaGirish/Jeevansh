import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Users,
  Building2,
  Info
} from 'lucide-react';
import { DonorCard } from '../components/DonorCard';
import { BloodGroup } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { runMatchingEngine } from '../utils/matchingEngine';

export const MatchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { donors, requests, matches, sendMatchRequest, createBloodRequest } = useData();
  const { user, openAuthModal, loginAsDemoDoctor } = useAuth();

  const bloodGroup = (searchParams.get('blood') || 'O+') as BloodGroup;
  const district = searchParams.get('district') || 'Ernakulam';
  const allowCompatible = searchParams.get('compat') !== 'false';
  const expandNeighboring = searchParams.get('neighbor') !== 'false';
  const requestIdParam = searchParams.get('requestId');
  const hospitalParam = searchParams.get('hospital') || 'Aster Medcity, Kochi';

  const [activeTab, setActiveTab] = useState<'exact' | 'compatible' | 'neighboring' | 'cooldown'>('exact');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Run matching engine
  const results = runMatchingEngine(donors, {
    bloodGroup,
    district,
    allowCompatible,
    expandToNeighboring: expandNeighboring
  });

  // Check which donors have already been sent match requests
  const activeRequestId =
    requestIdParam ||
    requests.find(r => r.bloodGroup === bloodGroup && r.district === district)?.id ||
    'req-demo-1';

  const currentRequestMatches = matches.filter(m => m.requestId === activeRequestId);

  const handleRequestMatch = (donorId: string) => {
    // If user is not logged in, prompt or auto-login as demo doctor
    if (!user) {
      if (window.confirm('To send official blood match requests, log in as Demo Doctor (Dr. Lakshmi Mohan)?')) {
        loginAsDemoDoctor();
      } else {
        openAuthModal('requester');
        return;
      }
    }

    try {
      let targetReqId = activeRequestId;
      if (!requests.some(r => r.id === targetReqId)) {
        // Create request first
        const newReq = createBloodRequest({
          requesterId: user ? user.id : 'user-doctor-1',
          requesterName: user ? user.name : 'Dr. Lakshmi Mohan',
          requesterPhone: user?.phone || '+91 98470 44332',
          patientName: 'Emergency Inpatient Case',
          hospitalName: hospitalParam,
          bloodGroup,
          district,
          unitsRequired: 1,
          urgency: 'emergency',
          requiredDate: new Date().toISOString().split('T')[0],
          notes: 'Auto-dispatched match request via Jeevansh platform'
        });
        targetReqId = newReq.id;
      }

      sendMatchRequest(targetReqId, donorId);
      setToastMessage('Match request sent securely! Donor has been notified without exposing contact info.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border border-emerald-500/50 bg-emerald-950/80 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header with Search Parameters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/20 pb-6">
        <div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Search Filters
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-700/30">
              {bloodGroup}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Matching Donors for {district} District
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Hospital: <span className="text-white font-semibold">{hospitalParam}</span> • Kerala
              </p>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/requests"
            className="px-4 py-2 text-xs font-bold rounded-xl glass-card text-zinc-300 hover:text-white flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-red-400" />
            Doctor Dashboard
          </Link>
          <Link
            to="/donor-dashboard"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            Donor Portal
          </Link>
        </div>
      </div>

      {/* Metric Breakdown Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-card border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[11px] font-semibold uppercase text-emerald-400 block">
            Exact District Matches
          </span>
          <span className="text-2xl font-black text-white">
            {results.eligibleDirectMatches.length}
          </span>
          <p className="text-[10px] text-zinc-400 mt-0.5">Safe & Ready Now</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border-blue-500/30 bg-blue-950/20">
          <span className="text-[11px] font-semibold uppercase text-blue-400 block">
            Compatible Donors
          </span>
          <span className="text-2xl font-black text-white">
            {results.eligibleCompatibleMatches.length}
          </span>
          <p className="text-[10px] text-zinc-400 mt-0.5">Universal Cross-types</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border-purple-500/30 bg-purple-950/20">
          <span className="text-[11px] font-semibold uppercase text-purple-400 block">
            Neighboring District
          </span>
          <span className="text-2xl font-black text-white">
            {results.eligibleNeighboringMatches.length}
          </span>
          <p className="text-[10px] text-zinc-400 mt-0.5">Adjacent Coverage</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border-amber-500/30 bg-amber-950/20">
          <span className="text-[11px] font-semibold uppercase text-amber-400 block">
            Spared from Spam
          </span>
          <span className="text-2xl font-black text-white">
            {results.cooldownDonors.length}
          </span>
          <p className="text-[10px] text-zinc-400 mt-0.5">In Cooldown Interval</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-red-500/20 pb-3">
        <button
          onClick={() => setActiveTab('exact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'exact'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'glass-card text-zinc-400 hover:text-white'
          }`}
        >
          <span>Exact Matches ({results.eligibleDirectMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compatible')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'compatible'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'glass-card text-zinc-400 hover:text-white'
          }`}
        >
          <span>Compatible Types ({results.eligibleCompatibleMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('neighboring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'neighboring'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'glass-card text-zinc-400 hover:text-white'
          }`}
        >
          <span>Adjacent Districts ({results.eligibleNeighboringMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cooldown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'cooldown'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'glass-card text-zinc-400 hover:text-white'
          }`}
        >
          <span>🛡️ Spared in Cooldown ({results.cooldownDonors.length})</span>
        </button>
      </div>

      {/* Main Results Grid */}
      {activeTab === 'exact' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Showing verified {bloodGroup} donors residing within {district} who have cleared the donation interval.
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <Lock className="w-3.5 h-3.5" />
              Contacts protected until acceptance
            </span>
          </div>

          {results.eligibleDirectMatches.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center border border-red-500/20">
              <Users className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Exact Matches in {district}</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Check the <strong>Compatible Types</strong> tab or <strong>Adjacent Districts</strong> tab to view universal O- donors or nearby donors in neighboring districts!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.eligibleDirectMatches.map(item => {
                const matchReq = currentRequestMatches.find(m => m.donorId === item.donor.id);
                const isAccepted = matchReq?.status === 'accepted' || matchReq?.status === 'completed';
                const hasPending = matchReq?.status === 'pending';

                return (
                  <DonorCard
                    key={item.donor.id}
                    donor={item.donor}
                    eligibility={item.eligibility}
                    isAccepted={isAccepted}
                    hasPendingRequest={hasPending}
                    onRequestMatch={handleRequestMatch}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'compatible' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              These donors have compatible red blood cell types (such as universal O- for any patient). They can safely donate to {bloodGroup} patients in emergency scenarios.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.eligibleCompatibleMatches.map(item => {
              const matchReq = currentRequestMatches.find(m => m.donorId === item.donor.id);
              const isAccepted = matchReq?.status === 'accepted' || matchReq?.status === 'completed';
              const hasPending = matchReq?.status === 'pending';

              return (
                <DonorCard
                  key={item.donor.id}
                  donor={item.donor}
                  eligibility={item.eligibility}
                  isAccepted={isAccepted}
                  hasPendingRequest={hasPending}
                  onRequestMatch={handleRequestMatch}
                />
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'neighboring' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              Donors in districts immediately adjacent to {district}. Quick transit times (under 1–2 hours) for critical surgeries.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.eligibleNeighboringMatches.map(item => {
              const matchReq = currentRequestMatches.find(m => m.donorId === item.donor.id);
              const isAccepted = matchReq?.status === 'accepted' || matchReq?.status === 'completed';
              const hasPending = matchReq?.status === 'pending';

              return (
                <DonorCard
                  key={item.donor.id}
                  donor={item.donor}
                  eligibility={item.eligibility}
                  isAccepted={isAccepted}
                  hasPendingRequest={hasPending}
                  onRequestMatch={handleRequestMatch}
                />
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'cooldown' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              SC-12 Interval Protection in Action
            </div>
            <p className="leading-relaxed text-zinc-300">
              On traditional WhatsApp groups, all {results.cooldownDonors.length} of these donors would have received repeated, stressful broadcast notifications despite having donated recently. Jeevansh respects the <strong className="text-white">90-day (Male)</strong> and <strong className="text-white">120-day (Female)</strong> interval so they are not disturbed until medically safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.cooldownDonors.map(({ donor, eligibility }) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                eligibility={eligibility}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
