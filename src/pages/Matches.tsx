import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { AuthUser } from '../types';
import { getMatches } from '../lib/storage';
import { MOCK_USERS } from '../data/mockUsers';

interface Props {
  user: AuthUser;
}

export default function Matches({ user }: Props) {
  const matches = getMatches();

  if (matches.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No matches yet</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Keep liking people on Discover. When someone likes you back, they\'ll appear here.
        </p>
        <Link
          to="/discover"
          className="inline-block mt-6 text-rose-600 font-medium hover:underline"
        >
          Go to Discover →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Your Matches</h1>
      <div className="space-y-2">
        {matches.map((m) => {
          const profile = MOCK_USERS.find((u) => u.id === m.userId);
          if (!profile) return null;
          return (
            <Link
              key={m.id}
              to={`/chat/${m.id}`}
              className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 hover:shadow-sm transition"
            >
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-14 h-14 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=e11d48&color=fff&size=100`;
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
                  {profile.isOnline && (
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {m.lastMessage || `You matched · ${profile.county}`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
