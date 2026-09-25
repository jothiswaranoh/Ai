import { ArrowRight, Phone, MessageSquare } from 'lucide-react';

export function DroneInAction() {
  return (
    <section className="py-24 bg-stone-900 relative overflow-hidden border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Full Width Visual Storytelling Card */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-stone-950 shadow-2xl">
          {/* Main Background Image */}
          <div className="relative h-[480px] sm:h-[520px] md:h-[580px] w-full">
            <img
              src="/images/farmer-action.jpg"
              alt="Indian farmer watching high-precision agricultural drone spray in Tamil Nadu paddy farmland"
              className="w-full h-full object-cover object-center filter brightness-[0.55]"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />

            {/* In-Picture Text Content */}
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 z-20 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                🌾 Active Morning Spray Session • Tamil Nadu Farmland
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Empowering Indian Farmers With Next-Generation Aviation
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl">
                Our drones fly low over the crop canopy, dispersing micron droplets with aerodynamic downwash so every stalk, leaf, and shoot receives uniform protection — while the farmer rests comfortably on the field embankment.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20want%20to%20know%20more%20about%20field%20spraying%20flights."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="tel:9080369667"
                  className="px-5 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Direct Call: 9080369667</span>
                </a>
              </div>
            </div>

            {/* Floating Live Metric Overlay */}
            <div className="hidden md:block absolute top-8 right-8 bg-stone-950/85 backdrop-blur-md p-5 rounded-2xl border border-stone-800 space-y-3 max-w-xs shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Field Performance Log
              </div>
              <div className="space-y-2 text-xs text-stone-300">
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Target Speed:</span>
                  <span className="font-semibold text-white">4.5 m/s</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Altitude above canopy:</span>
                  <span className="font-semibold text-white">1.8 - 2.2 meters</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1.5">
                  <span className="text-stone-400">Time per acre:</span>
                  <span className="font-semibold text-emerald-400">6.5 Minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Pilot certification:</span>
                  <span className="font-semibold text-white">DGCA Qualified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
