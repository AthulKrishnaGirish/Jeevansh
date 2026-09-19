import React from 'react';
import {
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
  Phone,
  Check,
  X,
  ShieldCheck,
  Award
} from 'lucide-react';
import { MatchRequest } from '../types';

interface RequestCardProps {
  match: MatchRequest;
  onAccept: (matchId: string) => void;
  onDecline: (matchId: string) => void;
  onComplete?: (matchId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  match,
  onAccept,
  onDecline,
  onComplete
}) => {
  const { requestSnapshot, status } = match;

  const isEmergency = requestSnapshot.urgency === 'emergency';
  const isUrgent = requestSnapshot.urgency === 'urgent';

  return (
    <div
      className={`glass-card rounded-2xl p-5 sm:p-6 transition-all ${
        isEmergency
          ? 'border-red-500/50 bg-red-950/20 shadow-xl shadow-red-950/30'
          : 'border-red-500/20'
      }`}
      id={`match-request-card-${match.id}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-700/30">
            {requestSnapshot.bloodGroup}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {requestSnapshot.hospitalName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {requestSnapshot.district}
              </span>
              <span>•</span>
              <span>{requestSnapshot.unitsRequired} Unit(s) Required</span>
            </div>
          </div>
        </div>

        {/* Urgency Badge */}
        <div>
          {isEmergency ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md shadow-red-600/40 red-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              CRITICAL EMERGENCY
            </span>
          ) : isUrgent ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Urgent Request
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
              Standard Request
            </span>
          )}
        </div>
      </div>

      {/* Patient & Requester Snapshot */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/15 space-y-2 mb-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Patient Case:</span>
          <span className="font-semibold text-zinc-200">{requestSnapshot.patientName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Requester:</span>
          <span className="font-semibold text-zinc-200">{requestSnapshot.requesterName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Hospital Contact:</span>
          {status === 'accepted' || status === 'completed' ? (
            <a
              href={`tel:${requestSnapshot.requesterPhone}`}
              className="font-mono text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <Phone className="w-3 h-3" />
              {requestSnapshot.requesterPhone}
            </a>
          ) : (
            <span className="text-zinc-400 font-mono">🔒 Unlocks upon acceptance</span>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-4 text-[11px] text-zinc-400 flex items-center gap-1.5 bg-red-950/30 p-2 rounded-lg border border-red-500/20">
        <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
        <span>
          {status === 'accepted'
            ? '✅ You accepted this request. Your contact number was securely shared with the requester.'
            : '🔒 Your phone & name remain 100% hidden unless you tap Accept Match.'}
        </span>
      </div>

      {/* Actions */}
      <div>
        {status === 'pending' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onAccept(match.id)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
              id={`accept-match-btn-${match.id}`}
            >
              <Check className="w-4 h-4" />
              Accept Match & Share Contact
            </button>
            <button
              onClick={() => onDecline(match.id)}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              id={`decline-match-btn-${match.id}`}
            >
              <X className="w-4 h-4" />
              Decline
            </button>
          </div>
        )}

        {status === 'accepted' && (
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <a
              href={`tel:${requestSnapshot.requesterPhone}`}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/30"
            >
              <Phone className="w-4 h-4" />
              Call Requester: {requestSnapshot.requesterPhone}
            </a>
            {onComplete && (
              <button
                onClick={() => onComplete(match.id)}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-red-600/30 border border-red-500/40 text-red-200 hover:bg-red-600 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Award className="w-4 h-4" />
                Mark Donation Completed
              </button>
            )}
          </div>
        )}

        {status === 'declined' && (
          <div className="py-2 px-3 rounded-lg bg-zinc-900 text-zinc-500 text-xs text-center font-medium">
            You declined this request. Your contact info was kept private.
          </div>
        )}

        {status === 'completed' && (
          <div className="py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs text-center font-semibold flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Donation Successfully Completed! +3 Lives Saved recorded in your profile.
          </div>
        )}
      </div>
    </div>
  );
};
