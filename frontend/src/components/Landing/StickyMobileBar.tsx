import React from 'react';
import { Phone, MessageSquare, LogIn, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const StickyMobileBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Call button */}
        <a
          href="tel:9080369667"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Call Us</span>
        </a>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20want%20to%20enquire%20about%20drone%20spraying."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 text-xs font-semibold active:scale-95 transition-transform"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        {/* Login button */}
        <Link
          to={user ? "/dashboard" : "/login"}
          className="flex-1.5 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/40 active:scale-95 transition-transform"
        >
          {user ? (
            <>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};
