import { useState, useMemo } from 'react';
import { Heart, X, MapPin, Info, Filter } from 'lucide-react';
import { AuthUser, UserProfile, KENYA_COUNTIES } from '../types';
import { MOCK_USERS } from '../data/mockUsers';
import { getLikes, addLike, getPasses, addPass, addMatch, getMatches } from '../lib/storage';

interface Props {
  user: AuthUser;
}

export default function Discover({ user }: Props) {
  const [filterCounty, setFilterCounty] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchToast, setMatchToast] = useState<UserProfile | null>(null);

  const liked = getLikes();
  const passed = getPasses();

  const candidates = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      if (u.id === user.id) return false;
      if (liked.includes(u.id) || passed.includes(u.id)) return false;
      // Prefer opposite gender for demo simplicity (can expand)
      if (user.profile && u.gender === user.profile.gender) return false;
      if (filterCounty !== 'All' && u.county !== filterCounty) return false;
      return true;
    });
  }, [user, liked, passed, filterCounty]);

  const current = candidates[currentIndex];

  const handleLike = () => {
    if (!current) return;
    addLike(current.id);

    // Demo: 40% chance of mutual match for fun
    const isMatch = Math.random() < 0.4 || getMatches().some((m) => m.userId === current.id);
    if (isMatch) {
      addMatch({
        id: 'match_' + Date.now(),
        userId: current.id,
        matchedAt: new Date().toISOString(),
        lastMessage: undefined,
        unread: 0,
      });
      setMatchToast(current);
      setTimeout(() => setMatchToast(null), 3500);
    }

    setCurrentIndex((i) => i + 1);
  };

  const handlePass = () => {
    if (!current) return;
    addPass(current.id);
    setCurrentIndex((i) => i + 1);
  };

  if (!current) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-rose-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No more people nearby</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Try changing the county filter or check back later. In the full version, new users appear in real time.
        </p>
        <button
          onClick={() => {
            setFilterCounty('All');
            setCurrentIndex(0);
          }}
          className="mt-6 text-rose-600 font-medium hover:underline"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-4 relative">
      {/* Filters bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {filterCounty === 'All' ? 'All Kenya' : filterCounty}
            {user.profile?.county && filterCounty === 'All' && (
              <span className="text-gray-400"> · near {user.profile.county}</span>
            )}
          </span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-sm font-medium text-rose-600 px-3 py-1.5 rounded-full bg-rose-50"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
          <select
            value={filterCounty}
            onChange={(e) => {
              setFilterCounty(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="All">All Kenya</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Card */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 card-enter">
        <div className="aspect-[3/4] relative bg-gray-100">
          <img
            src={current.photos[0]}
            alt={current.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(current.name)}&background=e11d48&color=fff&size=400`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {current.name}, {current.age}
                </h2>
                <p className="flex items-center gap-1 text-sm opacity-90 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {current.town ? `${current.town}, ` : ''}
                  {current.county}
                  {current.distanceKm != null && (
                    <span className="ml-1">· {current.distanceKm} km</span>
                  )}
                </p>
              </div>
              {current.isOnline && (
                <span className="bg-green-500 text-xs font-medium px-2 py-0.5 rounded-full">
                  Online
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="text-gray-700 text-sm leading-relaxed">{current.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {current.interests.slice(0, 5).map((i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-medium"
              >
                {i}
              </span>
            ))}
          </div>
          {(current.tribe || current.religion) && (
            <p className="mt-3 text-xs text-gray-500">
              {current.tribe && <span>{current.tribe}</span>}
              {current.tribe && current.religion && ' · '}
              {current.religion}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">Looking for: {current.lookingFor}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md hover:border-gray-300 hover:scale-105 transition active:scale-95"
          aria-label="Pass"
        >
          <X className="w-8 h-8 text-gray-500" />
        </button>
        <button
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-200 hover:bg-rose-700 hover:scale-105 transition active:scale-95"
          aria-label="Like"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        {candidates.length - currentIndex - 1} more nearby
      </p>

      {/* Match toast */}
      {matchToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900">It\'s a Match!</h3>
            <p className="mt-2 text-gray-600">
              You and <strong>{matchToast.name}</strong> liked each other
            </p>
            <p className="mt-1 text-sm text-gray-500">Go to Matches to start chatting</p>
            <button
              onClick={() => setMatchToast(null)}
              className="mt-6 w-full bg-rose-600 text-white font-semibold py-3 rounded-xl"
            >
              Keep swiping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
