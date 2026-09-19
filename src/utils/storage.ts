import { Donor, BloodRequest, MatchRequest, User } from '../types';
import { INITIAL_DONORS, INITIAL_REQUESTS, INITIAL_MATCH_REQUESTS } from '../data/sampleDonors';

const STORAGE_KEYS = {
  DONORS: 'jeevansh_donors_v1',
  REQUESTS: 'jeevansh_requests_v1',
  MATCHES: 'jeevansh_matches_v1',
  USER: 'jeevansh_auth_user_v1'
};

export function loadDonors(): Donor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    if (!raw) {
      saveDonors(INITIAL_DONORS);
      return INITIAL_DONORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read failed for donors', e);
    return INITIAL_DONORS;
  }
}

export function saveDonors(donors: Donor[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
  } catch (e) {
    console.warn('Storage write failed for donors', e);
  }
}

export function loadRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      saveRequests(INITIAL_REQUESTS);
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read failed for requests', e);
    return INITIAL_REQUESTS;
  }
}

export function saveRequests(requests: BloodRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  } catch (e) {
    console.warn('Storage write failed for requests', e);
  }
}

export function loadMatches(): MatchRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!raw) {
      saveMatches(INITIAL_MATCH_REQUESTS);
      return INITIAL_MATCH_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Storage read failed for matches', e);
    return INITIAL_MATCH_REQUESTS;
  }
}

export function saveMatches(matches: MatchRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch (e) {
    console.warn('Storage write failed for matches', e);
  }
}

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } catch (e) {
    console.warn('Storage write failed for user', e);
  }
}

export function resetToDemoData(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(INITIAL_MATCH_REQUESTS));
  } catch (e) {
    console.warn('Storage reset failed', e);
  }
}
