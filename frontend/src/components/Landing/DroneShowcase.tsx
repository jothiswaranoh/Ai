import { useState } from 'react';
import { Target, Compass, BatteryCharging, ShieldAlert, Cpu, Droplet, Layers, CheckCircle } from 'lucide-react';

interface DroneShowcaseProps {
  onOpenBooking: () => void;
}

export function DroneShowcase({ onOpenBooking }: DroneShowcaseProps) {
  const [activeCallout, setActiveCallout] = useState<number>(0);

  const features = [
    {
      id: 0,
      title: 'Large Chemical Spray Tank',
      desc: 'High-capacity fluid container with anti-slosh baffles and quick-fill filtering system for seamless agro-chemical refill.',
      icon: Droplet,
      tag: 'Payload',
      badge: 'Heavy Capacity',
    },
    {
      id: 1,
      title: 'Centrifugal Atomizing Nozzles',
      desc: 'Produces fine, uniform micron mist that blankets crops without large droplet runoff, ensuring maximum leaf absorption.',
      icon: Layers,
      tag: 'Spray Bar',
      badge: 'Micro-Droplets',
    },
    {
      id: 2,
      title: 'GPS-Enabled Autonomous Navigation',
      desc: 'Real-time satellite positioning guides the drone along programmed flight paths, maintaining exact row spacing and speed.',
      icon: Compass,
      tag: 'Avionics',
      badge: 'Centimeter Precision',
    },
    {
      id: 3,
      title: 'Real-Time Obstacle Sensing',
      desc: 'Active radar and sensors detect trees, electric lines, and boundary posts, automatically maintaining safe clearance.',
      icon: ShieldAlert,
      tag: 'Safety Radar',
      badge: '360° Detection',
    },
    {
      id: 4,
      title: 'High-Discharge Smart Batteries',
      desc: 'Engineered for quick swapping in the field, minimizing idle downtime during morning and evening spraying windows.',
      icon: BatteryCharging,
      tag: 'Power System',
      badge: 'Rapid Field Swap',
    },
    {
      id: 5,
      title: 'Downwash Airflow Penetration',
      desc: 'Powerful downward aerodynamic wind from heavy propellers drives the spray mist deep into dense root canopies.',
      icon: Target,
      tag: 'Aerodynamics',
      badge: 'Deep Reach',
    },
  ];

  return (
    <section id="drone-showcase" className="py-24 bg-stone-950 relative overflow-hidden border-t border-b border-stone-800">
      {/* Background Lighting Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Engineered For Agriculture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Commercial Heavy-Duty <span className="text-emerald-400">Spraying Drones</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Built specifically for rugged farm conditions, wide crop canopies, and demanding agricultural spraying operations.
          </p>
        </div>

        {/* 3D Visual & Interactive Callouts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main 3D Drone Product Photography */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-3xl overflow-hidden bg-stone-900/60 border border-emerald-500/30 shadow-2xl p-4 sm:p-6 backdrop-blur-md">
              <img
                src="/images/drone-3d.jpg"
                alt="3D product render of agricultural spraying drone with spray nozzles"
                className="w-full h-auto object-contain max-h-[460px] mx-auto filter drop-shadow-[0_20px_40px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Live Overlay Feature Pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-950/85 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Commercial Agri-Spur Rig</h4>
                    <p className="text-xs text-emerald-400">Multiple atomizing nozzles • Wide coverage swath</p>
                  </div>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Book Field Spray
                </button>
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
          <button
            onClick={onOpenBooking}
            className="flex-shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            Schedule a Drone Visit
          </button>
        </div>
      </div>
    </section>
  );
}
