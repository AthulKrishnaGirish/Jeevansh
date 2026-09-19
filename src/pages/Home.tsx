import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets,
  Search,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Activity,
  MapPin,
  Sparkles,
  Lock
} from 'lucide-react';
import { StatsBar } from '../components/StatsBar';
import { ALL_BLOOD_GROUPS, BLOOD_COMPATIBILITY_MAP } from '../data/bloodGroups';
import { DISTRICT_NAMES } from '../data/districts';
import { BloodGroup } from '../types';
import { useData } from '../context/DataContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { requests } = useData();
  const [selectedBlood, setSelectedBlood] = useState<BloodGroup>('O+');
  const [selectedDistrict, setSelectedDistrict] = useState('Ernakulam');

  // Find any active emergency request for the top banner
  const emergencyReq = requests.find(r => r.urgency === 'emergency' && r.status === 'open');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/matches?blood=${encodeURIComponent(selectedBlood)}&district=${encodeURIComponent(selectedDistrict)}`);
  };

  const currentCompat = BLOOD_COMPATIBILITY_MAP[selectedBlood];

  return (
    <div className="min-h-screen space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Emergency Active Alert Ticker */}
      {emergencyReq && (
        <div className="glass-card border-red-500/50 bg-red-950/30 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 red-glow">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-red-600 text-white red-pulse">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  Active Emergency Request
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-red-600/40 text-red-200 rounded">
                  {emergencyReq.bloodGroup} Needed
                </span>
              </div>
              <p className="text-xs text-white font-medium">
                {emergencyReq.hospitalName} ({emergencyReq.district}) requires {emergencyReq.unitsRequired} unit(s)
              </p>
            </div>
          </div>
          <Link
            to={`/matches?blood=${encodeURIComponent(emergencyReq.bloodGroup)}&district=${encodeURIComponent(emergencyReq.district)}`}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/40 whitespace-nowrap transition-all"
          >
            View Matching Donors →
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative text-center pt-6 sm:pt-12 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 mb-6 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          <span>Solving SC-12: Broad WhatsApp Request Spam</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Every Drop Counts. <br className="hidden sm:inline" />
          <span className="red-gradient-text">Zero Unnecessary Disturbance.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Broad WhatsApp broadcasts reach the wrong people and repeatedly disturb ineligible donors.
          Jeevansh matches requests by <strong className="text-white">blood group</strong>, <strong className="text-white">district</strong>, and <strong className="text-white">donation intervals</strong>, keeping contact numbers <strong className="text-white">private until accepted</strong>.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <Link
            to="/search"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all group"
            id="hero-find-donor-btn"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Find Matching Donors
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm border border-red-500/30 flex items-center justify-center gap-2 transition-all"
            id="hero-register-btn"
          >
            <UserPlus className="w-4 h-4 text-red-400" />
            Register as Donor
          </Link>
        </div>

        {/* Quick Search Card */}
        <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-500/25 relative text-left">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick District Match Finder
            </h3>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Required Blood Group
              </label>
              <select
                value={selectedBlood}
                onChange={e => setSelectedBlood(e.target.value as BloodGroup)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-bold text-red-400 focus:text-white"
              >
                {ALL_BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg} className="bg-[#12080c] text-white">
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Patient District (Kerala)
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-zinc-200"
              >
                {DISTRICT_NAMES.map(d => (
                  <option key={d} value={d} className="bg-[#12080c] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all h-[42px]"
                id="quick-match-submit-btn"
              >
                <Search className="w-4 h-4" />
                Run Smart Match
              </button>
            </div>
          </form>

          <p className="text-[11px] text-zinc-400 mt-3 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-red-400" />
            Contact phone numbers remain masked until matched donors accept.
          </p>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section>
        <StatsBar />
      </section>

      {/* 3-Pillar Solution for SC-12 */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Jeevansh Solves <span className="text-red-400">SC-12</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Moving Kerala from chaotic WhatsApp message forwards to privacy-guaranteed medical matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 text-lg font-black font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              District Proximity Filtering
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Requests are matched strictly within the patient's district, with optional adjacent district fallback. Donors 200km away are never bothered.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-red-500/15 text-xs text-zinc-300 space-y-1">
              <span className="font-semibold text-red-400 block">WhatsApp Defect:</span>
              <span>Messages forwarded into state-wide groups disturb donors in Kasaragod for a patient in Trivandrum.</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 text-lg font-black font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Donation Interval Rules
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Automated medical cooldown enforcement: <strong className="text-zinc-200">90 days for men</strong> and <strong className="text-zinc-200">120 days for women</strong>. Ineligible donors are systematically spared.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/15 text-xs text-zinc-300 space-y-1">
              <span className="font-semibold text-amber-400 block">WhatsApp Defect:</span>
              <span>Recent donors who donated 2 weeks ago get bombarded with phone calls they medically cannot fulfill.</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 text-lg font-black font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              100% Privacy Lock
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Donor phone numbers and real names are masked. When a hospital requests a match, contact info is released <strong className="text-emerald-300">only if the donor accepts</strong>.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/15 text-xs text-zinc-300 space-y-1">
              <span className="font-semibold text-emerald-400 block">WhatsApp Defect:</span>
              <span>Publicly broadcasting phone numbers leads to spam calls, harassment, and list scraping.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Blood Compatibility Matrix */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 border border-red-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Blood Group Compatibility Matrix
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Tap any blood group to preview who they can give to and receive from in emergency matching
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_BLOOD_GROUPS.map(bg => (
              <button
                key={bg}
                onClick={() => setSelectedBlood(bg)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  selectedBlood === bg
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105'
                    : 'bg-black/40 text-zinc-400 hover:text-white border border-red-500/20'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blood summary card */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-red-600/30 mb-4">
                {selectedBlood}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Type {selectedBlood}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {currentCompat?.description}
              </p>
            </div>

            {currentCompat?.isUniversalDonor && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                🌟 Universal Red Blood Cell Donor! Can save any patient in an emergency.
              </div>
            )}
            {currentCompat?.isUniversalRecipient && (
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-semibold">
                🌟 Universal Recipient! Can receive blood from any donor group.
              </div>
            )}
          </div>

          {/* Can Donate To */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/20">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Can Donate To ({currentCompat?.canDonateTo.length} Types)
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentCompat?.canDonateTo.map(bg => (
                <span
                  key={bg}
                  className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm font-bold"
                >
                  {bg}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-4">
              Jeevansh automatically prioritizes exact matches, then suggests these compatible donors if urgent.
            </p>
          </div>

          {/* Can Receive From */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/20">
            <h5 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              Can Receive From ({currentCompat?.canReceiveFrom.length} Types)
            </h5>
            <div className="flex flex-wrap gap-2">
              {currentCompat?.canReceiveFrom.map(bg => (
                <span
                  key={bg}
                  className="px-3 py-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 text-sm font-bold"
                >
                  {bg}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-4">
              Hospitals can cross-match with any of these compatible groups if exact stocks are unavailable.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-red-500/30 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Protect Lives with <span className="red-gradient-text">Zero Noise?</span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Whether you are a hospital doctor needing an urgent blood match or a voluntary donor wanting to donate responsibly, Jeevansh is built for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/search"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/40 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search by District
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10"
            >
              Register as Protected Donor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
