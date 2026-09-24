import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DroneIcon } from './DroneIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 pt-16 pb-24 md:pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
                <DroneIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Shamuga Farm Service</span>
                <span className="block text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
                  Agricultural Drone Spraying
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              Empowering farmers across India with modern agricultural drone technology. Faster, uniform, and safer crop protection that reduces chemical waste and saves precious time.
            </p>

            <div className="flex flex-col gap-2 pt-2 text-sm">
              <div className="flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Service Coverage: <strong>All Over India</strong> (Tamil Nadu & South India)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Certified DGCA-compliant Flight Operators</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#comparison" className="hover:text-emerald-400 transition-colors">
                  Traditional vs Drone
                </a>
              </li>
              <li>
                <a href="#drone-tech" className="hover:text-emerald-400 transition-colors">
                  3D Drone Specifications
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works (4 Steps)
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-emerald-400 transition-colors">
                  Farmer Economics
                </a>
              </li>
              <li>
                <a href="#crops" className="hover:text-emerald-400 transition-colors">
                  Crops We Spray
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-emerald-400 transition-colors">
                  Why Shamuga Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:9080369667"
                  className="flex items-center gap-2.5 text-stone-200 hover:text-emerald-400 transition-colors group"
                >
                  <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="font-mono font-medium">+91 90803 69667</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20would%20like%20to%20know%20more%20about%20drone%20spraying."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-stone-200 hover:text-emerald-400 transition-colors group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="font-mono font-medium">WhatsApp Booking</span>
                </a>
              </li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-300">
                  Operates 7 Days a Week
                </span>
              </li>
            </ul>
          </div>

          {/* Portal Access for Staff */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company Portal
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Drone pilots and administration dispatch portal for managing farm work orders and billing.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-emerald-500/50 text-xs font-semibold transition-all group"
            >
              <span>Operator & Admin Login</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>
            © {new Date().getFullYear()} <strong>Shamuga Farm Service</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-stone-400">
            <span>Serving farmers across Tamil Nadu & India with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>Smart Sky Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
