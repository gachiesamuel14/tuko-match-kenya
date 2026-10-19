import { AuthUser } from '../types';
import { LogOut, MapPin, Shield, Crown } from 'lucide-react';

interface Props {
  user: AuthUser;
  onUpdate: (u: AuthUser) => void;
  onLogout: () => void;
}

export default function ProfilePage({ user, onLogout }: Props) {
  const p = user.profile!;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-rose-500 to-orange-400" />
        <div className="px-5 pb-6 -mt-12">
          <img
            src={p.photos[0]}
            alt={p.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow"
          />
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            {p.name}, {p.age}
          </h1>
          <p className="flex items-center gap-1 text-gray-600 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            {p.town ? `${p.town}, ` : ''}
            {p.county}
          </p>
          <p className="mt-3 text-gray-700 text-sm">{p.bio}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.interests.map((i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-medium"
              >
                {i}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {p.tribe && (
              <div>
                <span className="text-gray-400">Tribe</span>
                <p className="font-medium">{p.tribe}</p>
              </div>
            )}
            {p.religion && (
              <div>
                <span className="text-gray-400">Religion</span>
                <p className="font-medium">{p.religion}</p>
              </div>
            )}
            <div>
              <span className="text-gray-400">Looking for</span>
              <p className="font-medium">{p.lookingFor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium teaser */}
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 flex items-start gap-3">
        <Crown className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900">Go Premium (coming soon)</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            See who liked you, unlimited likes, boost your profile, and pay easily with M-Pesa.
          </p>
        </div>
      </div>

      {/* Safety */}
      <div className="mt-3 p-4 bg-white rounded-2xl border border-gray-100 flex items-start gap-3">
        <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900">Safety</h3>
          <p className="text-sm text-gray-600 mt-0.5">
            Report and block tools will be fully available in the production version. Always meet in public places.
          </p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-red-600 font-medium border border-red-100 rounded-xl hover:bg-red-50"
      >
        <LogOut className="w-5 h-5" />
        Log out
      </button>

      <p className="mt-6 text-center text-xs text-gray-400">
        Tuko Match · Demo build · Data stays in your browser
      </p>
    </div>
  );
}
