import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import { DroneIcon } from './DroneIcon';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#problem-solution' },
    { label: 'Technology', href: '#drone-showcase' },
    { label: 'Results', href: '#crop-results' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Crops', href: '#crops' },
    { label: 'Why Us', href: '#why-us' },
  ];

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-8 md:px-12 lg:px-16 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-stone-950/95 backdrop-blur-2xl border border-emerald-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
              : 'bg-stone-900/90 backdrop-blur-xl border border-stone-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Logo Section */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-950 text-white group-hover:scale-105 transition-transform border border-emerald-400/30">
              <DroneIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">
                  SHAMUGA
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold tracking-wider uppercase border border-emerald-500/30">
                  Agri Drone
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium tracking-wide">
                Farm Service • All Over India
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-stone-300 hover:text-emerald-400 transition-colors py-1 relative group tracking-wide"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Direct Phone Call */}
            <a
              href="tel:9080369667"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors text-xs font-semibold border border-stone-800"
              title="Call Drone Specialist"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">9080369667</span>
            </a>

            {/* Neat Clean Login / Dashboard Button */}
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/60 hover:shadow-emerald-900/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/60 hover:shadow-emerald-900/80 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/20"
                title="Portal Login"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs font-bold shadow-sm"
            >
              {user ? (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-stone-800/80 text-stone-300 hover:text-white border border-stone-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 bg-stone-900/95 backdrop-blur-2xl border border-stone-800 rounded-2xl shadow-2xl space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-stone-200 hover:bg-stone-800/80 hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
              <a
                href="tel:9080369667"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-700 font-mono"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call: 9080369667
              </a>
              <Link
                to={user ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all"
              >
                {user ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Login to Portal</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
