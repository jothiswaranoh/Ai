import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Menu, X, Plane, Sprout, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: () => void;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Problem vs Drone', href: '#problem-solution' },
    { label: 'Drone Showcase', href: '#drone-showcase' },
    { label: 'Crop Results', href: '#crop-results' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Crops We Serve', href: '#crops' },
    { label: 'Why Choose Us', href: '#why-us' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-950/90 backdrop-blur-xl border-b border-emerald-900/40 py-3 shadow-2xl shadow-emerald-950/20'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform border border-emerald-400/30">
              <Plane className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                  SHAMUGA
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold tracking-wider uppercase border border-emerald-500/30">
                  Agri Drone
                </span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium tracking-wide">
                Farm Service • All Over India
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-stone-300 hover:text-emerald-300 transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone quick link */}
            <a
              href="tel:9080369667"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-stone-200 hover:text-white hover:bg-stone-800/60 transition-colors text-xs font-semibold border border-stone-800"
              title="Call Drone Specialist"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>9080369667</span>
            </a>

            {/* Book Spraying Button */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950 hover:shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              <span>Book Drone Spraying</span>
            </button>

            {/* Staff / Admin Login */}
            <Link
              to="/login"
              className="px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-medium border border-stone-700 transition-colors"
              title="Operator & Admin Login"
            >
              Portal Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-stone-900/80 text-stone-300 border border-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-5 bg-stone-950 border border-emerald-900/50 rounded-2xl shadow-2xl space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-3 pb-3 border-b border-stone-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-300 hover:text-emerald-300 text-sm font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="tel:9080369667"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 text-white text-sm font-semibold border border-stone-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                Call: 9080369667
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg"
              >
                <Sprout className="w-4 h-4" />
                Book Drone Spraying
              </button>
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs border border-stone-800"
              >
                Operator & Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
