import { Donor, EligibilityResult, Gender } from '../types';

export const MALE_COOLDOWN_DAYS = 90;    // 3 months
export const FEMALE_COOLDOWN_DAYS = 120; // 4 months
export const DEFAULT_COOLDOWN_DAYS = 90;

export function getCooldownDaysForGender(gender: Gender): number {
  switch (gender) {
    case 'female':
      return FEMALE_COOLDOWN_DAYS;
    case 'male':
    case 'other':
    default:
      return MALE_COOLDOWN_DAYS;
  }
}

export function checkDonorEligibility(
  donor: Pick<Donor, 'age' | 'weight' | 'gender' | 'lastDonationDate' | 'isAvailable' | 'healthDeclared'>,
  referenceDate: Date = new Date()
): EligibilityResult {
  // Check availability toggle
  if (!donor.isAvailable) {
    return {
      isEligible: false,
      reason: 'Donor has temporarily paused their availability.',
      daysRemaining: -1,
      nextEligibleDate: 'Paused by donor',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  // Weight check
  if (donor.weight < 50) {
    return {
      isEligible: false,
      reason: `Weight (${donor.weight}kg) is below the minimum required 50kg for safe donation.`,
      daysRemaining: -1,
      nextEligibleDate: 'Weight ineligible (<50kg)',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  // Age check
  if (donor.age < 18 || donor.age > 65) {
    return {
      isEligible: false,
      reason: `Age (${donor.age}) is outside the permitted donor age range (18–65 years).`,
      daysRemaining: -1,
      nextEligibleDate: 'Age ineligible',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  // Health declaration check
  if (donor.healthDeclared === false) {
    return {
      isEligible: false,
      reason: 'Pending medical health declaration check.',
      daysRemaining: -1,
      nextEligibleDate: 'Health clearance required',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  // If never donated before, eligible immediately!
  if (!donor.lastDonationDate) {
    return {
      isEligible: true,
      reason: 'First-time donor, fully eligible immediately.',
      daysRemaining: 0,
      nextEligibleDate: 'Immediately eligible',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  const lastDonation = new Date(donor.lastDonationDate);
  const cooldownDays = getCooldownDaysForGender(donor.gender);
  
  const eligibleTimestamp = lastDonation.getTime() + cooldownDays * 24 * 60 * 60 * 1000;
  const nextEligible = new Date(eligibleTimestamp);
  
  const diffTime = eligibleTimestamp - referenceDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return {
      isEligible: true,
      reason: `Completed the ${cooldownDays}-day medical interval (${donor.gender === 'female' ? '4' : '3'} months). Safe to donate.`,
      daysRemaining: 0,
      nextEligibleDate: 'Immediately eligible',
      cooldownMonths: donor.gender === 'female' ? 4 : 3
    };
  }

  return {
    isEligible: false,
    reason: `In medical cooldown. Requires ${diffDays} more day(s) to complete safe interval of ${cooldownDays} days.`,
    daysRemaining: diffDays,
    nextEligibleDate: nextEligible.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    cooldownMonths: donor.gender === 'female' ? 4 : 3
  };
}

export function formatDaysRemaining(days: number): string {
  if (days <= 0) return 'Ready now';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
}
