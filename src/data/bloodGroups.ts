import { BloodGroup } from '../types';

export interface BloodGroupCompatibility {
  group: BloodGroup;
  canDonateTo: BloodGroup[];
  canReceiveFrom: BloodGroup[];
  isUniversalDonor?: boolean;
  isUniversalRecipient?: boolean;
  description: string;
}

export const ALL_BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const BLOOD_COMPATIBILITY_MAP: Record<BloodGroup, BloodGroupCompatibility> = {
  'O-': {
    group: 'O-',
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    description: 'Universal red blood cell donor. Can donate to all blood types.'
  },
  'O+': {
    group: 'O+',
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    description: 'Most common blood group. Can donate to any positive blood group.'
  },
  'A-': {
    group: 'A-',
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    description: 'Rare group. Can donate to A and AB positive and negative.'
  },
  'A+': {
    group: 'A+',
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    description: 'Can donate to A+ and AB+ individuals.'
  },
  'B-': {
    group: 'B-',
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    description: 'Can donate to B and AB blood types.'
  },
  'B+': {
    group: 'B+',
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    description: 'Can donate to B+ and AB+ patients.'
  },
  'AB-': {
    group: 'AB-',
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    description: 'Universal platelet and plasma donor. Can receive from all negative types.'
  },
  'AB+': {
    group: 'AB+',
    canDonateTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    isUniversalRecipient: true,
    description: 'Universal red cell recipient. Can receive blood from any blood group.'
  }
};

/**
 * Returns true if donor blood group can donate to patient recipient blood group
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const compatibility = BLOOD_COMPATIBILITY_MAP[donorGroup];
  return compatibility ? compatibility.canDonateTo.includes(recipientGroup) : false;
}
