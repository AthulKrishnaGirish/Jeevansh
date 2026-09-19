import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Shield, HeartHandshake, PhoneCall, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-red-500/20 bg-[#080305] text-zinc-400 text-sm mt-20">
      {/* Problem statement banner */}
      <div className="border-b border-red-500/10 bg-gradient-to-r from-red-950/40 via-red-900/20 to-red-950/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                SC-12 Mission: Solving WhatsApp Blood Broadcast Inefficiency
              </p>
              <p className="text-xs text-zinc-400">
                Precision district matching and strict 90/120-day interval enforcement prevent spamming ineligible donors.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white transition-all whitespace-nowrap"
          >
            Read Architecture & Guidelines →
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">Jeevansh</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              District blood donor matching platform keeping contact numbers 100% private until voluntary donor acceptance.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/60 border border-red-500/30 text-[11px] text-red-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All 14 Kerala Districts Supported
            </div>
          </div>

          {/* Col 2: Matching Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Matching Engine
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search" className="hover:text-red-400 transition-colors">
                  Find Compatible Donors
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-red-400 transition-colors">
                  Volunteer Donor Registration
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-red-400 transition-colors">
                  Hospital Request Dispatcher
                </Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-red-400 transition-colors">
                  Donor Cooldown Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Intervals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Interval Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-zinc-300">
                <span>Male Donors:</span>
                <span className="font-mono text-red-400">90 Days (3 mo)</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Female Donors:</span>
                <span className="font-mono text-red-400">120 Days (4 mo)</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Min Weight:</span>
                <span className="font-mono text-red-400">50 kg</span>
              </li>
              <li className="flex items-center justify-between text-zinc-300">
                <span>Age Limit:</span>
                <span className="font-mono text-red-400">18–65 Yrs</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Emergency */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Privacy First Guarantee
            </h4>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              No donor numbers or emails are ever shown publicly or scraped into spam WhatsApp lists.
            </p>
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kerala Blood Cell Helpline</span>
              </div>
              <p className="text-[11px] text-zinc-300">Toll Free: 104 / 0471-2303180</p>
            </div>
          </div>
        </div>

        <div className="border-t border-red-500/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Jeevansh. Built for SC-12 District Blood Donor Matching.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>Preserving donor peace & dignity</span>
            <HeartHandshake className="w-3.5 h-3.5 text-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
