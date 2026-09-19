import React, { useState } from 'react';
import { X, Stethoscope, UserCheck, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    modalTargetRole,
    loginAsDemoDoctor,
    loginAsDemoDonor,
    loginWithGoogle,
    loginWithPhone
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'demo' | 'phone'>('demo');
  const [phone, setPhone] = useState('+91 98471 23456');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'donor' | 'requester'>(modalTargetRole);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      setOtp('789012'); // Pre-fill sample OTP for frictionless demo
    } else {
      loginWithPhone(name || (role === 'donor' ? 'Registered Donor' : 'Medical Requester'), phone, role);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-red-500/30">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-600/20 text-red-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Access Jeevansh</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Privacy-protected matching platform for blood donors and hospitals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-black/40 p-1 border border-red-500/20 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⭐ 1-Click Demo Personas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'phone'
                ? 'bg-red-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            📱 Phone / OTP Login
          </button>
        </div>

        {activeTab === 'demo' ? (
          <div className="space-y-3">
            <p className="text-[11px] text-zinc-400 text-center mb-3">
              Instant login configured for evaluation without SMS delays:
            </p>

            {/* Doctor Persona */}
            <button
              onClick={loginAsDemoDoctor}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-blue-900/20 border border-blue-500/30 hover:border-blue-400 hover:from-blue-900/40 text-left flex items-center justify-between group transition-all"
              id="demo-doctor-login"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Dr. Lakshmi Mohan</span>
                    <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1.5 py-0.2 rounded font-medium">
                      Requester
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Aster Medcity, Kochi • Ernakulam</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Donor Persona */}
            <button
              onClick={loginAsDemoDonor}
              className="w-full p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 to-red-900/20 border border-red-500/30 hover:border-red-400 hover:from-red-900/40 text-left flex items-center justify-between group transition-all"
              id="demo-donor-login"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Arjun Nair</span>
                    <span className="text-[10px] bg-red-500/30 text-red-300 px-1.5 py-0.2 rounded font-medium">
                      O+ Donor
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Has 1 Pending Emergency Match Request</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Google simulation */}
            <div className="pt-2">
              <button
                onClick={() => loginWithGoogle('donor')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    role === 'donor'
                      ? 'bg-red-600/30 border-red-500 text-white'
                      : 'bg-black/30 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Blood Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('requester')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    role === 'requester'
                      ? 'bg-red-600/30 border-red-500 text-white'
                      : 'bg-black/30 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Doctor / Requester
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Athul Girish"
                className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98471 23456"
                  className="w-full px-3 py-2 rounded-lg glass-input text-xs pl-8"
                  required
                />
                <Phone className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-300">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg glass-input text-sm text-center font-mono tracking-widest text-red-300"
                  required
                />
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Test OTP auto-filled: 789012
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
            >
              {otpSent ? 'Verify OTP & Enter' : 'Send Verification OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
