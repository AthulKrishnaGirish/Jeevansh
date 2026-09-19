import { BloodGroup, Donor, EligibilityResult } from '../types';
import { isBloodCompatible } from '../data/bloodGroups';
import { getNeighboringDistricts } from '../data/districts';
import { checkDonorEligibility } from './intervalChecker';

export interface MatchScore {
  donor: Donor;
  eligibility: EligibilityResult;
  matchType: 'exact' | 'compatible';
  locationTier: 'same_district' | 'neighboring' | 'other';
  matchScore: number;
}

export interface MatchingResults {
  eligibleDirectMatches: MatchScore[];
  eligibleCompatibleMatches: MatchScore[];
  eligibleNeighboringMatches: MatchScore[];
  cooldownDonors: { donor: Donor; eligibility: EligibilityResult }[];
  pausedDonors: { donor: Donor; eligibility: EligibilityResult }[];
  summary: {
    totalEvaluated: number;
    eligibleCount: number;
    cooldownSavedFromSpam: number;
    pausedProtected: number;
  };
}

export interface MatchingQuery {
  bloodGroup: BloodGroup;
  district: string;
  allowCompatible?: boolean;
  expandToNeighboring?: boolean;
}

export function runMatchingEngine(
  donors: Donor[],
  query: MatchingQuery
): MatchingResults {
  const { bloodGroup, district } = query;
  const neighboring = getNeighboringDistricts(district);

  const eligibleDirectMatches: MatchScore[] = [];
  const eligibleCompatibleMatches: MatchScore[] = [];
  const eligibleNeighboringMatches: MatchScore[] = [];
  const cooldownDonors: { donor: Donor; eligibility: EligibilityResult }[] = [];
  const pausedDonors: { donor: Donor; eligibility: EligibilityResult }[] = [];

  for (const donor of donors) {
    const isExactBlood = donor.bloodGroup === bloodGroup;
    const isCompatibleBlood = isBloodCompatible(donor.bloodGroup, bloodGroup);

    // If blood isn't compatible at all, skip
    if (!isExactBlood && !isCompatibleBlood) {
      continue;
    }

    const isSameDistrict = donor.district.toLowerCase() === district.toLowerCase();
    const isNeighborDistrict = neighboring.some(n => n.toLowerCase() === donor.district.toLowerCase());

    const eligibility = checkDonorEligibility(donor);

    // If donor paused availability
    if (!donor.isAvailable) {
      if (isSameDistrict || isNeighborDistrict) {
        pausedDonors.push({ donor, eligibility });
      }
      continue;
    }

    // If in cooldown interval or medical ineligible
    if (!eligibility.isEligible) {
      if (isSameDistrict || isNeighborDistrict) {
        cooldownDonors.push({ donor, eligibility });
      }
      continue;
    }

    // Donor is eligible! Calculate match score and categorization
    let score = 100;
    if (isExactBlood) score += 20;
    if (isSameDistrict) score += 30;
    else if (isNeighborDistrict) score += 15;
    if (donor.totalDonations > 0) score += Math.min(donor.totalDonations * 2, 10);

    const matchItem: MatchScore = {
      donor,
      eligibility,
      matchType: isExactBlood ? 'exact' : 'compatible',
      locationTier: isSameDistrict ? 'same_district' : (isNeighborDistrict ? 'neighboring' : 'other'),
      matchScore: score
    };

    if (isSameDistrict && isExactBlood) {
      eligibleDirectMatches.push(matchItem);
    } else if (isSameDistrict && isCompatibleBlood) {
      eligibleCompatibleMatches.push(matchItem);
    } else if (isNeighborDistrict) {
      eligibleNeighboringMatches.push(matchItem);
    }
  }

  // Sort by highest match score
  eligibleDirectMatches.sort((a, b) => b.matchScore - a.matchScore);
  eligibleCompatibleMatches.sort((a, b) => b.matchScore - a.matchScore);
  eligibleNeighboringMatches.sort((a, b) => b.matchScore - a.matchScore);

  const totalEligible =
    eligibleDirectMatches.length +
    eligibleCompatibleMatches.length +
    eligibleNeighboringMatches.length;

  return {
    eligibleDirectMatches,
    eligibleCompatibleMatches,
    eligibleNeighboringMatches,
    cooldownDonors,
    pausedDonors,
    summary: {
      totalEvaluated: donors.length,
      eligibleCount: totalEligible,
      cooldownSavedFromSpam: cooldownDonors.length,
      pausedProtected: pausedDonors.length
    }
  };
}
