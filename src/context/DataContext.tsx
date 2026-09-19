import React, { createContext, useContext, useState, useEffect } from 'react';
import { Donor, BloodRequest, MatchRequest } from '../types';
import {
  loadDonors,
  saveDonors,
  loadRequests,
  saveRequests,
  loadMatches,
  saveMatches,
  resetToDemoData
} from '../utils/storage';

interface DataContextType {
  donors: Donor[];
  requests: BloodRequest[];
  matches: MatchRequest[];
  stats: {
    totalDonors: number;
    activeDonors: number;
    districtsCovered: number;
    requestsCount: number;
    matchesMade: number;
    livesSaved: number;
  };
  registerDonor: (donorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations' | 'livesSaved'>) => Donor;
  toggleDonorAvailability: (donorId: string) => void;
  createBloodRequest: (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'matchedDonorIds'>) => BloodRequest;
  sendMatchRequest: (requestId: string, donorId: string) => MatchRequest;
  respondToMatch: (matchId: string, status: 'accepted' | 'declined') => void;
  recordDonationCompletion: (matchId: string) => void;
  resetData: () => void;
  getDonorById: (id: string) => Donor | undefined;
  getRequestById: (id: string) => BloodRequest | undefined;
  getMatchesForDonor: (donorId: string) => MatchRequest[];
  getMatchesForRequest: (requestId: string) => MatchRequest[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<Donor[]>(() => loadDonors());
  const [requests, setRequests] = useState<BloodRequest[]>(() => loadRequests());
  const [matches, setMatches] = useState<MatchRequest[]>(() => loadMatches());

  useEffect(() => {
    saveDonors(donors);
  }, [donors]);

  useEffect(() => {
    saveRequests(requests);
  }, [requests]);

  useEffect(() => {
    saveMatches(matches);
  }, [matches]);

  // Compute live statistics
  const districtsCovered = new Set(donors.map(d => d.district)).size;
  const activeDonors = donors.filter(d => d.isAvailable).length;
  const acceptedMatches = matches.filter(m => m.status === 'accepted' || m.status === 'completed');
  const livesSaved = donors.reduce((acc, d) => acc + d.livesSaved, 0);

  const stats = {
    totalDonors: donors.length,
    activeDonors,
    districtsCovered,
    requestsCount: requests.length,
    matchesMade: acceptedMatches.length,
    livesSaved
  };

  const registerDonor = (
    donorData: Omit<Donor, 'id' | 'registeredAt' | 'totalDonations' | 'livesSaved'>
  ): Donor => {
    const newDonor: Donor = {
      ...donorData,
      id: `donor-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
      totalDonations: donorData.lastDonationDate ? 1 : 0,
      livesSaved: donorData.lastDonationDate ? 3 : 0,
      rating: 5.0
    };
    setDonors(prev => [newDonor, ...prev]);
    return newDonor;
  };

  const toggleDonorAvailability = (donorId: string) => {
    setDonors(prev =>
      prev.map(d => (d.id === donorId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const createBloodRequest = (
    requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status' | 'matchedDonorIds'>
  ): BloodRequest => {
    const newRequest: BloodRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      matchedDonorIds: []
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const sendMatchRequest = (requestId: string, donorId: string): MatchRequest => {
    const req = requests.find(r => r.id === requestId);
    if (!req) {
      throw new Error('Blood request not found');
    }

    // Check if match request already exists
    const existing = matches.find(m => m.requestId === requestId && m.donorId === donorId);
    if (existing) {
      return existing;
    }

    const newMatch: MatchRequest = {
      id: `match-${Date.now()}`,
      requestId,
      donorId,
      requesterId: req.requesterId,
      status: 'pending',
      sentAt: new Date().toISOString(),
      requestSnapshot: {
        hospitalName: req.hospitalName,
        bloodGroup: req.bloodGroup,
        district: req.district,
        urgency: req.urgency,
        unitsRequired: req.unitsRequired,
        patientName: req.patientName,
        requesterName: req.requesterName,
        requesterPhone: req.requesterPhone
      }
    };

    setMatches(prev => [newMatch, ...prev]);

    // Update request matchedDonorIds
    setRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'matched',
              matchedDonorIds: Array.from(new Set([...r.matchedDonorIds, donorId]))
            }
          : r
      )
    );

    return newMatch;
  };

  const respondToMatch = (matchId: string, status: 'accepted' | 'declined') => {
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? { ...m, status, respondedAt: new Date().toISOString() }
          : m
      )
    );
  };

  const recordDonationCompletion = (matchId: string) => {
    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) return;

    // Mark match completed
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId ? { ...m, status: 'completed' } : m
      )
    );

    // Update donor last donation date to today, increment donations and lives saved
    const today = new Date().toISOString().split('T')[0];
    setDonors(prev =>
      prev.map(d =>
        d.id === targetMatch.donorId
          ? {
              ...d,
              lastDonationDate: today,
              totalDonations: d.totalDonations + 1,
              livesSaved: d.livesSaved + 3
            }
          : d
      )
    );

    // Update request status to fulfilled
    setRequests(prev =>
      prev.map(r =>
        r.id === targetMatch.requestId ? { ...r, status: 'fulfilled' } : r
      )
    );
  };

  const resetData = () => {
    resetToDemoData();
    setDonors(loadDonors());
    setRequests(loadRequests());
    setMatches(loadMatches());
  };

  const getDonorById = (id: string) => donors.find(d => d.id === id);
  const getRequestById = (id: string) => requests.find(r => r.id === id);
  const getMatchesForDonor = (donorId: string) => matches.filter(m => m.donorId === donorId);
  const getMatchesForRequest = (requestId: string) => matches.filter(m => m.requestId === requestId);

  return (
    <DataContext.Provider
      value={{
        donors,
        requests,
        matches,
        stats,
        registerDonor,
        toggleDonorAvailability,
        createBloodRequest,
        sendMatchRequest,
        respondToMatch,
        recordDonationCompletion,
        resetData,
        getDonorById,
        getRequestById,
        getMatchesForDonor,
        getMatchesForRequest
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
