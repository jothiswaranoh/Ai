import { LogOut, User, Menu, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';
import { DroneIcon } from '../Landing/DroneIcon';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-stone-950/90 backdrop-blur-xl border-b border-stone-800 shadow-xl relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-950 border border-emerald-400/30">
              <DroneIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                Shamuga Farm Service
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Operator Portal
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center gap-2">
            <Link
              to="/"
              className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
              title="Return to Website"
            >
              <Home className="w-4 h-4 text-emerald-400" />
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-300 hover:bg-stone-800"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Website</span>
            </Link>

            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">{user?.full_name}</p>
                <p className="text-emerald-400 capitalize text-[10px]">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-stone-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-stone-900/95 backdrop-blur-xl rounded-2xl mt-2 p-4 border border-stone-800 shadow-2xl mb-4 space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 bg-stone-950/80 rounded-xl border border-stone-800">
              <User className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="font-semibold text-white text-sm">{user?.full_name}</p>
                <p className="text-emerald-400 capitalize text-xs">{user?.role}</p>
              </div>
            </div>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              View Marketing Website
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
