import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Lock,
  ArrowRight,
  Heart,
  Scale,
  Sparkles
} from 'lucide-react';
import { ALL_BLOOD_GROUPS } from '../data/bloodGroups';
import { DISTRICT_NAMES } from '../data/districts';
import { BloodGroup, Gender } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { checkDonorEligibility } from '../utils/intervalChecker';

export const DonorRegister: React.FC = () => {
  const navigate = useNavigate();
  const { registerDonor } = useData();
  const { openAuthModal } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState<Gender>('male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [district, setDistrict] = useState('Ernakulam');
  const [phone, setPhone] = useState('+91 9');
  const [email, setEmail] = useState('');
  const [hasDonatedBefore, setHasDonatedBefore] = useState(false);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [weight, setWeight] = useState(65);
  const [healthDeclared, setHealthDeclared] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Live interval calculation
  const mockDonor = {
    age,
    weight,
    gender,
    lastDonationDate: hasDonatedBefore ? lastDonationDate : null,
    isAvailable: true,
    healthDeclared
  };
  const liveEligibility = checkDonorEligibility(mockDonor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = registerDonor({
      name,
      age,
      gender,
      bloodGroup,
      district,
      phone,
      email: email || `${phone.replace(/[^0-9]/g, '').slice(-6)}@donor.jeevansh.org`,
      lastDonationDate: hasDonatedBefore && lastDonationDate ? lastDonationDate : null,
      isAvailable: true,
      weight,
      healthDeclared
    });

    // Navigate to donor dashboard
    navigate(`/donor-dashboard?newId=${created.id}&welcome=true`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 mb-3">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          100% Privacy Protected Registration
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Join Jeevansh Donor Network
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Your contact details are strictly hidden. You will only receive targeted requests when you are medically eligible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/25">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Details */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-red-500/20 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-mono">
                  1
                </span>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Athul Girish"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Kerala District of Residence
                  </label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  >
                    {DISTRICT_NAMES.map(d => (
                      <option key={d} value={d} className="bg-[#12080c] text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Mobile Phone (Kept Private 🔒)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98471 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="athul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Blood Group & Gender */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-red-500/20 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-mono">
                  2
                </span>
                Blood Group & Demographics
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Blood Group
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ALL_BLOOD_GROUPS.map(bg => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                          bloodGroup === bg
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/40 scale-105 border border-red-400'
                            : 'bg-black/40 text-zinc-300 hover:text-white border border-red-500/20'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Gender (Sets Safe Interval)
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as Gender)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                    >
                      <option value="male" className="bg-[#12080c] text-white">
                        Male (90 Days Cooldown)
                      </option>
                      <option value="female" className="bg-[#12080c] text-white">
                        Female (120 Days Cooldown)
                      </option>
                      <option value="other" className="bg-[#12080c] text-white">
                        Other (90 Days Cooldown)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min={18}
                      max={65}
                      value={age}
                      onChange={e => setAge(parseInt(e.target.value) || 18)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Weight in Kg (Min 50kg)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={150}
                      value={weight}
                      onChange={e => setWeight(parseInt(e.target.value) || 50)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Medical Donation History */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-red-500/20 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center font-mono">
                  3
                </span>
                Medical Interval Screening
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-semibold text-zinc-300">
                    Have you ever donated blood before?
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHasDonatedBefore(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        !hasDonatedBefore
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-black/30 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      First-Time Donor
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasDonatedBefore(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        hasDonatedBefore
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-black/30 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Yes, previously
                    </button>
                  </div>
                </div>

                {hasDonatedBefore && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Approximate Date of Last Donation
                    </label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={e => setLastDonationDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                      required={hasDonatedBefore}
                    />
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-black/40 border border-red-500/20 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={healthDeclared}
                      onChange={e => setHealthDeclared(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-red-500/40 text-red-600 focus:ring-red-500 bg-black/50"
                    />
                    <span className="text-xs text-zinc-300 leading-relaxed">
                      I declare that I am in good health, have no active chronic cardiovascular/blood disorders, and weigh at least 50 kg.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={e => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-red-500/40 text-red-600 focus:ring-red-500 bg-black/50"
                      required
                    />
                    <span className="text-xs text-zinc-300 leading-relaxed">
                      I agree that my contact information will remain masked and will <strong>only be shared with medical requesters if I explicitly click 'Accept Match'</strong>.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!privacyConsent}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="donor-register-submit-btn"
            >
              <UserPlus className="w-4 h-4" />
              Complete Voluntary Registration
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Live Calculation & Privacy Sidecard */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-red-500/25">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              Your Computed Eligibility
            </h3>

            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  liveEligibility.isEligible
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  {liveEligibility.isEligible ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  {liveEligibility.isEligible ? 'Eligible for Direct Matches' : 'Cooldown Interval Active'}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {liveEligibility.reason}
                </p>
                {!liveEligibility.isEligible && (
                  <div className="mt-2 text-xs font-mono font-semibold text-amber-400">
                    Next Safe Date: {liveEligibility.nextEligibleDate}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/20 text-xs text-zinc-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Standard Gender Cooldown:</span>
                  <span className="font-mono text-white font-bold">
                    {gender === 'female' ? '120 Days (4 Months)' : '90 Days (3 Months)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum Weight Requirement:</span>
                  <span className="font-mono text-white font-bold">50 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Permitted Age Range:</span>
                  <span className="font-mono text-white font-bold">18–65 Years</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/30 text-xs text-zinc-300 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <Lock className="w-4 h-4" />
              The SC-12 Zero-Spam Promise
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Unlike public Google Sheets and WhatsApp broadcasts, you will never get unsolicited spam calls or forwarded messages. You control your availability anytime via a one-tap toggle in your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
