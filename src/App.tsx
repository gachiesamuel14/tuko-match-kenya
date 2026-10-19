import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Compass, MessageCircle, User, LogOut, MapPin, Shield } from 'lucide-react';
import { getAuth, setAuth } from './lib/storage';
import { AuthUser } from './types';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    setUser(auth);
    setLoading(false);
  }, []);

  const handleLogin = (authUser: AuthUser) => {
    setAuth(authUser);
    setUser(authUser);
    if (!authUser.profile) {
      navigate('/setup');
    } else {
      navigate('/discover');
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setUser(null);
    navigate('/');
  };

  const updateUser = (updated: AuthUser) => {
    setAuth(updated);
    setUser(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="text-center">
          <Heart className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
          <p className="mt-3 text-gray-600 font-medium">Tuko Match</p>
        </div>
      </div>
    );
  }

  const isApp = user && user.profile && !['/', '/login', '/register', '/setup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isApp && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/discover" className="flex items-center gap-2 font-bold text-rose-600 text-lg">
              <Heart className="w-6 h-6 fill-rose-500" />
              Tuko Match
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-rose-600 rounded-full hover:bg-rose-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={user?.profile ? <Navigate to="/discover" /> : <Landing />}
          />
          <Route path="/login" element={<AuthPage mode="login" onAuth={handleLogin} />}
          />
          <Route path="/register" element={<AuthPage mode="register" onAuth={handleLogin} />}
          />
          <Route
            path="/setup"
            element={
              user ? (
                <ProfileSetup user={user} onComplete={updateUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/discover"
            element={
              user?.profile ? (
                <Discover user={user} />
              ) : (
                <Navigate to={user ? '/setup' : '/login'} />
              )
            }
          />
          <Route
            path="/matches"
            element={
              user?.profile ? <Matches user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/chat/:matchId"
            element={
              user?.profile ? <Chat user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={
              user?.profile ? (
                <ProfilePage user={user} onUpdate={updateUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />}
          />
        </Routes>
      </main>

      {isApp && (
        <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-40">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            <NavItem to="/discover" icon={Compass} label="Discover" active={location.pathname === '/discover'} />
            <NavItem to="/matches" icon={MessageCircle} label="Matches" active={location.pathname.startsWith('/matches') || location.pathname.startsWith('/chat')} />
            <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === '/profile'} />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition ${
        active ? 'text-rose-600' : 'text-gray-500 hover:text-rose-500'
      }`}
    >
      <Icon className={`w-6 h-6 ${active ? 'fill-rose-100' : ''}`} />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

export default App;
