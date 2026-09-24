import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Home, ShieldCheck } from 'lucide-react';
import { DroneIcon } from '../components/Landing/DroneIcon';

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else if (result.user?.role === 'operator') {
        navigate('/operator');
      } else {
        navigate('/dashboard'); // fallback
      }
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Photography with Deep Agricultural Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-drone.jpg"
          alt="Agriculture drone background"
          className="w-full h-full object-cover object-center filter brightness-[0.28] saturate-[1.2]"
        />
        {/* Deep emerald and stone gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-stone-950/80 to-stone-950" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-stone-950/80" />

        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Bar with Back to Home Button */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-emerald-500/40 text-xs sm:text-sm font-medium transition-all group backdrop-blur-md shadow-lg shadow-black/40"
          title="Return to Marketing Homepage"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
          <Home className="w-3.5 h-3.5 text-stone-400" />
          <span>Back to Home</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Authorized Personnel Portal</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 shadow-xl shadow-emerald-950/60 border border-emerald-400/30 mb-4">
            <DroneIcon className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shamuga Farm Service
          </h1>
          <p className="text-sm text-emerald-400 font-medium mt-1">
            Operator & Admin Portal
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-stone-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-800/90 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@shamuga.com"
                autoComplete="email"
                className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-stone-400 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors pr-11 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Support Note */}
        <p className="text-center text-xs text-stone-500 mt-6">
          Need access or facing login issues? Contact the admin desk at{' '}
          <a href="tel:9080369667" className="text-stone-400 hover:text-emerald-400 font-mono underline">
            9080369667
          </a>
        </p>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 w-full text-center py-4 border-t border-stone-900 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} Shamuga Farm Service. All rights reserved.</p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
