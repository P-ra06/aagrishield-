import React, { useState } from 'react';
import { X, Shield, User, Lock, MapPin, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FarmerProfile, Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'admin';
  lang: Language;
  onClose: () => void;
  onSuccess: (user: FarmerProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  lang,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode === 'admin' ? 'login' : initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Balarampur');
  const [district, setDistrict] = useState('Balasore');
  const [state, setState] = useState('Odisha');
  const [cropsGrown, setCropsGrown] = useState('Potato, Rice, Tomato');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick 1-click test credentials for Hackathon Judges!
  const handleQuickLogin = async (role: 'farmer' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: role === 'admin' ? 'admin@agrishield.in' : 'rameshwar.farmer@agrishield.in',
          password: 'demo_password_123',
          role_hint: role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login'
      ? { email, password }
      : { name, email, phone, village, district, state, crops_grown: cropsGrown };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication error');
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Sign In to AgriShield' : 'Register Farmer Account'}
          </h2>
          <p className="text-xs text-slate-500">
            Access foliar disease diagnostics and village early warning radar.
          </p>
        </div>

        {/* Quick Demo Credentials Box for Hackathon Reviewers */}
        <div className="mb-5 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs space-y-2">
          <span className="font-bold text-emerald-900 block text-center">
            ⚡ 1-Click Demo Evaluation for Judges:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('farmer')}
              disabled={loading}
              className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Test as Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>Test as Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Pradhan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Village</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="farmer@agrishield.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-emerald-200 cursor-pointer"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Farmer Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
