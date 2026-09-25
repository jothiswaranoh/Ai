import { useState } from 'react';
import { Cpu, Droplet, Gauge, Wind, BatteryCharging, Phone } from 'lucide-react';

export function DroneShowcase() {
  const [activeCallout, setActiveCallout] = useState(0);

  const features = [
    {
      id: 'nozzle',
      title: 'Centrifugal Atomizing Nozzles',
      desc: 'Generates ultra-fine micron mist droplets ensuring uniform adherence on crop canopy with zero chemical drip wastage.',
      badge: 'Precision Tech',
      icon: Droplet,
    },
    {
      id: 'radar',
      title: 'Terrain-Following Spherical Radar',
      desc: 'Millimeter-wave radar automatically contours over hilly tea, banana, or uneven terraced paddy fields keeping optimal spray height.',
      badge: 'Safety First',
      icon: Gauge,
    },
    {
      id: 'propwash',
      title: 'Aerodynamic Downward Wind Wash',
      desc: 'Powerful propeller downdraft penetrates dense sugarcane and cotton foliage, thoroughly coating underside pest habitats.',
      badge: 'Deep Coverage',
      icon: Wind,
    },
    {
      id: 'battery',
      title: 'Smart Swappable Power Packs',
      desc: 'Quick battery exchange cycle provides continuous non-stop field operation across large agricultural tracts.',
      badge: 'High Endurance',
      icon: BatteryCharging,
    },
    {
      id: 'gps',
      title: 'RTK Sub-Centimeter Autonomous Flight',
      desc: 'Pre-programmed flight paths prevent overlap spraying and ensure not a single square yard of your field is skipped.',
      badge: 'Auto Flight',
      icon: Cpu,
    },
  ];

  return (
    <section id="drone-showcase" className="py-24 bg-stone-950 relative overflow-hidden border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Industrial Grade Aviation
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Advanced Agricultural <span className="text-emerald-400">Drone Specifications</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Commercial-grade agricultural drones engineered for rugged Indian terrain, all weather resilience, and maximum spraying productivity.
          </p>
        </div>

        {/* Interactive 3D Showcase Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Visual Display (Left Side) */}
          <div className="lg:col-span-7 relative group">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-green-500/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-stone-900 shadow-2xl">
              <img
                src="/images/drone-3d.jpg"
                alt="3D Technical rendering of high-capacity agriculture spraying drone"
                className="w-full h-auto object-cover filter contrast-105"
              />

              {/* Status Floating Pill */}
              <div className="absolute top-4 left-4 bg-stone-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">DGCA Standard Compliant</span>
              </div>

              {/* Quick Technical Specs Overlay Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-stone-950/90 backdrop-blur-xl p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Commercial Agri-Spur Rig</h4>
                    <p className="text-xs text-emerald-400">Multiple atomizing nozzles • Wide coverage swath</p>
                  </div>
                </div>
                <a
                  href="tel:9080369667"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Specialist</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Feature List (Right Side) */}
          <div className="lg:col-span-5 space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeCallout === index;
              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveCallout(index)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                      : 'bg-stone-900/50 border-stone-800 hover:bg-stone-900/80 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/40'
                          : 'bg-stone-800 text-emerald-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          {feature.title}
                        </h4>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-800 text-emerald-400 border border-emerald-500/20">
                          {feature.badge}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights Row */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-emerald-950/40 to-stone-900 border border-emerald-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white">Experience precision drone spraying on your crops</h4>
            <p className="text-xs sm:text-sm text-stone-400">
              Our certified operators bring all equipment, batteries, and calibrated drones directly to your farmland.
            </p>
          </div>
          <a
            href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20would%20like%20to%20know%20more%20about%20drone%20spraying."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all"
          >
            Connect With Us
          </a>
        </div>
      </div>
    </section>
  );
}
