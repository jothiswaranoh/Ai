import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-white">Drone Service Billing</h1>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <div className="text-sm">
                <p className="font-medium text-white">{user?.full_name}</p>
                <p className="text-white/80 capitalize text-xs">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white/10 backdrop-blur-lg rounded-lg mt-2 p-4 border border-white/20">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/20 rounded-lg mb-3">
              <User className="w-4 h-4 text-white" />
              <div>
                <p className="font-medium text-white text-sm">{user?.full_name}</p>
                <p className="text-white/80 capitalize text-xs">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
