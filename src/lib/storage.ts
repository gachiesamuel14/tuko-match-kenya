import { AuthUser, Match, Message, UserProfile } from '../types';

const KEYS = {
  auth: 'tuko_auth',
  likes: 'tuko_likes',
  passes: 'tuko_passes',
  matches: 'tuko_matches',
  messages: 'tuko_messages',
  location: 'tuko_location',
};

export function getAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEYS.auth);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(KEYS.auth, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.auth);
  }
}

export function getLikes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.likes) || '[]');
  } catch {
    return [];
  }
}

export function addLike(userId: string) {
  const likes = getLikes();
  if (!likes.includes(userId)) {
    likes.push(userId);
    localStorage.setItem(KEYS.likes, JSON.stringify(likes));
  }
}

export function getPasses(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.passes) || '[]');
  } catch {
    return [];
  }
}

export function addPass(userId: string) {
  const passes = getPasses();
  if (!passes.includes(userId)) {
    passes.push(userId);
    localStorage.setItem(KEYS.passes, JSON.stringify(passes));
  }
}

export function getMatches(): Match[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.matches) || '[]');
  } catch {
    return [];
  }
}

export function addMatch(match: Match) {
  const matches = getMatches();
  matches.unshift(match);
  localStorage.setItem(KEYS.matches, JSON.stringify(matches));
}

export function getMessages(matchId: string): Message[] {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.messages) || '{}');
    return all[matchId] || [];
  } catch {
    return [];
  }
}

export function addMessage(msg: Message) {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.messages) || '{}');
    if (!all[msg.matchId]) all[msg.matchId] = [];
    all[msg.matchId].push(msg);
    localStorage.setItem(KEYS.messages, JSON.stringify(all));
  } catch {}
}

export function getSavedLocation(): { lat: number; lng: number; county?: string } | null {
  try {
    const raw = localStorage.getItem(KEYS.location);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocation(loc: { lat: number; lng: number; county?: string }) {
  localStorage.setItem(KEYS.location, JSON.stringify(loc));
}

export function updateProfile(profile: UserProfile) {
  const auth = getAuth();
  if (auth) {
    auth.profile = profile;
    setAuth(auth);
  }
}
