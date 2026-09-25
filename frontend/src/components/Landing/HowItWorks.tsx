import { PhoneCall, ClipboardCheck, Plane, CheckCircle2, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Contact Our Team',
      desc: 'Farmer connects via Phone or WhatsApp at 9080369667 with village location, crop type, and field acreage.',
      icon: PhoneCall,
      highlight: 'Quick Response',
    },
    {
      step: '02',
      title: 'Field Assessment',
      desc: 'Our certified agricultural team evaluates crop growth stage, terrain, wind speed, and exact liquid dosage requirements.',
      icon: ClipboardCheck,
      highlight: 'Calibrated Plan',
    },
    {
      step: '03',
      title: 'Drone Spraying Operation',
      desc: 'The commercial spraying drone executes the automated flight path, laying a uniform mist blanket across your entire field.',
      icon: Plane,
      highlight: '~6-8 Mins Per Acre',
    },
    {
      step: '04',
      title: 'Field Completed & Verified',
      desc: 'You inspect the full canopy coverage. Transparent digital billing is issued with zero chemical exposure to you.',
      icon: CheckCircle2,
      highlight: '100% Verified',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-stone-950 relative overflow-hidden border-t border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How Drone Spraying <span className="text-emerald-400">Works in the Field</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            From your first call to a fully treated farm in record time — without the headache of finding and supervising manual labour.
          </p>
        </div>

        {/* 4 Steps Grid with Connection Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-stone-900/70 border border-stone-800 hover:border-emerald-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between group hover:bg-stone-900/90 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-500/30 group-hover:text-emerald-400/80 transition-colors font-mono">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      {item.highlight}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-stone-950 transition-all duration-300 shadow-lg">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center text-xs text-stone-400 group-hover:text-emerald-400 transition-colors">
                  <span>Step {item.step} of 04</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 text-center">
          <a
            href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20am%20interested%20in%20drone%20spraying%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base shadow-xl hover:scale-105 transition-all"
          >
            <span>Connect With Our Team</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
