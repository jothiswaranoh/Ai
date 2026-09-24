import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User, ArrowLeft, Home, ShieldCheck } from 'lucide-react';
import { DroneIcon } from '../components/Landing/DroneIcon';

export function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState(2); // Default to operator
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register({
            name,
            email,
            password,
            role_id: roleId
        });

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error || 'Registration failed');
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
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-stone-950/80 to-stone-950" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-stone-950/80" />
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Top Navigation */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-emerald-500/40 text-xs sm:text-sm font-medium transition-all group backdrop-blur-md shadow-lg shadow-black/40"
                >
                    <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                    <Home className="w-3.5 h-3.5 text-stone-400" />
                    <span>Back to Home</span>
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Pilot Registration</span>
                </div>
            </div>

            {/* Form Container */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 shadow-xl shadow-emerald-950/60 border border-emerald-400/30 mb-4">
                        <DroneIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Register Account
                    </h1>
                    <p className="text-sm text-stone-400 mt-1">Join the Shamuga Farm Service Flight Portal</p>
                </div>

                <div className="bg-stone-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-800/90 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/15 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-emerald-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Ramesh Kumar"
                                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-1">
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
                                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a secure password"
                                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">Role</label>
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value={2} className="bg-stone-900 text-white">Operator (Pilot)</option>
                                <option value={1} className="bg-stone-900 text-white">Administrator</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-stone-800 text-center">
                        <Link to="/login" className="inline-flex items-center text-stone-400 hover:text-emerald-400 text-sm font-medium transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Already have an account? Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="relative z-10 w-full text-center py-4 border-t border-stone-900 text-xs text-stone-500">
                <p>© {new Date().getFullYear()} Shamuga Farm Service. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Register;
