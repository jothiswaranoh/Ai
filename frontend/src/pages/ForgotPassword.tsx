import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../apis/auth';
import { Mail, ArrowLeft, Home, ShieldCheck } from 'lucide-react';
import { DroneIcon } from '../components/Landing/DroneIcon';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.detail || 'Failed to send reset email');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col justify-between bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500 selection:text-white">
            {/* Background Photography with Agricultural Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-drone.jpg"
                    alt="Agriculture drone background"
                    className="w-full h-full object-cover object-center filter brightness-[0.28] saturate-[1.2]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950/95 via-stone-950/80 to-stone-950" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-stone-950/80" />
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
                    <span>Account Recovery</span>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 shadow-xl shadow-emerald-950/60 border border-emerald-400/30 mb-4">
                        <DroneIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-sm text-stone-400 mt-1">
                        Enter your portal email to receive recovery instructions
                    </p>
                </div>

                <div className="bg-stone-900/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-800/90 p-6 sm:p-8">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium">
                                    {error}
                                </div>
                            )}

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
                                    className="w-full px-4 py-3 bg-stone-950/80 border border-stone-700/80 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-3 rounded-xl">
                                <p className="font-semibold text-sm">Reset link sent!</p>
                                <p className="text-xs mt-1 text-emerald-300/80">Check your inbox for password recovery instructions.</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 pt-5 border-t border-stone-800 text-center">
                        <Link to="/login" className="inline-flex items-center text-stone-400 hover:text-emerald-400 text-sm font-medium transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Login
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

export default ForgotPassword;
