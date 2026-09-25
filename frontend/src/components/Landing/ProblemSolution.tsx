import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, Users, Target } from 'lucide-react';

export function ProblemSolution() {
  const problems = [
    {
      title: 'Scarcity of Agricultural Labour',
      desc: 'Finding workers during peak monsoon and pest seasons is unpredictable, leading to missed spraying windows.',
    },
    {
      title: 'Slow & Exhausting Process',
      desc: 'Manual knapsack spraying takes 1.5 to 2 hours per single acre under scorching sun, causing severe physical fatigue.',
    },
    {
      title: 'Direct Toxic Exposure',
      desc: 'Labourers carry chemical tanks on their backs, risking toxic skin absorption and long-term respiratory hazards.',
    },
    {
      title: 'Uneven Chemical Wastage',
      desc: 'Handheld spray lances create uneven large droplets that pool on leaves and wash down to soil, wasting up to 40% chemical.',
    },
    {
      title: 'Water Logged Mud Struggles',
      desc: 'Walking through knee-deep sticky paddy mud or dense sugarcane crops breaks plant stalks and causes crop damage.',
    },
  ];

  const solutions = [
    {
      title: 'Fast Aerial Coverage',
      desc: 'Sprays 1 complete acre in only 6-8 minutes, enabling rapid treatment before pests spread across fields.',
      icon: Clock,
    },
    {
      title: 'Complete Terrain Independence',
      desc: 'Flies effortlessly over submerged paddy mud, dense sugarcane canopy, and high banana plantations.',
      icon: CheckCircle2,
    },
    {
      title: 'Downward Propeller Penetration',
      desc: 'Prop wash creates downward vortex, flipping leaves to coat both top and underside surfaces evenly.',
      icon: Target,
    },
    {
      title: 'Rapid On-Demand Dispatch',
      desc: 'One call or WhatsApp to 9080369667 dispatches our certified drone pilot directly to your field.',
      icon: Users,
    },
    {
      title: 'Zero Chemical Contact',
      desc: 'Farmers and operators stay completely outside the spray zone, preventing harmful pesticide inhalation.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="problem-solution" className="py-24 bg-stone-900 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
            Real Agricultural Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Traditional Manual Spraying vs <span className="text-emerald-400">Smart Drone Spraying</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            See why modern Indian farmers are retiring heavy knapsack sprayers in favor of automated aerial precision.
          </p>
        </div>

        {/* 2-Column Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Old Traditional Way (Problem) */}
          <div className="bg-stone-950/80 border border-red-900/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-500/30 flex items-center justify-center text-red-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Manual Spraying Method</h3>
                    <p className="text-xs text-stone-400">Traditional knapsack sprayer approach</p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30">
                  Outdated
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {problems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
                    <div className="mt-0.5 text-red-400 shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-200">{item.title}</h4>
                      <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800 text-xs text-stone-400 italic text-center">
              Heavy physical strain • Crop damage from walking • High labour cost
            </div>
          </div>

          {/* Right Column: Drone Spraying Method (Solution) */}
          <div className="bg-gradient-to-b from-emerald-950/30 to-stone-950/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-6 border-b border-emerald-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-stone-950 shadow-lg shadow-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Shamuga Agri Drone Spraying</h3>
                    <p className="text-xs text-emerald-300">Modern aerospace farming technology</p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40">
                  Recommended
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {solutions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                      <div className="mt-0.5 p-1 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800/40">
              <a
                href="https://wa.me/919080369667?text=Hello%20Shamuga%20Farm%20Service,%20I%20want%20to%20know%20more%20about%20drone%20spraying."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <span>Contact Us on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
