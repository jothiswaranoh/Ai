import { CheckCircle2, Play, Phone, MessageSquare, ArrowRight } from 'lucide-react';

interface DroneInActionProps {
  onOpenBooking: () => void;
}

export function DroneInAction({ onOpenBooking }: DroneInActionProps) {
  return (
    <section className="py-24 bg-stone-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Real Farmland Deployments
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Technology That Works <span className="text-emerald-400">in the Field.</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Witness precision agriculture in action across Tamil Nadu and Indian agricultural belts.
          </p>
        </div>

        {/* Cinematic Feature Card */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-stone-950">
          {/* Main Visual Image */}
          <div className="relative h-[380px] sm:h-[500px] lg:h-[580px] w-full">
            <img
              src="/images/farmer-action.jpg"
              alt="Indian farmer watching drone spraying over lush green paddy fields"
              className="w-full h-full object-cover object-center filter brightness-[0.8] saturate-[1.2]"
            />
            {/* Cinematic Gradient Overlays */}
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
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Request a Field Flight</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:9080369667"
                  className="px-5 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-semibold text-xs sm:text-sm border border-stone-700 backdrop-blur-md transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Pilot: 9080369667</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar Under Image */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-800 bg-stone-950/90 border-t border-stone-800 p-4 sm:p-6 text-center">
            <div className="p-3">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Typical Speed</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">~6-8 Mins</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Per Single Acre</p>
            </div>
            <div className="p-3">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Water Requirement</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">10-12 Litres</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Vs 150-200L Manual</p>
            </div>
            <div className="p-3">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Farmer Safety</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">100% Remote</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Zero Chemical Inhaled</p>
            </div>
            <div className="p-3">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Terrain Limit</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">Zero Limits</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Water, Mud, Tall Stalks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
