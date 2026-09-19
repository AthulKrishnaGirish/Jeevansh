import { Donor } from '../types';

export interface MaskedDonorView {
  id: string;
  donorCode: string;
  displayName: string;
  bloodGroup: string;
  district: string;
  isPrivacyMasked: boolean;
  phone: string;
  email: string;
  age: number;
  gender: string;
  totalDonations: number;
  livesSaved: number;
  rating: number;
}

export function generateDonorCode(id: string): string {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num = (hash % 9000) + 1000;
  return `DN-${num}`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '🔒 Protected';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length >= 10) {
    const last2 = clean.slice(-2);
    return `+91 ••••• •••${last2} (Locked 🔒)`;
  }
  return '🔒 Locked until accepted';
}

export function maskEmail(email: string): string {
  if (!email) return '🔒 Protected';
  const parts = email.split('@');
  if (parts.length === 2) {
    const name = parts[0];
    const initial = name.length > 0 ? name[0] : 'd';
    return `${initial}••••••@${parts[1]}`;
  }
  return '🔒 Locked until accepted';
}

export function maskDonorName(name: string, donorCode: string): string {
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}. ${parts[parts.length - 1][0]}. (${donorCode})`;
  }
  return `Donor (${donorCode})`;
}

/**
 * Returns a privacy-safe view of a donor based on whether contact access is granted
 */
export function getDonorPrivacyView(donor: Donor, isAccepted: boolean): MaskedDonorView {
  const donorCode = generateDonorCode(donor.id);
  
  if (isAccepted) {
    return {
      id: donor.id,
      donorCode,
      displayName: donor.name,
      bloodGroup: donor.bloodGroup,
      district: donor.district,
      isPrivacyMasked: false,
      phone: donor.phone,
      email: donor.email,
      age: donor.age,
      gender: donor.gender,
      totalDonations: donor.totalDonations,
      livesSaved: donor.livesSaved,
      rating: donor.rating || 4.9
    };
  }

  return {
    id: donor.id,
    donorCode,
    displayName: maskDonorName(donor.name, donorCode),
    bloodGroup: donor.bloodGroup,
    district: donor.district,
    isPrivacyMasked: true,
    phone: maskPhoneNumber(donor.phone),
    email: maskEmail(donor.email),
    age: donor.age,
    gender: donor.gender,
    totalDonations: donor.totalDonations,
    livesSaved: donor.livesSaved,
    rating: donor.rating || 4.9
  };
}
