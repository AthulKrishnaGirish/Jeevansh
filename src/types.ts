export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'male' | 'female' | 'other';

export type UrgencyLevel = 'emergency' | 'urgent' | 'standard';

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  district: string;
  phone: string;
  email: string;
  lastDonationDate: string | null; // ISO Date YYYY-MM-DD
  isAvailable: boolean;
  totalDonations: number;
  livesSaved: number;
  weight: number;
  healthDeclared: boolean;
  registeredAt: string;
  rating?: number;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  district: string;
  unitsRequired: number;
  urgency: UrgencyLevel;
  requiredDate: string;
  notes?: string;
  status: 'open' | 'matched' | 'fulfilled' | 'cancelled';
  createdAt: string;
  matchedDonorIds: string[];
}

export interface MatchRequest {
  id: string;
  requestId: string;
  donorId: string;
  requesterId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  sentAt: string;
  respondedAt?: string;
  requestSnapshot: {
    hospitalName: string;
    bloodGroup: BloodGroup;
    district: string;
    urgency: UrgencyLevel;
    unitsRequired: number;
    patientName: string;
    requesterName: string;
    requesterPhone: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'donor' | 'requester' | 'doctor';
  donorProfileId?: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason: string;
  daysRemaining: number;
  nextEligibleDate: string;
  cooldownMonths: number;
}

export interface DistrictInfo {
  name: string;
  zone: 'North' | 'Central' | 'South';
  neighboring: string[];
}
