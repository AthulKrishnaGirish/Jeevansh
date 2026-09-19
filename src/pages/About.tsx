import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  ArrowRight,
  Heart,
  Droplets,
  Building2,
  FileCheck
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-xs font-semibold text-red-300 mb-3">
          <FileCheck className="w-4 h-4 text-red-400" />
          Problem Statement SC-12 Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          District Blood Donor Matching
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Why traditional WhatsApp blood broadcasts fail donors and patients, and how Jeevansh creates a noise-free, privacy-preserving ecosystem.
        </p>
      </div>

      {/* The Problem Statement Quote */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-950/30 via-black to-red-950/20">
        <span className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider block mb-2">
          Official SC-12 Problem Statement
        </span>
        <blockquote className="text-base sm:text-lg text-white font-serif italic leading-relaxed">
          “Broad WhatsApp requests often reach the wrong people and repeatedly disturb donors who are not currently eligible. Build a system that matches a request with eligible nearby donors by blood group, location, and donation interval. Keep contact details private until a donor accepts.”
        </blockquote>
      </div>

      {/* Comparison Grid: WhatsApp vs Jeevansh */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          The 4 Flaws of WhatsApp Broadcasts vs Jeevansh
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Flaw 1 */}
          <div className="glass-card p-5 rounded-2xl border-red-900/40 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              WhatsApp: Geographic Irrelevance
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Messages forwarded into giant WhatsApp groups ping thousands of people across the state. A donor in Kasaragod receives repeated urgent notifications for a patient in Thiruvananthapuram (500 km away).
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 mt-2">
              <strong>Jeevansh Fix:</strong> Requests match strictly by district, with optional adjacent district proximity fallback only if local supply is exhausted.
            </div>
          </div>

          {/* Flaw 2 */}
          <div className="glass-card p-5 rounded-2xl border-red-900/40 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              WhatsApp: Ineligible Donor Fatigue
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Donors who donated blood 2 weeks ago receive urgent phone calls and guilt-tripping messages. Medically, their bodies need 90–120 days to replenish hemoglobin and iron reserves.
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 mt-2">
              <strong>Jeevansh Fix:</strong> Automated cooldown tracking. Donors in interval are completely shielded and never alerted.
            </div>
          </div>

          {/* Flaw 3 */}
          <div className="glass-card p-5 rounded-2xl border-red-900/40 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              WhatsApp: Total Privacy Breach
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Personal donor phone numbers are blasted into public groups, leading to harassment, unsolicited sales calls, and lists scraped by commercial marketing bots.
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 mt-2">
              <strong>Jeevansh Fix:</strong> 100% masked contact information. Hospitals only see the phone number after the donor voluntary taps <em>Accept Match</em>.
            </div>
          </div>

          {/* Flaw 4 */}
          <div className="glass-card p-5 rounded-2xl border-red-900/40 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              WhatsApp: Stale Zombie Forwards
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Requests forwarded from months ago continue circulating forever. Donors call families whose patients have already recovered or passed away, causing emotional distress.
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 mt-2">
              <strong>Jeevansh Fix:</strong> State-machine request tracking (Open → Matched → Fulfilled) with instant notification expiration.
            </div>
          </div>
        </div>
      </div>

      {/* Medical Standards Reference */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/25 space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-400" />
          Medical Donation Interval Rules Enforced
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 space-y-1.5">
            <span className="font-bold text-white text-sm">Male Donors: 90 Days</span>
            <p className="text-zinc-400">
              National Blood Transfusion Council (NBTC) guidelines require minimum 3 months between whole blood donations to ensure complete red blood cell reconstitution.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-red-500/20 space-y-1.5">
            <span className="font-bold text-white text-sm">Female Donors: 120 Days</span>
            <p className="text-zinc-400">
              Women require 4 months between donations to preserve ferritin and iron saturation levels and prevent chronic anemia.
            </p>
          </div>
        </div>
      </div>

      {/* Evaluator Verification Walkthrough */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <CheckCircle2 className="w-5 h-5" />
          Evaluator Quick-Test Guide
        </div>

        <ol className="space-y-3 text-xs text-zinc-300 list-decimal list-inside leading-relaxed">
          <li>
            <strong className="text-white">Demonstrate Interval Filtering:</strong> Go to{' '}
            <Link to="/search" className="text-red-400 underline">Find Donor</Link>, pick <strong>O+ in Ernakulam</strong>. Notice the <strong>"Spared from Spam"</strong> tab showing donors in cooldown (e.g., Nikhil Chandran, Reshma Rajesh) who are safely excluded from emergency alerts.
          </li>
          <li>
            <strong className="text-white">Demonstrate Privacy Lock:</strong> In{' '}
            <Link to="/matches?blood=O%2B&district=Ernakulam" className="text-red-400 underline">Match Results</Link>, observe all donor phone numbers and emails are masked with <code className="bg-black/60 px-1 py-0.5 rounded text-red-300">🔒 Locked until accepted</code>.
          </li>
          <li>
            <strong className="text-white">Demonstrate Request → Notify Flow:</strong> Click <strong>Request Blood Match</strong> on any eligible donor.
          </li>
          <li>
            <strong className="text-white">Demonstrate Accept & Contact Unlock:</strong> Switch to the demo donor persona (Arjun Nair) via the top navigation bar or go to{' '}
            <Link to="/donor-dashboard" className="text-red-400 underline">Donor Dashboard</Link>. Tap <strong>Accept Match</strong> on the incoming request.
          </li>
          <li>
            <strong className="text-white">Verify Unlocked State:</strong> The donor's verified phone number immediately becomes unlocked and clickable in both the donor view and doctor's{' '}
            <Link to="/requests" className="text-red-400 underline">Requests Dashboard</Link>!
          </li>
        </ol>
      </div>
    </div>
  );
};
