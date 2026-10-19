import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera } from 'lucide-react';
import { AuthUser, UserProfile, KENYA_COUNTIES, INTERESTS, TRIBES } from '../types';
import { updateProfile, saveLocation } from '../lib/storage';

interface Props {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
}

export default function ProfileSetup({ user, onComplete }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [bio, setBio] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [town, setTown] = useState('');
  const [tribe, setTribe] = useState('');
  const [religion, setReligion] = useState('Christian');
  const [lookingFor, setLookingFor] = useState('Serious relationship');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState('');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (i: string) => {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length < 6 ? [...prev, i] : prev
    );
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          county,
        });
        setLocating(false);
        setError('');
      },
      () => {
        setLocating(false);
        setError('Location permission denied. You can still choose your county.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2MB for this demo');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const finish = () => {
    if (!name.trim() || age < 18 || age > 80) {
      setError('Please enter a valid name and age (18+)');
      return;
    }
    if (selectedInterests.length < 2) {
      setError('Pick at least 2 interests');
      return;
    }

    const profile: UserProfile = {
      id: user.id,
      name: name.trim(),
      age,
      gender,
      bio: bio.trim() || 'Hey, I\'m new here!',
      interests: selectedInterests,
      county,
      town: town.trim() || undefined,
      tribe: tribe || undefined,
      religion,
      photos: photoUrl
        ? [photoUrl]
        : [`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e11d48&color=fff&size=400`],
      lookingFor,
    };

    updateProfile(profile);
    onComplete({ ...user, profile });
    navigate('/discover');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  step >= s ? 'bg-rose-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 1 && 'About you'}
            {step === 2 && 'Location & preferences'}
            {step === 3 && 'Interests & photo'}
          </h1>
          <p className="text-gray-600 text-sm mt-1">Step {step} of 3</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="How should people call you?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                min={18}
                max={80}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex gap-2">
                {(['female', 'male', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium capitalize ${
                      gender === g
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                placeholder="Tell people a bit about yourself..."
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Town / Area (optional)</label>
              <input
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Westlands, Nyali, Milimani"
              />
            </div>
            <button
              type="button"
              onClick={requestLocation}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-rose-300 text-rose-600 rounded-xl hover:bg-rose-50"
            >
              <MapPin className="w-5 h-5" />
              {locating ? 'Getting location...' : 'Use my current location'}
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tribe (optional)</label>
              <select
                value={tribe}
                onChange={(e) => setTribe(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Prefer not to say</option>
                {TRIBES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option>Christian</option>
                <option>Muslim</option>
                <option>Hindu</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option>Serious relationship</option>
                <option>Marriage minded</option>
                <option>Friendship first</option>
                <option>Something casual</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests (pick 2–6)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      selectedInterests.includes(i)
                        ? 'bg-rose-100 border-rose-400 text-rose-700'
                        : 'border-gray-200 text-gray-600 hover:border-rose-300'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile photo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer text-sm font-medium text-rose-600 hover:underline">
                  Upload photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">Optional for demo. Max 2MB.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700"
              >
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-rose-600 text-white font-semibold py-3 rounded-xl hover:bg-rose-700"
              >
                Start matching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
