import { UserCheck, ShieldCheck, Cpu, MapPin, Receipt, Clock, Phone, Sparkles } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenBooking: () => void;
}

export function WhyChooseUs({ onOpenBooking }: WhyChooseUsProps) {
  const points = [
    {
      title: 'Professional Drone Operators',
      desc: 'Our pilots are trained specifically in agricultural spray patterns, flight altitude control, and chemical handling protocols.',
      icon: UserCheck,
    },
    {
      title: 'Agriculture-First Service',
      desc: 'We are not hobby aerial photographers. Every machine, nozzle, and protocol is 100% dedicated to crop protection and foliar spraying.',
      icon: ShieldCheck,
    },
    {
      title: 'Modern High-Precision Equipment',
      desc: 'We operate heavy-lift agricultural rigs equipped with atomizing nozzles and terrain sensors calibrated for uniform droplet sizes.',
      icon: Cpu,
    },
    {
      title: 'Efficient Field Coverage',
      desc: 'Whether you farm 2 acres or 50 acres, our teams work rapidly to ensure your entire property is sprayed in optimal weather conditions.',
      icon: Clock,
    },
    {
      title: 'Farmer-Friendly Local Support',
      desc: 'Communicate directly in your local language (Tamil & English). We arrive at your field on schedule with all necessary batteries and charging setups.',
      icon: MapPin,
    },
    {
      title: 'Transparent & Honest Pricing',
      desc: 'No hidden fees or unexpected charges. Clear, predictable per-acre service rates with immediate digital billing records.',
      icon: Receipt,
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-stone-950 relative overflow-hidden border-t border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Trust & Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why Farmers Choose <span className="text-emerald-400">Shamuga Farm Service</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            A reliable, farmer-first drone spraying partner dedicated to protecting your harvest and simplifying field operations.
          </p>
        </div>

        {/* 6 Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-3xl bg-stone-900/60 border border-stone-800 hover:border-emerald-500/40 hover:bg-stone-900/90 transition-all duration-300 group shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {point.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-800/80 text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Verified Field Standard
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Area Ribbon */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-stone-900/80 border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">Serving Across Tamil Nadu & All Over India</h4>
              <p className="text-xs sm:text-sm text-stone-400">
                On-call dispatch available for paddy delta belts, sugarcane clusters, cotton tracts, and vegetable farms.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:9080369667"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs sm:text-sm border border-stone-700 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              9080369667
            </a>
            <button
              onClick={onOpenBooking}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Book Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
