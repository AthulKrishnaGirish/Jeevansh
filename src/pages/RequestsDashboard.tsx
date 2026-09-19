import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Lock,
  Unlock,
  AlertTriangle,
  Building2,
  Users
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getDonorPrivacyView } from '../utils/privacyManager';

export const RequestsDashboard: React.FC = () => {
  const { requests, matches, donors, createBloodRequest } = useData();
  const { user, loginAsDemoDoctor } = useAuth();

  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    requests[0]?.id || ''
  );
  const [showNewModal, setShowNewModal] = useState(false);

  // New Request Form State
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('Aster Medcity, Kochi');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [district, setDistrict] = useState('Ernakulam');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [urgency, setUrgency] = useState<'emergency' | 'urgent' | 'standard'>('emergency');
  const [notes, setNotes] = useState('');

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0];
  const requestMatches = matches.filter(m => m.requestId === selectedRequest?.id);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createBloodRequest({
      requesterId: user?.id || 'user-doctor-1',
      requesterName: user?.name || 'Dr. Lakshmi Mohan',
      requesterPhone: user?.phone || '+91 98470 44332',
      patientName: patientName || 'Critical Inpatient',
      hospitalName,
      bloodGroup,
      district,
      unitsRequired,
      urgency,
      requiredDate: new Date().toISOString().split('T')[0],
      notes
    });
    setSelectedRequestId(created.id);
    setShowNewModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Stethoscope className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Hospital & Requester Control Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Blood Request & Matching Dispatcher
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active logged-in requester:{' '}
            <strong className="text-white">{user ? user.name : 'Dr. Lakshmi Mohan (Aster Medcity)'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
            id="create-new-blood-request-btn"
          >
            <Plus className="w-4 h-4" />
            New Blood Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Requests Tracker List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              All Sent Blood Requests ({requests.length})
            </h3>
            <span className="text-[11px] text-zinc-400">Select to inspect</span>
          </div>

          <div className="space-y-3">
            {requests.map(req => {
              const isSelected = req.id === selectedRequest?.id;
              const reqMatchesCount = matches.filter(m => m.requestId === req.id).length;
              const reqAcceptedCount = matches.filter(
                m => m.requestId === req.id && (m.status === 'accepted' || m.status === 'completed')
              ).length;

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'glass-card border-red-500/50 bg-red-950/40 shadow-lg shadow-red-950/30 scale-[1.02]'
                      : 'glass-card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-red-600 font-black text-white text-xs flex items-center justify-center">
                        {req.bloodGroup}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {req.patientName}
                        </h4>
                        <p className="text-[11px] text-zinc-400">{req.hospitalName}</p>
                      </div>
                    </div>

                    {req.urgency === 'emergency' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white red-pulse">
                        EMERGENCY
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                        {req.urgency}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-red-500/10 pt-2 mt-2">
                    <span>
                      {req.unitsRequired} Unit(s) • {req.district}
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {reqAcceptedCount > 0 ? `✅ ${reqAcceptedCount} Accepted` : `${reqMatchesCount} Contacted`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Detailed Request & Matched Donors Status */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRequest ? (
            <>
              {/* Selected Request Summary */}
              <div className="glass-panel rounded-3xl p-6 border border-red-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-red-700/30">
                      {selectedRequest.bloodGroup}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {selectedRequest.patientName}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {selectedRequest.hospitalName} • {selectedRequest.district} District
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/matches?requestId=${selectedRequest.id}&blood=${encodeURIComponent(
                      selectedRequest.bloodGroup
                    )}&district=${encodeURIComponent(selectedRequest.district)}`}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Match More Donors
                  </Link>
                </div>

                {selectedRequest.notes && (
                  <p className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-red-500/15 mb-4">
                    <strong className="text-white">Medical Notes:</strong> {selectedRequest.notes}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-red-500/10">
                    <span className="text-zinc-400 block">Required Units</span>
                    <span className="text-sm font-bold text-white">{selectedRequest.unitsRequired}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-red-500/10">
                    <span className="text-zinc-400 block">Matched Donors</span>
                    <span className="text-sm font-bold text-white">{requestMatches.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/30 border border-red-500/10">
                    <span className="text-zinc-400 block">Unlocked Contacts</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {requestMatches.filter(m => m.status === 'accepted' || m.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Matched Donors for this Request */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-400" />
                    Contacted Donors Status ({requestMatches.length})
                  </h3>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-red-400" />
                    Locked until donor voluntarily accepts
                  </span>
                </div>

                {requestMatches.length === 0 ? (
                  <div className="glass-panel p-8 rounded-3xl text-center border border-red-500/20">
                    <Users className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">
                      No donors have been dispatched for this request yet. Click{' '}
                      <strong className="text-white">Match More Donors</strong> above to search eligible nearby donors.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestMatches.map(match => {
                      const donor = donors.find(d => d.id === match.donorId);
                      if (!donor) return null;

                      const isAccepted = match.status === 'accepted' || match.status === 'completed';
                      const privacyView = getDonorPrivacyView(donor, isAccepted);

                      return (
                        <div
                          key={match.id}
                          className={`glass-card rounded-2xl p-4 border transition-all ${
                            isAccepted
                              ? 'border-emerald-500/40 bg-emerald-950/20 shadow-md shadow-emerald-950/20'
                              : 'border-red-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center">
                                {donor.bloodGroup}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {privacyView.displayName}
                                </h4>
                                <span className="text-[10px] text-zinc-400">
                                  {donor.district} • {donor.gender}, {donor.age}y
                                </span>
                              </div>
                            </div>

                            {isAccepted ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <Unlock className="w-3 h-3" />
                                Unlocked
                              </span>
                            ) : match.status === 'declined' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-500">
                                Declined
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>

                          {/* Contact Details */}
                          <div className="p-3 rounded-xl bg-black/40 border border-red-500/15 space-y-1.5 text-xs mb-3">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Phone:</span>
                              {isAccepted ? (
                                <a
                                  href={`tel:${donor.phone}`}
                                  className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  {donor.phone}
                                </a>
                              ) : (
                                <span className="font-mono text-zinc-400 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-red-400" />
                                  {privacyView.phone}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Email:</span>
                              {isAccepted ? (
                                <a
                                  href={`mailto:${donor.email}`}
                                  className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <Mail className="w-3 h-3" />
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

                          {isAccepted ? (
                            <a
                              href={`tel:${donor.phone}`}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Direct Call {donor.name}
                            </a>
                          ) : (
                            <p className="text-[10px] text-zinc-500 text-center italic">
                              Awaiting donor acceptance in their private dashboard...
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center border border-red-500/20">
              <p className="text-zinc-400 text-sm">Select a blood request from the list to view its matches</p>
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Create New Blood Request</h3>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Patient Name / Case ID</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. ICU Trauma Emergency"
                  className="w-full px-3 py-2 rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white font-bold"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg} className="bg-[#12080c] text-white">
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">District (Kerala)</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white"
                  >
                    {['Ernakulam', 'Kozhikode', 'Thiruvananthapuram', 'Thrissur', 'Kannur', 'Malappuram', 'Kollam', 'Palakkad', 'Kottayam', 'Alappuzha', 'Idukki', 'Wayanad', 'Pathanamthitta', 'Kasaragod'].map(
                      d => (
                        <option key={d} value={d} className="bg-[#12080c] text-white">
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={e => setHospitalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Units Required</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={unitsRequired}
                    onChange={e => setUnitsRequired(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Clinical Urgency</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['emergency', 'urgent', 'standard'] as const).map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`py-2 rounded-lg font-bold uppercase text-[10px] transition-all ${
                        urgency === u
                          ? 'bg-red-600 text-white'
                          : 'bg-black/40 text-zinc-400 border border-red-500/20'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Surgery at 10 AM tomorrow, please bring donor card"
                  className="w-full px-3 py-2 rounded-xl glass-input text-white h-16 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-red-500/20">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/40"
                >
                  Publish & Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
