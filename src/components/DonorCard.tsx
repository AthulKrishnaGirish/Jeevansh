import React from 'react';
import {
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Donor, EligibilityResult } from '../types';
import { getDonorPrivacyView } from '../utils/privacyManager';

interface DonorCardProps {
  donor: Donor;
  eligibility?: EligibilityResult;
  isAccepted?: boolean;
  hasPendingRequest?: boolean;
  onRequestMatch?: (donorId: string) => void;
  showActions?: boolean;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  eligibility,
  isAccepted = false,
  hasPendingRequest = false,
  onRequestMatch,
  showActions = true
}) => {
  const privacyView = getDonorPrivacyView(donor, isAccepted);

  const isEligible = eligibility ? eligibility.isEligible : donor.isAvailable;

  return (
    <div
      className={`glass-card-hover rounded-2xl p-5 relative overflow-hidden transition-all ${
        isAccepted
          ? 'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/20'
          : hasPendingRequest
          ? 'border-amber-500/40 bg-amber-950/20'
          : 'hover:border-red-500/50'
      }`}
      id={`donor-card-${donor.id}`}
    >
      {/* Top Bar: Blood Group + Privacy Status Badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-700/30 border border-red-400/40">
            {donor.bloodGroup}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">
                {privacyView.displayName}
              </h4>
              {isAccepted && (
                <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Contact Unlocked">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {donor.district}
              </span>
              <span>•</span>
              <span>{donor.gender === 'female' ? 'Female' : 'Male'}, {donor.age}y</span>
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div>
          {isAccepted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Unlock className="w-3.5 h-3.5" />
              Accepted & Unlocked
            </span>
          ) : hasPendingRequest ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Request Pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/60 text-red-300 border border-red-500/30">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Contact Protected
            </span>
          )}
        </div>
      </div>

      {/* Interval / Eligibility Diagnostic Banner */}
      <div className="mb-4">
        {eligibility && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              eligibility.isEligible
                ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/30 border border-amber-500/30 text-amber-300'
            }`}
          >
            {eligibility.isEligible ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{eligibility.reason}</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-semibold">{eligibility.reason}</span>
                  <span className="block text-[10px] text-zinc-400">
                    Next safe date: {eligibility.nextEligibleDate}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contact Details Panel (Strict Privacy Control) */}
      <div className="space-y-2 py-3 px-3.5 rounded-xl bg-black/40 border border-red-500/15 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-red-400" />
            Phone:
          </span>
          {isAccepted ? (
            <a
              href={`tel:${donor.phone}`}
              className="font-mono font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              {donor.phone}
            </a>
          ) : (
            <span className="font-mono text-zinc-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-red-400" />
              {privacyView.phone}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-red-400" />
            Email:
          </span>
          {isAccepted ? (
            <a
              href={`mailto:${donor.email}`}
              className="font-mono text-emerald-400 hover:text-emerald-300"
            >
              {donor.email}
            </a>
          ) : (
            <span className="font-mono text-zinc-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-red-400" />
              {privacyView.email}
            </span>
          )}
        </div>
      </div>

      {/* Donor Track Record Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-400 border-t border-red-500/10 pt-3 mb-4">
        <div>
          <span className="block text-sm font-bold text-white">{donor.totalDonations}</span>
          <span className="text-[10px]">Donations</span>
        </div>
        <div>
          <span className="block text-sm font-bold text-white">{donor.livesSaved}</span>
          <span className="text-[10px]">Lives Saved</span>
        </div>
        <div>
          <span className="block text-sm font-bold text-white">{donor.rating || 4.9} ★</span>
          <span className="text-[10px]">Reliability</span>
        </div>
      </div>

      {/* Action Button */}
      {showActions && (
        <div>
          {isAccepted ? (
            <a
              href={`tel:${donor.phone}`}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Phone className="w-4 h-4" />
              Call Unlocked Donor Directly
            </a>
          ) : hasPendingRequest ? (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              Waiting for Donor Acceptance
            </button>
          ) : (
            <button
              onClick={() => onRequestMatch && onRequestMatch(donor.id)}
              disabled={!isEligible}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isEligible
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              {isEligible ? 'Request Blood Match' : 'Ineligible for Request'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
