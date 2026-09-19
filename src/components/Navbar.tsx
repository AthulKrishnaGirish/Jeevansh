import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Droplets,
  Search,
  UserPlus,
  HeartHandshake,
  ShieldCheck,
  Bell,
  Menu,
  X,
  RotateCcw,
  Stethoscope,
  UserCheck,
  LogOut,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, openAuthModal, loginAsDemoDoctor, loginAsDemoDonor } = useAuth();
  const { matches, resetData } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  // Count pending matches for current user if donor
  const pendingForUser = user?.donorProfileId
    ? matches.filter(m => m.donorId === user.donorProfileId && m.status === 'pending').length
    : matches.filter(m => m.status === 'pending').length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donor', path: '/search', icon: Search },
    { name: 'Register Donor', path: '/register', icon: UserPlus },
    { name: 'Doctor Dashboard', path: '/requests', icon: Stethoscope },
    { name: 'Donor Dashboard', path: '/donor-dashboard', icon: HeartHandshake },
    { name: 'About SC-12', path: '/about', icon: Info },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all demo donors, requests, and matches back to default initial state?')) {
      resetData();
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-500/20 bg-[#0c0507]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            id="nav-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                  Jeevansh
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/30 rounded">
                  Kerala
                </span>
              </div>
              <p className="text-[11px] text-red-300/70 font-medium tracking-wide">
                District Blood Donor Matching
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-red-600/20 text-red-200 border border-red-500/40 shadow-sm shadow-red-900/50'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools & Auth Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 border border-red-500/30 text-red-200 hover:bg-red-900/40 hover:border-red-400/50 flex items-center gap-1.5 transition-all shadow-sm"
                id="demo-switcher-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Demo Persona</span>
                <span className="text-[10px] bg-red-600/50 text-white px-1.5 py-0.2 rounded font-mono">
                  {user ? (user.role === 'doctor' ? 'Doctor' : 'Donor') : 'Select'}
                </span>
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 glass-panel rounded-xl p-2 shadow-2xl z-50 border border-red-500/30 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-red-500/20">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={loginAsDemoDoctor}
                    className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-red-600/20 flex items-center gap-2.5 text-zinc-200 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Dr. Lakshmi Mohan</p>
                      <p className="text-[10px] text-zinc-400">Hospital Doctor / Requester</p>
                    </div>
                  </button>

                  <button
                    onClick={loginAsDemoDonor}
                    className="w-full text-left p-2.5 rounded-lg text-xs hover:bg-red-600/20 flex items-center gap-2.5 text-zinc-200 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Arjun Nair (O+ Donor)</p>
                      <p className="text-[10px] text-zinc-400">Has pending match request</p>
                    </div>
                  </button>

                  <div className="border-t border-red-500/20 mt-1 pt-1">
                    <button
                      onClick={handleReset}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2 text-zinc-400 hover:text-zinc-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset all demo data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Indicator */}
            <Link
              to="/donor-dashboard"
              className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              title="Incoming match requests"
              id="notification-bell-link"
            >
              <Bell className="w-5 h-5" />
              {pendingForUser > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center red-pulse">
                  {pendingForUser}
                </span>
              )}
            </Link>

            {/* Auth / Profile status */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-red-500/30">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-red-300 font-mono capitalize">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('donor')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md shadow-red-600/30 transition-all"
                id="login-modal-open-btn"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/donor-dashboard"
              className="relative p-2 rounded-lg text-zinc-300 hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {pendingForUser > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingForUser}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white focus:outline-none"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-red-500/20 bg-[#0c0507]/95 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-red-600/20 text-red-200 border border-red-500/30'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-red-500/20 flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase">Demo Shortcuts</p>
            <button
              onClick={() => {
                loginAsDemoDoctor();
                setMobileMenuOpen(false);
                navigate('/requests');
              }}
              className="text-left px-3 py-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs font-semibold text-blue-200"
            >
              Switch to Dr. Lakshmi (Requester)
            </button>
            <button
              onClick={() => {
                loginAsDemoDonor();
                setMobileMenuOpen(false);
                navigate('/donor-dashboard');
              }}
              className="text-left px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-200"
            >
              Switch to Arjun Nair (O+ Donor)
            </button>
            <button
              onClick={() => {
                handleReset();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-semibold text-zinc-400"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
