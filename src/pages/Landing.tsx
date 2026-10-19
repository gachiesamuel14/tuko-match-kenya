import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Shield, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-orange-50">
      {/* Hero */}
      <section className="max-w-lg mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 mb-6">
          <Heart className="w-10 h-10 text-rose-600 fill-rose-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Find love <span className="text-rose-600">near you</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Tuko Match connects people across Kenya using location. Meet someone in your county, town, or just a few kilometres away.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-rose-200 hover:bg-rose-700 transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold px-8 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-lg mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">Why Kenyans choose Tuko Match</h2>
        <div className="space-y-5">
          <Feature
            icon={MapPin}
            title="Location-based matching"
            desc="See people near you by GPS or filter by county — Nairobi, Mombasa, Kisumu, Kiambu and every other county."
          />
          <Feature
            icon={Users}
            title="Kenya-first filters"
            desc="Match by tribe, religion, interests, lifestyle (student / professional / church) and distance."
          />
          <Feature
            icon={MessageCircle}
            title="Real chat after you match"
            desc="Like, match, and start conversations instantly. No endless swiping without purpose."
          />
          <Feature
            icon={Shield}
            title="Safety built in"
            desc="Report & block tools, photo verification roadmap, and community guidelines for a safer experience."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-lg mx-auto px-6 py-12 text-center">
        <p className="text-gray-600 mb-4">Ready to meet someone close by?</p>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white font-semibold px-10 py-3.5 rounded-full shadow-lg hover:bg-rose-700 transition"
        >
          Create your free profile
        </Link>
        <p className="mt-6 text-xs text-gray-400">
          Demo version — data stored locally in your browser. Production version will use secure backend + M-Pesa.
        </p>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-rose-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
