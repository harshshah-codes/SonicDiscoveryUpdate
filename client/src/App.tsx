import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Callback = lazy(() => import('./pages/Callback').then(m => ({ default: m.Callback })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Discover = lazy(() => import('./pages/Discover').then(m => ({ default: m.Discover })));
const MoodTuner = lazy(() => import('./pages/MoodTuner').then(m => ({ default: m.MoodTuner })));
const TimeTravel = lazy(() => import('./pages/TimeTravel').then(m => ({ default: m.TimeTravel })));
const VibeTeleporter = lazy(() => import('./pages/VibeTeleporter').then(m => ({ default: m.VibeTeleporter })));
const Aesthetic = lazy(() => import('./pages/Aesthetic').then(m => ({ default: m.Aesthetic })));
const AlternateYou = lazy(() => import('./pages/AlternateYou').then(m => ({ default: m.AlternateYou })));

function LoadingFallback() {
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-spotify border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <div className="text-xl text-green-500">Loading...</div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/mood" element={<MoodTuner />} />
        <Route path="/time-travel" element={<TimeTravel />} />
        <Route path="/vibe" element={<VibeTeleporter />} />
        <Route path="/aesthetic" element={<Aesthetic />} />
        <Route path="/alternate" element={<AlternateYou />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
}

