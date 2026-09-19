import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
  Users,
  ChevronRight,
  Info
} from 'lucide-react';
import { ALL_BLOOD_GROUPS } from '../data/bloodGroups';
import { DISTRICT_NAMES, KERALA_DISTRICTS } from '../data/districts';
import { BloodGroup, UrgencyLevel } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { runMatchingEngine } from '../utils/matchingEngine';

export const SearchDonor: React.FC = () => {
  const navigate = useNavigate();
  const { donors, createBloodRequest } = useData();
  const { user, openAuthModal } = useAuth();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [district, setDistrict] = useState('Ernakulam');
  const [urgency, setUrgency] = useState<UrgencyLevel>('emergency');
  const [hospitalName, setHospitalName] = useState('Aster Medcity, Kochi');
  const [patientName, setPatientName] = useState('Critical Care Patient');
  const [unitsRequired, setUnitsRequired] = useState(1);
  const [allowCompatible, setAllowCompatible] = useState(true);
  const [expandNeighboring, setExpandNeighboring] = useState(true);

  // Run live matching preview
  const liveMatchResults = runMatchingEngine(donors, {
    bloodGroup,
    district,
    allowCompatible,
    expandToNeighboring: expandNeighboring
  });

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // If user is doctor/requester and provides patient info, create request entry
    if (user) {
      const newReq = createBloodRequest({
        requesterId: user.id,
        requesterName: user.name,
        requesterPhone: user.phone || '+91 98470 44332',
        patientName,
        hospitalName,
        bloodGroup,
        district,
        unitsRequired,
        urgency,
        requiredDate: new Date().toISOString().split('T')[0],
        notes: `Urgent match search initiated for ${hospitalName}`
      });

      navigate(
        `/matches?requestId=${newReq.id}&blood=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(
          district
        )}&compat=${allowCompatible}&neighbor=${expandNeighboring}`
      );
    } else {
      // Unauthenticated search allowed directly!
      navigate(
        `/matches?blood=${encodeURIComponent(bloodGroup)}&district=${encodeURIComponent(
          district
        )}&compat=${allowCompatible}&neighbor=${expandNeighboring}&hospital=${encodeURIComponent(hospitalName)}`
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 mb-3">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          Targeted Kerala District Search
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find Eligible Donors
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Filtered by blood group compatibility, district proximity, and safe medical donation intervals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/25">
          <form onSubmit={handleStartSearch} className="space-y-6">
            {/* Blood Group Picker */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                1. Select Blood Group Needed
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {ALL_BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-3 rounded-xl font-black text-sm transition-all ${
                      bloodGroup === bg
                        ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-600/40 scale-105 border border-red-400'
                        : 'bg-black/40 text-zinc-300 hover:text-white border border-red-500/20 hover:border-red-500/40'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* District & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  2. District (Kerala)
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
                >
                  {DISTRICT_NAMES.map(d => (
                    <option key={d} value={d} className="bg-[#12080c] text-white">
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  3. Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUrgency('emergency')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                      urgency === 'emergency'
                        ? 'bg-red-600 text-white shadow red-pulse'
                        : 'bg-black/40 text-zinc-400 border border-red-500/20'
                    }`}
                  >
                    🚨 Emergency
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                      urgency === 'urgent'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-black/40 text-zinc-400 border border-red-500/20'
                    }`}
                  >
                    ⚡ Urgent
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                      urgency === 'standard'
                        ? 'bg-zinc-700 text-white shadow'
                        : 'bg-black/40 text-zinc-400 border border-red-500/20'
                    }`}
                  >
                    Standard
                  </button>
                </div>
              </div>
            </div>

            {/* Hospital & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-red-400" />
                  Hospital / Medical Center
                </label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  placeholder="e.g. Aster Medcity, Kochi"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Units Required
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={unitsRequired}
                  onChange={e => setUnitsRequired(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Patient Name / Case */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Patient Name / Case Description (Private to hospital until matched)
              </label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. Critical Care ICU / Cardiac Surgery"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              />
            </div>

            {/* Matching Rules Toggles */}
            <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-300 block">
                Smart Algorithm Options
              </span>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowCompatible}
                  onChange={e => setAllowCompatible(e.target.checked)}
                  className="w-4 h-4 rounded border-red-500/40 text-red-600 focus:ring-red-500 bg-black/50"
                />
                <span className="text-xs text-zinc-300">
                  Include compatible universal donor types (e.g. O- for any patient)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={expandNeighboring}
                  onChange={e => setExpandNeighboring(e.target.checked)}
                  className="w-4 h-4 rounded border-red-500/40 text-red-600 focus:ring-red-500 bg-black/50"
                />
                <span className="text-xs text-zinc-300">
                  Include verified donors in adjacent neighboring Kerala districts
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all group"
              id="start-search-submit-btn"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Search & View Anonymized Eligible Donors
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Live Matching Diagnostics Sidepanel (1 Col) */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-red-500/25">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-red-400" />
              Live Matching Diagnostic
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[11px] font-semibold text-emerald-400 block uppercase">
                  Direct Exact Match (Same District)
                </span>
                <span className="text-2xl font-black text-white">
                  {liveMatchResults.eligibleDirectMatches.length} Eligible
                </span>
                <p className="text-[10px] text-emerald-300/80 mt-0.5">
                  Exact {bloodGroup} in {district} who passed interval rule
                </p>
              </div>

              {allowCompatible && (
                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30">
                  <span className="text-[11px] font-semibold text-blue-400 block uppercase">
                    Compatible Cross-Match
                  </span>
                  <span className="text-2xl font-black text-white">
                    {liveMatchResults.eligibleCompatibleMatches.length} Donors
                  </span>
                  <p className="text-[10px] text-blue-300/80 mt-0.5">
                    Safe compatible groups in {district}
                  </p>
                </div>
              )}

              {expandNeighboring && (
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                  <span className="text-[11px] font-semibold text-purple-400 block uppercase">
                    Neighboring Districts
                  </span>
                  <span className="text-2xl font-black text-white">
                    {liveMatchResults.eligibleNeighboringMatches.length} Donors
                  </span>
                  <p className="text-[10px] text-purple-300/80 mt-0.5">
                    Adjacent district proximity fallback
                  </p>
                </div>
              )}

              {/* Spared from spam ticker */}
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <span className="text-[11px] font-semibold text-amber-400 block uppercase">
                  Spared from WhatsApp Spam
                </span>
                <span className="text-2xl font-black text-white">
                  {liveMatchResults.cooldownDonors.length} in Cooldown
                </span>
                <p className="text-[10px] text-amber-300/80 mt-0.5">
                  Would have been harassed on WhatsApp, protected by Jeevansh interval logic
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <Info className="w-4 h-4" />
              Privacy Assurance
            </div>
            <p className="leading-relaxed">
              When you view results, donor contact phone numbers and email addresses remain strictly masked until a donor voluntarily clicks <strong>Accept Match</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
