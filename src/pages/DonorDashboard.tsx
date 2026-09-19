import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Power,
  Calendar,
  Award,
  Bell,
  MapPin,
  Phone,
  Droplets,
  AlertTriangle,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { RequestCard } from '../components/RequestCard';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { checkDonorEligibility } from '../utils/intervalChecker';
import { generateDonorCode } from '../utils/privacyManager';

export const DonorDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { donors, matches, toggleDonorAvailability, respondToMatch, recordDonationCompletion } = useData();
  const { user, loginAsDemoDonor } = useAuth();

  const [toastMessage, setToastMessage] = useState<string | null>(
    searchParams.get('welcome') ? 'Welcome to Jeevansh! Your donor profile is active and privacy-protected.' : null
  );

  // Identify the donor to show
  // If user is logged in as a donor with donorProfileId, use that; else check if newId query param exists; else default to primary demo donor
  const targetDonorId =
    (user?.role === 'donor' && user.donorProfileId) ||
    searchParams.get('newId') ||
    'donor-demo-1';

  const currentDonor = donors.find(d => d.id === targetDonorId) || donors[0];
  const donorCode = generateDonorCode(currentDonor.id);

  // Incoming matches for this donor
  const donorMatches = matches.filter(m => m.donorId === currentDonor.id);
  const pendingMatches = donorMatches.filter(m => m.status === 'pending');
  const acceptedMatches = donorMatches.filter(m => m.status === 'accepted');
  const pastMatches = donorMatches.filter(m => m.status === 'declined' || m.status === 'completed');

  // Compute eligibility
  const eligibility = checkDonorEligibility(currentDonor);

  const handleToggle = () => {
    toggleDonorAvailability(currentDonor.id);
    setToastMessage(
      !currentDonor.isAvailable
        ? 'Availability turned ON: You are now eligible to receive targeted match requests.'
        : 'Availability PAUSED: You will not receive any match notifications until re-enabled.'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAccept = (matchId: string) => {
    respondToMatch(matchId, 'accepted');
    setToastMessage('Match ACCEPTED! Your verified contact phone number has been unlocked for the hospital.');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleDecline = (matchId: string) => {
    respondToMatch(matchId, 'declined');
    setToastMessage('Request declined. Your contact details remain 100% private.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleComplete = (matchId: string) => {
    recordDonationCompletion(matchId);
    setToastMessage('Donation marked COMPLETED! Cooldown interval updated and +3 lives saved recorded.');
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border border-red-500/50 bg-red-950/90 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Switch to Arjun Demo Donor Button if not active */}
      {currentDonor.id !== 'donor-demo-1' && (
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-between text-xs">
          <span className="text-zinc-300">
            Evaluating the demo? Switch to primary demo donor Arjun Nair (has pending request to accept/reject):
          </span>
          <button
            onClick={loginAsDemoDonor}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
          >
            Switch to Demo Donor
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/25 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-red-700/40 border border-red-400/30">
              {currentDonor.bloodGroup}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentDonor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-600/30 text-red-300 border border-red-500/30">
                  {donorCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Donor
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {currentDonor.district} District, Kerala
                </span>
                <span>•</span>
                <span>{currentDonor.gender === 'female' ? 'Female' : 'Male'}, {currentDonor.age} Years</span>
                <span>•</span>
                <span>Weight: {currentDonor.weight} kg</span>
              </div>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-red-500/20 self-start md:self-auto">
            <div>
              <span className="text-xs font-bold text-white block">
                Availability Status
              </span>
              <span className="text-[11px] text-zinc-400 block">
                {currentDonor.isAvailable ? 'Active — Receiving Requests' : 'Paused — No Requests'}
              </span>
            </div>

            <button
              onClick={handleToggle}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentDonor.isAvailable
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
              id="donor-availability-toggle"
            >
              <Power className="w-4 h-4" />
              <span>{currentDonor.isAvailable ? 'ACTIVE' : 'PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-red-500/15 text-center">
          <div className="p-3 rounded-xl bg-black/30">
            <span className="text-xs text-zinc-400 block">Total Donations</span>
            <span className="text-xl font-black text-white">{currentDonor.totalDonations}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30">
            <span className="text-xs text-zinc-400 block">Estimated Lives Saved</span>
            <span className="text-xl font-black text-emerald-400">{currentDonor.livesSaved}</span>
          </div>
          <div className="p-3 rounded-xl bg-black/30">
            <span className="text-xs text-zinc-400 block">Last Donated</span>
            <span className="text-xs font-mono font-bold text-white mt-1 block">
              {currentDonor.lastDonationDate || 'First-Time'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/30">
            <span className="text-xs text-zinc-400 block">Interval Status</span>
            <span className="text-xs font-bold text-red-400 mt-1 block">
              {eligibility.isEligible ? 'Eligible Now ✅' : `${eligibility.daysRemaining}d Cooldown ⏳`}
            </span>
          </div>
        </div>
      </div>

      {/* Safe Donation Interval Countdown Panel */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-red-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Medical Donation Interval Cooldown
              </h3>
              <p className="text-xs text-zinc-400">
                Medical regulation: 90 days for males, 120 days for females
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              eligibility.isEligible
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {eligibility.isEligible ? 'Interval Cleared' : 'In Cooldown'}
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            eligibility.isEligible
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-amber-950/20 border-amber-500/30'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-white">
                {eligibility.reason}
              </p>
              {!eligibility.isEligible && (
                <p className="text-xs text-zinc-400 mt-1">
                  Next eligible date: <strong className="text-white">{eligibility.nextEligibleDate}</strong>
                </p>
              )}
            </div>

            {!eligibility.isEligible && (
              <div className="text-right font-mono text-xl font-black text-amber-400">
                {eligibility.daysRemaining} Days Remaining
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Incoming Requests Section (Crucial SC-12 Acceptance Flow) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Incoming Match Requests ({donorMatches.length})
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Accepting an emergency request releases your phone number to the hospital doctor.
          </span>
        </div>

        {donorMatches.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center border border-red-500/20">
            <HeartHandshake className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No Match Requests at this moment</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Your profile is on standby. As soon as a hospital in {currentDonor.district} requires {currentDonor.bloodGroup}, you will be privately notified here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donorMatches.map(m => (
              <RequestCard
                key={m.id}
                match={m}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
