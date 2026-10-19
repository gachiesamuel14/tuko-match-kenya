export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  interests: string[];
  county: string;
  town?: string;
  tribe?: string;
  religion?: string;
  photos: string[];
  lookingFor: string;
  distanceKm?: number;
  isOnline?: boolean;
  lastActive?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedAt: string;
  lastMessage?: string;
  unread?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
  isPremium: boolean;
}

export const KENYA_COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos',
  'Kajiado', 'Kilifi', 'Kwale', 'Uasin Gishu', 'Meru', 'Nyeri',
  'Kakamega', 'Bungoma', 'Kisii', 'Migori', 'Homabay', 'Siaya',
  'Busia', 'Vihiga', 'Trans Nzoia', 'Elgeyo Marakwet', 'Nandi',
  'Baringo', 'Laikipia', 'Nyandarua', 'Muranga', 'Kirinyaga',
  'Embu', 'Tharaka Nithi', 'Kitui', 'Makueni', 'Taita Taveta',
  'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Samburu',
  'Turkana', 'West Pokot', 'Bomet', 'Kericho', 'Narok', 'Nyamira',
  'Tana River', 'Lamu'
] as const;

export const INTERESTS = [
  'Travel', 'Music', 'Football', 'Cooking', 'Reading', 'Fitness',
  'Church', 'Business', 'Tech', 'Fashion', 'Dancing', 'Movies',
  'Hiking', 'Photography', 'Gaming', 'Agriculture', 'Politics',
  'Comedy', 'Art', 'Volunteering'
];

export const TRIBES = [
  'Kikuyu', 'Luhya', 'Kalenjin', 'Luo', 'Kamba', 'Kisii',
  'Meru', 'Mijikenda', 'Somali', 'Turkana', 'Maasai', 'Other'
];
