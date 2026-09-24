import { ArrowRight, Phone, MessageSquare, ShieldCheck, Zap, Droplet, Users, Target, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const handleWhatsApp = () => {
    window.open('https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service%2C%20I%20would%20like%20to%20know%20more%20about%20your%20agriculture%20drone%20spraying%20service.', '_blank');
  };

  const trustBadges = [
    {
      icon: Zap,
      title: 'Faster Coverage',
      desc: '1 Acre in ~6-8 Minutes',
      accent: 'from-amber-400 to-yellow-500',
    },
    {
      icon: Droplet,
      title: 'Less Water Usage',
      desc: 'Saves Up to 90% Water',
      accent: 'from-sky-400 to-blue-500',
    },
    {
      icon: Users,
      title: 'Reduced Labour',
      desc: 'Zero Heavy Knapsack Strain',
      accent: 'from-emerald-400 to-green-500',
    },
    {
      icon: Target,
      title: 'Precision Spraying',
      desc: 'Uniform Canopy Penetration',
      accent: 'from-teal-400 to-emerald-500',
    },
  ];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-stone-950">
      {/* Background Photography with Natural Agricultural Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-drone.jpg"
          alt="Agriculture drone spraying mist over Indian paddy field"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.42] saturate-[1.25]"
        />
        {/* Gradients blending into deep fertile earth & dark green tones */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />

        {/* Subtle animated mist overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-stone-950 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8 animate-fade-in">
            {/* National / Regional Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide">
                🇮🇳 Agriculture Drone Spraying Services • All Over India
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans">
                Smart Farming <br />
                <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-yellow-200 bg-clip-text text-transparent">
                  Starts From the Sky.
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-stone-200 font-medium max-w-3xl leading-relaxed">
                Faster, smarter and more efficient crop spraying with agricultural drones.
              </p>
            </div>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-stone-300/90 max-w-2xl leading-relaxed">
              Advanced agricultural drone spraying services designed to help farmers cover more land, save time, eliminate tedious manual labour, and improve crop protection with uniform micron-droplet precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base shadow-2xl shadow-emerald-950 hover:shadow-emerald-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              >
                <span>Book Drone Spraying</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-emerald-400 font-bold text-base border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-md transition-all shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </button>

              <a
                href="tel:9080369667"
                className="flex items-center justify-center gap-2 text-stone-300 hover:text-white text-sm font-semibold py-2 px-3 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call: 9080369667</span>
              </a>
            </div>

            {/* Key trust bullets */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Crop Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Certified Pilot Operators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Farmer Billing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Callout Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative bg-gradient-to-b from-stone-900/90 to-stone-950/90 p-6 rounded-3xl border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <h4 className="text-white font-bold text-sm">Real Field Operations</h4>
                  <p className="text-emerald-400 text-xs font-medium">Tamil Nadu & All Over India</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Active
                </span>
              </div>

              {/* Drone Thumbnail */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-700/60 aspect-video">
                <img
                  src="/images/farmer-action.jpg"
                  alt="Farmer observing drone spraying"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <p className="text-xs text-white font-medium">
                    🌾 Precision spraying over healthy paddy canopy
                  </p>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="space-y-2.5 text-xs text-stone-300">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="text-stone-400">Spray Speed:</span>
                  <span className="font-bold text-white">~6-8 mins / acre</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="text-stone-400">Water Conservation:</span>
                  <span className="font-bold text-emerald-400">Up to 90% less water</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/40">
                  <span className="text-stone-400">Farmer Chemical Contact:</span>
                  <span className="font-bold text-emerald-400">Zero Direct Contact</span>
                </div>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
              >
                Schedule Spraying For Your Land
              </button>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Horizontal Grid */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-emerald-500/40 transition-all backdrop-blur-md group hover:bg-stone-900/90"
              >
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {badge.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-400 font-medium pl-0.5">
                  {badge.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
